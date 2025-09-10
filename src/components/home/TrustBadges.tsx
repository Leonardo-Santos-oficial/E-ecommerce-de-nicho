export default function TrustBadges() {
  const items = [
    { id: 'ssl', label: 'Conexão segura (SSL 256-bit)', icon: '🔒' },
    { id: 'pix', label: 'Pague com PIX', icon: '⚡' },
    { id: 'visa', label: 'Visa', icon: '💳' },
    { id: 'mc', label: 'Mastercard', icon: '💳' },
  ] as const
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {items.map((i) => (
        <span
          key={i.id}
          className="inline-flex items-center gap-1 rounded border border-slate-800 bg-slate-900/40 px-2 py-1"
        >
          <span aria-hidden>{i.icon}</span>
          {i.label}
        </span>
      ))}
    </div>
  )
}
