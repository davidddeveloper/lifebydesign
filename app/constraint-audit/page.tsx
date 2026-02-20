// constraint-audit/page.tsx
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AuditForm from "@/components/AuditForm"
import ResultsPage from "@/components/ResultsPage"

export default function Home() {
  const [showResults, setShowResults] = useState(false)
  const [auditResults, setAuditResults] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFormSubmit = async (formData: any) => {
    setIsAnalyzing(true)

    try {
      // Send to n8n webhook
      const response = await fetch("/api/submit-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const results = await response.json()

      // Surface server-side errors clearly
      if (!response.ok || results.error) {
        throw new Error(results.error || `Server error ${response.status}`)
      }

      if (!results.fields) {
        throw new Error("Invalid response: missing fields")
      }

      // Parse JSON string fields if needed
      const fields = results.fields
      const parsedFields = {
        ...fields,
        evidence_points:
          typeof fields.evidence_points === "string"
            ? JSON.parse(fields.evidence_points)
            : fields.evidence_points || [],
        scores: typeof fields.scores === "string" ? JSON.parse(fields.scores) : fields.scores || {},
        revenue_impact:
          typeof fields.revenue_impact === "string"
            ? JSON.parse(fields.revenue_impact)
            : fields.revenue_impact || {},
        quick_win:
          typeof fields.quick_win === "string"
            ? JSON.parse(fields.quick_win)
            : fields.quick_win || {},
      }

      setAuditResults(parsedFields)
      setShowResults(true)
      console.log("Audit submitted successfully:", results, parsedFields)
    } catch (error) {
      console.error("Error submitting audit:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isAnalyzing) {
    return <AnalyzingScreen />
  }

  if (showResults && auditResults) {
    return <ResultsPage data={auditResults} />
  }

  return <AuditForm onSubmit={handleFormSubmit} />
}

// Loading screen while analyzing responses
function AnalyzingScreen() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { label: "Scoring your 5 growth levers", icon: "WHO,WHAT,SELL,FIND,OPS" },
    { label: "Analyzing response patterns", icon: "patterns" },
    { label: "Identifying your #1 constraint", icon: "constraint" },
    { label: "Calculating revenue impact", icon: "revenue" },
    { label: "Building your roadmap", icon: "roadmap" },
  ]

  const tips = [
    "80% of business problems come from just one constraint. Fix that, and everything else becomes easier.",
    "The biggest bottleneck is rarely where you think it is. That's why data-driven analysis matters.",
    "Businesses that focus on one constraint at a time grow 3x faster than those trying to fix everything.",
  ]

  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + Math.random() * 8
      })
    }, 600)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 2500)

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length)
    }, 5000)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
      clearInterval(tipInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-center">

          {/* Animated rings */}
          <div className="relative w-32 h-32 mx-auto mb-10">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#177fc9]/20"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            {/* Middle ring */}
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-[#177fc9]/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            />
            {/* Spinning arc */}
            <motion.svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx="50" cy="50" r="46"
                fill="none"
                stroke="#177fc9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="70 220"
              />
            </motion.svg>
            {/* Center icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#177fc9] flex items-center justify-center shadow-lg shadow-blue-200">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Analyzing Your Business</h2>
          <p className="text-sm text-gray-500 mb-8">Calculating your scores based on your responses</p>

          {/* Steps with progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 text-left">
            <div className="space-y-3">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.4 }}
                  animate={{
                    opacity: i <= currentStep ? 1 : 0.4,
                  }}
                  className="flex items-center gap-3"
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                    i < currentStep
                      ? "bg-green-100 text-green-600"
                      : i === currentStep
                        ? "bg-[#177fc9] text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}>
                    {i < currentStep ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-sm ${
                    i === currentStep ? "font-semibold text-gray-900" : i < currentStep ? "text-gray-500" : "text-gray-400"
                  }`}>
                    {step.label}
                    {i === currentStep && (
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="inline-block ml-0.5"
                      >...</motion.span>
                    )}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="bg-[#177fc9] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Rotating tips */}
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-xs text-gray-400 italic max-w-sm mx-auto leading-relaxed"
            >
              &ldquo;{tips[tipIndex]}&rdquo;
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
