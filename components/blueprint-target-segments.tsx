"use client"

import { motion } from "framer-motion"
import { X, AlertCircle } from "lucide-react"

export function BlueprintTargetSegments() {
  const triedThings = [
    "Better marketing campaigns",
    "New products or services",
    "Hiring more people",
    "Working longer hours",
    "Cutting costs",
  ]

  return (
    <section className="py-20 lg:py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Why Most Businesses Stay Stuck
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm mb-8"
        >
          <p className="text-lg text-gray-700 mb-6">You&apos;ve tried everything:</p>

          <div className="space-y-3 mb-8">
            {triedThings.map((thing, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-gray-700"
              >
                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span>{thing}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-lg text-gray-900 font-semibold mb-6">But nothing moves the needle.</p>

          <div className="bg-[#177fc9]/10 rounded-xl p-6 border-l-4 border-[#177fc9]">
            <p className="text-lg font-bold text-gray-900 mb-2">Here&apos;s why:</p>
            <p className="text-gray-700">
              You&apos;re not attacking the real constraint—the ONE bottleneck choking your growth.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm"
        >
          <div className="flex items-start gap-4 mb-6">
            <AlertCircle className="w-8 h-8 text-[#177fc9] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">The Constraint Problem</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Every business has 5 critical functions (we call them &quot;levers&quot;). When all 5 work together, you grow.
                When even ONE is broken, you&apos;re stuck.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Most founders waste time fixing problems that don&apos;t matter. They optimize marketing when their offer is broken.
              They hire salespeople when they have no leads. They build systems when they&apos;re selling to the wrong customers.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900">The Scaling Blueprint changes that.</h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#177fc9] text-white font-bold flex-shrink-0">
                  1
                </span>
                <div>
                  <p className="text-gray-900">
                    <span className="font-bold">Identify</span> your exact constraint in 2 days
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#177fc9] text-white font-bold flex-shrink-0">
                  2
                </span>
                <div>
                  <p className="text-gray-900">
                    <span className="font-bold">Eliminate</span> that constraint in 90 days
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#177fc9] text-white font-bold flex-shrink-0">
                  3
                </span>
                <div>
                  <p className="text-gray-900">
                    <span className="font-bold">Grow</span> your revenue by 30-50% (average)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-lg font-semibold text-gray-900 text-center">
                No guessing. No generic advice. Just a clear path from stuck to scaling.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}