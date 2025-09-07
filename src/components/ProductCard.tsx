import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Product } from '../types/Product'

export function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const initialSrc = product.image || '/placeholder.svg'
  const [imgSrc, setImgSrc] = useState(initialSrc)

  return (
    <div className="card p-4 flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`Ver detalhes de ${product.name}`}
        title={`Ver detalhes de ${product.name}`}
        className="relative w-full h-48 mb-3 rounded overflow-hidden bg-slate-800"
      >
        <Image
          src={imgSrc}
          alt={product.imageAlt || product.name}
          fill
          className="object-cover"
          onError={() => setImgSrc('/placeholder.svg')}
        />
      </Link>
      <h3 className="font-semibold mb-1">
        <Link href={`/products/${product.slug}`} className="hover:text-cyan-400">
          {product.name}
        </Link>
      </h3>
  <p className="text-sm text-slate-400 overflow-hidden text-ellipsis mb-2">{product.description}</p>
      <div className="mt-auto flex items-center justify-between">
  <span className="text-cyan-400 font-semibold">{product.formattedPrice}</span>
  <button className="btn btn-secondary" onClick={() => onAdd(product)}>Adicionar</button>
      </div>
    </div>
  )
}
