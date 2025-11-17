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
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Our Story</h2>
            <div className="h-1 w-20 bg-[#177fc9] mb-8"></div>
            {/*Founded in 2011 as a transformational radio and television program, Life By Design set out to inspire Sierra Leoneans to take responsibility for their own success. The program quickly resonated with audiences across the country, becoming the most-watched television show in Sierra Leone and earning multiple national and international awards for its impact.*/}
            <p className="text-gray-700 leading-relaxed text-lg">
              Founded in 2011, Life By Design inspires Sierra Leoneans to take responsibility for their own success. As a transformational radio and television program, it quickly became the most-watched TV show in Sierra Leone, earning multiple national and international awards.

              We evolved into a comprehensive business incubator and accelerator, dedicated to turning entrepreneurial potential into sustainable business success. We combine proven methodologies with hands-on support to help entrepreneurs and startups build scalable, profitable businesses that create lasting impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-black text-gray-900">Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower Sierra Leonean entrepreneurs with the tools, networks, and support needed to start, grow, and
                sustain successful businesses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-black text-gray-900">Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become Sierra Leone's foremost entrepreneurship support organization, accelerating the growth,
                profitability, and resilience of startups and SMEs.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
