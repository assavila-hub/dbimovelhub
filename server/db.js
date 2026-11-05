import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PROPERTIES } from '../src/mockData/properties.js';
import { DEFAULT_USERS } from '../src/mockData/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');

const defaultData = {
  properties: INITIAL_PROPERTIES,
  users: DEFAULT_USERS,
  schedules: [
    {
      id: "sched-1",
      propertyId: "prop-1",
      propertyTitle: "Apartamento de Luxo em Moema com Varanda Gourmet",
      date: "Amanhã (Sexta-feira)",
      time: "14:00",
      visitorName: "Carlos Silva",
      visitorPhone: "(11) 98888-7777",
      createdAt: new Date().toISOString()
    }
  ],
  chats: {
    "prop-1": [
      { id: "msg-1", sender: "Corretor", text: "Olá! Como posso ajudar você em relação a este apartamento em Moema?", time: "14:00" },
      { id: "msg-2", sender: "Cliente", text: "Olá! Gostaria de saber se o condomínio aceita pets grandes.", time: "14:02" },
      { id: "msg-3", sender: "Corretor", text: "Sim! O condomínio é 100% Pet Friendly e conta até com espaço pet care.", time: "14:03" }
    ]
  },
  transactions: [],
  proposals: [
    {
      id: "prop-formal-1",
      propertyId: "prop-1",
      offerPrice: 1320000,
      downPayment: 264000,
      validityHours: 48,
      buyerName: "Carlos Comprador",
      buyerPhone: "(11) 96666-3333",
      status: "Em Análise",
      createdAt: new Date().toISOString()
    }
  ]
};

// Ensure data file exists with corruption recovery
export function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      console.error("Corrupted DB file detected. Creating backup and reinitializing with defaultData...", parseErr);
      const corruptBackup = `${DB_FILE}.corrupt-${Date.now()}`;
      try {
        fs.writeFileSync(corruptBackup, raw, 'utf-8');
        console.warn(`Corrupted file backed up to: ${corruptBackup}`);
      } catch (backupErr) {
        console.error("Failed to backup corrupt DB file:", backupErr);
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }

    // Initialize default properties only if empty or missing
    if (!parsed.properties || !Array.isArray(parsed.properties) || parsed.properties.length === 0) {
      parsed.properties = INITIAL_PROPERTIES;
      saveDB(parsed);
    }

    if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) {
      parsed.users = DEFAULT_USERS;
      saveDB(parsed);
    }

    if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
      parsed.transactions = [];
    }

    return parsed;
  } catch (err) {
    console.error("Error loading DB file:", err);
    return defaultData;
  }
}

// Asynchronous atomic save to prevent event loop blocking and partial write corruption
export async function saveDBAsync(data) {
  const tmpFile = `${DB_FILE}.tmp-${Date.now()}`;
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(tmpFile, jsonStr, 'utf-8');
    await fs.promises.rename(tmpFile, DB_FILE);
  } catch (err) {
    console.error("Error saving DB file asynchronously:", err);
    try {
      if (fs.existsSync(tmpFile)) await fs.promises.unlink(tmpFile);
    } catch (_) {}
  }
}

export function saveDB(data) {
  try {
    const tmpFile = `${DB_FILE}.tmp-${Date.now()}`;
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(tmpFile, jsonStr, 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error("Error saving DB file synchronously:", err);
  }
}
