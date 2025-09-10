import Link from 'next/link'
import { ReactNode } from 'react'

type SectionProps = {
  title: string
  subtitle?: string
  href?: string
  children: ReactNode
  right?: ReactNode
}

export default function Section({ title, subtitle, href, children, right }: SectionProps) {
  return (
    <section className="py-8">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-white">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3 ml-3 shrink-0">
          {right}
          {href && (
            <Link href={href} className="text-cyan-400 hover:underline text-sm whitespace-nowrap">
              Ver tudo →
            </Link>
          )}
        </div>
      </div>
      {children}
    </section>
  )
}
