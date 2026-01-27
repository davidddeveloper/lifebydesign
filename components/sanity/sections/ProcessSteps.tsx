"use client"

import { motion } from "framer-motion"
import type { ProcessStepsSection } from '@/sanity/lib/types'

interface ProcessStepsProps {
  data: ProcessStepsSection
}

export function ProcessStepsComponent({ data }: ProcessStepsProps) {
  const { steps } = data

  if (!steps || steps.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">How It Works</h2>
          <div className="flex justify-center">
            <div className="h-1 w-20 bg-[#177fc9]"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step._key || index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-start gap-6 p-6 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#177fc9] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {step.stepNumber || index + 1}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
