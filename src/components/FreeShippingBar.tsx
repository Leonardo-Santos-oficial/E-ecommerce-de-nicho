import { remainingForFreeShipping, SHOP_PRICING } from '@/config/shop'
import { useCart } from '@/hooks/useCart'
import { useMemo } from 'react'

export interface FreeShippingBarViewProps {
  remaining: number
  progress: number
}

export function FreeShippingBarView({ remaining, progress }: FreeShippingBarViewProps) {
  return (
    <div
      className="w-full bg-slate-900 border-b border-slate-800 text-xs md:text-sm text-white"
      role="status"
      aria-live="polite"
    >
      <div className="container py-2 flex flex-col gap-1">
        {remaining > 0 ? (
          <p>
            Faltam <span className="text-cyan-400 font-medium">R$ {remaining.toFixed(2)}</span> para
            frete grátis.
          </p>
        ) : (
          <p className="text-lime-400 font-medium">Parabéns! Frete grátis aplicado.</p>
        )}
        <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${Math.min(1, progress) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export function FreeShippingBar() {
  const { subtotal } = useCart()
  const threshold = SHOP_PRICING.freeShippingThreshold
  // Hooks devem ser chamados incondicionalmente para manter ordem estável entre renders
  const remaining = useMemo(() => remainingForFreeShipping(subtotal), [subtotal])
  const progress = useMemo(
    () => (threshold > 0 ? Math.min(1, subtotal / threshold) : 0),
    [subtotal, threshold]
  )
  if (subtotal <= 0) return null
  return <FreeShippingBarView remaining={remaining} progress={progress} />
}

export default FreeShippingBar
