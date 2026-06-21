import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { WholesaleBoard } from '../WholesaleBoard'
import { buildWholesaleBoardData } from '@/lib/wholesale-board-data'
import {
  fallbackCategories,
  fallbackPrices,
  findAllDocs,
  findDocs,
  findWholesaleCustomer,
  getSettings,
} from '@/lib/storefront'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const customer = await findWholesaleCustomer(slug)

  if (!customer || customer.slug !== slug || customer.isActive === false) {
    return {
      title: 'Không tìm thấy bảng giá | Minh Kiên Seafood',
    }
  }

  return {
    title: 'Bảng Giá Hải Sản',
    description: 'Bảng giá hải sản cập nhật mỗi ngày. Xem giá, chọn món yêu thích & liên hệ đặt nhanh.',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function WholesaleCustomerPage({ params }: PageProps) {
  const { slug } = await params
  const [customer, settings, prices, categories] = await Promise.all([
    findWholesaleCustomer(slug),
    getSettings(),
    findAllDocs('daily-prices', { sort: 'sortOrder' }, fallbackPrices),
    findDocs('categories', { limit: 100, sort: 'sortOrder' }, fallbackCategories),
  ])

  if (!customer || customer.slug !== slug || customer.isActive === false) {
    notFound()
  }

  const boardData = buildWholesaleBoardData({
    customer,
    settings,
    prices,
    categories,
  })

  const siteHost =
    (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <WholesaleBoard
      data={boardData}
      siteHost={siteHost}
      zaloUrl={String(settings.zaloUrl)}
    />
  )
}