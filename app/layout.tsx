import { SmartsuppChat } from '@/components/smartsupp-chat'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Inter, Sora } from 'next/font/google'
import './globals.css'

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'AtlasSwift Logistics — Global Freight, Delivered with Precision',
    template: '%s | AtlasSwift Logistics',
  },
  description:
    'AtlasSwift Logistics moves the world forward with air, ocean, and ground freight, smart warehousing, and real-time shipment tracking across 180+ countries.',
  keywords: [
    'logistics',
    'freight forwarding',
    'supply chain',
    'shipment tracking',
    'air freight',
    'ocean freight',
    'warehousing',
  ],
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple: '/icon-light-32x32.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b1220',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        <WhatsAppFloat />
        <SmartsuppChat />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
