import { useEffect, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { absoluteUrl } from '../../utils/seo'
import fs from 'fs'
import path from 'path'
import { GetStaticPaths, GetStaticProps } from 'next'
import { RawProductsArraySchema } from '@/types/schemas'
import { formatCurrency } from '../../utils/format'
import { useCart } from '../../hooks/useCart'
import type { Product as CartProduct } from '../../types/Product'
import type { Product as AppProduct } from '../../types/Product'
import ProductGallery from '../../components/product/ProductGallery'
import ProductInfo from '../../components/product/ProductInfo'
import ProductActions from '../../components/product/ProductActions'
import { useRouter } from 'next/router'
import FrequentlyBoughtTogether from '../../components/product/FrequentlyBoughtTogether'
import HorizontalBanner from '../../components/product/HorizontalBanner'
import ProductDetailsTabs from '../../components/product/ProductDetailsTabs'
import ReviewsTab from '../../components/product/ReviewsTab'
import RelatedProducts from '../../components/product/RelatedProducts'
import { recordView } from '@/hooks/useRecentlyViewed'

// Local type for SEO-rich product detail page (per requirements)
type SEOProduct = {
  id: number
  slug: string
  name: string
  shortDescription: string
  description: string
  price: number
  imageUrl: string
  imageAlt?: string | null
  images: string[]
  category: string
  brand: { name: string }
  sku: string
  availability: 'https://schema.org/InStock' | 'https://schema.org/OutOfStock'
  rating: { value: number; count: number }
}

interface ProductPageProps {
  product: SEOProduct
  related: AppProduct[]
}

export default function ProductDetail({ product, related }: ProductPageProps) {
  const { addItem } = useCart()
  const router = useRouter()

  const formattedPrice = useMemo(() => formatCurrency(product.price), [product.price])

  // Record recently viewed for home usage
  useEffect(() => {
    recordView(product.slug)
  }, [product.slug])

  // Map SEO product into cart product shape used by CartContext
  const cartProduct: CartProduct = useMemo(
    () => ({
      id: product.sku,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      formattedPrice,
      image: product.imageUrl,
      category: product.category,
    }),
    [product, formattedPrice]
  )

  const fbtSuggestions = useMemo(
    () =>
      related.slice(0, 2).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        formattedPrice: p.formattedPrice,
        image: p.image,
      })),
    [related]
  )

  return (
    <>
      <Head>
        {/* Title + Meta Description (CTR) */}
        <title>{`${product.name} | DevWear`}</title>
        <meta name="description" content={product.shortDescription} />
        {/* Canonical and social cards */}
        <link rel="canonical" href={absoluteUrl(`/products/${product.slug}`)} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.name} | DevWear`} />
        <meta property="og:description" content={product.shortDescription} />
        <meta property="og:url" content={absoluteUrl(`/products/${product.slug}`)} />
        <meta property="og:image" content={absoluteUrl(product.imageUrl || '/placeholder.svg')} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | DevWear`} />
        <meta name="twitter:description" content={product.shortDescription} />
        <meta name="twitter:image" content={absoluteUrl(product.imageUrl || '/placeholder.svg')} />
        {/* Product JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name,
              image: (product.images && product.images.length
                ? product.images
                : [product.imageUrl || '/placeholder.svg']
              ).map((u) => absoluteUrl(u)),
              description: product.description,
              sku: product.sku,
              brand: { '@type': 'Brand', name: product.brand.name },
              offers: {
                '@type': 'Offer',
                priceCurrency: 'BRL',
                price: product.price,
                availability: product.availability,
                url: absoluteUrl(`/products/${product.slug}`),
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating.value,
                reviewCount: product.rating.count,
              },
            }),
          }}
        />
      </Head>
      <article className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left = Gallery */}
        <ProductGallery
          images={product.images && product.images.length ? product.images : [product.imageUrl]}
          alt={
            product.imageAlt ||
            `Imagem do produto ${product.name} - ${product.category} da marca ${product.brand.name}`
          }
        />

        {/* Right = Info + Actions */}
        <div className="space-y-6">
          <ProductInfo
            name={product.name}
            rating={product.rating}
            price={{ current: formattedPrice }}
            shortDescription={product.shortDescription}
          />
          <ProductActions
            onBuyNow={(qty) => {
              addItem({ ...cartProduct, quantity: qty } as any)
              router.push('/checkout')
            }}
            onAddToCart={(qty) => {
              for (let i = 0; i < qty; i++) addItem(cartProduct)
            }}
          />
          <div>
            <Link href="/products" className="text-white hover:text-cyan-400 text-sm">
              Voltar para produtos
            </Link>
          </div>
        </div>
      </article>

      {/* Content Sections */}
      <section className="mt-12">
        <HorizontalBanner src="/vercel.svg" alt="DevWear Promo" href="/products" />
      </section>

      <ProductDetailsTabs
        technical={
          <div>
            <h2 className="sr-only">Informações Técnicas</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white">
              <li>
                <span className="text-white">Categoria:</span> {product.category}
              </li>
              <li>
                <span className="text-white">Marca:</span> {product.brand.name}
              </li>
              <li>
                <span className="text-white">SKU:</span> {product.sku}
              </li>
              <li>
                <span className="text-white">Disponibilidade:</span>{' '}
                {product.availability === 'https://schema.org/InStock'
                  ? 'Em estoque'
                  : 'Indisponível'}
              </li>
              <li className="sm:col-span-2">
                <span className="text-white">Descrição:</span> {product.description}
              </li>
            </ul>
          </div>
        }
        reviews={<ReviewsTab ratingSummary={product.rating} reviews={[]} />}
      />

      <FrequentlyBoughtTogether
        current={{
          id: product.sku,
          name: product.name,
          price: product.price,
          formattedPrice,
          image: product.imageUrl,
        }}
        suggestions={fbtSuggestions}
      />

      <RelatedProducts products={related} onAdd={(p) => addItem(p)} />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dataFile = path.join(process.cwd(), 'data', 'products.json')
  const raw = fs.readFileSync(dataFile, 'utf-8')
  const parsed = RawProductsArraySchema.safeParse(JSON.parse(raw))
  const products = parsed.success ? parsed.data : []

  return {
    paths: products.map((p) => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<ProductPageProps> = async ({ params }) => {
  const slug = params?.slug as string
  const dataFile = path.join(process.cwd(), 'data', 'products.json')
  const raw = fs.readFileSync(dataFile, 'utf-8')
  const parsed = RawProductsArraySchema.safeParse(JSON.parse(raw))
  const rawProducts = parsed.success ? parsed.data : []

  const index = rawProducts.findIndex((p) => p.slug === slug)
  const rawProduct = index >= 0 ? rawProducts[index] : null

  if (!rawProduct) return { notFound: true }

  // Helpers
  const toShort = (text: string, max = 160) => {
    if (!text) return ''
    const clean = String(text).replace(/\s+/g, ' ').trim()
    return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean
  }

  const product: SEOProduct = {
    id: index + 1, // derive numeric id for the SEO type
    slug: rawProduct.slug,
    name: rawProduct.name,
    shortDescription: toShort(rawProduct.description),
    description: rawProduct.description,
    price: Number(rawProduct.price) || 0,
    imageUrl: rawProduct.image || '/placeholder.svg',
    imageAlt: rawProduct.imageAlt ?? null,
    images:
      Array.isArray(rawProduct.images) && rawProduct.images.length
        ? rawProduct.images
        : [rawProduct.image || '/placeholder.svg'],
    category: rawProduct.category || 'geral',
    brand: { name: 'DevWear' },
    sku: (rawProduct as any).sku || rawProduct.id || rawProduct.slug,
    availability: 'https://schema.org/InStock',
    rating: {
      value: 4.8,
      count: 24,
    },
  }

  // Build related products list (same category, excluding current)
  const relatedRaw = rawProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 8)

  const related: AppProduct[] = relatedRaw.map((p: any) => ({
    id: String(p.id ?? p.slug),
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: Number(p.price) || 0,
    formattedPrice: formatCurrency(Number(p.price) || 0),
    image: p.image || p.imageUrl || '/placeholder.svg',
    ...(p.imageAlt ? { imageAlt: p.imageAlt as string } : {}),
    category: p.category || 'geral',
  }))

  return { props: { product, related }, revalidate: 3600 }
}
