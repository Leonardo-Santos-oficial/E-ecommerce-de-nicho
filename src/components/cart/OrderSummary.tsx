import React from 'react'
import { formatCurrency } from '../../utils/format'
import Link from 'next/link'
import ShippingCalculator from './ShippingCalculator'
import CouponForm from './CouponForm'

type Props = {
  subtotal: number
  total: number
  totalWithDiscount: number
  savings: number
  installment?: { installments: number; amount: number }
  onContinue?: () => void
}

export default function OrderSummary({
  subtotal,
  total,
  totalWithDiscount,
  savings,
  onContinue,
  installment,
}: Props) {
  return (
    <aside className="card p-4 h-max lg:sticky lg:top-20">
      <h2 className="text-lg font-semibold mb-4">Resumo do pedido</h2>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Valor dos produtos</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Total a prazo</span>
          <span className="font-medium">{formatCurrency(total)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>À vista no Pix</span>
          <span className="font-semibold text-lime-400">{formatCurrency(totalWithDiscount)}</span>
        </div>
        {installment && installment.installments > 1 && (
          <div className="flex items-center justify-between text-xs text-white">
            <span>Parcelamento</span>
            <span>
              {installment.installments}x de {formatCurrency(installment.amount)} sem juros
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-white">
          <span>Você economiza</span>
          <span>{formatCurrency(savings)}</span>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <ShippingCalculator />
        <CouponForm />
      </div>
      <div className="mt-4 space-y-2">
        {savings > 0 && (
          <div>
            <span className="inline-flex rounded bg-lime-500/10 text-lime-300 px-2 py-1 text-xs">
              Você economiza {formatCurrency(savings)} no Pix
            </span>
          </div>
        )}
        <button className="btn btn-primary w-full" onClick={onContinue}>
          Continuar
        </button>
        <Link href="/products" className="btn btn-secondary w-full text-center">
          Voltar para a loja
        </Link>
      </div>
    </aside>
  )
}
