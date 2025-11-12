"use client"

import { motion } from "framer-motion"

const impactStats = [
  { number: "2,900+", label: "Entrepreneurs Trained & Mentored" },
  { number: "$2.9M", label: "Equity, Debt & Grants Channelled" },
  { number: "120+", label: "Businesses Trained" },
]

export function LBDImpact() {
  return (
    <section className="bg-gradient-to-r from-[#177fc9] to-[#6d28d9] py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Our Impact</h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center text-white"
            >
              <div className="text-4xl md:text-5xl font-black mb-2">{stat.number}</div>
              <div className="text-lg font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
