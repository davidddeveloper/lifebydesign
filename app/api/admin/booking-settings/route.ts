// app/api/admin/booking-settings/route.ts
// GET  — return all booking settings as a structured object
// PATCH — update one or more settings keys

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("booking_settings")
      .select("key, value")

    if (error) throw error

    // Convert rows into a typed settings object
    const raw: Record<string, any> = {}
    for (const row of data ?? []) {
      raw[row.key] = row.value
    }

    const settings = {
      revenueThreshold:  Number(raw.revenue_threshold ?? 20000),
      redirectUrl:       String(raw.redirect_url      ?? "https://www.youtube.com/@JABshow"),
      assignedTeam:      Array.isArray(raw.assigned_team)      ? raw.assigned_team      : [],
      notificationTeam:  Array.isArray(raw.notification_team)  ? raw.notification_team  : [],
      availability: {
        days:             (raw.availability?.days            ?? ["monday","tuesday","wednesday","thursday","friday"]) as string[],
        startTime:        (raw.availability?.start_time      ?? "09:00") as string,
        endTime:          (raw.availability?.end_time        ?? "15:30") as string,
        slotDurationMins: Number(raw.availability?.slot_duration_mins ?? 30),
      },
      officeAddress:      String(raw.office_address       ?? "62 Dundas Street, Freetown, Sierra Leone"),
      directionsUrl:      String(raw.directions_url       ?? "https://maps.google.com/?q=62+Dundas+Street+Freetown+Sierra+Leone"),
      brandPrimaryColor:  String(raw.brand_primary_color  ?? "#1A1A1A").replace(/^"|"$/g, ""),
    }

    return NextResponse.json({ settings }, { status: 200 })
  } catch (err: any) {
    console.error("[booking-settings] GET error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ─── PATCH ────────────────────────────────────────────────────────────────────
// Body: { key: string, value: any }
// OR   { updates: { key: string, value: any }[] }  (batch)

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    // Batch updates
    const items: { key: string; value: any }[] = body.updates ?? [{ key: body.key, value: body.value }]

    for (const { key, value } of items) {
      if (!key) continue
      const { error } = await supabaseAdmin
        .from("booking_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })

      if (error) throw error
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error("[booking-settings] PATCH error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
