"use client"

import { motion } from "framer-motion"

import type { AboutServices } from "@/payload/lib/types"

const defaultServices = [
  {
    title: "The Scaling Blueprint",
    description:
      "A flagship diagnostic and intervention framework designed to help businesses break through growth barriers with a structured 3-step process: Diagnose, Workshop (DIY), and Implementation (DWY).",
  },
  {
    title: "Entrepreneurship Training & Coaching",
    description:
      "Tailored programs focusing on business model design, financial management, marketing, customer engagement, and access to finance.",
  },
  {
    title: "Corporate & NGO Partnerships",
    description:
      "Delivered through partnerships with UNDP, IOM, World Bank, GIZ, and others, managing over $1.2 million in grants and contracts.",
  },
]

interface LBDServicesProps {
  data?: AboutServices
}

export function LBDServices({ data }: LBDServicesProps) {
  const services = data?.items?.map(s => ({
    title: s.title || "",
    description: s.description || ""
  })) || defaultServices

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Our Core Services</h2>
          <div className="flex justify-center">
            <div className="h-1 w-20 bg-[#177fc9]"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-6 bg-gray-50 rounded-lg border-l-4 border-[#177fc9] hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-black text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
