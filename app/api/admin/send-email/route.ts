// app/api/admin/send-email/route.ts
// Sends emails via Resend using centralized email service
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendEmail, type TemplateId, type EmailRecipient } from '@/lib/email';

interface Attachment {
  filename: string;
  content: string; // Base64 content
}

interface SendEmailRequest {
  contactIds: string[];
  templateId: TemplateId;
  customSubject?: string;
  customBody?: string;
  attachments?: Attachment[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SendEmailRequest = await request.json();
    const { contactIds, templateId, customSubject, customBody, attachments } = body;

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

    if (templateId === 'custom' && (!customSubject || !customBody)) {
      return NextResponse.json(
        { error: 'Custom subject and body are required' },
        { status: 400 }
      );
    }

    const results = { sent: 0, failed: 0, errors: [] as string[] };

    for (const contactId of contactIds) {
      try {
        const [type, id] = contactId.split('_');
        let recipient: EmailRecipient | null = null;

        // Fetch contact data
        if (type === 'audit') {
          const { data, error } = await supabaseAdmin
            .from('audits')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          recipient = {
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
          recipient = {
            name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            email: data.personal_email || data.business_email,
            businessName: data.business_name,
            registrationId: data.registration_id,
          };
        }

        if (!recipient || !recipient.email) {
          results.failed++;
          results.errors.push(`Contact ${contactId}: No email address`);
          continue;
        }

        // Send via Resend
        // Process attachments: Convert Base64 string to Buffer
        const processedAttachments = attachments?.map(att => {
          // Remove data:image/png;base64, prefix if present
          const base64Content = att.content.split(',')[1] || att.content;
          return {
            filename: att.filename,
            content: Buffer.from(base64Content, 'base64'),
          };
        });

        const result = await sendEmail(
          templateId,
          recipient,
          templateId === 'custom' ? { subject: customSubject, body: customBody } : undefined,
          processedAttachments
        );

        if (!result.success) {
          results.failed++;
          results.errors.push(`${recipient.email}: ${result.error}`);
          continue;
        }

        // Update email tracking in database
        try {
          const table = type === 'audit' ? 'audits' : 'workshop_registrations';
          const { data: current } = await supabaseAdmin
            .from(table)
            .select('email_count')
            .eq('id', id)
            .single();

          await supabaseAdmin
            .from(table)
            .update({
              email_count: (current?.email_count || 0) + 1,
              last_email_sent: new Date().toISOString(),
            })
            .eq('id', id);
        } catch (updateError) {
          console.error('Error updating email count:', updateError);
        }

        // Log email send
        try {
          await supabaseAdmin.from('email_logs').insert({
            contact_id: contactId,
            contact_type: type,
            email: recipient.email,
            template_id: templateId,
            subject: customSubject || templateId,
            resend_id: result.messageId,
            status: 'sent',
            sent_at: new Date().toISOString(),
          });
        } catch {
          // email_logs table might not exist yet
        }

        results.sent++;

        // Small delay between sends
        if (contactIds.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
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
