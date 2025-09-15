import React, { useId, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { validateCoupon } from '@/utils/coupons'

// UI -> Domain flow: user enters code -> validate -> dispatch cart action.
// Mantém separação: validação isolada em utils (OCP), componente só orquestra.

export default function CouponForm() {
  const { applyCoupon, clearCoupon, coupon, subtotal } = useCart()
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [error, setError] = useState<string>('')
  const msgId = useId()

  const normalizedInput = code.trim().toUpperCase()

  const handleApply = async () => {
    if (!normalizedInput) return
    setStatus('loading')
    setError('')
    // Simula latência mínima (UX) sem acoplar à implementação futura de backend
    await new Promise((r) => setTimeout(r, 200))
    const result = validateCoupon(normalizedInput, subtotal)
    if (result.ok) {
      applyCoupon(result.code, result.percent)
      setCode('')
    } else {
      setError(result.message)
    }
    setStatus('idle')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      void handleApply()
    }
  }

  const handleClear = () => {
    clearCoupon()
    setError('')
  }

  const disabled = status === 'loading' || !normalizedInput

  return (
    <div className="space-y-2" aria-live="polite">
      <label htmlFor="coupon" className="text-sm font-medium flex items-center gap-2">
        Cupom de desconto
        {coupon && (
          <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-lime-500/10 text-lime-300 border border-lime-400/30">
            {coupon.code} − {coupon.percent}%
          </span>
        )}
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          placeholder="INSIRA SEU CUPOM"
          className="flex-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase tracking-wide text-sm disabled:opacity-60"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKey}
          aria-describedby={msgId}
          disabled={!!coupon}
        />
        {coupon ? (
          <button type="button" onClick={handleClear} className="btn btn-outline">
            Remover
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleApply}
            disabled={disabled}
          >
            {status === 'loading' ? 'Aplicando…' : 'Aplicar'}
          </button>
        )}
      </div>
      <p id={msgId} className="text-xs min-h-[1.25rem]">
        {coupon && !error && (
          <span className="text-lime-400">
            Cupom {coupon.code} aplicado: {coupon.percent}% OFF
          </span>
        )}
        {!coupon && error && <span className="text-red-400">{error}</span>}
      </p>
    </div>
  )
}
