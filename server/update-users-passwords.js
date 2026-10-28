import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING,
  ssl: { rejectUnauthorized: false }
});

const defaultUsersWithPasswords = [
  {
    id: "user-admin",
    name: "Administrador Geral",
    email: "admin@imovelhub.com.br",
    password: "admin123",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    phone: "(11) 99999-0000"
  },
  {
    id: "user-agency",
    name: "Imobiliária Capital Prime",
    email: "contato@capitalprime.com.br",
    password: "imob123",
    role: "agency",
    avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80",
    phone: "(41) 3040-5500",
    creci: "34.890-J"
  },
  {
    id: "user-owner",
    name: "Ricardo Proprietário",
    email: "ricardo.proprietario@email.com",
    password: "owner123",
    role: "owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    phone: "(11) 98888-1111"
  },
  {
    id: "user-broker",
    name: "Fernanda Corretora Prime",
    email: "fernanda.corretora@imoveis.com",
    password: "corretor123",
    role: "broker",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    phone: "(11) 97777-2222",
    creci: "12345-J"
  },
  {
    id: "user-buyer",
    name: "Carlos Comprador",
    email: "carlos.comprador@email.com",
    password: "buyer123",
    role: "buyer",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    phone: "(11) 96666-3333"
  },
  {
    id: "user-support",
    name: "Atendimento Suporte ImóvelHUB",
    email: "suporte@imovelhub.com.br",
    password: "suporte123",
    role: "support",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    phone: "0800 777 9000"
  }
];

async function updateUsers() {
  console.log('🔄 Conectando ao Supabase...');
  await client.connect();

  console.log('🛠️ Adicionando coluna "password" e "creci" se não existirem...');
  await client.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS creci TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
  `);

  console.log('👤 Inserindo/atualizando usuários com senhas oficiais...');
  for (const u of defaultUsersWithPasswords) {
    const query = `
      INSERT INTO users (id, name, email, password, role, avatar, phone, creci, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        password = EXCLUDED.password,
        role = EXCLUDED.role,
        avatar = EXCLUDED.avatar,
        phone = EXCLUDED.phone,
        creci = EXCLUDED.creci;
    `;
    await client.query(query, [u.id, u.name, u.email, u.password, u.role, u.avatar, u.phone, u.creci || null]);
  }

  console.log('✅ Usuários e senhas atualizados com sucesso no Supabase!');
  await client.end();
}

updateUsers().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
