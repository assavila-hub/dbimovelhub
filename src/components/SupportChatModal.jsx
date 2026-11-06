import React, { useState, useEffect, useRef } from 'react';
import { X, Headphones, Send } from 'lucide-react';

export default function SupportChatModal({
  isOpen,
  onClose,
  currentUser
}) {
  const [messages, setMessages] = useState([
    { id: 's-1', sender: 'Suporte ImóvelHUB', text: 'Olá! Sou o atendente do suporte do ImóvelHUB. Como posso te ajudar hoje?', time: 'Agora' }
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    const senderName = currentUser ? currentUser.name : 'Cliente';
    setInputText('');

    const newMsg = {
      id: `s-${Date.now()}`,
      sender: senderName,
      text: userText,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);

    // Simulated support response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `s-reply-${Date.now()}`,
          sender: 'Suporte ImóvelHUB',
          text: `Recebi sua solicitação referente a "${userText}". Um atendente especialista em atendimento ao cliente já está analisando o seu chamado.`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1450 }} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '520px', padding: 0 }} onClick={(e) => e.stopPropagation()}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', borderRadius: '50%' }}>
              <Headphones size={22} color="#38bdf8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Central de Suporte ImóvelHUB</h2>
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Equipe de Atendimento Online 24h</span>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={22} />
          </button>
        </div>

        {/* Quick Topic Chips */}
        <div style={{
          padding: '0.65rem 1.25rem',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto'
        }}>
          {['Dúvidas em Anúncios', 'Ajuda com Pagamentos', 'Suporte a Corretores'].map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setInputText(`Dúvida sobre: ${topic}`);
              }}
              style={{
                padding: '0.35rem 0.7rem',
                borderRadius: '999px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{
          padding: '1.25rem',
          height: '340px',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-main)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {messages.map((msg) => {
            const isMe = msg.sender !== 'Suporte ImóvelHUB';
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  backgroundColor: isMe ? 'var(--color-primary)' : 'var(--bg-card)',
                  color: isMe ? '#ffffff' : 'var(--text-main)',
                  padding: '0.7rem 1rem',
                  borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.88rem',
                  border: isMe ? 'none' : '1px solid var(--border-color)'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8, marginBottom: '2px' }}>
                  {msg.sender}
                </div>
                <div>{msg.text}</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>
                  {msg.time}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Footer Input */}
        <form onSubmit={handleSend} style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-card)' }}>
          <input
            type="text"
            placeholder="Digite sua dúvida ou mensagem de suporte..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0 }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
