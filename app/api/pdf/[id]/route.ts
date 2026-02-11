// app/api/pdf/[id]/route.ts
// Server-side PDF generation for n8n email workflows
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generatePDFBlob } from '@/lib/generate-pdf';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'blob'; // 'blob' or 'base64'

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
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Audit not found' },
          { status: 404 }
        );
      }
      console.error('Supabase error:', error);
      throw error;
    }

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Transform data to match PDF component expectations
    const pdfData = {
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

    // Generate PDF using shared utility
    const pdfBlob = await generatePDFBlob(pdfData);

    // Convert to buffer
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());

    // Return based on format
    if (format === 'base64') {
      return NextResponse.json({
        success: true,
        pdf: buffer.toString('base64'),
        filename: `${(audit.business_name || 'Audit').replace(/\s+/g, '-')}-Constraint-Audit.pdf`,
        content_type: 'application/pdf',
      });
    }

    // Default: return as downloadable PDF
    const filename = `${(audit.business_name || 'Audit').replace(/\s+/g, '-')}-Constraint-Audit.pdf`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
