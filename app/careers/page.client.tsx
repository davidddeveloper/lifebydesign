"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { CareersHero } from "@/components/sanity/careers-hero"
import { CultureSection } from "@/components/culture-section"
import { ValuesSection } from "@/components/values-section"
import { BenefitsSection } from "@/components/benefit-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/Footer"
import { ScaleFormModal } from "@/components/scale-form-modal"
import { SectionRenderer } from "@/components/sanity/SectionRenderer"
import type { CareersPage } from "@/sanity/lib/types"

interface CareersPageClientProps {
  pageData?: CareersPage | null
}

export default function CareersPageClient({ pageData }: CareersPageClientProps) {
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
          // Fallback to hardcoded content
          <>
            <CareersHero />
            <CultureSection />
            <TestimonialsSection />
            <ValuesSection />
            <BenefitsSection />
          </>
        )}
      </main>
      <Footer />
      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}
