import React from 'react'

import { Footer, Header } from './components'
import './styles.css'
import { fallbackCategories, getSettings, findDocs } from '@/lib/storefront'

export const dynamic = 'force-dynamic'

export const metadata = {
  description: 'Hai san tuoi song, sashimi, combo gia dinh va bang gia moi ngay.',
  title: 'Long Phung Seafood',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const [settings, categories] = await Promise.all([
    getSettings(),
    findDocs(
      'categories',
      {
        sort: 'sortOrder',
        where: {
          featured: {
            equals: true,
          },
        },
      },
      fallbackCategories,
    ),
  ])

  return (
    <html lang="vi">
      <body>
        <Header categories={categories} settings={settings} />
        <main>{children}</main>
        <Footer categories={categories} settings={settings} />
      </body>
    </html>
  )
}
