import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  Upload, 
  Server
} from 'lucide-react';

export default function XmlFeedSyncModal({
  isOpen,
  onClose,
  properties = [],
  onImportProperties
}) {
  const [activeTab, setActiveTab] = useState('import'); // 'import', 'export', 'crm_connect'
  const [xmlUrl, setXmlUrl] = useState('https://crm.imobiliariaprime.com.br/feeds/viva-real.xml');
  const [crmType, setCrmType] = useState('kenlo'); // 'kenlo', 'vista', 'universal', 'orulo', 'custom'
  const [autoSyncFrequency, setAutoSyncFrequency] = useState('daily');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importLog, setImportLog] = useState(null);
  const [copied, setCopied] = useState(false);

  const officialFeedUrl = 'https://imovelhub.com.br/api/v1/feeds/portal-imobhub-carga.xml';

  const handleStartImport = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setImportLog({
        totalFound: 48,
        imported: 46,
        updated: 2,
        failed: 0,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        status: 'Sucesso'
      });
      onImportProperties?.([]);
    }, 1200);
  };

  const handleCopyFeed = () => {
    navigator.clipboard.writeText(officialFeedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1400 }} onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '960px', 
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
          padding: '1rem 1.5rem',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderBottom: '1px solid #1e293b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              padding: '0.5rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Central de Integração XML & CRMs Imobiliários</h3>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', borderRadius: '999px', fontWeight: 700 }}>
                  PADRÃO ZAP / VIVA REAL
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Sincronize milhares de imóveis via Feeds XML de CRMs como Kenlo, Vista, Órulo e Universal Software
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

        {/* Tab Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          {[
            { id: 'import', label: '📥 Importar Feed XML (Entrada de Imóveis)', icon: Upload },
            { id: 'export', label: '📤 Exportar Feed XML do Portal', icon: Download },
            { id: 'crm_connect', label: '🔌 Conectar CRMs Parceiros', icon: Server }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: activeTab === t.id ? '1.5px solid var(--color-primary-light)' : '1px solid var(--border-color)',
                backgroundColor: activeTab === t.id ? 'var(--bg-card)' : 'transparent',
                color: activeTab === t.id ? 'var(--color-primary-light)' : 'var(--text-muted)',
                fontWeight: activeTab === t.id ? 800 : 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <t.icon size={14} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* TAB 1: IMPORT XML */}
          {activeTab === 'import' && (
            <form onSubmit={handleStartImport} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem' }}>Importar Carga de Imóveis via URL de XML</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Suporta feeds de carga nos padrões universais de integração XML de CRMs e portais imobiliários.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>URL Pública do Arquivo XML / Feed</label>
                    <input
                      type="url"
                      required
                      value={xmlUrl}
                      onChange={(e) => setXmlUrl(e.target.value)}
                      placeholder="https://suaimobiliaria.com.br/carga/feed-vivareal.xml"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Origem / Formato do CRM</label>
                    <select value={crmType} onChange={(e) => setCrmType(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                      <option value="kenlo">Kenlo Imob (Padrão)</option>
                      <option value="vista">Vista Software</option>
                      <option value="universal">Universal Software (InGaia / Imoview)</option>
                      <option value="orulo">Órulo Lançamentos</option>
                      <option value="custom">XML Padrão VivaReal DTD 3.0</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Frequência de Sincronização Automática</label>
                    <select value={autoSyncFrequency} onChange={(e) => setAutoSyncFrequency(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                      <option value="6hours">A cada 6 horas</option>
                      <option value="daily">Diariamente às 03:00</option>
                      <option value="manual">Apenas Sincronização Manual</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" disabled={isProcessing} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}>
                    <RefreshCw size={16} className={isProcessing ? 'spin' : ''} />
                    <span>{isProcessing ? 'Processando Feed XML...' : 'Iniciar Importação em Lote'}</span>
                  </button>
                </div>
              </div>

              {/* Import Log Result */}
              {importLog && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: 'var(--radius-md)', color: '#166534' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.95rem' }}>
                    <CheckCircle2 size={18} color="#16a34a" />
                    <span>Sincronização Concluída com Sucesso ({importLog.timestamp})</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>TOTAL NO XML</span>
                      <strong style={{ display: 'block', fontSize: '1.1rem', color: '#111827' }}>{importLog.totalFound}</strong>
                    </div>
                    <div style={{ padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>NOVOS IMPORTADOS</span>
                      <strong style={{ display: 'block', fontSize: '1.1rem', color: '#16a34a' }}>{importLog.imported}</strong>
                    </div>
                    <div style={{ padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>ATUALIZADOS</span>
                      <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0284c7' }}>{importLog.updated}</strong>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: EXPORT XML */}
          {activeTab === 'export' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem' }}>Feed XML Oficial dos Imóveis do ImobHub</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Use esta URL para carregar todos os seus imóveis anunciados no portal em sistemas externos ou parceiros.
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    readOnly
                    value={officialFeedUrl}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', fontFamily: 'monospace', fontSize: '0.8rem' }}
                  />
                  <button type="button" className="btn btn-outline" onClick={handleCopyFeed} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
                    {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                    <span>{copied ? 'Copiado!' : 'Copiar URL'}</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => alert('Download do arquivo portal-imobhub-carga.xml iniciado!')}>
                    <Download size={14} />
                    <span>Baixar Arquivo XML Completo ({properties.length} Imóveis)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CRMS CONNECT */}
          {activeTab === 'crm_connect' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {[
                { name: 'Kenlo Imob', status: 'Conectado', desc: 'Sincronização bidirecional ativa', color: '#10b981' },
                { name: 'Vista Software', status: 'Disponível', desc: 'Pronto para integrar API v2', color: '#0284c7' },
                { name: 'InGaia / Universal', status: 'Disponível', desc: 'Importação automática por token', color: '#0284c7' },
                { name: 'Órulo Lançamentos', status: 'Ativo', desc: 'Catálogo de novos empreendimentos', color: '#10b981' }
              ].map((c, i) => (
                <div key={i} style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{c.name}</strong>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '999px', backgroundColor: `${c.color}20`, color: c.color, fontWeight: 800 }}>{c.status}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
