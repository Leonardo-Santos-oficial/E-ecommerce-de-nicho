import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { absoluteUrl } from '../../utils/seo'
import LegalPage from '@/components/legal/LegalPage'

// Página de Política de Privacidade - responsabilidade única: exibir conteúdo e metadados SEO.
export default function PrivacyPolicyPage() {
  const canonicalPath = '/politicas/privacidade'
  const title = 'Política de Privacidade | DevWear'
  const description =
    'Saiba como a DevWear coleta, utiliza, armazena e protege seus dados pessoais em conformidade com a LGPD. Transparência, segurança e controle para você.'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: absoluteUrl(canonicalPath),
    publisher: {
      '@type': 'Organization',
      name: 'DevWear',
      url: absoluteUrl('/'),
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/vercel.svg'),
      },
    },
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={absoluteUrl(canonicalPath)} />
        <meta name="robots" content="index,follow" />
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
        title="Política de Privacidade"
        description="Como coletamos, usamos, compartilhamos e protegemos seus dados pessoais em conformidade com a LGPD. Transparência e controle para você."
        updatedAt={new Date()}
      >
        <p>
          Esta Política de Privacidade descreve como a DevWear (&quot;nós&quot;) coleta, utiliza,
          compartilha e protege seus dados pessoais e quais são os seus direitos como titular
          conforme a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
        </p>
        <h2>1. Dados que Coletamos</h2>
        <ul>
          <li>
            <strong>Identificação:</strong> nome, e-mail, CPF (quando necessário para emissão
            fiscal), telefone.
          </li>
          <li>
            <strong>Navegação:</strong> IP, logs de acesso, dispositivo, navegador, páginas
            visitadas.
          </li>
          <li>
            <strong>Transacionais:</strong> histórico de pedidos, itens comprados, preferências.
          </li>
          <li>
            <strong>Pagamentos:</strong> processados por intermediadores (não guardamos dados
            completos do cartão).
          </li>
          <li>
            <strong>Comunicação:</strong> mensagens enviadas via suporte ou formulários.
          </li>
        </ul>
        <h2>2. Bases Legais</h2>
        <ul>
          <li>Execução de contrato.</li>
          <li>Consentimento (ex.: newsletter).</li>
          <li>Legítimo interesse balanceado.</li>
          <li>Obrigação legal.</li>
          <li>Exercício regular de direitos.</li>
        </ul>
        <h2>3. Finalidades</h2>
        <ul>
          <li>Processar pedidos e logística.</li>
          <li>Prevenir fraudes e reforçar segurança.</li>
          <li>Melhorar experiência e performance.</li>
          <li>Comunicar novidades mediante consentimento.</li>
          <li>Cumprir obrigações fiscais.</li>
        </ul>
        <h2>4. Compartilhamento</h2>
        <p>
          Com parceiros estritamente necessários (pagamentos, logística, analytics anonimizados,
          antifraude, disparo de e-mail). Não comercializamos dados.
        </p>
        <h2>5. Retenção</h2>
        <p>
          Mantemos apenas pelo tempo necessário às finalidades ou requisitos legais. Dados
          anonimizados podem ser usados para métricas.
        </p>
        <h2>6. Direitos do Titular</h2>
        <ul>
          <li>Acesso e confirmação.</li>
          <li>Correção.</li>
          <li>Anonimização / eliminação.</li>
          <li>Portabilidade.</li>
          <li>Informação sobre compartilhamentos.</li>
          <li>Revogação de consentimento.</li>
          <li>Oposição.</li>
        </ul>
        <p>
          Exercício via <a href="mailto:privacidade@devwear.com">privacidade@devwear.com</a> com
          identificação segura.
        </p>
        <h2>7. Segurança</h2>
        <p>
          Criptografia em trânsito, controles de acesso, monitoramento e boas práticas de
          desenvolvimento. Nenhum sistema é infalível.
        </p>
        <h2>8. Cookies</h2>
        <p>
          Veja detalhes e gestão em nossa <Link href="/politicas/cookies">Política de Cookies</Link>
          .
        </p>
        <h2>9. Transferências Internacionais</h2>
        <p>
          Garantimos salvaguardas contratuais e técnicas adequadas quando houver transferência para
          fora do Brasil.
        </p>
        <h2>10. Encarregado (DPO)</h2>
        <p>
          Contato: <a href="mailto:privacidade@devwear.com">privacidade@devwear.com</a>
        </p>
        <h2>11. Atualizações</h2>
        <p>Revisões periódicas para refletir melhorias ou novas exigências legais.</p>
        <h2>12. Contato</h2>
        <p>
          Dúvidas gerais: <a href="mailto:contato@devwear.com">contato@devwear.com</a>
        </p>
      </LegalPage>
    </>
  )
}
