# 🏢 ImóvelHUB — Documentação do Projeto & Checklist de Testes

> **Versão:** 2.0 (Produção / Release Candidate)  
> **Arquitetura:** React 19 + Vite 8 + Leaflet + Supabase (PostgreSQL / Auth) + Express Fallback  
> **Data:** 06/11/2026  

---

## 📌 1. Visão Geral do Projeto

### O que é o ImóvelHUB?
O **ImóvelHUB** é um **super-portal imobiliário unificado brasileiro** projetado para consolidar as melhores experiências e funcionalidades dos 6 maiores players do mercado imobiliário nacional (*VivaReal, ZAP Imóveis, Imovelweb, QuintoAndar, OLX Imóveis e Chaves na Mão*).

### O que o sistema faz?
O portal centraliza todo o ciclo de vida da transação imobiliária (compra, venda, locação tradicional, locação por temporada e leilão judicial/extrajudicial), conectando compradores, locatários, proprietários particulares, corretores autônomos credenciados (CRECI) e imobiliárias em um ambiente moderno, responsivo e seguro.

---

## ⚙️ 2. Stack Tecnológica & Arquitetura

* **Frontend:**
  * **Framework:** React 19.x com compilação ultra-rápida via Vite 8.x.
  * **Iconografia & Design:** Lucide React (árvore completa de ícones imobiliários e de navegação).
  * **Mapas & Geolocalização:** Leaflet & React-Leaflet com geolocalização esférica Haversine nativa.
  * **Estilização:** CSS3 modular com variáveis CSS dinâmicas para Dark Mode e personalização de tema pelo Administrador.
* **Backend & Banco de Dados:**
  * **Primário:** Supabase (PostgreSQL relacional, Supabase Auth com confirmação por e-mail/OTP e Row Level Security).
  * **Secundário / Local:** Servidor Express 5.x (`server/index.js` + `server/db.js`) com escrita atômica em disco (`data.json`) para contingência e desenvolvimento offline.
* **Qualidade de Código & Testes:**
  * Node Test Runner nativo (`npm test`) validando algoritmos de busca e filtragem.
  * Linter Oxlint com zero tolerância a quebras de runtime.

---

## 🎯 3. Módulos e Funcionalidades do Sistema

### 3.1. Cabeçalho, Navegação & Identidade (Header & Global)
* **Navegação por Modalidades:** Filtro instantâneo por *Todos, Comprar, Alugar, Lançamentos, Temporada e Leilão*.
* **Busca Rápida por Código ou Texto:** Reconhecimento automático de IDs e códigos sequenciais (ex: `HUB-1001`, `1001`, `#1001`).
* **Alternador de Tema (Dark / Light Mode):** Persistência automática da preferência visual no `localStorage`.
* **Central de Notificações:** Avisos de baixa de preço, novas visitas agendadas e propostas recebidas.
* **Gaveta Mobile Acessível (Drawer):** Menu adaptado para celulares e tablets com altura dinâmica (`100dvh`).

### 3.2. Mecanismo de Busca Inteligente & Geolocalização (HeroSearch & Filters)
* **Autocomplete de Cidades & Bairros:** Busca unificada cobrindo as principais capitais brasileiras (São Paulo, Curitiba, Rio de Janeiro, etc.).
* **Filtros Avançados:** Faixas de preço, número de quartos, suítes, banheiros, vagas de garagem, área mínima e amenidades (piscina, varanda gourmet, academia, pet friendly).
* **Filtro por Raio de Distância:** Cálculo de raio geográfico (1 km a 50 km) a partir de um CEP ou ponto de referência.
* **Assistente Guiado (Search Wizard):** Questionário interativo passo a passo para orientar quem ainda não sabe o imóvel ideal.

### 3.3. Catálogo & Visualização Split-Screen
* **Grid de Cards Imobiliários:** Carrossel de fotos, tags de status (*Super Destaque, Financiável, Exclusivo*), valores de condomínio/IPTU e cálculo de metro quadrado.
* **Visualização Lado a Lado (Split-Screen):** Lista de imóveis à esquerda e mapa interativo Leaflet à direita sincronizados em tempo real.
* **Mapa Leaflet Interativo:** Marcadores com agrupamento, centralização automática e popups com foto, título e preço.
* **Barra Flutuante de Comparação:** Seleção de até 4 imóveis para comparação de atributos lado a lado.

