"use client"

import { motion } from "framer-motion"

const valueFramework = [
  {
    letter: "V",
    title: "VALUE CREATION OVER HYPE",
    tagline: "We focus on what works, not what looks good.",
    description: "You don't need another cheerleader. You need a partner who cares about your actual results.",
    points: [
      "Real revenue over vanity metrics",
      "Sustainable growth over quick wins",
      "Systems that work over tactics that fade",
    ],
    outcome: "We won't sell you hype. We'll build you value.",
  },
  {
    letter: "A",
    title: "ACCOUNTABILITY (Results Over Effort)",
    tagline: "We measure success by outcomes, not activity.",
    description: "Effort matters. But results matter more.",
    points: [
      "We track what moves the needle (revenue, customers, systems)",
      "We celebrate wins and own setbacks together",
      "We hold you (and ourselves) accountable to the plan",
    ],
    outcome: "You'll always know where you stand — and what needs to happen next.",
  },
  {
    letter: "L",
    title: "LONG GAME THINKING",
    tagline: "We build businesses that last, not sprints that burn out.",
    description: "Quick fixes don't scale. Sustainable systems do.",
    points: [
      "Build strong fundamentals that compound over time",
      "Create scalable systems that work without you",
      "Make decisions today that still make sense in 5 years",
    ],
    outcome: "We're not here for a transaction. We're here to help you build something that outlasts both of us.",
  },
  {
    letter: "U",
    title: "URGENCY + EXECUTION",
    tagline: "We move fast — but we move smart.",
    description: "The market rewards speed. But reckless speed kills businesses.",
    points: [
      "Fast decisions (not endless planning)",
      "Quick iterations (not waiting for perfect)",
      "Disciplined execution (not chaos disguised as hustle)",
    ],
    outcome: "You'll ship faster, learn faster, and grow faster — without breaking your business.",
  },
  {
    letter: "E",
    title: "EVOLVE CONTINUOUSLY",
    tagline: "We grow through feedback, not ego.",
    description: "The best founders don't have all the answers. They ask better questions.",
    points: [
      "Get honest feedback (even when it's uncomfortable)",
      "Learn from what's working (and what's not)",
      "Adapt quickly based on real-world data",
    ],
    outcome: "You'll build a learning system into your business — so you get better every month, not just busier.",
  },
]

export function LBDCoreValues() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">HOW WE WORK: V.A.L.U.E.</h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Everything we do is guided by V.A.L.U.E. — the framework that shapes how we build businesses with founders.
          </p>
        </div>

        <div className="space-y-12">
          {valueFramework.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gray-50 p-8 rounded-lg"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#177fc9] text-white rounded-full flex items-center justify-center text-3xl font-black">
                    {value.letter}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-lg font-semibold text-gray-800 mb-3">{value.tagline}</p>
                  <p className="text-gray-700 mb-4 leading-relaxed">{value.description}</p>

                  <div className="mb-4">
                    <p className="font-semibold text-gray-800 mb-2">We prioritize:</p>
                    <ul className="space-y-2">
                      {value.points.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-[#177fc9] mr-2">•</span>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded border-l-4 border-[#177fc9]">
                    <p className="text-gray-800">
                      <span className="font-bold">What this means for you:</span> {value.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 bg-[#177fc9] text-white p-8 rounded-lg text-center"
        >
          <h3 className="text-2xl md:text-3xl font-black mb-4">WHY V.A.L.U.E.?</h3>
          <p className="text-lg mb-4">Because values that don't create value are worthless.</p>
          <p className="text-base leading-relaxed max-w-4xl mx-auto">
            We're not here to give you motivational speeches and send you on your way. We're here to help you create value for your customers, own your outcomes with full accountability, build for the long term with systems that scale, execute with speed and discipline, and evolve constantly through feedback and iteration.
          </p>
          <p className="text-xl font-bold mt-6">That's V.A.L.U.E. That's how we build.</p>
        </motion.div>
      </div>
    </section>
  )
}