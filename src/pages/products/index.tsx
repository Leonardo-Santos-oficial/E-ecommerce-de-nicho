import fs from 'fs'
import path from 'path'
import { GetStaticProps } from 'next'
import { RawProductsArraySchema } from '@/types/schemas'
import { Product } from '../../types/Product'
import { formatCurrency } from '../../utils/format'
import { ProductCard } from '../../components/ProductCard'
import { useCart } from '../../hooks/useCart'
import Head from 'next/head'
import { absoluteUrl } from '../../utils/seo'
import { useMemo, useState } from 'react'

export default function ProductsPage({ products }: { products: Product[] }) {
  const { addItem } = useCart()
  const [category, setCategory] = useState<string>('all')
  const [maxPrice, setMaxPrice] = useState<number>(0)

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  )
  const computedMax = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.price))),
    [products]
  )
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const byCat = category === 'all' || p.category === category
      const byPrice = maxPrice === 0 || p.price <= maxPrice
      return byCat && byPrice
    })
  }, [products, category, maxPrice])

  return (
    <>
      <Head>
        <title>Produtos | DevWear</title>
        <meta name="description" content="Catálogo completo de produtos DevWear." />
        <link rel="canonical" href={absoluteUrl('/products')} />
      </Head>
      <h1 className="mb-6">Produtos</h1>

      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-end">
        <div>
          <label className="block text-sm text-white mb-1">Categoria</label>
          <select
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'Todas' : c}
              </option>
            ))}
          </select>
        </div>
        <div className="md:ml-4">
          <label className="block text-sm text-white mb-1">
            Preço máximo {maxPrice > 0 ? `(${maxPrice.toFixed(0)})` : ''}
          </label>
          <input
            type="range"
            min={0}
            max={computedMax}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <button
          className="btn btn-outline md:ml-auto"
          onClick={() => {
            setCategory('all')
            setMaxPrice(0)
          }}
        >
          Limpar filtros
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addItem} />
        ))}
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const dataFile = path.join(process.cwd(), 'data', 'products.json')
  const raw = fs.readFileSync(dataFile, 'utf-8')
  const parsed = RawProductsArraySchema.safeParse(JSON.parse(raw))
  const products = (parsed.success ? parsed.data : []).map((p) => ({
    id: String(p.id ?? p.slug),
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: Number(p.price) || 0,
    formattedPrice: formatCurrency(Number(p.price) || 0),
    image: p.image || '/placeholder.svg',
    ...(p.imageAlt ? { imageAlt: p.imageAlt } : {}),
    category: p.category || 'geral',
  }))

  return { props: { products }, revalidate: 3600 }
}
