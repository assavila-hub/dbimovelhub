# 🏢 ImóvelHUB — Documentação Técnica, Funcional & Checklist de Testes

> **Versão:** 2.0 (Produção Pronta / Release Candidate)  
> **Status:** Full-Stack Operacional (Frontend Vite/React 19 + Backend Express + Supabase PostgreSQL)  
> **Data:** 06/11/2026  
> **Licença:** MIT  

---

## 1. Visão Geral

O **ImóvelHUB** é uma plataforma imobiliária **Full-Stack** moderna, responsiva e de alta performance, projetada para consolidar as melhores experiências e funcionalidades dos 6 maiores players do mercado nacional (*ZAP Imóveis, VivaReal, Imovelweb, QuintoAndar, Loft e OLX*).

O sistema centraliza todo o ciclo de vida da transação imobiliária (compra, venda, locação tradicional, temporada e leilão judicial/extrajudicial), conectando compradores, locatários, proprietários particulares, corretores credenciados (CRECI) e imobiliárias com total transparência, dados verídicos e ferramentas avançadas de negociação, cálculo financeiro e análise de mercado.

- **Nome Oficial:** ImóvelHUB
- **Tipo:** Portal Imobiliário Full-Stack (Frontend SPA + API REST + Banco Relacional)
- **Módulos Centrais:** Catálogo com Mapa Interativo, Buscador Cascata Bidirecional, Simuladores Financeiros (SAC/Price/ITBI/ROI), CRM Kanban de Leads, Contratos Digitais ICP-Brasil, Vistoria Fotográfica, Sincronização XML/CRM e Painel Admin Master.

---

## 2. Stack Tecnológica

### Frontend
| Tecnologia | Versão | Função / Uso |
|---|---|---|
| **React** | 19.2 | Biblioteca declarativa para interface de usuário e componentes reativos |
| **Vite** | 8.2 | Build tool de altíssima velocidade, dev server e Rollup bundler |
| **Leaflet / React-Leaflet** | 1.9 / 5.0 | Mapas interativos, clusterização e geolocalização esférica |
| **Lucide React** | 1.31 | Pacote completo de ícones vetoriais imobiliários e de navegação |
| **CSS3 Puro & Tokens** | — | Design system com CSS Variables, Glassmorphism, Dark Mode e tokens HSL |
| **@supabase/supabase-js** | 2.118 | Cliente Supabase para autenticação (Auth/OTP) e queries PostgreSQL |

### Backend & Persistência
| Tecnologia | Versão | Função / Uso |
|---|---|---|
| **Node.js** | 18.0+ | Runtime do servidor backend |
| **Express** | 5.2 | Framework web para API REST de contingência e microsserviços |
| **JSON Database Engine** | — | Persistência leve com escrita atômica (`server/data.json` e swap `.tmp`) |
| **Supabase PostgreSQL** | — | Banco de dados relacional oficial na nuvem com Row Level Security (RLS) |
| **CORS** | 2.8 | Middleware de segurança cross-origin |
| **dotenv** | 18.0 | Carregamento de variáveis de ambiente seguras |
| **pg** | 8.23 | Driver PostgreSQL nativo para scripts de migração e manutenção |

### Infraestrutura & Integrações
- **Vercel:** Hospedagem do frontend SPA com regras de rewrite e cabeçalhos HTTP de segurança (`vercel.json`).
- **Supabase Cloud:** Provedor de PostgreSQL, autenticação gerenciada, e-mails de confirmação e storage.
- **ViaCEP API:** Autocompletar dinâmico de endereços brasileiros via CEP com suporte a CORS.

---

## 3. Estrutura de Diretórios do Projeto

