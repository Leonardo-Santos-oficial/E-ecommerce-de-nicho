import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Slide = {
  id: string
  image: string
  alt: string
  href: string
  headline: string
  sub?: string
}

const SLIDES: Slide[] = [
  {
    id: 'ofertas',
    image: '/banners/hero-1.svg',
    alt: 'Ofertas da semana',
    href: '/products',
    headline: 'Ofertas da Semana',
    sub: 'Até 30% OFF no Pix',
  },
  {
    id: 'novidades',
    image: '/banners/hero-2.svg',
    alt: 'Novidades devwear',
    href: '/products',
    headline: 'Novidades DevWear',
    sub: 'Lançamentos exclusivos',
  },
  {
    id: 'best',
    image: '/banners/hero-3.svg',
    alt: 'Mais vendidos',
    href: '/products',
    headline: 'Mais Vendidos',
    sub: 'Os favoritos da comunidade',
  },
]

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0)

  // Auto-advance with gentle interval; keep simple to avoid heavy script
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(id)
  }, [])

  const current = SLIDES[idx]

  return (
    <section className="relative rounded-lg overflow-hidden border border-slate-800">
      <div className="relative h-[220px] sm:h-[320px]">
        <Image src={current.image} alt={current.alt} fill priority className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
        <h1 className="mb-1">{current.headline}</h1>
        {current.sub && <p className="text-white text-sm sm:text-base">{current.sub}</p>}
        <div className="mt-4">
          <Link href={current.href} className="btn btn-primary">
            Ver ofertas
          </Link>
        </div>
      </div>
      <div className="absolute right-4 bottom-4 flex gap-2" aria-label="Controles do carrossel">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Ir para slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`w-2.5 h-2.5 rounded-full ${i === idx ? 'bg-cyan-400' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  )
}
