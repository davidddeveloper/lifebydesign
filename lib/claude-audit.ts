// lib/claude-audit.ts
// Generates the personalised diagnostic narrative via Claude.
// This is the ONLY place Claude is called for audit analysis.
// All scoring and constraint logic is deterministic (in submit-audit-v2/route.ts).

import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface AuditNarrativeInput {
  // Business info
  businessName: string
  industry: string
  yearsInBusiness: string
  monthlyRevenue: string
  teamSize: string
  revenueTracking: string

  // Lever scores (0–10, already calculated)
  scores: {
    lever1: number // WHO
    lever2: number // WHAT
    lever3: number // FIND YOU
    lever4: number // SELL
    lever5: number // DELIVER
  }
  bands: {
    lever1: string
    lever2: string
    lever3: string
    lever4: string
    lever5: string
  }

  // Constraint (already identified)
  primaryConstraint: string
  primaryScore: number
  secondaryConstraint: string | null
  ruleApplied: number

  // Interaction flags (pre-calculated)
  interactionFlags: string[]

  // Open-text answers
  q4: string   // ideal customer
  q12: string  // main problem solved
  q22: string  // reasons not buying
  q28: string  // biggest challenge
  q29: string  // one thing to fix
  q30: string  // 12-month goal

  // Revenue opportunity (qualitative until real multiplier data exists)
  revenueOpportunityText: string

  // Recommended CTA
  recommendedCta: "workshop" | "vip_consultation" | "90day_programme" | "scaling"

  // Capacity constraint amendment (Q2a)
  capacityStatus?: string   // human-readable status string
  capacityFlag?: boolean    // true = Q2 was excluded from Lever 1 scoring
}

export interface AuditNarrativeOutput {
  whatIsWorking: string
  primaryConstraintNarrative: string
  whatThisCosts: string
  rootCause: string
  nextStep: string
  fullNarrative: string // joined for PDF / storage
}

// ─────────────────────────────────────────────
// CTA descriptions for the prompt
// ─────────────────────────────────────────────

const CTA_DESCRIPTIONS: Record<string, string> = {
  workshop:
    "the Constraint-Breaking Workshop — a structured 2-day programme that takes business owners through each of the 5 levers with hands-on exercises and peer learning",
  vip_consultation:
    "the VIP Consultation — a private 1-on-1 session with a Startup Bodyshop coach to diagnose your constraint in depth and build a personalised 90-day action plan",
  "90day_programme":
    "the 90-Day Growth Programme — a full three-month programme of weekly coaching, implementation support, and accountability designed to break through a specific constraint",
  scaling:
    "a scaling conversation with a senior Startup Bodyshop advisor — because at this stage, the constraint is no longer internal, and growth requires a different kind of support",
}

// ─────────────────────────────────────────────
// Build the prompt payload
// ─────────────────────────────────────────────

function buildPrompt(input: AuditNarrativeInput): string {
  const {
    businessName, industry, yearsInBusiness, monthlyRevenue, teamSize,
    revenueTracking, scores, bands, primaryConstraint, primaryScore,
    secondaryConstraint, ruleApplied, interactionFlags,
    capacityStatus, capacityFlag,
    q4, q12, q22, q28, q29, q30, revenueOpportunityText, recommendedCta,
  } = input

  const scoreLines = [
    `Lever 1 — WHO (Market): ${scores.lever1}/10 — ${bands.lever1}`,
    `Lever 2 — WHAT (Offer): ${scores.lever2}/10 — ${bands.lever2}`,
    `Lever 3 — HOW THEY FIND YOU (Traffic): ${scores.lever3}/10 — ${bands.lever3}`,
    `Lever 4 — HOW YOU SELL (Conversion): ${scores.lever4}/10 — ${bands.lever4}`,
    `Lever 5 — HOW YOU DELIVER (Operations): ${scores.lever5}/10 — ${bands.lever5}`,
  ].join("\n")

  const flagsText = interactionFlags.length > 0
    ? interactionFlags.join("\n— ")
    : "None identified."

  const ctaDescription = CTA_DESCRIPTIONS[recommendedCta] || CTA_DESCRIPTIONS["vip_consultation"]

  const capacityBlock = capacityFlag
    ? `\nCAPACITY CONSTRAINT HANDLING:\nThis business answered Q2a as 'At full capacity' — Q2 was excluded from Lever 1 scoring.\nIn section 2 (Primary Constraint): If WHO or FIND YOU appears as primary constraint, do not write a market or traffic diagnosis. Instead write: 'Your scores suggest a potential market or traffic constraint, but you have told us your business is currently at full capacity. The real constraint here is not that customers are hard to find — it is that you cannot serve more of them right now. Your coach will explore what is limiting your capacity and what it would take to expand it.'\nIn section 4 (Root Cause): Always address the capacity ceiling explicitly. Name whether it appears to be financial (limited capital), physical (space, equipment), or human (team size). Draw on Q28 and Q12 for context.\nIn section 5 (Recommended Next Step): Always recommend the VIP Consultation — this requires a personalised conversation, not a group workshop.\n`
    : ""

  return `
BUSINESS OWNER CONTEXT:
Business: ${businessName || "Unknown"} | Industry: ${industry || "Unknown"} | Years operating: ${yearsInBusiness || "Unknown"} | Monthly revenue: NLe ${monthlyRevenue || "Unknown"} | Team: ${teamSize || "Unknown"} | Tracks numbers: ${revenueTracking}
Capacity status: ${capacityStatus || "Not specified — Q2 included"}

LEVER SCORES (out of 10) — pre-calculated, do not recalculate:
${scoreLines}

CONSTRAINT DIAGNOSIS — pre-calculated, do not override:
Primary constraint: ${primaryConstraint} (score: ${primaryScore}/10) | Rule applied: Rule ${ruleApplied}
Secondary constraint: ${secondaryConstraint || "None"}

REVENUE OPPORTUNITY:
${revenueOpportunityText}
${capacityBlock}
LEVER INTERACTION FLAGS — weave these into the narrative where relevant:
— ${flagsText}

OPEN-TEXT ANSWERS:
Q4 — Ideal customer: ${q4 || "Not provided"}
Q12 — Problem they solve: ${q12 || "Not provided"}
Q22 — Why people don't buy: ${q22 || "Not provided"}
Q28 — Biggest challenge: ${q28 || "Not provided"}
Q29 — One thing to fix: ${q29 || "Not provided"}
Q30 — 12-month goal: ${q30 || "Not provided"}

RECOMMENDED PROGRAMME: ${ctaDescription}
`.trim()
}

