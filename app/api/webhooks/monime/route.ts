import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createHmac } from 'crypto';

const MONIME_WEBHOOK_SECRET = process.env.MONIME_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  const expected = createHmac('sha256', MONIME_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  return expected === signature;
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
    const eventType = event.type;

    if (eventType === 'payment.created' || eventType === 'checkout_session.completed') {
      // Extract the reference (our registrationId) from the event
      const reference = event.data?.reference || event.data?.metadata?.registrationId;
      const checkoutSessionId = event.data?.id || event.data?.checkoutSessionId;

      if (!reference && !checkoutSessionId) {
        console.warn('Webhook event missing reference and checkoutSessionId:', eventType);
        return NextResponse.json({ received: true });
      }

      // Update the registration by reference or checkout_session_id
      const updateData = {
        status: 'completed',
        payment_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = reference
        ? await supabaseAdmin.from('workshop_registrations').update(updateData).eq('registration_id', reference)
        : await supabaseAdmin.from('workshop_registrations').update(updateData).eq('checkout_session_id', checkoutSessionId);

      if (error) {
        console.error('Failed to update registration after payment:', error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
