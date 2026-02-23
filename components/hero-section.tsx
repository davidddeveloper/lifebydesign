"use client"

import Link from "next/link"
import type { HomePageHero } from "@/payload/lib/types"

interface HeroSectionProps {
  onOpenForm: () => void
  data?: HomePageHero
}

export function HeroSection({ onOpenForm, data }: HeroSectionProps) {
  const heading = data?.heading || "ARE YOU READY TO SCALE YOUR BUSINESS?"
  const description = data?.subheading || "Learn from the team that has scaled businesses to multimillion US Dollars in annual revenue."
  const ctaText = "Take our Free Business Constraint Audit"
  const buttonText = data?.ctaButton?.text || "I'M READY TO SCALE"
  const buttonUrl = data?.ctaButton?.url || "/constraint-audit"
  const leftImage = data?.heroImageLeft?.url || "/images/joeabasshero22.png"
  const rightImage = data?.heroImageRight?.url || "/images/joeabasshero.png"

  return (
    <section className="bg-gray-100 py-24 md:py-16 lg:py-16 relative overflow-hidden ">
      <div className="container mx-auto pt-10 z-10">
        <div className="items-center gap-8 grid lg:grid-cols-[220px_1fr_0px]">
          <div className="hidden mt-20 absolute bottom-0 lg:block">
            <img
              src={leftImage}
              alt="Team member"
              className="w-[38%] h-auto object-cover"
            />
          </div>
          <div className="hidden lg:block"></div>

          <div className="text-center max-w-5xl md:pr-2 md:min-w-[650px] lg:max-w-5xl mx-auto">
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
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
      <div className="lg:hidden z-0 max-w-[300px] mx-auto gap-4 mt-8 flex justify-center">
        <img
          src={rightImage}
          alt="Team member"
          className="w-[80%] h-auto object-top object-cover rounded-lg"
        />
      </div>
    </section>
  )
}
