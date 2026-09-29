// src/playbook/components/views/InsightCardsView.jsx
import React, { useState, useMemo } from 'react';
import EpistemicBadge from '../EpistemicBadge.jsx';
import { Icon } from '../shared/Icons.jsx';
import FieldPhoto from '../shared/FieldPhoto.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';
import { VISUAL_PHASES } from '../../data/schema.js';

export default function InsightCardsView({
  onInspectEntity,
  onNavigateToView,
  onSimulateEntity,
  searchQuery,
  selectedBrand,
  selectedEpistemic,
  activeInsightId
}) {
  const {
    activeProjectId,
    insights: INSIGHTS = [],
    evidences: EVIDENCES = [],
    isAdmin,
    openEditor,
    saveEntity
  } = usePlaybookData();
  const [activePhases, setActivePhases] = useState({});

  const setCardPhase = (insightId, phase) => {
    setActivePhases(prev => ({ ...prev, [insightId]: phase }));
  };

  const filteredInsights = useMemo(() => {
    return INSIGHTS.filter(ins => {
      if (!ins) return false;
      const marcas = Array.isArray(ins.marcasRelacionadas)
        ? ins.marcasRelacionadas
        : (ins.marcaRelacionada ? [ins.marcaRelacionada] : (Array.isArray(ins.marcas) ? ins.marcas : []));

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          (ins.titulo || '').toLowerCase().includes(q) ||
          (ins.descripcion || '').toLowerCase().includes(q) ||
          (ins.tension || '').toLowerCase().includes(q) ||
          (ins.mecanismo || '').toLowerCase().includes(q) ||
          (ins.necesidad || '').toLowerCase().includes(q) ||
          (ins.oportunidades || '').toLowerCase().includes(q) ||
          marcas.some(m => (m || '').toLowerCase().includes(q));
        if (!matchesQ) return false;
      }

      if (selectedBrand && selectedBrand !== 'ALL') {
        if (!marcas.some(m => (m || '').toLowerCase().includes(selectedBrand.toLowerCase()))) return false;
      }

      if (selectedEpistemic && selectedEpistemic !== 'ALL') {
        const level = ins.nivelEpistemologico || ins.nivel || ins.epistemicLevel || 'DERIVADO';
        if (level !== selectedEpistemic) return false;
      }

      return true;
    });
  }, [INSIGHTS, searchQuery, selectedBrand, selectedEpistemic]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Compacto */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F6911E', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '12px' }}>
            <EditableText dictKey={`playbook.insights.tag.${activeProjectId || 'default'}`} defaultText="NIVEL 2 · DERIVADO (ANALÍTICO)" />
          </span>
          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
            <EditableText dictKey={`playbook.insights.subtag.${activeProjectId || 'default'}`} defaultText="Mecanismos Causales & Tensiones Latentes" />
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
              <EditableText dictKey={`playbook.insights.title.${activeProjectId || 'default'}`} defaultText="Fichas de Insight" />
            </h1>
            <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>
              ({filteredInsights.length} fichas · 4 Fases Cognitivas)
            </span>
            <InfoTooltip
              title="Metodología de 4 Fases"
              content="Estructura cognitiva rigurosa en 4 fases secuenciales: 1. Evidencia empírica observada en campo → 2. Interpretación causal y tensiones → 3. Implicaciones de categoría y riesgos → 4. Escenarios y oportunidades."
              position="right"
              maxWidth={360}
            />
          </div>
        </div>
      </div>

      {/* Grid de Fichas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {filteredInsights.map(ins => {
          const currentPhase = activePhases[ins.id] || 'INTERPRETACION';
          const eviIds = ins.evidenciaIds || ins.evidenciasRelacionadas || [];
          const relatedEvs = EVIDENCES.filter(e => eviIds.includes(e.id));
          const isHighlighted = activeInsightId === ins.id;
          const marcas = Array.isArray(ins.marcasRelacionadas)
            ? ins.marcasRelacionadas
            : (ins.marcaRelacionada ? [ins.marcaRelacionada] : (Array.isArray(ins.marcas) ? ins.marcas : []));
          const actores = Array.isArray(ins.actores) ? ins.actores : (ins.actor ? [ins.actor] : []);

          return (
            <div
              key={ins.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: isHighlighted ? '2px solid #F6911E' : '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: isHighlighted ? '0 0 25px rgba(246, 145, 30, 0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <EpistemicBadge level={ins.nivelEpistemologico || ins.nivel || 'DERIVADO'} />
                  {(ins.fuenteReporte || ins.fuente) && (
                    <span style={{ fontSize: '0.75rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '4px', fontWeight: 500 }}>
                      📄 {ins.fuenteReporte || ins.fuente}
                    </span>
                  )}
                  {marcas.map(m => (
                    <span
                      key={m}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#C25E00',
                        backgroundColor: '#FFF7ED',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid #FFEDD5'
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isAdmin && (
                    <button
                      onClick={() => openEditor('insight', ins)}
                      className="secondary-button"
                      style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                    >
                      ✏️ Editar
                    </button>
                  )}
                  <button
                    onClick={() => onInspectEntity && onInspectEntity(ins)}
                    className="secondary-button"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    🔍 Inspeccionar
                  </button>
                </div>
              </div>

              {/* Title & Core Description */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase', marginBottom: '4px' }}>
                  [{ins.codigo || ins.id.toUpperCase()}]
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#191919', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                  {ins.titulo}
                </h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  {ins.descripcion}
                </p>
              </div>

              {/* 4-Phase Cognitive Navigation Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', gap: '4px', marginTop: '0.25rem', overflowX: 'auto' }}>
                {Object.values(VISUAL_PHASES).map(phase => {
                  const isActive = currentPhase === phase.id;
                  return (
                    <button
                      key={phase.id}
                      onClick={() => setCardPhase(ins.id, phase.id)}
                      style={{
                        padding: '8px 14px',
                        border: 'none',
                        borderBottom: isActive ? `2.5px solid ${phase.color}` : '2.5px solid transparent',
                        backgroundColor: 'transparent',
                        color: isActive ? phase.color : '#64748B',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon name={phase.icon} size={15} color={isActive ? phase.color : '#94A3B8'} />
                      {phase.label}
                    </button>
                  );
                })}
              </div>

              {/* Phase Content Area */}
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', border: '1px solid #F1F5F9' }}>
                {currentPhase === 'FENOMENO' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Capa 1: Fenómeno & Evidencia Observada
                      </span>
                      <InfoTooltip
                        title="Evidencia de Campo"
                        content="Hechos empíricos, citas y registros de campo que sustentan y demuestran la existencia del fenómeno."
                        position="top"
                      />
                    </div>

                    {relatedEvs.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                        {relatedEvs.map(ev => (
                          <div
                            key={ev.id}
                            onClick={() => onInspectEntity && onInspectEntity(ev)}
                            style={{
                              backgroundColor: '#FFFFFF',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid #E2E8F0',
                              cursor: 'pointer'
                            }}
                            className="card-hover-fx"
                          >
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284C7' }}>[{ev.codigo || ev.id}]</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#191919', marginTop: '2px' }}>{ev.titulo}</div>
                            {ev.cita && (
                              <div style={{ fontSize: '0.78rem', color: '#475569', fontStyle: 'italic', marginTop: '4px', lineHeight: 1.35 }}>
                                “{ev.cita.length > 110 ? ev.cita.slice(0, 110) + '...' : ev.cita}”
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>
                        Evidencias vinculadas en el reporte: {eviIds.join(', ')}
                      </p>
                    )}

                    {Array.isArray(ins.disparadores) && ins.disparadores.length > 0 && (
                      <div style={{ marginTop: '4px', fontSize: '0.82rem', color: '#475569' }}>
                        <strong>Disparadores observados:</strong> {ins.disparadores.join(' · ')}
                      </div>
                    )}
                  </div>
                )}

                {currentPhase === 'INTERPRETACION' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase' }}>
                          🧠 Mecanismo Causal Subyacente
                        </span>
                        <InfoTooltip
                          title="Mecanismo Causal"
                          content="El porqué profundo: explica por qué ocurre la conducta a nivel psicológico, cultural o funcional."
                          position="top"
                          size={12}
                        />
                      </div>
                      <p style={{ color: '#191919', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                        {ins.mecanismo || 'No definido'}
                      </p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                          ⚡ Tensión Latente
                        </span>
                        <InfoTooltip
                          title="Tensión Latente"
                          content="Conflicto o dilema no resuelto entre las aspiraciones del usuario y sus limitaciones físicas, cognitivas o económicas."
                          position="top"
                          size={12}
                        />
                      </div>
                      <p style={{ color: '#7F1D1D', fontSize: '0.88rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                        {ins.tension || 'No definida'}
                      </p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                          🎯 Necesidad Profunda
                        </span>
                        <InfoTooltip
                          title="Necesidad Profunda"
                          content="Motivación humana y emocional primaria que el producto o canal debe satisfacer."
                          position="top"
                          size={12}
                        />
                      </div>
                      <p style={{ color: '#191919', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                        {ins.necesidad || 'No definida'}
                      </p>
                    </div>

                    {ins.condicionAceptacion && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                            ✅ Condición de Aceptación
                          </span>
                          <InfoTooltip
                            title="Condición de Aceptación"
                            content="Criterio innegociable que la solución debe cumplir para que el usuario la adopte sin resistencia."
                            position="top"
                            size={12}
                          />
                        </div>
                        <p style={{ color: '#065F46', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                          {ins.condicionAceptacion}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {currentPhase === 'IMPLICACION' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Capa 3: Implicaciones de Marca y Negocio
                      </span>
                      <InfoTooltip
                        title="Implicaciones Estratégicas"
                        content="Impacto de este hallazgo en el posicionamiento, la formulación, los canales y la estrategia comercial del portafolio."
                        position="top"
                      />
                    </div>
                    <p style={{ color: '#191919', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                      {ins.implicaciones || 'No definidas'}
                    </p>
                    {ins.riesgo && (
                      <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '0.85rem', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                          <span>⚠️ Riesgo si no se actúa</span>
                          <InfoTooltip
                            title="Riesgo para el Negocio"
                            content="Consecuencia directa en penetración o lealtad en caso de que la marca ignore esta tensión."
                            position="top"
                            size={12}
                          />
                        </div>
                        <div style={{ fontSize: '0.88rem', color: '#991B1B', marginTop: '3px' }}>
                          {ins.riesgo}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentPhase === 'ESCENARIO' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Capa 4: Escenarios y Oportunidades
                      </span>
                      <InfoTooltip
                        title="Escenarios Derivados"
                        content="Territorios de innovación y conceptos de solución accionables derivados rigurosamente del insight."
                        position="top"
                      />
                    </div>
                    <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.9rem', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                        ✨ Oportunidad Plausible
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#065F46', marginTop: '4px', lineHeight: 1.5 }}>
                        {ins.oportunidades || 'No definida'}
                      </div>
                      {ins.hipotesis && (
                        <div style={{ fontSize: '0.84rem', color: '#047857', marginTop: '8px', borderTop: '1px dashed #A7F3D0', paddingTop: '6px' }}>
                          <strong>Hipótesis de Solución:</strong> {ins.hipotesis}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button
                        onClick={() => {
                          if (onSimulateEntity) {
                            onSimulateEntity(ins);
                          } else if (onNavigateToView) {
                            onNavigateToView('scenario');
                          }
                        }}
                        className="primary-button"
                        style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Icon name="scenario" size={14} /> Simular este Insight en Scenario Lab →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Tags */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem', color: '#64748B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span>Actores:</span>
                  {actores.map(a => (
                    <span key={a} style={{ color: '#4338CA', backgroundColor: '#EEF2FF', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {a}
                    </span>
                  ))}
                </div>
                {ins.contexto && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                    <span>📍 {ins.contexto}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
