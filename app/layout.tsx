import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://startupbodyshop.com"),
  title: {
    default: "LBD Startup Bodyshop - Unlock Purpose, Build Legacy",
    template: "%s | Startup Bodyshop",
  },
  description:
    "Empowering entrepreneurs to design businesses and lives of impact through proven systems, expert guidance, and community support.",
  openGraph: {
    type: "website",
    url: "https://startupbodyshop.com",
    siteName: "LBD Startup Bodyshop",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "LBD Startup Bodyshop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@startupbodyshop",
    creator: "@startupbodyshop",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://startupbodyshop.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
