# 📋 CHECKLIST — Pente Fino de Código (ImóvelHUB)

Status: **Fase 1 Concluída (Altos, Médios e Baixos Corrigidos | Crítico postergado conforme instrução do usuário)**  
Data da auditoria: 05/11/2026  
Escopo: Backend (`server/`) + Frontend (`src/`)  
Resultado dos testes: 🟢 **6/6 Testes Automatizados Aprovados (`npm test`) | Vite Build 100% Limpo (1.25s)**

---

## 🚨 CRÍTICO (Segurança & Dados)
> *Nota: Conforme solicitado pelo usuário, esta seção será tratada em momento posterior.*

### 1. Credenciais expostas no frontend — `src/services/supabase.js:3-4`
- **Status:** ⏳ **Pendente (Postergado pelo Usuário)**
- URL e chave anon do Supabase estão **hardcoded** no código-fonte.
- Qualquer pessoa que acessar o app consegue a chave anon e pode ler/gravar no banco Supabase diretamente.
- **Ação:** Mover para `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) e adicionar `.env` ao `.gitignore`. Fornecer `.env.example`.

### 2. Senhas armazenadas em texto plano — `server/update-users-passwords.js:11-68`
- **Status:** ⏳ **Pendente (Postergado pelo Usuário)**
- Senhas como `"admin123"`, `"imob123"` etc. são salvas em texto plano no banco Supabase.
- `api.js:loginUser` compara `user.password !== password` diretamente (texto plano).
- **Ação:** Implementar hash de senhas (bcrypt/argon2) no backend. Nunca armazenar senha em texto plano.

### 3. Autenticação/autorização ausente no backend Express — `server/index.js`
- **Status:** ⏳ **Pendente (Postergado pelo Usuário)**
- Todas as rotas (POST/PUT/DELETE) de users, properties, chats, proposals, schedules, transactions estão **abertas**.
- Qualquer cliente pode excluir qualquer imóvel, usuário ou proposta.
- **Ação:** Adicionar middleware de autenticação (JWT ou sessão) e autorização por role (admin/broker/owner/buyer/support).

### 4. CORS sem restrição — `server/index.js:8`
- **Status:** ⏳ **Pendente (Postergado pelo Usuário)**
- `app.use(cors())` permite qualquer origem.
- **Ação:** Configurar `cors({ origin: [...domínios permitidos] })`.

### 5. Backend importa diretamente do frontend — `server/db.js:4-5`
- **Status:** ⏳ **Pendente (Postergado pelo Usuário)**
- `db.js` importa `INITIAL_PROPERTIES` de `../src/mockData/properties.js` e `DEFAULT_USERS` de `../src/mockData/users.js`.
- Isso acopla backend ao frontend e pode quebrar o build de produção (Vite não processa imports do servidor corretamente).
- **Ação:** Mover dados seed/mock para um diretório compartilhado ou duplicar no backend (`server/seed/`).

---

## 🔴 ALTO (Bugs & Funcionalidade)

### 6. Duplicação de lógica de filtragem — `src/App.jsx:516-620` vs `src/components/HeroSearch.jsx:86-289`
- **Status:** ✅ **CORRIGIDO**
- **Arquivos:**
  - [`src/services/filterProperties.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/services/filterProperties.js)
  - [`src/App.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/App.jsx)
  - [`src/components/HeroSearch.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/HeroSearch.jsx)
- **Diagnóstico:** A lógica de filtragem, normalização de texto, códigos `HUB-*`, abas e geolocalização Haversine estava duplicada entre `App.jsx` e `HeroSearch.jsx`.
- **Correção Aplicada:** Criado o módulo compartilhado `src/services/filterProperties.js` com funções puras (`normalizeText`, `matchesPropertyCode`, `matchesTransactionTab`, `matchesCategory`, `matchesLocationOrText`, `calculateDistanceKm`, `filterPropertiesList`). Ambos os componentes foram refatorados para consumir exclusivamente este motor centralizado.

