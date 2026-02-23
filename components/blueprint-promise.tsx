"use client"

import { motion } from "framer-motion"
import { Lightbulb, Shield, Zap } from "lucide-react"
import type { BlueprintOutcomes } from "@/payload/lib/types"

const defaultPromises = [
  {
    icon: Lightbulb,
    title: "Clarity",
    description: "Know exactly what's holding you back — no more guessing.",
  },
  {
    icon: Shield,
    title: "Control",
    description: "Fix it with tools and systems that actually work.",
  },
  {
    icon: Zap,
    title: "Capacity",
    description: "Scale beyond yourself with documented, repeatable processes.",
  },
]

interface BlueprintPromiseProps {
  data?: BlueprintOutcomes
}

export function BlueprintPromise({ data }: BlueprintPromiseProps) {
  const promises = data?.items?.map((p, i) => ({
    icon: i === 0 ? Lightbulb : i === 1 ? Shield : Zap,
    title: p.outcome || "",
    description: ""
  })) || defaultPromises

  const closingStatement = data?.closingStatement || "We don't guess. We measure. We fix. We scale."

  return (
    <section className="py-20 lg:py-24 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6">What You Get</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">The Scaling Blueprint delivers three core outcomes:</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {promises.map((promise, i) => {
            const Icon = promise.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-black mb-3">{promise.title}</h3>
                <p className="text-gray-300 leading-relaxed">{promise.description}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-2xl font-black mb-2">{closingStatement}</p>
          <p className="text-gray-400">That's the promise of the Scaling Blueprint.</p>
        </motion.div>
      </div>
    </section>
  )
}