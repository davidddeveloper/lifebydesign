"use client"

import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import type { FounderSection } from '@/sanity/lib/types'

interface FounderSectionProps {
  data: FounderSection
}

export function FounderSectionComponent({ data }: FounderSectionProps) {
  const { name, title, bio, image } = data

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-2xl font-black text-gray-900 text-center mb-12">
          {title || "ABOUT OUR FOUNDER"}
        </h2>

        <div className="flex-col md:flex-row flex justify-center gap-20 items-center">
          {/* Founders Image */}
          {image && (
            <div className="flex md:flex-shrink-0 justify-center md:order-first">
              <div className="w-full max-w-sm">
                <img
                  src={urlFor(image).url()}
                  alt={name || "Founder"}
                  className="w-full h-[400px] object-cover rounded-lg border-4 border-gray-900 shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Founders Content */}
          <div className="space-y-4 px-4 md:px-0 text-gray-900">
            {bio && (
              <div className="prose prose-lg max-w-none">
                <PortableText
                  value={bio}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="text-md leading-relaxed mb-4">{children}</p>
                      ),
                    },
                    marks: {
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      em: ({ children }) => <em className="text-[#177fc9] font-semibold">{children}</em>,
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
