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
    <section id="how-it-works" className="pt-14 pb-4 md:pt-16 md:pb-5 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">How The Scaling Blueprint Works</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Three simple steps from diagnosis to scaling</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
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
              <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-200 hover:border-[#42adff] transition-colors">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-[#177fc9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.stepNumber || index + 1}
                </div>


                <h3 className="text-xl font-black text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