// ─────────────────────────────────────────────
// System prompt (from audit spec)
// ─────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the diagnostic engine for Startup Bodyshop, a business growth consultancy in Sierra Leone. Your job is to generate a personalised constraint diagnostic report for an MSME owner based on their questionnaire responses. You must be specific, honest, and practical. The person reading this will be on their phone or computer, alone, without a coach present.

YOUR TASK:
Write a personalised diagnostic report. Return ONLY a valid JSON object with exactly these five keys — no markdown, no extra text, just the JSON:

{
  "whatIsWorking": "2–3 sentences. Name something specific and real from the scores or open-text answers. Reference their industry or business context. Do not be generic. Do not begin with 'Congratulations' or 'Great news'.",
  "primaryConstraint": "3–4 sentences. Name the constraint plainly. Explain what it means in practical, day-to-day terms — what does this problem actually look like in the owner's life? Connect it to their specific answers. If Q28 or Q29 aligns with the scored constraint, confirm it. If it conflicts, name both and explain the tension.",
  "whatThisCosts": "2–3 sentences. Frame the revenue opportunity as potential, not a guarantee. Use the revenue opportunity text provided. Never lead with an invented figure.",
  "rootCause": "3–4 sentences. Go one level deeper than the constraint label. What is the specific underlying reason, based on their individual answers? If a lever interaction flag is present, weave it in naturally. If Q27 scored 1.5, address the time problem explicitly.",
  "nextStep": "2–3 sentences. Recommend the specific programme named in RECOMMENDED PROGRAMME only — do not list alternatives. Explain why it is the right fit for this person's specific situation."
}

