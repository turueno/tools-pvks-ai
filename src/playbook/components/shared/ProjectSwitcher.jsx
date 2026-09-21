// src/playbook/components/shared/ProjectSwitcher.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';

export default function ProjectSwitcher({ onOpenNewProject }) {
  const { projects, activeProjectId, activeProject, switchProject, deleteProject } = usePlaybookData();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Botón Trigger del Switcher */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        title="Alternar entre Playbooks independientes o crear uno nuevo"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F8FAFC',
          border: '1.5px solid #E2E8F0',
          borderRadius: '10px',
          padding: '6px 12px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          textAlign: 'left'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#F6911E';
          e.currentTarget.style.backgroundColor = '#FFFBF7';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.backgroundColor = '#F8FAFC';
        }}
      >
        <span style={{ fontSize: '1.05rem' }}>📁</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#191919', maxWidth: '210px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeProject?.nombre || 'Seleccionar Playbook'}
            </span>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '1px 6px', borderRadius: '6px', border: '1px solid #FFEDD5' }}>
              {activeProject?.cliente?.split(' ')[0] || 'PVKS'}
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
            {activeProject?.vertical || 'Etnografía'} · {activeProject?.confidencialidad ? '🔒 Confidencial' : ''}
          </span>
        </div>
        <span style={{ color: '#94A3B8', fontSize: '0.7rem', marginLeft: '4px' }}>
          ▼
        </span>
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '320px',
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)',
            border: '1px solid #E2E8F0',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Header del dropdown */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #F1F5F9', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Playbooks Registrados ({projects.length})
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenNewProject) onOpenNewProject();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#F6911E',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '2px 6px'
              }}
            >
              + Nuevo
            </button>
          </div>

          {/* Lista de Proyectos */}
          <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '6px' }}>
            {projects.map((p) => {
              const isSelected = p.id === activeProjectId;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    switchProject(p.id);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#FFF7ED' : 'transparent',
                    border: isSelected ? '1px solid #F6911E' : '1px solid transparent',
                    marginBottom: '4px',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#C25E00' : '#191919', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.nombre}
                      </span>
                      {isSelected && (
                        <span style={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: 800 }}>✓</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <span>🏢 {p.cliente}</span>
                      <span>• {p.vertical}</span>
                    </div>
                  </div>

                  {!p.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(p.id);
                      }}
                      title="Eliminar Playbook"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '4px',
                        fontSize: '0.75rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer: Crear Nuevo */}
          <div style={{ padding: '8px 10px', borderTop: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenNewProject) onOpenNewProject();
              }}
              className="primary-button"
              style={{
                width: '100%',
                fontSize: '0.78rem',
                padding: '7px 12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>+</span> Crear Nuevo Playbook
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
