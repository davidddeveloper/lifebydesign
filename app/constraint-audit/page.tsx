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

      // Parse JSON string fields if needed
      const parsedFields = {
        ...results.fields,
        evidence_points:
          typeof results.fields.evidence_points === "string"
            ? JSON.parse(results.fields.evidence_points)
            : results.fields.evidence_points,
        scores: typeof results.fields.scores === "string" ? JSON.parse(results.fields.scores) : results.fields.scores,
        revenue_impact:
          typeof results.fields.revenue_impact === "string"
            ? JSON.parse(results.fields.revenue_impact)
            : results.fields.revenue_impact,
        quick_win:
          typeof results.fields.quick_win === "string"
            ? JSON.parse(results.fields.quick_win)
            : results.fields.quick_win,
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

// Loading screen while AI analyzes
function AnalyzingScreen() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    "Calculating your scores...",
    "Analyzing your responses...",
    "Identifying your constraint...",
    "Calculating revenue impact...",
    "Preparing your roadmap...",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + Math.random() * 10
      })
    }, 500)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          {/* Animated Logo/Icon */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              scale: { duration: 1, repeat: Number.POSITIVE_INFINITY },
            }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#177fc9] to-[#42adff] rounded-full flex items-center justify-center text-white text-4xl shadow-2xl"
          >
            🎯
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyzing Your Business...</h2>
          <p className="text-gray-600 mb-8">Our AI is identifying your #1 constraint</p>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-[#177fc9] to-[#42adff] h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Current Step */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[#177fc9] font-medium"
            >
              {steps[currentStep]}
            </motion.p>
          </AnimatePresence>

          {/* Fun facts while they wait */}
          <div className="mt-12 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <p className="text-sm text-gray-600 italic">
              "Did you know? 80% of business problems come from just one constraint. Fix that, and everything else
              becomes easier."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
