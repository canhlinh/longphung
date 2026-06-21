'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import type {
  BoardCard,
  BoardData,
  BoardGroup,
  BoardVariant,
  PriceTier,
} from '@/lib/wholesale-board-data'

type GroupFilter = 'fav' | 'hot' | 'new' | number

type CartEntry = {
  name: string
  pco: number
  price: number
  qty: number
  unit: string
}

type WholesaleBoardProps = {
  data: BoardData
  siteHost: string
  zaloUrl: string
}

const AI_CHIPS: Array<[string, string]> = [
  ['🎉 Tiệc cưới', 'đồ hải sản cho tiệc cưới, đám tiệc nhiều mâm'],
  ['🦞 Nhà hàng hải sản', 'sản phẩm cho nhà hàng hải sản'],
  ['🍲 Lẩu / Nướng', 'đồ cho nồi lẩu và món nướng hải sản'],
  ['🍻 Quán nhậu', 'món hải sản nhậu được ưa chuộng'],
  ['🥢 Quán ăn / bún', 'đồ hải sản cho quán ăn, bún'],
  ['🛒 Bán lẻ chợ', 'hải sản bán lẻ phổ biến, đắt khách'],
]

const GREET_QUOTES = [
  'Chúc anh/chị một ngày buôn may bán đắt! 🐟',
  'Hàng tươi mỗi ngày — chúc cửa hàng mình hôm nay đông khách! 🌟',
  'Mỗi đơn hàng là một niềm tin, cảm ơn anh/chị rất nhiều! 💙',
  'Chúc anh/chị sức khỏe dồi dào & kinh doanh phát đạt! 🍀',
  'Cảm ơn anh/chị đã đồng hành — chúc một ngày thật nhiều năng lượng! ☀️',
  'Hải sản tươi ngon, giá tốt mỗi ngày dành riêng cho anh/chị! 🦐',
  'Chúc anh/chị một ngày làm ăn thuận lợi, tiền vào như nước! 💰',
]

function noAccent(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
}

function fmt(value: number): string {
  return `${(value || 0).toLocaleString('vi-VN')}đ`
}

function pickPrice(variant: { pco: number; price: number }): number {
  return variant.pco || variant.price || 0
}

function zaloNum(phone: string): string {
  return phone.replace(/[^\d+]/g, '').replace(/^\+?84/, '0')
}

function timeOfDayGreeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      hour12: false,
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date()),
  )
  if (hour < 11) return 'Chào buổi sáng'
  if (hour < 13) return 'Chào buổi trưa'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

function groupMeta(groups: BoardGroup[], id: number): BoardGroup {
  return groups.find((group) => group.id === id) || { id, name: '', icon: '📦', color: '#90a4ae', count: 0 }
}

