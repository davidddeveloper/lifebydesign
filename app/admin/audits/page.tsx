// app/admin/audits/page.tsx
"use client"

import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import Link from "next/link"
import {
  Search,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  Calendar,
  Eye,
  RefreshCw,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────
interface Audit {
  _id: string
  _version?: "v1" | "v2"
  auditVersion?: string
  // Basic info
  businessName: string
  ownerName: string
  email: string
  phone: string
  industry: string
  yearsInBusiness?: number
  monthlyRevenue: number
  numberOfCustomers?: number
  teamSize?: number
  // WHO
  idealCustomer?: string
  customerTypes?: string
  newCustomersLastMonth?: string
  conversionRate?: string
  biggestProblem?: string
  turnDownBadFits?: string
  // WHAT
  mainProblemSolved?: string
  solution?: string
  avgTransactionValue?: string
  pricingVsCompetitors?: string
  customerSatisfaction?: string
  referralFrequency?: string
  proofLevel?: string
  // SELL
  hasSalesScript?: string
  salesConversations?: string
  conversionToCustomer?: string
  timeToClose?: string
  reasonsNotBuying?: string
  followUpSystem?: string
  // TRAFFIC
  trafficReferrals?: number
  trafficSocial?: number
  trafficAds?: number
  trafficPartnerships?: number
  trafficWalkIns?: number
  trafficOther?: number
  postingFrequency?: string
  weeklyReach?: string
  monthlyLeads?: string
  leadPredictability?: string
  hasLeadMagnet?: string
  // OPERATIONS
  businessWithoutYou?: string
  writtenProcedures?: string
  repeatPurchases?: string
  hasUpsells?: string
  trackNumbers?: string
  profitMargin?: string
  hoursPerWeek?: string
  timeOnVsIn?: string
  // FINAL
  topChallenge?: string
  oneThingToFix?: string
  twelveMonthGoal?: string
  // AI Results
  scores: {
    who: number
    what: number
    sell: number
    traffic: number
    operations: number
  }
  primaryConstraint: string
  secondaryConstraint: string
  primaryScore: number
  confidence: number
  reasoning: string
  evidencePoints: string[]
  revenueImpact: {
    currentMonthly: number
    potentialMonthly: number
    monthlyOpportunityCost: number
    yearlyOpportunityCost: number
    explanation: string
  }
  quickWin: {
    action: string
    impact: string
    time: string
  }
  status: string
  dashboardId: string | null
  submittedAt: string
  recommendedCta?: string | null
  // v2-only
  bands?: { who: string; what: string; traffic: string; sell: string; operations: string }
  narrativeSections?: {
    whatIsWorking: string; primaryConstraintNarrative: string
    whatThisCosts: string; rootCause: string; nextStep: string
  }
  revenueOpportunityText?: string
  v2Scores?: {
    q1: number | null; q2: number | null; q3: number | null
    q5: number | null; q6: number | null; q7: number | null; q8: number | null
    q9: number | null; q10: number | null; q11: number | null
    q13: number | null; q14: number | null; q15: number | null
    q16: number | null; q17: number | null
    q18: number | null; q19: number | null; q20: number | null; q21: number | null
    q23: number | null; q24: number | null; q25: number | null
    q26: number | null; q27: number | null
  }
}

type TimeFilter = "all" | "today" | "this_week" | "this_month" | "last_month" | "this_year" | "last_year"
type SortField = "submittedAt" | "businessName" | "primaryConstraint" | "yearlyOpportunityCost" | "status"
type SortDir = "asc" | "desc"

// ─── Helpers ─────────────────────────────────────────────────────
import { USD_TO_SLE, formatSLE, usdHint } from '@/lib/currency'

function safeArray(value: unknown): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === "string") {
    try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : [] } catch { return [] }
  }
  return []
}

function safeObj<T>(value: unknown, fallback: T): T {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as T
  if (typeof value === "string") {
    try { const parsed = JSON.parse(value); return typeof parsed === "object" && parsed ? parsed : fallback } catch { return fallback }
  }
  return fallback
}

