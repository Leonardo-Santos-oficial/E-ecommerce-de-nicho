# PRD - Front-end E-commerce com Next.js (DevWear)

## 1. Visão Geral do Projeto

* **Nome do Projeto:** DevWear (ou outro nicho a sua escolha, ex: "CoffeeCoders" para cafés).
* **Conceito:** A interface de uma loja virtual "Headless" completa, focada no nicho de vestuário e acessórios para desenvolvedores. A aplicação será estaticamente gerada (SSG) para máxima performance e SEO, utilizando dados "mockados" de um arquivo JSON local.
* **Público-Alvo:** Recrutadores e Engenheiros de Software Sênior.
* **Objetivo Principal:** Demonstrar maestria na construção de uma aplicação web moderna com Next.js, gerenciamento de estado global complexo, e uma aderência rigorosa aos princípios de Clean Code e SOLID para criar um software manutenível, escalável e de alta qualidade.

## 2. Tecnologias Propostas

* **Framework Principal:** **Next.js 14+** (utilizando o App Router ou Pages Router).
* **Linguagem:** TypeScript ou JavaScript (ES6+).
* **Gerenciamento de Estado Global:** **React Context API combinado com o hook `useReducer`**. Essa abordagem é poderosa para gerenciar a lógica complexa do carrinho de compras sem a necessidade de bibliotecas externas.
* **Roteamento:** **Roteador baseado em arquivos do Next.js**. Em vez do `React Router`, usaremos a solução nativa do Next.js (`next/link`, `next/router`), que é integrada com as estratégias de renderização do framework.
* **Estilização:** CSS Modules ou Tailwind CSS (para um desenvolvimento de UI rápido e consistente).
* **Dados:** Arquivo JSON local (`/data/products.json`) servindo como banco de dados mockado.

## 3. Estratégia de Renderização e Performance (Next.js)

Aproveitaremos ao máximo os recursos do Next.js para criar uma aplicação extremamente rápida.

* **Static Site Generation (SSG):**
    * **`getStaticProps`:** As páginas de listagem de produtos e de detalhes do produto serão pré-renderizadas em tempo de build. Isso resulta em um carregamento quase instantâneo para o usuário e excelente SEO.
    * **`getStaticPaths`:** Para as páginas de detalhes (`/products/[slug]`), este método será usado para informar ao Next.js quais rotas dinâmicas devem ser geradas estaticamente no build.

* **Incremental Static Regeneration (ISR):**
    * **`revalidate`:** Utilizaremos a opção `revalidate` em `getStaticProps` (ex: `revalidate: 3600`). Isso permitirá que o Next.js regenere as páginas estáticas em segundo plano (a cada hora, por exemplo), garantindo que os dados (como preço ou estoque) possam ser atualizados sem a necessidade de um novo deploy.

* **Prefetching Automático:**
    * O componente `<Link>` do Next.js será usado para toda a navegação interna. Ele automaticamente faz o *prefetch* das páginas em segundo plano, tornando a navegação entre a home, a lista de produtos e os detalhes do produto instantânea para o usuário.

* **Renderização no Cliente (CSR):** O estado do carrinho de compras e interações de filtro na página serão gerenciados no lado do cliente, pois são específicos de cada sessão de usuário.

## 4. Princípios de Código e Arquitetura (Clean Code & SOLID)

A adesão a estes princípios é um requisito **não-funcional** mandatório para o projeto.

### Princípios Fundamentais (Clean Code)

