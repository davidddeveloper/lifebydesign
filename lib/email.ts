// lib/email.ts
// Centralized email service using Resend
// The ONLY place emails are sent from (except the initial n8n audit result email)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Startup Bodyshop <hello@mail.startupbodyshop.com>';
const SITE_URL = 'https://startupbodyshop.com';

// ─── Types ────────────────────────────────────────────────────────

export interface EmailRecipient {
  email: string;
  name: string;
  businessName?: string;
  dashboardId?: string;
  primaryConstraint?: string;
  primaryScore?: number;
  registrationId?: string;
  paymentLink?: string;
  workshopTitle?: string;
}

export type TemplateId =
  | 'follow_up_3_days'
  | 'workshop_invite'
  | 'dormant_reactivation'
  | 'workshop_reminder'
  | 'payment_reminder'
  | 'workshop_confirmation'
  | 'payment_failed'
  | 'custom';

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ─── HTML Layout ──────────────────────────────────────────────────

function wrapInLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:#177fc9;padding:24px 32px;text-align:center;">
              <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">Startup Bodyshop</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">Startup Bodyshop &middot; Freetown, Sierra Leone</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                <a href="${SITE_URL}" style="color:#177fc9;text-decoration:none;">startupbodyshop.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, url: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="background:#177fc9;border-radius:8px;padding:14px 28px;">
      <a href="${url}" style="color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;display:inline-block;">${text}</a>
    </td>
  </tr>
