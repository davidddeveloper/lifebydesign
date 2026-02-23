"use client"

import type { HomePageFounder } from "@/payload/lib/types"

interface FoundersSectionProps {
  data?: HomePageFounder
}

export function FoundersSection({ data }: FoundersSectionProps) {
  const name = data?.founderName || "Joe Abass Bangura"
  const title = data?.founderTitle || "ABOUT OUR FOUNDER"
  const image = data?.founderImage?.url || "/images/joeabasssketch.png"
  const bio = data?.founderBio

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-2xl font-black text-gray-900 text-center mb-12 uppercase">{title}</h2>

        <div className="flex-col md:flex-row flex justify-center gap-20 items-center">
          <div className="flex md:flex-shrink-0 justify-center md:order-first">
            <div className="w-full max-w-sm md:max-w-md md:h-[380px]">
              <img
                src={image}
                alt={name}
                className="w-full h-auto md:h-full object-cover rounded-lg border-4 border-gray-900 shadow-lg"
              />
            </div>
          </div>

          <div className="space-y-4 px-4 md:px-0 text-gray-900">
            {bio ? (
              <p className="text-md leading-relaxed">{bio}</p>
            ) : (
              <>
                <p className="text-md leading-relaxed">
                  <strong>Joe Abass Bangura</strong> is the Founder & CEO of Life By Design - The Startup Bodyshop, a leading entrepreneurship organization in Sierra Leone.
                </p>
                <p className="text-md leading-relaxed">
                  Through The Startup Bodyshop, he has supported over 3,000 businesses and facilitated more than $3M in investments into startups and SMEs. He has incubated and accelerated multiple ventures to between $500K and $1.5M in annual revenue — some of them bootstrapped.
                </p>
                <p className="text-md leading-relaxed">
                  Before The Startup Bodyshop, Joe helped grow ACTB Bank from a small microfinance startup into a nationwide institution with a $4.5M loan portfolio and 9 branches, creating jobs and expanding access to capital for thousands of businesses.
                </p>
                <p className="text-lg leading-relaxed font-semibold text-[#177fc9]">
                  A Chartered Accountant turned serial entrepreneur, Joe now focuses on helping founders build businesses that run without them — so they can scale impact, not burnout.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
