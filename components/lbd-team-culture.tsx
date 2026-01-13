"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const cultureValues = [
  {
    title: "You build with the long game in mind.",
    description: "You're not here for shortcuts. You care about creating businesses that compound over years, not months.",
    extendedDescription:
      "That means focusing on fundamentals, building systems that scale, and making decisions that stand the test of time.",
    imagePosition: "left",
    imageSrc: "/images/teams/startupbodyshopteam2.jpg",
  },
  {
    title: "You grow through feedback and challenge",
    description:
      "You don't shy away from tough conversations. You seek feedback, lean into challenges, and see both as tools for growth.",
    extendedDescription: "For you, improvement isn't personal criticism, it's the path to mastery.",
    imagePosition: "right",
    imageSrc: "/images/joeabassq&a.jpg",
  },
  {
    title: "You value people over hype",
    description:
      "You believe real impact comes from authentic relationships, not flashy announcements or viral moments.",
    extendedDescription:
      "You invest time in understanding your team, your customers, and your community because lasting success is built on trust, not trends.",
    imagePosition: "left",
    imageSrc: "/images/workshop.jpg",
  },
]

export function LBDTeamCulture() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="space-y-20">
          {cultureValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
                value.imagePosition === "right" ? "md:grid-flow-dense" : ""
              }`}
            >
              <div
                className={`relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden ${
                  value.imagePosition === "right" ? "md:col-start-2" : ""
                }`}
              >
                <Image
                  src={value.imageSrc}
                  alt={value.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className={`space-y-6 ${value.imagePosition === "right" ? "md:col-start-1" : ""}`}>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                  {value.title}
                </h3>

                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">{value.description}</p>

                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">{value.extendedDescription}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
