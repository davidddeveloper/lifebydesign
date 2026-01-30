import React from "react"
import { NavbarProps } from "sanity"

export default function CustomNavbar(props: NavbarProps) {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin.replace('/studio', '')
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const draftModeUrl = `${baseUrl}/api/draft?secret=${process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET}&slug=/`

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <a
        href="/"
        style={{
          fontWeight: 400,
          fontSize: 14,
          textDecoration: 'none',
          color: 'inherit'
        }}
      >
        ← Back to Website
      </a>
      <a
        href={draftModeUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: '6px 12px',
          backgroundColor: '#2276fc',
          color: 'white',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: 500,
          textDecoration: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Enable Draft Mode
      </a>
      {props.renderDefault(props)}
    </div>
  )
}
