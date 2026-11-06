import React, { useState } from 'react';
import { 
  X, 
  Users, 
  PlusCircle, 
  Trash2,
  BadgeCheck 
} from 'lucide-react';

export default function UserManagementModal({
  isOpen,
  onClose,
  users,
  onUpdateUserRole,
  onToggleUserStatus,
  onAddUser,
  onDeleteUser
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('buyer');
  const [newCreci, setNewCreci] = useState('');

  if (!isOpen) return null;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    const newUser = {
      id: `user-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      phone: '(11) 98888-0000',
      creci: newRole === 'broker' ? newCreci || '00000-J' : null
    };

    onAddUser(newUser);
    setNewName('');
    setNewEmail('');
    setNewCreci('');
    setShowAddForm(false);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return { text: 'Administrador', class: 'badge-viva' };
      case 'owner': return { text: 'Proprietário', class: 'badge-loft' };
      case 'broker': return { text: 'Corretor / Imobiliária', class: 'badge-quinto' };
      case 'support': return { text: 'Suporte', class: 'badge-olx' };
      default: return { text: 'Comprador / Inquilino', class: 'badge' };
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1400 }} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '1000px', padding: 0 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: '#0f172a',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Users size={24} color="#38bdf8" />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Gerenciador de Contas e Permissões</h2>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Gestão de Admin, Proprietários, Corretores, Compradores e Suporte</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="btn btn-accent btn-sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <PlusCircle size={16} />
              <span>{showAddForm ? 'Fechar Formulário' : 'Nova Conta'}</span>
            </button>
            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', maxHeight: 'calc(85vh - 80px)', overflowY: 'auto' }}>
          {/* Add User Form */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} style={{
              backgroundColor: 'var(--bg-main)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Criar Nova Conta no Sistema</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Nome Completo</label>
                  <input
                    type="text"
                    placeholder="Nome do Usuário"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>E-mail</label>
                  <input
                    type="email"
                    placeholder="email@dominio.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Função / Função no Portal</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="buyer">Comprador / Inquilino</option>
                    <option value="owner">Proprietário de Imóvel</option>
                    <option value="broker">Corretor / Imobiliária</option>
                    <option value="support">Atendente de Suporte</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                {newRole === 'broker' && (
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>CRECI</label>
                    <input
                      type="text"
                      placeholder="Ex: 12345-J"
                      value={newCreci}
                      onChange={(e) => setNewCreci(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-sm">Cadastrar Conta</button>
            </form>
          )}

          {/* Accounts List Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '750px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>Usuário</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>E-mail</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>Perfil / Função</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>CRECI</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={u.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                          <strong style={{ fontSize: '0.88rem' }}>{u.name}</strong>
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {u.email}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={u.role}
                          onChange={(e) => onUpdateUserRole(u.id, e.target.value)}
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                        >
                          <option value="admin">Administrador</option>
                          <option value="owner">Proprietário</option>
                          <option value="broker">Corretor / Imobiliária</option>
                          <option value="buyer">Comprador / Inquilino</option>
                          <option value="support">Atendente Suporte</option>
                        </select>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>
                        {u.creci ? (
                          <span style={{ color: 'var(--color-quinto)', fontWeight: 700 }}>
                            <BadgeCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            {u.creci}
                          </span>
                        ) : '---'}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          onClick={() => onToggleUserStatus(u.id)}
                          className={`badge ${u.status === 'active' ? 'badge-quinto' : 'badge-viva'}`}
                          style={{ cursor: 'pointer' }}
                        >
                          {u.status === 'active' ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => onDeleteUser(u.id)}
                          style={{
                            border: 'none',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            borderRadius: 'var(--radius-sm)',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Remover Usuário"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
