import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { ContactBand, ProductGrid, SearchEmpty, SectionHeader } from '../../components'
import {
  fallbackCategories,
  fallbackProducts,
  findDocs,
  findOne,
  getSettings,
} from '@/lib/storefront'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const fallback = fallbackCategories.find((category) => category.slug === slug)
  const category = await findOne('categories', slug, fallback)

  if (!category) {
    notFound()
  }

  return {
    title: `${category.name} | Long Phung Seafood`,
    description: category.description || 'Danh muc san pham hai san Long Phung.',
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const fallbackCategory = fallbackCategories.find((category) => category.slug === slug)
  const category = await findOne('categories', slug, fallbackCategory)
  const settings = await getSettings()

  if (!category) {
    notFound()
  }

  const fallback = fallbackProducts.filter((product) => {
    const productCategory = typeof product.category === 'object' ? product.category : null
    return productCategory?.slug === slug
  })

  // Prefer querying by resolved category ID (more reliable than relation slug filter)
  const productsQuery = category?.id
    ? {
        limit: 100,
        sort: '-updatedAt' as const,
        where: {
          category: {
            equals: category.id,
          },
        },
      }
    : {
        limit: 100,
        sort: '-updatedAt' as const,
        where: {
          'category.slug': {
            equals: slug,
          },
        },
      }

  const products = await findDocs(
    'products',
    productsQuery,
    fallback.length ? fallback : fallbackProducts,
  )

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Danh muc</p>
        <h1>{category?.name || 'San pham Long Phung'}</h1>
        <p>{category?.description || 'Cac san pham dang duoc cap nhat trong Payload admin.'}</p>
      </section>
      <section className="page-section">
        <SectionHeader title="San pham" eyebrow="Dat nhanh qua Zalo" />
        {products.length ? (
          <ProductGrid products={products} settings={settings} />
        ) : (
          <SearchEmpty title="Chua co san pham trong danh muc nay" />
        )}
      </section>
      <ContactBand settings={settings} />
    </>
  )
}
