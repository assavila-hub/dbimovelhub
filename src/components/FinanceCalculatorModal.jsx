import React, { useState } from 'react';
import { 
  X, 
  Calculator,
  ArrowRight
} from 'lucide-react';

const BANKS_DATA = [
  { id: 'caixa', name: 'Caixa Econômica', rate: 9.8, logo: '🏦', color: '#005ca9', bestFor: 'Menor taxa média / FGTS' },
  { id: 'bb', name: 'Banco do Brasil', rate: 10.2, logo: '🟡', color: '#ffea00', bestFor: 'Correntistas e Servidores' },
  { id: 'itau', name: 'Itaú Unibanco', rate: 10.49, logo: '🟧', color: '#ec7000', bestFor: 'Aprovação Rápida Digital' },
  { id: 'bradesco', name: 'Bradesco', rate: 10.60, logo: '🔴', color: '#cc092f', bestFor: 'Financiamento até 80%' },
  { id: 'santander', name: 'Santander', rate: 10.89, logo: '🔥', color: '#ea1d25', bestFor: 'Composição de Renda' }
];

export default function FinanceCalculatorModal({ property, onClose }) {
  const initialPrice = property?.price || 650000;
  const [propertyPrice, setPropertyPrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [years, setYears] = useState(30);
  const [amortizationSystem, setAmortizationSystem] = useState('SAC'); // 'SAC' ou 'PRICE'
  const [selectedBank, setSelectedBank] = useState(BANKS_DATA[0]);
  const [simulationSent, setSimulationSent] = useState(false);

  if (!property) return null;

  // Financial Math calculations
  const downPaymentValue = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPaymentValue;
  const months = years * 12;
  const monthlyRate = (selectedBank.rate / 100) / 12;

  // SAC Calculations
  const monthlyAmortization = loanAmount / months;
  const sacFirstInstallment = monthlyAmortization + (loanAmount * monthlyRate);
  const sacLastInstallment = monthlyAmortization + (monthlyAmortization * monthlyRate);
  const sacTotalInterest = ((sacFirstInstallment + sacLastInstallment) / 2 * months) - loanAmount;

  // PRICE Calculations (Fixed Installment)
  const priceInstallment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const priceTotalInterest = (priceInstallment * months) - loanAmount;

  const currentFirstInstallment = amortizationSystem === 'SAC' ? sacFirstInstallment : priceInstallment;
  const recommendedIncome = currentFirstInstallment / 0.30; // Parcela máx 30% da renda

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1300,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      <div 
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '750px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-2xl)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
            <Calculator size={22} color="var(--color-primary-light)" />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Simulador de Financiamento Multi-Bancos</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Compare taxas reais entre Caixa, BB, Itaú, Bradesco e Santander com SAC e Price
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Bank Selection Selector */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              1. Escolha a Instituição Financeira:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {BANKS_DATA.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBank(b)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedBank.id === b.id ? '2px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                    backgroundColor: selectedBank.id === b.id ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-main)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{b.logo}</div>
                  <strong style={{ fontSize: '0.78rem', display: 'block', color: 'var(--text-main)' }}>{b.name}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-primary-light)', fontWeight: 800 }}>{b.rate}% a.a.</span>
                </button>
              ))}
            </div>
          </div>

          {/* Two-Column Controls & Results */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Left Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Valor do Imóvel */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Valor do Imóvel</label>
                  <strong style={{ color: 'var(--color-primary-light)' }}>R$ {propertyPrice.toLocaleString('pt-BR')}</strong>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="4000000"
                  step="25000"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary-light)', cursor: 'pointer' }}
                />
              </div>

              {/* Entrada */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Entrada ({downPaymentPercent}%)</label>
                  <strong style={{ color: '#059669' }}>R$ {downPaymentValue.toLocaleString('pt-BR')}</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[10, 20, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDownPaymentPercent(pct)}
                      style={{
                        flex: 1,
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-sm)',
                        border: downPaymentPercent === pct ? '1.5px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                        backgroundColor: downPaymentPercent === pct ? 'var(--color-primary-light)' : 'var(--bg-main)',
                        color: downPaymentPercent === pct ? '#ffffff' : 'var(--text-main)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Prazo em Anos */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Prazo de Pagamento</label>
                  <strong>{years} anos ({months} meses)</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[15, 20, 25, 30, 35].map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setYears(y)}
                      style={{
                        flex: 1,
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-sm)',
                        border: years === y ? '1.5px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                        backgroundColor: years === y ? 'var(--color-primary-light)' : 'var(--bg-main)',
                        color: years === y ? '#ffffff' : 'var(--text-main)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {y}a
                    </button>
                  ))}
                </div>
              </div>

              {/* Sistema de Amortização (SAC vs PRICE) */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  Sistema de Amortização
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setAmortizationSystem('SAC')}
                    style={{
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: amortizationSystem === 'SAC' ? '2px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                      backgroundColor: amortizationSystem === 'SAC' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-main)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <strong style={{ fontSize: '0.82rem', display: 'block', color: 'var(--text-main)' }}>Tabela SAC</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Parcelas decrescentes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAmortizationSystem('PRICE')}
                    style={{
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: amortizationSystem === 'PRICE' ? '2px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                      backgroundColor: amortizationSystem === 'PRICE' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-main)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <strong style={{ fontSize: '0.82rem', display: 'block', color: 'var(--text-main)' }}>Tabela PRICE</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Parcelas fixas</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div style={{
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Banco Selecionado:</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-light)' }}>
                    {selectedBank.logo} {selectedBank.name} ({selectedBank.rate}% a.a.)
                  </strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Valor Financiado:</span>
                    <strong style={{ fontSize: '1rem' }}>R$ {loanAmount.toLocaleString('pt-BR')}</strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                      {amortizationSystem === 'SAC' ? '1ª Parcela Estimada (SAC):' : 'Parcela Fixa Mensal (Price):'}
                    </span>
                    <strong style={{ fontSize: '1.45rem', color: '#0284c7', fontWeight: 900 }}>
                      R$ {Math.round(currentFirstInstallment).toLocaleString('pt-BR')}
                    </strong>
                    {amortizationSystem === 'SAC' && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                        Última parcela prevista: <strong>R$ {Math.round(sacLastInstallment).toLocaleString('pt-BR')}</strong>
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Renda Familiar Mínima:</span>
                    <strong style={{ fontSize: '0.95rem', color: '#059669' }}>
                      R$ {Math.round(recommendedIncome).toLocaleString('pt-BR')}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Juros Totais Estimados:</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      R$ {Math.round(amortizationSystem === 'SAC' ? sacTotalInterest : priceTotalInterest).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                {simulationSent ? (
                  <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
                    ✓ Simulação enviada! Um correspondente bancário entrará em contato.
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => setSimulationSent(true)}
                    style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', fontWeight: 800 }}
                  >
                    <span>Solicitar Análise de Crédito Pré-Aprovada</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
