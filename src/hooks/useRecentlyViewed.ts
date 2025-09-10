import { useEffect, useState } from 'react'
import type { Product } from '../types/Product'

const KEY = 'recently_viewed'

function read(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function recordView(slug: string) {
  if (typeof window === 'undefined') return
  const list = read().filter((s) => s !== slug)
  list.unshift(slug)
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)))
}

export default function useRecentlyViewed(products: Product[]) {
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    setSlugs(read())
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSlugs(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const map = new Map(products.map((p) => [p.slug, p]))
  const items = slugs.map((s) => map.get(s)).filter(Boolean) as Product[]

  return items
}
