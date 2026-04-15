import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// ── Auth guard (same pattern as other admin routes) ──────────────────────────
async function isAuthorised(): Promise<boolean> {
  const jar = await cookies()
  const token = jar.get("admin-auth")?.value
  const secret = process.env.ADMIN_AUTH_SECRET ?? "startup-admin-2026"
  return token === secret
}

// ── PostHog HogQL helper ──────────────────────────────────────────────────────
async function hogql(query: string) {
  const key = process.env.POSTHOG_PERSONAL_API_KEY
  const projectId = process.env.POSTHOG_PROJECT_ID
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com"

  if (!key || key.startsWith("phx_REPLACE") || !projectId || projectId.startsWith("REPLACE")) {
    return null // env vars not configured yet
  }

  const res = await fetch(`${host}/api/projects/${projectId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    next: { revalidate: 300 }, // cache 5 minutes
  })

  if (!res.ok) return null
  const json = await res.json()
  // HogQL response shape: { results: [...rows], columns: [...names] }
  return json as { results: unknown[][]; columns: string[] }
}

// ── Row → object helper ───────────────────────────────────────────────────────
function rowsToObjects(data: { results: unknown[][]; columns: string[] } | null) {
  if (!data) return []
  return data.results.map(row =>
    Object.fromEntries(data.columns.map((col, i) => [col, row[i]]))
  )
}

// ── GET /api/admin/analytics ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!await isAuthorised()) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const [overview, sectionViews, abandonments, dailyStarts] = await Promise.all([

    // 1. High-level overview counts this month
    hogql(`
      SELECT
        countIf(event = 'audit_started')                          AS starts,
        countIf(event = 'audit_submitted')                        AS completions,
        countIf(event = 'audit_abandoned')                        AS abandonments,
        uniqIf(distinct_id, event = 'audit_started')              AS unique_starters,
        uniqIf(distinct_id, event = 'audit_submitted')            AS unique_completers
      FROM events
      WHERE timestamp >= toStartOfMonth(now())
        AND event IN ('audit_started','audit_submitted','audit_abandoned')
    `),

    // 2. How many unique users viewed each section (ordered by section progression)
    hogql(`
      SELECT
        properties.section                              AS section,
        uniq(distinct_id)                               AS unique_viewers,
        count()                                         AS total_views
      FROM events
      WHERE event = 'audit_screen_viewed'
        AND timestamp >= toStartOfMonth(now())
        AND properties.section IS NOT NULL
      GROUP BY section
      ORDER BY unique_viewers DESC
    `),

    // 3. Where people abandoned — by section
    hogql(`
      SELECT
        properties.section                              AS section,
        count()                                         AS abandoned,
        avg(toFloat64OrNull(properties.progress_pct))  AS avg_progress_pct,
        avg(toFloat64OrNull(properties.time_on_form_seconds)) AS avg_seconds
      FROM events
      WHERE event = 'audit_abandoned'
        AND timestamp >= toStartOfMonth(now())
      GROUP BY section
      ORDER BY abandoned DESC
    `),

    // 4. Daily audit starts for the last 30 days (sparkline data)
    hogql(`
      SELECT
        toDate(timestamp)   AS day,
        count()             AS starts
      FROM events
      WHERE event = 'audit_started'
        AND timestamp >= now() - INTERVAL 30 DAY
      GROUP BY day
      ORDER BY day ASC
    `),
  ])

  const overviewRow = overview?.results?.[0]
  const overviewCols = overview?.columns ?? []
  const toNum = (v: unknown) => (v == null ? 0 : Number(v))

  const summaryIdx = (col: string) => overviewCols.indexOf(col)
  const summary = overviewRow
    ? {
        starts:            toNum(overviewRow[summaryIdx("starts")]),
        completions:       toNum(overviewRow[summaryIdx("completions")]),
        abandonments:      toNum(overviewRow[summaryIdx("abandonments")]),
        unique_starters:   toNum(overviewRow[summaryIdx("unique_starters")]),
        unique_completers: toNum(overviewRow[summaryIdx("unique_completers")]),
        completion_rate:   overviewRow[summaryIdx("starts")]
          ? Math.round(
              (toNum(overviewRow[summaryIdx("completions")]) /
                toNum(overviewRow[summaryIdx("starts")])) *
                100
            )
          : 0,
      }
    : null

  return NextResponse.json({
    summary,
    sectionViews:  rowsToObjects(sectionViews),
    abandonments:  rowsToObjects(abandonments),
    dailyStarts:   rowsToObjects(dailyStarts),
    configured:    summary !== null,
  })
}
