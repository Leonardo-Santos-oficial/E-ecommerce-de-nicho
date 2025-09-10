import Link from 'next/link'

type Category = { id: string; label: string; href: string }

const CATS: Category[] = [
  { id: 'camisetas', label: 'Camisetas', href: '/products?cat=camisetas' },
  { id: 'acessorios', label: 'Acessórios', href: '/products?cat=acessorios' },
  { id: 'moletons', label: 'Moletons', href: '/products?cat=moletons' },
  { id: 'decoracao', label: 'Decoração', href: '/products?cat=decoracao' },
]

export default function CategoryCards() {
  return (
    <section className="py-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CATS.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            className="card p-5 text-center hover:border-cyan-500 transition-colors"
          >
            <span className="block text-xl font-semibold">{c.label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
