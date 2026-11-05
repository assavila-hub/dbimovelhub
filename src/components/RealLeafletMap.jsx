import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, ShieldCheck, Heart } from 'lucide-react';

// Custom Marker HTML generator for price tags (Viva Real)
const createPriceIcon = (priceText, isHovered) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${isHovered ? '#ff4757' : '#1e3a8a'};
        color: #ffffff;
        padding: 4px 10px;
        border-radius: 20px;
        font-weight: 800;
        font-size: 13px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 2px solid #ffffff;
        white-space: nowrap;
        font-family: system-ui, sans-serif;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <span>📍</span>
        <span>${priceText}</span>
      </div>
    `,
    iconSize: [80, 30],
    iconAnchor: [40, 15]
  });
};

export default function RealLeafletMap({
  properties = [],
  selectedProperty,
  onSelectProperty
}) {
  const DEFAULT_PROPERTY_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';

  // Only map properties with valid, verified numeric coordinates
  const validProperties = useMemo(() => {
    return properties.filter(p => 
      typeof p.lat === 'number' && 
      typeof p.lng === 'number' && 
      !isNaN(p.lat) && 
      !isNaN(p.lng)
    );
  }, [properties]);

  // Center map dynamically on selected property, or first valid property, or default
  const defaultCenter = selectedProperty?.lat && selectedProperty?.lng
    ? [selectedProperty.lat, selectedProperty.lng]
    : (validProperties.length > 0 ? [validProperties[0].lat, validProperties[0].lng] : [-23.56, -46.66]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '600px',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Viva Real Map Banner Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 500,
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(10px)',
        padding: '0.6rem 1.2rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <Navigation size={18} color="var(--color-accent)" />
        <div>
          <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-main)' }}>
            Mapa Interativo OpenStreetMap (ImóvelHUB)
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {validProperties.length} imóveis geolocalizados em tempo real
          </span>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validProperties.map((prop) => {
          const lat = prop.lat;
          const lng = prop.lng;
          const isSelected = selectedProperty?.id === prop.id;

          const priceText = prop.transactionType === 'Venda'
            ? `R$ ${(prop.price / 1000).toFixed(0)}k`
            : `R$ ${prop.rentPrice}/mês`;

          const popupImage = (Array.isArray(prop.images) && prop.images[0]) || DEFAULT_PROPERTY_IMAGE;

          return (
            <Marker
              key={prop.id}
              position={[lat, lng]}
              icon={createPriceIcon(priceText, isSelected)}
              eventHandlers={{
                click: () => onSelectProperty(prop)
              }}
            >
              <Popup>
                <div style={{ width: '220px', padding: '4px', fontFamily: 'system-ui, sans-serif' }}>
                  <img
                    src={popupImage}
                    alt={prop.title || 'Foto do Imóvel'}
                    style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }}
                  />
                  <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '1rem' }}>
                    {prop.transactionType === 'Venda' ? `R$ ${prop.price?.toLocaleString('pt-BR')}` : `R$ ${prop.rentPrice}/mês`}
                  </div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {prop.title}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                    {prop.neighborhood}, {prop.city} • {prop.area}m²
                  </div>
                  <button
                    onClick={() => onSelectProperty(prop)}
                    style={{
                      width: '100%',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Ver Imóvel Completo
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
