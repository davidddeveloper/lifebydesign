// app/api/admin/audits/route.ts
// Unified audit fetch: combines v1 (audits) and v2 (audits_v2) into a single
// normalised list for the admin dashboard. No Sanity dependency.

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// ─── Normalised shape for admin UI ───────────────────────────────────────────
// Both table versions are mapped to this common interface so the admin page
// doesn't need to know which table a row came from.

export interface NormalisedAudit {
  _id: string
  _version: "v1" | "v2"

  // Identity
  businessName: string
  ownerName: string
  email: string
  phone: string
  industry: string
  yearsInBusiness: number | null
  monthlyRevenue: number | null
  numberOfCustomers: number | null
  teamSize: number | null

  // Scores
  scores: {
    who: number | null
    what: number | null
    sell: number | null
    traffic: number | null
    operations: number | null
  }

  // Constraint
  primaryConstraint: string
  primaryScore: number | null
  secondaryConstraint: string | null

  // Narrative / AI output
  reasoning: string | null
  evidencePoints: string[]
  revenueImpact: {
    currentMonthly?: number
    potentialMonthly?: number
    monthlyOpportunityCost?: number
    yearlyOpportunityCost?: number
    explanation?: string
  }
  quickWin: {
    action?: string
    impact?: string
    time?: string
  }

  // Open text (unified field names)
  topChallenge: string | null
  oneThingToFix: string | null
  twelveMonthGoal: string | null
  idealCustomer: string | null
  mainProblemSolved: string | null
  reasonsNotBuying: string | null

  // v2-only enriched fields
  bands?: {
    who: string; what: string; traffic: string; sell: string; operations: string
  }
  narrativeSections?: {
    whatIsWorking: string
    primaryConstraintNarrative: string
    whatThisCosts: string
    rootCause: string
    nextStep: string
  }
  revenueOpportunityText?: string

  // v2-only raw question scores (numeric)
  v2Scores?: {
    q1: number | null; q2: number | null; q3: number | null
    q5: number | null; q6: number | null; q7: number | null; q8: number | null
    q9: number | null; q10: number | null; q11: number | null
    q13: number | null; q14: number | null; q15: number | null
    q16: number | null; q17: number | null
    q18: number | null; q19: number | null; q20: number | null; q21: number | null
    q23: number | null; q24: number | null; q25: number | null
    q26: number | null; q27: number | null
  }

  // Status & meta
  status: string
  dashboardId: string | null
  submittedAt: string
  confidence: number | null
  recommendedCta: string | null
  auditVersion: string
}

// ─── Mapper: v1 (audits) → NormalisedAudit ───────────────────────────────────

