import React from 'react';
import { ArrowLeftRight, X } from 'lucide-react';

export default function FloatingCompareBar({
  comparedProperties,
  onOpenCompareModal,
  onRemoveFromCompare,
  onClearAll
}) {
  if (!comparedProperties || comparedProperties.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1500,
      backgroundColor: '#0f172a',
      color: '#ffffff',
      padding: '0.75rem 1.25rem',
      borderRadius: 'var(--radius-full)',
      boxShadow: '0 20px 30px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      maxWidth: '92vw',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ padding: '0.4rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', borderRadius: '50%' }}>
          <ArrowLeftRight size={18} color="#38bdf8" />
        </div>
        <div>
          <strong style={{ fontSize: '0.88rem', display: 'block' }}>Comparador Lado a Lado</strong>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{comparedProperties.length} de 3 imóveis adicionados</span>
        </div>
      </div>

      {/* Property Thumbnails Strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {comparedProperties.map((prop) => (
          <div
            key={prop.id}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.08)',
              padding: '3px 8px 3px 4px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.12)'
            }}
          >
            <img
              src={prop.images[0]}
              alt=""
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', marginRight: '6px' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, maxWidth: '90px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {prop.neighborhood}
            </span>
            <button
              onClick={() => onRemoveFromCompare(prop.id)}
              style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: '4px', padding: 0 }}
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          className="btn btn-accent btn-sm"
          onClick={onOpenCompareModal}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', fontWeight: 700 }}
        >
          <span>Comparar Agora ({comparedProperties.length})</span>
        </button>

        <button
          onClick={onClearAll}
          style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', underline: 'always' }}
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
