// app/admin/kolat-books/page.tsx
"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import {
  Search, RefreshCw, ChevronDown, ChevronUp, X, Calendar,
  Eye, Download, BookOpen, Mail, Phone, MapPin, User, Trash2,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface KolatInquiry {
  id: string
  created_at: string
  updated_at: string | null
  business_name: string | null
  business_industry: string | null
  business_address: string | null
  business_email: string | null
  business_phone: string | null
  primary_contact: string | null
  contact_position: string | null
  contact_phone: string | null
  contact_email: string | null
  number_of_employees: string | null
  monthly_revenue: string | null
  bookkeeping_method: string | null
  current_bookkeeper: string | null
  financial_challenges: string | null
  services_interested: string[] | null
  communication_preference: string[] | null
  terms_accepted: boolean | null
  source: string | null
  status: string
  admin_notes: string | null
  ip_address: string | null
  user_agent: string | null
}

type TimeFilter = "all" | "today" | "this_week" | "this_month" | "last_month" | "this_year"
type SortField = "created_at" | "business_name" | "primary_contact" | "status" | "monthly_revenue"
type SortDir = "asc" | "desc"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function displayContact(i: KolatInquiry): string {
  return i.primary_contact?.trim() || i.contact_email || i.business_email || "—"
}

function displayEmail(i: KolatInquiry): string {
  return i.contact_email || i.business_email || "—"
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

function asList(v: string[] | null | undefined): string[] {
  return Array.isArray(v) ? v : []
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
  new:             { label: "New",             bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
  reviewing:       { label: "Reviewing",       bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500" },
  contacted:       { label: "Contacted",       bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  qualified:       { label: "Qualified",       bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  closed:          { label: "Closed",          bg: "bg-gray-100",  text: "text-gray-600",   dot: "bg-gray-400" },
  not_interested:  { label: "Not Interested",  bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500" },
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

function exportCSV(rows: KolatInquiry[]) {
  const cols = [
    "id", "business_name", "business_industry", "business_email", "business_phone",
    "primary_contact", "contact_position", "contact_email", "contact_phone",
    "number_of_employees", "monthly_revenue", "bookkeeping_method", "current_bookkeeper",
    "financial_challenges", "services_interested", "communication_preference",
    "status", "source", "created_at", "admin_notes",
  ] as const

  const escape = (v: unknown) => {
    if (Array.isArray(v)) return `"${v.join("; ").replace(/"/g, '""')}"`
    return `"${String(v ?? "").replace(/"/g, '""')}"`
  }
  const header = cols.join(",")
  const body = rows.map(r => cols.map(c => escape(r[c])).join(",")).join("\n")
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `kolat-books-inquiries-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  inquiry,
  onClose,
  onUpdate,
  onDelete,
}: {
  inquiry: KolatInquiry
  onClose: () => void
  onUpdate: (id: string, updates: Partial<KolatInquiry>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [status, setStatus] = useState(inquiry.status)
  const [notes, setNotes] = useState(inquiry.admin_notes ?? "")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setStatus(inquiry.status)
    setNotes(inquiry.admin_notes ?? "")
    setConfirmDelete(false)
  }, [inquiry])

  async function handleSave() {
    setSaving(true)
    await onUpdate(inquiry.id, { status, admin_notes: notes })
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    await onDelete(inquiry.id)
    setDeleting(false)
  }

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</dt>
      <dd className="text-sm text-gray-800 break-words">{value || <span className="text-gray-300">—</span>}</dd>
    </div>
  )

  const services = asList(inquiry.services_interested)
  const prefs = asList(inquiry.communication_preference)

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{inquiry.business_name || "Untitled business"}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{displayContact(inquiry)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={inquiry.status} />
            <span className="text-xs text-gray-400">Submitted {formatDatetime(inquiry.created_at)}</span>
          </div>

          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Business
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Business Name" value={inquiry.business_name} />
              <Field label="Industry" value={inquiry.business_industry} />
              <div className="col-span-2">
                <Field label="Address" value={inquiry.business_address} />
              </div>
              <Field
                label="Business Email"
                value={
                  inquiry.business_email ? (
                    <a href={`mailto:${inquiry.business_email}`} className="text-[#177fc9] hover:underline">
                      {inquiry.business_email}
                    </a>
                  ) : null
                }
              />
              <Field label="Business Phone" value={inquiry.business_phone} />
            </dl>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Primary Contact
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Name" value={inquiry.primary_contact} />
              <Field label="Position" value={inquiry.contact_position} />
              <Field
                label="Email"
                value={
                  inquiry.contact_email ? (
                    <a href={`mailto:${inquiry.contact_email}`} className="text-[#177fc9] hover:underline">
                      {inquiry.contact_email}
                    </a>
                  ) : null
                }
              />
              <Field label="Phone / WhatsApp" value={inquiry.contact_phone} />
            </dl>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Size & Revenue
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Employees" value={inquiry.number_of_employees} />
              <Field label="Monthly Revenue" value={inquiry.monthly_revenue} />
            </dl>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Bookkeeping Needs
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Current Method" value={inquiry.bookkeeping_method} />
              <Field label="Has Bookkeeper?" value={inquiry.current_bookkeeper} />
              <div className="col-span-2">
                <Field
                  label="Services Interested"
                  value={
                    services.length > 0 ? (
                      <ul className="list-disc list-inside space-y-0.5">
                        {services.map(s => <li key={s}>{s}</li>)}
                      </ul>
                    ) : null
                  }
                />
              </div>
              <div className="col-span-2">
                <Field
                  label="Communication Preference"
                  value={prefs.length > 0 ? prefs.join(", ") : null}
                />
              </div>
              <div className="col-span-2">
                <Field label="Financial Challenges" value={inquiry.financial_challenges} />
              </div>
              <Field label="Source" value={inquiry.source} />
              <Field label="Terms Accepted" value={inquiry.terms_accepted ? "Yes" : "No"} />
            </dl>
          </section>

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
                      Permanently delete this inquiry? This cannot be undone.
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
                    Delete inquiry
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

export default function AdminKolatBooksPage() {
  const [inquiries, setInquiries] = useState<KolatInquiry[]>([])
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

  const [detail, setDetail] = useState<KolatInquiry | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/kolat-books")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load")
      setInquiries(data.inquiries || [])
    } catch (err) {
      console.error("Failed to fetch Kolat Books inquiries:", err)
      setError(err instanceof Error ? err.message : "Failed to load inquiries")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = useMemo(() => {
    let result = [...inquiries]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(i =>
        (i.business_name ?? "").toLowerCase().includes(q) ||
        displayContact(i).toLowerCase().includes(q) ||
        displayEmail(i).toLowerCase().includes(q) ||
        (i.business_phone ?? "").includes(q) ||
        (i.contact_phone ?? "").includes(q) ||
        (i.business_industry ?? "").toLowerCase().includes(q) ||
        asList(i.services_interested).some(s => s.toLowerCase().includes(q))
      )
    }

    if (statusFilter !== "all") {
      result = result.filter(i => i.status === statusFilter)
    }

    if (timeFilter !== "all" && !showDateRange) {
      const range = getTimeRange(timeFilter)
      if (range) {
        result = result.filter(i => {
          const d = new Date(i.created_at)
          return d >= range.start && d <= range.end
        })
      }
    }

    if (showDateRange) {
      if (dateFrom) result = result.filter(i => new Date(i.created_at) >= new Date(dateFrom))
      if (dateTo) result = result.filter(i => new Date(i.created_at) <= new Date(dateTo + "T23:59:59"))
    }

    result.sort((a, b) => {
      let va: string | number = ""
      let vb: string | number = ""
      switch (sortField) {
        case "business_name":
          va = (a.business_name ?? "").toLowerCase()
          vb = (b.business_name ?? "").toLowerCase()
          break
        case "primary_contact":
          va = displayContact(a).toLowerCase()
          vb = displayContact(b).toLowerCase()
          break
        case "status":
          va = a.status
          vb = b.status
          break
        case "monthly_revenue":
          va = a.monthly_revenue ?? ""
          vb = b.monthly_revenue ?? ""
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
  }, [inquiries, search, statusFilter, timeFilter, showDateRange, dateFrom, dateTo, sortField, sortDir])

  const stats = useMemo(() => {
    const all = inquiries
    return {
      total: all.length,
      new: all.filter(i => i.status === "new").length,
      reviewing: all.filter(i => i.status === "reviewing").length,
      contacted: all.filter(i => i.status === "contacted").length,
      qualified: all.filter(i => i.status === "qualified").length,
    }
  }, [inquiries])

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

  const updateInquiry = useCallback(async (id: string, updates: Partial<KolatInquiry>) => {
    const res = await fetch("/api/admin/kolat-books", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates }),
    })
    if (res.ok) {
      const { inquiry: updated } = await res.json()
      setInquiries(prev => prev.map(i => (i.id === id ? updated : i)))
      if (detail?.id === id) setDetail(updated)
    } else {
      alert("Failed to update inquiry")
    }
  }, [detail])

  const deleteInquiry = useCallback(async (id: string) => {
    const res = await fetch("/api/admin/kolat-books", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setInquiries(prev => prev.filter(i => i.id !== id))
      setDetail(null)
    } else {
      alert("Failed to delete inquiry")
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
      <div className="flex-shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Kolat Books Inquiries</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Bookkeeping service inquiries from the Finance Freedom page
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

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
            {[
              { label: "Total", value: stats.total },
              { label: "New", value: stats.new },
              { label: "Reviewing", value: stats.reviewing },
              { label: "Contacted", value: stats.contacted },
              { label: "Qualified", value: stats.qualified },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                <div className="text-lg font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search business, contact, email…"
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
            {filtered.length} of {inquiries.length}
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
              {error}
              <p className="text-xs mt-1 text-red-500">
                If this is a new table, run <code className="font-mono">kolat_books_schema.sql</code> in Supabase first.
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              Loading inquiries…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">No Kolat Books inquiries found</p>
              <p className="text-xs text-gray-400 mt-1">
                Submissions from the bookkeeping form will appear here.
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
                          onClick={() => handleSort("business_name")}
                          className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-800"
                        >
                          Business <SortIcon field="business_name" />
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button
                          onClick={() => handleSort("primary_contact")}
                          className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-800"
                        >
                          Contact <SortIcon field="primary_contact" />
                        </button>
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-500">Services</th>
                      <th className="px-4 py-3">
                        <button
                          onClick={() => handleSort("monthly_revenue")}
                          className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-800"
                        >
                          Revenue <SortIcon field="monthly_revenue" />
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
                          Submitted <SortIcon field="created_at" />
                        </button>
                      </th>
                      <th className="px-4 py-3 w-12" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(i => {
                      const services = asList(i.services_interested)
                      return (
                        <tr
                          key={i.id}
                          className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                          onClick={() => setDetail(i)}
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{i.business_name || "—"}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{i.business_industry || "—"}</div>
                            {i.business_address && (
                              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate max-w-[180px]">{i.business_address}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 font-medium text-gray-800">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              {displayContact(i)}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {displayEmail(i)}
                            </div>
                            {(i.contact_phone || i.business_phone) && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Phone className="w-3 h-3" />
                                {i.contact_phone || i.business_phone}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {services.length === 0 ? (
                              <span className="text-gray-300">—</span>
                            ) : (
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {services.slice(0, 2).map(s => (
                                  <span
                                    key={s}
                                    className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded"
                                  >
                                    {s.length > 28 ? s.slice(0, 28) + "…" : s}
                                  </span>
                                ))}
                                {services.length > 2 && (
                                  <span className="text-[10px] text-gray-400">+{services.length - 2}</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700 text-xs">
                            {i.monthly_revenue || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={i.status} />
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {formatDate(i.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={e => {
                                e.stopPropagation()
                                setDetail(i)
                              }}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {detail && (
        <DetailPanel
          inquiry={detail}
          onClose={() => setDetail(null)}
          onUpdate={updateInquiry}
          onDelete={deleteInquiry}
        />
      )}
    </div>
  )
}
