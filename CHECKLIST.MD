# 📋 CHECKLIST — Testes de Validação (ImóvelHUB)

> Este checklist foi gerado a partir do documento `PROJECT.MD`. Teste cada item e marque como ✅ (aprovado) ou ❌ (reprovado).

Status: **Em execução**  
Data de início: 06/11/2026  
Escopo: Backend (`server/`) + Frontend (`src/`)

---

## 🔴 SEÇÃO A — CRÍTICO (Segurança & Dados)

| # | Item | Referência PROJETO.MD | Status | Obs. |
|---|------|----------------------|--------|------|
| A1 | Mover credenciais do Supabase para `.env` (remover hardcoded em `src/services/supabase.js`) | §9, §11 item 1 | ⬜ | |
| A2 | Implementar hash de senhas (bcrypt/argon2) no backend; parar de armazenar senhas em texto plano | §11 item 2 | ⬜ | |
| A3 | Adicionar middleware de autenticação (JWT ou sessão) nas rotas POST/PUT/DELETE do Express | §6, §11 item 3 | ⬜ | |
| A4 | Adicionar autorização por role (admin/broker/owner/buyer/support) | §4, §11 item 3 | ⬜ | |
| A5 | Configurar CORS com origens restritas (`cors({ origin: [...] })`) | §11 item 4 | ⬜ | |
| A6 | Remover import direto do frontend no `server/db.js` (mover seed/mock para `server/seed/`) | §11 item 5 | ⬜ | |

---

## 🟡 SEÇÃO B — BACKEND / API REST (Endpoints)

| # | Item | Endpoint | Método | Status | Obs. |
|---|------|----------|--------|--------|------|
| B1 | Listar usuários | `/api/users` | GET | ⬜ | |
| B2 | Criar usuário | `/api/users` | POST | ⬜ | |
| B3 | Atualizar usuário | `/api/users/:id` | PUT | ⬜ | |
| B4 | Excluir usuário | `/api/users/:id` | DELETE | ⬜ | |
| B5 | Listar imóveis | `/api/properties` | GET | ⬜ | |
| B6 | Criar imóvel | `/api/properties` | POST | ⬜ | |
| B7 | Atualizar imóvel | `/api/properties/:id` | PUT | ⬜ | |
| B8 | Excluir imóvel | `/api/properties/:id` | DELETE | ⬜ | |
| B9 | Consultar CEP via ViaCEP | `/api/cep/:cep` | GET | ⬜ | |
| B10 | Listar agendamentos | `/api/schedules` | GET | ⬜ | |
| B11 | Criar agendamento | `/api/schedules` | POST | ⬜ | |
| B12 | Listar mensagens de chat | `/api/chats/:propertyId` | GET | ⬜ | |
| B13 | Enviar mensagem de chat | `/api/chats/:propertyId` | POST | ⬜ | |
| B14 | Checkout pagamento (PIX/Cartão sandbox) | `/api/payments/checkout` | POST | ⬜ | |
| B15 | Listar transações | `/api/transactions` | GET | ⬜ | |
| B16 | Listar propostas | `/api/proposals` | GET | ⬜ | |
| B17 | Criar proposta de compra | `/api/proposals` | POST | ⬜ | |
| B18 | Recuperação de corrupção do `data.json` | `server/db.js` | — | ⬜ | Testar com arquivo corrompido |

---

## 🟢 SEÇÃO C — FRONTEND (Funcionalidades de Usuário)

### C1 — Buscador Cascata Bidirecional
| # | Item | Status | Obs. |
|---|------|--------|------|
| C1.1 | Filtragem por Categoria, Localização, Quartos e Vagas em qualquer ordem | ⬜ | |
| C1.2 | Busca tolerante a acentuação, maiúsculas/minúsculas e pontuação | ⬜ | |
| C1.3 | Busca por código (`#prop-1`, `prop-45`) | ⬜ | |
| C1.4 | Pílulas de filtros rápidos com contadores em tempo real | ⬜ | |
| C1.5 | Histórico de buscas recentes (localStorage, 1 clique) | ⬜ | |

### C2 — Catálogo de Imóveis
| # | Item | Status | Obs. |
|---|------|--------|------|
| C2.1 | 60 imóveis carregados e exibidos | ⬜ | |
| C2.2 | Cobertura de cidades/bairros reais (SP, RJ, PR, MG) | ⬜ | |
| C2.3 | Badges de verificação (QuintoAndar/Loft) | ⬜ | |
| C2.4 | Cálculo de R$/m² exibido corretamente | ⬜ | |

### C3 — Modos de Visualização & Mapa
| # | Item | Status | Obs. |
|---|------|--------|------|
| C3.1 | Visualização em Grade (Grid) com carrossel de fotos | ⬜ | |
| C3.2 | Modo Dividir Tela (Split-View): lista sincronizada com mapa | ⬜ | |
| C3.3 | Mapa em Tela Cheia (Leaflet & OpenStreetMap) com pins e popup | ⬜ | |
| C3.4 | Busca por raio geográfico (1km a 50km, fórmula de Haversine) | ⬜ | |

