"use client"

// app/admin/settings/page.tsx
// Brand & theme settings for Startup Bodyshop admin.

import { useState, useEffect } from "react"

const DEFAULT_COLOR = "#1A1A1A"

export default function AdminSettingsPage() {
  const [color, setColor]       = useState(DEFAULT_COLOR)
  const [input, setInput]       = useState(DEFAULT_COLOR)
  const [saved, setSaved]       = useState(false)
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)

  // Load current value
  useEffect(() => {
    fetch("/api/admin/booking-settings")
      .then(r => r.json())
      .then(d => {
        const c = d.settings?.brandPrimaryColor ?? DEFAULT_COLOR
        setColor(c)
        setInput(c)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleHexInput(val: string) {
    setInput(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) setColor(val)
  }

  function handlePickerChange(val: string) {
    setColor(val)
    setInput(val)
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch("/api/admin/booking-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "brand_primary_color", value: color }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[#1A1A1A]">Settings</h1>
          <p className="text-sm text-[#888] mt-1">Configure branding and site preferences.</p>
        </div>

        {/* Brand colour card */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 mb-6">
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-1">Brand Colour</h2>
          <p className="text-xs text-[#888] mb-5 leading-relaxed">
            Applied to the Constraint Audit form — headings, buttons, selected states, and input focus lines.
          </p>

          {loading ? (
            <div className="h-10 w-40 bg-[#F5F5F5] rounded animate-pulse" />
          ) : (
            <>
              {/* Picker row */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative">
                  <input
                    type="color"
                    value={color}
                    onChange={e => handlePickerChange(e.target.value)}
                    className="w-12 h-12 rounded-lg border border-[#E5E5E5] cursor-pointer p-0.5"
                    title="Pick a colour"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => handleHexInput(e.target.value)}
                    placeholder="#1A1A1A"
                    maxLength={7}
                    className="w-28 px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg font-mono focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                  <button
                    onClick={() => { setColor(DEFAULT_COLOR); setInput(DEFAULT_COLOR) }}
                    className="text-xs text-[#AAA] hover:text-[#555] transition-colors underline underline-offset-2"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Live preview */}
              <div className="bg-[#F7F7F7] rounded-lg p-4 mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#AAA] mb-3">Preview</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    className="px-4 py-2 text-sm font-semibold text-white rounded"
                    style={{ backgroundColor: color }}
                  >
                    Start the Audit
                  </button>
                  <span className="text-base font-bold" style={{ color }}>
                    The Constraint-Busting Business Audit
                  </span>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#1A1A1A" }}
              >
                {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
