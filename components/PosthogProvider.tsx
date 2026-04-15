"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export default function PosthogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com"

    if (!key || key.startsWith("phc_REPLACE")) return

    posthog.init(key, {
      api_host: host,
      // Capture pageviews automatically on route changes
      capture_pageview: true,
      // Session recordings — lets you watch real user journeys through the form
      session_recording: { maskAllInputs: false, maskInputFn: (text, element) => {
        // Mask email and phone fields for privacy
        const el = element as HTMLInputElement
        if (el?.type === "email" || el?.type === "tel") return "***"
        return text
      }},
      // Respect Do Not Track
      respect_dnt: true,
      // Don't capture on localhost
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug()
      },
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