### C4 — Filtros Avançados Unificados
| # | Item | Status | Obs. |
|---|------|--------|------|
| C4.1 | Barra de resumo de filtros ativos com botão `✕` de remoção | ⬜ | |
| C4.2 | Inputs numéricos diretos de preço (mínimo/máximo) | ⬜ | |
| C4.3 | Histograma vetorial SVG de densidade de preços | ⬜ | |
| C4.4 | Filtro de estágio: Pronto para Morar, Na Planta, Novo, Leilão, Temporada | ⬜ | |
| C4.5 | Filtro por andar: Térreo/Garden, Andar Baixo, Andar Alto, Cobertura/Duplex | ⬜ | |
| C4.6 | Salvar combinações de busca (alertas na Central de Notificações) | ⬜ | |

### C5 — Comparador de Imóveis
| # | Item | Status | Obs. |
|---|------|--------|------|
| C5.1 | Comparar até 4 imóveis lado a lado | ⬜ | |
| C5.2 | Destaques automáticos (Menor R$/m², Maior Espaço Útil, Mais Econômico) | ⬜ | |
| C5.3 | Exportação do comparativo em PDF | ⬜ | |

### C6 — Central de Atendimento & Negociação
| # | Item | Status | Obs. |
|---|------|--------|------|
| C6.1 | Chat direto por imóvel (tempo real) | ⬜ | |
| C6.2 | Canal de Suporte ImóvelHUB | ⬜ | |
| C6.3 | Agendamento de visitas online (dia/horário com confirmação) | ⬜ | |
| C6.4 | Proposta formal de compra (valor de entrada, prazo de validade) | ⬜ | |

### C7 — Suíte Financeira e Jurídica
| # | Item | Status | Obs. |
|---|------|--------|------|
| C7.1 | Simulador de financiamento (SAC e PRICE, bancos brasileiros) | ⬜ | |
| C7.2 | Calculadora de ITBI e custos cartorários | ⬜ | |
| C7.3 | Calculadora de rentabilidade e ROI / Yield (tradicional vs temporada) | ⬜ | |
| C7.4 | Gerador de ficha técnica em PDF | ⬜ | |
| C7.5 | Plantas baixas interativas e tour virtual 360° | ⬜ | |

### C8 — Painel Administrativo & RBAC
| # | Item | Status | Obs. |
|---|------|--------|------|
| C8.1 | Alternar entre perfis: Administrador, Corretor, Proprietário, Comprador, Suporte | ⬜ | |
| C8.2 | Gestão completa de anúncios (CRUD) | ⬜ | |
| C8.3 | Moderação e destaque de planos | ⬜ | |
| C8.4 | Relatórios analíticos de visualizações e leads | ⬜ | |
| C8.5 | Backup completo do banco em JSON | ⬜ | |
| C8.6 | Exportação de dados em CSV | ⬜ | |

---

## 🔵 SEÇÃO D — AUTENTICAÇÃO & SEGURANÇA (Frontend)

| # | Item | Status | Obs. |
|---|------|--------|------|
| D1 | Cadastro com confirmação de e-mail (Supabase Auth) | ⬜ | |
| D2 | Login com validação de e-mail confirmado | ⬜ | |
| D3 | Recuperação de senha (esqueci minha senha) | ⬜ | |
| D4 | Redefinição direta de senha | ⬜ | |
| D5 | Reenvio de e-mail de confirmação | ⬜ | |
| D6 | Verificação de código OTP / token | ⬜ | |
| D7 | Conta bloqueada pelo administrador impede login | ⬜ | |
| D8 | Senha não armazenada em texto plano no banco | ⬜ | |

---

## 🟣 SEÇÃO E — INFRAESTRUTURA & DEPLOY

| # | Item | Status | Obs. |
|---|------|--------|------|
| E1 | `.env` criado a partir do `.env.example` | ⬜ | |
| E2 | `.env` não está versionado (está no `.gitignore`) | ⬜ | |
| E3 | `npm install` executa sem erros | ⬜ | |
| E4 | `npm run start:all` inicia backend (3001) + frontend (5173) | ⬜ | |
| E5 | `npm run build` gera pasta `dist/` sem erros | ⬜ | |
| E6 | `npm run preview` executa build de produção localmente | ⬜ | |
| E7 | `npm run lint` (Oxlint) aprovado sem erros | ⬜ | |
| E8 | `npm test` (6 testes automatizados) aprovados | ⬜ | |

---

## ✅ RESUMO DE RESULTADOS

| Categoria | Total | Aprovados ✅ | Reprovados ❌ | Pendentes ⬜ |
|-----------|-------|:------------:|:-------------:|:-----------:|
| A — Crítico (Segurança & Dados) | 6 | | | |
| B — Backend / API REST | 18 | | | |
| C — Frontend (Funcionalidades) | 26 | | | |
| D — Autenticação & Segurança | 8 | | | |
| E — Infraestrutura & Deploy | 8 | | | |
| **TOTAL** | **66** | | | |

---

## 📝 Instruções de Uso

1. Abra este arquivo `CHECKLIST.MD`.
2. Execute cada item e marque `⬜` → `✅` (aprovado) ou `❌` (reprovado).
3. Preencha a coluna "Obs." com evidências, capturas ou erros encontrados.
4. Ao final, some os resultados na tabela de resumo acima.
5. Itens reprovados devem ser corrigidos antes de considerar o projeto pronto para produção.
