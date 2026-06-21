import {
  Clock,
  Fish,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Snowflake,
  Truck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import {
  createZaloUrl,
  formatPrice,
  getMediaUrl,
  getProductImage,
  stockLabel,
} from '@/lib/storefront'

// Using any for props to accommodate mixed DB docs + fallback shapes (full payload-types adoption recommended in future)
type PropsWithSettings = {
  settings: any
}

export function Header({ categories, settings }: PropsWithSettings & { categories: any[] }) {
  return (
    <header className="site-header">
      <div className="topbar">
        <span>
          <Phone size={15} /> {settings.hotline}
        </span>
        <span>
          <Clock size={15} /> {settings.businessHours}
        </span>
      </div>
      <div className="nav-shell">
        <Link className="brand" href="/">
          <span className="brand-mark">LP</span>
          <span>
            <strong>{settings.brandName}</strong>
            <small>{settings.tagline}</small>
          </span>
        </Link>
        <nav className="main-nav">
          <Link href="/bang-gia">Bang gia</Link>
          {categories.slice(0, 4).map((category) => (
            <Link href={`/danh-muc/${category.slug}`} key={category.id}>
              {category.name}
            </Link>
          ))}
          <Link href="/bai-viet">Mon ngon</Link>
          <Link href="/lien-he">Lien he</Link>
        </nav>
        <a className="nav-cta" href={settings.zaloUrl}>
          <MessageCircle size={18} /> Zalo
        </a>
      </div>
    </header>
  )
}

export function Footer({ categories, settings }: PropsWithSettings & { categories: any[] }) {
  return (
    <footer className="site-footer">
      <div>
        <Link className="brand footer-brand" href="/">
          <span className="brand-mark">LP</span>
          <span>
            <strong>{settings.brandName}</strong>
            <small>{settings.tagline}</small>
          </span>
        </Link>
        <p>{settings.address}</p>
      </div>
      <div>
        <h3>Danh muc</h3>
        {categories.slice(0, 5).map((category) => (
          <Link href={`/danh-muc/${category.slug}`} key={category.id}>
            {category.name}
          </Link>
        ))}
      </div>
      <div>
        <h3>Dat hang</h3>
        <a href={`tel:${settings.hotline.replace(/\s/g, '')}`}>{settings.hotline}</a>
        <a href={settings.zaloUrl}>Chat Zalo</a>
        <Link href="/bang-gia">Xem bang gia hom nay</Link>
      </div>
    </footer>
  )
}

export function Hero({ banner, settings }: PropsWithSettings & { banner?: any }) {
  const imageUrl = getMediaUrl(banner?.image, 0)

  return (
    <section className="hero">
      <Image
        alt={banner?.title || 'Hai san Long Phung'}
        className="hero-image"
        src={imageUrl}
        width={1200}
        height={630}
        priority
      />
      <div className="hero-content">
        <p className="eyebrow">Tuoi moi ngay · Gia ro rang · Giao nhanh</p>
        <h1>{banner?.title || 'Hai san tuoi cho bua an gia dinh va bep nha hang'}</h1>
        <p>
          {banner?.subtitle ||
            'Long Phung cap nhat san pham va bang gia moi ngay, uu tien dat nhanh qua Zalo hoac hotline.'}
        </p>
        <div className="hero-actions">
          <a className="button primary" href={settings.zaloUrl}>
            <MessageCircle size={18} /> Dat qua Zalo
          </a>
          <Link className="button secondary" href="/bang-gia">
            Xem bang gia
          </Link>
        </div>
      </div>
    </section>
  )
}

export function Commitments() {
  const items = [
    { icon: Fish, title: 'Hang tuoi moi ngay', text: 'Lua chon theo mua va tinh trang hang that.' },
    { icon: Snowflake, title: 'Giu lanh dung cach', text: 'Dong goi phu hop cho giao nhanh trong ngay.' },
    { icon: Truck, title: 'Giao nhanh', text: 'Toi uu cho don gia dinh, quan an va nha hang.' },
    { icon: ShieldCheck, title: 'Gia minh bach', text: 'Bang gia cap nhat, co gia si cho don phu hop.' },
  ]

  return (
    <section className="commitments" aria-label="Cam ket dich vu">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <article key={item.title}>
            <Icon size={24} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        )
      })}
    </section>
  )
}