### 3.4. Detalhes do Imóvel & Simuladores Financeiros
* **Página de Detalhes Dedicada (`PropertyDetailPage`) & Modal Rápido (`PropertyDetailModal`):** Galeria de fotos em alta resolução com visualizador modal.
* **Tour Virtual 360° & Vídeo:** Player integrado de vídeo e tours 360° sem cookies de rastreamento.
* **Plantas Baixas Interativas (`FloorPlansWidget`):** Seleção de plantas padrão e modificadas com orientação solar e metragens.
* **Cronograma de Obras:** Acompanhamento percentual de fundação, estrutura, acabamento e entrega de chaves.
* **Simulador de Financiamento Multi-Bancos (`FinanceCalculatorModal`):** Comparação das tabelas SAC e Price entre Caixa, Itaú, Bradesco e Santander.
* **Calculadora de ROI & Yield de Aluguel (`RoiYieldCalculatorModal`):** Projeção de rentabilidade percentual anual e tempo de retorno do capital.
* **Simulador de ITBI & Custos Notariais (`ItbiCalculatorModal`):** Alíquotas municipais, emolumentos de cartório e registro de imóveis.
* **Ficha Técnica em PDF & QR Code (`PropertyPdfModal`):** Geração de folheto para impressão ou compartilhamento rápido.
* **Proposta Formal de Compra (`FormalProposalModal`):** Envio de proposta comercial estruturada (sinal, parcelamento, permuta).
* **Agendamento de Visitas (`VisitSchedulerModal`):** Escolha de data, horário e formato (presencial ou tour guiado por vídeo).
* **Chat Direto:** Comunicação em tempo real com o proprietário/corretor ou botão de encaminhamento para WhatsApp.

### 3.5. Autenticação, Segurança & Recuperação de Conta
* **Cadastro Multi-Perfil:** Comprador/Locatário, Proprietário, Corretor (com validação de CRECI) e Imobiliária.
* **Obrigatoriedade de Confirmação:** Usuários recém-cadastrados entram em estado pendente até validar o e-mail.
* **Ativação por Código OTP:** Suporte para ativação via código numérico de 6 dígitos direto no modal, contornando bloqueios de link ou redirecionamentos de porta.
* **Recuperação de Senha Segura:** Envio de e-mail protegido com token e modal dedicado de redefinição de senha (`ResetPasswordModal`).

### 3.6. Painéis de Usuário (Dashboard por Perfil - `UserDashboardModal`)
* **Perfil Comprador/Locatário:** Imóveis favoritados, agendamentos confirmados, propostas enviadas e simulações salvas.
* **Perfil Proprietário:** Meus imóveis cadastrados, métricas de visualização, propostas recebidas e agendamentos de visita.
* **Perfil Corretor de Imóveis:** Gestão de carteira de imóveis, link de divulgação com selo CRECI, avaliações públicas e integração com o CRM de Leads Kanban.
* **Perfil Imobiliária / Agência:** Gestão de corretores vinculados, controle de comissionamento e catálogo compartilhado da imobiliária.
* **Perfil Suporte:** Fila de moderação de anúncios pendentes e chat de atendimento ao cliente.

### 3.7. Painel Administrativo Master (`AdminDashboardModal`)
* **Visão Geral & KPIs:** Total de imóveis, usuários online em tempo real, visitas agendadas, propostas comerciais e faturamento acumulado.
* **Gestão de Imóveis em Massa:** Filtragem, aprovação, alteração de status em lote e exclusão segura.
* **Gestão de Categorias & Picklists:** Edição de tipos de imóveis, amenidades e regras do portal.
* **Gestão de Usuários & Corretores:** Edição de papéis (admin, broker, owner, buyer, support), bloqueio preventivo e auditoria.
* **Contratos Digitais (`DigitalContractModal`):** Minutas contratuais imobiliárias prontas com padrão ICP-Brasil.
* **Vistoria Digital de Imóveis (`DigitalInspectionModal`):** Laudo fotográfico de entrada e saída com checklist de avarias.
* **Carga & Feeds XML (`XmlFeedSyncModal`):** Sincronização e exportação nos padrões dos principais CRMs (Kenlo, Vista, Órulo, VivaReal).
* **Importação/Exportação CSV (`MassCsvManagerModal`):** Gerenciamento em massa via planilhas.
* **Customização de Tema:** Ajuste de cores primárias, secundárias e nome da marca com aplicação imediata.
* **Backup do Sistema:** Download e restauração da base de dados completa em JSON e CSV.

### 3.8. Ferramentas Adicionais de Pós-Venda e Conteúdo
* **Checklist de Mudança & Pós-Venda (`MovingChecklistModal`):** Guia prático interativo para troca de titularidade (energia, água, gás, internet) e condomínio.
* **Inteligência de Bairros (`NeighborhoodInsightsModal`):** Avaliação de segurança, comércio local, escolas e transporte.
* **Garantias Locatícias (`RentalGuaranteesModal`):** Informações sobre Seguro Fiança, Título de Capitalização e Fiador.
* **Blog Imobiliário Integrado (`BlogListPage` e `BlogPostPage`):** Notícias do mercado, guias de financiamento e dicas de decoração.
* **Perfil Público do Corretor (`BrokerProfilePage`):** Página pública com foto, bio, CRECI e todos os imóveis agenciados.

