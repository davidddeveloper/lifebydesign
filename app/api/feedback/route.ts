// app/api/feedback/route.ts
// POST — store user feedback from the Beta feedback widget

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, rating, message, name, email, auditId } = body

    if (!message || String(message).trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from("feedback").insert({
      page:      page     || null,
      rating:    rating   || null,
      message:   String(message).trim(),
      name:      name     || null,
      email:     email    || null,
      audit_id:  auditId  || null,
    })

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: any) {
    console.error("[feedback] POST error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
