"use client"

// components/AuditResultsV2.tsx
// Results page for the v3 Constraint Audit.
// Includes: animated score counters, radar chart, narrative accordion,
// revenue block, AI chat widget.

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from "recharts"
import BookingModal, { type BookingPrefill } from "@/components/BookingModal"
import FeedbackWidget from "@/components/FeedbackWidget"
import { useBrandTheme } from "@/lib/use-brand-theme"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface AuditResultsData {
  score_who: number; score_what: number; score_traffic: number
  score_sell: number; score_operations: number
  band_who: string; band_what: string; band_traffic: string
  band_sell: string; band_operations: string
  final_constraint: string; primary_score: number
  secondary_constraint: string | null; rule_applied: number
  narrative_what_working: string; narrative_primary_constraint: string
  narrative_cost: string; narrative_root_cause: string; narrative_next_step: string
  revenue_opportunity_text: string
  interaction_flags: string[]
  recommended_cta: "workshop" | "vip_consultation" | "90day_programme" | "scaling"
  business_name: string; owner_name: string
  monthly_revenue: string | number; industry: string; email: string
  audit_id: string | null
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const BAND_STYLES: Record<string, { bg: string; text: string; bar: string; border: string; light: string }> = {
  CRITICAL: { bg: "#FEF2F2", text: "#DC2626", bar: "#DC2626", border: "#FECACA", light: "#FFF5F5" },
  WEAK: { bg: "#FFFBEB", text: "#D97706", bar: "#D97706", border: "#FDE68A", light: "#FFFDF0" },
  FUNCTIONAL: { bg: "#EFF6FF", text: "#2563EB", bar: "#2563EB", border: "#BFDBFE", light: "#F0F7FF" },
  STRONG: { bg: "#F0FDF4", text: "#16A34A", bar: "#16A34A", border: "#BBF7D0", light: "#F5FFF8" },
}
const BAND_DEFAULT = { bg: "#F9FAFB", text: "#374151", bar: "#6B7280", border: "#E5E7EB", light: "#FAFAFA" }

const LEVERS = [
  { key: "who", label: "WHO", sublabel: "Market", scoreKey: "score_who", bandKey: "band_who" },
  { key: "what", label: "WHAT", sublabel: "Offer", scoreKey: "score_what", bandKey: "band_what" },
  { key: "traffic", label: "FIND YOU", sublabel: "Traffic", scoreKey: "score_traffic", bandKey: "band_traffic" },
  { key: "sell", label: "SELL", sublabel: "Conversion", scoreKey: "score_sell", bandKey: "band_sell" },
  { key: "operations", label: "DELIVER", sublabel: "Operations", scoreKey: "score_operations", bandKey: "band_operations" },
] as const

// routeToWorkshops: true  → Link to /workshops page
// routeToWorkshops: false → Opens the booking modal
const CTA_CONFIG: Record<string, { label: string; description: string; routeToWorkshops: boolean }> = {
  workshop: {
    label: "Register for the Workshop",
    description: "A structured 2-day programme to break through your constraint with hands-on exercises and peer learning.",
    routeToWorkshops: true,
  },
  vip_consultation: {
    label: "Book a VIP Consultation",
    description: "A private 1-on-1 session with a Startup Bodyshop coach to build your personalised 90-day action plan.",
    routeToWorkshops: true,
  },
  "90day_programme": {
    label: "Start the 90-Day Programme",
    description: "Three months of weekly coaching, implementation support, and accountability to break through your constraint.",
    routeToWorkshops: false,
  },
  scaling: {
    label: "Book a Scaling Conversation",
    description: "Your business is performing well across all levers. Let's talk about what the next stage looks like.",
    routeToWorkshops: false,
  },
}

const NARRATIVE_SECTIONS = [
  { key: "narrative_what_working", label: "What Is Working", icon: "✓" },
  { key: "narrative_primary_constraint", label: "Your Primary Constraint", icon: "!" },
  { key: "narrative_cost", label: "What This Is Costing You", icon: "£" },
  { key: "narrative_root_cause", label: "The Root Cause", icon: "↓" },
  { key: "narrative_next_step", label: "Your Recommended Next Step", icon: "→" },
] as const

const RULE_MESSAGES: Record<number, string> = {
  1: "This lever is critically weak and is actively costing you revenue. It must be addressed first.",
  2: "This lever is significantly weaker than all other parts of your business — it is the bottleneck holding everything else back.",
  3: "Two levers are both limiting your growth. Progress on either will create improvement, but you will need to address both.",
  4: "All five levers need improvement. No single bottleneck exists — the whole business needs strengthening.",
  5: "All five levers are functioning well. The constraint is no longer internal — the next stage is active scaling.",
}

// ─────────────────────────────────────────────
// Animated number counter
// ─────────────────────────────────────────────

function AnimatedScore({ target, delay = 0 }: { target: number; delay?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0
      const step = target / 30
      const timer = setInterval(() => {
        start = Math.min(start + step, target)
        setDisplay(parseFloat(start.toFixed(1)))
        if (start >= target) clearInterval(timer)
      }, 35)
      return () => clearInterval(timer)
    }, delay)
    return () => clearTimeout(timeout)
  }, [target, delay])
  return <span>{display.toFixed(1)}</span>
}

