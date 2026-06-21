import type { Metadata } from 'next'
import React from 'react'

import { PostGrid, SearchEmpty, SectionHeader } from '../components'
import { fallbackPosts, findDocs } from '@/lib/storefront'

export const metadata: Metadata = {
  title: 'Món ngon và mẹo chọn hải sản | Minh Kiên Seafood',
  description: 'Bài viết hướng dẫn chọn, bảo quản và chế biến hải sản.',
}

export default async function PostsPage() {
  const posts = await findDocs('posts', { limit: 100, sort: '-updatedAt' }, fallbackPosts)

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Cùng vào bếp</p>
        <h1>Mẹo chọn và chế biến hải sản</h1>
        <p>Nội dung SEO giúp khách hàng chọn đúng sản phẩm và đặt hàng tự tin hơn.</p>
      </section>
      <section className="page-section">
        <SectionHeader title="Bài viết mới" />
        {posts.length ? <PostGrid posts={posts} /> : <SearchEmpty title="Chưa có bài viết" />}
      </section>
    </>
  )
}