function formatLeones(value: number | undefined) {
  if (!value) return "SLE 0"
  return formatSLE(value)
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getTimeRange(filter: TimeFilter): { start: Date; end: Date } | null {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (filter) {
    case "today":
      return { start: today, end: now }
    case "this_week": {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      return { start: weekStart, end: now }
    }
    case "this_month":
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now }
    case "last_month": {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
      return { start: lastMonthStart, end: lastMonthEnd }
    }
    case "this_year":
      return { start: new Date(now.getFullYear(), 0, 1), end: now }
    case "last_year":
      return { start: new Date(now.getFullYear() - 1, 0, 1), end: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59) }
    default:
      return null
  }
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending_contact: { label: "Pending", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  nurturing: { label: "Nurturing", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  contacted: { label: "Contacted", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  converted: { label: "Converted", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || { label: status || "Unknown", bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

function ConstraintTag({ constraint }: { constraint: string }) {
  if (!constraint) return <span className="text-gray-400 text-sm">—</span>
  const short = constraint
    .replace("HOW YOU SELL (Conversion)", "SELL")
    .replace("HOW THEY FIND YOU (Traffic)", "TRAFFIC")
    .replace("HOW YOU DELIVER (Operations)", "OPS")
    .replace("WHO (Market)", "WHO")
    .replace("WHAT (Offer)", "WHAT")
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold">
      {short}
    </span>
  )
}

// ─── v2 question score → option text lookup ──────────────────────
const V2_LABELS: Record<string, Record<number, string>> = {
  q1: {
    1: "I haven't really thought about it — I serve anyone who will pay",
    2: "I have a rough sense but I take most opportunities that come my way",
    3: "I have a clear type of customer I prefer and actively look for",
    4: "I have a very specific ideal customer profile and I focus on them consistently",
  },
  q2: {
    2: "0 to 2 new customers",
    4: "3 to 5 new customers",
    6: "6 to 10 new customers",
    8: "More than 10 new customers",
  },
  q3: {
    1: "Very little — most customers find me by chance or accident",
    2: "Some — I rely mainly on word of mouth from people I already know",
    3: "Moderate — I do some deliberate activity to attract the right people",
    4: "A lot — I actively and consistently target and reach my ideal customers",
  },
  q5: {
    1: "Most customers make a single small purchase and do not return",
    2: "Customers return occasionally but overall spending across the year is modest",
    3: "Customers come back reasonably regularly and their total spending is meaningful",
    4: "Customers are loyal, returning frequently, and their total annual value is high relative to my type of business",
  },
  q6: {
    1: "I am significantly cheaper — I compete mainly on being the lowest price",
    2: "I am a little cheaper — I usually come in below the going rate",
    3: "I charge roughly the same as others in my area",
    4: "I charge more — because I offer something noticeably better",
    5: "I charge significantly more — and customers still choose me",
  },
  q7: {
    1.5: "Many customers seem disappointed, complain, or do not come back",
    3: "Most customers are okay but rarely express strong satisfaction",
    4.5: "Most customers seem genuinely happy and I get regular positive feedback",
    6: "Almost all customers are very satisfied — I hear it regularly and see it in their behaviour",
  },
  q8: {
    2: "Never — I have never had an unprompted referral",
    4: "Occasionally — maybe once or twice in the past year",
    6: "Sometimes — a few times per quarter, without me asking",
    8: "Regularly — I receive unprompted referrals almost every month",
  },
  q9: {
    1: "No — I don't have any documented proof",
    2: "I have a few positive messages or comments I could share",
    3: "I have several testimonials I can show on request",
    4: "I have documented results with numbers or specific before-and-after stories",
    5: "I have extensive proof — multiple case studies, measurable outcomes, and results data",
  },
  q10: {
    2: "Almost never — most customers only buy once",
    4: "Occasionally — they return a few times over the course of a year",
    6: "Regularly — most customers come back multiple times",
    8: "Continuously — most of my customers are ongoing, recurring buyers",
  },
  q11: {
    1: "No — I offer one thing and that is all",
    2: "I have thought about it but have not set anything up",
    3: "I have additional offers but I rarely actively sell them",
    4: "Yes — I regularly offer and sell additional products or services to existing customers",
  },
  q13: {
    1: "Mostly by chance — they passed by, saw a sign, or found me randomly",
    2: "Mostly through personal connections — friends, family, or people who already know me",
    3: "Through a mix of word of mouth and some deliberate activity I do",
    4: "Through a consistent system I run — regular outreach, promotions, or partnerships",
  },
  q14: {
    1.5: "I do not do anything regularly — customers come when they come",
    3: "Occasionally — I do something when I remember or feel motivated",
    4.5: "At least once or twice a week — I have a loose routine",
    6: "Every week without fail — I have a consistent practice that I stick to",
  },
  q15: {
    2: "Fewer than 5 enquiries",
    4: "5 to 15 enquiries",
    6: "16 to 30 enquiries",
    8: "31 to 60 enquiries",
    10: "More than 60 enquiries",
  },
  q16: {
    1: "Completely unpredictable — I have no idea what next month will bring",
    2: "Rough guess — I can estimate within a very wide range",
    3: "Reasonably confident — I can usually estimate within about 25%",
    4: "Very confident — my enquiry flow is consistent and I can predict it reliably",
  },
  q17: {
    1: "No — if they don't buy immediately I lose touch completely",
    2: "Sometimes — I follow up if I happen to remember",
    3: "Usually — I try to follow up with most people who show interest",
    4: "Always — I have a system and I work it consistently for everyone who enquires",
  },
  q18: {
    1.5: "I send them a price and wait to hear back — no real process",
    3: "I have an informal conversation and try to close it, but it varies each time",
    4.5: "I follow a loose process — I explain what I offer, answer questions, and ask for payment",
    6: "I follow a clear, consistent process every time — I know what I say and in what order",
  },
  q19: {
    2: "Fewer than 2 in 10 (less than 20%)",
    4: "2 to 3 in 10 (20–30%)",
    6: "4 to 5 in 10 (40–50%)",
    8: "6 or more in 10 (60%+)",
  },
  q20: {
    1: "Much slower than typical for my type of business",
    2: "A little slower than typical — it takes longer than it probably should",
    3: "About the same as typical for my type of business",
    4: "Faster than typical — I close and collect payment more quickly than most",
  },
  q21: {
    2: "No — if they don't buy at first I move on and forget about them",
    4: "Sometimes — if I happen to remember or they contact me again",
    6: "Usually — I follow up with most people after a few days",
    8: "Always — I have a consistent follow-up system and I use it for everyone",
  },
  q23: {
    1: "It would completely stop — nothing happens without me personally",
    2: "Major problems would occur — things would fall apart quickly",
    3: "Some things would slow down, but most could be managed without me",
    4: "It would run normally — I have clear systems and people who can handle things",
  },
  q24: {
    1: "Everything is in my head — nothing is written down anywhere",
    2: "A few things are noted somewhere, but it is mostly informal and incomplete",
    3: "The main steps of my most important work are written down or documented somewhere",
    4: "Most of how I run and deliver the business is documented and accessible to others",
  },
  q25: {
    2: "I do not track any of these — I work from memory and feel",
    4: "I have a rough sense but nothing I track consistently",
    6: "I check most of these numbers most months, though not perfectly",
    8: "Yes — I track all of these regularly and could tell you the numbers right now",
  },
  q26: {
    0: "No — I don't know my profit margin / losing money or breaking even",
    4: "I keep roughly 10–20 out of every 100 Leones I earn",
    6: "I keep roughly 21–35 out of every 100 Leones I earn",
    8: "I keep more than 35 out of every 100 Leones I earn",
  },
  q27: {
    1.5: "Almost entirely IN — I have no real time to plan or improve anything",
    3: "Mainly IN, with some ON — roughly 25% of my time is on strategy and improvement",
    4.5: "A reasonable balance — about half my time is on strategy and improvement",
    6: "Mainly ON — most of my time is spent building and improving the business",
  },
}

function v2Label(qKey: string, score: number | null | undefined): string {
  if (score === null || score === undefined) return ""
  const text = V2_LABELS[qKey]?.[score]
  if (!text) return String(score)
  return `${text} (score - ${score})`
}

// ─── Export Helpers ───────────────────────────────────────────────
async function exportToPDF(audits: Audit[]) {
  const { generatePDFBlob, generatePDFBlobV2 } = await import("@/lib/generate-pdf")

  async function blobFor(a: Audit): Promise<Blob> {
    if (a._version === "v2") return generatePDFBlobV2(mapAuditToPDFDataV2(a))
    return generatePDFBlob(mapAuditToPDFData(a))
  }

  if (audits.length === 1) {
    const a = audits[0]
    const blob = await blobFor(a)
    downloadBlob(blob, `${(a.businessName || "Audit").replace(/\s+/g, "-")}-Audit.pdf`)
  } else {
    for (const a of audits) {
      const blob = await blobFor(a)
      downloadBlob(blob, `${(a.businessName || "Audit").replace(/\s+/g, "-")}-Audit.pdf`)
      await new Promise((r) => setTimeout(r, 300))
    }
  }
}

function mapAuditToPDFData(a: Audit) {
  const scores = safeObj(a.scores, { who: 0, what: 0, sell: 0, traffic: 0, operations: 0 })
  const ri = safeObj(a.revenueImpact, { currentMonthly: 0, potentialMonthly: 0, monthlyOpportunityCost: 0, yearlyOpportunityCost: 0, explanation: "" })

  return {
    business_name: a.businessName || "",
    owner_name: a.ownerName || "",
    email: a.email || "",
    created_at: a.submittedAt || "",
    final_constraint: a.primaryConstraint || "",
    primary_score: a.primaryScore || 0,
    confidence: a.confidence || 0,
    reasoning: a.reasoning || "",
    scores: {
      "WHO (Market)": scores.who || 0,
      "WHAT (Offer)": scores.what || 0,
      "HOW YOU SELL (Conversion)": scores.sell || 0,
      "HOW THEY FIND YOU (Traffic)": scores.traffic || 0,
      "HOW YOU DELIVER (Operations)": scores.operations || 0,
    },
    evidence_points: safeArray(a.evidencePoints),
    revenue_impact: ri,
  }
}

function mapAuditToPDFDataV2(a: Audit) {
  const scores = a.scores ?? { who: 0, what: 0, sell: 0, traffic: 0, operations: 0 }
  const bands = a.bands ?? { who: "CRITICAL", what: "CRITICAL", traffic: "CRITICAL", sell: "CRITICAL", operations: "CRITICAL" }
  const narrative = a.narrativeSections ?? { whatIsWorking: "", primaryConstraintNarrative: a.reasoning ?? "", whatThisCosts: "", rootCause: "", nextStep: "" }
  return {
    businessName: a.businessName || "",
    ownerName: a.ownerName || "",
    industry: a.industry || "",
    monthlyRevenue: String(a.monthlyRevenue || ""),
    createdAt: a.submittedAt || "",
    primaryConstraint: a.primaryConstraint || "—",
    secondaryConstraint: a.secondaryConstraint ?? null,
    ruleApplied: 0,
    scores: {
      who: scores.who ?? 0,
      what: scores.what ?? 0,
      traffic: scores.traffic ?? 0,
      sell: scores.sell ?? 0,
      operations: scores.operations ?? 0,
    },
    bands: {
      who: bands.who,
      what: bands.what,
      traffic: bands.traffic,
      sell: bands.sell,
      operations: bands.operations,
    },
    narrative: {
      whatIsWorking: narrative.whatIsWorking,
      primaryConstraintNarrative: narrative.primaryConstraintNarrative,
      whatThisCosts: narrative.whatThisCosts,
      rootCause: narrative.rootCause,
      nextStep: narrative.nextStep,
    },
    recommendedCta: a.recommendedCta || "vip_consultation",
    revenueOpportunityText: a.revenueOpportunityText || a.revenueImpact?.explanation || "",
  }
}

function buildResultsRows(audits: Audit[]) {
  return audits.map((a) => {
    const isV2 = a._version === "v2"
    return {
      "Business Name": a.businessName,
      Owner: a.ownerName,
      Email: a.email,
      Phone: a.phone,
      Industry: a.industry,
      "Audit Version": a.auditVersion ?? "",
      Status: a.status,
      Constraint: a.primaryConstraint,
      "Constraint Score": a.primaryScore,
      Confidence: isV2 ? "" : a.confidence,
      "WHO Score": a.scores?.who,
      "WHAT Score": a.scores?.what,
      "SELL Score": a.scores?.sell,
      "TRAFFIC Score": a.scores?.traffic,
      "OPS Score": a.scores?.operations,
      // v1 revenue breakdown (blank for v2 — v2 doesn't store these separately)
      "Current Monthly (Le)": isV2 ? "" : a.revenueImpact?.currentMonthly,
      "Potential Monthly (Le)": isV2 ? "" : a.revenueImpact?.potentialMonthly,
      "Monthly Opp. Cost (Le)": isV2 ? "" : a.revenueImpact?.monthlyOpportunityCost,
      "Yearly Opp. Cost (Le)": isV2 ? "" : a.revenueImpact?.yearlyOpportunityCost,
      "Yearly Opp. Cost (USD)": isV2 ? "" : (a.revenueImpact?.yearlyOpportunityCost
        ? Math.round(a.revenueImpact.yearlyOpportunityCost / USD_TO_SLE)
        : 0),
      // v2 revenue & narrative (blank for v1)
      "Revenue Opportunity": isV2 ? (a.revenueOpportunityText ?? a.revenueImpact?.explanation ?? "") : "",
      "Quick Win": isV2 ? "" : a.quickWin?.action,
      // v1: full AI reasoning; v2: full joined narrative
      Reasoning: a.reasoning,
      // v2 narrative sections (blank for v1)
      "What's Working": isV2 ? (a.narrativeSections?.whatIsWorking ?? "") : "",
      "Primary Constraint Detail": isV2 ? (a.narrativeSections?.primaryConstraintNarrative ?? "") : "",
      "What This Costs": isV2 ? (a.narrativeSections?.whatThisCosts ?? "") : "",
      "Root Cause": isV2 ? (a.narrativeSections?.rootCause ?? "") : "",
      "Next Step": isV2 ? (a.narrativeSections?.nextStep ?? "") : "",
      "Recommended CTA": isV2 ? (a.recommendedCta ?? "") : "",
      "Submitted At": a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : "",
    }
  })
}

function buildSubmissionsRows(audits: Audit[]) {
  return audits.map((a) => {
    const isV2 = a._version === "v2"
    const q = a.v2Scores
    return {
      // Basic (shared)
      "Business Name": a.businessName,
      Owner: a.ownerName,
      Email: a.email,
      Phone: a.phone,
      Industry: a.industry,
      "Audit Version": a.auditVersion ?? "",
      "Years in Business": a.yearsInBusiness,
      "Monthly Revenue (Le)": a.monthlyRevenue,
      "# of Customers": a.numberOfCustomers,
      "Team Size": a.teamSize,
      // ── WHO (open text — both versions) ──
      "Ideal Customer": a.idealCustomer,
      // v1-only WHO text fields
      "Customer Types": isV2 ? "" : a.customerTypes,
      "New Customers Last Month": isV2 ? "" : a.newCustomersLastMonth,
      "Conversion Rate": isV2 ? "" : a.conversionRate,
      "Biggest Problem": isV2 ? "" : a.biggestProblem,
      "Turn Down Bad Fits?": isV2 ? "" : a.turnDownBadFits,
      // v2-only WHO answers
      "WHO - Customer Clarity": isV2 ? v2Label("q1", q?.q1) : "",
      "WHO - New Customers/Month": isV2 ? v2Label("q2", q?.q2) : "",
      "WHO - Acquisition Control": isV2 ? v2Label("q3", q?.q3) : "",
      // ── WHAT ──
      "Main Problem Solved": a.mainProblemSolved,
      // v1-only WHAT text fields
      Solution: isV2 ? "" : a.solution,
      "Avg Transaction Value": isV2 ? "" : a.avgTransactionValue,
      "Pricing vs Competitors": isV2 ? "" : a.pricingVsCompetitors,
      "Customer Satisfaction": isV2 ? "" : a.customerSatisfaction,
      "Referral Frequency": isV2 ? "" : a.referralFrequency,
      "Proof Level": isV2 ? "" : a.proofLevel,
      // v2-only WHAT answers
      "WHAT - Customer Relationship Value": isV2 ? v2Label("q5", q?.q5) : "",
      "WHAT - Pricing vs Competitors": isV2 ? v2Label("q6", q?.q6) : "",
      "WHAT - Customer Satisfaction": isV2 ? v2Label("q7", q?.q7) : "",
      "WHAT - Unprompted Referrals": isV2 ? v2Label("q8", q?.q8) : "",
      "WHAT - Documented Evidence": isV2 ? v2Label("q9", q?.q9) : "",
      "WHAT - Repeat Purchase Frequency": isV2 ? v2Label("q10", q?.q10) : "",
      "WHAT - Additional Offers": isV2 ? v2Label("q11", q?.q11) : "",
      // ── SELL ──
      "Reasons Not Buying": a.reasonsNotBuying,
      // v1-only SELL text fields
      "Has Sales Script?": isV2 ? "" : a.hasSalesScript,
      "Sales Conversations/Month": isV2 ? "" : a.salesConversations,
      "Conversion to Customer": isV2 ? "" : a.conversionToCustomer,
      "Time to Close": isV2 ? "" : a.timeToClose,
      "Follow-Up System": isV2 ? "" : a.followUpSystem,
      // v2-only SELL answers
      "SELL - Sales Process": isV2 ? v2Label("q18", q?.q18) : "",
      "SELL - Close Rate": isV2 ? v2Label("q19", q?.q19) : "",
      "SELL - Time to Close": isV2 ? v2Label("q20", q?.q20) : "",
      "SELL - Follow-Up System": isV2 ? v2Label("q21", q?.q21) : "",
      // ── TRAFFIC ──
      // v1-only TRAFFIC fields
      "Traffic - Referrals %": isV2 ? "" : a.trafficReferrals,
      "Traffic - Social %": isV2 ? "" : a.trafficSocial,
      "Traffic - Ads %": isV2 ? "" : a.trafficAds,
      "Traffic - Partnerships %": isV2 ? "" : a.trafficPartnerships,
      "Traffic - Walk-ins %": isV2 ? "" : a.trafficWalkIns,
      "Traffic - Other %": isV2 ? "" : a.trafficOther,
      "Posting Frequency": isV2 ? "" : a.postingFrequency,
      "Weekly Reach": isV2 ? "" : a.weeklyReach,
      "Monthly Leads": isV2 ? "" : a.monthlyLeads,
      "Lead Predictability": isV2 ? "" : a.leadPredictability,
      "Has Lead Magnet?": isV2 ? "" : a.hasLeadMagnet,
      // v2-only TRAFFIC answers
      "TRAFFIC - Acquisition Channel": isV2 ? v2Label("q13", q?.q13) : "",
      "TRAFFIC - Deliberate Weekly Action": isV2 ? v2Label("q14", q?.q14) : "",
      "TRAFFIC - Monthly Enquiries": isV2 ? v2Label("q15", q?.q15) : "",
      "TRAFFIC - Enquiry Predictability": isV2 ? v2Label("q16", q?.q16) : "",
      "TRAFFIC - Warm Lead Follow-Up": isV2 ? v2Label("q17", q?.q17) : "",
      // ── OPERATIONS ──
      // v1-only OPS text fields
      "Business Without You": isV2 ? "" : a.businessWithoutYou,
      "Written Procedures?": isV2 ? "" : a.writtenProcedures,
      "Repeat Purchases": isV2 ? "" : a.repeatPurchases,
      "Has Upsells?": isV2 ? "" : a.hasUpsells,
      "Track Numbers?": isV2 ? "" : a.trackNumbers,
      "Profit Margin": isV2 ? "" : a.profitMargin,
      "Hours/Week": isV2 ? "" : a.hoursPerWeek,
      "Time On vs In Business": isV2 ? "" : a.timeOnVsIn,
      // v2-only OPS answers
      "OPS - Business Without You": isV2 ? v2Label("q23", q?.q23) : "",
      "OPS - Documented Knowledge": isV2 ? v2Label("q24", q?.q24) : "",
      "OPS - Tracks Business Numbers": isV2 ? v2Label("q25", q?.q25) : "",
      "OPS - Profit Margin": isV2 ? v2Label("q26", q?.q26) : "",
      "OPS - Time On vs In Business": isV2 ? v2Label("q27", q?.q27) : "",
      // ── FINAL (shared open text) ──
      "Top Challenge": a.topChallenge,
      "One Thing to Fix": a.oneThingToFix,
      "12-Month Goal": a.twelveMonthGoal,
      "Submitted At": a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : "",
    }
  })
}

function autoColWidths(rows: Record<string, unknown>[]) {
  if (!rows.length) return []
  return Object.keys(rows[0]).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r) => String(r[key] ?? "").length)) + 2,
  }))
}

