'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const fallbackImages = [
  'https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=3136&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1553163147-622ab57be1c7?q=80&w=3270&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=3174&auto=format&fit=crop',
]

export function getMediaUrl(media: unknown, fallbackIndex = 0): string {
  const m = media as { url?: string } | null | undefined
  if (m && typeof m === 'object' && m.url) {
    return m.url
  }
  return fallbackImages[fallbackIndex % fallbackImages.length]
}

interface Banner {
  title?: string | null
  subtitle?: string | null
  image?: any
}

interface HeroSliderProps {
  banners: Banner[]
  settings: any
}

export function HeroSlider({ banners, settings }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!banners || banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners])

  if (!banners || banners.length === 0) return null

  const banner = banners[currentIndex]
  const imageUrl = getMediaUrl(banner?.image, 0)

  return (
    <section className="hero">
      <Image
        key={imageUrl} // Forces re-render/animation on image change if needed
        alt={banner?.title || 'Hải sản Long Phụng'}
        className="hero-image animate-fade-in"
        src={imageUrl}
        fill
        priority
        style={{ objectFit: 'cover' }}
      />
      <div className="hero-content">
        <p className="eyebrow">Tươi mỗi ngày · Giá rõ ràng · Giao nhanh</p>
        <h1>{banner?.title || 'Hải sản tươi cho bữa ăn gia đình và bếp nhà hàng'}</h1>
        <p>
          {banner?.subtitle ||
            'Long Phụng cập nhật sản phẩm và bảng giá mỗi ngày, ưu tiên đặt nhanh qua Zalo hoặc hotline.'}
        </p>
        <div className="hero-actions">
          <a className="button primary" href={settings.zaloUrl}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            Đặt qua Zalo
          </a>
          <a className="button secondary" href="/bang-gia">
            Xem bảng giá
          </a>
        </div>
        <div className="hero-dots">
          {banners.length > 1 &&
            banners.map((_, idx) => (
              <button
                key={idx}
                className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
        </div>
      </div>
    </section>
  )
}
