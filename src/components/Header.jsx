import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Building2, 
  Heart, 
  ArrowLeftRight, 
  PlusCircle, 
  Moon, 
  Sun, 
  Sparkles,
  User,
  ShieldCheck,
  LogOut,
  SlidersHorizontal,
  Headphones,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  FileCheck,
  Bell,
  Database,
  BookOpen,
  Home,
  Key,
  Flame,
  Gavel,
  Calculator,
  Shield,
  FileText,
  HelpCircle,
  Briefcase,
  Users,
  Bookmark,
  MapPin,
  Clock,
  Truck
} from 'lucide-react';

export default function Header({
  darkMode,
  setDarkMode,
  favoritesCount,
  compareCount,
  onOpenCompare,
  onOpenPostProperty,
  onOpenFavorites,
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenUserDashboard,
  onOpenAdminDashboard,
  onOpenSupport,
  onOpenChatHub,
  onNavigateHome,
  onNavigateBlog,
  onOpenDigitalContract,
  onOpenXmlSync,
  onOpenOpportunityRadar,
  onOpenLeadCrm,
  onOpenRoiCalculator,
  onOpenFinanceCalculator,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenSavedSearches,
  onOpenNeighborhoodInsights,
  onOpenTransactionTimeline,
  onOpenMovingChecklist,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'imoveis' | 'servicos' | 'parceiros' | 'usuario' | null
  const headerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change or ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = (name) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header ref={headerRef} style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      {/* Top Banner showing merged portals */}
      <div className="header-top-banner" style={{
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        padding: '0.35rem 1.5rem',
        fontSize: '0.76rem',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <Sparkles size={13} color="#f59e0b" />
          <span>Plataforma Imobiliária Completa do Brasil: Compra, Aluguel, Lançamentos, Temporada &amp; Leilão</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', opacity: 0.9, flexShrink: 0 }} className="desktop-only">
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.12rem 0.5rem', borderRadius: '4px' }}>Filtros Avançados</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.12rem 0.5rem', borderRadius: '4px' }}>Mapa Interativo</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.12rem 0.5rem', borderRadius: '4px' }}>Visitas Online</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.12rem 0.5rem', borderRadius: '4px' }}>Contratos ICP-Brasil</span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        gap: '1rem'
      }}>
        {/* Left Side: Brand Logo + Categorized Dropdown Menus */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 2.5vw, 2.5rem)' }}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome && onNavigateHome();
              closeAll();
            }}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
              color: '#ffffff',
              padding: '0.55rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}>
                Imóvel<span style={{ color: 'var(--color-primary-light)' }}>HUB</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
                CLASSIFICADOS DO BRASIL
              </div>
            </div>
          </a>

          {/* =========================================================================
             DESKTOP SUBMENUS (Only 3 clean dropdowns)
             ========================================================================= */}
          <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            
            {/* 1. SUBMENU: IMÓVEIS ▾ */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => toggleDropdown('imoveis')}
                style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: activeDropdown === 'imoveis' ? 'var(--color-primary-light)' : 'var(--text-main)'
                }}
              >
                <span>Imóveis</span>
                <ChevronDown size={14} style={{ transform: activeDropdown === 'imoveis' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {activeDropdown === 'imoveis' && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: 0,
                  width: '280px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '0.6rem',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  animation: 'slideUp 0.2s ease-out'
                }}>
                  <div style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tipos de Negociação
                  </div>

                  <button
                    className={`btn btn-ghost btn-sm ${activeTab === 'Todos' ? 'active-nav' : ''}`}
                    onClick={() => {
                      onNavigateHome && onNavigateHome();
                      setActiveTab('Todos');
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Building2 size={16} color="#38bdf8" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Todos os Imóveis</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Catálogo completo unificado</div>
                    </div>
                  </button>

                  <button
                    className={`btn btn-ghost btn-sm ${activeTab === 'Comprar' ? 'active-nav' : ''}`}
                    onClick={() => {
                      onNavigateHome && onNavigateHome();
                      setActiveTab('Comprar');
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Home size={16} color="var(--color-primary-light)" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Comprar Imóveis</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Casas, Apartamentos e Terrenos</div>
                    </div>
                  </button>

                  <button
                    className={`btn btn-ghost btn-sm ${activeTab === 'Alugar' ? 'active-nav' : ''}`}
                    onClick={() => {
                      onNavigateHome && onNavigateHome();
                      setActiveTab('Alugar');
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Key size={16} color="var(--color-quinto)" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Alugar Imóveis</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Aluguel sem fiador &amp; Pacote Total</div>
                    </div>
                  </button>

                  <button
                    className={`btn btn-ghost btn-sm ${activeTab === 'Lançamentos' ? 'active-nav' : ''}`}
                    onClick={() => {
                      onNavigateHome && onNavigateHome();
                      setActiveTab('Lançamentos');
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Sparkles size={16} color="#f59e0b" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Lançamentos &amp; Plantas</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Empreendimentos novos direto da construtora</div>
                    </div>
                  </button>

                  <button
                    className={`btn btn-ghost btn-sm ${activeTab === 'Temporada' ? 'active-nav' : ''}`}
                    onClick={() => {
                      onNavigateHome && onNavigateHome();
                      setActiveTab('Temporada');
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <span>🏖️</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Temporada &amp; Férias</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Locações por diária no litoral e serra</div>
                    </div>
                  </button>

                  <button
                    className={`btn btn-ghost btn-sm ${activeTab === 'Leilão' ? 'active-nav' : ''}`}
                    onClick={() => {
                      onNavigateHome && onNavigateHome();
                      setActiveTab('Leilão');
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Gavel size={16} color="#ef4444" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ef4444' }}>Leilões Imobiliários</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Oportunidades com até 60% de desconto</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 2. SUBMENU: SERVIÇOS & SOLUÇÕES ▾ */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => toggleDropdown('servicos')}
                style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: activeDropdown === 'servicos' ? 'var(--color-primary-light)' : 'var(--text-main)'
                }}
              >
                <span>Serviços &amp; Soluções</span>
                <ChevronDown size={14} style={{ transform: activeDropdown === 'servicos' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {activeDropdown === 'servicos' && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: 0,
                  width: '300px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '0.6rem',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  animation: 'slideUp 0.2s ease-out'
                }}>
                  <div style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Ferramentas do Comprador &amp; Inquilino
                  </div>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenLeadCrm && onOpenLeadCrm();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Users size={16} color="#3b82f6" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>CRM de Leads &amp; Funil Kanban</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Gestão visual de clientes e negociações</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenFinanceCalculator && onOpenFinanceCalculator();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Calculator size={16} color="#f59e0b" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Simulador Multi-Bancos</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Compare taxas Caixa, BB, Itaú, Bradesco e Santander</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenRoiCalculator && onOpenRoiCalculator();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Sparkles size={16} color="#10b981" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Calculadora de ROI &amp; Yield</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rentabilidade anual, payback e comparativo CDI</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenDigitalContract();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <FileCheck size={16} color="var(--color-primary-light)" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Contratos Digitais</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Assinatura eletrônica com validade jurídica ICP-Brasil</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenOpportunityRadar();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Bell size={16} color="#ef4444" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ef4444' }}>Radar de Preço &amp; Descontos</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Alertas automáticos de queda de valor</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenSavedSearches && onOpenSavedSearches();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Bookmark size={16} color="#38bdf8" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Buscas Salvas &amp; Alertas</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Filtros personalizados e avisos de novos imóveis</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenNeighborhoodInsights && onOpenNeighborhoodInsights();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <MapPin size={16} color="#059669" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Guia &amp; Insights de Bairros</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Segurança, metrô, escolas e preço do m²</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenTransactionTimeline && onOpenTransactionTimeline();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Clock size={16} color="#8b5cf6" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Timeline da Transação</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Proposta ➔ Contrato ➔ Vistoria ➔ Chaves</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenMovingChecklist && onOpenMovingChecklist();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Truck size={16} color="#f59e0b" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Checklist de Mudança &amp; Pós-Venda</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Troca de titularidade de energia, água e internet</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenCompare();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <ArrowLeftRight size={16} color="var(--color-loft)" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Comparador de Imóveis ({compareCount})</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Comparação lado a lado de preço, m² e taxas</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. SUBMENU: PROFISSIONAIS & CONTEÚDO ▾ */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => toggleDropdown('parceiros')}
                style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: activeDropdown === 'parceiros' ? 'var(--color-primary-light)' : 'var(--text-main)'
                }}
              >
                <span>Para Corretores &amp; Blog</span>
                <ChevronDown size={14} style={{ transform: activeDropdown === 'parceiros' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {activeDropdown === 'parceiros' && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: 0,
                  width: '290px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '0.6rem',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  animation: 'slideUp 0.2s ease-out'
                }}>
                  <div style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Parceiros, CRMs &amp; Notícias
                  </div>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenXmlSync();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Database size={16} color="#0284c7" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Carga &amp; Feeds XML</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Integração direta com CRMs Imobiliários</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onNavigateBlog();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <BookOpen size={16} color="var(--color-primary-light)" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Blog &amp; Guias do Mercado</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Artigos, análises de mercado e dicas</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenChatHub();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <MessageSquare size={16} color="var(--color-primary-light)" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Central de Mensagens</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Chat direto entre corretores e compradores</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenSupport();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.65rem' }}
                  >
                    <Headphones size={16} color="var(--color-primary-light)" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Central de Suporte</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Atendimento e moderação ImóvelHUB</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

          </nav>
        </div>

        {/* =========================================================================
           RIGHT SIDE ACTIONS (Theme, Favorites, User Menu, CTA)
           ========================================================================= */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* Dark / Light Toggle */}
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => setDarkMode(!darkMode)}
            title="Alternar Tema Escuro/Claro"
            style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0 }}
          >
            {darkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#64748b" />}
          </button>

          {/* Central de Notificações */}
          <button 
            className="btn btn-ghost btn-sm"
            onClick={onOpenNotifications}
            style={{ position: 'relative', padding: '0.45rem 0.65rem' }}
            title="Central de Notificações"
            aria-label={`Central de Notificações (${unreadNotificationsCount} novas)`}
          >
            <Bell size={18} color={unreadNotificationsCount > 0 ? "#38bdf8" : "currentColor"} />
            {unreadNotificationsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                backgroundColor: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                minWidth: '17px',
                height: '17px',
                padding: '0 3px',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 2px var(--bg-card)'
              }}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Favoritos Shortcut */}
          <button 
            className="btn btn-ghost btn-sm"
            onClick={onOpenFavorites}
            style={{ position: 'relative', padding: '0.45rem 0.65rem' }}
            title="Meus Favoritos"
            aria-label={`Meus Favoritos (${favoritesCount})`}
          >
            <Heart size={18} color={favoritesCount > 0 ? "var(--color-accent)" : "currentColor"} fill={favoritesCount > 0 ? "var(--color-accent)" : "none"} />
            {favoritesCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                backgroundColor: 'var(--color-accent)',
                color: '#fff',
                borderRadius: '50%',
                minWidth: '17px',
                height: '17px',
                padding: '0 3px',
                fontSize: '0.65rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 2px var(--bg-card)'
              }}>
                {favoritesCount}
              </span>
            )}
          </button>

          {/* User Account / Profile Menu (Submenu 4) */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => toggleDropdown('usuario')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  borderColor: currentUser.role === 'admin' ? 'var(--color-primary)' : 'var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  padding: '0.45rem 0.85rem'
                }}
              >
                {currentUser.role === 'admin' && <ShieldCheck size={16} color="var(--color-primary-light)" />}
                {currentUser.role === 'agency' && <span>🏢</span>}
                {currentUser.role === 'owner' && <span>🏡</span>}
                {currentUser.role === 'broker' && <span>📜</span>}
                {currentUser.role === 'buyer' && <span>🔍</span>}
                {currentUser.role === 'support' && <span>🎧</span>}
                <span style={{ fontWeight: 700, fontSize: '0.85rem', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.role === 'admin' ? 'Admin' : currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown size={13} style={{ transform: activeDropdown === 'usuario' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {activeDropdown === 'usuario' && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '240px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '0.6rem',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  animation: 'slideUp 0.2s ease-out'
                }}>
                  <div style={{ padding: '0.4rem 0.6rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Conectado como:</div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>
                      Perfil: {currentUser.role.toUpperCase()}
                    </div>
                  </div>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      currentUser.role === 'admin' ? onOpenAdminDashboard() : onOpenUserDashboard();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.5rem', marginTop: '0.25rem' }}
                  >
                    <Briefcase size={15} color="var(--color-primary-light)" />
                    <span>Meu Painel Administrativo</span>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenChatHub();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.5rem' }}
                  >
                    <MessageSquare size={15} color="var(--color-primary-light)" />
                    <span>Minhas Mensagens</span>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onOpenFavorites();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.5rem' }}
                  >
                    <Heart size={15} color="var(--color-accent)" />
                    <span>Imóveis Favoritados ({favoritesCount})</span>
                  </button>

                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.2rem 0' }} />

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      onLogout();
                      closeAll();
                    }}
                    style={{ justifyContent: 'flex-start', width: '100%', gap: '0.5rem', color: '#ef4444' }}
                  >
                    <LogOut size={15} color="#ef4444" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn-outline btn-sm desktop-only"
              onClick={onOpenAuth}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.95rem' }}
            >
              <User size={16} />
              <span>Entrar</span>
            </button>
          )}

          {/* Anunciar Imóvel Primary CTA */}
          <button 
            className="btn btn-primary btn-sm desktop-only"
            onClick={onOpenPostProperty}
            style={{ fontWeight: 800, fontSize: '0.85rem', padding: '0.5rem 1.1rem' }}
          >
            <PlusCircle size={16} />
            <span>Anunciar Imóvel</span>
          </button>

          {/* Hamburger Mobile Menu Button (< 1024px) */}
          <button
            className="btn btn-ghost btn-sm mobile-only"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir Menu de Navegação"
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Menu size={20} color="var(--color-primary-light)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Menu</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
         MOBILE & TABLET SLIDE-OUT DRAWER MENU (PORTALED TO BODY TO PREVENT CLIPPING)
         ========================================================================= */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="mobile-drawer-overlay"
          style={{
            zIndex: 999999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={closeAll}
        >
          <div 
            className="mobile-drawer-content"
            style={{
              width: 'min(380px, 86vw)',
              height: '100%',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem 1.25rem calc(env(safe-area-inset-bottom, 24px) + 2rem) 1.25rem',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              borderLeft: '1px solid var(--border-color)',
              animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                  color: '#ffffff',
                  padding: '0.4rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Building2 size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '1.1rem', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                    Imóvel<span style={{ color: 'var(--color-primary-light)' }}>HUB</span>
                  </strong>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>CLASSIFICADOS</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {/* Dark Mode Quick Switch */}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setDarkMode(!darkMode)}
                  title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
                  style={{ padding: '0.45rem', borderRadius: '50%' }}
                >
                  {darkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} />}
                </button>

                {/* Close Button */}
                <button 
                  type="button"
                  className="btn btn-ghost btn-sm" 
                  onClick={closeAll}
                  style={{ padding: '0.45rem', borderRadius: '50%' }}
                  aria-label="Fechar Menu"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* User Profile Card / Login Button */}
            {currentUser ? (
              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Conectado como:</span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: 'var(--color-primary-light)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {currentUser.role}
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', marginBottom: '0.15rem' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                  {currentUser.email}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, fontSize: '0.78rem', fontWeight: 700 }}
                    onClick={() => {
                      currentUser.role === 'admin' ? onOpenAdminDashboard() : onOpenUserDashboard();
                      closeAll();
                    }}
                  >
                    <Briefcase size={14} />
                    <span>Painel {currentUser.role === 'admin' ? 'Admin' : 'do Usuário'}</span>
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      onLogout();
                      closeAll();
                    }}
                    title="Sair da Conta"
                    style={{ padding: '0.45rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="btn btn-outline"
                style={{ width: '100%', marginBottom: '1rem', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}
                onClick={() => {
                  onOpenAuth();
                  closeAll();
                }}
              >
                <User size={18} color="var(--color-primary-light)" />
                <span>Entrar ou Criar Conta Grátis</span>
              </button>
            )}

            {/* Primary Action: Anunciar Imóvel */}
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem', fontWeight: 800, justifyContent: 'center', padding: '0.75rem', gap: '0.5rem' }}
              onClick={() => {
                onOpenPostProperty();
                closeAll();
              }}
            >
              <PlusCircle size={18} />
              <span>Anunciar Novo Imóvel</span>
            </button>

            {/* Quick Badges Row: Favoritos, Comparador, Notificações */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  onOpenFavorites();
                  closeAll();
                }}
                style={{
                  flexDirection: 'column',
                  padding: '0.6rem 0.3rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  gap: '0.2rem'
                }}
              >
                <Heart size={16} color="var(--color-accent)" fill={favoritesCount > 0 ? "var(--color-accent)" : "none"} />
                <span>Favoritos ({favoritesCount})</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  onOpenCompare();
                  closeAll();
                }}
                style={{
                  flexDirection: 'column',
                  padding: '0.6rem 0.3rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  gap: '0.2rem'
                }}
              >
                <ArrowLeftRight size={16} color="#0284c7" />
                <span>Comparar ({compareCount})</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  onOpenNotifications && onOpenNotifications();
                  closeAll();
                }}
                style={{
                  flexDirection: 'column',
                  padding: '0.6rem 0.3rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  gap: '0.2rem'
                }}
              >
                <Bell size={16} color={unreadNotificationsCount > 0 ? "#ef4444" : "currentColor"} />
                <span>Alertas ({unreadNotificationsCount})</span>
              </button>
            </div>

            {/* Submenu Group 1: Imóveis */}
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              🏠 Imóveis &amp; Negociação
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
              <button
                className={`btn btn-ghost btn-sm ${activeTab === 'Todos' ? 'active-nav' : ''}`}
                style={{ justifyContent: 'flex-start', fontWeight: activeTab === 'Todos' ? 800 : 600, color: activeTab === 'Todos' ? 'var(--color-primary-light)' : 'inherit', gap: '0.6rem' }}
                onClick={() => {
                  onNavigateHome && onNavigateHome();
                  setActiveTab('Todos');
                  closeAll();
                }}
              >
                <Building2 size={16} color="#38bdf8" />
                <span>Todos os Imóveis</span>
              </button>

              <button
                className={`btn btn-ghost btn-sm ${activeTab === 'Comprar' ? 'active-nav' : ''}`}
                style={{ justifyContent: 'flex-start', fontWeight: activeTab === 'Comprar' ? 800 : 600, color: activeTab === 'Comprar' ? 'var(--color-primary-light)' : 'inherit', gap: '0.6rem' }}
                onClick={() => {
                  onNavigateHome && onNavigateHome();
                  setActiveTab('Comprar');
                  closeAll();
                }}
              >
                <Home size={16} color="var(--color-primary-light)" />
                <span>Comprar Imóveis</span>
              </button>

              <button
                className={`btn btn-ghost btn-sm ${activeTab === 'Alugar' ? 'active-nav' : ''}`}
                style={{ justifyContent: 'flex-start', fontWeight: activeTab === 'Alugar' ? 800 : 600, color: activeTab === 'Alugar' ? 'var(--color-primary-light)' : 'inherit', gap: '0.6rem' }}
                onClick={() => {
                  onNavigateHome && onNavigateHome();
                  setActiveTab('Alugar');
                  closeAll();
                }}
              >
                <Key size={16} color="var(--color-quinto)" />
                <span>Alugar Imóveis (Sem Fiador)</span>
              </button>

              <button
                className={`btn btn-ghost btn-sm ${activeTab === 'Lançamentos' ? 'active-nav' : ''}`}
                style={{ justifyContent: 'flex-start', fontWeight: activeTab === 'Lançamentos' ? 800 : 600, color: activeTab === 'Lançamentos' ? 'var(--color-primary-light)' : 'inherit', gap: '0.6rem' }}
                onClick={() => {
                  onNavigateHome && onNavigateHome();
                  setActiveTab('Lançamentos');
                  closeAll();
                }}
              >
                <Sparkles size={16} color="#f59e0b" />
                <span>Lançamentos &amp; Plantas</span>
              </button>

              <button
                className={`btn btn-ghost btn-sm ${activeTab === 'Temporada' ? 'active-nav' : ''}`}
                style={{ justifyContent: 'flex-start', fontWeight: activeTab === 'Temporada' ? 800 : 600, color: activeTab === 'Temporada' ? 'var(--color-primary-light)' : 'inherit', gap: '0.6rem' }}
                onClick={() => {
                  onNavigateHome && onNavigateHome();
                  setActiveTab('Temporada');
                  closeAll();
                }}
              >
                <span>🏖️</span>
                <span>Temporada &amp; Férias</span>
              </button>

              <button
                className={`btn btn-ghost btn-sm ${activeTab === 'Leilão' ? 'active-nav' : ''}`}
                style={{ justifyContent: 'flex-start', color: '#ef4444', fontWeight: activeTab === 'Leilão' ? 800 : 600, gap: '0.6rem' }}
                onClick={() => {
                  onNavigateHome && onNavigateHome();
                  setActiveTab('Leilão');
                  closeAll();
                }}
              >
                <Gavel size={16} />
                <span>Leilões Imobiliários</span>
              </button>
            </div>

            {/* Submenu Group 2: Serviços & Soluções */}
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              🛠️ Serviços &amp; Soluções
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', gap: '0.6rem' }}
                onClick={() => {
                  onOpenFinanceCalculator && onOpenFinanceCalculator();
                  closeAll();
                }}
              >
                <Calculator size={16} color="var(--color-primary-light)" />
                <span>Simulador de Financiamento</span>
              </button>

              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', color: '#ef4444', gap: '0.6rem' }}
                onClick={() => {
                  onOpenOpportunityRadar();
                  closeAll();
                }}
              >
                <Bell size={16} />
                <span>Radar de Preço &amp; Descontos</span>
              </button>

              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', gap: '0.6rem' }}
                onClick={() => {
                  onOpenDigitalContract();
                  closeAll();
                }}
              >
                <FileCheck size={16} color="#059669" />
                <span>Contratos Digitais ICP-Brasil</span>
              </button>

              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', gap: '0.6rem' }}
                onClick={() => {
                  onOpenMovingChecklist && onOpenMovingChecklist();
                  closeAll();
                }}
              >
                <Truck size={16} color="#f59e0b" />
                <span>Checklist de Mudança</span>
              </button>

              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', gap: '0.6rem' }}
                onClick={() => {
                  onOpenNeighborhoodInsights && onOpenNeighborhoodInsights();
                  closeAll();
                }}
              >
                <MapPin size={16} color="#0284c7" />
                <span>Insights dos Bairros</span>
              </button>
            </div>

            {/* Submenu Group 3: Para Profissionais & Suporte */}
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              🏢 Profissionais &amp; Suporte
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', color: '#0284c7', gap: '0.6rem' }}
                onClick={() => {
                  onOpenXmlSync();
                  closeAll();
                }}
              >
                <Database size={16} />
                <span>Carga &amp; Feeds XML (CRMs)</span>
              </button>

              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', color: '#8b5cf6', gap: '0.6rem' }}
                onClick={() => {
                  onOpenLeadCrm && onOpenLeadCrm();
                  closeAll();
                }}
              >
                <Users size={16} />
                <span>CRM Kanban de Leads</span>
              </button>

              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', gap: '0.6rem' }}
                onClick={() => {
                  onOpenChatHub();
                  closeAll();
                }}
              >
                <MessageSquare size={16} color="var(--color-primary-light)" />
                <span>Central de Mensagens</span>
              </button>

              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', gap: '0.6rem' }}
                onClick={() => {
                  onOpenSupport();
                  closeAll();
                }}
              >
                <Headphones size={16} color="var(--color-primary-light)" />
                <span>Central de Suporte</span>
              </button>

              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', fontWeight: 600, color: 'var(--color-primary-light)', gap: '0.6rem' }}
                onClick={() => {
                  onNavigateBlog();
                  closeAll();
                }}
              >
                <BookOpen size={16} />
                <span>Blog &amp; Mercado Imobiliário</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
