"use client"

import { motion } from "framer-motion"
import { RichText } from "@payloadcms/richtext-lexical/react"
import type { AboutMissionVision } from "@/payload/lib/types"

interface LBDMissionProps {
  data?: AboutMissionVision
}

export function LBDMission({ data }: LBDMissionProps) {
  const mission = data?.mission || "To empower Sierra Leonean entrepreneurs with the tools, networks, and support needed to start, grow, and sustain successful businesses."
  const vision = data?.vision || "To become Sierra Leone's foremost entrepreneurship support organization, accelerating the growth, profitability, and resilience of startups and SMEs."

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
            {data?.story ? (
              <div className="text-gray-700 leading-relaxed text-lg prose max-w-none">
                <RichText data={data.story} converters={{}} />
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed text-lg">
                Founded in 2011, Life By Design inspires Sierra Leoneans to take responsibility for your own success. As a transformational radio and television program, it quickly became the most-watched TV show in Sierra Leone, earning multiple national and international awards.
                <br /><br />
                We evolved into a comprehensive business incubator and accelerator, dedicated to turning entrepreneurial potential into sustainable business success. We combine proven methodologies with hands-on support to help entrepreneurs and startups build scalable, profitable businesses that create lasting impact.
              </p>
            )}
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
              <p className="text-gray-700 leading-relaxed">{mission}</p>
            </motion.div>

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
          </div>
        </motion.div>
      </div>
    </section>
  )
}
