// app/admin/job-applications/page.tsx
"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import {
  Search, RefreshCw, ChevronDown, ChevronUp, X, Calendar,
  Eye, Download, Briefcase, Mail, Phone, Link2, ArrowLeft,
  Trash2, User, FileText,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface JobApplication {
  id: string
  created_at: string
  updated_at: string | null
  job_id: string
  job_title: string
  job_department: string | null
  sanity_document_id: string | null
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  portfolio: string | null
  cover_letter: string | null
  source: string | null
  status: string
  admin_notes: string | null
}

interface JobSummary {
  job_id: string
  job_title: string
  job_department: string | null
  count: number
  new_count: number
  latest_at: string | null
}

type TimeFilter = "all" | "today" | "this_week" | "this_month" | "last_month" | "this_year"
type SortField = "created_at" | "first_name" | "status" | "email"
type SortDir = "asc" | "desc"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function displayName(a: JobApplication): string {
  const name = `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim()
  return name || a.email || "—"
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

const STATUS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  new:        { label: "New",        bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
  reviewing:  { label: "Reviewing",  bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500" },
  interview:  { label: "Interview",  bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  offer:      { label: "Offer",      bg: "bg-cyan-50",   text: "text-cyan-700",   dot: "bg-cyan-500" },
  hired:      { label: "Hired",      bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  rejected:   { label: "Rejected",   bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500" },
  withdrawn:  { label: "Withdrawn",  bg: "bg-gray-100",  text: "text-gray-600",   dot: "bg-gray-400" },
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

function exportCSV(rows: JobApplication[], jobTitle?: string) {
  const cols: (keyof JobApplication)[] = [
    "id", "job_title", "job_id", "job_department",
    "first_name", "last_name", "email", "phone",
    "portfolio", "cover_letter", "status", "source", "created_at", "admin_notes",
  ]
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
  const header = cols.join(",")
  const body = rows.map(r => cols.map(c => escape(r[c])).join(",")).join("\n")
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  const slug = (jobTitle || "all").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)
  a.href = url
  a.download = `job-applications-${slug}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  application,
  onClose,
  onUpdate,
  onDelete,
}: {
  application: JobApplication
  onClose: () => void
  onUpdate: (id: string, updates: Partial<JobApplication>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [status, setStatus] = useState(application.status)
  const [notes, setNotes] = useState(application.admin_notes ?? "")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setStatus(application.status)
    setNotes(application.admin_notes ?? "")
    setConfirmDelete(false)
  }, [application])

  async function handleSave() {
    setSaving(true)
    await onUpdate(application.id, { status, admin_notes: notes })
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    await onDelete(application.id)
    setDeleting(false)
  }

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</dt>
      <dd className="text-sm text-gray-800 break-words whitespace-pre-wrap">{value || <span className="text-gray-300">—</span>}</dd>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{displayName(application)}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{application.job_title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={application.status} />
            <span className="text-xs text-gray-400">Applied {formatDatetime(application.created_at)}</span>
          </div>

          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Applicant
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="First Name" value={application.first_name} />
              <Field label="Last Name" value={application.last_name} />
              <div className="col-span-2">
                <Field
                  label="Email"
                  value={
                    <a href={`mailto:${application.email}`} className="text-[#177fc9] hover:underline">
                      {application.email}
                    </a>
                  }
                />
              </div>
              <Field label="Phone" value={application.phone} />
              <div className="col-span-2">
                <Field
                  label="Portfolio / LinkedIn"
                  value={
                    application.portfolio ? (
                      <a
                        href={application.portfolio.startsWith("http") ? application.portfolio : `https://${application.portfolio}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#177fc9] hover:underline break-all"
                      >
                        {application.portfolio}
                      </a>
                    ) : null
                  }
                />
              </div>
            </dl>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Role
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Job Title" value={application.job_title} />
              </div>
              <Field label="Department" value={application.job_department} />
              <Field label="Job ID" value={application.job_id} />
            </dl>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              Cover Letter
            </h3>
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {application.cover_letter || <span className="text-gray-300">—</span>}
            </p>
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

export default function AdminJobApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [jobs, setJobs] = useState<JobSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // null = job list view; set = applications under that job
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")
  const [showDateRange, setShowDateRange] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const [detail, setDetail] = useState<JobApplication | null>(null)
  const [jobSearch, setJobSearch] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/job-applications")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load")
      setApplications(data.applications || [])
      setJobs(data.jobs || [])
    } catch (err) {
      console.error("Failed to fetch job applications:", err)
      setError(err instanceof Error ? err.message : "Failed to load applications")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const selectedJob = useMemo(
    () => jobs.find(j => j.job_id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  )

  const filteredJobs = useMemo(() => {
    if (!jobSearch) return jobs
    const q = jobSearch.toLowerCase()
    return jobs.filter(j =>
      j.job_title.toLowerCase().includes(q) ||
      (j.job_department ?? "").toLowerCase().includes(q) ||
      j.job_id.toLowerCase().includes(q)
    )
  }, [jobs, jobSearch])

  const jobApplications = useMemo(() => {
    if (!selectedJobId) return []
    return applications.filter(a => a.job_id === selectedJobId)
  }, [applications, selectedJobId])

  const filtered = useMemo(() => {
    let result = [...jobApplications]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(a =>
        displayName(a).toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.phone ?? "").includes(q) ||
        (a.portfolio ?? "").toLowerCase().includes(q)
      )
    }

    if (statusFilter !== "all") {
      result = result.filter(a => a.status === statusFilter)
    }

    if (timeFilter !== "all" && !showDateRange) {
      const range = getTimeRange(timeFilter)
      if (range) {
        result = result.filter(a => {
          const d = new Date(a.created_at)
          return d >= range.start && d <= range.end
        })
      }
    }

    if (showDateRange) {
      if (dateFrom) result = result.filter(a => new Date(a.created_at) >= new Date(dateFrom))
      if (dateTo) result = result.filter(a => new Date(a.created_at) <= new Date(dateTo + "T23:59:59"))
    }

    result.sort((a, b) => {
      let va: string | number = ""
      let vb: string | number = ""
      switch (sortField) {
        case "first_name":
          va = displayName(a).toLowerCase()
          vb = displayName(b).toLowerCase()
          break
        case "status":
          va = a.status
          vb = b.status
          break
        case "email":
          va = a.email.toLowerCase()
          vb = b.email.toLowerCase()
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
  }, [jobApplications, search, statusFilter, timeFilter, showDateRange, dateFrom, dateTo, sortField, sortDir])

  const stats = useMemo(() => {
    const all = applications
    return {
      total: all.length,
      jobs: jobs.length,
      new: all.filter(a => a.status === "new").length,
      interview: all.filter(a => a.status === "interview").length,
      hired: all.filter(a => a.status === "hired").length,
    }
  }, [applications, jobs])

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

  const updateApplication = useCallback(async (id: string, updates: Partial<JobApplication>) => {
    const res = await fetch("/api/admin/job-applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates }),
    })
    if (res.ok) {
      const { application: updated } = await res.json()
      setApplications(prev => prev.map(a => (a.id === id ? updated : a)))
      if (detail?.id === id) setDetail(updated)
      // refresh job summary new_count
      fetchData()
    } else {
      alert("Failed to update application")
    }
  }, [detail, fetchData])

  const deleteApplication = useCallback(async (id: string) => {
    const res = await fetch("/api/admin/job-applications", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setApplications(prev => prev.filter(a => a.id !== id))
      setDetail(null)
      fetchData()
    } else {
      alert("Failed to delete application")
    }
  }, [fetchData])

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
              {selectedJobId && selectedJob ? (
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => {
                      setSelectedJobId(null)
                      setSearch("")
                      setStatusFilter("all")
                      setDetail(null)
                    }}
                    className="mt-0.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                    title="Back to jobs"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{selectedJob.job_title}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {selectedJob.job_department ? `${selectedJob.job_department} · ` : ""}
                      {selectedJob.count} application{selectedJob.count !== 1 ? "s" : ""}
                      {selectedJob.new_count > 0 ? ` · ${selectedJob.new_count} new` : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Job Applications</h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Browse applications under each open role
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedJobId && (
                <button
                  onClick={() => exportCSV(filtered, selectedJob?.job_title)}
                  disabled={filtered.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              )}
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

          {!selectedJobId && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
              {[
                { label: "Applications", value: stats.total },
                { label: "Jobs with apps", value: stats.jobs },
                { label: "New", value: stats.new },
                { label: "Interview", value: stats.interview },
                { label: "Hired", value: stats.hired },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                  <div className="text-lg font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters (applications view only) */}
      {selectedJobId && (
        <div className="flex-shrink-0 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicant, email…"
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
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm" />
                <span className="text-gray-400 text-sm">to</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm" />
              </div>
            )}

            <span className="text-xs text-gray-400 ml-auto">
              {filtered.length} of {jobApplications.length}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
              {error}
              <p className="text-xs mt-1 text-red-500">
                If this is a new table, run <code className="font-mono">job_applications_schema.sql</code> in Supabase first.
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              Loading applications…
            </div>
          ) : !selectedJobId ? (
            /* ── Job list ── */
            <>
              <div className="mb-4 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs…"
                  value={jobSearch}
                  onChange={e => setJobSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#177fc9] bg-white"
                />
              </div>

              {filteredJobs.length === 0 ? (
                <div className="text-center py-20">
                  <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-500">No job applications yet</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                    Publish roles in Sanity Studio → Job Postings, then applicants will appear here grouped by job.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredJobs.map(job => (
                    <button
                      key={job.job_id}
                      onClick={() => setSelectedJobId(job.job_id)}
                      className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-[#1A1A1A] hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#1A1A1A] transition-colors">
                          <Briefcase className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                        </div>
                        {job.new_count > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                            {job.new_count} new
                          </span>
                        )}
                      </div>
                      <h2 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{job.job_title}</h2>
                      {job.job_department && (
                        <p className="text-xs text-gray-500 mb-3">{job.job_department}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                        <span className="font-medium text-gray-700">
                          {job.count} application{job.count !== 1 ? "s" : ""}
                        </span>
                        <span>Latest {formatDate(job.latest_at)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">No applications match your filters</p>
            </div>
          ) : (
            /* ── Applications under selected job ── */
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
                          Applicant <SortIcon field="first_name" />
                        </button>
                      </th>
                      <th className="px-4 py-3">
                        <button
                          onClick={() => handleSort("email")}
                          className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-800"
                        >
                          Contact <SortIcon field="email" />
                        </button>
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-500">Portfolio</th>
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
                    {filtered.map(a => (
                      <tr
                        key={a.id}
                        className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                        onClick={() => setDetail(a)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 font-medium text-gray-900">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            {displayName(a)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />
                            {a.email}
                          </div>
                          {a.phone && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                              <Phone className="w-3 h-3" />
                              {a.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {a.portfolio ? (
                            <span className="inline-flex items-center gap-1 text-xs text-[#177fc9] truncate max-w-[160px]">
                              <Link2 className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{a.portfolio}</span>
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {formatDate(a.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              setDetail(a)
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
          application={detail}
          onClose={() => setDetail(null)}
          onUpdate={updateApplication}
          onDelete={deleteApplication}
        />
      )}
    </div>
  )
}
