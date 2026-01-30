"use client"

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider"
import { urlFor } from '@/sanity/lib/image'
import type { PartnersSection } from '@/sanity/lib/types'

interface PartnersSectionProps {
    data?: PartnersSection
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
    const logos = data?.logos

    return (
        <div className="py-12">
            <InfiniteSlider gap={50} reverse>
                {logos ? (
                    logos.map((logo, index) => (
                        <img
                            key={logo._key || index}
                            src={urlFor(logo).url()}
                            alt={logo.alt || `Partner ${index + 1}`}
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
