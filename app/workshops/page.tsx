import { generateMetadata, pageMetadata } from "@/lib/seo"
import { WorkshopHero } from "@/components/workshop-hero"
import { WorkshopBenefits } from "@/components/workshop-benefits"
import { WorkshopValue } from "@/components/workshop-value"
import { WorkshopFaq } from "@/components/workshop-faq"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export const metadata = generateMetadata({
  title: pageMetadata.workshops.title,
  description: pageMetadata.workshops.description,
  path: "/workshops",
  tags: pageMetadata.workshops.tags,
})


export default function WorkshopPage() {
  return (
    <main>
      <Header />
      <WorkshopHero />
      <WorkshopBenefits />
      <WorkshopValue />
      <WorkshopFaq />
      <Footer />
    </main>
  )
}
