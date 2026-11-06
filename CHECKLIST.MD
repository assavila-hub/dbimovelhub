# 📋 CHECKLIST — Tarefas Pendentes (ImóvelHUB)

Status: **25 tarefas concluídas e removidas | 5 tarefas pendentes**  
Data da última atualização: 06/11/2026  
Escopo: Backend (`server/`) + Frontend (`src/`)  
Resultado dos testes: 🟢 **6/6 Testes Automatizados Aprovados (`npm test`) | Vite Build 100% Limpo**

---

## 🚨 CRÍTICO (Segurança & Dados) — Pendentes

### 1. Credenciais expostas no frontend — `src/services/supabase.js:3-4`
- **Status:** ⏳ **Pendente**
- URL e chave anon do Supabase estão **hardcoded** no código-fonte.
- Qualquer pessoa que acessar o app consegue a chave anon e pode ler/gravar no banco Supabase diretamente.
- **Ação:** Mover para `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) e adicionar `.env` ao `.gitignore`. Fornecer `.env.example`.

### 2. Senhas armazenadas em texto plano — `server/update-users-passwords.js:11-68`
- **Status:** ⏳ **Pendente**
- Senhas como `"admin123"`, `"imob123"` etc. são salvas em texto plano no banco Supabase.
- `api.js:loginUser` compara `user.password !== password` diretamente (texto plano).
- **Ação:** Implementar hash de senhas (bcrypt/argon2) no backend. Nunca armazenar senha em texto plano.

### 3. Autenticação/autorização ausente no backend Express — `server/index.js`
- **Status:** ⏳ **Pendente**
- Todas as rotas (POST/PUT/DELETE) de users, properties, chats, proposals, schedules, transactions estão **abertas**.
- Qualquer cliente pode excluir qualquer imóvel, usuário ou proposta.
- **Ação:** Adicionar middleware de autenticação (JWT ou sessão) e autorização por role (admin/broker/owner/buyer/support).

### 4. CORS sem restrição — `server/index.js:8`
- **Status:** ⏳ **Pendente**
- `app.use(cors())` permite qualquer origem.
- **Ação:** Configurar `cors({ origin: [...domínios permitidos] })`.

### 5. Backend importa diretamente do frontend — `server/db.js:4-5`
- **Status:** ⏳ **Pendente**
- `db.js` importa `INITIAL_PROPERTIES` de `../src/mockData/properties.js` e `DEFAULT_USERS` de `../src/mockData/users.js`.
- Isso acopla backend ao frontend e pode quebrar o build de produção (Vite não processa imports do servidor corretamente).
- **Ação:** Mover dados seed/mock para um diretório compartilhado ou duplicar no backend (`server/seed/`).

---

## 📌 RESUMO DO STATUS ATUAL

| Categoria | Concluídos (Removidos) | Pendentes Restantes |
|-----------|:----------------------:|:-------------------:|
| 🚨 **Crítico (Segurança & Dados)** | 0 | **5** ⏳ |
| 🔴 **Alto (Bugs & Funcionalidade)** | 9 ✅ | 0 |
| 🟡 **Médio (Robustez & Manutenibilidade)** | 8 ✅ | 0 |
| 🟢 **Baixo (Qualidade & Pente Fino)** | 8 ✅ | 0 |
| **TOTAL** | **25 Concluídos** | **5 Pendentes** |
