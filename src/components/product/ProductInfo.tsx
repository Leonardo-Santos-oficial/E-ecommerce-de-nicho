type Props = {
  name: string
  rating: { value: number; count: number }
  price: { current: string; original?: string | null }
  shortDescription?: string
}

export default function ProductInfo({ name, rating, price, shortDescription }: Props) {
  const full = Math.floor(rating.value)
  const half = rating.value - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <section>
      <h1 className="text-3xl font-bold mb-2 tracking-tight">{name}</h1>
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-3" aria-label={`Avaliação ${rating.value} de 5`}>
        <span className="flex text-yellow-400">
          {'★'.repeat(full)}{half ? '☆' : ''}{'☆'.repeat(empty)}
        </span>
        <span>{rating.value.toFixed(1)} ({rating.count})</span>
      </div>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-2xl text-cyan-400 font-semibold">{price.current}</span>
        {price.original && (
          <span className="text-slate-500 line-through">{price.original}</span>
        )}
      </div>
      {shortDescription && <p className="text-slate-300">{shortDescription}</p>}
    </section>
  )
}
