# Load Testing & Stress Test Guide

**Application:** Startup Bodyshop — Constraint Audit v3.0  
**Last updated:** April 2026

---

## Overview

This document covers how to load test the application before going live, what limits to be aware of, and how the system behaves under stress.

---

## Critical Routes to Test

| Route | What it does | Why it matters |
|---|---|---|
| `POST /api/submit-audit-v2` | Scores + Claude call + PDF + 2 emails + 2 DB writes | Most expensive route — the bottleneck |
| `GET /constraint-audit` | Loads the form page | High traffic expected |
| `GET /api/admin/audits` | Fetches all audits (both tables) | Runs a large DB query |
| `POST /api/bookings` | Creates booking + 2 emails | Important but lighter than audit submit |
| `GET /api/audit-pdf/[id]` | Regenerates PDF on demand | React-pdf is CPU-heavy |

---

## System Limits

### Vercel (Free tier)
| Resource | Limit | Notes |
|---|---|---|
| Function timeout | **10 seconds** | `submit-audit-v2` can breach this under load |
| Concurrent invocations | 1,000 | Unlikely to hit with this traffic |
| Bandwidth | 100 GB/month | ~10,000 page loads + PDFs before limit |
| Build minutes | 6,000 min/month | Not a concern |

### Vercel (Pro tier — recommended for production)
| Resource | Limit |
|---|---|
| Function timeout | 60 seconds |
| Concurrent invocations | 1,000 |
| Bandwidth | 1 TB/month |

### Supabase (Free tier)
| Resource | Limit |
|---|---|
| DB size | 500 MB |
| API requests | 50,000/month |
| Concurrent connections | 60 |
| Bandwidth | 5 GB/month |

### Anthropic API
| Resource | Default limit |
|---|---|
| Rate limit (Sonnet) | 50 requests/min (Tier 1) |
| Rate limit (Haiku) | 50 requests/min (Tier 1) |
| Spend cap | $5 (your current credit) |

> With 50 req/min, you can handle **50 concurrent audit submissions per minute** before Claude queues. For a small Sierra Leone MSME consultancy, this is far beyond expected traffic.

### Resend (Free tier)
| Resource | Limit |
|---|---|
| Emails/month | 3,000 |
| Emails/day | 100 |

> At 100 emails/day cap: `submit-audit-v2` sends **2 emails per submission** (user + team). **50 audit submissions/day** would consume the entire daily quota. If you expect more, upgrade Resend to Pro ($20/month for 50,000 emails).

---

## Expected Real-World Traffic

For context, here is a realistic traffic estimate for a Sierra Leone SME consultancy in the first 3 months:

| Metric | Conservative | Optimistic |
|---|---|---|
| Daily audit submissions | 2–5 | 10–20 |
| Daily page loads | 50–200 | 300–500 |
| Daily bookings | 1–3 | 5–10 |
| Monthly audit submissions | 40–100 | 200–400 |

This is well within all free-tier limits **except Resend** if daily submissions consistently exceed 50.

---

## Load Testing Tools

### Option A — k6 (recommended, free)

Install k6: https://k6.io/docs/get-started/installation/

#### Test 1: Audit form page (static load)

```javascript
// k6-audit-page.js
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 20,          // 20 concurrent virtual users
  duration: '30s',  // run for 30 seconds
};

export default function () {
  http.get('https://startupbodyshop.com/constraint-audit');
  sleep(1);
}
```

```bash
k6 run k6-audit-page.js
```

Expected: p95 response < 500ms, 0% errors.

---

#### Test 2: Audit submission (the real stress test)

> **Warning:** This will call Claude and send real emails. Use a test environment or mock the API keys. Each run costs ~$0.017 per virtual user iteration.

```javascript
// k6-audit-submit.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 },   // ramp up to 5 users
    { duration: '1m',  target: 5 },   // hold 5 concurrent
    { duration: '30s', target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<15000'],  // 95% of requests under 15s
    http_req_failed:   ['rate<0.05'],    // less than 5% errors
  },
};

const payload = JSON.stringify({
  businessName: 'Test Business',
  ownerName: 'Load Tester',
  email: 'loadtest@example.com',  // use a test email
  phone: '+232 76 000 000',
  industry: 'Retail',
  monthlyRevenue: '50000',
  yearsInBusiness: '3',
  teamSize: '5',
  // ... all 30 questions with sample values
  q1: '2', q2: '2', q3: '1.5',
  q4: 'Small retailers in Freetown',
  q5: '2', q6: '1', q7: '2', q8: '2',
  q9: '1.5', q10: '2', q11: '1', q12: 'Help retailers stock better',
  q13: '1', q14: '2', q15: '1', q16: '1.5', q17: '1.5',
  q18: '1.5', q19: '2', q20: '1', q21: '1', q22: 'Too expensive',
  q23: '1', q24: '1.5', q25: '2', q26: '2', q27: '1',
  q28: 'Getting more customers',
  q29: 'Fix my marketing',
  q30: 'Double revenue',
});

export default function () {
  const res = http.post(
    'https://startupbodyshop.com/api/submit-audit-v2',
    payload,
    { headers: { 'Content-Type': 'application/json' }, timeout: '30s' }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'has primary_constraint': (r) => r.json('final_constraint') !== undefined,
  });

  sleep(2); // wait between submissions
}
```

