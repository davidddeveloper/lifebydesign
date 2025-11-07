"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroSectionProps {
  onOpenForm: () => void
}

export function HeroSection({ onOpenForm }: HeroSectionProps) {
  return (
    <section className="bg-gray-100 py-24 md:py-16 lg:py-24 relative overflow-hidden "> {/*bg-gray-100*/}
      <div className="container mx-auto px-4">
        <div className="items-center gap-8 grid lg:grid-cols-[300px_1fr_0px]"> {/* grid lg:grid-cols-[300px_1fr_100px] */}
          {/* Left Person Image */}
          <div className="hidden lg:block">
            <img
              src="/images/joeabasshero.png"
              alt="Team member"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Center Content */}
          <div className="text-center max-w-5xl md:pr-2 md:min-w-[650px] lg:max-w-5xl mx-auto"> {/** border-2 border-[#177fc9] rounded-lg p-8 */}
            <h1 className="text-2xl md:text-3xl lg:text-5xl xl:text-5xl font-black text-gray-900 mb-6 leading-tight text-balance">
              ARE YOU READY TO SCALE YOUR BUSINESS?
            </h1>
            <p className="text-lg md:text-xl lg:text-lg xl:text-2xl text-gray-700 leading-relaxed lg:text-nowrap">
              Learn from the team that has scaled businesses to $1.5M+ in annual revenue.
            </p>
            <p className="text-lg md:text-xl lg:text-lg xl:text-2xl text-gray-700 mb-8 leading-relaxed">
              Check whether you qualify for our free business diagnostics.
            </p>
            <Button
                onClick={onOpenForm}
                size="default"
                className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
              > {/** bg-[#74c0fc] #7c3aed hover: 6d28d9*/}
                I'M READY TO SCALE
              </Button>
          </div>

          {/* Right Person Image 
          <div className="hidden lg:block">
            <img
              src="/images/willsmithmeme.png"
              alt="Team member"
              className="w-full h-auto object-cover scale"
            />
          </div>*/}
        </div>

        {/* Mobile Images */}
        <div className="lg:hidden w-[300px] mx-auto gap-4 mt-8">
          {/*<img
            src="/images/willsmithmeme.png"
            alt="Team member"
            className="w-full h-auto object-cover rounded-lg"
          />*/}
          <img
            src="/images/joeabasshero.png"
            alt="Team member"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}