### 7. `src/App.jsx` carrega dados duas vezes — `src/App.jsx:95` e `234-264`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`src/App.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/App.jsx)
- **Diagnóstico:** `App.jsx` carregava `INITIAL_PROPERTIES` no state e em seguida disparava o `loadData` com sobreposição imediata, causando flicker visual na interface.
- **Correção Aplicada:** Implementado controle com `isLoadingProperties` e limpeza de montagem `isMounted` com tratamento de erro sem causar flicker visual.

### 8. `RealLeafletMap.jsx` marcadores com coordenadas padrão — `src/components/RealLeafletMap.jsx:93-94`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`src/components/RealLeafletMap.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/RealLeafletMap.jsx)
- **Diagnóstico:** Imóveis sem coordenadas ou com coordenadas inválidas caíam no fallback silencioso `[-23.56, -46.66]`, sobrepondo marcadores no centro de São Paulo.
- **Correção Aplicada:** Adicionado filtro `validProperties` com `useMemo` garantindo que apenas propriedades com latitude/longitude numéricas válidas gerem marcadores no mapa. Centralização dinâmica no primeiro imóvel válido ou no imóvel selecionado.

### 9. `RealLeafletMap.jsx` popup quebra sem imagem — `src/components/RealLeafletMap.jsx:113`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`src/components/RealLeafletMap.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/RealLeafletMap.jsx)
- **Diagnóstico:** Acesso direto a `prop.images[0]` gerava crash caso o array de imagens estivesse vazio ou nulo.
- **Correção Aplicada:** Aplicado fallback seguro: `popupImage = (Array.isArray(prop.images) && prop.images[0]) || DEFAULT_PROPERTY_IMAGE`.

### 10. `PostPropertyModal.jsx` coordenadas aleatórias — `src/components/PostPropertyModal.jsx:245-246`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`src/components/PostPropertyModal.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/PostPropertyModal.jsx)
- **Diagnóstico:** Imóveis cadastrados em cidades de outros estados (Curitiba, Rio de Janeiro, BH, etc.) recebiam coordenadas randômicas de São Paulo (`-23.567`, `-46.662`).
- **Correção Aplicada:** Adicionada tabela de geocodificação de cidades e estados brasileiros (`São Paulo`, `Rio de Janeiro`, `Curitiba`, `Belo Horizonte`, `Porto Alegre`, `Brasília`, `Salvador`, etc.), atribuindo coordenadas reais de acordo com a cidade e estado informados.

### 11. `PostPropertyModal.jsx` endereço duplicado — `src/components/PostPropertyModal.jsx:168`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`src/components/PostPropertyModal.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/PostPropertyModal.jsx)
- **Diagnóstico:** O autocomplete por CEP concatenava `${data.address}, ${data.neighborhood}` no campo `address`, duplicando o bairro. Além disso, `fetchAddressByCep` retornava `street`.
- **Correção Aplicada:** Corrigido para `address: data.street || prev.address`, mantendo logradouro e bairro estritamente separados.

### 12. `AuthModal.jsx` "redefinição direta" bypassa fluxo de email — `src/components/AuthModal.jsx:57-70`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`src/components/AuthModal.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/AuthModal.jsx)
- **Diagnóstico:** A aba `direct` permitia que qualquer pessoa redefinisse a senha de qualquer usuário sem confirmação ou token.
- **Correção Aplicada:** Removido o modo direto inseguro. A recuperação de senha agora utiliza exclusivamente o fluxo oficial e protegido do Supabase via e-mail (`requestPasswordReset(email)`), enviando link com token para `ResetPasswordModal`.

### 13. `PropertyCard.jsx` clique no card dispara mesmo em botões internos — `src/components/PropertyCard.jsx:72`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`src/components/PropertyCard.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/PropertyCard.jsx)
- **Diagnóstico:** Comportamento de clique e acessibilidade precisavam de revisão para evitar conflitos de clique e garantir suporte ao teclado.
- **Correção Aplicada:** O clique no card abre intencionalmente o modal de detalhes (padrão de portais imobiliários). Adicionados `role="article"`, `tabIndex={0}`, `aria-label` e suporte a navegação por teclado (`Enter`/`Espaço`). Todos os botões internos (favoritar, comparar, slider, agendar visita, WhatsApp) possuem `e.stopPropagation()` garantido.

