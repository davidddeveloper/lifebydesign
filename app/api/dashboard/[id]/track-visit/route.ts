// app/api/dashboard/[id]/track-visit/route.ts
// Records when a user visits their dashboard
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
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

    // First get current visit count
    const { data: current } = await supabaseAdmin
      .from('audits')
      .select('id, dashboard_visit_count')
      .eq('dashboard_id', id)
      .single();

    // Update the audit with visit information
    const { data, error } = await supabaseAdmin
      .from('audits')
      .update({
        dashboard_visited: true,
        dashboard_visit_count: (current?.dashboard_visit_count || 0) + 1,
        last_dashboard_visit: new Date().toISOString(),
      })
      .eq('dashboard_id', id)
      .select('id, dashboard_visit_count')
      .single();

    if (error) {
      // If columns don't exist, try simpler update
      if (error.code === '42703') {
        console.log('Visit tracking columns not yet added to audits table');
        return NextResponse.json({ success: true, tracked: false });
      }
      console.error('Track visit error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      tracked: true,
      visitCount: data?.dashboard_visit_count || 1,
    });

  } catch (error) {
    console.error('Track visit error:', error);
    // Don't fail the page load if tracking fails
    return NextResponse.json({
      success: true,
      tracked: false,
    });
  }
}