function mapV1(row: any): NormalisedAudit {
  const scores = typeof row.scores === "string"
    ? (() => { try { return JSON.parse(row.scores) } catch { return {} } })()
    : (row.scores ?? {})

  const revenueImpact = typeof row.revenue_impact === "string"
    ? (() => { try { return JSON.parse(row.revenue_impact) } catch { return {} } })()
    : (row.revenue_impact ?? {})

  const quickWin = typeof row.quick_win === "string"
    ? (() => { try { return JSON.parse(row.quick_win) } catch { return {} } })()
    : (row.quick_win ?? {})

  const evidencePoints = typeof row.evidence_points === "string"
    ? (() => { try { return JSON.parse(row.evidence_points) } catch { return [] } })()
    : (Array.isArray(row.evidence_points) ? row.evidence_points : [])

  return {
    _id: row.id,
    _version: "v1",
    businessName: row.business_name ?? "",
    ownerName: row.owner_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    industry: row.industry ?? "",
    yearsInBusiness: row.years_in_business ?? null,
    monthlyRevenue: row.monthly_revenue ?? null,
    numberOfCustomers: row.number_of_customers ?? null,
    teamSize: row.team_size ?? null,
    scores: {
      who: row.score_who ?? scores["WHO (Market)"] ?? null,
      what: row.score_what ?? scores["WHAT (Offer)"] ?? null,
      sell: row.score_sell ?? scores["HOW YOU SELL (Conversion)"] ?? null,
      traffic: row.score_traffic ?? scores["HOW THEY FIND YOU (Traffic)"] ?? null,
      operations: row.score_operations ?? scores["HOW YOU DELIVER (Operations)"] ?? null,
    },
    primaryConstraint: row.primary_constraint ?? "—",
    primaryScore: row.primary_score ?? null,
    secondaryConstraint: row.secondary_constraint ?? null,
    reasoning: row.reasoning ?? null,
    evidencePoints,
    revenueImpact: {
      currentMonthly: revenueImpact.currentMonthly ?? row.current_monthly_revenue,
      potentialMonthly: revenueImpact.potentialMonthly ?? row.potential_monthly_revenue,
      monthlyOpportunityCost: revenueImpact.monthlyOpportunityCost ?? row.monthly_opportunity_cost,
      yearlyOpportunityCost: revenueImpact.yearlyOpportunityCost ?? row.yearly_opportunity_cost,
      explanation: revenueImpact.explanation ?? row.revenue_impact_explanation,
    },
    quickWin: {
      action: quickWin.action ?? row.quick_win_action,
      impact: quickWin.impact ?? row.quick_win_impact,
      time: quickWin.time ?? row.quick_win_time,
    },
    topChallenge: row.top_challenge ?? null,
    oneThingToFix: row.one_thing_to_fix ?? null,
    twelveMonthGoal: row.twelve_month_goal ?? null,
    idealCustomer: row.ideal_customer ?? null,
    mainProblemSolved: row.main_problem_solved ?? null,
    reasonsNotBuying: row.reasons_not_buying ?? null,
    status: row.status ?? "pending_contact",
    dashboardId: row.dashboard_id ?? null,
    submittedAt: row.created_at ?? new Date().toISOString(),
    confidence: row.confidence ?? null,
    recommendedCta: null,
    auditVersion: "1.0",
  }
}

// ─── Mapper: v2 (audits_v2) → NormalisedAudit ────────────────────────────────

