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
          <Link href="/bang-gia">Bảng giá</Link>
          {categories.slice(0, 4).map((category) => (
            <Link href={`/danh-muc/${category.slug}`} key={category.id}>
              {category.name}
            </Link>
          ))}
          <Link href="/bai-viet">Món ngon</Link>
          <Link href="/lien-he">Liên hệ</Link>
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
        <h3>Danh mục</h3>
        {categories.slice(0, 5).map((category) => (
          <Link href={`/danh-muc/${category.slug}`} key={category.id}>
            {category.name}
          </Link>
        ))}
      </div>
      <div>
        <h3>Đặt hàng</h3>
        <a href={`tel:${settings.hotline.replace(/\s/g, '')}`}>{settings.hotline}</a>
        <a href={settings.zaloUrl}>Chat Zalo</a>
        <Link href="/bang-gia">Xem bảng giá hôm nay</Link>
      </div>
    </footer>
  )
}

export function Hero({ banner, settings }: PropsWithSettings & { banner?: any }) {
  const imageUrl = getMediaUrl(banner?.image, 0)

  return (
    <section className="hero">
      <Image
        alt={banner?.title || 'Hải sản Long Phụng'}
        className="hero-image"
        src={imageUrl}
        width={1200}
        height={630}
        priority
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
            <MessageCircle size={18} /> Đặt qua Zalo
          </a>
          <Link className="button secondary" href="/bang-gia">
            Xem bảng giá
          </Link>
        </div>
      </div>
    </section>
  )
}

export function Commitments() {
  const items = [
    { icon: Fish, title: 'Hàng tươi mỗi ngày', text: 'Lựa chọn theo mùa và tình trạng hàng thật.' },
    { icon: Snowflake, title: 'Giữ lạnh đúng cách', text: 'Đóng gói phù hợp cho giao nhanh trong ngày.' },
    { icon: Truck, title: 'Giao nhanh', text: 'Tối ưu cho đơn gia đình, quán ăn và nhà hàng.' },
    { icon: ShieldCheck, title: 'Giá minh bạch', text: 'Bảng giá cập nhật, có giá sỉ cho đơn phù hợp.' },
  ]

  return (
    <section className="commitments" aria-label="Cam kết dịch vụ">
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
  const message = `Tôi muốn hỏi về ${product.name} (${product.slug})`

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
            <Phone size={16} /> Gọi
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
        <span>Sản phẩm</span>
        <span>Giá lẻ</span>
        <span>Giá sỉ</span>
        <span>Đặt hàng</span>
      </div>
      {prices.map((item) => {
        const product = typeof item.product === 'object' ? item.product : null
        const slug = product?.slug || item.displayName
        const message = `Tôi muốn hỏi bảng giá ${item.displayName}`

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
              {product && <Link href={`/san-pham/${slug}`}>Chi tiết</Link>}
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
          <span>Vào bếp</span>
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
      <p>Nội dung sẽ hiển thị sau khi admin xuất bản trong Payload.</p>
    </div>
  )
}

export function ContactBand({ settings }: PropsWithSettings) {
  return (
    <section className="contact-band">
      <div>
        <p className="eyebrow">Cần báo giá nhanh?</p>
        <h2>Gửi danh sách món qua Zalo, Long Phụng sẽ phản hồi trong ngày.</h2>
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
