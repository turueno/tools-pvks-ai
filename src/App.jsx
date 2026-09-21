import React, { useState, useEffect } from 'react';
import { generateBlocks } from './logic/generator';
import { checkCompliance, checkUniversalCriteria } from './logic/compliance';
import { scorePAC, balancePAC, generateRecommendations } from './logic/pacEngine';
import SalsaNegraDiagnostic from './components/SalsaNegraDiagnostic';
import PlaybookApp from './playbook/PlaybookApp';
import { DOCUMENTO_RECTOR_TEXT } from './data/rectorData';
import MetaAdminCMSModal from './components/admin/MetaAdminCMSModal.jsx';
import MetaAdminAuthModal from './components/admin/MetaAdminAuthModal.jsx';
import MetaAdminPill from './components/admin/MetaAdminPill.jsx';
import EditableText from './components/shared/EditableText.jsx';
import NewSuitePlaybookModal from './components/admin/NewSuitePlaybookModal.jsx';
import MetaSuiteHQView from './components/admin/MetaSuiteHQView.jsx';
import RestrictedAccessScreen from './components/shared/RestrictedAccessScreen.jsx';
import { useAccessGuard } from './context/AccessGuardContext.jsx';
import { useSuiteDictionary } from './context/useSuiteDictionary.js';
import {
  getSuitePlaybooks,
  saveSuitePlaybooks,
  getActiveSuitePlaybookId,
  saveActiveSuitePlaybookId
} from './data/suitePlaybooksRegistry.js';
import './index.css';

