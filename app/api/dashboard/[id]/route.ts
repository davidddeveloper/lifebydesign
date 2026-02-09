// app/api/dashboard/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Dashboard ID is required' },
        { status: 400 }
      );
    }

    // Fetch audit by dashboard_id
    const { data: audit, error } = await supabase
      .from('audits')
      .select('*')
      .eq('dashboard_id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Audit not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Transform to match the ResultsPage data format
    const transformedData = {
      business_name: audit.business_name,
      owner_name: audit.owner_name,
      email: audit.email,
      phone: audit.phone,
      industry: audit.industry,
      monthly_revenue: audit.monthly_revenue,
      scores: audit.scores || {
        "WHO (Market)": audit.score_who || 0,
        "WHAT (Offer)": audit.score_what || 0,
        "HOW YOU SELL (Conversion)": audit.score_sell || 0,
        "HOW THEY FIND YOU (Traffic)": audit.score_traffic || 0,
        "HOW YOU DELIVER (Operations)": audit.score_operations || 0,
      },
      final_constraint: audit.primary_constraint,
      primary_score: audit.primary_score,
      confidence: audit.confidence,
      evidence_points: audit.evidence_points || [],
      reasoning: audit.reasoning,
      quick_win: audit.quick_win || {
        action: audit.quick_win_action,
        impact: audit.quick_win_impact,
        time: audit.quick_win_time,
      },
      revenue_impact: audit.revenue_impact || {
        currentMonthly: audit.current_monthly_revenue,
        potentialMonthly: audit.potential_monthly_revenue,
        monthlyOpportunityCost: audit.monthly_opportunity_cost,
        yearlyOpportunityCost: audit.yearly_opportunity_cost,
        explanation: audit.revenue_impact_explanation,
      },
      dashboard_id: audit.dashboard_id,
      created_at: audit.created_at,
    };

    return NextResponse.json({
      success: true,
      data: transformedData,
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit data' },
      { status: 500 }
    );
  }
}
