"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"
import type { PricingPlansSection } from '@/sanity/lib/types'

interface PricingPlansProps {
  data: PricingPlansSection
}

export function PricingPlansComponent({ data }: PricingPlansProps) {
  const { plans } = data

  if (!plans || plans.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Pricing</h2>
          <div className="flex justify-center">
            <div className="h-1 w-20 bg-[#177fc9]"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className={`grid gap-8 ${plans.length === 1 ? 'max-w-md mx-auto' : plans.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'}`}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan._key || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gray-50 p-8 rounded-lg border-2 border-gray-200 hover:border-[#177fc9] transition-colors"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              {plan.price && (
                <p className="text-4xl font-black text-[#177fc9] mb-2">{plan.price}</p>
              )}
              {plan.billingNote && (
                <p className="text-sm text-gray-500 mb-6">{plan.billingNote}</p>
              )}

              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {plan.ctaText && plan.ctaUrl && (
                <Link href={plan.ctaUrl}>
                  <Button className="w-full bg-[#177fc9] hover:bg-[#42adff] text-white font-bold py-3 rounded-full">
                    {plan.ctaText}
                  </Button>
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
