import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Visual Artist & Designer Portfolio',
  title: 'Showcase - Personal Portfolio',
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
