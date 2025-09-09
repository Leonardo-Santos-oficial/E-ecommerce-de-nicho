import Link from 'next/link'
import Head from 'next/head'
import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '../hooks/useCart'
import { absoluteUrl } from '../utils/seo'

export default function Layout({ children }: { children: ReactNode }) {
  const { totalItems } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const router = useRouter()

  const prefetchHover = (href: string) => () => {
    router.prefetch(href, undefined, { priority: true }).catch(() => {})
  }

  const [mobileOpen, setMobileOpen] = useState(false)

  // Navegação principal do site. Scout Rule aplicado: corrigido typo em "/products" e chave label.
  const navItems = [
    { href: '/', label: 'Início' },
    { href: '/products', label: 'Produtos' },
  ]

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
              contactPoint: [{
                '@type': 'ContactPoint',
                telephone: '+55-11-0000-0000',
                contactType: 'customer service',
                areaServed: 'BR',
                availableLanguage: ['Portuguese']
              }],
              sameAs: [
                'https://www.instagram.com/devwear',
                'https://www.linkedin.com/company/devwear'
              ]
            })
          }}
        />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SiteNavigationElement',
                name: navItems.map(n => n.label),
                url: navItems.map(n => absoluteUrl(n.href)),
              }),
            }}
          />
      </Head>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-slate-800 focus:text-white focus:px-3 focus:py-2 rounded">Pular para o conteúdo</a>
        <header className="border-b border-slate-800 sticky top-0 backdrop-blur bg-slate-950/70 z-50">
          <div className="container flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded hover:bg-slate-800"
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(o => !o)}
              >
                <span className="i-[hamburger]">{mobileOpen ? '✕' : '☰'}</span>
              </button>
              <Link href="/" className="text-xl font-semibold tracking-tight" onMouseEnter={prefetchHover('/')} onFocus={prefetchHover('/')}>DevWear</Link>
            </div>
            <nav aria-label="Primária" className="hidden md:flex items-center gap-4">
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className="hover:text-cyan-400" onMouseEnter={prefetchHover(item.href)} onFocus={prefetchHover(item.href)}>{item.label}</Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn btn-secondary hidden sm:inline-flex" onMouseEnter={prefetchHover('/login')} onFocus={prefetchHover('/login')}>Entrar</Link>
              <Link href="/cart" className="btn btn-outline" onMouseEnter={prefetchHover('/cart')} onFocus={prefetchHover('/cart')}>Carrinho ({mounted ? totalItems : 0})</Link>
            </div>
          </div>
          {mobileOpen && (
            <nav aria-label="Menu móvel" className="md:hidden border-t border-slate-800 bg-slate-950/95">
              <div className="container py-3 flex flex-col gap-2">
                {navItems.map(item => (
                  <Link key={item.href} href={item.href} className="py-2 hover:text-cyan-400" onMouseEnter={prefetchHover(item.href)} onFocus={prefetchHover(item.href)} onClick={() => setMobileOpen(false)}>{item.label}</Link>
                ))}
                <Link href="/login" className="btn btn-secondary" onMouseEnter={prefetchHover('/login')} onFocus={prefetchHover('/login')} onClick={() => setMobileOpen(false)}>Entrar</Link>
              </div>
            </nav>
          )}
        </header>
        <main id="main-content" className="container py-8">{children}</main>
      <footer className="border-t border-slate-800 py-10 mt-8 text-sm">
        <div className="container grid gap-8 md:grid-cols-4">
          <section>
            <h2 className="font-semibold text-slate-200 mb-2">Atendimento</h2>
            <p className="text-slate-400">08:00 às 20:00 - Segunda a Sexta;<br/>09:00 às 15:00 - Sábado (exceto Dom. e feriados)</p>
            <h3 className="font-medium text-slate-300 mt-4">Fale conosco</h3>
            <p className="text-slate-400">Chat • contato@devwear.com</p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-200 mb-2">Institucional</h2>
            <ul className="space-y-1 text-slate-400">
              <li><Link href="/sobre" className="hover:text-cyan-400">Sobre a DevWear</Link></li>
              <li><Link href="/blog" className="hover:text-cyan-400">Blog</Link></li>
              <li><Link href="/parcerias" className="hover:text-cyan-400">Parcerias</Link></li>
              <li><Link href="/trabalhe-conosco" className="hover:text-cyan-400">Trabalhe Conosco</Link></li>
              <li><Link href="/acessibilidade" className="hover:text-cyan-400">Acessibilidade</Link></li>
              <li><Link href="/mapa-do-site" className="hover:text-cyan-400">Mapa do Site</Link></li>
            </ul>
          </section>
          <section>
            <h2 className="font-semibold text-slate-200 mb-2">Políticas</h2>
            <ul className="space-y-1 text-slate-400">
              <li><Link href="/politicas/cookies" className="hover:text-cyan-400">Políticas de Cookies</Link></li>
              <li><Link href="/politicas/privacidade" className="hover:text-cyan-400">Políticas de Privacidade</Link></li>
              <li><Link href="/termos-de-uso" className="hover:text-cyan-400">Termos de Uso</Link></li>
              <li><Link href="/politicas/consumidor" className="hover:text-cyan-400">Código de Defesa do Consumidor</Link></li>
            </ul>
          </section>
          <section>
            <h2 className="font-semibold text-slate-200 mb-2">Apps & Redes</h2>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Link href="#" className="btn btn-outline">App Store</Link>
                <Link href="#" className="btn btn-outline">Google Play</Link>
              </div>
              <div className="flex gap-3 text-slate-400">
                <Link href="https://www.instagram.com/devwear" className="hover:text-cyan-400">Instagram</Link>
                <Link href="https://www.linkedin.com/company/devwear" className="hover:text-cyan-400">LinkedIn</Link>
              </div>
            </div>
          </section>
        </div>
        <div className="container mt-8 text-slate-500">
          Rua Carlos Gomes, 1321 - Centro, Limeira / SP - CEP: 13480-010 | DevWear® é uma marca fictícia para portfolio. Este site usa criptografia SSL. Imagens ilustrativas.
        </div>
        <div className="container mt-2 text-slate-600">© {new Date().getFullYear()} DevWear. Todos os direitos reservados.</div>
      </footer>
    </div>
  )
}
