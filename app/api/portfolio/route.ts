// app/api/portfolio/route.ts
// Partner / portfolio company application submission → Supabase `partners` table

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic required-field checks (form already validates client-side)
    if (!body.email || typeof body.email !== "string" || !body.email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      )
    }

    const parseNumeric = (v: unknown): number | null => {
      if (v === null || v === undefined || v === "") return null
      const n = typeof v === "number" ? v : parseFloat(String(v))
      return Number.isFinite(n) ? n : null
    }

    const row = {
      business_location: body.businessLocation ?? null,
      business_type: body.businessType ?? null,
      business_description: body.businessDescription ?? null,
      annual_revenue: parseNumeric(body.annualRevenue),
      ebitda_12_months: parseNumeric(body.ebitda12Months),
      ebitda_3_months: parseNumeric(body.ebitda3Months),
      heard_about: body.heardAbout ?? null,
      ownership_decision: body.ownershipDecision ?? null,
      email: String(body.email).trim().toLowerCase(),
      first_name: body.firstName ?? null,
      last_name: body.lastName ?? null,
      phone: body.phone ?? null,
      company_name: body.companyName ?? null,
      company_website: body.companyWebsite || null,
      portfolio_consideration: body.portfolioConsideration ?? null,
      terms_accepted: body.termsAccepted === true,
      source: body.source ?? "Partner Application",
      status: "new",
      ip_address:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        null,
      user_agent: request.headers.get("user-agent") || null,
    }

    const { data, error } = await supabaseAdmin
      .from("partners")
      .insert(row)
      .select("id, created_at")
      .single()

    if (error) {
      console.error("[portfolio] Supabase insert error:", error.message)
      return NextResponse.json(
        { success: false, error: "Failed to save application" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, id: data.id, created_at: data.created_at },
      { status: 200 }
    )
  } catch (error) {
    console.error("[portfolio] unhandled error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit form" },
      { status: 500 }
    )
  }
}
