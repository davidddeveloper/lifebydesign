"use client"

import { VisualEditing } from "@sanity/visual-editing/react"

export function VisualEditingClient() {
  return (
    <>
      <VisualEditing portal={false} />
      <a
        href="/api/disable-draft"
        className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded shadow-lg text-sm font-medium hover:bg-red-700 transition-colors"
      >
        Disable Draft Mode
      </a>
    </>
  )
}
