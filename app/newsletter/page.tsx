import type { Metadata } from "next"
import { generateMetadata } from "@/lib/seo"
import NewsletterPageClient from "./page.client"

export const metadata: Metadata = generateMetadata({
  title: "Subscribe to Our Newsletter",
  description:
    "Join thousands of entrepreneurs receiving weekly insights on business strategy, design thinking, and scaling from Joe Abass and the Life By Design team. Get actionable frameworks, case studies, and exclusive content delivered to your inbox.",
  path: "/newsletter",
  image: "/images/newsletter-og.jpg",
})

export default function NewsletterPage() {
  return <NewsletterPageClient />
}
