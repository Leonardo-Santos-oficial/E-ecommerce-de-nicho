import { useState } from 'react'

type Props = {
  onBuyNow: (qty: number) => void
  onAddToCart: (qty: number) => void
}

export default function ProductActions({ onBuyNow, onAddToCart }: Props) {
  const [qty, setQty] = useState(1)
  const [cep, setCep] = useState('')

  const clamp = (n: number) => (n < 1 ? 1 : n > 99 ? 99 : n)

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-white" htmlFor="qty">
          Qtd
        </label>
        <div className="inline-flex rounded border border-slate-700">
          <button
            type="button"
            className="px-3 py-2 hover:bg-slate-800"
            onClick={() => setQty((q) => clamp(q - 1))}
          >
            -
          </button>
          <input
            id="qty"
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(clamp(parseInt(e.target.value || '1', 10)))}
            className="w-14 bg-transparent text-center outline-none"
          />
          <button
            type="button"
            className="px-3 py-2 hover:bg-slate-800"
            onClick={() => setQty((q) => clamp(q + 1))}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="btn btn-primary flex-1" onClick={() => onBuyNow(qty)}>
          Comprar Agora
        </button>
        <button className="btn btn-secondary flex-1" onClick={() => onAddToCart(qty)}>
          Adicionar ao Carrinho
        </button>
      </div>
      <div className="flex items-center gap-2">
        <input
          placeholder="Digite seu CEP"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          className="flex-1 rounded border border-slate-700 bg-transparent px-3 py-2"
        />
        <button
          className="btn btn-secondary"
          onClick={() => {
            /* placeholder calculo de frete */
          }}
        >
          Calcular
        </button>
      </div>
    </section>
  )
}
