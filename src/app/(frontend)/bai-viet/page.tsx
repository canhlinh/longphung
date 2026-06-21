import type { Metadata } from 'next'
import React from 'react'

import { PostGrid, SearchEmpty, SectionHeader } from '../components'
import { fallbackPosts, findDocs } from '@/lib/storefront'

export const metadata: Metadata = {
  title: 'Mon ngon va meo chon hai san | Long Phung Seafood',
  description: 'Bai viet huong dan chon, bao quan va che bien hai san.',
}

export default async function PostsPage() {
  const posts = await findDocs('posts', { limit: 100, sort: '-updatedAt' }, fallbackPosts)

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Cung vao bep</p>
        <h1>Meo chon va che bien hai san</h1>
        <p>Noi dung SEO giup khach hang chon dung san pham va dat hang tu tin hon.</p>
      </section>
      <section className="page-section">
        <SectionHeader title="Bai viet moi" />
        {posts.length ? <PostGrid posts={posts} /> : <SearchEmpty title="Chua co bai viet" />}
      </section>
    </>
  )
}
