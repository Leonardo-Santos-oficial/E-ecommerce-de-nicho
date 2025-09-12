import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { absoluteUrl, getSiteUrl } from '@/utils/seo'
import { RawProductsArraySchema } from '@/types/schemas'

// Páginas estáticas conhecidas (manter curto e legível; fácil de estender sem modificar lógica principal -> OCP)
const STATIC_PATHS: string[] = [
  '/',
  '/products',
  '/cart',
  '/checkout',
  '/login',
  '/signup',
  '/termos-de-uso',
  '/politicas/cookies',
  '/politicas/privacidade',
  '/politicas/consumidor',
  '/mapa-do-site',
]

// Gera bloco <url>
function urlNode(loc: string, lastmod?: string): string {
  return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
}

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const site = getSiteUrl()
    const dataFile = path.join(process.cwd(), 'data', 'products.json')
    let productNodes = ''
    if (fs.existsSync(dataFile)) {
      try {
        const raw = fs.readFileSync(dataFile, 'utf-8')
        const parsed = RawProductsArraySchema.safeParse(JSON.parse(raw))
        if (parsed.success) {
          productNodes = parsed.data
            .map((p) => urlNode(absoluteUrl(`/products/${p.slug}`)))
            .join('')
        }
      } catch {
        // Silencia falha de parse; mantemos sitemap funcional com páginas estáticas (SRP / Resiliência)
      }
    }

    const staticNodes = STATIC_PATHS.map((p) => urlNode(`${site}${p}`)).join('')
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticNodes}${productNodes}</urlset>`

    res.setHeader('Content-Type', 'application/xml')
    // Cache leve (1h) - search engines podem aceitar.
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600')
    res.status(200).send(body)
  } catch (e) {
    res.status(500).send('')
  }
}
