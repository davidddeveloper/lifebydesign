"use client"

import { motion } from "framer-motion"
import { PortableText } from '@portabletext/react'
import type { AboutStorySection } from '@/sanity/lib/types'

interface AboutStoryProps {
  data: AboutStorySection
}

export function AboutStoryComponent({ data }: AboutStoryProps) {
  const { title, content } = data

  return (
    <section id="our-story" className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              {title || "Our Story"}
            </h2>
            <div className="h-1 w-20 bg-[#177fc9] mb-8"></div>
            {content && (
              <div className="prose prose-lg max-w-none">
                <PortableText
                  value={content}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="text-gray-700 leading-relaxed text-lg mb-4">{children}</p>
                      ),
                    },
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
