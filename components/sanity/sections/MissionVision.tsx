"use client"

import { motion } from "framer-motion"
import type { MissionVisionSection } from '@/sanity/lib/types'

interface MissionVisionProps {
  data: MissionVisionSection
}

export function MissionVisionComponent({ data }: MissionVisionProps) {
  const { mission, vision } = data

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          {mission && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-black text-gray-900">Mission</h3>
              <p className="text-gray-700 leading-relaxed">{mission}</p>
            </motion.div>
          )}

          {vision && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-black text-gray-900">Vision</h3>
              <p className="text-gray-700 leading-relaxed">{vision}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
