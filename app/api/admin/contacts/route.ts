// app/api/admin/contacts/route.ts
// Fetches all contacts (audits + workshop registrations) for email management
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface Contact {
  id: string;
  type: "audit" | "workshop";
  name: string;
  email: string;
  phone: string;
  businessName: string;
  industry?: string;
  status: string;
  createdAt: string;
  lastEmailSent?: string;
  emailCount: number;
  dashboardId?: string;
  primaryConstraint?: string;
  primaryScore?: number;
  workshopTitle?: string;
  paymentStatus?: string;
}

export async function GET(request: NextRequest) {
  try {
    const contacts: Contact[] = [];

    // Fetch audits
    const { data: audits, error: auditsError } = await supabaseAdmin
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false });

    if (auditsError) {
      console.error('Error fetching audits:', auditsError);
    } else if (audits) {
      for (const audit of audits) {
        contacts.push({
          id: `audit_${audit.id}`,
          type: 'audit',
          name: audit.owner_name || '',
          email: audit.email || '',
          phone: audit.phone || '',
          businessName: audit.business_name || '',
          industry: audit.industry,
          status: audit.status || 'completed',
          createdAt: audit.created_at,
          lastEmailSent: audit.last_email_sent,
          emailCount: audit.email_count || 0,
          dashboardId: audit.dashboard_id,
          primaryConstraint: audit.primary_constraint,
          primaryScore: audit.primary_score,
        });
      }
    }

    // Fetch workshop registrations
    const { data: workshops, error: workshopsError } = await supabaseAdmin
      .from('workshop_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (workshopsError) {
      console.error('Error fetching workshops:', workshopsError);
    } else if (workshops) {
      for (const workshop of workshops) {
        contacts.push({
          id: `workshop_${workshop.id}`,
          type: 'workshop',
          name: workshop.full_name || `${workshop.first_name || ''} ${workshop.last_name || ''}`.trim(),
          email: workshop.personal_email || workshop.business_email || '',
          phone: workshop.phone || '',
          businessName: workshop.business_name || '',
          industry: undefined,
          status: workshop.status || 'in_progress',
          createdAt: workshop.created_at,
          lastEmailSent: workshop.last_email_sent,
          emailCount: workshop.email_count || 0,
          workshopTitle: workshop.workshop_title,
          paymentStatus: workshop.payment_status,
        });
      }
    }

    // Sort by createdAt descending
    contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      contacts,
      total: contacts.length,
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
