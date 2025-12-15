import type { DocumentActionComponent, DocumentActionProps } from "sanity"
import crypto from "crypto"

import { SanityDocument } from "@sanity/client"

const PreviewDraftAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { draft } = props
  const document: SanityDocument[keyof SanityDocument] = draft

  if (!document?.slug?.current) {
    return null
  }

  const generatePreviewToken = (slug: string, docType: string): string => {
    const secret = process.env.SANITY_PREVIEW_SECRET || "your-preview-secret"
    return crypto.createHash("sha256").update(`${secret}:${slug}:${docType}`).digest("hex")
  }

  const getPreviewUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/"
    const slug = document.slug.current
    const docType = document._type
    const token = generatePreviewToken(slug, docType)

    return `${baseUrl}/api/preview?slug=${slug}&type=${docType}&token=${token}`
  }

  const handleClick = () => {
    window.open(getPreviewUrl(), "_blank")
  }

  return {
    label: "Preview Draft",
    icon: () => <span>🔍</span>,
    onHandle: handleClick,
  }
}

export default PreviewDraftAction