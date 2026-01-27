"use client"

import { motion } from "framer-motion"
import type { CareersValuesSection } from '@/sanity/lib/types'

interface CareersValuesProps {
  data: CareersValuesSection
}

export function CareersValuesComponent({ data }: CareersValuesProps) {
  const { values } = data

  if (!values || values.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Our Values</h2>
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
          {values.map((value, index) => (
            <motion.div
              key={value._key || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gray-50 p-6 rounded-lg text-center"
            >
              {value.icon && (
                <div className="text-4xl mb-4">{value.icon}</div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-700 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
