# LBD Group — Startup Bodyshop Platform

The official web platform for LBD Group / Startup Bodyshop, a business growth consultancy operating in Sierra Leone. Built with Next.js 15 App Router.

## What This Is

A full-stack business tools platform that includes:

- **Constraint-Busting Business Audit v2** — a 30-question diagnostic tool that scores a business across 5 growth levers, identifies the primary constraint, and generates a personalised AI narrative report
- **Booking System** — a multi-step in-app booking modal with revenue gate, WAT timezone calendar, meeting medium selection, automated email confirmations, and WhatsApp reminders
- **PDF Report Generation** — branded audit results exported as a PDF via `@react-pdf/renderer`
- **Admin Dashboard** — audit submissions, booking management, narrative regeneration, configurable settings
- **AI Chat** — contextual coaching chat on audit results pages
- **Public Pages** — marketing, workshops, portfolio, job applications

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| UI | Tailwind CSS, Radix UI, shadcn/ui, Framer Motion |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude (Sonnet 4.6 for audit narrative, Haiku 4.5 for chat) |
| CMS | Sanity |
| Email | Resend |
| PDF | @react-pdf/renderer |
| Booking | Cal.com embed (dashboard) + custom in-app modal (audit results) |
| Auth | Supabase Auth |
| Deployment | Vercel |

---

## Key Features

### Constraint-Busting Audit v2

30-question form scoring across 5 levers:

- **WHO** — market clarity and customer targeting
- **WHAT** — offer strength and pricing
- **FIND YOU** — traffic and visibility
- **SELL** — conversion and sales process
- **DELIVER** — operations and fulfilment

Scores are deterministic (calculated in `app/api/submit-audit-v2/route.ts`). The AI narrative is generated separately in `lib/claude-audit.ts` using Claude Sonnet 4.6.

**Capacity Constraint Amendment**: Q2a gate question routes capacity-constrained businesses to a modified scoring formula and forces a VIP Consultation CTA. See `docs/capacity-constraint-amendment.md`.

### Booking System

Revenue-gated booking modal built into the audit results page. Businesses below NLe 20,000/month are redirected to a YouTube resource. Above the threshold, a multi-step flow handles contact info, date/time selection (WAT timezone), meeting medium, and sends confirmation emails to the client and internal team. See `docs/booking-feature.md`.

### Admin Panel

- `/admin/audits` — view all audit submissions with scores, narratives, and a regenerate button for failed AI generations
- `/admin/bookings` — manage bookings, update status, configure availability and team notifications
- `/admin/emails` — email logs
- `/admin/workshops` — workshop registrations

---

## Project Structure

```
app/
  api/
    submit-audit-v2/      # Scoring, constraint logic, Claude call
    audit-pdf/            # PDF generation endpoint
    audit-chat/           # AI chat endpoint
    bookings/             # Booking CRUD
    admin/
      regenerate-narrative/  # Re-run Claude for a failed audit
      booking-settings/      # Admin-configurable booking options
  admin/                  # Admin dashboard pages
  (public)/               # Public-facing marketing pages

components/
  ConstraintAuditFormV2.tsx   # 30-question audit form
  AuditResultsV2.tsx          # Results display + CTA
  BookingModal.tsx            # Multi-step booking flow

lib/
  claude-audit.ts         # Claude narrative generation
  email.ts                # Resend email templates

docs/
  capacity-constraint-amendment.md
  booking-feature.md
  ai-usage-and-costs.md
  deployment.md
  load-testing.md
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

### Database Setup

1. Run `migration_capacity_amendment.sql` in Supabase SQL editor (adds `q2a_answer` and `capacity_flag` columns to `audits_v2`)
2. Run `bookings_schema.sql` to create the `bookings` and `booking_settings` tables
3. Run `audit_views.sql` to create admin reporting views

See `docs/deployment.md` for full deployment instructions.

---

## Documentation

| Doc | Contents |
|---|---|
| [Capacity Constraint Amendment](docs/capacity-constraint-amendment.md) | Q2a gate, scoring fork, AI prompt changes |
| [Booking Feature](docs/booking-feature.md) | Revenue gate, calendar, email flow, admin settings |
| [AI Usage & Costs](docs/ai-usage-and-costs.md) | Token usage, cost per audit, $5 credit capacity |
| [Deployment](docs/deployment.md) | Vercel setup, env vars, DB migrations, go-live checklist |
| [Load Testing](docs/load-testing.md) | Stress test approach and expected limits |
