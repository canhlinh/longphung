import React from 'react'

import {
  CategoryGrid,
  Commitments,
  ContactBand,
  PostGrid,
  PriceTable,
  ProductGrid,
  SectionHeader,
} from './components'
import { HeroSlider as Hero } from './HeroSlider'
import {
  fallbackCategories,
  fallbackPosts,
  fallbackPrices,
  fallbackProducts,
  findDocs,
  getSettings,
} from '@/lib/storefront'
import { PLACEMENTS } from '@/lib/constants'

export default async function HomePage() {
  const [settings, banners, categories, products, prices, posts] = await Promise.all([
    getSettings(),
    findDocs(
      'banners',
      {
        sort: 'sortOrder',
        where: {
          isActive: {
            equals: true,
          },
          placement: {
            equals: PLACEMENTS.HOME,
          },
        },
      },
      [],
    ),
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
    findDocs(
      'products',
      {
        sort: '-updatedAt',
        where: {
          featured: {
            equals: true,
          },
        },
      },
      fallbackProducts,
    ),
    findDocs('daily-prices', { sort: 'sortOrder' }, fallbackPrices),
    findDocs(
      'posts',
      {
        sort: '-updatedAt',
        where: {
          featured: {
            equals: true,
          },
        },
      },
      fallbackPosts,
    ),
  ])

  return (
    <>
      <Hero banners={banners} settings={settings} />
      <Commitments />
      <section className="page-section">
        <SectionHeader
          actionHref="/bang-gia"
          actionLabel="Xem bảng giá"
          eyebrow="Danh mục"
          title="Chọn nhanh theo nhu cầu"
        />
        <CategoryGrid categories={categories} />
      </section>
      <section className="page-section">
        <SectionHeader
          actionHref="/bang-gia"
          actionLabel="Cập nhật hôm nay"
          eyebrow="Bảng giá"
          title="Giá tốt đang có"
        />
        <PriceTable prices={prices.slice(0, 6)} settings={settings} />
      </section>
      <section className="page-section">
        <SectionHeader
          actionHref="/danh-muc/hai-san-tuoi"
          actionLabel="Xem thêm"
          eyebrow="Sản phẩm"
          title="Sản phẩm nổi bật"
        />
        <ProductGrid products={products} settings={settings} />
      </section>
      <section className="page-section">
        <SectionHeader
          actionHref="/bai-viet"
          actionLabel="Tất cả bài viết"
          eyebrow="Cùng vào bếp"
          title="Mẹo chọn và chế biến hải sản"
        />
        <PostGrid posts={posts} />
      </section>
      <ContactBand settings={settings} />
    </>
  )
}
