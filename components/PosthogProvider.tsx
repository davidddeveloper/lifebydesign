"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export default function PosthogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com"

    if (!key || key.startsWith("phc_REPLACE")) return

    // Never track in local development — keeps data clean
    if (process.env.NODE_ENV === "development") return

    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      session_recording: {
        maskAllInputs: false,
        maskInputFn: (text, element) => {
          const el = element as HTMLInputElement
          if (el?.type === "email" || el?.type === "tel") return "***"
          return text
        },
      },
      respect_dnt: true,
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
