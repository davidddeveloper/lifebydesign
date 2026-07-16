// app/api/admin/kolat-books/route.ts
// List + update Kolat Books inquiries for the admin dashboard

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("kolat_books_inquiries")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, inquiries: data || [] })
  } catch (error) {
    console.error("[admin/kolat-books] fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch Kolat Books inquiries" },
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
      // only updated_at — no real field change
      return NextResponse.json({ error: "No valid updates" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("kolat_books_inquiries")
      .update(safeUpdates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, inquiry: data })
  } catch (error) {
    console.error("[admin/kolat-books] update error:", error)
    return NextResponse.json(
      { error: "Failed to update inquiry" },
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
      .from("kolat_books_inquiries")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[admin/kolat-books] delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    )
  }
}
