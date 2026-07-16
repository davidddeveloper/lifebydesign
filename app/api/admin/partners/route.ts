// app/api/admin/partners/route.ts
// List + update partner applications for the admin dashboard

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, partners: data || [] })
  } catch (error) {
    console.error("[admin/partners] fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch partners" },
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

    // Whitelist updatable fields
    const allowed = ["status", "admin_notes"]
    const safeUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    for (const key of allowed) {
      if (updates && key in updates) safeUpdates[key] = updates[key]
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json({ error: "No valid updates" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("partners")
      .update(safeUpdates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, partner: data })
  } catch (error) {
    console.error("[admin/partners] update error:", error)
    return NextResponse.json(
      { error: "Failed to update partner" },
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
      .from("partners")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[admin/partners] delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 }
    )
  }
}
