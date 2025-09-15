import React, { useState } from 'react'
import Image from 'next/image'

type Props = {
  images: string[]
  alt: string
}

export default function ProductGallery({ images, alt }: Props) {
  const safeImages = images && images.length > 0 ? images : ['/placeholder.svg']
  const [current, setCurrent] = useState(0)
  const [fallbacks, setFallbacks] = useState<Record<number, boolean>>({})

  const mainSrc = fallbacks[current] ? '/placeholder.svg' : safeImages[current]

  return (
    <div className="w-full">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-800">
        <Image
          src={mainSrc}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          onError={() => setFallbacks((f) => ({ ...f, [current]: true }))}
        />
      </div>
      {safeImages.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {safeImages.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setCurrent(idx)}
              className={`relative aspect-square rounded overflow-hidden border ${
                current === idx ? 'border-cyan-400' : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <Image
                src={fallbacks[idx] ? '/placeholder.svg' : src}
                alt={`${alt} miniatura ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                onError={() => setFallbacks((f) => ({ ...f, [idx]: true }))}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
