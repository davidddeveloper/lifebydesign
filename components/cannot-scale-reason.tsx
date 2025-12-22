"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CannotScaleReasonGraphic() {
  const reasons = [
    "KEY MAN RISK",
    "LACK OF SYSTEMS & PROCESSES",
    "POOR CASH FLOW MANAGEMENT",
    "LIMITED MARKET STRATEGY",
    "WEAK TEAM STRUCTURE",
  ]

  const [currentReasonIndex, setCurrentReasonIndex] = useState(0)

  const handleNextReason = () => {
    setCurrentReasonIndex((prev) => (prev + 1) % reasons.length)
  }

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-[#0f172a] rounded-lg p-8 md:p-12 shadow-2xl">
        <div className="text-center">
          <p className="text-white/70 text-lg md:text-xl mb-4">
            #{currentReasonIndex + 1} REASON
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
            why{" "}
            <span className="font-black">
              ENTREPRENEURS
              <br />
              CAN'T SCALE
            </span>
          </h2>
          <div className="flex justify-center mb-6">
            <svg
              className="w-12 h-24 text-[#7c3aed]"
              fill="currentColor"
              viewBox="0 0 24 48"
            >
              <path
                d="M12 0 L12 40 M12 40 L6 34 M12 40 L18 34"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>

          {/* Animated Reason */}
          <div
            onClick={handleNextReason}
            className="inline-block cursor-pointer bg-gradient-to-r from-yellow-400 to-yellow-300 px-8 py-4 rounded-lg select-none"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentReasonIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900"
              >
                {reasons[currentReasonIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-6">
            <span className="inline-block bg-[#7c3aed] text-white px-6 py-2 rounded-full text-sm font-semibold cursor-pointer" onClick={handleNextReason}>
              reason why I can't scale
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
