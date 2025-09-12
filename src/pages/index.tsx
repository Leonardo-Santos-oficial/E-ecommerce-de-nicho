import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Head from 'next/head'
import { absoluteUrl } from '../utils/seo'
import { Product } from '../types/Product'
import { formatCurrency } from '../utils/format'
import { GetStaticProps } from 'next'
import { RawProductsArraySchema } from '@/types/schemas'
import dynamic from 'next/dynamic'
import Section from '@/components/home/Section'
import ProductsRow from '@/components/home/ProductsRow'
import ProductTags from '@/components/home/ProductTags'
import CategoryCards from '@/components/home/CategoryCards'
import PromoBannerCards from '@/components/home/PromoBannerCards'
import BenefitsBar from '@/components/home/BenefitsBar'
import Countdown from '@/components/home/Countdown'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import TrustBadges from '@/components/home/TrustBadges'
import useRecentlyViewed from '@/hooks/useRecentlyViewed'

// Lazy-load hero and brands to keep LCP light
const HeroCarousel = dynamic(() => import('@/components/home/HeroCarousel'), { ssr: false })
const BrandsStrip = dynamic(() => import('@/components/home/BrandsStrip'), { ssr: false })
const BrandsGrid = dynamic(() => import('@/components/home/BrandsGrid'), { ssr: false })

type HomeProps = {
  featured: Product[]
  bestSellers: Product[]
  recommended: Product[]
}

export default function Home({ featured, bestSellers, recommended }: HomeProps) {
  const pool = [...featured, ...bestSellers, ...recommended]
  const recently = useRecentlyViewed(pool)
  const flashEndsAt = (typeof window !== 'undefined' ? Date.now() : 0) + 4 * 60 * 60 * 1000
  return (
    <>
      <Head>
        <title>DevWear | E-commerce para Devs</title>
        <meta
          name="description"
          content="Vestuário e acessórios para desenvolvedores. Aqui você encontra o que precisa"
        />
        <link rel="canonical" href={absoluteUrl('/')} />
        <meta property="og:title" content="DevWear | E-commerce para Devs" />
        <meta
          property="og:description"
          content="Vestuário e acessórios para desenvolvedores. Aqui você encontra o que precisa"
        />
        <meta property="og:url" content={absoluteUrl('/')} />
      </Head>
      <HeroCarousel />
      <div className="mt-6">
        <BrandsStrip />
      </div>

      <Section title="Benefícios" subtitle="Vantagens de comprar aqui">
        <BenefitsBar />
      </Section>

      <Section title="Explore por tags" subtitle="Navegue por temas populares">
        <ProductTags />
      </Section>

      <Section title="Categorias" subtitle="Encontre por departamento">
        <CategoryCards />
      </Section>

      <Section title="Destaques" subtitle="Seleção curada para você" href="/products">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((p) => (
            <div key={p.id} className="card p-4">
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-white overflow-hidden text-ellipsis mb-2">
                {p.description}
              </p>
              <div className="text-cyan-400 font-semibold">{formatCurrency(p.price)}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Ofertas relâmpago"
        subtitle="Aproveite antes que acabe"
        href="/products?promo=flash"
        right={
          <div className="hidden md:block">
            <Countdown endsAt={flashEndsAt} />
          </div>
        }
      >
        <div className="md:hidden mb-3">
          <Countdown endsAt={flashEndsAt} />
        </div>
        <ProductsRow products={bestSellers} onAdd={() => {}} />
      </Section>

      <Section
        title="Recomendados para você"
        subtitle="Baseado no interesse geral"
        href="/products"
      >
        <ProductsRow products={recommended} onAdd={() => {}} />
      </Section>

      {recently.length > 0 && (
        <Section title="Vistos recentemente" subtitle="Continue de onde parou">
          <ProductsRow products={recently.slice(0, 8)} onAdd={() => {}} />
        </Section>
      )}

      <Section
        title="Coleções em destaque"
        subtitle="Acesse categorias com um clique"
        href="/products"
      >
        <PromoBannerCards />
      </Section>

      <Section title="Marcas parceiras" subtitle="Tecnologias que amamos">
        <BrandsGrid />
      </Section>

      <Section title="Fique por dentro" subtitle="Assine a newsletter e receba ofertas">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <NewsletterSignup />
          </div>
          <div className="md:col-span-1">
            <TrustBadges />
          </div>
        </div>
      </Section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const dataFile = path.join(process.cwd(), 'data', 'products.json')
  const raw = fs.readFileSync(dataFile, 'utf-8')
  const parsed = RawProductsArraySchema.safeParse(JSON.parse(raw))
  const products = (parsed.success ? parsed.data : []).map((p) => ({
    id: String(p.id ?? p.slug),
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: Number(p.price) || 0,
    formattedPrice: formatCurrency(Number(p.price) || 0),
    image: p.image || '/placeholder.svg',
    ...(p.imageAlt ? { imageAlt: p.imageAlt } : {}),
    category: p.category || 'geral',
  }))
  const featured = products
    .slice(0, 4)
    .map((p) => ({ ...p, formattedPrice: formatCurrency(p.price) }))

  const bestSellers = products
    .slice(0, 8)
    .map((p) => ({ ...p, formattedPrice: formatCurrency(p.price) }))
  const recommended = products
    .slice(-8)
    .map((p) => ({ ...p, formattedPrice: formatCurrency(p.price) }))

  return { props: { featured, bestSellers, recommended }, revalidate: 3600 }
}
