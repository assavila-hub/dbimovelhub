import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  normalizeText, 
  matchesPropertyCode, 
  matchesTransactionTab, 
  matchesCategory, 
  calculateDistanceKm, 
  filterPropertiesList 
} from '../services/filterProperties.js';

test('normalizeText should remove accents and special characters', () => {
  assert.strictEqual(normalizeText('São Paulo - Térreo!'), 'sao paulo terreo');
  assert.strictEqual(normalizeText('Apto (Duplex) / 100m²'), 'apto duplex 100m²');
});

test('matchesPropertyCode should identify codes with or without HUB prefix', () => {
  const prop = { id: 'prop-1', code: 'HUB-1001' };
  assert.strictEqual(matchesPropertyCode(prop, 'HUB-1001'), true);
  assert.strictEqual(matchesPropertyCode(prop, 'hub-1001'), true);
  assert.strictEqual(matchesPropertyCode(prop, '1001'), true);
  assert.strictEqual(matchesPropertyCode(prop, '#1001'), true);
  assert.strictEqual(matchesPropertyCode(prop, 'prop-1'), true);
  assert.strictEqual(matchesPropertyCode(prop, '9999'), false);
});

test('matchesTransactionTab should filter correct transaction types', () => {
  const saleProp = { transactionType: 'Venda' };
  const rentProp = { transactionType: 'Aluguel' };
  const launchProp = { isLaunch: true };

  assert.strictEqual(matchesTransactionTab(saleProp, 'Comprar'), true);
  assert.strictEqual(matchesTransactionTab(saleProp, 'Alugar'), false);
  assert.strictEqual(matchesTransactionTab(rentProp, 'Alugar'), true);
  assert.strictEqual(matchesTransactionTab(launchProp, 'Lançamentos'), true);
  assert.strictEqual(matchesTransactionTab(saleProp, 'Todos'), true);
});

test('matchesCategory should match type or subType accurately', () => {
  const prop = { type: 'Apartamento', subType: 'Cobertura' };
  assert.strictEqual(matchesCategory(prop, ['Cobertura']), true);
  assert.strictEqual(matchesCategory(prop, ['Studio']), false);
  assert.strictEqual(matchesCategory(prop, [], 'Apartamento'), true);
  assert.strictEqual(matchesCategory(prop, [], 'Casa'), false);
});

test('calculateDistanceKm should calculate valid haversine distance', () => {
  // Distance between Avenida Paulista and Parque Ibirapuera in São Paulo (~3km)
  const dist = calculateDistanceKm(-23.5615, -46.6559, -23.5874, -46.6576);
  assert.ok(dist > 2.5 && dist < 3.5);
});

test('filterPropertiesList should correctly filter combined criteria', () => {
  const sample = [
    { id: 'p1', code: 'HUB-1001', transactionType: 'Venda', price: 400000, bedrooms: 2, parkingSpots: 1, type: 'Apartamento', subType: 'Padrão', city: 'São Paulo' },
    { id: 'p2', code: 'HUB-1002', transactionType: 'Aluguel', rentPrice: 2000, bedrooms: 1, parkingSpots: 0, type: 'Studio', subType: 'Studio', city: 'Curitiba' }
  ];

  const resultsComprar = filterPropertiesList(sample, { activeTab: 'Comprar' });
  assert.strictEqual(resultsComprar.length, 1);
  assert.strictEqual(resultsComprar[0].id, 'p1');

  const resultsQuartos = filterPropertiesList(sample, { minBedrooms: 2 });
  assert.strictEqual(resultsQuartos.length, 1);
  assert.strictEqual(resultsQuartos[0].id, 'p1');

  const resultsSearch = filterPropertiesList(sample, { searchQuery: 'Curitiba' });
  assert.strictEqual(resultsSearch.length, 1);
  assert.strictEqual(resultsSearch[0].id, 'p2');
});
