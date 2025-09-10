type Badge = { id: string; label: string }

const BADGES: Badge[] = [
  { id: 'novidades', label: 'Novidades' },
  { id: 'ofertas', label: 'Ofertas' },
  { id: 'mais-vendidos', label: 'Mais vendidos' },
  { id: 'frete', label: 'Frete grátis' },
]

export default function BadgesStrip() {
  return (
    <div className="flex gap-2 flex-wrap">
      {BADGES.map((b) => (
        <span key={b.id} className="text-xs rounded-full px-3 py-1 border border-slate-700">
          {b.label}
        </span>
      ))}
    </div>
  )
}
