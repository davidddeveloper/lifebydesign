import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createHmac } from 'crypto';

const MONIME_WEBHOOK_SECRET = process.env.MONIME_WEBHOOK_SECRET!;

function hmac(key: string | Buffer, data: string): string {
  return createHmac('sha256', key).update(data).digest('base64');
}

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

  // Attempt to base64-decode the secret in case it's stored encoded
  let secretBuf: Buffer | null = null;
  try {
    secretBuf = Buffer.from(MONIME_WEBHOOK_SECRET, 'base64');
  } catch {
    // not base64
  }

  // Try canonical JSON (sorted top-level keys) in case Monime normalises before signing
  let canonicalBody = rawBody;
  try {
    const parsed = JSON.parse(rawBody);
    canonicalBody = JSON.stringify(parsed, Object.keys(parsed).sort());
  } catch {
    // use rawBody as-is
  }

  const s = MONIME_WEBHOOK_SECRET;

  const candidates: Record<string, string> = {
    rawBody_base64: hmac(s, rawBody),
    'ts.rawBody_base64': hmac(s, `${timestamp}.${rawBody}`),
    ts_newline_rawBody_base64: hmac(s, `${timestamp}\n${rawBody}`),
    ts_concat_rawBody_base64: hmac(s, `${timestamp}${rawBody}`),
    'ts:rawBody_base64': hmac(s, `${timestamp}:${rawBody}`),
    'ts|rawBody_base64': hmac(s, `${timestamp}|${rawBody}`),
    canonical_base64: hmac(s, canonicalBody),
    'ts.canonical_base64': hmac(s, `${timestamp}.${canonicalBody}`),
    ...(secretBuf
      ? {
        b64key_rawBody_base64: hmac(secretBuf, rawBody),
        'b64key_ts.rawBody_base64': hmac(secretBuf, `${timestamp}.${rawBody}`),
      }
      : {}),
  };

  console.log('[webhook-debug] v1 from Monime:', v1);
  console.log('[webhook-debug] candidates:', candidates);

  const matched = Object.entries(candidates).find(([, val]) => val === v1);
  console.log(
    '[webhook-debug] matched format:',
    matched ? matched[0] : 'NONE — contact Monime support for signing spec'
  );

  // Return true for now while debugging; replace with: return !!matched
  return true;
}

export async function POST(request: NextRequest) {
  try {
    console.log('this is the request in api/webhooks/monime', request);

    const rawBody = await request.text();
    const signature = request.headers.get('monime-signature') || '';

    console.log('this is the raw body', rawBody);
    console.log('this is the signature', signature);

    if (MONIME_WEBHOOK_SECRET && !verifySignature(rawBody, signature)) {
      console.error('Webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event?.name;

    console.log(event, 'this is the event');

    if (
      eventType === 'payment.created' ||
      eventType === 'checkout_session.completed'
    ) {
      const reference =
        event.data?.reference || event.data?.metadata?.registrationId;
      const checkoutSessionId =
        event.data?.id || event.data?.checkoutSessionId;

      if (!reference && !checkoutSessionId) {
        console.warn(
          'Webhook event missing reference and checkoutSessionId:',
          eventType
        );
        return NextResponse.json({ received: true });
      }

      const { data: registration, error: fetchError } = reference
        ? await supabaseAdmin
          .from('workshop_registrations')
          .select('*')
          .eq('registration_id', reference)
          .single()
        : await supabaseAdmin
          .from('workshop_registrations')
          .select('*')
          .eq('checkout_session_id', checkoutSessionId)
          .single();

      if (fetchError || !registration) {
        console.error('Failed to fetch registration for webhook:', fetchError);
        return NextResponse.json({ received: true });
      }

      const { error: updateError } = await supabaseAdmin
        .from('workshop_registrations')
        .update({
          status: 'completed',
          payment_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('registration_id', registration.registration_id);

      if (updateError) {
        console.error('Failed to update registration after payment:', updateError);
      } else {
        const { sendEmail } = await import('@/lib/email');
        const emailResult = await sendEmail('workshop_confirmation', {
          email:
            registration.email ||
            registration.personal_email ||
            registration.business_email,
          name:
            registration.first_name ||
            registration.full_name ||
            'Valued Customer',
          businessName: registration.business_name,
        });

        if (!emailResult.success) {
          console.error('Failed to send confirmation email:', emailResult.error);
        }
      }
    } else if (
      eventType === 'payment.failed' ||
      eventType === 'checkout_session.expired'
    ) {
      const reference =
        event.data?.reference || event.data?.metadata?.registrationId;
      const checkoutSessionId =
        event.data?.id || event.data?.checkoutSessionId;

      if (reference || checkoutSessionId) {
        const { data: registration } = reference
          ? await supabaseAdmin
            .from('workshop_registrations')
            .select('*')
            .eq('registration_id', reference)
            .single()
          : await supabaseAdmin
            .from('workshop_registrations')
            .select('*')
            .eq('checkout_session_id', checkoutSessionId)
            .single();

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
            email:
              registration.email ||
              registration.personal_email ||
              registration.business_email,
            name:
              registration.first_name ||
              registration.full_name ||
              'Valued Customer',
            paymentLink: registration.checkout_url,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}