# Infrastructure Tiers — Production Readiness Assessment

**Stack:** Vercel (hosting) · Supabase (database) · Anthropic Claude · Resend  
**Last reviewed:** April 2026

---

## Short Answer

**You should upgrade both before going to production.** The free tiers are fine for development and soft-launch testing, but two hard blockers make them unsuitable for a live commercial product:

1. **Supabase free projects pause after 1 week of inactivity** — your database goes offline, and the next visitor hits a cold-start delay of 30–60 seconds while it resumes.
2. **Vercel Hobby is restricted to non-commercial use** by their Terms of Service. Running a paying business on it is a ToS violation.

Both upgrades cost less than a single coaching session booking — they're not optional for a live product.

---

## Tier-by-Tier Breakdown

### Vercel

| | Hobby (current) | Pro ($20/month) |
|---|---|---|
| **Commercial use** | ❌ ToS prohibits it | ✓ |
| **Serverless timeout** | 10 seconds | 60 seconds |
| **Team members** | 1 (you only) | Unlimited |
| **Bandwidth** | 100 GB/month | 1 TB/month |
| **Concurrent builds** | 1 | 2 |
| **SLA** | None | 99.99% uptime SLA |
| **Support** | Community only | Email support |
| **Preview deployments** | ✓ | ✓ |
| **Custom domains + SSL** | ✓ | ✓ |
| **CI/CD** | ✓ | ✓ |

**Critical issue — function timeout:**  
The `submit-audit-v2` route calls Claude (3–8 seconds) then generates a PDF, all within a single serverless function. On Hobby, the 10-second limit can be hit under load or on slow Claude responses. On Pro, the limit is 60 seconds — no risk.

**Verdict: Upgrade to Pro before launch.**

---

### Supabase

| | Free (current) | Pro ($25/month) |
|---|---|---|
| **Project pausing** | ❌ Pauses after 1 week inactivity | ✓ Never pauses |
| **Database size** | 500 MB | 8 GB |
| **Egress** | 5 GB/month | 250 GB/month |
| **File storage** | 1 GB | 100 GB |
| **Daily backups** | ❌ None | ✓ 7-day retention |
| **Point-in-time recovery** | ❌ | ✓ (add-on) |
| **Dedicated compute** | Shared CPU / 500 MB RAM | Dedicated (2 vCPU / 1 GB RAM) |
| **Active projects** | Max 2 | Unlimited |
| **Support** | Community only | Email support |

**Critical issue — project pausing:**  
On the free tier, if no API call hits your Supabase project for 7 days, it is automatically paused. The first user to arrive after that pause waits ~30–60 seconds for the database to wake up — and may see an error. For a business getting intermittent traffic (workshops, coaching enquiries), 7 days between real visitors is plausible.

**Database size:**  
Each audit submission stores answers + scores + full AI narrative (~5–8 KB). At 100 audits/month you'd use ~10 MB/month for audit data alone. The 500 MB free limit gives you roughly 3–4 years of headroom at that pace — not an immediate concern, but Pro gives you 8 GB with room to grow.

**Verdict: Upgrade to Pro before launch.**

---

### Anthropic Claude

| | Current ($5 credit) | Recommended |
|---|---|---|
| **Audit narrative** (Sonnet 4.6) | ~$0.017/audit | — |
| **Audits on $5 credit** | ~294 audits | — |
| **Billing model** | Pre-paid credit | Pay-as-you-go (set a monthly spend limit) |

The $5 credit is enough for testing and early traction. Once you've validated demand, switch to a monthly spend limit (e.g. $10–20/month) via console.anthropic.com. At 100 audits/month you'd spend ~$1.70/month on narrative generation — very low.

**Verdict: Current credit fine to start. Set a spend limit, don't let it run to zero.**

---

### Resend (email)

| | Free | Pro ($20/month) |
|---|---|---|
| **Monthly emails** | 3,000 | 50,000 |
| **Daily limit** | 100 emails/day | No daily cap |
| **Custom domain** | ✓ (1 domain) | ✓ |
| **Logs & analytics** | 1 day | 3 days |

Each audit submission triggers 1 email (to owner). Each booking triggers 2–3 emails (confirmation + team notification). At 50 audits/month + 20 bookings, you'd send ~110–160 emails/month — comfortably inside the free tier.

**Verdict: Free tier is fine for now. Upgrade when you hit ~30 bookings/month consistently.**

---

## What to Upgrade Now vs Later

| Service | Upgrade? | When | Monthly cost |
|---|---|---|---|
| **Vercel** | ✅ Must | Before launch | $20 |
| **Supabase** | ✅ Must | Before launch | $25 |
| **Anthropic** | Top up credit | When $5 credit runs low | ~$2–5/month at current scale |
| **Resend** | ✅ Not yet | When > 30 bookings/month | $20 |
| **Total at launch** | | | **$45/month** |

---

## What the $45/month Buys You

- No pausing. Database is always online.
- No ToS risk. Commercial use is covered.
- 60-second function timeout — no audit submissions timing out.
- Daily database backups.
- Email support from both Vercel and Supabase.
- A platform that can scale to thousands of users without a change in architecture.

For comparison: one VIP Consultation booking (at any reasonable price point) covers more than a month of infrastructure.

---

## How to Upgrade

**Vercel:**
1. vercel.com → your account → Settings → Billing → Upgrade to Pro
2. No redeployment needed — your existing deployment upgrades in place
3. Function timeout increases automatically

**Supabase:**
1. supabase.com → your project → Settings → Billing → Upgrade to Pro
2. No schema changes. No migration. Database stays live during upgrade.
3. Project pausing is disabled immediately on upgrade

---

## Other Production Recommendations

**Set a Supabase database alert**
Dashboard → Reports → Usage → set an email alert at 400 MB (80% of free limit) if you delay upgrading.

**Set an Anthropic spend limit**
console.anthropic.com → Settings → Limits → set a monthly cap. Prevents a runaway script from draining your credit overnight.

**Enable Vercel error alerts**
Project → Integrations → Alerts → set up email notification for error rate > 1%. The `submit-audit-v2` route is the most likely failure point.

**Test the booking flow end-to-end in production**
After upgrading, submit one real test audit and one real test booking to confirm emails arrive, PDF downloads, and the admin panel shows the records. See the post-deploy checklist in `docs/deployment.md`.
