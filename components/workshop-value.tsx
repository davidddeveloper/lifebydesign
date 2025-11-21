"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScaleFormModal } from "@/components/scale-form-modal"

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

            {/* Key Man Risk Graphic */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-[#0f172a] rounded-lg p-8 md:p-12 shadow-2xl">
                <div className="text-center">
                  <p className="text-white/70 text-lg md:text-xl mb-4">#1 REASON</p>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
                    why{" "}
                    <span className="font-black">
                      ENTREPRENEURS
                      <br />
                      CAN'T SCALE
                    </span>
                  </h2>
                  <div className="flex justify-center mb-6">
                    <svg className="w-12 h-24 text-[#7c3aed]" fill="currentColor" viewBox="0 0 24 48">
                      <path
                        d="M12 0 L12 40 M12 40 L6 34 M12 40 L18 34"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-300 px-8 py-4 rounded-lg">
                    <p className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">KEY MAN RISK</p>
                  </div>
                  <div className="mt-6">
                    <span className="inline-block bg-[#7c3aed] text-white px-6 py-2 rounded-full text-sm font-semibold">
                      reason why I can't scale
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
