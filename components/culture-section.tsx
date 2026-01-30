"use client"

import { motion } from "framer-motion"
import { urlFor } from "@/sanity/lib/image"
import type { CareersMindsetSection } from "@/sanity/lib/types"

const defaultCultureItems = [
  {
    title: "You build with the long game in mind.",
    description:
      "You're not here for shortcuts. You care about creating businesses that compound over years, not months.",
    subtext:
      "That means focusing on fundamentals, building systems that scale, and making decisions that stand the test of time.",
    image: "/images/teams/startupbodyshopteam.jpg",
    reverse: false,
  },
  {
    title: "You grow through feedback and challenge",
    description:
      "You don't shy away from tough conversations. You seek feedback, lean into challenges, and see both as tools for growth.",
    subtext: "For you, improvement isn't personal criticism, it's the path to mastery.",
    image: "/images/teams/startupbodyshopteam1.jpeg",
    reverse: true,
  },
  {
    title: "You value people over hype.",
    description: "You know real businesses aren't built on trends or noise.",
    subtext:
      "They're built on trust. You invest in relationships, lead with integrity, and focus on what drives lasting results for founders, teams, and customers.",
    image: "/images/teams/startupbodyshopteam2.jpg",
    reverse: false,
  },
  {
    title: "You thrive in disciplined execution",
    description: "Big ideas matter, but execution wins.",
    subtext:
      "You bring focus, structure, and accountability to your work. You know consistency beats intensity, and disciplined execution is how great businesses are built.",
    image: "/images/teams/startupbodyshopteam3.jpg",
    reverse: true,
  },
]

interface CultureSectionProps {
  data?: CareersMindsetSection
}

export function CultureSection({ data }: CultureSectionProps) {
  const items = data?.items?.map((item, index) => ({
    title: item.title || "",
    description: item.description || "",
    subtext: item.subtext || "",
    image: item.image ? urlFor(item.image).url() : (defaultCultureItems[index]?.image || "/placeholder.svg"),
    reverse: item.reverse || false
  })) || defaultCultureItems

  const heading = data?.heading || "We want disciplined team players who trust and win together."
  const description = data?.description || "At Startup Bodyshop, we're focused on building businesses that compound over years, not months. We care about creating systems that scale, making decisions that stand the test of time, and building relationships that last."

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
            {heading}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>

        <div className="space-y-20">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${item.reverse ? "lg:grid-cols-2 lg:direction-rtl" : ""}`}
            >
              {/* Image */}
              <div className={item.reverse ? "lg:order-2" : ""}>
                <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Content */}
              <div className={item.reverse ? "lg:order-1 md:bg-white md:p-8 md:rounded-lg md:shadow-sm h-96 flex flex-col items-center justify-center" : "md:bg-white md:p-8 md:rounded-lg md:shadow-sm h-96 flex flex-col items-center justify-center"}>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">{item.title}</h3>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">{item.description}</p>
                <p className="text-lg text-gray-600 leading-relaxed">{item.subtext}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
