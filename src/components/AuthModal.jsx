import React, { useState } from 'react';
import { X, Lock, Mail, LogIn, UserPlus, AlertCircle, Loader2, KeyRound, CheckCircle, ArrowLeft, ChevronDown, ChevronUp, Send, ShieldCheck, RefreshCw, Key } from 'lucide-react';
import { loginUser, registerUser, requestPasswordReset, resendConfirmationEmail, verifyEmailOtp } from '../services/api';

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
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const handleResendActivation = async () => {
    if (!email.trim()) {
      setError('Por favor, informe seu e-mail cadastrado.');
      return;
    }
    setResending(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await resendConfirmationEmail(email);
      setSuccessMessage(res.message);
    } catch (err) {
      setError(err.message || 'Erro ao reenviar e-mail de ativação.');
    } finally {
      setResending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError('Por favor, informe o código de 6 dígitos recebido por e-mail.');
      return;
    }
    setVerifyingOtp(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await verifyEmailOtp(email, otpCode);
      setSuccessMessage(res.message);
      setOtpCode('');
      setTimeout(() => {
        setMode('login');
        setSuccessMessage('Conta ativada com sucesso! Entre com sua senha.');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Código inválido ou expirado. Verifique e tente novamente.');
    } finally {
      setVerifyingOtp(false);
    }
  };

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

        await registerUser({
          name,
          email,
          password,
          role,
          phone,
          creci
        });
        
        // Bloqueio de auto-login: O usuário obrigatoriamente deve confirmar o e-mail primeiro
        setMode('verify-notice');
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
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: (error.includes('não confirmado') || error.includes('não foi ativada')) ? '0.5rem' : 0 }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
              {(error.includes('não confirmado') || error.includes('não foi ativada')) && (
                <button
                  type="button"
                  onClick={handleResendActivation}
                  disabled={resending}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginTop: '0.25rem'
                  }}
                >
                  <RefreshCw size={13} className={resending ? 'spin-animation' : ''} />
                  <span>{resending ? 'Reenviando...' : 'Reenviar e-mail de ativação'}</span>
                </button>
              )}
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

          {/* MODE: VERIFY NOTICE (EMAIL ACTIVATION REQUIRED) */}
          {mode === 'verify-notice' ? (
            <div style={{ textAlign: 'center', padding: '1.25rem 0.5rem' }}>
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
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Enviamos um link de confirmação para:<br />
                <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{email}</strong>
              </p>

              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                marginBottom: '1.25rem',
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                lineHeight: 1.5,
                textAlign: 'left'
              }}>
                📩 <strong>Como ativar:</strong> Clique no link recebido no seu e-mail OU digite abaixo o <strong>código numérico de 6 dígitos</strong> recebido na mensagem.
              </div>

              {/* Instant 6-digit OTP verification box */}
              <form onSubmit={handleVerifyOtp} style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem',
                textAlign: 'left'
              }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                  Código de Confirmação (6 dígitos do e-mail):
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Ex: 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength={32}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                        letterSpacing: '2px',
                        fontWeight: 700,
                        fontSize: '1rem'
                      }}
                    />
                    <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                  <button
                    type="submit"
                    disabled={verifyingOtp || !otpCode.trim()}
                    className="btn btn-primary"
                    style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap' }}
                  >
                    {verifyingOtp ? <Loader2 size={16} className="spin-animation" /> : 'Confirmar'}
                  </button>
                </div>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMessage('Após confirmar no e-mail ou código, informe seu e-mail e senha.');
                  }}
                  style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
                >
                  Já confirmei, ir para Login
                </button>

                <button
                  type="button"
                  onClick={handleResendActivation}
                  disabled={resending}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    border: '1px solid var(--border-color)',
                    background: 'transparent'
                  }}
                >
                  <RefreshCw size={14} className={resending ? 'spin-animation' : ''} />
                  <span>{resending ? 'Reenviando e-mail...' : 'Não recebeu o código? Reenviar e-mail'}</span>
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
