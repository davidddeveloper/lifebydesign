"use client"

import { motion } from "framer-motion"
import type { ProductPromiseSection } from '@/sanity/lib/types'

interface ProductPromiseProps {
  data: ProductPromiseSection
}

export function ProductPromiseComponent({ data }: ProductPromiseProps) {
  const { heading, description, guarantee } = data

  return (
    <section className="bg-[#1e293b] py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          {heading && (
            <h2 className="text-3xl md:text-4xl font-black text-white">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          {guarantee && (
            <div className="pt-4">
              <p className="text-lg text-[#177fc9] font-bold">
                {guarantee}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
