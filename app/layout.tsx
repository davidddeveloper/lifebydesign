import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { VisualEditingClient } from "@/components/visual-editting-client";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Life By Design - Unlock Purpose, Build Legacy",
  description: "Empowering entrepreneurs to design businesses and lives of impact.",
  openGraph: {
    type: "website",
    url: "https://lifebydesign.africa",
    siteName: "Life By Design",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
        <VisualEditingClient />
      </body>
    </html>
  );
}
