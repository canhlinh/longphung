import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { ContactBand, ProductGrid, SectionHeader } from '../../components'
import {
  fallbackPosts,
  fallbackProducts,
  findOne,
  getMediaUrl,
  getSettings,
  plainTextFromRichText,
} from '@/lib/storefront'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const fallback = fallbackPosts.find((post) => post.slug === slug)
  const post = await findOne('posts', slug, fallback)

  return {
    title: post?.seo?.title || `${post?.title || 'Bai viet'} | Long Phung Seafood`,
    description: post?.seo?.description || post?.excerpt,
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const fallback = fallbackPosts.find((post) => post.slug === slug)
  const post = await findOne('posts', slug, fallback)
  const settings = await getSettings()

  if (!post) {
    return (
      <section className="page-hero compact">
        <p className="eyebrow">Bai viet</p>
        <h1>Khong tim thay bai viet</h1>
        <Link className="button primary" href="/bai-viet">
          Xem bai viet khac
        </Link>
      </section>
    )
  }

  const relatedProducts = Array.isArray(post.relatedProducts)
    ? post.relatedProducts.filter((item: any) => typeof item === 'object')
    : fallbackProducts.slice(0, 3)

  return (
    <>
      <article className="article-detail">
        <img alt={post.title} src={getMediaUrl(post.coverImage, 1)} />
        <p className="eyebrow">Cung vao bep</p>
        <h1>{post.title}</h1>
        <p className="lead">{post.excerpt}</p>
        <div className="article-body">
          <p>
            {plainTextFromRichText(post.content) ||
              'Admin co the cap nhat noi dung chi tiet, cong thuc va san pham lien quan trong Payload.'}
          </p>
        </div>
      </article>
      {relatedProducts.length ? (
        <section className="page-section">
          <SectionHeader title="San pham lien quan" />
          <ProductGrid products={relatedProducts} settings={settings} />
        </section>
      ) : null}
      <ContactBand settings={settings} />
    </>
  )
}
