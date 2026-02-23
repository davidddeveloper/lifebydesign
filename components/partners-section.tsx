"use client"

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider"
import type { HomePagePartners } from "@/payload/lib/types"

interface PartnersSectionProps {
  data?: HomePagePartners
}

const defaultPartners = [
  { src: '/images/partners/sierraleonelogo.png', alt: 'Sierra Leone logo' },
  { src: '/images/partners/world-bank-group.png', alt: 'World Bank Group logo' },
  { src: '/images/partners/rcbank.png', alt: 'Rokel Commercial Bank logo' },
  { src: '/images/partners/SLEDP.jpg', alt: 'Sierra Leone Economic Diversification Project logo' },
  { src: '/images/partners/itc.webp', alt: 'International Trade Centre' },
  { src: '/images/partners/smeda.png', alt: 'SMEDA logo' },
  { src: '/images/partners/germancooperation.webp', alt: 'German Cooperation logo' },
  { src: '/images/partners/afrimoney.png', alt: 'Afrimoney logo' },
  { src: '/images/partners/africell.png', alt: 'Africell Sierra Leone' },
  { src: '/images/partners/limkokwing.png', alt: 'Limkokwing University of Creative Technology logo' },
  { src: '/images/partners/iom.png', alt: 'IOM logo' },
  { src: '/images/partners/undp.png', alt: 'UNDP logo' },
]

export function PartnersSection({ data }: PartnersSectionProps) {
  const items = data?.items

  return (
    <div className="py-12">
      <InfiniteSlider gap={50} reverse>
        {items && items.length > 0 ? (
          items.map((partner, index) => (
            <img
              key={partner.id || index}
              src={partner.logo?.url || '/placeholder.svg'}
              alt={partner.name}
              className="h-[70px] w-auto object-contain"
            />
          ))
        ) : (
          defaultPartners.map((partner, index) => (
            <img
              key={index}
              src={partner.src}
              alt={partner.alt}
              className="h-[70px] w-auto object-contain"
            />
          ))
        )}
      </InfiniteSlider>
    </div>
  )
}
