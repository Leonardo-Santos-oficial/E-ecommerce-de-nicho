import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { absoluteUrl } from '../../utils/seo'
import LegalPage from '@/components/legal/LegalPage'

// Página de referência resumida do Código de Defesa do Consumidor (CDC) aplicada ao contexto da loja.
export default function ConsumerRightsPage() {
  const canonicalPath = '/politicas/consumidor'
  const title = 'Código de Defesa do Consumidor | DevWear'
  const description =
    'Conheça seus direitos como consumidor na DevWear: garantias, arrependimento, trocas, suporte, segurança e canais de atendimento conforme o Código de Defesa do Consumidor.'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: absoluteUrl(canonicalPath),
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Qual o prazo de arrependimento?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Você tem até 7 dias corridos após o recebimento para solicitar o arrependimento de compra (devolução) conforme art. 49 do CDC.',
          },
        },
        {
          '@type': 'Question',
          name: 'Como funcionam trocas por defeito?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Dentro do prazo legal de garantia, analisamos o produto e providenciamos troca ou restituição conforme o caso.',
          },
        },
      ],
    },
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={absoluteUrl(canonicalPath)} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={absoluteUrl(canonicalPath)} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <LegalPage
        title="Código de Defesa do Consumidor"
        description="Resumo prático dos principais direitos: arrependimento, garantias, trocas, transparência, canais de suporte e prevenção a fraudes."
        updatedAt={new Date()}
      >
        <p>
          Este resumo destaca pontos centrais do Código de Defesa do Consumidor (Lei 8.078/90)
          aplicáveis às suas compras na DevWear. Não substitui o texto legal integral, mas facilita
          entendimento e transparência.
        </p>
        <h2>1. Princípios Básicos</h2>
        <p>
          O CDC protege a parte vulnerável na relação: o consumidor. A DevWear adota clareza
          informacional, segurança transacional e suporte efetivo pós-venda.
        </p>
        <h2>2. Direito de Arrependimento</h2>
        <p>
          Até 7 dias corridos após o recebimento (art. 49). Solicite com número do pedido. Reembolso
          após conferência do produto em condições adequadas.
        </p>
        <h2>3. Garantia e Defeitos</h2>
        <p>
          Defeitos de fabricação dentro do prazo legal ou contratual: reparo, troca ou restituição
          proporcional. Mau uso não é coberto.
        </p>
        <h2>4. Trocas por Tamanho/Preferência</h2>
        <p>
          Seguem política interna apresentada no ato da compra. Exigimos conservação de etiquetas e
          embalagem.
        </p>
        <h2>5. Informações Claras</h2>
        <p>
          Fichas de produto incluem descrição, composição, preço e orientações. Divergência evidente
          favorece o menor preço anunciado, conforme boa-fé.
        </p>
        <h2>6. Privacidade & Segurança</h2>
        <p>
          Tratamento de dados conforme{' '}
          <Link href="/politicas/privacidade">Política de Privacidade</Link>; uso de criptografia e
          controles de acesso.
        </p>
        <h2>7. Publicidade</h2>
        <p>
          Ofertas válidas enquanto condições e estoque vigentes. Promoções podem ser ajustadas com
          regras prévias claras.
        </p>
        <h2>8. Canais de Atendimento</h2>
        <p>
          E-mail <a href="mailto:contato@devwear.com">contato@devwear.com</a> e chat. Reclamações
          priorizadas para solução célere.
        </p>
        <h2>9. Prevenção a Fraudes</h2>
        <p>
          Verificações antifraude podem reter temporariamente pedidos suspeitos visando proteção
          mútua.
        </p>
        <h2>10. Escalonamento</h2>
        <p>
          Persistindo conflito, órgãos como Procon podem ser acionados. Buscamos sempre acordo
          amigável antes.
        </p>
        <h2>11. Atualizações</h2>
        <p>Revisões refletem mudanças legais ou melhorias processuais.</p>
        <h2>12. Referência</h2>
        <p>Leia o texto integral em fontes oficiais para aprofundamento.</p>
      </LegalPage>
    </>
  )
}
