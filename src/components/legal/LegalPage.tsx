import React from 'react'

interface LegalPageProps {
  title: string
  description?: string
  updatedAt?: Date
  children: React.ReactNode
  // Permite inserir elementos no topo (ex.: breadcrumbs futuros)
  headerExtra?: React.ReactNode
}

/**
 * Componente padronizado para páginas legais.
 * - Controla largura máxima, tipografia e espaçamentos verticais coerentes.
 * - Evita repetição de classes e facilita ajustes futuros de UX.
 */
export function LegalPage({
  title,
  description,
  children,
  updatedAt,
  headerExtra,
}: LegalPageProps) {
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
      <div className="prose prose-invert max-w-none [&>h2]:mt-12 [&>h2]:scroll-mt-24 [&>h2:first-child]:mt-0 [&>h3]:mt-8 [&>p]:leading-relaxed [&>ul]:leading-relaxed [&>ol]:leading-relaxed [&_strong]:text-white">
        {children}
      </div>
    </article>
  )
}

export default LegalPage