### 14. `FinanceCalculatorModal` / `RoiYieldCalculatorModal` — verificar se existem e funcionam
- **Status:** ✅ **CORRIGIDO & VERIFICADO**
- **Arquivos:**
  - [`src/components/FinanceCalculatorModal.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/FinanceCalculatorModal.jsx)
  - [`src/components/RoiYieldCalculatorModal.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/RoiYieldCalculatorModal.jsx)
- **Diagnóstico:** Modais existiam e funcionavam, contendo apenas imports de ícones não utilizados.
- **Correção Aplicada:** Limpeza de imports não utilizados realizada. Ambos os modais foram verificados e validados pelo linter e pelo build com 0 erros.

---

## 🟡 MÉDIO (Robustez & Manutenibilidade)

### 15. `server/db.js` `loadDB` não valida integridade — `server/db.js:50-75`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`server/db.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/server/db.js)
- **Diagnóstico:** Arquivo `data.json` corrompido causava falha silenciosa sem recuperação do arquivo em disco.
- **Correção Aplicada:** Adicionado bloco de captura de erro de parsing JSON que gera automaticamente backup do arquivo corrompido (`data.json.corrupt-<timestamp>`) e recria `data.json` com `defaultData` íntegro.

### 16. `saveDB` síncrono bloqueia o event loop — `server/db.js:77-83`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`server/db.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/server/db.js)
- **Diagnóstico:** Escrita síncrona `fs.writeFileSync` bloqueava o event loop e corria risco de corrupção se o processo caísse durante a escrita.
- **Correção Aplicada:** Implementada escrita atômica via arquivo temporário swap (`.tmp-<timestamp>` -> `rename`) e disponibilizada a função `saveDBAsync` baseada em `fs.promises`.

### 17. `server/index.js` rotas DELETE não verificam existência — `server/index.js:38-44`, `84-91`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`server/index.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/server/index.js)
- **Diagnóstico:** DELETE de usuário e imóvel retornava 200 mesmo se o ID não existisse.
- **Correção Aplicada:** Adicionada verificação de contagem anterior vs nova contagem. Se o registro não for encontrado, a API responde HTTP 404 (`{ success: false, message: 'Não encontrado' }`).

### 18. `server/index.js` rota POST /api/payments/checkout — `server/index.js:189-218`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`server/index.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/server/index.js)
- **Diagnóstico:** Falta de inicialização de array `transactions` e ausência de validação de `propertyId`.
- **Correção Aplicada:** Adicionada validação de `propertyId`, inicialização garantida `db.transactions = db.transactions || []`, valores padrão para plano e método, e criado o endpoint `GET /api/transactions`.

### 19. `src/services/api.js` `isLocalEnv` frágil — `src/services/api.js:4-6`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`src/services/api.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/services/api.js)
- **Diagnóstico:** Checagem restrita a `window.location.hostname` quebrava em testes (JSDOM) ou SSR.
- **Correção Aplicada:** Checagem aprimorada suportando flag explícita `VITE_USE_EXPRESS_FALLBACK` e verificação segura de ambiente.

### 20. `src/services/api.js` `registerUser` duplica usuário — `src/services/api.js:294-350`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`src/services/api.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/services/api.js)
- **Diagnóstico:** `registerUser` gerava um ID aleatório `user-${Date.now()}` na tabela pública em vez de associar ao ID oficial do Supabase Auth.
- **Correção Aplicada:** Captura o ID do usuário criado pelo Supabase Auth (`authRes?.data?.user?.id`) e o utiliza como chave primária `id` na tabela pública `users`, unificando a identidade 1:1.

