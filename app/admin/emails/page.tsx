// app/admin/emails/page.tsx
"use client"

import { useEffect, useState, useMemo } from "react"
import {
  Search,
  Mail,
  Send,
  Users,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { EmailEditor } from "@/components/admin/email-editor"

// ─── Types ───────────────────────────────────────────────────────
interface Contact {
  id: string
  type: "audit" | "workshop"
  name: string
  email: string
  phone: string
  businessName: string
  industry?: string
  status: string
  createdAt: string
  lastEmailSent?: string
  emailCount: number
  // Audit-specific
  dashboardId?: string
  primaryConstraint?: string
  primaryScore?: number
  // Workshop-specific
  workshopTitle?: string
  paymentStatus?: string
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  description: string
}

type TimeFilter = "all" | "today" | "this_week" | "this_month" | "last_month"
type TypeFilter = "all" | "audit" | "workshop"
type StatusFilter = "all" | "completed" | "in_progress" | "pending_payment" | "paid"
type SortField = "createdAt" | "name" | "businessName" | "emailCount"
type SortDir = "asc" | "desc"

// ─── Helpers ─────────────────────────────────────────────────────
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
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      return { start: lastMonthStart, end: lastMonthEnd }
    }
    default:
      return null
  }
}

// ─── Email Templates ─────────────────────────────────────────────
const emailTemplates: EmailTemplate[] = [
  {
    id: "audit_results",
    name: "Audit Results",
    subject: "Your Business Constraint Audit Results",
    description: "Send audit results with PDF attachment",
  },
  {
    id: "follow_up_3_days",
    name: "3-Day Follow-up",
    subject: "Have you reviewed your audit results?",
    description: "Follow up if they haven't visited dashboard",
  },
  {
    id: "workshop_reminder",
    name: "Workshop Reminder",
    subject: "Workshop Starting Soon!",
    description: "Remind about upcoming workshop",
  },
  {
    id: "payment_reminder",
    name: "Payment Reminder",
    subject: "Complete Your Workshop Registration",
    description: "Remind to complete payment",
  },
  {
    id: "custom",
    name: "Custom Email",
    subject: "",
    description: "Write a custom email",
  },
]

// ─── Main Component ──────────────────────────────────────────────
export default function EmailManagementPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState("")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  // Email modal
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [customSubject, setCustomSubject] = useState("")
  const [customBody, setCustomBody] = useState("")
  const [attachments, setAttachments] = useState<{ name: string; content: string; type: string; size: number }[]>([])
  const [sending, setSending] = useState(false)

  // Fetch contacts
  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/contacts")
      if (!res.ok) throw new Error("Failed to fetch contacts")
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    let result = [...contacts]

    // Search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.businessName.toLowerCase().includes(q)
      )
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((c) => c.type === typeFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }

    // Time filter
    const timeRange = getTimeRange(timeFilter)
    if (timeRange) {
      result = result.filter((c) => {
        const date = new Date(c.createdAt)
        return date >= timeRange.start && date <= timeRange.end
      })
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      if (sortField === "createdAt") {
        aVal = new Date(aVal || 0).getTime()
        bVal = new Date(bVal || 0).getTime()
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [contacts, search, typeFilter, statusFilter, timeFilter, sortField, sortDir])

  // Selection handlers
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
    setSelectAll(newSelected.size === filteredContacts.length)
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredContacts.map((c) => c.id)))
    }
    setSelectAll(!selectAll)
  }

  // Send emails
  const handleSendEmails = async () => {
    if (!selectedTemplate || selectedIds.size === 0) return

    setSending(true)
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactIds: Array.from(selectedIds),
          templateId: selectedTemplate.id,
          customSubject: selectedTemplate.id === "custom" ? customSubject : undefined,
          customBody: selectedTemplate.id === "custom" ? customBody : undefined,
          attachments: selectedTemplate.id === "custom" ? attachments.map(a => ({ filename: a.name, content: a.content })) : undefined
        }),
      })

      if (!res.ok) throw new Error("Failed to send emails")

      const result = await res.json()
      alert(`Successfully sent ${result.sent} emails!`)
      setShowEmailModal(false)
      setSelectedIds(new Set())
      setSelectAll(false)
      fetchContacts() // Refresh to update email counts
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send emails")
    } finally {
      setSending(false)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDir === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const getStatusBadge = (status: string, type: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      pending_payment: "bg-orange-100 text-orange-800",
      paid: "bg-blue-100 text-blue-800",
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
        {status.replace("_", " ")}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    return type === "audit" ? (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#177fc9]/10 text-[#177fc9]">Audit</span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Workshop</span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#177fc9]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Management</h1>
              <p className="text-sm text-gray-500">
                {contacts.length} contacts • {selectedIds.size} selected
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchContacts}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowEmailModal(true)}
                disabled={selectedIds.size === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#177fc9] text-white rounded-lg font-medium hover:bg-[#0f5b90] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Send Email ({selectedIds.size})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or business..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#177fc9]"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#177fc9]"
            >
              <option value="all">All Types</option>
              <option value="audit">Audits Only</option>
              <option value="workshop">Workshops Only</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#177fc9]"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="paid">Paid</option>
            </select>

            {/* Time Filter */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#177fc9]"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No contacts found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-[#177fc9] focus:ring-[#177fc9]"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Name <SortIcon field="name" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("businessName")}
                    >
                      <div className="flex items-center gap-1">
                        Business <SortIcon field="businessName" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("emailCount")}
                    >
                      <div className="flex items-center gap-1">
                        Emails <SortIcon field="emailCount" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-1">
                        Date <SortIcon field="createdAt" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(contact.id)}
                          onChange={() => toggleSelect(contact.id)}
                          className="rounded border-gray-300 text-[#177fc9] focus:ring-[#177fc9]"
                        />
                      </td>
                      <td className="px-4 py-3">{getTypeBadge(contact.type)}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        {contact.primaryConstraint && (
                          <div className="text-xs text-gray-500">{contact.primaryConstraint}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{contact.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{contact.businessName}</td>
                      <td className="px-4 py-3">{getStatusBadge(contact.status, contact.type)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {contact.emailCount}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(contact.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Send Email</h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                  {selectedIds.size} contact{selectedIds.size !== 1 ? "s" : ""} selected
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Template
                </label>
                <div className="space-y-2">
                  {emailTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${selectedTemplate?.id === template.id
                        ? "border-[#177fc9] bg-[#177fc9]/5"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedTemplate?.id === "custom" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="Email subject..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#177fc9]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <EmailEditor
                      initialContent={customBody}
                      onChange={setCustomBody}
                      onAttachmentsChange={setAttachments}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmails}
                disabled={!selectedTemplate || sending}
                className="flex items-center gap-2 px-4 py-2 bg-[#177fc9] text-white font-medium rounded-lg hover:bg-[#0f5b90] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Emails
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
