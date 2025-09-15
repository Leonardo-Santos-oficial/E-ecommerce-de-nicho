# Guia de Segurança e Hardening

Este documento estabelece diretrizes e um roadmap de segurança para o projeto **DevWear**. Ele será evoluído gradualmente conforme recursos (auth, pagamentos, backoffice) forem adicionados.

## 1. Objetivos

- Proteger dados de usuários e pedidos.
- Minimizar superfície de ataque (XSS, brute force, injection, supply chain).
- Manter base preparada para escalar autenticação e pagamentos de forma segura.
- Fornecer trilha clara de implementação incremental.

## 2. Fases de Implementação

### 2.1 Curto Prazo (Quick Wins)

| Item                      | Ação                                                                                                        | Observações                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| CSP + Headers             | Adicionar cabeçalhos via `middleware.ts`                                                                    | Base inicial, apertar depois             |
| X-Frame / MIME / Referrer | `X-Frame-Options=DENY`, `X-Content-Type-Options=nosniff`, `Referrer-Policy=strict-origin-when-cross-origin` | Clickjacking e leak de origem            |
| Permissions-Policy        | Desabilitar APIs não usadas                                                                                 | geolocation=(), camera=(), microphone=() |
| Sanitização JSON-LD       | Função `safeJsonLd` com escape `<`                                                                          | Previne parsing inesperado               |
| Validação entradas        | Zod em todos os forms (auth já adicionado)                                                                  | DRY + previsível                         |
| Dependências              | Auditoria (`npm audit`) e lockfile versionado                                                               | Criar script `audit:ci`                  |
| Rate limit básico         | Para `/login` e futuras rotas sensíveis                                                                     | In-memory ou Redis depois                |
| Redirecionamentos         | Guardas de rota (checkout sem itens)                                                                        | Já existente                             |
| Erros genéricos auth      | Não revelar se email existe                                                                                 | Em futura implementação real             |

### 2.2 Médio Prazo

| Item                             | Ação                                            | Objetivo                              |
| -------------------------------- | ----------------------------------------------- | ------------------------------------- |
| Rate limiting robusto            | Sliding window + armazenamento externo (Redis)  | Escalabilidade                        |
| Logging estruturado              | JSON + correlation id (`x-request-id`)          | Observabilidade / forense             |
| CSRF                             | Double submit token (se usar cookies de sessão) | Integridade de ações                  |
| Recalcular preços no backend     | Ignorar valores do client                       | Contra manipulação de carrinho        |
| Tabela de coocorrência           | Prepara recomendações sem grafo                 | Evolução futura                       |
| Build hardening                  | Revisar `productionBrowserSourceMaps`           | Evitar exposição de caminhos internos |
| Script de verificação de headers | Teste automatizado                              | Regressão segura                      |

### 2.3 Longo Prazo / Avançado

| Item                           | Ação                                      | Objetivo                 |
| ------------------------------ | ----------------------------------------- | ------------------------ |
| Autenticação completa          | Hash Argon2id / Refresh rotativo          | Segurança de credenciais |
| 2FA                            | TOTP (opcional)                           | Mitigar takeover         |
| Detecção de anomalias          | Analisar padrões (pedidos, falhas login)  | Prevenção de fraude      |
| Sistema de tokens idempotentes | Criar pedidos e pagamentos                | Evitar duplicidade       |
| Webhooks seguros               | Assinatura HMAC + replay guard            | Pagamentos confiáveis    |
| WAF / CDN Rules                | Bloquear padrões maliciosos               | Proteção perimetral      |
| pgvector / recomendação        | Similaridade semântica + grafo secundário | Personalização           |

## 3. Cabeçalhos de Segurança (Base)

Exemplo inicial de `middleware.ts`:

```ts
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  res.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "font-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  )
  return res
}

export const config = {
  matcher: ['/((?!_next/|.*\\.(?:png|svg|ico|jpg|jpeg|webp)|api/health).*)'],
}
```

Refinar CSP depois (remover `'unsafe-inline'` e usar nonce/hash ao modularizar scripts inline).

## 4. Utilidades de Segurança (Planejado)

Arquivo sugerido: `src/utils/security.ts`