function App() {
  const guard = useAccessGuard();
  const { isMetaAdmin, openAuthModal } = useSuiteDictionary();

  // El punto de entrada central de la aplicación es la carátula de la Suite ('portal')
  // Si entra un cliente con token restrictivo, dirigirlo directamente a su Playbook asignado
  const [view, setView] = useState(() => {
    if (guard.isRestricted && guard.restrictedPlaybookId) {
      if (guard.restrictedPlaybookId === 'pac-model-generator') return 'pac';
      if (guard.restrictedPlaybookId === 'sntd-diagnostic') return 'sntd';
      return 'playbook';
    }
    return 'portal';
  });
  
  // Registro maestro de Playbooks de la Suite
  const [suitePlaybooks, setSuitePlaybooks] = useState(() => getSuitePlaybooks());
  const [activePlaybookId, setActivePlaybookId] = useState(() => {
    if (guard.isRestricted && guard.restrictedPlaybookId) {
      return guard.restrictedPlaybookId;
    }
    return getActiveSuitePlaybookId();
  });

  const [isNewPlaybookModalOpen, setIsNewPlaybookModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('ALL');

  // Permitir que el botón Meta-HQ del pill abra la vista HQ
  useEffect(() => {
    window.__pvksOpenSuiteHQ = () => {
      setView('meta-hq');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return () => {
      delete window.__pvksOpenSuiteHQ;
    };
  }, []);

  useEffect(() => {
    saveSuitePlaybooks(suitePlaybooks);
  }, [suitePlaybooks]);

  useEffect(() => {
    saveActiveSuitePlaybookId(activePlaybookId);
  }, [activePlaybookId]);

  // Playbook seleccionado actualmente
  const activePlaybook = suitePlaybooks.find(p => p.id === activePlaybookId) || suitePlaybooks[0];

  const handleOpenPlaybook = (playbook) => {
    setActivePlaybookId(playbook.id);
    if (playbook.tipo === 'etnografico') {
      setView('playbook');
    } else if (playbook.tipo === 'pac') {
      setView('pac');
    } else if (playbook.tipo === 'sntd') {
      setView('sntd');
    } else {
      setView('playbook');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateSuitePlaybook = (newPlaybook) => {
    setSuitePlaybooks(prev => [newPlaybook, ...prev]);
    handleOpenPlaybook(newPlaybook);
  };

  const handleDeletePlaybook = (id) => {
    const target = suitePlaybooks.find(p => p.id === id);
    if (target?.isCore) {
      alert('Los Playbooks de fábrica no pueden eliminarse.');
      return;
    }
    if (window.confirm(`¿Eliminar el Playbook "${target?.titulo}" de la Suite?`)) {
      setSuitePlaybooks(prev => prev.filter(p => p.id !== id));
      if (activePlaybookId === id) {
        setActivePlaybookId('lullaby-cdmx-2026');
      }
    }
  };

  // Filtrado de Playbooks en el portal
  const filteredPlaybooks = suitePlaybooks.filter(p => {
    const matchesSearch = p.titulo.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.cliente.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesVertical = selectedVertical === 'ALL' || p.vertical === selectedVertical;
    return matchesSearch && matchesVertical;
  });

  const availableVerticals = Array.from(new Set(suitePlaybooks.map(p => p.vertical)));

  // Estado del generador PAC
  const [inputs, setInputs] = useState({
    target: 'Medico',
    pac: 'Prescribir',
    formato: 'Polvo',
    etapa: '',
    objetivo: 'Generar una opción de bienestar digestivo para pacientes sensibles.',
    beneficio: 'Digestión ligera y seguimiento profesional.',
    restricciones: ''
  });

  const [generated, setGenerated] = useState(null);
  const [validation, setValidation] = useState(null);
  const [_history, setHistory] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const runGenerator = (isAutoAdjust = false) => {
    let targetPAC = inputs.pac;
    if (isAutoAdjust) {
      if (inputs.target === 'Medico') targetPAC = 'Prescribir';
      if (inputs.target === 'Mama') targetPAC = 'Acompanar';
      if (inputs.target === 'Adulto') targetPAC = 'Comunicar';
    }

    const blocks = generateBlocks(inputs, isAutoAdjust ? targetPAC : null);
    const scores = scorePAC(blocks, inputs);
    const balance = balancePAC(scores, inputs.target);
    const compliance = checkCompliance(blocks);
    const criteria = checkUniversalCriteria(blocks, inputs);
    const recs = generateRecommendations(balance.decision, scores, balance.weights, criteria.faltantes);

    const result = {
      blocks,
      scores,
      balance,
      compliance,
      criteria,
      recs,
      timestamp: new Date().toISOString()
    };

    setGenerated(blocks);
    setValidation(result);
    setHistory(prev => [result, ...prev]);
  };

  // Si el enlace de acceso está revocado o vencido
  if (guard.isBlocked) {
    return <RestrictedAccessScreen reason={guard.blockReason} />;
  }

  return (
    <>
      <MetaAdminAuthModal />
      <MetaAdminCMSModal />
      <NewSuitePlaybookModal
        isOpen={isNewPlaybookModalOpen}
        onClose={() => setIsNewPlaybookModalOpen(false)}
        onCreatePlaybook={handleCreateSuitePlaybook}
      />

      {/* VISTA 0: DASHBOARD DE GOBIERNO & ACCESOS META-SUITE HQ */}
      {view === 'meta-hq' && (
        <MetaSuiteHQView onBackToPortal={() => setView('portal')} />
      )}

      {/* VISTA 1: INSIGHT PLAYBOOK ETNOGRÁFICO */}
      {view === 'playbook' && (
        <PlaybookApp
          onBackToPortal={guard.isRestricted ? null : () => setView('portal')}
        />
      )}

      {/* VISTA 2: CARÁTULA PRINCIPAL (PORTAL CENTRAL & HUB DE PLAYBOOKS) */}
      {view === 'portal' && (
        <div className="app-container theme-portal portal-view ritual-enter" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem' }}>
          {/* Top Meta Admin bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <MetaAdminPill />
          </div>

          {/* Hero Header */}
          <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '30px', padding: '6px 20px', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <img
                src="/images/provokers-logo.png"
                alt="Provokers Logo"
                style={{
                  height: '24px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif', color: '#000000', fontWeight: 700, fontSize: '0.86rem' }}>
                  <EditableText dictKey="navbar.brand.challenging" defaultText="Challenging" />
                </span>
                <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#000000', fontWeight: 600, fontSize: '0.88rem' }}>
                  <EditableText dictKey="navbar.brand.knowledge" defaultText="Knowledge" />
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', marginLeft: '4px' }}>
                  · <EditableText dictKey="portal.header.badge" defaultText="SUITE DE INTELIGENCIA" />
                </span>
              </div>
            </div>

            <h1 style={{ fontSize: '3.2rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#191919', margin: '0 0 10px 0' }}>
              <EditableText dictKey="portal.hero.title" defaultText="PROVOKERS AI TOOLS" />
            </h1>
            <p style={{ color: '#64748B', fontSize: '1.15rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.5 }}>
              <EditableText dictKey="portal.hero.subtitle" defaultText="Sistemas analíticos estructurados, modelado cualitativo y motores de decisión estratégica." multiline={true} />
            </p>
          </header>

          {/* Action Bar: Buscador, Filtros y Botón '+ Crear Playbook' */}
          <div style={{ maxWidth: '1240px', margin: '0 auto 2rem auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
              <input
                type="text"
                placeholder="Buscar Playbook por cliente, estudio o metodología..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              />
              <select
                value={selectedVertical}
                onChange={(e) => setSelectedVertical(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.86rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">Todas las Verticales</option>
                {availableVerticals.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => {
                  if (isMetaAdmin) {
                    setView('meta-hq');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    openAuthModal();
                  }
                }}
                style={{
                  fontSize: '0.88rem',
                  padding: '11px 18px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  backgroundColor: isMetaAdmin ? '#0F172A' : '#F8FAFC',
                  color: isMetaAdmin ? '#FFFFFF' : '#475569',
                  border: isMetaAdmin ? 'none' : '1.5px solid #CBD5E1',
                  cursor: 'pointer',
                  boxShadow: isMetaAdmin ? '0 4px 12px rgba(15, 23, 42, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s ease'
                }}
                title={isMetaAdmin ? 'Abrir Panel Central de Gobierno y Tokens' : 'Ingresar clave maestra para ver el Centro de Supervisión'}
              >
                <span>🛡️</span> {isMetaAdmin ? 'Supervisión & Accesos (HQ)' : 'Meta-Suite HQ'}
              </button>

              <button
                onClick={() => setIsNewPlaybookModalOpen(true)}
                className="primary-button"
                style={{
                  fontSize: '0.88rem',
                  padding: '11px 22px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(246, 145, 30, 0.25)'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>+</span> Crear Nuevo Playbook
              </button>
            </div>
          </div>

          {/* Galería Central de Playbooks de la Suite */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
            {filteredPlaybooks.map(playbook => {
              const borderAccentColor = playbook.color || '#F6911E';
              return (
                <div
                  key={playbook.id}
                  className="card-hover-fx"
                  onClick={() => handleOpenPlaybook(playbook)}
                  style={{
                    cursor: 'pointer',
                    padding: '2.25rem 2rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: `1.5px solid ${playbook.destacado ? borderAccentColor : '#E2E8F0'}`,
                    boxShadow: playbook.destacado
                      ? `0 8px 30px -4px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)`
                      : '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundColor: borderAccentColor }} />
                  
                  <div>
                    {/* Header de la tarjeta */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '2.5rem' }}>{playbook.icono || '🧭'}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: borderAccentColor, backgroundColor: '#FAFAFA', padding: '4px 10px', borderRadius: '12px', border: `1px solid ${borderAccentColor}40` }}>
                          {playbook.badge}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>
                          🏢 {playbook.cliente}
                        </span>
                      </div>
                    </div>

                    <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#191919', margin: '0 0 10px 0', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                      {playbook.titulo}
                    </h2>
                    
                    <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.55, margin: '0 0 1.75rem 0' }}>
                      {playbook.descripcion}
                    </p>
                  </div>

                  {/* Acciones de la tarjeta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className="primary-button"
                      style={{
                        flex: 1,
                        fontSize: '0.9rem',
                        padding: '11px',
                        fontWeight: 800,
                        backgroundColor: borderAccentColor,
                        borderColor: borderAccentColor
                      }}
                    >
                      Abrir Playbook →
                    </button>

                    {!playbook.isCore && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlaybook(playbook.id);
                        }}
                        title="Eliminar Playbook de la Suite"
                        style={{
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          color: '#94A3B8',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VISTA 3: S.N.T.D. DIAGNOSTIC */}
      {view === 'sntd' && (
        <div className="app-container theme-sntd" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            {!guard.isRestricted ? (
              <button className="back-button" onClick={() => setView('portal')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                ← Suite Provokers AI Tools
              </button>
            ) : (
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C25E00' }}>
                🛡️ MODO CONSULTA CLIENTE ({guard.watermarkText || 'CONFIDENCIAL'})
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
                Playbook: <strong style={{ color: '#191919' }}>S.N.T.D. Diagnostic</strong>
              </span>
              {!guard.isRestricted && <MetaAdminPill compact={true} />}
            </div>
          </div>
          <SalsaNegraDiagnostic documentoRector={DOCUMENTO_RECTOR_TEXT} />
        </div>
      )}

      {/* VISTA 4: P.A.C. MODEL GENERATOR */}
      {view === 'pac' && (
        <div className="app-container theme-pac ritual-enter" style={{ position: 'relative' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
            {!guard.isRestricted ? (
              <button className="back-button" onClick={() => setView('portal')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                ← Suite Provokers AI Tools
              </button>
            ) : (
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4F46E5' }}>
                🛡️ MODO CONSULTA CLIENTE
              </span>
            )}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <EditableText dictKey="pac.header.badge" defaultText="PLAYBOOK SEMIOLÓGICO & COMPLIANCE" />
              </div>
              <h1 style={{ fontSize: '2rem', margin: 0, color: '#191919', fontWeight: 800 }}>
                <EditableText dictKey="pac.header.title" defaultText="P.A.C. Model Generator & Multi-Criteria Validator" />
              </h1>
              <p style={{ color: '#64748B', margin: 0, fontSize: '0.85rem' }}>
                <EditableText dictKey="pac.header.desc" defaultText="Configura y evalúa bloques discursivos de producto bajo la metodología Prescribir, Acompañar y Comunicar con matrices de ponderación AHP." />
              </p>
            </div>
            <div style={{ width: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              {!guard.isRestricted && <MetaAdminPill compact={true} />}
            </div>
          </header>

          <div className="grid-layout">
            {/* Panel 1: Brief */}
            <div className="glass-panel">
              <h3>Brief Input</h3>
              <label>Target</label>
              <select name="target" value={inputs.target} onChange={handleInputChange}>
                <option value="Medico">Médico</option>
                <option value="Mama">Mamá</option>
                <option value="Adulto">Adulto</option>
              </select>

              <label>P.A.C. Focus</label>
              <select name="pac" value={inputs.pac} onChange={handleInputChange}>
                <option value="Prescribir">Prescribir</option>
                <option value="Acompanar">Acompañar</option>
                <option value="Comunicar">Comunicar</option>
              </select>

              <label>Formato</label>
              <select name="formato" value={inputs.formato} onChange={handleInputChange}>
                <option value="Polvo">Polvo (Especializado)</option>
                <option value="Líquido">Líquido (Rutina)</option>
              </select>

              {inputs.target === 'Mama' && (
                <>
                  <label>Etapa</label>
                  <input type="text" name="etapa" value={inputs.etapa} onChange={handleInputChange} placeholder="Ej. 1-3 años" />
                </>
              )}

              <label>Objetivo</label>
              <input type="text" name="objetivo" value={inputs.objetivo} onChange={handleInputChange} />

              <label>Beneficio Principal</label>
              <input type="text" name="beneficio" value={inputs.beneficio} onChange={handleInputChange} />

              <label>Restricciones / Alérgenos</label>
              <input type="text" name="restricciones" value={inputs.restricciones} onChange={handleInputChange} placeholder="Ej. Sin azúcar añadida" />

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="primary-button" onClick={() => runGenerator(false)}>
                  Generar y Validar P.A.C.
                </button>
                <button className="secondary-button" onClick={() => runGenerator(true)}>
                  Auto-Ajustar PAC Óptimo
                </button>
              </div>
            </div>

            {/* Panel 2: Bloques Generados */}
            <div className="glass-panel">
              <h3>Narrativa P.A.C. Generada</h3>
              {generated ? (
                <div>
                  <div style={{ marginBottom: '1rem', borderLeft: '4px solid #4F46E5', paddingLeft: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#4F46E5' }}>Prescribir (Científico / Racional)</h4>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>{generated.Prescribir.claim}</p>
                    <small style={{ color: '#64748B' }}>Sustento: {generated.Prescribir.evidence}</small>
                  </div>
                  <div style={{ marginBottom: '1rem', borderLeft: '4px solid #10B981', paddingLeft: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#10B981' }}>Acompañar (Empático / Emocional)</h4>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>{generated.Acompanar.claim}</p>
                    <small style={{ color: '#64748B' }}>Conexión: {generated.Acompanar.evidence}</small>
                  </div>
                  <div style={{ marginBottom: '1rem', borderLeft: '4px solid #F59E0B', paddingLeft: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#F59E0B' }}>Comunicar (Pragmático / Funcional)</h4>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>{generated.Comunicar.claim}</p>
                    <small style={{ color: '#64748B' }}>Practicidad: {generated.Comunicar.evidence}</small>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#94A3B8', fontStyle: 'italic' }}>Haz clic en "Generar y Validar P.A.C." para modelar los bloques discursivos.</p>
              )}
            </div>

            {/* Panel 3: Validación Multicriterio */}
            <div className="glass-panel">
              <h3>Validación & Scoring AHP</h3>
              {validation ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Score Ponderado</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B' }}>{validation.balance.finalScore.toFixed(1)}/100</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Veredicto</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: validation.balance.decision === 'APROBADO' ? '#16A34A' : '#DC2626' }}>
                        {validation.balance.decision}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0' }}>Compliance Semiológico</h5>
                    <div style={{ fontSize: '0.82rem', color: validation.compliance.isCompliant ? '#16A34A' : '#DC2626' }}>
                      {validation.compliance.isCompliant ? '✓ 100% libre de claims no verificables' : `⚠ Alerta: ${validation.compliance.issues.join(', ')}`}
                    </div>
                  </div>

                  {validation.recs && validation.recs.length > 0 && (
                    <div>
                      <h5 style={{ margin: '0 0 0.5rem 0' }}>Recomendaciones de Optimización</h5>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#475569' }}>
                        {validation.recs.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: '#94A3B8', fontStyle: 'italic' }}>Esperando ejecución para calcular matrices de balance...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
