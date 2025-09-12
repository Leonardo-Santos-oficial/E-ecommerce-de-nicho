import { GetServerSideProps } from 'next'
import { absoluteUrl, getSiteUrl } from '@/utils/seo'
import { loadProducts } from '@/lib/products'

// Páginas estáticas conhecidas (curto e extensível via adição sem mudar lógica) -> OCP
const STATIC_PATHS: string[] = [
  '/',
  '/products',
  '/termos-de-uso',
  '/politicas/cookies',
  '/politicas/privacidade',
  '/politicas/consumidor',
  '/mapa-do-site',
]

// Produz um bloco <url>
function urlNode(loc: string, lastmod?: string): string {
  return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const site = getSiteUrl()
  const products = loadProducts()

  // Obtém mtime do arquivo de produtos (fallback: now) sem importar fs em tempo de build do client
  let lastmodProductsISO = new Date().toISOString()
  try {
    const { statSync } = await import('fs')
    const dataFile = process.cwd() + '/data/products.json'
    const stat = statSync(dataFile)
    lastmodProductsISO = stat.mtime.toISOString()
  } catch {
    // Silencia: se não conseguir ler, continuamos sem prejudicar o sitemap
  }

  const productNodes = products
    .map((p) => urlNode(absoluteUrl(`/products/${p.slug}`), lastmodProductsISO))
    .join('')

  // Usamos o mesmo lastmod para páginas estáticas (alternativa futura: timestamps dedicados)
  const staticNodes = STATIC_PATHS.map((p) => urlNode(`${site}${p}`, lastmodProductsISO)).join('')
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticNodes}${productNodes}</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600')
  res.write(body)
  res.end()
  return { props: {} }
}

// Página vazia: resposta já enviada no SSR
export default function SiteMap() {
  return null
}