export function SectionHeader({
  actionHref,
  actionLabel,
  eyebrow,
  title,
}: {
  actionHref?: string
  actionLabel?: string
  eyebrow?: string
  title: string
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {actionHref && actionLabel && <Link href={actionHref}>{actionLabel}</Link>}
    </div>
  )
}

export function CategoryGrid({ categories }: { categories: any[] }) {
  return (
    <div className="category-grid">
      {categories.map((category, index) => (
        <Link className="category-card" href={`/danh-muc/${category.slug}`} key={category.id}>
          <Image alt={String(category.name)} src={getMediaUrl(category.image, index)} width={400} height={300} />
          <span>{category.name}</span>
          <p>{category.description}</p>
        </Link>
      ))}
    </div>
  )
}

export function ProductGrid({ products, settings }: PropsWithSettings & { products: any[] }) {
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} settings={settings} index={index} />
      ))}
    </div>
  )
}

export function ProductCard({
  index,
  product,
  settings,
}: PropsWithSettings & { index: number; product: any }) {
  const message = `Toi muon hoi ve ${product.name} (${product.slug})`

  return (
    <article className="product-card">
      <Link className="product-image" href={`/san-pham/${product.slug}`}>
        <Image alt={String(product.name)} src={getProductImage(product, index)} width={400} height={300} />
        <span>{stockLabel(product.stockStatus)}</span>
      </Link>
      <div className="product-body">
        <Link href={`/san-pham/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.shortDescription}</p>
        <div className="product-meta">
          <strong>{formatPrice(product.retailPrice, product.priceLabel)}</strong>
          <span>/{product.unit}</span>
        </div>
        <div className="card-actions">
          <a href={createZaloUrl(settings.zaloUrl, message)}>
            <MessageCircle size={16} /> Zalo
          </a>
          <a href={`tel:${settings.hotline.replace(/\s/g, '')}`}>
            <Phone size={16} /> Goi
          </a>
        </div>
      </div>
    </article>
  )
}

export function PriceTable({ prices, settings }: PropsWithSettings & { prices: any[] }) {
  return (
    <div className="price-table">
      <div className="price-row price-head">
        <span>San pham</span>
        <span>Gia le</span>
        <span>Gia si</span>
        <span>Dat hang</span>
      </div>
      {prices.map((item) => {
        const product = typeof item.product === 'object' ? item.product : null
        const slug = product?.slug || item.displayName
        const message = `Toi muon hoi bang gia ${item.displayName}`

        return (
          <div className="price-row" key={item.id}>
            <span>
              <strong>{item.displayName}</strong>
              <small>
                /{item.unit} {item.note ? `· ${item.note}` : ''}
              </small>
            </span>
            <span>{formatPrice(item.price)}</span>
            <span>{formatPrice(item.wholesalePrice)}</span>
            <span className="row-actions">
              {product && <Link href={`/san-pham/${slug}`}>Chi tiet</Link>}
              <a href={createZaloUrl(settings.zaloUrl, message)}>Zalo</a>
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function PostGrid({ posts }: { posts: any[] }) {
  return (
    <div className="post-grid">
      {posts.map((post, index) => (
        <Link className="post-card" href={`/bai-viet/${post.slug}`} key={post.id}>
          <Image alt={String(post.title)} src={getMediaUrl(post.coverImage, index + 1)} width={400} height={240} />
          <span>Vao bep</span>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
        </Link>
      ))}
    </div>
  )
}

export function SearchEmpty({ title }: { title: string }) {
  return (
    <div className="empty-state">
      <Search size={30} />
      <h2>{title}</h2>
      <p>Noi dung se hien thi sau khi admin xuat ban trong Payload.</p>
    </div>
  )
}

export function ContactBand({ settings }: PropsWithSettings) {
  return (
    <section className="contact-band">
      <div>
        <p className="eyebrow">Can bao gia nhanh?</p>
        <h2>Gui danh sach mon qua Zalo, Long Phung se phan hoi trong ngay.</h2>
      </div>
      <div className="contact-actions">
        <a className="button primary" href={settings.zaloUrl}>
          <MessageCircle size={18} /> Chat Zalo
        </a>
        <a className="button secondary" href={`tel:${settings.hotline.replace(/\s/g, '')}`}>
          <Phone size={18} /> {settings.hotline}
        </a>
      </div>
    </section>
  )
}

export function AddressBlock({ settings }: PropsWithSettings) {
  return (
    <div className="address-block">
      <MapPin size={22} />
      <div>
        <strong>{settings.address}</strong>
        <span>{settings.businessHours}</span>
      </div>
    </div>
  )
}
