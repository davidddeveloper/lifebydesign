"use client"

// app/admin/bookings/page.tsx
// Admin: view all bookings + configure booking settings

import { useState, useEffect } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Booking {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  booking_date: string
  booking_time: string
  call_medium: string
  meeting_link: string | null
  assigned_to_name: string | null
  assigned_to_email: string | null
  status: string
  source: string
  monthly_revenue: number | null
  admin_notes: string | null
  created_at: string
}

interface TeamMember { name: string; email: string; active: boolean }

interface BookingSettings {
  revenueThreshold: number
  redirectUrl: string
  assignedTeam: TeamMember[]
  notificationTeam: TeamMember[]
  availability: {
    days: string[]
    startTime: string
    endTime: string
    slotDurationMins: number
  }
  officeAddress: string
  directionsUrl: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  confirmed:  "bg-blue-50 text-blue-700 border-blue-200",
  completed:  "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-red-50 text-red-600 border-red-200",
  no_show:    "bg-gray-100 text-gray-500 border-gray-200",
}

const MEDIUM_ICONS: Record<string, string> = {
  in_person:   "🏢",
  zoom:        "🎥",
  google_meet: "📹",
  phone_call:  "📞",
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  })
}

function formatTime12(t: string): string {
  const [h, m] = t.split(":").map(Number)
  const ampm = h >= 12 ? "PM" : "AM"
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const [bookings, setBookings]     = useState<Booking[]>([])
  const [settings, setSettings]     = useState<BookingSettings | null>(null)
  const [loading, setLoading]       = useState(true)
  const [tab, setTab]               = useState<"bookings" | "settings">("bookings")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selected, setSelected]     = useState<Booking | null>(null)
  const [saving, setSaving]         = useState(false)

  // Settings edit state
  const [editThreshold, setEditThreshold]   = useState("")
  const [editRedirectUrl, setEditRedirectUrl] = useState("")
  const [editOfficeAddr, setEditOfficeAddr]  = useState("")
  const [editDirUrl, setEditDirUrl]         = useState("")
  const [editStartTime, setEditStartTime]   = useState("")
  const [editEndTime, setEditEndTime]       = useState("")
  const [assignedTeam, setAssignedTeam]     = useState<TeamMember[]>([])
  const [notifTeam, setNotifTeam]           = useState<TeamMember[]>([])

  // New team member input
  const [newMember, setNewMember] = useState({ name: "", email: "" })
  const [newNotifMember, setNewNotifMember] = useState({ name: "", email: "" })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [bRes, sRes] = await Promise.all([
        fetch("/api/bookings?limit=200"),
        fetch("/api/admin/booking-settings"),
      ])
      const bJson = await bRes.json()
      const sJson = await sRes.json()

      setBookings(bJson.bookings ?? [])
      const s: BookingSettings = sJson.settings
      setSettings(s)

      // Seed edit state
      setEditThreshold(String(s.revenueThreshold))
      setEditRedirectUrl(s.redirectUrl)
      setEditOfficeAddr(s.officeAddress)
      setEditDirUrl(s.directionsUrl)
      setEditStartTime(s.availability.startTime)
      setEditEndTime(s.availability.endTime)
      setAssignedTeam(s.assignedTeam)
      setNotifTeam(s.notificationTeam)
    } finally {
      setLoading(false)
    }
  }

  const filtered = bookings.filter(b => statusFilter === "all" || b.status === statusFilter)

  async function updateStatus(id: string, status: string) {
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates: { status } }),
    })
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null)
  }

  async function saveNotes(id: string, notes: string) {
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates: { admin_notes: notes } }),
    })
  }

  async function saveSettings() {
    setSaving(true)
    try {
      await fetch("/api/admin/booking-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: [
            { key: "revenue_threshold",   value: Number(editThreshold) },
            { key: "redirect_url",        value: editRedirectUrl },
            { key: "office_address",      value: editOfficeAddr },
            { key: "directions_url",      value: editDirUrl },
            { key: "assigned_team",     value: assignedTeam },
            { key: "notification_team", value: notifTeam },
            { key: "availability", value: {
              days: settings?.availability.days ?? ["monday","tuesday","wednesday","thursday","friday"],
              start_time:         editStartTime,
              end_time:           editEndTime,
              slot_duration_mins: settings?.availability.slotDurationMins ?? 30,
            }},
          ],
        }),
      })
      await load()
      alert("Settings saved.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F7F6F3]">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-[#F7F6F3]" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E5] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin/audits" className="text-xs text-[#888] hover:text-[#1A1A1A]">← Admin</a>
            <span className="text-[#E5E5E5]">|</span>
            <h1 className="text-sm font-bold text-[#1A1A1A]">Bookings</h1>
          </div>
          <div className="flex gap-1 bg-[#F3F4F6] p-0.5 rounded-lg">
            {(["bookings", "settings"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
                  tab === t ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#888] hover:text-[#1A1A1A]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Bookings Tab ── */}
        {tab === "bookings" && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total",     value: bookings.length },
                { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length },
                { label: "Completed", value: bookings.filter(b => b.status === "completed").length },
                { label: "This Week", value: bookings.filter(b => {
                    const d = new Date(b.booking_date + "T00:00:00")
                    const now = new Date()
                    const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay())
                    return d >= weekStart
                  }).length },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-xl border border-[#E5E5E5] px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA] mb-1">{label}</p>
                  <p className="text-2xl font-bold text-[#1A1A1A]">{value}</p>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 mb-4">
              {["all", "confirmed", "completed", "cancelled", "no_show"].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors capitalize ${
                    statusFilter === s
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "bg-white text-[#555] border-[#E5E5E5] hover:border-[#AAA]"
                  }`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-sm text-[#AAA]">No bookings found.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#F0F0F0]">
                      {["Name", "Date & Time", "Medium", "Assigned To", "Status", "Source"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#AAA]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F5F5]">
                    {filtered.map(b => (
                      <tr
                        key={b.id}
                        onClick={() => setSelected(b)}
                        className="hover:bg-[#FAFAFA] cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#1A1A1A]">{b.first_name} {b.last_name}</p>
                          <p className="text-[11px] text-[#888]">{b.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#1A1A1A]">{formatDate(b.booking_date)}</p>
                          <p className="text-[11px] text-[#888]">{formatTime12(b.booking_time)} WAT</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-base">{MEDIUM_ICONS[b.call_medium] ?? "📅"}</span>
                          <span className="ml-1.5 text-xs text-[#555] capitalize">{b.call_medium.replace("_", " ")}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#555]">{b.assigned_to_name ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${STATUS_STYLES[b.status] ?? "bg-gray-100 text-gray-500"}`}>
                            {b.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-[#AAA] capitalize">{b.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── Settings Tab ── */}
        {tab === "settings" && settings && (
          <div className="max-w-2xl space-y-6">

            {/* Revenue threshold */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#1A1A1A]">Revenue Gate</h2>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">
                  Monthly Revenue Threshold (NLE)
                  <span className="font-normal text-[#AAA] ml-1">— below this → redirect to YouTube</span>
                </label>
                <input
                  type="number"
                  value={editThreshold}
                  onChange={e => setEditThreshold(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A1A1A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Redirect URL (for below-threshold)</label>
                <input
                  type="url"
                  value={editRedirectUrl}
                  onChange={e => setEditRedirectUrl(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#1A1A1A]">Availability</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Start Time (WAT)</label>
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={e => setEditStartTime(e.target.value)}
                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">End Time (WAT)</label>
                  <input
                    type="time"
                    value={editEndTime}
                    onChange={e => setEditEndTime(e.target.value)}
                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#AAA]">Slot duration: 30 minutes · Days: Monday – Friday</p>
            </div>

            {/* Office address */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#1A1A1A]">Office / In-Person Details</h2>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Address</label>
                <input
                  value={editOfficeAddr}
                  onChange={e => setEditOfficeAddr(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A1A1A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Directions URL (Google Maps link)</label>
                <input
                  type="url"
                  value={editDirUrl}
                  onChange={e => setEditDirUrl(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            {/* Assigned team (calls assigned to) */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#1A1A1A]">Call Assignment</h2>
              <p className="text-xs text-[#888]">The first active person here is shown on booking confirmations.</p>
              <div className="space-y-2">
                {assignedTeam.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border border-[#E5E5E5] rounded-lg">
                    <input
                      type="checkbox"
                      checked={m.active}
                      onChange={e => setAssignedTeam(prev => prev.map((t, j) => j === i ? { ...t, active: e.target.checked } : t))}
                      className="w-4 h-4 accent-black"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1A1A1A]">{m.name}</p>
                      <p className="text-xs text-[#888]">{m.email}</p>
                    </div>
                    <button
                      onClick={() => setAssignedTeam(prev => prev.filter((_, j) => j !== i))}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Name"
                  value={newMember.name}
                  onChange={e => setNewMember(m => ({ ...m, name: e.target.value }))}
                  className="flex-1 border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1A1A1A]"
                />
                <input
                  placeholder="email@lbd.sl"
                  value={newMember.email}
                  onChange={e => setNewMember(m => ({ ...m, email: e.target.value }))}
                  className="flex-1 border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1A1A1A]"
                />
                <button
                  onClick={() => {
                    if (!newMember.name || !newMember.email) return
                    setAssignedTeam(prev => [...prev, { ...newMember, active: true }])
                    setNewMember({ name: "", email: "" })
                  }}
                  className="px-3 py-2 bg-[#1A1A1A] text-white text-sm rounded-lg hover:bg-black transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Notification team */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#1A1A1A]">Notification Team</h2>
              <p className="text-xs text-[#888]">Everyone who receives booking notifications by email.</p>
              <div className="space-y-2">
                {notifTeam.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border border-[#E5E5E5] rounded-lg">
                    <input
                      type="checkbox"
                      checked={m.active !== false}
                      onChange={e => setNotifTeam(prev => prev.map((t, j) => j === i ? { ...t, active: e.target.checked } : t))}
                      className="w-4 h-4 accent-black"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1A1A1A]">{m.name}</p>
                      <p className="text-xs text-[#888]">{m.email}</p>
                    </div>
                    <button
                      onClick={() => setNotifTeam(prev => prev.filter((_, j) => j !== i))}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Name"
                  value={newNotifMember.name}
                  onChange={e => setNewNotifMember(m => ({ ...m, name: e.target.value }))}
                  className="flex-1 border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1A1A1A]"
                />
                <input
                  placeholder="email@lbd.sl"
                  value={newNotifMember.email}
                  onChange={e => setNewNotifMember(m => ({ ...m, email: e.target.value }))}
                  className="flex-1 border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1A1A1A]"
                />
                <button
                  onClick={() => {
                    if (!newNotifMember.name || !newNotifMember.email) return
                    setNotifTeam(prev => [...prev, { ...newNotifMember, active: true }])
                    setNewNotifMember({ name: "", email: "" })
                  }}
                  className="px-3 py-2 bg-[#1A1A1A] text-white text-sm rounded-lg hover:bg-black transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="w-full bg-[#1A1A1A] text-white py-3 rounded-xl text-sm font-semibold hover:bg-black disabled:opacity-40 transition-colors"
            >
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-[#F0F0F0] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A]">{selected.first_name} {selected.last_name}</h2>
                <p className="text-xs text-[#888]">{selected.email} · {selected.phone}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Details */}
              <div className="space-y-2 text-sm">
                {[
                  ["Date",         formatDate(selected.booking_date)],
                  ["Time",         `${formatTime12(selected.booking_time)} WAT`],
                  ["Meeting",      selected.call_medium.replace("_", " ")],
                  ["Assigned To",  selected.assigned_to_name ?? "—"],
                  ["Source",       selected.source],
                  ...(selected.meeting_link ? [["Link", selected.meeting_link]] : []),
                  ...(selected.monthly_revenue ? [["Monthly Revenue", `NLE ${selected.monthly_revenue.toLocaleString()}`]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-3">
                    <span className="text-[11px] font-semibold text-[#AAA] uppercase tracking-wide w-24 flex-shrink-0 pt-0.5">{label}</span>
                    <span className="text-[#1A1A1A] font-medium break-all">{value}</span>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-semibold text-[#555] mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {["confirmed", "completed", "cancelled", "no_show"].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border capitalize transition-colors ${
                        selected.status === s
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                          : "bg-white text-[#555] border-[#E5E5E5] hover:border-[#AAA]"
                      }`}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs font-semibold text-[#555] mb-2">Admin Notes</p>
                <textarea
                  defaultValue={selected.admin_notes ?? ""}
                  onBlur={e => saveNotes(selected.id, e.target.value)}
                  rows={3}
                  placeholder="Add notes…"
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A1A1A] resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
