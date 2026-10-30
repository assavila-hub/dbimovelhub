import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ArrowLeftRight, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Calculator, 
  MessageCircle, 
  Phone, 
  Share2, 
  TrendingDown, 
  Building2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  Compass,
  MessageSquare,
  FileText,
  FileCheck,
  ClipboardCheck,
  Bell,
  Video,
  Copy,
  Check
} from 'lucide-react';
import FloorPlansWidget from './FloorPlansWidget';
import ConstructionTimelineWidget from './ConstructionTimelineWidget';
import ValuationAndYieldWidget from './ValuationAndYieldWidget';

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube-nocookie.com/embed/${match[2]}` : null;
}

export default function PropertyDetailModal({
  property,
  onClose,
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
  onOpenDigitalContract,
  onOpenRentalGuarantees,
  onOpenDigitalInspection,
  onOpenOpportunityRadar,
  onOpenPdfSheet,
  onOpenRoiCalculator,
  onOpenInteractiveFloorPlan
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!property) return null;

  const imagesList = (Array.isArray(property.images) && property.images.length > 0)
    ? property.images
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'];
  const amenitiesList = Array.isArray(property.amenities) ? property.amenities : [];

  const propCode = property.code || property.id;

  const handleCopyCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(propCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

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
    <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '1000px', padding: 0 }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-main)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-quinto">
              <ShieldCheck size={14} />
              <span>Verificado ImóvelHUB</span>
            </span>
            <button
              onClick={handleCopyCode}
              title="Clique para copiar o código do imóvel"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#38bdf8',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                cursor: 'pointer',
                letterSpacing: '0.5px'
              }}
            >
              {copiedCode ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copiedCode ? 'Código Copiado!' : `Cód: ${propCode}`}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onToggleCompare(property.id)}
              className="btn btn-outline btn-sm"
            >
              <ArrowLeftRight size={16} />
              <span>{isCompared ? 'No Comparador' : 'Comparar'}</span>
            </button>
            <button
              onClick={() => onToggleFavorite(property.id)}
              className="btn btn-outline btn-sm"
              style={{ color: isFavorite ? 'var(--color-accent)' : 'currentColor' }}
            >
              <Heart size={16} fill={isFavorite ? 'var(--color-accent)' : 'none'} />
              <span>{isFavorite ? 'Salvo' : 'Favoritar'}</span>
            </button>
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '0.3rem'
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div style={{ padding: '1.5rem', maxHeight: 'calc(90vh - 80px)', overflowY: 'auto' }}>
          {/* Main Photo Viewer */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '420px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: '#0f172a',
              marginBottom: '0.75rem'
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
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {imagesList.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '90px',
                    height: '65px',
                    borderRadius: 'var(--radius-sm)',
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

          {/* Grid Layout: Left Content & Right Sticky Sidebar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Left Main Details */}
            <div>
              {/* Title & Location */}
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.25 }}>
                {property.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                <MapPin size={18} color="var(--color-primary-light)" />
                <span>{property.address} - {property.neighborhood}, {property.city} ({property.state})</span>
              </div>

              {/* Loft Smart Valuation Box (Loft Differentiation) */}
              {property.loftValuation && (
                <div style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.06)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Sparkles size={18} color="var(--color-loft)" />
                    <strong style={{ color: 'var(--color-loft)', fontSize: '1rem' }}>
                      Análise de Preço ImóvelHUB: {property.loftValuation.status}
                    </strong>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Este imóvel está cotado a <strong>R$ {pricePerM2.toLocaleString('pt-BR')}/m²</strong>, que está cerca de <strong>{Math.abs(property.loftValuation.diffPercent)}% abaixo</strong> da média praticada no bairro {property.neighborhood}.
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
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Video size={20} color="#ef4444" />
                    <span>Tour Virtual &amp; Vídeo do Imóvel (YouTube)</span>
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
                    backgroundColor: 'var(--bg-main)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    {detailSpecs.map((s, idx) => (
                      <div key={idx}>
                        <strong style={{ fontSize: '1.1rem', display: 'block' }}>{s.value}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Description */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Descrição do Imóvel</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {property.description}
                </p>
              </div>

              {/* Amenities & Comodidades */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Características e Lazer</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {amenitiesList.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <CheckCircle2 size={16} color="var(--color-quinto)" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Construction Timeline Widget */}
              <ConstructionTimelineWidget property={property} />

              {/* Interactive Floor Plans Widget */}
              <FloorPlansWidget property={property} />

              {/* Radar do Bairro & Qualidade de Vida (QuintoAndar / Loft) */}
              <div style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Sparkles size={18} color="var(--color-primary-light)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Radar do Bairro {property.neighborhood}</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🚇 Mobilidade / Metrô</div>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>⭐ 4.9 / 5.0</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>A 350m de estação</div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>👮 Segurança do Bairro</div>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-quinto)' }}>⭐ 4.8 / 5.0</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bairro altamente seguro</div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🛒 Comércio & Gastronomia</div>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-accent)' }}>⭐ 4.7 / 5.0</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Alta densidade de serviços</div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🌳 Parques e Lazer</div>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-loft)' }}>⭐ 4.6 / 5.0</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Próximo a praças e parques</div>
                  </div>
                </div>

                {/* IA de Precificação & Análise de Retorno para Investidores (AVM & Yield) */}
                <ValuationAndYieldWidget property={property} />
              </div>
            </div>

            {/* Right Sticky Sidebar (Pricing & Action Widget) */}
            <div>
              <div style={{
                position: 'sticky',
                top: '90px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-lg)'
              }}>
                {/* Price Display */}
                <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Valor de {property.transactionType}
                  </span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.1 }}>
                    {mainPriceFormatted}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Condomínio: <strong>R$ {property.condoFee || 0}</strong> • IPTU: <strong>R$ {property.iptu || 0}/mês</strong>
                  </div>
                  {totalMonthly && (
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-quinto)', marginTop: '0.35rem' }}>
                      Total Pacote Aluguel: R$ {totalMonthly.toLocaleString('pt-BR')}/mês
                    </div>
                  )}
                </div>

                {/* QuintoAndar Schedule Visit Action */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      onClose();
                      onOpenScheduler(property);
                    }}
                    style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center' }}
                  >
                    <Calendar size={18} />
                    <span>Agendar Visita Presencial</span>
                  </button>
                </div>

                {/* Formal Proposal Action */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <button
                    className="btn btn-accent"
                    onClick={() => {
                      onClose();
                      onOpenFormalProposal && onOpenFormalProposal(property);
                    }}
                    style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <FileText size={18} />
                    <span>Fazer Proposta Formal de Compra</span>
                  </button>
                </div>

                {/* Gerador de Contrato Digital */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      onClose();
                      onOpenDigitalContract && onOpenDigitalContract(property);
                    }}
                    style={{ width: '100%', padding: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', borderColor: '#1e3a8a', color: '#1e3a8a', fontWeight: 700 }}
                  >
                    <FileCheck size={16} />
                    <span>Gerar Contrato Digital & Assinar</span>
                  </button>
                </div>

                {/* Garantias Locatícias & Análise de Crédito */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      onClose();
                      onOpenRentalGuarantees && onOpenRentalGuarantees(property);
                    }}
                    style={{ width: '100%', padding: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', borderColor: '#059669', color: '#059669', fontWeight: 700 }}
                  >
                    <ShieldCheck size={16} />
                    <span>Garantias Locatícias (Sem Fiador)</span>
                  </button>
                </div>

                {/* Laudo de Vistoria Digital */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      onClose();
                      onOpenDigitalInspection && onOpenDigitalInspection(property);
                    }}
                    style={{ width: '100%', padding: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', borderColor: '#8b5cf6', color: '#8b5cf6', fontWeight: 700 }}
                  >
                    <ClipboardCheck size={16} />
                    <span>Laudo de Vistoria do Imóvel</span>
                  </button>
                </div>

                {/* Radar de Preço */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      onClose();
                      onOpenOpportunityRadar && onOpenOpportunityRadar(property);
                    }}
                    style={{ width: '100%', padding: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', borderColor: '#ef4444', color: '#ef4444', fontWeight: 700 }}
                  >
                    <Bell size={16} />
                    <span>Ativar Alerta de Queda de Preço</span>
                  </button>
                </div>

                {/* ITBI & Cartório Calculator Trigger */}
                {property.transactionType === 'Venda' && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        onClose();
                        onOpenItbiCalculator && onOpenItbiCalculator(property);
                      }}
                      style={{ width: '100%', padding: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                    >
                      <Calculator size={16} color="var(--color-primary-light)" />
                      <span>Calcular ITBI e Cartório</span>
                    </button>
                  </div>
                )}

                {/* Multi-Banks Mortgage Simulator Trigger */}
                {property.transactionType === 'Venda' && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        onClose();
                        onOpenCalculator(property);
                      }}
                      style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                    >
                      <Calculator size={18} color="var(--color-primary-light)" />
                      <span>Simular Financiamento Multi-Bancos</span>
                    </button>
                  </div>
                )}

                {/* ROI & Yield Calculator Trigger */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      onClose();
                      onOpenRoiCalculator && onOpenRoiCalculator(property);
                    }}
                    style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', borderColor: '#10b981', color: '#10b981' }}
                  >
                    <Sparkles size={18} />
                    <span>Calcular ROI &amp; Yield de Aluguel</span>
                  </button>
                </div>

                {/* Planta Baixa Interativa Trigger */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      onClose();
                      onOpenInteractiveFloorPlan && onOpenInteractiveFloorPlan(property);
                    }}
                    style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', borderColor: '#0284c7', color: '#0284c7' }}
                  >
                    <Layers size={18} />
                    <span>Planta Baixa Interativa</span>
                  </button>
                </div>

                {/* Ficha Técnica em PDF com QR Code */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      onClose();
                      onOpenPdfSheet && onOpenPdfSheet(property);
                    }}
                    style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <FileText size={18} />
                    <span>Baixar Ficha Técnica em PDF / QR Code</span>
                  </button>
                </div>

                {/* Tour Virtual 360° Trigger */}
                <div style={{ marginBottom: '1rem' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      onClose();
                      onOpenVirtualTour && onOpenVirtualTour(property);
                    }}
                    style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', borderColor: 'var(--color-loft)', color: 'var(--color-loft)' }}
                  >
                    <Compass size={18} />
                    <span>Fazer Tour Virtual 360°</span>
                  </button>
                </div>

                {/* Real-time Chat Trigger */}
                <div style={{ marginBottom: '1rem' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      onClose();
                      onOpenChat && onOpenChat(property);
                    }}
                    style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <MessageSquare size={18} />
                    <span>Chat em Tempo Real com Anunciante</span>
                  </button>
                </div>

                {/* Direct WhatsApp Contact Button (OLX / Chaves na Mão) */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <a
                    href={`https://wa.me/${property.advertiser?.whatsapp || '5511999990000'}?text=Olá! Gostaria de informações sobre o imóvel ${encodeURIComponent(property.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      width: '100%',
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      padding: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    <MessageCircle size={18} />
                    <span>Conversar no WhatsApp</span>
                  </a>
                </div>
                {/* Advertiser Reputation Scorecard (Wimoveis Style) */}
                <div style={{
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={property.advertiser?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'}
                      alt={property.advertiser?.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <strong style={{ fontSize: '0.92rem' }}>{property.advertiser?.name}</strong>
                        <ShieldCheck size={16} color="#0284c7" title="Anunciante Verificado CRECI" />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {property.advertiser?.type} {property.advertiser?.creci ? `• CRECI ${property.advertiser.creci}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Wimoveis Response Badges */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ padding: '0.4rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: '#059669', display: 'block', fontWeight: 700 }}>RESPOSTA RÁPIDA</span>
                      <strong style={{ fontSize: '0.82rem', color: '#059669' }}>&lt; 15 min</strong>
                    </div>
                    <div style={{ padding: '0.4rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '4px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: '#2563eb', display: 'block', fontWeight: 700 }}>TAXA ATENDIMENTO</span>
                      <strong style={{ fontSize: '0.82rem', color: '#2563eb' }}>98% de retorno</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
