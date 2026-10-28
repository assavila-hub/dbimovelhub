import React from 'react';
import { 
  Building2, 
  Home, 
  Key, 
  PlusCircle, 
  Heart, 
  ArrowLeftRight, 
  User, 
  ShieldCheck, 
  Bell, 
  FileCheck, 
  Database, 
  MessageSquare, 
  Calculator, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  Users, 
  Headphones, 
  Briefcase, 
  TrendingUp,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Radio
} from 'lucide-react';
import { DEFAULT_USERS } from '../mockData/users';

export default function ProfileContextBanner({
  currentUser,
  setCurrentUser,
  favoritesCount = 0,
  compareCount = 0,
  propertiesCount = 0,
  onOpenAuth,
  onOpenPostProperty,
  onOpenFavorites,
  onOpenCompare,
  onOpenOpportunityRadar,
  onOpenDigitalContract,
  onOpenXmlSync,
  onOpenSupport,
  onOpenChatHub,
  onOpenAdminDashboard,
  onOpenUserDashboard,
  onOpenSearchWizard,
  onSelectTransactionTab
}) {
  const isVisitor = !currentUser;
  const currentRole = isVisitor ? 'visitor' : currentUser.role;

  return (
    <div style={{
      margin: '1.5rem auto 0 auto',
      width: '100%',
      maxWidth: '1680px',
      padding: '0 clamp(1rem, 2.5vw, 2.5rem)'
    }}>
      {/* 2. DYNAMIC PROFILE CARD CONTAINER */}
      {isVisitor ? (
        /* =========================================================================
           VISÃO DO VISITANTE (VISITOR / NÃO LOGADO)
           ========================================================================= */
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.06) 0%, rgba(59, 130, 246, 0.08) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-primary-light)', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                <span>👋 VISÃO DE VISITANTE</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                Bem-vindo ao maior ecossistema imobiliário do Brasil
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Navegue livremente por <strong>{propertiesCount} imóveis</strong> cadastrados, simule financiamentos e compare valores de m². Para salvar seus imóveis favoritos, fazer propostas diretas e assinar contratos digitais, acesse sua conta gratuita.
              </p>

              {/* Visitor Quick Path Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <div 
                  onClick={() => onSelectTransactionTab && onSelectTransactionTab('Comprar')}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  className="hover-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Home size={18} color="var(--color-primary-light)" />
                    <strong style={{ fontSize: '0.88rem' }}>Quero Comprar</strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simulador de financiamento e valor de m²</span>
                </div>

                <div 
                  onClick={() => onSelectTransactionTab && onSelectTransactionTab('Alugar')}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  className="hover-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Key size={18} color="var(--color-quinto)" />
                    <strong style={{ fontSize: '0.88rem' }}>Quero Alugar</strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aluguel sem fiador com Pacote Total</span>
                </div>

                <div 
                  onClick={onOpenPostProperty}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  className="hover-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <PlusCircle size={18} color="var(--color-accent)" />
                    <strong style={{ fontSize: '0.88rem' }}>Quero Anunciar</strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alcance até 3x mais compradores</span>
                </div>
              </div>
            </div>

            {/* Visitor Right Action Box */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '1.25rem',
              maxWidth: '320px',
              width: '100%',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Crie sua conta ou Entre</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Acesse recursos exclusivos como o Radar de Preço, Histórico de Propostas e Visitas Agendadas.
              </div>
              <button
                className="btn btn-primary"
                onClick={onOpenAuth}
                style={{ width: '100%', fontSize: '0.88rem', fontWeight: 800, gap: '0.45rem' }}
              >
                <User size={16} />
                <span>Entrar / Criar Conta</span>
              </button>
              <button
                className="btn btn-outline"
                onClick={onOpenSearchWizard}
                style={{ width: '100%', fontSize: '0.82rem', gap: '0.45rem' }}
              >
                <Sparkles size={15} color="var(--color-primary-light)" />
                <span>Assistente Inteligente de Busca</span>
              </button>
            </div>
          </div>
        </div>
      ) : currentUser.role === 'buyer' ? (
        /* =========================================================================
           VISÃO DO COMPRADOR / INQUILINO (BUYER)
           ========================================================================= */
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-loft">🔍 Perfil Comprador / Inquilino</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentUser.email}</span>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Olá, {currentUser.name}!</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Seus alertas de oportunidades e histórico de buscas estão ativos.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenFavorites}
                style={{ gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <Heart size={15} color="var(--color-accent)" fill="var(--color-accent)" />
                <span>Favoritos ({favoritesCount})</span>
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenCompare}
                style={{ gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <ArrowLeftRight size={15} color="var(--color-primary-light)" />
                <span>Comparador ({compareCount})</span>
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenOpportunityRadar}
                style={{ gap: '0.4rem', fontSize: '0.82rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
              >
                <Bell size={15} />
                <span>Radar de Preço</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={onOpenUserDashboard}
                style={{ gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <Briefcase size={15} />
                <span>Meu Painel do Comprador</span>
              </button>
            </div>
          </div>
        </div>
      ) : currentUser.role === 'owner' ? (
        /* =========================================================================
           VISÃO DO PROPRIETÁRIO (OWNER)
           ========================================================================= */
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                  🏡 Perfil Proprietário / Anunciante
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentUser.phone}</span>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Olá, {currentUser.name}!</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Gerencie seus imóveis anunciados, propostas recebidas de compradores e agendamentos de visitas presenciais.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenChatHub}
                style={{ gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <MessageSquare size={15} color="var(--color-primary-light)" />
                <span>Mensagens &amp; Propostas</span>
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenDigitalContract}
                style={{ gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <FileCheck size={15} color="var(--color-quinto)" />
                <span>Contratos ICP-Brasil</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={onOpenPostProperty}
                style={{ gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                <PlusCircle size={15} />
                <span>Anunciar Novo Imóvel</span>
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenUserDashboard}
                style={{ gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <span>Painel do Proprietário</span>
              </button>
            </div>
          </div>
        </div>
      ) : (currentUser.role === 'broker' || currentUser.role === 'agency') ? (
        /* =========================================================================
           VISÃO DO CORRETOR / IMOBILIÁRIA (BROKER / AGENCY)
           ========================================================================= */
        <div style={{
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(5, 150, 105, 0.35)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-quinto">
                  {currentUser.role === 'agency' ? '🏢 Imobiliária Parceira' : '📜 Corretor Credenciado'}
                </span>
                {currentUser.creci && (
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-quinto)' }}>CRECI: {currentUser.creci}</span>
                )}
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{currentUser.name}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Central do Corretor: Gestão de carteira, leads de clientes, sincronização de CRM e agendamento online.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenXmlSync}
                style={{ gap: '0.4rem', fontSize: '0.82rem', color: '#0284c7', borderColor: 'rgba(2, 132, 199, 0.4)' }}
              >
                <Database size={15} />
                <span>Carga XML (CRMs)</span>
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenChatHub}
                style={{ gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <MessageSquare size={15} color="var(--color-primary-light)" />
                <span>Leads &amp; Mensagens</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={onOpenPostProperty}
                style={{ gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800 }}
              >
                <PlusCircle size={15} />
                <span>Cadastrar Imóvel</span>
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenUserDashboard}
                style={{ gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <span>Painel Corretor</span>
              </button>
            </div>
          </div>
        </div>
      ) : currentUser.role === 'admin' ? (
        /* =========================================================================
           VISÃO DO ADMINISTRADOR GERAL (ADMIN)
           ========================================================================= */
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.12) 0%, rgba(15, 23, 42, 0.15) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-primary-light)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge" style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                  🔒 ADMINISTRADOR GERAL DO SISTEMA
                </span>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Radio size={12} className="animate-pulse" /> 14 Usuários Online
                </span>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Controle Geral do ImóvelHUB</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Acesso completo a SEO Google &amp; Bing, Categorias/Picklists, Moderação, Usuários e Faturamento.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenXmlSync}
                style={{ gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <Database size={15} color="#0284c7" />
                <span>Feeds XML</span>
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenPostProperty}
                style={{ gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <PlusCircle size={15} color="var(--color-primary-light)" />
                <span>Adicionar Imóvel</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={onOpenAdminDashboard}
                style={{ gap: '0.45rem', fontSize: '0.85rem', fontWeight: 800 }}
              >
                <ShieldCheck size={16} />
                <span>Abrir Painel Admin Master</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
           VISÃO DO SUPORTE (SUPPORT)
           ========================================================================= */
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-olx">🎧 Central de Suporte &amp; Moderação</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Operador Ativo</span>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Atendimento ImóvelHUB</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Fila de atendimento aos usuários, moderação de anúncios e resolução de tickets.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={onOpenChatHub}
                style={{ gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <MessageSquare size={15} color="var(--color-primary-light)" />
                <span>Mensagens do Portal</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={onOpenSupport}
                style={{ gap: '0.45rem', fontSize: '0.82rem', fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
              >
                <Headphones size={15} />
                <span>Fila de Suporte ao Vivo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
