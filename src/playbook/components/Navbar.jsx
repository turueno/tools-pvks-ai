// src/playbook/components/Navbar.jsx
import React from 'react';
import { Icon } from './shared/Icons.jsx';
import { BRANDS } from '../data/schema.js';
import { usePlaybookData } from '../context/usePlaybookData.js';
import { useSuiteDictionary } from '../../context/useSuiteDictionary.js';
import EditableText from '../../components/shared/EditableText.jsx';
import MetaAdminPill from '../../components/admin/MetaAdminPill.jsx';
import { useAccessGuard } from '../../context/AccessGuardContext.jsx';

export default function Navbar({
  currentView,
  onSelectView,
  searchQuery,
  onSearchChange,
  selectedBrand,
  onSelectBrand,
  selectedEpistemic,
  onSelectEpistemic,
  onBackToPortal,
  onOpenExportShare
}) {
  const { isAdmin, toggleAdmin, activeProject } = usePlaybookData();
  const { t } = useSuiteDictionary();
  const guard = useAccessGuard();

  const navItems = [
    { id: 'overview', dictKey: 'navbar.tabs.overview', label: 'Overview', icon: 'overview' },
    { id: 'evidence', dictKey: 'navbar.tabs.evidence', label: 'Evidence Library', icon: 'evidence' },
    { id: 'insights', dictKey: 'navbar.tabs.insights', label: 'Insight Cards', icon: 'cards' },
    { id: 'system-map', dictKey: 'navbar.tabs.systemMap', label: 'System Maps', icon: 'network' },
    { id: 'tensions', dictKey: 'navbar.tabs.tensions', label: 'Tension Explorer', icon: 'tension' },
    { id: 'decisions', dictKey: 'navbar.tabs.decisions', label: 'Decision Explorer', icon: 'decision' },
    { id: 'transitions', dictKey: 'navbar.tabs.transitions', label: 'Transition Explorer', icon: 'transition' },
    { id: 'scenario', dictKey: 'navbar.tabs.scenario', label: 'Scenario Lab', icon: 'scenario', highlight: true },
    { id: 'opportunities', dictKey: 'navbar.tabs.opportunities', label: 'Opportunity Builder', icon: 'opportunity' },
    { id: 'matrix', dictKey: 'navbar.tabs.matrix', label: 'Matriz 3 Marcas', icon: 'matrix' },
    { id: 'ai', dictKey: 'navbar.tabs.ai', label: 'Asistente IA', icon: 'ai', special: true },
    { id: 'admin', dictKey: 'navbar.tabs.admin', label: 'Admin (CMS)', icon: 'settings', adminBadge: true }
  ];

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}
    >
      {/* Top Brand Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.75rem',
          borderBottom: '1px solid #F1F5F9',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              title="Volver al Portal Suite PVKS"
              style={{
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                color: '#475569',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <EditableText dictKey="navbar.backBtn" defaultText="← Suite PVKS" />
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Provokers Logo */}
            <img
              src="/images/provokers-logo.png"
              alt="Provokers Logo"
              style={{
                height: '38px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span
                  style={{
                    color: '#191919',
                    fontWeight: '900',
                    fontSize: '1.25rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  <EditableText dictKey="navbar.brand.title" defaultText="INSIGHTS" />{' '}
                  <span style={{ color: '#F6911E' }}>
                    <EditableText dictKey="navbar.brand.titleAccent" defaultText="PLAYBOOK" />
                  </span>
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    backgroundColor: '#F8FAFC',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    display: 'inline-flex',
                    alignItems: 'baseline',
                    gap: '4px'
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
                      color: '#000000',
                      fontWeight: 700
                    }}
                  >
                    <EditableText dictKey="navbar.brand.challenging" defaultText="Challenging" />
                  </span>
                  <span
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontStyle: 'italic',
                      color: '#000000',
                      fontWeight: 600
                    }}
                  >
                    <EditableText dictKey="navbar.brand.knowledge" defaultText="Knowledge" />
                  </span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                  <EditableText dictKey="navbar.brand.subtitle" defaultText="SISTEMA DE CONOCIMIENTO ESTRATÉGICO · ETNOGRAFÍA CDMX" />
                </span>
                {activeProject && (
                  <span style={{ fontSize: '0.66rem', color: '#047857', backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '6px', fontWeight: 700, border: '1px solid #A7F3D0' }}>
                    {activeProject.cliente}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global Search & Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '650px', justifyContent: 'flex-end' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '180px', maxWidth: '300px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }}>
              <Icon name="search" size={14} />
            </span>
            <input
              type="text"
              placeholder={t('navbar.search.placeholder', 'Buscar cita, actor, hallazgo, tensión...')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#F8F9FA',
                border: '1px solid #CBD5E1',
                borderRadius: '20px',
                padding: '7px 12px 7px 32px',
                color: '#191919',
                fontSize: '0.84rem',
                outline: 'none',
                marginBottom: 0
              }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>

          {/* Filter Brand */}
          <select
            value={selectedBrand}
            onChange={(e) => onSelectBrand(e.target.value)}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '6px 10px',
              color: '#191919',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
              marginBottom: 0,
              width: 'auto'
            }}
          >
            <option value="ALL">Todas las marcas</option>
            {BRANDS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Filter Epistemic Level */}
          <select
            value={selectedEpistemic}
            onChange={(e) => onSelectEpistemic(e.target.value)}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '6px 10px',
              color: '#191919',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
              marginBottom: 0,
              width: 'auto'
            }}
          >
            <option value="ALL">Todos los niveles</option>
            <option value="OBSERVADO">OBSERVADO</option>
            <option value="DERIVADO">DERIVADO</option>
            <option value="HIPOTESIS">HIPÓTESIS</option>
          </select>

          {/* Export & Share Modal Trigger */}
          <button
            onClick={onOpenExportShare}
            title="Exportar a PDF, generar informe o compartir enlace de solo lectura"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              color: '#191919',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#F6911E';
              e.currentTarget.style.color = '#C25E00';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.color = '#191919';
            }}
          >
            <Icon name="printer" size={14} color="#F6911E" />
            <span>Exportar / Compartir</span>
          </button>

          {/* Admin Toggle (Contenidos) - Oculto en modo cliente restringido */}
          {!guard.isRestricted && (
            <button
              onClick={toggleAdmin}
              title={isAdmin ? 'Desactivar Modo Administrador' : 'Activar Modo Administrador (Habilitar edición de contenidos)'}
              style={{
                backgroundColor: isAdmin ? '#FFF7ED' : '#F1F5F9',
                border: isAdmin ? '1.5px solid #F6911E' : '1px solid #CBD5E1',
                color: isAdmin ? '#C25E00' : '#64748B',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{isAdmin ? '🛡️ Admin: ACTIVO' : '🔒 Admin: OFF'}</span>
            </button>
          )}

          {/* Meta-Admin UI Editor Pill - Oculto en modo cliente restringido */}
          {!guard.isRestricted && <MetaAdminPill compact={true} />}

          {/* Indicador de Modo Cliente Restringido con Marca de Agua */}
          {guard.isRestricted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
              <span>🔒 Modo Lectura Cliente</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <nav
        style={{
          display: 'flex',
          overflowX: 'auto',
          padding: '0 1.5rem',
          scrollbarWidth: 'none',
          gap: '4px',
          alignItems: 'center'
        }}
      >
        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '0.7rem 0.95rem',
                border: 'none',
                borderBottom: isActive ? '2px solid #F6911E' : '2px solid transparent',
                backgroundColor: isActive ? 'rgba(246, 145, 30, 0.1)' : 'transparent',
                color: isActive ? '#F6911E' : item.special ? '#775AFF' : item.highlight ? '#00B487' : '#A0A0A0',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon
                name={item.icon}
                size={16}
                color={isActive ? '#F6911E' : item.special ? '#775AFF' : item.highlight ? '#00B487' : '#A0A0A0'}
              />
              <EditableText dictKey={item.dictKey} defaultText={item.label} />
              {item.highlight && (
                <span
                  style={{
                    backgroundColor: '#10b981',
                    color: '#064e3b',
                    fontSize: '0.62rem',
                    padding: '1px 5px',
                    borderRadius: '8px',
                    fontWeight: 800
                  }}
                >
                  SIMULADOR
                </span>
              )}
              {item.special && (
                <span
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    padding: '1px 5px',
                    borderRadius: '8px',
                    fontWeight: 800
                  }}
                >
                  12 ACCIONES
                </span>
              )}
              {item.adminBadge && (
                <span
                  style={{
                    backgroundColor: isAdmin ? '#F6911E' : '#94A3B8',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    padding: '1px 5px',
                    borderRadius: '8px',
                    fontWeight: 800
                  }}
                >
                  CMS
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
