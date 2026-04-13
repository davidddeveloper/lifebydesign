// app/api/submit-audit-v2/route.ts
// Full pipeline for v3 Constraint Audit submission:
//  1. Deterministic scoring
//  2. INSERT to audits_v2 immediately
//  3. Claude narrative generation
//  4. UPDATE DB with narrative
//  5. Generate PDF
//  6. Send emails (user + admin) in parallel
//  7. Return full result to frontend

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import {
  generateAuditNarrative,
  calculateInteractionFlags,
  selectCta,
  getRevenueOpportunityText,
  type AuditNarrativeInput,
} from "@/lib/claude-audit"
import {
  sendAuditResults,
  sendAuditAdminNotification,
  type AuditResultEmailData,
} from "@/lib/email"
import { pdf } from "@react-pdf/renderer"
import { AuditResultsPDFV2, type AuditPDFData } from "@/components/AuditResultsPDFV2"
import React from "react"

// ─────────────────────────────────────────────
// Deterministic scoring
// ─────────────────────────────────────────────

function scoreLevers(d: any) {
  // Normalise Q26: "0a" and "0b" are distinct UI tokens that both score 0
  if (d.q26 === "0a" || d.q26 === "0b") d = { ...d, q26: 0 }

  const n = (v: any): number => (typeof v === "number" ? v : 0)

  // NOTE: All answer option values in the form already encode the weight multiplier.
  // e.g. Q2 options are 2,4,6,8 (×2 already applied), Q7 options are 1.5,3,4.5,6 (×1.5 already applied).
  // The denominators reflect these pre-weighted maxima. Do NOT re-apply multipliers here.

  // Capacity flag: when Q2a = 'A', Q2 was hidden and excluded from Lever 1 scoring.
  const capacityFlag = d.capacityFlag === true || d.q2a === "A"

  // Lever 1 — WHO
  // Standard  (Q2 answered): max = Q1(4) + Q2(8) + Q3(4) = 16
  // Capacity  (Q2 excluded): max = Q1(4) + Q3(4) = 8
  const lever1 = capacityFlag
    ? parseFloat(((n(d.q1) + n(d.q3)) / 8 * 10).toFixed(1))
    : parseFloat(((n(d.q1) + n(d.q2) + n(d.q3)) / 16 * 10).toFixed(1))

  // Lever 2 — WHAT: max = Q5(4)+Q6(5)+Q7(6)+Q8(8)+Q9(5)+Q10(8)+Q11(4) = 40
  const lever2 = parseFloat((
    (n(d.q5) + n(d.q6) + n(d.q7) + n(d.q8) + n(d.q9) + n(d.q10) + n(d.q11))
    / 40 * 10
  ).toFixed(1))

  // Lever 3 — FIND YOU: max = Q13(4)+Q14(6)+Q15(10)+Q16(4)+Q17(4) = 28
  const lever3 = parseFloat((
    (n(d.q13) + n(d.q14) + n(d.q15) + n(d.q16) + n(d.q17))
    / 28 * 10
  ).toFixed(1))

  // Lever 4 — SELL: max = Q18(6)+Q19(8)+Q20(4)+Q21(8) = 26
  const lever4 = parseFloat((
    (n(d.q18) + n(d.q19) + n(d.q20) + n(d.q21))
    / 26 * 10
  ).toFixed(1))

  // Lever 5 — DELIVER: max = Q23(4)+Q24(4)+Q25(8)+Q26(8)+Q27(6) = 30
  const lever5 = parseFloat((
    (n(d.q23) + n(d.q24) + n(d.q25) + n(d.q26) + n(d.q27))
    / 30 * 10
  ).toFixed(1))

  return { lever1, lever2, lever3, lever4, lever5, capacityFlag }
}

function statusBand(score: number): string {
  if (score < 3.5) return "CRITICAL"
  if (score < 5.5) return "WEAK"
  if (score < 7.5) return "FUNCTIONAL"
  return "STRONG"
}

const LEVER_DISPLAY: Record<string, string> = {
  lever1: "WHO (Market)",
  lever2: "WHAT (Offer)",
  lever3: "HOW THEY FIND YOU (Traffic)",
  lever4: "HOW YOU SELL (Conversion)",
  lever5: "HOW YOU DELIVER (Operations)",
}

