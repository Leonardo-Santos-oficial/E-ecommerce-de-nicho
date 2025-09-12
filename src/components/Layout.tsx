import Link from 'next/link'
import Head from 'next/head'
import React, { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '../hooks/useCart'
import { absoluteUrl } from '../utils/seo'
import {
  NAV_PRIMARY,
  FOOTER_INSTITUTIONAL,
  FOOTER_POLICIES,
  FOOTER_SOCIALS,
} from '@/config/navigation'

export default function Layout({ children }: { children: ReactNode }) {
  const { totalItems } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const router = useRouter()

  const prefetchHover = (href: string) => () => {
    router.prefetch(href, undefined, { priority: true }).catch(() => {})
  }

  const [mobileOpen, setMobileOpen] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  useEffect(() => {
    // restaura preferência de alto contraste
    const stored =
      typeof window !== 'undefined' ? window.localStorage.getItem('pref-high-contrast') : null
    if (stored === '1') setHighContrast(true)
  }, [])
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
      window.localStorage.setItem('pref-high-contrast', '1')
    } else {
      document.documentElement.classList.remove('high-contrast')
      window.localStorage.setItem('pref-high-contrast', '0')
    }
  }, [highContrast])

  const navItems = NAV_PRIMARY

  return (
    <div>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'DevWear',
              url: absoluteUrl('/'),
              logo: absoluteUrl('/vercel.svg'),
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+55-11-0000-0000',
                  contactType: 'customer service',
                  areaServed: 'BR',
                  availableLanguage: ['Portuguese'],
                },
              ],
              sameAs: [
                'https://www.instagram.com/devwear',
                'https://www.linkedin.com/company/devwear',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SiteNavigationElement',
              name: navItems.map((n) => n.label),
              url: navItems.map((n) => absoluteUrl(n.href)),
            }),
          }}
        />
      </Head>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-slate-800 focus:text-white focus:px-3 focus:py-2 rounded"
      >
        Pular para o conteúdo
      </a>
      <header className="border-b border-slate-800 sticky top-0 backdrop-blur bg-slate-950/70 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded hover:bg-slate-800"
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <span className="i-[hamburger]">{mobileOpen ? '✕' : '☰'}</span>
            </button>
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight"
              onMouseEnter={prefetchHover('/')}
              onFocus={prefetchHover('/')}
            >
              DevWear
            </Link>
          </div>
          <nav aria-label="Primária" className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-cyan-400"
                onMouseEnter={prefetchHover(item.href)}
                onFocus={prefetchHover(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-secondary hidden sm:inline-flex">
              Entrar
            </Link>
            <Link
              href="/cart"
              className="btn btn-outline"
              onMouseEnter={prefetchHover('/cart')}
              onFocus={prefetchHover('/cart')}
            >
              Carrinho ({mounted ? totalItems : 0})
            </Link>
          </div>
        </div>
        {mobileOpen && (
          <nav
            aria-label="Menu móvel"
            className="md:hidden border-t border-slate-800 bg-slate-950/95"
          >
            <div className="container py-3 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2 hover:text-cyan-400"
                  onMouseEnter={prefetchHover(item.href)}
                  onFocus={prefetchHover(item.href)}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="btn btn-secondary"
                onClick={() => setMobileOpen(false)}
              >
                Entrar
              </Link>
            </div>
          </nav>
        )}
      </header>
      <main id="main-content" className="container py-8">
        {children}
      </main>
      <footer className="border-t border-slate-800 py-10 mt-8 text-sm">
        {/** Arrays extraídos para evitar duplicação e facilitar manutenção (SRP/DRY). */}
        {(() => {
          const institutional = FOOTER_INSTITUTIONAL
          const policies = FOOTER_POLICIES
          const socials = FOOTER_SOCIALS
          return (
            <div className="container grid gap-8 md:grid-cols-4" role="contentinfo">
              <section aria-labelledby="ft-atendimento">
                <h2 id="ft-atendimento" className="font-semibold text-white mb-2">
                  Atendimento
                </h2>
                <p className="text-white">
                  08:00 às 20:00 - Segunda a Sexta;
                  <br />
                  09:00 às 15:00 - Sábado (exceto Dom. e feriados)
                </p>
                <h3 className="font-medium text-white mt-4">Fale conosco</h3>
                <p className="text-white">Chat • contato@devwear.com</p>
              </section>
              <nav aria-labelledby="ft-inst" className="not-prose">
                <h2 id="ft-inst" className="font-semibold text-white mb-2">
                  Institucional
                </h2>
                <ul className="space-y-1 text-white">
                  {institutional.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-cyan-400">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-labelledby="ft-policies" className="not-prose">
                <h2 id="ft-policies" className="font-semibold text-white mb-2">
                  Políticas
                </h2>
                <ul className="space-y-1 text-white">
                  {policies.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-cyan-400">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <section aria-labelledby="ft-redes">
                <h2 id="ft-redes" className="font-semibold text-white mb-2">
                  Apps & Redes
                </h2>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Link href="#" className="btn btn-outline">
                      App Store
                    </Link>
                    <Link href="#" className="btn btn-outline">
                      Google Play
                    </Link>
                  </div>
                  <ul className="flex gap-3 text-white">
                    {socials.map((s) => (
                      <li key={s.href}>
                        <Link href={s.href} className="hover:text-cyan-400">
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          )
        })()}
        <div className="container mt-8 text-white">
          Rua Carlos Gomes, 1321 - Centro, Limeira / SP - CEP: 13480-010 | DevWear® é uma marca
          fictícia para portfolio. Este site usa criptografia SSL. Imagens ilustrativas.
        </div>
        <div className="container mt-2 text-white">
          © {new Date().getFullYear()} DevWear. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
