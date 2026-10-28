import React, { useState, useEffect } from 'react';
import { INITIAL_PROPERTIES } from './mockData/properties';
import { DEFAULT_USERS } from './mockData/users';
import { 
  fetchProperties, 
  createProperty as createPropertyApi, 
  updateProperty as updatePropertyApi, 
  deleteProperty as deletePropertyApi, 
  processCheckoutPayment,
  sendChatMessage,
  fetchUsers,
  toggleUserStatus as toggleUserStatusApi,
  deleteUser as deleteUserApi,
  updateUserRole as updateUserRoleApi
} from './services/api';

import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import FiltersSidebar from './components/FiltersSidebar';
import PropertyCard from './components/PropertyCard';
import RealLeafletMap from './components/RealLeafletMap';
import PropertyDetailModal from './components/PropertyDetailModal';
import VisitSchedulerModal from './components/VisitSchedulerModal';
import FinanceCalculatorModal from './components/FinanceCalculatorModal';
import PropertyCompareModal from './components/PropertyCompareModal';
import PostPropertyModal from './components/PostPropertyModal';
import AuthModal from './components/AuthModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import UserDashboardModal from './components/UserDashboardModal';
import UserManagementModal from './components/UserManagementModal';
import SupportChatModal from './components/SupportChatModal';
import ChatHubModal from './components/ChatHubModal';
import CheckoutModal from './components/CheckoutModal';
import RealTimeChatModal from './components/RealTimeChatModal';
import VirtualTourModal from './components/VirtualTourModal';
import ItbiCalculatorModal from './components/ItbiCalculatorModal';
import FormalProposalModal from './components/FormalProposalModal';
import DigitalContractModal from './components/DigitalContractModal';
import RentalGuaranteesModal from './components/RentalGuaranteesModal';
import XmlFeedSyncModal from './components/XmlFeedSyncModal';
import DigitalInspectionModal from './components/DigitalInspectionModal';
import OpportunityRadarModal from './components/OpportunityRadarModal';
import SearchWizardModal from './components/SearchWizardModal';
import SplitScreenView from './components/SplitScreenView';
import AuctionPropertyCard from './components/AuctionPropertyCard';
import PropertyPdfModal from './components/PropertyPdfModal';
import RoiYieldCalculatorModal from './components/RoiYieldCalculatorModal';
import LeadCrmKanbanModal from './components/LeadCrmKanbanModal';
import InteractiveFloorPlanModal from './components/InteractiveFloorPlanModal';

import NotificationCenterModal from './components/NotificationCenterModal';
import BrokerReviewsModal from './components/BrokerReviewsModal';
import SavedSearchesModal from './components/SavedSearchesModal';
import NeighborhoodInsightsModal from './components/NeighborhoodInsightsModal';
import UnifiedTransactionTimelineModal from './components/UnifiedTransactionTimelineModal';
import MassCsvManagerModal from './components/MassCsvManagerModal';
import MovingChecklistModal from './components/MovingChecklistModal';
import RadiusFilterModal from './components/RadiusFilterModal';
import OpportunityFloatingToast from './components/OpportunityFloatingToast';

import PropertyDetailPage from './pages/PropertyDetailPage';
import BrokerProfilePage from './pages/BrokerProfilePage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';

import StatsCounterWidget from './components/StatsCounterWidget';
import TestimonialsWidget from './components/TestimonialsWidget';
import SellerCtaBanner from './components/SellerCtaBanner';
import FloatingCompareBar from './components/FloatingCompareBar';

import NeighborhoodsWidget from './components/NeighborhoodsWidget';
import ThreeStepsWidget from './components/ThreeStepsWidget';
import QuickConsultationWidget from './components/QuickConsultationWidget';
import ProfileContextBanner from './components/ProfileContextBanner';

import Footer from './components/Footer';

import { 
  Building2, 
  ArrowUpDown, 
  CheckCircle2, 
  Sparkles, 
  Grid, 
  Map as MapIcon, 
  Columns,
  SlidersHorizontal,
  X,
  Heart
} from 'lucide-react';

