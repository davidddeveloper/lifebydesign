// app/api/submit-audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sanityWriteClient } from '@/lib/sanity';

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
    
    // 3. Update Supabase with AI results
    const { data: updatedAudit, error: updateError } = await supabaseAdmin
      .from('audits')
      .update({
        // Scores
        score_who: n8nResults.scores['WHO (Market)'],
        score_what: n8nResults.scores['WHAT (Offer)'],
        score_sell: n8nResults.scores['HOW YOU SELL (Conversion)'],
        score_traffic: n8nResults.scores['HOW THEY FIND YOU (Traffic)'],
        score_operations: n8nResults.scores['HOW YOU DELIVER (Operations)'],
        scores: n8nResults.scores,
        
        // Constraint
        primary_constraint: n8nResults.finalConstraint,
        primary_score: n8nResults.primaryScore,
        secondary_constraint: n8nResults.secondaryConstraint,
        secondary_score: n8nResults.secondaryScore,
        
        // AI Analysis
        confidence: n8nResults.confidence,
        reasoning: n8nResults.reasoning,
        evidence_points: n8nResults.evidencePoints,
        
        // Revenue Impact
        current_monthly_revenue: n8nResults.revenueImpact.currentMonthly,
        potential_monthly_revenue: n8nResults.revenueImpact.potentialMonthly,
        monthly_opportunity_cost: n8nResults.revenueImpact.monthlyOpportunityCost,
        yearly_opportunity_cost: n8nResults.revenueImpact.yearlyOpportunityCost,
        revenue_impact_explanation: n8nResults.revenueImpact.explanation,
        revenue_impact: n8nResults.revenueImpact,
        
        // Quick Win
        quick_win_action: n8nResults.quickWin.action,
        quick_win_impact: n8nResults.quickWin.impact,
        quick_win_time: n8nResults.quickWin.time,
        quick_win: n8nResults.quickWin,
        
        // Status
        status: n8nResults.revenueImpact.monthlyOpportunityCost > 10000000 
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

    // 4. Save to Sanity for backend visibility
    try {
      await sanityWriteClient.create({
        _type: 'auditSubmission',

        // Basic Info
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        industry: formData.industry,
        yearsInBusiness: parseInt(formData.yearsInBusiness) || null,
        monthlyRevenue: parseInt(formData.monthlyRevenue) || null,
        numberOfCustomers: parseInt(formData.numberOfCustomers) || null,
        teamSize: parseInt(formData.teamSize) || null,

        // WHO
        idealCustomer: formData.idealCustomer,
        customerTypes: formData.customerTypes,
        newCustomersLastMonth: formData.newCustomersLastMonth,
        conversionRate: formData.conversionRate,
        biggestProblem: formData.biggestProblem,
        turnDownBadFits: formData.turnDownBadFits,

        // WHAT
        mainProblemSolved: formData.mainProblemSolved,
        solution: formData.solution,
        avgTransactionValue: formData.avgTransactionValue,
        pricingVsCompetitors: formData.pricingVsCompetitors,
        customerSatisfaction: formData.customerSatisfaction,
        referralFrequency: formData.referralFrequency,
        proofLevel: formData.proofLevel,

        // SELL
        hasSalesScript: formData.hasSalesScript,
        salesConversations: formData.salesConversations,
        conversionToCustomer: formData.conversionToCustomer,
        timeToClose: formData.timeToClose,
        reasonsNotBuying: formData.reasonsNotBuying,
        followUpSystem: formData.followUpSystem,

        // TRAFFIC
        trafficReferrals: parseInt(formData.trafficReferrals) || 0,
        trafficSocial: parseInt(formData.trafficSocial) || 0,
        trafficAds: parseInt(formData.trafficAds) || 0,
        trafficPartnerships: parseInt(formData.trafficPartnerships) || 0,
        trafficWalkIns: parseInt(formData.trafficWalkIns) || 0,
        trafficOther: parseInt(formData.trafficOther) || 0,
        postingFrequency: formData.postingFrequency,
        weeklyReach: formData.weeklyReach,
        monthlyLeads: formData.monthlyLeads,
        leadPredictability: formData.leadPredictability,
        hasLeadMagnet: formData.hasLeadMagnet,

        // OPERATIONS
        businessWithoutYou: formData.businessWithoutYou,
        writtenProcedures: formData.writtenProcedures,
        repeatPurchases: formData.repeatPurchases,
        hasUpsells: formData.hasUpsells,
        trackNumbers: formData.trackNumbers,
        profitMargin: formData.profitMargin,
        hoursPerWeek: formData.hoursPerWeek,
        timeOnVsIn: formData.timeOnVsIn,

        // FINAL
        topChallenge: formData.topChallenge,
        oneThingToFix: formData.oneThingToFix,
        twelveMonthGoal: formData.twelveMonthGoal,

        // N8N Results
        scores: {
          who: n8nResults.scores['WHO (Market)'],
          what: n8nResults.scores['WHAT (Offer)'],
          sell: n8nResults.scores['HOW YOU SELL (Conversion)'],
          traffic: n8nResults.scores['HOW THEY FIND YOU (Traffic)'],
          operations: n8nResults.scores['HOW YOU DELIVER (Operations)'],
        },
        primaryConstraint: n8nResults.finalConstraint,
        primaryScore: n8nResults.primaryScore,
        secondaryConstraint: n8nResults.secondaryConstraint,
        secondaryScore: n8nResults.secondaryScore,
        confidence: n8nResults.confidence,
        reasoning: n8nResults.reasoning,
        evidencePoints: n8nResults.evidencePoints,

        revenueImpact: {
          currentMonthly: n8nResults.revenueImpact.currentMonthly,
          potentialMonthly: n8nResults.revenueImpact.potentialMonthly,
          monthlyOpportunityCost: n8nResults.revenueImpact.monthlyOpportunityCost,
          yearlyOpportunityCost: n8nResults.revenueImpact.yearlyOpportunityCost,
          explanation: n8nResults.revenueImpact.explanation,
        },

        quickWin: {
          action: n8nResults.quickWin.action,
          impact: n8nResults.quickWin.impact,
          time: n8nResults.quickWin.time,
        },

        // Status & Metadata
        status: n8nResults.revenueImpact.monthlyOpportunityCost > 10000000
          ? 'pending_contact'
          : 'nurturing',
        supabaseId: String(auditData.id),
        dashboardId: auditData.dashboard_id,
        submittedAt: new Date().toISOString(),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        userAgent: request.headers.get('user-agent') || '',
        referralSource: request.headers.get('referer') || '',
      });
    } catch (sanityError) {
      // Log the error but don't fail the whole request
      // The data is already saved in Supabase
      console.error('Sanity save error:', sanityError);
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