```
imovelhub/
├── public/                 # Arquivos públicos, ícones e manifest
├── server/                 # Backend Node.js / Express
│   ├── data.json           # Banco de dados local persistente (JSON)
│   ├── db.js               # DAO com recuperação de corrupção e escrita atômica
│   ├── index.js            # Rotas da API REST Express (Porta 3001)
│   ├── migrate-supabase.js # Script de migração DDL e DML para o Supabase
│   └── update-users-passwords.js # Utilitário de sincronização de senhas
├── src/
│   ├── assets/             # Imagens e logotipos vetoriais
│   ├── components/         # Mais de 50 componentes React modulares e modais
│   ├── mockData/           # Taxonomias e bases de dados
│   │   ├── blogPosts.js    # Artigos do blog imobiliário
│   │   ├── categories.js   # Taxonomia imobiliária, comodidades e tipos
│   │   ├── properties.js   # 60 imóveis completos com fotos e coordenadas
│   │   └── users.js        # Usuários demonstração e planos
│   ├── pages/              # Páginas completas (Detalhes, Blog, Corretor)
│   ├── services/           # Camada de comunicação de rede e regras de negócio
│   │   ├── api.js          # Métodos unificados Supabase + Express fallback
│   │   ├── filterProperties.js # Motor central puro de filtragem e Haversine
│   │   └── supabase.js     # Inicialização do client Supabase
│   ├── tests/              # Testes unitários com Node Test Runner
│   ├── App.jsx             # Componente raiz (estados globais, modais e roteamento)
│   ├── index.css           # Design system global, reset moderno e temas
│   └── main.jsx            # Bootstrap React 19
├── .env.example            # Documentação completa das variáveis de ambiente
├── .env                    # Variáveis de ambiente locais (ignorado no git)
├── .gitignore              # Regras de exclusão do Git
├── .oxlintrc.json          # Configuração do linter Oxlint
├── CHECKLIST.MD            # Checklist de segurança e tarefas pendentes
├── PROJECT.MD              # Este documento técnico e checklist de testes
├── package.json            # Scripts de build, test e dependências
├── vercel.json             # Regras de deploy e cabeçalhos de segurança Vercel
└── vite.config.js          # Configuração do Vite e separação inteligente de chunks
```

---

## 4. Perfis de Acesso & Controle de Permissões (RBAC)

| Perfil | Identificador | Usuário de Demonstração | Permissões & Acesso Principal |
|---|---|---|---|
| 👑 **Administrador Master** | `admin` | Carlos Administrador (`admin@imovelhub.com.br`) | Painel Admin Geral, métricas de faturamento, gestão em lote de imóveis, aprovação/moderação, gestão de usuários, contratos digitais, vistorias, feeds XML, backup JSON/CSV e tema do portal. |
| 💼 **Corretor de Imóveis** | `broker` | Ricardo Corretor (`corretor@imovelhub.com.br` • CRECI 123.456-F) | Gestão de carteira de imóveis agenciados, página de perfil público com selo CRECI, link de divulgação oficial, avaliações de clientes e CRM Kanban de leads. |
| 🏢 **Imobiliária / Agência** | `agency` | Imobiliária Prime (`imobiliaria@imovelhub.com.br`) | Painel corporativo, gerenciamento de corretores associados, rateio de comissões e gestão do catálogo da agência. |
| 🏡 **Proprietário Particular** | `owner` | Marina Proprietária (`proprietario@imovelhub.com.br`) | Cadastro facilitado de imóveis particulares, acompanhamento de visitas, contratação de destaques e análise de propostas recebidas. |
| 🔍 **Comprador / Locatário** | `buyer` | Juliana Compradora (`comprador@imovelhub.com.br`) | Busca com geolocalização e raio, favoritos, comparador lado a lado, agendamento de visitas, envio de propostas e simulações salvas. |
| 🎧 **Suporte Técnico** | `support` | Suporte ImóvelHUB (`suporte@imovelhub.com.br`) | Fila de triagem de anúncios pendentes, moderação e atendimento via chat. |

---

## 5. Módulos Funcionais Detalhados

### 5.1. Buscador Cascata Bidirecional & Geolocalização
- Filtragem simultânea por Tipo de Imóvel, Localização (Estado, Cidade, Bairro), Faixa de Preço, Quartos, Vagas e Banheiros.
- Algoritmo de normalização de texto NFD que remove acentos, pontuações e caixa alta.
- Reconhecimento automático de códigos sequenciais (`HUB-1001`, `1001`, `#prop-1`).
- Filtro por raio geográfico esférico (Fórmula de Haversine: 1 km a 50 km) a partir de CEP ou coordenadas GPS.
- Histórico persistente de buscas recentes e busca salva com alertas no `localStorage` (`imovelhub_*`).

### 5.2. Catálogo de Imóveis & Modos de Visualização
- Catálogo com mais de 60 imóveis cadastrados em capitais e polos imobiliários brasileiros (São Paulo, Curitiba, Rio de Janeiro, Belo Horizonte, etc.).
- Três modos de visualização com alternância instantânea:
  1. **Grade (Grid):** Cards modernos com carrossel de fotos, cálculo de R$/m², tags de verificação, botão de favoritar, comparar e WhatsApp direto.
  2. **Dividida (Split-Screen):** Lista sincronizada à esquerda e mapa interativo à direita.
  3. **Mapa Completo (Leaflet):** Pins dinâmicos com clusterização e popups informativos com foto e link direto.

