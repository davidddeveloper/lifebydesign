"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { DeliverablesSection } from '@/sanity/lib/types'

interface DeliverablesProps {
  data: DeliverablesSection
}

export function DeliverablesComponent({ data }: DeliverablesProps) {
  const { items } = data

  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">What's Included</h2>
          <div className="flex justify-center">
            <div className="h-1 w-20 bg-[#177fc9]"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-4"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
