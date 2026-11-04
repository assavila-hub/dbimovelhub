import React from 'react';
import { Building2, Sparkles, Heart, ShieldCheck, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#94a3b8',
      padding: '4rem 0 2rem 0',
      borderTop: '1px solid #1e293b',
      marginTop: '5rem'
    }}>
      <div className="container">
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Col 1: Brand Info */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                color: '#ffffff',
                padding: '0.5rem',
                borderRadius: '10px',
                display: 'flex'
              }}>
                <Building2 size={22} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                Imóvel<span style={{ color: '#38bdf8' }}>HUB</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              O maior ecossistema imobiliário do Brasil. Conectando compradores, inquilinos, proprietários e corretores credenciados em uma só plataforma inteligente.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-quinto" style={{ background: 'rgba(5, 150, 105, 0.2)', color: '#34d399' }}>100% Verificado</span>
              <span className="badge badge-loft" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>Preço Justo</span>
            </div>
          </div>

          {/* Col 2: Funcionalidades ImóvelHUB */}
          <div className="footer-col">
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Recursos e Soluções</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>• <strong>Filtros Avançados</strong>: Busca personalizada por preço e lazer</li>
              <li>• <strong>Mapa Interativo</strong>: Busca por raio e mapa geolocalizado</li>
              <li>• <strong>Visitas Online</strong>: Agendamento direto de visitas presenciais</li>
              <li>• <strong>Avaliação de m²</strong>: Análise de preço vs média do bairro</li>
              <li>• <strong>Comparador Side-by-Side</strong>: Tabela comparativa de imóveis</li>
              <li>• <strong>Anúncio Rápido</strong>: Publicação imediata com contato direto</li>
            </ul>
          </div>

          {/* Col 3: Cidades em Destaque */}
          <div className="footer-col">
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Imóveis por Cidade</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li><a href="#" className="footer-link">Imóveis em São Paulo - SP</a></li>
              <li><a href="#" className="footer-link">Imóveis no Rio de Janeiro - RJ</a></li>
              <li><a href="#" className="footer-link">Imóveis em Curitiba - PR</a></li>
              <li><a href="#" className="footer-link">Imóveis em Belo Horizonte - MG</a></li>
              <li><a href="#" className="footer-link">Imóveis em Florianópolis - SC</a></li>
              <li><a href="#" className="footer-link">Imóveis em Brasília - DF</a></li>
            </ul>
          </div>

          {/* Col 4: Suporte e Contato */}
          <div className="footer-col">
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Central do Cliente</h4>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Dúvidas sobre como anunciar seu imóvel ou agendar visitas? Fale com a nossa equipe 24h.
            </p>
            <div style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 700 }}>
              <a href="mailto:suporte@imovelhub.com.br" className="footer-link" style={{ color: '#38bdf8' }}>
                suporte@imovelhub.com.br
              </a>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#ffffff', marginTop: '0.35rem' }}>
              <a href="tel:08007779000" className="footer-link" style={{ color: '#ffffff' }}>
                0800 777 9000
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem'
        }}>
          <div>
            © {new Date().getFullYear()} ImóvelHUB Classificados. Todos os direitos reservados.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <a href="#" className="footer-link">Termos de Uso</a>
            <a href="#" className="footer-link">Política de Privacidade</a>
            <a href="#" className="footer-link">Mapa do Site</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
