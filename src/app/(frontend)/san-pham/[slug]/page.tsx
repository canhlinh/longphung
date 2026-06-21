import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle, Phone } from 'lucide-react'
import React from 'react'

import { ContactBand, ProductGrid, SectionHeader } from '../../components'
import {
  createZaloUrl,
  fallbackProducts,
  findDocs,
  findOne,
  formatPrice,
  getProductImage,
  getSettings,
  plainTextFromRichText,
  stockLabel,
} from '@/lib/storefront'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const fallback = fallbackProducts.find((product) => product.slug === slug)
  const product = await findOne('products', slug, fallback)
  const description = product?.seo?.description || product?.shortDescription

  return {
    title: product?.seo?.title || `${product?.name || 'San pham'} | Long Phung Seafood`,
    description,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const fallback = fallbackProducts.find((product) => product.slug === slug)
  const product = await findOne('products', slug, fallback)
  const settings = await getSettings()

  if (!product) {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">San pham</p>
        <h1>Khong tim thay san pham</h1>
        <Link className="button primary" href="/bang-gia">
          Xem bang gia
        </Link>
      </section>
    )
  }

  const related = await findDocs(
    'products',
    {
      limit: 3,
      where: {
        featured: {
          equals: true,
        },
        slug: {
          not_equals: product.slug,
        },
      },
    },
    fallbackProducts.filter((item) => item.slug !== product.slug),
  )

  const message = `Toi muon dat/hoi gia ${product.name} (${product.slug})`

  return (
    <>
      <section className="product-detail">
        <div className="detail-media">
          <img alt={product.name} src={getProductImage(product, 0)} />
        </div>
        <div className="detail-content">
          <p className="eyebrow">{stockLabel(product.stockStatus)}</p>
          <h1>{product.name}</h1>
          <p>{product.shortDescription}</p>
          <div className="detail-price">
            <strong>{formatPrice(product.retailPrice, product.priceLabel)}</strong>
            <span>/{product.unit}</span>
          </div>
          <dl className="spec-list">
            {product.wholesalePrice ? (
              <>
                <dt>Gia si</dt>
                <dd>{formatPrice(product.wholesalePrice)}</dd>
              </>
            ) : null}
            {product.size ? (
              <>
                <dt>Quy cach</dt>
                <dd>{product.size}</dd>
              </>
            ) : null}
            {product.origin ? (
              <>
                <dt>Nguon hang</dt>
                <dd>{product.origin}</dd>
              </>
            ) : null}
          </dl>
          <div className="hero-actions">
            <a className="button primary" href={createZaloUrl(settings.zaloUrl, message)}>
              <MessageCircle size={18} /> Dat qua Zalo
            </a>
            <a className="button secondary" href={`tel:${settings.hotline.replace(/\s/g, '')}`}>
              <Phone size={18} /> Goi ngay
            </a>
          </div>
        </div>
      </section>
      <section className="page-section two-column">
        <article>
          <SectionHeader title="Thong tin san pham" />
          <p>
            {plainTextFromRichText(product.description) ||
              product.shortDescription ||
              'Admin co the cap nhat mo ta chi tiet trong Payload.'}
          </p>
        </article>
        <article>
          <SectionHeader title="Bao quan va che bien" />
          <p>{product.preservationNotes || 'Giu lanh va dung som sau khi nhan hang.'}</p>
          <p>{product.cookingNotes || 'Lien he Long Phung de duoc goi y cach che bien phu hop.'}</p>
        </article>
      </section>
      <section className="page-section">
        <SectionHeader title="San pham lien quan" eyebrow="Co the ban can" />
        <ProductGrid products={related} settings={settings} />
      </section>
      <ContactBand settings={settings} />
    </>
  )
}
