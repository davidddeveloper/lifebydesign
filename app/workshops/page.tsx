import { WorkshopHero } from "@/components/workshop-hero"
import { WorkshopBenefits } from "@/components/workshop-benefits"
import { WorkshopValue } from "@/components/workshop-value"
import { WorkshopFaq } from "@/components/workshop-faq"
import { Header } from "@/components/Header"

export default function WorkshopPage() {
  return (
    <main>
      <Header />
      <WorkshopHero />
      <WorkshopBenefits />
      <WorkshopValue />
      <WorkshopFaq />
    </main>
  )
}
