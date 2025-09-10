import Image from 'next/image'

const BRANDS = [
  { id: 'js', src: '/brands/js.svg', alt: 'JavaScript' },
  { id: 'ts', src: '/brands/ts.svg', alt: 'TypeScript' },
  { id: 'react', src: '/brands/react.svg', alt: 'React' },
  { id: 'node', src: '/brands/node.svg', alt: 'Node.js' },
]

export default function BrandsStrip() {
  return (
    <section className="py-6">
      <div className="flex items-center justify-center gap-8 opacity-90">
        {BRANDS.map((b) => (
          <div key={b.id} className="relative h-8 w-20">
            <Image src={b.src} alt={b.alt} fill className="object-contain" />
          </div>
        ))}
      </div>
    </section>
  )
}
