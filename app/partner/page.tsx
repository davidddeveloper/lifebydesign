import { generateMetadata, pageMetadata } from "@/lib/seo"
import PartnerPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.partners.title,
  description: pageMetadata.partners.description,
  path: "/partner",
  tags: pageMetadata.partners.tags,
})

export default function PartnerPage() {
  return <PartnerPageClient />
}
