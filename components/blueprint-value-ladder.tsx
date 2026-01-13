"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface BlueprintValueLadderProps {
  onOpenForm: () => void
}

export function BlueprintValueLadder({ onOpenForm }: BlueprintValueLadderProps) {
  const products = [
    {
      name: "2-Day Workshop",
      tagline: "Find Your Constraint",
      description: "Learn the framework and build your 90-day plan",
      price: "$100",
      capacity: "25 participants",
      frequency: "Monthly",
      includes: [
        "2 full days of training (Fri-Sat, 8:30 AM - 5:00 PM)",
        "5 Levers Framework training",
        "Self-diagnostic tool",
        "90-day plan outline",
        "Week 1 action checklist",
        "Accountability partner",
        "20-page workbook",
        "Certificate of completion",
      ],
      guarantee: "Don't leave with a clear plan? Full refund.",
      cta: "Register for Workshop",
      highlighted: true,
    },
    {
      name: "90-Day Program",
      tagline: "Fix Your Constraint With Expert Coaching",
      description: "Complete implementation with professional coaching",
      price: "$600",
      priceNote: "Pilot pricing (Regular $1,200)",
      capacity: "10 per cohort",
      prerequisite: "Must complete 2-Day Workshop first",
      includes: [
        "Week 1: 41-question audit + 2-hour results presentation",
        "6 bi-weekly coaching calls (45 min each)",
        "Daily WhatsApp support (24hr response)",
        "Progress tracking dashboard",
        "Accountability check-ins",
        "All templates & tools",
        "Troubleshooting on demand",
      ],
      guarantee: "Do the work, see zero results? Full refund.",
      cta: "Apply for Program",
      highlighted: false,
    },
  ]

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Two products, two prices</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className={`rounded-2xl overflow-hidden transition-all ${
                product.highlighted
                  ? "ring-4 ring-[#177fc9] transform md:scale-105 shadow-2xl"
                  : "border-2 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`${product.highlighted ? "bg-gradient-to-br from-[#177fc9] to-[#42adff] text-white" : "bg-gray-50"} px-8 py-6`}>
                <h3 className="text-2xl font-black mb-2">{product.name}</h3>
                <p className={`text-sm font-semibold ${product.highlighted ? "text-white/90" : "text-gray-600"}`}>{product.tagline}</p>
              </div>

              <div className="p-8 bg-white">
                <p className="text-sm text-gray-600 mb-6">{product.description}</p>

                <div className="mb-6">
                  <div className={`text-4xl font-black ${product.highlighted ? "text-[#177fc9]" : "text-gray-900"}`}>
                    {product.price}
                  </div>
                  {"priceNote" in product && <p className="text-sm text-gray-600 mt-1">{product.priceNote}</p>}
                </div>

                <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                  {"capacity" in product && (
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Capacity:</span> {product.capacity}
                    </p>
                  )}
                  {"frequency" in product && (
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Frequency:</span> {product.frequency}
                    </p>
                  )}
                  {"prerequisite" in product && (
                    <p className="text-sm text-red-600 font-semibold">
                      * {product.prerequisite}
                    </p>
                  )}
                </div>

                <p className="text-sm font-semibold text-gray-900 mb-3 uppercase">What's Included:</p>
                <ul className="space-y-2 mb-6">
                  {product.includes.map((item, j) => (
                    <li key={j} className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#177fc9]" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <p className="text-xs text-green-800 font-semibold">
                    ✓ GUARANTEE: {product.guarantee}
                  </p>
                </div>

                <button
                  onClick={onOpenForm}
                  className={`w-full py-3 px-6 font-bold rounded-lg transition-colors ${
                    product.highlighted
                      ? "bg-[#177fc9] text-white hover:bg-[#42adff]"
                      : "border-2 border-[#177fc9] text-[#177fc9] hover:bg-[#177fc9] hover:text-white"
                  }`}
                >
                  {product.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-gray-50 rounded-2xl p-8 max-w-3xl mx-auto">
            <p className="text-lg font-bold text-gray-900 mb-2">Package Deal:</p>
            <p className="text-2xl font-black text-[#177fc9] mb-2">Workshop + 90-Day Program = $700</p>
            <p className="text-sm text-gray-600">Average ROI: 6-11x within 90 days (for Le 40M/month business)</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
