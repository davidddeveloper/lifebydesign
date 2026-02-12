import type { WorkshopBenefitsSection } from "@/sanity/lib/types"
import { urlFor } from "@/sanity/lib/image"

interface WorkshopBenefitsProps {
  data?: WorkshopBenefitsSection
}

export function WorkshopBenefits({ data }: WorkshopBenefitsProps) {
  const defaultBenefits = [
    {
      title: "#1: Identify Your Exact Constraint",
      description: "You'll learn the 5 Levers Framework and score your business on each lever. By Day 1, you'll know exactly what's holding you back—not guesses, data.",
      image: "/images/joeabass-hands-on.jpg"
    },
    {
      title: "#2: Learn Our 90-Day Constraint-Breaking Method",
      description: "We break down the exact 3-phase system (Diagnose, Design, Deploy) we use to eliminate constraints. You'll see 5 real case studies of businesses that used this method.",
      image: "/images/workshop.jpg"
    },
    {
      title: "#3: Build Your 90-Day Plan",
      description: "You'll leave with a complete roadmap: week-by-week actions, milestones, and tactics specific to YOUR constraint. Plus an accountability partner to keep you on track.",
      image: "/images/joeabassq&a.jpg"
    }
  ]

  const benefits = data?.benefits?.map(b => ({
    title: b.title || "",
    description: b.description || "",
    image: b.image ? urlFor(b.image).url() : ""
  })) || defaultBenefits

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Torn Paper Header */}
        <div className="mb-16">
          <div
            className="bg-[#1e293b] py-8 px-6 relative"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 85%, 98% 90%, 96% 85%, 94% 90%, 92% 85%, 90% 90%, 88% 85%, 86% 90%, 84% 85%, 82% 90%, 80% 85%, 78% 90%, 76% 85%, 74% 90%, 72% 85%, 70% 90%, 68% 85%, 66% 90%, 64% 85%, 62% 90%, 60% 85%, 58% 90%, 56% 85%, 54% 90%, 52% 85%, 50% 90%, 48% 85%, 46% 90%, 44% 85%, 42% 90%, 40% 85%, 38% 90%, 36% 85%, 34% 90%, 32% 85%, 30% 90%, 28% 85%, 26% 90%, 24% 85%, 22% 90%, 20% 85%, 18% 90%, 16% 85%, 14% 90%, 12% 85%, 10% 90%, 8% 85%, 6% 90%, 4% 85%, 2% 90%, 0 85%)",
            }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white text-center">
              What you'll get at the <span className="underline decoration-4">in-person</span> workshop:
            </h2>
          </div>
        </div>

        {/* Three Column Benefits */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center h-[500px]">
              <h3 className="text-2xl md:text-3xl font-black mb-6">{benefit.title}</h3>
              <div className="mb-6 rounded-lg overflow-hidden shadow-lg h-64">
                <img src={benefit.image || defaultBenefits[index]?.image} alt={benefit.title} className="w-full h-full object-cover" />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
