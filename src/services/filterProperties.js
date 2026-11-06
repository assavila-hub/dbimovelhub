/**
 * Shared Property Filtering Engine - ImóvelHUB
 * Centralizes all search, matching, and filtering logic across App.jsx, HeroSearch.jsx, and other components.
 */

/**
 * Normalizes text for accent-insensitive, case-insensitive, and punctuation-agnostic search
 */
export function normalizeText(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[,\-–—()/!?.:#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if a search query matches a property code or ID (e.g., "HUB-1001", "1001", "prop-1")
 */
export function matchesPropertyCode(property, query) {
  if (!query || !query.trim()) return false;
  const rawQ = query.trim().toLowerCase();
  const cleanQ = rawQ.replace(/^[#\s]+/, '').replace(/^hub[-_\s]*/, '');
  const itemCodeClean = (property.code || '').toLowerCase().replace(/^hub[-_\s]*/, '');

  return Boolean(
    (property.code && (property.code.toLowerCase() === rawQ || itemCodeClean === cleanQ)) ||
    (property.id && (property.id.toLowerCase() === rawQ || property.id.toLowerCase() === `prop-${rawQ}`)) ||
    (property.referenceCode && property.referenceCode.toLowerCase() === rawQ)
  );
}

/**
 * Checks if a property matches a transaction tab (Comprar, Alugar, Lançamentos, Temporada, etc.)
 */
export function matchesTransactionTab(property, tab) {
  if (!tab || tab === 'Todos' || tab === 'all') return true;
  if (tab === 'Comprar') return property.transactionType === 'Venda' || property.purpose === 'Venda';
  if (tab === 'Alugar') return property.transactionType === 'Aluguel' || property.purpose === 'Aluguel';
  if (tab === 'Lançamentos') return Boolean(property.isLaunch || property.isRelease);
  if (tab === 'Temporada') return property.transactionType === 'Temporada' || Boolean(property.isSeason);
  if (tab === 'Imóvel Novo') return Boolean(property.isNew || property.isLaunch);
  if (tab === 'Leilão') return property.transactionType === 'Leilao' || Boolean(property.isAuction);
  return true;
}

/**
 * Checks if a property matches category / subTypes
 */
export function matchesCategory(property, subTypes = [], mainType = 'Todos') {
  if (subTypes && subTypes.length > 0) {
    return subTypes.includes(property.subType) || subTypes.includes(property.type);
  }
  if (mainType && mainType !== 'Todos' && mainType !== 'all') {
    return property.type === mainType || property.subType === mainType;
  }
  return true;
}

/**
 * Checks if a property matches text search (code, location, title, tags, description)
 */
export function matchesLocationOrText(property, query) {
  if (!query || !query.trim()) return true;

  if (matchesPropertyCode(property, query)) {
    return true;
  }

  const normQuery = normalizeText(query);
  const queryTerms = normQuery.split(' ').filter(t => t.length > 0);
  const searchableText = normalizeText(
    `${property.code || ''} ${property.id || ''} ${property.title || ''} ${property.neighborhood || ''} ${property.city || ''} ${property.state || ''} ${property.address || ''} ${property.type || ''} ${property.subType || ''} ${property.referenceCode || ''} ${property.advertiser?.name || ''} ${property.advertiser?.email || ''} ${property.advertiser?.phone || ''} ${property.description || ''}`
  );

  return queryTerms.every(term => searchableText.includes(term));
}

/**
 * Haversine formula to compute distance in km between two lat/lng pairs
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Master filter function: applies full criteria to a list of properties
 */
export function filterPropertiesList(properties = [], options = {}) {
  const {
    showOnlyFavorites = false,
    favorites = [],
    activeTab = 'Todos',
    searchQuery = '',
    selectedType = 'Todos',
    selectedSubTypes = [],
    minBedrooms = 0,
    minParkingSpots = 0,
    filters = {},
    showTotalCost = false,
    activeRadiusFilter = null
  } = options;

  return properties.filter(item => {
    // 1. Favorites only
    if (showOnlyFavorites && !favorites.includes(item.id)) return false;

    // 2. Transaction Tab
    if (!matchesTransactionTab(item, activeTab)) return false;

    // 3. Search query / Code / Location
    if (!matchesLocationOrText(item, searchQuery)) return false;

    // 4. Category & SubTypes
    if (!matchesCategory(item, selectedSubTypes, selectedType)) return false;

    // 5. Bedrooms & Parking
    if (Number(minBedrooms) > 0 && (item.bedrooms || 0) < Number(minBedrooms)) return false;
    if (Number(minParkingSpots) > 0 && (item.parkingSpots || 0) < Number(minParkingSpots)) return false;

    // 6. Price & Area
    const effectivePrice = item.transactionType === 'Venda'
      ? (item.price || 0)
      : (showTotalCost ? ((item.rentPrice || 0) + (item.condoFee || 0) + (item.iptu || 0)) : (item.rentPrice || 0));

    if (filters.minPrice && effectivePrice < filters.minPrice) return false;
    if (filters.maxPrice && effectivePrice > filters.maxPrice) return false;
    if (filters.minArea > 0 && (item.area || 0) < filters.minArea) return false;
    if (filters.minParking > 0 && (item.parkingSpots || 0) < filters.minParking) return false;

    // 7. Stage Filter
    if (filters.stage && filters.stage !== 'all') {
      if (filters.stage === 'pronto' && (item.isLaunch || item.transactionType === 'Leilao')) return false;
      if (filters.stage === 'planta' && !item.isLaunch && !item.isRelease) return false;
      if (filters.stage === 'novo' && !item.isNew && !item.isLaunch) return false;
      if (filters.stage === 'leilao' && item.transactionType !== 'Leilao' && !item.isAuction) return false;
    }

    // 8. Floor Position Filter
    if (filters.floorPosition && filters.floorPosition !== 'all') {
      const fullText = `${item.title || ''} ${item.subType || ''} ${item.description || ''}`.toLowerCase();
      if (filters.floorPosition === 'terreo' && !fullText.includes('térreo') && !fullText.includes('garden') && !item.amenities?.includes('Térreo')) return false;
      if (filters.floorPosition === 'alto' && !fullText.includes('andar alto') && !fullText.includes('vista livre') && !item.amenities?.includes('Andar Alto')) return false;
      if (filters.floorPosition === 'cobertura' && item.subType !== 'Cobertura' && !fullText.includes('cobertura') && !fullText.includes('duplex') && !fullText.includes('triplex')) return false;
      if (filters.floorPosition === 'baixo' && (fullText.includes('cobertura') || fullText.includes('andar alto'))) return false;
    }

    // 9. Amenities Filter
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAll = filters.amenities.every(amenity => {
        if (amenity === 'Aceita Permuta') return item.acceptsExchange || item.description?.toLowerCase().includes('permuta');
        if (amenity === 'Minha Casa Minha Vida (MCMV)') return (item.price || 0) <= 350000 && item.transactionType === 'Venda';
        if (amenity === 'Apenas com Tour Virtual 360°') return item.hasVirtualTour || true;
        if (amenity === 'Aluguel Sem Fiador (Garantia Digital)') return item.transactionType === 'Aluguel';
        return item.amenities?.includes(amenity);
      });
      if (!hasAll) return false;
    }

    // 10. Radius Filter (Geographic distance)
    if (activeRadiusFilter && activeRadiusFilter.lat && activeRadiusFilter.lng && activeRadiusFilter.radiusKm) {
      if (!item.lat || !item.lng) return false;
      const dist = calculateDistanceKm(activeRadiusFilter.lat, activeRadiusFilter.lng, item.lat, item.lng);
      if (dist > activeRadiusFilter.radiusKm) return false;
    }

    return true;
  });
}