### 21. `Header.jsx` mobile drawer — `src/components/Header.jsx:870-911`
- **Status:** ✅ **CORRIGIDO**
- **Arquivos:**
  - [`src/components/Header.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/Header.jsx)
  - [`src/index.css`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/index.css)
- **Diagnóstico:** Propriedade inline duplicada `height: '100vh', height: '100dvh'` descartava o fallback `100vh` em JavaScript.
- **Correção Aplicada:** Movido o controle de altura para as classes `.mobile-drawer-overlay` e `.mobile-drawer-content` em `src/index.css`, permitindo o cascateamento nativo de `100vh` e `100dvh` para navegadores legados.

### 22. `src/index.css` reset agressivo — `src/index.css:55-59`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`src/index.css`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/index.css)
- **Diagnóstico:** `* { margin: 0; padding: 0; }` limpava padding nativo de botões, formulários e componentes de terceiros.
- **Correção Aplicada:** Substituído por reset moderno que preserva `box-sizing: border-box` em todos os elementos e aplica remoção de margens apenas em elementos tipográficos (`body, h1-h6, p, ul, ol, figure, blockquote`).

---

## 🟢 BAIXO (Qualidade de Código & UX)

### 23. `vite.config.js` sem configuração de build — `vite.config.js:1-7`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`vite.config.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/vite.config.js)
- **Diagnóstico:** Build sem `outDir`, `sourcemap` desativado para produção ou divisão de chunks (aviso de chunk > 500kB).
- **Correção Aplicada:** Configurado `build` completo com `outDir: 'dist'`, `sourcemap: false`, `chunkSizeWarningLimit: 1200` e divisão inteligente de pacotes `vendor-icons` (`lucide-react`) e `vendor-maps` (`leaflet`, `react-leaflet`).

### 24. `vercel.json` apenas SPA rewrite — `vercel.json:1-7`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`vercel.json`](file:///home/assav/Developer/dbimovelhub/imovelhub/vercel.json)
- **Diagnóstico:** Configuração mínima sem cabeçalhos de segurança HTTP.
- **Correção Aplicada:** Adicionados cabeçalhos de proteção HTTP (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`).

### 25. `server/migrate-supabase.js` RLS totalmente aberto — `server/migrate-supabase.js:112-135`
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`server/migrate-supabase.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/server/migrate-supabase.js)
- **Diagnóstico:** Políticas aplicavam `USING (true) WITH CHECK (true)` indiscriminadamente.
- **Correção Aplicada:** Script atualizado separando leitura pública (SELECT) de operações de gravação e exclusão (INSERT/UPDATE/DELETE).

### 26. `AdminDashboardModal.jsx` dados hardcoded — `src/components/AdminDashboardModal.jsx:197-244`
- **Status:** ✅ **CORRIGIDO**
- **Arquivos:**
  - [`src/components/AdminDashboardModal.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/AdminDashboardModal.jsx)
  - [`src/services/api.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/services/api.js)
- **Diagnóstico:** Seções de visitas agendadas, propostas e transações financeiras eram arrays estáticos.
- **Correção Aplicada:** Conectado à API com `fetchSchedules()`, `fetchProposals()` e `fetchTransactions()`, atualizando o estado do painel em tempo real na abertura do modal, com fallback gracioso.

### 27. `HeroSearch.jsx` e `App.jsx` usam `localStorage` com chaves inconsistentes — `src/App.jsx:267-335` vs `src/components/HeroSearch.jsx:57-73`
- **Status:** ✅ **CORRIGIDO**
- **Arquivos:**
  - [`src/App.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/App.jsx)
  - [`src/components/HeroSearch.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/HeroSearch.jsx)
- **Diagnóstico:** `App.jsx` salvava buscas em `imobhub_user_saved_searches`, enquanto `SavedSearchesModal` buscava `imovelhub_saved_searches`. O `HeroSearch` utilizava `imobhub_recent_searches`.
- **Correção Aplicada:** Padronizado o prefixo `imovelhub_*` em toda a aplicação (`imovelhub_saved_searches`, `imovelhub_recent_searches`), com compatibilidade retroativa para ler as chaves antigas caso existam.

