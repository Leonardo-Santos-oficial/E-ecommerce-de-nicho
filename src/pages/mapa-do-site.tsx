import React from 'react'
import Head from 'next/head'
// removed unused Link import after enabling noUnusedLocals
import { absoluteUrl } from '@/utils/seo'
import type { SiteMapSection } from '@/types/sitemap'
import { SiteMapCard } from '@/components/sitemap/SiteMapCard'
import { SITE_MAP_SECTIONS_CONFIG } from '@/config/navigation'

// Fonte única de verdade para as seções do Mapa do Site (SRP + OCP)
export const SITE_MAP_SECTIONS: SiteMapSection[] = SITE_MAP_SECTIONS_CONFIG

export default function SiteMapPage() {
  const title = 'Mapa do Site | DevWear'
  const description = 'Estrutura de navegação completa do site DevWear.'
  const allLinks = SITE_MAP_SECTIONS.flatMap((s) => s.links)
  const structuredNav = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Mapa do Site',
    itemListElement: allLinks.map((l, i) => ({
      '@type': 'SiteNavigationElement',
      position: i + 1,
      name: l.label,
      url: absoluteUrl(l.href),
    })),
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: absoluteUrl('/') },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Mapa do Site',
        item: absoluteUrl('/mapa-do-site'),
      },
    ],
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={absoluteUrl('/mapa-do-site')} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredNav) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
      </Head>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mapa do Site</h1>
        <p className="text-slate-300 mb-10 text-sm md:text-base max-w-2xl">
          Explore rapidamente todas as áreas do site. Use este índice visual para navegar e
          descobrir recursos.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_MAP_SECTIONS.map((section) => (
            <SiteMapCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </>
  )
}
