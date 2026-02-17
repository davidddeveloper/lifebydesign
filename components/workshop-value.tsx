"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WorkshopRegistrationModal } from "@/components/workshop-registration-modal"
import { CannotScaleReasonGraphic } from "./cannot-scale-reason"

import type { WorkshopValueSection } from "@/sanity/lib/types"

interface WorkshopValueProps {
  data?: WorkshopValueSection
}

export function WorkshopValue({ data }: WorkshopValueProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const introText = data?.introText || "It's not motivational hype, It's tactical Help, solving real world business problems."
  const ctaText = data?.cta?.text || "REGISTER NOW"
  const reasons = data?.animatedReasons // can be undefined, fallback in child

  return (
    <>
      <section className="bg-gray-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-900 leading-relaxed max-w-5xl mx-auto mb-12">
              {introText}
            </p>

            <CannotScaleReasonGraphic reasonsProp={reasons} />

            {/* Description */}
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-xl md:text-2xl text-gray-900 leading-relaxed mb-2">
                It's a 2-day, interactive workshop where you'll receive personalized,{" "}
                <span className="font-bold">actionable insights</span> from the team that's scaled lbd.group &
                it's portfolio companies.
              </p>
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </section>

      <WorkshopRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workshopTitle="Business Constraint-Breaking Workshop"
        workshopPrice={100}
      />
    </>
  )
}
