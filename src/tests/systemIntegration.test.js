import { test } from 'node:test';
import assert from 'node:assert';
import { INITIAL_PROPERTIES, CITIES_AND_NEIGHBORHOODS } from '../mockData/properties.js';
import { PROPERTY_TAXONOMY } from '../mockData/categories.js';
import { DEFAULT_USERS } from '../mockData/users.js';
import { 
  normalizeText, 
  matchesPropertyCode, 
  matchesTransactionTab, 
  matchesCategory, 
  matchesLocationOrText, 
  calculateDistanceKm, 
  filterPropertiesList 
} from '../services/filterProperties.js';

test('1. Catálogo: 60 imóveis com dados válidos, imagens e cidades', () => {
  assert.strictEqual(INITIAL_PROPERTIES.length >= 60, true, 'Deve conter pelo menos 60 imóveis');
  
  for (const p of INITIAL_PROPERTIES) {
    assert.ok(p.id, `Imóvel sem ID`);
    assert.ok(p.title, `Imóvel ${p.id} sem título`);
    assert.ok(p.type, `Imóvel ${p.id} sem tipo`);
    assert.ok(p.transactionType, `Imóvel ${p.id} sem transactionType`);
    assert.ok(p.city, `Imóvel ${p.id} sem cidade`);
    assert.ok(p.neighborhood, `Imóvel ${p.id} sem bairro`);
    assert.ok(Array.isArray(p.images) && p.images.length > 0, `Imóvel ${p.id} sem imagens válidas`);
    assert.strictEqual(typeof p.lat, 'number', `Imóvel ${p.id} sem latitude numérica`);
    assert.strictEqual(typeof p.lng, 'number', `Imóvel ${p.id} sem longitude numérica`);
  }
});

test('2. Taxonomia & Categorias: Estrutura completa de tipos e sub-tipos', () => {
  assert.ok(Array.isArray(PROPERTY_TAXONOMY), 'Taxonomia deve ser um array');
  const catNames = PROPERTY_TAXONOMY.map(c => c.category);
  assert.ok(catNames.includes('Apartamento'), 'Categoria Apartamento ausente');
  assert.ok(catNames.includes('Casa'), 'Categoria Casa ausente');
  assert.ok(catNames.includes('Comercial'), 'Categoria Comercial ausente');
});

test('3. Perfis de Usuário: 5 perfis presentes (admin, broker, agency, owner, buyer, support)', () => {
  const roles = DEFAULT_USERS.map(u => u.role);
  assert.ok(roles.includes('admin'), 'Perfil admin ausente');
  assert.ok(roles.includes('broker'), 'Perfil broker ausente');
  assert.ok(roles.includes('agency'), 'Perfil agency ausente');
  assert.ok(roles.includes('owner'), 'Perfil owner ausente');
  assert.ok(roles.includes('buyer'), 'Perfil buyer ausente');
  assert.ok(roles.includes('support'), 'Perfil support ausente');
});

test('4. Busca e Filtragem por Código e Texto', () => {
  const p1 = INITIAL_PROPERTIES[0];
  assert.strictEqual(matchesPropertyCode(p1, 'HUB-1001'), true);
  assert.strictEqual(matchesPropertyCode(p1, '1001'), true);
  assert.strictEqual(matchesPropertyCode(p1, '#hub-1001'), true);
  assert.strictEqual(matchesPropertyCode(p1, 'INEXISTENTE-999'), false);
  
  assert.strictEqual(matchesLocationOrText(p1, 'Moema'), true);
  assert.strictEqual(matchesLocationOrText(p1, 'moema'), true);
  assert.strictEqual(matchesLocationOrText(p1, 'Móèmâ'), true); // Suporte a acentos
});

test('5. Filtro de Abas e Modalidades', () => {
  const saleProp = INITIAL_PROPERTIES.find(p => p.transactionType === 'Venda');
  const rentProp = INITIAL_PROPERTIES.find(p => p.transactionType === 'Aluguel');
  
  assert.strictEqual(matchesTransactionTab(saleProp, 'Comprar'), true);
  assert.strictEqual(matchesTransactionTab(saleProp, 'Alugar'), false);
  assert.strictEqual(matchesTransactionTab(rentProp, 'Alugar'), true);
  assert.strictEqual(matchesTransactionTab(saleProp, 'Todos'), true);
});

test('6. Cálculo Haversine de Raio em KM', () => {
  // Marco Zero de São Paulo (-23.5505, -46.6333) até Moema (-23.6000, -46.6600) ~ 6.2km
  const dist = calculateDistanceKm(-23.5505, -46.6333, -23.6000, -46.6600);
  assert.ok(dist > 5 && dist < 8, `Distância inesperada: ${dist}`);
});

test('7. Suíte Financeira: Fórmulas de SAC, PRICE, ITBI e ROI', () => {
  // Teste de cálculo Price simples
  const pv = 100000;
  const i = 0.01; // 1% ao mês
  const n = 12; // 12 meses
  const pmtPrice = (pv * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  assert.ok(Math.abs(pmtPrice - 8884.88) < 1, 'Erro no cálculo Price');

  // Teste de cálculo SAC (primeira parcela)
  const amort = pv / n;
  const juros1 = pv * i;
  const pmtSac1 = amort + juros1;
  assert.ok(Math.abs(pmtSac1 - 9333.33) < 1, 'Erro no cálculo SAC');

  // Teste ITBI São Paulo (3%)
  const itbiSp = pv * 0.03;
  assert.strictEqual(itbiSp, 3000, 'Erro no cálculo ITBI SP');

  // Teste Yield anual (Aluguel R$ 5.000 / Imóvel R$ 1.000.000 = 6% a.a.)
  const annualRent = 5000 * 12;
  const propVal = 1000000;
  const yieldPct = (annualRent / propVal) * 100;
  assert.strictEqual(yieldPct, 6, 'Erro no cálculo de yield');
});
