// app/api/submit-audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getPayloadClient } from '@/payload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // 1. Save raw form data to Supabase FIRST
    const { data: auditData, error: auditError } = await supabaseAdmin
      .from('audits')
      .insert({
        // Basic Info
        business_name: formData.businessName,
        owner_name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        industry: formData.industry,
        years_in_business: parseInt(formData.yearsInBusiness) || null,
        monthly_revenue: parseInt(formData.monthlyRevenue),
        number_of_customers: parseInt(formData.numberOfCustomers) || null,
        team_size: parseInt(formData.teamSize) || null,

        // WHO
        ideal_customer: formData.idealCustomer,
        customer_types: formData.customerTypes,
        new_customers_last_month: formData.newCustomersLastMonth,
        conversion_rate: formData.conversionRate,
        biggest_problem: formData.biggestProblem,
        turn_down_bad_fits: formData.turnDownBadFits,

        // WHAT
        main_problem_solved: formData.mainProblemSolved,
        solution: formData.solution,
        avg_transaction_value: formData.avgTransactionValue,
        pricing_vs_competitors: formData.pricingVsCompetitors,
        customer_satisfaction: formData.customerSatisfaction,
        referral_frequency: formData.referralFrequency,
        proof_level: formData.proofLevel,

        // SELL
        has_sales_script: formData.hasSalesScript,
        sales_conversations: formData.salesConversations,
        conversion_to_customer: formData.conversionToCustomer,
        time_to_close: formData.timeToClose,
        reasons_not_buying: formData.reasonsNotBuying,
        follow_up_system: formData.followUpSystem,

        // TRAFFIC
        traffic_referrals: parseInt(formData.trafficReferrals) || 0,
        traffic_social: parseInt(formData.trafficSocial) || 0,
        traffic_ads: parseInt(formData.trafficAds) || 0,
        traffic_partnerships: parseInt(formData.trafficPartnerships) || 0,
        traffic_walk_ins: parseInt(formData.trafficWalkIns) || 0,
        traffic_other: parseInt(formData.trafficOther) || 0,
        posting_frequency: formData.postingFrequency,
        weekly_reach: formData.weeklyReach,
        monthly_leads: formData.monthlyLeads,
        lead_predictability: formData.leadPredictability,
        has_lead_magnet: formData.hasLeadMagnet,

        // OPERATIONS
        business_without_you: formData.businessWithoutYou,
        written_procedures: formData.writtenProcedures,
        repeat_purchases: formData.repeatPurchases,
        has_upsells: formData.hasUpsells,
        track_numbers: formData.trackNumbers,
        profit_margin: formData.profitMargin,
        hours_per_week: formData.hoursPerWeek,
        time_on_vs_in: formData.timeOnVsIn,

        // FINAL
        top_challenge: formData.topChallenge,
        one_thing_to_fix: formData.oneThingToFix,
        twelve_month_goal: formData.twelveMonthGoal,

        // Metadata
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
        referral_source: request.headers.get('referer'),
      })
      .select()
      .single();

    if (auditError) {
      console.error('Supabase error:', auditError);
      throw auditError;
    }

    // 2. Send to n8n webhook for AI analysis
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        auditId: auditData.id, // Pass Supabase ID to n8n
        dashboardId: auditData.dashboard_id,
      }),
    });

    const n8nResults = await n8nResponse.json();

    console.log('N8N RESULTS:', JSON.stringify(n8nResults, null, 2));

    // Helper to safely parse JSON strings
    const safeJsonParse = <T>(value: T | string, fallback: T): T => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return fallback;
        }
      }
      return value ?? fallback;
    };

    // Parse n8n fields that might be JSON strings
    const fields = n8nResults.fields || {};
    const parsedScores = safeJsonParse(fields.scores, {});
    const parsedEvidencePoints = safeJsonParse(fields.evidence_points, []);
    const parsedRevenueImpact = safeJsonParse(fields.revenue_impact, {});
    const parsedQuickWin = safeJsonParse(fields.quick_win, {});

    // 3. Update Supabase with AI results
    const { data: updatedAudit, error: updateError } = await supabaseAdmin
      .from('audits')
      .update({
        // Scores
        score_who: parsedScores['WHO (Market)'],
        score_what: parsedScores['WHAT (Offer)'],
        score_sell: parsedScores['HOW YOU SELL (Conversion)'],
        score_traffic: parsedScores['HOW THEY FIND YOU (Traffic)'],
        score_operations: parsedScores['HOW YOU DELIVER (Operations)'],
        scores: parsedScores,

        // Constraint
        primary_constraint: fields.final_constraint,
        primary_score: fields.primary_score,
        secondary_constraint: fields.secondary_constraint,
        secondary_score: fields.secondary_score,

        // AI Analysis
        confidence: fields.confidence,
        reasoning: fields.reasoning,
        evidence_points: parsedEvidencePoints,

        // Revenue Impact
        current_monthly_revenue: parsedRevenueImpact.currentMonthly,
        potential_monthly_revenue: parsedRevenueImpact.potentialMonthly,
        monthly_opportunity_cost: parsedRevenueImpact.monthlyOpportunityCost,
        yearly_opportunity_cost: parsedRevenueImpact.yearlyOpportunityCost,
        revenue_impact_explanation: parsedRevenueImpact.explanation,
        revenue_impact: parsedRevenueImpact,

        // Quick Win
        quick_win_action: parsedQuickWin.action,
        quick_win_impact: parsedQuickWin.impact,
        quick_win_time: parsedQuickWin.time,
        quick_win: parsedQuickWin,

        // Status
        status: (parsedRevenueImpact.monthlyOpportunityCost || 0) > 10000000
          ? 'pending_contact'
          : 'nurturing',
      })
      .eq('id', auditData.id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    // 4. Save to Payload for backend visibility
    try {
      const payload = await getPayloadClient();
      await payload.create({
        collection: 'audit-submissions',
        data: {
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          industry: formData.industry,
          monthlyRevenue: parseInt(formData.monthlyRevenue) || 0,
          scores: {
            who: parsedScores['WHO (Market)'] || 0,
            what: parsedScores['WHAT (Offer)'] || 0,
            sell: parsedScores['HOW YOU SELL (Conversion)'] || 0,
            traffic: parsedScores['HOW THEY FIND YOU (Traffic)'] || 0,
            operations: parsedScores['HOW YOU DELIVER (Operations)'] || 0,
          },
          primaryConstraint: fields.final_constraint || '',
          secondaryConstraint: fields.secondary_constraint || '',
          revenueImpact: {
            currentMonthly: parsedRevenueImpact.currentMonthly || 0,
            potentialMonthly: parsedRevenueImpact.potentialMonthly || 0,
            monthlyOpportunityCost: parsedRevenueImpact.monthlyOpportunityCost || 0,
            yearlyOpportunityCost: parsedRevenueImpact.yearlyOpportunityCost || 0,
          },
          quickWin: {
            action: parsedQuickWin.action || '',
            impact: parsedQuickWin.impact || '',
            time: parsedQuickWin.time || '',
          },
          status: (parsedRevenueImpact.monthlyOpportunityCost || 0) > 10000000
            ? 'pending_contact'
            : 'nurturing',
          supabaseId: String(auditData.id),
          dashboardId: auditData.dashboard_id,
        } as any,
      });
    } catch (payloadError) {
      // Log the error but don't fail the whole request
      // The data is already saved in Supabase
      console.error('Payload save error:', payloadError);
    }

    // 5. Return results to frontend
    return NextResponse.json({
      success: true,
      fields: updatedAudit,
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process audit' },
      { status: 500 }
    );
  }
}
