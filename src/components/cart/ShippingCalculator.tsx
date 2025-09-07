import React, { useId, useState } from 'react'

export default function ShippingCalculator() {
  const [zip, setZip] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const msgId = useId()

  const onCalculate = async () => {
    setLoading(true)
    // Placeholder: integrate with shipping API later
    await new Promise(r => setTimeout(r, 500))
    setResult('Entrega padrão: R$ 19,90 — 5 a 9 dias úteis (simulado)')
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      <label htmlFor="zip" className="text-sm">Calcular frete</label>
      <div className="flex gap-2">
        <input
          id="zip"
          inputMode="numeric"
          placeholder="CEP"
          className="flex-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={zip}
          onChange={e => setZip(e.target.value)}
          aria-describedby={msgId}
        />
        <button
          type="button"
          className="btn btn-outline disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={onCalculate}
          disabled={loading || zip.length < 8}
        >
          {loading ? 'Calculando…' : 'Calcular'}
        </button>
      </div>
      <p id={msgId} aria-live="polite" className="text-xs text-slate-400">{result}</p>
    </div>
  )
}
