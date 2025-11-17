"use client"

import { motion } from "framer-motion"

export function BlueprintTargetSegments() {
  const segments = [
    {
      name: "Product-Market Fit Seeker",
      problem: "Built something great, but can't sell it.",
      pain: '"I have a product but no customers."',
      constraint: "Product / Marketing / Sales",
    },
    {
      name: "Chaotic Operator",
      problem: "Making money but drowning in operations",
      pain: '"I\'m putting out fires daily."',
      constraint: "Customer Service / IT / Finance",
    },
    {
      name: "Overwhelmed Founder",
      problem: "Business can't run without them",
      pain: '"If I stop, it stops."',
      constraint: "Recruitment / HR",
    },
  ]

  return (
    <section className="py-20 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Is This For You?</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            The Scaling Blueprint is built for founders in three specific stages of growth chaos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {segments.map((segment, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-black text-gray-900 mb-3">{segment.name}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase">Core Problem</p>
                  <p className="text-gray-900">{segment.problem}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase">Pain Point</p>
                  <p className="italic text-gray-700">{segment.pain}</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-[#177fc9] uppercase">We Fix</p>
                  <p className="text-gray-900">{segment.constraint}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}