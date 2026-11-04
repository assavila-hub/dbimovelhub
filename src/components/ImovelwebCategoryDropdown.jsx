import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, Minus, X, Building2 } from 'lucide-react';
import { PROPERTY_TAXONOMY } from '../mockData/categories.js';
import { INITIAL_PROPERTIES } from '../mockData/properties.js';

export default function ImovelwebCategoryDropdown({
  selectedSubTypes = [], // array of subcategories selected, e.g. ['Cobertura', 'Casa de Vila']
  onChangeSelectedSubTypes,
  isDropdown = true, // when true, renders as popover dropdown; when false, renders inline list
  properties = INITIAL_PROPERTIES // full properties list to calculate counts
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState({}); // { 'Apartamento': false, 'Casa': false }
  const dropdownRef = useRef(null);

  // Active property list for counting
  const propList = properties && properties.length > 0 ? properties : INITIAL_PROPERTIES;

  const getCategoryCount = (catName) => {
    return propList.filter(p => p.type === catName).length;
  };

  const getSubcategoryCount = (catName, subName) => {
    return propList.filter(p => (p.type === catName && p.subType === subName) || p.subType === subName).length;
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdown]);

  const toggleCategoryCollapse = (catName, e) => {
    e?.stopPropagation();
    setCollapsedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const isSubcategorySelected = (subName) => {
    return selectedSubTypes.includes(subName);
  };

  const toggleSubcategory = (subName, e) => {
    e?.stopPropagation();
    if (selectedSubTypes.includes(subName)) {
      onChangeSelectedSubTypes(selectedSubTypes.filter(item => item !== subName));
    } else {
      onChangeSelectedSubTypes([...selectedSubTypes, subName]);
    }
  };

  const getCategorySelectionState = (category) => {
    const totalSubs = category.subcategories.length;
    const selectedCount = category.subcategories.filter(s => selectedSubTypes.includes(s)).length;

    if (selectedCount === 0) return 'none'; // unselected
    if (selectedCount === totalSubs) return 'all'; // all selected
    return 'indeterminate'; // some selected
  };

  const toggleCategoryAll = (category, e) => {
    e?.stopPropagation();
    const currentState = getCategorySelectionState(category);
    const subNames = category.subcategories;

    if (currentState === 'all' || currentState === 'indeterminate') {
      // Unselect all in this category
      onChangeSelectedSubTypes(selectedSubTypes.filter(s => !subNames.includes(s)));
    } else {
      // Select all in this category
      const uniqueCombined = Array.from(new Set([...selectedSubTypes, ...subNames]));
      onChangeSelectedSubTypes(uniqueCombined);
    }
  };

  const clearAllSelections = (e) => {
    e?.stopPropagation();
    onChangeSelectedSubTypes([]);
  };

  // Button Trigger Label
  const getTriggerLabel = () => {
    if (!selectedSubTypes || selectedSubTypes.length === 0) {
      return `Tipo de Imóvel (Todos - ${propList.length} imóveis)`;
    }
    if (selectedSubTypes.length === 1) {
      return selectedSubTypes[0];
    }
    if (selectedSubTypes.length === 2) {
      return `${selectedSubTypes[0]}, ${selectedSubTypes[1]}`;
    }
    return `${selectedSubTypes[0]} +${selectedSubTypes.length - 1} tipos`;
  };

  const renderTreeContent = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      userSelect: 'none'
    }}>
      {PROPERTY_TAXONOMY.map(cat => {
        const selState = getCategorySelectionState(cat);
        const isCollapsed = collapsedCategories[cat.category];
        const catCount = getCategoryCount(cat.category);

        return (
          <div key={cat.category} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
            {/* Parent Category Row (Imovelweb Style) */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              className="category-tree-parent-hover"
              onClick={(e) => toggleCategoryAll(cat, e)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {/* Imovelweb Orange Checkbox */}
                <div 
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: selState === 'none' ? '2px solid var(--text-light)' : 'none',
                    backgroundColor: selState === 'none' ? 'transparent' : '#ff5a00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                >
                  {selState === 'all' && <Check size={13} strokeWidth={3.5} />}
                  {selState === 'indeterminate' && <Minus size={13} strokeWidth={3.5} />}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 700 }}>
                    {cat.category}
                  </strong>
                  <span style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '999px'
                  }}>
                    ({catCount})
                  </span>
                </div>
              </div>

              {/* Collapsible Chevron */}
              <button
                type="button"
                onClick={(e) => toggleCategoryCollapse(cat.category, e)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.2rem'
                }}
              >
                {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
            </div>

            {/* Subcategories (Indented List) */}
            {!isCollapsed && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                paddingLeft: '1.8rem',
                paddingTop: '0.25rem',
                paddingBottom: '0.35rem'
              }}>
                {cat.subcategories.map(sub => {
                  const isChecked = isSubcategorySelected(sub);
                  const subCount = getSubcategoryCount(cat.category, sub);

                  return (
                    <div
                      key={sub}
                      onClick={(e) => toggleSubcategory(sub, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.35rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease'
                      }}
                      className="category-tree-child-hover"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {/* Child Orange Checkbox */}
                        <div 
                          style={{
                            width: '17px',
                            height: '17px',
                            borderRadius: '3px',
                            border: isChecked ? 'none' : '2px solid var(--text-light)',
                            backgroundColor: isChecked ? '#ff5a00' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            transition: 'all 0.15s ease',
                            flexShrink: 0
                          }}
                        >
                          {isChecked && <Check size={12} strokeWidth={3.5} />}
                        </div>

                        <span style={{
                          fontSize: '0.85rem',
                          color: isChecked ? 'var(--text-main)' : 'var(--text-muted)',
                          fontWeight: isChecked ? 700 : 400
                        }}>
                          {sub}
                        </span>
                      </div>

                      {/* Subcategory count in parentheses */}
                      <span style={{
                        fontSize: '0.75rem',
                        color: isChecked ? '#ff5a00' : 'var(--text-light)',
                        fontWeight: 600
                      }}>
                        ({subCount})
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  if (!isDropdown) {
    return (
      <div style={{ width: '100%' }}>
        {renderTreeContent()}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 0.85rem',
          backgroundColor: 'var(--bg-card)',
          border: isOpen ? '1.5px solid #ff5a00' : '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          boxShadow: isOpen ? '0 0 0 3px rgba(255, 90, 0, 0.15)' : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
          <Building2 size={16} color="#ff5a00" style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: '0.85rem',
            fontWeight: selectedSubTypes.length > 0 ? 700 : 500,
            color: selectedSubTypes.length > 0 ? 'var(--text-main)' : 'var(--text-muted)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {getTriggerLabel()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          {selectedSubTypes.length > 0 && (
            <span style={{
              backgroundColor: '#ff5a00',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '0.1rem 0.45rem',
              borderRadius: '999px'
            }}>
              {selectedSubTypes.length}
            </span>
          )}
          {isOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Popover Menu (Imovelweb Exact UI) */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          minWidth: 'min(320px, 100vw - 32px)',
          maxWidth: '100%',
          maxHeight: '440px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 1500,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease'
        }}>
          {/* Popover Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-main)',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
              Selecione os tipos de imóvel
            </strong>
            {selectedSubTypes.length > 0 && (
              <button
                type="button"
                onClick={clearAllSelections}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#ff5a00',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0.2rem'
                }}
              >
                Limpar
              </button>
            )}
          </div>

          {/* Popover Scrollable Body */}
          <div style={{ padding: '0.75rem', overflowY: 'auto', flex: 1 }}>
            {renderTreeContent()}
          </div>

          {/* Popover Footer Button */}
          <div style={{
            padding: '0.65rem 1rem',
            backgroundColor: 'var(--bg-main)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setIsOpen(false)}
              style={{
                backgroundColor: '#ff5a00',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '0.45rem 1.2rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              Aplicar {selectedSubTypes.length > 0 ? `(${selectedSubTypes.length})` : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
