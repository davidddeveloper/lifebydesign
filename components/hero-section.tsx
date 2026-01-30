"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroSectionProps {
  onOpenForm: () => void
}

import { urlFor } from "@/sanity/lib/image"
import type { HeroSection as HeroSectionType } from "@/sanity/lib/types"

interface HeroSectionProps {
  onOpenForm: () => void
  data?: HeroSectionType
}

export function HeroSection({ onOpenForm, data }: HeroSectionProps) {
  // Fallbacks
  const heading = data?.heading || "ARE YOU READY TO SCALE YOUR BUSINESS?"
  const description = data?.subheading || "Learn from the team that has scaled businesses to multimillion US Dollars in annual revenue."
  const ctaText = data?.description || "Take our Free Business Constraint Audit" // Mapping "description" to the second text block
  const buttonText = data?.primaryCtaText || "I'M READY TO SCALE"
  const buttonUrl = data?.primaryCtaUrl || "/constraint-audit"
  const leftImage = data?.heroImageLeft ? urlFor(data.heroImageLeft).url() : "/images/joeabasshero22.png"
  const rightImage = data?.heroImageRight ? urlFor(data.heroImageRight).url() : "/images/joeabasshero.png"

  return (
    <section className="bg-gray-100 py-24 md:py-16 lg:py-16 relative overflow-hidden "> {/*bg-gray-100*/}
      <div className="container mx-auto pt-10 z-10">
        <div className="items-center gap-8 grid lg:grid-cols-[220px_1fr_0px]"> {/* grid lg:grid-cols-[300px_1fr_100px] */}
          {/* Left Person Image */}
          <div className="hidden mt-20 absolute bottom-0 lg:block">
            <img
              src={leftImage}
              alt="Team member"
              className="w-[38%] h-auto object-cover"
            />
          </div>
          <div className="hidden lg:block">

          </div>

          {/* Center Content */}
          <div className="text-center max-w-5xl md:pr-2 md:min-w-[650px] lg:max-w-5xl mx-auto"> {/** border-2 border-[#177fc9] rounded-lg p-8 */}
            <h1 className="text-2xl md:text-3xl lg:text-5xl xl:text-5xl font-black text-gray-900 mb-6 leading-tight text-balance uppercase">
              {heading}
            </h1>
            <p className="text-lg md:text-xl lg:text-[17px] xl:text-xl text-gray-700 leading-relaxed lg:text-nowrap">
              {description}
            </p>
            <p className="text-lg md:text-xl lg:text-lg xl:text-xl text-gray-700 mb-8 leading-relaxed">
              {ctaText}
            </p>
            <Link
              href={buttonUrl}
              className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto uppercase"
            > {/** bg-[#74c0fc] #7c3aed hover: 6d28d9*/}
              {buttonText}
            </Link>
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
      </div>
      <div className="lg:hidden z-0 max-w-[300px] mx-auto gap-4 mt-8 flex justify-center">
        {/*<img
            src="/images/willsmithmeme.png"
            alt="Team member"
            className="w-full h-auto object-cover rounded-lg"
          />*/}
        <img
          src={rightImage}
          alt="Team member"
          className="w-[80%] h-auto object-top object-cover rounded-lg"
        />
      </div>
    </section>
  )
}
