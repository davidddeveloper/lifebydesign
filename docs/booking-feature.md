# Booking System — Feature Documentation

**Feature:** Constraint Audit → Book a Call  
**Version:** 1.0  
**Last updated:** April 2026

---

## Overview

A fully custom booking flow built into the application — no Cal.com, no Calendly, no external subscription. Users book a call directly from the results page or from the audit form's navigation panel.

---

## User Flows

### Flow 1 — From Audit Results Page

1. User completes the audit and sees their results.
2. They click the CTA button (e.g. "Book a VIP Consultation").
3. A booking modal opens, pre-filled with their name, email, and revenue from the audit.
4. **Revenue gate:** if their monthly revenue is below the threshold (default: NLE 20,000), they are shown a message and redirected to YouTube after 4 seconds. No calendar is shown.
5. If above threshold (or revenue not provided), the modal proceeds to the calendar.
6. User picks a date → selects a time slot → selects meeting medium → reviews and confirms.
7. Booking is saved to the database.
8. User sees a confirmation screen with: assigned consultant's name, date/time, WhatsApp reminder note, and Add to Google Calendar button.
9. Confirmation email is sent to the user. Team notification is sent to all active notification team members.

### Flow 2 — From Audit Form Nav Panel

1. While filling in the audit, the user opens the sections nav (hamburger button, bottom-left).
2. At the bottom of the nav panel: **"Get Help Filling This Form"** button.
3. Clicking it closes the nav and opens the same booking modal, pre-filled with whatever the user has already entered (name, email, phone, revenue).
4. Same flow from step 4 above applies.

---

## Revenue Gate Logic

| Condition | Result |
|---|---|
| `monthlyRevenue > threshold` OR revenue not provided | Proceeds to calendar |
| `monthlyRevenue > 0` AND `< threshold` | Redirect screen → opens YouTube URL in new tab after 4s |

- **Default threshold:** NLE 20,000/month
- **Redirect URL:** `https://www.youtube.com/@JABshow`
- Both values are **configurable in admin** without a code change.

---

## Booking Modal — Steps

```
loading → (redirect?) → contact → date → time+medium → confirm → done
```

| Step | What happens |
|---|---|
| **Loading** | Fetches booking settings + checks revenue threshold |
| **Redirect** | Shown if below threshold; auto-redirects after 4 seconds |
| **Contact** | First/last name, email, phone (+232 pre-filled). Skipped if data already comes from audit |
| **Date** | Mini calendar, WAT (GMT+0), Monday–Friday only, current date to +3 months. Past days and weekends are disabled |
| **Time + Medium** | 30-minute slots from 09:00–15:30 WAT. Meeting medium: In-Person, Zoom, Google Meet, Phone Call. In-person shows office address + directions link. |
| **Confirm** | Summary of all details for review |
| **Done** | Success screen: assigned consultant, WhatsApp note, Add to Google Calendar link |

---

## Meeting Mediums

| Option | What user sees | What we do |
|---|---|---|
| In-Person | Office address + directions link | Address shown in email and confirmation |
| Zoom | "Link sent by email" | Auto-generate Zoom-format URL, included in email |
| Google Meet | "Link sent by email" | Auto-generate Meet-format URL, included in email |
| Phone Call | "We'll call your number" | Phone number shown in team notification |

> **Note:** The Zoom and Google Meet links are randomly generated URL-shaped strings that look like real links. For production use with actual Zoom/Meet accounts, replace `generateMeetingLink()` in `BookingModal.tsx` with real API calls.

---

## Database

### `bookings` table

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `first_name`, `last_name` | TEXT | Contact |
| `email`, `phone` | TEXT | Contact |
| `monthly_revenue` | NUMERIC | From audit or form |
| `booking_date` | DATE | YYYY-MM-DD |
| `booking_time` | TEXT | HH:MM (24h) |
| `call_medium` | TEXT | `in_person` / `zoom` / `google_meet` / `phone_call` |
| `meeting_link` | TEXT | Zoom or Meet URL, null otherwise |
| `assigned_to_name` | TEXT | Consultant name at time of booking |
| `assigned_to_email` | TEXT | Consultant email |
| `source` | TEXT | `audit` / `nav_form` / `direct` |
| `audit_id` | UUID | Soft FK to `audits_v2.id` |
| `status` | TEXT | `confirmed` / `completed` / `cancelled` / `no_show` |
| `confirmation_sent_at` | TIMESTAMPTZ | Set after emails fire |
| `team_notified_at` | TIMESTAMPTZ | Set after team notification fires |
| `admin_notes` | TEXT | Free text, admin only |

