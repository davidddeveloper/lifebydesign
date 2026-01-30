"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ScaleFormModal } from "@/components/scale-form-modal"
import { BlueprintHero } from "@/components/blueprint-hero"
import { BlueprintProcess } from "@/components/blueprint-process"
import { BlueprintTargetSegments } from "@/components/blueprint-target-segments"
import { BlueprintValueLadder } from "@/components/blueprint-value-ladder"
import { BlueprintFAQ } from "@/components/blueprint-faq"
import { BlueprintPromise } from "@/components/blueprint-promise"
import { SectionRenderer } from "@/components/sanity/SectionRenderer"
import type { ScalingBlueprintPage } from "@/sanity/lib/types"

interface ScalingBlueprintPageClientProps {
  pageData?: ScalingBlueprintPage | null
}

export default function ScalingBlueprintPageClient({ pageData }: ScalingBlueprintPageClientProps) {
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
            page="blueprint"
          />
        ) : (
          // Fallback to hardcoded content
          <>
            <BlueprintHero onOpenForm={() => setFormModalOpen(true)} />
            <BlueprintProcess />
            <BlueprintTargetSegments />
            <BlueprintValueLadder onOpenForm={() => setFormModalOpen(true)} />
            <BlueprintPromise />
            <BlueprintFAQ />
          </>
        )}
      </main>
      <Footer />
      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}
