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
import type { ScalingBlueprintPageData } from "@/payload/lib/types"

interface ScalingBlueprintPageClientProps {
  pageData?: ScalingBlueprintPageData | null
}

export default function ScalingBlueprintPageClient({ pageData }: ScalingBlueprintPageClientProps) {
  const [formModalOpen, setFormModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <BlueprintHero data={pageData?.hero} onOpenForm={() => setFormModalOpen(true)} />
        <BlueprintProcess data={pageData?.processSteps} />
        <BlueprintTargetSegments data={pageData?.targetStages} />
        <BlueprintValueLadder data={pageData?.pricingPaths} onOpenForm={() => setFormModalOpen(true)} />
        <BlueprintPromise data={pageData?.outcomes} />
        <BlueprintFAQ data={pageData?.faq} />
      </main>
      <Footer />
      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}
