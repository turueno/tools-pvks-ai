// src/playbook/components/shared/ExportShareModal.jsx
import React, { useState } from 'react';
import { Icon } from './Icons.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';

import { issueClientToken } from '../../../logic/security/accessTokensEngine.js';

export default function ExportShareModal({
  isOpen,
  onClose,
  currentView = 'overview',
  projectName,
  projectId,
  clientName
}) {
  const { exportDataJSON, insights: INSIGHTS, evidences: EVIDENCES, activeProject, activeProjectId } = usePlaybookData();
  const effectiveProjectId = projectId || activeProjectId || activeProject?.id || 'lullaby-cdmx-2026';
  const effectiveProjectName = projectName || activeProject?.nombre || 'Inmersiones Hogar CDMX (Lullaby)';
  const effectiveClientName = clientName || activeProject?.cliente || 'Nestlé Infant Nutrition';

  const [copySuccess, setCopySuccess] = useState(false);
  const [shareConfig, setShareConfig] = useState({
    recipient: '',
    role: 'viewer', // 'viewer' | 'reviewer'
    expiresInDays: '30',
    includeWatermark: true,
    watermarkText: `DOCUMENTO CONFIDENCIAL · PROPIEDAD DE ${effectiveClientName.toUpperCase()}`
  });

  if (!isOpen) return null;

  const handlePrintCurrentView = () => {
    onClose();
    // Dar un breve tiempo para que el modal se cierre antes de disparar el print dialog
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleCopyShareLink = () => {
    // Emitir token oficial blindado registrado en Meta-Suite HQ
    const tokenRecord = issueClientToken({
      playbookId: effectiveProjectId,
      playbookTitulo: effectiveProjectName,
      clienteDestino: effectiveClientName,
      destinatarioNombre: shareConfig.recipient || effectiveClientName,
      rol: shareConfig.role,
      duracionDias: parseInt(shareConfig.expiresInDays) || 30,
      watermarkText: shareConfig.watermarkText,
      restrictToPlaybook: true
    });

    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('token', tokenRecord.encodedToken);

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  const viewLabels = {
    overview: 'Resumen Ejecutivo (Overview)',
    evidence: 'Biblioteca de Evidencias Etnográficas',
    insights: 'Fichas de Insight (17 Campos)',
    'system-map': 'Mapa Sistémico Relacional',
    tensions: 'Tension Explorer (Ejes Bipolares)',
    decisions: 'Decision Explorer (Viaje de Validación)',
    transitions: 'Transition Explorer (Puntos de Inflexión)',
    scenario: 'Scenario Lab (Simulador Dinámico)',
    opportunities: 'Opportunity Builder',
    matrix: 'Matriz Comparativa de Marcas (Pág. 29)',
    ai: 'Consultas de Asistente IA',
    admin: 'Base de Datos Completa'
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(25, 25, 25, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #E2E8F0',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FAFAFA'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '2px 8px', borderRadius: '10px', border: '1px solid #FFEDD5' }}>
                EXPORTACIÓN & GOBIERNO DE ENTREGABLES
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                ID: {projectId}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#191919', fontWeight: 900 }}>
              Exportar o Compartir Playbook
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              color: '#64748B',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Metadata del Proyecto Actual */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Proyecto Activo
              </span>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#191919' }}>
                {projectName}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#0369A1', fontWeight: 600 }}>
                Cliente: {clientName}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Vista Seleccionada:
              </span>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F6911E' }}>
                {viewLabels[currentView] || currentView}
              </div>
            </div>
          </div>

          {/* Opción 1: Exportar a PDF Vectorial (Print Engine) */}
          <div
            style={{
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1.25rem',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFF7ED', color: '#F6911E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="print" size={18} color="#F6911E" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#191919' }}>
                    1. Imprimir o Guardar en PDF Vectorial
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                    Genera un documento editorial de alta resolución, seleccionable y listo para imprimir o enviar.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ margin: '12px 0', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px', fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>✓ Oculta automáticamente controles, filtros y barras de navegación</div>
              <div>✓ Agrega membrete Provokers oficial con fecha y nombre del estudio</div>
              <div>✓ Mantiene la nitidez tipográfica y evita que las tarjetas de insight se corten a la mitad</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={handlePrintCurrentView}
                className="primary-button"
                style={{ fontSize: '0.84rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Icon name="print" size={16} color="#FFFFFF" /> Imprimir / PDF de esta Vista
              </button>

              <button
                onClick={() => {
                  window.scrollTo({ top: 0 });
                  onClose();
                  setTimeout(() => window.print(), 250);
                }}
                className="secondary-button"
                style={{ fontSize: '0.84rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Icon name="file-text" size={16} /> Preparar Todo el Dossier
              </button>
            </div>
          </div>

          {/* Opción 2: Compartir Enlace Seguro y Supervisado */}
          <div
            style={{
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1.25rem',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E0F2FE', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="share" size={18} color="#0284c7" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#191919' }}>
                  2. Enlace Directo Supervisado (Modo Solo Lectura)
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                  Permite a usuarios externos o directores consultar la suite sin permisos de edición.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Destinatario / Correo (Opcional para telemetría):
                </label>
                <input
                  type="text"
                  placeholder="ej. director.marca@cliente.com"
                  value={shareConfig.recipient}
                  onChange={(e) => setShareConfig(prev => ({ ...prev, recipient: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Vigencia del enlace:
                </label>
                <select
                  value={shareConfig.expiresInDays}
                  onChange={(e) => setShareConfig(prev => ({ ...prev, expiresInDays: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="7">7 días (Acceso temporal)</option>
                  <option value="30">30 días (Presentación mensual)</option>
                  <option value="90">90 días (Ciclo de proyecto)</option>
                  <option value="unlimited">Acceso continuo</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={handleCopyShareLink}
                className="secondary-button"
                style={{
                  fontSize: '0.84rem',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: copySuccess ? '#ECFDF5' : '#FFFFFF',
                  borderColor: copySuccess ? '#10B981' : '#CBD5E1',
                  color: copySuccess ? '#047857' : '#191919'
                }}
              >
                <Icon name={copySuccess ? 'check' : 'share'} size={15} color={copySuccess ? '#047857' : 'currentColor'} />
                {copySuccess ? '¡Enlace copiado al portapapeles!' : 'Copiar Enlace de Solo Lectura'}
              </button>
            </div>
          </div>

          {/* Opción 3: Respaldo Estructurado de Datos (JSON) */}
          <div
            style={{
              border: '1px dashed #CBD5E1',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#191919' }}>
                Respaldo de Datos Crudos (JSON)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Descarga la estructura completa ({INSIGHTS.length} insights, {EVIDENCES.length} evidencias) para migración o backup.
              </div>
            </div>

            <button
              onClick={() => {
                exportDataJSON();
                onClose();
              }}
              className="secondary-button"
              style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Icon name="download" size={14} /> Descargar JSON
            </button>
          </div>

        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#FAFAFA',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: '#64748B'
          }}
        >
          <span>🔒 Los enlaces de solo lectura protegen el modo edición CMS</span>
          <button
            onClick={onClose}
            className="secondary-button"
            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
