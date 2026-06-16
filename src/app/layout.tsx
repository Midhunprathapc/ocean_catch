import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OceanCatch - Definitely Fresh | Premium Seafood Delivery',
  description: 'Fresh seafood delivered to your doorstep. Premium quality fish, prawns, crabs and more from Kerala coast.',
  icons: { icon: '/logo.svg' },
  openGraph: {
    title: 'OceanCatch — Definitely Fresh',
    description: 'Premium quality seafood delivered to your doorstep from Kerala coast.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-white text-foreground font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
