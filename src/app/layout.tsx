import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Servvee — Menu & Promo Manager',
  description: 'AI-powered restaurant menu management with Canva Live Embeds and holiday scheduling. Part of the BOOM B.A.A.R.S suite.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
