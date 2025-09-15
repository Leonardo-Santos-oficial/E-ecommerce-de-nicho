import React, { useState, useRef, useEffect } from 'react'
import type { PaymentMethod } from '@/types/domain'
import type { MoneyBRL } from '@/types/brands'
import { inputBase } from '@/components/form/styles'
import {
  maskCardNumber,
  maskExpiry,
  maskCVV,
  validateCardLuhn,
  validateExpiryNotPast,
} from '@/utils/masks'
import { CardSchema } from '@/types/schemas'
import { formatCurrency } from '@/utils/format'
import { handleDigitKeyDown, handlePasteDigits } from '@/utils/inputGuards'

interface Props {
  total: MoneyBRL | number
  onPrev: () => void
  onNext: (method: PaymentMethod) => void
}

export default function PaymentForm({ total, onPrev, onNext }: Props) {
  const [method, setMethod] = useState<PaymentMethod>('pix')
  const [card, setCard] = useState({ numero: '', nome: '', validade: '', cvv: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const isCard = method === 'cartao'
  const cardOk =
    !isCard ||
    (validateCardLuhn(card.numero) &&
      !!card.nome &&
      validateExpiryNotPast(card.validade) &&
      card.cvv.replace(/\D/g, '').length >= 3)
  const errors = isCard
    ? {
        numero: !validateCardLuhn(card.numero) ? 'Número inválido' : '',
        nome: !card.nome ? 'Obrigatório' : '',
        validade: !validateExpiryNotPast(card.validade) ? 'MM/AA' : '',
        cvv: card.cvv.replace(/\D/g, '').length < 3 ? 'CVV' : '',
      }
    : {}

  const numRef = useRef<HTMLInputElement | null>(null)
  const valRef = useRef<HTMLInputElement | null>(null)
  const cvvRef = useRef<HTMLInputElement | null>(null)

  // Auto-focus cadeia: número completo -> validade -> cvv
  useEffect(() => {
    if (
      numRef.current &&
      valRef.current &&
      card.numero.replace(/\D/g, '').length === 16 &&
      document.activeElement === numRef.current
    ) {
      valRef.current.focus()
    }
  }, [card.numero])
  useEffect(() => {
    if (
      valRef.current &&
      cvvRef.current &&
      /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.validade) &&
      document.activeElement === valRef.current
    ) {
      cvvRef.current.focus()
    }
  }, [card.validade])

  return (
    <form
      aria-labelledby="etapa-pagamento"
      className="card p-4 space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (isCard) {
          const parsed = CardSchema.safeParse(card)
          if (!parsed.success) return
        }
        if (cardOk) onNext(method)
      }}
    >
      <h2 id="etapa-pagamento" className="text-lg font-semibold tracking-tight">
        Pagamento
      </h2>
      <fieldset className="flex flex-wrap gap-3" aria-label="Método de pagamento">
        <label
          className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition-colors ${method === 'pix' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200' : 'border-slate-700 text-white hover:border-slate-500'}`}
        >
          <input
            type="radio"
            name="metodo"
            className="sr-only"
            value="pix"
            checked={method === 'pix'}
            onChange={() => setMethod('pix')}
          />
          <span>Pix (5% off)</span>
        </label>
        <label
          className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition-colors ${method === 'cartao' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200' : 'border-slate-700 text-white hover:border-slate-500'}`}
        >
          <input
            type="radio"
            name="metodo"
            className="sr-only"
            value="cartao"
            checked={method === 'cartao'}
            onChange={() => setMethod('cartao')}
          />
          <span>Cartão</span>
        </label>
      </fieldset>

      {isCard && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm sm:col-span-2 relative">
            <span>Número do cartão</span>
            <input
              className={
                inputBase +
                (touched.numero && errors['numero'] ? ' border-red-500 focus:ring-red-500' : '')
              }
              value={card.numero}
              onChange={(e) => setCard((c) => ({ ...c, numero: maskCardNumber(e.target.value) }))}
              onBlur={() => setTouched((t) => ({ ...t, numero: true }))}
              onKeyDown={handleDigitKeyDown}
              onPaste={(e) =>
                handlePasteDigits(
                  e,
                  (digits) => setCard((c) => ({ ...c, numero: maskCardNumber(digits) })),
                  16
                )
              }
              placeholder="0000 0000 0000 0000"
              required={isCard}
              autoComplete="cc-number"
              ref={numRef}
            />
            {touched.numero && errors['numero'] && (
              <span className="text-xs text-red-400" role="alert">
                {errors['numero']}
              </span>
            )}
            {card.numero.replace(/\D/g, '').length >= 13 && !errors['numero'] && (
              <span className="absolute top-7 right-2 text-lime-400 text-xs">✔</span>
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2 relative">
            <span>Nome impresso</span>
            <input
              className={inputBase + (touched.nome && errors['nome'] ? ' border-red-500' : '')}
              value={card.nome}
              onChange={(e) => setCard((c) => ({ ...c, nome: e.target.value }))}
              onBlur={() => setTouched((t) => ({ ...t, nome: true }))}
              required={isCard}
              autoComplete="cc-name"
            />
            {touched.nome && errors['nome'] && (
              <span className="text-xs text-red-400" role="alert">
                {errors['nome']}
              </span>
            )}
            {card.nome && !errors['nome'] && (
              <span className="absolute top-7 right-2 text-lime-400 text-xs">✔</span>
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm relative">
            <span>Validade (MM/AA)</span>
            <input
              className={
                inputBase + (touched.validade && errors['validade'] ? ' border-red-500' : '')
              }
              value={card.validade}
              onChange={(e) => setCard((c) => ({ ...c, validade: maskExpiry(e.target.value) }))}
              onBlur={() => setTouched((t) => ({ ...t, validade: true }))}
              onKeyDown={handleDigitKeyDown}
              onPaste={(e) =>
                handlePasteDigits(
                  e,
                  (digits) => setCard((c) => ({ ...c, validade: maskExpiry(digits) })),
                  4
                )
              }
              placeholder="07/28"
              required={isCard}
              autoComplete="cc-exp"
              ref={valRef}
            />
            {touched.validade && errors['validade'] && (
              <span className="text-xs text-red-400" role="alert">
                {errors['validade']}
              </span>
            )}
            {/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.validade) && !errors['validade'] && (
              <span className="absolute top-7 right-2 text-lime-400 text-xs">✔</span>
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm relative">
            <span>CVV</span>
            <input
              className={inputBase + (touched.cvv && errors['cvv'] ? ' border-red-500' : '')}
              value={card.cvv}
              onChange={(e) => setCard((c) => ({ ...c, cvv: maskCVV(e.target.value) }))}
              onBlur={() => setTouched((t) => ({ ...t, cvv: true }))}
              onKeyDown={handleDigitKeyDown}
              onPaste={(e) =>
                handlePasteDigits(
                  e,
                  (digits) => setCard((c) => ({ ...c, cvv: maskCVV(digits) })),
                  4
                )
              }
              placeholder="123"
              required={isCard}
              autoComplete="cc-csc"
              ref={cvvRef}
            />
            {touched.cvv && errors['cvv'] && (
              <span className="text-xs text-red-400" role="alert">
                {errors['cvv']}
              </span>
            )}
            {card.cvv.replace(/\D/g, '').length >= 3 && !errors['cvv'] && (
              <span className="absolute top-7 right-2 text-lime-400 text-xs">✔</span>
            )}
          </label>
        </div>
      )}

      <div className="pt-2 flex gap-2">
        <button type="button" className="btn btn-secondary" onClick={onPrev}>
          Voltar
        </button>
        <button type="submit" className="btn btn-primary" disabled={!cardOk}>
          Revisar Pedido
        </button>
      </div>
      <p className="text-xs text-white">
        Total: <strong className="text-white">{formatCurrency(total)}</strong>
      </p>
    </form>
  )
}
