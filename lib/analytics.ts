"use client"

/**
 * Unified analytics wrapper — PostHog only.
 *
 * Usage:
 *   import { trackEvent } from "@/lib/analytics"
 *   trackEvent("audit_started", { industry: "SaaS" })
 */

import posthog from "posthog-js"

export type AuditEventName =
  | "audit_started"
  | "audit_screen_viewed"
  | "audit_section_entered"
  | "audit_submitted"
  | "audit_abandoned"

export interface AuditEventProperties {
  screen_id?: string
  screen_index?: number
  screen_type?: string
  section?: string
  progress_pct?: number
  answered_count?: number
  time_on_form_seconds?: number
  industry?: string
  monthly_revenue?: string
}

export function trackEvent(
  event: AuditEventName,
  properties?: AuditEventProperties
) {
  try {
    posthog.capture(event, properties)
  } catch {
    // PostHog not initialised yet (SSR / key missing) — fail silently
  }
}
