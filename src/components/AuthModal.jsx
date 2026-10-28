import React, { useState } from 'react';
import { X, Lock, Mail, LogIn, UserPlus, AlertCircle, Loader2, KeyRound, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess
}) {
  const [mode, setMode] = useState('login'); // 'login' ou 'register'
  const [role, setRole] = useState('buyer'); // 'agency', 'owner', 'broker', 'buyer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [creci, setCreci] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await loginUser(email, password);
        onLoginSuccess(user);
        onClose();
      } else {
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
        onLoginSuccess(newUser);
        onClose();
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
            {mode === 'login' ? (
              <LogIn size={20} color="var(--color-primary-light)" />
            ) : (
              <UserPlus size={20} color="var(--color-primary-light)" />
            )}
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {mode === 'login' ? 'Acessar Conta ImóvelHUB' : 'Criar Nova Conta'}
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

          {/* Form */}
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
                    <option value="buyer">🔍 Comprador / Inquilino</option>
                    <option value="owner">🏡 Proprietário de Imóvel</option>
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

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                Senha
              </label>
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
                <span>{mode === 'login' ? 'Entrar' : 'Finalizar Cadastro'}</span>
              )}
            </button>
          </form>

          {/* Collapsible Demo Accounts Box */}
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

          {/* Toggle Login vs Register */}
          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? (
              <span>
                Não tem uma conta ainda?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
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
                  }}
                  style={{ border: 'none', background: 'none', color: 'var(--color-primary-light)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Faça login aqui
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
