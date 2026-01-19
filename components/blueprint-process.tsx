"use client"

import { motion, type Variants } from "framer-motion"
import { CheckCircle2, BarChart3, Zap } from "lucide-react"

export function BlueprintProcess() {
  const stepVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  }

  const steps = [
    {
      number: "01",
      title: "Diagnose",
      description:
        "We run your business through the 5 Levers Framework: WHO (your market), WHAT (your offer), HOW YOU SELL (conversion), HOW THEY FIND YOU (lead generation), and HOW YOU DELIVER (operations). We score each lever 0-10 and pinpoint your growth constraint — the one thing slowing you down.",
      icon: BarChart3,
    },
    {
      number: "02",
      title: "Workshop (DIY Path)",
      description:
        "Attend our 2-day workshop. You learn the framework, identify your constraint, and build a tactical 90-day plan to fix it. You leave with a complete roadmap, accountability partner, and all the tools you need to execute on your own.",
      icon: CheckCircle2,
    },
    {
      number: "03",
      title: "Done-With-You Implementation",
      description:
        "Join our 90-Day Program. We conduct a deep 41-question audit, give you a detailed roadmap, and coach you through implementation with 6 bi-weekly calls plus daily WhatsApp support. We handle the guidance while you run the business.",
      icon: Zap,
    },
  ]

  return (
    <section id="how-it-works" className="pt-14 pb-4 md:pt-16 md:pb-5 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">How The Scaling Blueprint Works</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Three simple steps from diagnosis to scaling</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                custom={i}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-200 hover:border-[#42adff] transition-colors">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-[#177fc9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.number}
                  </div>

                  <Icon className="w-8 h-8 text-[#177fc9] mb-6 mt-4" />
                  <h3 className="text-xl font-black text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-base">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 p-8 bg-[#42adff]/50 border-l-4 border-[#42adff] rounded-lg"
        >
          <p className="text-lg text-gray-900">
            <span className="font-black">Key Insight:</span> We only solve that stage's constraint — nothing else. When
            you fix it, you graduate to the next level of scale. {/*This focused approach is why 87% of our participants
            hit their 90-day breakthrough.*/}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
