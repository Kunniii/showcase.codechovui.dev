import React from 'react'
import { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://showcase.codechovui.dev'),
  title: {
    template: '%s | Showcase',
    default: 'Showcase - Personal Portfolio',
  },
  description: 'Visual Artist & Designer Portfolio',
  openGraph: {
    title: 'Showcase - Personal Portfolio',
    description: 'Visual Artist & Designer Portfolio',
    url: '/',
    siteName: 'Showcase',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Showcase - Personal Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Showcase - Personal Portfolio',
    description: 'Visual Artist & Designer Portfolio',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'CERYKVFb_DktapV4GKAi7EaW9pMJ095QgbyNwgbVqYc',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
