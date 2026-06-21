import type { Metadata } from 'next'
import React from 'react'

import { ContactBand, PriceTable, SectionHeader } from '../components'
import { fallbackPrices, getSettings, getPayloadClient } from '@/lib/storefront'
import { SearchForm } from './SearchForm'
import { Pagination } from './Pagination'

export const metadata: Metadata = {
  title: 'Bảng giá hôm nay | Long Phụng Seafood',
  description: 'Bảng giá hải sản, sashimi và combo cập nhật mỗi ngày.',
}

export default async function PricePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
  const search = typeof searchParams.q === 'string' ? searchParams.q : ''

  const where: any = {
    isActive: { equals: true },
  }
  if (search) {
    where.displayName = {
      like: search,
    }
  }

  const payload = await getPayloadClient()
  
  const [settings, pricesResult] = await Promise.all([
    getSettings(),
    payload.find({
      collection: 'daily-prices',
      limit: 20,
      page,
      sort: 'sortOrder',
      where,
      depth: 2,
    }).catch(() => ({ docs: fallbackPrices, totalPages: 1, hasNextPage: false, hasPrevPage: false, page: 1 })),
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
        <SearchForm initialSearch={search} />
        <PriceTable prices={pricesResult.docs} settings={settings} hideWholesale />
        <Pagination 
          page={pricesResult.page} 
          totalPages={pricesResult.totalPages} 
          hasNextPage={pricesResult.hasNextPage} 
          hasPrevPage={pricesResult.hasPrevPage} 
          query={search}
        />
      </section>
      <ContactBand settings={settings} />
    </>
  )
}
