"use client"

import { motion } from "framer-motion"
import Link from "next/link"

interface FinanceHeroProps {
  onOpenForm: () => void
}

export function FinanceHero({ onOpenForm }: FinanceHeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
      zIndex: 2,
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-[85vh] w-full bg-white relative">
      {/* Diagonal Stripes Background */}
      <div
        className="absolute inset-0 -z-0"
        style={{
          backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
        repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px),
        repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px)
      `,
    }}
      >
      <section className="bg-transparent z-10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 text-balance"
              variants={itemVariants}
            >
              Clean Books. <span className="text-[#177fc9]">Credit Ready.</span> Confidence Guaranteed.
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
              variants={itemVariants}
            >
              Professional accounting and financial management for SMEs in Sierra Leone. Stop guessing about your
              finances. Get real-time clarity, credit readiness, and professional support.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
              <button
                onClick={onOpenForm}
                className="px-8 py-4 bg-[#177fc9] text-white font-bold rounded-full cursor-pointer hover:bg-[#42adff] transition-colors"
              >
                Get Started
              </button>
              <Link href="#our-promise" className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-full cursor-pointer hover:bg-gray-900 hover:text-white transition-colors">
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      </div>
    </div>
  )
}
