import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Product } from '../types/Product'

export function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const initialSrc = product.image || '/placeholder.svg'
  const [imgSrc, setImgSrc] = useState(initialSrc)
  const router = useRouter()

  const handleMouseEnter = () => {
    // Force an eager prefetch of the product detail route and its data when possible
    router.prefetch(`/products/${product.slug}`, undefined, { priority: true }).catch(() => {})
  }
  const handleFocus = handleMouseEnter

  return (
    <div className="card p-4 flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`Ver detalhes de ${product.name}`}
        title={`Ver detalhes de ${product.name}`}
        className="relative w-full h-48 mb-3 rounded overflow-hidden bg-slate-800"
        onMouseEnter={handleMouseEnter}
        onFocus={handleFocus}
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
  <Link href={`/products/${product.slug}`} className="hover:text-cyan-400" onMouseEnter={handleMouseEnter} onFocus={handleFocus}>
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
