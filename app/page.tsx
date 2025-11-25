import { generateMetadata, pageMetadata } from "@/lib/seo"
import HomeClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  path: "/",
  tags: pageMetadata.home.tags,
})

export default function Page() {
  return <HomeClient />
}
