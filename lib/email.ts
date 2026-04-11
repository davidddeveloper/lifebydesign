// lib/email.ts
// Centralized email service using Resend
// The ONLY place emails are sent from.
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

// ─── Team Notification ────────────────────────────────────────────

const TEAM_EMAILS = [
  'sjohnson@lbd.sl',
  'dlake@lbd.sl',
  'fkamara@lbd.sl',
  'dconteh@lbd.sl',
];

interface TeamRegistrationData {
  firstName?: string;
  fullName?: string;
  personalEmail?: string;
  businessEmail?: string;
  phone?: string;
  businessName?: string;
  workshopTitle?: string;
  registrationId?: string;
  currentStep?: number;
}

export async function sendTeamNotification(
  event: 'registration_started' | 'payment_not_completed',
  registration: TeamRegistrationData,
): Promise<void> {
  const name = registration.firstName || registration.fullName || 'Unknown';
  const email = registration.personalEmail || registration.businessEmail || '—';
  const phone = registration.phone || '—';
  const biz = registration.businessName || '—';
  const resumeLink = registration.registrationId
    ? `${SITE_URL}/workshops?resume_registration=${registration.registrationId}`
    : `${SITE_URL}/workshops`;

  const infoTable = (rows: [string, string][]) => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      ${rows.map(([label, value], i) => `
        <tr style="${i % 2 === 0 ? 'background:#f9fafb;' : ''}">
          <td style="padding:10px 16px;font-size:13px;color:#6b7280;font-weight:600;width:38%;${i > 0 ? 'border-top:1px solid #e5e7eb;' : ''}">${label}</td>
          <td style="padding:10px 16px;font-size:14px;color:#111827;${i > 0 ? 'border-top:1px solid #e5e7eb;' : ''}">${value}</td>
        </tr>`).join('')}
    </table>`;

  let subject: string;
  let html: string;

  if (event === 'registration_started') {
    subject = `New workshop registration started – ${name}`;
    html = wrapInLayout(`
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#177fc9;text-transform:uppercase;letter-spacing:0.5px;">Team Notification</p>
      <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111827;">New Registration In Progress</p>
      <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
        Someone has started filling in the workshop registration form. They may need a follow-up if they don't complete it.
      </p>
      ${infoTable([
        ['Name', name],
        ['Email', email],
        ['Phone', phone],
        ['Business', biz],
        ['Current Step', `Step ${registration.currentStep || 1} of 3`],
      ])}
      ${ctaButton('View Resume Link', resumeLink)}
      <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">This is an automated notification. No action required unless you want to follow up proactively.</p>
    `);
  } else {
    subject = `Workshop payment not completed – ${name}`;
    html = wrapInLayout(`
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#dc2626;text-transform:uppercase;letter-spacing:0.5px;">Team Notification</p>
      <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111827;">Payment Not Completed</p>
      <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
        A participant filled out the registration form but cancelled or did not complete their payment. Consider reaching out to help them finish.
      </p>
      ${infoTable([
        ['Name', name],
        ['Email', email],
        ['Phone', phone],
        ['Business', biz],
        ['Workshop', registration.workshopTitle || '—'],
      ])}
      ${ctaButton('Send Them Resume Link', resumeLink)}
      <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">A payment reminder has already been sent to the participant automatically.</p>
    `);
  }

  try {
    await resend.batch.send(
      TEAM_EMAILS.map(teamEmail => ({
        from: FROM_EMAIL,
        to: teamEmail,
        subject,
        html,
      }))
    );
    console.log(`[team-notify] sent "${event}" notification to team`);
  } catch (err) {
    console.error('[team-notify] failed to send team notification:', err);
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

// ─── Audit Result Emails ──────────────────────────────────────────

export interface AuditResultEmailData {
  ownerName: string
  businessName: string
  email: string
  primaryConstraint: string
  primaryScore: number
  band: string
  scores: {
    who: number; what: number; traffic: number; sell: number; operations: number
  }
  narrative: {
    whatIsWorking: string
    primaryConstraintNarrative: string
    whatThisCosts: string
    rootCause: string
    nextStep: string
  }
  recommendedCta: 'workshop' | 'vip_consultation' | '90day_programme' | 'scaling'
  auditId: string | null
}

const BAND_COLOUR: Record<string, string> = {
  CRITICAL: '#DC2626',
  WEAK: '#D97706',
  FUNCTIONAL: '#2563EB',
  STRONG: '#16A34A',
}

const CTA_LINKS: Record<string, { label: string; url: string }> = {
  workshop: { label: 'Register for the Workshop', url: `${SITE_URL}/workshops` },
  vip_consultation: { label: 'Book a VIP Consultation', url: `${SITE_URL}/constraint-audit#book` },
  '90day_programme': { label: 'Start the 90-Day Programme', url: `${SITE_URL}/constraint-audit#book` },
  scaling: { label: 'Book a Scaling Conversation', url: `${SITE_URL}/constraint-audit#book` },
}

