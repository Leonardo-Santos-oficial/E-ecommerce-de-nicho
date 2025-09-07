import React, { useId, useState } from 'react'

export default function CouponForm() {
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState<string | null>(null)
  const msgId = useId()

  const onApply = async () => {
    // Placeholder: integrate with backend pricing rules
    await new Promise(r => setTimeout(r, 400))
    setApplied(code.trim().toUpperCase() || null)
  }

  return (
    <div className="space-y-2">
      <label htmlFor="coupon" className="text-sm">Cupom de desconto</label>
      <div className="flex gap-2">
        <input
          id="coupon"
          placeholder="INSIRA SEU CUPOM"
          className="flex-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase tracking-wide"
          value={code}
          onChange={e => setCode(e.target.value)}
          aria-describedby={msgId}
        />
        <button
          type="button"
          className="btn btn-outline disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={onApply}
          disabled={!code.trim()}
        >
          Aplicar
        </button>
      </div>
      <p id={msgId} aria-live="polite" className="text-xs text-lime-400">{applied ? `Cupom ${applied} aplicado (simulado).` : ''}</p>
    </div>
  )
}