* **Legibilidade e Clareza:** O código será escrito para ser autoexplicativo. Comentários serão usados para explicar o "porquê" de uma decisão complexa, não o "o quê" o código faz.
* **Nomes Significativos:** Variáveis como `const [cartItems, setCartItems]` serão usadas em vez de `const [c, setC]`. Funções terão nomes que descrevem sua ação, como `handleAddItemToCart(product)`.
* **Funções Pequenas e Focadas:** Uma função não deve exceder 20-30 linhas. Funções de componentes serão focadas em uma única tarefa (ex: uma para buscar dados, outra para renderizar um item da lista).
* **Simplicidade (KISS - Keep It Simple, Stupid):** Evitaremos abstrações prematuras ou complexidade desnecessária. A solução mais simples que resolve o problema será sempre a preferida.
* **Não se Repita (DRY - Don't Repeat Yourself):** Lógica de formatação de moeda, por exemplo, será extraída para uma função utilitária em `/utils` e reutilizada em toda a aplicação. Componentes como `Button` ou `Card` serão genéricos e reutilizáveis.

### Princípios Avançados (SOLID)

* **(SRP) Princípio da Responsabilidade Única:**
    * Um componente `ProductCard` será responsável apenas por exibir os dados de um produto. A lógica de "adicionar ao carrinho" será passada via props, vinda do nosso `CartContext`.
    * O `CartContext` terá a única responsabilidade de gerenciar o estado e as ações do carrinho.
* **(OCP) Princípio do Aberto/Fechado:**
    * Nosso sistema de filtros poderá ser estendido para novos tipos de filtro (ex: por cor, tamanho) sem modificar o componente de listagem de produtos existente.
* **(LSP) Princípio da Substituição de Liskov:** Em um contexto de React, isso se traduz em componentes que podem ser substituídos por variações (componentes mais específicos) sem quebrar a UI, desde que mantenham a mesma "interface" de props.
* **(ISP) Princípio da Segregação de Interfaces:**
    * Criaremos hooks customizados (ex: `useCart`) que expõem apenas as funções e o estado necessários para o componente que o consome, em vez de expor todo o contexto do carrinho de uma só vez.
* **(DIP) Princípio da Inversão de Dependência:**
    * Nossos componentes de UI não dependerão diretamente da implementação da lógica do carrinho. Eles dependerão da "abstração" fornecida pelo `CartContext`. Se um dia quisermos trocar o Context pelo Redux, os componentes de UI não precisarão ser alterados.

## 5. Detalhamento das Funcionalidades

* **Página Inicial (`/`):**
    * Renderizada estaticamente (SSG).
    * Exibe uma seleção de produtos em destaque.
* **Página de Produtos (`/products`):**
    * Renderizada estaticamente (SSG) com revalidação (ISR).
    * Exibe todos os produtos em um grid.
    * Funcionalidade de filtro no lado do cliente (por categoria, faixa de preço).
* **Página de Detalhes do Produto (`/products/[slug]`):**
    * Rotas geradas estaticamente via `getStaticPaths` e `getStaticProps`.
    * Exibe todas as informações do produto: imagens, descrição, preço.
    * Botão "Adicionar ao Carrinho".
* **Carrinho de Compras (`/cart`):**
    * Página renderizada no cliente.
    * Lista os itens adicionados, permitindo ao usuário:
        * Alterar a quantidade de cada item.
        * Remover um item.
        * Ver o subtotal e o total do pedido.
* **(Diferencial) Persistência do Carrinho:**
    * O estado do carrinho será salvo no `localStorage` do navegador.
    * Isso será feito dentro de um `useEffect` para garantir que o código só rode no client-side, evitando erros de "window is not defined" durante a renderização no servidor do Next.js.

## 6. Orientações para Usar a IA como Assistente

> **Exemplos de Prompts:**
>
> * **Next.js:** "Como implemento `getStaticProps` junto com `getStaticPaths` para uma página de detalhes de produto (`/pages/products/[slug].js`) em Next.js, lendo os dados de um arquivo JSON local?"
> * **State Management:** "Me dê um exemplo de como criar um `CartContext` usando os hooks `useContext` e `useReducer` para gerenciar ações como `ADD_ITEM`, `REMOVE_ITEM` e `UPDATE_QUANTITY`."
> * **Clean Code:** "Pode refatorar este componente React para seguir o Princípio da Responsabilidade Única (SRP)?"
> * **LocalStorage em Next.js:** "Como faço para persistir o estado do meu carrinho no `localStorage` de forma segura em um app Next.js, evitando erros de SSR?"

## 7. Próximos Passos

1.  **Setup do Projeto:** Iniciar um novo projeto com `npx create-next-app@latest`.
2.  **Estrutura de Dados:** Criar o arquivo `products.json` com uma lista de pelo menos 10 produtos mockados.
3.  **Contexto do Carrinho:** Implementar a estrutura inicial do `CartContext` usando `useReducer`.
4.  **Primeira Página Estática:** Implementar a página de listagem de produtos (`/products`), buscando os dados do JSON via `getStaticProps`.