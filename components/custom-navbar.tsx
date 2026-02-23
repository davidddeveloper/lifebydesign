import React from "react"
import { NavbarProps } from "sanity"

export default function CustomNavbar(props: NavbarProps) {
  return (
    <div>
      {props.renderDefault(props)}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
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
          }}
        >
          &larr; Back to Website
        </a>
      </div>
    </div>
  )
}
