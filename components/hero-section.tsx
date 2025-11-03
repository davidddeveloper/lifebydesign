"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroSectionProps {
  onOpenForm: () => void
}

export function HeroSection({ onOpenForm }: HeroSectionProps) {
  return (
    <section className="bg-gray-100 py-16 md:py-24 lg:py-32 relative overflow-hidden"> {/*bg-gray-100*/}
      <div className="container mx-auto px-4">
        <div className="items-center gap-8"> {/* grid lg:grid-cols-[300px_1fr_100px] */}
          {/* Left Person Image */}
          {/*<div className="hidden lg:block">
            <img
              src="/images/joeabasshero.png"
              alt="Team member"
              className="w-full h-auto object-cover"
            />
          </div>*/}

          {/* Center Content */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight text-balance">
              DO YOU WANT TO SCALE YOUR BUSINESS?
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Learn from the team that has scaled a portfolio to over $1m+ in annual revenue.
            </p>
            <Button
                onClick={onOpenForm}
                size="lg"
                className="bg-[#74c0fc] hover:bg-[#42adff] text-white font-bold text-lg px-12 py-6 rounded-full h-auto"
              > {/** #7c3aed hover: 6d28d9*/}
                LEARN TO SCALE
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
          {/*<img
            src="/images/joeabasshero.png"
            alt="Team member"
            className="w-full h-auto object-cover rounded-lg"
          />*/}
        </div>
      </div>
    </section>
  )
}
