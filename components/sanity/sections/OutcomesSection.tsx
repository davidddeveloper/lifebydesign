"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { OutcomesSection } from '@/sanity/lib/types'

interface OutcomesSectionProps {
  data: OutcomesSection
}

export function OutcomesSectionComponent({ data }: OutcomesSectionProps) {
  const { outcomes, closingStatement } = data

  if (!outcomes || outcomes.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">What You Get</h2>
          <div className="flex justify-center">
            <div className="h-1 w-20 bg-[#177fc9]"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-6"
        >
          {outcomes.map((outcome, index) => (
            <motion.div
              key={outcome._key || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md"
            >
              <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{outcome.title}</h3>
                <p className="text-gray-700 leading-relaxed">{outcome.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {closingStatement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-xl text-gray-700 font-medium max-w-3xl mx-auto">{closingStatement}</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
