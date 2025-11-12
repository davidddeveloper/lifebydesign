"use client"

import { motion } from "framer-motion"

const coreValues = ["Impact", "Integrity", "Inclusivity", "Collaboration", "Excellence"]

export function LBDCoreValues() {
  return (
    <section className="bg-gray-50 py-20 md:py-32"
    style={{
      background: "#f5f5f5",
      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)",
      backgroundSize: "20px 20px",
    }}>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Core Values</h2>
          <div className="flex justify-center">
            <div className="h-1 w-20 bg-[#177fc9]"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-6"
        >
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="px-6 py-3 bg-white rounded-full border-2 border-[#177fc9] font-bold text-gray-900 hover:bg-[#177fc9] hover:text-white transition-colors"
            >
              {value}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}