"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { HeroSection } from "@/components/hero-section"
import { ScaleFormModal } from "@/components/scale-form-modal"
import { WorkshopFaq } from "@/components/workshop-faq"
import { FoundersSection } from "@/components/founders-section"
import { Footer } from "@/components/Footer"
import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider"
import { SectionRenderer } from "@/components/sanity/SectionRenderer"
import type { HomePage } from "@/sanity/lib/types"

interface HomeClientProps {
  pageData?: HomePage | null
}

export default function HomeClient({ pageData }: HomeClientProps) {
  const [formModalOpen, setFormModalOpen] = useState(false)

  // If we have Sanity data, use the section renderer
  const hasSanityContent = pageData?.sections && pageData.sections.length > 0

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {hasSanityContent ? (
          // Render sections from Sanity
          <SectionRenderer
            sections={pageData.sections!}
            onOpenForm={() => setFormModalOpen(true)}
          />
        ) : (
          // Fallback to hardcoded content when no Sanity content exists
          <>
            <HeroSection onOpenForm={() => setFormModalOpen(true)} />
            <WorkshopFaq />
            <FoundersSection />

            <InfiniteSlider gap={50} reverse>
              <img
                src='/images/partners/sierraleonelogo.png'
                alt='Sierra Leone logo'
                className='h-[70px] w-auto object-contain'
              />
              <img
                src='/images/partners/world-bank-group.png'
                alt='World Bank Group logo'
                className='h-[70px] w-auto object-contain'
              />
              <img
                src='/images/partners/rcbank.png'
                alt='Rokel Commercial Bank logo'
                className='h-[70px] w-auto object-contain'
              />
              <img
                src='/images/partners/SLEDP.jpg'
                alt='Sierra Leone Economic Diversification Project logo'
                className='h-[70px] w-auto object-contain'
              />
              <img
                src='/images/partners/itc.webp'
                alt='International Trade Centre'
                className='h-[70px] w-auto object-contain'
              />
              <img
                src='/images/partners/smeda.png'
                alt='SMEDA logo'
                className='h-[70px] w-auto'
              />
              <img
                src='/images/partners/germancooperation.webp'
                alt='German Cooperation logo'
                className='h-[70px] w-auto'
              />
              <img
                src='/images/partners/afrimoney.png'
                alt='Afrimoney logo'
                className='h-[70px] w-auto'
              />
              <img
                src='/images/partners/africell.png'
                alt='Africell Sierra Leone'
                className='h-[70px] w-auto'
              />
              <img
                src='/images/partners/limkokwing.png'
                alt='Limkokwing University of Creative Technology logo'
                className='h-[70px] w-auto'
              />
              <img
                src='/images/partners/iom.png'
                alt='IOM logo'
                className='h-[70px] w-auto'
              />
              <img
                src='/images/partners/undp.png'
                alt='UNDP logo'
                className='h-[70px] w-auto'
              />
            </InfiniteSlider>
          </>
        )}
      </main>

      <Footer />

      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}
