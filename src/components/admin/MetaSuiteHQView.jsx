// src/components/admin/MetaSuiteHQView.jsx
import React, { useState, useEffect } from 'react';
import {
  getIssuedTokens,
  issueClientToken,
  revokeClientToken,
  getAuditLog
} from '../../logic/security/accessTokensEngine.js';
import { getSuitePlaybooks } from '../../data/suitePlaybooksRegistry.js';

export default function MetaSuiteHQView({ onBackToPortal }) {
  const [tokens, setTokens] = useState(() => getIssuedTokens());
  const [auditLogs, setAuditLogs] = useState(() => getAuditLog());
  const [playbooks] = useState(() => getSuitePlaybooks());
  const [activeTab, setActiveTab] = useState('tokens'); // 'tokens' | 'audit' | 'playbooks'
  const [copySuccessId, setCopySuccessId] = useState(null);

  // Formulario de emisión de nuevo enlace
  const [form, setForm] = useState({
    playbookId: playbooks[0]?.id || 'lullaby-cdmx-2026',
    clienteDestino: '',
    destinatarioNombre: '',
    rol: 'viewer', // 'viewer' | 'reviewer'
    duracionDias: 30,
    watermarkText: ''
  });

  const handleCreateToken = (e) => {
    e.preventDefault();
    if (!form.clienteDestino.trim()) return;

    const selectedPlaybook = playbooks.find(p => p.id === form.playbookId);

    const tokenRecord = issueClientToken({
      playbookId: form.playbookId,
      playbookTitulo: selectedPlaybook?.titulo || 'Playbook Provokers',
      clienteDestino: form.clienteDestino.trim(),
      destinatarioNombre: form.destinatarioNombre.trim() || form.clienteDestino.trim(),
      rol: form.rol,
      duracionDias: parseInt(form.duracionDias) || 0,
      watermarkText: form.watermarkText.trim() || `DOCUMENTO CONFIDENCIAL · PROPIEDAD DE ${form.clienteDestino.trim().toUpperCase()}`,
      restrictToPlaybook: true
    });

    setTokens(getIssuedTokens());
    setAuditLogs(getAuditLog());
    
    // Limpiar form
    setForm(prev => ({
      ...prev,
      clienteDestino: '',
      destinatarioNombre: '',
      watermarkText: ''
    }));

    handleCopyLink(tokenRecord);
  };

  const handleRevoke = (tokenId) => {
    if (window.confirm('¿Estás seguro de revocar este enlace de acceso? El cliente ya no podrá abrir el Playbook.')) {
      revokeClientToken(tokenId);
      setTokens(getIssuedTokens());
      setAuditLogs(getAuditLog());
    }
  };

  const handleCopyLink = (tokenRecord) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareableUrl = `${baseUrl}?token=${tokenRecord.encodedToken}`;

    navigator.clipboard.writeText(shareableUrl).then(() => {
      setCopySuccessId(tokenRecord.tokenId);
      setTimeout(() => setCopySuccessId(null), 3000);
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '2rem 1.5rem', fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header Superior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onBackToPortal}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                padding: '7px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              ← Carátula de la Suite
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '2px 8px', borderRadius: '10px', border: '1px solid #FFEDD5' }}>
                  CENTRO DE GOBIERNO & SUPERVISIÓN
                </span>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Master Access Token Engine v1.0</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#191919', margin: '4px 0 0 0' }}>
                Meta-Suite HQ (Control de Accesos & Clientes)
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('tokens')}
              style={{
                backgroundColor: activeTab === 'tokens' ? '#1E293B' : '#FFFFFF',
                color: activeTab === 'tokens' ? '#FFFFFF' : '#475569',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🔑 Enlaces Emitidos ({tokens.length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              style={{
                backgroundColor: activeTab === 'audit' ? '#1E293B' : '#FFFFFF',
                color: activeTab === 'audit' ? '#FFFFFF' : '#475569',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              📋 Auditoría & Accesos ({auditLogs.length})
            </button>
          </div>
        </div>

        {/* TAB 1: GESTIÓN DE ENLACES & EMISIÓN */}
        {activeTab === 'tokens' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'flex-start' }}>
            {/* Panel Formulario: Emitir Enlace */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#191919' }}>
                    Emitir Enlace Blindado
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748B' }}>
                    Aislar a un cliente en su Playbook sin acceso a otros estudios
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateToken} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                    Playbook Asignado *
                  </label>
                  <select
                    value={form.playbookId}
                    onChange={(e) => setForm({ ...form, playbookId: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.86rem', backgroundColor: '#FFFFFF', outline: 'none' }}
                  >
                    {playbooks.map(p => (
                      <option key={p.id} value={p.id}>{p.icono} {p.titulo} ({p.cliente})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                    Nombre del Cliente / Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Nestlé México, Heineken..."
                    value={form.clienteDestino}
                    onChange={(e) => setForm({ ...form, clienteDestino: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                    Destinatario o Contacto Líder
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Dirección de Insights / Marca"
                    value={form.destinatarioNombre}
                    onChange={(e) => setForm({ ...form, destinatarioNombre: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                      Rol de Acceso
                    </label>
                    <select
                      value={form.rol}
                      onChange={(e) => setForm({ ...form, rol: e.target.value })}
                      style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.84rem', outline: 'none' }}
                    >
                      <option value="viewer">Solo Lectura (Viewer)</option>
                      <option value="reviewer">Revisor con Exportación</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                      Vigencia
                    </label>
                    <select
                      value={form.duracionDias}
                      onChange={(e) => setForm({ ...form, duracionDias: e.target.value })}
                      style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.84rem', outline: 'none' }}
                    >
                      <option value="7">7 días</option>
                      <option value="15">15 días</option>
                      <option value="30">30 días</option>
                      <option value="60">60 días</option>
                      <option value="0">Permanente (Sin vencer)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                    Marca de Agua Confidencial
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generada con el nombre del cliente si se deja vacío"
                    value={form.watermarkText}
                    onChange={(e) => setForm({ ...form, watermarkText: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.84rem', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  className="primary-button"
                  style={{
                    marginTop: '0.5rem',
                    padding: '11px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(246, 145, 30, 0.25)'
                  }}
                >
                  🚀 Generar y Copiar Enlace Seguro
                </button>
              </form>
            </div>

            {/* Panel Tabla: Enlaces Activos */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#191919' }}>
                  Enlaces de Clientes Emitidos ({tokens.length})
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                  Aislamiento estricto de estudios activo
                </span>
              </div>

              {tokens.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                  <span style={{ fontSize: '2.5rem' }}>📭</span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>Aún no has emitido enlaces de acceso restringido para clientes.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tokens.map(token => {
                    const isRevoked = token.estado === 'REVOCADO';
                    const isExpired = token.estado === 'EXPIRADO';
                    const isActive = token.estado === 'ACTIVO';

                    return (
                      <div
                        key={token.tokenId}
                        style={{
                          border: isRevoked ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                          backgroundColor: isRevoked ? '#FEF2F2' : '#FFFFFF',
                          borderRadius: '14px',
                          padding: '1rem 1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#191919' }}>
                              🏢 {token.clienteDestino}
                            </span>
                            <span
                              style={{
                                fontSize: '0.66rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '8px',
                                backgroundColor: isActive ? '#DCFCE7' : isRevoked ? '#FEE2E2' : '#FEF3C7',
                                color: isActive ? '#166534' : isRevoked ? '#991B1B' : '#92400E'
                              }}
                            >
                              {token.estado}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
                              Rol: {token.rol}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                            Playbook: <strong>{token.playbookTitulo}</strong>
                          </div>

                          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'flex', gap: '10px' }}>
                            <span>Creado: {new Date(token.fechaCreacion).toLocaleDateString('es-MX')}</span>
                            <span>{token.fechaExpiracion ? `Vence: ${new Date(token.fechaExpiracion).toLocaleDateString('es-MX')}` : 'Sin expiración'}</span>
                            <span>Visitas: <strong>{token.totalVisitas || 0}</strong></span>
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleCopyLink(token)}
                            style={{
                              backgroundColor: copySuccessId === token.tokenId ? '#16A34A' : '#F1F5F9',
                              color: copySuccessId === token.tokenId ? '#FFFFFF' : '#191919',
                              border: '1px solid #CBD5E1',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {copySuccessId === token.tokenId ? '✓ Enlace Copiado' : '🔗 Copiar Enlace'}
                          </button>

                          {isActive && (
                            <button
                              onClick={() => handleRevoke(token.tokenId)}
                              title="Revocar acceso de inmediato"
                              style={{
                                backgroundColor: '#FFF',
                                border: '1px solid #FCA5A5',
                                color: '#DC2626',
                                borderRadius: '8px',
                                padding: '6px 10px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Revocar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AUDITORÍA Y TRAZABILIDAD */}
        {activeTab === 'audit' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', fontWeight: 900, color: '#191919' }}>
              Bitácora de Trazabilidad & Accesos de Clientes
            </h3>

            {auditLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                <p>No se han registrado eventos de acceso en esta sesión.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {auditLogs.map(log => (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: log.tipo === 'ACCESO_PLAYBOOK' ? '#DCFCE7' : log.tipo === 'TOKEN_REVOCADO' ? '#FEE2E2' : '#EEF2FF',
                          color: log.tipo === 'ACCESO_PLAYBOOK' ? '#166534' : log.tipo === 'TOKEN_REVOCADO' ? '#991B1B' : '#4338CA'
                        }}
                      >
                        {log.tipo}
                      </span>
                      <span style={{ color: '#191919', fontWeight: 600 }}>{log.detalles}</span>
                      {log.cliente && (
                        <span style={{ color: '#64748B', fontSize: '0.76rem' }}>({log.cliente})</span>
                      )}
                    </div>
                    <span style={{ color: '#94A3B8', fontSize: '0.74rem' }}>
                      {new Date(log.timestamp).toLocaleString('es-MX')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