</table>`;
}

// ─── Templates ────────────────────────────────────────────────────

function getTemplate(
  templateId: TemplateId,
  recipient: EmailRecipient,
  customData?: { subject?: string; body?: string }
): { subject: string; html: string } {
  const name = recipient.name || 'there';
  const biz = recipient.businessName || 'your business';
  const dashUrl = `${SITE_URL}/dashboard/${recipient.dashboardId}`;
  const constraint = recipient.primaryConstraint || 'your main constraint';

  switch (templateId) {
    // ── Day 3: No dashboard visit ──────────────────────────
    case 'follow_up_3_days':
      return {
        subject: `Have you checked your audit results yet?`,
        html: wrapInLayout(`
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hi ${name},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            3 days ago, you completed your Business Constraint Audit. We identified
            <strong style="color:#177fc9;">${constraint}</strong> as the #1 bottleneck holding back ${biz}.
          </p>
          <p style="margin:0 0 8px;font-size:15px;color:#374151;line-height:1.6;">
            Your personalized recommendations are waiting:
          </p>
          ${ctaButton('View My Results', dashUrl)}
          <p style="margin:0 0 8px;font-size:14px;color:#6b7280;font-weight:600;">What you'll find:</p>
          <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;color:#374151;line-height:1.8;">
            <li>Your scores across all 5 growth levers</li>
            <li>Why this constraint is costing you money</li>
            <li>A quick win you can implement today</li>
          </ul>
          <p style="margin:0;font-size:14px;color:#6b7280;">
            Questions? Reply to this email or
            <a href="https://wa.me/23230600600" style="color:#177fc9;text-decoration:none;">WhatsApp us</a>.
          </p>
        `),
      };

    // ── Day 7: Workshop invitation ─────────────────────────
    case 'workshop_invite':
      return {
        subject: `Ready to break through your constraint, ${name}?`,
        html: wrapInLayout(`
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hi ${name},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            A week ago, we identified <strong style="color:#177fc9;">${constraint}</strong> as the main thing holding back ${biz}.
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            If you're ready to take action, our <strong>Constraint-Breaking Workshop</strong> is designed to help businesses like yours eliminate their #1 bottleneck.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;">
            <tr>
              <td style="padding:20px;">
                <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0c4a6e;">What you'll get:</p>
                <ul style="margin:0;padding-left:20px;font-size:14px;color:#374151;line-height:1.8;">
                  <li>2 days of hands-on training</li>
                  <li>Personalized strategies for YOUR business</li>
                  <li>Direct access to our team</li>
                </ul>
              </td>
            </tr>
          </table>
          ${ctaButton('Learn More About the Workshop', `${SITE_URL}/workshops`)}
          <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">
            Or review your audit results anytime:
            <a href="${dashUrl}" style="color:#177fc9;text-decoration:none;">View Dashboard</a>
          </p>
        `),
      };

    // ── Day 14: Dormant reactivation ───────────────────────
    case 'dormant_reactivation':
      return {
        subject: `${name}, your constraint is still costing you money`,
        html: wrapInLayout(`
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hi ${name},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            It's been a while since your Business Constraint Audit.
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            Your constraint was: <strong style="color:#177fc9;">${constraint}</strong>
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            Every day this goes unfixed, it limits ${biz}'s growth. Ready to take action?
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
            <tr>
              <td style="padding:12px 16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Option 1</p>
                <a href="${dashUrl}" style="font-size:15px;color:#177fc9;text-decoration:none;font-weight:600;">Review your audit results →</a>
              </td>
            </tr>
            <tr><td style="height:8px;"></td></tr>
            <tr>
              <td style="padding:12px 16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Option 2</p>
                <a href="${SITE_URL}/workshops" style="font-size:15px;color:#177fc9;text-decoration:none;font-weight:600;">Join a workshop →</a>
              </td>
            </tr>
            <tr><td style="height:8px;"></td></tr>
            <tr>
              <td style="padding:12px 16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Option 3</p>
                <a href="https://wa.me/23230600600" style="font-size:15px;color:#177fc9;text-decoration:none;font-weight:600;">Chat with us on WhatsApp →</a>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:14px;color:#6b7280;">We're here to help when you're ready.</p>
        `),
      };

    // ── Workshop reminder ──────────────────────────────────
    case 'workshop_reminder':
      return {
        subject: `Workshop starting soon!`,
        html: wrapInLayout(`
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hi ${name},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            Just a reminder — the <strong>Business Constraint-Breaking Workshop</strong> is starting soon!
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            Make sure you've completed your registration and payment to secure your spot.
          </p>
          ${ctaButton('Complete Registration', `${SITE_URL}/workshops`)}
          <p style="margin:0;font-size:14px;color:#6b7280;">See you there!</p>
        `),
      };

    // ── Payment reminder ───────────────────────────────────
    case 'payment_reminder':
      const regId = recipient.registrationId || customData?.body; // flexible fallback
      const resumeLink = regId ? `${SITE_URL}/workshops?resume_registration=${regId}` : `${SITE_URL}/workshops`;
      const reminderTitle = recipient.workshopTitle || 'Business Constraint-Breaking Workshop';
      const isVipReminder = reminderTitle === 'VIP Consultation';
      return {
        subject: isVipReminder ? `Complete your VIP Consultation booking` : `Complete your workshop registration`,
        html: wrapInLayout(`
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hi ${name},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            We noticed you started ${isVipReminder ? 'booking your <strong>VIP Consultation</strong>' : 'registering for our <strong>Business Constraint-Breaking Workshop</strong>'} but haven&apos;t completed payment yet.
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            Your spot is reserved, but we can only hold it for a limited time. Click the button below to resume your payment.
          </p>
          ${ctaButton(isVipReminder ? 'Complete VIP Booking' : 'Resume Payment', resumeLink)}
          <p style="margin:0;font-size:14px;color:#6b7280;">
            Need help? Reply to this email or
            <a href="https://wa.me/23230600600" style="color:#177fc9;text-decoration:none;">WhatsApp us</a>.
          </p>
        `),
      };

    // ── Workshop / VIP Confirmation ────────────────────────
    case 'workshop_confirmation':
      const confirmTitle = recipient.workshopTitle || 'Business Constraint-Breaking Workshop';
      const isVipConfirm = confirmTitle === 'VIP Consultation';
      return {
        subject: isVipConfirm ? `Your VIP Consultation is Confirmed!` : `StartUp Bodyshop Workshop Confirmed!`,
        html: wrapInLayout(`
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hi ${name},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            We have confirmed your payment for the <strong>${confirmTitle}</strong>.
          </p>
          ${isVipConfirm ? `
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            We will reach out shortly to schedule your private 1-on-1 session at a time that works for you.
          </p>
          ` : `
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            We look forward to seeing you there! We will send you more details about the venue and schedule closer to the date.
          </p>
          `}
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            If you have any questions in the meantime, feel free to reply to this email.
          </p>
          ${ctaButton(isVipConfirm ? 'Learn More' : 'View Workshop Details', `${SITE_URL}/workshops`)}
        `),
      };

    // ── Payment Failed ─────────────────────────────────────
    case 'payment_failed':
      const regIdForPaymentFailed = recipient.registrationId || customData?.body;
      const resumeLinkForPaymentFailed = recipient.paymentLink || (regIdForPaymentFailed ? `${SITE_URL}/workshops?resume_registration=${regIdForPaymentFailed}` : `${SITE_URL}/workshops`);
      const failedTitle = recipient.workshopTitle || 'Business Constraint-Breaking Workshop';
      const isVipFailed = failedTitle === 'VIP Consultation';
      return {
        subject: isVipFailed ? `Payment Failed for VIP Consultation` : `Payment Failed for Workshop`,
        html: wrapInLayout(`
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hi ${name},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            We noticed your payment for the <strong>${failedTitle}</strong> was not completed.
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            Your payment failed and we couldn&apos;t process it.
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
            Your spot is reserved, but we can only hold it for a limited time. Click the button below to retry your payment.
          </p>
          ${ctaButton(isVipFailed ? 'Retry VIP Booking' : 'Resume Payment', resumeLinkForPaymentFailed)}
          <p style="margin:0;font-size:14px;color:#6b7280;">
            Need help? Reply to this email or
            <a href="https://wa.me/23230600600" style="color:#177fc9;text-decoration:none;">WhatsApp us</a>.
          </p>
        `),
      };
    // ── Custom email ───────────────────────────────────────
    case 'custom':
      return {
        subject: customData?.subject || 'Message from Startup Bodyshop',
        html: wrapInLayout(`
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hi ${name},</p>
          <div style="font-size:15px;color:#374151;line-height:1.6;white-space:pre-line;">
            ${(customData?.body || '')
            .replace(/{{name}}/g, name)
            .replace(/{{businessName}}/g, biz)
            .replace(/{{dashboardId}}/g, recipient.dashboardId || '')
            .replace(/{{primaryConstraint}}/g, constraint)
            .replace(/{{primaryScore}}/g, String(recipient.primaryScore || ''))
            .replace(/\n/g, '<br>')}
          </div>
        `),
      };
  }
}

// ─── Send Functions ───────────────────────────────────────────────

export async function sendEmail(
  templateId: TemplateId,
  recipient: EmailRecipient,
  customData?: { subject?: string; body?: string },
  attachments?: { filename: string; content: string | Buffer }[],
): Promise<SendResult> {
  try {
    const { subject, html } = getTemplate(templateId, recipient, customData);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipient.email,
      subject,
      html,
      attachments,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendBulkEmails(
  templateId: TemplateId,
  recipients: EmailRecipient[],
  customData?: { subject?: string; body?: string }
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const results = { sent: 0, failed: 0, errors: [] as string[] };

  for (const recipient of recipients) {
    const result = await sendEmail(templateId, recipient, customData);
    if (result.success) {
      results.sent++;
    } else {
      results.failed++;
      results.errors.push(`${recipient.email}: ${result.error}`);
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return results;
}
