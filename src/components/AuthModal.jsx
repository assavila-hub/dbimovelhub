import React, { useState } from 'react';
import { X, Lock, Mail, LogIn, UserPlus, AlertCircle, Loader2, KeyRound, CheckCircle, ArrowLeft, ChevronDown, ChevronUp, Send, ShieldCheck } from 'lucide-react';
import { loginUser, registerUser, requestPasswordReset } from '../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess
}) {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot', 'verify-notice'
  const [role, setRole] = useState('buyer'); // 'agency', 'owner', 'broker', 'buyer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [creci, setCreci] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await loginUser(email, password);
        onLoginSuccess(user);
        onClose();
      } else if (mode === 'register') {
        if (!name.trim()) throw new Error('Por favor, informe seu nome completo.');
        if (password.length < 6) throw new Error('A senha deve ter no mínimo 6 caracteres.');
        if (role === 'broker' && !creci.trim()) throw new Error('Por favor, informe seu número de CRECI.');

        const newUser = await registerUser({
          name,
          email,
          password,
          role,
          phone,
          creci
        });
        
        // Instant login: Connect the user immediately without blocking them
        onLoginSuccess(newUser);
        onClose();
      } else if (mode === 'forgot') {
        if (!email.trim()) throw new Error('Por favor, informe seu e-mail cadastrado.');
        const res = await requestPasswordReset(email);
        setSuccessMessage(res.message);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || 'Ocorreu um erro. Verifique seus dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1400 }} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px', padding: 0 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-main)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {mode === 'login' && <LogIn size={20} color="var(--color-primary-light)" />}
            {mode === 'register' && <UserPlus size={20} color="var(--color-primary-light)" />}
            {mode === 'forgot' && <KeyRound size={20} color="var(--color-primary-light)" />}
            {mode === 'verify-notice' && <CheckCircle size={20} color="#059669" />}
            
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {mode === 'login' && 'Acessar Conta ImóvelHUB'}
              {mode === 'register' && 'Criar Nova Conta'}
              {mode === 'forgot' && 'Recuperação de Senha'}
              {mode === 'verify-notice' && 'Ativação de Conta por E-mail'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              border: '1px solid rgba(5, 150, 105, 0.3)',
              color: '#059669',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE: VERIFY NOTICE (EMAIL ACTIVATION) */}
          {mode === 'verify-notice' ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(5, 150, 105, 0.15)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Mail size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Confirme seu Cadastro por E-mail</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Enviamos um link de ativação oficial para <strong>{email}</strong>. Acesse seu e-mail e clique no link para ativar sua conta antes de anunciar ou enviar propostas.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  Ir para Tela de Login
                </button>
              </div>
            </div>
          ) : mode === 'forgot' ? (
            /* MODE: FORGOT PASSWORD (SECURE SUPABASE EMAIL RECOVERY) */
            <form onSubmit={handleSubmit}>
              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem'
              }}>
                <ShieldCheck size={20} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  <strong>Recuperação Segura:</strong> Digite seu e-mail cadastrado. Enviaremos um link protegido oficial do Supabase para você definir sua nova senha com segurança.
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  E-mail Cadastrado
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.2rem' }}
                  />
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin-animation" />
                    <span>Enviando link seguro...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Enviar Link de Recuperação</span>
                  </>
                )}
              </button>

              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMessage('');
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--color-primary-light)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Voltar para o Login</span>
                </button>
              </div>
            </form>
          ) : (
            /* MODE: LOGIN OR REGISTER */
            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Tipo de Conta
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem' }}
                    >
                      <option value="owner">🏡 Proprietário de Imóvel</option>
                      <option value="buyer">🔍 Comprador / Inquilino</option>
                      <option value="broker">📜 Corretor de Imóveis (Autônomo)</option>
                      <option value="agency">🏢 Imobiliária</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Seu Nome Completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.65rem' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem' }}
                    />
                  </div>

                  {role === 'broker' && (
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                        Número do CRECI
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 12345-F"
                        value={creci}
                        onChange={(e) => setCreci(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.65rem' }}
                      />
                    </div>
                  )}
                </>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  E-mail
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.2rem' }}
                  />
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Senha</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                        setSuccessMessage('');
                      }}
                      style={{ border: 'none', background: 'none', color: 'var(--color-primary-light)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.2rem' }}
                  />
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin-animation" />
                    <span>Validando...</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? 'Entrar na Conta' : 'Criar Conta e Enviar Ativação'}</span>
                )}
              </button>
            </form>
          )}

          {/* Collapsible Demo Accounts Box */}
          {mode !== 'verify-notice' && (
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <KeyRound size={14} />
                  <span>Credenciais de contas de teste</span>
                </span>
                {showDemoAccounts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showDemoAccounts && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.76rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🔒 <strong>Admin:</strong> admin@imovelhub.com.br (admin123)</span>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '0.15rem 0.4rem', fontSize: '0.72rem' }} onClick={() => handleFillDemo('admin@imovelhub.com.br', 'admin123')}>Preencher</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>📜 <strong>Corretor:</strong> fernanda.corretora@imoveis.com (corretor123)</span>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '0.15rem 0.4rem', fontSize: '0.72rem' }} onClick={() => handleFillDemo('fernanda.corretora@imoveis.com', 'corretor123')}>Preencher</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🏢 <strong>Imobiliária:</strong> contato@capitalprime.com.br (imob123)</span>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '0.15rem 0.4rem', fontSize: '0.72rem' }} onClick={() => handleFillDemo('contato@capitalprime.com.br', 'imob123')}>Preencher</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🏡 <strong>Proprietário:</strong> ricardo.proprietario@email.com (owner123)</span>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '0.15rem 0.4rem', fontSize: '0.72rem' }} onClick={() => handleFillDemo('ricardo.proprietario@email.com', 'owner123')}>Preencher</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🔍 <strong>Comprador:</strong> carlos.comprador@email.com (buyer123)</span>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '0.15rem 0.4rem', fontSize: '0.72rem' }} onClick={() => handleFillDemo('carlos.comprador@email.com', 'buyer123')}>Preencher</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Toggle Login vs Register */}
          {mode !== 'verify-notice' && mode !== 'forgot' && (
            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {mode === 'login' ? (
                <span>
                  Não tem uma conta ainda?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError('');
                      setSuccessMessage('');
                    }}
                    style={{ border: 'none', background: 'none', color: 'var(--color-primary-light)', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cadastre-se grátis
                  </button>
                </span>
              ) : (
                <span>
                  Já possui conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setSuccessMessage('');
                    }}
                    style={{ border: 'none', background: 'none', color: 'var(--color-primary-light)', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Faça login aqui
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