---

## 📋 4. CHECKLIST DE TESTES PASSO A PASSO (Para Testar 1 a 1)

Utilize as caixas de seleção abaixo (`[ ]`) para marcar cada funcionalidade conforme for testando no navegador:

### 🧭 Módulo 1: Navegação, Layout & Responsividade
- [ ] **1.1** Abrir a página inicial no desktop e verificar se o cabeçalho, hero e grid de cards carregam sem falhas visuais.
- [ ] **1.2** Redimensionar para mobile (< 768px) e conferir se não há rolagem horizontal indesejada (`overflow-x`).
- [ ] **1.3** Abrir o menu gaveta lateral (hamburger menu no mobile) e conferir se todos os links e botões aparecem com rolagem fluida.
- [ ] **1.4** Clicar no ícone de Lua/Sol no topo e verificar se o modo escuro (Dark Mode) alterna e permanece ativo ao recarregar a página (F5).
- [ ] **1.5** Clicar no logotipo "ImóvelHUB" em qualquer tela e confirmar o retorno para a página inicial.

### 🔍 Módulo 2: Busca, Filtros & Geolocalização
- [ ] **2.1** Filtrar pelas abas do topo: "Comprar", "Alugar", "Lançamentos", "Temporada", "Leilão" e "Todos" — conferir se a listagem responde de imediato.
- [ ] **2.2** Digitar o código `HUB-1001` no campo de busca e verificar se o imóvel correspondente é localizado com precisão.
- [ ] **2.3** Digitar o nome de um bairro (ex: "Batel" ou "Moema") com ou sem acentos e conferir os resultados.
- [ ] **2.4** Selecionar uma categoria no dropdown (ex: "Apartamento", "Casa de Condomínio", "Comercial") e verificar a filtragem.
- [ ] **2.5** Abrir os Filtros Avançados na barra lateral e aplicar filtro por faixa de preço e número de quartos.
- [ ] **2.6** Abrir o modal de Busca por Raio de Distância e simular busca por CEP/km.
- [ ] **2.7** Abrir o Assistente Guiado (Search Wizard), responder às perguntas e conferir a recomendação de imóveis no final.

### 🗺️ Módulo 3: Grid de Cards, Mapa & Comparador
- [ ] **3.1** No card do imóvel, navegar pelas fotos usando as setinhas do mini-carrossel.
- [ ] **3.2** Clicar no botão de Coração em um card para favoritar e conferir o incremento no contador de favoritos do topo.
- [ ] **3.3** Clicar no botão de Comparar em 2 ou mais imóveis e verificar a barra flutuante preta surgindo no rodapé.
- [ ] **3.4** Clicar em "Comparar Agora" na barra flutuante e conferir a tabela de comparação lado a lado no modal.
- [ ] **3.5** Alternar para a visualização "Dividida" (Split-Screen) e verificar se o mapa Leaflet surge ao lado da lista.
- [ ] **3.6** Clicar em um pin no mapa Leaflet e verificar a abertura do popup com foto, dados e link do imóvel.

### 🏡 Módulo 4: Página de Detalhes & Ferramentas Financeiras
- [ ] **4.1** Clicar em um imóvel para abrir o modal rápido de detalhes (`PropertyDetailModal`) e testar todos os dados e fotos.
- [ ] **4.2** Clicar em "Ver Página Completa" para abrir a página dedicada (`PropertyDetailPage`).
- [ ] **4.3** Clicar em "Agendar Visita Presencial", selecionar data/horário e confirmar o envio.
- [ ] **4.4** Clicar em "Fazer Proposta Formal", preencher valor ofertado e forma de pagamento, e submeter a proposta.
- [ ] **4.5** Clicar em "Simular Financiamento", alternar entre SAC e Price e selecionar os bancos (Caixa, Itaú, Bradesco, Santander).
- [ ] **4.6** Clicar em "Calcular ROI & Yield" e conferir as projeções de retorno para imóveis de investimento.
- [ ] **4.7** Clicar em "Simular ITBI & Escritura", alterar a cidade e conferir os cálculos de imposto municipal e cartório.
- [ ] **4.8** Clicar em "Planta Baixa Interativa" e alternar entre as plantas disponíveis.
- [ ] **4.9** Clicar em "Baixar Ficha Técnica em PDF / QR Code" e testar a geração do modal com QR Code dinâmico.
- [ ] **4.10** Clicar em "Conversar no WhatsApp" e conferir se o link do WhatsApp abre com mensagem pré-formatada do imóvel.

