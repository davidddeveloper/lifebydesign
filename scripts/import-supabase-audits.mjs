#!/usr/bin/env node
/**
 * Import Supabase audit records into Sanity as auditSubmission documents.
 *
 * Usage:
 *   node scripts/import-supabase-audits.mjs <path-to-json> <SANITY_API_TOKEN>
 *
 * Or set SANITY_API_TOKEN in your environment:
 *   SANITY_API_TOKEN=sk... node scripts/import-supabase-audits.mjs audits.json
 *
 * The JSON file should be the raw export from Supabase — an array of row objects.
 *
 * Sanity project: mbu5cc2o  |  dataset: production
 */

import { readFileSync } from 'fs'

// ── Config ────────────────────────────────────────────────────────
const PROJECT_ID = 'mbu5cc2o'
const DATASET    = 'production'
const API_VERSION = '2025-11-21'
const token = process.env.SANITY_API_TOKEN || process.argv[3]

if (!token) {
  console.error('ERROR: Sanity API token is required.')
  console.error('  Pass it as SANITY_API_TOKEN=sk... or as the second CLI argument.')
  process.exit(1)
}

const jsonPath = process.argv[2]
if (!jsonPath) {
  console.error('ERROR: Path to JSON file is required as first argument.')
  console.error('  node scripts/import-supabase-audits.mjs audits.json')
  process.exit(1)
}

// ── Load data ─────────────────────────────────────────────────────
let rows
try {
  const raw = readFileSync(jsonPath, 'utf8')
  rows = JSON.parse(raw)
  if (!Array.isArray(rows)) rows = [rows]  // handle single object too
} catch (e) {
  console.error('ERROR: Could not read/parse JSON file:', e.message)
  process.exit(1)
}

console.log(`Loaded ${rows.length} record(s) from ${jsonPath}`)

// ── Field mapping ─────────────────────────────────────────────────
function safeJson(value, fallback) {
  if (value === null || value === undefined) return fallback
  if (typeof value !== 'string') return value
  try { return JSON.parse(value) } catch { return fallback }
}

