"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    quote:
      "Everyone is doing something extremely valuable to the mission, you can see it every day from the shoutouts and general team energy that flows here!",
    author: "Henretter Haruna",
    image: "/images/teams/pamellastartupbodyshop.jpg",
  },
  {
    quote:
      "I love Startup Bodyshop because it truly feels like home. It's not just about the work - it's the culture of competitive greatness, unimpeachable character, and sincere candor that makes it different. I'm surrounded by people who challenge me to grow while also making me feel supported and valued.",
    author: "Foday Kamara",
    image: "/images/teams/fodaystartupbodyshop.jpg",
  },
  {
    quote:
      "I love that Startup Bodyshop is a place where high standards and real impact collide. It's rare to find a team that's both incredibly ambitious and genuinely cares about each other.",
    author: "Sylvester Johnsons",
    image: "/images/teams/sylvesterstartupbodyshop.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-gray-900 mb-16 text-center"
        >
          Why I Love Working at Startup Bodyshop:
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow"
            >
              <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <p className="font-bold text-gray-900">{testimonial.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
