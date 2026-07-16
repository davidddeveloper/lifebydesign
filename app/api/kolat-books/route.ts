// app/api/kolat-books/route.ts
// Kolat Books inquiry submission → Supabase `kolat_books_inquiries` table

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean)
  if (typeof v === "string" && v.trim()) return [v.trim()]
  return []
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const businessEmail =
      typeof body.businessEmail === "string" ? body.businessEmail.trim().toLowerCase() : ""
    const contactEmail =
      typeof body.contactEmail === "string" ? body.contactEmail.trim().toLowerCase() : ""

    if (!businessEmail.includes("@") && !contactEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid business or contact email is required" },
        { status: 400 }
      )
    }

    const row = {
      business_name: body.businessName ?? null,
      business_industry: body.businessIndustry ?? null,
      business_address: body.businessAddress ?? null,
      business_email: businessEmail || null,
      business_phone: body.businessPhone ?? null,
      primary_contact: body.primaryContact ?? null,
      contact_position: body.contactPosition ?? null,
      contact_phone: body.contactPhone ?? null,
      contact_email: contactEmail || null,
      number_of_employees: body.numberOfEmployees ?? null,
      monthly_revenue: body.monthlyRevenue ?? null,
      bookkeeping_method: body.bookkeepingMethod ?? null,
      current_bookkeeper: body.currentBookkeeper ?? null,
      financial_challenges: body.financialChallenges || null,
      services_interested: asStringArray(body.servicesInterested),
      communication_preference: asStringArray(body.communicationPreference),
      terms_accepted: body.termsAccepted === true,
      source: body.source ?? "Finance Freedom Page",
      status: "new",
      ip_address:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        null,
      user_agent: request.headers.get("user-agent") || null,
    }

    const { data, error } = await supabaseAdmin
      .from("kolat_books_inquiries")
      .insert(row)
      .select("id, created_at")
      .single()

    if (error) {
      console.error("[kolat-books] Supabase insert error:", error.message)
      return NextResponse.json(
        { success: false, error: "Failed to save inquiry" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, id: data.id, created_at: data.created_at },
      { status: 200 }
    )
  } catch (error) {
    console.error("[kolat-books] unhandled error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit form" },
      { status: 500 }
    )
  }
}
