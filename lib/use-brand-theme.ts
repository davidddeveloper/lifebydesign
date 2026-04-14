// lib/use-brand-theme.ts
// Fetches brand primary colour from /api/theme and returns it.
// Falls back to #1A1A1A immediately so there's no flash.

import { useState, useEffect } from "react"

const DEFAULT = "#1A1A1A"
let cached: string | null = null

export function useBrandTheme() {
  const [primary, setPrimary] = useState<string>(cached ?? DEFAULT)

  useEffect(() => {
    if (cached) { setPrimary(cached); return }
    fetch("/api/theme")
      .then(r => r.json())
      .then(d => {
        const colour = d.primary || DEFAULT
        cached = colour
        setPrimary(colour)
      })
      .catch(() => {})
  }, [])

  // Slightly darker for hover states
  function darken(hex: string): string {
    try {
      const n = parseInt(hex.replace("#", ""), 16)
      const r = Math.max(0, (n >> 16) - 20)
      const g = Math.max(0, ((n >> 8) & 0xff) - 20)
      const b = Math.max(0, (n & 0xff) - 20)
      return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`
    } catch { return "#000000" }
  }

  return { primary, hover: darken(primary) }
}
