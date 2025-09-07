import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Layout from '../components/Layout'
import Head from 'next/head'
import { absoluteUrl } from '../utils/seo'
import { Product } from '../types/Product'
import { formatCurrency } from '../utils/format'
import { GetStaticProps } from 'next'

export default function Home({ featured }: { featured: Product[] }) {
  return (
    <Layout>
      <Head>
        <title>DevWear | E-commerce para Devs</title>
        <meta name="description" content="Vestuário e acessórios para desenvolvedores. Aqui você encontra o que precisa" />
        <link rel="canonical" href={absoluteUrl('/')} />
        <meta property="og:title" content="DevWear | E-commerce para Devs" />
        <meta property="og:description" content="Vestuário e acessórios para desenvolvedores. Aqui você encontra o que precisa" />
        <meta property="og:url" content={absoluteUrl('/')} />
      </Head>
      <section className="py-8">
        <h1 className="text-3xl font-bold mb-2">DevWear</h1>
        <p className="text-slate-400 mb-6">Vestuário e acessórios para desenvolvedores. Aqui você encontra o que precisa</p>
        <Link href="/products" className="btn btn-primary">Ver todos os produtos</Link>
      </section>
      <section className="py-8">
        <h2 className="text-xl font-semibold mb-4">Destaques</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map(p => (
            <div key={p.id} className="card p-4">
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-slate-400 overflow-hidden text-ellipsis mb-2">{p.description}</p>
              <div className="text-cyan-400 font-semibold">{formatCurrency(p.price)}</div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const dataFile = path.join(process.cwd(), 'data', 'products.json')
  const raw = fs.readFileSync(dataFile, 'utf-8')
  const products = JSON.parse(raw) as Product[]
  const featured = products.slice(0, 4).map(p => ({ ...p, formattedPrice: formatCurrency(p.price) }))

  return { props: { featured }, revalidate: 3600 }
}
