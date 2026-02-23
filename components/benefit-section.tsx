"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { CareersBenefits } from "@/payload/lib/types"

const defaultBenefits = [
  {
    icon: "💰",
    title: "Performance-driven pay",
    description:
      "We reward both the impact you create and the effort you put in to get there. Compensation reflects measurable results and the discipline, consistency, and work ethic that drive them. Clear expectations, accountability, and upside are built in for those who consistently raise the bar.",
  },
  {
    icon: "❤️",
    title: "Health and balance that lasts",
    description:
      "Winning at work doesn't matter if you're losing outside of it. We encourage habits that support long-term health — physical, mental, and financial. Our goal is simple: Help you sustain the energy and focus it takes to perform at a high level.",
  },
  {
    icon: "📈",
    title: "Relentless personal growth",
    description:
      "We expect you to get better — and we'll invest in you to make it happen. Your improvement is our improvement.",
  },
  {
    icon: "🚀",
    title: "Setup to be next chapter ready",
    description:
      "We know careers don't stand still. By building skills, relationships, and experience here, you're ready for whatever comes next.",
  },
]

interface BenefitsSectionProps {
  data?: CareersBenefits
}

export function BenefitsSection({ data }: BenefitsSectionProps) {
  const benefits = data?.items?.map(b => ({
    icon: b.icon || "✨",
    title: b.title || "",
    description: b.description || ""
  })) || defaultBenefits

  return (
    <section className="bg-[#1a1a2e] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-black mb-16 text-center text-balance"
        >
          <span className="text-[#177fc9]">Investing</span> <span className="text-white">in High Performers</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#252540] p-8 rounded-lg border border-gray-700"
            >
              <div className="text-5xl mb-6">{benefit.icon}</div>
              <h3 className="text-2xl font-black text-white mb-4">{benefit.title}</h3>
              <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/careers/jobs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
            >
              View Job Openings
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
