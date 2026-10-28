import React, { useState } from 'react';
import { 
  Heart, 
  ArrowLeftRight, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  MapPin, 
  CheckCircle2, 
  TrendingDown,
  Calendar,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Calculator,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function PropertyCard({
  property,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onSelectProperty,
  onOpenScheduler,
  onOpenCalculator,
  showTotalCost = false
}) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  // Price formatting
  const totalMonthlyCost = property.transactionType === 'Aluguel'
    ? ((property.rentPrice || property.price || 4000) + (property.condoFee || 0) + (property.iptu || 0) + Math.round((property.rentPrice || 4000) * 0.085))
    : null;

  const displayPrice = (showTotalCost && totalMonthlyCost)
    ? `R$ ${totalMonthlyCost.toLocaleString('pt-BR')}/mês (Pacote Total)`
    : property.transactionType === 'Venda' 
      ? `R$ ${(property.price || 0).toLocaleString('pt-BR')}`
      : `R$ ${(property.rentPrice || property.price || 0).toLocaleString('pt-BR')}/mês`;

  const pricePerM2 = property.transactionType === 'Venda'
    ? Math.round((property.price || 0) / (property.area || 1))
    : Math.round((property.rentPrice || property.price || 0) / (property.area || 1));

  const isGreatDeal = property.priceReduced || (property.loftValuation?.diffPercent && property.loftValuation.diffPercent < -4);
  const isMcmvEligible = property.price <= 350000 && property.transactionType === 'Venda';
  const acceptsExchange = property.acceptsExchange || property.description?.toLowerCase().includes('permuta');

  const propCode = property.code || property.id;
  const whatsappMessage = `Olá! Vi o imóvel "${property.title}" (Cód: ${propCode}) no ImóvelHUB no valor de ${displayPrice} e gostaria de mais informações.`;

  return (
    <div 
      onClick={() => onSelectProperty(property)}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Property Image Gallery Slider */}
      <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
        <img 
          src={property.images[currentImgIndex] || property.images[0]} 
          alt={property.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Carousel Navigation Arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                top: '50%',
                left: '8px',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                top: '50%',
                right: '8px',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
          <span style={{
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            color: '#38bdf8',
            fontSize: '0.72rem',
            padding: '0.22rem 0.55rem',
            borderRadius: '6px',
            fontWeight: 800,
            letterSpacing: '0.5px',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            width: 'fit-content'
          }}>
            <Tag size={11} color="#38bdf8" />
            CÓD: {property.code || property.id}
          </span>
          {isGreatDeal && (
            <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 800 }}>
              🔥 Ótimo Preço
            </span>
          )}
          {(property.isVerifiedHub || property.isVerifiedQuintoAndar) && (
            <span className="badge badge-quinto" style={{ fontSize: '0.68rem' }}>
              ✓ Verificado ImóvelHUB
            </span>
          )}
          {property.youtubeUrl && (
            <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ▶ Vídeo Tour
            </span>
          )}
          {property.transactionType === 'Aluguel' && (
            <span style={{ backgroundColor: '#059669', color: '#fff', fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
              🛡️ Sem Fiador
            </span>
          )}
        </div>

        {/* Action Icons Overlay (Compare & Favorite) */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property.id);
            }}
            title="Comparar Imóvel Lado a Lado"
            style={{
              background: isCompared ? 'var(--color-loft)' : 'rgba(255, 255, 255, 0.9)',
              color: isCompared ? '#ffffff' : 'var(--text-main)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <ArrowLeftRight size={16} />
          </button>

          {/* Favorite Heart Button (OLX) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            title="Salvar nos Favoritos"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              color: isFavorite ? 'var(--color-accent)' : '#64748b',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <Heart size={16} fill={isFavorite ? 'var(--color-accent)' : 'none'} />
          </button>
        </div>

        {/* Photo Counter */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          background: 'rgba(0,0,0,0.65)',
          color: '#fff',
          padding: '0.2rem 0.6rem',
          borderRadius: '12px',
          fontSize: '0.72rem',
          fontWeight: 600
        }}>
          {currentImgIndex + 1} / {property.images.length}
        </div>
      </div>

      {/* Property Details Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Extra Feature Tags (MCMV / Permuta) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
          {isMcmvEligible && (
            <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '4px', fontWeight: 700 }}>
              🏠 Minha Casa Minha Vida
            </span>
          )}
          {acceptsExchange && (
            <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '4px', fontWeight: 700 }}>
              🔄 Aceita Permuta
            </span>
          )}
        </div>

        {/* Price & R$/m² Row */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: (showTotalCost && totalMonthlyCost) ? '#059669' : 'var(--color-primary)' }}>
              {displayPrice}
            </span>
            {property.oldPrice && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                R$ {property.oldPrice.toLocaleString('pt-BR')}
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            R$ {pricePerM2.toLocaleString('pt-BR')}/m²
          </span>
        </div>

        {/* Condo & IPTU breakdown */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          <span>Cond. R$ {property.condoFee || 0}</span>
          <span style={{ margin: '0 0.3rem' }}>•</span>
          <span>IPTU R$ {property.iptu || 0}/mês</span>
        </div>

        {/* Property Title */}
        <h3 style={{
          fontSize: '0.98rem',
          fontWeight: 700,
          lineHeight: 1.35,
          color: 'var(--text-main)',
          marginBottom: '0.4rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {property.title}
        </h3>

        {/* Location Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          <MapPin size={13} color="var(--color-primary-light)" />
          <span>{property.neighborhood}, {property.city} - {property.state}</span>
        </div>

        {/* Property Specifications Grid (Dynamically hides empty/zero attributes) */}
        {(() => {
          const specs = [
            { label: 'Área Útil', value: property.area ? `${property.area}m²` : null },
            { label: 'Quartos', value: (property.bedrooms && Number(property.bedrooms) > 0) ? property.bedrooms : null },
            { label: 'Banheiros', value: (property.bathrooms && Number(property.bathrooms) > 0) ? property.bathrooms : null },
            { label: 'Vagas', value: (property.parkingSpots && Number(property.parkingSpots) > 0) ? property.parkingSpots : null }
          ].filter(s => s.value !== null);

          if (specs.length === 0) return null;

          return (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${specs.length}, 1fr)`,
              gap: '0.4rem',
              padding: '0.65rem 0',
              borderTop: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '0.85rem',
              textAlign: 'center'
            }}>
              {specs.map((s, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{s.value}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Action Buttons Row */}
        <div style={{ display: 'flex', gap: '0.45rem', marginTop: 'auto' }}>
          {/* Schedule Visit Button */}
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpenScheduler(property);
            }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
          >
            <Calendar size={13} />
            <span>Visita</span>
          </button>

          {/* Direct WhatsApp Conversion Button */}
          <a
            href={`https://wa.me/${property.advertiser?.whatsapp || '5511999990000'}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn btn-sm"
            style={{
              flex: 1.3,
              backgroundColor: '#25D366',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
