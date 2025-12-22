"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScaleFormModal } from "@/components/scale-form-modal"
import { CannotScaleReasonGraphic } from "./cannot-scale-reason"

export function WorkshopValue() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="bg-gray-100 py-16 md:py-24"> {/**bg-[#1e293b] */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-900 leading-relaxed max-w-5xl mx-auto mb-12">
              It's not motivational hype, It's tactical Help, solving real world business problems.
            </p>

            <CannotScaleReasonGraphic />

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
              I'M READY TO SCALE
            </Button>
          </div>
        </div>
      </section>

      <ScaleFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