function scoreBar(label: string, score: number, band: string): string {
  const colour = BAND_COLOUR[band] || '#374151'
  const pct = Math.round((score / 10) * 100)
  return `
    <tr>
      <td style="padding:6px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#374151;width:160px;vertical-align:middle;">${label}</td>
            <td style="vertical-align:middle;padding:0 10px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#e5e7eb;border-radius:4px;height:8px;overflow:hidden;">
                <tr>
                  <td style="background:${colour};width:${pct}%;height:8px;border-radius:4px;"></td>
                  <td></td>
                </tr>
              </table>
            </td>
            <td style="font-size:13px;font-weight:700;color:${colour};width:40px;text-align:right;vertical-align:middle;">${score}/10</td>
          </tr>
        </table>
      </td>
    </tr>`
}

export async function sendAuditResults(
  data: AuditResultEmailData,
  pdfBuffer: Buffer,
): Promise<SendResult> {
  const { ownerName, businessName, email, primaryConstraint, band, scores, narrative, recommendedCta } = data
  const name = ownerName || 'there'
  const biz = businessName || 'your business'
  const constraintColour = BAND_COLOUR[band] || '#DC2626'
  const cta = CTA_LINKS[recommendedCta] || CTA_LINKS['vip_consultation']

  const html = wrapInLayout(`
    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#177fc9;text-transform:uppercase;letter-spacing:0.5px;">Your Diagnostic Report</p>
    <p style="margin:0 0 20px;font-size:20px;font-weight:700;color:#111827;">Hi ${name},</p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
      Your Constraint-Busting Business Audit for <strong>${biz}</strong> is complete. Your full diagnostic report is attached as a PDF — and summarised below.
    </p>

    <!-- Primary Constraint -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;">
      <tr>
        <td style="padding:20px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Your Primary Constraint</p>
          <p style="margin:0;font-size:18px;font-weight:700;color:${constraintColour};">${primaryConstraint}</p>
        </td>
      </tr>
    </table>

    <!-- Scores -->
    <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Your 5 Lever Scores</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#f9fafb;border-radius:8px;padding:16px;">
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${scoreBar('WHO — Market', scores.who, scores.who < 3.5 ? 'CRITICAL' : scores.who < 5.5 ? 'WEAK' : scores.who < 7.5 ? 'FUNCTIONAL' : 'STRONG')}
          ${scoreBar('WHAT — Offer', scores.what, scores.what < 3.5 ? 'CRITICAL' : scores.what < 5.5 ? 'WEAK' : scores.what < 7.5 ? 'FUNCTIONAL' : 'STRONG')}
          ${scoreBar('FIND YOU — Traffic', scores.traffic, scores.traffic < 3.5 ? 'CRITICAL' : scores.traffic < 5.5 ? 'WEAK' : scores.traffic < 7.5 ? 'FUNCTIONAL' : 'STRONG')}
          ${scoreBar('SELL — Conversion', scores.sell, scores.sell < 3.5 ? 'CRITICAL' : scores.sell < 5.5 ? 'WEAK' : scores.sell < 7.5 ? 'FUNCTIONAL' : 'STRONG')}
          ${scoreBar('DELIVER — Operations', scores.operations, scores.operations < 3.5 ? 'CRITICAL' : scores.operations < 5.5 ? 'WEAK' : scores.operations < 7.5 ? 'FUNCTIONAL' : 'STRONG')}
        </table>
      </td></tr>
    </table>

    <!-- Narrative sections -->
    ${[
      { label: 'What Is Working', text: narrative.whatIsWorking },
      { label: 'Your Primary Constraint', text: narrative.primaryConstraintNarrative },
      { label: 'What This Is Costing You', text: narrative.whatThisCosts },
      { label: 'The Root Cause', text: narrative.rootCause },
      { label: 'Your Recommended Next Step', text: narrative.nextStep },
    ].map(s => `
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px;">${s.label}</p>
      <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7;">${s.text}</p>
    `).join('')}

    ${ctaButton(cta.label, cta.url)}
    <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
      Questions? Reply to this email or WhatsApp us at +232 30 600 600.
    </p>
  `)

  try {
    const { data: sent, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your Constraint Audit Results — ${biz}`,
      html,
      attachments: [{
        filename: `Constraint-Audit-${biz.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
        content: pdfBuffer,
      }],
    })
    if (error) return { success: false, error: error.message }
    return { success: true, messageId: sent?.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function sendAuditAdminNotification(
  data: AuditResultEmailData,
): Promise<void> {
  const { ownerName, businessName, email, primaryConstraint, band, scores } = data
  const constraintColour = BAND_COLOUR[band] || '#DC2626'

  const infoTable = (rows: [string, string][]) => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      ${rows.map(([label, value], i) => `
        <tr style="${i % 2 === 0 ? 'background:#f9fafb;' : ''}">
          <td style="padding:10px 16px;font-size:13px;color:#6b7280;font-weight:600;width:38%;${i > 0 ? 'border-top:1px solid #e5e7eb;' : ''}">${label}</td>
          <td style="padding:10px 16px;font-size:14px;color:#111827;${i > 0 ? 'border-top:1px solid #e5e7eb;' : ''}">${value}</td>
        </tr>`).join('')}
    </table>`

  const bandBg: Record<string, string> = {
    CRITICAL: '#fef2f2', WEAK: '#fffbeb', FUNCTIONAL: '#eff6ff', STRONG: '#f0fdf4',
  }

  const html = wrapInLayout(`
    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#177fc9;text-transform:uppercase;letter-spacing:0.5px;">Team Notification</p>
    <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111827;">New Audit Submission</p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
      A new Constraint-Busting Business Audit has been completed and the report sent to the client.
    </p>

    ${infoTable([
      ['Business', businessName || '—'],
      ['Owner', ownerName || '—'],
      ['Email', email || '—'],
    ])}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:${bandBg[band] || '#fef2f2'};border-radius:8px;border:1px solid #e5e7eb;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Primary Constraint Identified</p>
          <p style="margin:0;font-size:17px;font-weight:700;color:${constraintColour};">${primaryConstraint}</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Lever Scores</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      ${[
        ['WHO', scores.who],
        ['WHAT', scores.what],
        ['FIND YOU', scores.traffic],
        ['SELL', scores.sell],
        ['DELIVER', scores.operations],
      ].map(([l, s]) => {
        const sc = s as number
        const b = sc < 3.5 ? 'CRITICAL' : sc < 5.5 ? 'WEAK' : sc < 7.5 ? 'FUNCTIONAL' : 'STRONG'
        return scoreBar(String(l), sc, b)
      }).join('')}
    </table>

    <p style="margin:0;font-size:13px;color:#9ca3af;">Results email and PDF have been sent to the client automatically.</p>
  `)

  try {
    await resend.batch.send(
      TEAM_EMAILS.map(teamEmail => ({
        from: FROM_EMAIL,
        to: teamEmail,
        subject: `New Audit — ${businessName || 'Unknown'} | Constraint: ${primaryConstraint}`,
        html,
      }))
    )
  } catch (err) {
    console.error('[audit-admin-notify] failed:', err)
  }
}

// ─── Booking Emails ───────────────────────────────────────────────────────────

export interface BookingEmailData {
  firstName: string
  lastName: string
  email: string
  phone: string
  bookingDate: string   // YYYY-MM-DD
  bookingTime: string   // HH:MM (24h)
  callMedium: string    // 'in_person' | 'zoom' | 'google_meet' | 'phone_call'
  meetingLink: string | null
  assignedToName: string | null
}

const MEDIUM_LABELS: Record<string, string> = {
  in_person:   'In-Person Consultation',
  zoom:        'Zoom Video Call',
  google_meet: 'Google Meet',
  phone_call:  'Phone Call',
}

function formatTime12(time24: string): string {
  const [h, m] = time24.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function formatDateLong(iso: string): string {
  // iso = YYYY-MM-DD
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export async function sendBookingConfirmation(data: BookingEmailData): Promise<void> {
  const {
    firstName, lastName, email, phone,
    bookingDate, bookingTime, callMedium, meetingLink, assignedToName,
  } = data

  const name = `${firstName} ${lastName}`
  const formattedDate = formatDateLong(bookingDate)
  const formattedTime = `${formatTime12(bookingTime)} (WAT – Sierra Leone time)`
  const mediumLabel   = MEDIUM_LABELS[callMedium] ?? callMedium
  const assignedTo    = assignedToName ?? 'a member of our team'

  const meetingBlock = callMedium === 'in_person'
    ? `<tr>
        <td style="padding:10px 16px;font-size:13px;color:#6b7280;font-weight:600;border-top:1px solid #e5e7eb;width:38%;">Location</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;border-top:1px solid #e5e7eb;">
          62 Dundas Street, Freetown, Sierra Leone<br>
          <a href="https://maps.google.com/?q=62+Dundas+Street+Freetown+Sierra+Leone" style="color:#177fc9;font-size:13px;">Get directions →</a>
        </td>
      </tr>`
    : callMedium === 'phone_call'
    ? `<tr>
        <td style="padding:10px 16px;font-size:13px;color:#6b7280;font-weight:600;border-top:1px solid #e5e7eb;width:38%;">We'll call</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;border-top:1px solid #e5e7eb;">${phone}</td>
      </tr>`
    : meetingLink
    ? `<tr>
        <td style="padding:10px 16px;font-size:13px;color:#6b7280;font-weight:600;border-top:1px solid #e5e7eb;width:38%;">Meeting Link</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;border-top:1px solid #e5e7eb;">
          <a href="${meetingLink}" style="color:#177fc9;">${meetingLink}</a>
        </td>
      </tr>`
    : ''

  const html = wrapInLayout(`
    <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.5px;">✓ Booking Confirmed</p>
    <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#111827;line-height:1.2;">
      Your call is booked,<br>${firstName}!
    </p>

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
      You're all set. <strong>${assignedTo}</strong> from Startup Bodyshop is looking forward to speaking with you.
    </p>

    <!-- Booking summary card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
      <tr style="background:#f9fafb;">
        <td style="padding:10px 16px;font-size:13px;color:#6b7280;font-weight:600;width:38%;">Date</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;font-weight:600;">${formattedDate}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:#6b7280;font-weight:600;border-top:1px solid #e5e7eb;width:38%;">Time</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;border-top:1px solid #e5e7eb;">${formattedTime}</td>
      </tr>
      <tr style="background:#f9fafb;">
        <td style="padding:10px 16px;font-size:13px;color:#6b7280;font-weight:600;border-top:1px solid #e5e7eb;width:38%;">Meeting Type</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;border-top:1px solid #e5e7eb;">${mediumLabel}</td>
      </tr>
      ${meetingBlock}
      <tr style="${callMedium === 'in_person' ? '' : 'background:#f9fafb;'}">
        <td style="padding:10px 16px;font-size:13px;color:#6b7280;font-weight:600;border-top:1px solid #e5e7eb;width:38%;">With</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;border-top:1px solid #e5e7eb;">${assignedTo}</td>
      </tr>
    </table>

    <!-- WhatsApp reminder note -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#166534;">💬 WhatsApp Reminder</p>
          <p style="margin:0;font-size:14px;color:#166534;line-height:1.5;">
            We'll send you a reminder on WhatsApp 24 hours before your call.<br>
            Save our number: <strong>+232 30 600 600</strong>
          </p>
        </td>
      </tr>
    </table>

    <!-- Add to Google Calendar -->
    ${ctaButton('Add to Google Calendar', `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Call with ${assignedTo} — Startup Bodyshop`)}&dates=${bookingDate.replace(/-/g, '')}T${bookingTime.replace(':', '')}00/${bookingDate.replace(/-/g, '')}T${(() => { const [h,m] = bookingTime.split(':').map(Number); const end = h * 60 + m + 30; return `${String(Math.floor(end/60)).padStart(2,'0')}${String(end%60).padStart(2,'0')}` })()}00&ctz=Africa%2FFreetown`)}

    <p style="margin:0 0 8px;font-size:14px;color:#374151;line-height:1.6;">
      Need to reschedule or have questions? Reply to this email or
      <a href="https://wa.me/23230600600" style="color:#177fc9;text-decoration:none;">message us on WhatsApp</a>.
    </p>
    <p style="margin:0;font-size:13px;color:#9ca3af;">See you soon, ${firstName}!</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Confirmed: Your call on ${formattedDate} at ${formatTime12(bookingTime)}`,
      html,
    })
    console.log(`[booking-confirm] sent to ${email}`)
  } catch (err) {
    console.error('[booking-confirm] failed:', err)
    throw err
  }
}

