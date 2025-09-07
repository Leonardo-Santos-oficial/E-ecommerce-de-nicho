import { ReactNode, useState } from 'react'

type TabKey = 'tech' | 'reviews'

type Props = {
  technical: ReactNode
  reviews: ReactNode
}

export default function ProductDetailsTabs({ technical, reviews }: Props) {
  const [active, setActive] = useState<TabKey>('tech')

  return (
    <section className="mt-10">
      <div className="border-b border-slate-800 flex gap-4">
        <button
          className={`py-2 border-b-2 ${active === 'tech' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400'}`}
          onClick={() => setActive('tech')}
        >Informações Técnicas</button>
        <button
          className={`py-2 border-b-2 ${active === 'reviews' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400'}`}
          onClick={() => setActive('reviews')}
        >Avaliações</button>
      </div>
      <div className="pt-4">
        {active === 'tech' ? technical : reviews}
      </div>
    </section>
  )
}
