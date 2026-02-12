// app/api/admin/check-engagement/route.ts
// API for n8n to check user engagement (dashboard visits, email opens, etc.)
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dashboardId = searchParams.get('dashboard_id');
    const email = searchParams.get('email');
    const auditId = searchParams.get('audit_id');

    if (!dashboardId && !email && !auditId) {
      return NextResponse.json(
        { error: 'Provide dashboard_id, email, or audit_id' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabaseAdmin.from('audits').select('*');

    if (dashboardId) {
      query = query.eq('dashboard_id', dashboardId);
    } else if (email) {
      query = query.eq('email', email);
    } else if (auditId) {
      query = query.eq('id', auditId);
    }

    const { data: audit, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: true,
          found: false,
        });
      }
      throw error;
    }

    // Calculate engagement metrics
    const createdAt = new Date(audit.created_at);
    const now = new Date();
    const daysSinceAudit = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const hoursSinceAudit = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));

    const lastVisit = audit.last_dashboard_visit ? new Date(audit.last_dashboard_visit) : null;
    const daysSinceLastVisit = lastVisit
      ? Math.floor((now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    const lastEmailSent = audit.last_email_sent ? new Date(audit.last_email_sent) : null;
    const daysSinceLastEmail = lastEmailSent
      ? Math.floor((now.getTime() - lastEmailSent.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return NextResponse.json({
      success: true,
      found: true,
      engagement: {
        // Basic info
        dashboardId: audit.dashboard_id,
        email: audit.email,
        businessName: audit.business_name,
        ownerName: audit.owner_name,
        primaryConstraint: audit.primary_constraint,
        primaryScore: audit.primary_score,

        // Visit tracking
        hasVisitedDashboard: audit.dashboard_visited || false,
        visitCount: audit.dashboard_visit_count || 0,
        lastVisit: audit.last_dashboard_visit,
        daysSinceLastVisit,

        // Email tracking
        emailCount: audit.email_count || 0,
        lastEmailSent: audit.last_email_sent,
        daysSinceLastEmail,

        // Timing
        createdAt: audit.created_at,
        daysSinceAudit,
        hoursSinceAudit,

        // Suggested actions
        suggestions: getSuggestions({
          hasVisited: audit.dashboard_visited,
          daysSinceAudit,
          daysSinceLastVisit,
          daysSinceLastEmail,
          emailCount: audit.email_count || 0,
        }),
      },
    });

  } catch (error) {
    console.error('Check engagement error:', error);
    return NextResponse.json(
      { error: 'Failed to check engagement' },
      { status: 500 }
    );
  }
}

function getSuggestions(data: {
  hasVisited: boolean;
  daysSinceAudit: number;
  daysSinceLastVisit: number | null;
  daysSinceLastEmail: number | null;
  emailCount: number;
}): string[] {
  const suggestions: string[] = [];

  // No dashboard visit after 3 days
  if (!data.hasVisited && data.daysSinceAudit >= 3) {
    suggestions.push('send_follow_up_3_day');
  }

  // Haven't visited in 7+ days
  if (data.daysSinceLastVisit !== null && data.daysSinceLastVisit >= 7) {
    suggestions.push('send_re_engagement');
  }

  // No emails sent yet (after initial results email)
  if (data.emailCount === 0 && data.daysSinceAudit >= 1) {
    suggestions.push('send_results_email');
  }

  // Ready for workshop invitation (3+ days since audit)
  if (data.daysSinceAudit >= 3) {
    suggestions.push('invite_to_workshop');
  }

  // Dormant user (14+ days, no recent visits)
  if (data.daysSinceAudit >= 14 && (data.daysSinceLastVisit === null || data.daysSinceLastVisit >= 14)) {
    suggestions.push('send_dormant_reactivation');
  }

  return suggestions;
}

// Batch check for multiple users (for n8n scheduled workflows)
export async function POST(request: NextRequest) {
  try {
    const { filter, limit = 50 } = await request.json();

    // Default filter: users who haven't visited dashboard after 3 days
    let query = supabaseAdmin
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Apply filters based on request
    if (filter === 'no_visit_3_days') {
      // Get audits from 3+ days ago that haven't been visited
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      query = query
        .or('dashboard_visited.is.null,dashboard_visited.eq.false')
        .lt('created_at', threeDaysAgo.toISOString());
    } else if (filter === 'no_email_sent') {
      query = query.or('email_count.is.null,email_count.eq.0');
    } else if (filter === 'dormant_14_days') {
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      query = query.lt('last_dashboard_visit', fourteenDaysAgo.toISOString());
    }

    const { data: audits, error } = await query;

    if (error) throw error;

    const results = (audits || []).map(audit => ({
      dashboardId: audit.dashboard_id,
      email: audit.email,
      businessName: audit.business_name,
      ownerName: audit.owner_name,
      primaryConstraint: audit.primary_constraint,
      hasVisited: audit.dashboard_visited || false,
      emailCount: audit.email_count || 0,
      createdAt: audit.created_at,
    }));

    return NextResponse.json({
      success: true,
      filter,
      count: results.length,
      users: results,
    });

  } catch (error) {
    console.error('Batch check engagement error:', error);
    return NextResponse.json(
      { error: 'Failed to check engagement' },
      { status: 500 }
    );
  }
}
