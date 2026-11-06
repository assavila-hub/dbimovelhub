import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function BlogPostPage({
  post,
  onNavigateBlog
}) {
  if (!post) return null;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '900px', flex: 1 }}>
      {/* Back Button */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={onNavigateBlog}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>Voltar para o Blog</span>
        </button>
      </div>

      {/* Article Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-quinto" style={{ marginBottom: '1rem' }}>{post.category}</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          <span>Por <strong>{post.author}</strong></span>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      {/* Featured Banner Image */}
      <div style={{ height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Content Body */}
      <div style={{
        fontSize: '1.05rem',
        color: 'var(--text-main)',
        lineHeight: 1.8,
        backgroundColor: 'var(--bg-card)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {post.excerpt}
        </p>

        <div style={{ whiteSpace: 'pre-line' }}>
          {post.content}
        </div>
      </div>
    </div>
  );
}
