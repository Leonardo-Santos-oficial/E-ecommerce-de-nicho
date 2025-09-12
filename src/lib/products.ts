import fs from 'fs'
import path from 'path'
import { RawProductsArraySchema } from '@/types/schemas'

export interface LoadedProductRaw {
  id?: string | number
  slug: string
  name: string
  description: string
  price: number | string
  image?: string
  imageAlt?: string
  images?: string[]
  category?: string
  [key: string]: any
}

export function loadProducts(): LoadedProductRaw[] {
  const dataFile = path.join(process.cwd(), 'data', 'products.json')
  if (!fs.existsSync(dataFile)) return []
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8')
    const parsed = RawProductsArraySchema.safeParse(JSON.parse(raw))
    if (!parsed.success) return []
    return parsed.data as LoadedProductRaw[]
  } catch {
    return []
  }
}
