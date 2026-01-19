"use client"

import { motion } from "framer-motion"

export function LBDMission() {
  return (
    <section id="our-story" className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">OUR MISSION</h2>
              <div className="h-1 w-20 bg-[#177fc9]"></div>
              <p className="text-gray-700 leading-relaxed text-lg">
                We help African founders build businesses that scale — by giving them the systems, skills, and accountability to grow fast, profitably, and sustainably.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">OUR VISION</h2>
              <div className="h-1 w-20 bg-[#177fc9]"></div>
              <p className="text-gray-700 leading-relaxed text-lg">
                To be Africa's most trusted partner for building scalable startups — helping you attract investment, scale responsibly, and build a business that outlasts you.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
