import { Header } from "@/components/Header"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { CareersHero } from "@/components/careers-hero"
import { CultureSection } from "@/components/culture-section"
import { ValuesSection } from "@/components/values-section"
import { BenefitsSection } from "@/components/benefit-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/Footer"

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CareersHero />
        <CultureSection />
        <TestimonialsSection />
        <ValuesSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  )
}
