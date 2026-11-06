import React, { useState } from 'react';
import { Layers, Compass, CheckCircle2 } from 'lucide-react';

export default function FloorPlansWidget({ property }) {
  const plans = [
    {
      id: 'plan-1',
      title: 'Planta Tipo 2 Dorms c/ Suíte',
      area: `${property?.area || 80} m²`,
      bedrooms: property?.bedrooms || 2,
      bathrooms: property?.bathrooms || 2,
      sunOrientation: 'Sol da Manhã (Norte)',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      specs: ['Varanda integrada à cozinha', 'Suíte master com closet', 'Ponto para ar condicionado split']
    },
    {
      id: 'plan-2',
      title: 'Planta Expandida 3 Dorms c/ Living Ampliado',
      area: `${Math.round((property?.area || 80) * 1.25)} m²`,
      bedrooms: (property?.bedrooms || 2) + 1,
      bathrooms: (property?.bathrooms || 2) + 1,
      sunOrientation: 'Sol da Tarde (Noroeste)',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      specs: ['Living 3 ambientes', 'Churrasqueira a carvão na varanda', 'Depósito privativo no subsolo']
    }
  ];

  const [activePlan, setActivePlan] = useState(plans[0]);

  if (!property) return null;

  return (
    <div style={{
      backgroundColor: 'var(--bg-main)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Layers size={22} color="var(--color-primary-light)" />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Plantas Baixas e Opções de Layout</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Explore as opções de distribuição dos cômodos</span>
          </div>
        </div>

        {/* Plan Switcher Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePlan(p)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: activePlan.id === p.id ? '2px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                backgroundColor: activePlan.id === p.id ? 'var(--color-primary)' : 'var(--bg-card)',
                color: activePlan.id === p.id ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Visual & Specs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{
          height: '240px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          position: 'relative',
          border: '1px solid var(--border-color)'
        }}>
          <img src={activePlan.image} alt={activePlan.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '0.3rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Compass size={13} color="#38bdf8" />
            <span>{activePlan.sunOrientation}</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-light)', marginBottom: '0.5rem' }}>
            {activePlan.title} ({activePlan.area})
          </div>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <span>🛏️ {activePlan.bedrooms} Quartos</span>
            <span>🚿 {activePlan.bathrooms} Banheiros</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activePlan.specs.map((spec, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <CheckCircle2 size={15} color="var(--color-quinto)" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