```bash
k6 run k6-audit-submit.js
```

---

#### Test 3: Booking submission

```javascript
// k6-booking.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.post(
    'https://startupbodyshop.com/api/bookings',
    JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+232 76 000 000',
      monthlyRevenue: 50000,
      bookingDate: '2026-05-12',
      bookingTime: '10:00',
      callMedium: 'zoom',
      meetingLink: 'https://zoom.us/j/1234567890',
      assignedToName: 'Diana Lake',
      assignedToEmail: 'dlake@lbd.sl',
      source: 'direct',
      auditId: null,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, { 'status is 201': (r) => r.status === 201 });
  sleep(1);
}
```

---

### Option B — curl (quick single-request test)

```bash
# Test audit submission
curl -X POST https://startupbodyshop.com/api/submit-audit-v2 \
  -H "Content-Type: application/json" \
  -d '{"businessName":"Curl Test","ownerName":"Test User","email":"test@example.com","industry":"Retail","monthlyRevenue":"50000","q1":"2","q2":"2",...}' \
  -w "\nTime: %{time_total}s\nStatus: %{http_code}\n"
```

---

### Option C — Vercel load test (no install)

In the Vercel dashboard → Project → Analytics → enable **Web Analytics**.  
This gives real traffic insights once deployed without any synthetic testing.

---

## What to Look For

### Audit submission (`submit-audit-v2`)

| Metric | Pass | Concern | Action needed |
|---|---|---|---|
| Response time p50 | < 6s | 6–10s | Upgrade Vercel to Pro |
| Response time p95 | < 12s | > 12s | Consider deferring PDF generation |
| Error rate | < 2% | 2–10% | Check Claude rate limits / Vercel timeout |
| Error rate | > 10% | — | Check API keys, DB connection |

### Booking submission

| Metric | Pass | Concern |
|---|---|---|
| Response time p95 | < 2s | > 3s |
| Error rate | < 1% | > 1% |

### Admin audits page

| Metric | Pass | Concern |
|---|---|---|
| Response time | < 1s | > 2s (DB query too slow — add index) |

---

## Simulating Load Without Calling Claude

To load test without spending AI credit, add a test bypass in `app/api/submit-audit-v2/route.ts`:

```typescript
// At top of POST handler, before calling generateAuditNarrative:
const isLoadTest = request.headers.get('X-Load-Test') === 'true'

let narrative
if (isLoadTest) {
  narrative = {
    whatIsWorking: 'Load test narrative.',
    primaryConstraintNarrative: 'Load test narrative.',
    whatThisCosts: 'Load test narrative.',
    rootCause: 'Load test narrative.',
    nextStep: 'Load test narrative.',
    fullNarrative: 'Load test.',
  }
} else {
  narrative = await generateAuditNarrative(input)
}
```

Then in k6, add the header:
```javascript
http.post(url, payload, {
  headers: { 'Content-Type': 'application/json', 'X-Load-Test': 'true' }
})
```

> Remove this bypass before going live.

---

## Bottleneck Map

```
User submits audit
    │
    ├─ Deterministic scoring (< 1ms) ✓ fast
    │
    ├─ Supabase INSERT (< 200ms) ✓ fast
    │
    ├─ Claude API call (3–8s) ⚠ slowest step
    │      └─ Rate limit: 50 req/min
    │      └─ Can fail if credit exhausted
    │
    ├─ Supabase UPDATE with narrative (< 200ms) ✓ fast
    │
    ├─ PDF generation with react-pdf (1–3s) ⚠ CPU-heavy
    │      └─ Runs on Vercel serverless function
    │      └─ Can cause timeout on free tier (10s limit)
    │
    └─ Emails via Resend (async, non-blocking) ✓ doesn't delay response
           └─ Daily limit: 100 emails (free tier)
```

**Total expected response time:** 5–12 seconds.  
**Vercel free tier timeout:** 10 seconds — tight.  
**Recommendation:** Use Vercel Pro (60s timeout) for production.

---

## Pre-Launch Checklist

- [ ] Test full audit flow in production environment (not localhost)
- [ ] Verify Claude narrative appears in results (not blank sections)
- [ ] Verify PDF downloads correctly
- [ ] Verify confirmation email arrives within 30 seconds of booking
- [ ] Verify team notification email arrives
- [ ] Run `k6-audit-page.js` — confirm no errors at 20 concurrent users
- [ ] Run a manual audit submission and check response time in Vercel Functions log
- [ ] Check Supabase → Reports → confirm queries are fast (< 200ms)
- [ ] Set Anthropic spend limit to $4.50
- [ ] Set Resend domain authentication (SPF/DKIM) to avoid spam filters
- [ ] Enable Vercel Analytics on the project

---

## Resend Domain Authentication (Important for Email Delivery)

Without SPF/DKIM, confirmation emails may land in spam. Set up in Resend dashboard:

1. Resend → Domains → Add Domain → `mail.startupbodyshop.com`
2. Add the DNS records Resend gives you at your domain registrar
3. Verify (takes up to 48h to propagate)
4. Emails sent `from: 'Startup Bodyshop <hello@mail.startupbodyshop.com>'` will now pass spam filters
