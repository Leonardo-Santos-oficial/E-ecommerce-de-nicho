import Image from 'next/image'

const BRANDS = [
  { id: 'js', src: '/brands/js.svg', alt: 'JavaScript' },
  { id: 'ts', src: '/brands/ts.svg', alt: 'TypeScript' },
  { id: 'react', src: '/brands/react.svg', alt: 'React' },
  { id: 'node', src: '/brands/node.svg', alt: 'Node.js' },
]

export default function BrandsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {BRANDS.map((b) => (
        <div key={b.id} className="card p-4 flex items-center justify-center">
          <div className="relative h-8 w-20">
            <Image src={b.src} alt={b.alt} fill className="object-contain" />
          </div>
        </div>
      ))}
    </div>
  )
}
