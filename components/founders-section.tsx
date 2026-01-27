"use client"

export function FoundersSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-2xl font-black text-gray-900 text-center mb-12">ABOUT OUR FOUNDER</h2>

        <div className="flex-col md:flex-row flex justify-center gap-20 items-center">
          {/* Founders Image */}
          <div className="flex md:flex-shrink-0 justify-center md:order-first">
            <div className="w-full max-w-sm md:max-w-md md:h-[380px]">
              <img
                src="/images/joeabasssketch.png"
                alt="Joe Abass Bangura Founder"
                className="w-full h-auto md:h-full object-cover rounded-lg border-4 border-gray-900 shadow-lg"
              />
            </div>
          </div>

          {/* Founders Content */}
          <div className="space-y-4 px-4 md:px-0 text-gray-900">
            <p className="text-md leading-relaxed">
              <strong>Joe Abass Bangura</strong> is the Founder & CEO of Life By Design - The Startup Bodyshop, a leading entrepreneurship organization in Sierra Leone.
            </p>

            <p className="text-md leading-relaxed">
              Through The Startup Bodyshop, he has supported over 3,000 businesses and facilitated more than $3M in investments into startups and SMEs. He has incubated and accelerated multiple ventures to between $500K and $1.5M in annual revenue — some of them bootstrapped.
            </p>
            <p className="text-md leading-relaxed">
              Before The Startup Bodyshop, Joe helped grow ACTB Bank from a small microfinance startup into a nationwide institution with a $4.5M loan portfolio and 9 branches, creating jobs and expanding access to capital for thousands of businesses.
            </p>
            {/*<p className="text-md leading-relaxed">
              Through The Startup Bodyshop, his team has supported over 3,000 entrepreneurs, channeled more than US $3 million in investments to SMEs and startups, and helped dozens of founders systemize, scale, and attract capital.
            </p>*/}
            {/*<p className="text-lg leading-relaxed">
                He currently serves as Chief of Corporate Affairs at Africell Sierra Leone, CEO of Life By Design Group, Founding CEO & Non-Executive Director of ACTB Savings & Loans, and Non-Executive Director at SMEDA. Joe holds fellowships with the Chartered Association of Certified Accountants (FCCA UK) and the Institute of Chartered Accountants Sierra Leone (FCA SL), and has received numerous awards, including Hubert Humphrey Fellow (2010) and US State Department Alumni of the Month (2014).

              Alex wrote two best selling books <span className="font-bold">$100M Offers</span> and{" "}
              <span className="font-bold">$100M Leads</span>, both of which have sold over 1M copies and are still #1 &
              #2 on Amazon for Marketing & Sales.
            </p>*/}

            <p className="text-lg leading-relaxed font-semibold text-[#177fc9]">
              A Chartered Accountant turned serial entrepreneur, Joe now focuses on helping founders build businesses that run without them — so they can scale impact, not burnout.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
