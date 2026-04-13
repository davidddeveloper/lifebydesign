// app/api/admin/regenerate-narrative/route.ts
// POST { id } — fetches an audits_v2 row, re-runs Claude, saves updated narrative.
// Used by the admin panel when an audit has blank narrative sections.

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import {
  generateAuditNarrative,
  calculateInteractionFlags,
  selectCta,
  getRevenueOpportunityText,
  type AuditNarrativeInput,
} from "@/lib/claude-audit"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    // Fetch the existing row
    const { data: row, error: fetchError } = await supabaseAdmin
      .from("audits_v2")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !row) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 })
    }

    // Rebuild scores object for interaction flags + CTA
    const rawScores = {
      lever1: row.score_who,
      lever2: row.score_what,
      lever3: row.score_traffic,
      lever4: row.score_sell,
      lever5: row.score_operations,
      capacityFlag: row.capacity_flag ?? false,
    }

    const interactionFlags = calculateInteractionFlags(
      rawScores,
      row.primary_constraint,
      {
        q5: row.q5, q7: row.q7, q8: row.q8, q10: row.q10,
        q11: row.q11, q17: row.q17, q19: row.q19, q27: row.q27,
      }
    )

    if (rawScores.capacityFlag) {
      interactionFlags.push(
        "CAPACITY CONSTRAINT: This business is operating at or near full capacity and is not currently onboarding new customers. The constraint is not a market or traffic problem — it is an operational or financial ceiling on capacity to serve."
      )
    }

    const capacityStatus = row.q2a_answer === "A"
      ? "At full capacity — Q2 excluded from Lever 1 scoring"
      : row.q2a_answer === "B" ? "Near capacity — Q2 included"
      : row.q2a_answer === "C" ? "Has capacity — Q2 included"
      : row.q2a_answer === "D" ? "Urgently needs customers — Q2 included"
      : "Not specified — Q2 included"

    const recommendedCta = rawScores.capacityFlag
      ? "vip_consultation"
      : (row.recommended_cta ?? selectCta(rawScores, row.rule_applied ?? 2))

    const revenueOpportunityText = getRevenueOpportunityText(
      row.primary_constraint,
      String(row.monthly_revenue ?? ""),
    )

    const narrativeInput: AuditNarrativeInput = {
      businessName: row.business_name ?? "",
      industry: row.industry ?? "",
      yearsInBusiness: String(row.years_in_business ?? ""),
      monthlyRevenue: String(row.monthly_revenue ?? ""),
      teamSize: String(row.team_size ?? ""),
      revenueTracking: row.revenue_tracking ?? "",
      scores: rawScores,
      bands: {
        lever1: row.band_who ?? "WEAK",
        lever2: row.band_what ?? "WEAK",
        lever3: row.band_traffic ?? "WEAK",
        lever4: row.band_sell ?? "WEAK",
        lever5: row.band_operations ?? "WEAK",
      },
      primaryConstraint: row.primary_constraint ?? "",
      primaryScore: row.primary_score ?? 0,
      secondaryConstraint: row.secondary_constraint ?? null,
      ruleApplied: row.rule_applied ?? 2,
      interactionFlags,
      capacityStatus,
      capacityFlag: rawScores.capacityFlag,
      q4: row.q4 ?? "",
      q12: row.q12 ?? "",
      q22: row.q22 ?? "",
      q28: row.q28 ?? "",
      q29: row.q29 ?? "",
      q30: row.q30 ?? "",
      revenueOpportunityText,
      recommendedCta,
    }

    const narrative = await generateAuditNarrative(narrativeInput)

    // Update the row
    const { error: updateError } = await supabaseAdmin
      .from("audits_v2")
      .update({
        narrative: narrative.fullNarrative,
        narrative_what_working: narrative.whatIsWorking,
        narrative_primary_constraint: narrative.primaryConstraintNarrative,
        narrative_cost: narrative.whatThisCosts,
        narrative_root_cause: narrative.rootCause,
        narrative_next_step: narrative.nextStep,
        revenue_opportunity_text: revenueOpportunityText,
        recommended_cta: recommendedCta,
        status: "scored",
      })
      .eq("id", id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true, narrative }, { status: 200 })
  } catch (err: any) {
    console.error("[regenerate-narrative] error:", err)
    return NextResponse.json({ error: err.message ?? "Failed to regenerate" }, { status: 500 })
  }
}
