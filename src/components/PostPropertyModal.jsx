import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  CheckCircle, 
  Upload, 
  Home, 
  MapPin, 
  DollarSign, 
  Image as ImageIcon, 
  Search, 
  Loader2,
  Video,
  Trash2,
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';
import { fetchAddressByCep } from '../services/api';

export default function PostPropertyModal({
  currentUser,
  properties = [],
  onClose,
  onAddProperty
}) {
  const [step, setStep] = useState(1);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cep, setCep] = useState('');
  
  // Images list (multiple images)
  const [imagesList, setImagesList] = useState([
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    type: 'Apartamento',
    subType: 'Padrão',
    transactionType: 'Venda',
    price: '',
    rentPrice: '',
    condoFee: '',
    iptu: '',
    area: '',
    bedrooms: '2',
    suites: '1',
    bathrooms: '2',
    parkingSpots: '1',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Pinheiros',
    address: '',
    description: '',
    youtubeUrl: '',
    advertiserName: currentUser?.name || '',
    advertiserPhone: currentUser?.phone || ''
  });

  const handleApplyTemplate = (modelKey) => {
    if (modelKey === 'apartamento') {
      setFormData({
        title: 'Apartamento de Alto Padrão com Varanda Gourmet em Moema',
        type: 'Apartamento',
        subType: 'Padrão',
        transactionType: 'Venda',
        price: '950000',
        rentPrice: '',
        condoFee: '850',
        iptu: '290',
        area: '96',
        bedrooms: '3',
        suites: '1',
        bathrooms: '2',
        parkingSpots: '2',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Moema',
        address: 'Alameda dos Maracatins, 1100',
        description: 'Espetacular apartamento em andar alto, totalmente reformado com marcenaria planejada, varanda envidraçada integrada à sala e condomínio com lazer de clube completo (piscina aquecida, academia de ponta e espaço gourmet).',
        youtubeUrl: '',
        advertiserName: currentUser?.name || 'Alex Sandro',
        advertiserPhone: currentUser?.phone || '(11) 97591-3968'
      });
      setCep('04089000');
      setImagesList([
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
      ]);
    } else if (modelKey === 'casa') {
      setFormData({
        title: 'Casa Contemporânea em Condomínio Fechado com Piscina',
        type: 'Casa',
        subType: 'Condomínio Fechado',
        transactionType: 'Venda',
        price: '1450000',
        rentPrice: '',
        condoFee: '620',
        iptu: '350',
        area: '240',
        bedrooms: '4',
        suites: '2',
        bathrooms: '4',
        parkingSpots: '3',
        city: 'Campinas',
        state: 'SP',
        neighborhood: 'Gramado',
        address: 'Rua das Palmeiras Imperiais, 450',
        description: 'Belíssima residência moderna com pé-direito duplo, sala integrada, cozinha americana com ilha gourmet, piscina privativa com deck molhado e segurança 24h blindada.',
        youtubeUrl: '',
        advertiserName: currentUser?.name || 'Alex Sandro',
        advertiserPhone: currentUser?.phone || '(11) 97591-3968'
      });
      setCep('13092599');
      setImagesList([
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
      ]);
    } else if (modelKey === 'aluguel') {
      setFormData({
        title: 'Studio Mobiliado Smart Home Próximo ao Metrô Pinheiros',
        type: 'Apartamento',
        subType: 'Studio / Loft',
        transactionType: 'Aluguel',
        price: '',
        rentPrice: '3200',
        condoFee: '480',
        iptu: '90',
        area: '38',
        bedrooms: '1',
        suites: '1',
        bathrooms: '1',
        parkingSpots: '1',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Pinheiros',
        address: 'Rua dos Pinheiros, 750',
        description: 'Studio 100% mobiliado e equipado com ar-condicionado, fechadura digital, Smart TV, eletrodomésticos em inox e varanda com vista livre. Aluguel sem fiador com aprovação digital instantânea.',
        youtubeUrl: '',
        advertiserName: currentUser?.name || 'Alex Sandro',
        advertiserPhone: currentUser?.phone || '(11) 97591-3968'
      });
      setCep('05422001');
      setImagesList([
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
      ]);
    }
  };

  const handleSearchCep = async (cepInput) => {
    setCep(cepInput);
    const clean = cepInput.replace(/\D/g, '');
    if (clean.length === 8) {
      setLoadingCep(true);
      const data = await fetchAddressByCep(clean);
      setLoadingCep(false);
      if (data) {
        setFormData(prev => ({
          ...prev,
          city: data.city || prev.city,
          state: data.state || prev.state,
          neighborhood: data.neighborhood || prev.neighborhood,
          address: data.street || prev.address
        }));
      }
    }
  };

  // Image File Upload Handler (Base64)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImagesList(prev => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setImagesList(prev => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  const handleRemoveImage = (index) => {
    if (imagesList.length <= 1) {
      alert('O imóvel precisa ter pelo menos 1 imagem.');
      return;
    }
    setImagesList(prev => prev.filter((_, idx) => idx !== index));
  };

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdCode, setCreatedCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    let nextNum = 1062;
    if (Array.isArray(properties) && properties.length > 0) {
      const nums = properties
        .map(p => {
          const match = (p.code || '').match(/HUB-(\d+)/i);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(n => n > 0);
      if (nums.length > 0) {
        nextNum = Math.max(...nums) + 1;
      }
    }
    const generatedCode = `HUB-${nextNum}`;
    setCreatedCode(generatedCode);
    // Resolve real geocoded coordinates based on selected city/state
    const cityCoords = {
      'São Paulo': { lat: -23.5505, lng: -46.6333 },
      'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
      'Curitiba': { lat: -25.4284, lng: -49.2733 },
      'Belo Horizonte': { lat: -19.9167, lng: -43.9345 },
      'Porto Alegre': { lat: -30.0346, lng: -51.2177 },
      'Brasília': { lat: -15.7975, lng: -47.8919 },
      'Salvador': { lat: -12.9777, lng: -38.5016 },
      'Florianópolis': { lat: -27.5954, lng: -48.5480 },
      'Fortaleza': { lat: -3.7319, lng: -38.5267 },
      'Recife': { lat: -8.0476, lng: -34.8770 },
      'Goiânia': { lat: -16.6869, lng: -49.2648 },
      'Campinas': { lat: -22.9056, lng: -47.0608 },
      'Santos': { lat: -23.9608, lng: -46.3336 }
    };

    let targetLat = -23.5505;
    let targetLng = -46.6333;

    if (formData.city && cityCoords[formData.city]) {
      targetLat = cityCoords[formData.city].lat;
      targetLng = cityCoords[formData.city].lng;
    } else if (formData.state === 'PR') {
      targetLat = -25.4284; targetLng = -49.2733;
    } else if (formData.state === 'RJ') {
      targetLat = -22.9068; targetLng = -43.1729;
    } else if (formData.state === 'MG') {
      targetLat = -19.9167; targetLng = -43.9345;
    } else if (formData.state === 'RS') {
      targetLat = -30.0346; targetLng = -51.2177;
    }

    const newProp = {
      id: `prop-${Date.now()}`,
      code: generatedCode,
      userId: currentUser ? currentUser.id : null,
      title: formData.title || 'Imóvel Anunciado no ImóvelHUB',
      type: formData.type || 'Apartamento',
      subType: formData.subType || 'Padrão',
      transactionType: formData.transactionType,
      price: formData.transactionType === 'Venda' ? Number(formData.price || 500000) : null,
      rentPrice: formData.transactionType === 'Aluguel' ? Number(formData.rentPrice || 2500) : null,
      condoFee: Number(formData.condoFee || 500),
      iptu: Number(formData.iptu || 150),
      area: Number(formData.area || 65),
      bedrooms: formData.type === 'Terreno' || formData.type === 'Comercial' ? null : (formData.bedrooms ? Number(formData.bedrooms) : null),
      suites: formData.type === 'Terreno' || formData.type === 'Comercial' ? null : (formData.suites ? Number(formData.suites) : null),
      bathrooms: formData.type === 'Terreno' ? null : (formData.bathrooms ? Number(formData.bathrooms) : null),
      parkingSpots: formData.type === 'Terreno' ? null : (formData.parkingSpots ? Number(formData.parkingSpots) : null),
      city: formData.city,
      state: formData.state,
      neighborhood: formData.neighborhood,
      address: formData.address || `${formData.neighborhood}, ${formData.city}`,
      lat: Number((targetLat + (Math.random() - 0.5) * 0.02).toFixed(6)),
      lng: Number((targetLng + (Math.random() - 0.5) * 0.02).toFixed(6)),
      isVerifiedHub: true,
      isVerifiedQuintoAndar: true,
      isLaunch: false,
      priceReduced: false,
      oldPrice: null,
      youtubeUrl: formData.youtubeUrl || null,
      loftValuation: {
        status: "Novo Anúncio",
        diffPercent: -2.0,
        neighborhoodAvgPerM2: 10000
      },
      description: formData.description || 'Excelente imóvel recém anunciado. Entre em contato para agendar uma visita.',
      amenities: ["Varanda", "Portaria 24h", "Armários Planejados", "Pet Friendly"],
      images: imagesList.length > 0 ? imagesList : [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
      ],
      advertiser: {
        name: currentUser?.name || formData.advertiserName || 'Proprietário Anunciante',
        email: currentUser?.email || '',
        type: currentUser?.role === 'broker' ? 'Corretor' : currentUser?.role === 'agency' ? 'Imobiliária' : 'Proprietário',
        creci: currentUser?.creci || null,
        phone: currentUser?.phone || formData.advertiserPhone || '(11) 99999-8888',
        whatsapp: (currentUser?.phone || formData.advertiserPhone || '5511999998888').replace(/\D/g, ''),
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      },
      publishedAt: new Date().toISOString().split('T')[0]
    };

    setIsSuccess(true);
    setTimeout(() => {
      onAddProperty(newProp);
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1300 }} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '720px', padding: 0 }} onClick={(e) => e.stopPropagation()}>
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
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: 'var(--color-primary)', color: '#fff' }}>
              <PlusCircle size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Cadastrar Novo Imóvel no ImóvelHUB</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cadastre seu anúncio completo com fotos em alta definição e vídeo do YouTube</span>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', maxHeight: 'calc(88vh - 80px)', overflowY: 'auto' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(5, 150, 105, 0.15)',
                color: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Anúncio Publicado com Sucesso!</h3>
              {createdCode && (
                <div style={{ margin: '0.8rem 0' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Código exclusivo gerado:</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, backgroundColor: 'rgba(15,23,42,0.95)', color: '#38bdf8', padding: '0.35rem 0.85rem', borderRadius: '6px' }}>
                    {createdCode}
                  </span>
                </div>
              )}
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                Seu imóvel já está ativo nos resultados de busca com selo verificado do ImóvelHUB.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step indicator */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: step >= 1 ? 'var(--color-primary)' : 'var(--border-color)' }} />
                <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: step >= 2 ? 'var(--color-primary)' : 'var(--border-color)' }} />
              </div>

              {step === 1 && (
                <div>
                  {/* Cadastrar Modelo Quick-Fill Box */}
                  <div style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Sparkles size={20} color="var(--color-primary-light)" />
                      <div>
                        <strong style={{ fontSize: '0.88rem', display: 'block', color: 'var(--text-main)' }}>
                          ⚡ Cadastrar com Modelo (Preenchimento Rápido)
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Clique em um modelo para preencher todos os dados, fotos e valores automaticamente:
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleApplyTemplate('apartamento')}
                        style={{ fontSize: '0.76rem', borderColor: 'var(--color-primary-light)', color: 'var(--color-primary-light)', fontWeight: 700 }}
                      >
                        🏢 Modelo Apartamento
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleApplyTemplate('casa')}
                        style={{ fontSize: '0.76rem', borderColor: '#059669', color: '#059669', fontWeight: 700 }}
                      >
                        🏡 Modelo Casa
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleApplyTemplate('aluguel')}
                        style={{ fontSize: '0.76rem', borderColor: '#f59e0b', color: '#f59e0b', fontWeight: 700 }}
                      >
                        🔑 Modelo Aluguel
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Etapa 1: Tipo e Valor do Imóvel</h3>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Finalidade</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['Venda', 'Aluguel'].map(t => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setFormData({ ...formData, transactionType: t })}
                          style={{
                            flex: 1,
                            padding: '0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            border: formData.transactionType === t ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                            backgroundColor: formData.transactionType === t ? 'var(--color-primary)' : 'var(--bg-card)',
                            color: formData.transactionType === t ? '#ffffff' : 'var(--text-main)',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Título do Anúncio</label>
                    <input
                      type="text"
                      placeholder="Ex: Lindo Apartamento em Moema com 2 suítes e varanda"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Tipo de Imóvel</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        style={{ width: '100%' }}
                      >
                        <option value="Apartamento">Apartamento</option>
                        <option value="Casa">Casa</option>
                        <option value="Cobertura">Cobertura</option>
                        <option value="Studio">Studio / Kitnet</option>
                        <option value="Terreno">Terreno</option>
                        <option value="Comercial">Comercial</option>
                        <option value="Rural">Rural</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                        {formData.transactionType === 'Venda' ? 'Valor de Venda (R$)' : 'Valor de Aluguel (R$)'}
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 750000"
                        value={formData.transactionType === 'Venda' ? formData.price : formData.rentPrice}
                        onChange={(e) => setFormData({
                          ...formData,
                          [formData.transactionType === 'Venda' ? 'price' : 'rentPrice']: e.target.value
                        })}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Condomínio (R$ / mês)</label>
                      <input
                        type="number"
                        placeholder="Ex: 650"
                        value={formData.condoFee}
                        onChange={(e) => setFormData({ ...formData, condoFee: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>IPTU (R$ / ano)</label>
                      <input
                        type="number"
                        placeholder="Ex: 180"
                        value={formData.iptu}
                        onChange={(e) => setFormData({ ...formData, iptu: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (!formData.title || (!formData.price && !formData.rentPrice)) {
                        alert("Por favor, preencha o título e o valor do imóvel.");
                        return;
                      }
                      setStep(2);
                    }}
                    style={{ width: '100%', fontWeight: 800 }}
                  >
                    Continuar para Mídias &amp; Localização ➔
                  </button>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Etapa 2: Mídias, Localização &amp; Detalhes</h3>

                  {/* SEÇÃO DE MÍDIA: IMAGENS & VÍDEO DO YOUTUBE */}
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      <ImageIcon size={18} color="var(--color-primary-light)" />
                      <strong style={{ fontSize: '0.9rem' }}>Fotos e Mídia do Imóvel ({imagesList.length} adicionadas)</strong>
                    </div>

                    {/* File Upload Button + URL Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <label 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.55rem 1rem',
                            backgroundColor: 'var(--color-primary)',
                            color: '#ffffff',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: 700
                          }}
                        >
                          <Upload size={15} />
                          <span>Fazer Upload de Fotos</span>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={handleFileUpload} 
                            style={{ display: 'none' }} 
                          />
                        </label>
                      </div>

                      {/* Add Image by URL */}
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <input
                          type="url"
                          placeholder="Ou cole o link direto da imagem (URL https://...)"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          style={{ flex: 1, fontSize: '0.8rem', padding: '0.45rem 0.6rem' }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={handleAddImageUrl}
                          style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                        >
                          + Adicionar URL
                        </button>
                      </div>
                    </div>

                    {/* Preview Gallery Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.65rem' }}>
                      {imagesList.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', height: '75px', borderRadius: '6px', overflow: 'hidden', border: idx === 0 ? '2px solid var(--color-primary)' : '1px solid var(--border-color)' }}>
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {idx === 0 && (
                            <span style={{ position: 'absolute', bottom: 2, left: 2, backgroundColor: 'rgba(30, 58, 138, 0.9)', color: '#fff', fontSize: '0.6rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>
                              Capa
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            style={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              background: 'rgba(239, 68, 68, 0.85)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              padding: 0
                            }}
                            title="Remover Foto"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* YOUTUBE VIDEO LINK */}
                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                        <Video size={16} color="#ef4444" />
                        <span>Link do Vídeo do YouTube (Tour Virtual / Apresentação)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ ou https://youtu.be/..."
                        value={formData.youtubeUrl}
                        onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                        style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem' }}
                      />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                        O vídeo será incorporado diretamente na página de detalhes do imóvel.
                      </span>
                    </div>
                  </div>

                  {/* CEP & Localização */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      CEP do Imóvel (Auto-completar)
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="00000-000"
                        value={cep}
                        onChange={(e) => handleSearchCep(e.target.value)}
                        maxLength={9}
                        style={{ flex: 1 }}
                      />
                      {loadingCep && (
                        <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem' }}>
                          <Loader2 size={20} className="animate-spin" color="var(--color-primary)" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dimensões Adaptativas baseadas no Tipo de Imóvel */}
                  {formData.type === 'Terreno' ? (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Área do Terreno / Lote (m²)</label>
                      <input
                        type="number"
                        placeholder="Ex: 500"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        required
                        style={{ width: '100%' }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                        * Terrenos não exigem quartos, banheiros ou vagas residenciais.
                      </span>
                    </div>
                  ) : formData.type === 'Comercial' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Área Total (m²)</label>
                        <input
                          type="number"
                          placeholder="80"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          required
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Banheiros / Lavabos</label>
                        <input
                          type="number"
                          placeholder="1"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Vagas de Garagem</label>
                        <input
                          type="number"
                          placeholder="2"
                          value={formData.parkingSpots}
                          onChange={(e) => setFormData({ ...formData, parkingSpots: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Área (m²)</label>
                        <input
                          type="number"
                          placeholder="65"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          required
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Quartos</label>
                        <input
                          type="number"
                          placeholder="2"
                          value={formData.bedrooms}
                          onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Banheiros</label>
                        <input
                          type="number"
                          placeholder="2"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Vagas</label>
                        <input
                          type="number"
                          placeholder="1"
                          value={formData.parkingSpots}
                          onChange={(e) => setFormData({ ...formData, parkingSpots: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Cidade</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Bairro</label>
                      <input
                        type="text"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Descrição Detalhada do Imóvel</label>
                      <button
                        type="button"
                        onClick={() => {
                          const t = formData.type || 'Imóvel';
                          const sub = formData.subType ? `(${formData.subType})` : '';
                          const trans = formData.transactionType === 'Aluguel' ? 'locação' : 'venda';
                          const neighborhood = formData.neighborhood || 'bairro nobre';
                          const city = formData.city || 'São Paulo';
                          const area = formData.area ? `${formData.area}m² de área privativa` : 'excelente metragem';
                          const bedrooms = Number(formData.bedrooms) > 0 ? `${formData.bedrooms} dormitório(s)` : '';
                          const suites = Number(formData.suites) > 0 ? `sendo ${formData.suites} suíte(s)` : '';
                          const parking = Number(formData.parkingSpots) > 0 ? `${formData.parkingSpots} vaga(s) de garagem` : '';
                          const price = formData.transactionType === 'Aluguel' ? `R$ ${Number(formData.rentPrice || 0).toLocaleString('pt-BR')}/mês` : `R$ ${Number(formData.price || 0).toLocaleString('pt-BR')}`;

                          const generated = `🌟 Oportunidade Exclusiva para ${trans.toUpperCase()}: ${t} ${sub} em ${neighborhood}, ${city}!\n\n` +
                            `Apresentamos este magnífico imóvel com ${area}${bedrooms ? `, ${bedrooms}` : ''}${suites ? `, ${suites}` : ''}${parking ? ` e ${parking}` : ''}.\n\n` +
                            `✨ Diferenciais & Conforto:\n` +
                            `• Planta inteligente com excelente aproveitamento de espaços e ótima iluminação natural;\n` +
                            `• Localização privilegiada em ${neighborhood}, próximo a serviços essenciais, transporte e lazer;\n` +
                            `• Condição especial de mercado cotado a ${price}.\n\n` +
                            `📅 Agende sua visita online pelo ImóvelHUB e garanta esta oportunidade!`;

                          setFormData(prev => ({ ...prev, description: generated }));
                        }}
                        style={{
                          backgroundColor: 'rgba(56, 189, 248, 0.15)',
                          color: '#0284c7',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '4px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        ✨ Gerar Descrição com IA
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Descreva os diferenciais, comodidades e proximidades..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Seu Nome / Imobiliária</label>
                      <input
                        type="text"
                        placeholder="Ex: Carlos Silva"
                        value={formData.advertiserName}
                        onChange={(e) => setFormData({ ...formData, advertiserName: e.target.value })}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Telefone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="(11) 98888-7777"
                        value={formData.advertiserPhone}
                        onChange={(e) => setFormData({ ...formData, advertiserPhone: e.target.value })}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setStep(1)}
                      style={{ flex: 1 }}
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ flex: 2, fontWeight: 800 }}
                    >
                      Publicar Imóvel com Fotos &amp; Vídeo
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
