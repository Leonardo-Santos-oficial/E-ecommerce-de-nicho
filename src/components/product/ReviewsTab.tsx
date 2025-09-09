import React from 'react'

type Review = {
  id: string
  author: string
  date: string
  rating: number
  text: string
}

type Props = {
  ratingSummary: { value: number; count: number }
  reviews: Review[]
}

export default function ReviewsTab({ ratingSummary, reviews }: Props) {
  const percent5 = Math.round(
    (reviews.filter((r) => r.rating === 5).length / Math.max(1, reviews.length)) * 100
  )
  return (
    <div>
      <div className="mb-4 text-sm text-white">
        {percent5}% deram 5 estrelas • Média {ratingSummary.value.toFixed(1)} de 5 (
        {ratingSummary.count} avaliações)
      </div>
      <ul className="space-y-4">
        {reviews.map((r) => (
          <li key={r.id} className="rounded border border-slate-800 p-3">
            <div className="flex items-center justify-between text-sm text-white">
              <span className="font-medium text-white">{r.author}</span>
              <span>{new Date(r.date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="text-yellow-400">
              {'★'.repeat(r.rating)}
              {'☆'.repeat(5 - r.rating)}
            </div>
            <p className="text-white mt-2">{r.text}</p>
          </li>
        ))}
      </ul>
      <form className="mt-6 space-y-3" onSubmit={(e) => e.preventDefault()}>
        <div className="text-white font-medium">Deixe sua avaliação</div>
        <input
          placeholder="Seu nome"
          className="w-full rounded border border-slate-800 bg-transparent px-3 py-2"
        />
        <StarRatingInput />
        <textarea
          placeholder="Escreva seu comentário"
          className="w-full rounded border border-slate-800 bg-transparent px-3 py-2 min-h-24"
        />
        <button className="btn btn-primary">Enviar</button>
      </form>
    </div>
  )
}

function StarRatingInput() {
  const [value, setValue] = React.useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Dar ${n} estrela${n > 1 ? 's' : ''}`}
          className={`text-2xl ${n <= value ? 'text-yellow-400' : 'text-white hover:text-white'}`}
          onClick={() => setValue(n)}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-white">Sua nota: {value}/5</span>
    </div>
  )
}
