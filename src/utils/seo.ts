export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || ''
  const cleaned = raw.trim().replace(/\/$/, '')
  return cleaned || 'http://localhost:3000'
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl()
  if (!path) return base
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