### 5.3. Suíte de Negociação & Comunicação
- **Agendamento de Visitas (`VisitSchedulerModal`):** Escolha de data, horário e modalidade (Presencial ou Tour Guiado por Vídeo).
- **Proposta Formal de Compra (`FormalProposalModal`):** Proposta comercial com valor ofertado, sinal de entrada, forma de pagamento e prazo de validade.
- **Chat em Tempo Real (`RealTimeChatModal`):** Mensageria instantânea com histórico salvo por imóvel.
- **Atendimento WhatsApp Direto:** Abertura com texto pré-formatado identificando o imóvel pesquisado.

### 5.4. Suíte Financeira, Notarial e Técnica
- **Simulador de Financiamento Multi-Bancos (`FinanceCalculatorModal`):** Simulação comparativa entre os sistemas SAC e PRICE nos principais bancos (Caixa Econômica, Itaú, Bradesco e Santander).
- **Simulador de ITBI & Custos Notariais (`ItbiCalculatorModal`):** Cálculo automatizado do imposto municipal de transmissão (ITBI) e emolumentos de cartório/registro por cidade.
- **Calculadora de ROI & Yield de Locação (`RoiYieldCalculatorModal`):** Projeção de retorno sobre investimento anual (%) e payback para investidores.
- **Plantas Baixas Interativas (`FloorPlansWidget`):** Seleção de plantas de diferentes metragens e orientação solar.
- **Cronograma de Obras:** Visualização gráfica de evolução das etapas de construção (fundação, alvenaria, acabamento) para lançamentos.
- **Ficha Técnica em PDF & QR Code (`PropertyPdfModal`):** Emissão de folheto profissional com QR Code direcionando ao anúncio.

### 5.5. Autenticação Segura & Verificação de Conta
- Cadastro sem auto-login forçado: novos usuários passam obrigatoriamente para a tela de aviso de verificação (`verify-notice`).
- Validação alternativa por **Código OTP de 6 dígitos** direto no modal, contornando bloqueios de link ou erros de porta local.
- Listener em `App.jsx` que captura tokens de confirmação de e-mail na URL, sincroniza a sessão via `supabase.auth.setSession` e limpa o hash.
- Recuperação segura de senha via Supabase com token criptografado e modal dedicado de redefinição (`ResetPasswordModal`).

### 5.6. Painel Administrativo Master & Operações Avançadas
- Dashboard analítico com 5 KPIs em tempo real (Catálogo Ativo, Usuários Online, Propostas em Análise, Receita de Planos e Visitas Agendadas).
- Gestão em lote de imóveis (aprovar, pausar, destacar, excluir).
- Minutas de **Contratos Digitais** padronizadas com assinatura eletrônica padrão ICP-Brasil (`DigitalContractModal`).
- Laudo de **Vistoria Digital Fotográfica** com checklist de itens vistoriados e termo de entrega de chaves (`DigitalInspectionModal`).
- Integração de **Carga & Feeds XML** nos padrões dos maiores CRMs do Brasil (Kenlo, Vista, Órulo, VivaReal) via `XmlFeedSyncModal`.
- Gerenciador em lote via planilha CSV (`MassCsvManagerModal`).
- Customização dinâmica de tema (cores primárias, secundárias e logotipo) com persistência em tempo real.
- Backup completo da base em JSON com escrita atômica e exportação em CSV.

---

## 6. Endpoints da API REST (Backend Express — Porta 3001)