```ts
export function safeJsonLd<T>(obj: T) {
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}
export function maskEmail(email: string) {
  const [user, domain] = email.split('@')
  if (!domain) return email
  return user.slice(0, 2) + '***@' + domain
}
```

## 5. Logging & Observabilidade

Estrutura de log futura:

```json
{
  "ts": "2025-09-15T10:15:00Z",
  "level": "INFO",
  "event": "checkout_start",
  "userId": "u123",
  "cartSize": 4
}
```

Boas práticas:

- Não logar senhas, tokens, cartão.
- Adicionar `requestId` por requisição (middleware gera UUID).
- Níveis: INFO, WARN, ERROR, SECURITY.

## 6. Rate Limiting (Futuro)

Pseudo-código:

```ts
class SlidingWindow {
  private buckets = new Map<string, number[]>()
  allow(key: string, limit: number, windowMs: number) {
    const now = Date.now()
    const arr = (this.buckets.get(key) || []).filter((t) => now - t < windowMs)
    if (arr.length >= limit) return false
    arr.push(now)
    this.buckets.set(key, arr)
    return true
  }
}
```

Depois: mover para Redis (script LUA ou INCR + TTL).

## 7. Autenticação (Roadmap)

- Argon2id (ou bcrypt com custo >=12) para senha.
- Access token curto (JWT assinado HS256/RS256) + Refresh token rotativo.
- Tabela `refresh_tokens(id, user_id, revoked, expires_at, created_at)`.
- Revogação em logout ou rotação suspeita.
- Mensagens neutras: "Se o email existir, enviaremos...".

## 8. Proteção de Formulários

- Desabilitar submit durante requisições (já feito em login/signup).
- Adicionar `aria-live="polite"` para mensagens dinâmicas (alguns já têm rol/alert).
- Ao implementar CSRF: token hidden + cookie httpOnly (double submit) ou SameSite=Strict.

## 9. Recalcular Preços no Backend

Quando backend existir: ignorar preço vindo do client

1. Carregar produtos por SKU/ID
2. Reaplicar regras (promo, cupom)
3. Persistir pedido com valores recalculados

## 10. Recomendações / Grafos (Fase posterior)

- Fase 1: Tabela `product_cooccurrence` (relacional) com score.
- Fase 2: pgvector para similaridade semântica (descrição / embeddings).
- Fase 3: Neo4j secundário se queries multi-hop justificarem.

## 11. Testes de Segurança Automatizados (Planejado)

| Teste                                 | Objetivo                                         |
| ------------------------------------- | ------------------------------------------------ |
| Snapshot headers                      | Garantir CSP e X-Frame corretos                  |
| Lint contra `dangerouslySetInnerHTML` | Evitar uso indevido                              |
| Fuzz inputs críticos                  | Robustez de validação                            |
| Build check de secrets                | Falhar se variável sensível tiver prefixo errado |

## 12. Dependências & Supply Chain

- Script: `"audit:ci": "npm audit --audit-level=high"` (ou usar `pnpm audit`).
- Renovate/Dependabot para upgrades de patch.
- Verificar bibliotecas novas: reputação / downloads / manutenção.

## 13. Pagamentos (Futuro)

- Nunca armazenar dados completos de cartão.
- Usar tokenização (Stripe/Pagar.me/etc.).
- Webhook: validar assinatura + replay ID.
- Order creation idempotente (`Idempotency-Key`).

## 14. Checklist de Revisão (Pré-Release)

- [ ] CSP sem curingas excessivos? (evitar `*` em script-src)
- [ ] Dependências auditadas (nenhuma high/critical pendente)
- [ ] Forms críticos validam server-side?
- [ ] Logs não incluem dados sensíveis?
- [ ] Tokens e secrets fora de `NEXT_PUBLIC_*`?
- [ ] Nenhum uso não autorizado de `dangerouslySetInnerHTML`?
- [ ] Headers básicos presentes?
- [ ] Rotas sensíveis rate-limited?

## 15. Evolução do Documento

Atualizar este arquivo quando:

- Novo provedor de auth ou pagamentos
- Introdução de pipeline de recomendações
- Adoção de WAF / CDN avançada

---

_Manter este guia versionado para auditoria e transparência arquitetural._
