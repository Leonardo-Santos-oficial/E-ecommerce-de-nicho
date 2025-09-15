import React, { useMemo, useState } from 'react'
import Image from 'next/image'

export type FBTItem = {
  id: string
  name: string
  price: number
  formattedPrice: string
  image?: string
}

type Props = {
  current: FBTItem
  suggestions: FBTItem[]
  onBuyTogether?: (ids: string[]) => void
}

export default function FrequentlyBoughtTogether({ current, suggestions, onBuyTogether }: Props) {
  const [selected, setSelected] = useState<Record<string, boolean>>(
    [current, ...suggestions].reduce((acc, i) => ({ ...acc, [i.id]: true }), {})
  )

  const items = useMemo(() => [current, ...suggestions], [current, suggestions])
  const total = useMemo(
    () => items.filter((i) => selected[i.id]).reduce((sum, i) => sum + i.price, 0),
    [items, selected]
  )

  return (
    <section className="mt-10 rounded-lg border border-slate-800 p-4">
      <h3 className="font-semibold mb-3">Compre Junto</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((i) => (
          <label
            key={i.id}
            className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/40 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={!!selected[i.id]}
              onChange={(e) => setSelected((s) => ({ ...s, [i.id]: e.target.checked }))}
            />
            <div className="relative w-12 h-12 rounded overflow-hidden bg-slate-800">
              <Image
                src={i.image || '/placeholder.svg'}
                alt={i.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-sm">
              <div className="text-white">{i.name}</div>
              <div className="text-cyan-400">{i.formattedPrice}</div>
            </div>
          </label>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-white">
          Total:{' '}
          <span className="text-cyan-400 font-semibold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
          </span>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => onBuyTogether?.(Object.keys(selected).filter((k) => selected[k]))}
        >
          Comprar Junto
        </button>
      </div>
    </section>
  )
}