### 28. Ausência de testes automatizados
- **Status:** ✅ **CORRIGIDO**
- **Arquivos:**
  - [`package.json`](file:///home/assav/Developer/dbimovelhub/imovelhub/package.json)
  - [`src/tests/filterProperties.test.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/tests/filterProperties.test.js)
- **Diagnóstico:** Ausência de suite de testes automatizados para regras centrais de negócio.
- **Correção Aplicada:** Configurado script `"test": "node --test src/tests/*.test.js"` no `package.json` utilizando o Node Test Runner nativo. Criada suite de testes unitários cobrindo normalização de texto, códigos sequenciais `HUB-*`, abas de transação, categorias, cálculo Haversine e filtros combinados. (100% aprovado).

### 29. `.env.example` ausente ou incompleto
- **Status:** ✅ **CORRIGIDO**
- **Arquivo:** [`.env.example`](file:///home/assav/Developer/dbimovelhub/imovelhub/.env.example)
- **Diagnóstico:** Arquivo `.env.example` incompleto e sem documentação das variáveis do frontend e backend.
- **Correção Aplicada:** `.env.example` reestruturado e amplamente documentado, cobrindo `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`, `VITE_USE_EXPRESS_FALLBACK`, `PORT`, `DATABASE_URL` e chaves de serviço.

### 30. Pente Fino Arquivo por Arquivo & Fluxo de Ativação por E-mail e Código OTP
- **Status:** ✅ **CORRIGIDO & BLINDADO**
- **Arquivos:**
  - [`src/components/AuthModal.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/AuthModal.jsx)
  - [`src/services/api.js`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/services/api.js)
  - [`src/App.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/App.jsx)
  - [`src/components/PropertyDetailModal.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/PropertyDetailModal.jsx)
  - [`src/components/FinanceCalculatorModal.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/FinanceCalculatorModal.jsx)
  - [`src/components/UserDashboardModal.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/UserDashboardModal.jsx)
  - [`src/components/AdminDashboardModal.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/components/AdminDashboardModal.jsx)
  - [`src/pages/PropertyDetailPage.jsx`](file:///home/assav/Developer/dbimovelhub/imovelhub/src/pages/PropertyDetailPage.jsx)
- **Diagnóstico:** 
  1. Usuários recém-cadastrados eram logados automaticamente antes de confirmar o e-mail.
  2. O link de confirmação do Supabase apontava para `http://localhost:3000`, gerando erro de conexão recusada no navegador do usuário caso o frontend estivesse em outra porta ou no celular.
  3. Existiam potenciais falhas de runtime em componentes JSX por falta de imports (`Layers`, `ArrowRight`, `Home`, `ExternalLink`, `Sparkles`, `Send`).
  4. Estruturas `property.advertiser` sem fallback quebravam páginas se os dados fossem nulos.
- **Correção Aplicada:**
  1. **Fim do Auto-login no Cadastro:** Cadastro passa obrigatoriamente para a tela de aviso de confirmação (`verify-notice`) e usuário inicia com `status: 'pending_verification'`.
  2. **Ativação por Código OTP:** Adicionada a função `verifyEmailOtp` e campo no modal para digitar o código numérico de 6 dígitos recebido por e-mail, permitindo ativar a conta imediatamente mesmo se o link do Supabase tentar abrir `localhost:3000`.
  3. **Resolução de Tokens na URL:** `App.jsx` configurado para capturar tokens de confirmação de cadastro no hash, sincronizar a sessão via `supabase.auth.setSession`, atualizar o status do usuário para `active` e limpar a barra de endereços.
  4. **Correção de Todos os Componentes:** Adicionados todos os imports de ícones ausentes, limpos imports mortos e criados fallbacks seguros para dados de anunciantes e propriedades.
  5. **0 Erros de Build e Lint:** Verificação completa de sintaxe, tipos e linter em 76 arquivos com 0 erros.

---

## 📌 RESUMO DO STATUS ATUAL

| Prioridade | Total | Concluídos | Pendentes |
|------------|:-----:|:----------:|:---------:|
| 🚨 **Crítico (Segurança & Dados)** | 5 | 0 | 5 *(Postergado pelo Usuário)* |
| 🔴 **Alto (Bugs & Funcionalidade)** | 9 | **9** ✅ | 0 |
| 🟡 **Médio (Robustez & Manutenibilidade)** | 8 | **8** ✅ | 0 |
| 🟢 **Baixo (Qualidade de Código & UX)** | 8 | **8** ✅ | 0 |
| **TOTAL** | **30** | **25** ✅ | **5** (Críticos) |
