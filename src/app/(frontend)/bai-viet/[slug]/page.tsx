import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
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

  if (!post) {
    notFound()
  }

  return {
    title: post.seo?.title || `${post.title} | Minh Kiên Seafood`,
    description: post.seo?.description || post.excerpt,
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const fallback = fallbackPosts.find((post) => post.slug === slug)
  const post = await findOne('posts', slug, fallback)
  const settings = await getSettings()

  if (!post) {
    notFound()
  }

  const relatedProducts = Array.isArray(post.relatedProducts)
    ? post.relatedProducts.filter((item: any) => typeof item === 'object')
    : fallbackProducts.slice(0, 3)

  return (
    <>
      <article className="article-detail">
        <Image alt={post.title} src={getMediaUrl(post.coverImage, 1)} width={800} height={400} />
        <p className="eyebrow">Cùng vào bếp</p>
        <h1>{post.title}</h1>
        <p className="lead">{post.excerpt}</p>
        <div className="article-body">
          <p>
            {plainTextFromRichText(post.content) ||
              'Admin có thể cập nhật nội dung chi tiết, công thức và sản phẩm liên quan trong Payload.'}
          </p>
        </div>
      </article>
      {relatedProducts.length ? (
        <section className="page-section">
          <SectionHeader title="Sản phẩm liên quan" />
          <ProductGrid products={relatedProducts} settings={settings} />
        </section>
      ) : null}
      <ContactBand settings={settings} />
    </>
  )
}
