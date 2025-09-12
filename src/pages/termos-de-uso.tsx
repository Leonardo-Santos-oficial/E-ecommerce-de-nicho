import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { absoluteUrl } from '../utils/seo'
import LegalPage from '@/components/legal/LegalPage'
import Layout from '@/components/Layout'

export default function TermsOfUsePage() {
  const title = 'Termos de Uso | DevWear'
  const description =
    'Leia os Termos de Uso da DevWear para entender as condições de uso do site e dos serviços oferecidos.'
  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={absoluteUrl('/termos-de-uso')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={absoluteUrl('/termos-de-uso')} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <LegalPage
        title="Termos de Uso"
        description="Condições para utilização do site e serviços DevWear: responsabilidades, segurança, propriedade intelectual e suporte."
        updatedAt={new Date()}
      >
        <p>
          Ao acessar a DevWear você concorda com estes Termos. Recomendamos leitura integral antes
          de utilizar funcionalidades como cadastro, compra e avaliação de produtos.
        </p>
        <h2>1. Uso do Site</h2>
        <p>
          Utilize de forma lícita, sem interferir na experiência de outros usuários, sem tentativa
          de engenharia reversa ou exploração de vulnerabilidades.
        </p>
        <h2>2. Conta e Segurança</h2>
        <p>
          Credenciais são pessoais e intransferíveis. Notifique-nos em caso de suspeita de acesso
          não autorizado. Podemos aplicar medidas de proteção e bloqueio preventivo.
        </p>
        <h2>3. Compras e Pagamentos</h2>
        <p>
          Valores e condições podem variar. Pedidos dependem de autorização de pagamento e
          disponibilidade de estoque. Em divergências evidentes, buscamos solução justa alinhada à
          boa-fé.
        </p>
        <h2>4. Propriedade Intelectual</h2>
        <p>
          Marcas, layout, código e conteúdo são protegidos por legislação de direitos autorais e
          propriedade industrial. Uso não autorizado é vedado.
        </p>
        <h2>5. Privacidade</h2>
        <p>
          Tratamento de dados conforme nossa{' '}
          <Link href="/politicas/privacidade">Política de Privacidade</Link>.
        </p>
        <h2>6. Limitação de Responsabilidade</h2>
        <p>
          Empregamos esforços razoáveis para disponibilidade e segurança, sem garantia de operação
          ininterrupta. Não respondemos por perdas indiretas decorrentes de uso indevido.
        </p>
        <h2>7. Alterações dos Termos</h2>
        <p>
          Podemos atualizar estes Termos para refletir mudanças técnicas, legais ou de negócio.
          Versões relevantes serão comunicadas quando houver impacto significativo.
        </p>
        <h2>8. Contato</h2>
        <p>
          Suporte e esclarecimentos: <a href="mailto:contato@devwear.com">contato@devwear.com</a>
        </p>
      </LegalPage>
    </Layout>
  )
}
