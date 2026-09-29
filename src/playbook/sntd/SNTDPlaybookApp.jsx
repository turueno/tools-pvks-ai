// src/playbook/sntd/SNTDPlaybookApp.jsx
import React, { useState, useMemo } from 'react';
import {
  SNTD_PROJECT_META,
  SNTD_GATEWAYS_DEF,
  SNTD_PLAZAS,
  SNTD_BRANDS,
  SNTD_EVIDENCES,
  SNTD_INSIGHTS,
  SNTD_TENSIONS,
  SNTD_TOOLKIT_RULES
} from './data/sntdDataset.js';
import SalsaNegraDiagnostic from '../../components/SalsaNegraDiagnostic.jsx';
import { DOCUMENTO_RECTOR_TEXT } from '../../data/rectorData.js';
import EditableText from '../../components/shared/EditableText.jsx';
import MetaAdminPill from '../../components/admin/MetaAdminPill.jsx';
import MetaAdminAuthModal from '../../components/admin/MetaAdminAuthModal.jsx';
import MetaAdminCMSModal from '../../components/admin/MetaAdminCMSModal.jsx';
import { useAccessGuard } from '../../context/AccessGuardContext.jsx';
import EpistemicBadge from '../components/EpistemicBadge.jsx';
import { EPISTEMIC_LEVELS } from '../data/schema.js';
import { Icon } from '../components/shared/Icons.jsx';
import InfoTooltip from '../components/shared/InfoTooltip.jsx';
import SidePanelInspector from '../components/SidePanelInspector.jsx';
import SNTDOpportunityBuilder from './components/SNTDOpportunityBuilder.jsx';
import SNTDAIAssistantView from './components/SNTDAIAssistantView.jsx';
import ToolkitPreCheckTester from './components/ToolkitPreCheckTester.jsx';
import { SNTDDataProvider, useSNTDData } from './context/SNTDDataContext.jsx';
import SNTDAdminView from './components/SNTDAdminView.jsx';
import SNTDEditModal from './components/SNTDEditModal.jsx';
import { usePresence } from '../../logic/security/usePresence.js';

export default function SNTDPlaybookApp({ onBackToPortal }) {
  return (
    <SNTDDataProvider>
      <SNTDPlaybookInner onBackToPortal={onBackToPortal} />
    </SNTDDataProvider>
  );
}