export async function sendBookingTeamNotification(data: BookingEmailData): Promise<void> {
  const {
    firstName, lastName, email, phone,
    bookingDate, bookingTime, callMedium, meetingLink, assignedToName,
  } = data

  const name = `${firstName} ${lastName}`
  const formattedDate = formatDateLong(bookingDate)
  const formattedTime = `${formatTime12(bookingTime)} (WAT)`
  const mediumLabel   = MEDIUM_LABELS[callMedium] ?? callMedium

  const infoRows = [
    ['Client Name',  name],
    ['Email',        email],
    ['Phone',        phone],
    ['Date',         formattedDate],
    ['Time',         formattedTime],
    ['Meeting Type', mediumLabel],
    ...(meetingLink ? [['Meeting Link', meetingLink]] : []),
    ...(assignedToName ? [['Assigned To', assignedToName]] : []),
  ]

  const html = wrapInLayout(`
    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#177fc9;text-transform:uppercase;letter-spacing:0.5px;">Team Notification</p>
    <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#111827;">New Booking Confirmed</p>

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
      A call has been booked through the website. Full details below:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      ${infoRows.map(([label, value], i) => `
        <tr style="${i % 2 === 0 ? 'background:#f9fafb;' : ''}">
          <td style="padding:10px 16px;font-size:13px;color:#6b7280;font-weight:600;width:36%;${i > 0 ? 'border-top:1px solid #e5e7eb;' : ''}">${label}</td>
          <td style="padding:10px 16px;font-size:14px;color:#111827;${i > 0 ? 'border-top:1px solid #e5e7eb;' : ''}">${
            label === 'Meeting Link' && value
              ? `<a href="${value}" style="color:#177fc9;">${value}</a>`
              : String(value)
          }</td>
        </tr>`).join('')}
    </table>

    ${ctaButton('View All Bookings in Admin', `${SITE_URL}/admin/bookings`)}

    <p style="margin:0;font-size:13px;color:#9ca3af;">This notification was sent to all active team members automatically.</p>
  `)

  // Fetch notification team from settings or fall back to default
  let recipients = ['joeabass@lbd.sl', 'sjohnson@lbd.sl', 'fkamara@lbd.sl', 'dlake@lbd.sl']

  try {
    // Try to fetch live team list from DB
    const { createClient } = await import('@supabase/supabase-js')
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const { data: row } = await admin
      .from('booking_settings')
      .select('value')
      .eq('key', 'notification_team')
      .single()

    if (Array.isArray(row?.value)) {
      const active = row.value.filter((m: any) => m.active !== false)
      if (active.length > 0) recipients = active.map((m: any) => m.email)
    }
  } catch { /* use defaults */ }

  try {
    await resend.batch.send(
      recipients.map(to => ({
        from: FROM_EMAIL,
        to,
        subject: `New Booking: ${name} · ${formattedDate} ${formatTime12(bookingTime)}`,
        html,
      }))
    )
    console.log(`[booking-team-notify] sent to ${recipients.join(', ')}`)
  } catch (err) {
    console.error('[booking-team-notify] failed:', err)
    throw err
  }
}
