import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Users, 
  BarChart3, 
  Tag, 
  Trash2, 
  PlusCircle, 
  Search, 
  CheckSquare, 
  Square, 
  Save, 
  Palette, 
  RefreshCw, 
  Globe, 
  CreditCard, 
  Radio, 
  ShieldCheck, 
  Zap, 
  FileCheck, 
  Database, 
  ClipboardCheck, 
  ChevronDown, 
  ChevronRight, 
  Pencil, 
  ExternalLink,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import AdminAnalyticsCharts from './AdminAnalyticsCharts';
import { fetchSchedules, fetchProposals, fetchTransactions } from '../services/api';

const EMOJI_ICONS = ['🏢', '🏡', '🏞️', '🏬', '🚜', '🏖️', '🏰', '🏭', '🏨', '📦', '⛵', '🌿', '🔑', '🏠'];

export default function AdminDashboardModal({
  isOpen,
  onClose,
  properties = [],
  onUpdateProperty,
  onDeleteProperty,
  onOpenPostProperty,
  onOpenCheckout,
  onOpenMassCsv,
  users = [],
  onUpdateUserRole,
  onToggleUserStatus,
  onAddUser,
  onDeleteUser,
  currentUser
}) {
  // Active Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'properties', 'categories', 'seo', 'online-users', 'contracts', 'xml-sync', 'inspections', 'appearance', 'users', 'schedules', 'proposals', 'financial', 'settings'

  // Property Filters & Batch Selection State
  const [propSearch, setPropSearch] = useState('');
  const [propTransactionFilter, setPropTransactionFilter] = useState('all');
  const [propTypeFilter, setPropTypeFilter] = useState('all');
  const [propStatusFilter, setPropStatusFilter] = useState('all');
  const [selectedPropIds, setSelectedPropIds] = useState([]);
  
  // Property Edit Modal State
  const [editingProperty, setEditingProperty] = useState(null);
  
  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'broker',
    status: 'active',
    phone: '',
    creci: ''
  });

  // =========================================================================
  // MODALIDADES DE TRANSAÇÃO (STATE & CRUD)
  // =========================================================================
  const [modalities, setModalities] = useState([
    { id: 'mod-buy', name: 'Comprar', badge: 'Venda Tradicional', desc: 'Imóveis residenciais e comerciais para compra e venda', active: true, count: 18 },
    { id: 'mod-rent', name: 'Alugar', badge: 'Locação Mensal', desc: 'Contratos mensais com pacote total e garantia sem fiador', active: true, count: 9 },
    { id: 'mod-launch', name: 'Lançamentos', badge: 'Na Planta', desc: 'Empreendimentos novos e projetos em construção', active: true, count: 4 },
    { id: 'mod-season', name: 'Temporada', badge: 'Férias / Diárias', desc: 'Casas de praia, serra e estadias por temporada', active: true, count: 3 },
    { id: 'mod-new', name: 'Imóvel Novo', badge: 'Pronto p/ Morar', desc: 'Unidades recém-entregues sem uso anterior', active: true, count: 6 },
    { id: 'mod-auction', name: 'Leilão', badge: 'Oportunidade Judicial', desc: 'Leilões judiciais e extrajudiciais com grandes descontos', active: true, count: 2 }
  ]);

  const [showAddModalityModal, setShowAddModalityModal] = useState(false);
  const [editingModality, setEditingModality] = useState(null);
  const [newModalityData, setNewModalityData] = useState({
    name: '',
    badge: '',
    desc: '',
    active: true
  });

  // =========================================================================
  // PICKLIST HIERÁRQUICO: CATEGORIAS & SUBCATEGORIAS (STATE & CRUD COM ÍCONES)
  // =========================================================================
  const [categoryHierarchy, setCategoryHierarchy] = useState([
    {
      id: 'cat-apt',
      name: 'Apartamento',
      icon: '🏢',
      checked: true,
      expanded: true,
      subcategories: [
        { id: 'sub-apt-padrao', name: 'Padrão', checked: true },
        { id: 'sub-apt-kitnet', name: 'Kitnet/Studio', checked: true },
        { id: 'sub-apt-cobertura', name: 'Cobertura', checked: true },
        { id: 'sub-apt-flat', name: 'Flat', checked: true },
        { id: 'sub-apt-garden', name: 'Garden', checked: true },
        { id: 'sub-apt-loft', name: 'Loft', checked: true },
        { id: 'sub-apt-duplex', name: 'Duplex', checked: true }
      ]
    },
    {
      id: 'cat-casa',
      name: 'Casa',
      icon: '🏡',
      checked: true,
      expanded: true,
      subcategories: [
        { id: 'sub-casa-padrao', name: 'Padrão', checked: true },
        { id: 'sub-casa-condo', name: 'Casa em condomínio', checked: true },
        { id: 'sub-casa-sobrado', name: 'Sobrado', checked: true },
        { id: 'sub-casa-vila', name: 'Casa de Vila', checked: true }
      ]
    },
    {
      id: 'cat-terreno',
      name: 'Terreno',
      icon: '🏞️',
      checked: true,
      expanded: true,
      subcategories: [
        { id: 'sub-terreno-lote', name: 'Loteamento/Condomínio', checked: true }
      ]
    },
    {
      id: 'cat-comercial',
      name: 'Comercial',
      icon: '🏬',
      checked: true,
      expanded: true,
      subcategories: [
        { id: 'sub-com-sala', name: 'Conjunto Comercial/sala', checked: true },
        { id: 'sub-com-ponto', name: 'Ponto Comercial', checked: true },
        { id: 'sub-com-loja', name: 'Loja/Salão', checked: true },
        { id: 'sub-com-box', name: 'Box/Garagem', checked: true },
        { id: 'sub-com-casa', name: 'Casa Comercial', checked: true },
        { id: 'sub-com-galpao', name: 'Galpão/Depósito/Barracão', checked: true },
        { id: 'sub-com-pousada', name: 'Pousada/Chalé', checked: true },
        { id: 'sub-com-predio', name: 'Prédio Inteiro', checked: true }
      ]
    },
    {
      id: 'cat-rural',
      name: 'Rural',
      icon: '🚜',
      checked: true,
      expanded: true,
      subcategories: [
        { id: 'sub-rural-chacara', name: 'Chácara', checked: true },
        { id: 'sub-rural-fazenda', name: 'Fazenda', checked: true }
      ]
    }
  ]);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCatData, setNewCatData] = useState({ name: '', icon: '🏢' });
  
  const [addingSubcategoryToCatId, setAddingSubcategoryToCatId] = useState(null);
  const [newSubcatName, setNewSubcatName] = useState('');
  const [editingSubcategory, setEditingSubcategory] = useState(null); // { catId, subId, name }

  // Online Users Data
  const [onlineUsersData] = useState({
    admin: [
      { id: 'on-adm-1', name: 'Administrador Geral', email: 'admin@imovelhub.com.br', ip: '187.54.120.10', location: 'São Paulo, SP', device: 'Desktop (Chrome 128 / Windows 11)', onlineTime: '3h 12m', page: '/admin' }
    ],
    support: [
      { id: 'on-sup-1', name: 'Atendimento Suporte ImóvelHUB', email: 'suporte@imovelhub.com.br', ip: '201.88.45.22', location: 'Curitiba, PR', device: 'Desktop (macOS / Safari)', onlineTime: '1h 45m', page: '/suporte-live-chat' }
    ],
    owner: [
      { id: 'on-own-1', name: 'Ricardo Proprietário', email: 'ricardo.proprietario@email.com', ip: '177.102.89.5', location: 'São Paulo, SP', device: 'Mobile (iPhone 15 / Safari)', onlineTime: '24m', page: '/painel-proprietario' }
    ],
    agency: [
      { id: 'on-agn-1', name: 'Imobiliária Capital Prime', email: 'contato@capitalprime.com.br', ip: '189.33.12.90', location: 'Curitiba, PR', device: 'Desktop (Chrome / Windows 10)', onlineTime: '4h 05m', page: '/painel-imobiliaria' }
    ],
    broker: [
      { id: 'on-brk-1', name: 'Fernanda Corretora Prime', email: 'fernanda.corretora@imoveis.com', ip: '179.210.66.4', location: 'São Paulo, SP', device: 'Tablet (iPad Pro / Safari)', onlineTime: '52m', page: '/agenda-visitas' }
    ],
    buyer: [
      { id: 'on-buy-1', name: 'Carlos Comprador', email: 'carlos.comprador@email.com', ip: '186.240.11.8', location: 'São Paulo, SP', device: 'Desktop (Firefox / Linux)', onlineTime: '18m', page: '/imoveis/prop-batel-seo' }
    ]
  });

  const totalOnlineCount = Object.values(onlineUsersData).reduce((acc, list) => acc + list.length, 0);

  // Site Theme State
  const [siteTheme, setSiteTheme] = useState({
    colorPrimary: '#1e3a8a',
    colorPrimaryLight: '#3b82f6',
    colorAccent: '#ff4757',
    colorQuinto: '#059669',
    brandName: 'ImóvelHUB'
  });

  // Schedules state (Synced with API)
  const [schedules, setSchedules] = useState([
    { id: 'sch-1', propertyTitle: 'High Line Batel Curitiba', clientName: 'Dr. Fernando Guimarães', clientPhone: '(41) 99123-8899', date: '20/08/2026', time: '14:30', type: 'Presencial', status: 'Confirmada' },
    { id: 'sch-2', propertyTitle: 'Apartamento em Moema', clientName: 'Mariana Silveira', clientPhone: '(11) 98765-1122', date: '22/08/2026', time: '10:00', type: 'Tour Virtual', status: 'Pendente' }
  ]);

  // Proposals state (Synced with API)
  const [proposals, setProposals] = useState([
    { id: 'prop-formal-1', propertyTitle: 'High Line Batel Curitiba', proposerName: 'Dr. Fernando Guimarães', originalPrice: 1650000, offeredPrice: 1580000, paymentMethod: 'Financiamento Caixa (Entrada R$ 450k)', status: 'Em Análise' }
  ]);

  // Financial Transactions state (Synced with API)
  const [transactions, setTransactions] = useState([
    { id: 'tx-1001', propTitle: 'High Line Batel Curitiba', plan: 'Plano Ultra VIP + Super SEO Google & Bing', amount: 149.90, method: 'PIX Instantâneo', date: '14/08/2026', status: 'Aprovado' },
    { id: 'tx-1002', propTitle: 'Apartamento em Moema', plan: 'Plano Super Destaque ZAP', amount: 49.90, method: 'PIX Instantâneo', date: '14/08/2026', status: 'Aprovado' }
  ]);

  // Fetch live API data when dashboard is opened
  useEffect(() => {
    if (!isOpen) return;
    async function loadAdminData() {
      try {
        const [apiSchedules, apiProposals, apiTransactions] = await Promise.all([
          fetchSchedules(),
          fetchProposals(),
          fetchTransactions()
        ]);
        if (apiSchedules && apiSchedules.length > 0) setSchedules(apiSchedules);
        if (apiProposals && apiProposals.length > 0) setProposals(apiProposals);
        if (apiTransactions && apiTransactions.length > 0) setTransactions(apiTransactions);
      } catch (err) {
        console.warn("Could not load remote admin data, falling back to local state:", err);
      }
    }
    loadAdminData();
  }, [isOpen]);

  // Calculated Analytics
  const totalProperties = properties.length;
  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);

  if (!isOpen) return null;

  // Filtered Properties for Admin
  const filteredProperties = properties.filter(p => {
    const matchesSearch = !propSearch || 
      p.title?.toLowerCase().includes(propSearch.toLowerCase()) || 
      p.neighborhood?.toLowerCase().includes(propSearch.toLowerCase()) || 
      p.city?.toLowerCase().includes(propSearch.toLowerCase()) ||
      p.id?.toLowerCase().includes(propSearch.toLowerCase());

    const matchesTransaction = propTransactionFilter === 'all' || 
      p.transactionType?.toLowerCase() === propTransactionFilter.toLowerCase() ||
      (propTransactionFilter === 'Lançamentos' && (p.isLaunch || p.isRelease)) ||
      (propTransactionFilter === 'Temporada' && p.transactionType === 'Temporada') ||
      (propTransactionFilter === 'Leilão' && p.transactionType === 'Leilão') ||
      (propTransactionFilter === 'Imóvel Novo' && (p.subType?.includes('Novo') || p.isNew));

    const matchesType = propTypeFilter === 'all' || p.type?.toLowerCase() === propTypeFilter.toLowerCase();
    
    const matchesStatus = propStatusFilter === 'all' || (p.status || 'Ativo').toLowerCase() === propStatusFilter.toLowerCase();

    return matchesSearch && matchesTransaction && matchesType && matchesStatus;
  });

  // Filtered Users
  const filteredUsers = users.filter(u => {
    if (!userSearch) return true;
    return u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
           u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
           u.role?.toLowerCase().includes(userSearch.toLowerCase()) ||
           u.creci?.toLowerCase().includes(userSearch.toLowerCase());
  });

  // =========================================================================
  // HANDLERS: GESTÃO EM MASSA DE IMÓVEIS (BATCH ACTIONS)
  // =========================================================================
  const handleToggleSelectAllProps = () => {
    if (selectedPropIds.length === filteredProperties.length) {
      setSelectedPropIds([]);
    } else {
      setSelectedPropIds(filteredProperties.map(p => p.id));
    }
  };

  const handleToggleSelectProp = (id) => {
    setSelectedPropIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBatchDeleteProps = () => {
    if (selectedPropIds.length === 0) return;
    if (window.confirm(`Tem certeza que deseja excluir em massa ${selectedPropIds.length} imóvel(is) selecionado(s)?`)) {
      selectedPropIds.forEach(id => {
        onDeleteProperty?.(id);
      });
      setSelectedPropIds([]);
      alert('Imóveis excluídos com sucesso!');
    }
  };

  const handleBatchChangeStatus = (newStatus) => {
    if (selectedPropIds.length === 0 || !newStatus) return;
    selectedPropIds.forEach(id => {
      const found = properties.find(p => p.id === id);
      if (found) {
        onUpdateProperty?.({ ...found, status: newStatus });
      }
    });
    setSelectedPropIds([]);
    alert(`Status de ${selectedPropIds.length} imóvel(is) atualizado para "${newStatus}"!`);
  };

  // Property Single Edit Save
  const handleSavePropertyEdit = (e) => {
    e.preventDefault();
    if (!editingProperty) return;
    onUpdateProperty?.(editingProperty);
    setEditingProperty(null);
    alert(`Imóvel "${editingProperty.title}" atualizado com sucesso!`);
  };

  // =========================================================================
  // HANDLERS: MODALIDADES DE TRANSAÇÃO (CRUD)
  // =========================================================================
  const handleSaveNewModality = (e) => {
    e.preventDefault();
    if (!newModalityData.name) return;
    const newMod = {
      id: `mod-${Date.now()}`,
      name: newModalityData.name,
      badge: newModalityData.badge || 'Modalidade Ativa',
      desc: newModalityData.desc || 'Nova modalidade de negociação do portal',
      active: newModalityData.active,
      count: 0
    };
    setModalities(prev => [...prev, newMod]);
    setShowAddModalityModal(false);
    setNewModalityData({ name: '', badge: '', desc: '', active: true });
    alert(`Modalidade "${newMod.name}" adicionada com sucesso!`);
  };

  const handleSaveEditModality = (e) => {
    e.preventDefault();
    if (!editingModality) return;
    setModalities(prev => prev.map(m => m.id === editingModality.id ? editingModality : m));
    setEditingModality(null);
    alert(`Modalidade "${editingModality.name}" atualizada!`);
  };

  const handleDeleteModality = (modId) => {
    const mod = modalities.find(m => m.id === modId);
    if (window.confirm(`Tem certeza que deseja excluir a modalidade "${mod?.name}"?`)) {
      setModalities(prev => prev.filter(m => m.id !== modId));
      alert('Modalidade excluída.');
    }
  };

  // =========================================================================
  // HANDLERS: PICKLIST HIERÁRQUICO: CATEGORIAS & SUBCATEGORIAS (CRUD)
  // =========================================================================
  const handleToggleCategory = (catId) => {
    setCategoryHierarchy(prev => prev.map(cat => {
      if (cat.id === catId) {
        const nextState = !cat.checked;
        return {
          ...cat,
          checked: nextState,
          subcategories: cat.subcategories.map(sub => ({ ...sub, checked: nextState }))
        };
      }
      return cat;
    }));
  };

  const handleToggleSubcategory = (catId, subId) => {
    setCategoryHierarchy(prev => prev.map(cat => {
      if (cat.id === catId) {
        const updatedSubs = cat.subcategories.map(sub => sub.id === subId ? { ...sub, checked: !sub.checked } : sub);
        const allChecked = updatedSubs.every(s => s.checked);
        return {
          ...cat,
          checked: allChecked,
          subcategories: updatedSubs
        };
      }
      return cat;
    }));
  };

  const handleToggleExpandCategory = (catId) => {
    setCategoryHierarchy(prev => prev.map(cat => cat.id === catId ? { ...cat, expanded: !cat.expanded } : cat));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatData.name) return;
    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCatData.name,
      icon: newCatData.icon || '🏢',
      checked: true,
      expanded: true,
      subcategories: [
        { id: `sub-${Date.now()}-1`, name: 'Padrão', checked: true }
      ]
    };
    setCategoryHierarchy(prev => [...prev, newCat]);
    setShowAddCategoryModal(false);
    setNewCatData({ name: '', icon: '🏢' });
    alert(`Categoria "${newCat.name}" criada com sucesso!`);
  };

  const handleSaveEditCategory = (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    setCategoryHierarchy(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: editingCategory.name, icon: editingCategory.icon } : c));
    setEditingCategory(null);
    alert('Categoria atualizada!');
  };

  const handleDeleteCategory = (catId) => {
    const cat = categoryHierarchy.find(c => c.id === catId);
    if (window.confirm(`Excluir a categoria "${cat?.name}" e todas as suas subcategorias?`)) {
      setCategoryHierarchy(prev => prev.filter(c => c.id !== catId));
    }
  };

  const handleAddSubcategory = (catId) => {
    if (!newSubcatName.trim()) return;
    const newSub = {
      id: `sub-${Date.now()}`,
      name: newSubcatName.trim(),
      checked: true
    };
    setCategoryHierarchy(prev => prev.map(c => {
      if (c.id === catId) {
        return { ...c, subcategories: [...c.subcategories, newSub] };
      }
      return c;
    }));
    setAddingSubcategoryToCatId(null);
    setNewSubcatName('');
  };

  const handleSaveEditSubcategory = (e) => {
    e.preventDefault();
    if (!editingSubcategory) return;
    setCategoryHierarchy(prev => prev.map(c => {
      if (c.id === editingSubcategory.catId) {
        return {
          ...c,
          subcategories: c.subcategories.map(s => s.id === editingSubcategory.subId ? { ...s, name: editingSubcategory.name } : s)
        };
      }
      return c;
    }));
    setEditingSubcategory(null);
  };

  const handleDeleteSubcategory = (catId, subId) => {
    if (window.confirm('Excluir esta subcategoria?')) {
      setCategoryHierarchy(prev => prev.map(c => {
        if (c.id === catId) {
          return {
            ...c,
            subcategories: c.subcategories.filter(s => s.id !== subId)
          };
        }
        return c;
      }));
    }
  };

  // =========================================================================
  // HANDLERS: USUÁRIOS & CORRETORES (CRUD)
  // =========================================================================
  const handleSaveNewUser = (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;
    const newUser = {
      id: `user-${Date.now()}`,
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      status: newUserData.status,
      phone: newUserData.phone || '(11) 98888-0000',
      creci: newUserData.role === 'broker' ? (newUserData.creci || '00000-F') : null
    };
    onAddUser?.(newUser);
    setShowAddUserModal(false);
    setNewUserData({ name: '', email: '', role: 'broker', status: 'active', phone: '', creci: '' });
    alert(`Usuário "${newUser.name}" cadastrado com sucesso!`);
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUserRole?.(editingUser.id, editingUser.role);
    setEditingUser(null);
    alert('Dados do usuário atualizados!');
  };

  const handleSaveTheme = (e) => {
    e.preventDefault();
    document.documentElement.style.setProperty('--color-primary', siteTheme.colorPrimary);
    document.documentElement.style.setProperty('--color-primary-light', siteTheme.colorPrimaryLight);
    document.documentElement.style.setProperty('--color-accent', siteTheme.colorAccent);
    document.documentElement.style.setProperty('--color-quinto', siteTheme.colorQuinto);
    alert('Identidade visual e tema atualizados em todo o portal!');
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1300 }} onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '1600px', 
          width: '97vw', 
          height: '94vh', 
          padding: 0, 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-card)'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--color-primary)',
          color: '#ffffff',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} color="#38bdf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Painel Administrativo Master</h2>
                <span className="badge" style={{ backgroundColor: '#10b981', color: '#ffffff', fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                  Super Admin
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                Gestão central de imóveis, modalidades, categorias/picklists, SEO e usuários {currentUser?.name ? `• ${currentUser.name}` : ''}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={onClose} 
              style={{ border: 'none', background: 'rgba(255,255,255,0.2)', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ffffff' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.55rem 1.5rem',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3, badge: null },
            { id: 'properties', label: 'Gestão de Imóveis', icon: Building2, badge: totalProperties },
            { id: 'categories', label: 'Categorias & Modalidades', icon: Tag, badge: 'Picklist' },
            { id: 'seo', label: 'SEO Google & Bing', icon: Globe, badge: 'Rich Snippet' },
            { id: 'online-users', label: 'Usuários Online', icon: Radio, badge: `${totalOnlineCount} live` },
            { id: 'contracts', label: 'Contratos Digitais', icon: FileCheck, badge: 'ICP-Brasil' },
            { id: 'xml-sync', label: 'Carga & Feeds XML', icon: Database, badge: 'CRMs' },
            { id: 'inspections', label: 'Vistorias Digitais', icon: ClipboardCheck, badge: 'Laudos' },
            { id: 'appearance', label: 'Identidade Visual & Tema', icon: Palette, badge: null },
            { id: 'users', label: 'Usuários & Corretores', icon: Users, badge: users.length },
            { id: 'financial', label: 'Financeiro & Planos', icon: CreditCard, badge: `R$ ${totalRevenue.toFixed(0)}` },
            { id: 'backup', label: 'Backup & Exportação', icon: Database, badge: 'JSON / CSV' }
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
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? 'var(--color-primary-light)' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid var(--color-primary-light)' : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '999px',
                    backgroundColor: isActive ? 'var(--color-primary-light)' : 'var(--border-color)',
                    color: isActive ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 800
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', backgroundColor: 'var(--bg-main)' }}>
          
          {/* ========================================================================= */}
          {/* 1. TAB: VISÃO GERAL & ANALYTICS COM LINKS CLICÁVEIS NAS 6 MODALIDADES     */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CATÁLOGO TOTAL</span>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalProperties}</div>
                  <span style={{ fontSize: '0.72rem', color: '#10b981' }}>● 6 Modalidades ativas</span>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>USUÁRIOS ONLINE AGORA</span>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                    {totalOnlineCount}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>6 Perfis conectados</span>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PROPOSTAS FORMAIS</span>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#8b5cf6' }}>{proposals.length}</div>
                  <span style={{ fontSize: '0.72rem', color: '#8b5cf6' }}>High Line Batel em análise</span>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>VISITAS AGENDADAS</span>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f59e0b' }}>{schedules.length}</div>
                  <span style={{ fontSize: '0.72rem', color: '#f59e0b' }}>Visitas presenciais/tours</span>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RECEITA DE PLANOS</span>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0284c7' }}>R$ {totalRevenue.toFixed(2)}</div>
                  <span style={{ fontSize: '0.72rem', color: '#10b981' }}>Plano Ultra SEO ativo</span>
                </div>
              </div>

              {/* 6 Modalidades Cards Bar (COM LINKS PARA VER OS IMÓVEIS) */}
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Modalidades de Transação Ativas no Portal (6 Modalidades)</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Clique em qualquer card para abrir a Gestão de Imóveis filtrada por aquela modalidade
                    </span>
                  </div>
                  <span className="badge badge-quinto">💡 Links Clicáveis Ativos</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
                  {modalities.map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => {
                        setActiveTab('properties');
                        setPropTransactionFilter(m.name);
                      }}
                      style={{ 
                        padding: '1rem', 
                        backgroundColor: 'var(--bg-main)', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                      className="hover-card"
                      title={`Clique para ver os ${m.count} imóveis de ${m.name}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-main)' }}>{m.name}</strong>
                        <ExternalLink size={13} color="var(--color-primary-light)" />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.badge}</span>
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary-light)' }}>
                          {m.count} imóveis
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981' }}>Ver lista ➔</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Real SVG Line Chart & Conversion Funnel */}
              <AdminAnalyticsCharts properties={properties} totalRevenue={totalRevenue} />
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. TAB: GESTÃO DE IMÓVEIS (CRUD COMPLETO + STATUS + AÇÕES EM MASSA)        */}
          {/* ========================================================================= */}
          {activeTab === 'properties' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header & Filter Bar */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Gestão Completa de Imóveis</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Mostrando <strong>{filteredProperties.length}</strong> de {properties.length} imóveis cadastrados
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onOpenMassCsv && onOpenMassCsv()}
                      style={{ fontWeight: 800, gap: '0.4rem', borderColor: '#10b981', color: '#10b981' }}
                    >
                      <FileSpreadsheet size={16} />
                      <span>Carga Massiva CSV</span>
                    </button>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onOpenPostProperty && onOpenPostProperty()}
                      style={{ fontWeight: 800, gap: '0.4rem' }}
                    >
                      <PlusCircle size={16} />
                      <span>Cadastrar Novo Imóvel</span>
                    </button>
                  </div>
                </div>

                {/* Filters Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Buscar por título, bairro, cidade..."
                      value={propSearch}
                      onChange={(e) => setPropSearch(e.target.value)}
                      style={{ width: '100%', paddingLeft: '2rem', fontSize: '0.82rem', padding: '0.5rem 0.5rem 0.5rem 2rem' }}
                    />
                  </div>

                  <select
                    value={propTransactionFilter}
                    onChange={(e) => setPropTransactionFilter(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '0.5rem' }}
                  >
                    <option value="all">Todas as Modalidades</option>
                    {modalities.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>

                  <select
                    value={propTypeFilter}
                    onChange={(e) => setPropTypeFilter(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '0.5rem' }}
                  >
                    <option value="all">Todos os Tipos</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Rural">Rural</option>
                  </select>

                  <select
                    value={propStatusFilter}
                    onChange={(e) => setPropStatusFilter(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '0.5rem' }}
                  >
                    <option value="all">Todos os Status</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Em Análise">Em Análise</option>
                    <option value="Pausado">Pausado</option>
                    <option value="Vendido">Vendido</option>
                    <option value="Alugado">Alugado</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              {/* BATCH ACTIONS BAR (Ações em Massa quando houver seleção) */}
              {selectedPropIds.length > 0 && (
                <div style={{
                  backgroundColor: 'rgba(30, 58, 138, 0.95)',
                  color: '#ffffff',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  boxShadow: 'var(--shadow-lg)',
                  animation: 'slideUp 0.2s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="badge" style={{ backgroundColor: '#ffffff', color: '#1e3a8a', fontWeight: 800 }}>
                      {selectedPropIds.length} selecionado(s)
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Ações em Massa Disponíveis:</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleBatchChangeStatus(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      style={{ fontSize: '0.78rem', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#ffffff', color: '#1e3a8a', fontWeight: 700 }}
                    >
                      <option value="">Trocar Status em Massa...</option>
                      <option value="Ativo">Marcar como: Ativo</option>
                      <option value="Pausado">Marcar como: Pausado</option>
                      <option value="Vendido">Marcar como: Vendido</option>
                      <option value="Alugado">Marcar como: Alugado</option>
                      <option value="Inativo">Marcar como: Inativo</option>
                    </select>

                    <button
                      className="btn btn-sm"
                      onClick={handleBatchDeleteProps}
                      style={{ backgroundColor: '#ef4444', color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', gap: '0.35rem' }}
                    >
                      <Trash2 size={14} />
                      <span>Excluir em Massa</span>
                    </button>

                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedPropIds([])}
                      style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}
                    >
                      Desmarcar
                    </button>
                  </div>
                </div>
              )}

              {/* Tabela de Imóveis com Seleção e Edição */}
              <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                        <th style={{ padding: '0.85rem 1rem', width: '40px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={filteredProperties.length > 0 && selectedPropIds.length === filteredProperties.length}
                            onChange={handleToggleSelectAllProps}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                            title="Selecionar Todos"
                          />
                        </th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Imóvel</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Tipo &amp; Modalidade</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Preço / Valor</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', textAlign: 'center' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProperties.map(prop => {
                        const isSelected = selectedPropIds.includes(prop.id);
                        const currentStatus = prop.status || 'Ativo';
                        return (
                          <tr 
                            key={prop.id} 
                            style={{ 
                              borderBottom: '1px solid var(--border-color)',
                              backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                            }}
                          >
                            <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectProp(prop.id)}
                                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                              />
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <strong style={{ fontSize: '0.88rem', display: 'block' }}>{prop.title}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prop.neighborhood}, {prop.city}</span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>
                              <span style={{ fontWeight: 700 }}>{prop.type}</span>
                              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-primary-light)' }}>
                                {prop.subType || prop.transactionType}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                              {prop.transactionType === 'Aluguel' ? `R$ ${(prop.rentPrice || prop.price || 0).toLocaleString('pt-BR')}/mês` : `R$ ${(prop.price || 0).toLocaleString('pt-BR')}`}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <select
                                value={currentStatus}
                                onChange={(e) => onUpdateProperty && onUpdateProperty({ ...prop, status: e.target.value })}
                                style={{
                                  padding: '0.3rem 0.55rem',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  backgroundColor: currentStatus === 'Ativo' ? 'rgba(5, 150, 105, 0.15)' : currentStatus === 'Pausado' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                  color: currentStatus === 'Ativo' ? '#059669' : currentStatus === 'Pausado' ? '#d97706' : '#ef4444',
                                  border: '1px solid var(--border-color)',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="Ativo">Ativo</option>
                                <option value="Em Análise">Em Análise</option>
                                <option value="Pausado">Pausado</option>
                                <option value="Vendido">Vendido</option>
                                <option value="Alugado">Alugado</option>
                                <option value="Inativo">Inativo</option>
                              </select>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={() => setEditingProperty(prop)}
                                  title="Editar Imóvel (Nome, Tipo, Preço, etc.)"
                                  style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                                >
                                  <Pencil size={13} />
                                  <span>Editar</span>
                                </button>

                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => {
                                    if (window.confirm(`Tem certeza que deseja excluir o imóvel "${prop.title}"?`)) {
                                      onDeleteProperty?.(prop.id);
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. TAB: CATEGORIAS & MODALIDADES (CRUD COMPLETO COM ÍCONES)              */}
          {/* ========================================================================= */}
          {activeTab === 'categories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* MODALIDADES DE TRANSAÇÃO (COM ADICIONAR, EDITAR, EXCLUIR) */}
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Zap size={18} color="#f59e0b" />
                      <span>Modalidades de Transação (Abas de Busca do Portal)</span>
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Adicione, edite título, subtítulo e descrição ou exclua modalidades de negociação do portal
                    </span>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowAddModalityModal(true)}
                    style={{ fontWeight: 700, gap: '0.35rem' }}
                  >
                    <PlusCircle size={15} />
                    <span>Adicionar Modalidade</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                  {modalities.map(mod => (
                    <div
                      key={mod.id}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: mod.active ? '1.5px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-main)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{mod.name}</strong>
                          <span className={`badge ${mod.active ? 'badge-quinto' : 'badge-olx'}`}>
                            {mod.active ? '✓ Ativa' : 'Pausada'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary-light)', display: 'block' }}>
                          {mod.badge}
                        </span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                          {mod.desc || 'Sem descrição cadastrada.'}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setEditingModality(mod)}
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          <Pencil size={12} />
                          <span>Editar</span>
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDeleteModality(mod.id)}
                          style={{ color: '#ef4444', padding: '0.3rem 0.5rem' }}
                          title="Excluir Modalidade"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PICKLIST HIERÁRQUICO DE CATEGORIAS E SUBCATEGORIAS COM ÍCONES */}
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Tag size={18} color="var(--color-primary-light)" />
                      <span>Picklist Hierárquico: Categorias &amp; Subcategorias de Imóveis</span>
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Adicione novas categorias pai com ícones, crie subcategorias filhas e edite nomes e visibilidade
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setShowAddCategoryModal(true)}
                      style={{ fontWeight: 700, gap: '0.35rem' }}
                    >
                      <PlusCircle size={15} />
                      <span>Nova Categoria Principal</span>
                    </button>
                  </div>
                </div>

                {/* Tree Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                  {categoryHierarchy.map((cat) => (
                    <div
                      key={cat.id}
                      style={{
                        backgroundColor: 'var(--bg-main)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        {/* Parent Category Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleCategory(cat.id)}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: cat.checked ? 'var(--color-primary-light)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}
                            >
                              {cat.checked ? <CheckSquare size={18} /> : <Square size={18} />}
                            </button>
                            <span style={{ fontSize: '1.2rem' }}>{cat.icon || '🏢'}</span>
                            <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{cat.name}</strong>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <button
                              type="button"
                              onClick={() => setEditingCategory(cat)}
                              title="Editar Nome / Ícone"
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem' }}
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              title="Excluir Categoria Principal"
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.2rem' }}
                            >
                              <Trash2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleExpandCategory(cat.id)}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem' }}
                            >
                              {cat.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </div>
                        </div>

                        {/* Subcategories List */}
                        {cat.expanded && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.75rem', paddingLeft: '0.5rem' }}>
                            {cat.subcategories.map((sub) => (
                              <div
                                key={sub.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--bg-card)'
                                }}
                              >
                                <label
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    color: sub.checked ? 'var(--text-main)' : 'var(--text-muted)',
                                    fontWeight: sub.checked ? 600 : 400
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={sub.checked}
                                    onChange={() => handleToggleSubcategory(cat.id, sub.id)}
                                    style={{ accentColor: 'var(--color-primary-light)', cursor: 'pointer' }}
                                  />
                                  <span>{sub.name}</span>
                                </label>

                                <div style={{ display: 'flex', gap: '0.2rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => setEditingSubcategory({ catId: cat.id, subId: sub.id, name: sub.name })}
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.15rem' }}
                                    title="Editar Subcategoria"
                                  >
                                    <Pencil size={11} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.15rem' }}
                                    title="Excluir Subcategoria"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Add Subcategory Inline Input */}
                            {addingSubcategoryToCatId === cat.id ? (
                              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem' }}>
                                <input
                                  type="text"
                                  placeholder="Nome da subcategoria..."
                                  value={newSubcatName}
                                  onChange={(e) => setNewSubcatName(e.target.value)}
                                  style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.78rem' }}
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleAddSubcategory(cat.id)}
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                >
                                  Salvar
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  onClick={() => setAddingSubcategoryToCatId(null)}
                                  style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setAddingSubcategoryToCatId(cat.id);
                                  setNewSubcatName('');
                                }}
                                style={{
                                  marginTop: '0.35rem',
                                  padding: '0.35rem',
                                  border: '1px dashed var(--border-color)',
                                  backgroundColor: 'transparent',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.75rem',
                                  color: 'var(--color-primary-light)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.3rem',
                                  fontWeight: 700
                                }}
                              >
                                <PlusCircle size={13} />
                                <span>+ Adicionar Subcategoria</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. TAB: USUÁRIOS & CORRETORES (CRUD COMPLETO COM EDIT/STATUS/ROLE)         */}
          {/* ========================================================================= */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                backgroundColor: 'var(--bg-card)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Gestão de Contas de Usuários &amp; Corretores</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Cadastre, edite papéis, altere e-mail, telefone, CRECI e bloqueie/ative contas
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Filtrar por nome, e-mail, creci..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      style={{ paddingLeft: '2rem', fontSize: '0.82rem', padding: '0.45rem 0.6rem 0.45rem 2rem' }}
                    />
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowAddUserModal(true)}
                    style={{ fontWeight: 800, gap: '0.35rem' }}
                  >
                    <PlusCircle size={15} />
                    <span>Novo Usuário</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Usuários */}
              <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Nome &amp; Contato</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Papel / Função</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>CRECI</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', textAlign: 'center' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <strong style={{ fontSize: '0.9rem' }}>{u.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                              {u.email} {u.phone ? `• ${u.phone}` : ''}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <select
                              value={u.role}
                              onChange={(e) => onUpdateUserRole && onUpdateUserRole(u.id, e.target.value)}
                              style={{
                                padding: '0.3rem 0.55rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-main)'
                              }}
                            >
                              <option value="admin">🔒 Administrador</option>
                              <option value="broker">📜 Corretor</option>
                              <option value="agency">🏢 Imobiliária</option>
                              <option value="owner">🏡 Proprietário</option>
                              <option value="buyer">🔍 Comprador</option>
                              <option value="support">🎧 Suporte</option>
                            </select>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>
                            {u.creci ? <span className="badge badge-quinto">{u.creci}</span> : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <button
                              onClick={() => onToggleUserStatus && onToggleUserStatus(u.id)}
                              style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                padding: 0
                              }}
                              title={u.status === 'active' ? 'Clique para Congelar / Bloquear conta' : 'Clique para Descongelar / Reativar conta'}
                            >
                              <span className={`badge ${u.status === 'active' ? 'badge-quinto' : 'badge-viva'}`} style={{ padding: '0.35rem 0.65rem', cursor: 'pointer' }}>
                                {u.status === 'active' ? '✓ Ativo (Congelar)' : '❄️ Congelado (Ativar)'}
                              </span>
                            </button>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setEditingUser(u)}
                                style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                                title="Editar Dados do Usuário"
                              >
                                <Pencil size={13} />
                                <span>Editar</span>
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => {
                                  if (window.confirm(`Excluir conta de "${u.name}"?`)) {
                                    onDeleteUser?.(u.id);
                                  }
                                }}
                                style={{ color: '#ef4444', padding: '0.35rem' }}
                                title="Excluir Usuário"
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
            </div>
          )}

          {/* TAB: SEO */}
          {activeTab === 'seo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={20} color="#059669" />
                  <span>Motor de Indexação SEO Automático (Google &amp; Bing Rich Snippets)</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Geração automática de Schema.org JSON-LD, sitemaps dinâmicos e metatags OpenGraph.
                </p>
              </div>
            </div>
          )}

          {/* TAB: ONLINE USERS */}
          {activeTab === 'online-users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Monitor de Usuários Conectados ({totalOnlineCount} live)</h3>
              </div>
            </div>
          )}

          {/* TAB: CONTRATOS DIGITAIS */}
          {activeTab === 'contracts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Contratos Digitais Emitidos com Hash ICP-Brasil</h3>
              </div>
            </div>
          )}

          {/* TAB: XML SYNC */}
          {activeTab === 'xml-sync' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Sincronização de Feeds XML de CRMs</h3>
              </div>
            </div>
          )}

          {/* TAB: VISTORIAS */}
          {activeTab === 'inspections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Laudos de Vistoria de Entrada e Saída</h3>
              </div>
            </div>
          )}

          {/* TAB: IDENTIDADE VISUAL */}
          {activeTab === 'appearance' && (
            <form onSubmit={handleSaveTheme} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Palette size={18} color="var(--color-primary-light)" />
                  <span>Customização de Cores e Marca</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Cor Primária</label>
                    <input type="color" value={siteTheme.colorPrimary} onChange={(e) => setSiteTheme({ ...siteTheme, colorPrimary: e.target.value })} style={{ width: '42px', height: '38px', cursor: 'pointer', padding: 0 }} />
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                    <Save size={16} />
                    <span>Salvar &amp; Aplicar Tema</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB: FINANCEIRO */}
          {activeTab === 'financial' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Faturamento e Planos Contratados</h3>
                {onOpenCheckout && (
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={() => onOpenCheckout()}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                  >
                    <CreditCard size={15} />
                    <span>Contratar Plano de Destaque</span>
                  </button>
                )}
              </div>
              <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Imóvel / Plano</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Valor</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Forma</th>
                        <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.85rem 1rem' }}><strong>{t.propTitle}</strong></td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#059669' }}>R$ {t.amount.toFixed(2)}</td>
                          <td style={{ padding: '0.85rem 1rem' }}>{t.method}</td>
                          <td style={{ padding: '0.85rem 1rem' }}><span className="badge badge-quinto">{t.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 12. TAB: BACKUP, EXPORTAÇÃO & RESTAURAÇÃO (JSON / CSV)                     */}
          {/* ========================================================================= */}
          {activeTab === 'backup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <Database size={22} color="var(--color-primary-light)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Central de Backup &amp; Exportação de Dados</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Exporte o banco de dados completo do portal para segurança, gere planilhas em Excel/CSV para análise comercial ou restaure backups anteriores com 1 clique.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {/* Card 1: Exportar JSON Completo */}
                  <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>📦</span>
                        <strong style={{ fontSize: '0.95rem' }}>Backup Completo (JSON)</strong>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Exporta todos os {totalProperties} imóveis, {users.length} usuários cadastrados, categorias, modalidades e preferências em um único arquivo `.json`.
                      </p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const backupData = {
                          version: '1.0',
                          exportDate: new Date().toISOString(),
                          properties: propertiesList,
                          users: users,
                          modalities: customModalities,
                          categories: categories
                        };
                        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `imovelhub-backup-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      style={{ width: '100%', justifyContent: 'center', fontWeight: 800, gap: '0.4rem' }}
                    >
                      <Download size={16} />
                      <span>Baixar Backup Completo (.json)</span>
                    </button>
                  </div>

                  {/* Card 2: Exportar Planilha CSV / Excel */}
                  <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>📊</span>
                        <strong style={{ fontSize: '0.95rem' }}>Catálogo para Excel (.csv)</strong>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Exporta a tabela de imóveis com colunas estruturadas (ID, Título, Tipo, Preço, Área, Bairro, Cidade, Status) pronta para abrir no Microsoft Excel ou Google Sheets.
                      </p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const headers = ['ID', 'Titulo', 'Tipo', 'Modalidade', 'Preco', 'Aluguel', 'Area', 'Quartos', 'Banheiros', 'Vagas', 'Bairro', 'Cidade', 'Status'];
                        const rows = propertiesList.map(p => [
                          p.id,
                          `"${(p.title || '').replace(/"/g, '""')}"`,
                          p.type || '',
                          p.transactionType || '',
                          p.price || '',
                          p.rentPrice || '',
                          p.area || '',
                          p.bedrooms || '',
                          p.bathrooms || '',
                          p.parkingSpots || '',
                          `"${(p.neighborhood || '').replace(/"/g, '""')}"`,
                          `"${(p.city || '').replace(/"/g, '""')}"`,
                          p.status || 'Ativo'
                        ]);
                        const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `imovelhub-imoveis-${new Date().toISOString().split('T')[0]}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      style={{ width: '100%', justifyContent: 'center', fontWeight: 800, gap: '0.4rem', backgroundColor: '#059669' }}
                    >
                      <Download size={16} />
                      <span>Exportar Planilha (.csv)</span>
                    </button>
                  </div>

                  {/* Card 3: Restaurar Backup */}
                  <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>🔄</span>
                        <strong style={{ fontSize: '0.95rem' }}>Restaurar Backup (JSON)</strong>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Selecione um arquivo de backup `.json` gerado anteriormente para restaurar o catálogo de imóveis e usuários.
                      </p>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".json"
                        id="backup-file-input"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const parsed = JSON.parse(event.target?.result);
                              if (parsed && (parsed.properties || Array.isArray(parsed))) {
                                const newProps = parsed.properties || parsed;
                                setPropertiesList(newProps);
                                alert(`Backup restaurado com sucesso! ${newProps.length} imóveis carregados.`);
                              } else {
                                alert("Arquivo de backup inválido.");
                              }
                            } catch (err) {
                              alert("Erro ao ler o arquivo JSON.");
                            }
                          };
                          reader.readAsText(file);
                        }}
                      />
                      <button
                        className="btn btn-outline"
                        onClick={() => document.getElementById('backup-file-input')?.click()}
                        style={{ width: '100%', justifyContent: 'center', fontWeight: 800, gap: '0.4rem' }}
                      >
                        <RefreshCw size={16} />
                        <span>Carregar Arquivo JSON...</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-MODAL 1: EDITAR IMÓVEL COMPLETO                                       */}
      {/* ========================================================================= */}
      {editingProperty && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1400, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Editar Imóvel (ID: {editingProperty.id})</h3>
              <button onClick={() => setEditingProperty(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSavePropertyEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Título do Anúncio</label>
                <input type="text" required value={editingProperty.title || ''} onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })} style={{ width: '100%', padding: '0.55rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Tipo de Imóvel</label>
                  <select value={editingProperty.type || 'Apartamento'} onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value })} style={{ width: '100%', padding: '0.55rem' }}>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Subtipo / Categoria</label>
                  <input type="text" value={editingProperty.subType || ''} onChange={(e) => setEditingProperty({ ...editingProperty, subType: e.target.value })} placeholder="Ex: Padrão, Cobertura, Duplex" style={{ width: '100%', padding: '0.55rem' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Modalidade</label>
                  <select value={editingProperty.transactionType || 'Venda'} onChange={(e) => setEditingProperty({ ...editingProperty, transactionType: e.target.value })} style={{ width: '100%', padding: '0.55rem' }}>
                    <option value="Venda">Venda</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Lançamentos">Lançamentos</option>
                    <option value="Temporada">Temporada</option>
                    <option value="Leilão">Leilão</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                    {editingProperty.transactionType === 'Aluguel' ? 'Valor Aluguel (R$)' : 'Valor de Venda (R$)'}
                  </label>
                  <input
                    type="number"
                    value={editingProperty.transactionType === 'Aluguel' ? (editingProperty.rentPrice || '') : (editingProperty.price || '')}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingProperty.transactionType === 'Aluguel') {
                        setEditingProperty({ ...editingProperty, rentPrice: val });
                      } else {
                        setEditingProperty({ ...editingProperty, price: val });
                      }
                    }}
                    style={{ width: '100%', padding: '0.55rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Status do Anúncio</label>
                  <select value={editingProperty.status || 'Ativo'} onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value })} style={{ width: '100%', padding: '0.55rem' }}>
                    <option value="Ativo">Ativo</option>
                    <option value="Em Análise">Em Análise</option>
                    <option value="Pausado">Pausado</option>
                    <option value="Vendido">Vendido</option>
                    <option value="Alugado">Alugado</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Área (m²)</label>
                  <input type="number" value={editingProperty.area || ''} onChange={(e) => setEditingProperty({ ...editingProperty, area: Number(e.target.value) })} style={{ width: '100%', padding: '0.55rem' }} />
                </div>

                {editingProperty.type !== 'Terreno' && editingProperty.type !== 'Comercial' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Quartos</label>
                    <input type="number" value={editingProperty.bedrooms || ''} onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: Number(e.target.value) })} style={{ width: '100%', padding: '0.55rem' }} />
                  </div>
                )}

                {editingProperty.type !== 'Terreno' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Banheiros</label>
                    <input type="number" value={editingProperty.bathrooms || ''} onChange={(e) => setEditingProperty({ ...editingProperty, bathrooms: Number(e.target.value) })} style={{ width: '100%', padding: '0.55rem' }} />
                  </div>
                )}

                {editingProperty.type !== 'Terreno' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Vagas de Garagem</label>
                    <input type="number" value={editingProperty.parkingSpots || ''} onChange={(e) => setEditingProperty({ ...editingProperty, parkingSpots: Number(e.target.value) })} style={{ width: '100%', padding: '0.55rem' }} />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Bairro</label>
                  <input type="text" value={editingProperty.neighborhood || ''} onChange={(e) => setEditingProperty({ ...editingProperty, neighborhood: e.target.value })} style={{ width: '100%', padding: '0.55rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Cidade</label>
                  <input type="text" value={editingProperty.city || ''} onChange={(e) => setEditingProperty({ ...editingProperty, city: e.target.value })} style={{ width: '100%', padding: '0.55rem' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Link do Vídeo do YouTube (Tour Virtual)</label>
                <input 
                  type="url" 
                  value={editingProperty.youtubeUrl || ''} 
                  onChange={(e) => setEditingProperty({ ...editingProperty, youtubeUrl: e.target.value })} 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  style={{ width: '100%', padding: '0.55rem' }} 
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Descrição do Imóvel</label>
                  <button
                    type="button"
                    onClick={() => {
                      const t = editingProperty.type || 'Imóvel';
                      const sub = editingProperty.subType ? `(${editingProperty.subType})` : '';
                      const trans = editingProperty.transactionType === 'Aluguel' ? 'locação' : 'venda';
                      const neighborhood = editingProperty.neighborhood || 'bairro privilegiado';
                      const city = editingProperty.city || 'São Paulo';
                      const area = editingProperty.area ? `${editingProperty.area}m² de área privativa` : 'excelente metragem';
                      const bedrooms = Number(editingProperty.bedrooms) > 0 ? `${editingProperty.bedrooms} dormitório(s)` : '';
                      const suites = Number(editingProperty.suites) > 0 ? `sendo ${editingProperty.suites} suíte(s)` : '';
                      const parking = Number(editingProperty.parkingSpots) > 0 ? `${editingProperty.parkingSpots} vaga(s)` : '';
                      const price = editingProperty.transactionType === 'Aluguel' ? `R$ ${Number(editingProperty.rentPrice || 0).toLocaleString('pt-BR')}/mês` : `R$ ${Number(editingProperty.price || 0).toLocaleString('pt-BR')}`;

                      const generated = `🌟 Destaque ImóvelHUB para ${trans.toUpperCase()}: ${t} ${sub} em ${neighborhood}, ${city}!\n\n` +
                        `Imóvel de alto padrão com ${area}${bedrooms ? `, ${bedrooms}` : ''}${suites ? `, ${suites}` : ''}${parking ? ` e ${parking}` : ''}.\n\n` +
                        `✨ Destaques:\n` +
                        `• Acabamento de primeira linha e excelente distribuição de espaços;\n` +
                        `• Localização nobre em ${neighborhood};\n` +
                        `• Valor cotado a ${price}.\n\n` +
                        `📅 Agende sua visita online pelo ImóvelHUB!`;

                      setEditingProperty(prev => ({ ...prev, description: generated }));
                    }}
                    style={{
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      color: '#0284c7',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '4px',
                      padding: '0.15rem 0.45rem',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ✨ Gerar Descrição com IA
                  </button>
                </div>
                <textarea rows={4} value={editingProperty.description || ''} onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })} style={{ width: '100%', padding: '0.55rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditingProperty(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 800 }}>Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODAL 2: ADICIONAR / EDITAR MODALIDADE DE TRANSAÇÃO                    */}
      {/* ========================================================================= */}
      {(showAddModalityModal || editingModality) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1400, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', maxWidth: '500px', width: '100%', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{editingModality ? 'Editar Modalidade' : 'Nova Modalidade de Transação'}</h3>
              <button onClick={() => { setShowAddModalityModal(false); setEditingModality(null); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>

            <form onSubmit={editingModality ? handleSaveEditModality : handleSaveNewModality} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Nome da Modalidade (Aba)</label>
                <input 
                  type="text" 
                  required 
                  value={editingModality ? editingModality.name : newModalityData.name} 
                  onChange={(e) => editingModality ? setEditingModality({ ...editingModality, name: e.target.value }) : setNewModalityData({ ...newModalityData, name: e.target.value })} 
                  placeholder="Ex: Permuta, Leilão, Temporada" 
                  style={{ width: '100%', padding: '0.55rem' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Subtítulo / Badge</label>
                <input 
                  type="text" 
                  value={editingModality ? editingModality.badge : newModalityData.badge} 
                  onChange={(e) => editingModality ? setEditingModality({ ...editingModality, badge: e.target.value }) : setNewModalityData({ ...newModalityData, badge: e.target.value })} 
                  placeholder="Ex: Troca de Imóveis, Férias" 
                  style={{ width: '100%', padding: '0.55rem' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Descrição Explicativa</label>
                <textarea 
                  rows={2} 
                  value={editingModality ? editingModality.desc : newModalityData.desc} 
                  onChange={(e) => editingModality ? setEditingModality({ ...editingModality, desc: e.target.value }) : setNewModalityData({ ...newModalityData, desc: e.target.value })} 
                  placeholder="Descrição da modalidade..." 
                  style={{ width: '100%', padding: '0.55rem' }} 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="mod-active-check" 
                  checked={editingModality ? editingModality.active : newModalityData.active} 
                  onChange={(e) => editingModality ? setEditingModality({ ...editingModality, active: e.target.checked }) : setNewModalityData({ ...newModalityData, active: e.target.checked })} 
                />
                <label htmlFor="mod-active-check" style={{ fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Exibir e Habilitar no Buscador do Portal</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => { setShowAddModalityModal(false); setEditingModality(null); }}>Cancelar</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 800 }}>Salvar Modalidade</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODAL 3: ADICIONAR / EDITAR CATEGORIA PRINCIPAL (COM ÍCONE)           */}
      {/* ========================================================================= */}
      {(showAddCategoryModal || editingCategory) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1400, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', maxWidth: '480px', width: '100%', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{editingCategory ? 'Editar Categoria Principal' : 'Nova Categoria Principal'}</h3>
              <button onClick={() => { setShowAddCategoryModal(false); setEditingCategory(null); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>

            <form onSubmit={editingCategory ? handleSaveEditCategory : handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Nome da Categoria</label>
                <input 
                  type="text" 
                  required 
                  value={editingCategory ? editingCategory.name : newCatData.name} 
                  onChange={(e) => editingCategory ? setEditingCategory({ ...editingCategory, name: e.target.value }) : setNewCatData({ ...newCatData, name: e.target.value })} 
                  placeholder="Ex: Flat, Chácara, Comercial..." 
                  style={{ width: '100%', padding: '0.55rem' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Escolha um Ícone / Emoji</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {EMOJI_ICONS.map(emoji => {
                    const isSelected = (editingCategory ? editingCategory.icon : newCatData.icon) === emoji;
                    return (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => editingCategory ? setEditingCategory({ ...editingCategory, icon: emoji }) : setNewCatData({ ...newCatData, icon: emoji })}
                        style={{
                          fontSize: '1.3rem',
                          padding: '0.4rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '2px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-main)',
                          cursor: 'pointer'
                        }}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => { setShowAddCategoryModal(false); setEditingCategory(null); }}>Cancelar</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 800 }}>Salvar Categoria</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODAL 4: EDITAR SUBCATEGORIA                                          */}
      {/* ========================================================================= */}
      {editingSubcategory && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1400, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', maxWidth: '400px', width: '100%', border: '1px solid var(--border-color)', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>Editar Subcategoria</h4>
            <form onSubmit={handleSaveEditSubcategory} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input 
                type="text" 
                required 
                value={editingSubcategory.name} 
                onChange={(e) => setEditingSubcategory({ ...editingSubcategory, name: e.target.value })} 
                style={{ width: '100%', padding: '0.55rem' }} 
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditingSubcategory(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary btn-sm">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODAL 5: ADICIONAR / EDITAR USUÁRIO                                   */}
      {/* ========================================================================= */}
      {(showAddUserModal || editingUser) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1400, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', maxWidth: '520px', width: '100%', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{editingUser ? 'Editar Usuário' : 'Novo Usuário do Portal'}</h3>
              <button onClick={() => { setShowAddUserModal(false); setEditingUser(null); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>

            <form onSubmit={editingUser ? handleSaveEditUser : handleSaveNewUser} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Nome Completo</label>
                <input 
                  type="text" 
                  required 
                  value={editingUser ? editingUser.name : newUserData.name} 
                  onChange={(e) => editingUser ? setEditingUser({ ...editingUser, name: e.target.value }) : setNewUserData({ ...newUserData, name: e.target.value })} 
                  placeholder="Ex: Carlos Eduardo" 
                  style={{ width: '100%', padding: '0.55rem' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>E-mail de Acesso</label>
                <input 
                  type="email" 
                  required 
                  value={editingUser ? editingUser.email : newUserData.email} 
                  onChange={(e) => editingUser ? setEditingUser({ ...editingUser, email: e.target.value }) : setNewUserData({ ...newUserData, email: e.target.value })} 
                  placeholder="carlos@email.com" 
                  style={{ width: '100%', padding: '0.55rem' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Papel no Portal</label>
                  <select 
                    value={editingUser ? editingUser.role : newUserData.role} 
                    onChange={(e) => editingUser ? setEditingUser({ ...editingUser, role: e.target.value }) : setNewUserData({ ...newUserData, role: e.target.value })} 
                    style={{ width: '100%', padding: '0.55rem' }}
                  >
                    <option value="admin">Administrador</option>
                    <option value="broker">Corretor</option>
                    <option value="agency">Imobiliária</option>
                    <option value="owner">Proprietário</option>
                    <option value="buyer">Comprador</option>
                    <option value="support">Suporte</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Status</label>
                  <select 
                    value={editingUser ? editingUser.status : newUserData.status} 
                    onChange={(e) => editingUser ? setEditingUser({ ...editingUser, status: e.target.value }) : setNewUserData({ ...newUserData, status: e.target.value })} 
                    style={{ width: '100%', padding: '0.55rem' }}
                  >
                    <option value="active">Ativo</option>
                    <option value="blocked">Bloqueado</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    value={editingUser ? (editingUser.phone || '') : newUserData.phone} 
                    onChange={(e) => editingUser ? setEditingUser({ ...editingUser, phone: e.target.value }) : setNewUserData({ ...newUserData, phone: e.target.value })} 
                    placeholder="(11) 98888-7777" 
                    style={{ width: '100%', padding: '0.55rem' }} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>CRECI (se corretor)</label>
                  <input 
                    type="text" 
                    value={editingUser ? (editingUser.creci || '') : newUserData.creci} 
                    onChange={(e) => editingUser ? setEditingUser({ ...editingUser, creci: e.target.value }) : setNewUserData({ ...newUserData, creci: e.target.value })} 
                    placeholder="12345-J" 
                    style={{ width: '100%', padding: '0.55rem' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => { setShowAddUserModal(false); setEditingUser(null); }}>Cancelar</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 800 }}>Salvar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