function identifyConstraint(scores: Record<string, number>): {
  primary: string; primaryScore: number
  secondary: string | null; secondaryScore: number | null
  ruleApplied: number
} {
  const entries = Object.entries(scores).map(([k, v]) => ({ key: k, name: LEVER_DISPLAY[k], score: v }))
  const sorted = [...entries].sort((a, b) => a.score - b.score)

  // Rule 1: any lever below 3.5
  const critical = sorted.filter(e => e.score < 3.5)
  if (critical.length > 0) return {
    primary: critical[0].name, primaryScore: critical[0].score,
    secondary: critical.length > 1 ? critical[1].name : null,
    secondaryScore: critical.length > 1 ? critical[1].score : null,
    ruleApplied: 1,
  }

  // Rule 2: gap of 1.5+ to next lowest
  if (sorted[1].score - sorted[0].score >= 1.5) return {
    primary: sorted[0].name, primaryScore: sorted[0].score,
    secondary: null, secondaryScore: null, ruleApplied: 2,
  }

  // Rule 3: two lowest within 0.8, both 3.5–5.5
  if (
    sorted[1].score - sorted[0].score <= 0.8 &&
    sorted[0].score >= 3.5 && sorted[0].score <= 5.5 &&
    sorted[1].score >= 3.5 && sorted[1].score <= 5.5
  ) return {
    primary: sorted[0].name, primaryScore: sorted[0].score,
    secondary: sorted[1].name, secondaryScore: sorted[1].score, ruleApplied: 3,
  }

  // Rule 4: all 4.0–6.5, no single bottleneck
  if (entries.every(e => e.score >= 4.0 && e.score <= 6.5) &&
    sorted[sorted.length - 1].score - sorted[0].score < 1.5) return {
      primary: "ALL LEVERS (Broad Weakness)", primaryScore: sorted[0].score,
      secondary: null, secondaryScore: null, ruleApplied: 4,
    }

  // Rule 5: all above 6.5
  if (sorted[0].score >= 6.5) return {
    primary: "STRONG BUSINESS (Scale)", primaryScore: sorted[0].score,
    secondary: null, secondaryScore: null, ruleApplied: 5,
  }

  // Default
  return {
    primary: sorted[0].name, primaryScore: sorted[0].score,
    secondary: null, secondaryScore: null, ruleApplied: 2,
  }
}

