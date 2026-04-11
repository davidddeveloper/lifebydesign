// app/api/audit-pdf/[id]/route.ts
// Regenerates and streams the PDF for a given audit_id.
// Called by the "Download PDF" button on the results page.

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { pdf } from "@react-pdf/renderer"
import { AuditResultsPDFV2, type AuditPDFData } from "@/components/AuditResultsPDFV2"
import React from "react"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id || id.length < 10) {
    return NextResponse.json({ error: "Invalid audit ID" }, { status: 400 })
  }

  // Fetch audit from DB
  const { data: audit, error } = await supabaseAdmin
    .from("audits_v2")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 })
  }

  const pdfData: AuditPDFData = {
    businessName: audit.business_name || "",
    ownerName: audit.owner_name || "",
    industry: audit.industry || "",
    monthlyRevenue: audit.monthly_revenue ? String(audit.monthly_revenue) : "",
    createdAt: audit.created_at,
    primaryConstraint: audit.primary_constraint || "",
    secondaryConstraint: audit.secondary_constraint || null,
    ruleApplied: audit.rule_applied || 1,
    scores: {
      who: audit.score_who || 0,
      what: audit.score_what || 0,
      traffic: audit.score_traffic || 0,
      sell: audit.score_sell || 0,
      operations: audit.score_operations || 0,
    },
    bands: {
      who: audit.band_who || "WEAK",
      what: audit.band_what || "WEAK",
      traffic: audit.band_traffic || "WEAK",
      sell: audit.band_sell || "WEAK",
      operations: audit.band_operations || "WEAK",
    },
    narrative: {
      whatIsWorking: audit.narrative_what_working || "",
      primaryConstraintNarrative: audit.narrative_primary_constraint || "",
      whatThisCosts: audit.narrative_cost || "",
      rootCause: audit.narrative_root_cause || "",
      nextStep: audit.narrative_next_step || "",
    },
    recommendedCta: audit.recommended_cta || "vip_consultation",
    revenueOpportunityText: audit.revenue_opportunity_text || "",
  }

  try {
    // @ts-ignore — react-pdf typing mismatch with React 19
    const blob = await pdf(React.createElement(AuditResultsPDFV2, { data: pdfData })).toBlob()
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const safeName = (audit.business_name || "Audit").replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "-")

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Constraint-Audit-${safeName}.pdf"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "no-store",
      },
    })
  } catch (err: any) {
    console.error("[audit-pdf] generation error:", err)
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 })
  }
}
