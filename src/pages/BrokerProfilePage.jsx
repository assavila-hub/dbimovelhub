import React from 'react';
import { 
  ArrowLeft, 
  BadgeCheck, 
  MessageCircle, 
  Star, 
  Building2
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

export default function BrokerProfilePage({
  advertiser,
  properties = [],
  onNavigateHome,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onSelectProperty,
  onOpenScheduler,
  onOpenCalculator,
  onOpenBrokerReviews
}) {
  if (!advertiser) return null;

  const whatsappNum = advertiser.whatsapp || (advertiser.phone ? advertiser.phone.replace(/\D/g, '') : '5511999990000');

  // Filter properties by this advertiser
  const brokerProperties = properties.filter(p => 
    p.advertiser?.name === advertiser.name || 
    (advertiser.name && p.advertiser?.name && advertiser.name.includes(p.advertiser.name))
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', flex: 1 }}>
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={onNavigateHome}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>Voltar para Todos os Imóveis</span>
        </button>
      </div>

      {/* Broker Profile Header Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '2rem',
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img
            src={advertiser.avatar}
            alt={advertiser.name}
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary-light)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{advertiser.name}</h1>
              {advertiser.creci && (
                <span className="badge badge-quinto">
                  <BadgeCheck size={14} />
                  <span>CRECI {advertiser.creci}</span>
                </span>
              )}
            </div>

            <div 
              onClick={() => onOpenBrokerReviews && onOpenBrokerReviews(advertiser)}
              style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700, marginBottom: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>⭐ 5.0 / 5.0 (100% Avaliações Positivas)</span>
              <span style={{ fontSize: '0.75rem', textDecoration: 'underline', color: 'var(--color-primary-light)' }}>• Ver Depoimentos</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Carteira ativa com <strong>{brokerProperties.length} imóveis</strong> cadastrados no portal
            </div>
          </div>
        </div>

        {/* Contact & Reviews Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            onClick={() => onOpenBrokerReviews && onOpenBrokerReviews(advertiser)}
            style={{ fontWeight: 800, gap: '0.4rem', borderColor: '#f59e0b', color: '#f59e0b' }}
          >
            <Star size={18} />
            <span>Ver Avaliações &amp; Reputação</span>
          </button>

          <a
            href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Olá! Vi seu perfil de corretor no ImóvelHUB.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ backgroundColor: '#25D366', color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}
          >
            <MessageCircle size={18} />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Broker Listings Grid */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        Carteira de Imóveis da Imobiliária / Corretor ({brokerProperties.length})
      </h2>

      {brokerProperties.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)'
        }}>
          <Building2 size={44} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Nenhum imóvel listado no momento</h3>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.75rem'
        }}>
          {brokerProperties.map((property) => {
            const isFav = typeof isFavorite === 'function' ? isFavorite(property.id) : (Array.isArray(isFavorite) ? isFavorite.includes(property.id) : false);
            const isComp = typeof isCompared === 'function' ? isCompared(property.id) : (Array.isArray(isCompared) ? isCompared.includes(property.id) : false);
            return (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={isFav}
                isCompared={isComp}
                onToggleFavorite={onToggleFavorite}
                onToggleCompare={onToggleCompare}
                onSelectProperty={onSelectProperty}
                onOpenScheduler={onOpenScheduler}
                onOpenCalculator={onOpenCalculator}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
