"use client"

import { motion } from "framer-motion"
import type { WorkflowPhasesSection } from '@/sanity/lib/types'

interface WorkflowPhasesProps {
  data: WorkflowPhasesSection
}

export function WorkflowPhasesComponent({ data }: WorkflowPhasesProps) {
  const { phases } = data

  if (!phases || phases.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Delivery Workflow</h2>
          <div className="flex justify-center">
            <div className="h-1 w-20 bg-[#177fc9]"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6"
        >
          {phases.map((phase, index) => (
            <motion.div
              key={phase._key || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-16 h-16 bg-[#177fc9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {phase.phase || index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{phase.title}</h3>
                  {phase.duration && (
                    <p className="text-sm text-gray-500">{phase.duration}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pl-0 md:pl-20">
                {phase.action && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Action</p>
                    <p className="text-gray-700">{phase.action}</p>
                  </div>
                )}
                {phase.result && (
                  <div>
                    <p className="text-sm font-semibold text-green-600 uppercase mb-1">Result</p>
                    <p className="text-gray-700">{phase.result}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
