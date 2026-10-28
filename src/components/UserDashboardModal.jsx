import React, { useState } from 'react';
import { 
  X, 
  User, 
  Building2, 
  Calendar, 
  Star, 
  PlusCircle, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Clock,
  BadgeCheck,
  Phone,
  Mail,
  Heart,
  MessageSquare,
  ShieldCheck,
  Headphones,
  Sliders,
  DollarSign,
  TrendingUp,
  Share2,
  Video,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calculator,
  Eye,
  Trash2,
  ExternalLink,
  Edit,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  Briefcase,
  Users,
  Percent,
  Plus
} from 'lucide-react';

export default function UserDashboardModal({
  isOpen,
  onClose,
  currentUser,
  userProperties = [],
  properties = [],
  favorites = [],
  onOpenPostProperty,
  onOpenCheckout,
  onOpenAdminDashboard,
  onUpdateProperty,
  onDeleteProperty,
  onOpenLeadCrm
}) {
  // Active Role is directly bound to the authenticated user's role
  const activeRole = currentUser?.role || 'owner';
  const [activeTab, setActiveTab] = useState('overview');

  // =========================================================================
  // IMOBILIÁRIA (AGENCY) STATE - GESTÃO DE EQUIPE E COMISSÕES
  // =========================================================================
  const [agencyBrokers, setAgencyBrokers] = useState(() => {
    return currentUser?.brokers || [
      { id: 'brk-1', name: 'Rodrigo Mendonça', email: 'rodrigo@capitalprime.com.br', creci: '41.220-F', phone: '(41) 99888-1122', commissionRate: 50, activeProperties: 8, totalSales: 1650000 },
      { id: 'brk-2', name: 'Patrícia Albuquerque', email: 'patricia@capitalprime.com.br', creci: '39.810-F', phone: '(41) 99777-3344', commissionRate: 60, activeProperties: 12, totalSales: 3200000 },
      { id: 'brk-3', name: 'Bruno Silveira', email: 'bruno@capitalprime.com.br', creci: '44.550-F', phone: '(41) 99666-5566', commissionRate: 50, activeProperties: 5, totalSales: 780000 }
    ];
  });

  const [showAddBrokerModal, setShowAddBrokerModal] = useState(false);
  const [newBrokerName, setNewBrokerName] = useState('');
  const [newBrokerCreci, setNewBrokerCreci] = useState('');
  const [newBrokerEmail, setNewBrokerEmail] = useState('');
  const [newBrokerPhone, setNewBrokerPhone] = useState('');
  const [newBrokerCommission, setNewBrokerCommission] = useState('50');

  // Broker specific state
  const [brokerProfile, setBrokerProfile] = useState({
    name: currentUser?.name || 'Fernanda Corretora Prime',
    creci: currentUser?.creci || '12345-J',
    phone: currentUser?.phone || '(11) 97777-2222',
    email: currentUser?.email || 'fernanda.corretora@imoveis.com',
    bio: 'Especialista em imóveis de alto padrão e investimentos imobiliários na Zona Sul e Oeste de São Paulo.',
    neighborhoods: 'Moema, Pinheiros, Itaim Bibi, Jardins, Vila Mariana'
  });
  const [brokerProfileSaved, setBrokerProfileSaved] = useState(false);

  // Tickets for Support Role
  const [supportTickets, setSupportTickets] = useState([
    {
      id: 'TCK-8921',
      user: 'Carlos Comprador',
      email: 'carlos.comprador@email.com',
      subject: 'Dúvida sobre documentação para Financiamento',
      category: 'Financiamento',
      priority: 'Alta',
      status: 'Aberto',
      date: 'Hoje às 14:15',
      message: 'Gostaria de saber quais certidões negativas são exigidas para a proposta do High Line Batel Curitiba.'
    }
  ]);

  // Moderation items for Support
  const [moderationList, setModerationList] = useState([
    {
      id: 'mod-1',
      title: 'High Line Batel Curitiba (Duplex)',
      owner: 'Imobiliária Capital Prime',
      price: 'R$ 1.650.000',
      status: 'Aprovado com Super SEO',
      flag: 'Selo Google/Bing Ativo'
    }
  ]);

  // Owner/Broker Proposals State (only show mock for demo accounts)
  const [ownerProposals, setOwnerProposals] = useState(() => {
    if (currentUser?.id === 'user-owner' || currentUser?.id === 'user-broker') {
      return [
        {
          id: 'prop-formal-1',
          propertyTitle: 'High Line Batel Curitiba',
          offerPrice: 1580000,
          originalPrice: 1650000,
          downPayment: 450000,
          paymentType: 'Financiamento Caixa Econômica',
          buyerName: 'Dr. Fernando Guimarães',
          buyerPhone: '(41) 99123-8899',
          validity: '25/08/2026',
          status: 'Em Análise'
        }
      ];
    }
    return [];
  });

  // Visits State (only show mock for demo accounts)
  const [roleVisits, setRoleVisits] = useState(() => {
    if (currentUser?.id === 'user-owner' || currentUser?.id === 'user-broker') {
      return [
        {
          id: 'vis-101',
          propertyTitle: 'High Line Batel Curitiba',
          clientName: 'Dr. Fernando Guimarães',
          clientPhone: '(41) 99123-8899',
          date: '20/08/2026 (Sexta-feira)',
          time: '14:30',
          type: 'Presencial',
          status: 'Confirmada'
        }
      ];
    }
    return [];
  });

  // Buyer Simulations Saved (only show mock for demo accounts)
  const [buyerSimulations] = useState(() => {
    if (currentUser?.id === 'user-buyer') {
      return [
        {
          id: 'sim-1',
          propertyTitle: 'High Line Batel Curitiba',
          bank: 'Caixa Econômica (SAC)',
          loanAmount: 1200000,
          downPayment: 450000,
          monthlyPayment: 10450,
          interestRate: '9.99% a.a.',
          termMonths: 360
        }
      ];
    }
    return [];
  });

  if (!isOpen || !currentUser) return null;

  // Handlers for Agency
  const handleAddAgencyBroker = (e) => {
    e.preventDefault();
    if (!newBrokerName || !newBrokerCreci) return;
    const newBrk = {
      id: `brk-${Date.now()}`,
      name: newBrokerName,
      creci: newBrokerCreci,
      email: newBrokerEmail,
      phone: newBrokerPhone,
      commissionRate: parseFloat(newBrokerCommission) || 50,
      activeProperties: 0,
      totalSales: 0
    };
    setAgencyBrokers(prev => [...prev, newBrk]);
    setShowAddBrokerModal(false);
    setNewBrokerName('');
    setNewBrokerCreci('');
    setNewBrokerEmail('');
    setNewBrokerPhone('');
  };

  const handleDeleteAgencyBroker = (brkId) => {
    if (window.confirm('Tem certeza que deseja remover este corretor da sua equipe?')) {
      setAgencyBrokers(prev => prev.filter(b => b.id !== brkId));
    }
  };

  const handleUpdateBrokerCommission = (brkId, newRate) => {
    setAgencyBrokers(prev => prev.map(b => b.id === brkId ? { ...b, commissionRate: parseFloat(newRate) || 50 } : b));
  };

  // Render role header badge info
  const roleConfig = {
    agency: {
      name: 'Imobiliária (Agência)',
      icon: Briefcase,
      badgeColor: '#0284c7',
      desc: 'Gestão da equipe de corretores, captações da agência e comissões'
    },
    owner: {
      name: 'Proprietário Anunciante',
      icon: Building2,
      badgeColor: '#f59e0b',
      desc: 'Gestão dos seus imóveis, visitas de interessados e propostas recebidas'
    },
    broker: {
      name: 'Corretor Especialista',
      icon: Award,
      badgeColor: '#059669',
      desc: 'Gestão da carteira de captações, agenda de visitas e comissões'
    },
    buyer: {
      name: 'Comprador / Inquilino',
      icon: Heart,
      badgeColor: '#3b82f6',
      desc: 'Meus imóveis favoritados, visitas solicitadas e propostas enviadas'
    },
    support: {
      name: 'Central de Suporte & Moderação',
      icon: Headphones,
      badgeColor: '#8b5cf6',
      desc: 'Fila de tickets, moderação de anúncios e validação de corretores'
    }
  };

  const currentRoleInfo = roleConfig[activeRole] || roleConfig.agency;
  const RoleIcon = currentRoleInfo.icon;
  const favoritePropertiesList = properties.filter(p => favorites.includes(p.id));

  // Agency Calculations
  const agencyTotalProperties = agencyBrokers.reduce((acc, b) => acc + b.activeProperties, 0);
  const agencyTotalVGV = agencyBrokers.reduce((acc, b) => acc + b.totalSales, 0);
  const agencyTotalCommissionGross = agencyTotalVGV * 0.06; // 6% comissão bruta da imobiliária

  return (
    <div className="modal-overlay" style={{ zIndex: 1300 }} onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '1500px', 
          width: '96vw', 
          height: '90vh', 
          padding: 0, 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-card)'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${currentRoleInfo.badgeColor}` }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.18rem', fontWeight: 800 }}>{currentUser.name}</h2>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                  backgroundColor: `${currentRoleInfo.badgeColor}20`,
                  color: currentRoleInfo.badgeColor,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <RoleIcon size={12} /> {currentRoleInfo.name}
                </span>
                {currentUser.creci && (
                  <span className="badge badge-quinto" style={{ fontSize: '0.7rem' }}>CRECI {currentUser.creci}</span>
                )}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {currentUser.email} • {currentRoleInfo.desc}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {currentUser.role === 'admin' && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  onClose();
                  onOpenAdminDashboard && onOpenAdminDashboard();
                }}
                style={{ fontSize: '0.75rem', borderColor: '#38bdf8', color: '#38bdf8' }}
              >
                <ShieldCheck size={14} />
                <span>Painel Admin Master</span>
              </button>
            )}

            <button 
              onClick={onClose} 
              style={{ border: 'none', background: 'var(--bg-card)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.6rem 1.5rem',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto'
        }}>
          {/* TABS FOR IMOBILIÁRIA (AGENCY) */}
          {activeRole === 'agency' && [
            { id: 'overview', label: 'Painel da Imobiliária', icon: Briefcase },
            { id: 'agency-brokers', label: `Minha Equipe de Corretores (${agencyBrokers.length})`, icon: Users },
            { id: 'agency-properties', label: `Carteira de Captações (${properties.length})`, icon: Building2 },
            { id: 'agency-commissions', label: 'Gestão de Comissões & Repasses', icon: Percent },
            { id: 'agency-profile', label: 'Dados da Imobiliária & CRECI', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? '#0284c7' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid #0284c7' : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* TABS FOR PROPRIETÁRIO */}
          {activeRole === 'owner' && [
            { id: 'overview', label: 'Visão Geral & Métricas', icon: TrendingUp },
            { id: 'my-properties', label: `Meus Imóveis (${userProperties.length})`, icon: Building2 },
            { id: 'owner-visits', label: `Visitas Agendadas (${roleVisits.length})`, icon: Calendar },
            { id: 'owner-proposals', label: `Propostas Recebidas (${ownerProposals.length})`, icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? '#f59e0b' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid #f59e0b' : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* TABS FOR CORRETOR */}
          {activeRole === 'broker' && [
            { id: 'overview', label: 'Desempenho & Comissões', icon: DollarSign },
            { id: 'broker-portfolio', label: `Minha Carteira (${properties.length})`, icon: Building2 },
            { id: 'broker-agenda', label: `Agenda de Visitas (${roleVisits.length})`, icon: Calendar },
            { id: 'broker-profile', label: 'Meu Perfil & CRECI', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? '#059669' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid #059669' : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* TABS FOR COMPRADOR */}
          {activeRole === 'buyer' && [
            { id: 'overview', label: 'Meu Painel', icon: User },
            { id: 'my-properties', label: `Meus Imóveis (${userProperties.length})`, icon: Building2 },
            { id: 'buyer-favorites', label: `Meus Favoritos (${favoritePropertiesList.length})`, icon: Heart },
            { id: 'buyer-visits', label: `Visitas Agendadas (${roleVisits.length})`, icon: Calendar },
            { id: 'buyer-proposals', label: `Minhas Propostas (${ownerProposals.length})`, icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? '#3b82f6' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* TABS FOR SUPORTE */}
          {activeRole === 'support' && [
            { id: 'overview', label: 'Central de Atendimento', icon: Headphones },
            { id: 'support-tickets', label: `Fila de Tickets (${supportTickets.length})`, icon: MessageSquare },
            { id: 'support-moderation', label: `Moderação de Imóveis (${moderationList.length})`, icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? '#8b5cf6' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid #8b5cf6' : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', backgroundColor: 'var(--bg-main)' }}>
          {/* ========================================================================= */}
          {/* 🏢 PAINEL EXCLUSIVO DA IMOBILIÁRIA (AGENCY)                                */}
          {/* ========================================================================= */}
          {activeRole === 'agency' && (
            <div>
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CORRETORES NA EQUIPE</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>
                        {agencyBrokers.length}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#10b981' }}>● Todos com CRECI ativo</span>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CARTEIRA TOTAL DE CAPTAÇÕES</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary-light)', marginTop: '0.2rem' }}>
                        {agencyTotalProperties}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Imóveis da imobiliária</span>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>VGV TOTAL VENDIDO</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                        R$ {(agencyTotalVGV / 1000000).toFixed(2)}M
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#10b981' }}>▲ +15% no trimestre</span>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>COMISSÃO BRUTA DA IMOBILIÁRIA (6%)</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6', marginTop: '0.2rem' }}>
                        R$ {agencyTotalCommissionGross.toLocaleString('pt-BR')}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total antes do split</span>
                    </div>
                  </div>

                  {/* Banner Ação Rápida */}
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Deseja expandir a equipe de vendas da sua Imobiliária?</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                        Cadastre novos corretores com CRECI e configure a taxa de repasse de comissão individual.
                      </p>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setActiveTab('agency-brokers');
                        setShowAddBrokerModal(true);
                      }}
                    >
                      <PlusCircle size={15} />
                      <span>Cadastrar Corretor</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Minha Equipe de Corretores */}
              {activeTab === 'agency-brokers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Equipe de Corretores da Imobiliária</h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Gerencie seus corretores parceiros e defina a comissão acordada (Split) de cada um</span>
                    </div>

                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddBrokerModal(!showAddBrokerModal)}>
                      <PlusCircle size={15} />
                      <span>{showAddBrokerModal ? 'Fechar Formulário' : '+ Adicionar Corretor à Imobiliária'}</span>
                    </button>
                  </div>

                  {/* Formulário Novo Corretor */}
                  {showAddBrokerModal && (
                    <form onSubmit={handleAddAgencyBroker} style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '2px solid #0284c7', boxShadow: 'var(--shadow-md)' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Cadastrar Corretor na Imobiliária</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Nome do Corretor</label>
                          <input type="text" required value={newBrokerName} onChange={(e) => setNewBrokerName(e.target.value)} placeholder="Ex: Lucas Brandão" style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Registro CRECI</label>
                          <input type="text" required value={newBrokerCreci} onChange={(e) => setNewBrokerCreci(e.target.value)} placeholder="Ex: CRECI 45.890-F" style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>E-mail</label>
                          <input type="email" required value={newBrokerEmail} onChange={(e) => setNewBrokerEmail(e.target.value)} placeholder="lucas@capitalprime.com.br" style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>WhatsApp / Telefone</label>
                          <input type="text" required value={newBrokerPhone} onChange={(e) => setNewBrokerPhone(e.target.value)} placeholder="(41) 99888-7766" style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>% Comissão do Corretor (Split)</label>
                          <select value={newBrokerCommission} onChange={(e) => setNewBrokerCommission(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', fontWeight: 700 }}>
                            <option value="40">40% Corretor / 60% Imobiliária</option>
                            <option value="50">50% Corretor / 50% Imobiliária (Padrão)</option>
                            <option value="60">60% Corretor / 40% Imobiliária</option>
                            <option value="70">70% Corretor / 30% Imobiliária</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddBrokerModal(false)}>Cancelar</button>
                        <button type="submit" className="btn btn-primary btn-sm">Salvar Corretor</button>
                      </div>
                    </form>
                  )}

                  {/* Tabela de Corretores */}
                  <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                          <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Corretor</th>
                          <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>CRECI</th>
                          <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Imóveis Ativos</th>
                          <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Comissão Acordada (Split)</th>
                          <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', textAlign: 'center' }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agencyBrokers.map(brk => (
                          <tr key={brk.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <strong style={{ fontSize: '0.88rem', display: 'block' }}>{brk.name}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{brk.email} • {brk.phone}</span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                              <span className="badge badge-quinto">{brk.creci}</span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 700, fontSize: '0.85rem' }}>
                              {brk.activeProperties} captações
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <select
                                value={brk.commissionRate}
                                onChange={(e) => handleUpdateBrokerCommission(brk.id, e.target.value)}
                                style={{ padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', fontSize: '0.78rem', fontWeight: 700 }}
                              >
                                <option value="40">40% Corretor / 60% Imobiliária</option>
                                <option value="50">50% Corretor / 50% Imobiliária</option>
                                <option value="60">60% Corretor / 40% Imobiliária</option>
                                <option value="70">70% Corretor / 30% Imobiliária</option>
                              </select>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteAgencyBroker(brk.id)}
                                style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '4px', width: '28px', height: '28px', cursor: 'pointer' }}
                                title="Remover da equipe"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Carteira de Captações */}
              {activeTab === 'agency-properties' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Imóveis da Imobiliária</h3>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onClose();
                        onOpenPostProperty && onOpenPostProperty();
                      }}
                    >
                      <PlusCircle size={15} />
                      <span>Cadastrar Novo Imóvel da Agência</span>
                    </button>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                          <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Imóvel</th>
                          <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Preço</th>
                          <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Corretor Responsável</th>
                          <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', textAlign: 'center' }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.slice(0, 6).map((prop, idx) => {
                          const assignedBroker = agencyBrokers[idx % agencyBrokers.length];
                          return (
                            <tr key={prop.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <strong style={{ fontSize: '0.88rem', display: 'block' }}>{prop.title}</strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prop.neighborhood}, {prop.city}</span>
                              </td>
                              <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                                R$ {prop.price?.toLocaleString('pt-BR') || prop.rentPrice}
                              </td>
                              <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                                <span className="badge badge-quinto">{assignedBroker?.name}</span>
                              </td>
                              <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={() => alert(`Link de WhatsApp gerado para a agência: https://imovelhub.com.br/imoveis/${prop.id}?imobiliaria=capital-prime`)}
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  <Share2 size={13} />
                                  <span>Divulgar</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Gestão de Comissões & Repasses */}
              {activeTab === 'agency-commissions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Demonstrativo de Comissões e Divisão de Lucros</h3>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>COMISSÃO TOTAL DA IMOBILIÁRIA</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>
                          R$ {((agencyTotalCommissionGross) * 0.45).toLocaleString('pt-BR')}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lucro líquido retido</span>
                      </div>
                      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REPASSES AOS CORRETORES</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                          R$ {((agencyTotalCommissionGross) * 0.55).toLocaleString('pt-BR')}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#10b981' }}>Pago aos corretores da equipe</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Perfil da Imobiliária */}
              {activeTab === 'agency-profile' && (
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', maxWidth: '700px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>Dados Cadastrais da Imobiliária</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Razão Social</label>
                      <input type="text" defaultValue="Capital Prime Imóveis e Consultoria Ltda" style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>CRECI Jurídico Master</label>
                      <input type="text" defaultValue="34.890-J" style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 🏡 PAINEL DO PROPRIETÁRIO / MEUS IMÓVEIS                                   */}
          {/* ========================================================================= */}
          {(activeRole === 'owner' || activeTab === 'my-properties') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>IMÓVEIS ANUNCIADOS</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>
                        {userProperties.length}
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>VISITAS AGENDADAS</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                        {roleVisits.length}
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PROPOSTAS RECEBIDAS</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>
                        {ownerProposals.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Meus Imóveis Anunciados (Proprietário) */}
              {activeTab === 'my-properties' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Meus Imóveis Cadastrados ({userProperties.length})</h3>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onClose();
                        onOpenPostProperty && onOpenPostProperty();
                      }}
                    >
                      <PlusCircle size={15} />
                      <span>Anunciar Novo Imóvel</span>
                    </button>
                  </div>

                  {userProperties.length === 0 ? (
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '3rem 1.5rem', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <Home size={38} color="var(--color-primary-light)" style={{ margin: '0 auto 0.75rem auto' }} />
                      <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.4rem' }}>Você ainda não tem imóveis cadastrados</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>
                        Cadastre seu primeiro imóvel agora mesmo. Você pode preencher manualmente ou usar a opção de <strong>Cadastrar Modelo</strong> para preencher com 1 clique!
                      </p>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          onClose();
                          onOpenPostProperty && onOpenPostProperty();
                        }}
                      >
                        <PlusCircle size={15} />
                        <span>Anunciar Primeiro Imóvel</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                      <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                          <thead>
                            <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Código</th>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Imóvel</th>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Valor</th>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Status</th>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', textAlign: 'center' }}>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userProperties.map(prop => (
                              <tr key={prop.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                                  <span style={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                                    color: '#38bdf8',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    padding: '0.22rem 0.55rem',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                    letterSpacing: '0.5px'
                                  }}>
                                    {prop.code || prop.id}
                                  </span>
                                </td>
                                <td style={{ padding: '0.85rem 1rem' }}>
                                  <strong style={{ fontSize: '0.88rem', display: 'block' }}>{prop.title}</strong>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prop.neighborhood}, {prop.city}</span>
                                </td>
                                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                                  {prop.transactionType === 'Venda' ? `R$ ${(prop.price || 0).toLocaleString('pt-BR')}` : `R$ ${(prop.rentPrice || prop.price || 0).toLocaleString('pt-BR')}/mês`}
                                </td>
                                <td style={{ padding: '0.85rem 1rem' }}>
                                  <span className="badge badge-quinto">Publicado</span>
                                </td>
                                <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                                    <button
                                      className="btn btn-outline btn-sm"
                                      onClick={() => onOpenCheckout && onOpenCheckout(prop)}
                                      title="Turbinar com Super Destaque / SEO"
                                      style={{ fontSize: '0.72rem', color: '#f59e0b', borderColor: '#f59e0b' }}
                                    >
                                      <Sparkles size={13} />
                                      <span>Destacar</span>
                                    </button>
                                    <button
                                      className="btn btn-ghost btn-sm"
                                      onClick={() => {
                                        if (window.confirm(`Tem certeza que deseja excluir o anúncio "${prop.title}"?`)) {
                                          onDeleteProperty && onDeleteProperty(prop.id);
                                        }
                                      }}
                                      title="Excluir Imóvel"
                                      style={{ color: '#ef4444', padding: '0.35rem' }}
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Visitas Agendadas (Proprietário) */}
              {activeTab === 'owner-visits' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Visitas Solicitadas para Meus Imóveis ({roleVisits.length})</h3>
                  {roleVisits.length === 0 ? (
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '2.5rem', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      Nenhuma visita agendada para seus imóveis no momento.
                    </div>
                  ) : (
                    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                      <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                          <thead>
                            <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Imóvel</th>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Interessado</th>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Data &amp; Hora</th>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roleVisits.map(v => (
                              <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{v.propertyTitle}</td>
                                <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>{v.clientName} ({v.clientPhone})</td>
                                <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>{v.date} às {v.time}</td>
                                <td style={{ padding: '0.85rem 1rem' }}><span className="badge badge-quinto">{v.status}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Propostas Recebidas (Proprietário) */}
              {activeTab === 'owner-proposals' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Propostas de Compra Recebidas ({ownerProposals.length})</h3>
                  {ownerProposals.length === 0 ? (
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '2.5rem', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      Nenhuma proposta de compra recebida no momento.
                    </div>
                  ) : (
                    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                      <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                          <thead>
                            <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Imóvel</th>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Proponente</th>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Valor Ofertado</th>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Pagamento</th>
                              <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ownerProposals.map(p => (
                              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{p.propertyTitle}</td>
                                <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>{p.buyerName}</td>
                                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--color-primary)' }}>R$ {p.offerPrice?.toLocaleString('pt-BR')}</td>
                                <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>{p.paymentType}</td>
                                <td style={{ padding: '0.85rem 1rem' }}><span className="badge badge-loft">{p.status}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 📜 PAINEL DO CORRETOR                                                     */}
          {/* ========================================================================= */}
          {activeRole === 'broker' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CARTEIRA DE IMÓVEIS</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>{properties.length}</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>VGV SOB GESTÃO</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>R$ 48.2M</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>VISITAS AGENDADAS</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>{roleVisits.length}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'broker-portfolio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Imóveis da Minha Carteira ({properties.length})</h3>
                    <button className="btn btn-primary btn-sm" onClick={() => { onClose(); onOpenPostProperty && onOpenPostProperty(); }}>
                      <PlusCircle size={15} />
                      <span>Cadastrar Novo Imóvel</span>
                    </button>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                    <div className="table-responsive">
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Imóvel</th>
                            <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Valor</th>
                            <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Tipo</th>
                            <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', textAlign: 'center' }}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {properties.slice(0, 8).map(prop => (
                            <tr key={prop.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <strong style={{ fontSize: '0.88rem', display: 'block' }}>{prop.title}</strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prop.neighborhood}, {prop.city}</span>
                              </td>
                              <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                                {prop.transactionType === 'Venda' ? `R$ ${(prop.price || 0).toLocaleString('pt-BR')}` : `R$ ${(prop.rentPrice || prop.price || 0).toLocaleString('pt-BR')}/mês`}
                              </td>
                              <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>{prop.type}</td>
                              <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                <button className="btn btn-outline btn-sm" onClick={() => alert(`Link de divulgação copiado para o corretor ${brokerProfile.name}`)} style={{ fontSize: '0.75rem' }}>
                                  <Share2 size={13} />
                                  <span>Divulgar</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'broker-agenda' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Minha Agenda de Visitas com Clientes</h3>
                  <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                    <div className="table-responsive">
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Imóvel</th>
                            <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Cliente</th>
                            <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Horário</th>
                            <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roleVisits.map(v => (
                            <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{v.propertyTitle}</td>
                              <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>{v.clientName} ({v.clientPhone})</td>
                              <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>{v.date} às {v.time}</td>
                              <td style={{ padding: '0.85rem 1rem' }}><span className="badge badge-quinto">{v.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'broker-profile' && (
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', maxWidth: '700px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>Meu Perfil de Corretor Credenciado</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Nome Completo</label>
                      <input type="text" value={brokerProfile.name} onChange={(e) => setBrokerProfile({ ...brokerProfile, name: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Registro CRECI</label>
                      <input type="text" value={brokerProfile.creci} onChange={(e) => setBrokerProfile({ ...brokerProfile, creci: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }} />
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => { setBrokerProfileSaved(true); setTimeout(() => setBrokerProfileSaved(false), 2000); }}>
                    {brokerProfileSaved ? 'Perfil Atualizado com Sucesso!' : 'Salvar Alterações do Perfil'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 🔍 PAINEL DO COMPRADOR                                                    */}
          {/* ========================================================================= */}
          {activeRole === 'buyer' && activeTab !== 'my-properties' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div 
                      style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                      onClick={() => setActiveTab('my-properties')}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>MEUS IMÓVEIS ANUNCIADOS</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>{userProperties.length}</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>IMÓVEIS FAVORITADOS</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>{favoritePropertiesList.length}</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>VISITAS SOLICITADAS</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>{roleVisits.length}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'buyer-favorites' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Meus Imóveis Salvos ({favoritePropertiesList.length})</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {favoritePropertiesList.map(prop => (
                      <div key={prop.id} style={{ backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <strong style={{ fontSize: '0.95rem', display: 'block' }}>{prop.title}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prop.neighborhood}, {prop.city}</span>
                        <div style={{ fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
                          {prop.transactionType === 'Venda' ? `R$ ${(prop.price || 0).toLocaleString('pt-BR')}` : `R$ ${(prop.rentPrice || prop.price || 0).toLocaleString('pt-BR')}/mês`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'buyer-visits' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Minhas Visitas Agendadas</h3>
                  <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', padding: '1rem' }}>
                    {roleVisits.map(v => (
                      <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                        <div>
                          <strong>{v.propertyTitle}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Data: {v.date} às {v.time} ({v.type})</div>
                        </div>
                        <span className="badge badge-quinto">{v.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'buyer-proposals' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Propostas Enviadas para Vendedores</h3>
                  <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', padding: '1rem' }}>
                    {ownerProposals.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
                        <div>
                          <strong>{p.propertyTitle}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Valor Ofertado: R$ {p.offerPrice?.toLocaleString('pt-BR')} • {p.paymentType}</div>
                        </div>
                        <span className="badge badge-loft">{p.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 🎧 PAINEL DO SUPORTE                                                      */}
          {/* ========================================================================= */}
          {activeRole === 'support' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TICKETS EM ABERTO</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6', marginTop: '0.2rem' }}>{supportTickets.length}</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>MODERAÇÃO PENDENTE</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>{moderationList.length}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'support-tickets' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Fila de Atendimento de Usuários</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {supportTickets.map(tck => (
                      <div key={tck.id} style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span className="badge badge-olx">{tck.id} • {tck.category}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tck.date}</span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.25rem' }}>{tck.subject}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{tck.message}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>De: <strong>{tck.user}</strong> ({tck.email})</span>
                          <button className="btn btn-primary btn-sm" onClick={() => alert(`Chat de resposta aberto para ${tck.user}`)}>
                            <Send size={13} />
                            <span>Responder Ticket</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'support-moderation' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Fila de Moderação de Anúncios</h3>
                  <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', padding: '1rem' }}>
                    {moderationList.map(mod => (
                      <div key={mod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
                        <div>
                          <strong>{mod.title}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Anunciante: {mod.owner} • Valor: {mod.price}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <span className="badge badge-quinto">{mod.status}</span>
                          <button className="btn btn-primary btn-sm" onClick={() => alert('Anúncio validado e ativado no portal!')} style={{ fontSize: '0.72rem' }}>
                            <CheckCircle2 size={13} />
                            <span>Aprovar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
