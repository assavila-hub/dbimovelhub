import { supabase } from './supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const isLocalEnv = typeof window !== 'undefined'
  ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || import.meta.env.VITE_USE_EXPRESS_FALLBACK === 'true' || !!import.meta.env.VITE_API_URL)
  : (import.meta.env?.VITE_USE_EXPRESS_FALLBACK === 'true' || false);

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

  // Fallback to Express backend if running locally
  if (isLocalEnv) {
    try {
      const res = await fetch(`${API_BASE_URL}/properties`);
      const json = await res.json();
      if (json.data && json.data.length > 0) return json.data;
    } catch (err) {
      console.warn("Express API offline, falling back to local state");
    }
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

  // Fallback to Express (only when running locally)
  if (isLocalEnv) {
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
  return propertyData;
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
  if (isLocalEnv) {
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
  return propertyData;
}

// 4. Delete Property
export async function deleteProperty(id) {
  try {
    await supabase.from('properties').delete().eq('id', id);
  } catch (err) {
    console.error("Error deleting property via Supabase:", err);
  }

  if (isLocalEnv) {
    try {
      await fetch(`${API_BASE_URL}/properties/${id}`, { method: 'DELETE' });
    } catch (err) {
      // Ignore error
    }
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

  if (isLocalEnv) {
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${propertyId}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      return [];
    }
  }
  return [];
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

  if (isLocalEnv) {
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
  return newMsg;
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

// 10. Real Authentication (Login)
export async function loginUser(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  
  // 1. Check Supabase Auth for email confirmation status
  try {
    const { data: signInData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    if (authError) {
      const msg = (authError.message || '').toLowerCase();
      if (msg.includes('email not confirmed') || (authError.status === 400 && authError.code === 'email_not_confirmed')) {
        throw new Error('E-mail não confirmado. Por favor, acesse seu e-mail e clique no link de ativação antes de fazer login.');
      }
    } else if (signInData?.user?.email_confirmed_at) {
      await supabase.from('users').update({ status: 'active' }).ilike('email', cleanEmail);
    }
  } catch (authErr) {
    if (authErr.message?.includes('não confirmado')) {
      throw authErr;
    }
    console.warn("Supabase auth check:", authErr);
  }

  // 2. Fetch profile from database
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', cleanEmail)
      .limit(1);

    if (error || !data || data.length === 0) {
      throw new Error('E-mail não encontrado no sistema.');
    }

    const user = data[0];
    if (user.status === 'blocked') {
      throw new Error('Esta conta está congelada/bloqueada pelo Administrador. Entre em contato com o suporte.');
    }

    // 3. Authenticate with Supabase Auth or fallback credentials
    let authConfirmed = false;
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });
      if (authData?.user) {
        authConfirmed = true;
      } else if (authError && authError.message.toLowerCase().includes('email not confirmed')) {
        throw new Error('Sua conta ainda não foi ativada. Por favor, confirme o e-mail de ativação enviado para sua caixa de entrada antes de entrar.');
      }
    } catch (authErr) {
      if (authErr.message && authErr.message.includes('ainda não foi ativada')) {
        throw authErr;
      }
    }

    // If pending verification in database but verified via Supabase Auth
    if (user.status === 'pending_verification') {
      if (authConfirmed) {
        await supabase.from('users').update({ status: 'active' }).eq('id', user.id);
        user.status = 'active';
      } else {
        throw new Error('Sua conta ainda não foi ativada. Por favor, confirme o e-mail de ativação enviado para sua caixa de entrada antes de entrar.');
      }
    }

    if (user.password && user.password !== password) {
      throw new Error('Senha incorreta. Verifique suas credenciais.');
    }

    return user;
  } catch (err) {
    throw err;
  }
}

// 11. Real Authentication (Register with Required Email Confirmation)
export async function registerUser({ name, email, password, role, phone, creci }) {
  const cleanEmail = (email || '').trim().toLowerCase();

  try {
    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .ilike('email', cleanEmail)
      .limit(1);

    if (existing && existing.length > 0) {
      throw new Error('Este e-mail já está cadastrado no sistema. Por favor, acesse a aba "Entrar" com suas credenciais ou utilize "Esqueceu a senha?".');
    }

    // Trigger official Supabase confirmation email with production Vercel redirect URL
    let authUserId = null;
    const redirectOrigin = typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://dbimovelhub.vercel.app/';
    
    try {
      const authRes = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          emailRedirectTo: redirectOrigin,
          data: { name: name.trim(), role: role || 'buyer', phone: phone || '', creci: creci || null }
        }
      });

      // In Supabase, if the user already exists in auth.users, identities is an empty array [] and no email is sent
      if (authRes?.data?.user?.identities && authRes.data.user.identities.length === 0) {
        throw new Error('Este e-mail já possui cadastro confirmado no sistema. Por favor, acesse a aba "Entrar" com sua senha ou solicite redefinição.');
      }

      authUserId = authRes?.data?.user?.id || authRes?.user?.id || null;
      if (authRes.error) {
        console.warn("Supabase auth signUp error:", authRes.error);
        if (authRes.error.message && !authRes.error.message.includes('over_email_send_rate_limit')) {
          throw new Error(authRes.error.message);
        }
      }
    } catch (authErr) {
      console.warn("Supabase auth signUp notification:", authErr);
      if (authErr.message) {
        throw authErr;
      }
    }

    // New registered user starts in 'pending_verification' status until email is confirmed
    const newUser = {
      id: authUserId || `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role: role || 'buyer',
      phone: phone || '',
      creci: role === 'broker' ? creci : null,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      status: 'pending_verification'
    };

    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select();

    if (error) {
      console.error("Supabase registration error:", error);
      throw new Error('Erro ao salvar cadastro no banco de dados.');
    }

    return data[0];
  } catch (err) {
    throw err;
  }
}

// 11.1. Resend Confirmation Email
export async function resendConfirmationEmail(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const redirectOrigin = typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://dbimovelhub.vercel.app/';
  
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
      options: {
        emailRedirectTo: redirectOrigin
      }
    });

    if (error) {
      throw new Error(error.message || 'Erro ao reenviar e-mail de ativação.');
    }

    return { success: true, message: 'Novo e-mail de confirmação enviado! Verifique sua caixa de entrada e spam.' };
  } catch (err) {
    throw err;
  }
}

// 11.2. Verify Email OTP Code or Token directly
export async function verifyEmailOtp(email, token) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanToken = (token || '').trim();

  if (!cleanEmail || !cleanToken) {
    throw new Error('Informe o e-mail e o código de verificação recebido.');
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'signup'
    });

    if (error) {
      const { data: retryData, error: retryError } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: 'email'
      });
      if (retryError) {
        throw new Error(retryError.message || error.message || 'Código de ativação inválido ou expirado.');
      }
      if (retryData?.user) {
        await supabase.from('users').update({ status: 'active' }).ilike('email', cleanEmail);
        return { success: true, message: 'Conta ativada com sucesso! Você já pode realizar o login.' };
      }
    }

    await supabase.from('users').update({ status: 'active' }).ilike('email', cleanEmail);
    return { success: true, message: 'Conta ativada com sucesso! Você já pode realizar o login.' };
  } catch (err) {
    throw err;
  }
}

// 12. Password Recovery (Forgot Password via Email)
export async function requestPasswordReset(email) {
  const cleanEmail = (email || '').trim().toLowerCase();

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email')
      .ilike('email', cleanEmail)
      .limit(1);

    if (userError || !user || user.length === 0) {
      throw new Error('Não encontramos nenhuma conta com este e-mail no sistema.');
    }

    const redirectOrigin = typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://dbimovelhub.vercel.app/';
    const { error: authError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: redirectOrigin
    });

    if (authError) {
      if (authError.message?.includes('rate limit') || authError.status === 429) {
        throw new Error('O envio de e-mails gratuitos do Supabase atingiu a cota por hora (máx. 3 disparos/hora). Utilize o botão "Redefinir Senha Imediatamente" logo abaixo para alterar sua senha na hora!');
      }
      throw new Error(authError.message || 'Erro ao enviar e-mail de recuperação.');
    }

    return {
      success: true,
      message: `Enviamos um link de recuperação para ${cleanEmail}. Por favor, verifique sua caixa de entrada e pasta de spam!`
    };
  } catch (err) {
    throw err;
  }
}

// 13. Direct Password Reset (Instant Reset via Supabase Database)
export async function resetPasswordDirectly(email, newPassword) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!newPassword || newPassword.length < 6) {
    throw new Error('A nova senha deve ter no mínimo 6 caracteres.');
  }

  try {
    const { data: users, error: findError } = await supabase
      .from('users')
      .select('id, name, email')
      .ilike('email', cleanEmail)
      .limit(1);

    if (findError || !users || users.length === 0) {
      throw new Error('Nenhuma conta encontrada com este e-mail.');
    }

    const user = users[0];

    // Update in Supabase public.users
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('id', user.id);

    if (updateError) {
      throw new Error('Erro ao salvar a nova senha no banco de dados.');
    }

    return {
      success: true,
      user,
      message: 'Senha alterada com sucesso! Você já pode fazer login com a sua nova senha.'
    };
  } catch (err) {
    throw err;
  }
}

// 12. Fetch All Users (Admin)
export async function fetchUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.error("Error fetching users from Supabase:", err);
  }
  return null;
}

// 13. Toggle User Status (Freeze/Unfreeze)
export async function toggleUserStatus(userId, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
  try {
    await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('id', userId);
  } catch (err) {
    console.error("Error toggling user status in Supabase:", err);
  }
  return newStatus;
}

// 14. Delete User (Admin)
export async function deleteUser(userId) {
  try {
    await supabase
      .from('users')
      .delete()
      .eq('id', userId);
  } catch (err) {
    console.error("Error deleting user from Supabase:", err);
  }
}

// 15. Update User Role (Admin)
export async function updateUserRole(userId, newRole) {
  try {
    await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);
  } catch (err) {
    console.error("Error updating user role in Supabase:", err);
  }
}

// 16. Update User Profile Data
export async function updateUserData(userId, partialData) {
  try {
    const { data } = await supabase
      .from('users')
      .update(partialData)
      .eq('id', userId)
      .select();
    if (data && data.length > 0) return data[0];
  } catch (err) {
    console.error("Error updating user in Supabase:", err);
  }
  return partialData;
}

// 17. Create User (Admin)
export async function createUser(userData) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();

    if (!error && data && data.length > 0) {
      return data[0];
    }
  } catch (err) {
    console.error("Error creating user in Supabase:", err);
  }
  return userData;
}

// 18. Fetch Schedules (Visitas Agendadas)
export async function fetchSchedules() {
  try {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  } catch (_) {}

  if (isLocalEnv) {
    try {
      const res = await fetch(`${API_BASE_URL}/schedules`);
      const json = await res.json();
      if (json.data && json.data.length > 0) return json.data;
    } catch (_) {}
  }
  return null;
}

// 19. Fetch Proposals (Propostas Formais)
export async function fetchProposals() {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  } catch (_) {}

  if (isLocalEnv) {
    try {
      const res = await fetch(`${API_BASE_URL}/proposals`);
      const json = await res.json();
      if (json.data && json.data.length > 0) return json.data;
    } catch (_) {}
  }
  return null;
}

// 20. Fetch Transactions (Financeiro Gateway)
export async function fetchTransactions() {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  } catch (_) {}

  if (isLocalEnv) {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`);
      const json = await res.json();
      if (json.data && json.data.length > 0) return json.data;
    } catch (_) {}
  }
  return null;
}