export default function App() {
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('imovelhub_users_list');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('imovelhub_favorites');
    return saved ? JSON.parse(saved) : ['prop-1'];
  });

  const [comparedIds, setComparedIds] = useState(() => {
    const saved = localStorage.getItem('imovelhub_compared');
    return saved ? JSON.parse(saved) : ['prop-1', 'prop-3'];
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('imovelhub_darkmode') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('imovelhub_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Multi-Page Routing State
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'property', 'broker', 'blog', 'post'
  const [currentPropertyPage, setCurrentPropertyPage] = useState(null);
  const [currentBroker, setCurrentBroker] = useState(null);
  const [currentBlogPost, setCurrentBlogPost] = useState(null);

  // Filter States
  const [activeTab, setActiveTab] = useState('Todos'); // "Todos", "Comprar", "Alugar", "Lançamentos", "Temporada", "Imóvel Novo", "Leilão"
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedSubTypes, setSelectedSubTypes] = useState([]);
  const [minBedrooms, setMinBedrooms] = useState('0');
  const [minParkingSpots, setMinParkingSpots] = useState('0');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevancia');

  const [filters, setFilters] = useState({
    maxPrice: null,
    minArea: 0,
    minParking: 0,
    amenities: []
  });

  // Modal Control States
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isPostPropertyOpen, setIsPostPropertyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isChatHubOpen, setIsChatHubOpen] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [schedulingProperty, setSchedulingProperty] = useState(null);
  const [calculatingProperty, setCalculatingProperty] = useState(null);
  const [checkoutProperty, setCheckoutProperty] = useState(null);
  const [chatProperty, setChatProperty] = useState(null);
  const [tourProperty, setTourProperty] = useState(null);
  const [itbiProperty, setItbiProperty] = useState(null);
  const [proposalProperty, setProposalProperty] = useState(null);
  const [digitalContractProperty, setDigitalContractProperty] = useState(null);
  const [rentalGuaranteesProperty, setRentalGuaranteesProperty] = useState(null);
  const [isXmlSyncOpen, setIsXmlSyncOpen] = useState(false);
  const [digitalInspectionProperty, setDigitalInspectionProperty] = useState(null);
  const [isOpportunityRadarOpen, setIsOpportunityRadarOpen] = useState(false);
  const [isSearchWizardOpen, setIsSearchWizardOpen] = useState(false);
  const [showTotalCost, setShowTotalCost] = useState(false);

  // 8 New Super Features Modal States
  const [pdfProperty, setPdfProperty] = useState(null);
  const [roiProperty, setRoiProperty] = useState(null);
  const [floorPlanProperty, setFloorPlanProperty] = useState(null);
  const [isLeadCrmOpen, setIsLeadCrmOpen] = useState(false);

  // Engagement, Insights & Operational States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('imovelhub_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif-1',
        type: 'proposal',
        title: 'Proposta Aceita pelo Vendedor! 🎉',
        message: 'Sua proposta de R$ 850.000 para o imóvel em Moema foi aprovada. O contrato digital já está disponível.',
        propertyTitle: 'Apartamento Alto Padrão em Moema',
        time: 'Há 10 min',
        read: false
      },
      {
        id: 'notif-2',
        type: 'visit',
        title: 'Visita Presencial Confirmada',
        message: 'O corretor confirmou a visita para amanhã às 14h.',
        propertyTitle: 'Cobertura Duplex nos Jardins',
        time: 'Há 1 hora',
        read: false
      },
      {
        id: 'notif-3',
        type: 'price_drop',
        title: 'Queda de Preço: Desconto de R$ 40.000!',
        message: 'O imóvel que você favoritou em Pinheiros baixou de R$ 690.000 para R$ 650.000.',
        propertyTitle: 'Apartamento Vista Panorâmica em Pinheiros',
        time: 'Ontem',
        read: true
      },
      {
        id: 'notif-4',
        type: 'saved_search',
        title: '2 Novos Imóveis na sua Busca Salva',
        message: 'Novos apartamentos de 2 quartos em Pinheiros foram cadastrados hoje.',
        time: 'Ontem',
        read: true
      }
    ];
  });

  const [reviewsBroker, setReviewsBroker] = useState(null);
  const [isSavedSearchesOpen, setIsSavedSearchesOpen] = useState(false);
  const [insightsNeighborhood, setInsightsNeighborhood] = useState(null);
  const [timelineProperty, setTimelineProperty] = useState(null);
  const [isMassCsvOpen, setIsMassCsvOpen] = useState(false);
  const [isMovingChecklistOpen, setIsMovingChecklistOpen] = useState(false);
  const [isRadiusModalOpen, setIsRadiusModalOpen] = useState(false);
  const [activeRadiusFilter, setActiveRadiusFilter] = useState(null);

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load from Express API & Saved Custom Theme on Mount
  useEffect(() => {
    async function loadData() {
      const [apiProps, apiUsers] = await Promise.all([
        fetchProperties(),
        fetchUsers()
      ]);
      if (apiProps && apiProps.length > 0) {
        setProperties(apiProps);
      }
      if (apiUsers && apiUsers.length > 0) {
        setUsers(apiUsers);
      }
    }
    loadData();

    // Apply custom theme tokens if saved by Admin
    try {
      const savedTheme = localStorage.getItem('imovelhub_site_theme');
      if (savedTheme) {
        const t = JSON.parse(savedTheme);
        if (t.colorPrimary) document.documentElement.style.setProperty('--color-primary', t.colorPrimary);
        if (t.colorPrimaryLight) document.documentElement.style.setProperty('--color-primary-light', t.colorPrimaryLight);
        if (t.colorAccent) document.documentElement.style.setProperty('--color-accent', t.colorAccent);
        if (t.colorQuinto) document.documentElement.style.setProperty('--color-quinto', t.colorQuinto);
        if (t.fontFamily) document.documentElement.style.setProperty('--font-primary', `'${t.fontFamily}', sans-serif`);
        if (t.borderRadius) document.documentElement.style.setProperty('--radius-md', t.borderRadius);
      }
    } catch (e) {
      console.error('Error applying theme', e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('imovelhub_users_list', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('imovelhub_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('imovelhub_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleMarkNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showToast("Todas as notificações foram marcadas como lidas.");
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    showToast("Histórico de notificações limpo.");
  };

  const handleOpenNotificationTarget = (notif) => {
    setIsNotificationsOpen(false);
    if (notif.type === 'proposal') {
      setProposalProperty(properties[0] || INITIAL_PROPERTIES[0]);
    } else if (notif.type === 'visit') {
      setSchedulingProperty(properties[1] || INITIAL_PROPERTIES[1]);
    } else {
      navigateToPropertyPage(properties[0] || INITIAL_PROPERTIES[0]);
    }
  };

  const handleApplySavedSearch = (saved) => {
    if (saved.query) setSearchQuery(saved.query);
    if (saved.type) setSelectedType(saved.type);
    if (saved.transactionType) setActiveTab(saved.transactionType);
    if (saved.minBedrooms) setMinBedrooms(saved.minBedrooms);
    if (saved.minParkingSpots) setMinParkingSpots(saved.minParkingSpots);
    if (saved.maxPrice) {
      setFilters(prev => ({ ...prev, maxPrice: saved.maxPrice }));
    }
    showToast(`Busca "${saved.name}" aplicada!`);
  };

  useEffect(() => {
    localStorage.setItem('imovelhub_compared', JSON.stringify(comparedIds));
  }, [comparedIds]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('imovelhub_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('imovelhub_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('imovelhub_darkmode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Handlers
  const handleToggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      showToast("Removido dos Favoritos");
    } else {
      setFavorites([...favorites, id]);
      showToast("Adicionado aos Favoritos!");
    }
  };

  const handleToggleCompare = (id) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter(cId => cId !== id));
      showToast("Removido do Comparador");
    } else {
      if (comparedIds.length >= 3) {
        showToast("Você só pode comparar até 3 imóveis lado a lado");
        return;
      }
      setComparedIds([...comparedIds, id]);
      showToast("Adicionado ao Comparador Side-by-Side (Imovelweb)!");
    }
  };

  const handleAddProperty = async (newProp) => {
    const created = await createPropertyApi(newProp);
    setProperties([created, ...properties]);
    showToast("Novo Imóvel Publicado no Servidor Backend!");
  };

  const handleUpdateProperty = async (updatedProp) => {
    const updated = await updatePropertyApi(updatedProp.id, updatedProp);
    setProperties(properties.map(p => p.id === updated.id ? updated : p));
    showToast("Imóvel Atualizado no Servidor!");
  };

  const handleDeleteProperty = async (id) => {
    await deletePropertyApi(id);
    setProperties(properties.filter(p => p.id !== id));
    showToast("Imóvel Excluído do Servidor!");
  };

  // User Management Handlers (Admin)
  const handleUpdateUserRole = async (userId, newRole) => {
    await updateUserRoleApi(userId, newRole);
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast(`Função do usuário atualizada para ${newRole}`);
  };

  const handleToggleUserStatus = async (userId) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    const newStatus = await toggleUserStatusApi(userId, targetUser.status || 'active');
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    showToast(newStatus === 'blocked' ? `Conta congelada/bloqueada no banco de dados!` : `Conta reativada com sucesso!`);
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
    showToast(`Nova conta cadastrada com sucesso!`);
  };

  const handleDeleteUser = async (userId) => {
    await deleteUserApi(userId);
    setUsers(users.filter(u => u.id !== userId));
    showToast(`Conta excluída permanentemente do Supabase`);
  };

  const handleSendProposalToChat = async (propertyId, proposalText) => {
    const sender = currentUser ? `${currentUser.name.split(' ')[0]} (Proponente)` : 'Comprador';
    await sendChatMessage(propertyId, proposalText, sender);
    showToast("Proposta Formal Enviada com Sucesso para o Vendedor!");
  };

  const handlePaymentSuccess = async ({ propertyId, plan, method }) => {
    await processCheckoutPayment(propertyId, plan, method);
    setProperties(properties.map(p => {
      if (p.id === propertyId) {
        return {
          ...p,
          priceReduced: true,
          loftValuation: {
            status: plan.name,
            diffPercent: -5.0,
            neighborhoodAvgPerM2: 12000
          }
        };
      }
      return p;
    }));
    showToast(`Pagamento Aprovado pelo Backend! Plano "${plan.name}" ativado com sucesso!`);
  };

  // Routing Handlers
  const navigateToPropertyPage = (prop) => {
    setCurrentPropertyPage(prop);
    setCurrentPage('property');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBrokerPage = (advertiser) => {
    setCurrentBroker(advertiser);
    setCurrentPage('broker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBlog = () => {
    setCurrentPage('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBlogPost = (post) => {
    setCurrentBlogPost(post);
    setCurrentPage('post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyWizardFilters = (wizardData) => {
    if (wizardData.operation) setActiveTab(wizardData.operation);
    if (wizardData.propertyType) setSelectedType(wizardData.propertyType);
    if (wizardData.minBedrooms) setMinBedrooms(String(wizardData.minBedrooms));
    if (wizardData.neighborhoods?.length > 0) {
      setSearchQuery(wizardData.neighborhoods[0]);
    } else if (wizardData.city) {
      setSearchQuery(wizardData.city);
    }
    setFilters({
      maxPrice: wizardData.maxPrice || null,
      minArea: 0,
      minParking: wizardData.minParking || 0,
      amenities: wizardData.amenities || []
    });
    showToast(`Busca personalizada do Assistente Inteligente aplicada com sucesso!`);
  };

  // Filtering Logic
  const filteredProperties = properties.filter((item) => {
    if (showOnlyFavorites && !favorites.includes(item.id)) return false;

    if (activeTab && activeTab !== 'Todos' && activeTab !== 'all') {
      if (activeTab === 'Comprar' && item.transactionType !== 'Venda' && item.purpose !== 'Venda') return false;
      if (activeTab === 'Alugar' && item.transactionType !== 'Aluguel' && item.purpose !== 'Aluguel') return false;
      if (activeTab === 'Lançamentos' && !item.isLaunch && !item.isRelease) return false;
      if (activeTab === 'Temporada' && item.transactionType !== 'Temporada' && !item.isSeason) return false;
      if (activeTab === 'Imóvel Novo' && !item.isNew && !item.isLaunch) return false;
      if (activeTab === 'Leilão' && item.transactionType !== 'Leilao' && !item.isAuction) return false;
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const cleanQ = searchQuery.trim().replace(/^#/, '');
      if (item.id && (item.id.toLowerCase() === cleanQ.toLowerCase() || item.id.toLowerCase() === `prop-${cleanQ.toLowerCase()}`)) {
        // Direct ID Match!
      } else {
        const normalize = (str) =>
          (str || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[,\-–—\(\)\/]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const normQuery = normalize(searchQuery);
        const queryTerms = normQuery.split(' ').filter(t => t.length > 0);
        const searchableText = normalize(
          `${item.id} ${item.title} ${item.neighborhood} ${item.city} ${item.state} ${item.address} ${item.type} ${item.subType} ${item.referenceCode || ''}`
        );

        const matchesAllTerms = queryTerms.every(term => searchableText.includes(term));
        if (!matchesAllTerms) return false;
      }
    }

    if (selectedSubTypes.length > 0) {
      const matchSub = selectedSubTypes.includes(item.subType) || selectedSubTypes.includes(item.type);
      if (!matchSub) return false;
    } else if (selectedType !== 'Todos') {
      const matchType = item.type === selectedType || item.subType === selectedType;
      if (!matchType) return false;
    }
    if (Number(minBedrooms) > 0 && (item.bedrooms || 0) < Number(minBedrooms)) return false;
    if (Number(minParkingSpots) > 0 && (item.parkingSpots || 0) < Number(minParkingSpots)) return false;

    const effectivePrice = item.transactionType === 'Venda' ? item.price : (showTotalCost ? (item.rentPrice + (item.condoFee || 0) + (item.iptu || 0)) : item.rentPrice);
    if (filters.minPrice && effectivePrice < filters.minPrice) return false;
    if (filters.maxPrice && effectivePrice > filters.maxPrice) return false;
    if (filters.minArea > 0 && item.area < filters.minArea) return false;
    if (filters.minParking > 0 && (item.parkingSpots || 0) < filters.minParking) return false;

    // Filtro por Estágio do Imóvel
    if (filters.stage && filters.stage !== 'all') {
      if (filters.stage === 'pronto' && (item.isLaunch || item.transactionType === 'Leilao')) return false;
      if (filters.stage === 'planta' && !item.isLaunch && !item.isRelease) return false;
      if (filters.stage === 'novo' && !item.isNew && !item.isLaunch) return false;
      if (filters.stage === 'leilao' && item.transactionType !== 'Leilao' && !item.isAuction) return false;
    }

    // Filtro por Posição do Andar
    if (filters.floorPosition && filters.floorPosition !== 'all') {
      const fullText = `${item.title} ${item.subType} ${item.description || ''}`.toLowerCase();
      if (filters.floorPosition === 'terreo' && !fullText.includes('térreo') && !fullText.includes('garden') && !item.amenities?.includes('Térreo')) return false;
      if (filters.floorPosition === 'alto' && !fullText.includes('andar alto') && !fullText.includes('vista livre') && !item.amenities?.includes('Andar Alto')) return false;
      if (filters.floorPosition === 'cobertura' && item.subType !== 'Cobertura' && !fullText.includes('cobertura') && !fullText.includes('duplex') && !fullText.includes('triplex')) return false;
      if (filters.floorPosition === 'baixo' && (fullText.includes('cobertura') || fullText.includes('andar alto'))) return false;
    }

    if (filters.amenities && filters.amenities.length > 0) {
      const hasAll = filters.amenities.every(amenity => {
        if (amenity === 'Aceita Permuta') return item.acceptsExchange || item.description?.toLowerCase().includes('permuta');
        if (amenity === 'Minha Casa Minha Vida (MCMV)') return item.price <= 350000 && item.transactionType === 'Venda';
        if (amenity === 'Apenas com Tour Virtual 360°') return item.hasVirtualTour || true;
        if (amenity === 'Aluguel Sem Fiador (Garantia Digital)') return item.transactionType === 'Aluguel';
        return item.amenities?.includes(amenity);
      });
      if (!hasAll) return false;
    }

    // Filtro por Raio Geográfico (Haversine Distance)
    if (activeRadiusFilter && activeRadiusFilter.lat && activeRadiusFilter.lng) {
      const R = 6371; // Raio da terra em km
      const dLat = ((item.lat || -23.56) - activeRadiusFilter.lat) * Math.PI / 180;
      const dLon = ((item.lng || -46.66) - activeRadiusFilter.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(activeRadiusFilter.lat * Math.PI / 180) * Math.cos((item.lat || -23.56) * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;
      if (dist > (activeRadiusFilter.radiusKm || 5)) return false;
    }

    return true;
  });

  // Sorting Logic
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const priceA = a.transactionType === 'Venda' ? a.price : a.rentPrice;
    const priceB = b.transactionType === 'Venda' ? b.price : b.rentPrice;
    const m2A = Math.round(priceA / a.area);
    const m2B = Math.round(priceB / b.area);

    if (sortBy === 'menor-preco') return priceA - priceB;
    if (sortBy === 'maior-preco') return priceB - priceA;
    if (sortBy === 'm2') return m2A - m2B;
    if (sortBy === 'area') return b.area - a.area;
    return 0;
  });

  const comparedPropertiesList = properties.filter(p => comparedIds.includes(p.id));
  const userPropertiesList = currentUser ? properties.filter(p => {
    if (p.userId && p.userId === currentUser.id) return true;
    if (p.advertiser?.email && p.advertiser?.email === currentUser.email) return true;
    if (p.advertiser?.phone && currentUser.phone && p.advertiser?.phone === currentUser.phone) return true;
    if (p.advertiser?.name && p.advertiser?.name === currentUser.name && p.advertiser?.name !== 'Proprietário Direto') return true;
    return false;
  }) : [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          animation: 'slideUp 0.25s ease'
        }}>
          <Sparkles size={16} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Nav */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        favoritesCount={favorites.length}
        compareCount={comparedIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenChatHub={() => setIsChatHubOpen(true)}
        onOpenLeadCrm={() => setIsLeadCrmOpen(true)}
        onOpenRoiCalculator={(prop) => setRoiProperty(prop || properties[0])}
        onOpenFinanceCalculator={(prop) => setCalculatingProperty(prop || properties[0])}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSavedSearches={() => setIsSavedSearchesOpen(true)}
        onOpenNeighborhoodInsights={(name) => setInsightsNeighborhood(name || 'Pinheiros')}
        onOpenTransactionTimeline={(prop) => setTimelineProperty(prop || properties[0])}
        onOpenMovingChecklist={() => setIsMovingChecklistOpen(true)}
        onNavigateHome={navigateToHome}
        onNavigateBlog={navigateToBlog}
        onOpenDigitalContract={() => setDigitalContractProperty(properties[0] || INITIAL_PROPERTIES[0])}
        onOpenOpportunityRadar={() => setIsOpportunityRadarOpen(true)}
        onOpenXmlSync={() => setIsXmlSyncOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          showToast("Você saiu da conta.");
        }}
      />

      {/* PAGE ROUTER CONTENT */}
      {currentPage === 'property' && currentPropertyPage ? (
        <PropertyDetailPage
          property={currentPropertyPage}
          onNavigateHome={navigateToHome}
          onNavigateBroker={navigateToBrokerPage}
          isFavorite={favorites.includes(currentPropertyPage.id)}
          isCompared={comparedIds.includes(currentPropertyPage.id)}
          onToggleFavorite={handleToggleFavorite}
          onToggleCompare={handleToggleCompare}
          onOpenScheduler={(prop) => setSchedulingProperty(prop)}
          onOpenCalculator={(prop) => setCalculatingProperty(prop)}
          onOpenChat={(prop) => setChatProperty(prop)}
          onOpenVirtualTour={(prop) => setTourProperty(prop)}
          onOpenItbiCalculator={(prop) => setItbiProperty(prop)}
          onOpenFormalProposal={(prop) => setProposalProperty(prop)}
          onOpenPdfSheet={(prop) => setPdfProperty(prop)}
          onOpenRoiCalculator={(prop) => setRoiProperty(prop)}
          onOpenInteractiveFloorPlan={(prop) => setFloorPlanProperty(prop)}
        />
      ) : currentPage === 'broker' && currentBroker ? (
        <BrokerProfilePage
          advertiser={currentBroker}
          properties={properties}
          onNavigateHome={navigateToHome}
          isFavorite={(id) => favorites.includes(id)}
          isCompared={(id) => comparedIds.includes(id)}
          onToggleFavorite={handleToggleFavorite}
          onToggleCompare={handleToggleCompare}
          onSelectProperty={navigateToPropertyPage}
          onOpenScheduler={(prop) => setSchedulingProperty(prop)}
          onOpenCalculator={(prop) => setCalculatingProperty(prop)}
          onOpenBrokerReviews={(brk) => setReviewsBroker(brk)}
        />
      ) : currentPage === 'blog' ? (
        <BlogListPage
          onNavigateHome={navigateToHome}
          onSelectPost={navigateToBlogPost}
        />
      ) : currentPage === 'post' && currentBlogPost ? (
        <BlogPostPage
          post={currentBlogPost}
          onNavigateBlog={navigateToBlog}
        />
      ) : (
        /* HOME PAGE VIEW */
        <>
          <HeroSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedSubTypes={selectedSubTypes}
            setSelectedSubTypes={setSelectedSubTypes}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            maxPrice={filters.maxPrice}
            setMaxPrice={(val) => setFilters({ ...filters, maxPrice: val })}
            minBedrooms={minBedrooms}
            setMinBedrooms={setMinBedrooms}
            minParkingSpots={minParkingSpots}
            setMinParkingSpots={setMinParkingSpots}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onOpenFilters={() => setIsFiltersOpen(true)}
            onOpenSearchWizard={() => setIsSearchWizardOpen(true)}
            onOpenSavedSearches={() => setIsSavedSearchesOpen(true)}
            onOpenRadiusModal={() => setIsRadiusModalOpen(true)}
            activeRadiusFilter={activeRadiusFilter}
            filters={filters}
            setFilters={setFilters}
            showTotalCost={showTotalCost}
            setShowTotalCost={setShowTotalCost}
            properties={properties}
          />

          {/* Dynamic Profile Context & Role Switcher Banner */}
          <ProfileContextBanner
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            favoritesCount={favorites.length}
            compareCount={comparedIds.length}
            propertiesCount={properties.length}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenPostProperty={() => setIsPostPropertyOpen(true)}
            onOpenFavorites={() => setShowOnlyFavorites(true)}
            onOpenCompare={() => setIsCompareOpen(true)}
            onOpenOpportunityRadar={() => setIsOpportunityRadarOpen(true)}
            onOpenDigitalContract={() => setDigitalContractProperty(properties[0] || INITIAL_PROPERTIES[0])}
            onOpenXmlSync={() => setIsXmlSyncOpen(true)}
            onOpenSupport={() => setIsSupportOpen(true)}
            onOpenChatHub={() => setIsChatHubOpen(true)}
            onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
            onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
            onOpenSearchWizard={() => setIsSearchWizardOpen(true)}
            onSelectTransactionTab={(tab) => setActiveTab(tab)}
          />

          <main className="container" style={{ marginTop: '2rem', flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {showOnlyFavorites ? 'Imóveis Favoritados' : `Imóveis para ${activeTab}`}
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Mostrando {sortedProperties.length} de {properties.length} imóveis encontrados
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {showOnlyFavorites && (
                  <span className="badge badge-viva" style={{ cursor: 'pointer' }} onClick={() => setShowOnlyFavorites(false)}>
                    <Heart size={12} fill="currentColor" />
                    <span>Somente Favoritos</span>
                    <X size={12} style={{ marginLeft: '4px' }} />
                  </span>
                )}
                {selectedSubTypes.length > 0 && selectedSubTypes.map(sub => (
                  <span
                    key={sub}
                    className="badge"
                    style={{ backgroundColor: '#ff5a00', color: '#ffffff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                    onClick={() => setSelectedSubTypes(selectedSubTypes.filter(s => s !== sub))}
                  >
                    <span>{sub}</span>
                    <X size={12} />
                  </span>
                ))}
                {selectedSubTypes.length === 0 && selectedType !== 'Todos' && (
                  <span className="badge badge-quinto" style={{ cursor: 'pointer' }} onClick={() => setSelectedType('Todos')}>
                    <span>Tipo: {selectedType}</span>
                    <X size={12} style={{ marginLeft: '4px' }} />
                  </span>
                )}
                {minBedrooms !== '0' && (
                  <span className="badge badge-quinto" style={{ cursor: 'pointer' }} onClick={() => setMinBedrooms('0')}>
                    <span>{minBedrooms}+ Quartos</span>
                    <X size={12} style={{ marginLeft: '4px' }} />
                  </span>
                )}
                {showTotalCost && activeTab === 'Alugar' && (
                  <span className="badge badge-quinto" style={{ cursor: 'pointer' }} onClick={() => setShowTotalCost(false)}>
                    <span>✓ Pacote Total Ativo</span>
                    <X size={12} style={{ marginLeft: '4px' }} />
                  </span>
                )}
                {filters.amenities && filters.amenities.map(amenity => (
                  <span key={amenity} className="badge badge-loft" style={{ cursor: 'pointer' }} onClick={() => setFilters({
                    ...filters,
                    amenities: filters.amenities.filter(a => a !== amenity)
                  })}>
                    <span>{amenity}</span>
                    <X size={12} style={{ marginLeft: '4px' }} />
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* View Mode Toggle Group */}
                <div style={{ display: 'flex', backgroundColor: 'var(--bg-main)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
                      color: viewMode === 'grid' ? '#ffffff' : 'var(--text-main)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                    title="Visualização em Grade de Cards"
                  >
                    <Grid size={14} />
                    <span>Grade</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('split')}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: viewMode === 'split' ? 'var(--color-primary)' : 'transparent',
                      color: viewMode === 'split' ? '#ffffff' : 'var(--text-main)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                    title="Dividir Tela: Cards + Mapa Fixo Lado a Lado (Estilo Airbnb / Zillow)"
                  >
                    <Columns size={14} />
                    <span>Dividir Tela</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: viewMode === 'map' ? 'var(--color-primary)' : 'transparent',
                      color: viewMode === 'map' ? '#ffffff' : 'var(--text-main)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                    title="Visualização em Mapa Completo Interativo"
                  >
                    <MapIcon size={14} />
                    <span>Mapa</span>
                  </button>
                </div>

                {/* Sort dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowUpDown size={15} color="var(--text-muted)" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: '0.42rem 0.85rem', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    <option value="relevancia">Relevância / Destaque</option>
                    <option value="menor-preco">Menor Preço</option>
                    <option value="maior-preco">Maior Preço</option>
                    <option value="m2">Menor R$/m² (Loft)</option>
                    <option value="area">Maior Área (m²)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* View Mode Switching: Split-Screen / Full Map / Standard Grid */}
            {viewMode === 'split' ? (
              <SplitScreenView
                properties={sortedProperties}
                favorites={favorites}
                comparedIds={comparedIds}
                onToggleFavorite={handleToggleFavorite}
                onToggleCompare={handleToggleCompare}
                onSelectProperty={(prop) => navigateToPropertyPage(prop)}
                onOpenScheduler={(prop) => setSchedulingProperty(prop)}
                onOpenCalculator={(prop) => setCalculatingProperty(prop)}
                onOpenChat={(prop) => setChatProperty(prop)}
                onOpenVirtualTour={(prop) => setTourProperty(prop)}
                showTotalCost={showTotalCost}
              />
            ) : viewMode === 'map' ? (
              <RealLeafletMap
                properties={sortedProperties}
                selectedProperty={selectedProperty}
                onSelectProperty={(prop) => navigateToPropertyPage(prop)}
              />
            ) : (
              <>
                {sortedProperties.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '4rem 1.5rem',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <Building2 size={48} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Nenhum imóvel encontrado</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Tente ajustar sua busca ou remover alguns filtros aplicados.
                    </p>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedType('Todos');
                        setMinBedrooms('0');
                        setShowOnlyFavorites(false);
                        setFilters({ maxPrice: null, minArea: 0, minParking: 0, amenities: [] });
                      }}
                    >
                      Limpar Todos os Filtros
                    </button>
                  </div>
                ) : (
                  <div className="responsive-grid">
                    {sortedProperties.map((property) => (
                      activeTab === 'Leilão' ? (
                        <AuctionPropertyCard
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(property.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onSelectProperty={(prop) => navigateToPropertyPage(prop)}
                        />
                      ) : (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(property.id)}
                          isCompared={comparedIds.includes(property.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onToggleCompare={handleToggleCompare}
                          onSelectProperty={(prop) => navigateToPropertyPage(prop)}
                          onOpenScheduler={(prop) => setSchedulingProperty(prop)}
                          onOpenCalculator={(prop) => setCalculatingProperty(prop)}
                          showTotalCost={showTotalCost}
                        />
                      )
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Extracted Builder & Real Estate Widgets */}
            <NeighborhoodsWidget 
              properties={properties}
              onSelectNeighborhood={(neigh) => {
                setSearchQuery(neigh);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              onOpenNeighborhoodInsights={(neigh) => setInsightsNeighborhood(neigh || 'Pinheiros')}
            />
            <ThreeStepsWidget />
            <StatsCounterWidget />
            <SellerCtaBanner onOpenPostProperty={() => setIsPostPropertyOpen(true)} />
            <QuickConsultationWidget showToast={showToast} />
            <TestimonialsWidget />
          </main>
        </>
      )}

      <Footer />

      {/* Modals */}
      <FiltersSidebar
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={{ ...filters, selectedSubTypes }}
        setFilters={(newFilters) => {
          if (newFilters.selectedSubTypes !== undefined) {
            setSelectedSubTypes(newFilters.selectedSubTypes);
          }
          setFilters(newFilters);
        }}
        onResetFilters={() => {
          setSelectedSubTypes([]);
          setFilters({ maxPrice: null, minPrice: null, minArea: 0, minParking: 0, stage: 'all', floorPosition: 'all', amenities: [] });
        }}
        onSaveSearch={(currentFilters) => {
          const searchName = `Busca Personalizada: ${activeTab} ${searchQuery || ''} ${currentFilters.maxPrice ? `até R$ ${Number(currentFilters.maxPrice).toLocaleString('pt-BR')}` : ''}`;
          const newSaved = {
            id: `saved-${Date.now()}`,
            name: searchName,
            query: searchQuery,
            tab: activeTab,
            filters: currentFilters,
            createdAt: 'Agora'
          };
          try {
            const existing = JSON.parse(localStorage.getItem('imobhub_user_saved_searches') || '[]');
            localStorage.setItem('imobhub_user_saved_searches', JSON.stringify([newSaved, ...existing]));
          } catch(e) {}
          showToast(`Combinação salva com sucesso! Alertas ativados na Central.`);
        }}
        filteredCount={sortedProperties.length}
        properties={properties}
      />

      <SearchWizardModal
        isOpen={isSearchWizardOpen}
        onClose={() => setIsSearchWizardOpen(false)}
        onApplyWizardFilters={handleApplyWizardFilters}
      />

      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
        isCompared={selectedProperty ? comparedIds.includes(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onToggleCompare={handleToggleCompare}
        onOpenScheduler={(prop) => setSchedulingProperty(prop)}
        onOpenCalculator={(prop) => setCalculatingProperty(prop)}
        onOpenChat={(prop) => setChatProperty(prop)}
        onOpenVirtualTour={(prop) => setTourProperty(prop)}
        onOpenItbiCalculator={(prop) => setItbiProperty(prop)}
        onOpenFormalProposal={(prop) => setProposalProperty(prop)}
        onOpenDigitalContract={(prop) => setDigitalContractProperty(prop)}
        onOpenRentalGuarantees={(prop) => setRentalGuaranteesProperty(prop)}
        onOpenDigitalInspection={(prop) => setDigitalInspectionProperty(prop)}
        onOpenOpportunityRadar={(prop) => setIsOpportunityRadarOpen(true)}
        onOpenPdfSheet={(prop) => setPdfProperty(prop)}
        onOpenRoiCalculator={(prop) => setRoiProperty(prop)}
        onOpenInteractiveFloorPlan={(prop) => setFloorPlanProperty(prop)}
      />

      {schedulingProperty && (
        <VisitSchedulerModal
          property={schedulingProperty}
          onClose={() => setSchedulingProperty(null)}
          onConfirmSchedule={(details) => {
            showToast(`Visita agendada para ${details.date} às ${details.time}!`);
          }}
        />
      )}

      {calculatingProperty && (
        <FinanceCalculatorModal
          property={calculatingProperty}
          onClose={() => setCalculatingProperty(null)}
        />
      )}

      {isCompareOpen && (
        <PropertyCompareModal
          comparedProperties={comparedPropertiesList}
          onClose={() => setIsCompareOpen(false)}
          onRemoveFromCompare={(id) => handleToggleCompare(id)}
          onSelectProperty={(prop) => navigateToPropertyPage(prop)}
        />
      )}

      {isPostPropertyOpen && (
        <PostPropertyModal
          currentUser={currentUser}
          onClose={() => setIsPostPropertyOpen(false)}
          onAddProperty={handleAddProperty}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Bem-vindo, ${user.name}! (${user.role.toUpperCase()})`);
        }}
      />

      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        properties={properties}
        onUpdateProperty={handleUpdateProperty}
        onDeleteProperty={handleDeleteProperty}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenCheckout={(prop) => setCheckoutProperty(prop)}
        onOpenMassCsv={() => setIsMassCsvOpen(true)}
        onOpenUserManagement={() => setIsUserManagementOpen(true)}
        users={users}
        onUpdateUserRole={handleUpdateUserRole}
        onToggleUserStatus={handleToggleUserStatus}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
        currentUser={currentUser}
      />

      <UserDashboardModal
        isOpen={isUserDashboardOpen}
        onClose={() => setIsUserDashboardOpen(false)}
        currentUser={currentUser}
        userProperties={userPropertiesList}
        properties={properties}
        favorites={favorites}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenCheckout={(prop) => setCheckoutProperty(prop)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onUpdateProperty={handleUpdateProperty}
        onDeleteProperty={handleDeleteProperty}
        onOpenLeadCrm={() => setIsLeadCrmOpen(true)}
      />

      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
        users={users}
        onUpdateUserRole={handleUpdateUserRole}
        onToggleUserStatus={handleToggleUserStatus}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
      />

      <SupportChatModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        currentUser={currentUser}
      />

      <ChatHubModal
        isOpen={isChatHubOpen}
        onClose={() => setIsChatHubOpen(false)}
        currentUser={currentUser}
        properties={properties}
        onOpenScheduler={(prop) => setSchedulingProperty(prop)}
      />

      {checkoutProperty && (
        <CheckoutModal
          property={checkoutProperty}
          onClose={() => setCheckoutProperty(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {chatProperty && (
        <RealTimeChatModal
          property={chatProperty}
          onClose={() => setChatProperty(null)}
          currentUser={currentUser}
        />
      )}

      {tourProperty && (
        <VirtualTourModal
          property={tourProperty}
          onClose={() => setTourProperty(null)}
        />
      )}

      {itbiProperty && (
        <ItbiCalculatorModal
          property={itbiProperty}
          onClose={() => setItbiProperty(null)}
        />
      )}

      {proposalProperty && (
        <FormalProposalModal
          property={proposalProperty}
          onClose={() => setProposalProperty(null)}
          currentUser={currentUser}
          onSendProposalToChat={handleSendProposalToChat}
        />
      )}

      {/* Enterprise Suite Modals */}
      {digitalContractProperty && (
        <DigitalContractModal
          isOpen={Boolean(digitalContractProperty)}
          onClose={() => setDigitalContractProperty(null)}
          property={digitalContractProperty}
          currentUser={currentUser}
        />
      )}

      {rentalGuaranteesProperty && (
        <RentalGuaranteesModal
          isOpen={Boolean(rentalGuaranteesProperty)}
          onClose={() => setRentalGuaranteesProperty(null)}
          property={rentalGuaranteesProperty}
          currentUser={currentUser}
        />
      )}

      <XmlFeedSyncModal
        isOpen={isXmlSyncOpen}
        onClose={() => setIsXmlSyncOpen(false)}
        properties={properties}
        onImportProperties={(newProps) => {
          setProperties([...newProps, ...properties]);
          showToast(`${newProps.length} imóveis importados do Feed XML com sucesso!`);
        }}
      />

      {digitalInspectionProperty && (
        <DigitalInspectionModal
          isOpen={Boolean(digitalInspectionProperty)}
          onClose={() => setDigitalInspectionProperty(null)}
          property={digitalInspectionProperty}
          currentUser={currentUser}
        />
      )}

      <OpportunityRadarModal
        isOpen={isOpportunityRadarOpen}
        onClose={() => setIsOpportunityRadarOpen(false)}
        properties={properties}
        currentUser={currentUser}
      />

      {/* 8 New Super Features Modals */}
      {pdfProperty && (
        <PropertyPdfModal
          property={pdfProperty}
          onClose={() => setPdfProperty(null)}
        />
      )}

      {roiProperty && (
        <RoiYieldCalculatorModal
          property={roiProperty}
          onClose={() => setRoiProperty(null)}
        />
      )}

      {floorPlanProperty && (
        <InteractiveFloorPlanModal
          property={floorPlanProperty}
          onClose={() => setFloorPlanProperty(null)}
        />
      )}

      <LeadCrmKanbanModal
        isOpen={isLeadCrmOpen}
        onClose={() => setIsLeadCrmOpen(false)}
      />

      {/* Engagement, Insights & Operational Modals */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClearAll={handleClearAllNotifications}
        onOpenNotificationTarget={handleOpenNotificationTarget}
      />

      {reviewsBroker && (
        <BrokerReviewsModal
          isOpen={Boolean(reviewsBroker)}
          onClose={() => setReviewsBroker(null)}
          broker={reviewsBroker}
        />
      )}

      <SavedSearchesModal
        isOpen={isSavedSearchesOpen}
        onClose={() => setIsSavedSearchesOpen(false)}
        onApplySavedSearch={handleApplySavedSearch}
        currentSearchParams={{
          searchQuery,
          selectedType,
          activeTab,
          minBedrooms,
          minParkingSpots,
          maxPrice: filters.maxPrice,
          matchingCount: sortedProperties.length
        }}
      />

      {insightsNeighborhood && (
        <NeighborhoodInsightsModal
          isOpen={Boolean(insightsNeighborhood)}
          onClose={() => setInsightsNeighborhood(null)}
          initialNeighborhood={insightsNeighborhood}
          onSelectNeighborhood={(name) => {
            setSearchQuery(name);
            setInsightsNeighborhood(null);
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
        />
      )}

      {timelineProperty && (
        <UnifiedTransactionTimelineModal
          isOpen={Boolean(timelineProperty)}
          onClose={() => setTimelineProperty(null)}
          property={timelineProperty}
          onOpenStageAction={(target, prop) => {
            if (target === 'proposal') setProposalProperty(prop);
            else if (target === 'guarantees') setRentalGuaranteesProperty(prop);
            else if (target === 'contract') setDigitalContractProperty(prop);
            else if (target === 'inspection') setDigitalInspectionProperty(prop);
            else if (target === 'moving_checklist') setIsMovingChecklistOpen(true);
          }}
        />
      )}

      <MassCsvManagerModal
        isOpen={isMassCsvOpen}
        onClose={() => setIsMassCsvOpen(false)}
        properties={properties}
        onImportProperties={(newProps) => {
          setProperties([...newProps, ...properties]);
          showToast(`${newProps.length} imóveis importados da planilha CSV!`);
        }}
      />

      <MovingChecklistModal
        isOpen={isMovingChecklistOpen}
        onClose={() => setIsMovingChecklistOpen(false)}
      />

      <RadiusFilterModal
        isOpen={isRadiusModalOpen}
        onClose={() => setIsRadiusModalOpen(false)}
        activeRadiusFilter={activeRadiusFilter}
        onApplyRadiusFilter={(radiusObj) => {
          setActiveRadiusFilter(radiusObj);
          showToast(`Filtro de raio de ${radiusObj.radiusKm} km em ${radiusObj.name} aplicado!`);
        }}
        onClearRadiusFilter={() => {
          setActiveRadiusFilter(null);
          showToast("Filtro de raio removido.");
        }}
      />

      {/* Floating Side-by-Side Compare Bar (ThemeForest Inspired) */}
      <FloatingCompareBar
        comparedProperties={comparedPropertiesList}
        onOpenCompareModal={() => setIsCompareOpen(true)}
        onRemoveFromCompare={(id) => handleToggleCompare(id)}
        onClearAll={() => setComparedIds([])}
      />

      {/* Floating Radar Opportunities Toast */}
      <OpportunityFloatingToast
        properties={properties}
        onSelectProperty={(p) => navigateToPropertyPage(p)}
      />
    </div>
  );
}
