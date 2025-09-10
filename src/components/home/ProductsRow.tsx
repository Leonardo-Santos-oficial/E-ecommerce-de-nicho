import { useEffect, useRef, useState } from 'react'
import { Product } from '../../types/Product'
import { ProductCard } from '@/components/ProductCard'

type Props = { products: Product[]; onAdd: (p: Product) => void }

export default function ProductsRow({ products, onAdd }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateNav = () => {
    const el = scrollerRef.current
    if (!el) return
    const { scrollLeft, clientWidth, scrollWidth } = el
    setCanPrev(scrollLeft > 0)
    setCanNext(scrollLeft + clientWidth < scrollWidth - 1)
  }

  useEffect(() => {
    updateNav()
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => updateNav()
    el.addEventListener('scroll', onScroll, { passive: true })
    const onResize = () => updateNav()
    window.addEventListener('resize', onResize)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [products.length])

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.9)
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* left gradient */}
      {canPrev && (
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-slate-950 to-transparent" />
      )}
      {canNext && (
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-slate-950 to-transparent" />
      )}

      <div
        ref={scrollerRef}
        className="overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollbarWidth: 'none' }}
        aria-label="Lista de produtos rolável"
      >
        <div className="grid grid-flow-col auto-cols-[75%] sm:auto-cols-[50%] md:auto-cols-[33%] lg:auto-cols-[25%] gap-4 snap-x snap-mandatory">
          {products.map((p) => (
            <div key={p.id} className="snap-start">
              <ProductCard product={p} onAdd={onAdd} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          type="button"
          onClick={() => scrollByAmount('left')}
          aria-label="Ver produtos anteriores"
          className={`m-1 rounded-full border border-slate-700 bg-slate-900/70 w-9 h-9 grid place-items-center hover:border-cyan-500 ${canPrev ? '' : 'opacity-30 cursor-not-allowed'}`}
          disabled={!canPrev}
        >
          ‹
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          type="button"
          onClick={() => scrollByAmount('right')}
          aria-label="Ver próximos produtos"
          className={`m-1 rounded-full border border-slate-700 bg-slate-900/70 w-9 h-9 grid place-items-center hover:border-cyan-500 ${canNext ? '' : 'opacity-30 cursor-not-allowed'}`}
          disabled={!canNext}
        >
          ›
        </button>
      </div>
    </div>
  )
}
