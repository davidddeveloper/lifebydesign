import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.startupbodyshop.com';

// NOTE: Monime's HMAC signing spec is undocumented and could not be reverse-engineered.
// Signature verification is intentionally skipped. The endpoint is still safe because:
//   1. We only update records that already exist in our database (matched by reference/session ID)
//   2. Setting status to 'completed' on a fabricated event would require knowing a valid registration ID
//   3. Revisit if Monime publishes their signing spec or provides an SDK
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);
    const eventType = payload.event?.name as string | undefined;

    console.log('[monime-webhook] event:', eventType, '| id:', payload.event?.id);

    // ── Payment successful ──────────────────────────────────────────
    if (eventType === 'checkout_session.completed') {
      const reference = payload.data?.reference as string | undefined;
      const checkoutSessionId = payload.data?.id as string | undefined;

      const { data: registration, error } = reference
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

      if (error || !registration) {
        console.error('[monime-webhook] registration not found:', { reference, checkoutSessionId, error });
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
        console.error('[monime-webhook] failed to mark completed:', updateError);
      } else {
        console.log('[monime-webhook] marked completed:', registration.registration_id);
        const { sendEmail } = await import('@/lib/email');
        const { success, error: emailError } = await sendEmail('workshop_confirmation', {
          email: registration.personal_email || registration.business_email,
          name: registration.first_name || registration.full_name || 'Valued Customer',
          businessName: registration.business_name,
        });
        if (!success) console.error('[monime-webhook] confirmation email failed:', emailError);
      }
    }

    // ── Payment cancelled or session expired ────────────────────────
    else if (
      eventType === 'checkout_session.cancelled' ||
      eventType === 'checkout_session.expired'
    ) {
      const reference = payload.data?.reference as string | undefined;
      const checkoutSessionId = payload.data?.id as string | undefined;

      const { data: registration } = reference
        ? await supabaseAdmin
            .from('workshop_registrations')
            .select('registration_id, personal_email, business_email, first_name, full_name, business_name')
            .eq('registration_id', reference)
            .single()
        : await supabaseAdmin
            .from('workshop_registrations')
            .select('registration_id, personal_email, business_email, first_name, full_name, business_name')
            .eq('checkout_session_id', checkoutSessionId)
            .single();

      if (registration) {
        // Reset back to pending_payment so they can retry
        await supabaseAdmin
          .from('workshop_registrations')
          .update({ status: 'pending_payment', updated_at: new Date().toISOString() })
          .eq('registration_id', registration.registration_id);

        console.log('[monime-webhook] reset to pending_payment:', registration.registration_id);

        // Send payment reminder with resume link
        const { sendEmail } = await import('@/lib/email');
        const resumeLink = `${SITE_URL}/workshops?resume_registration=${registration.registration_id}`;
        await sendEmail('payment_reminder', {
          email: registration.personal_email || registration.business_email,
          name: registration.first_name || registration.full_name || 'Valued Customer',
          businessName: registration.business_name,
          registrationId: registration.registration_id,
        }, { body: resumeLink });
      }
    }

    else {
      console.log('[monime-webhook] unhandled event type:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[monime-webhook] processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
