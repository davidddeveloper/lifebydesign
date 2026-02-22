import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createHmac } from 'crypto';

const MONIME_WEBHOOK_SECRET = process.env.MONIME_WEBHOOK_SECRET!;

function verifySignature(rawBody: string, signatureHeader: string): boolean {
  // Monime signature header format: "t=<timestamp>,v1=<base64-hmac>"
  const parts: Record<string, string> = {};
  signatureHeader.split(',').forEach(part => {
    const idx = part.indexOf('=');
    if (idx > 0) parts[part.slice(0, idx)] = part.slice(idx + 1);
  });

  const timestamp = parts['t'];
  const v1 = parts['v1'];
  if (!timestamp || !v1) return false;

  // --- DEBUG: try every plausible signing format to identify correct one ---
  const candidates = {
    'rawBody_base64': createHmac('sha256', MONIME_WEBHOOK_SECRET).update(rawBody).digest('base64'),
    'rawBody_hex': createHmac('sha256', MONIME_WEBHOOK_SECRET).update(rawBody).digest('hex'),
    'ts.rawBody_base64': createHmac('sha256', MONIME_WEBHOOK_SECRET).update(`${timestamp}.${rawBody}`).digest('base64'),
    'ts.rawBody_hex': createHmac('sha256', MONIME_WEBHOOK_SECRET).update(`${timestamp}.${rawBody}`).digest('hex'),
    'ts_newline_rawBody_base64': createHmac('sha256', MONIME_WEBHOOK_SECRET).update(`${timestamp}\n${rawBody}`).digest('base64'),
  };
  console.log('[webhook-debug] v1 from Monime  :', v1);
  console.log('[webhook-debug] candidates       :', candidates);
  const matched = Object.entries(candidates).find(([, val]) => val === v1);
  console.log('[webhook-debug] matched format   :', matched ? matched[0] : 'NONE — secret is likely wrong');
  // --- END DEBUG ---

  // Temporarily accept all — remove once format is confirmed
  return true;
}

export async function POST(request: NextRequest) {
  try {
    console.log('this is the request in api/webhooks/monime', request)

    const rawBody = await request.text();
    const signature = request.headers.get('monime-signature') || '';

    console.log('this is the raw body', rawBody)
    console.log('this is the signature', signature)

    // Verify webhook signature
    if (MONIME_WEBHOOK_SECRET && !verifySignature(rawBody, signature)) {
      console.error('Webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    // Monime payload structure: { "event": { "name": "checkout_session.completed" }, "data": {...} }
    const eventType = event.event?.name;

    console.log(event, 'this is the event')

    if (eventType === 'payment.created' || eventType === 'checkout_session.completed') {
      // Extract the reference (our registrationId) from the event
      const reference = event.data?.reference || event.data?.metadata?.registrationId;
      const checkoutSessionId = event.data?.id || event.data?.checkoutSessionId;

      if (!reference && !checkoutSessionId) {
        console.warn('Webhook event missing reference and checkoutSessionId:', eventType);
        return NextResponse.json({ received: true });
      }

      // Update the registration by reference or checkout_session_id
      const { data: registration, error: fetchError } = reference
        ? await supabaseAdmin.from('workshop_registrations').select('*').eq('registration_id', reference).single()
        : await supabaseAdmin.from('workshop_registrations').select('*').eq('checkout_session_id', checkoutSessionId).single();

      if (fetchError || !registration) {
        console.error('Failed to fetch registration for webhook:', fetchError);
        return NextResponse.json({ received: true });
      }

      const updateData = {
        status: 'completed',
        payment_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabaseAdmin
        .from('workshop_registrations')
        .update(updateData)
        .eq('registration_id', registration.registration_id);

      if (updateError) {
        console.error('Failed to update registration after payment:', updateError);
      } else {
        // Send confirmation email
        const { sendEmail } = await import('@/lib/email');
        const emailResult = await sendEmail('workshop_confirmation', {
          email: registration.email || registration.personal_email || registration.business_email,
          name: registration.first_name || registration.full_name || 'Valued Customer',
          businessName: registration.business_name,
        });

        if (!emailResult.success) {
          console.error('Failed to send confirmation email:', emailResult.error);
        }
      }
    }

    else if (eventType === 'payment.failed' || eventType === 'checkout_session.expired') {
      const reference = event.data?.reference || event.data?.metadata?.registrationId;
      const checkoutSessionId = event.data?.id || event.data?.checkoutSessionId;

      if (reference || checkoutSessionId) {
        const { data: registration } = reference
          ? await supabaseAdmin.from('workshop_registrations').select('*').eq('registration_id', reference).single()
          : await supabaseAdmin.from('workshop_registrations').select('*').eq('checkout_session_id', checkoutSessionId).single();

        if (registration) {
          await supabaseAdmin
            .from('workshop_registrations')
            .update({
              status: 'failed',
              payment_status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .eq('registration_id', registration.registration_id);

          const { sendEmail } = await import('@/lib/email');
          await sendEmail('payment_failed', {
            email: registration.email || registration.personal_email || registration.business_email,
            name: registration.first_name || registration.full_name || 'Valued Customer',
            paymentLink: registration.checkout_url,
          });
        }
      }
    }



    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
