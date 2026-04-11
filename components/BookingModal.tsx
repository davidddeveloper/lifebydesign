"use client"

// components/BookingModal.tsx
// Custom booking modal — no Cal.com / Calendly needed.
// Multi-step: info collection (pre-filled from audit) → date picker → time + medium → confirmation.

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookingPrefill {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  monthlyRevenue?: number | string
  auditId?: string | null
  source?: "audit" | "nav_form" | "direct"
}

interface BookingSettings {
  revenueThreshold: number
  redirectUrl: string
  assignedTeam: { name: string; email: string; active: boolean }[]
  availability: {
    days: string[]
    startTime: string
    endTime: string
    slotDurationMins: number
  }
  officeAddress: string
  directionsUrl: string
}

type Step = "loading" | "redirect" | "contact" | "date" | "time" | "confirm" | "done"

const CALL_MEDIUMS = [
  {
    id: "in_person",
    label: "In-Person",
    sublabel: "Visit our office",
    icon: "🏢",
  },
  {
    id: "zoom",
    label: "Zoom",
    sublabel: "Video call link sent by email",
    icon: "🎥",
  },
  {
    id: "google_meet",
    label: "Google Meet",
    sublabel: "Meet link sent by email",
    icon: "📹",
  },
  {
    id: "phone_call",
    label: "Phone Call",
    sublabel: "We call your number",
    icon: "📞",
  },
] as const

type CallMedium = "in_person" | "zoom" | "google_meet" | "phone_call"

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const AVAILABLE_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateTimeSlots(start: string, end: string, stepMins: number): string[] {
  const slots: string[] = []
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  let cur = sh * 60 + sm
  const endTotal = eh * 60 + em
  while (cur <= endTotal) {
    const h = Math.floor(cur / 60)
    const m = cur % 60
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
    cur += stepMins
  }
  return slots
}

function formatTime12(time24: string): string {
  const [h, m] = time24.split(":").map(Number)
  const ampm = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`
}

function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    timeZone: "Africa/Freetown",
  })
}

function formatDateISO(date: Date): string {
  // Returns YYYY-MM-DD in WAT
  return date.toLocaleDateString("en-CA", { timeZone: "Africa/Freetown" })
}

function isSameDayWAT(a: Date, b: Date): boolean {
  return formatDateISO(a) === formatDateISO(b)
}

function isWeekendWAT(date: Date): boolean {
  const day = date.toLocaleDateString("en-US", { weekday: "long", timeZone: "Africa/Freetown" }).toLowerCase()
  return !AVAILABLE_DAYS.includes(day)
}

function isPastOrTodayWAT(date: Date): boolean {
  const todayISO = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Freetown" })
  const dateISO = formatDateISO(date)
  return dateISO <= todayISO
}

function generateMeetingLink(medium: CallMedium): string | null {
  const id = Math.random().toString(36).substring(2, 12)
  if (medium === "zoom") return `https://zoom.us/j/${id.replace(/[^0-9]/g, "").padEnd(10, "0")}`
  if (medium === "google_meet") {
    const parts = [id.substring(0, 3), id.substring(3, 6), id.substring(6, 9)]
    return `https://meet.google.com/${parts.join("-")}`
  }
  return null
}

function getAssignedPerson(settings: BookingSettings): { name: string; email: string } | null {
  const active = settings.assignedTeam.filter(t => t.active)
  return active[0] ?? null
}

