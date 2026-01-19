"use client"

import { motion } from "framer-motion"

const values = [
  {
    letter: "V",
    title: "VALUE CREATION OVER HYPE",
    description: "We focus on what works, not what looks good. Real revenue over vanity metrics.",
  },
  {
    letter: "A",
    title: "ACCOUNTABILITY",
    description: "We measure success by outcomes, not activity. Results matter more than effort.",
  },
  {
    letter: "L",
    title: "LONG GAME THINKING",
    description: "We build businesses that last, not sprints that burn out. Sustainable systems over quick fixes.",
  },
  {
    letter: "U",
    title: "URGENCY + EXECUTION",
    description: "We move fast but smart. Fast decisions, quick iterations, disciplined execution.",
  },
  {
    letter: "E",
    title: "EVOLVE CONTINUOUSLY",
    description: "We grow through feedback, not ego. Learn, adapt, and get better every month.",
  },
]

export function ValuesSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 text-center">OUR VALUES: V.A.L.U.E.</h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto text-center leading-relaxed">
            Our values aren't just words on a wall — they're the framework that shapes everything we do. We make every business decision through V.A.L.U.E., and we expect the same from our team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-[#177fc9] text-white rounded-full flex items-center justify-center text-3xl font-black mb-6">
                {value.letter}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-700 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-[#177fc9] text-white p-8 rounded-lg text-center"
        >
          <p className="text-xl md:text-2xl font-bold">
            That's V.A.L.U.E. That's how we build.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
