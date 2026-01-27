"use client"

import { motion } from "framer-motion"
import { urlFor } from '@/sanity/lib/image'
import type { WorkshopBenefitsSection } from '@/sanity/lib/types'

interface WorkshopBenefitsProps {
  data: WorkshopBenefitsSection
}

export function WorkshopBenefitsComponent({ data }: WorkshopBenefitsProps) {
  const { benefits } = data

  if (!benefits || benefits.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">What You'll Get</h2>
          <div className="flex justify-center">
            <div className="h-1 w-20 bg-[#177fc9]"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit._key || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}
            >
              {benefit.image && (
                <div className="md:w-1/2">
                  <img
                    src={urlFor(benefit.image).width(600).url()}
                    alt={benefit.title || `Benefit ${index + 1}`}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )}
              <div className={`md:w-1/2 ${!benefit.image ? 'w-full' : ''}`}>
                {benefit.number && (
                  <span className="text-6xl font-black text-[#177fc9] opacity-30">{benefit.number}</span>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
