"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import {
  Search, RefreshCw, ChevronDown, ChevronUp, X, Calendar,
  Eye, Send, CheckCircle, Download, Users, DollarSign,
  Clock, AlertCircle, MoreHorizontal,
} from "lucide-react"
import { EmailEditor } from "@/components/admin/email-editor"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Registration {
  id: number                    // Supabase auto-id (used for email sending)
  registration_id: string       // Our 12-char ID
  first_name: string | null
  last_name: string | null
  full_name: string | null
  personal_email: string | null
  business_email: string | null
  phone: string | null
  country_code: string | null
  business_name: string | null
  website_link: string | null
  business_snapshot: string | null
  what_you_sell: string | null
  target_customers: string | null
  years_of_operations: string | null
  business_goal: string | null
  hear_about_us: string | null
  other_source: string | null
  workshop_title: string | null
  workshop_price: number | null
  status: string
  current_step: number | null
  checkout_session_id: string | null
  payment_completed_at: string | null
  submitted_at: string | null
  created_at: string
  updated_at: string | null
  ip_address: string | null
  notes: string | null
}

type TimeFilter = "all" | "today" | "this_week" | "this_month" | "last_month" | "this_year"
type TypeFilter = "all" | "workshop" | "vip"
type SortField = "created_at" | "full_name" | "business_name" | "status" | "workshop_price" | "payment_completed_at"
type SortDir = "asc" | "desc"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function displayName(r: Registration): string {
  return r.full_name || `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "—"
}

function displayEmail(r: Registration): string {
  return r.personal_email || r.business_email || "—"
}

function formatDate(str: string | null) {
  if (!str) return "—"
  return new Date(str).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function formatDatetime(str: string | null) {
  if (!str) return "—"
  return new Date(str).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
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
  completed:       { label: "Paid",            bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  pending_payment: { label: "Pending Payment", bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500" },
  in_progress:     { label: "In Progress",     bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"  },
  failed:          { label: "Failed",          bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500"   },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS[status] ?? { label: status, bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ─── Export to CSV ────────────────────────────────────────────────────────────

function exportCSV(rows: Registration[]) {
  const cols: (keyof Registration)[] = [
    "registration_id", "full_name", "first_name", "last_name",
    "personal_email", "business_email", "phone",
    "business_name", "website_link", "years_of_operations",
    "workshop_title", "workshop_price", "status",
    "payment_completed_at", "hear_about_us", "created_at",
  ]
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
  const header = cols.join(",")
  const body = rows.map(r => cols.map(c => escape(r[c])).join(",")).join("\n")
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a"); a.href = url
  a.download = `workshop-registrations-${new Date().toISOString().slice(0, 10)}.csv`
  a.click(); URL.revokeObjectURL(url)
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  reg, onClose, onMarkPaid,
}: {
  reg: Registration
  onClose: () => void
  onMarkPaid: (r: Registration) => Promise<void>
}) {
  const [marking, setMarking] = useState(false)

  async function handleMarkPaid() {
    setMarking(true)
    await onMarkPaid(reg)
    setMarking(false)
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
            <h2 className="text-lg font-bold text-gray-900">{displayName(reg)}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{displayEmail(reg)}</p>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            {reg.status !== "completed" && (
              <button
                onClick={handleMarkPaid}
                disabled={marking}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {marking ? "Saving…" : "Mark as Paid"}
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Status + dates */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={reg.status} />
            <span className="text-xs text-gray-400">Registered {formatDate(reg.created_at)}</span>
            {reg.payment_completed_at && (
              <span className="text-xs text-green-600 font-medium">
                Paid {formatDatetime(reg.payment_completed_at)}
              </span>
            )}
          </div>

          {/* Personal */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Personal Information
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="First Name" value={reg.first_name} />
              <Field label="Last Name" value={reg.last_name} />
              <Field label="Personal Email" value={reg.personal_email} />
              <Field label="Business Email" value={reg.business_email} />
              <Field label="Phone" value={reg.phone} />
              <Field label="Country Code" value={reg.country_code} />
            </dl>
          </section>

          {/* Business */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Business
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Business Name" value={reg.business_name} />
              <Field label="Years Operating" value={reg.years_of_operations} />
              <div className="col-span-2">
                <Field label="Website / Social" value={reg.website_link} />
              </div>
              {reg.business_snapshot && (
                <div className="col-span-2">
                  <Field label="Business Snapshot" value={reg.business_snapshot} />
                </div>
              )}
              {reg.what_you_sell && (
                <div className="col-span-2">
                  <Field label="What They Sell" value={reg.what_you_sell} />
                </div>
              )}
              {reg.target_customers && (
                <div className="col-span-2">
                  <Field label="Target Customers" value={reg.target_customers} />
                </div>
              )}
              {reg.business_goal && (
                <div className="col-span-2">
                  <Field label="Workshop Goal" value={reg.business_goal} />
                </div>
              )}
            </dl>
          </section>

          {/* Workshop + Payment */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Registration & Payment
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Workshop" value={reg.workshop_title} />
              </div>
              <Field label="Price (USD)" value={reg.workshop_price != null ? `$${reg.workshop_price}` : null} />
              <Field label="Step Reached" value={reg.current_step != null ? `Step ${reg.current_step}` : null} />
              <Field label="Submitted At" value={formatDatetime(reg.submitted_at)} />
              <Field label="Payment Completed" value={formatDatetime(reg.payment_completed_at)} />
              <div className="col-span-2">
                <Field label="Checkout Session ID" value={reg.checkout_session_id} />
              </div>
              <div className="col-span-2">
                <Field label="Registration ID" value={reg.registration_id} />
              </div>
            </dl>
          </section>

          {/* Discovery */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Discovery
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Heard About Us" value={reg.hear_about_us} />
              {reg.other_source && <Field label="Other Source" value={reg.other_source} />}
            </dl>
          </section>
        </div>
      </div>
    </div>
  )
}

// ─── Email Compose Modal ──────────────────────────────────────────────────────

function EmailModal({
  recipients,
  onClose,
  onSent,
}: {
  recipients: Registration[]
  onClose: () => void
  onSent: () => void
}) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [attachments, setAttachments] = useState<{ name: string; content: string; type: string; size: number }[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSend() {
    if (!subject.trim()) { setError("Subject is required"); return }
    if (!body.trim() || body === "<p></p>") { setError("Message body is required"); return }

    setSending(true)
    setError(null)

    // Build contact IDs in the format send-email API expects: "workshop_<supabase_id>"
    const contactIds = recipients.map(r => `workshop_${r.id}`)

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactIds,
          templateId: "custom",
          customSubject: subject,
          customBody: body,
          attachments: attachments.map(a => ({ filename: a.name, content: a.content })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send")

      alert(`Sent to ${data.sent} recipient${data.sent !== 1 ? "s" : ""}${data.failed > 0 ? `. ${data.failed} failed.` : "."}`)
      onSent()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Compose Email</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Sending to{" "}
              <span className="font-semibold text-gray-700">
                {recipients.length} recipient{recipients.length !== 1 ? "s" : ""}
              </span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipient chips */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            {recipients.map(r => (
              <span
                key={r.registration_id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#177fc9] flex-shrink-0" />
                {displayName(r)} &middot; {displayEmail(r)}
              </span>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div className="px-6 pt-4 pb-2 flex-shrink-0">
          <input
            type="text"
            placeholder="Subject…"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#177fc9] focus:border-transparent font-medium"
          />
        </div>

        {/* Body */}
        <div className="px-6 pb-4 flex-1 min-h-0 overflow-y-auto">
          <EmailEditor
            initialContent=""
            onChange={setBody}
            onAttachmentsChange={setAttachments}
            variables={[
              { label: "Name", value: "{{name}}" },
              { label: "Business", value: "{{businessName}}" },
            ]}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0">
          {error && <p className="text-sm text-red-600 flex-1">{error}</p>}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#177fc9] hover:bg-[#0f5b90] text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
            >
              {sending ? (
                <><RefreshCw className="w-4 h-4 animate-spin" />Sending…</>
              ) : (
                <><Send className="w-4 h-4" />Send Email</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminWorkshopsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")
  const [showDateRange, setShowDateRange] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // Sort
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Panels
  const [detail, setDetail] = useState<Registration | null>(null)
  const [emailTargets, setEmailTargets] = useState<Registration[] | null>(null)

  // ── Fetch ──
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/workshops")
      const data = await res.json()
      setRegistrations(data.registrations || [])
    } catch (err) {
      console.error("Failed to fetch:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Filter + Sort ──
  const filtered = useMemo(() => {
    let result = [...registrations]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        displayName(r).toLowerCase().includes(q) ||
        displayEmail(r).toLowerCase().includes(q) ||
        (r.business_name ?? "").toLowerCase().includes(q) ||
        (r.phone ?? "").includes(q) ||
        r.registration_id.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== "all") {
      result = result.filter(r => r.status === statusFilter)
    }

    if (typeFilter !== "all") {
      if (typeFilter === "vip") {
        result = result.filter(r => r.workshop_title === "VIP Consultation")
      } else {
        result = result.filter(r => r.workshop_title !== "VIP Consultation")
      }
    }

    if (timeFilter !== "all" && !showDateRange) {
      const range = getTimeRange(timeFilter)
      if (range) result = result.filter(r => {
        const d = new Date(r.created_at)
        return d >= range.start && d <= range.end
      })
    }

    if (showDateRange) {
      if (dateFrom) result = result.filter(r => new Date(r.created_at) >= new Date(dateFrom))
      if (dateTo)   result = result.filter(r => new Date(r.created_at) <= new Date(dateTo + "T23:59:59"))
    }

    result.sort((a, b) => {
      let va: string | number = ""
      let vb: string | number = ""
      switch (sortField) {
        case "full_name":            va = displayName(a).toLowerCase(); vb = displayName(b).toLowerCase(); break
        case "business_name":        va = (a.business_name ?? "").toLowerCase(); vb = (b.business_name ?? "").toLowerCase(); break
        case "status":               va = a.status; vb = b.status; break
        case "workshop_price":       va = a.workshop_price ?? 0; vb = b.workshop_price ?? 0; break
        case "payment_completed_at": va = a.payment_completed_at ?? ""; vb = b.payment_completed_at ?? ""; break
        default:                     va = a.created_at; vb = b.created_at; break
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1
      if (va > vb) return sortDir === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [registrations, search, statusFilter, typeFilter, timeFilter, showDateRange, dateFrom, dateTo, sortField, sortDir])

  // ── Stats ──
  const stats = useMemo(() => {
    const all = registrations
    const paid = all.filter(r => r.status === "completed")
    const pending = all.filter(r => r.status === "pending_payment")
    const inProg = all.filter(r => r.status === "in_progress")
    const revenue = paid.reduce((sum, r) => sum + (r.workshop_price ?? 0), 0)
    const workshopCount = all.filter(r => r.workshop_title !== "VIP Consultation").length
    const vipCount = all.filter(r => r.workshop_title === "VIP Consultation").length
    return { total: all.length, paid: paid.length, pending: pending.length, inProg: inProg.length, revenue, workshopCount, vipCount }
  }, [registrations])

  // ── Selection ──
  const allSelected = filtered.length > 0 && filtered.every(r => selectedIds.has(r.registration_id))

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map(r => r.registration_id)))
  }

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelectedIds(next)
  }

  const selectedRows = registrations.filter(r => selectedIds.has(r.registration_id))

  // ── Sort toggle ──
  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("desc") }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
  }

  // ── Mark as paid ──
  const markAsPaid = useCallback(async (r: Registration) => {
    const res = await fetch("/api/admin/workshops", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId: r.registration_id,
        updates: { status: "completed", payment_completed_at: new Date().toISOString() },
      }),
    })
    if (res.ok) {
      const { registration: updated } = await res.json()
      setRegistrations(prev => prev.map(reg => reg.registration_id === r.registration_id ? updated : reg))
      if (detail?.registration_id === r.registration_id) setDetail(updated)
    }
  }, [detail])

  const bulkMarkPaid = async () => {
    const unpaid = selectedRows.filter(r => r.status !== "completed")
    if (unpaid.length === 0) { alert("All selected are already marked as paid."); return }
    if (!confirm(`Mark ${unpaid.length} registration${unpaid.length !== 1 ? "s" : ""} as paid?`)) return
    await Promise.all(unpaid.map(r => markAsPaid(r)))
    setSelectedIds(new Set())
  }

  const TIME_OPTIONS: { value: TimeFilter; label: string }[] = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "this_year", label: "This Year" },
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* ── Top bar ── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

          {/* Nav + Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <a href="/admin/audits"  className="hover:text-[#177fc9] transition-colors">Audits</a>
                <span>/</span>
                <span className="text-gray-700 font-semibold">Workshops</span>
                <span>/</span>
                <a href="/admin/emails" className="hover:text-[#177fc9] transition-colors">Emails</a>
              </div>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="mt-2">
            <h1 className="text-2xl font-bold text-gray-900">Workshop Registrations</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {stats.total} total
              {selectedIds.size > 0 && <span className="text-[#177fc9] ml-2">&middot; {selectedIds.size} selected</span>}
            </p>
          </div>

          {/* Stats strip */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-6 gap-3">
            {[
              { icon: Users,        label: "Total",           value: stats.total,              color: "text-gray-700",  bg: "bg-gray-50"  },
              { icon: CheckCircle,  label: "Paid",            value: stats.paid,               color: "text-green-700", bg: "bg-green-50" },
              { icon: Clock,        label: "Pending Payment", value: stats.pending,            color: "text-amber-700", bg: "bg-amber-50" },
              { icon: DollarSign,   label: "Revenue (USD)",   value: `$${stats.revenue.toLocaleString()}`, color: "text-[#177fc9]", bg: "bg-blue-50" },
              { icon: Users,        label: "Workshops",       value: stats.workshopCount,      color: "text-indigo-700", bg: "bg-indigo-50" },
              { icon: Users,        label: "VIP",             value: stats.vipCount,           color: "text-amber-700", bg: "bg-amber-50"  },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 flex items-center gap-3`}>
                <s.icon className={`w-5 h-5 flex-shrink-0 ${s.color}`} />
                <div>
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 space-y-3">
            <div className="flex flex-col lg:flex-row gap-2">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name, email, business, phone, ID…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#177fc9] focus:border-transparent bg-white"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#177fc9]"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Paid</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="in_progress">In Progress</option>
                <option value="failed">Failed</option>
              </select>

              {/* Type filter */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                {([
                  { value: "all",      label: "All Types" },
                  { value: "workshop", label: "Workshop" },
                  { value: "vip",      label: "VIP" },
                ] as { value: TypeFilter; label: string }[]).map(t => (
                  <button
                    key={t.value}
                    onClick={() => setTypeFilter(t.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      typeFilter === t.value
                        ? "bg-[#177fc9] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {TIME_OPTIONS.map(t => (
                <button
                  key={t.value}
                  onClick={() => { setTimeFilter(t.value); setShowDateRange(false) }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    timeFilter === t.value && !showDateRange
                      ? "bg-[#177fc9] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#177fc9] hover:text-[#177fc9]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <button
                onClick={() => { setShowDateRange(!showDateRange); setTimeFilter("all") }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1 ${
                  showDateRange
                    ? "bg-[#177fc9] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#177fc9] hover:text-[#177fc9]"
                }`}
              >
                <Calendar className="w-3 h-3" />
                Custom Range
              </button>
            </div>

            {/* Date range pickers */}
            {showDateRange && (
              <div className="flex items-center gap-3 pt-1 flex-wrap">
                <label className="text-xs text-gray-500">From</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#177fc9] bg-white" />
                <label className="text-xs text-gray-500">To</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#177fc9] bg-white" />
                {(dateFrom || dateTo) && (
                  <button onClick={() => { setDateFrom(""); setDateTo("") }} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
                )}
              </div>
            )}

            {/* Bulk actions */}
            {(selectedIds.size > 0 || filtered.length > 0) && (
              <div className="flex items-center gap-2 pt-1 border-t border-gray-200 flex-wrap">
                <span className="text-xs text-gray-500">
                  {selectedIds.size > 0 ? `${selectedIds.size} selected:` : `All ${filtered.length}:`}
                </span>
                <button
                  onClick={() => setEmailTargets(selectedIds.size > 0 ? selectedRows : filtered)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#177fc9] text-white rounded-lg hover:bg-[#0f5b90] transition-colors"
                >
                  <Send className="w-3 h-3" />
                  Send Email
                </button>
                {selectedIds.size > 0 && (
                  <button
                    onClick={bulkMarkPaid}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Mark as Paid
                  </button>
                )}
                <button
                  onClick={() => exportCSV(selectedIds.size > 0 ? selectedRows : filtered)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Export CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-16 text-center">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Loading registrations…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No registrations found</p>
                <p className="text-sm text-gray-300 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="pl-4 pr-2 py-3 text-left w-8">
                        <input
                          type="checkbox" checked={allSelected} onChange={toggleAll}
                          className="w-4 h-4 rounded border-gray-300 text-[#177fc9] focus:ring-[#177fc9]"
                        />
                      </th>

                      {([ ["full_name","Name"], ["business_name","Business"], ["status","Status"],
                           ["workshop_price","Amount"], ["payment_completed_at","Paid At"], ["created_at","Registered"],
                        ] as [SortField, string][]).map(([field, label]) => (
                        <th key={field} className="px-3 py-3 text-left">
                          <button
                            onClick={() => handleSort(field)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
                          >
                            {label}<SortIcon field={field} />
                          </button>
                        </th>
                      ))}

                      <th className="px-3 py-3 text-right">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(r => (
                      <tr
                        key={r.registration_id}
                        onClick={() => setDetail(r)}
                        className={`group cursor-pointer hover:bg-blue-50/40 transition-colors ${
                          selectedIds.has(r.registration_id) ? "bg-blue-50/60" : ""
                        }`}
                      >
                        <td className="pl-4 pr-2 py-3" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(r.registration_id)}
                            onChange={() => toggleOne(r.registration_id)}
                            className="w-4 h-4 rounded border-gray-300 text-[#177fc9] focus:ring-[#177fc9]"
                          />
                        </td>

                        <td className="px-3 py-3">
                          <div className="text-sm font-medium text-gray-900">{displayName(r)}</div>
                          <div className="text-xs text-gray-400">{displayEmail(r)}</div>
                          {r.phone && <div className="text-xs text-gray-400">{r.phone}</div>}
                        </td>

                        <td className="px-3 py-3">
                          <div className="text-sm text-gray-700">{r.business_name || "—"}</div>
                          {r.years_of_operations && (
                            <div className="text-xs text-gray-400">{r.years_of_operations}</div>
                          )}
                          {r.workshop_title && (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium mt-1 ${
                              r.workshop_title === "VIP Consultation"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-blue-50 text-blue-700"
                            }`}>
                              {r.workshop_title === "VIP Consultation" ? "VIP" : "Workshop"}
                            </span>
                          )}
                        </td>

                        <td className="px-3 py-3">
                          <StatusBadge status={r.status} />
                        </td>

                        <td className="px-3 py-3">
                          <span className="text-sm font-medium text-gray-800">
                            {r.workshop_price != null ? `$${r.workshop_price}` : "—"}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-sm text-gray-500">
                          {formatDate(r.payment_completed_at)}
                        </td>

                        <td className="px-3 py-3 text-sm text-gray-500">
                          {formatDate(r.created_at)}
                        </td>

                        <td className="px-3 py-3 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setDetail(r)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                              title="View details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEmailTargets([r])}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                              title="Send email"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            {r.status !== "completed" && (
                              <button
                                onClick={() => markAsPaid(r)}
                                className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600"
                                title="Mark as paid"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-400">
                  Showing {filtered.length} of {registrations.length} registrations
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Detail panel ── */}
      {detail && (
        <DetailPanel
          reg={detail}
          onClose={() => setDetail(null)}
          onMarkPaid={markAsPaid}
        />
      )}

      {/* ── Email modal ── */}
      {emailTargets && (
        <EmailModal
          recipients={emailTargets}
          onClose={() => setEmailTargets(null)}
          onSent={fetchData}
        />
      )}
    </div>
  )
}
