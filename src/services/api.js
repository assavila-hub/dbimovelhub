import { supabase } from './supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 1. Fetch Properties (Supabase First, with fallback)
export async function fetchProperties() {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("Supabase fetch failed, attempting Express fallback:", err);
  }

  // Fallback to Express backend if running
  try {
    const res = await fetch(`${API_BASE_URL}/properties`);
    const json = await res.json();
    if (json.data && json.data.length > 0) return json.data;
  } catch (err) {
    console.warn("Express API offline, falling back to local state");
  }

  return null;
}

// 2. Create Property
export async function createProperty(propertyData) {
  if (!propertyData.id) {
    propertyData.id = `prop-${Date.now()}`;
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select();

    if (!error && data && data.length > 0) {
      return data[0];
    }
    if (error) console.error("Supabase insert error:", error);
  } catch (err) {
    console.error("Error creating property via Supabase:", err);
  }

  // Fallback to Express
  try {
    const res = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData)
    });
    const json = await res.json();
    return json.data;
  } catch (err) {
    return propertyData;
  }
}

// 3. Update Property
export async function updateProperty(id, propertyData) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update(propertyData)
      .eq('id', id)
      .select();

    if (!error && data && data.length > 0) {
      return data[0];
    }
  } catch (err) {
    console.error("Error updating property via Supabase:", err);
  }

  // Fallback to Express
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData)
    });
    const json = await res.json();
    return json.data;
  } catch (err) {
    return propertyData;
  }
}

// 4. Delete Property
export async function deleteProperty(id) {
  try {
    await supabase.from('properties').delete().eq('id', id);
  } catch (err) {
    console.error("Error deleting property via Supabase:", err);
  }

  try {
    await fetch(`${API_BASE_URL}/properties/${id}`, { method: 'DELETE' });
  } catch (err) {
    // Ignore error
  }
}

// 5. Fetch Address by CEP (ViaCEP direto com CORS)
export async function fetchAddressByCep(cep) {
  const cleanCep = (cep || '').replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await res.json();
    if (data.erro) return null;
    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || ''
    };
  } catch (err) {
    console.error("Error fetching CEP:", err);
    return null;
  }
}

// 6. Chat Messages
export async function fetchChatMessages(propertyId) {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('propertyId', propertyId)
      .order('created_at', { ascending: true });

    if (!error && data) return data;
  } catch (err) {
    console.warn("Supabase chat fetch error:", err);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/chats/${propertyId}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

export async function sendChatMessage(propertyId, text, sender = 'Cliente') {
  const newMsg = {
    id: `msg-${Date.now()}`,
    propertyId,
    sender,
    text,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };

  try {
    await supabase.from('chats').insert([newMsg]);
    return newMsg;
  } catch (err) {
    console.warn("Supabase send chat error:", err);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/chats/${propertyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sender })
    });
    const json = await res.json();
    return json.data || newMsg;
  } catch (err) {
    return newMsg;
  }
}

// 7. Checkout Payment
export async function processCheckoutPayment(propertyId, plan, method) {
  const tx = {
    id: `tx-${Date.now()}`,
    propertyId,
    planName: plan?.name || 'Destaque',
    amount: plan?.price || 49.90,
    method,
    status: 'APROVADO'
  };

  try {
    await supabase.from('transactions').insert([tx]);
    await supabase.from('properties').update({
      priceReduced: true,
      loftValuation: {
        status: plan?.name || 'Destaque ZAP',
        diffPercent: -6.5,
        neighborhoodAvgPerM2: 12500
      }
    }).eq('id', propertyId);

    return tx;
  } catch (err) {
    console.warn("Supabase payment processing error:", err);
  }

  return tx;
}

// 8. Schedules & Visits
export async function createSchedule(scheduleData) {
  const item = {
    id: `sched-${Date.now()}`,
    ...scheduleData
  };
  try {
    const { data } = await supabase.from('schedules').insert([item]).select();
    if (data && data.length > 0) return data[0];
  } catch (err) {
    console.error("Error creating schedule:", err);
  }
  return item;
}

// 9. Proposals
export async function createProposal(proposalData) {
  const item = {
    id: `prop-formal-${Date.now()}`,
    status: 'Em Análise',
    ...proposalData
  };
  try {
    const { data } = await supabase.from('proposals').insert([item]).select();
    if (data && data.length > 0) return data[0];
  } catch (err) {
    console.error("Error creating proposal:", err);
  }
  return item;
}
