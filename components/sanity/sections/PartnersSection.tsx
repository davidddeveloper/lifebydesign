"use client"

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider"
import { urlFor } from '@/sanity/lib/image'
import type { PartnersSection } from '@/sanity/lib/types'

interface PartnersSectionProps {
  data: PartnersSection
}

export function PartnersSectionComponent({ data }: PartnersSectionProps) {
  const { logos } = data

  if (!logos || logos.length === 0) {
    return null
  }

  return (
    <InfiniteSlider gap={50} reverse>
      {logos.map((logo, index) => (
        <img
          key={logo._key || index}
          src={urlFor(logo).url()}
          alt={logo.alt || `Partner ${index + 1}`}
          className="h-[70px] w-auto object-contain"
        />
      ))}
    </InfiniteSlider>
  )
}
