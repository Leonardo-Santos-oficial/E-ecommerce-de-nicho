export default function BenefitsBar() {
  const items = [
    { id: 'shipping', title: 'Frete grátis', desc: 'Acima de R$ 199', icon: '🚚' },
    { id: 'installments', title: 'Até 10x sem juros', desc: 'no cartão', icon: '💳' },
    { id: 'secure', title: 'Compra segura', desc: 'SSL e PIX', icon: '🔒' },
    { id: 'support', title: 'Suporte ágil', desc: 'atendimento 7d', icon: '🤝' },
  ] as const

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => (
        <div
          key={it.id}
          className="rounded-md border border-slate-800 bg-slate-900/40 p-3 flex items-start gap-3"
        >
          <span aria-hidden className="text-xl">
            {it.icon}
          </span>
          <div>
            <p className="text-sm font-medium">{it.title}</p>
            <p className="text-xs text-white">{it.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