// ─────────────────────────────────────────────
// Radar chart
// ─────────────────────────────────────────────

function LeverRadarChart({ data, constraintBand }: {
  data: { subject: string; score: number; fullMark: number }[]
  constraintBand: string
}) {
  const style = BAND_STYLES[constraintBand] || BAND_DEFAULT
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
        <PolarGrid stroke="#E5E7EB" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 10, fontWeight: 700, fill: "#888", fontFamily: "system-ui" }}
        />
        <Tooltip
          formatter={(v: number) => [`${v}/10`, "Score"]}
          contentStyle={{ fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 10px" }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke={style.bar}
          fill={style.bar}
          fillOpacity={0.15}
          strokeWidth={2}
          dot={{ r: 4, fill: style.bar, strokeWidth: 0 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

// ─────────────────────────────────────────────
// AI Chat widget
// ─────────────────────────────────────────────

interface ChatMessage { role: "user" | "assistant"; content: string }

const STARTER_QUESTIONS = [
  "What should I focus on first?",
  "Explain my primary constraint in plain terms",
  "Give me 3 specific actions I can take this week",
  "What does my WHAT score mean for pricing?",
]

function AuditChatWidget({ auditId, data }: { auditId: string | null; data: AuditResultsData }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `Hi${data.owner_name ? ` ${data.owner_name.split(" ")[0]}` : ""}! I've analysed your results. Your primary constraint is **${data.final_constraint}**. Ask me anything about your audit — what it means, what to do next, or how to interpret any score.`,
      }])
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const send = useCallback(async (text: string) => {
    const question = text.trim()
    if (!question || loading) return
    setInput("")
    setMessages(m => [...m, { role: "user", content: question }])
    setLoading(true)
    try {
      const res = await fetch("/api/audit-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId,
          message: question,
          context: {
            businessName: data.business_name,
            primaryConstraint: data.final_constraint,
            scores: {
              who: data.score_who, what: data.score_what,
              traffic: data.score_traffic, sell: data.score_sell,
              operations: data.score_operations,
            },
            narrative: {
              whatIsWorking: data.narrative_what_working,
              constraint: data.narrative_primary_constraint,
              cost: data.narrative_cost,
              rootCause: data.narrative_root_cause,
              nextStep: data.narrative_next_step,
            },
          },
        }),
      })
      const json = await res.json()
      setMessages(m => [...m, { role: "assistant", content: json.reply || "Sorry, I couldn't generate a response." }])
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Something went wrong. Please try again." }])
    } finally {
      setLoading(false)
    }
  }, [auditId, data, loading])

  // Simple markdown bold renderer
  const renderText = (text: string) => {
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : part
    )
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-3 shadow-xl hover:bg-black transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ borderRadius: 0 }}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        <span className="text-xs font-semibold">{open ? "Close" : "Ask about your results"}</span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-20 right-6 z-50 w-[340px] sm:w-[380px] bg-white border border-[#E5E5E5] shadow-2xl flex flex-col"
            style={{ height: 440, borderRadius: 0 }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#F0F0F0] bg-[#F9F9F9] flex-shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#888]">Results Assistant</p>
              <p className="text-xs text-[#555] mt-0.5">Ask anything about your audit</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${msg.role === "user"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F3F4F6] text-[#1A1A1A]"
                      }`}
                  >
                    {renderText(msg.content)}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#F3F4F6] px-3 py-2.5">
                    <motion.div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#888]"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </motion.div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Starter questions (only before first user message) */}
            {messages.filter(m => m.role === "user").length === 0 && (
              <div className="px-4 pb-2 flex-shrink-0">
                <p className="text-[10px] text-[#AAA] mb-1.5 uppercase tracking-wider font-semibold">Suggestions</p>
                <div className="flex flex-wrap gap-1.5">
                  {STARTER_QUESTIONS.slice(0, 3).map((q, i) => (
                    <button key={i} onClick={() => send(q)}
                      className="text-[11px] text-[#555] bg-[#F3F4F6] hover:bg-[#E5E7EB] px-2.5 py-1 transition-colors text-left">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-[#F0F0F0] px-3 py-2.5 flex gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input) } }}
                placeholder="Ask a question…"
                className="flex-1 text-sm text-[#1A1A1A] placeholder-[#BBB] outline-none bg-transparent"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="w-7 h-7 bg-[#1A1A1A] text-white flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m-7 7l7-7 7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export default function AuditResultsV2({ data }: { data: AuditResultsData }) {
  const { primary: brandPrimary } = useBrandTheme()
  const [downloading, setDownloading] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>("narrative_what_working")
  const [bookingOpen, setBookingOpen] = useState(false)

  // Pre-fill booking modal from audit data
  const bookingPrefill: BookingPrefill = {
    firstName:      data.owner_name ? data.owner_name.split(" ")[0] : undefined,
    lastName:       data.owner_name ? data.owner_name.split(" ").slice(1).join(" ") || undefined : undefined,
    email:          data.email || undefined,
    monthlyRevenue: data.monthly_revenue,
    auditId:        data.audit_id ?? undefined,
    source:         "audit",
  }

  const cta = CTA_CONFIG[data.recommended_cta] || CTA_CONFIG["vip_consultation"]

  const constraintBand = (() => {
    const map: Record<string, string> = {
      "WHO (Market)": data.band_who,
      "WHAT (Offer)": data.band_what,
      "HOW THEY FIND YOU (Traffic)": data.band_traffic,
      "HOW YOU SELL (Conversion)": data.band_sell,
      "HOW YOU DELIVER (Operations)": data.band_operations,
    }
    return map[data.final_constraint] || "CRITICAL"
  })()
  const constraintStyle = BAND_STYLES[constraintBand] || BAND_STYLES.CRITICAL

  const radarData = [
    { subject: "WHO", score: data.score_who, fullMark: 10 },
    { subject: "WHAT", score: data.score_what, fullMark: 10 },
    { subject: "FIND YOU", score: data.score_traffic, fullMark: 10 },
    { subject: "SELL", score: data.score_sell, fullMark: 10 },
    { subject: "DELIVER", score: data.score_operations, fullMark: 10 },
  ]

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      // If we have a DB id, fetch the stored PDF from the server
      if (data.audit_id) {
        const res = await fetch(`/api/audit-pdf/${data.audit_id}`)
        if (res.ok) {
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `Constraint-Audit-${(data.business_name || "Report").replace(/[^a-zA-Z0-9]/g, "-")}.pdf`
          a.click()
          URL.revokeObjectURL(url)
          return
        }
        // Server PDF failed — fall through to client-side generation
      }

      // Fallback: generate PDF entirely in the browser from in-memory data
      const { pdf } = await import("@react-pdf/renderer")
      const { AuditResultsPDFV2 } = await import("@/components/AuditResultsPDFV2")
      const React = await import("react")

      const pdfData = {
        businessName: data.business_name || "",
        ownerName: data.owner_name || "",
        industry: data.industry || "",
        monthlyRevenue: String(data.monthly_revenue || ""),
        createdAt: new Date().toISOString(),
        primaryConstraint: data.final_constraint || "",
        secondaryConstraint: data.secondary_constraint || null,
        ruleApplied: data.rule_applied || 1,
        scores: {
          who: data.score_who, what: data.score_what,
          traffic: data.score_traffic, sell: data.score_sell,
          operations: data.score_operations,
        },
        bands: {
          who: data.band_who, what: data.band_what,
          traffic: data.band_traffic, sell: data.band_sell,
          operations: data.band_operations,
        },
        narrative: {
          whatIsWorking: data.narrative_what_working || "",
          primaryConstraintNarrative: data.narrative_primary_constraint || "",
          whatThisCosts: data.narrative_cost || "",
          rootCause: data.narrative_root_cause || "",
          nextStep: data.narrative_next_step || "",
        },
        recommendedCta: data.recommended_cta || "vip_consultation",
        revenueOpportunityText: data.revenue_opportunity_text || "",
      }

      // @ts-ignore
      const blob = await pdf(React.default.createElement(AuditResultsPDFV2, { data: pdfData })).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Constraint-Audit-${(data.business_name || "Report").replace(/[^a-zA-Z0-9]/g, "-")}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("[pdf-download]", err)
      alert("PDF generation failed. Your results have been emailed to you.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-2xl mx-auto px-5 h-12 flex items-center justify-between">
          <Link href="/" className="text-xs text-[#888] hover:text-[#1A1A1A] transition-colors flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Startup Bodyshop
          </Link>
          <button onClick={handleDownloadPDF} disabled={downloading}
            className="flex items-center gap-1.5 text-xs text-[#888] hover:text-[#1A1A1A] transition-colors disabled:opacity-40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {downloading ? "Preparing…" : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-10 pb-28">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {/*<div className="w-1.5 h-1.5 rounded-full bg-[#177fc9]" />*/}
            <span className="text-xs font-semibold text-[#177fc9] uppercase tracking-widest">
              Constraint-Busting Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1">
            {data.business_name || "Your Audit Results"}
          </h1>
          {data.owner_name && (
            <p className="text-sm text-[#888]">{data.owner_name}{data.industry ? ` · ${data.industry}` : ""}</p>
          )}
        </motion.div>

        {/* Primary Constraint hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="mb-8">
          <div className="rounded-xl p-6" style={{ backgroundColor: constraintStyle.light, border: `1px solid ${constraintStyle.border}` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-2">Your Primary Constraint</p>
            <p className="text-2xl font-bold mb-2 leading-tight" style={{ color: constraintStyle.text }}>
              {data.final_constraint}
            </p>
            {data.secondary_constraint && (
              <p className="text-xs text-[#888] mb-2">Secondary: <span className="font-medium">{data.secondary_constraint}</span></p>
            )}
            <p className="text-sm text-[#555] leading-relaxed">{RULE_MESSAGES[data.rule_applied] || ""}</p>
          </div>
        </motion.div>

        {/* Scores — chart + bars side by side on desktop */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.14 }} className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Your 5 Lever Scores</h2>

          <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
            {/* Score cards row */}
            <div className="grid grid-cols-5 border-b border-[#F0F0F0]">
              {LEVERS.map((lever, i) => {
                const score = data[lever.scoreKey] as number
                const band = data[lever.bandKey] as string
                const style = BAND_STYLES[band] || BAND_DEFAULT
                const isConstraint = data.final_constraint.includes(lever.label) || data.final_constraint.includes(lever.sublabel)
                return (
                  <div key={lever.key}
                    className={`flex flex-col items-center py-4 px-2 ${i < 4 ? "border-r border-[#F0F0F0]" : ""}`}
                    style={isConstraint ? { backgroundColor: style.light } : {}}>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#AAA] mb-1">{lever.label}</span>
                    <span className="text-xl font-bold leading-none" style={{ color: style.text }}>
                      <AnimatedScore target={score} delay={i * 120} />
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-wide mt-1.5" style={{ color: style.text }}>{band}</span>
                  </div>
                )
              })}
            </div>

            {/* Radar chart + bar list */}
            <div className="sm:flex">
              {/* Radar */}
              <div className="sm:w-56 sm:border-r sm:border-[#F0F0F0] flex items-center justify-center p-2">
                <LeverRadarChart data={radarData} constraintBand={constraintBand} />
              </div>

              {/* Bars */}
              <div className="flex-1 p-5 space-y-3">
                {LEVERS.map((lever) => {
                  const score = data[lever.scoreKey] as number
                  const band = data[lever.bandKey] as string
                  const style = BAND_STYLES[band] || BAND_DEFAULT
                  const pct = Math.min(100, (score / 10) * 100)
                  const isConstraint = data.final_constraint.includes(lever.label)
                  return (
                    <div key={lever.key} className="flex items-center gap-3">
                      <div className="w-20 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#2D2D2D]">{lever.label}</span>
                          {isConstraint && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: style.text }} />}
                        </div>
                        <span className="text-[9px] text-[#AAA]">{lever.sublabel}</span>
                      </div>
                      <div className="flex-1 h-2 rounded-full overflow-hidden bg-[#F0F0F0]">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: style.bar }}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} />
                      </div>
                      <span className="text-xs font-bold w-10 text-right flex-shrink-0" style={{ color: style.text }}>
                        {score.toFixed(1)}
                      </span>
                    </div>
                  )
                })}
                {/* Band legend */}
                <div className="flex flex-wrap gap-3 pt-1">
                  {Object.entries(BAND_STYLES).map(([band, st]) => (
                    <div key={band} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.bar }} />
                      <span className="text-[9px] text-[#AAA] uppercase tracking-wider">{band}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Diagnostic Narrative — accordion */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Your Diagnostic Report</h2>
          <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden divide-y divide-[#F0F0F0]">
            {NARRATIVE_SECTIONS.map(({ key, label }) => {
              const text = data[key as keyof AuditResultsData] as string
              if (!text) return null
              const isOpen = openSection === key
              return (
                <div key={key}>
                  <button
                    onClick={() => setOpenSection(isOpen ? null : key)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAFAFA] transition-colors"
                  >
                    <span className="text-sm font-semibold text-[#1A1A1A]">{label}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth={2} className="w-4 h-4 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-[#444] leading-relaxed border-t border-[#F7F7F7] pt-4">
                          {text}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Revenue Opportunity */}
        {data.revenue_opportunity_text && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="mb-8">
            <div className="rounded-xl p-6" style={{ backgroundColor: brandPrimary }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFFFFF60] mb-2">Revenue Opportunity</p>
              <p className="text-sm text-white/80 leading-relaxed">{data.revenue_opportunity_text}</p>
            </div>
          </motion.div>
        )}

        {/* Interaction Flags */}
        {data.interaction_flags && data.interaction_flags.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }} className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-3">Additional Signals</h2>
            <div className="space-y-2">
              {data.interaction_flags.map((flag, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-lg border border-[#E5E5E5] px-4 py-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth={2} className="w-4 h-4 mt-0.5 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.193 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm text-[#555] leading-relaxed">{flag}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Your Recommended Next Step</h2>
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
            <p className="text-sm text-[#555] leading-relaxed mb-5">{cta.description}</p>
            {cta.routeToWorkshops ? (
              <Link
                href="/workshops"
                className="inline-flex items-center gap-2 text-white px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80 rounded-lg"
                style={{ backgroundColor: brandPrimary }}
              >
                {cta.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center gap-2 text-white px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80 rounded-lg"
                style={{ backgroundColor: brandPrimary }}
              >
                {cta.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-center">
          <p className="text-xs text-[#AAA] mb-1">
            {data.email ? `A copy has been sent to ${data.email}.` : "A copy has been sent to your email."}
          </p>
          <p className="text-xs text-[#AAA]">
            <a href="https://wa.me/23230600600" className="text-[#177fc9] hover:underline">WhatsApp us</a>
            {" · "}
            <Link href="/" className="text-[#177fc9] hover:underline">startupbodyshop.com</Link>
          </p>
        </motion.div>
      </div>

      {/* AI Chat Widget — controlled by NEXT_PUBLIC_RESULT_ASSISTANT_ENABLED */}
      {process.env.NEXT_PUBLIC_RESULT_ASSISTANT_ENABLED === "true" && (
        <AuditChatWidget auditId={data.audit_id} data={data} />
      )}

      {/* Booking Modal */}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        prefill={bookingPrefill}
      />

      <FeedbackWidget page="results" auditId={data.audit_id} brandColor={brandPrimary} />
    </div>
  )
}
