# 🏢 ImóvelHUB — Plataforma Imobiliária Full-Stack

<p align="center">
  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="ImóvelHUB Banner" width="100%" style="border-radius: 12px; max-height: 380px; object-fit: cover;" />
</p>

<p align="center">
  <strong>Projeto de estudos avançado que consolida as melhores experiências e funcionalidades dos 6 maiores portais do Brasil: ZAP Imóveis, VivaReal, QuintoAndar, Loft, Imovelweb e OLX.</strong>
</p>

<p align="center">
  <a href="https://dbimovelhub.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Acessar_Deploy_Oficial-dbimovelhub.vercel.app-0284c7?style=for-the-badge&logo=vercel&logoColor=white" alt="Deploy Vercel" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node Express" />
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
  <img src="https://img.shields.io/badge/Status-100%25_Operacional-success?style=for-the-badge" alt="Status" />
</p>

---

## 🎯 Sobre o Projeto

O **ImóvelHUB** é uma plataforma imobiliária *Full-Stack* moderna, responsiva e de alta fidelidade técnica desenvolvida com o objetivo de estudar e aplicar as melhores práticas da engenharia de software contemporânea:
- Arquitetura limpa de componentes reativos sem dependência de frameworks CSS pesados.
- Integração de mapas esféricos com cálculo geodésico (*Haversine*).
- Gestão de estado sem complexidade desnecessária.
- Banco de dados relacional oficial na nuvem (**Supabase PostgreSQL**) com fallback para API REST Express.
- Suíte completa de cálculos financeiros habitacionais brasileiros (SAC, PRICE, ITBI, Cartório e ROI de Locação).

