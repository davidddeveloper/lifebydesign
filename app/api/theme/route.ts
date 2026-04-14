// app/api/theme/route.ts
// Returns brand theme settings. Cached 60s so the admin colour change
// reflects on next page load without a full redeploy.

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

const DEFAULT_PRIMARY = "#1A1A1A"

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from("booking_settings")
      .select("value")
      .eq("key", "brand_primary_color")
      .single()

    const primary = data?.value
      ? String(data.value).replace(/^"|"$/g, "")
      : DEFAULT_PRIMARY

    return NextResponse.json(
      { primary },
      {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
      }
    )
  } catch {
    return NextResponse.json({ primary: DEFAULT_PRIMARY }, { status: 200 })
  }
}
