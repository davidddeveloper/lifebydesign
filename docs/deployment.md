# Deployment Guide

**Stack:** Next.js 16 (App Router) · Supabase · Resend · Anthropic Claude API  
**Platform:** Vercel (recommended)  
**Last updated:** April 2026

---

## Prerequisites

Before deploying, you need accounts and keys for:

| Service | What it does | Where to get it |
|---|---|---|
| **Vercel** | Hosts the Next.js app | vercel.com |
| **Supabase** | PostgreSQL database | supabase.com |
| **Anthropic** | Claude AI for audit narratives + chat | console.anthropic.com |
| **Resend** | Transactional email | resend.com |

---

## Environment Variables

Create a `.env.local` file locally (never commit this). In Vercel, add these under **Project → Settings → Environment Variables**.

```env
# ─── Supabase ─────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ─── Anthropic ────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...

# ─── Resend ───────────────────────────────────────────────
RESEND_API_KEY=re_...

# ─── Sanity (if still in use for blog/pages) ──────────────
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...
```

> `SUPABASE_SERVICE_ROLE_KEY` is **only used server-side** (in API routes and `lib/supabase.ts`). Never expose it to the browser.

---

## Database Setup (Supabase)

Run these SQL files **in order** in the Supabase SQL editor (Dashboard → SQL Editor):

1. **`audits_v2_schema.sql`** — Creates the `audits_v2` table for v3.0 audit submissions
2. **`audit_views.sql`** — Creates analytics views (union of v1 + v2 tables). Includes DROP statements so it's safe to re-run.
3. **`bookings_schema.sql`** — Creates `bookings` and `booking_settings` tables with default seed data

### Verify tables exist

After running, check in Supabase → Table Editor:
- `audits` (existing v1 table)
- `audits_v2` ✓ new
- `bookings` ✓ new
- `booking_settings` ✓ new (should have 7 rows seeded)

### Row Level Security

All tables have RLS enabled. The `service_role` key bypasses RLS (used in API routes). The `anon` key is for public-facing reads if needed — currently all audit writes go through API routes using the service role key.

---

## Deploying to Vercel

### First-time setup

```bash
# Install Vercel CLI
npm i -g vercel

# From the project root
vercel

# Follow prompts:
# - Link to your Vercel account
# - Select or create a project
# - Framework: Next.js (auto-detected)
# - Root directory: ./  (default)
```

### Add environment variables

Either via the Vercel dashboard (Settings → Environment Variables) or:

```bash
vercel env add ANTHROPIC_API_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
# etc.
```

Set each variable for **Production**, **Preview**, and **Development** as appropriate.

### Deploy

```bash
# Production deploy
vercel --prod

# Or push to main branch (auto-deploys if connected to GitHub)
git push origin main
```

---

## GitHub → Vercel Auto-Deploy

1. In Vercel dashboard → your project → Settings → Git
2. Connect your GitHub repository
3. Set **Production Branch** to `main`
4. Every push to `main` triggers a production build
5. Every pull request gets a preview URL automatically

---

## Build Configuration

No special build config needed. Vercel detects Next.js automatically.

**Build command:** `next build` (default)  
**Output directory:** `.next` (default)  
**Install command:** `npm install` (default)

### Known build notes

- `@react-pdf/renderer` uses `// @ts-ignore` in one place due to React 19 type mismatch — this is intentional and safe, does not affect runtime.
- `recharts` requires `"use client"` on any component that imports it — already handled.

---

## Domain Setup

1. In Vercel → Project → Settings → Domains
2. Add your domain: `startupbodyshop.com`
3. Follow DNS instructions (add CNAME or A record at your registrar)
4. SSL is provisioned automatically by Vercel (Let's Encrypt)

---

## Vercel Function Limits (Free / Pro tier)

| Limit | Free tier | Pro tier |
|---|---|---|
| Serverless function timeout | 10 seconds | 60 seconds |
| Function memory | 1024 MB | 3008 MB |
| Bandwidth | 100 GB/month | 1 TB/month |

**Important:** The `submit-audit-v2` route calls Claude (typically 3–8 seconds) and generates a PDF. On the **free tier**, this may hit the 10-second timeout. **Upgrade to Vercel Pro** or restructure the PDF generation to be deferred (background job) if timeouts occur.

---

## Post-Deploy Checks

After deploying, verify these work end-to-end:

- [ ] Visit `/constraint-audit` — audit form loads
- [ ] Submit a test audit — results page shows, email arrives
- [ ] Click "Download PDF" — PDF downloads
- [ ] Click CTA button on results — booking modal opens
- [ ] Complete a test booking — confirmation email arrives, team notification arrives
- [ ] Visit `/admin/audits` — shows submissions from both tables
- [ ] Visit `/admin/bookings` — shows bookings + settings tab works

---

## Monitoring

### Vercel dashboard
- **Functions** tab → see invocation counts, errors, duration per route
- Watch `submit-audit-v2` — it's the most expensive route (Claude + PDF + emails)
- Set up **Vercel Alerts** for error rate spikes

### Supabase
- Dashboard → Reports → shows query counts and DB size
- Set up **email alerts** for DB approaching limits (free tier: 500 MB)

### Anthropic
- console.anthropic.com → Usage → monitor daily spend
- Set a spend limit at $4.50 to alert before the $5 credit runs out

### Resend
- dashboard.resend.com → Logs → check delivery rates
- Free tier: 3,000 emails/month, 100/day. Pro: 50,000/month.

---

## Common Issues

| Problem | Likely cause | Fix |
|---|---|---|
| Audit submit times out | Claude call + PDF generation > 10s | Upgrade to Vercel Pro or defer PDF generation |
| PDF download fails silently | `audits_v2` missing columns | Re-run `audits_v2_schema.sql` |
| Emails not sending | `RESEND_API_KEY` missing or wrong | Check env vars in Vercel dashboard |
| Booking settings 404 | `booking_settings` table not created | Run `bookings_schema.sql` |
| Admin page shows no v2 audits | Wrong table name or RLS | Check `audits_v2` exists, service role key is correct |
| `audit_views.sql` column rename error | Existing view with different column | The SQL file already includes DROP statements — re-run it |

---

## Rolling Back

```bash
# List recent deployments
vercel ls

# Rollback to a specific deployment
vercel rollback [deployment-url]
```

Or in the Vercel dashboard → Deployments → click any previous deploy → "Promote to Production".
