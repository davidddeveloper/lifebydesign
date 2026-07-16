// app/api/admin/job-applications/route.ts
// List / update / delete job applications for the admin dashboard

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")

    let query = supabaseAdmin
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (jobId) {
      query = query.eq("job_id", jobId)
    }

    const { data, error } = await query
    if (error) throw error

    const applications = data || []

    // Aggregate counts per job for the job-picker UI
    const byJob = new Map<
      string,
      {
        job_id: string
        job_title: string
        job_department: string | null
        count: number
        new_count: number
        latest_at: string | null
      }
    >()

    for (const row of applications) {
      const key = row.job_id || row.job_title || "unknown"
      const existing = byJob.get(key)
      if (!existing) {
        byJob.set(key, {
          job_id: row.job_id,
          job_title: row.job_title,
          job_department: row.job_department,
          count: 1,
          new_count: row.status === "new" ? 1 : 0,
          latest_at: row.created_at,
        })
      } else {
        existing.count += 1
        if (row.status === "new") existing.new_count += 1
        if (!existing.latest_at || row.created_at > existing.latest_at) {
          existing.latest_at = row.created_at
        }
      }
    }

    const jobs = Array.from(byJob.values()).sort((a, b) => {
      const ta = a.latest_at ? new Date(a.latest_at).getTime() : 0
      const tb = b.latest_at ? new Date(b.latest_at).getTime() : 0
      return tb - ta
    })

    return NextResponse.json({
      success: true,
      applications,
      jobs,
      total: applications.length,
    })
  } catch (error) {
    console.error("[admin/job-applications] fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch job applications" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 })
    }

    const allowed = ["status", "admin_notes"]
    const safeUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    for (const key of allowed) {
      if (updates && key in updates) safeUpdates[key] = updates[key]
    }

    if (Object.keys(safeUpdates).length === 1) {
      return NextResponse.json({ error: "No valid updates" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .update(safeUpdates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, application: data })
  } catch (error) {
    console.error("[admin/job-applications] update error:", error)
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let id = searchParams.get("id")

    if (!id) {
      try {
        const body = await request.json()
        id = body?.id ?? null
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from("job_applications")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[admin/job-applications] delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    )
  }
}
