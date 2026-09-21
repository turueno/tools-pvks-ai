// src/playbook/components/views/EvidenceLibrary.jsx
import React, { useState, useMemo } from 'react';
import EpistemicBadge from '../EpistemicBadge.jsx';
import FieldPhoto from '../shared/FieldPhoto.jsx';
import EditableText from '../shared/EditableText.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';
import { HOMES } from '../../data/schema.js';

export default function EvidenceLibrary({ onInspectEntity, onSelectInsight, searchQuery, selectedBrand, selectedEpistemic }) {
  const { evidences: EVIDENCES, insights: INSIGHTS, isAdmin, saveEntity, openEditor } = usePlaybookData();
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedHome, setSelectedHome] = useState('ALL');

  const evidenceTypes = useMemo(() => {
    return ['ALL', ...new Set(EVIDENCES.map(e => e.tipo))];
  }, [EVIDENCES]);

  const filteredEvidences = useMemo(() => {
    return EVIDENCES.filter(ev => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          ev.titulo.toLowerCase().includes(q) ||
          ev.codigo.toLowerCase().includes(q) ||
          ev.cita.toLowerCase().includes(q) ||
          ev.descripcion.toLowerCase().includes(q) ||
          ev.marca.toLowerCase().includes(q) ||
          ev.contexto.toLowerCase().includes(q);
        if (!matchesQ) return false;
      }

      if (selectedBrand && selectedBrand !== 'ALL') {
        if (!ev.marca.toLowerCase().includes(selectedBrand.toLowerCase())) return false;
      }

      if (selectedEpistemic && selectedEpistemic !== 'ALL') {
        if (ev.nivel !== selectedEpistemic) return false;
      }

      if (selectedType !== 'ALL' && ev.tipo !== selectedType) {
        return false;
      }

      if (selectedHome !== 'ALL' && ev.hogar !== selectedHome) {
        return false;
      }

      return true;
    });
  }, [EVIDENCES, searchQuery, selectedBrand, selectedEpistemic, selectedType, selectedHome]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header & Controls Compacto */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369A1', backgroundColor: '#E0F2FE', padding: '3px 8px', borderRadius: '12px' }}>
                <EditableText dictKey="playbook.evidence.tag" defaultText="NIVEL OBSERVADO (EMPÍRICO)" />
              </span>
              <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Trazabilidad directa a páginas del reporte</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
                <EditableText dictKey="playbook.evidence.title" defaultText="Biblioteca de Evidencias Etnográficas" />
              </h1>
              <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>
                ({filteredEvidences.length} registros)
              </span>
              <InfoTooltip
                title="Capa Empírica Inmutable"
                content="La evidencia constituye la base empírica del modelo. Registra observaciones en vivo, fotografías de despensas, citas literales y rutinas documentadas durante las inmersiones etnográficas en CDMX."
                position="right"
                maxWidth={340}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Filter by Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '7px 12px',
                color: '#191919',
                fontSize: '0.84rem'
              }}
            >
              <option value="ALL">Todos los tipos de registro</option>
              {evidenceTypes.filter(t => t !== 'ALL').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Filter by Home */}
            <select
              value={selectedHome}
              onChange={(e) => setSelectedHome(e.target.value)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '7px 12px',
                color: '#191919',
                fontSize: '0.84rem'
              }}
            >
              <option value="ALL">Todos los hogares estudiados</option>
              {HOMES.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Evidencias */}
      {filteredEvidences.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
          <p style={{ color: '#64748B', fontSize: '1.1rem' }}>No se encontraron evidencias con los filtros seleccionados.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredEvidences.map(ev => {
            const relatedInsights = INSIGHTS.filter(i => i.evidenciaIds.includes(ev.id));

            return (
              <div
                key={ev.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
                className="card-hover-fx"
              >
                <div>
                  {/* Top Bar de la Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <EpistemicBadge level={ev.nivel} size="small" />
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F6911E' }}>
                        {ev.codigo}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                      {ev.fuente}
                    </span>
                  </div>

                  {/* Título y Tipo */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#191919', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {ev.titulo}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#775AFF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                    📁 {ev.tipo} · {ev.marca}
                  </div>

                  {/* Foto de Campo Etnográfica si existe */}
                  {ev.imagenUrl && (
                    <div style={{ marginBottom: '1rem' }}>
                      <FieldPhoto
                        photo={{
                          url: ev.imagenUrl,
                          alt: ev.imagenAlt || ev.titulo,
                          caption: ev.pieEtnografico,
                          page: ev.fuente,
                          artifact: ev.artefactoClave,
                          verbatim: ev.cita,
                          home: HOMES.find(h => h.id === ev.hogar)?.name
                        }}
                        aspectRatio="16/9"
                        size="small"
                        showCaption={true}
                        onPhotoDrop={isAdmin ? (newUrl) => saveEntity('evidences', { ...ev, imagenUrl: newUrl }) : null}
                      />
                    </div>
                  )}

                  {/* Cita Textual */}
                  <div
                    className="pvks-verbatim"
                    style={{
                      backgroundColor: '#FFF9F2',
                      borderLeft: '3px solid #F6911E',
                      padding: '0.85rem 1rem',
                      borderRadius: '0 8px 8px 0',
                      color: '#191919',
                      fontSize: '0.94rem',
                      lineHeight: 1.5,
                      marginBottom: '1rem'
                    }}
                  >
                    “{ev.cita}”
                  </div>

                  {/* Descripción Etnográfica */}
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                    {ev.descripcion}
                  </p>

                  {/* Metadata de Contexto y Actores */}
                  <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#475569', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '4px', fontWeight: 500 }}>
                      📍 {ev.contexto}
                    </span>
                    {ev.actores.map(a => (
                      <span key={a} style={{ fontSize: '0.74rem', color: '#4338CA', backgroundColor: '#EEF2FF', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        👤 {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer con Insights Vinculados */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                  {relatedInsights.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                        Sustenta los Insights:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {relatedInsights.map(ri => (
                          <div
                            key={ri.id}
                            onClick={() => onSelectInsight && onSelectInsight(ri.id)}
                            style={{
                              fontSize: '0.82rem',
                              color: '#F6911E',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>↳</span> {ri.titulo}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    <button
                      onClick={() => onInspectEntity(ev)}
                      className="secondary-button"
                      style={{ flex: 1, fontSize: '0.78rem', padding: '7px 10px' }}
                    >
                      Inspeccionar Registro Completo
                    </button>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditor('evidence', ev);
                        }}
                        style={{
                          backgroundColor: '#FFF7ED',
                          border: '1.5px solid #F6911E',
                          color: '#C25E00',
                          padding: '7px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        title="Editar esta evidencia en el CMS"
                      >
                        ✏️ Editar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
