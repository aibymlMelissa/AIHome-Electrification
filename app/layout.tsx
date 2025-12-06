import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EcoHome - Energy Transition Simulator',
  description: 'Simulate your home energy transition with AI-powered recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
