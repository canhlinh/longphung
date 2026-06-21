import React from 'react'

import { Footer, Header } from './components'
import './styles.css'
import { fallbackCategories, getSettings, findDocs } from '@/lib/storefront'

// Removed force-dynamic to allow caching/revalidation. Use revalidate for periodic refresh.
// For production, consider Payload hooks + revalidatePath or unstable_cache with tags.
export const revalidate = 60

export const metadata = {
  description: 'Hải sản tươi sống, sashimi, combo gia đình và bảng giá mỗi ngày.',
  title: 'Long Phụng Seafood',
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