// Google Calendar add-to-calendar URL
function buildGoogleCalUrl(params: {
  title: string
  date: string    // YYYY-MM-DD
  time: string    // HH:MM
  durationMins: number
  description: string
  location: string
}): string {
  const start = `${params.date.replace(/-/g, "")}T${params.time.replace(":", "")}00`
  const [sh, sm] = params.time.split(":").map(Number)
  const endTotal = sh * 60 + sm + params.durationMins
  const eh = Math.floor(endTotal / 60)
  const em = endTotal % 60
  const end = `${params.date.replace(/-/g, "")}T${String(eh).padStart(2, "0")}${String(em).padStart(2, "0")}00`
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: params.title,
    dates: `${start}/${end}`,
    details: params.description,
    location: params.location,
    ctz: "Africa/Freetown",
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────

function MiniCalendar({
  selected,
  onSelect,
  maxMonthsAhead = 3,
}: {
  selected: Date | null
  onSelect: (d: Date) => void
  maxMonthsAhead?: number
}) {
  const todayWAT = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Freetown" }) + "T00:00:00")
  const [viewYear, setViewYear] = useState(todayWAT.getFullYear())
  const [viewMonth, setViewMonth] = useState(todayWAT.getMonth())

  const maxDate = new Date(todayWAT)
  maxDate.setMonth(maxDate.getMonth() + maxMonthsAhead)

  const firstDay = new Date(viewYear, viewMonth, 1)
  const lastDay = new Date(viewYear, viewMonth + 1, 0)
  const startPad = firstDay.getDay() // 0=Sun

  const canPrevMonth = !(viewYear === todayWAT.getFullYear() && viewMonth === todayWAT.getMonth())
  const canNextMonth = !(viewYear === maxDate.getFullYear() && viewMonth === maxDate.getMonth())

  function prevMonth() {
    if (!canPrevMonth) return
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (!canNextMonth) return
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const days: (Date | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(viewYear, viewMonth, d))

  return (
    <div className="select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-[#1A1A1A]">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          disabled={!canNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wide text-[#AAA] py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((date, i) => {
          if (!date) return <div key={`pad-${i}`} />
          const disabled = isPastOrTodayWAT(date) || isWeekendWAT(date) || date > maxDate
          const isSelected = selected ? isSameDayWAT(date, selected) : false

          return (
            <button
              key={date.toISOString()}
              onClick={() => !disabled && onSelect(date)}
              disabled={disabled}
              className={[
                "w-9 h-9 mx-auto rounded-full text-sm font-medium transition-colors",
                disabled ? "text-[#D1D5DB] cursor-not-allowed" : "hover:bg-[#F3F4F6] cursor-pointer",
                isSelected ? "!bg-[#1A1A1A] !text-white font-bold" : "",
                !disabled && !isSelected ? "text-[#1A1A1A]" : "",
              ].join(" ")}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      <p className="text-[10px] text-[#AAA] mt-3 text-center">
        WAT (GMT+0) · Monday – Friday only
      </p>
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

const slideIn = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -24 },
  transition: { duration: 0.22, ease: "easeOut" as const },
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
  prefill?: BookingPrefill
}

export default function BookingModal({ open, onClose, prefill }: Props) {
  const [step, setStep] = useState<Step>("loading")
  const [settings, setSettings] = useState<BookingSettings | null>(null)

  // Form state
  const [firstName, setFirstName] = useState(prefill?.firstName ?? "")
  const [lastName, setLastName]   = useState(prefill?.lastName ?? "")
  const [email, setEmail]         = useState(prefill?.email ?? "")
  const [phone, setPhone]         = useState(prefill?.phone ?? "+232")
  const [errors, setErrors]       = useState<Record<string, string>>({})

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [callMedium, setCallMedium]     = useState<CallMedium | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState<{
    id: string
    meetingLink: string | null
    assignedTo: { name: string; email: string } | null
  } | null>(null)

  // Load settings + check revenue threshold
  useEffect(() => {
    if (!open) return
    setStep("loading")

    async function init() {
      try {
        const res = await fetch("/api/admin/booking-settings")
        const json = await res.json()
        const s: BookingSettings = json.settings

        setSettings(s)

        // Revenue gate
        const revenue = Number(prefill?.monthlyRevenue ?? 0)
        if (revenue > 0 && revenue < s.revenueThreshold) {
          setStep("redirect")
          // Redirect after 4 seconds
          setTimeout(() => {
            window.open(s.redirectUrl, "_blank")
            onClose()
          }, 4000)
          return
        }

        // Check if contact info is already complete
        const hasContact =
          (prefill?.firstName || "").trim().length > 0 &&
          (prefill?.lastName || "").trim().length > 0 &&
          (prefill?.email || "").trim().length > 0

        if (hasContact) {
          setStep("date")
        } else {
          setStep("contact")
        }
      } catch {
        // Fallback: skip threshold check, go to contact
        setStep("contact")
      }
    }

    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("loading")
        setSelectedDate(null)
        setSelectedTime(null)
        setCallMedium(null)
        setErrors({})
        setBookingResult(null)
      }, 300)
    }
  }, [open])

  // Sync prefill into state when it changes
  useEffect(() => {
    if (prefill?.firstName) setFirstName(prefill.firstName)
    if (prefill?.lastName)  setLastName(prefill.lastName)
    if (prefill?.email)     setEmail(prefill.email)
    if (prefill?.phone)     setPhone(prefill.phone || "+232")
  }, [prefill])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  const timeSlots = settings
    ? generateTimeSlots(
        settings.availability.startTime,
        settings.availability.endTime,
        settings.availability.slotDurationMins,
      )
    : generateTimeSlots("09:00", "15:30", 30)

  function validateContact() {
    const e: Record<string, string> = {}
    if (!firstName.trim()) e.firstName = "Required"
    if (!lastName.trim())  e.lastName  = "Required"
    if (!email.trim() || !email.includes("@")) e.email = "Valid email required"
    if (!phone.trim() || phone.replace(/\D/g, "").length < 7) e.phone = "Valid phone required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!selectedDate || !selectedTime || !callMedium) return
    setSubmitting(true)

    const meetingLink = generateMeetingLink(callMedium)
    const assignedTo  = settings ? getAssignedPerson(settings) : null

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          monthlyRevenue: Number(prefill?.monthlyRevenue ?? 0),
          bookingDate: formatDateISO(selectedDate),
          bookingTime: selectedTime,
          callMedium,
          meetingLink,
          assignedToName:  assignedTo?.name  ?? null,
          assignedToEmail: assignedTo?.email ?? null,
          source:   prefill?.source  ?? "direct",
          auditId:  prefill?.auditId ?? null,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Booking failed")

      setBookingResult({ id: json.id, meetingLink, assignedTo })
      setStep("done")
    } catch (err: any) {
      alert(err.message ?? "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const googleCalUrl = selectedDate && selectedTime && bookingResult
    ? buildGoogleCalUrl({
        title: `Call with ${bookingResult.assignedTo?.name ?? "Startup Bodyshop"}`,
        date: formatDateISO(selectedDate),
        time: selectedTime,
        durationMins: settings?.availability.slotDurationMins ?? 30,
        description: `Constraint-Busting Business Audit follow-up call.\n${
          bookingResult.meetingLink ? `Meeting link: ${bookingResult.meetingLink}` :
          callMedium === "in_person" ? `Location: ${settings?.officeAddress ?? "62 Dundas Street, Freetown"}` :
          callMedium === "phone_call" ? `We will call you at: ${phone}` : ""
        }`,
        location: callMedium === "in_person"
          ? (settings?.officeAddress ?? "62 Dundas Street, Freetown, Sierra Leone")
          : bookingResult.meetingLink ?? phone,
      })
    : null

  const stepProgress: Record<Step, number> = {
    loading: 0, redirect: 0, contact: 1, date: 2, time: 3, confirm: 4, done: 5,
  }
  const totalSteps = 4
  const progress = Math.round(((stepProgress[step] - 1) / totalSteps) * 100)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:w-[480px] max-h-[92vh] flex flex-col bg-white sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F0F0F0] flex-shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-0.5">Startup Bodyshop</p>
                <h2 className="text-base font-bold text-[#1A1A1A]">Book a Call</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] transition-colors text-[#888]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress bar (only on active steps) */}
            {!["loading", "redirect", "done"].includes(step) && (
              <div className="h-0.5 bg-[#F0F0F0] flex-shrink-0">
                <motion.div
                  className="h-full bg-[#1A1A1A]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <AnimatePresence mode="wait">

                {/* ── Loading ── */}
                {step === "loading" && (
                  <motion.div key="loading" {...slideIn} className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-[#888]">Checking availability…</p>
                  </motion.div>
                )}

                {/* ── Redirect ── */}
                {step === "redirect" && (
                  <motion.div key="redirect" {...slideIn} className="flex flex-col items-center text-center py-12 gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#FEF3C7] flex items-center justify-center text-2xl">📺</div>
                    <h3 className="text-lg font-bold text-[#1A1A1A]">We have something for you</h3>
                    <p className="text-sm text-[#555] leading-relaxed max-w-xs">
                      Based on your current revenue stage, we recommend starting with our free resource library on YouTube to lay the foundations first.
                    </p>
                    <p className="text-xs text-[#AAA]">Redirecting you now…</p>
                    <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin mt-2" />
                  </motion.div>
                )}

                {/* ── Contact Info ── */}
                {step === "contact" && (
                  <motion.div key="contact" {...slideIn} className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">Your details</h3>
                      <p className="text-xs text-[#888]">Tell us how to reach you.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#555] mb-1.5">First Name *</label>
                        <input
                          value={firstName}
                          onChange={e => { setFirstName(e.target.value); setErrors(er => ({ ...er, firstName: "" })) }}
                          className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A1A1A]/10 transition ${errors.firstName ? "border-red-400" : "border-[#E5E5E5] focus:border-[#1A1A1A]"}`}
                          placeholder="Diana"
                        />
                        {errors.firstName && <p className="text-[10px] text-red-500 mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#555] mb-1.5">Last Name *</label>
                        <input
                          value={lastName}
                          onChange={e => { setLastName(e.target.value); setErrors(er => ({ ...er, lastName: "" })) }}
                          className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A1A1A]/10 transition ${errors.lastName ? "border-red-400" : "border-[#E5E5E5] focus:border-[#1A1A1A]"}`}
                          placeholder="Lake"
                        />
                        {errors.lastName && <p className="text-[10px] text-red-500 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#555] mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setErrors(er => ({ ...er, email: "" })) }}
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A1A1A]/10 transition ${errors.email ? "border-red-400" : "border-[#E5E5E5] focus:border-[#1A1A1A]"}`}
                        placeholder="you@example.com"
                      />
                      {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#555] mb-1.5">Phone Number * <span className="font-normal text-[#AAA]">(Sierra Leone)</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#888] select-none">🇸🇱</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => { setPhone(e.target.value); setErrors(er => ({ ...er, phone: "" })) }}
                          className={`w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A1A1A]/10 transition ${errors.phone ? "border-red-400" : "border-[#E5E5E5] focus:border-[#1A1A1A]"}`}
                          placeholder="+232 76 000 000"
                        />
                      </div>
                      {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </motion.div>
                )}

                {/* ── Date ── */}
                {step === "date" && (
                  <motion.div key="date" {...slideIn}>
                    <div className="mb-5">
                      <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">Pick a date</h3>
                      <p className="text-xs text-[#888]">Monday – Friday · WAT (GMT+0)</p>
                    </div>
                    <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} maxMonthsAhead={3} />
                  </motion.div>
                )}

                {/* ── Time + Medium ── */}
                {step === "time" && (
                  <motion.div key="time" {...slideIn} className="space-y-5">
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">Choose a time</h3>
                      <p className="text-xs text-[#888]">{selectedDate ? formatDateDisplay(selectedDate) : ""}</p>
                    </div>

                    {/* Time slots grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={[
                            "py-2.5 rounded-lg text-xs font-semibold border transition-all",
                            selectedTime === slot
                              ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                              : "border-[#E5E5E5] text-[#374151] hover:border-[#1A1A1A] hover:bg-[#FAFAFA]",
                          ].join(" ")}
                        >
                          {formatTime12(slot)}
                        </button>
                      ))}
                    </div>

                    {/* Meeting medium */}
                    <div>
                      <p className="text-xs font-bold text-[#555] uppercase tracking-widest mb-3">How would you like to meet?</p>
                      <div className="space-y-2">
                        {CALL_MEDIUMS.map(m => (
                          <button
                            key={m.id}
                            onClick={() => setCallMedium(m.id as CallMedium)}
                            className={[
                              "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                              callMedium === m.id
                                ? "border-[#1A1A1A] bg-[#1A1A1A]/5 ring-1 ring-[#1A1A1A]"
                                : "border-[#E5E5E5] hover:border-[#AAAAAA] hover:bg-[#FAFAFA]",
                            ].join(" ")}
                          >
                            <span className="text-xl">{m.icon}</span>
                            <div>
                              <p className="text-sm font-semibold text-[#1A1A1A]">{m.label}</p>
                              <p className="text-[11px] text-[#888]">{m.sublabel}</p>
                            </div>
                            {callMedium === m.id && (
                              <div className="ml-auto w-4 h-4 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-2.5 h-2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* In-person address note */}
                      {callMedium === "in_person" && settings && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 p-3 bg-[#F8F8F8] rounded-lg border border-[#E5E5E5] text-xs text-[#555] space-y-1"
                        >
                          <p className="font-semibold text-[#1A1A1A]">{settings.officeAddress}</p>
                          <a
                            href={settings.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#177fc9] hover:underline inline-flex items-center gap-1"
                          >
                            Get directions →
                          </a>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── Confirm ── */}
                {step === "confirm" && selectedDate && selectedTime && callMedium && (
                  <motion.div key="confirm" {...slideIn} className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">Confirm your booking</h3>
                      <p className="text-xs text-[#888]">Please review the details below.</p>
                    </div>

                    <div className="rounded-xl border border-[#E5E5E5] overflow-hidden">
                      {[
                        { label: "Name",    value: `${firstName} ${lastName}` },
                        { label: "Email",   value: email },
                        { label: "Phone",   value: phone },
                        { label: "Date",    value: formatDateDisplay(selectedDate) },
                        { label: "Time",    value: `${formatTime12(selectedTime)} (WAT)` },
                        { label: "Meeting", value: CALL_MEDIUMS.find(m => m.id === callMedium)?.label ?? "" },
                        ...(callMedium === "in_person" && settings
                          ? [{ label: "Address", value: settings.officeAddress }]
                          : []),
                        ...(settings ? [{ label: "With", value: getAssignedPerson(settings)?.name ?? "Startup Bodyshop" }] : []),
                      ].map(({ label, value }, i, arr) => (
                        <div key={label} className={`flex gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-[#F5F5F5]" : ""}`}>
                          <span className="text-[11px] font-semibold text-[#AAA] uppercase tracking-wide w-16 flex-shrink-0 pt-0.5">{label}</span>
                          <span className="text-sm text-[#1A1A1A] font-medium leading-snug">{value}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-[#888] leading-relaxed">
                      A confirmation email will be sent to <strong>{email}</strong>. You'll also receive a WhatsApp reminder closer to your call.
                    </p>
                  </motion.div>
                )}

                {/* ── Done ── */}
                {step === "done" && selectedDate && selectedTime && callMedium && (
                  <motion.div key="done" {...slideIn} className="flex flex-col items-center text-center py-6 gap-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={2.5} className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>

                    <div>
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">You're booked!</h3>
                      <p className="text-sm text-[#555]">
                        {bookingResult?.assignedTo
                          ? `Your call with ${bookingResult.assignedTo.name} is confirmed.`
                          : "Your call is confirmed."}
                      </p>
                    </div>

                    <div className="w-full rounded-xl border border-[#E5E5E5] text-left overflow-hidden">
                      <div className="px-4 py-3 bg-[#FAFAFA] border-b border-[#F0F0F0]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA]">Booking Details</p>
                      </div>
                      {[
                        { label: "Date",    value: formatDateDisplay(selectedDate) },
                        { label: "Time",    value: `${formatTime12(selectedTime)} (WAT)` },
                        { label: "Meeting", value: CALL_MEDIUMS.find(m => m.id === callMedium)?.label ?? "" },
                        ...(bookingResult?.meetingLink ? [{ label: "Link", value: bookingResult.meetingLink }] : []),
                        ...(callMedium === "in_person" && settings ? [{ label: "Address", value: settings.officeAddress }] : []),
                        ...(bookingResult?.assignedTo ? [{ label: "With", value: bookingResult.assignedTo.name }] : []),
                      ].map(({ label, value }, i, arr) => (
                        <div key={label} className={`flex gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-[#F5F5F5]" : ""}`}>
                          <span className="text-[11px] font-semibold text-[#AAA] uppercase tracking-wide w-16 flex-shrink-0 pt-0.5">{label}</span>
                          <span className="text-xs text-[#1A1A1A] font-medium leading-relaxed break-all">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* WhatsApp reminder note */}
                    <div className="w-full flex items-start gap-3 p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
                      <span className="text-lg">💬</span>
                      <p className="text-xs text-[#166534] leading-relaxed text-left">
                        You'll receive a <strong>WhatsApp reminder</strong> 24 hours before your call. Save our number: <strong>+232 30 600 600</strong>
                      </p>
                    </div>

                    {/* Add to Calendar */}
                    {googleCalUrl && (
                      <a
                        href={googleCalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 border border-[#E5E5E5] rounded-xl py-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FAFAFA] transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Add to Google Calendar
                      </a>
                    )}

                    <button onClick={onClose} className="text-xs text-[#888] hover:text-[#1A1A1A] transition-colors">
                      Close
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer / Navigation */}
            {!["loading", "redirect", "done"].includes(step) && (
              <div className="px-6 py-4 border-t border-[#F0F0F0] flex items-center justify-between gap-3 flex-shrink-0 bg-white">
                {/* Back */}
                <button
                  onClick={() => {
                    if (step === "date")    setStep("contact")
                    if (step === "time")    setStep("date")
                    if (step === "confirm") setStep("time")
                  }}
                  disabled={step === "contact" || (step === "date" && !!(prefill?.firstName && prefill?.lastName && prefill?.email))}
                  className="text-sm text-[#888] hover:text-[#1A1A1A] disabled:opacity-0 disabled:pointer-events-none transition-colors"
                >
                  ← Back
                </button>

                {/* Next / Confirm */}
                <button
                  disabled={submitting ||
                    (step === "date"    && !selectedDate) ||
                    (step === "time"    && (!selectedTime || !callMedium)) ||
                    (step === "confirm" && submitting)
                  }
                  onClick={() => {
                    if (step === "contact") {
                      if (validateContact()) setStep("date")
                    } else if (step === "date" && selectedDate) {
                      setStep("time")
                    } else if (step === "time" && selectedTime && callMedium) {
                      setStep("confirm")
                    } else if (step === "confirm") {
                      handleSubmit()
                    }
                  }}
                  className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                      Booking…
                    </>
                  ) : step === "confirm" ? (
                    "Confirm Booking"
                  ) : (
                    "Continue →"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
