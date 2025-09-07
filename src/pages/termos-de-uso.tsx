import Head from 'next/head'
import { absoluteUrl } from '../utils/seo'

export default function TermsOfUsePage() {
  const title = 'Termos de Uso | DevWear'
  const description = 'Leia os Termos de Uso da DevWear para entender as condições de uso do site e dos serviços oferecidos.'
  return (
    <>
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
      <div className="prose prose-invert max-w-3xl mx-auto py-10">
        <h1>Termos de Uso</h1>
        <p>
          Bem-vindo à DevWear. Ao acessar e usar este site, você concorda com os termos e condições a seguir. Leia com atenção.
        </p>
        <h2>1. Uso do Site</h2>
        <p>
          Você se compromete a utilizar o site de acordo com a legislação aplicável e a não realizar atividades que possam prejudicar a experiência de outros usuários.
        </p>
        <h2>2. Conta e Segurança</h2>
        <p>
          Você é responsável por manter a confidencialidade das credenciais de sua conta e por todas as atividades que ocorram sob ela.
        </p>
        <h2>3. Compras e Pagamentos</h2>
        <p>
          Preços e condições podem mudar sem aviso prévio. As compras estão sujeitas à confirmação e disponibilidade de estoque.
        </p>
        <h2>4. Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo do site, incluindo marcas e elementos visuais, é protegido por direitos autorais e demais leis aplicáveis.
        </p>
        <h2>5. Privacidade</h2>
        <p>
          Consulte nossa <a href="/politicas/privacidade">Política de Privacidade</a> para entender como coletamos e tratamos seus dados pessoais.
        </p>
        <h2>6. Contato</h2>
        <p>
          Em caso de dúvidas sobre estes Termos, entre em contato pelo e-mail contato@devwear.com.
        </p>
        <p className="text-sm text-slate-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </>
  )
}
