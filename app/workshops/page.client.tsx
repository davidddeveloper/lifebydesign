"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ScaleFormModal } from "@/components/scale-form-modal"
import { WorkshopHero } from "@/components/workshop-hero"
import { WorkshopBenefits } from "@/components/workshop-benefits"
import { WorkshopValue } from "@/components/workshop-value"
import { WorkshopFaq } from "@/components/workshop-faq"
import { SectionRenderer } from "@/components/sanity/SectionRenderer"
import type { WorkshopsPage } from "@/sanity/lib/types"

interface WorkshopPageClientProps {
    pageData?: WorkshopsPage | null
}

export default function WorkshopPageClient({ pageData }: WorkshopPageClientProps) {
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
                        page="workshop"
                    />
                ) : (
                    // Fallback to hardcoded content
                    <>
                        <WorkshopHero />
                        <WorkshopBenefits />
                        <WorkshopValue />
                        <WorkshopFaq />
                    </>
                )}
            </main>
            <Footer />
            <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
        </div>
    )
}
