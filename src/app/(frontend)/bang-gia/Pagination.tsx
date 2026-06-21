import Link from 'next/link'
import React from 'react'

export function Pagination({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  query,
}: {
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  query: string
}) {
  if (totalPages <= 1) return null

  const getHref = (p: number) => {
    const params = new URLSearchParams()
    if (p > 1) params.set('page', p.toString())
    if (query) params.set('q', query)
    return `/bang-gia?${params.toString()}`
  }

  return (
    <div
      className="pagination"
      style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '32px',
      }}
    >
      {hasPrevPage ? (
        <Link href={getHref(page - 1)} className="button secondary">
          Trang trước
        </Link>
      ) : (
        <span
          className="button secondary"
          style={{ opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }}
        >
          Trang trước
        </span>
      )}

      <span style={{ fontWeight: 500 }}>
        Trang {page} / {totalPages}
      </span>

      {hasNextPage ? (
        <Link href={getHref(page + 1)} className="button secondary">
          Trang sau
        </Link>
      ) : (
        <span
          className="button secondary"
          style={{ opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }}
        >
          Trang sau
        </span>
      )}
    </div>
  )
}