🔗 **Demonstração em Produção:** [https://dbimovelhub.vercel.app](https://dbimovelhub.vercel.app)

---

## 🧭 Mini Tutorial — Conheça o Projeto em 5 Minutos

Criamos este roteiro guiado para que você possa degustar todas as capacidades técnicas e funcionais da plataforma:

### 1️⃣ Explorando o Buscador Cascata & Modalidades
1. Na barra superior do formulário de busca (*Hero*), alterne entre as modalidades: **Comprar**, **Alugar**, **Lançamentos**, **Leilão** ou **Temporada**.
2. Digite na busca livre termos como *"Batel"*, *"Moema"*, *"Arujá"* ou o código sequencial de um imóvel (ex: `#HUB-001`, `HUB-025`).
3. Clique nas pílulas de filtros rápidos (`🐾 Pet Friendly`, `🏊 Piscina`, `🥩 Varanda Gourmet`, `☀️ Sol da Manhã`) e veja a contagem de imóveis recalcular instantaneamente.

### 2️⃣ Alternando Modos de Visualização & Mapa Interativo
1. No topo do catálogo, experimente os 3 modos de exibição:
   - **Grade (Grid):** Visualização rica em cards com carrossel de fotos, cálculo automático de R$/m² e badges de liquidez.
   - **Dividir Tela (Split-View):** Lista de imóveis à esquerda sincronizada em tempo real com mapa interativo contínuo à direita.
   - **Mapa:** Visualização cartográfica em tela cheia com marcadores dinâmicos, clusters e popup de detalhes via *Leaflet*.

### 3️⃣ Testando os Simuladores Financeiros (Menu Serviços)
1. No cabeçalho, clique em **"Serviços & Soluções"** e abra o **"Simulador Multi-Bancos"**:
   - Ajuste o valor do imóvel e a entrada para comparar parcelas e CET entre **Caixa Econômica Federal**, **Banco do Brasil**, **Itaú**, **Bradesco** e **Santander** nos sistemas **SAC** e **PRICE**.
2. Abra a **"Calculadora de ROI & Yield"** para analisar rentabilidade anual estimada para locação tradicional vs. temporada/Airbnb e tempo de payback.
3. Abra a **"Calculadora de ITBI & Cartório"** para estimar impostos municipais e taxas notariais por estado.

### 4️⃣ Acessando os Perfis de Acesso Rápidos (RBAC)
No canto superior direito, clique em **"Entrar"**. No rodapé do modal, você encontrará botões de **1 clique** para testar as personas do sistema:

* 👑 **Administrador Master (`admin@imovelhub.com.br`):**
  - Abre o **Painel Admin Master**: 5 cards de KPI em tempo real, gestão em massa de imóveis (Ativar/Pausar/Excluir), edição dinâmica de categorias e taxonomias, laudos de vistoria digital, sincronizador de feeds XML (Kenlo/Vista) e backup em JSON/CSV.
* 💼 **Corretor / Imobiliária (`fernanda.corretora@imoveis.com`):**
  - Acesse o **CRM de Leads & Funil Kanban** com estágios de negociação, agenda de visitas confirmadas e perfil profissional com selo CRECI.
* 🏡 **Proprietário (`ricardo.proprietario@email.com`):**
  - Painel de gestão dos seus imóveis cadastrados, métricas de visualizações, propostas recebidas e atalho para anunciar novos imóveis.
* 🔍 **Comprador / Locatário (`carlos.comprador@email.com`):**
  - Favoritos salvos, comparador lado a lado e histórico de agendamentos.

### 5️⃣ Gerando Documentos: PDF com QR Code e Contrato ICP-Brasil
1. Clique em qualquer card de imóvel para abrir a **Ficha Detalhada**.
2. Clique no botão **"Baixar Ficha Técnica em PDF / QR Code"** para visualizar a folha de especificações pronta para impressão com link dinâmico.
3. No menu superior em **Serviços**, acesse **"Contratos Digitais"** para ver a geração de minutas de locação e compra e venda com protocolo ICP-Brasil.

---

## 🌟 Pilares e Funcionalidades Principais

| Módulo | Inspiração | Descrição e Recursos |
|---|---|---|
| **Catálogo & Busca** | *ZAP Imóveis & VivaReal* | Buscador bidirecional com normalização de acentos, busca por raio geográfico via GPS (*Haversine*), 60 imóveis em capitais e interior de SP/RJ/PR/MG. |
| **Locação Sem Fiador** | *QuintoAndar* | Vistoria fotográfica digital com laudo de entrada/saída, garantias locatícias integradas e agendamento de visitas online. |
| **Avaliação & Preço m²** | *Loft* | Algoritmo de precificação justa, histórico de preço reduzido, comparativo com a média do bairro e análise de liquidez. |
| **Taxonomia Completa** | *Imovelweb* | Estrutura hierárquica por tipo (Apartamento, Casa, Comercial, Terreno, Rural) e subtipos (Cobertura, Duplex, Galpão, Chácara). |
| **Negociação & CRM** | *OLX & Imobiliárias* | Chat em tempo real entre comprador e anunciante, propostas formais com sinal e CRM Kanban visual de atendimento de leads. |
| **Suíte Financeira** | *Mercado Bancário BR* | Fórmulas oficiais SAC e PRICE, taxas SELIC/TR dinâmicas, alíquotas de ITBI municipais e cálculo de amortização. |

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 19** — Componentes declarativos e reatividade de alta performance.
- **Vite 8** — Build tool ultrarrápido com Hot Module Replacement (HMR).
- **Leaflet & React-Leaflet** — Mapas interativos e georreferenciamento vetorial.
- **Lucide React** — Pacote abrangente de ícones vetoriais modernos.
- **CSS3 Puro & Design System** — Variáveis CSS, paleta HSL, modo claro/escuro nativo, animações e responsividade fluida para mobile, tablet e 4K.

### Backend & Nuvem
- **Supabase Cloud (PostgreSQL)** — Banco de dados relacional oficial com autenticação, Row Level Security (RLS) e persistência em nuvem.
- **Node.js & Express 5** — API REST de suporte e contingência local (`server/`).
- **ViaCEP API** — Integração de autocompletar dinâmico de endereços brasileiros via CEP.
- **Node Test Runner (`node:test`)** — Suíte automatizada de testes unitários e de integração.
- **Oxlint** — Linter ultrarrápido em Rust para garantia de qualidade estática de código.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** (versão 18.0 ou superior)
- **npm** (versão 9.0 ou superior) ou **yarn** / **pnpm**
- **Git**

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/assavila-hub/dbimovelhub.git
   cd dbimovelhub
   ```

2. **Instalar Dependências:**
   ```bash
   npm install
   ```

3. **Configurar as Variáveis de Ambiente:**
   Copie o arquivo de exemplo para criar seu `.env`:
   ```bash
   cp .env.example .env
   ```
   *(As chaves públicas para testes em desenvolvimento local já possuem valores padrão configurados).*

4. **Executar a Aplicação:**
   ```bash
   # Executar o Frontend em modo desenvolvimento:
   npm run dev

   # Ou iniciar Frontend + Backend Express simultaneamente:
   npm run start:all
   ```

5. **Acessar no Navegador:**
   - Frontend Vite: [http://localhost:5173](http://localhost:5173)
   - API REST Express: [http://localhost:3001/api/properties](http://localhost:3001/api/properties)

---

## 🧪 Comandos & Scripts Disponíveis

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia o servidor local Vite com HMR na porta `5173`. |
| `npm run start:all` | Inicia simultaneamente o frontend e a API backend Express. |
| `npm test` | Executa a suíte de 13 testes automatizados (motor de busca, haversine, SAC/PRICE, taxonomia). |
| `npm run lint` | Executa o linter (Oxlint) em todos os 70+ arquivos do projeto. |
| `npm run build` | Compila os bundles de produção otimizados e minificados em `dist/`. |
| `npm run preview` | Executa uma prévia local do build gerado em `dist/`. |

---

## 🔐 Contas de Demonstração para Testes Rápidos

Para testar todos os níveis de permissão sem necessidade de cadastro prévio, use as credenciais abaixo ou utilize os botões demonstrativos de 1 clique no modal de login:

| Perfil | E-mail de Teste | Senha | Funcionalidades em Destaque |
|---|---|---|---|
| 👑 **Administrador Master** | `admin@imovelhub.com.br` | `admin123` | Painel Admin, KPIs, moderação de imóveis, edição de categorias, backup JSON/CSV |
| 🏢 **Imobiliária (Agência)** | `contato@capitalprime.com.br` | `imob123` | Gestão de corretores vinculados, divisão de comissão (split) e carteira total |
| 💼 **Corretor Credenciado** | `fernanda.corretora@imoveis.com` | `corretor123` | CRM de Leads Kanban, agenda de visitas, imóveis captados e selo CRECI |
| 🏡 **Proprietário Anunciante** | `ricardo.proprietario@email.com` | `owner123` | Publicação de imóveis, acompanhamento de propostas e contratação de destaque |
| 🔍 **Comprador / Locatário** | `carlos.comprador@email.com` | `comprador123` | Favoritos, comparador de imóveis, agendamento de visitas e envio de propostas |
| 🎧 **Suporte & Atendimento** | `suporte@imovelhub.com.br` | `suporte123` | Fila de tickets de atendimento e triagem de anúncios |

---

## 📚 Finalidade do Projeto & Licença

Este projeto foi concebido e estruturado com propósitos estritamente **educacionais e de portfólio técnico**, demonstrando a arquitetura de uma solução real de ponta a ponta, desde a modelagem de domínio até a publicação em nuvem.

Distribuído sob a licença **MIT**. Sinta-se à vontade para clonar, estudar e utilizar como base para seus próprios projetos!

<p align="center">
  Desenvolvido com dedicação e paixão por tecnologia imobiliária. 🇧🇷✨
</p>
