"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { CareersHero } from "@/components/careers-hero"
import { CultureSection } from "@/components/culture-section"
import { ValuesSection } from "@/components/values-section"
import { BenefitsSection } from "@/components/benefit-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/Footer"
import { ScaleFormModal } from "@/components/scale-form-modal"
import type { CareersPageData } from "@/payload/lib/types"

interface CareersPageClientProps {
  pageData?: CareersPageData | null
}

export default function CareersPageClient({ pageData }: CareersPageClientProps) {
  const [formModalOpen, setFormModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CareersHero data={pageData?.hero} />
        <CultureSection data={pageData?.mindset} />
        <TestimonialsSection data={pageData?.testimonials} />
        <ValuesSection data={pageData?.values} />
        <BenefitsSection data={pageData?.benefits} />
      </main>
      <Footer />
      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}