| Endpoint | Método | Descrição | Status de Autenticação |
|---|---|---|---|
| `/api/users` | GET | Listar todos os usuários cadastrados | Aberto (item de segurança pendente) |
| `/api/users` | POST | Criar novo usuário | Aberto (item de segurança pendente) |
| `/api/users/:id` | PUT | Atualizar dados e cargo de usuário | Aberto (item de segurança pendente) |
| `/api/users/:id` | DELETE | Excluir usuário por ID (com validação 404) | Aberto (item de segurança pendente) |
| `/api/properties` | GET | Listar todo o catálogo de imóveis | Leitura pública |
| `/api/properties` | POST | Cadastrar novo imóvel | Aberto (item de segurança pendente) |
| `/api/properties/:id` | PUT | Atualizar imóvel existente | Aberto (item de segurança pendente) |
| `/api/properties/:id` | DELETE | Excluir imóvel por ID (com validação 404) | Aberto (item de segurança pendente) |
| `/api/cep/:cep` | GET | Proxy de consulta ViaCEP com CORS liberado | Leitura pública |
| `/api/schedules` | GET | Listar agendamentos de visitas | Aberto (item de segurança pendente) |
| `/api/schedules` | POST | Criar novo agendamento de visita | Aberto (item de segurança pendente) |
| `/api/chats/:propertyId` | GET | Listar histórico de mensagens do imóvel | Aberto (item de segurança pendente) |
| `/api/chats/:propertyId` | POST | Enviar nova mensagem de chat | Aberto (item de segurança pendente) |
| `/api/payments/checkout` | POST | Simular contratação de plano de destaque | Aberto (item de segurança pendente) |
| `/api/transactions` | GET | Listar histórico de faturamento e planos | Aberto (item de segurança pendente) |
| `/api/proposals` | GET | Listar propostas formais de compra | Aberto (item de segurança pendente) |
| `/api/proposals` | POST | Enviar proposta formal de compra | Aberto (item de segurança pendente) |

---

## 7. Scripts Disponíveis & Como Executar

```bash
# Iniciar frontend Vite (porta 5173) e backend Express (porta 3001) em paralelo:
npm run start:all

# Iniciar apenas o frontend Vite (desenvolvimento):
npm run dev

# Iniciar apenas o backend Express:
npm run server

# Executar a suíte de testes unitários automatizados (Node Test Runner):
npm test

# Executar a verificação de linter em todo o código (Oxlint):
npm run lint

# Gerar build minificado e otimizado para produção:
npm run build

# Visualizar localmente o build de produção:
npm run preview
```

---

## 8. Variáveis de Ambiente (`.env`)

| Variável | Escopo | Descrição |
|---|---|---|
| `VITE_SUPABASE_URL` | Frontend | URL pública do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Chave pública/anon do Supabase |
| `VITE_API_URL` | Frontend | URL base da API Express (padrão: `http://localhost:3001/api`) |
| `VITE_USE_EXPRESS_FALLBACK` | Frontend | Ativa o fallback para o servidor Express caso o Supabase falhe |
| `PORT` | Backend | Porta do servidor Express (padrão: `3001`) |
| `DATABASE_URL` | Backend | String de conexão direta PostgreSQL para scripts de migração |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend | Chave administrativa de serviço para rotas restritas |

---

## 9. Itens de Segurança Pendentes (Conforme CHECKLIST.MD)

> *Nota: Conforme alinhado, estes itens estão mapeados para implementação posterior:*
1. **Credenciais no frontend:** Migrar chaves do Supabase exclusivamente para variáveis de ambiente sem fallback hardcoded.
2. **Hash de senhas:** Implementar criptografia bcrypt/argon2 (atualmente senhas em texto plano).
3. **Autenticação nas rotas da API:** Proteger rotas de escrita (POST/PUT/DELETE) com middleware JWT.
4. **Restrição de CORS:** Limitar domínios de origem permitidos no backend Express.
5. **Desacoplamento de Seed:** Separar os dados de mock do backend para não importar diretamente do frontend.

---

## 📋 10. CHECKLIST GERAL DE TESTES (Marque conforme for testando)

Utilize as caixas de seleção abaixo (`[ ]` para pendente e `[x]` para aprovado) para testar 1 a 1 todas as funcionalidades:

### 🧭 Módulo 1: Layout, Cabeçalho & Responsividade
- [ ] **1.1** Abrir a aplicação em `http://localhost:5173` no desktop e verificar se cabeçalho, hero e grid de cards carregam fluidos.
- [ ] **1.2** Redimensionar a janela para telas mobile (< 768px) e checar se não há vazamento lateral (`overflow-x`).
- [ ] **1.3** Abrir o menu hambúrguer lateral no mobile e checar se todos os links e botões aparecem com rolagem vertical perfeita (`100dvh`).
- [ ] **1.4** Clicar no botão de alternância Dark / Light Mode no topo e verificar se o tema muda e permanece ativo após recarregar a página (F5).
- [ ] **1.5** Clicar no logotipo "ImóvelHUB" de qualquer tela e verificar o retorno seguro à página inicial.
- [ ] **1.6** Clicar no ícone de Notificações no topo e verificar a abertura do modal com os alertas do sistema.

