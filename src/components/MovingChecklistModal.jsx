import React, { useState, useEffect } from 'react';
import { 
  X, 
  Square, 
  Truck, 
  Zap, 
  Building2, 
  Key, 
  Plus, 
  Trash2, 
  CheckCircle2
} from 'lucide-react';

const DEFAULT_CHECKLIST_ITEMS = [
  { id: 'item-1', category: 'utilidades', title: 'Troca de Titularidade de Energia (Enel / CPFL / Light)', done: false, priority: 'Alta' },
  { id: 'item-2', category: 'utilidades', title: 'Troca de Titularidade de Água (Sabesp / Sanepar)', done: false, priority: 'Média' },
  { id: 'item-3', category: 'utilidades', title: 'Transferência / Instalação de Internet Fibra', done: true, priority: 'Alta' },
  { id: 'item-4', category: 'condominio', title: 'Avisar Administração / Síndico sobre a Data da Mudança', done: true, priority: 'Alta' },
  { id: 'item-5', category: 'condominio', title: 'Reserva do Elevador de Serviço e Vaga de Descarga', done: false, priority: 'Alta' },
  { id: 'item-6', category: 'condominio', title: 'Cadastro Biométrico / Facial e Tag de Veículos', done: false, priority: 'Média' },
  { id: 'item-7', category: 'seguranca', title: 'Troca do Segredo das Fechaduras / Chaveiro', done: false, priority: 'Alta' },
  { id: 'item-8', category: 'seguranca', title: 'Configuração da Fechadura Digital e Senhas', done: true, priority: 'Média' },
  { id: 'item-9', category: 'mudanca', title: 'Contratação do Caminhão de Mudança e Embalagem', done: false, priority: 'Alta' },
  { id: 'item-10', category: 'mudanca', title: 'Pintura e Pequenos Reparos de Ajuste', done: false, priority: 'Baixa' }
];

export default function MovingChecklistModal({
  isOpen,
  onClose,
  property
}) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('imovelhub_moving_checklist');
    return saved ? JSON.parse(saved) : DEFAULT_CHECKLIST_ITEMS;
  });

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('utilidades');

  useEffect(() => {
    localStorage.setItem('imovelhub_moving_checklist', JSON.stringify(items));
  }, [items]);

  if (!isOpen) return null;

  const toggleItem = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      category: newItemCategory,
      title: newItemTitle.trim(),
      done: false,
      priority: 'Média'
    };

    setItems([...items, newItem]);
    setNewItemTitle('');
  };

  const completedCount = items.filter(i => i.done).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'utilidades': return <Zap size={16} color="#f59e0b" />;
      case 'condominio': return <Building2 size={16} color="#0284c7" />;
      case 'seguranca': return <Key size={16} color="#8b5cf6" />;
      default: return <Truck size={16} color="#10b981" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1400,
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
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Truck size={22} color="#38bdf8" />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Checklist de Mudança &amp; Pós-Venda {property?.title ? `• ${property.title}` : ''}
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Guia prático para troca de contas, condomínio, internet e mudança
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              border: 'none', 
              background: 'rgba(255, 255, 255, 0.1)', 
              color: '#ffffff',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar Card */}
        <div style={{
          backgroundColor: 'var(--bg-main)',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Progresso da Mudança: {completedCount} de {items.length} tarefas concluídas
            </span>
            <strong style={{ color: progressPercent === 100 ? '#059669' : 'var(--color-primary-light)', fontSize: '1rem', fontWeight: 800 }}>
              {progressPercent}%
            </strong>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: progressPercent === 100 ? '#059669' : 'var(--color-primary-light)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Add Item Form */}
          <form 
            onSubmit={handleAddItem}
            style={{
              display: 'flex',
              gap: '0.5rem',
              backgroundColor: 'var(--bg-main)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <input
              type="text"
              required
              placeholder="Adicionar nova tarefa (Ex: Agendar faxina pós-obra)..."
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
            >
              <option value="utilidades">⚡ Utilidades</option>
              <option value="condominio">🏢 Condomínio</option>
              <option value="seguranca">🔑 Segurança</option>
              <option value="mudanca">🚚 Mudança</option>
            </select>
            <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 800, gap: '0.3rem' }}>
              <Plus size={15} />
              <span>Adicionar</span>
            </button>
          </form>

          {/* Checklist Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                style={{
                  backgroundColor: item.done ? 'var(--bg-main)' : 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  opacity: item.done ? 0.7 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    {item.done ? (
                      <CheckCircle2 size={20} color="#059669" />
                    ) : (
                      <Square size={20} color="var(--text-muted)" />
                    )}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {getCategoryIcon(item.category)}
                    <span style={{
                      fontSize: '0.88rem',
                      fontWeight: item.done ? 500 : 700,
                      textDecoration: item.done ? 'line-through' : 'none',
                      color: item.done ? 'var(--text-muted)' : 'var(--text-main)'
                    }}>
                      {item.title}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    backgroundColor: 'var(--bg-main)',
                    color: item.priority === 'Alta' ? '#ef4444' : '#64748b',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)'
                  }}>
                    {item.priority}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item.id);
                    }}
                    style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                    title="Excluir tarefa"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
