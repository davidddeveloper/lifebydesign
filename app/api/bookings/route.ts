// app/api/bookings/route.ts
// POST  — create a new booking (saves to DB, sends emails)
// GET   — list bookings (admin use)

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { sendBookingConfirmation, sendBookingTeamNotification } from "@/lib/email"

// ─── POST /api/bookings ───────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName, lastName, email, phone,
      monthlyRevenue,
      bookingDate, bookingTime, callMedium, meetingLink,
      assignedToName, assignedToEmail,
      source, auditId,
    } = body

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !bookingDate || !bookingTime || !callMedium) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert booking
    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        first_name:         firstName,
        last_name:          lastName,
        email,
        phone,
        monthly_revenue:    monthlyRevenue ?? null,
        booking_date:       bookingDate,
        booking_time:       bookingTime,
        call_medium:        callMedium,
        meeting_link:       meetingLink ?? null,
        assigned_to_name:   assignedToName ?? null,
        assigned_to_email:  assignedToEmail ?? null,
        source:             source ?? "direct",
        audit_id:           auditId ?? null,
        status:             "confirmed",
      })
      .select("id")
      .single()

    if (error) throw error

    // Send emails (non-blocking — booking is already saved)
    const emailData = {
      firstName, lastName, email, phone,
      bookingDate, bookingTime, callMedium,
      meetingLink: meetingLink ?? null,
      assignedToName: assignedToName ?? null,
    }

    Promise.allSettled([
      sendBookingConfirmation(emailData),
      sendBookingTeamNotification(emailData),
    ]).then(results => {
      for (const r of results) {
        if (r.status === "rejected") {
          console.error("[bookings] email error:", r.reason)
        }
      }

      // Mark emails sent
      void supabaseAdmin
        .from("bookings")
        .update({
          confirmation_sent_at: new Date().toISOString(),
          team_notified_at:     new Date().toISOString(),
        })
        .eq("id", booking.id)
    })

    return NextResponse.json({ id: booking.id }, { status: 201 })
  } catch (err: any) {
    console.error("[bookings] POST error:", err)
    return NextResponse.json({ error: err.message ?? "Failed to create booking" }, { status: 500 })
  }
}

// ─── GET /api/bookings ────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status  = searchParams.get("status")          // filter by status
    const limit   = parseInt(searchParams.get("limit")  ?? "100")
    const offset  = parseInt(searchParams.get("offset") ?? "0")

    let query = supabaseAdmin
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq("status", status)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ bookings: data ?? [], total: data?.length ?? 0 }, { status: 200 })
  } catch (err: any) {
    console.error("[bookings] GET error:", err)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

// ─── PATCH /api/bookings ──────────────────────────────────────────────────────
// Update a booking's status or notes from admin

export async function PATCH(request: NextRequest) {
  try {
    const { id, updates } = await request.json()
    if (!id || !updates) return NextResponse.json({ error: "Missing id or updates" }, { status: 400 })

    const { error } = await supabaseAdmin.from("bookings").update(updates).eq("id", id)
    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