### 🔍 Módulo 2: Busca, Filtros & Geolocalização
- [ ] **2.1** Filtrar pelas abas de modalidade no topo: *Todos, Comprar, Alugar, Lançamentos, Temporada e Leilão*.
- [ ] **2.2** Digitar o código `HUB-1001` (ou `1001`) na barra de busca e conferir se o imóvel correto é retornado.
- [ ] **2.3** Digitar o nome de uma cidade ou bairro (ex: "Batel", "Moema", "Ipanema") com ou sem acentos e conferir os resultados.
- [ ] **2.4** Selecionar uma tipologia no dropdown de categorias (Apartamento, Casa, Comercial, etc.) e conferir a filtragem.
- [ ] **2.5** Abrir a barra lateral de Filtros Avançados e testar os filtros de faixa de preço, dormitórios, vagas e banheiros.
- [ ] **2.6** Testar a busca por raio em km (modal de raio) informando um CEP ou cidade e aplicando distância de 1km a 50km.
- [ ] **2.7** Iniciar o Assistente Guiado de Busca (Search Wizard), responder às etapas e verificar a recomendação final de imóveis.

### 🗺️ Módulo 3: Grid de Cards, Mapa Interativo & Comparador
- [ ] **3.1** No card do imóvel, navegar pelas fotos usando as setas do mini-carrossel de imagens.
- [ ] **3.2** Clicar no ícone de Coração em um card e verificar o incremento no contador de favoritos do cabeçalho.
- [ ] **3.3** Clicar no botão de Comparar em 2 ou mais imóveis e verificar o surgimento da barra flutuante no rodapé.
- [ ] **3.4** Clicar em "Comparar Agora" na barra flutuante e conferir a tabela de comparação lado a lado de até 4 imóveis.
- [ ] **3.5** Alternar a visualização para "Dividida" (Split-Screen) e conferir a lista ao lado do mapa Leaflet.
- [ ] **3.6** Clicar em um marcador no mapa Leaflet e verificar o popup com foto, dados e link do imóvel.

### 🏡 Módulo 4: Detalhes do Imóvel & Simuladores Financeiros
- [ ] **4.1** Clicar em um imóvel para abrir o modal rápido de detalhes (`PropertyDetailModal`) e checar dados completos e fotos.
- [ ] **4.2** Clicar em "Ver Página Completa" e verificar a navegação para a página dedicada (`PropertyDetailPage`).
- [ ] **4.3** Na página de detalhes, testar o botão "Agendar Visita Presencial", selecionar data/horário e confirmar.
- [ ] **4.4** Clicar em "Fazer Proposta Formal", informar valor ofertado, sinal e forma de pagamento e enviar.
- [ ] **4.5** Clicar em "Simular Financiamento", alternar entre tabelas SAC e PRICE e selecionar os bancos (Caixa, Itaú, Bradesco, Santander).
- [ ] **4.6** Clicar em "Calcular ROI & Yield" e conferir as projeções de rentabilidade e tempo de retorno do investimento.
- [ ] **4.7** Clicar em "Simulador de ITBI & Escritura", alterar a cidade e conferir os valores calculados de imposto e cartório.
- [ ] **4.8** Clicar em "Planta Baixa Interativa" e alternar entre as plantas disponíveis.
- [ ] **4.9** Clicar em "Baixar Ficha Técnica em PDF / QR Code" e testar a geração do folheto com QR Code.
- [ ] **4.10** Clicar em "Conversar no WhatsApp" e conferir o redirecionamento com a mensagem pré-formatada.
- [ ] **4.11** Se o imóvel possuir Tour Virtual ou Vídeo, conferir a reprodução sem quebras.

### 🔐 Módulo 5: Autenticação, Cadastro & Recuperação de Senha
- [ ] **5.1** Clicar no botão "Entrar" no cabeçalho e abrir o modal de login.
- [ ] **5.2** Clicar em "Criar Nova Conta", preencher nome, e-mail, senha e tipo de perfil (Comprador/Corretor).
- [ ] **5.3** Submeter o formulário de cadastro e conferir se a tela de aviso de confirmação (`verify-notice`) é exibida **sem fazer auto-login**.
- [ ] **5.4** No aviso de ativação, testar o botão "Reenviar e-mail de ativação".
- [ ] **5.5** Testar o campo de Código OTP digitando o código de confirmação recebido por e-mail.
- [ ] **5.6** Clicar em "Esqueceu a senha?", preencher o e-mail cadastrado e verificar o aviso de envio seguro do link.
- [ ] **5.7** Testar login com as contas demonstrativas prontas no rodapé do modal (Comprador, Proprietário, Corretor, Imobiliária, Admin).

