// app/api/job-application/route.ts
// Job application submission → Supabase `job_applications` table

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    if (!email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      )
    }

    const jobId = (body.jobId || body.job_id || "").toString().trim()
    const jobTitle = (body.jobTitle || body.job_title || "").toString().trim()

    if (!jobId || !jobTitle) {
      return NextResponse.json(
        { success: false, error: "Job id and title are required" },
        { status: 400 }
      )
    }

    const row = {
      job_id: jobId,
      job_title: jobTitle,
      job_department: body.jobDepartment ?? body.department ?? null,
      sanity_document_id: body.sanityDocumentId ?? body.sanity_document_id ?? null,
      first_name: body.firstName ?? null,
      last_name: body.lastName ?? null,
      email,
      phone: body.phone ?? null,
      portfolio: body.portfolio ?? null,
      cover_letter: body.coverLetter ?? null,
      source: body.source ?? "Job Application",
      status: "new",
      ip_address:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        null,
      user_agent: request.headers.get("user-agent") || null,
    }

    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .insert(row)
      .select("id, created_at")
      .single()

    if (error) {
      console.error("[job-application] Supabase insert error:", error.message)
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
    console.error("[job-application] unhandled error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    )
  }
}
