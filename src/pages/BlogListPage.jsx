import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from '../mockData/blogPosts';

export default function BlogListPage({
  onNavigateHome,
  onSelectPost
}) {
  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', flex: 1 }}>
      {/* Back to Home Button */}
      <button
        onClick={onNavigateHome}
        className="btn btn-secondary btn-sm"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} />
        <span>Voltar para Imóveis</span>
      </button>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          color: 'var(--color-primary-light)',
          padding: '0.35rem 0.9rem',
          borderRadius: '999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          <Sparkles size={15} />
          <span>Blog & Guia do Mercado Imobiliário</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1rem' }}>
          Dicas, Financiamento e Tendências do Mercado
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          Artigos exclusivos produzidos por especialistas para ajudar você a comprar, vender ou alugar imóveis com segurança no Brasil.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '2rem'
      }}>
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                <span className="badge badge-quinto">{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.35, marginBottom: '0.75rem' }}>
                {post.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                {post.excerpt}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                <span>Ler artigo completo</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
