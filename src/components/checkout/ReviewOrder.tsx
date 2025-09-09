import React from 'react'
import { CartItem } from '@/context/CartContext'
import { formatCurrency } from '@/utils/format'

interface Props {
  items: CartItem[]
  totals: { subtotal: number; total: number; totalWithDiscount: number; savings: number }
  identification: { nome: string; email: string; cpf: string }
  address: { cep: string; rua: string; numero: string; complemento: string; bairro: string; cidade: string; estado: string }
  paymentMethod: string
  onPrev: () => void
  onConfirm: () => void
}

export default function ReviewOrder({ items, totals, identification, address, paymentMethod, onPrev, onConfirm }: Props) {
  return (
  <section aria-labelledby="revisao-pedido" className="card p-4 space-y-6">
      <h2 id="revisao-pedido" className="text-lg font-semibold tracking-tight">Revisão</h2>
      <div className="space-y-5">
        <div className="card p-4 space-y-2">
          <h3 className="font-medium">Itens ({items.length})</h3>
          <ul className="space-y-1 text-sm text-slate-300">
            {items.map(i => (
              <li key={i.id} className="flex justify-between">
                <span className="truncate pr-2">{i.name} <span className="text-slate-500">x{i.quantity}</span></span>
                <span>{formatCurrency(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card p-4 space-y-2 text-sm">
            <h3 className="font-medium">Identificação</h3>
            <p>{identification.nome}</p>
            <p>{identification.email}</p>
            <p>CPF: {identification.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</p>
          </div>
          <div className="card p-4 space-y-1 text-sm">
            <h3 className="font-medium">Endereço</h3>
            <p>{address.rua}, {address.numero}{address.complemento ? ` - ${address.complemento}` : ''}</p>
            <p>{address.bairro} - {address.cidade}/{address.estado}</p>
            <p>CEP: {address.cep}</p>
          </div>
        </div>
        <div className="card p-4 text-sm space-y-2">
          <h3 className="font-medium">Pagamento</h3>
          <p>Método: {paymentMethod === 'pix' ? 'Pix (com desconto)' : 'Cartão de Crédito'}</p>
        </div>
        <div className="card p-4 space-y-2 text-sm">
          <h3 className="font-medium">Totais</h3>
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
          <div className="flex justify-between"><span>Total a prazo</span><span>{formatCurrency(totals.total)}</span></div>
          <div className="flex justify-between"><span>Total Pix</span><span className="text-lime-400 font-medium">{formatCurrency(totals.totalWithDiscount)}</span></div>
          <div className="flex justify-between text-xs text-slate-400"><span>Economia</span><span>{formatCurrency(totals.savings)}</span></div>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" className="btn btn-secondary" onClick={onPrev}>Voltar</button>
        <button type="button" className="btn btn-primary" onClick={onConfirm}>Confirmar Pedido</button>
      </div>
    </section>
  )
}
