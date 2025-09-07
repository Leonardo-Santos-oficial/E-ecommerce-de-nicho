import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import { CartProvider } from '../context/CartContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>DevWear</title>
        <meta name="description" content="Loja de vestuário e acessórios para desenvolvedores" />
      </Head>
      <Component {...pageProps} />
    </CartProvider>
  )
}
