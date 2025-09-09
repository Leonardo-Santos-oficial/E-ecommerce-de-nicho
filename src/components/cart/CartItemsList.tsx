import Image from 'next/image'
import Link from 'next/link'
import { CartItem } from '../../context/CartContext'

type Props = {
  items: CartItem[]
  onClearCart: () => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}

export default function CartItemsList({
  items,
  onClearCart,
  onUpdateQuantity,
  onRemoveItem,
}: Props) {
  return (
    <section aria-labelledby="meus-produtos" className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 id="meus-produtos" className="text-lg font-semibold">
          Meus Produtos
        </h2>
        <button className="btn btn-outline" onClick={onClearCart}>
          Remover todos
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
        {items.length === 0 && (
          <p className="text-white">
            Seu carrinho está vazio.{' '}
            <Link href="/products" className="text-cyan-400 hover:underline">
              Continuar comprando
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}) {
  const priceEach = item.price
  const pixPriceEach = Math.round(priceEach * 0.95 * 100) / 100

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between border border-slate-800 rounded p-3">
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-20 rounded bg-slate-800 overflow-hidden">
          <Image
            src={item.image || '/placeholder.svg'}
            alt={item.imageAlt || item.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-xs inline-flex items-center gap-1 text-amber-300">
            {/* badge opcional */}
            <span className="px-1 py-0.5 rounded bg-amber-500/10 border border-amber-400/30">
              Oferta Ninja
            </span>
          </div>
          <div className="text-white text-xs">{item.category}</div>
          <div className="font-medium leading-tight">{item.name}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-white text-sm">à vista no Pix</div>
          <div className="font-semibold text-lime-400">R$ {pixPriceEach.toFixed(2)}</div>
          <div className="text-white text-xs">ou 10x de R$ {(priceEach / 10).toFixed(2)}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-outline"
            aria-label="Diminuir"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            -
          </button>
          <input
            type="number"
            className="w-14 text-center bg-slate-900 border border-slate-700 rounded py-1"
            value={item.quantity}
            min={1}
            onChange={(e) => onUpdateQuantity(item.id, Math.max(1, Number(e.target.value)))}
          />
          <button
            className="btn btn-outline"
            aria-label="Aumentar"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        <button className="btn btn-outline" onClick={() => onRemoveItem(item.id)}>
          Remover
        </button>
      </div>
    </div>
  )
}