### `booking_settings` table

Key/value store. All values are JSONB.

| Key | Default value | Description |
|---|---|---|
| `revenue_threshold` | `20000` | Monthly NLE threshold |
| `redirect_url` | YouTube URL | Where to send below-threshold users |
| `assigned_team` | Diana Lake | People calls are assigned to (first active = shown on confirmation) |
| `notification_team` | All 4 team members | Everyone who gets booking notification emails |
| `availability` | Mon–Fri, 09:00–15:30, 30 min slots | Booking hours |
| `office_address` | 62 Dundas Street | Shown for in-person bookings |
| `directions_url` | Google Maps link | Linked from modal and email |

---

## API Routes

### `POST /api/bookings`
Creates a booking. Sends confirmation + team notification emails (non-blocking — booking is saved first).

**Body:**
```json
{
  "firstName": "Diana",
  "lastName": "Lake",
  "email": "diana@example.com",
  "phone": "+232 76 000 000",
  "monthlyRevenue": 45000,
  "bookingDate": "2026-04-21",
  "bookingTime": "10:00",
  "callMedium": "zoom",
  "meetingLink": "https://zoom.us/j/1234567890",
  "assignedToName": "Diana Lake",
  "assignedToEmail": "dlake@lbd.sl",
  "source": "audit",
  "auditId": "uuid-here-or-null"
}
```

**Response:** `{ "id": "booking-uuid" }`

### `GET /api/bookings`
Returns all bookings (admin use). Supports `?status=confirmed&limit=100&offset=0`.

### `PATCH /api/bookings`
Update status or notes: `{ "id": "...", "updates": { "status": "completed" } }`

### `GET /api/admin/booking-settings`
Returns all settings as a structured object.

### `PATCH /api/admin/booking-settings`
Batch-update settings:
```json
{
  "updates": [
    { "key": "revenue_threshold", "value": 25000 },
    { "key": "redirect_url", "value": "https://youtube.com/..." }
  ]
}
```

---

## Emails

### User Confirmation Email
**Subject:** `Confirmed: Your call on [Day, Date] at [Time]`

Contains:
- Booking summary table (date, time, meeting type, link/address, assigned consultant)
- WhatsApp reminder note (save +232 30 600 600)
- Add to Google Calendar button

### Team Notification Email
**Subject:** `New Booking: [Name] · [Date] [Time]`

Sent to all `active` members in `notification_team` settings.  
Contains: full client details, meeting type, link, Admin link.

---

## Admin Page — `/admin/bookings`

Two tabs:

**Bookings tab:**
- Stats: Total, Confirmed, Completed, This Week
- Filterable table by status
- Click any row → detail drawer with status update + admin notes

**Settings tab:**
- Revenue threshold + redirect URL
- Availability hours (start/end time)
- Office address + directions URL
- Assigned team (add/remove/toggle active)
- Notification team (add/remove/toggle active)

---

## Key Files

| File | Purpose |
|---|---|
| `components/BookingModal.tsx` | Full modal UI — all steps |
| `app/api/bookings/route.ts` | POST / GET / PATCH bookings |
| `app/api/admin/booking-settings/route.ts` | GET / PATCH settings |
| `lib/email.ts` → `sendBookingConfirmation`, `sendBookingTeamNotification` | Booking emails |
| `app/admin/bookings/page.tsx` | Admin UI |
| `bookings_schema.sql` | Database schema — run once in Supabase |

---

## Setup Checklist

- [ ] Run `bookings_schema.sql` in Supabase SQL editor
- [ ] Verify `RESEND_API_KEY` is set in `.env`
- [ ] Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- [ ] Visit `/admin/bookings` → Settings tab and confirm default values look correct
- [ ] Do a test booking end-to-end (use a real email to receive the confirmation)