function SNTDPlaybookInner({ onBackToPortal }) {
  const guard = useAccessGuard();
  usePresence(guard);
  const {
    data,
    evidences,
    insights,
    tensions,
    brands,
    gateways,
    plazas,
    isAdmin,
    toggleAdmin,
    openEditor
  } = useSNTDData();

  const [currentTab, setCurrentTab] = useState('overview');
  const [selectedPlaza, setSelectedPlaza] = useState('ALL');
  const [selectedGateway, setSelectedGateway] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedEpistemic, setSelectedEpistemic] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedEntity, setInspectedEntity] = useState(null);
  const [activeInsightPhases, setActiveInsightPhases] = useState({});

  const setCardPhase = (insightId, phase) => {
    setActiveInsightPhases(prev => ({ ...prev, [insightId]: phase }));
  };

  const tabs = [
    { id: 'overview', dictKey: 'sntd.tabs.overview', label: 'Overview', icon: 'overview' },
    { id: 'evidence', dictKey: 'sntd.tabs.evidence', label: 'Evidence Library', icon: 'evidence' },
    { id: 'insights', dictKey: 'sntd.tabs.insights', label: 'Insight Cards', icon: 'cards' },
    { id: 'tensions', dictKey: 'sntd.tabs.tensions', label: 'Tension Explorer', icon: 'tension' },
    { id: 'brands', dictKey: 'sntd.tabs.brands', label: 'Matriz Sabritas', icon: 'matrix' },
    { id: 'gateways', dictKey: 'sntd.tabs.gateways', label: 'Laboratorio 7 Gateways', icon: 'scenario', highlight: true },
    { id: 'opportunities', dictKey: 'sntd.tabs.opportunities', label: 'Opportunity Builder', icon: 'opportunity' },
    { id: 'ai', dictKey: 'sntd.tabs.ai', label: 'Asistente IA', icon: 'ai', special: true },
    ...(!guard.isRestricted ? [{ id: 'admin', dictKey: 'sntd.tabs.admin', label: 'Admin (CMS)', icon: 'settings', adminBadge: true }] : [])
  ];

  // Filtrado de insights
  const filteredInsights = useMemo(() => {
    return insights.filter(ins => {
      const matchGateway = selectedGateway === 'ALL' || ins.gatewayId === selectedGateway;
      const matchEpistemic = selectedEpistemic === 'ALL' || (ins.nivelEpistemologico || ins.epistemic) === selectedEpistemic;
      const matchBrand = selectedBrand === 'ALL' || (ins.marcasRelacionadas && ins.marcasRelacionadas.some(m => m.toLowerCase().includes(selectedBrand.toLowerCase())));
      const matchSearch = !searchQuery.trim() ||
        ins.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ins.descripcion && ins.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ins.tension && ins.tension.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ins.mecanismo && ins.mecanismo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ins.necesidad && ins.necesidad.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ins.oportunidades && ins.oportunidades.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ins.gatewaysAfectados && ins.gatewaysAfectados.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchGateway && matchEpistemic && matchBrand && matchSearch;
    });
  }, [selectedGateway, selectedEpistemic, selectedBrand, searchQuery]);

  // Filtrado de evidencias
  const filteredEvidences = useMemo(() => {
    return evidences.filter(ev => {
      const matchPlaza = selectedPlaza === 'ALL' || ev.plazaId === selectedPlaza;
      const matchGateway = selectedGateway === 'ALL' || ev.gatewayId === selectedGateway;
      const matchBrand = selectedBrand === 'ALL' || (ev.brandId && ev.brandId.toLowerCase().includes(selectedBrand.toLowerCase()));
      const matchEpistemic = selectedEpistemic === 'ALL' || ev.epistemic === selectedEpistemic;
      const matchSearch = !searchQuery.trim() || 
        ev.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.contenido.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.tags && ev.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchPlaza && matchGateway && matchBrand && matchEpistemic && matchSearch;
    });
  }, [evidences, selectedPlaza, selectedGateway, selectedBrand, selectedEpistemic, searchQuery]);

  // Filtrado de tensiones (responde a Gateway y Búsqueda)
  const filteredTensions = useMemo(() => {
    return tensions.filter(ten => {
      const matchGateway = selectedGateway === 'ALL' || ten.gatewayId === selectedGateway;
      const matchSearch = !searchQuery.trim() ||
        ten.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ten.tension.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ten.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ten.poloA && ten.poloA.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ten.poloB && ten.poloB.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ten.aprendizaje && ten.aprendizaje.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchGateway && matchSearch;
    });
  }, [tensions, selectedGateway, searchQuery]);

  // Filtrado de marcas Sabritas (responde a Marca y Búsqueda)
  const filteredBrands = useMemo(() => {
    return brands.filter(br => {
      const matchBrand = selectedBrand === 'ALL' || br.name.toLowerCase().includes(selectedBrand.toLowerCase());
      const matchSearch = !searchQuery.trim() ||
        br.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (br.pros && br.pros.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (br.contras && br.contras.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (br.veredicto && br.veredicto.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchBrand && matchSearch;
    });
  }, [brands, selectedBrand, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', color: '#191919', fontFamily: "'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif" }}>
      
      {/* NAVBAR SUPERIOR ESPEJO DEL PLAYBOOK */}
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
                title="Volver a la Suite Provokers AI"
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
                ← Suite PVKS
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src="/images/provokers-logo.png"
                alt="Provokers Logo"
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#191919', letterSpacing: '-0.02em' }}>
                    <EditableText dictKey="sntd.navbar.brand.title" defaultText="S.N.T.D." />{' '}
                    <span style={{ color: '#F6911E' }}>
                      <EditableText dictKey="sntd.navbar.brand.titleAccent" defaultText="PLAYBOOK" />
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
                    <span style={{ fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif', color: '#000000', fontWeight: 700 }}>
                      <EditableText dictKey="sntd.navbar.brand.challenging" defaultText="Challenging" />
                    </span>
                    <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#000000', fontWeight: 600 }}>
                      <EditableText dictKey="sntd.navbar.brand.knowledge" defaultText="Knowledge" />
                    </span>
                  </span>
                  <span style={{ fontSize: '0.68rem', backgroundColor: '#FFF7ED', color: '#C25E00', border: '1px solid #FFEDD5', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                    <EditableText dictKey="sntd.navbar.brand.tag" defaultText="SALSAS NEGRAS MÉXICO" />
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                  <EditableText dictKey="sntd.navbar.brand.subtitle" defaultText="ESTUDIO TERRITORIAL Y PLATAFORMA DE BOTANAS · SABRITAS / PEPSICO" />
                </span>
              </div>
            </div>
          </div>

          {/* Buscador y Filtros Globales (Espejo de Nutrición Infantil) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '820px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            {/* Buscador Global con Icono */}
            <div style={{ position: 'relative', flex: 1, minWidth: '170px', maxWidth: '240px' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                <Icon name="search" size={14} />
              </span>
              <input
                type="text"
                placeholder="Buscar citas, limón, comal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#F8F9FA',
                  border: '1px solid #CBD5E1',
                  borderRadius: '20px',
                  padding: '6px 28px 6px 30px',
                  fontSize: '0.82rem',
                  outline: 'none',
                  color: '#191919'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: 0
                  }}
                >
                  <Icon name="close" size={13} />
                </button>
              )}
            </div>

            {/* Filtro de Gateway */}
            <select
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              title="Filtrar por Gateway de Salsa Negra"
              style={{
                backgroundColor: selectedGateway !== 'ALL' ? '#FFF7ED' : '#FFFFFF',
                border: selectedGateway !== 'ALL' ? '1.5px solid #F6911E' : '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '6px 8px',
                color: selectedGateway !== 'ALL' ? '#C25E00' : '#191919',
                fontSize: '0.8rem',
                fontWeight: selectedGateway !== 'ALL' ? 700 : 500,
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '145px'
              }}
            >
              <option value="ALL">7 Gateways</option>
              {SNTD_GATEWAYS_DEF.map(gw => (
                <option key={gw.id} value={gw.id}>{gw.id}: {gw.name.split(' ')[0]}</option>
              ))}
            </select>

            {/* Filtro de Plaza */}
            <select
              value={selectedPlaza}
              onChange={(e) => setSelectedPlaza(e.target.value)}
              title="Filtrar por Plaza Etnográfica"
              style={{
                backgroundColor: selectedPlaza !== 'ALL' ? '#F0F9FF' : '#FFFFFF',
                border: selectedPlaza !== 'ALL' ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '6px 8px',
                color: selectedPlaza !== 'ALL' ? '#0369A1' : '#191919',
                fontSize: '0.8rem',
                fontWeight: selectedPlaza !== 'ALL' ? 700 : 500,
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '125px'
              }}
            >
              <option value="ALL">Todas Plazas</option>
              {SNTD_PLAZAS.map(p => (
                <option key={p.id} value={p.id}>{p.name.split(' ')[1]}</option>
              ))}
            </select>

            {/* Filtro de Marca */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              title="Filtrar por Marca Sabritas"
              style={{
                backgroundColor: selectedBrand !== 'ALL' ? '#FFF7ED' : '#FFFFFF',
                border: selectedBrand !== 'ALL' ? '1.5px solid #F6911E' : '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '6px 8px',
                color: selectedBrand !== 'ALL' ? '#C25E00' : '#191919',
                fontSize: '0.8rem',
                fontWeight: selectedBrand !== 'ALL' ? 700 : 500,
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '135px'
              }}
            >
              <option value="ALL">Todas Marcas</option>
              {SNTD_BRANDS.map(b => (
                <option key={b.name} value={b.name}>{b.name.split(' ')[0]} {b.name.split(' ')[1] || ''}</option>
              ))}
            </select>

            {/* Filtro de Nivel Epistémico */}
            <select
              value={selectedEpistemic}
              onChange={(e) => setSelectedEpistemic(e.target.value)}
              title="Filtrar por Nivel Epistemológico Provokers"
              style={{
                backgroundColor: selectedEpistemic !== 'ALL' ? (EPISTEMIC_LEVELS[selectedEpistemic]?.bg || '#F8FAFC') : '#FFFFFF',
                border: selectedEpistemic !== 'ALL' ? `1.5px solid ${EPISTEMIC_LEVELS[selectedEpistemic]?.color || '#F6911E'}` : '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '6px 8px',
                color: selectedEpistemic !== 'ALL' ? (EPISTEMIC_LEVELS[selectedEpistemic]?.color || '#191919') : '#191919',
                fontSize: '0.8rem',
                fontWeight: selectedEpistemic !== 'ALL' ? 700 : 500,
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '130px'
              }}
            >
              <option value="ALL">Todos Niveles</option>
              <option value="OBSERVADO">OBSERVADO</option>
              <option value="DERIVADO">DERIVADO</option>
              <option value="HIPOTESIS">HIPÓTESIS</option>
            </select>

            {/* Botón de limpiar filtros activos si hay alguno aplicado */}
            {(selectedGateway !== 'ALL' || selectedPlaza !== 'ALL' || selectedBrand !== 'ALL' || selectedEpistemic !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedGateway('ALL');
                  setSelectedPlaza('ALL');
                  setSelectedBrand('ALL');
                  setSelectedEpistemic('ALL');
                  setSearchQuery('');
                }}
                title="Limpiar todos los filtros"
                style={{
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#64748B',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ✕ Limpiar
              </button>
            )}

            {/* Admin Toggle (Contenidos SNTD) - Oculto en modo cliente restringido */}
            {!guard.isRestricted && (
              <button
                onClick={toggleAdmin}
                title={isAdmin ? 'Desactivar Modo Administrador SNTD' : 'Activar Modo Administrador (Habilitar edición de contenidos SNTD)'}
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

            {!guard.isRestricted && <MetaAdminPill compact={true} />}
          </div>
        </div>

        {/* Sub-Navbar con pestañas */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 1.5rem', overflowX: 'auto', gap: '4px', borderBottom: '1px solid #E2E8F0', scrollbarWidth: 'none' }}>
          {tabs.map(t => {
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setCurrentTab(t.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '0.7rem 0.95rem',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#F6911E' : t.special ? '#775AFF' : t.highlight ? '#00B487' : t.adminBadge ? (isAdmin ? '#C25E00' : '#64748B') : '#64748B',
                  backgroundColor: isActive ? 'rgba(246, 145, 30, 0.1)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #F6911E' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon
                  name={t.icon}
                  size={16}
                  color={isActive ? '#F6911E' : t.special ? '#775AFF' : t.highlight ? '#00B487' : '#A0A0A0'}
                />
                <EditableText dictKey={t.dictKey} defaultText={t.label} />
                {t.highlight && (
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
                {t.special && (
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
                    6 ACCIONES
                  </span>
                )}
                {t.adminBadge && (
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
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* PESTAÑA 1: OVERVIEW TERRITORIAL */}
        {currentTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Hero Card con Niveles Epistémicos Mandatorios */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2rem 2.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '4px 10px', borderRadius: '20px', border: '1px solid #FFEDD5', letterSpacing: '0.04em' }}>
                      <EditableText dictKey="sntd.overview.tag" defaultText="SISTEMA DE NAVEGACIÓN ESTRATÉGICA & PLATAFORMA DE BOTANAS" />
                    </span>
                    <span style={{ color: '#64748B', fontSize: '0.85rem' }}>· CDMX · GDL · MTY · NSE C/C+ y C-/D+ · Adultos 18 a 45 años</span>
                  </div>

                  <h1 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#191919', margin: '0 0 10px 0', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                    <EditableText dictKey="sntd.overview.title" defaultText="Territorio Salsas Negras México (S.N.T.D.)" />
                  </h1>

                  <p style={{ color: '#475569', fontSize: '1.02rem', maxWidth: '860px', lineHeight: 1.6, margin: 0 }}>
                    <EditableText dictKey="sntd.overview.desc" defaultText="Decodificación etnográfica, sensorial y semiótica del universo de las Salsas Negras. Transforma los hábitos y rituales botaneros tradicionales en una plataforma estructurada bajo los 7 Gateways obligatorios para el portafolio de botanas saladas de Sabritas." multiline={true} />
                  </p>
                </div>

                {/* Mandatorio Institucional: Epistemic Tooltips */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '6px 10px', borderRadius: '30px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', marginLeft: '4px' }}>
                      Niveles:
                    </span>
                    <InfoTooltip
                      title="Nivel Observado (Empírico)"
                      content="Hecho empírico registrado directamente: transcripciones de focus groups (CDMX, GDL, MTY), observaciones en tienditas, auditorías de retail y fotos de botellas y micheladas."
                      position="bottom"
                      badgeText="Observado"
                      color="#0284c7"
                      hoverColor="#0369a1"
                    />
                    <InfoTooltip
                      title="Nivel Derivado (Analítico)"
                      content="Interpretación causal, tensiones latentes, mecanismos culturales o inferencias analíticas (ej. Síndrome del limón falso, permanencia vs dolor)."
                      position="bottom"
                      badgeText="Derivado"
                      color="#d97706"
                      hoverColor="#b45309"
                    />
                    <InfoTooltip
                      title="Nivel Hipótesis (Estratégico)"
                      content="Proyecciones estratégicas, briefs de formulación de I+D, diseño de empaques o postulados pendientes de validación en planta piloto."
                      position="bottom"
                      badgeText="Hipótesis"
                      color="#10b981"
                      hoverColor="#047857"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setCurrentTab('gateways')}
                      style={{
                        backgroundColor: '#C25E00',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '9px 16px',
                        fontWeight: 800,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(194, 94, 0, 0.2)'
                      }}
                    >
                      <Icon name="scenario" size={16} color="#FFFFFF" />
                      <span>Laboratorio 7 Gateways</span>
                    </button>
                    <button
                      onClick={() => setCurrentTab('ai')}
                      style={{
                        backgroundColor: '#1E293B',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '9px 16px',
                        fontWeight: 800,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Icon name="ai" size={16} color="#FFAA34" />
                      <span>Asistente IA</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid Interactivo (Navega y Filtra al hacer Click) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid #F1F5F9' }}>
                <div
                  onClick={() => {
                    setSelectedEpistemic('OBSERVADO');
                    setCurrentTab('evidence');
                  }}
                  className="card-hover-fx"
                  style={{ backgroundColor: '#F0F9FF', padding: '1.2rem', borderRadius: '12px', border: '1px solid #BAE6FD', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.74rem', color: '#0369A1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Evidencias Observadas
                    </div>
                    <EpistemicBadge level="OBSERVADO" size="small" />
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0369A1', marginTop: '4px' }}>
                    {evidences.length}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#0284C7', marginTop: '2px' }}>
                    Transcripciones, Citas & Retail →
                  </div>
                </div>

                <div
                  onClick={() => {
                    setSelectedEpistemic('DERIVADO');
                    setCurrentTab('insights');
                  }}
                  className="card-hover-fx"
                  style={{ backgroundColor: '#FFFBEB', padding: '1.2rem', borderRadius: '12px', border: '1px solid #FDE68A', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.74rem', color: '#B45309', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Insights Derivados
                    </div>
                    <EpistemicBadge level="DERIVADO" size="small" />
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#B45309', marginTop: '4px' }}>
                    {insights.length}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#D97706', marginTop: '2px' }}>
                    Mecanismos Causales y Tensiones →
                  </div>
                </div>

                <div
                  onClick={() => {
                    setCurrentTab('tensions');
                  }}
                  className="card-hover-fx"
                  style={{ backgroundColor: '#FEF2F2', padding: '1.2rem', borderRadius: '12px', border: '1px solid #FECACA', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.74rem', color: '#991B1B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Tensiones Bipolares
                    </div>
                    <Icon name="tension" size={16} color="#DC2626" />
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#DC2626', marginTop: '4px' }}>
                    {tensions.length}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#B91C1C', marginTop: '2px' }}>
                    Fricciones Culturales del Toolkit →
                  </div>
                </div>

                <div
                  onClick={() => {
                    setCurrentTab('opportunities');
                  }}
                  className="card-hover-fx"
                  style={{ backgroundColor: '#ECFDF5', padding: '1.2rem', borderRadius: '12px', border: '1px solid #A7F3D0', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.74rem', color: '#065F46', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Oportunidades & I+D
                    </div>
                    <EpistemicBadge level="HIPOTESIS" size="small" />
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#047857', marginTop: '4px' }}>
                    {SNTD_GATEWAYS_DEF.length} Gateways
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: '2px' }}>
                    Opportunity Builder en Vivo →
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 1: LAS 3 PLAZAS CULTURALES DEL ESTUDIO */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#191919', margin: 0 }}>
                    Las 3 Plazas Culturales del Estudio (CDMX · GDL · MTY)
                  </h2>
                  <InfoTooltip
                    title="Cobertura Territorial y Muestreo"
                    content="Muestreo cualitativo estratificado en 6 Focus Groups en profundidad (Hombres y Mujeres 18-45 años, NSE C/C+ y C-/D+) cubriendo los 3 polos de cultura botanera en México."
                    position="right"
                  />
                </div>
                <button
                  onClick={() => setCurrentTab('brands')}
                  className="secondary-button"
                  style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                >
                  <Icon name="matrix" size={15} /> Ver Matriz de Marcas Sabritas →
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {SNTD_PLAZAS.map((plaza, idx) => {
                  const borderTopColors = ['#F6911E', '#6DD0F0', '#00B487'];
                  const topColor = borderTopColors[idx % 3];

                  return (
                    <div
                      key={plaza.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '14px',
                        padding: '1.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: topColor }} />
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase', backgroundColor: '#FFF7ED', padding: '2px 8px', borderRadius: '4px' }}>
                            Plaza 0{idx + 1} · {plaza.id.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Focus Groups Mixtos</span>
                        </div>

                        {/* Artefacto y Tensión Cultural de la Plaza */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0 12px 0' }}>
                          <span style={{ fontSize: '2.2rem' }}>{plaza.icono}</span>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#191919' }}>{plaza.name}</h3>
                            <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600 }}>{plaza.target}</span>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1rem' }}>
                          <strong>Hábitat y Enfoque:</strong> {plaza.descripcionHabitat}
                        </p>

                        <div
                          className="pvks-verbatim"
                          style={{
                            backgroundColor: '#FFF9F2',
                            borderLeft: '3px solid #F6911E',
                            padding: '0.85rem 1rem',
                            borderRadius: '0 8px 8px 0',
                            fontSize: '0.88rem',
                            color: '#191919',
                            marginBottom: '1rem',
                            fontStyle: 'italic'
                          }}
                        >
                          {plaza.citasClave[0]}
                        </div>

                        <div style={{ fontSize: '0.8rem', color: '#64748B', backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px' }}>
                          ⚡ <strong>Foco Regional:</strong> {plaza.focus}
                        </div>
                      </div>

                      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setSelectedPlaza(plaza.id);
                            setCurrentTab('evidence');
                          }}
                          className="secondary-button"
                          style={{ fontSize: '0.78rem', padding: '6px 12px', flex: 1 }}
                        >
                          Citas de {plaza.name.split(' ')[1]} →
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlaza(plaza.id);
                            setCurrentTab('insights');
                          }}
                          className="primary-button"
                          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        >
                          Insights
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 2: MURAL SEMIÓTICO & ARTEFACTOS DEL RITUAL */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '10px', border: '1px solid #FFEDD5' }}>
                      <EditableText dictKey="sntd.overview.mural.tag" defaultText="SEMIÓTICA DE CONSUMO · REPORTE PF & TOOLKIT" />
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Códigos visuales y materiales de la salsa negra</span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#191919', margin: 0 }}>
                    <EditableText dictKey="sntd.overview.mural.title" defaultText="Artefactos y Rituales del Preparado" />
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedGateway('G7');
                    setCurrentTab('evidence');
                  }}
                  className="secondary-button"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  <Icon name="evidence" size={15} /> Ver Evidencias Semióticas (Gateway 7) →
                </button>
              </div>

              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.55, margin: '0 0 1.5rem 0', maxWidth: '880px' }}>
                <EditableText dictKey="sntd.overview.mural.desc" defaultText="La salsa negra no es un condimento invisible: opera a través de artefactos fetiche que transmiten autoridad gastronómica, alquimia y madurez. En empaques e I+D, replicar estos códigos es decisivo para activar el valor percibido." multiline={true} />
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div
                  onClick={() => {
                    const ev = SNTD_EVIDENCES.find(e => e.id === 'ev-g7-1');
                    if (ev) setInspectedEntity(ev);
                  }}
                  className="card-hover-fx"
                  style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#C25E00' }}>[ARTEFACTO 01]</span>
                    <EpistemicBadge level="OBSERVADO" size="small" />
                  </div>
                  <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🟡🍾</div>
                  <div style={{ fontWeight: 800, color: '#191919', fontSize: '0.95rem', marginBottom: '4px' }}>
                    El Faro de la Tapa Amarilla
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.45 }}>
                    Botellas pardas de vidrio con tapa amarilla/dorada. Es el ancla visual de la salsa de cantina y marisquería: comunica maduración y sazón concentrado.
                  </div>
                </div>

                <div
                  onClick={() => {
                    const ev = SNTD_EVIDENCES.find(e => e.id === 'ev-g7-3');
                    if (ev) setInspectedEntity(ev);
                  }}
                  className="card-hover-fx"
                  style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#C25E00' }}>[ARTEFACTO 02]</span>
                    <EpistemicBadge level="OBSERVADO" size="small" />
                  </div>
                  <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🧪⚗️</div>
                  <div style={{ fontWeight: 800, color: '#191919', fontSize: '0.95rem', marginBottom: '4px' }}>
                    Frasco de Cuello Largo (Alquimia)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.45 }}>
                    El cuello estrecho comunica dosificación gota a gota, no cubetazo. Transforma al botaneador en un barman o alquimista de su propia porción.
                  </div>
                </div>

                <div
                  onClick={() => {
                    const ev = SNTD_EVIDENCES.find(e => e.id === 'ev-g3-1');
                    if (ev) setInspectedEntity(ev);
                  }}
                  className="card-hover-fx"
                  style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#C25E00' }}>[ARTEFACTO 03]</span>
                    <EpistemicBadge level="OBSERVADO" size="small" />
                  </div>
                  <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🍋💧</div>
                  <div style={{ fontWeight: 800, color: '#191919', fontSize: '0.95rem', marginBottom: '4px' }}>
                    El Limón con Semilla en Gotas
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.45 }}>
                    Gotas densas visibles en la botana. El consumidor exige corte cítrico fresco y rechaza la acidez industrial de caramelo o limpiador sintético.
                  </div>
                </div>

                <div
                  onClick={() => {
                    const ev = SNTD_EVIDENCES.find(e => e.id === 'ev-g4-1');
                    if (ev) setInspectedEntity(ev);
                  }}
                  className="card-hover-fx"
                  style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#C25E00' }}>[ARTEFACTO 04]</span>
                    <EpistemicBadge level="OBSERVADO" size="small" />
                  </div>
                  <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🥣🥔</div>
                  <div style={{ fontWeight: 800, color: '#191919', fontSize: '0.95rem', marginBottom: '4px' }}>
                    El Slurry Impregnado (Baño Líquido)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.45 }}>
                    Sensación de papa bañada que absorbe el preparado. Rechazo absoluto al polvo suelto que se cae y mancha los dedos de naranja.
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: MANIFIESTO CULTURAL Y COMPARATIVA ROJA VS NEGRA */}
            <div style={{ background: 'linear-gradient(135deg, #1E1B18 0%, #2A241F 100%)', color: '#FFFFFF', borderRadius: '16px', padding: '2rem 2.25rem', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFAA34', letterSpacing: '0.08em', marginBottom: '8px' }}>
                <EditableText dictKey="sntd.overview.axioma.tag" defaultText="AXIOMA CENTRAL DEL ESTUDIO" />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0' }}>
                <EditableText dictKey="sntd.overview.axioma.title" defaultText="Profundidad antes que dolor: La Salsa Negra sazona, no castiga" />
              </h2>
              <p style={{ color: '#D1D5DB', fontSize: '0.98rem', lineHeight: 1.65, maxWidth: '900px', margin: '0 0 1.5rem 0' }}>
                <EditableText dictKey="sntd.overview.axioma.desc" defaultText="A diferencia de la plataforma 'Flaming Hot' donde el fuego es una advertencia de resistencia física para jóvenes, en Salsas Negras el fuego es una invitación a la cocina tradicional: comales de barro, asado a la leña, tatemado y paciencia de sazón. Es un código adulto, gastronómico y adictivo por su balance en capas." multiline={true} />
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: '10px', flex: 1, minWidth: '240px', borderLeft: '3px solid #EF4444' }}>
                  <div style={{ color: '#EF4444', fontWeight: 800, fontSize: '0.88rem' }}>❌ PLATAFORMA ROJA (DOLOR)</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.82rem', marginTop: '6px', lineHeight: 1.45 }}>
                    Reto individual · Anestesia de lengua · Desafío corporal punitivo · Pungencia directa que satura y obliga a suspender el consumo.
                  </div>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: '10px', flex: 1, minWidth: '240px', borderLeft: '3px solid #FFAA34' }}>
                  <div style={{ color: '#FFAA34', fontWeight: 800, fontSize: '0.88rem' }}>✔️ PLATAFORMA NEGRA (PERMANENCIA)</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.82rem', marginTop: '6px', lineHeight: 1.45 }}>
                    Sazón que penetra · Acidez que abre boca · Umami de soya y jugo de carne · Retrogusto especiado que invita a terminarse la bolsa completa.
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: SÍNTESIS TRANSVERSAL DEL ESTUDIO (LOS 4 PILARES) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B487', backgroundColor: '#D1FAE5', padding: '3px 8px', borderRadius: '10px' }}>
                  <EditableText dictKey="sntd.overview.ejes.tag" defaultText="SÍNTESIS TRANSVERSAL · REPORTES EXPLORATORIOS PF & TOOLKIT" />
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: 0 }}>
                  <EditableText dictKey="sntd.overview.ejes.title" defaultText="Los 4 Ejes Rectores para el Desarrollo en Sabritas" />
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div style={{ backgroundColor: '#F8F9FA', padding: '1.25rem', borderRadius: '10px', borderLeft: '3.5px solid #F6911E' }}>
                  <div style={{ fontWeight: 800, color: '#191919', fontSize: '0.95rem', marginBottom: '6px' }}>
                    01. La Barrera del Limón Falso
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
                    El consumidor mexicano no negocia la frescura cítrica. Si el ácido remite a sal química anhidra o pastilla de tocador, la recompra se anula de inmediato.
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8F9FA', padding: '1.25rem', borderRadius: '10px', borderLeft: '3.5px solid #0284C7' }}>
                  <div style={{ fontWeight: 800, color: '#191919', fontSize: '0.95rem', marginBottom: '6px' }}>
                    02. Arquitectura de Sabor Dinámica
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
                    El sabor no debe ser un golpe monolítico de salmuera. Debe desplegarse en 4 tiempos: salitre de entrada, frescura ácida, corazón umami y eco picante tardío.
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8F9FA', padding: '1.25rem', borderRadius: '10px', borderLeft: '3.5px solid #10B981' }}>
                  <div style={{ fontWeight: 800, color: '#191919', fontSize: '0.95rem', marginBottom: '6px' }}>
                    03. Sustitución Completa del Ritual
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
                    El snack debe resolver el antojo sin obligar al usuario a buscar salsas o limones para corregirlo. Sabor cerrado, portátil y consistente.
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8F9FA', padding: '1.25rem', borderRadius: '10px', borderLeft: '3.5px solid #DC2626' }}>
                  <div style={{ fontWeight: 800, color: '#191919', fontSize: '0.95rem', marginBottom: '6px' }}>
                    04. Códigos Culinarios vs. Góticos
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
                    Erradicar conceptos de "Misterio", "Noche" o "Dark". La salsa negra se comunica con fuego de leña, comales, tapas doradas y cazuelas tradicionales.
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 5: INTERACTIVE HUB CALLOUTS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {/* Opportunity Builder Callout */}
              <div
                onClick={() => setCurrentTab('opportunities')}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #00B487',
                  borderRadius: '14px',
                  padding: '1.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0, 180, 135, 0.08)'
                }}
                className="card-hover-fx"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00B487', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase' }}>
                    <Icon name="opportunity" size={18} color="#00B487" /> Módulo de Innovación en Vivo
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#191919', margin: '0.5rem 0' }}>
                    Opportunity Builder & Diagnóstico Toolkit
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                    Configura arquetipos de producto (Cantina Edition, Slurry 360°, Ready to Eat), audita en vivo su apego a las reglas de oro del Toolkit y genera briefs listos para I+D.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00B487', fontWeight: 700, fontSize: '0.85rem', marginTop: '1rem' }}>
                  Abrir Opportunity Builder <Icon name="arrow-right" size={15} color="#00B487" />
                </div>
              </div>

              {/* AI Assistant Callout */}
              <div
                onClick={() => setCurrentTab('ai')}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #F6911E',
                  borderRadius: '14px',
                  padding: '1.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(246, 145, 30, 0.1)'
                }}
                className="card-hover-fx"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F6911E', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase' }}>
                    <Icon name="ai" size={18} color="#F6911E" /> Inteligencia Territorial Grounded
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#191919', margin: '0.5rem 0' }}>
                    Asistente IA Territorial (6 Motores Estratégicos)
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                    Cruza los insights y evidencias empíricas de las 3 plazas, audita empaques, evalúa el síndrome del limón falso y genera briefs técnicos grounded en el reporte rector.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F6911E', fontWeight: 700, fontSize: '0.85rem', marginTop: '1rem' }}>
                  Consultar Asistente IA <Icon name="arrow-right" size={15} color="#F6911E" />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* PESTAÑA 2: EVIDENCE LIBRARY */}
        {currentTab === 'evidence' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369A1', backgroundColor: '#E0F2FE', padding: '3px 8px', borderRadius: '12px' }}>
                    <EditableText dictKey="sntd.evidence.tag" defaultText="NIVEL OBSERVADO (EMPÍRICO)" />
                  </span>
                  <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
                    Etnografía, Citas de Focus Groups & Auditorías de Campo
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
                    <EditableText dictKey="sntd.evidence.title" defaultText="Evidence Library" />
                  </h1>
                  <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>
                    ({filteredEvidences.length} evidencias registradas)
                  </span>
                  <InfoTooltip
                    title="Evidencias Empíricas Observadas"
                    content="Registro directo no interpretado: transcripciones verbatim de audio en CDMX, GDL y MTY, auditorías de punto de venta, tienditas y semiótica visual de empaques."
                    position="right"
                    maxWidth={360}
                  />
                </div>
              </div>
            </div>

            {/* Listado de Evidencias */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
              {filteredEvidences.map(ev => {
                const plazaObj = SNTD_PLAZAS.find(p => p.id === ev.plazaId);
                const gwObj = SNTD_GATEWAYS_DEF.find(g => g.id === ev.gatewayId);
                return (
                  <div
                    key={ev.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      padding: '1.5rem',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '10px', border: '1px solid #FFEDD5' }}>
                            {ev.tipo}
                          </span>
                          {gwObj && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: gwObj.isCritical ? '#DC2626' : '#0369A1', backgroundColor: gwObj.isCritical ? '#FEF2F2' : '#F0F9FF', padding: '3px 7px', borderRadius: '8px' }}>
                              {gwObj.id} {gwObj.name.split(' ')[0]}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>
                          📍 {plazaObj?.name.split(' ')[1] || 'México'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#191919', margin: '0 0 8px 0', lineHeight: 1.35 }}>
                        {ev.titulo}
                      </h3>

                      <p style={{ fontSize: '0.86rem', color: '#334155', fontStyle: 'italic', lineHeight: 1.55, margin: '0 0 10px 0', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', borderLeft: '3px solid #C25E00' }}>
                        {ev.contenido}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '8px' }}>
                        <strong>Fuente:</strong> {ev.fuente} · {ev.autor}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {ev.tags.map(t => (
                            <span key={t} style={{ fontSize: '0.66rem', backgroundColor: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: '6px', fontWeight: 600 }}>
                              #{t}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            onClick={() => setInspectedEntity(ev)}
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: '#C25E00',
                              backgroundColor: '#FFF7ED',
                              border: '1px solid #FFEDD5',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            Inspeccionar →
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => openEditor('evidence', ev)}
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                color: '#0369A1',
                                backgroundColor: '#F0F9FF',
                                border: '1px solid #BAE6FD',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              ✏️ Editar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PESTAÑA 3: INSIGHT CARDS (ARQUITECTURA DE 4 FASES & 17 CAMPOS) */}
        {currentTab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header con Tooltip Metodológico */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '12px' }}>
                    <EditableText dictKey="sntd.insights.tag" defaultText="NIVEL DERIVADO & HIPÓTESIS" />
                  </span>
                  <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Estructura epistemológica profunda · 4 Fases Cognitivas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
                    <EditableText dictKey="sntd.insights.title" defaultText="Fichas de Insight" />
                  </h1>
                  <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>
                    ({filteredInsights.length} fichas · 17 campos)
                  </span>
                  <InfoTooltip
                    title="Metodología de 4 Fases Cognitivas"
                    content="Estructura epistemológica rigurosa en 4 fases secuenciales: 1. Evidencia empírica observada en grupos focales → 2. Interpretación causal, tensión latente y necesidades → 3. Implicaciones para Sabritas y riesgos de categoría → 4. Escenarios futuros y territorios de oportunidad."
                    position="right"
                    maxWidth={360}
                  />
                </div>
              </div>
            </div>

            {/* Listado de Fichas de Insight en 4 Fases */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {filteredInsights.map(ins => {
                const currentPhase = activeInsightPhases[ins.id] || 'INTERPRETACION';
                const relatedEvs = SNTD_EVIDENCES.filter(e => ins.evidenciaIds && ins.evidenciaIds.includes(e.id));

                const visualPhases = [
                  { id: 'EVIDENCIA', label: 'EVIDENCIA', desc: 'Lo observado en sesiones de grupo y tienditas' },
                  { id: 'INTERPRETACION', label: 'INTERPRETACIÓN', desc: 'Mecanismo causal, tensión latente y necesidad' },
                  { id: 'IMPLICACION', label: 'IMPLICACIÓN', desc: 'Impacto para Sabritas y riesgos de negocio' },
                  { id: 'ESCENARIO', label: 'ESCENARIO', desc: 'Territorios de innovación y oportunidad I+D' }
                ];

                const phaseColors = {
                  EVIDENCIA: '#0369A1',
                  INTERPRETACION: '#C25E00',
                  IMPLICACION: '#4338CA',
                  ESCENARIO: '#047857'
                };

                return (
                  <div
                    key={ins.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '1.75rem',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Barra Superior con Badges y Botón de Inspección de 17 Campos */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '10px', border: '1px solid #FFEDD5' }}>
                          [{ins.codigo}] {ins.badge}
                        </span>
                        <EpistemicBadge level={ins.nivelEpistemologico || ins.epistemic} />
                        {ins.fuenteReporte && (
                          <span style={{ fontSize: '0.74rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '4px', fontWeight: 500 }}>
                            📄 {ins.fuenteReporte}
                          </span>
                        )}
                        {ins.marcasRelacionadas && ins.marcasRelacionadas.map(m => (
                          <span
                            key={m}
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: '#191919',
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}
                          >
                            🏷️ {m}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => setInspectedEntity(ins)}
                          className="secondary-button"
                          style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Icon name="info" size={14} /> Inspeccionar 17 Campos
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => openEditor('insight', ins)}
                            style={{
                              backgroundColor: '#FFF7ED',
                              border: '1.5px solid #F6911E',
                              color: '#C25E00',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            ✏️ Editar Ficha
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Título y Descripción Central */}
                    <div>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#191919', margin: '0 0 6px 0', lineHeight: 1.25 }}>
                        {ins.titulo}
                      </h2>
                      <p style={{ fontSize: '0.96rem', color: '#475569', lineHeight: 1.55, margin: 0 }}>
                        {ins.descripcion}
                      </p>
                    </div>

                    {/* BARRA DE TRANSICIÓN COGNITIVA EN 4 FASES (ESPEJO DE NUTRICIÓN INFANTIL) */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        backgroundColor: '#F1F5F9',
                        borderRadius: '10px',
                        padding: '4px',
                        gap: '4px',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      {visualPhases.map(vp => {
                        const isActive = currentPhase === vp.id;
                        return (
                          <button
                            key={vp.id}
                            onClick={() => setCardPhase(ins.id, vp.id)}
                            style={{
                              padding: '8px 6px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                              color: isActive ? phaseColors[vp.id] : '#64748B',
                              fontWeight: isActive ? 800 : 600,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              textAlign: 'center',
                              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {vp.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* CONTENIDO DINÁMICO SEGÚN LA FASE ACTIVA */}
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        border: '1px solid #E2E8F0',
                        minHeight: '130px'
                      }}
                    >
                      {/* FASE 1: EVIDENCIA EMPÍRICA */}
                      {currentPhase === 'EVIDENCIA' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Capa 1: Evidencias de Campo Observadas ({relatedEvs.length})
                              </span>
                              <InfoTooltip
                                title="Evidencias Etnográficas y Focus Groups"
                                content="Transcripciones textuales de audio de las sesiones en CDMX, GDL y Monterrey, observaciones de tiendita y fotos de empaque que sustentan este insight."
                                position="top"
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: relatedEvs.length > 1 ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr', gap: '14px' }}>
                            {relatedEvs.map(ev => {
                              const plazaObj = SNTD_PLAZAS.find(p => p.id === ev.plazaId);
                              return (
                                <div
                                  key={ev.id}
                                  style={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '10px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                  }}
                                >
                                  <div
                                    onClick={() => setInspectedEntity(ev)}
                                    className="pvks-verbatim"
                                    style={{
                                      backgroundColor: '#FFF9F2',
                                      borderLeft: '3.5px solid #F6911E',
                                      padding: '0.85rem 1rem',
                                      borderRadius: '0 6px 6px 0',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                      <span style={{ fontSize: '0.74rem', color: '#F6911E', fontWeight: 800 }}>
                                        {ev.titulo}
                                      </span>
                                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                        📍 {plazaObj?.name.split(' ')[1] || 'Campo'}
                                      </span>
                                    </div>
                                    <div style={{ color: '#191919', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.45 }}>
                                      {ev.contenido}
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                                    <span><strong>Fuente:</strong> {ev.fuente}</span>
                                    <span>👤 {ev.autor}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* FASE 2: INTERPRETACIÓN CAUSAL (MECANISMO, TENSIÓN, NECESIDAD, CONDICIÓN) */}
                      {currentPhase === 'INTERPRETACION' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase' }}>
                                ⚙️ Mecanismo Causal
                              </span>
                              <InfoTooltip
                                title="Mecanismo Causal"
                                content="Lógica organoléptica, sensorial o psicológica subyacente que gobierna la percepción del consumidor."
                                position="top"
                                size={12}
                              />
                            </div>
                            <p style={{ color: '#191919', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                              {ins.mecanismo}
                            </p>
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                                ⚡ Tensión Latente
                              </span>
                              <InfoTooltip
                                title="Tensión Latente"
                                content="Dilema o fricción cultural entre las expectativas culinarias y las limitaciones del snack industrial."
                                position="top"
                                size={12}
                              />
                            </div>
                            <p style={{ color: '#7F1D1D', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                              {ins.tension}
                            </p>
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                                🎯 Necesidad Profunda
                              </span>
                              <InfoTooltip
                                title="Necesidad Profunda"
                                content="Motivación humana, botanera o de estatus que el consumidor busca resolver con la botana."
                                position="top"
                                size={12}
                              />
                            </div>
                            <p style={{ color: '#191919', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                              {ins.necesidad}
                            </p>
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                                ✅ Condición de Aceptación
                              </span>
                              <InfoTooltip
                                title="Condición de Aceptación"
                                content="Criterio sensorial y técnico innegociable para que la botana sea aprobada por el paladar mexicano."
                                position="top"
                                size={12}
                              />
                            </div>
                            <p style={{ color: '#065F46', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                              {ins.condicionAceptacion}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* FASE 3: IMPLICACIÓN ESTRATÉGICA & RIESGOS */}
                      {currentPhase === 'IMPLICACION' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Capa 3: Implicaciones para Sabritas / PepsiCo
                            </span>
                            <InfoTooltip
                              title="Implicaciones de Negocio"
                              content="Directrices obligatorias de formulación, branding y portafolio para no traicionar la promesa del territorio."
                              position="top"
                            />
                          </div>
                          <p style={{ color: '#191919', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                            {ins.implicaciones}
                          </p>
                          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '0.85rem', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                              <span>⚠️ Riesgo si no se actúa</span>
                              <InfoTooltip
                                title="Riesgo de Fracaso"
                                content="Consecuencia comercial o rechazo del consumidor si la marca desobedece este principio."
                                position="top"
                                size={12}
                              />
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#991B1B', marginTop: '3px' }}>
                              {ins.riesgo}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* FASE 4: ESCENARIOS Y OPORTUNIDADES I+D */}
                      {currentPhase === 'ESCENARIO' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Capa 4: Escenarios de Innovación y Oportunidades I+D
                            </span>
                            <InfoTooltip
                              title="Oportunidades de Crecimiento"
                              content="Conceptos y territorios de innovación accionables directamente desde el laboratorio o el Opportunity Builder."
                              position="top"
                            />
                          </div>
                          <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.9rem', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                              ✨ Oportunidad Plausible para el Portafolio
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#065F46', marginTop: '4px', lineHeight: 1.5 }}>
                              {ins.oportunidades}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <button
                              onClick={() => setCurrentTab('opportunities')}
                              className="primary-button"
                              style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Icon name="opportunity" size={14} /> Construir Prototipo en Opportunity Builder →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Barra Inferior con Actores, Contexto y Disparadores */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem', color: '#64748B', paddingTop: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span>Actores:</span>
                        {ins.actores && ins.actores.map(a => (
                          <span key={a} style={{ color: '#4338CA', backgroundColor: '#EEF2FF', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                            {a}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                        <span>📍 {ins.contexto}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PESTAÑA 4: TENSION EXPLORER */}
        {currentTab === 'tensions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '3px 8px', borderRadius: '12px' }}>
                    <EditableText dictKey="sntd.tensions.tag" defaultText="DIAGNÓSTICO DIALÉCTICO · 7 GATEWAYS" />
                  </span>
                  <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
                    Fuerzas Polares, Fricciones y Choques de Consumo
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
                    <EditableText dictKey="sntd.tensions.title" defaultText="Tension Explorer" />
                  </h1>
                  <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>
                    ({filteredTensions.length} de {tensions.length} tensiones)
                  </span>
                  <InfoTooltip
                    title="Dilemas Dialécticos en Conflicto"
                    content="Las tensiones revelan los choques entre los deseos botaneros auténticos y las limitaciones del snack industrial empaquetado. Muestra los dos polos en conflicto (Polo A vs Polo B) y las directrices obligatorias de formulación."
                    position="right"
                    maxWidth={360}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredTensions.map(ten => {
                const gwObj = SNTD_GATEWAYS_DEF.find(g => g.id === ten.gatewayId);
                return (
                  <div
                    key={ten.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '1.75rem',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      {gwObj && (
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: gwObj.isCritical ? '#DC2626' : '#C25E00', backgroundColor: gwObj.isCritical ? '#FEF2F2' : '#FFF7ED', padding: '3px 10px', borderRadius: '10px', border: `1px solid ${gwObj.isCritical ? '#FECACA' : '#FFEDD5'}` }}>
                          🎯 VINCULADO A {gwObj.id}: {gwObj.name} {gwObj.isCritical ? '⚠️ (CRÍTICO)' : ''}
                        </span>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => openEditor('tension', ten)}
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: '#DC2626',
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FECACA',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          ✏️ Editar Tensión
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                      <div style={{ flex: 1, minWidth: '220px', backgroundColor: '#FEF2F2', padding: '12px 16px', borderRadius: '10px', border: '1px solid #FECACA' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#DC2626' }}>POLO A</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#991B1B' }}>{ten.poloA}</div>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#64748B' }}>⚡ VS ⚡</div>
                      <div style={{ flex: 1, minWidth: '220px', backgroundColor: '#FFFBEB', padding: '12px 16px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D97706' }}>POLO B</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#B45309' }}>{ten.poloB}</div>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#191919', margin: '0 0 6px 0' }}>
                      {ten.tension}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55, margin: '0 0 1rem 0' }}>
                      {ten.descripcion}
                    </p>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '10px', borderLeft: '4px solid #C25E00', fontSize: '0.82rem', color: '#1E293B' }}>
                      <strong>Aprendizaje para el Desarrollo:</strong> {ten.aprendizaje}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PESTAÑA 5: MATRIZ DE MARCAS SABRITAS */}
        {currentTab === 'brands' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
                    <EditableText dictKey="sntd.brands.tag" defaultText="AUDITORÍA DE PORTAFOLIO · SABRITAS / PEPSICO" />
                  </span>
                  <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
                    Benchmarking Competitivo, Apego al Territorio & Fortalezas Organolépticas
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
                    <EditableText dictKey="sntd.brands.title" defaultText="Matriz Sabritas" />
                  </h1>
                  <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>
                    ({filteredBrands.length} de {brands.length} marcas)
                  </span>
                  <InfoTooltip
                    title="Auditoría de Portafolio Sabritas"
                    content="Evaluación comparativa rigurosa de las propuestas actuales y competidores frente a los 7 Gateways. Muestra el % de apego al territorio auténtico de salsas negras y recomendaciones de formulación."
                    position="right"
                    maxWidth={360}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
              {filteredBrands.map(br => {
                let badgeColor = '#047857';
                let badgeBg = '#ECFDF5';
                if (br.status === 'MODERADO') { badgeColor = '#D97706'; badgeBg = '#FFFBEB'; }
                if (br.status === 'ALERTA') { badgeColor = '#C25E00'; badgeBg = '#FFF7ED'; }
                if (br.status === 'DESVIADO' || br.status === 'CRITICO') { badgeColor = '#DC2626'; badgeBg = '#FEF2F2'; }

                return (
                  <div
                    key={br.id || br.name}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: badgeColor, backgroundColor: badgeBg, padding: '3px 8px', borderRadius: '10px' }}>
                          {br.rol || 'MARCA SABRITAS'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: badgeColor }}>
                            {br.cumplimiento || 85}% APEGO
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => openEditor('brand', br)}
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: '#7C3AED',
                                backgroundColor: '#F5F3FF',
                                border: '1px solid #DDD6FE',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              ✏️ Editar
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#191919', margin: '0 0 8px 0' }}>
                        {br.name}
                      </h3>

                      <div style={{ fontSize: '0.84rem', color: '#166534', backgroundColor: '#F0FDF4', padding: '8px 12px', borderRadius: '8px', marginBottom: '6px' }}>
                        <strong>Fortaleza:</strong> {br.pros}
                      </div>

                      <div style={{ fontSize: '0.84rem', color: '#991B1B', backgroundColor: '#FEF2F2', padding: '8px 12px', borderRadius: '8px', marginBottom: '10px' }}>
                        <strong>Fricción:</strong> {br.contras}
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '10px', borderTop: '1px solid #E2E8F0', fontSize: '0.78rem', color: '#475569' }}>
                      <strong>Dictamen:</strong> {br.veredicto}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PESTAÑA 6: LABORATORIO 7 GATEWAYS (LA HERRAMIENTA ORIGINAL COMPLETA) */}
        {currentTab === 'gateways' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#C25E00', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px' }}>
                    MOTOR ANALÍTICO ACTIVO
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9A3412' }}>
                    Protocolo BPMN-X7 · Validador de Prototipos con Agente Territorial IA
                  </span>
                </div>
                <div style={{ fontSize: '0.86rem', color: '#7C2D12' }}>
                  Configura las ponderaciones de los 7 Gateways (Identidad, Capas, Acidez, Vehículo, Intensidad, Ritual, Visual) y somete fichas sensoriales de prototipos a dictamen.
                </div>
              </div>
            </div>

            {/* Pre-Check Interactivo de Viabilidad del Toolkit */}
            <ToolkitPreCheckTester
              onSendToOpportunityBuilder={(oppData) => {
                // Al derivar oportunidad desde el pre-check, cambiar de pestaña a opportunities
                setCurrentTab('opportunities');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Inserción del componente nativo SalsaNegraDiagnostic preservando 100% sus funciones */}
            <SalsaNegraDiagnostic documentoRector={DOCUMENTO_RECTOR_TEXT} />
          </div>
        )}

        {/* PESTAÑA: OPPORTUNITY BUILDER (CON AUDITORÍA DE TOOLKIT EN VIVO) */}
        {currentTab === 'opportunities' && (
          <SNTDOpportunityBuilder />
        )}

        {/* PESTAÑA: ASISTENTE IA TERRITORIAL */}
        {currentTab === 'ai' && (
          <SNTDAIAssistantView />
        )}

        {/* PESTAÑA: ADMINISTRADOR DE CONTENIDOS (CMS) */}
        {currentTab === 'admin' && (
          <SNTDAdminView />
        )}

      </main>

      {/* DRAWER LATERAL DE INSPECCIÓN DE ENTIDADES (EVIDENCIAS / INSIGHTS / ARTEFACTOS) */}
      {inspectedEntity && (
        <SidePanelInspector
          item={inspectedEntity}
          onClose={() => setInspectedEntity(null)}
          onNavigateToView={(view) => {
            setCurrentTab(view);
            setInspectedEntity(null);
          }}
          onSimulateEntity={() => {
            setCurrentTab('gateways');
            setInspectedEntity(null);
          }}
          onAnalyzeWithAI={() => {
            setCurrentTab('ai');
            setInspectedEntity(null);
          }}
        />
      )}

      {/* Modal Universal de Edición SNTD */}
      <SNTDEditModal />

      {/* Modales Globales de Meta-Admin (Autenticación y CMS de Copys) */}
      <MetaAdminAuthModal />
      <MetaAdminCMSModal />
    </div>
  );
}