function exportResults(audits: Audit[]) {
  import("xlsx").then((XLSX) => {
    const rows = buildResultsRows(audits)
    const ws = XLSX.utils.json_to_sheet(rows)
    ws["!cols"] = autoColWidths(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Results")
    const filename = audits.length === 1
      ? `${(audits[0].businessName || "Audit").replace(/\s+/g, "-")}-Results.xlsx`
      : `Audit-Results-${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(wb, filename)
  })
}

function exportSubmissions(audits: Audit[]) {
  import("xlsx").then((XLSX) => {
    const rows = buildSubmissionsRows(audits)
    const ws = XLSX.utils.json_to_sheet(rows)
    ws["!cols"] = autoColWidths(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Submissions")
    const filename = audits.length === 1
      ? `${(audits[0].businessName || "Audit").replace(/\s+/g, "-")}-Submissions.xlsx`
      : `Audit-Submissions-${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(wb, filename)
  })
}

function exportAll(audits: Audit[]) {
  import("xlsx").then((XLSX) => {
    const subRows = buildSubmissionsRows(audits)
    const resRows = buildResultsRows(audits)

    const wsSub = XLSX.utils.json_to_sheet(subRows)
    wsSub["!cols"] = autoColWidths(subRows)
    const wsRes = XLSX.utils.json_to_sheet(resRows)
    wsRes["!cols"] = autoColWidths(resRows)

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, wsSub, "Submissions")
    XLSX.utils.book_append_sheet(wb, wsRes, "Results")

    const filename = audits.length === 1
      ? `${(audits[0].businessName || "Audit").replace(/\s+/g, "-")}-Full-Export.xlsx`
      : `Audit-Full-Export-${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(wb, filename)
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ─── Sheet Export Dropdown ────────────────────────────────────────
function SheetExportDropdown({ audits, size = "md" }: { audits: Audit[]; size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const isSm = size === "sm"

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className={
          isSm
            ? "p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            : "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        }
        title="Export as Spreadsheet"
      >
        <FileSpreadsheet className={isSm ? "w-3.5 h-3.5" : "w-3 h-3"} />
        {!isSm && <>Spreadsheet <ChevronDown className="w-3 h-3" /></>}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
          <button
            onClick={(e) => { e.stopPropagation(); exportResults(audits); setOpen(false) }}
            className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            Export Results
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); exportSubmissions(audits); setOpen(false) }}
            className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            Export Submissions
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={(e) => { e.stopPropagation(); exportAll(audits); setOpen(false) }}
            className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            Export All (2 sheets)
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Regenerate Narrative Button ─────────────────────────────────
function RegenerateNarrativeButton({ auditId, reasoning }: { auditId: string; reasoning: string | null }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle")
  const isBlank = !reasoning || reasoning.trim().length === 0

  async function handleRegenerate() {
    if (!confirm("Re-run Claude narrative generation for this audit? This will cost ~$0.017 and overwrite the existing narrative.")) return
    setState("loading")
    try {
      const res = await fetch("/api/admin/regenerate-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: auditId }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed")
      setState("done")
      // Reload after short delay so the panel refreshes
      setTimeout(() => window.location.reload(), 1200)
    } catch (err: any) {
      console.error(err)
      setState("error")
      setTimeout(() => setState("idle"), 3000)
    }
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isBlank ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-700">
          {isBlank ? "⚠ Narrative is empty — Claude call may have failed" : "AI Narrative"}
        </p>
        {!isBlank && <p className="text-xs text-gray-400 mt-0.5">Regenerate to refresh with updated prompt</p>}
      </div>
      <button
        onClick={handleRegenerate}
        disabled={state === "loading" || state === "done"}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        {state === "loading" && <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />}
        {state === "done" ? "Done ✓" : state === "error" ? "Error — retry" : state === "loading" ? "Running…" : "Regenerate Narrative"}
      </button>
    </div>
  )
}

// ─── Detail Panel ────────────────────────────────────────────────
function AuditDetailPanel({ audit, onClose }: { audit: Audit; onClose: () => void }) {
  const [exporting, setExporting] = useState(false)

  const handlePDF = async () => {
    setExporting(true)
    try { await exportToPDF([audit]) } finally { setExporting(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{audit.businessName}</h2>
              {audit.auditVersion && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                  v{audit.auditVersion}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{audit.ownerName} &middot; {audit.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePDF}
              disabled={exporting}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Export as PDF"
            >
              <FileText className="w-4 h-4" />
            </button>
            <SheetExportDropdown audits={[audit]} />
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Status + Constraint */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={audit.status} />
            <ConstraintTag constraint={audit.primaryConstraint} />
            <span className="text-xs text-gray-400">{formatDate(audit.submittedAt)}</span>
          </div>

          {/* Scores */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Scores</h3>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: "WHO", value: audit.scores?.who },
                { label: "WHAT", value: audit.scores?.what },
                { label: "SELL", value: audit.scores?.sell },
                { label: "TRAFFIC", value: audit.scores?.traffic },
                { label: "OPS", value: audit.scores?.operations },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{s.value || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Impact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Revenue Impact</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-xs text-gray-500">Current Monthly</div>
                <div className="text-lg font-bold text-green-700">{formatLeones(audit.revenueImpact?.currentMonthly)}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-xs text-gray-500">Potential Monthly</div>
                <div className="text-lg font-bold text-green-700">{formatLeones(audit.revenueImpact?.potentialMonthly)}</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg col-span-2">
                <div className="text-xs text-gray-500">Yearly Opportunity Cost</div>
                <div className="text-lg font-bold text-red-600">
                  {formatLeones(audit.revenueImpact?.yearlyOpportunityCost)}
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({audit.revenueImpact?.yearlyOpportunityCost ? usdHint(audit.revenueImpact.yearlyOpportunityCost) : '$0 USD'})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Regenerate Narrative (v2 audits only) */}
          {audit._version === "v2" && <RegenerateNarrativeButton auditId={audit._id} reasoning={audit.reasoning} />}

          {/* Reasoning */}
          {audit.reasoning && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Reasoning</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{audit.reasoning}</p>
            </div>
          )}

          {/* Evidence */}
          {safeArray(audit.evidencePoints).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Evidence</h3>
              <ul className="space-y-2">
                {safeArray(audit.evidencePoints).map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Win */}
          {audit.quickWin?.action && (
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wider mb-2">Quick Win</h3>
              <p className="text-sm font-medium text-gray-900">{audit.quickWin.action}</p>
              {audit.quickWin.impact && (
                <p className="text-xs text-gray-600 mt-1">Impact: {audit.quickWin.impact}</p>
              )}
              {audit.quickWin.time && (
                <p className="text-xs text-gray-600">Time: {audit.quickWin.time}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────
export default function AdminAuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("submittedAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showDetail, setShowDetail] = useState<Audit | null>(null)
  const [showDateRange, setShowDateRange] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [bulkExporting, setBulkExporting] = useState(false)

  const fetchAudits = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/audits")
      const data = await res.json()
      setAudits(data.audits || [])
    } catch (err) {
      console.error("Failed to fetch audits:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAudits() }, [fetchAudits])

  const filteredAudits = useMemo(() => {
    let result = [...audits]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.businessName?.toLowerCase().includes(q) ||
          a.ownerName?.toLowerCase().includes(q) ||
          a.email?.toLowerCase().includes(q) ||
          a.primaryConstraint?.toLowerCase().includes(q) ||
          a.industry?.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== "all") result = result.filter((a) => a.status === statusFilter)

    if (timeFilter !== "all") {
      const range = getTimeRange(timeFilter)
      if (range) {
        result = result.filter((a) => {
          if (!a.submittedAt) return false
          const d = new Date(a.submittedAt)
          return d >= range.start && d <= range.end
        })
      }
    }

    if (showDateRange && dateFrom) {
      const from = new Date(dateFrom)
      result = result.filter((a) => a.submittedAt && new Date(a.submittedAt) >= from)
    }
    if (showDateRange && dateTo) {
      const to = new Date(dateTo + "T23:59:59")
      result = result.filter((a) => a.submittedAt && new Date(a.submittedAt) <= to)
    }

    result.sort((a, b) => {
      let valA: string | number = ""
      let valB: string | number = ""
      switch (sortField) {
        case "submittedAt": valA = a.submittedAt || ""; valB = b.submittedAt || ""; break
        case "businessName": valA = (a.businessName || "").toLowerCase(); valB = (b.businessName || "").toLowerCase(); break
        case "primaryConstraint": valA = (a.primaryConstraint || "").toLowerCase(); valB = (b.primaryConstraint || "").toLowerCase(); break
        case "yearlyOpportunityCost": valA = a.revenueImpact?.yearlyOpportunityCost || 0; valB = b.revenueImpact?.yearlyOpportunityCost || 0; break
        case "status": valA = a.status || ""; valB = b.status || ""; break
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1
      if (valA > valB) return sortDir === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [audits, searchQuery, statusFilter, timeFilter, sortField, sortDir, showDateRange, dateFrom, dateTo])

  const allSelected = filteredAudits.length > 0 && filteredAudits.every((a) => selectedIds.has(a._id))
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(filteredAudits.map((a) => a._id)))
  }
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const selectedAudits = audits.filter((a) => selectedIds.has(a._id))

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("desc") }
  }

  const handleBulkPDF = async () => {
    const targets = selectedAudits.length > 0 ? selectedAudits : filteredAudits
    if (targets.length === 0) return
    setBulkExporting(true)
    try { await exportToPDF(targets) } finally { setBulkExporting(false) }
  }

  const stats = useMemo(() => ({
    total: filteredAudits.length,
    pending: filteredAudits.filter((a) => a.status === "pending_contact").length,
    nurturing: filteredAudits.filter((a) => a.status === "nurturing").length,
    contacted: filteredAudits.filter((a) => a.status === "contacted").length,
    converted: filteredAudits.filter((a) => a.status === "converted").length,
  }), [filteredAudits])

  const bulkTargets = selectedAudits.length > 0 ? selectedAudits : filteredAudits

  const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "this_year", label: "This Year" },
    { value: "last_year", label: "Last Year" },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header + Toolbar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                <Link href="/admin" className="hover:text-[#177fc9] transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">Audits</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Audit Submissions</h1>
              <p className="text-sm text-gray-500 mt-1">
                {stats.total} submission{stats.total !== 1 ? "s" : ""}
                {selectedIds.size > 0 && (
                  <span className="text-blue-600 ml-2">&middot; {selectedIds.size} selected</span>
                )}
              </p>
            </div>
            <button
              onClick={fetchAudits}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="mt-4 flex gap-4 flex-wrap">
            {[
              { label: "Pending", count: stats.pending, color: "bg-red-500" },
              { label: "Nurturing", count: stats.nurturing, color: "bg-amber-500" },
              { label: "Contacted", count: stats.contacted, color: "bg-green-500" },
              { label: "Converted", count: stats.converted, color: "bg-blue-500" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm text-gray-600">
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                {s.count} {s.label}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search business, owner, email, constraint..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-1 flex-wrap">
                {TIME_FILTERS.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => { setTimeFilter(tf.value); setShowDateRange(false) }}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${timeFilter === tf.value && !showDateRange
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {tf.label}
                  </button>
                ))}
                <button
                  onClick={() => { setShowDateRange(!showDateRange); setTimeFilter("all") }}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${showDateRange ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <Calendar className="w-3 h-3" />
                  Range
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending_contact">Pending</option>
                <option value="nurturing">Nurturing</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
            </div>

            {showDateRange && (
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                <label className="text-xs text-gray-500">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-xs text-gray-500">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {(dateFrom || dateTo) && (
                  <button onClick={() => { setDateFrom(""); setDateTo("") }} className="text-xs text-gray-400 hover:text-gray-600">
                    Clear
                  </button>
                )}
              </div>
            )}

            {filteredAudits.length > 0 && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Export {selectedIds.size > 0 ? `${selectedIds.size} selected` : `all ${filteredAudits.length}`}:
                </span>
                <button
                  onClick={handleBulkPDF}
                  disabled={bulkExporting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FileText className="w-3 h-3" />
                  PDF
                </button>
                <SheetExportDropdown audits={bulkTargets} />
                {bulkExporting && <span className="text-xs text-blue-600">Exporting...</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Loading submissions...</p>
              </div>
            ) : filteredAudits.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">No submissions found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="pl-4 pr-2 py-3 text-left">
                        <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </th>
                      <th className="px-3 py-3 text-left">
                        <button onClick={() => handleSort("businessName")} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                          Business {sortField === "businessName" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                        </button>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <button onClick={() => handleSort("primaryConstraint")} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                          Constraint {sortField === "primaryConstraint" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                        </button>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <button onClick={() => handleSort("yearlyOpportunityCost")} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                          Opp. Cost/yr {sortField === "yearlyOpportunityCost" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                        </button>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <button onClick={() => handleSort("status")} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                          Status {sortField === "status" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                        </button>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <button onClick={() => handleSort("submittedAt")} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                          Date {sortField === "submittedAt" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                        </button>
                      </th>
                      <th className="px-3 py-3 text-right">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredAudits.map((audit) => (
                      <tr
                        key={audit._id}
                        className={`group hover:bg-blue-50/40 transition-colors cursor-pointer ${selectedIds.has(audit._id) ? "bg-blue-50/60" : ""}`}
                        onClick={() => setShowDetail(audit)}
                      >
                        <td className="pl-4 pr-2 py-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={selectedIds.has(audit._id)} onChange={() => toggleSelect(audit._id)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="text-sm font-medium text-gray-900">{audit.businessName || "—"}</div>
                            {audit.auditVersion === "3.0" && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 bg-blue-50 text-blue-600 rounded">v3</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{audit.ownerName} &middot; {audit.email}</div>
                        </td>
                        <td className="px-3 py-3">
                          <ConstraintTag constraint={audit.primaryConstraint} />
                          {audit.primaryScore > 0 && <span className="ml-1.5 text-xs text-gray-400">{audit.primaryScore}/10</span>}
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm font-medium text-red-600">{formatLeones(audit.revenueImpact?.yearlyOpportunityCost)}</div>
                          {audit.revenueImpact?.yearlyOpportunityCost > 0 && (
                            <div className="text-xs text-gray-400">{usdHint(audit.revenueImpact.yearlyOpportunityCost)}</div>
                          )}
                        </td>
                        <td className="px-3 py-3"><StatusBadge status={audit.status} /></td>
                        <td className="px-3 py-3 text-sm text-gray-500">{formatDate(audit.submittedAt)}</td>
                        <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setShowDetail(audit)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="View details">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={async (e) => { e.stopPropagation(); await exportToPDF([audit]) }} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="Export as PDF">
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            <SheetExportDropdown audits={[audit]} size="sm" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetail && <AuditDetailPanel audit={showDetail} onClose={() => setShowDetail(null)} />}
    </div>
  )
}
