import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  ArrowLeftRight, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Calculator, 
  Sparkles, 
  MessageSquare, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Video,
  Layers
} from 'lucide-react';
import FloorPlansWidget from '../components/FloorPlansWidget';
import ConstructionTimelineWidget from '../components/ConstructionTimelineWidget';

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube-nocookie.com/embed/${match[2]}` : null;
}

export default function PropertyDetailPage({
  property,
  onNavigateHome,
  onNavigateBroker,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onOpenScheduler,
  onOpenCalculator,
  onOpenChat,
  onOpenVirtualTour,
  onOpenItbiCalculator,
  onOpenFormalProposal,
  onOpenPdfSheet,
  onOpenRoiCalculator,
  onOpenInteractiveFloorPlan
}) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!property) return null;

  const advertiser = property.advertiser || {
    name: 'Proprietário Anunciante',
    type: 'Anunciante Verificado',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    creci: null
  };

  const isFav = typeof isFavorite === 'function' ? isFavorite(property.id) : (Array.isArray(isFavorite) ? isFavorite.includes(property.id) : false);
  const isComp = typeof isCompared === 'function' ? isCompared(property.id) : (Array.isArray(isCompared) ? isCompared.includes(property.id) : false);

  const imagesList = (Array.isArray(property.images) && property.images.length > 0)
    ? property.images
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'];
  const amenitiesList = Array.isArray(property.amenities) ? property.amenities : [];

  const safeArea = property.area || 1;
  const safePrice = property.price || 0;
  const safeRentPrice = property.rentPrice || property.price || 0;

  const pricePerM2 = property.transactionType === 'Venda'
    ? Math.round(safePrice / safeArea)
    : Math.round(safeRentPrice / safeArea);

  const mainPriceFormatted = property.transactionType === 'Venda'
    ? `R$ ${safePrice.toLocaleString('pt-BR')}`
    : `R$ ${safeRentPrice.toLocaleString('pt-BR')}/mês`;

  const totalMonthly = property.transactionType === 'Aluguel'
    ? (safeRentPrice + (property.condoFee || 0) + (property.iptu || 0))
    : null;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', flex: 1 }}>
      {/* Breadcrumb & Navigation Back */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={onNavigateHome}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>Voltar para Todos os Imóveis</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onToggleCompare(property.id)}
            className="btn btn-outline btn-sm"
          >
            <ArrowLeftRight size={16} />
            <span>{isComp ? 'No Comparador' : 'Comparar Lado a Lado'}</span>
          </button>
          <button
            onClick={() => onToggleFavorite(property.id)}
            className="btn btn-outline btn-sm"
            style={{ color: isFav ? 'var(--color-accent)' : 'currentColor' }}
          >
            <Heart size={16} fill={isFav ? 'var(--color-accent)' : 'none'} />
            <span>{isFav ? 'Salvo nos Favoritos' : 'Favoritar'}</span>
          </button>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '480px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          marginBottom: '0.85rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <img
            src={imagesList[selectedImage] || imagesList[0]}
            alt={property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {imagesList.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage(prev => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => setSelectedImage(prev => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {imagesList.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt=""
              onClick={() => setSelectedImage(idx)}
              style={{
                width: '110px',
                height: '75px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                cursor: 'pointer',
                border: selectedImage === idx ? '3px solid var(--color-primary-light)' : '2px solid transparent',
                opacity: selectedImage === idx ? 1 : 0.6,
                transition: 'all 0.15s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Split Details Column */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem'
      }}>
        {/* Left Column */}
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-quinto">
              <ShieldCheck size={14} />
              <span>Imóvel Verificado</span>
            </span>
            <span className="badge badge-viva">{property.type}</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem' }}>
            {property.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.75rem' }}>
            <MapPin size={18} color="var(--color-primary-light)" />
            <span>{property.address} - {property.neighborhood}, {property.city} ({property.state})</span>
          </div>

          {/* Análise de Preço ImóvelHUB */}
          {property.loftValuation && (
            <div style={{
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} color="var(--color-loft)" />
                <strong style={{ color: 'var(--color-loft)', fontSize: '1.05rem' }}>
                  Análise de Preço ImóvelHUB: {property.loftValuation.status}
                </strong>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Este imóvel está cotado a <strong>R$ {pricePerM2.toLocaleString('pt-BR')}/m²</strong>, estando <strong>{Math.abs(property.loftValuation.diffPercent)}% abaixo da média</strong> praticada em {property.neighborhood}.
              </p>
              <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', backgroundColor: 'var(--color-loft)', borderRadius: '4px' }} />
              </div>
            </div>
          )}

          {/* YouTube Tour Video Section */}
          {property.youtubeUrl && getYouTubeEmbedUrl(property.youtubeUrl) && (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.75rem'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={20} color="#ef4444" />
                <span>Tour Virtual &amp; Vídeo do Imóvel</span>
              </h3>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
                <iframe
                  src={getYouTubeEmbedUrl(property.youtubeUrl)}
                  title="Tour Virtual do Imóvel"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>
          )}

          {/* Specifications Pills (Dynamically hides empty/zero attributes) */}
          {(() => {
            const detailSpecs = [
              { label: 'Área Útil', value: property.area ? `${property.area} m²` : null },
              { label: property.suites ? `Quartos (${property.suites} suítes)` : 'Quartos', value: (property.bedrooms && Number(property.bedrooms) > 0) ? property.bedrooms : null },
              { label: 'Banheiros', value: (property.bathrooms && Number(property.bathrooms) > 0) ? property.bathrooms : null },
              { label: 'Vagas de Garagem', value: (property.parkingSpots && Number(property.parkingSpots) > 0) ? property.parkingSpots : null }
            ].filter(s => s.value !== null);

            if (detailSpecs.length === 0) return null;

            return (
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${detailSpecs.length}, 1fr)`,
                gap: '1rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.75rem',
                textAlign: 'center'
              }}>
                {detailSpecs.map((s, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: '1.2rem', display: 'block' }}>{s.value}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.85rem' }}>Sobre o Imóvel</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
              {property.description}
            </p>
          </div>

          {/* Amenities & Comodidades */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.85rem' }}>Características e Lazer</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.85rem'
            }}>
              {amenitiesList.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}>
                  <CheckCircle2 size={16} color="var(--color-quinto)" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Construction Progress Widget */}
          <ConstructionTimelineWidget property={property} />

          {/* Interactive Floor Plans Widget */}
          <FloorPlansWidget property={property} />
        </div>

        {/* Right Sticky Sidebar */}
        <div>
          <div style={{
            position: 'sticky',
            top: '90px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Valor de {property.transactionType}
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.1 }}>
                {mainPriceFormatted}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Condomínio: <strong>R$ {property.condoFee || 0}</strong> • IPTU: <strong>R$ {property.iptu || 0}/mês</strong>
                {totalMonthly && (
                  <div style={{ color: 'var(--color-primary-light)', fontWeight: 700, marginTop: '0.25rem' }}>
                    Pacote Total Estimado: R$ {totalMonthly.toLocaleString('pt-BR')}/mês
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => onOpenScheduler(property)}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center' }}
              >
                <Calendar size={20} />
                <span>Agendar Visita Presencial</span>
              </button>

              <button
                className="btn btn-accent"
                onClick={() => onOpenFormalProposal && onOpenFormalProposal(property)}
                style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
              >
                <FileText size={18} />
                <span>Fazer Proposta Formal de Compra</span>
              </button>

              <button
                className="btn btn-outline"
                onClick={() => onOpenChat && onOpenChat(property)}
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
              >
                <MessageSquare size={18} />
                <span>Chat em Tempo Real com Anunciante</span>
              </button>

              <button
                className="btn btn-outline"
                onClick={() => onOpenCalculator && onOpenCalculator(property)}
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
              >
                <Calculator size={18} />
                <span>Simular Financiamento Multi-Bancos</span>
              </button>

              <button
                className="btn btn-outline"
                onClick={() => onOpenItbiCalculator && onOpenItbiCalculator(property)}
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
              >
                <Calculator size={18} />
                <span>Simulador de ITBI &amp; Escritura</span>
              </button>

              {property.hasVirtualTour && (
                <button
                  className="btn btn-outline"
                  onClick={() => onOpenVirtualTour && onOpenVirtualTour(property)}
                  style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', borderColor: '#8b5cf6', color: '#8b5cf6' }}
                >
                  <Video size={18} />
                  <span>Tour Virtual 360° Imersivo</span>
                </button>
              )}

              <button
                className="btn btn-outline"
                onClick={() => onOpenRoiCalculator && onOpenRoiCalculator(property)}
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', borderColor: '#10b981', color: '#10b981' }}
              >
                <Sparkles size={18} />
                <span>Calcular ROI &amp; Yield de Aluguel</span>
              </button>

              <button
                className="btn btn-outline"
                onClick={() => onOpenInteractiveFloorPlan && onOpenInteractiveFloorPlan(property)}
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', borderColor: '#0284c7', color: '#0284c7' }}
              >
                <Layers size={18} />
                <span>Planta Baixa Interativa</span>
              </button>

              <button
                className="btn btn-outline"
                onClick={() => onOpenPdfSheet && onOpenPdfSheet(property)}
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
              >
                <FileText size={18} />
                <span>Baixar Ficha Técnica em PDF / QR Code</span>
              </button>
            </div>

            {/* Advertiser Card Link */}
            <div
              onClick={() => onNavigateBroker && onNavigateBroker(advertiser)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '1rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                transition: 'background 0.15s ease'
              }}
            >
              <img
                src={advertiser.avatar}
                alt={advertiser.name}
                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <strong style={{ fontSize: '0.95rem', display: 'block' }}>{advertiser.name}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {advertiser.type} {advertiser.creci ? `• CRECI ${advertiser.creci}` : ''}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                  Ver perfil e carteira de imóveis →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
