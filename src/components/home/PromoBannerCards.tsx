import Link from 'next/link'
import Image from 'next/image'

type Promo = {
  id: string
  title: string
  subtitle?: string
  href: string
  image?: string
}

const PROMOS: Promo[] = [
  {
    id: 'colecao-camisetas',
    title: 'Coleção Camisetas',
    subtitle: 'Novas estampas dev',
    href: '/products?cat=camisetas',
    image: '/banners/card-camisetas.svg',
  },
  {
    id: 'moletons',
    title: 'Moletons',
    subtitle: 'Inverno dev',
    href: '/products?cat=moletons',
    image: '/banners/card-moletons.svg',
  },
  {
    id: 'acessorios',
    title: 'Acessórios',
    subtitle: 'Complete seu setup',
    href: '/products?cat=acessorios',
    image: '/banners/card-acessorios.svg',
  },
]

export default function PromoBannerCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {PROMOS.map((p) => (
        <Link
          key={p.id}
          href={p.href}
          className="relative overflow-hidden rounded-lg border border-slate-800 group"
          aria-label={p.title}
        >
          {/* Background image or gradient fallback */}
          <div className="relative h-36 sm:h-40">
            {p.image ? (
              <Image src={p.image} alt={p.title} fill className="object-cover" loading="lazy" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/60 to-slate-900" />
            )}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          </div>
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <h3 className="text-lg font-semibold leading-tight">{p.title}</h3>
            {p.subtitle && <p className="text-sm">{p.subtitle}</p>}
          </div>
        </Link>
      ))}
    </div>
  )
}