function matchAiQuery(cards: BoardCard[], query: string): BoardCard[] {
  const tokens = noAccent(query)
    .split(/\s+/)
    .filter((token) => token.length > 1)

  if (!tokens.length) return cards.slice(0, 8)

  const scored = cards
    .map((card) => {
      const hay = noAccent(card.name)
      const score = tokens.reduce((sum, token) => (hay.includes(token) ? sum + 1 : sum), 0)
      return { card, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.length ? scored.map((entry) => entry.card).slice(0, 15) : cards.slice(0, 8)
}

export function WholesaleBoard({ data, siteHost, zaloUrl }: WholesaleBoardProps) {
  const { meta, groups, cards } = data
  const favKey = `lp_fav_${meta.customer_name}`

  const [query, setQuery] = useState('')
  const [curGroup, setCurGroup] = useState<GroupFilter>(0)
  const [cart, setCart] = useState<Record<string, CartEntry>>({})
  const [favs, setFavs] = useState<Set<string>>(new Set())
  const [variantIndex, setVariantIndex] = useState<Record<string, number>>({})
  const [sheet, setSheet] = useState<'ai' | 'cart' | 'guide' | 'zalo' | null>(null)
  const [showHomeBanner, setShowHomeBanner] = useState(false)
  const [aiAdvice, setAiAdvice] = useState<{ advice: string; names: string[] } | null>(null)
  const [aiQuery, setAiQuery] = useState('')
  const [zaloText, setZaloText] = useState('')
  const [copyLabel, setCopyLabel] = useState('📋 Sao chép')
  const [socialPop, setSocialPop] = useState<{ action: string; masked: string; name: string; image?: string; icon: string; color: string } | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(favKey)
      if (stored) setFavs(new Set(JSON.parse(stored) as string[]))
      if (!localStorage.getItem(`lp_home_${meta.customer_name}`)) setShowHomeBanner(true)
    } catch {
      // ignore
    }
  }, [favKey, meta.customer_name])

  useEffect(() => {
    document.body.classList.toggle('cart-on', Object.keys(cart).length > 0)
    return () => document.body.classList.remove('cart-on')
  }, [cart])

  useEffect(() => {
    if (!meta.popup || !cards.length) return

    const letters = 'ABCDHKLMNPQTV'.split('')
    const acts = [
      'vừa thêm vào danh sách lựa chọn',
      'vừa quan tâm sản phẩm',
      'đang xem báo giá',
      'vừa hỏi giá',
    ]

    const timers: ReturnType<typeof setTimeout>[] = []
    const show = () => {
      const card = cards[Math.floor(Math.random() * cards.length)]
      const group = groupMeta(groups, card.group_id)
      setSocialPop({
        action: acts[Math.floor(Math.random() * acts.length)],
        masked: `${letters[Math.floor(Math.random() * letters.length)]}****${letters[Math.floor(Math.random() * letters.length)].toLowerCase()}`,
        name: card.name,
        image: card.image,
        icon: group.icon,
        color: group.color,
      })
      timers.push(setTimeout(() => setSocialPop(null), 5000))
      timers.push(setTimeout(show, (5 + Math.random() * 295) * 1000))
    }

    timers.push(setTimeout(show, (8 + Math.random() * 12) * 1000))
    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [cards, groups, meta.popup])

  const filteredCards = useMemo(() => {
    const tokens = noAccent(query)
      .split(/\s+/)
      .filter(Boolean)

    let list = cards.filter((card) => {
      if (curGroup === 'new' && !card.isNew) return false
      if (curGroup === 'hot' && !card.dir) return false
      if (curGroup === 'fav' && !favs.has(card.name)) return false
      if (typeof curGroup === 'number' && curGroup > 0 && card.group_id !== curGroup) return false
      if (tokens.length) {
        const hay = noAccent(card.name)
        if (!tokens.every((token) => hay.includes(token))) return false
      }
      return true
    })

    if (curGroup === 'hot') {
      list = list.slice()
    }

    if (aiAdvice) {
      const used = new Set<string>()
      list = aiAdvice.names
        .map((name) => {
          const normalized = noAccent(name)
          let card = cards.find((item) => !used.has(item.key) && noAccent(item.name) === normalized)
          if (!card) {
            card = cards.find(
              (item) =>
                !used.has(item.key) &&
                (noAccent(item.name).includes(normalized) ||
                  (normalized.length > 4 && normalized.includes(noAccent(item.name)))),
            )
          }
          if (card) used.add(card.key)
          return card
        })
        .filter((card): card is BoardCard => Boolean(card))
    }

    return list
  }, [aiAdvice, cards, curGroup, favs, query])

  const cartStats = useMemo(() => {
    const entries = Object.values(cart)
    const count = entries.reduce((sum, item) => sum + item.qty, 0)
    const total = entries.reduce((sum, item) => sum + pickPrice(item) * item.qty, 0)
    return { count, total }
  }, [cart])

  const contactPhone = (meta.sale_phone || meta.boss_phone || '').replace(/[^\d+]/g, '')

  const buildCartText = useCallback(() => {
    const ids = Object.keys(cart)
    if (!ids.length) return ''

    let total = 0
    const lines = ids.map((key, index) => {
      const item = cart[key]
      const unitPrice = pickPrice(item)
      total += unitPrice * item.qty
      return `${index + 1}. ${item.name}${item.unit ? ` (${item.unit})` : ''} × ${item.qty}${unitPrice > 0 ? ` = ${fmt(unitPrice * item.qty)}` : ' (báo giá)'}`
    })

    return [
      `Xin chào, tôi quan tâm các sản phẩm sau từ ${meta.store_name}:`,
      lines.join('\n'),
      `Tạm tính: ${fmt(total)}`,
      'Vui lòng báo giá & tư vấn giúp tôi. Cảm ơn!',
    ].join('\n')
  }, [cart, meta.store_name])

  const greeting = useMemo(() => {
    const name = meta.customer_name
    if (!name) return null
    const tod = timeOfDayGreeting()
    const quote = GREET_QUOTES[Math.floor(Date.now() / 86400000) % GREET_QUOTES.length]
    return {
      crown: '👑 KHÁCH HÀNG THÂN THIẾT',
      hi: `${tod}, ${name}! 💙`,
      msg:
        meta.greeting ||
        `Cảm ơn anh/chị đã tin tưởng & đồng hành cùng ${meta.store_name}. ${quote}`,
    }
  }, [meta.customer_name, meta.greeting, meta.store_name])

  const favCount = cards.filter((card) => favs.has(card.name)).length
  const hotCount = meta.retail_only ? 0 : cards.filter((card) => card.dir).length
  const newCount = cards.filter((card) => card.isNew).length

  function getVariant(card: BoardCard): BoardVariant {
    const index = variantIndex[card.key] || 0
    return card.variants[index] || card.variants[0]
  }

  function setCardVariant(cardKey: string, index: number) {
    setVariantIndex((current) => ({ ...current, [cardKey]: index }))
  }

  function addToCart(card: BoardCard) {
    const variant = getVariant(card)
    setCart((current) => {
      const existing = current[variant.kv_id]
      if (existing) {
        return {
          ...current,
          [variant.kv_id]: { ...existing, qty: existing.qty + 1 },
        }
      }
      return {
        ...current,
        [variant.kv_id]: {
          name: card.name,
          unit: variant.unit,
          price: variant.price,
          pco: variant.pco,
          qty: 1,
        },
      }
    })
  }

  function updateCartQty(key: string, delta: number) {
    setCart((current) => {
      const item = current[key]
      if (!item) return current
      const qty = item.qty + delta
      if (qty <= 0) {
        const next = { ...current }
        delete next[key]
        return next
      }
      return { ...current, [key]: { ...item, qty } }
    })
  }

  function toggleFav(card: BoardCard) {
    setFavs((current) => {
      const next = new Set(current)
      if (next.has(card.name)) next.delete(card.name)
      else next.add(card.name)
      try {
        localStorage.setItem(favKey, JSON.stringify([...next]))
      } catch {
        // ignore
      }
      return next
    })
  }

  function doCall() {
    if (!contactPhone) {
      window.alert('Chưa có số điện thoại liên hệ. Vui lòng liên hệ nhân viên đã gửi bảng giá.')
      return
    }
    window.location.href = `tel:${contactPhone}`
  }

  function doZaloChat() {
    if (!contactPhone) {
      window.alert('Chưa có Zalo liên hệ. Vui lòng liên hệ nhân viên đã gửi bảng giá.')
      return
    }
    window.open(`https://zalo.me/${zaloNum(contactPhone)}`, '_blank', 'noopener,noreferrer')
  }

  async function doZaloShare() {
    const text = buildCartText()
    if (!text) return

    if (navigator.share) {
      try {
        await navigator.share({ text, title: meta.store_name || 'Bảng giá' })
        setSheet(null)
        return
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // ignore
    }

    setZaloText(text)
    setSheet('zalo')
  }

  async function copyZaloText() {
    try {
      await navigator.clipboard.writeText(zaloText)
      setCopyLabel('✓ Đã chép')
      window.setTimeout(() => setCopyLabel('📋 Sao chép'), 1500)
    } catch {
      // ignore
    }
  }

  function askAi(queryText: string) {
    const matched = matchAiQuery(cards, queryText)
    setAiAdvice({
      advice: `Gợi ý cho "${queryText}" — ${matched.length} món phù hợp:`,
      names: matched.map((card) => card.name),
    })
    setSheet(null)
    setCurGroup(0)
    setQuery('')
  }

  function renderPrice(variant: BoardVariant) {
    if (variant.prices?.length) {
      const rows = variant.prices
        .map((tier: PriceTier) => ({
          name: tier.name,
          value: pickPrice(tier),
        }))
        .filter((tier) => tier.value > 0)

      if (rows.length) {
        return (
          <div className="pb-list">
            {rows.map((tier) => (
              <div className="pb-row" key={tier.name}>
                <span className="pb-n">{tier.name}</span>
                <span className="pb-p">{fmt(tier.value)}</span>
              </div>
            ))}
          </div>
        )
      }
    }

    const value = pickPrice(variant)
    if (value > 0) {
      return (
        <>
          {fmt(value)}
          {variant.unit ? <small> /{variant.unit}</small> : null}
        </>
      )
    }
    return <span style={{ color: 'var(--muted)', fontWeight: 700 }}>Liên hệ giá</span>
  }

  function renderCard(card: BoardCard) {
    const group = groupMeta(groups, card.group_id)
    const variant = getVariant(card)
    const selectedIndex = variantIndex[card.key] || 0
    const inCart = card.variants.some((item) => cart[item.kv_id])
    const isFav = favs.has(card.name)

    return (
      <div className="card" key={card.key}>
        {card.isNew ? <span className="badge-new">🆕 Mới về</span> : null}
        {!meta.retail_only && card.dir === 'up' ? <span className="badge-dir badge-up">↑ Giá tăng</span> : null}
        {!meta.retail_only && card.dir === 'down' ? <span className="badge-dir badge-down">↓ Giá giảm</span> : null}
        {card.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={card.name} className="card-img" loading="lazy" src={card.image} />
        ) : (
          <div
            className="card-ph"
            style={{ background: `linear-gradient(135deg, ${group.color}, #1565c0)` }}
          >
            {group.icon}
          </div>
        )}
        <div className="card-b">
          <div className="card-name">{card.name}</div>
          {card.variants.length > 1 ? (
            <div className="var-row">
              {card.variants.map((item, index) => (
                <button
                  className={`var${index === selectedIndex ? ' on' : ''}`}
                  key={item.kv_id}
                  onClick={() => setCardVariant(card.key, index)}
                  type="button"
                >
                  {item.unit || '-'}
                </button>
              ))}
            </div>
          ) : null}
          <div className="price">{renderPrice(variant)}</div>
          <div className="card-foot">
            {meta.show_stock ? (
              variant.on_hand > 0 ? (
                <span className="stock ok">● Còn hàng</span>
              ) : (
                <span className="stock no">○ Hỏi NV</span>
              )
            ) : (
              <span />
            )}
            <span className="cf-right">
              <button
                className={`card-heart${isFav ? ' on' : ''}`}
                onClick={() => toggleFav(card)}
                title="Yêu thích"
                type="button"
              >
                {isFav ? '♥' : '♡'}
              </button>
              <button className={`add${inCart ? ' in' : ''}`} onClick={() => addToCart(card)} type="button">
                {inCart ? '✓' : '+'}
              </button>
            </span>
          </div>
        </div>
      </div>
    )
  }

  function renderContent() {
    if (!filteredCards.length) {
      return (
        <div className="empty">
          {curGroup === 'fav'
            ? 'Chưa có sản phẩm yêu thích.\nBấm ♡ trên sản phẩm để lưu vào đây nhé!'
            : 'Không tìm thấy sản phẩm phù hợp.'}
        </div>
      )
    }

    if (aiAdvice) {
      return (
        <>
          <div className="ai-result">
            <button className="ai-back" onClick={() => setAiAdvice(null)} type="button">
              ← Bỏ gợi ý, xem tất cả
            </button>
            <div className="ai-advice">✨ {aiAdvice.advice}</div>
          </div>
          <div className="grid">{filteredCards.map((card) => renderCard(card))}</div>
        </>
      )
    }

    if (!curGroup && !query) {
      return groups.map((group) => {
        const sectionCards = filteredCards.filter((card) => card.group_id === group.id)
        if (!sectionCards.length) return null
        return (
          <React.Fragment key={group.id}>
            <div className="sec-h">
              <span className="ic">{group.icon}</span>
              {group.name} <span className="ct">{sectionCards.length} loại</span>
            </div>
            <div className="grid">{sectionCards.map((card) => renderCard(card))}</div>
          </React.Fragment>
        )
      })
    }

    return <div className="grid">{filteredCards.map((card) => renderCard(card))}</div>
  }

  return (
    <>
      <div className="hdr">
        <div className="hdr-top">
          <span className="hdr-logo">🦐</span>
          <span className="hdr-store">{meta.store_name}</span>
          {meta.tier_name ? <span className="tier-badge">{meta.tier_name}</span> : null}
          <button className="bell-btn" onClick={() => setSheet('guide')} title="Bật thông báo giá" type="button">
            🔔
          </button>
        </div>
        <div className="hdr-sub">
          {meta.sale_name ? (
            <span className="cc-line">
              <b>🧑‍💼 Sales phụ trách:</b> {meta.sale_name}
              {meta.sale_phone ? (
                <>
                  <a className="cc-chip cc-call" href={`tel:${contactPhone}`}>
                    📞 {meta.sale_phone}
                  </a>
                  <a
                    className="cc-chip cc-zalo"
                    href={`https://zalo.me/${zaloNum(meta.sale_phone)}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    💬 Zalo
                  </a>
                </>
              ) : null}
            </span>
          ) : null}
          {meta.customer_name ? (
            <span className="cc-line">
              <b>🛍️ K/H:</b> {meta.customer_name}
            </span>
          ) : null}
          {meta.boss_name && meta.boss_phone ? (
            <span className="cc-line">
              <b>☎ Số Dự Phòng/Phản ánh:</b>{' '}
              <a className="cc-chip cc-boss" href={`tel:${meta.boss_phone.replace(/\s/g, '')}`}>
                {meta.boss_phone}
              </a>
            </span>
          ) : null}
        </div>
      </div>

      {greeting ? (
        <div className="greet on">
          <div className="crown">{greeting.crown}</div>
          <div className="hi">{greeting.hi}</div>
          <div className="msg">{greeting.msg}</div>
        </div>
      ) : null}

      <div className={`home-banner${showHomeBanner ? ' on' : ''}`}>
        <div style={{ fontSize: 24, flex: '0 0 auto' }}>📲</div>
        <div style={{ flex: 1, fontSize: '12.5px', color: '#1d4e89', lineHeight: 1.4 }}>
          <b>Lưu bảng giá về màn hình chính</b>
          <br />
          Xem giá mỗi ngày & nhận báo giá mới đầu tiên.
        </div>
        <button
          onClick={() => setSheet('guide')}
          style={{
            background: '#1565c0',
            border: 'none',
            borderRadius: 10,
            color: '#fff',
            cursor: 'pointer',
            flex: '0 0 auto',
            fontSize: 13,
            fontWeight: 700,
            padding: '8px 12px',
          }}
          type="button"
        >
          Lưu ngay
        </button>
        <button
          onClick={() => {
            setShowHomeBanner(false)
            try {
              localStorage.setItem(`lp_home_${meta.customer_name}`, '1')
            } catch {
              // ignore
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#5b7da5',
            cursor: 'pointer',
            flex: '0 0 auto',
            fontSize: 20,
            lineHeight: 1,
            padding: '0 2px',
          }}
          type="button"
        >
          ×
        </button>
      </div>

      {meta.promo_text ? <div className="promo-banner">{meta.promo_text}</div> : null}

      <div className="ai-btn-wrap">
        <button className="ai-btn" onClick={() => setSheet('ai')} type="button">
          ✨ Trợ lý chọn hàng theo nhu cầu
        </button>
      </div>

      <div className="searchwrap">
        <div className="searchbox">
          <span className="si">🔍</span>
          <input
            onChange={(event) => {
              setAiAdvice(null)
              setQuery(event.target.value)
            }}
            placeholder="Tìm sản phẩm (gõ không dấu cũng được)…"
            type="search"
            value={query}
          />
          <button
            className={`clr${query ? ' on' : ''}`}
            onClick={() => {
              setQuery('')
              setAiAdvice(null)
            }}
            type="button"
          >
            ×
          </button>
        </div>
        <div className="chips">
          <button className={`chip${curGroup === 0 ? ' on' : ''}`} onClick={() => setCurGroup(0)} type="button">
            <span className="ic">🛒</span>Tất cả <span className="ct">{cards.length}</span>
          </button>
          <button
            className={`chip chip-fav${curGroup === 'fav' ? ' on' : ''}`}
            onClick={() => setCurGroup('fav')}
            type="button"
          >
            <span className="ic">❤️</span>Yêu thích <span className="ct">{favCount}</span>
          </button>
          {hotCount ? (
            <button
              className={`chip neon-chip${curGroup === 'hot' ? ' on' : ''}`}
              onClick={() => setCurGroup('hot')}
              type="button"
            >
              <span className="ic">💲</span>Vừa đổi giá <span className="ct">{hotCount}</span>
            </button>
          ) : null}
          {newCount ? (
            <button
              className={`chip chip-new${curGroup === 'new' ? ' on' : ''}`}
              onClick={() => setCurGroup('new')}
              type="button"
            >
              <span className="ic">🆕</span>Mới về <span className="ct">{newCount}</span>
            </button>
          ) : null}
          {groups.map((group) => (
            <button
              className={`chip${curGroup === group.id ? ' on' : ''}`}
              key={group.id}
              onClick={() => setCurGroup(group.id)}
              type="button"
            >
              <span className="ic">{group.icon}</span>
              {group.name} <span className="ct">{group.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="wrap">{renderContent()}</div>

      <div className={`botbar${Object.keys(cart).length ? ' on' : ''}`}>
        <div className="bb-info">
          <div className="t1">{cartStats.count} sản phẩm quan tâm</div>
          <div className="t2">{fmt(cartStats.total)}</div>
        </div>
        <button className="btn btn-call" onClick={doCall} type="button">
          📞 Gọi
        </button>
        <button className="btn btn-zalo" onClick={() => setSheet('cart')} type="button">
          🛒 Danh sách
        </button>
      </div>

      <div className={`ov${sheet ? ' on' : ''}`} onClick={() => setSheet(null)} role="presentation" />
      <div className={`sheet${sheet === 'cart' ? ' on' : ''}`} onClick={(event) => event.stopPropagation()}>
        <div className="sheet-h">
          <b>Danh sách quan tâm</b>
          <button className="x" onClick={() => setSheet(null)} type="button">
            ×
          </button>
        </div>
        <div className="sheet-b">
          {Object.entries(cart).map(([key, item]) => (
            <div className="it" key={key}>
              <div className="it-n">
                <div className="n1">
                  {item.name}
                  {item.unit ? ` · ${item.unit}` : ''}
                </div>
                <div className="n2">{pickPrice(item) > 0 ? fmt(pickPrice(item)) : 'Liên hệ'}</div>
              </div>
              <div className="qty">
                <button onClick={() => updateCartQty(key, -1)} type="button">
                  −
                </button>
                <span>{item.qty}</span>
                <button onClick={() => updateCartQty(key, 1)} type="button">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="note-card">
          💡 Gửi danh sách này cho nhân viên để được báo giá & chốt đơn nhanh nhất.
        </div>
        <div className="sheet-f">
          <button className="btn btn-call" onClick={doCall} type="button">
            📞 Gọi
          </button>
          <button className="btn btn-zalo" onClick={doZaloChat} style={{ background: '#e8f1ff', color: '#1565c0' }} type="button">
            💬 Zalo
          </button>
          <button className="btn btn-zalo" onClick={doZaloShare} type="button">
            📤 Gửi DS
          </button>
        </div>
      </div>

      <div className={`sheet${sheet === 'zalo' ? ' on' : ''}`} onClick={(event) => event.stopPropagation()}>
        <div className="sheet-h">
          <b>Gửi danh sách qua Zalo</b>
          <button className="x" onClick={() => setSheet(null)} type="button">
            ×
          </button>
        </div>
        <div className="sheet-b">
          <div style={{ color: 'var(--muted)', fontSize: '12.5px', marginBottom: 6 }}>
            Đã sao chép sẵn nội dung. Bấm <b>&quot;Mở Zalo&quot;</b> → DÁN (Paste) vào khung chat gửi nhân viên nhé.
          </div>
          <textarea className="z-txt" readOnly value={zaloText} />
        </div>
        <div className="sheet-f">
          <button className="btn btn-call" onClick={copyZaloText} type="button">
            {copyLabel}
          </button>
          <a
            className="btn btn-zalo"
            href={contactPhone ? `https://zalo.me/${zaloNum(contactPhone)}` : zaloUrl}
            rel="noopener noreferrer"
            style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
            target="_blank"
          >
            💬 Mở Zalo
          </a>
        </div>
      </div>

      <div className={`sheet${sheet === 'guide' ? ' on' : ''}`} onClick={(event) => event.stopPropagation()}>
        <div className="sheet-h">
          <b>🔔 Nhận thông báo khi giá Yêu thích đổi</b>
          <button className="x" onClick={() => setSheet(null)} type="button">
            ×
          </button>
        </div>
        <div className="sheet-b">
          <div className="g-intro">
            Để nhận thông báo khi sản phẩm <b>❤️ Yêu thích</b> của bạn đổi giá, hãy thêm bảng giá vào{' '}
            <b>Màn hình chính</b> (chỉ làm 1 lần, ~20 giây). Làm theo <b>4 bước</b>:
          </div>
          <div className="g-step">
            <div className="g-ic">⋯</div>
            <div className="g-tx">
              <span className="g-n">1</span> Bấm nút <b>⋯</b> ở <b>góc phải đường link</b> (trên cùng):
              <div className="g-urlbar">
                {siteHost} <span style={{ opacity: 0.6 }}>⟳</span> <span className="g-dots">⋯</span>
              </div>
            </div>
          </div>
          <div className="g-step">
            <div className="g-ic">↗</div>
            <div className="g-tx">
              <span className="g-n">2</span> Chọn <b>Chia sẻ</b>.
            </div>
          </div>
          <div className="g-step">
            <div className="g-ic">⌄</div>
            <div className="g-tx">
              <span className="g-n">3</span> Kéo xuống, chọn <b>Xem thêm</b>.
            </div>
          </div>
          <div className="g-step">
            <div className="g-ic">＋</div>
            <div className="g-tx">
              <span className="g-n">4</span> Chọn dòng:
              <div className="g-iosrow">Thêm vào Màn hình chính</div>
            </div>
          </div>
          <div className="g-done">
            <div className="g-appicon" style={{ alignItems: 'center', background: '#0ea5b8', color: '#fff', display: 'flex', fontSize: 24, justifyContent: 'center' }}>
              🦐
            </div>
            <div>
              <b>Xong! 🎉</b>
              <br />
              Mở bảng giá từ icon <b>&quot;Bảng Giá&quot;</b> vừa hiện trên màn hình → bấm chuông <b>🔔</b> để{' '}
              <b>Bật thông báo</b>.
            </div>
          </div>
          <div className="g-note">
            📌 iPhone dùng <b>Safari</b>, Android dùng <b>Chrome</b>.
          </div>
        </div>
        <div className="sheet-f">
          <button className="btn btn-zalo" onClick={() => setSheet(null)} style={{ flex: 1 }} type="button">
            Đã hiểu 👍
          </button>
        </div>
      </div>

      <div className={`sheet${sheet === 'ai' ? ' on' : ''}`} onClick={(event) => event.stopPropagation()}>
        <div className="sheet-h">
          <b>✨ Trợ lý chọn hàng</b>
          <button className="x" onClick={() => setSheet(null)} type="button">
            ×
          </button>
        </div>
        <div className="sheet-b">
          <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 10 }}>
            Bạn kinh doanh gì / cần mua gì? Chọn nhóm ngành gợi ý hoặc gõ câu hỏi:
          </div>
          <div className="ai-combos">
            {AI_CHIPS.map(([label, queryText]) => {
              const parts = label.split(' ')
              const emoji = parts[0]
              const text = parts.slice(1).join(' ') || label
              return (
                <button className="ai-combo" key={label} onClick={() => askAi(queryText)} type="button">
                  <div className="img">
                    <span>{emoji}</span>
                  </div>
                  <div className="ci">
                    <div className="cn">{text}</div>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="searchbox" style={{ marginTop: 12 }}>
            <span className="si">💬</span>
            <input
              onChange={(event) => setAiQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') askAi(aiQuery)
              }}
              placeholder="VD: đám cưới 50 mâm, quán lẩu hải sản…"
              value={aiQuery}
            />
          </div>
        </div>
        <div className="sheet-f">
          <button className="btn btn-zalo" onClick={() => askAi(aiQuery)} style={{ flex: 1 }} type="button">
            ✨ Hỏi trợ lý
          </button>
        </div>
      </div>

      {socialPop ? (
        <div className="sp-pop on">
          {socialPop.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" src={socialPop.image} />
          ) : (
            <div
              className="sp-ph"
              style={{ background: `linear-gradient(135deg, ${socialPop.color}, #1565c0)` }}
            >
              {socialPop.icon}
            </div>
          )}
          <div className="sp-t">
            🛒 Khách <b style={{ color: 'var(--accent)' }}>{socialPop.masked}</b> {socialPop.action}:<br />
            <b style={{ color: 'var(--ink)' }}>{socialPop.name}</b>
          </div>
        </div>
      ) : null}
    </>
  )
}