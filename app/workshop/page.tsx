import { WorkshopHero } from "@/components/workshop-hero"
import { WorkshopBenefits } from "@/components/workshop-benefits"
import { WorkshopValue } from "@/components/workshop-value"
import { WorkshopFaq } from "@/components/workshop-faq"

export default function WorkshopPage() {
  return (
    <main>
      <WorkshopHero />
      <WorkshopBenefits />
      <WorkshopValue />
      <WorkshopFaq />
    </main>
  )
}