ABSOLUTE STYLE RULES:
— Write in clear, plain English. No jargon or management vocabulary.
— Be specific to this person. Every section must reference something from their actual answers.
— Be honest. Name the problem plainly. Encouragement that softens the diagnosis is not helpful.
— Never use: leverage, synergy, optimise, unlock, journey, empower, pivot, ecosystem.
— Never mention Goldratt, Hormozi, Gerber, or any framework by name.
— If revenue tracking is 'no', note that scores may be estimates and the coach will establish actual numbers.
— Keep the total word count between 500 and 650 words across all five sections combined.
— Return only the JSON object. No preamble, no explanation, no markdown code fences.`

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────

export async function generateAuditNarrative(
  input: AuditNarrativeInput
): Promise<AuditNarrativeOutput> {
  const userPrompt = buildPrompt(input)

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1200,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  })

  const raw = message.content[0].type === "text" ? message.content[0].text : ""

  // Parse the JSON response
  let parsed: Record<string, string>
  try {
    // Strip any accidental markdown code fences
    const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim()
    parsed = JSON.parse(clean)
  } catch {
    // If parsing fails, return the raw text as a single narrative
    console.error("[claude-audit] Failed to parse JSON response:", raw)
    return {
      whatIsWorking: "",
      primaryConstraintNarrative: "",
      whatThisCosts: "",
      rootCause: "",
      nextStep: raw,
      fullNarrative: raw,
    }
  }

  const sections = {
    whatIsWorking: parsed.whatIsWorking || "",
    primaryConstraintNarrative: parsed.primaryConstraint || "",
    whatThisCosts: parsed.whatThisCosts || "",
    rootCause: parsed.rootCause || "",
    nextStep: parsed.nextStep || "",
  }

  const fullNarrative = [
    `WHAT IS WORKING\n${sections.whatIsWorking}`,
    `YOUR PRIMARY CONSTRAINT\n${sections.primaryConstraintNarrative}`,
    `WHAT THIS IS COSTING YOU\n${sections.whatThisCosts}`,
    `THE ROOT CAUSE\n${sections.rootCause}`,
    `YOUR RECOMMENDED NEXT STEP\n${sections.nextStep}`,
  ].join("\n\n")

  return { ...sections, fullNarrative }
}

// ─────────────────────────────────────────────
// Interaction flags calculator (deterministic)
// ─────────────────────────────────────────────

export function calculateInteractionFlags(
  scores: { lever1: number; lever2: number; lever3: number; lever4: number; lever5: number },
  primaryConstraint: string,
  answers: {
    q5?: number | null; q7?: number | null; q8?: number | null; q10?: number | null
    q11?: number | null; q17?: number | null; q19?: number | null; q27?: number | null
  }
): string[] {
  const flags: string[] = []

  const pc = primaryConstraint ?? ""

  if (pc.includes("WHO") && scores.lever2 < 5.5)
    flags.push("Improving your market focus will bring better customers — but your offer will also need strengthening to convert and keep them. Both need attention.")

  if (pc.includes("WHAT") && scores.lever3 < 5.5)
    flags.push("A stronger offer alone will not grow revenue if the right people are not finding you. Your traffic system needs attention alongside your offer.")

  if (pc.includes("FIND YOU") && scores.lever4 < 5.5)
    flags.push("More leads will only help if you can convert them. Your sales process needs strengthening alongside your traffic activity.")

  if (pc.includes("SELL") && scores.lever2 < 5.5)
    flags.push("A better sales process will help, but the core issue may be the offer itself. Both need attention for full improvement.")

  if (pc.includes("DELIVER") && (answers.q10 ?? 99) <= 4 && (answers.q11 ?? 99) <= 2)
    flags.push("Fixing your systems is important — but growth also requires building ways to sell more to your existing customers. These two problems need solving together.")

  if ((answers.q17 ?? 99) < 3 && (answers.q19 ?? 0) > 5)
    flags.push("Your ability to close sales appears solid — the bigger issue is that warm leads are being lost before you ever get to talk to them. A simple follow-up system could recover significant revenue.")

  if ((answers.q27 ?? 99) === 1.5)
    flags.push("The first step is creating time to work on the business, not just in it. Without that, no plan will stick.")

  if ((answers.q5 ?? 0) >= 3 && (answers.q7 ?? 99) <= 3 && (answers.q8 ?? 99) <= 4 && (answers.q10 ?? 99) <= 4)
    flags.push("Your scores suggest you feel your customer relationships are strong — but the behavioural signals tell a different story. Customers who are genuinely satisfied tend to come back and refer others without being asked. Closing this gap is likely where the real revenue opportunity sits.")

  return flags
}

// ─────────────────────────────────────────────
// CTA routing (deterministic)
// ─────────────────────────────────────────────

export function selectCta(
  scores: { lever1: number; lever2: number; lever3: number; lever4: number; lever5: number },
  ruleApplied: number
): "workshop" | "vip_consultation" | "90day_programme" | "scaling" {
  if (ruleApplied === 5) return "scaling"
  if (ruleApplied === 4) return "90day_programme"
  const minScore = Math.min(scores.lever1, scores.lever2, scores.lever3, scores.lever4, scores.lever5)
  if (minScore < 4.0) return "workshop"
  if (ruleApplied === 3) return "workshop"
  return "vip_consultation"
}

// ─────────────────────────────────────────────
// Revenue opportunity text (qualitative until real data)
// ─────────────────────────────────────────────

export function getRevenueOpportunityText(
  primaryConstraint: string,
  monthlyRevenue: string
): string {
  const rev = parseFloat(monthlyRevenue)
  const hasRevenue = !isNaN(rev) && rev > 0

  const base = hasRevenue
    ? `Your current monthly revenue is NLe ${Number(rev).toLocaleString()}.`
    : "Your current revenue forms the baseline for this calculation."

  return `${base} Businesses at your stage with a ${primaryConstraint} constraint typically see meaningful revenue growth within 90 days once the bottleneck is addressed — your coach will establish a specific target with you at your first session.`
}
