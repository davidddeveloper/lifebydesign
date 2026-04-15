"use client"

import { useEffect, useState } from "react"
import {
  Users, TrendingUp, LogOut, CheckCircle2,
  AlertTriangle, RefreshCw, BarChart2,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

interface Summary {
  starts: number
  completions: number
  abandonments: number
  unique_starters: number
  unique_completers: number
  completion_rate: number
}

interface SectionRow {
  section: string
  unique_viewers: number
  total_views: number
}

interface AbandonRow {
  section: string
  abandoned: number
  avg_progress_pct: number
  avg_seconds: number
}

interface DayRow {
  day: string
  starts: number
}

interface AnalyticsData {
  summary: Summary | null
  sectionViews: SectionRow[]
  abandonments: AbandonRow[]
  dailyStarts: DayRow[]
  configured: boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString()
}

function fmtSeconds(s: number) {
  if (!s) return "—"
  const m = Math.floor(s / 60)
  const sec = Math.round(s % 60)
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, accent = false,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  accent?: boolean
}) {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#888] uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? "bg-[#1A1A1A]" : "bg-[#F5F5F5]"}`}>
          <Icon className={`w-4 h-4 ${accent ? "text-white" : "text-[#555]"}`} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-[#1A1A1A]">{value}</div>
        {sub && <div className="text-xs text-[#888] mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

// ── Sparkline (pure SVG, no library) ─────────────────────────────────────────

function Sparkline({ data }: { data: DayRow[] }) {
  if (!data.length) return <div className="h-16 flex items-center justify-center text-xs text-[#CCC]">No data yet</div>

  const vals = data.map(d => d.starts)
  const max = Math.max(...vals, 1)
  const W = 400
  const H = 60
  const pts = vals.map((v, i) => {
    const x = (i / Math.max(vals.length - 1, 1)) * W
    const y = H - (v / max) * H
    return `${x},${y}`
  })

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none">
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Drop-off bar ──────────────────────────────────────────────────────────────

function DropOffBar({ section, abandoned, max, avgSeconds }: {
  section: string
  abandoned: number
  max: number
  avgSeconds: number
}) {
  const pct = max > 0 ? (abandoned / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 text-xs text-[#555] truncate flex-shrink-0">{section}</div>
      <div className="flex-1 bg-[#F5F5F5] rounded-full h-2 overflow-hidden">
        <div className="h-full bg-[#1A1A1A] rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-[#888] w-8 text-right flex-shrink-0">{abandoned}</div>
      <div className="text-xs text-[#BBB] w-14 text-right flex-shrink-0">{fmtSeconds(avgSeconds)}</div>
    </div>
  )
}

// ── Funnel bars ───────────────────────────────────────────────────────────────

function FunnelBar({ section, viewers, max }: { section: string; viewers: number; max: number }) {
  const pct = max > 0 ? (viewers / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 text-xs text-[#555] truncate flex-shrink-0">{section}</div>
      <div className="flex-1 bg-[#F5F5F5] rounded-full h-2.5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "#1A1A1A" }} />
      </div>
      <div className="text-xs text-[#888] w-8 text-right flex-shrink-0">{viewers}</div>
    </div>
  )
}

// ── Not configured banner ─────────────────────────────────────────────────────

function NotConfigured() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-800">PostHog API keys not configured</p>
        <p className="text-xs text-amber-700 mt-1 leading-relaxed">
          Add <code className="bg-amber-100 px-1 rounded">POSTHOG_PERSONAL_API_KEY</code> and{" "}
          <code className="bg-amber-100 px-1 rounded">POSTHOG_PROJECT_ID</code> to your{" "}
          <code className="bg-amber-100 px-1 rounded">.env</code> file to see live data.
          Generate a personal API key at PostHog → Settings → Personal API Keys (scope:{" "}
          <em>read:query_and_events</em>).
        </p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function load() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch("/api/admin/analytics")
      if (!res.ok) throw new Error()
      setData(await res.json())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const s = data?.summary
  const maxViewers = Math.max(...(data?.sectionViews.map(r => r.unique_viewers) ?? [1]), 1)
  const maxAbandoned = Math.max(...(data?.abandonments.map(r => r.abandoned) ?? [1]), 1)

  // Section order mirrors the form flow
  const SECTION_ORDER = [
    "Business Info",
    "WHO — Your Market",
    "WHAT — Your Offer",
    "FIND YOU — Traffic",
    "SELL — Conversion",
    "DELIVER — Ops",
    "Final Questions",
  ]

  const sortedViews = [...(data?.sectionViews ?? [])].sort(
    (a, b) => SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section)
  )

  return (
    <div className="h-full overflow-auto bg-[#F7F7F7]">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Analytics</h1>
            <p className="text-sm text-[#888] mt-1">Constraint Audit — this month</p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] text-[#555] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Not configured */}
        {!loading && data && !data.configured && <NotConfigured />}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            Could not load analytics. Check that you are logged in and PostHog keys are set.
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E5E5E5] rounded-xl p-5 h-24 animate-pulse" />
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && s && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard label="Unique visitors" value={fmt(s.unique_starters)} sub="started the audit" icon={Users} accent />
            <StatCard label="Completions"     value={fmt(s.completions)}     sub="submitted the form"  icon={CheckCircle2} />
            <StatCard label="Completion rate" value={`${s.completion_rate}%`} sub="of starters finish"  icon={TrendingUp} />
            <StatCard label="Abandonments"    value={fmt(s.abandonments)}    sub="left before submitting" icon={LogOut} />
            <StatCard label="Total starts"    value={fmt(s.starts)}          sub="sessions this month" icon={BarChart2} />
            <StatCard label="Unique completers" value={fmt(s.unique_completers)} sub="distinct people done" icon={CheckCircle2} />
          </div>
        )}

        {/* Daily trend */}
        {!loading && data && data.dailyStarts.length > 0 && (
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Daily audit starts — last 30 days</h2>
            </div>
            <Sparkline data={data.dailyStarts} />
            <div className="flex justify-between text-[10px] text-[#BBB] mt-1">
              <span>{data.dailyStarts[0]?.day ?? ""}</span>
              <span>{data.dailyStarts[data.dailyStarts.length - 1]?.day ?? ""}</span>
            </div>
          </div>
        )}

        {/* Funnel — section reach */}
        {!loading && sortedViews.length > 0 && (
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#1A1A1A] mb-1">How far do people get?</h2>
            <p className="text-xs text-[#888] mb-5">Unique visitors who reached each section</p>
            <div className="space-y-3">
              {sortedViews.map(row => (
                <FunnelBar
                  key={row.section}
                  section={row.section}
                  viewers={row.unique_viewers}
                  max={maxViewers}
                />
              ))}
            </div>
            <div className="flex justify-end gap-6 mt-4 pt-4 border-t border-[#F0F0F0]">
              <span className="text-xs text-[#BBB]">← fewer people</span>
              <span className="text-xs text-[#BBB]">more people →</span>
            </div>
          </div>
        )}

        {/* Drop-off by section */}
        {!loading && data && data.abandonments.length > 0 && (
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#1A1A1A] mb-1">Where do people drop off?</h2>
            <p className="text-xs text-[#888] mb-5">
              Section where the user closed the form — ranked by count
            </p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-40 text-[10px] font-medium text-[#BBB] uppercase tracking-wide">Section</div>
              <div className="flex-1 text-[10px] font-medium text-[#BBB] uppercase tracking-wide">Drop-offs</div>
              <div className="w-8 text-[10px] font-medium text-[#BBB] uppercase tracking-wide text-right">#</div>
              <div className="w-14 text-[10px] font-medium text-[#BBB] uppercase tracking-wide text-right">Avg time</div>
            </div>
            <div className="space-y-3">
              {data.abandonments.map(row => (
                <DropOffBar
                  key={row.section}
                  section={row.section}
                  abandoned={row.abandoned}
                  max={maxAbandoned}
                  avgSeconds={row.avg_seconds}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && data?.configured && !s && (
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-10 text-center">
            <BarChart2 className="w-8 h-8 text-[#CCC] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#888]">No data yet this month</p>
            <p className="text-xs text-[#BBB] mt-1">Analytics will appear once visitors start using the audit form.</p>
          </div>
        )}

      </div>
    </div>
  )
}
