"use client"

import { motion } from "framer-motion"

const whoWeWorkWith = {
  lookingFor: [
    {
      icon: "✅",
      text: "Want to build a real business, not just an idea",
    },
    {
      icon: "✅",
      text: "Are ready to own their outcomes (successes and failures)",
    },
    {
      icon: "✅",
      text: "Value relationships over transactions",
    },
    {
      icon: "✅",
      text: "Can move fast without being reckless",
    },
    {
      icon: "✅",
      text: "Are open to feedback and willing to evolve",
    },
  ],
  notFor: [
    {
      icon: "❌",
      text: "Want quick fixes without doing the work",
    },
    {
      icon: "❌",
      text: "Prioritize looking successful over being successful",
    },
    {
      icon: "❌",
      text: "Treat partners and customers like transactions",
    },
    {
      icon: "❌",
      text: "Can't make decisions without perfect information",
    },
    {
      icon: "❌",
      text: "Avoid tough feedback or hard conversations",
    },
  ],
}

export function CultureSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">WHO WE WORK WITH</h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Startup Bodyshop is for founders who are ready to build businesses that create real value and last.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* We're looking for */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-8 rounded-lg"
          >
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">We're looking for founders who:</h3>
            <ul className="space-y-4">
              {whoWeWorkWith.lookingFor.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <span className="text-gray-700 text-lg leading-relaxed">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* We're not for */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-8 rounded-lg"
          >
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">We're not for founders who:</h3>
            <ul className="space-y-4">
              {whoWeWorkWith.notFor.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <span className="text-gray-700 text-lg leading-relaxed">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xl md:text-2xl text-gray-800 font-semibold">
            We don't work with everyone. But if we work together, we go all in.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
