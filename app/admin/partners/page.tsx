// app/admin/partners/page.tsx
"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import {
  Search, RefreshCw, ChevronDown, ChevronUp, X, Calendar,
  Eye, Download, Building2, MapPin, Mail, Phone, Globe, Trash2,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Partner {
  id: string
  created_at: string
  updated_at: string | null
  business_location: string | null
  business_type: string | null
  business_description: string | null
  annual_revenue: number | null
  ebitda_12_months: number | null
  ebitda_3_months: number | null
  heard_about: string | null
  ownership_decision: string | null
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  company_name: string | null
  company_website: string | null
  portfolio_consideration: string | null
  terms_accepted: boolean | null
  source: string | null
  status: string
  admin_notes: string | null
  ip_address: string | null
  user_agent: string | null
}

type TimeFilter = "all" | "today" | "this_week" | "this_month" | "last_month" | "this_year"
type SortField = "created_at" | "company_name" | "first_name" | "status" | "annual_revenue"
type SortDir = "asc" | "desc"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function displayName(p: Partner): string {
  const name = `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim()
  return name || p.email || "—"
}

function formatDate(str: string | null) {
  if (!str) return "—"
  return new Date(str).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function formatDatetime(str: string | null) {
  if (!str) return "—"
  return new Date(str).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function formatMoney(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—"
  return new Intl.NumberFormat("en-SL", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value)
}

function getTimeRange(filter: TimeFilter): { start: Date; end: Date } | null {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  switch (filter) {
    case "today": return { start: today, end: now }
    case "this_week": {
      const s = new Date(today); s.setDate(today.getDate() - today.getDay())
      return { start: s, end: now }
    }
    case "this_month": return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now }
    case "last_month": return {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
    }
    case "this_year": return { start: new Date(now.getFullYear(), 0, 1), end: now }
    default: return null
  }
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  new:       { label: "New",       bg: "bg-blue-50",  text: "text-blue-700",  dot: "bg-blue-500" },
  reviewing: { label: "Reviewing", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  contacted: { label: "Contacted", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  accepted:  { label: "Accepted",  bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  rejected:  { label: "Rejected",  bg: "bg-red-50",   text: "text-red-700",   dot: "bg-red-500" },
  on_hold:   { label: "On Hold",   bg: "bg-gray-100", text: "text-gray-600",  dot: "bg-gray-400" },
}

const STATUS_OPTIONS = Object.keys(STATUS)

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS[status] ?? { label: status, bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ─── Export CSV ───────────────────────────────────────────────────────────────

function exportCSV(rows: Partner[]) {
  const cols: (keyof Partner)[] = [
    "id", "first_name", "last_name", "email", "phone",
    "company_name", "company_website", "business_location", "business_type",
    "business_description", "annual_revenue", "ebitda_12_months", "ebitda_3_months",
    "heard_about", "ownership_decision", "portfolio_consideration",
    "status", "source", "created_at", "admin_notes",
  ]
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
  const header = cols.join(",")
  const body = rows.map(r => cols.map(c => escape(r[c])).join(",")).join("\n")
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `partners-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  partner,
  onClose,
  onUpdate,
  onDelete,
}: {
  partner: Partner
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Partner>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [status, setStatus] = useState(partner.status)
  const [notes, setNotes] = useState(partner.admin_notes ?? "")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setStatus(partner.status)
    setNotes(partner.admin_notes ?? "")
    setConfirmDelete(false)
  }, [partner])

  async function handleSave() {
    setSaving(true)
    await onUpdate(partner.id, { status, admin_notes: notes })
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    await onDelete(partner.id)
    setDeleting(false)
  }

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</dt>
      <dd className="text-sm text-gray-800 break-words">{value || <span className="text-gray-300">—</span>}</dd>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{displayName(partner)}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {partner.company_name || "No company name"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={partner.status} />
            <span className="text-xs text-gray-400">Applied {formatDatetime(partner.created_at)}</span>
          </div>

          {/* Contact */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Contact
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="First Name" value={partner.first_name} />
              <Field label="Last Name" value={partner.last_name} />
              <div className="col-span-2">
                <Field
                  label="Email"
                  value={
                    <a href={`mailto:${partner.email}`} className="text-[#177fc9] hover:underline">
                      {partner.email}
                    </a>
                  }
                />
              </div>
              <Field label="Phone" value={partner.phone} />
              <Field label="Source" value={partner.source} />
            </dl>
          </section>

          {/* Business */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Business
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Company" value={partner.company_name} />
              <Field label="Location" value={partner.business_location} />
              <Field label="Type" value={partner.business_type} />
              <Field label="Can allocate equity?" value={partner.ownership_decision} />
              <div className="col-span-2">
                <Field
                  label="Website"
                  value={
                    partner.company_website ? (
                      <a
                        href={partner.company_website.startsWith("http") ? partner.company_website : `https://${partner.company_website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#177fc9] hover:underline"
                      >
                        {partner.company_website}
                      </a>
                    ) : null
                  }
                />
              </div>
              <div className="col-span-2">
                <Field label="Description" value={partner.business_description} />
              </div>
            </dl>
          </section>

          {/* Financials */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Financials (SLE)
            </h3>
            <dl className="grid grid-cols-3 gap-4">
              <Field label="Annual Revenue" value={formatMoney(partner.annual_revenue)} />
              <Field label="EBITDA 12 mo" value={formatMoney(partner.ebitda_12_months)} />
              <Field label="EBITDA 3 mo" value={formatMoney(partner.ebitda_3_months)} />
            </dl>
          </section>

          {/* Application */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Application
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Heard about us" value={partner.heard_about} />
              <Field label="Portfolio interest" value={partner.portfolio_consideration} />
              <Field label="Terms accepted" value={partner.terms_accepted ? "Yes" : "No"} />
            </dl>
          </section>

          {/* Status + notes */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Admin
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#177fc9]"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{STATUS[s].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Internal notes…"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#177fc9] resize-none"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving || deleting}
                className="w-full py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>

              <div className="pt-4 border-t border-gray-100">
                {confirmDelete ? (
                  <div className="space-y-2">
                    <p className="text-sm text-red-600 font-medium">
                      Permanently delete this application? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleting ? "Deleting…" : "Yes, delete"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        disabled={deleting}
                        className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleDelete}
                    disabled={saving || deleting}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete application
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")
  const [showDateRange, setShowDateRange] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const [detail, setDetail] = useState<Partner | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/partners")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load")
      setPartners(data.partners || [])
    } catch (err) {
      console.error("Failed to fetch partners:", err)
      setError(err instanceof Error ? err.message : "Failed to load partners")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = useMemo(() => {
    let result = [...partners]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        displayName(p).toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.company_name ?? "").toLowerCase().includes(q) ||
        (p.phone ?? "").includes(q) ||
        (p.business_type ?? "").toLowerCase().includes(q) ||
        (p.business_location ?? "").toLowerCase().includes(q)
      )
    }

    if (statusFilter !== "all") {
      result = result.filter(p => p.status === statusFilter)
    }

    if (timeFilter !== "all" && !showDateRange) {
      const range = getTimeRange(timeFilter)
      if (range) {
        result = result.filter(p => {
          const d = new Date(p.created_at)
          return d >= range.start && d <= range.end
        })
      }
    }

    if (showDateRange) {
      if (dateFrom) result = result.filter(p => new Date(p.created_at) >= new Date(dateFrom))
      if (dateTo) result = result.filter(p => new Date(p.created_at) <= new Date(dateTo + "T23:59:59"))
    }

    result.sort((a, b) => {
      let va: string | number = ""
      let vb: string | number = ""
      switch (sortField) {
        case "company_name":
          va = (a.company_name ?? "").toLowerCase()
          vb = (b.company_name ?? "").toLowerCase()
          break
        case "first_name":
          va = displayName(a).toLowerCase()
          vb = displayName(b).toLowerCase()
          break
        case "status":
          va = a.status
          vb = b.status
          break
        case "annual_revenue":
          va = a.annual_revenue ?? 0
          vb = b.annual_revenue ?? 0
          break
        default:
          va = a.created_at
          vb = b.created_at
          break
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1
      if (va > vb) return sortDir === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [partners, search, statusFilter, timeFilter, showDateRange, dateFrom, dateTo, sortField, sortDir])

  const stats = useMemo(() => {
    const all = partners
    return {
      total: all.length,
      new: all.filter(p => p.status === "new").length,
      reviewing: all.filter(p => p.status === "reviewing").length,
      contacted: all.filter(p => p.status === "contacted").length,
      accepted: all.filter(p => p.status === "accepted").length,
    }
  }, [partners])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => (d === "asc" ? "desc" : "asc"))
    else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
  }

  const updatePartner = useCallback(async (id: string, updates: Partial<Partner>) => {
    const res = await fetch("/api/admin/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates }),
    })
    if (res.ok) {
      const { partner: updated } = await res.json()
      setPartners(prev => prev.map(p => (p.id === id ? updated : p)))
      if (detail?.id === id) setDetail(updated)
    } else {
      alert("Failed to update partner")
    }
  }, [detail])

  const deletePartner = useCallback(async (id: string) => {
    const res = await fetch("/api/admin/partners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setPartners(prev => prev.filter(p => p.id !== id))
      setDetail(null)
    } else {
      alert("Failed to delete partner")
    }
  }, [])

  const TIME_OPTIONS: { value: TimeFilter; label: string }[] = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "this_year", label: "This Year" },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Partners</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Portfolio company applications from the partner form
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportCSV(filtered)}
                disabled={filtered.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
            {[
              { label: "Total", value: stats.total },
              { label: "New", value: stats.new },
              { label: "Reviewing", value: stats.reviewing },
              { label: "Contacted", value: stats.contacted },
              { label: "Accepted", value: stats.accepted },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                <div className="text-lg font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, company…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#177fc9]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#177fc9]"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{STATUS[s].label}</option>
            ))}
          </select>

          <select
            value={showDateRange ? "custom" : timeFilter}
            onChange={e => {
              if (e.target.value === "custom") {
                setShowDateRange(true)
              } else {
                setShowDateRange(false)
                setTimeFilter(e.target.value as TimeFilter)
              }
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#177fc9]"
          >
            {TIME_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
            <option value="custom">Custom Range</option>
          </select>

          {showDateRange && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
              />
              <span className="text-gray-400 text-sm">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          )}

          <span className="text-xs text-gray-400 ml-auto">
            {filtered.length} of {partners.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
              {error}
              <p className="text-xs mt-1 text-red-500">
                If this is a new table, run <code className="font-mono">partners_schema.sql</code> in Supabase first.
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              Loading partners…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">No partner applications found</p>
              <p className="text-xs text-gray-400 mt-1">
                Applications from the partner form will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-left">
                      <th className="px-4 py-3">
                        <button
                          onClick={() => handleSort("first_name")}
                          className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-800"
                        >
                          Contact <SortIcon field="first_name" />
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button
                          onClick={() => handleSort("company_name")}
                          className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-800"
                        >
                          Company <SortIcon field="company_name" />
                        </button>
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-500">Location / Type</th>
                      <th className="px-4 py-3">
                        <button
                          onClick={() => handleSort("annual_revenue")}
                          className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-800"
                        >
                          Revenue <SortIcon field="annual_revenue" />
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button
                          onClick={() => handleSort("status")}
                          className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-800"
                        >
                          Status <SortIcon field="status" />
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button
                          onClick={() => handleSort("created_at")}
                          className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-800"
                        >
                          Applied <SortIcon field="created_at" />
                        </button>
                      </th>
                      <th className="px-4 py-3 w-12" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(p => (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                        onClick={() => setDetail(p)}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{displayName(p)}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {p.email}
                          </div>
                          {p.phone && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Phone className="w-3 h-3" />
                              {p.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{p.company_name || "—"}</div>
                          {p.company_website && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                              <Globe className="w-3 h-3" />
                              <span className="truncate max-w-[160px]">{p.company_website}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-gray-700">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {p.business_location || "—"}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">{p.business_type || "—"}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 tabular-nums">
                          {formatMoney(p.annual_revenue)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {formatDate(p.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              setDetail(p)
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {detail && (
        <DetailPanel
          partner={detail}
          onClose={() => setDetail(null)}
          onUpdate={updatePartner}
          onDelete={deletePartner}
        />
      )}
    </div>
  )
}
