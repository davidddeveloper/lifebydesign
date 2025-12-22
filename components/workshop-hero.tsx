"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScaleFormModal } from "@/components/scale-form-modal"

export function WorkshopHero() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <>
    <section className="bg-gray-100 py-16 md:py-24 lg:py-32 relative overflow mb-[300px]"> {/**1e293b */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 leading-tight text-balance">
            IT'S NOT AN EVENT, IT'S A SCALING WORKSHOP.
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-[#4a4a4a] leading-relaxed max-w-5xl mx-auto">
            It's not motivational hype, It's tactical Help, solving real world business problems.
          </p>
        </div>

        <div className="w-full -mb-[450px]">
          <div className="max-w-2xl mx-auto">
          <img
              src="/images/joeabass.jpg"
              alt="Workshop presenter at desk"
              className="w-full h-auto rounded-lg shadow-2xl"
          />
          </div>

          <div className="text-center mt-8 mb-8 flex flex-col gap-14 justify-center items-center">
            <p className="text-lg md:text-xl text-[#4a4a4a] font-semibold max-w-5xl mx-auto">
              It's a 2-day, interactive workshop where you'll receive personalized, actionable insights from the team that's scaled LBD.group & it's portfolio companies.
            </p>
            <Button
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
            >{/** #7c3aed hover: #6d28d9 */}
              I'M READY TO SCALE
            </Button>
          </div>
          </div>

      </div>
    </section>
    <ScaleFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