// ─────────────────────────────────────────────
// POST handler
// ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // ── 1. Score ──────────────────────────────────────────────────
    const rawScores = scoreLevers(body)
    const { capacityFlag, ...leverScores } = rawScores
    const constraint = identifyConstraint(leverScores)

    const bands = {
      lever1: statusBand(rawScores.lever1),
      lever2: statusBand(rawScores.lever2),
      lever3: statusBand(rawScores.lever3),
      lever4: statusBand(rawScores.lever4),
      lever5: statusBand(rawScores.lever5),
    }

    const interactionFlags = calculateInteractionFlags(
      rawScores,
      constraint.primary,
      {
        q5: body.q5, q7: body.q7, q8: body.q8, q10: body.q10,
        q11: body.q11, q17: body.q17, q19: body.q19, q27: body.q27,
      }
    )

    // Capacity constraint flag — added to interaction flags for AI narrative
    if (capacityFlag) {
      interactionFlags.push(
        "CAPACITY CONSTRAINT: This business is operating at or near full capacity and is not currently onboarding new customers. The constraint is not a market or traffic problem — it is an operational or financial ceiling on capacity to serve. Do not diagnose WHO or FIND YOU as the primary constraint on the basis of low new customer acquisition alone."
      )
    }

    // Capacity forces VIP Consultation CTA (per spec)
    const recommendedCta = capacityFlag ? "vip_consultation" : selectCta(rawScores, constraint.ruleApplied)
    const revenueOpportunityText = getRevenueOpportunityText(constraint.primary, body.monthlyRevenue)

    // Capacity status string for AI context
    const capacityStatus = body.q2a === "A"
      ? "At full capacity — Q2 excluded from Lever 1 scoring"
      : body.q2a === "B"
      ? "Near capacity — Q2 included"
      : body.q2a === "C"
      ? "Has capacity — Q2 included"
      : body.q2a === "D"
      ? "Urgently needs customers — Q2 included"
      : "Not specified — Q2 included"

    // ── 2. Save scores immediately ────────────────────────────────
    const { data: saved, error: saveError } = await supabaseAdmin
      .from("audits_v2")
      .insert({
        business_name: body.businessName,
        owner_name: body.ownerName,
        email: body.email,
        phone: body.phone,
        industry: body.industry,
        years_in_business: parseInt(body.yearsInBusiness) || null,
        monthly_revenue: parseFloat(body.monthlyRevenue) || null,
        number_of_customers: parseInt(body.numberOfCustomers) || null,
        team_size: parseInt(body.teamSize) || null,
        revenue_tracking: body.revenueTracking,
        // Capacity amendment
        q2a_answer: body.q2a ?? null,
        capacity_flag: capacityFlag,
        // Scored answers
        q1: body.q1, q2: capacityFlag ? null : (body.q2 ?? null), q3: body.q3,
        q5: body.q5, q6: body.q6, q7: body.q7, q8: body.q8,
        q9: body.q9, q10: body.q10, q11: body.q11,
        q13: body.q13, q14: body.q14, q15: body.q15,
        q16: body.q16, q17: body.q17,
        q18: body.q18, q19: body.q19, q20: body.q20, q21: body.q21,
        q23: body.q23, q24: body.q24, q25: body.q25,
        q26: (body.q26 === "0a" || body.q26 === "0b") ? 0 : body.q26,
        q27: body.q27,
        // Open text
        q4: body.q4, q12: body.q12, q22: body.q22,
        q28: body.q28, q29: body.q29, q30: body.q30,
        // Scores
        score_who: rawScores.lever1, score_what: rawScores.lever2,
        score_traffic: rawScores.lever3, score_sell: rawScores.lever4,
        score_operations: rawScores.lever5,
        band_who: bands.lever1, band_what: bands.lever2,
        band_traffic: bands.lever3, band_sell: bands.lever4,
        band_operations: bands.lever5,
        primary_constraint: constraint.primary,
        primary_score: constraint.primaryScore,
        secondary_constraint: constraint.secondary,
        secondary_score: constraint.secondaryScore,
        rule_applied: constraint.ruleApplied,
        interaction_flags: interactionFlags,
        recommended_cta: recommendedCta,
        status: "scored",
        audit_version: "3.0",
        ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
        user_agent: request.headers.get("user-agent"),
      })
      .select()
      .single()

    if (saveError) {
      // Non-fatal if table doesn't exist yet — log and continue
      console.error("[audit-v2] DB insert error:", saveError.message)
    }

    const auditId = saved?.id || null

    // ── 3. Claude narrative ───────────────────────────────────────
    let narrative = {
      whatIsWorking: "",
      primaryConstraintNarrative: "",
      whatThisCosts: "",
      rootCause: "",
      nextStep: "",
      fullNarrative: "",
    }

    const narrativeInput: AuditNarrativeInput = {
      businessName: body.businessName || "",
      industry: body.industry || "",
      yearsInBusiness: body.yearsInBusiness || "",
      monthlyRevenue: body.monthlyRevenue || "",
      teamSize: body.teamSize || "",
      revenueTracking: body.revenueTracking || "",
      scores: rawScores,
      bands,
      primaryConstraint: constraint.primary,
      primaryScore: constraint.primaryScore,
      secondaryConstraint: constraint.secondary,
      ruleApplied: constraint.ruleApplied,
      interactionFlags,
      capacityStatus,
      capacityFlag,
      q4: body.q4 || "", q12: body.q12 || "", q22: body.q22 || "",
      q28: body.q28 || "", q29: body.q29 || "", q30: body.q30 || "",
      revenueOpportunityText,
      recommendedCta,
    }

    try {
      narrative = await generateAuditNarrative(narrativeInput)
    } catch (claudeError) {
      console.error("[audit-v2] Claude error:", claudeError)
      // Continue without narrative — results are still useful
    }

    // ── 4. Update DB with narrative ───────────────────────────────
    if (auditId && narrative.fullNarrative) {
      await supabaseAdmin
        .from("audits_v2")
        .update({
          narrative: narrative.fullNarrative,
          narrative_what_working: narrative.whatIsWorking,
          narrative_primary_constraint: narrative.primaryConstraintNarrative,
          narrative_cost: narrative.whatThisCosts,
          narrative_root_cause: narrative.rootCause,
          narrative_next_step: narrative.nextStep,
          revenue_opportunity_text: revenueOpportunityText,
          status: "complete",
        })
        .eq("id", auditId)
    }

    // ── 5. Generate PDF ───────────────────────────────────────────
    let pdfBuffer: Buffer | null = null

    const pdfData: AuditPDFData = {
      businessName: body.businessName || "",
      ownerName: body.ownerName || "",
      industry: body.industry || "",
      monthlyRevenue: body.monthlyRevenue || "",
      createdAt: new Date().toISOString(),
      primaryConstraint: constraint.primary,
      secondaryConstraint: constraint.secondary,
      ruleApplied: constraint.ruleApplied,
      scores: {
        who: rawScores.lever1, what: rawScores.lever2,
        traffic: rawScores.lever3, sell: rawScores.lever4,
        operations: rawScores.lever5,
      },
      bands: {
        who: bands.lever1, what: bands.lever2,
        traffic: bands.lever3, sell: bands.lever4,
        operations: bands.lever5,
      },
      narrative: {
        whatIsWorking: narrative.whatIsWorking,
        primaryConstraintNarrative: narrative.primaryConstraintNarrative,
        whatThisCosts: narrative.whatThisCosts,
        rootCause: narrative.rootCause,
        nextStep: narrative.nextStep,
      },
      recommendedCta,
      revenueOpportunityText,
    }

    try {
      // @ts-ignore — react-pdf typing mismatch with React 19
      const blob = await pdf(React.createElement(AuditResultsPDFV2, { data: pdfData })).toBlob()
      const arrayBuffer = await blob.arrayBuffer()
      pdfBuffer = Buffer.from(arrayBuffer)
    } catch (pdfError) {
      console.error("[audit-v2] PDF generation error:", pdfError)
    }

    // ── 6. Send emails ────────────────────────────────────────────
    if (body.email) {
      const emailData: AuditResultEmailData = {
        ownerName: body.ownerName || "",
        businessName: body.businessName || "",
        email: body.email,
        primaryConstraint: constraint.primary,
        primaryScore: constraint.primaryScore,
        band: bands.lever1, // primary constraint band (approximate)
        scores: {
          who: rawScores.lever1, what: rawScores.lever2,
          traffic: rawScores.lever3, sell: rawScores.lever4,
          operations: rawScores.lever5,
        },
        narrative: {
          whatIsWorking: narrative.whatIsWorking,
          primaryConstraintNarrative: narrative.primaryConstraintNarrative,
          whatThisCosts: narrative.whatThisCosts,
          rootCause: narrative.rootCause,
          nextStep: narrative.nextStep,
        },
        recommendedCta,
        auditId,
      }

      // Get the correct band for primary constraint
      const constraintBandMap: Record<string, keyof typeof bands> = {
        "WHO (Market)": "lever1",
        "WHAT (Offer)": "lever2",
        "HOW THEY FIND YOU (Traffic)": "lever3",
        "HOW YOU SELL (Conversion)": "lever4",
        "HOW YOU DELIVER (Operations)": "lever5",
      }
      const bandKey = constraintBandMap[constraint.primary]
      if (bandKey) emailData.band = bands[bandKey]

      // Fire both emails in parallel, don't await (non-blocking)
      Promise.all([
        pdfBuffer
          ? sendAuditResults(emailData, pdfBuffer)
          : Promise.resolve(),
        sendAuditAdminNotification(emailData),
      ]).catch(err => console.error("[audit-v2] Email error:", err))

      // Update PDF sent status
      if (auditId && pdfBuffer) {
        void supabaseAdmin
          .from("audits_v2")
          .update({ pdf_generated: true, results_email_sent: true, results_email_sent_at: new Date().toISOString() })
          .eq("id", auditId)
      }
    }

    // ── 7. Return result to frontend ──────────────────────────────
    const fields = {
      // Scores
      scores: {
        "WHO (Market)": rawScores.lever1,
        "WHAT (Offer)": rawScores.lever2,
        "HOW THEY FIND YOU (Traffic)": rawScores.lever3,
        "HOW YOU SELL (Conversion)": rawScores.lever4,
        "HOW YOU DELIVER (Operations)": rawScores.lever5,
      },
      score_who: rawScores.lever1,
      score_what: rawScores.lever2,
      score_traffic: rawScores.lever3,
      score_sell: rawScores.lever4,
      score_operations: rawScores.lever5,
      band_who: bands.lever1,
      band_what: bands.lever2,
      band_traffic: bands.lever3,
      band_sell: bands.lever4,
      band_operations: bands.lever5,
      // Constraint
      final_constraint: constraint.primary,
      primary_score: constraint.primaryScore,
      secondary_constraint: constraint.secondary,
      secondary_score: constraint.secondaryScore,
      rule_applied: constraint.ruleApplied,
      // Narrative
      narrative_what_working: narrative.whatIsWorking,
      narrative_primary_constraint: narrative.primaryConstraintNarrative,
      narrative_cost: narrative.whatThisCosts,
      narrative_root_cause: narrative.rootCause,
      narrative_next_step: narrative.nextStep,
      // Revenue
      revenue_opportunity_text: revenueOpportunityText,
      // Interaction flags
      interaction_flags: interactionFlags,
      // CTA
      recommended_cta: recommendedCta,
      // Business pass-through
      business_name: body.businessName || "",
      owner_name: body.ownerName || "",
      monthly_revenue: body.monthlyRevenue || "",
      industry: body.industry || "",
      email: body.email || "",
      // DB id
      audit_id: auditId,
      // Legacy compat fields (for existing ResultsPage)
      evidence_points: interactionFlags,
      quick_win: {},
      revenue_impact: { explanation: revenueOpportunityText },
      reasoning: narrative.fullNarrative,
    }

    return NextResponse.json({ success: true, fields }, { status: 200 })
  } catch (error: any) {
    console.error("[audit-v2] Unhandled error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
