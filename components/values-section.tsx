"use client"

import { motion } from "framer-motion"

const values = [
  {
    icon: "🏆",
    title: "Competitive Greatness",
    description: "Be at your best when your best is needed. You enjoy a hard challenge.",
  },
  {
    icon: "💬",
    title: "Sincere Candor",
    description: "Nothing great can be built without feedback, internally or externally.",
  },
  {
    icon: "🛡️",
    title: "Unimpeachable Character",
    description:
      "Be the type of person with whom people are always proud to associate – personally and professionally.",
  },
]

export function ValuesSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 text-center">What are our values?</h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto text-center leading-relaxed">
            Our values aren't just words on a wall — we make every business decision through them, including who we
            hire. We hold a high bar for both character and results: no ego, disciplined execution, and measuring
            ourselves by impact. By setting clear expectations for how we work together, we can keep doing big things
            with great people.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-6xl mb-6">{value.icon}</div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-700 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
