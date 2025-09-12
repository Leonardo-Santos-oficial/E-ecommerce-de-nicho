// Tipos do mapa do site (reutilizáveis em componentes e geração de dados)
export interface SiteMapLink {
  href: string
  label: string
  description?: string
}
export interface SiteMapSection {
  id: string
  title: string
  icon?: string
  links: SiteMapLink[]
}
