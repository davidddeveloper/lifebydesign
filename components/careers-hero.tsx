"use client"

import { motion } from "framer-motion"

export function CareersHero() {
  return (
    <section className="bg-white py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 text-balance">
              Join The <span className="text-[#177fc9]">Startup Bodyshop</span> Team
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
              We're seeking teammates who lead with trust, work with discipline, and play to win as a team.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
            >
              View Job Openings
            </motion.button>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full h-96 md:h-full rounded-lg overflow-hidden">
              <img
                src="/images/joeabass-hands-on.jpg"
                alt="Team celebrating with world record certificate"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
