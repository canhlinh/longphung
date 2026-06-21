import type { Metadata } from 'next'
import React from 'react'

import { ContactBand, PriceTable, SectionHeader } from '../components'
import { fallbackPrices, findDocs, getSettings } from '@/lib/storefront'

export const metadata: Metadata = {
  title: 'Bang gia hom nay | Long Phung Seafood',
  description: 'Bang gia hai san, sashimi va combo cap nhat moi ngay.',
}

export default async function PricePage() {
  const [settings, prices] = await Promise.all([
    getSettings(),
    findDocs('daily-prices', { limit: 100, sort: 'sortOrder' }, fallbackPrices),
  ])

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Bang gia</p>
        <h1>Bang gia hai san hom nay</h1>
        <p>Gia co the thay doi theo mua, size va tinh trang hang. Chat Zalo de chot gia nhanh.</p>
      </section>
      <section className="page-section">
        <SectionHeader title="San pham dang mo ban" eyebrow="Cap nhat moi ngay" />
        <PriceTable prices={prices} settings={settings} />
      </section>
      <ContactBand settings={settings} />
    </>
  )
}