function mapRow(r) {
  const scores = safeJson(r.scores, {})
  const revenueImpact = safeJson(r.revenue_impact, {})
  const quickWin = safeJson(r.quick_win, {})
  const evidencePoints = safeJson(r.evidence_points, [])

  return {
    _type: 'auditSubmission',

    // Basic info
    businessName:      r.business_name   || '',
    ownerName:         r.owner_name      || '',
    email:             r.email           || '',
    phone:             r.phone           || '',
    industry:          r.industry        || '',
    yearsInBusiness:   r.years_in_business != null ? Number(r.years_in_business) : null,
    monthlyRevenue:    r.monthly_revenue  != null ? Number(r.monthly_revenue)  : null,
    numberOfCustomers: r.number_of_customers != null ? Number(r.number_of_customers) : null,
    teamSize:          r.team_size        != null ? Math.max(0, Number(r.team_size)) : null,

    // WHO
    idealCustomer:          r.ideal_customer           || '',
    customerTypes:          r.customer_types           || '',
    newCustomersLastMonth:  r.new_customers_last_month || '',
    conversionRate:         r.conversion_rate          || '',
    biggestProblem:         r.biggest_problem          || '',
    turnDownBadFits:        r.turn_down_bad_fits       || '',

    // WHAT
    mainProblemSolved:    r.main_problem_solved     || '',
    solution:             r.solution                || '',
    avgTransactionValue:  r.avg_transaction_value   || '',
    pricingVsCompetitors: r.pricing_vs_competitors  || '',
    customerSatisfaction: r.customer_satisfaction   || '',
    referralFrequency:    r.referral_frequency      || '',
    proofLevel:           r.proof_level             || '',

    // SELL
    hasSalesScript:       r.has_sales_script       || '',
    salesConversations:   r.sales_conversations    || '',
    conversionToCustomer: r.conversion_to_customer || '',
    timeToClose:          r.time_to_close          || '',
    reasonsNotBuying:     r.reasons_not_buying     || '',
    followUpSystem:       r.follow_up_system       || '',

    // TRAFFIC
    trafficReferrals:    Math.max(0, Number(r.traffic_referrals    || 0)),
    trafficSocial:       Math.max(0, Number(r.traffic_social       || 0)),
    trafficAds:          Math.max(0, Number(r.traffic_ads          || 0)),
    trafficPartnerships: Math.max(0, Number(r.traffic_partnerships || 0)),
    trafficWalkIns:      Math.max(0, Number(r.traffic_walk_ins     || 0)),
    trafficOther:        Math.max(0, Number(r.traffic_other        || 0)),
    postingFrequency:    r.posting_frequency  || '',
    weeklyReach:         r.weekly_reach       || '',
    monthlyLeads:        r.monthly_leads      || '',
    leadPredictability:  r.lead_predictability|| '',
    hasLeadMagnet:       r.has_lead_magnet    || '',

    // OPERATIONS
    businessWithoutYou: r.business_without_you || '',
    writtenProcedures:  r.written_procedures   || '',
    repeatPurchases:    r.repeat_purchases     || '',
    hasUpsells:         r.has_upsells          || '',
    trackNumbers:       r.track_numbers        || '',
    profitMargin:       r.profit_margin        || '',
    hoursPerWeek:       r.hours_per_week       || '',
    timeOnVsIn:         r.time_on_vs_in        || '',

    // FINAL
    topChallenge:    r.top_challenge     || '',
    oneThingToFix:   r.one_thing_to_fix  || '',
    twelveMonthGoal: r.twelve_month_goal || '',

    // AI Results
    scores: {
      who:        Number(r.score_who        || scores['WHO (Market)']                || 0),
      what:       Number(r.score_what       || scores['WHAT (Offer)']               || 0),
      sell:       Number(r.score_sell       || scores['HOW YOU SELL (Conversion)']  || 0),
      traffic:    Number(r.score_traffic    || scores['HOW THEY FIND YOU (Traffic)']|| 0),
      operations: Number(r.score_operations || scores['HOW YOU DELIVER (Operations)']|| 0),
    },
    primaryConstraint:   r.primary_constraint   || '',
    primaryScore:        Number(r.primary_score || 0),
    secondaryConstraint: r.secondary_constraint || '',
    secondaryScore:      Number(r.secondary_score || 0),
    confidence:          Number(r.confidence || 0),
    reasoning:           r.reasoning || '',
    evidencePoints:      Array.isArray(evidencePoints) ? evidencePoints : [],

    revenueImpact: {
      currentMonthly:        Number(r.current_monthly_revenue  || revenueImpact.currentMonthly        || 0),
      potentialMonthly:      Number(r.potential_monthly_revenue|| revenueImpact.potentialMonthly      || 0),
      monthlyOpportunityCost:Number(r.monthly_opportunity_cost || revenueImpact.monthlyOpportunityCost|| 0),
      yearlyOpportunityCost: Number(r.yearly_opportunity_cost  || revenueImpact.yearlyOpportunityCost || 0),
      explanation:           r.revenue_impact_explanation || revenueImpact.explanation || '',
    },

    quickWin: {
      action: r.quick_win_action || quickWin.action || '',
      impact: r.quick_win_impact || quickWin.impact || '',
      time:   r.quick_win_time   || quickWin.time   || '',
    },

    // Meta
    status:      r.status       || 'nurturing',
    dashboardId: r.dashboard_id || '',
    supabaseId:  String(r.id    || ''),
    submittedAt: r.created_at   ? new Date(r.created_at).toISOString() : new Date().toISOString(),
  }
}

// ── Sanity mutation API ───────────────────────────────────────────
const SANITY_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`

async function importBatch(documents) {
  const mutations = documents.map(doc => ({ create: doc }))

  const res = await fetch(SANITY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(`Sanity API error ${res.status}: ${JSON.stringify(result)}`)
  }

  return result
}

// ── Run ───────────────────────────────────────────────────────────
const documents = rows.map(mapRow)

console.log(`Importing ${documents.length} document(s) into Sanity...`)

try {
  const result = await importBatch(documents)
  const created = result.results?.filter(r => r.operation === 'create').length ?? documents.length
  console.log(`Done! ${created} document(s) created in Sanity.`)
  if (result.results) {
    result.results.forEach((r, i) => {
      console.log(`  [${i + 1}] ${r.operation} → ${r.id}`)
    })
  }
} catch (err) {
  console.error('Import failed:', err.message)
  process.exit(1)
}
