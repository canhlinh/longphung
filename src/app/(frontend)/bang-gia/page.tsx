import type { Metadata } from 'next'
import React from 'react'

import { ContactBand, PriceTable, SectionHeader } from '../components'
import { fallbackPrices, findDocs, getSettings } from '@/lib/storefront'

export const metadata: Metadata = {
  title: 'Bảng giá hôm nay | Long Phụng Seafood',
  description: 'Bảng giá hải sản, sashimi và combo cập nhật mỗi ngày.',
}

export default async function PricePage() {
  const [settings, prices] = await Promise.all([
    getSettings(),
    findDocs('daily-prices', { limit: 100, sort: 'sortOrder' }, fallbackPrices),
  ])

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Bảng giá</p>
        <h1>Bảng giá hải sản hôm nay</h1>
        <p>Giá có thể thay đổi theo mùa, size và tình trạng hàng. Chat Zalo để chốt giá nhanh.</p>
      </section>
      <section className="page-section">
        <SectionHeader title="Sản phẩm đang mở bán" eyebrow="Cập nhật mỗi ngày" />
        <PriceTable prices={prices} settings={settings} />
      </section>
      <ContactBand settings={settings} />
    </>
  )
}
