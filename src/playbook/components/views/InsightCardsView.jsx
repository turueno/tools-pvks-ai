import React, { useState, useMemo } from 'react';
import EpistemicBadge from '../EpistemicBadge.jsx';
import { Icon } from '../shared/Icons.jsx';
import FieldPhoto from '../shared/FieldPhoto.jsx';
import EditableText from '../shared/EditableText.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';
import { VISUAL_PHASES } from '../../data/schema.js';

export default function InsightCardsView({ onInspectEntity, onNavigateToView, onSimulateEntity, searchQuery, selectedBrand, selectedEpistemic, activeInsightId }) {
  const { insights: INSIGHTS, evidences: EVIDENCES, isAdmin, openEditor, saveEntity } = usePlaybookData();
  const [activePhases, setActivePhases] = useState({});

  const setCardPhase = (insightId, phase) => {
    setActivePhases(prev => ({ ...prev, [insightId]: phase }));
  };

  const filteredInsights = useMemo(() => {
    return INSIGHTS.filter(ins => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          ins.titulo.toLowerCase().includes(q) ||
          ins.descripcion.toLowerCase().includes(q) ||
          ins.tension.toLowerCase().includes(q) ||
          ins.mecanismo.toLowerCase().includes(q) ||
          ins.necesidad.toLowerCase().includes(q) ||
          ins.oportunidades.toLowerCase().includes(q) ||
          ins.marcasRelacionadas.some(m => m.toLowerCase().includes(q));
        if (!matchesQ) return false;
      }

      if (selectedBrand && selectedBrand !== 'ALL') {
        if (!ins.marcasRelacionadas.some(m => m.toLowerCase().includes(selectedBrand.toLowerCase()))) return false;
      }

      if (selectedEpistemic && selectedEpistemic !== 'ALL') {
        if (ins.nivelEpistemologico !== selectedEpistemic) return false;
      }

      return true;
    });
  }, [INSIGHTS, searchQuery, selectedBrand, selectedEpistemic]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Compacto con Tooltip Metodológico */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '12px' }}>
              <EditableText dictKey="playbook.insights.tag" defaultText="NIVEL DERIVADO & HIPÓTESIS" />
            </span>
            <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Estructura epistemológica profunda</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
              <EditableText dictKey="playbook.insights.title" defaultText="Fichas de Insight" />
            </h1>
            <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>
              ({filteredInsights.length} fichas · 17 campos)
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
          const relatedEvs = EVIDENCES.filter(e => ins.evidenciaIds.includes(e.id));
          const isHighlighted = activeInsightId === ins.id;

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
                  <EpistemicBadge level={ins.nivelEpistemologico} />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '4px', fontWeight: 500 }}>
                    📄 {ins.fuenteReporte}
                  </span>
                  {ins.marcasRelacionadas.map(m => (
                    <span
                      key={m}
                      style={{
                        fontSize: '0.75rem',
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
                    onClick={() => onInspectEntity(ins)}
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
                      title="Editar esta ficha de insight"
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

              {/* BARRA DE TRANSICIÓN VISUAL */}
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
                {VISUAL_PHASES.map(vp => {
                  const isActive = currentPhase === vp.id;
                  const phaseColors = {
                    EVIDENCIA: '#0369A1',
                    INTERPRETACION: '#C25E00',
                    IMPLICACION: '#4338CA',
                    ESCENARIO: '#047857'
                  };
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

              {/* CONTENIDO DINÁMICO */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid #E2E8F0',
                  minHeight: '130px'
                }}
              >
                {currentPhase === 'EVIDENCIA' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Capa 1: Evidencias de Campo Observadas ({relatedEvs.length})
                        </span>
                        <InfoTooltip
                          title="Evidencias Etnográficas"
                          content="Fotografías de hábitat, artefactos y verbatims textuales recopilados durante la inmersión directa en el hogar."
                          position="top"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: relatedEvs.length > 1 ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr', gap: '14px' }}>
                      {relatedEvs.map(ev => {
                        const photoObj = ev.imagenUrl ? {
                          url: ev.imagenUrl,
                          alt: ev.imagenAlt || ev.titulo,
                          caption: ev.pieEtnografico || ev.observacionDirecta,
                          page: ev.fuente,
                          artifact: ev.artefactoClave,
                          home: ev.hogar
                        } : null;

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
                            {photoObj && (
                              <FieldPhoto
                                photo={photoObj}
                                size="medium"
                                aspectRatio="16/9"
                                showCaption={true}
                                onPhotoDrop={isAdmin ? (newUrl) => saveEntity('evidences', { ...ev, imagenUrl: newUrl }) : null}
                              />
                            )}
                            <div
                              onClick={() => onInspectEntity(ev)}
                              className="pvks-verbatim"
                              style={{
                                backgroundColor: '#FFF9F2',
                                borderLeft: '3.5px solid #F6911E',
                                padding: '0.85rem 1rem',
                                borderRadius: '0 6px 6px 0',
                                cursor: 'pointer'
                              }}
                            >
                              <div style={{ fontSize: '0.75rem', color: '#F6911E', fontWeight: 800, marginBottom: '2px', fontStyle: 'normal' }}>
                                [{ev.codigo}] {ev.titulo} ({ev.fuente})
                              </div>
                              <div style={{ color: '#191919', fontSize: '0.92rem' }}>
                                “{ev.cita}”
                              </div>
                            </div>
                            {ev.observacionDirecta && (
                              <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                                <strong style={{ color: '#0369A1' }}>Observación etnográfica:</strong> {ev.observacionDirecta}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {currentPhase === 'INTERPRETACION' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase' }}>
                          ⚙️ Mecanismo Causal
                        </span>
                        <InfoTooltip
                          title="Mecanismo Causal"
                          content="Lógica psicológica o funcional subyacente que dispara o sostiene la conducta observada en el hogar."
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
                          content="Conflicto o dilema no resuelto entre las aspiraciones de la madre y sus limitaciones de tiempo o presupuesto."
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
                          content="Motivación humana y emocional primaria que el producto o la categoría debe satisfacer."
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
                          content="Criterio innegociable que la solución debe cumplir para que la madre la adopte sin culpa ni resistencia."
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

                {currentPhase === 'IMPLICACION' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Capa 3: Implicaciones de Marca y Negocio
                      </span>
                      <InfoTooltip
                        title="Implicaciones Estratégicas"
                        content="Impacto de este hallazgo en el posicionamiento, la formulación y la estrategia comercial del portafolio."
                        position="top"
                      />
                    </div>
                    <p style={{ color: '#191919', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                      {ins.implicaciones}
                    </p>
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
                        {ins.oportunidades}
                      </div>
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
                  {ins.actores.map(a => (
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
  );
}
