import React from "react"
import { NavbarProps } from "sanity"

export default function CustomNavbar(props: NavbarProps) {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin.replace('/studio', '')
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const draftModeUrl = `${baseUrl}/api/draft?secret=${process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET}&slug=/`

  return (
    <div>
      {props.renderDefault(props)}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.5rem',
          padding: '4px 12px',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          backgroundColor: 'rgba(0,0,0,0.02)',
        }}
      >
        <a
          href="/"
          style={{
            fontWeight: 400,
            fontSize: 12,
            textDecoration: 'none',
            color: '#666',
            marginRight: 'auto',
          }}
        >
          &larr; Back to Website
        </a>
        <a
          href={draftModeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '4px 10px',
            backgroundColor: '#177fc9',
            color: 'white',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 500,
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Enable Draft Mode
        </a>
      </div>
    </div>
  )
}
