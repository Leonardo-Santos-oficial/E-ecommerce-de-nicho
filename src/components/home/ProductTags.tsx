import Link from 'next/link'

const TAGS = ['novo', 'oferta', 'popular', 'devwear', 'frete-gratis']

export default function ProductTags() {
  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map((t) => (
        <Link
          key={t}
          href={`/products?tag=${encodeURIComponent(t)}`}
          className="text-xs rounded-full px-3 py-1 border border-slate-700 hover:border-cyan-500"
        >
          #{t}
        </Link>
      ))}
    </div>
  )
}
