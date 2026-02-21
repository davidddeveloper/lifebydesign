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

  // Signed payload is: "{timestamp}.{rawBody}"
  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = createHmac('sha256', MONIME_WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('base64');
  return expected === v1;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('monime-signature') || '';

    // Verify webhook signature
    if (MONIME_WEBHOOK_SECRET && !verifySignature(rawBody, signature)) {
      console.error('Webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    // Monime payload structure: { "event": { "name": "checkout_session.completed" }, "data": {...} }
    const eventType = event.event?.name;

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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
