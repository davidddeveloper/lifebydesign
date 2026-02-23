import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('audits')
      .select(`
        id,
        business_name,
        owner_name,
        email,
        phone,
        industry,
        monthly_revenue,
        scores,
        primary_constraint,
        primary_score,
        confidence,
        reasoning,
        evidence_points,
        revenue_impact,
        quick_win,
        status,
        dashboard_id,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map snake_case Supabase columns → camelCase shape expected by the admin UI
    const audits = (data ?? []).map((row) => ({
      _id: String(row.id),
      businessName: row.business_name,
      ownerName: row.owner_name,
      email: row.email,
      phone: row.phone,
      industry: row.industry,
      monthlyRevenue: row.monthly_revenue,
      scores: row.scores,
      primaryConstraint: row.primary_constraint,
      primaryScore: row.primary_score,
      confidence: row.confidence,
      reasoning: row.reasoning,
      evidencePoints: row.evidence_points,
      revenueImpact: row.revenue_impact,
      quickWin: row.quick_win,
      status: row.status,
      dashboardId: row.dashboard_id,
      submittedAt: row.created_at,
    }));

    return NextResponse.json({ audits });
  } catch (error) {
    console.error('Error fetching audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}
