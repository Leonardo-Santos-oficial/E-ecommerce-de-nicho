// Navegação centralizada (SRP + OCP). Facilita reuso entre Layout, sitemap, footer e testes.
import type { SiteMapSection } from '@/types/sitemap'

export const NAV_PRIMARY: { href: string; label: string }[] = [
  { href: '/', label: 'Início' },
  { href: '/products', label: 'Produtos' },
]

export const FOOTER_INSTITUTIONAL: { href: string; label: string }[] = [
  { href: '/sobre', label: 'Sobre a DevWear' },
  { href: '/blog', label: 'Blog' },
  { href: '/parcerias', label: 'Parcerias' },
  { href: '/trabalhe-conosco', label: 'Trabalhe Conosco' },
  { href: '/acessibilidade', label: 'Acessibilidade' },
  { href: '/mapa-do-site', label: 'Mapa do Site' },
]

export const FOOTER_POLICIES: { href: string; label: string }[] = [
  { href: '/politicas/cookies', label: 'Políticas de Cookies' },
  { href: '/politicas/privacidade', label: 'Políticas de Privacidade' },
  { href: '/termos-de-uso', label: 'Termos de Uso' },
  { href: '/politicas/consumidor', label: 'Código de Defesa do Consumidor' },
]

export const FOOTER_SOCIALS: { href: string; label: string }[] = [
  { href: 'https://www.instagram.com/devwear', label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/devwear', label: 'LinkedIn' },
]

// Seções para o mapa do site (exclui páginas transacionais / auth)
export const SITE_MAP_SECTIONS_CONFIG: SiteMapSection[] = [
  {
    id: 'institucional',
    title: 'Institucional',
    icon: '🏢',
    links: [
      { href: '/', label: 'Início', description: 'Página principal e destaques' },
      { href: '/products', label: 'Produtos', description: 'Catálogo completo' },
    ],
  },
  {
    id: 'politicas',
    title: 'Políticas',
    icon: '📜',
    links: [
      {
        href: '/politicas/privacidade',
        label: 'Política de Privacidade',
        description: 'Dados e privacidade',
      },
      { href: '/politicas/cookies', label: 'Política de Cookies', description: 'Uso de cookies' },
      { href: '/termos-de-uso', label: 'Termos de Uso', description: 'Regras de utilização' },
      {
        href: '/politicas/consumidor',
        label: 'Código de Defesa do Consumidor',
        description: 'Direitos do cliente',
      },
    ],
  },
  {
    id: 'util',
    title: 'Utilitários',
    icon: '🧭',
    links: [{ href: '/mapa-do-site', label: 'Mapa do Site', description: 'Você está aqui' }],
  },
]
