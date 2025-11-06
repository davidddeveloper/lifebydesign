"use client"

export function FoundersSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">ABOUT OUR FOUNDER</h2>

        <div className="flex-col md:flex-row flex justify-center gap-20 items-center">
          {/* Founders Image */}
          <div className="flex md:flex-shrink-0 justify-center md:order-first">
            <div className="w-full max-w-sm">
              <img
                src="/images/joeabasshero.png"
                alt="Alex and Leila Hormozi"
                className="w-full h-auto rounded-lg border-4 border-gray-900 shadow-lg"
              />
            </div>
          </div>

          {/* Founders Content */}
          <div className="space-y-4 px-4 md:px-0 text-gray-900">
            <p className="text-lg leading-relaxed">
              <strong>Joe Abass Bangura</strong> is the Founder and CEO of The Startup Bodyshop and creator of Life By Design — Sierra Leone's first and largest personal development platform.

            </p>

            <p className="text-lg leading-relaxed">
              Over the last two decades, he's built, scaled, and advised multiple companies across finance, tech, and media — including ACTB Bank, iDT Labs, and Inkee Media — helping them grow from small startups into multi-million-dollar operations.
            </p>
            <p className="text-lg leading-relaxed">
              Through Life By Design, he's impacted tens of thousands of entrepreneurs and professionals across Africa — teaching them how to build businesses and lives that work without them.
            </p>
            <p className="text-lg leading-relaxed">
              A Chartered Accountant turned serial entrepreneur and business coach, Joe's journey started from labor work and academic setbacks to leading organizations that now create jobs, wealth, and transformation.
            </p>
            <p className="text-lg leading-relaxed">
              He's been married to his teenage sweetheart, Ellen, for over 35 years, and together they've raised three daughters — Josetta, Wisdom, and Hadassah.
            </p>
            {/*<p className="text-lg leading-relaxed">
                He currently serves as Chief of Corporate Affairs at Africell Sierra Leone, CEO of Life By Design Group, Founding CEO & Non-Executive Director of ACTB Savings & Loans, and Non-Executive Director at SMEDA. Joe holds fellowships with the Chartered Association of Certified Accountants (FCCA UK) and the Institute of Chartered Accountants Sierra Leone (FCA SL), and has received numerous awards, including Hubert Humphrey Fellow (2010) and US State Department Alumni of the Month (2014).

              Alex wrote two best selling books <span className="font-bold">$100M Offers</span> and{" "}
              <span className="font-bold">$100M Leads</span>, both of which have sold over 1M copies and are still #1 &
              #2 on Amazon for Marketing & Sales.
            </p>*/}

            <p className="text-lg leading-relaxed font-semibold text-[#177fc9]">
              
His mission: to help African entrepreneurs design businesses that run without the founder — so they can scale impact, not burnout.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
