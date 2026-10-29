import React, { useState, useEffect } from 'react';
import { Flame, X, ArrowRight, Sparkles, TrendingDown } from 'lucide-react';

export default function OpportunityFloatingToast({ properties = [], onSelectProperty }) {
  const [currentOpportunity, setCurrentOpportunity] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed || !properties || properties.length === 0) return;

    // Filter real properties with discount, launch or high yield
    const opportunities = properties.filter(
      p => p.isSuperHighlight || p.isLaunch || (p.price && p.price < 850000) || p.hasVirtualTour
    );

    if (opportunities.length === 0) return;

    // Trigger after 4 seconds of page load
    const timer = setTimeout(() => {
      const randomOpp = opportunities[Math.floor(Math.random() * opportunities.length)];
      setCurrentOpportunity(randomOpp);
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [properties, isDismissed]);

  if (!isVisible || !currentOpportunity || isDismissed) return null;

  const priceText = currentOpportunity.transactionType === 'Venda'
    ? `R$ ${Number(currentOpportunity.price).toLocaleString('pt-BR')}`
    : `R$ ${Number(currentOpportunity.rentPrice).toLocaleString('pt-BR')}/mês`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        zIndex: 1300,
        backgroundColor: '#0f172a',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '0.85rem 1.15rem',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        maxWidth: 'min(420px, calc(100vw - 32px))',
        animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(12px)'
      }}
    >
      {/* Thumbnail or Icon */}
      <div style={{ position: 'relative', width: '52px', height: '52px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={currentOpportunity.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80'}
          alt={currentOpportunity.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: '#ef4444',
          borderRadius: '0 0 0 4px',
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Flame size={10} color="#fff" />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '2px' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔥 Oportunidade no seu Radar
          </span>
        </div>

        <h4 style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          margin: 0,
          color: '#ffffff',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {currentOpportunity.title}
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px', fontSize: '0.74rem' }}>
          <span style={{ color: '#4ade80', fontWeight: 800 }}>{priceText}</span>
          <span style={{ color: '#94a3b8' }}>• {currentOpportunity.neighborhood || currentOpportunity.city}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => {
          onSelectProperty && onSelectProperty(currentOpportunity);
          setIsVisible(false);
        }}
        style={{
          border: 'none',
          backgroundColor: 'var(--color-primary-light)',
          color: '#ffffff',
          padding: '0.45rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          flexShrink: 0,
          transition: 'all 0.15s ease'
        }}
      >
        <span>Ver</span>
        <ArrowRight size={12} />
      </button>

      {/* Close Button */}
      <button
        onClick={() => {
          setIsVisible(false);
          setIsDismissed(true);
        }}
        style={{
          border: 'none',
          background: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
        title="Fechar notificação"
      >
        <X size={14} />
      </button>
    </div>
  );
}
