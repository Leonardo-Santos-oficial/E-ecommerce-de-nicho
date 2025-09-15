import React from 'react'
import { Product } from '../../types/Product'
import { ProductCard } from '../ProductCard'

type Props = {
  products: Product[]
  onAdd: (p: Product) => void
}

export default function RelatedProducts({ products, onAdd }: Props) {
  if (!products?.length) return null
  return (
    <section className="mt-12">
      <h3 className="font-semibold mb-4">Produtos Relacionados</h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </div>
    </section>
  )
}
