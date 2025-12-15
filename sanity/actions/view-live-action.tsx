import type { DocumentActionComponent, DocumentActionProps } from "sanity"

import { SanityDocument } from "@sanity/client"

const ViewLiveAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { draft, published } = props
  const document: SanityDocument[keyof SanityDocument] = published || draft

  if (!document?.slug?.current) {
    return null
  }

  const getUrl = () => {
    const baseUrl = process.env.SANITY_BASE_URL || "http://localhost:3000/media"
    const slug = document.slug.current

    console.log('this is the slug lol')

    switch (document._type) {
      case "post":
        return `${baseUrl}/blog/${slug}`
      case "product":
        return `${baseUrl}/products/${slug}`
      case "page":
        return `${baseUrl}/${slug}`
      case "jobPosting":
        return `${baseUrl}/careers/jobs/${slug}`
      default:
        return baseUrl
    }
  }

  const handleClick = () => {
    if (!published) {
      alert("This document must be published first to view it live.")
      return
    }
    window.open(getUrl(), "_blank")
  }

  return {
    label: "View Live",
    icon: () => <span>👁️</span>,
    onHandle: handleClick,
  }
}

export default ViewLiveAction