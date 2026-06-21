'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

export function SearchForm({ initialSearch = '' }: { initialSearch?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialSearch)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    params.delete('page') // reset page to 1 on search
    router.push(`/bang-gia?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="search-form"
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        maxWidth: '500px',
      }}
    >
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        style={{
          padding: '10px 16px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          flex: 1,
          fontSize: '16px',
        }}
      />
      <button
        type="submit"
        className="button primary"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Search size={18} /> Tìm
      </button>
    </form>
  )
}
