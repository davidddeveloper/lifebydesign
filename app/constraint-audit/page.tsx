"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ConstraintAuditFormV2 from "@/components/ConstraintAuditFormV2"
import AuditResultsV2 from "@/components/AuditResultsV2"

export default function ConstraintAuditPage() {
  const [phase, setPhase] = useState<"form" | "analyzing" | "results">("form")
  const [auditResults, setAuditResults] = useState<any>(null)

  const handleFormSubmit = async (formData: any) => {
    setPhase("analyzing")

    try {
      const response = await fetch("/api/submit-audit-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const rawText = await response.text()
      let results: any = {}
      if (rawText.trim()) {
        try {
          results = JSON.parse(rawText)
        } catch {
          throw new Error(`Server returned non-JSON response (status ${response.status})`)
        }
      }

      if (!response.ok) {
        throw new Error(results?.error || `Request failed with status ${response.status}`)
      }

      if (!results.fields) {
        throw new Error("Invalid response: missing fields")
      }

      const fields = results.fields
      const safeFieldParse = (val: unknown, fallback: unknown): unknown => {
        if (typeof val === "string" && val.trim()) {
          try { return JSON.parse(val) } catch { return fallback }
        }
        return val ?? fallback
      }

      setAuditResults({
        ...fields,
        evidence_points: safeFieldParse(fields.evidence_points, []),
        scores: safeFieldParse(fields.scores, {}),
        revenue_impact: safeFieldParse(fields.revenue_impact, {}),
        quick_win: safeFieldParse(fields.quick_win, {}),
      })
      setPhase("results")
    } catch (error) {
      console.error("Error submitting audit:", error)
      alert(error instanceof Error ? error.message : "Something went wrong. Please try again.")
      setPhase("form")
    }
  }

  if (phase === "analyzing") {
    return <AnalyzingScreen />
  }

  if (phase === "results" && auditResults) {
    return <AuditResultsV2 data={auditResults} />
  }

  return <ConstraintAuditFormV2 onSubmit={handleFormSubmit} />
}

// ─────────────────────────────────────────────
// Analyzing screen — full dark, branded
// ─────────────────────────────────────────────

const LEVER_LABELS = ["WHO", "WHAT", "FIND YOU", "SELL", "DELIVER"]
const ANALYSIS_STEPS = [
  "Scoring your 5 growth levers",
  "Identifying response patterns",
  "Pinpointing your primary constraint",
  "Calculating revenue opportunity",
  "Generating your diagnostic report",
]

function AnalyzingScreen() {
  const [currentStep, setCurrentStep] = useState(0)
  const [leversDone, setLeversDone] = useState<boolean[]>([false, false, false, false, false])
  const [fakePct, setFakePct] = useState(0)

  useEffect(() => {
    // Advance steps every 8s
    const stepTimer = setInterval(() => {
      setCurrentStep(p => Math.min(p + 1, ANALYSIS_STEPS.length - 1))
    }, 8000)
    // Advance levers every 3s
    const leverTimer = setInterval(() => {
      setLeversDone(prev => {
        const next = [...prev]
        const first = next.indexOf(false)
        if (first !== -1) next[first] = true
        return next
      })
    }, 3000)
    // Smooth fake progress bar
    const pctTimer = setInterval(() => {
      setFakePct(p => {
        if (p >= 92) return p
        return p + (Math.random() * 3)
      })
    }, 700)
    return () => { clearInterval(stepTimer); clearInterval(leverTimer); clearInterval(pctTimer) }
  }, [])

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#177fc9]" />
            <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Startup Bodyshop</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Analysing your business</h2>
          <p className="text-sm text-[#555]">This usually takes 30–60 seconds</p>
        </div>

        {/* 5 Lever cards — light up as they "complete" */}
        <div className="grid grid-cols-5 gap-2 mb-10">
          {LEVER_LABELS.map((label, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: leversDone[i] ? 1 : 0.2 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-1.5"
            >
              <motion.div
                className="w-full aspect-square flex items-center justify-center text-[9px] font-bold"
                style={{
                  backgroundColor: leversDone[i] ? "#177fc9" : "#2A2A2A",
                  color: leversDone[i] ? "#FFFFFF" : "#555",
                  border: `1px solid ${leversDone[i] ? "#177fc9" : "#333"}`,
                }}
                animate={leversDone[i] ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {leversDone[i] ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <motion.span
                    animate={!leversDone[i] && i === leversDone.indexOf(false) ? { opacity: [1, 0.3, 1] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    {i + 1}
                  </motion.span>
                )}
              </motion.div>
              <span className="text-[8px] text-[#555] font-semibold uppercase tracking-wide text-center leading-tight">{label}</span>
            </motion.div>
          ))}
        </div>

        {/* Current step */}
        <div className="mb-6 h-10 flex items-center">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-sm text-[#888] leading-relaxed"
          >
            <span className="text-white font-medium">{ANALYSIS_STEPS[currentStep]}</span>
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-[#555]"
            >…</motion.span>
          </motion.p>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-[#2A2A2A] w-full overflow-hidden">
          <motion.div
            className="h-full bg-[#177fc9]"
            initial={{ width: 0 }}
            animate={{ width: `${fakePct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* Steps list */}
        <div className="mt-8 space-y-2.5">
          {ANALYSIS_STEPS.map((step, i) => (
            <div key={i} className={`flex items-center gap-3 transition-opacity duration-300 ${i > currentStep ? "opacity-20" : "opacity-100"}`}>
              <div className={`w-4 h-4 flex-shrink-0 flex items-center justify-center text-[9px] font-bold ${
                i < currentStep ? "bg-[#177fc9] text-white" :
                i === currentStep ? "bg-[#333] text-[#888]" :
                "bg-[#222] text-[#444]"
              }`}>
                {i < currentStep ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-2.5 h-2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-xs ${i === currentStep ? "text-[#CCC]" : i < currentStep ? "text-[#555]" : "text-[#333]"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
