"use client"

import { motion } from "framer-motion"
import type { CareersBenefitsSection } from '@/sanity/lib/types'

interface CareersBenefitsProps {
  data: CareersBenefitsSection
}

export function CareersBenefitsComponent({ data }: CareersBenefitsProps) {
  const { benefits } = data

  if (!benefits || benefits.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Benefits & Perks</h2>
          <div className="flex justify-center">
            <div className="h-1 w-20 bg-[#177fc9]"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit._key || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              {benefit.icon && (
                <div className="text-4xl mb-4">{benefit.icon}</div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
