import React from 'react'

export type CheckoutStep = 'identificacao' | 'endereco' | 'pagamento' | 'revisao'

interface Props {
  current: CheckoutStep
  onChange?: (next: CheckoutStep) => void
}

const steps: { key: CheckoutStep; label: string }[] = [
  { key: 'identificacao', label: 'Identificação' },
  { key: 'endereco', label: 'Endereço' },
  { key: 'pagamento', label: 'Pagamento' },
  { key: 'revisao', label: 'Revisão' },
]

export default function CheckoutSteps({ current, onChange }: Props) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Etapas do checkout">
      {steps.map((s, idx) => {
        const active = s.key === current
        return (
          <li key={s.key} className="flex items-center gap-2">
            <button
              type="button"
              className={`text-xs rounded-full px-3 py-1 border transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${active ? 'bg-cyan-600 border-cyan-500 text-white' : 'border-slate-700 text-white hover:text-cyan-300'}`}
              aria-current={active ? 'step' : undefined}
              onClick={() => onChange?.(s.key)}
            >
              <span className="font-medium">{idx + 1}.</span> {s.label}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
