// src/components/admin/MetaAdminPill.jsx
import React from 'react';
import { useSuiteDictionary } from '../../context/useSuiteDictionary.js';

export default function MetaAdminPill({ compact = false }) {
  const { isMetaAdmin, openAuthModal, logoutMetaAdmin, openMetaCMS } = useSuiteDictionary();

  if (!isMetaAdmin) {
    return (
      <button
        onClick={openAuthModal}
        title="Desbloquear edición de estructura, títulos y botones de la Suite"
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #CBD5E1',
          color: '#64748B',
          borderRadius: '20px',
          padding: compact ? '4px 10px' : '5px 12px',
          fontSize: compact ? '0.72rem' : '0.76rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          transition: 'all 0.15s ease'
        }}
        className="card-hover-fx"
      >
        <span>🔒</span> Meta-Admin
      </button>
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <button
        onClick={openMetaCMS}
        title="Abrir Catálogo Maestro de Copys y Estructura"
        style={{
          backgroundColor: '#FFF7ED',
          border: '1.5px solid #F6911E',
          color: '#C25E00',
          borderRadius: '20px',
          padding: compact ? '4px 10px' : '5px 12px',
          fontSize: compact ? '0.72rem' : '0.76rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          boxShadow: '0 2px 8px rgba(246, 145, 30, 0.2)'
        }}
        className="card-hover-fx"
      >
        <span>⚙️</span> Meta-Admin: ACTIVO
      </button>

      <button
        onClick={() => {
          if (window.__pvksOpenSuiteHQ) {
            window.__pvksOpenSuiteHQ();
          } else {
            openMetaCMS();
          }
        }}
        title="Abrir Dashboard de Gobierno y Control de Clientes Meta-Suite HQ"
        style={{
          backgroundColor: '#1E293B',
          border: '1px solid #0F172A',
          color: '#F8FAFC',
          borderRadius: '6px',
          padding: compact ? '3px 8px' : '4px 10px',
          fontSize: '0.72rem',
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        🛡️ Meta-HQ
      </button>

      <button
        onClick={openMetaCMS}
        title="Ver y buscar todos los copys en tabla"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          color: '#334155',
          borderRadius: '6px',
          padding: compact ? '3px 8px' : '4px 10px',
          fontSize: '0.72rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        📖 Copys
      </button>

      <button
        onClick={logoutMetaAdmin}
        title="Bloquear y cerrar sesión de Meta-Admin"
        style={{
          backgroundColor: '#F1F5F9',
          border: '1px solid #E2E8F0',
          color: '#64748B',
          borderRadius: '6px',
          padding: compact ? '3px 8px' : '4px 8px',
          fontSize: '0.72rem',
          cursor: 'pointer'
        }}
      >
        Salir
      </button>
    </div>
  );
}