### 👤 Módulo 6: Painéis de Usuário por Perfil (`UserDashboardModal`)
- [ ] **6.1 (Comprador)** Fazer login como Comprador e abrir "Minha Conta": verificar abas de Imóveis Favoritos, Visitas Solicitadas e Propostas.
- [ ] **6.2 (Proprietário)** Fazer login como Proprietário: conferir lista de imóveis anunciados, métricas e botão "Anunciar Imóvel".
- [ ] **6.3 (Corretor)** Fazer login como Corretor: conferir carteira de imóveis agenciados, selo de CRECI, botão de divulgar imóvel e atalho para o CRM.
- [ ] **6.4 (Imobiliária)** Fazer login como Imobiliária: conferir lista de corretores vinculados e comissionamento.
- [ ] **6.5 (Suporte)** Fazer login como Suporte: conferir fila de moderação de anúncios e tickets de atendimento.

### 🛠️ Módulo 7: Painel Administrativo Master (`AdminDashboardModal`)
- [ ] **7.1** Fazer login com a conta de Administrador e abrir o "Painel Admin Master" no menu superior.
- [ ] **7.2** Na aba "Visão Geral", checar os 5 cards de KPI (Catálogo Total, Usuários Online, Propostas, Receita de Planos e Visitas Agendadas).
- [ ] **7.3** Clicar em um dos cards das 6 modalidades e conferir se a listagem filtra de acordo.
- [ ] **7.4** Na aba "Imóveis", selecionar múltiplos imóveis e testar a atualização de status em lote (Ativo, Pausado, Vendido).
- [ ] **7.5** Na aba "Imóveis", testar a exclusão unitária com modal de confirmação.
- [ ] **7.6** Na aba "Categorias", editar uma categoria existente ou criar nova opção de tipologia imobiliária.
- [ ] **7.7** Na aba "Usuários & Corretores", buscar um usuário, editar seu cargo e testar a ação de congelar/ativar conta.
- [ ] **7.8** Na aba "Contratos Digitais", visualizar minuta de contrato com campos preenchidos no padrão ICP-Brasil.
- [ ] **7.9** Na aba "Vistorias Digitais", inspecionar laudo fotográfico e checklist de vistoria de chaves.
- [ ] **7.10** Na aba "Carga & Feeds XML", simular importação nos padrões Kenlo/Vista e copiar a URL do feed oficial.
- [ ] **7.11** Na aba "Identidade Visual & Tema", alterar a cor primária e conferir a aplicação instantânea no sistema.
- [ ] **7.12** Na aba "Backup & Exportação", testar download de backup em JSON e exportação em CSV.

### 📰 Módulo 8: Blog Imobiliário, CRM Kanban & Ferramentas Auxiliares
- [ ] **8.1** Clicar no link "Blog" no menu ou rodapé e navegar pela listagem de artigos.
- [ ] **8.2** Abrir um artigo específico (`BlogPostPage`) e verificar o layout, tempo de leitura e autor.
- [ ] **8.3** Abrir o "CRM de Leads & Funil" (Kanban) e arrastar ou mover leads entre as etapas do funil.
- [ ] **8.4** Abrir o "Checklist de Mudança" no menu ou rodapé e marcar tarefas de utilidades, condomínio e mudança como concluídas.
- [ ] **8.5** Abrir a ferramenta de "Inteligência de Bairros" e visualizar notas de segurança, infraestrutura e comércio.
- [ ] **8.6** Acessar a página de perfil público de um corretor (`BrokerProfilePage`) e conferir foto, número de CRECI e imóveis.

### 🧪 Módulo 9: Testes Automatizados, Build & Backend
- [ ] **9.1** Executar no terminal `npm test` e verificar se os 6 testes unitários do motor de busca passam com sucesso.
- [ ] **9.2** Executar no terminal `npm run lint` e verificar se o Oxlint conclui com 0 erros.
- [ ] **9.3** Executar no terminal `npm run build` e verificar se a compilação do Vite gera os arquivos em `dist/` sem falhas.
- [ ] **9.4** Testar a API Express com `curl http://localhost:3001/api/properties` ou no navegador e receber o JSON de imóveis.
- [ ] **9.5** Testar a rota de CEP `curl http://localhost:3001/api/cep/01310100` e receber o endereço correspondente.
