"use client"

export function FoundersSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">ABOUT OUR FOUNDER</h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Founders Image */}
          <div className="flex justify-center md:order-first">
            <div className="w-full max-w-sm">
              <img
                src="/images/joeabasshero.png"
                alt="Alex and Leila Hormozi"
                className="w-full h-auto rounded-lg border-4 border-gray-900 shadow-lg"
              />
            </div>
          </div>

          {/* Founders Content */}
          <div className="space-y-4 text-gray-900">
            <p className="text-lg leading-relaxed">
              <strong>Joe Abass Bangura</strong> is a Chartered Accountant, serial entrepreneur, and life & business coach, widely recognized as the host of Sierra Leone's first and largest personal development platform Life By Design.
            </p>

            <p className="text-lg leading-relaxed">
              Through this movement, he has inspired countless Sierra Leoneans to overcome adversity and achieve significance, drawing on his own journey from poverty, school setbacks, and labor work to becoming a respected business leader.
            </p>

            {/*<p className="text-lg leading-relaxed">
                He currently serves as Chief of Corporate Affairs at Africell Sierra Leone, CEO of Life By Design Group, Founding CEO & Non-Executive Director of ACTB Savings & Loans, and Non-Executive Director at SMEDA. Joe holds fellowships with the Chartered Association of Certified Accountants (FCCA UK) and the Institute of Chartered Accountants Sierra Leone (FCA SL), and has received numerous awards, including Hubert Humphrey Fellow (2010) and US State Department Alumni of the Month (2014).

              Alex wrote two best selling books <span className="font-bold">$100M Offers</span> and{" "}
              <span className="font-bold">$100M Leads</span>, both of which have sold over 1M copies and are still #1 &
              #2 on Amazon for Marketing & Sales.
            </p>*/}

            <p className="text-lg leading-relaxed font-semibold text-[#177fc9]">
              An ordained pastor, Joe has been married to his teenage sweetheart, Ellen, for over 35 years. They are proud parents of three daughters: Josetta, Wisdom, and Hadassah.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
