import React, { useState } from 'react';
import { 
  X, 
  TrendingUp
} from 'lucide-react';

export default function RoiYieldCalculatorModal({ property, onClose }) {
  const defaultPrice = property?.transactionType === 'Aluguel'
    ? (property?.rentPrice || 2500) * 200
    : (property?.price || 650000);

  const defaultMonthlyRent = property?.rentPrice || Math.round(defaultPrice * 0.005); // 0.5% ao mês

  const [purchasePrice, setPurchasePrice] = useState(defaultPrice);
  const [renovationCost, setRenovationCost] = useState(25000);
  const [rentalMode, setRentalMode] = useState('traditional'); // 'traditional' ou 'airbnb'
  
  // Traditional inputs
  const [monthlyRent, setMonthlyRent] = useState(defaultMonthlyRent);
  const [vacancyMonths, setVacancyMonths] = useState(1); // 1 mês vago por ano
  
  // Season / Airbnb inputs
  const [dailyRate, setDailyRate] = useState(Math.round(defaultMonthlyRent / 15));
  const [occupancyRate, setOccupancyRate] = useState(65); // 65% ocupação

  if (!property) return null;

  // Calculations
  const totalInvestment = purchasePrice + renovationCost;

  let annualGrossIncome = 0;
  if (rentalMode === 'traditional') {
    const activeMonths = Math.max(0, 12 - vacancyMonths);
    annualGrossIncome = monthlyRent * activeMonths;
  } else {
    const activeDays = 365 * (occupancyRate / 100);
    annualGrossIncome = dailyRate * activeDays;
  }

  // Estimated management fee & maintenance (12% approx)
  const managementFee = annualGrossIncome * 0.10;
  const annualNetIncome = annualGrossIncome - managementFee;

  const grossYield = totalInvestment > 0 ? (annualGrossIncome / totalInvestment) * 100 : 0;
  const netYield = totalInvestment > 0 ? (annualNetIncome / totalInvestment) * 100 : 0;
  const paybackYears = annualNetIncome > 0 ? (totalInvestment / annualNetIncome).toFixed(1) : '∞';

  // Benchmarks
  const cdiRate = 10.75;
  const savingsRate = 6.17;
  const expectedAppreciation = 6.0; // 6% a.a. valorização do imóvel
  const totalRealReturn = netYield + expectedAppreciation;

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
          maxWidth: '820px',
          width: '100%',
          maxHeight: '92vh',
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
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp size={22} color="#10b981" />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Calculadora de Retorno de Investimento (ROI &amp; Yield)
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Simule rentabilidade anual, payback e compare com CDI e Poupança
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-muted)' 
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Mode Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setRentalMode('traditional')}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: rentalMode === 'traditional' ? '2px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                backgroundColor: rentalMode === 'traditional' ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-main)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <strong style={{ fontSize: '0.88rem', display: 'block', color: 'var(--text-main)' }}>🏢 Locação Mensal Tradicional</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contratos de 12 a 30 meses (baixo risco)</span>
            </button>

            <button
              type="button"
              onClick={() => setRentalMode('airbnb')}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: rentalMode === 'airbnb' ? '2px solid #ec4899' : '1px solid var(--border-color)',
                backgroundColor: rentalMode === 'airbnb' ? 'rgba(236, 72, 153, 0.08)' : 'var(--bg-main)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <strong style={{ fontSize: '0.88rem', display: 'block', color: 'var(--text-main)' }}>🏖️ Locação por Temporada</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Diárias com maior rentabilidade potencial</span>
            </button>
          </div>

          {/* Controls & Metrics Split */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Left Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  Preço de Compra do Imóvel: R$ {purchasePrice.toLocaleString('pt-BR')}
                </label>
                <input
                  type="range"
                  min="100000"
                  max="3000000"
                  step="25000"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary-light)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  Investimento em Reforma / Mobília: R$ {renovationCost.toLocaleString('pt-BR')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="5000"
                  value={renovationCost}
                  onChange={(e) => setRenovationCost(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              {rentalMode === 'traditional' ? (
                <>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Aluguel Mensal Estimado: R$ {monthlyRent.toLocaleString('pt-BR')}/mês
                    </label>
                    <input
                      type="range"
                      min="800"
                      max="20000"
                      step="100"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Vacância Estimada: {vacancyMonths} {vacancyMonths === 1 ? 'mês vago' : 'meses vagos'}/ano
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="1"
                      value={vacancyMonths}
                      onChange={(e) => setVacancyMonths(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Diária Média Estimada: R$ {dailyRate.toLocaleString('pt-BR')}/noite
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="2500"
                      step="50"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#ec4899', cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Taxa de Ocupação Média: {occupancyRate}% ({Math.round(365 * (occupancyRate / 100))} noites/ano)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="95"
                      step="5"
                      value={occupancyRate}
                      onChange={(e) => setOccupancyRate(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#ec4899', cursor: 'pointer' }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Right Financial Performance Metrics */}
            <div style={{
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.85rem' }}>
                  Métricas de Rentabilidade do Imóvel
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>YIELD LÍQUIDO ANUAL</span>
                    <strong style={{ fontSize: '1.4rem', color: '#10b981', fontWeight: 900 }}>
                      {netYield.toFixed(2)}% <span style={{ fontSize: '0.75rem' }}>a.a.</span>
                    </strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>RETORNO TOTAL C/ VALORIZAÇÃO</span>
                    <strong style={{ fontSize: '1.4rem', color: '#0284c7', fontWeight: 900 }}>
                      {totalRealReturn.toFixed(2)}% <span style={{ fontSize: '0.75rem' }}>a.a.</span>
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Investimento Total:</span>
                    <strong>R$ {totalInvestment.toLocaleString('pt-BR')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Receita Líquida Anual:</span>
                    <strong style={{ color: '#10b981' }}>R$ {Math.round(annualNetIncome).toLocaleString('pt-BR')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tempo de Retorno (Payback):</span>
                    <strong>{paybackYears} anos</strong>
                  </div>
                </div>

                {/* Comparativo de Mercado */}
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                    Comparativo Anual com Investimentos:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>🏢 Imóvel (Aluguel + Valorização):</span>
                      <strong style={{ color: '#059669' }}>+{totalRealReturn.toFixed(2)}% a.a.</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>📈 CDI Benchmark:</span>
                      <strong style={{ color: '#475569' }}>+{cdiRate}% a.a.</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>🏦 Poupança Tradicional:</span>
                      <strong style={{ color: '#94a3b8' }}>+{savingsRate}% a.a.</strong>
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
