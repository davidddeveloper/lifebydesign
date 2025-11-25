import { generateMetadata, pageMetadata } from "@/lib/seo"
import KolatBooksPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.kolatBooks.title,
  description: pageMetadata.kolatBooks.description,
  path: "/products/finance-freedom",
  tags: pageMetadata.kolatBooks.tags,
})

export default function KolatBooksPage() {
  return <KolatBooksPageClient />
}
