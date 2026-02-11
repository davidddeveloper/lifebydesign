// app/api/admin/send-email/route.ts
// Handles sending emails to selected contacts
// Can trigger n8n workflows or send directly via SMTP
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface SendEmailRequest {
  contactIds: string[];
  templateId: string;
  customSubject?: string;
  customBody?: string;
}

// Email templates with content
const emailTemplates: Record<string, { subject: string; body: string }> = {
  audit_results: {
    subject: "Your Business Constraint Audit Results",
    body: `Hi {{name}},

Your Business Constraint Audit is complete!

Your #1 Constraint: {{primaryConstraint}}
Constraint Score: {{primaryScore}}/10

View your full results and recommendations:
https://startupbodyshop.com/dashboard/{{dashboardId}}

Questions? Reply to this email or WhatsApp us at +232 30 600 600.

— The Startup Bodyshop Team`,
  },
  follow_up_3_days: {
    subject: "Have you reviewed your audit results?",
    body: `Hi {{name}},

Just checking in! We sent your Business Constraint Audit results 3 days ago.

Your #1 constraint was identified as: {{primaryConstraint}}

Have you had a chance to review your personalized recommendations?

View your results: https://startupbodyshop.com/dashboard/{{dashboardId}}

If you have any questions about your results or need help implementing the recommendations, reply to this email or message us on WhatsApp.

— The Startup Bodyshop Team`,
  },
  workshop_reminder: {
    subject: "Workshop Starting Soon!",
    body: `Hi {{name}},

This is a reminder that the Business Constraint-Breaking Workshop is starting soon!

Make sure you've completed your registration and payment to secure your spot.

See you there!

— The Startup Bodyshop Team`,
  },
  payment_reminder: {
    subject: "Complete Your Workshop Registration",
    body: `Hi {{name}},

We noticed you started registering for our Business Constraint-Breaking Workshop but haven't completed your payment yet.

Your spot is reserved, but we can only hold it for a limited time.

Complete your registration now to secure your place.

Need help? Reply to this email or WhatsApp us at +232 30 600 600.

— The Startup Bodyshop Team`,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: SendEmailRequest = await request.json();
    const { contactIds, templateId, customSubject, customBody } = body;

    if (!contactIds || contactIds.length === 0) {
      return NextResponse.json(
        { error: 'No contacts selected' },
        { status: 400 }
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { error: 'No template selected' },
        { status: 400 }
      );
    }

    // Get template content
    let subject: string;
    let bodyTemplate: string;

    if (templateId === 'custom') {
      if (!customSubject || !customBody) {
        return NextResponse.json(
          { error: 'Custom subject and body are required' },
          { status: 400 }
        );
      }
      subject = customSubject;
      bodyTemplate = customBody;
    } else {
      const template = emailTemplates[templateId];
      if (!template) {
        return NextResponse.json(
          { error: 'Invalid template' },
          { status: 400 }
        );
      }
      subject = template.subject;
      bodyTemplate = template.body;
    }

    // Process each contact
    const results: { sent: number; failed: number; errors: string[] } = {
      sent: 0,
      failed: 0,
      errors: [],
    };

    for (const contactId of contactIds) {
      try {
        const [type, id] = contactId.split('_');
        let contact: any = null;

        // Fetch contact data
        if (type === 'audit') {
          const { data, error } = await supabaseAdmin
            .from('audits')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          contact = {
            name: data.owner_name,
            email: data.email,
            businessName: data.business_name,
            dashboardId: data.dashboard_id,
            primaryConstraint: data.primary_constraint,
            primaryScore: data.primary_score,
          };
        } else if (type === 'workshop') {
          const { data, error } = await supabaseAdmin
            .from('workshop_registrations')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          contact = {
            name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            email: data.personal_email || data.business_email,
            businessName: data.business_name,
          };
        }

        if (!contact || !contact.email) {
          results.failed++;
          results.errors.push(`Contact ${contactId}: No email address`);
          continue;
        }

        // Replace placeholders in template
        const personalizedBody = bodyTemplate
          .replace(/{{name}}/g, contact.name || 'there')
          .replace(/{{businessName}}/g, contact.businessName || 'your business')
          .replace(/{{email}}/g, contact.email)
          .replace(/{{dashboardId}}/g, contact.dashboardId || '')
          .replace(/{{primaryConstraint}}/g, contact.primaryConstraint || 'your main constraint')
          .replace(/{{primaryScore}}/g, String(contact.primaryScore || ''));

        // Option 1: Send via n8n webhook (recommended)
        if (process.env.N8N_EMAIL_WEBHOOK_URL) {
          const n8nResponse = await fetch(process.env.N8N_EMAIL_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: contact.email,
              subject,
              body: personalizedBody,
              templateId,
              contactId,
              contactType: type,
              contactData: contact,
            }),
          });

          if (!n8nResponse.ok) {
            throw new Error('n8n webhook failed');
          }
        }
        // Option 2: Direct SMTP (fallback/future implementation)
        // else if (process.env.SMTP_HOST) {
        //   await sendEmailViaSMTP({ to: contact.email, subject, body: personalizedBody });
        // }
        else {
          // For now, just log if no email service is configured
          console.log('Email would be sent to:', contact.email);
          console.log('Subject:', subject);
          console.log('Body:', personalizedBody);
        }

        // Update email tracking in database
        try {
          if (type === 'audit') {
            // Get current email count and increment
            const { data: currentAudit } = await supabaseAdmin
              .from('audits')
              .select('email_count')
              .eq('id', id)
              .single();

            await supabaseAdmin
              .from('audits')
              .update({
                email_count: (currentAudit?.email_count || 0) + 1,
                last_email_sent: new Date().toISOString(),
              })
              .eq('id', id);
          } else if (type === 'workshop') {
            const { data: currentWorkshop } = await supabaseAdmin
              .from('workshop_registrations')
              .select('email_count')
              .eq('id', id)
              .single();

            await supabaseAdmin
              .from('workshop_registrations')
              .update({
                email_count: (currentWorkshop?.email_count || 0) + 1,
                last_email_sent: new Date().toISOString(),
              })
              .eq('id', id);
          }
        } catch (updateError) {
          // Non-critical - just log it
          console.error('Error updating email count:', updateError);
        }

        // Log email send (email_logs table might not exist yet)
        try {
          await supabaseAdmin.from('email_logs').insert({
            contact_id: contactId,
            contact_type: type,
            email: contact.email,
            template_id: templateId,
            subject,
            status: 'sent',
            sent_at: new Date().toISOString(),
          });
        } catch {
          // email_logs table doesn't exist - that's ok
        }

        results.sent++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Contact ${contactId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });

  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}
