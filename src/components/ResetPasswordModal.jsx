import React, { useState } from 'react';
import { Lock, CheckCircle, Loader2, KeyRound } from 'lucide-react';
import { supabase } from '../services/supabase';
import { resetPasswordDirectly } from '../services/api';

export default function ResetPasswordModal({
  isOpen,
  onClose,
  onPasswordResetSuccess
}) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas digitadas não conferem.');
      return;
    }

    setLoading(true);

    try {
      // 1. Update in Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (authErr) {
        throw new Error(authErr.message || 'Erro ao redefinir senha no Supabase Auth.');
      }

      // 2. Get current authenticated user email
      const userEmail = authData?.user?.email;

      // 3. Update in Supabase database table (public.users)
      if (userEmail) {
        await resetPasswordDirectly(userEmail, newPassword);
      }

      // 4. Clean up URL hash so the token is removed from browser address bar
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      setSuccess(true);

      setTimeout(() => {
        onPasswordResetSuccess && onPasswordResetSuccess(authData?.user);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || 'Ocorreu um erro ao atualizar sua senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1500 }}>
      <div className="modal-content" style={{ maxWidth: '440px', padding: 0 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-main)'
        }}>
          <KeyRound size={22} color="var(--color-primary-light)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            Cadastrar Nova Senha
          </h2>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'rgba(5, 150, 105, 0.15)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <CheckCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                Senha Redefinida com Sucesso!
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Sua conta foi atualizada e você já está autenticado. Conectando...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Link de segurança validado! Digite sua nova senha de acesso para o ImóvelHUB:
              </p>

              {error && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  Nova Senha (Mínimo 6 caracteres)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    autoFocus
                    style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.2rem' }}
                  />
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  Confirmar Nova Senha
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
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
                    <span>Salvando nova senha...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Salvar Nova Senha</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
