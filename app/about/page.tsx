import AboutPageClient from "./page.client"

import { generateMetadata, pageMetadata } from "@/lib/seo";

export const metadata = generateMetadata({
  title: pageMetadata.about.title,
  description: pageMetadata.about.description,
  path: "/about",
  tags: pageMetadata.about.tags,
})

export default function AboutPage() {
  return <AboutPageClient />
}
