import express from 'express';
import cors from 'cors';
import { loadDB, saveDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 0. GET & POST /api/users (Gestão de Contas Multi-Função)
app.get('/api/users', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.users || [] });
});

app.post('/api/users', (req, res) => {
  const db = loadDB();
  const newUser = { id: `user-${Date.now()}`, ...req.body };
  if (!db.users) db.users = [];
  db.users.push(newUser);
  saveDB(db);
  res.json({ success: true, data: newUser });
});

app.put('/api/users/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const index = (db.users || []).findIndex(u => u.id === id);
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...req.body };
    saveDB(db);
    return res.json({ success: true, data: db.users[index] });
  }
  res.status(404).json({ success: false, message: 'Usuário não encontrado' });
});

app.delete('/api/users/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const initialCount = (db.users || []).length;
  db.users = (db.users || []).filter(u => u.id !== id);
  
  if (db.users.length === initialCount) {
    return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
  }
  
  saveDB(db);
  res.json({ success: true, message: 'Usuário removido com sucesso' });
});

// 1. GET /api/properties
app.get('/api/properties', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.properties });
});

// 2. POST /api/properties (Criar novo imóvel)
app.post('/api/properties', (req, res) => {
  const db = loadDB();
  const newProp = req.body;
  
  if (!newProp.id) {
    newProp.id = `prop-${Date.now()}`;
  }
  
  db.properties.unshift(newProp);
  saveDB(db);
  
  res.json({ success: true, data: newProp });
});

// 3. PUT /api/properties/:id (Editar imóvel)
app.put('/api/properties/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const index = db.properties.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Imóvel não encontrado' });
  }
  
  db.properties[index] = { ...db.properties[index], ...req.body };
  saveDB(db);
  
  res.json({ success: true, data: db.properties[index] });
});

// 4. DELETE /api/properties/:id (Excluir imóvel)
app.delete('/api/properties/:id', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const initialCount = (db.properties || []).length;
  db.properties = (db.properties || []).filter(p => p.id !== id);
  
  if (db.properties.length === initialCount) {
    return res.status(404).json({ success: false, message: 'Imóvel não encontrado' });
  }
  
  saveDB(db);
  res.json({ success: true, message: 'Imóvel excluído com sucesso' });
});

// 5. GET /api/cep/:cep (Integração ViaCEP para autocompletar endereço por CEP no Brasil)
app.get('/api/cep/:cep', async (req, res) => {
  const cleanCep = req.params.cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    return res.status(400).json({ success: false, message: 'CEP inválido' });
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return res.status(404).json({ success: false, message: 'CEP não encontrado' });
    }
    
    res.json({
      success: true,
      data: {
        zipCode: data.cep,
        address: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao consultar serviço de CEP' });
  }
});

// 6. GET & POST /api/schedules (Visitas Agendadas QuintoAndar)
app.get('/api/schedules', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.schedules || [] });
});

app.post('/api/schedules', (req, res) => {
  const db = loadDB();
  const schedule = {
    id: `sched-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  db.schedules.unshift(schedule);
  saveDB(db);
  
  res.json({ success: true, data: schedule });
});

// 7. GET & POST /api/chats/:propertyId (Chat em Tempo Real por Imóvel)
app.get('/api/chats/:propertyId', (req, res) => {
  const db = loadDB();
  const messages = db.chats[req.params.propertyId] || [
    { id: "msg-default-1", sender: "Corretor", text: "Olá! Seja bem-vindo. Como posso te ajudar com este imóvel?", time: "Agora" }
  ];
  res.json({ success: true, data: messages });
});

app.post('/api/chats/:propertyId', (req, res) => {
  const db = loadDB();
  const { propertyId } = req.params;
  const { text, sender } = req.body;
  
  if (!db.chats[propertyId]) {
    db.chats[propertyId] = [];
  }
  
  const newMessage = {
    id: `msg-${Date.now()}`,
    sender: sender || 'Cliente',
    text,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
  
  db.chats[propertyId].push(newMessage);
  
  // Auto bot response simulation
  if (sender !== 'Corretor') {
    setTimeout(() => {
      const botDb = loadDB();
      if (!botDb.chats[propertyId]) botDb.chats[propertyId] = [];
      botDb.chats[propertyId].push({
        id: `msg-reply-${Date.now()}`,
        sender: 'Corretor',
        text: 'Obrigado pela mensagem! Já recebi sua dúvida e um especialista em ' + (propertyId.includes('prop-1') ? 'Moema' : 'Pinheiros') + ' entrará em contato em instantes.',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
      saveDB(botDb);
    }, 1500);
  }
  
  saveDB(db);
  res.json({ success: true, data: newMessage });
});

// 8. POST /api/payments/checkout (Gateway Sandbox PIX / Cartão)
app.post('/api/payments/checkout', (req, res) => {
  const db = loadDB();
  const { propertyId, plan, method } = req.body;
  
  if (!propertyId) {
    return res.status(400).json({ success: false, message: 'propertyId é obrigatório' });
  }

  const propIndex = db.properties.findIndex(p => p.id === propertyId);
  if (propIndex !== -1) {
    db.properties[propIndex].priceReduced = true;
    db.properties[propIndex].loftValuation = {
      status: plan?.name || 'Destaque ZAP',
      diffPercent: -6.5,
      neighborhoodAvgPerM2: 12500
    };
  }
  
  const tx = {
    id: `tx-${Date.now()}`,
    propertyId,
    planName: plan?.name || 'Plano Destaque ImóvelHUB',
    amount: Number(plan?.price) || 49.90,
    method: method || 'PIX Instantâneo',
    status: 'APROVADO',
    createdAt: new Date().toISOString()
  };
  
  db.transactions = db.transactions || [];
  db.transactions.unshift(tx);
  saveDB(db);
  
  res.json({ success: true, data: tx });
});

// 8.1. GET /api/transactions
app.get('/api/transactions', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.transactions || [] });
});

// 9. GET & POST /api/proposals (Propostas Formais de Compra)
app.get('/api/proposals', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.proposals || [] });
});

app.post('/api/proposals', (req, res) => {
  const db = loadDB();
  const proposal = {
    id: `prop-formal-${Date.now()}`,
    ...req.body,
    status: 'Em Análise',
    createdAt: new Date().toISOString()
  };
  if (!db.proposals) db.proposals = [];
  db.proposals.unshift(proposal);
  saveDB(db);
  res.json({ success: true, data: proposal });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend ImóvelHUB ativo em http://localhost:${PORT}`);
});
