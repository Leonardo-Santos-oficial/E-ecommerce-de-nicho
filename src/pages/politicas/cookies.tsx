import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { absoluteUrl } from '../../utils/seo'
import LegalPage from '@/components/legal/LegalPage'
import Layout from '@/components/Layout'

// Página de Política de Cookies.
// Mantida simples e focada (SRP) - apenas a renderização e SEO. Qualquer lógica futura de consentimento deve ficar em outro módulo.
export default function CookiesPolicyPage() {
  const canonicalPath = '/politicas/cookies'
  const title = 'Política de Cookies | DevWear'
  const description =
    'Entenda como a DevWear utiliza cookies e tecnologias similares para melhorar sua experiência, personalizar conteúdo, analisar desempenho e garantir segurança.'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: absoluteUrl(canonicalPath),
    about: {
      '@type': 'Thing',
      name: 'Cookies e Tecnologias de Rastreamento',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: absoluteUrl('/') },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Políticas',
          item: absoluteUrl('/politicas/cookies'),
        },
      ],
    },
  }

  return (
    <Layout>
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
        title="Política de Cookies"
        description="Como utilizamos cookies e tecnologias similares para oferecer segurança, personalização e melhoria contínua da experiência."
        updatedAt={new Date()}
      >
        <p>
          Esta Política de Cookies explica o que são cookies, quais tipos utilizamos, para quais
          finalidades e como você pode gerenciar suas preferências. Nosso objetivo é ser
          transparente e oferecer controle sobre sua experiência.
        </p>
        <h2>1. O que são Cookies?</h2>
        <p>
          Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita
          um site. Eles permitem funcionalidades essenciais, facilitam o reconhecimento do seu
          navegador e ajudam a melhorar desempenho e personalização.
        </p>
        <h2>2. Tipos de Cookies que Utilizamos</h2>
        <ul className="leading-relaxed">
          <li>
            <strong>Essenciais:</strong> Necessários para funcionamento básico (ex.: carrinho,
            autenticação, segurança).
          </li>
          <li>
            <strong>Desempenho:</strong> Dados agregados sobre uso para otimização.
          </li>
          <li>
            <strong>Funcionais:</strong> Lembram preferências (idioma, acessibilidade).
          </li>
          <li>
            <strong>Analytics:</strong> Entendimento de navegação com dados anonimizados quando
            possível.
          </li>
          <li>
            <strong>Marketing:</strong> Relevância de ofertas e mensuração de campanhas (com
            consentimento quando exigido).
          </li>
        </ul>
        <h2>3. Base Legal (LGPD)</h2>
        <p>
          Utilizamos cookies com fundamento em: execução de contrato; legítimo interesse
          equilibrado; obrigação legal; e consentimento para categorias não essenciais.
        </p>
        <h2>4. Gestão de Preferências</h2>
        <p>
          Você pode ajustar ou revogar consentimento via navegador ou ferramentas de gerenciamento.
          Bloquear alguns tipos pode limitar funcionalidades.
        </p>
        <h2>5. Cookies de Terceiros</h2>
        <p>
          Podemos utilizar scripts de terceiros (ex.: analytics). Esses provedores tratam dados
          conforme suas próprias políticas — recomendamos revisão desses documentos.
        </p>
        <h2>6. Retenção</h2>
        <p>
          Sessão: expiram ao fechar o navegador. Persistentes: possuem prazo definido ou até
          exclusão manual.
        </p>
        <h2>7. Segurança e Privacidade</h2>
        <p>
          Aplicamos práticas de segurança alinhadas ao mercado. Detalhes adicionais em nossa{' '}
          <Link href="/politicas/privacidade">Política de Privacidade</Link>.
        </p>
        <h2>8. Atualizações</h2>
        <p>
          Revisamos esta política periodicamente para refletir melhorias técnicas e mudanças legais.
        </p>
        <h2>9. Contato</h2>
        <p>
          Dúvidas? <a href="mailto:contato@devwear.com">contato@devwear.com</a>
        </p>
      </LegalPage>
    </Layout>
  )
}
