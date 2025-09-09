import React, { useState } from 'react'
import { inputBase } from '@/components/form/styles'
import { formatCurrency } from '@/utils/format'

interface Props {
  total: number
  onPrev: () => void
  onNext: (method: string) => void
}

export default function PaymentForm({ total, onPrev, onNext }: Props) {
  const [method, setMethod] = useState<'pix' | 'cartao'>('pix')
  const [card, setCard] = useState({ numero: '', nome: '', validade: '', cvv: '' })
  const isCard = method === 'cartao'
  const cardOk = !isCard || (card.numero.replace(/\D/g, '').length >= 13 && card.nome && /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.validade) && card.cvv.length >= 3)

  return (
  <form aria-labelledby="etapa-pagamento" className="card p-4 space-y-6" onSubmit={(e) => { e.preventDefault(); if (cardOk) onNext(method) }}>
      <h2 id="etapa-pagamento" className="text-lg font-semibold tracking-tight">Pagamento</h2>
      <fieldset className="flex flex-wrap gap-3" aria-label="Método de pagamento">
        <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition-colors ${method==='pix'?'border-cyan-500 bg-cyan-500/10 text-cyan-200':'border-slate-700 text-slate-300 hover:border-slate-500'}`}>
          <input type="radio" name="metodo" className="sr-only" value="pix" checked={method==='pix'} onChange={() => setMethod('pix')} />
          <span>Pix (5% off)</span>
        </label>
        <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition-colors ${method==='cartao'?'border-cyan-500 bg-cyan-500/10 text-cyan-200':'border-slate-700 text-slate-300 hover:border-slate-500'}`}>
          <input type="radio" name="metodo" className="sr-only" value="cartao" checked={method==='cartao'} onChange={() => setMethod('cartao')} />
          <span>Cartão</span>
        </label>
      </fieldset>

      {isCard && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span>Número do cartão</span>
            <input className={inputBase} value={card.numero} onChange={e=>setCard(c=>({...c, numero: e.target.value.replace(/\D/g,'').slice(0,16)}))} placeholder="Somente números" required={isCard} />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span>Nome impresso</span>
            <input className={inputBase} value={card.nome} onChange={e=>setCard(c=>({...c, nome: e.target.value }))} required={isCard} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span>Validade (MM/AA)</span>
            <input className={inputBase} value={card.validade} onChange={e=>setCard(c=>({...c, validade: e.target.value.slice(0,5)}))} placeholder="07/28" required={isCard} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span>CVV</span>
            <input className={inputBase} value={card.cvv} onChange={e=>setCard(c=>({...c, cvv: e.target.value.replace(/\D/g,'').slice(0,4)}))} placeholder="123" required={isCard} />
          </label>
        </div>
      )}

  <div className="pt-2 flex gap-2">
        <button type="button" className="btn btn-secondary" onClick={onPrev}>Voltar</button>
        <button type="submit" className="btn btn-primary" disabled={!cardOk}>Revisar Pedido</button>
      </div>
  <p className="text-xs text-slate-400">Total: <strong className="text-slate-300">{formatCurrency(total)}</strong></p>
    </form>
  )
}
