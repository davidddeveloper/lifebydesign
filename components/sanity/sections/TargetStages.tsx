"use client"

import { motion } from "framer-motion"
import type { TargetStagesSection } from '@/sanity/lib/types'

interface TargetStagesProps {
  data: TargetStagesSection
}

export function TargetStagesComponent({ data }: TargetStagesProps) {
  const { stages } = data

  if (!stages || stages.length === 0) {
    return null
  }

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
            The Scaling Blueprint is built for businesses stuck despite working hard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stages.map((stage, index) => (
            <motion.div
              key={stage._key || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold text-[#177fc9] mb-4">{stage.title}</h3>

              {stage.coreProblem && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-600 uppercase">Core Problem</p>
                  <p className="text-gray-700">{stage.coreProblem}</p>
                </div>
              )}

              {stage.painPoint && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-600 uppercase">Pain Point</p>
                  <p className="text-gray-700">{stage.painPoint}</p>
                </div>
              )}

              {stage.weFix && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-semibold text-green-600 uppercase">We Fix</p>
                  <p className="text-gray-900 font-medium">{stage.weFix}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
