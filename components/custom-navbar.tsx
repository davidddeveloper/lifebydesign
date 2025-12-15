import React from "react"
import { NavbarProps } from "sanity"

export default function CustomNavbar(props: NavbarProps) {
  return (
    <>
      <a href="/" style={{ fontWeight: 400, fontSize: 14 }}>← Back to Website</a>
      {props.renderDefault(props)}
    </>
  )
}

