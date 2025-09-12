import React, { useEffect, useState, useRef } from 'react'

interface LegalPageProps {
  title: string
  description?: string
  updatedAt?: Date
  children: React.ReactNode
  // Permite inserir elementos no topo (ex.: breadcrumbs futuros)
  headerExtra?: React.ReactNode
  showTOC?: boolean
}

/**
 * Componente padronizado para páginas legais.
 * - Controla largura máxima, tipografia e espaçamentos verticais coerentes.
 * - Evita repetição de classes e facilita ajustes futuros de UX.
 */
type TocItem = { id: string; text: string }

export function LegalPage({
  title,
  description,
  children,
  updatedAt,
  headerExtra,
  showTOC = true,
}: LegalPageProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [toc, setToc] = useState<TocItem[]>([])

  // Extrai headings h2 para TOC (SRP: responsabilidade limitada a derivar índice da estrutura já renderizada)
  useEffect(() => {
    if (!showTOC) return
    const el = contentRef.current
    if (!el) return
    const hs = Array.from(el.querySelectorAll('h2')) as HTMLHeadingElement[]
    const items = hs.map((h) => {
      if (!h.id) {
        // Gera id determinístico a partir do texto
        const slug = h.textContent
          ?.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
        if (slug) h.id = slug
      }
      return { id: h.id, text: h.textContent || '' }
    })
    setToc(items.filter((i) => i.id && i.text))
  }, [children, showTOC])

  return (
    <article className="mx-auto max-w-4xl">
      <header className="mb-10">
        {headerExtra}
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-white">{title}</h1>
        {description && (
          <p className="text-base text-slate-300 leading-relaxed max-w-3xl">{description}</p>
        )}
        {updatedAt && (
          <p className="text-xs text-slate-400 mt-4" aria-label="Data da última atualização">
            Última atualização: {updatedAt.toLocaleDateString('pt-BR')}
          </p>
        )}
      </header>
      {showTOC && toc.length > 2 && (
        <nav
          aria-label="Sumário"
          className="mb-10 border border-slate-800 rounded p-4 bg-slate-900/40"
        >
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 mb-3">Nesta página</h2>
          <ul className="space-y-2 text-sm">
            {toc.map((i) => (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  className="text-slate-300 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 rounded"
                >
                  {i.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div
        ref={contentRef}
        className="prose prose-invert max-w-none [&>h2]:mt-12 [&>h2]:scroll-mt-24 [&>h2:first-child]:mt-0 [&>h3]:mt-8 [&>p]:leading-relaxed [&>ul]:leading-relaxed [&>ol]:leading-relaxed [&_strong]:text-white"
      >
        {children}
      </div>
    </article>
  )
}

export default LegalPage
