// app/admin/audits/page.tsx
"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
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
  businessName: string
  ownerName: string
  email: string
  phone: string
  industry: string
  monthlyRevenue: number
  scores: {
    who: number
    what: number
    sell: number
    traffic: number
    operations: number
  }
  primaryConstraint: string
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
  dashboardId: string
  submittedAt: string
}

type TimeFilter = "all" | "today" | "this_week" | "this_month" | "last_month" | "this_year" | "last_year"
type SortField = "submittedAt" | "businessName" | "primaryConstraint" | "yearlyOpportunityCost" | "status"
type SortDir = "asc" | "desc"

// ─── Helpers ─────────────────────────────────────────────────────
const SLE_TO_USD_RATE = 22500

function formatLeones(value: number | undefined) {
  if (!value) return "Le 0"
  if (value >= 1_000_000) return `Le ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `Le ${(value / 1_000).toFixed(0)}K`
  return `Le ${value.toLocaleString()}`
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
    case "last_year": {
      return { start: new Date(now.getFullYear() - 1, 0, 1), end: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59) }
    }
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

// ─── Export Helpers ───────────────────────────────────────────────
async function exportToPDF(audits: Audit[]) {
  const { generatePDFBlob } = await import("@/lib/generate-pdf")

  if (audits.length === 1) {
    const a = audits[0]
    const blob = await generatePDFBlob(mapAuditToPDFData(a))
    downloadBlob(blob, `${(a.businessName || "Audit").replace(/\s+/g, "-")}-Audit.pdf`)
  } else {
    for (const a of audits) {
      const blob = await generatePDFBlob(mapAuditToPDFData(a))
      downloadBlob(blob, `${(a.businessName || "Audit").replace(/\s+/g, "-")}-Audit.pdf`)
      await new Promise((r) => setTimeout(r, 300))
    }
  }
}

function mapAuditToPDFData(a: Audit) {
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
      "WHO (Market)": a.scores?.who || 0,
      "WHAT (Offer)": a.scores?.what || 0,
      "HOW YOU SELL (Conversion)": a.scores?.sell || 0,
      "HOW THEY FIND YOU (Traffic)": a.scores?.traffic || 0,
      "HOW YOU DELIVER (Operations)": a.scores?.operations || 0,
    },
    evidence_points: a.evidencePoints || [],
    revenue_impact: a.revenueImpact || {
      currentMonthly: 0,
      potentialMonthly: 0,
      monthlyOpportunityCost: 0,
      yearlyOpportunityCost: 0,
      explanation: "",
    },
    quick_win: a.quickWin || { action: "", impact: "", time: "" },
  }
}

function exportToSheet(audits: Audit[]) {
  import("xlsx").then((XLSX) => {
    const rows = audits.map((a) => ({
      "Business Name": a.businessName,
      Owner: a.ownerName,
      Email: a.email,
      Phone: a.phone,
      Industry: a.industry,
      Status: a.status,
      Constraint: a.primaryConstraint,
      "Constraint Score": a.primaryScore,
      Confidence: a.confidence,
      "WHO Score": a.scores?.who,
      "WHAT Score": a.scores?.what,
      "SELL Score": a.scores?.sell,
      "TRAFFIC Score": a.scores?.traffic,
      "OPS Score": a.scores?.operations,
      "Current Monthly (Le)": a.revenueImpact?.currentMonthly,
      "Potential Monthly (Le)": a.revenueImpact?.potentialMonthly,
      "Monthly Opp. Cost (Le)": a.revenueImpact?.monthlyOpportunityCost,
      "Yearly Opp. Cost (Le)": a.revenueImpact?.yearlyOpportunityCost,
      "Yearly Opp. Cost (USD)": a.revenueImpact?.yearlyOpportunityCost
        ? Math.round(a.revenueImpact.yearlyOpportunityCost / SLE_TO_USD_RATE)
        : 0,
      "Quick Win": a.quickWin?.action,
      Reasoning: a.reasoning,
      "Submitted At": a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : "",
    }))

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Audit Submissions")

    // Auto-size columns
    const colWidths = Object.keys(rows[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...rows.map((r) => String((r as Record<string, unknown>)[key] || "").length)).toString().length + 2,
    }))
    ws["!cols"] = colWidths

    const filename = audits.length === 1
      ? `${(audits[0].businessName || "Audit").replace(/\s+/g, "-")}-Audit.xlsx`
      : `Audit-Submissions-Export-${new Date().toISOString().slice(0, 10)}.xlsx`

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

// ─── Detail Panel ────────────────────────────────────────────────
function AuditDetailPanel({ audit, onClose }: { audit: Audit; onClose: () => void }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format: "pdf" | "sheet") => {
    setExporting(true)
    try {
      if (format === "pdf") await exportToPDF([audit])
      else exportToSheet([audit])
    } finally {
      setExporting(false)
    }
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
            <h2 className="text-xl font-bold text-gray-900">{audit.businessName}</h2>
            <p className="text-sm text-gray-500">{audit.ownerName} &middot; {audit.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Export as PDF"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleExport("sheet")}
              disabled={exporting}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Export as Spreadsheet"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
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
                    (~${audit.revenueImpact?.yearlyOpportunityCost ? Math.round(audit.revenueImpact.yearlyOpportunityCost / SLE_TO_USD_RATE).toLocaleString() : 0} USD)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning */}
          {audit.reasoning && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Reasoning</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{audit.reasoning}</p>
            </div>
          )}

          {/* Evidence */}
          {audit.evidencePoints && audit.evidencePoints.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Evidence</h3>
              <ul className="space-y-2">
                {audit.evidencePoints.map((point, i) => (
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

  // ── Fetch data ──
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

  useEffect(() => {
    fetchAudits()
  }, [fetchAudits])

  // ── Filter + Sort ──
  const filteredAudits = useMemo(() => {
    let result = [...audits]

    // Search
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

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter)
    }

    // Time filter
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

    // Custom date range
    if (showDateRange && dateFrom) {
      const from = new Date(dateFrom)
      result = result.filter((a) => a.submittedAt && new Date(a.submittedAt) >= from)
    }
    if (showDateRange && dateTo) {
      const to = new Date(dateTo + "T23:59:59")
      result = result.filter((a) => a.submittedAt && new Date(a.submittedAt) <= to)
    }

    // Sort
    result.sort((a, b) => {
      let valA: string | number = ""
      let valB: string | number = ""

      switch (sortField) {
        case "submittedAt":
          valA = a.submittedAt || ""
          valB = b.submittedAt || ""
          break
        case "businessName":
          valA = (a.businessName || "").toLowerCase()
          valB = (b.businessName || "").toLowerCase()
          break
        case "primaryConstraint":
          valA = (a.primaryConstraint || "").toLowerCase()
          valB = (b.primaryConstraint || "").toLowerCase()
          break
        case "yearlyOpportunityCost":
          valA = a.revenueImpact?.yearlyOpportunityCost || 0
          valB = b.revenueImpact?.yearlyOpportunityCost || 0
          break
        case "status":
          valA = a.status || ""
          valB = b.status || ""
          break
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1
      if (valA > valB) return sortDir === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [audits, searchQuery, statusFilter, timeFilter, sortField, sortDir, showDateRange, dateFrom, dateTo])

  // ── Selection ──
  const allSelected = filteredAudits.length > 0 && filteredAudits.every((a) => selectedIds.has(a._id))

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredAudits.map((a) => a._id)))
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const selectedAudits = audits.filter((a) => selectedIds.has(a._id))

  // ── Sort toggle ──
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  // ── Bulk export ──
  const handleBulkExport = async (format: "pdf" | "sheet") => {
    const targets = selectedAudits.length > 0 ? selectedAudits : filteredAudits
    if (targets.length === 0) return
    setBulkExporting(true)
    try {
      if (format === "pdf") await exportToPDF(targets)
      else exportToSheet(targets)
    } finally {
      setBulkExporting(false)
    }
  }

  // ── Stats ──
  const stats = useMemo(() => {
    const total = filteredAudits.length
    const pending = filteredAudits.filter((a) => a.status === "pending_contact").length
    const nurturing = filteredAudits.filter((a) => a.status === "nurturing").length
    const contacted = filteredAudits.filter((a) => a.status === "contacted").length
    const converted = filteredAudits.filter((a) => a.status === "converted").length
    return { total, pending, nurturing, contacted, converted }
  }, [filteredAudits])

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Audit Submissions</h1>
              <p className="text-sm text-gray-500 mt-1">
                {stats.total} submission{stats.total !== 1 ? "s" : ""}
                {selectedIds.size > 0 && (
                  <span className="text-blue-600 ml-2">&middot; {selectedIds.size} selected</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchAudits}
                disabled={loading}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Stats bar */}
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
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

            {/* Time filter */}
            <div className="flex gap-1 flex-wrap">
              {TIME_FILTERS.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => { setTimeFilter(tf.value); setShowDateRange(false) }}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    timeFilter === tf.value && !showDateRange
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
              <button
                onClick={() => { setShowDateRange(!showDateRange); setTimeFilter("all") }}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                  showDateRange ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Calendar className="w-3 h-3" />
                Range
              </button>
            </div>

            {/* Status filter */}
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

          {/* Date range picker */}
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
                <button
                  onClick={() => { setDateFrom(""); setDateTo("") }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Bulk actions */}
          {(selectedIds.size > 0 || filteredAudits.length > 0) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Export {selectedIds.size > 0 ? `${selectedIds.size} selected` : `all ${filteredAudits.length}`}:
              </span>
              <button
                onClick={() => handleBulkExport("pdf")}
                disabled={bulkExporting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <FileText className="w-3 h-3" />
                PDF
              </button>
              <button
                onClick={() => handleBulkExport("sheet")}
                disabled={bulkExporting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <FileSpreadsheet className="w-3 h-3" />
                Spreadsheet
              </button>
              {bulkExporting && <span className="text-xs text-blue-600">Exporting...</span>}
            </div>
          )}
        </div>

        {/* Table */}
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
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-3 py-3 text-left">
                      <button onClick={() => handleSort("businessName")} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                        Business
                        {sortField === "businessName" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                      </button>
                    </th>
                    <th className="px-3 py-3 text-left">
                      <button onClick={() => handleSort("primaryConstraint")} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                        Constraint
                        {sortField === "primaryConstraint" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                      </button>
                    </th>
                    <th className="px-3 py-3 text-left">
                      <button onClick={() => handleSort("yearlyOpportunityCost")} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                        Opp. Cost/yr
                        {sortField === "yearlyOpportunityCost" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                      </button>
                    </th>
                    <th className="px-3 py-3 text-left">
                      <button onClick={() => handleSort("status")} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                        Status
                        {sortField === "status" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                      </button>
                    </th>
                    <th className="px-3 py-3 text-left">
                      <button onClick={() => handleSort("submittedAt")} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                        Date
                        {sortField === "submittedAt" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
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
                      className={`group hover:bg-blue-50/40 transition-colors cursor-pointer ${
                        selectedIds.has(audit._id) ? "bg-blue-50/60" : ""
                      }`}
                      onClick={() => setShowDetail(audit)}
                    >
                      <td className="pl-4 pr-2 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(audit._id)}
                          onChange={() => toggleSelect(audit._id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm font-medium text-gray-900">{audit.businessName || "—"}</div>
                        <div className="text-xs text-gray-500">{audit.ownerName} &middot; {audit.email}</div>
                      </td>
                      <td className="px-3 py-3">
                        <ConstraintTag constraint={audit.primaryConstraint} />
                        {audit.primaryScore > 0 && (
                          <span className="ml-1.5 text-xs text-gray-400">{audit.primaryScore}/10</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm font-medium text-red-600">
                          {formatLeones(audit.revenueImpact?.yearlyOpportunityCost)}
                        </div>
                        {audit.revenueImpact?.yearlyOpportunityCost > 0 && (
                          <div className="text-xs text-gray-400">
                            ~${Math.round(audit.revenueImpact.yearlyOpportunityCost / SLE_TO_USD_RATE).toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={audit.status} />
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-500">
                        {formatDate(audit.submittedAt)}
                      </td>
                      <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setShowDetail(audit)}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              await exportToPDF([audit])
                            }}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                            title="Export as PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => exportToSheet([audit])}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                            title="Export as Spreadsheet"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                          </button>
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

      {/* Detail panel */}
      {showDetail && <AuditDetailPanel audit={showDetail} onClose={() => setShowDetail(null)} />}
    </div>
  )
}
