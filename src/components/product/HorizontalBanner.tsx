import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  src: string
  alt: string
  href?: string
}

export default function HorizontalBanner({ src, alt, href }: Props) {
  const content = (
    <div className="relative w-full rounded-lg overflow-hidden bg-slate-800 aspect-[3/1] md:aspect-[4/1] lg:aspect-[5/1]">
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
    </div>
  )
  return href ? (
    <Link href={href} aria-label={alt}>
      {content}
    </Link>
  ) : (
    content
  )
}
