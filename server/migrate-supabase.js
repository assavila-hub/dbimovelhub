import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  console.log('🔄 Conectando ao Supabase PostgreSQL...');
  await client.connect();
  console.log('✅ Conectado com sucesso!');

  const schemaSql = `
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT,
      type TEXT,
      "subType" TEXT,
      "transactionType" TEXT,
      price NUMERIC,
      "rentPrice" NUMERIC,
      "condoFee" NUMERIC,
      iptu NUMERIC,
      area NUMERIC,
      bedrooms INTEGER,
      suites INTEGER,
      bathrooms INTEGER,
      "parkingSpots" INTEGER,
      city TEXT,
      state TEXT,
      neighborhood TEXT,
      address TEXT,
      lat DOUBLE PRECISION,
      lng DOUBLE PRECISION,
      "isVerifiedQuintoAndar" BOOLEAN DEFAULT false,
      "isLaunch" BOOLEAN DEFAULT false,
      "priceReduced" BOOLEAN DEFAULT false,
      "oldPrice" NUMERIC,
      "loftValuation" JSONB,
      description TEXT,
      amenities JSONB,
      images JSONB,
      advertiser JSONB,
      "publishedAt" TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      role TEXT,
      avatar TEXT,
      phone TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id TEXT PRIMARY KEY,
      "propertyId" TEXT,
      "propertyTitle" TEXT,
      date TEXT,
      time TEXT,
      "visitorName" TEXT,
      "visitorPhone" TEXT,
      "createdAt" TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      "propertyId" TEXT,
      sender TEXT,
      text TEXT,
      time TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS proposals (
      id TEXT PRIMARY KEY,
      "propertyId" TEXT,
      "offerPrice" NUMERIC,
      "downPayment" NUMERIC,
      "validityHours" INTEGER,
      "buyerName" TEXT,
      "buyerPhone" TEXT,
      status TEXT DEFAULT 'Em Análise',
      "createdAt" TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      "propertyId" TEXT,
      "planName" TEXT,
      amount NUMERIC,
      method TEXT,
      status TEXT DEFAULT 'APROVADO',
      "createdAt" TIMESTAMPTZ DEFAULT NOW()
    );

    -- Enable RLS and permissive policies for public API
    ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public full access to properties" ON properties;
    CREATE POLICY "Public full access to properties" ON properties FOR ALL USING (true) WITH CHECK (true);

    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public full access to users" ON users;
    CREATE POLICY "Public full access to users" ON users FOR ALL USING (true) WITH CHECK (true);

    ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public full access to schedules" ON schedules;
    CREATE POLICY "Public full access to schedules" ON schedules FOR ALL USING (true) WITH CHECK (true);

    ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public full access to chats" ON chats;
    CREATE POLICY "Public full access to chats" ON chats FOR ALL USING (true) WITH CHECK (true);

    ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public full access to proposals" ON proposals;
    CREATE POLICY "Public full access to proposals" ON proposals FOR ALL USING (true) WITH CHECK (true);

    ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public full access to transactions" ON transactions;
    CREATE POLICY "Public full access to transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
  `;

  console.log('🛠️ Criando tabelas e políticas de RLS...');
  await client.query(schemaSql);
  console.log('✅ Tabelas criadas com sucesso!');

  // Seed Properties
  console.log(`📦 Inserindo ${data.properties?.length || 0} imóveis...`);
  for (const p of (data.properties || [])) {
    const query = `
      INSERT INTO properties (
        id, title, type, "subType", "transactionType", price, "rentPrice",
        "condoFee", iptu, area, bedrooms, suites, bathrooms, "parkingSpots",
        city, state, neighborhood, address, lat, lng, "isVerifiedQuintoAndar",
        "isLaunch", "priceReduced", "oldPrice", "loftValuation", description,
        amenities, images, advertiser, "publishedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
      ) ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        price = EXCLUDED.price,
        description = EXCLUDED.description;
    `;
    const values = [
      p.id, p.title, p.type, p.subType, p.transactionType, p.price || null, p.rentPrice || null,
      p.condoFee || null, p.iptu || null, p.area || null, p.bedrooms || null, p.suites || null,
      p.bathrooms || null, p.parkingSpots || null, p.city, p.state, p.neighborhood, p.address,
      p.lat || null, p.lng || null, p.isVerifiedQuintoAndar || false, p.isLaunch || false,
      p.priceReduced || false, p.oldPrice || null, JSON.stringify(p.loftValuation || {}),
      p.description, JSON.stringify(p.amenities || []), JSON.stringify(p.images || []),
      JSON.stringify(p.advertiser || {}), p.publishedAt
    ];
    await client.query(query, values);
  }
  console.log('✅ Imóveis inseridos!');

  // Seed Users
  console.log(`👤 Inserindo ${data.users?.length || 0} usuários...`);
  for (const u of (data.users || [])) {
    const q = `
      INSERT INTO users (id, name, email, role, avatar, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email;
    `;
    await client.query(q, [u.id, u.name, u.email, u.role, u.avatar, u.phone]);
  }
  console.log('✅ Usuários inseridos!');

  // Seed Schedules
  if (data.schedules && data.schedules.length > 0) {
    for (const s of data.schedules) {
      const q = `
        INSERT INTO schedules (id, "propertyId", "propertyTitle", date, time, "visitorName", "visitorPhone")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING;
      `;
      await client.query(q, [s.id, s.propertyId, s.propertyTitle, s.date, s.time, s.visitorName, s.visitorPhone]);
    }
  }

  // Seed Chats
  if (data.chats) {
    for (const [propId, msgs] of Object.entries(data.chats)) {
      for (const m of msgs) {
        const q = `
          INSERT INTO chats (id, "propertyId", sender, text, time)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO NOTHING;
        `;
        await client.query(q, [m.id, propId, m.sender, m.text, m.time]);
      }
    }
  }

  console.log('🎉 Migração concluída com 100% de sucesso!');
  await client.end();
}

migrate().catch(err => {
  console.error('❌ Erro na migração:', err);
  process.exit(1);
});
