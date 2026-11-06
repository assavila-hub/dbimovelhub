import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building2, 
  Gavel, 
  Sun,
  Home 
} from 'lucide-react';
import { CITIES_AND_NEIGHBORHOODS } from '../mockData/properties';

export default function SearchWizardModal({
  isOpen,
  onClose,
  onApplyWizardFilters
}) {
  const [step, setStep] = useState(1);

  // Wizard Selections
  const [operation, setOperation] = useState('Comprar'); // 'Comprar', 'Alugar', 'Lançamentos', 'Leilão', 'Temporada'
  const [selectedCity, setSelectedCity] = useState('Curitiba');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState(['Batel']);
  const [propertyType, setPropertyType] = useState('Apartamento');
  const [budgetRange, setBudgetRange] = useState(1800000);
  const [minBedrooms, setMinBedrooms] = useState(2);
  const [minParking, setMinParking] = useState(1);
  const [priorities, setPriorities] = useState(['Varanda Gourmet', 'Pet Friendly', 'Perto do Metrô']);
  const [isMcmv, setIsMcmv] = useState(false);
  const [acceptsExchange, setAcceptsExchange] = useState(false);

  const availableNeighborhoods = CITIES_AND_NEIGHBORHOODS.filter(c => c.city === selectedCity);

  const toggleNeighborhood = (name) => {
    if (selectedNeighborhoods.includes(name)) {
      setSelectedNeighborhoods(selectedNeighborhoods.filter(n => n !== name));
    } else {
      setSelectedNeighborhoods([...selectedNeighborhoods, name]);
    }
  };

  const togglePriority = (tag) => {
    if (priorities.includes(tag)) {
      setPriorities(priorities.filter(p => p !== tag));
    } else {
      setPriorities([...priorities, tag]);
    }
  };

  const handleFinish = () => {
    onApplyWizardFilters({
      operation,
      city: selectedCity,
      neighborhoods: selectedNeighborhoods,
      propertyType,
      maxPrice: budgetRange,
      minBedrooms,
      minParking,
      amenities: priorities,
      isMcmv,
      acceptsExchange
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1400 }} onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '780px', 
          width: '95vw', 
          maxHeight: '90vh', 
          padding: 0, 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-card)'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.5rem',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderBottom: '1px solid #1e293b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              padding: '0.5rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
            }}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Assistente Inteligente de Busca (Wizard)</h3>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', borderRadius: '999px', fontWeight: 700 }}>
                  PASSO {step} DE 4
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Responda a 4 perguntas rápidas para encontrarmos o imóvel sob medida para você
              </span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{ border: 'none', background: 'rgba(255, 255, 255, 0.1)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', backgroundColor: 'var(--border-color)', width: '100%' }}>
          <div style={{
            height: '100%',
            width: `${(step / 4) * 100}%`,
            background: 'linear-gradient(90deg, #38bdf8, #3b82f6)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: 'var(--bg-card)' }}>
          {/* STEP 1: OPERAÇÃO E TIPO DE IMÓVEL */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.25s ease' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>1. O que você gostaria de fazer?</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Selecione a modalidade de negócio e o tipo de imóvel ideal:</p>
              </div>

              {/* Operation Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {[
                  { id: 'Comprar', label: 'Comprar', icon: Home, desc: 'Imóveis prontos' },
                  { id: 'Alugar', label: 'Alugar', icon: KeyIcon, desc: 'Locação sem fiador' },
                  { id: 'Lançamentos', label: 'Lançamento', icon: Building2, desc: 'Na Planta / Novo' },
                  { id: 'Leilão', label: 'Leilão', icon: Gavel, desc: 'Com até 50% off' },
                  { id: 'Temporada', label: 'Temporada', icon: Sun, desc: 'Férias / Diárias' }
                ].map(op => {
                  const Icon = op.icon || Home;
                  const isSelected = operation === op.id;
                  return (
                    <div
                      key={op.id}
                      onClick={() => setOperation(op.id)}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.06)' : 'var(--bg-main)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={22} color={isSelected ? 'var(--color-primary-light)' : 'var(--text-muted)'} style={{ margin: '0 auto 0.4rem auto' }} />
                      <strong style={{ fontSize: '0.92rem', display: 'block', color: isSelected ? 'var(--color-primary-light)' : 'var(--text-main)' }}>{op.label}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{op.desc}</span>
                    </div>
                  );
                })}
              </div>

              {/* Property Type Grid */}
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Tipo do Imóvel:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                  {['Apartamento', 'Casa', 'Casa em condomínio', 'Cobertura', 'Studio', 'Comercial', 'Terreno'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPropertyType(t)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: propertyType === t ? '1.5px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                        backgroundColor: propertyType === t ? 'var(--color-primary-light)' : 'var(--bg-main)',
                        color: propertyType === t ? '#ffffff' : 'var(--text-main)',
                        fontWeight: propertyType === t ? 800 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCALIZAÇÃO */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.25s ease' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>2. Em quais bairros você quer morar?</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Escolha a cidade e marque os bairros de sua preferência:</p>
              </div>

              {/* City Selector */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Cidade:</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['São Paulo', 'Curitiba', 'Rio de Janeiro', 'Belo Horizonte'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedCity(c);
                        setSelectedNeighborhoods([]);
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedCity === c ? '1.5px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                        backgroundColor: selectedCity === c ? 'var(--color-primary-light)' : 'var(--bg-main)',
                        color: selectedCity === c ? '#ffffff' : 'var(--text-main)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Neighborhoods Tags */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                  Bairros em Destaque em {selectedCity} (Selecione quantos desejar):
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {availableNeighborhoods.map(item => {
                    const isSelected = selectedNeighborhoods.includes(item.neighborhood);
                    return (
                      <button
                        key={item.neighborhood}
                        type="button"
                        onClick={() => toggleNeighborhood(item.neighborhood)}
                        style={{
                          padding: '0.55rem 0.95rem',
                          borderRadius: '999px',
                          border: isSelected ? '1.5px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-main)',
                          color: isSelected ? 'var(--color-primary-light)' : 'var(--text-main)',
                          fontWeight: isSelected ? 800 : 500,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        {isSelected && <Check size={14} color="var(--color-primary-light)" />}
                        <span>{item.neighborhood}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ORÇAMENTO E VALOR TOTAL */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.25s ease' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>3. Qual a sua faixa de orçamento?</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {operation === 'Alugar' ? 'Valor máximo mensal do Pacote Total (Aluguel + Condomínio + IPTU)' : 'Valor máximo para a compra do imóvel'}
                </p>
              </div>

              <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {operation === 'Alugar' ? 'Pacote Total Máximo / Mês' : 'Valor Máximo do Imóvel'}
                </span>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-primary-light)', margin: '0.35rem 0 1rem 0' }}>
                  R$ {Number(budgetRange).toLocaleString('pt-BR')}
                </div>

                <input
                  type="range"
                  min={operation === 'Alugar' ? 1500 : 250000}
                  max={operation === 'Alugar' ? 25000 : 6000000}
                  step={operation === 'Alugar' ? 250 : 50000}
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary-light)', height: '8px', cursor: 'pointer' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  <span>{operation === 'Alugar' ? 'R$ 1.500/mês' : 'R$ 250.000'}</span>
                  <span>{operation === 'Alugar' ? 'R$ 25.000/mês+' : 'R$ 6.000.000+'}</span>
                </div>
              </div>

              {/* Special negotiation options (Chaves na Mão) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isMcmv} onChange={(e) => setIsMcmv(e.target.checked)} style={{ accentColor: 'var(--color-primary-light)' }} />
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>Minha Casa Minha Vida</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Com subsídios do governo</span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={acceptsExchange} onChange={(e) => setAcceptsExchange(e.target.checked)} style={{ accentColor: 'var(--color-primary-light)' }} />
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>Aceita Permuta</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Aceita carro ou outro imóvel</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: DIFERENCIAIS E COMODIDADES */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.25s ease' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>4. Quartos, Vagas e Diferenciais Essenciais</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Marque os itens que não podem faltar no seu novo lar:</p>
              </div>

              {/* Bedrooms & Parking Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Dormitórios Mínimos:</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setMinBedrooms(n)}
                        style={{
                          flex: 1,
                          padding: '0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          border: minBedrooms === n ? '1.5px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                          backgroundColor: minBedrooms === n ? 'var(--color-primary-light)' : 'var(--bg-main)',
                          color: minBedrooms === n ? '#ffffff' : 'var(--text-main)',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        {n}+
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Vagas de Garagem:</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[1, 2, 3].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setMinParking(n)}
                        style={{
                          flex: 1,
                          padding: '0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          border: minParking === n ? '1.5px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                          backgroundColor: minParking === n ? 'var(--color-primary-light)' : 'var(--bg-main)',
                          color: minParking === n ? '#ffffff' : 'var(--text-main)',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        {n}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Priorities Tags */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Comodidades & Estilo de Vida:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[
                    'Varanda Gourmet',
                    'Piscina',
                    'Pet Friendly',
                    'Perto do Metrô',
                    'Ar Condicionado',
                    'Portaria 24h',
                    'Academia',
                    'Mobiliado',
                    'Carregador para Carro Elétrico',
                    'Coworking',
                    'Tour 360°'
                  ].map(tag => {
                    const isSelected = priorities.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => togglePriority(tag)}
                        style={{
                          padding: '0.5rem 0.9rem',
                          borderRadius: '999px',
                          border: isSelected ? '1.5px solid #059669' : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'rgba(5, 150, 105, 0.12)' : 'var(--bg-main)',
                          color: isSelected ? '#059669' : 'var(--text-main)',
                          fontWeight: isSelected ? 800 : 500,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        {isSelected && <Check size={14} color="#059669" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--bg-main)',
          borderTop: '1px solid var(--border-color)'
        }}>
          {step > 1 ? (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setStep(step - 1)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
            >
              <ArrowLeft size={14} />
              <span>Voltar</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setStep(step + 1)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800 }}
            >
              <span>Próximo Passo</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-accent btn-sm"
              onClick={handleFinish}
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, padding: '0.6rem 1.4rem' }}
            >
              <Sparkles size={16} />
              <span>Ver Imóveis Personalizados</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function KeyIcon(props) {
  return (
    <svg {...props} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5"/>
      <path d="m21 2-9.6 9.6"/>
      <path d="m15.5 7.5 3 3L22 7l-3-3"/>
    </svg>
  );
}
