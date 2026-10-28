import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  DollarSign, 
  Bed, 
  SlidersHorizontal, 
  Grid, 
  Map as MapIcon,
  Sparkles,
  Bookmark,
  Compass,
  History,
  TrendingUp,
  Check,
  X
} from 'lucide-react';
import ImovelwebCategoryDropdown from './ImovelwebCategoryDropdown';



export default function HeroSearch({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedSubTypes = [],
  setSelectedSubTypes,
  activeTab,
  setActiveTab,
  maxPrice,
  setMaxPrice,
  minBedrooms,
  setMinBedrooms,
  minParkingSpots,
  setMinParkingSpots,
  viewMode,
  setViewMode,
  onOpenFilters,
  onOpenSearchWizard,
  onOpenSavedSearches,
  onOpenRadiusModal,
  activeRadiusFilter,
  filters = {},
  setFilters,
  showTotalCost,
  setShowTotalCost,
  properties = []
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('imobhub_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveRecentSearch = (query) => {
    if (!query || query.trim().length < 2) return;
    const clean = query.trim();
    const updated = [clean, ...recentSearches.filter(s => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('imobhub_recent_searches', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleClearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('imobhub_recent_searches');
  };

  // =========================================================================
  // FILTRAGEM MULTIDIMENSIONAL REATIVA CRUZADA (BIDIRECIONAL 100% REAL)
  // =========================================================================

  const normalize = (str) =>
    (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[,\-–—\(\)\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  // Helper de correspondência de texto para localização e código de referência
  const matchesLocation = (prop, query) => {
    if (!query || !query.trim()) return true;
    const cleanQ = query.trim().replace(/^#/, '');
    if (prop.id && (prop.id.toLowerCase() === cleanQ.toLowerCase() || prop.id.toLowerCase() === `prop-${cleanQ.toLowerCase()}`)) {
      return true;
    }
    const normQuery = normalize(query);
    const queryTerms = normQuery.split(' ').filter(t => t.length > 0);
    const full = normalize(
      `${prop.id || ''} ${prop.title || ''} ${prop.neighborhood || ''} ${prop.city || ''} ${prop.state || ''} ${prop.address || ''} ${prop.type || ''} ${prop.subType || ''} ${prop.referenceCode || ''}`
    );
    return queryTerms.every(term => full.includes(term));
  };

  // Helper de correspondência de tipo/categoria
  const matchesCategory = (prop, subTypes, mainType) => {
    if (!subTypes || subTypes.length === 0) {
      if (mainType && mainType !== 'Todos' && mainType !== 'all') {
        return prop.type === mainType || prop.subType === mainType;
      }
      return true;
    }
    return subTypes.includes(prop.subType) || subTypes.includes(prop.type);
  };

  // Helper de transação
  const matchesTab = (prop, tab) => {
    if (!tab || tab === 'Todos' || tab === 'all') return true;
    if (tab === 'Comprar') return prop.transactionType === 'Venda' || prop.purpose === 'Venda';
    if (tab === 'Alugar') return prop.transactionType === 'Aluguel' || prop.purpose === 'Aluguel';
    if (tab === 'Lançamentos') return prop.isLaunch || prop.isRelease;
    if (tab === 'Temporada') return prop.transactionType === 'Temporada' || prop.isSeason;
    if (tab === 'Imóvel Novo') return prop.isNew || prop.isLaunch;
    if (tab === 'Leilão') return prop.transactionType === 'Leilao' || prop.isAuction;
    return true;
  };

  // 1. POOL PARA CATEGORIAS: Imóveis filtrados por Localização + Quartos + Vagas + Aba
  const categoryContextProperties = useMemo(() => {
    return properties.filter(p => {
      if (!matchesTab(p, activeTab)) return false;
      if (!matchesLocation(p, searchQuery)) return false;
      if (Number(minBedrooms) > 0 && (p.bedrooms || 0) < Number(minBedrooms)) return false;
      if (Number(minParkingSpots) > 0 && (p.parkingSpots || 0) < Number(minParkingSpots)) return false;
      return true;
    });
  }, [properties, activeTab, searchQuery, minBedrooms, minParkingSpots]);

  // 2. POOL PARA LOCALIZAÇÃO: Imóveis filtrados por Categorias + Quartos + Vagas + Aba
  const locationContextProperties = useMemo(() => {
    return properties.filter(p => {
      if (!matchesTab(p, activeTab)) return false;
      if (!matchesCategory(p, selectedSubTypes, selectedType)) return false;
      if (Number(minBedrooms) > 0 && (p.bedrooms || 0) < Number(minBedrooms)) return false;
      if (Number(minParkingSpots) > 0 && (p.parkingSpots || 0) < Number(minParkingSpots)) return false;
      return true;
    });
  }, [properties, activeTab, selectedSubTypes, selectedType, minBedrooms, minParkingSpots]);

  // Extração das Localizações Reais existentes no Pool de Localização
  const realLocations = useMemo(() => {
    const locMap = new Map();
    locationContextProperties.forEach(p => {
      const city = p.city || 'São Paulo';
      const state = p.state || 'SP';
      const neighborhood = p.neighborhood || 'Centro';

      // Chave do Bairro
      const nKey = `BAIRRO|${neighborhood}|${city}|${state}`;
      if (!locMap.has(nKey)) {
        locMap.set(nKey, {
          neighborhood,
          city,
          state,
          label: `${neighborhood}, ${city} - ${state}`,
          type: 'Bairro',
          count: 0
        });
      }
      locMap.get(nKey).count += 1;

      // Chave da Cidade
      const cKey = `CIDADE|${city}|${state}`;
      if (!locMap.has(cKey)) {
        locMap.set(cKey, {
          neighborhood: '',
          city,
          state,
          label: `Toda a cidade de ${city} - ${state}`,
          type: 'Cidade',
          count: 0
        });
      }
      locMap.get(cKey).count += 1;
    });

    return Array.from(locMap.values());
  }, [locationContextProperties]);

  // Bairros Reais Mais Populares (100% extraídos dos imóveis cadastrados)
  const topRealNeighborhoods = useMemo(() => {
    const nMap = new Map();
    locationContextProperties.forEach(p => {
      if (p.neighborhood) {
        const full = `${p.neighborhood}, ${p.city || 'São Paulo'}`;
        nMap.set(full, (nMap.get(full) || 0) + 1);
      }
    });
    return Array.from(nMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [locationContextProperties]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return realLocations.slice(0, 8);
    }
    const normQuery = normalize(searchQuery);
    const queryTerms = normQuery.split(' ').filter(t => t.length > 0);

    return realLocations.filter(item => {
      const full = normalize(`${item.label} ${item.city} ${item.neighborhood || ''} ${item.state}`);
      return queryTerms.every(term => full.includes(term));
    });
  }, [realLocations, searchQuery]);

  // 3. POOL PARA QUARTOS: Imóveis filtrados por Categorias + Localização + Vagas + Aba
  const bedroomContextProperties = useMemo(() => {
    return properties.filter(p => {
      if (!matchesTab(p, activeTab)) return false;
      if (!matchesCategory(p, selectedSubTypes, selectedType)) return false;
      if (!matchesLocation(p, searchQuery)) return false;
      if (Number(minParkingSpots) > 0 && (p.parkingSpots || 0) < Number(minParkingSpots)) return false;
      return true;
    });
  }, [properties, activeTab, selectedSubTypes, selectedType, searchQuery, minParkingSpots]);

  const availableBedroomOptions = useMemo(() => {
    const bedMap = new Map();
    bedroomContextProperties.forEach(p => {
      const beds = Number(p.bedrooms);
      if (beds > 0) {
        bedMap.set(beds, (bedMap.get(beds) || 0) + 1);
      }
    });

    const uniqueBeds = Array.from(bedMap.keys()).sort((a, b) => a - b);
    return uniqueBeds.map(beds => ({
      value: String(beds),
      count: bedMap.get(beds),
      label: `${beds} ${beds === 1 ? 'Quarto' : 'Quartos'} (${bedMap.get(beds)} ${bedMap.get(beds) === 1 ? 'imóvel' : 'imóveis'})`
    }));
  }, [bedroomContextProperties]);

  // 4. POOL PARA VAGAS: Imóveis filtrados por Categorias + Localização + Quartos + Aba
  const parkingContextProperties = useMemo(() => {
    return properties.filter(p => {
      if (!matchesTab(p, activeTab)) return false;
      if (!matchesCategory(p, selectedSubTypes, selectedType)) return false;
      if (!matchesLocation(p, searchQuery)) return false;
      if (Number(minBedrooms) > 0 && (p.bedrooms || 0) < Number(minBedrooms)) return false;
      return true;
    });
  }, [properties, activeTab, selectedSubTypes, selectedType, searchQuery, minBedrooms]);

  const availableParkingOptions = useMemo(() => {
    const parkMap = new Map();
    parkingContextProperties.forEach(p => {
      const spots = Number(p.parkingSpots);
      if (spots > 0) {
        parkMap.set(spots, (parkMap.get(spots) || 0) + 1);
      }
    });

    const uniqueSpots = Array.from(parkMap.keys()).sort((a, b) => a - b);
    return uniqueSpots.map(spots => ({
      value: String(spots),
      count: parkMap.get(spots),
      label: `${spots} ${spots === 1 ? 'Vaga' : 'Vagas'} (${parkMap.get(spots)} ${parkMap.get(spots) === 1 ? 'imóvel' : 'imóveis'})`
    }));
  }, [parkingContextProperties]);

  // 5. POOL TOTAL FINAL (Para contagem do botão de busca)
  const matchingPropertiesCount = useMemo(() => {
    return properties.filter(p => {
      if (!matchesTab(p, activeTab)) return false;
      if (!matchesCategory(p, selectedSubTypes, selectedType)) return false;
      if (!matchesLocation(p, searchQuery)) return false;
      if (Number(minBedrooms) > 0 && (p.bedrooms || 0) < Number(minBedrooms)) return false;
      if (Number(minParkingSpots) > 0 && (p.parkingSpots || 0) < Number(minParkingSpots)) return false;
      return true;
    }).length;
  }, [properties, activeTab, selectedSubTypes, selectedType, searchQuery, minBedrooms, minParkingSpots]);

  // 6. FILTROS RÁPIDOS DINÂMICOS 100% BASEADOS NOS IMÓVEIS CADASTRADOS
  const dynamicQuickPills = useMemo(() => {
    const pillDefs = [
      { id: 'pet', label: '🐾 Pet Friendly', amenity: 'Pet Friendly' },
      { id: 'metro', label: '🚇 Próximo ao Metrô', amenity: 'Próximo ao Metrô (< 10 min a pé)' },
      { id: 'varanda', label: '🥩 Varanda Gourmet', amenity: 'Varanda Gourmet' },
      { id: 'piscina', label: '🏊 Piscina', amenity: 'Piscina' },
      { id: 'mobiliado', label: '🛋️ Mobiliado', amenity: 'Mobiliado' },
      { id: 'sem_fiador', label: '🛡️ Sem Fiador', amenity: 'Aluguel Sem Fiador (Garantia Digital)' },
      { id: 'sol_manha', label: '☀️ Sol da Manhã', amenity: 'Sol da Manhã' },
      { id: 'energia_solar', label: '⚡ Energia Solar', amenity: 'Energia Solar Fotovoltaica' },
      { id: 'academia', label: '🏋️ Academia', amenity: 'Academia Equipada' }
    ];

    return pillDefs.map(pill => {
      const count = categoryContextProperties.filter(p => {
        if (pill.amenity === 'Aluguel Sem Fiador (Garantia Digital)') return p.transactionType === 'Aluguel';
        return (p.amenities || []).some(am => am && am.toLowerCase().includes(pill.amenity.toLowerCase()));
      }).length;
      return { ...pill, count };
    }).filter(p => p.count > 0);
  }, [categoryContextProperties]);

  // Toggle quick amenity pills
  const handleTogglePill = (amenity) => {
    if (!setFilters) return;
    const current = filters.amenities || [];
    if (current.includes(amenity)) {
      setFilters({ ...filters, amenities: current.filter(a => a !== amenity) });
    } else {
      setFilters({ ...filters, amenities: [...current, amenity] });
    }
  };

  const handleSelectLocation = (locText) => {
    setSearchQuery(locText);
    saveRecentSearch(locText);
    setShowSuggestions(false);
  };

  const handleScrollToResults = () => {
    setShowSuggestions(false);
    if (searchQuery) saveRecentSearch(searchQuery);
    window.scrollTo({ top: 520, behavior: 'smooth' });
  };

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%)',
      color: '#ffffff',
      padding: '3.5rem 0 4.5rem 0',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Blur Circles */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 71, 87, 0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero Title & Subtitle */}
        <div style={{ textAlign: 'center', maxWidth: '950px', margin: '0 auto 2.5rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '999px', color: '#38bdf8', fontSize: 'clamp(0.75rem, 1vw, 0.85rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
            <Sparkles size={14} />
            <span>O Portal Unificado dos 6 Maiores Players do Brasil</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.9rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Compre, Alugue ou Invista nos Melhores Imóveis do Brasil
          </h1>

          <p style={{
            fontSize: 'clamp(0.9rem, 1.3vw, 1.15rem)',
            color: '#cbd5e1',
            maxWidth: '750px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Mais de <strong style={{ color: '#38bdf8' }}>{properties.length} imóveis verificados</strong> com dados 100% verídicos e busca inteligente em tempo real.
          </p>
        </div>

        {/* Unified Search Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          padding: '1.75rem',
          maxWidth: '1080px',
          margin: '0 auto',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          {/* 6 Tabs de Transação */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '1.5rem'
          }}>
            {[
              { id: 'Todos', label: 'Todos', icon: '🌐' },
              { id: 'Comprar', label: 'Comprar', icon: '🏡' },
              { id: 'Alugar', label: 'Alugar', icon: '🔑' },
              { id: 'Lançamentos', label: 'Lançamentos', icon: '🏗️' },
              { id: 'Temporada', label: 'Temporada', icon: '🏖️' },
              { id: 'Imóvel Novo', label: 'Imóvel Novo', icon: '✨' },
              { id: 'Leilão', label: 'Leilão', icon: '⚖️' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: 'var(--radius-sm)',
                  border: activeTab === tab.id ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                  backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--bg-main)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Linha Principal de Busca (1º Tipo -> 2º Localização -> 3º Quartos -> 4º Vagas) */}
          <div className="flex-column-mobile" style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* 1. Tipo de Imóvel (Categorias com contagem reativa) */}
            <div style={{ position: 'relative', flex: '1.2 1 220px', width: '100%' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'block' }}>
                Tipo de Imóvel (Categorias)
              </label>
              <ImovelwebCategoryDropdown
                selectedSubTypes={selectedSubTypes}
                onChangeSelectedSubTypes={setSelectedSubTypes}
                isDropdown={true}
                properties={categoryContextProperties}
              />
            </div>

            {/* 2. Localização (Cidade, Bairro ou Código do Imóvel) */}
            <div style={{ position: 'relative', flex: '2 1 280px', width: '100%' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'block' }}>
                Localização ou Código do Imóvel
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary-light)' }} />
                <input
                  type="text"
                  placeholder="Bairro, cidade ou código (ex: HUB-1061)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  style={{
                    width: '100%',
                    paddingLeft: '38px',
                    paddingRight: searchQuery ? '36px' : '12px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown Inteligente: Recentes + Tendências + Locais Reais */}
              {showSuggestions && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  zIndex: 50,
                  marginTop: '0.3rem',
                  maxHeight: '290px',
                  overflowY: 'auto'
                }}>
                  {/* Seção 1: Buscas Recentes */}
                  {!searchQuery && recentSearches.length > 0 && (
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.9rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <History size={12} />
                          <span>Buscas Recentes</span>
                        </span>
                        <button onClick={handleClearRecentSearches} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem' }}>
                          Limpar
                        </button>
                      </div>
                      {recentSearches.map((rec, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectLocation(rec)}
                          style={{ padding: '0.45rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <History size={13} color="var(--text-muted)" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Seção 2: Bairros em Alta (100% Reais com Imóveis Cadastrados) */}
                  {!searchQuery && topRealNeighborhoods.length > 0 && (
                    <div style={{ borderBottom: '1px solid var(--border-color)', padding: '0.5rem 0.9rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <TrendingUp size={12} color="#f59e0b" />
                        <span>Bairros com Mais Imóveis</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {topRealNeighborhoods.map((tb, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectLocation(tb.name)}
                            style={{
                              fontSize: '0.74rem',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              backgroundColor: 'rgba(59, 130, 246, 0.08)',
                              border: '1px solid rgba(59, 130, 246, 0.2)',
                              color: 'var(--color-primary-light)',
                              cursor: 'pointer',
                              fontWeight: 700
                            }}
                          >
                            {tb.name} ({tb.count})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Seção 3: Localizações Reais Filtradas */}
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectLocation(item.neighborhood ? `${item.neighborhood}, ${item.city}` : item.city)}
                        style={{
                          padding: '0.65rem 1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: idx < filteredSuggestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <MapPin size={15} color="var(--color-primary-light)" />
                          <div>
                            <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                              {item.neighborhood ? item.neighborhood : item.city}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                              {item.neighborhood ? `${item.city} - ${item.state}` : `(${item.state})`}
                            </span>
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.7rem',
                          backgroundColor: 'rgba(59, 130, 246, 0.12)',
                          color: 'var(--color-primary-light)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          fontWeight: 800
                        }}>
                          {item.count} {item.count === 1 ? 'imóvel' : 'imóveis'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Nenhum imóvel encontrado nesta localização com os filtros atuais.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Quartos */}
            <div style={{ flex: '1 1 120px', width: '100%' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'block' }}>
                Quartos
              </label>
              <select
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <option value="0">
                  {availableBedroomOptions.length > 0 ? 'Qualquer' : 'Nenhum'}
                </option>
                {availableBedroomOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Vagas de Garagem */}
            <div style={{ flex: '1 1 120px', width: '100%' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'block' }}>
                Vagas
              </label>
              <select
                value={minParkingSpots}
                onChange={(e) => setMinParkingSpots && setMinParkingSpots(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <option value="0">
                  {availableParkingOptions.length > 0 ? 'Qualquer' : 'Nenhuma'}
                </option>
                {availableParkingOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pílulas de Filtros Rápidos com 1 Clique (Quick Filter Pills) */}
          <div style={{
            marginTop: '1.15rem',
            paddingTop: '0.9rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem'
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap', marginRight: '0.3rem' }}>
              Filtros Rápidos:
            </span>
            {dynamicQuickPills.map(pill => {
              const isActive = (filters.amenities || []).includes(pill.amenity);
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => handleTogglePill(pill.amenity)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    border: isActive ? '1.5px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                    backgroundColor: isActive ? 'var(--color-primary-light)' : 'var(--bg-main)',
                    color: isActive ? '#ffffff' : 'var(--text-main)',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isActive && <Check size={12} strokeWidth={3} />}
                  <span>{pill.label}</span>
                  <span style={{
                    fontSize: '0.66rem',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '999px',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(148, 163, 184, 0.15)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: 800
                  }}>
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Row & Botão de Busca com Contador Dinâmico */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Filter Drawer Toggle & Saved Searches Button & Raio Modal */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-outline"
                onClick={onOpenFilters}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <SlidersHorizontal size={17} color="var(--color-primary-light)" />
                <span>Filtros Avançados</span>
              </button>

              <button
                className="btn btn-outline"
                onClick={onOpenRadiusModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  borderColor: activeRadiusFilter ? 'var(--color-primary-light)' : 'var(--border-color)',
                  backgroundColor: activeRadiusFilter ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: activeRadiusFilter ? 'var(--color-primary-light)' : 'var(--text-main)'
                }}
                title="Filtrar por raio de distância do trabalho ou escola"
              >
                <Compass size={17} color="var(--color-primary-light)" />
                <span>{activeRadiusFilter ? `Raio (${activeRadiusFilter.radiusKm}km)` : 'Buscar por Raio'}</span>
              </button>

              <button
                className="btn btn-outline"
                onClick={onOpenSavedSearches}
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', borderColor: '#38bdf8', color: '#38bdf8' }}
                title="Salvar esta busca para receber alertas"
              >
                <Bookmark size={17} />
                <span>Salvar Busca</span>
              </button>
            </div>

            {/* Dynamic Result Counter CTA Button */}
            <button
              className="btn btn-primary"
              onClick={handleScrollToResults}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                flex: '1 1 auto',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Search size={18} />
              <span>
                {matchingPropertiesCount > 0 
                  ? `Ver ${matchingPropertiesCount} ${matchingPropertiesCount === 1 ? 'Imóvel Encontrado' : 'Imóveis Encontrados'} ➔`
                  : 'Nenhum imóvel com estes filtros'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