### 🔐 Módulo 5: Autenticação, Cadastro & Recuperação de Senha
- [ ] **5.1** Clicar em "Entrar" no topo e abrir o modal de login.
- [ ] **5.2** Clicar em "Criar Conta", preencher nome, e-mail, senha e tipo de perfil (Comprador/Corretor).
- [ ] **5.3** Submeter o cadastro e verificar que a tela de aviso de ativação é exibida (o usuário NÃO é logado automaticamente).
- [ ] **5.4** No aviso de ativação, testar o botão "Reenviar e-mail de ativação".
- [ ] **5.5** Testar o campo de Código OTP digitando o código de confirmação recebido.
- [ ] **5.6** Clicar em "Esqueceu a senha?", digitar o e-mail e conferir o aviso de recuperação de senha segura.
- [ ] **5.7** Testar login com as contas demonstrativas prontas no rodapé do modal (Comprador, Proprietário, Corretor, Imobiliária, Admin).

### 👤 Módulo 6: Painéis de Usuário por Perfil (`UserDashboardModal`)
- [ ] **6.1 (Comprador)** Fazer login como comprador e abrir "Minha Conta": verificar abas de Imóveis Favoritos, Visitas e Propostas.
- [ ] **6.2 (Proprietário)** Fazer login como proprietário e abrir "Painel do Proprietário": conferir listagem dos imóveis anunciados e botão "Anunciar Imóvel".
- [ ] **6.3 (Corretor)** Fazer login como corretor: conferir carteira de imóveis, selo de CRECI, botão de divulgar imóvel e atalho para o CRM.
- [ ] **6.4 (Imobiliária)** Fazer login como imobiliária: conferir lista de corretores da agência e controle de comissões.
- [ ] **6.5 (Suporte)** Fazer login como suporte: conferir fila de moderação de anúncios e tickets de atendimento.

### 🛠️ Módulo 7: Painel Administrativo Master (`AdminDashboardModal`)
- [ ] **7.1** Fazer login com a conta de Administrador e abrir o "Painel Admin Master" no menu superior.
- [ ] **7.2** Na aba "Visão Geral", conferir se os 5 cards de KPI (Catálogo, Usuários Online, Propostas, Receita, Visitas) exibem dados numéricos.
- [ ] **7.3** Clicar em um dos cards das 6 modalidades (Venda, Aluguel, etc.) e verificar se a listagem de imóveis filtra corretamente.
- [ ] **7.4** Na aba "Imóveis", selecionar múltiplos imóveis e testar alteração de status em lote (Ativo, Pausado, Vendido).
- [ ] **7.5** Na aba "Imóveis", testar o botão de exclusão unitária com modal de confirmação.
- [ ] **7.6** Na aba "Categorias", editar uma categoria existente ou criar nova opção de tipologia imobiliária.
- [ ] **7.7** Na aba "Usuários & Corretores", buscar um usuário, editar seu cargo (role) e testar a opção de congelar/ativar conta.
- [ ] **7.8** Na aba "Contratos Digitais", visualizar minuta de contrato de locação/venda com campos automáticos preenchidos.
- [ ] **7.9** Na aba "Vistorias Digitais", inspecionar o checklist de itens vistoriados e laudo de entrega de chaves.
- [ ] **7.10** Na aba "Carga & Feeds XML", testar a simulação de importação nos padrões Kenlo/Vista e copiar a URL do feed oficial.
- [ ] **7.11** Na aba "Identidade Visual & Tema", alterar a cor primária e conferir a aplicação em tempo real nos botões e destaques.
- [ ] **7.12** Na aba "Backup & Exportação", clicar em "Exportar Imóveis em JSON" e "Exportar em CSV" e conferir o download dos arquivos.

### 📰 Módulo 8: Blog, CRM Kanban & Ferramentas Auxiliares
- [ ] **8.1** No rodapé ou menu, clicar em "Blog & Notícias" e navegar pela listagem de artigos imobiliários.
- [ ] **8.2** Clicar em um artigo específico para ler o conteúdo formatado com tempo de leitura e autor.
- [ ] **8.3** Abrir o "CRM de Leads & Funil" (Kanban) e arrastar/trocar leads entre as colunas *Novo Lead, Contato Feito, Visita Agendada, Proposta e Fechado*.
- [ ] **8.4** Abrir o "Checklist de Mudança" no menu ou rodapé e marcar tarefas como concluídas (troca de energia, água, internet).
- [ ] **8.5** Abrir a ferramenta de "Inteligência de Bairros" e visualizar notas de segurança, infraestrutura e transporte.
- [ ] **8.6** Abrir a página de perfil público de um corretor (`BrokerProfilePage`) e conferir foto, número de CRECI e imóveis associados.
