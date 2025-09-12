import React from 'react'
import Link from 'next/link'
import type { SiteMapSection } from '@/types/sitemap'

interface Props {
  section: SiteMapSection
}

// Card isolado (SRP) permite reaproveitar no futuro (ex: landing interna ou footer expandido)
export function SiteMapCard({ section }: Props) {
  return (
    <section
      aria-labelledby={`sm-${section.id}`}
      className="relative group bg-brand-800/40 border border-brand-700/40 rounded-xl p-5 backdrop-blur-sm hover:border-cyan-500/60 transition-colors motion-safe:transition-all motion-safe:duration-300 shadow-sm hover:shadow-cyan-900/40 focus-within:border-cyan-400/70"
    >
      <h2
        id={`sm-${section.id}`}
        className="flex items-center gap-2 text-lg font-semibold text-white mb-4"
      >
        <span
          aria-hidden="true"
          className="text-xl grayscale group-hover:grayscale-0 motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-110"
        >
          {section.icon}
        </span>
        {section.title}
      </h2>
      <ul className="space-y-3">
        {section.links.map((link) => (
          <li key={link.href} className="text-sm">
            <Link
              href={link.href}
              className="group/link block rounded-md px-2 py-1 -mx-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900 transition-colors hover:bg-brand-700/40 motion-safe:transition-colors"
            >
              <span className="font-medium text-slate-200 group-hover/link:text-cyan-300">
                {link.label}
              </span>
              {link.description && (
                <span className="block text-[11px] text-slate-400 mt-0.5">{link.description}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="absolute inset-px pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 motion-safe:transition-opacity border border-cyan-400/20" />
    </section>
  )
}