function mapV2(row: any): NormalisedAudit {
  const flags = Array.isArray(row.interaction_flags) ? row.interaction_flags : []

  return {
    _id: row.id,
    _version: "v2",
    businessName: row.business_name ?? "",
    ownerName: row.owner_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    industry: row.industry ?? "",
    yearsInBusiness: row.years_in_business ?? null,
    monthlyRevenue: row.monthly_revenue ?? null,
    numberOfCustomers: row.number_of_customers ?? null,
    teamSize: row.team_size ?? null,
    scores: {
      who: row.score_who ?? null,
      what: row.score_what ?? null,
      sell: row.score_sell ?? null,
      traffic: row.score_traffic ?? null,
      operations: row.score_operations ?? null,
    },
    primaryConstraint: row.primary_constraint ?? "—",
    primaryScore: row.primary_score ?? null,
    secondaryConstraint: row.secondary_constraint ?? null,
    reasoning: row.narrative ?? null,
    evidencePoints: flags,
    revenueImpact: {
      explanation: row.revenue_opportunity_text ?? undefined,
    },
    bands: {
      who:        row.band_who        ?? "CRITICAL",
      what:       row.band_what       ?? "CRITICAL",
      traffic:    row.band_traffic    ?? "CRITICAL",
      sell:       row.band_sell       ?? "CRITICAL",
      operations: row.band_operations ?? "CRITICAL",
    },
    narrativeSections: {
      whatIsWorking:                row.narrative_what_working         ?? "",
      primaryConstraintNarrative:   row.narrative_primary_constraint   ?? "",
      whatThisCosts:                row.narrative_cost                 ?? "",
      rootCause:                    row.narrative_root_cause           ?? "",
      nextStep:                     row.narrative_next_step            ?? "",
    },
    revenueOpportunityText: row.revenue_opportunity_text ?? "",
    quickWin: {},
    v2Scores: {
      q1:  row.q1  ?? null, q2:  row.q2  ?? null, q3:  row.q3  ?? null,
      q5:  row.q5  ?? null, q6:  row.q6  ?? null, q7:  row.q7  ?? null,
      q8:  row.q8  ?? null, q9:  row.q9  ?? null, q10: row.q10 ?? null, q11: row.q11 ?? null,
      q13: row.q13 ?? null, q14: row.q14 ?? null, q15: row.q15 ?? null,
      q16: row.q16 ?? null, q17: row.q17 ?? null,
      q18: row.q18 ?? null, q19: row.q19 ?? null, q20: row.q20 ?? null, q21: row.q21 ?? null,
      q23: row.q23 ?? null, q24: row.q24 ?? null, q25: row.q25 ?? null,
      q26: row.q26 ?? null, q27: row.q27 ?? null,
    },
    topChallenge: row.q28 ?? null,
    oneThingToFix: row.q29 ?? null,
    twelveMonthGoal: row.q30 ?? null,
    idealCustomer: row.q4 ?? null,
    mainProblemSolved: row.q12 ?? null,
    reasonsNotBuying: row.q22 ?? null,
    status: row.status ?? "scored",
    dashboardId: null,
    submittedAt: row.created_at ?? new Date().toISOString(),
    confidence: null,
    recommendedCta: row.recommended_cta ?? null,
    auditVersion: "3.0",
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const version = searchParams.get("version") // 'v1' | 'v2' | null (both)
    const limit = parseInt(searchParams.get("limit") ?? "200")
    const offset = parseInt(searchParams.get("offset") ?? "0")

    const results: NormalisedAudit[] = []

    // Fetch v1 (legacy audits table)
    if (!version || version === "v1") {
      const { data: v1Rows, error: v1Error } = await supabaseAdmin
        .from("audits")
        .select(`
          id, business_name, owner_name, email, phone, industry,
          years_in_business, monthly_revenue, number_of_customers, team_size,
          ideal_customer, main_problem_solved, reasons_not_buying,
          top_challenge, one_thing_to_fix, twelve_month_goal,
          score_who, score_what, score_sell, score_traffic, score_operations,
          scores, primary_constraint, primary_score, secondary_constraint,
          confidence, reasoning, evidence_points,
          current_monthly_revenue, potential_monthly_revenue,
          monthly_opportunity_cost, yearly_opportunity_cost,
          revenue_impact_explanation, revenue_impact,
          quick_win_action, quick_win_impact, quick_win_time, quick_win,
          status, dashboard_id, created_at
        `)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (v1Error) {
        console.error("[admin/audits] v1 fetch error:", v1Error.message)
      } else {
        results.push(...(v1Rows ?? []).map(mapV1))
      }
    }

    // Fetch v2 (new audits_v2 table)
    if (!version || version === "v2") {
      const { data: v2Rows, error: v2Error } = await supabaseAdmin
        .from("audits_v2")
        .select(`
          id, business_name, owner_name, email, phone, industry,
          years_in_business, monthly_revenue, number_of_customers, team_size,
          q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11,
          q12, q13, q14, q15, q16, q17,
          q18, q19, q20, q21, q22,
          q23, q24, q25, q26, q27, q28, q29, q30,
          score_who, score_what, score_sell, score_traffic, score_operations,
          band_who, band_what, band_traffic, band_sell, band_operations,
          primary_constraint, primary_score, secondary_constraint, secondary_score,
          rule_applied, interaction_flags, recommended_cta,
          narrative, narrative_what_working, narrative_primary_constraint,
          narrative_cost, narrative_root_cause, narrative_next_step,
          revenue_opportunity_text, status, created_at
        `)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (v2Error) {
        // v2 table might not exist yet — non-fatal
        console.error("[admin/audits] v2 fetch error:", v2Error.message)
      } else {
        results.push(...(v2Rows ?? []).map(mapV2))
      }
    }

    // Sort combined list newest-first
    results.sort((a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )

    return NextResponse.json({ audits: results, total: results.length }, { status: 200 })
  } catch (error: any) {
    console.error("[admin/audits] unhandled error:", error)
    return NextResponse.json({ error: "Failed to fetch audits" }, { status: 500 })
  }
}

// ─── PATCH: update status / notes on a record ────────────────────────────────

export async function PATCH(request: NextRequest) {
  try {
    const { id, version, updates } = await request.json()
    if (!id || !updates) return NextResponse.json({ error: "Missing id or updates" }, { status: 400 })

    const table = version === "v2" ? "audits_v2" : "audits"
    const { error } = await supabaseAdmin.from(table).update(updates).eq("id", id)
    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
