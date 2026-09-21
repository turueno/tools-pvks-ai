// src/playbook/components/views/DecisionExplorer.jsx
import React, { useState } from 'react';
import FieldPhoto from '../shared/FieldPhoto.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';

export default function DecisionExplorer({ onInspectEntity }) {
  const { decisionChains: DECISION_CHAINS, evidences: EVIDENCES, isAdmin, openEditor } = usePlaybookData();
  const [selectedChainId, setSelectedChainId] = useState(DECISION_CHAINS[0]?.id || 'chain-nido');

  const activeChain = DECISION_CHAINS.find(c => c.id === selectedChainId) || DECISION_CHAINS[0] || {};

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Compacto con Tooltip */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '12px' }}>
            <EditableText dictKey="playbook.decisions.tag" defaultText="CADENAS DE CERTEZA" />
          </span>
          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
            <EditableText dictKey="playbook.decisions.desc" defaultText="Mapeo de pasos y actores decisores" />
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
            <EditableText dictKey="playbook.decisions.title" defaultText="Decision Explorer (El Viaje de Validación)" />
          </h1>
          <InfoTooltip
            title="Secuencia del Viaje de Decisión"
            content="Ninguna fuente resuelve la decisión por sí sola. En la categoría infantil, la compra atraviesa una secuencia rigurosa: 1. Descubrimiento → 2. Validación Médica (pediatra) → 3. Evaluación de Atributos → 4. Prueba Doméstica → 5. Observación de la respuesta física del Bebé."
            position="right"
            maxWidth={360}
          />
        </div>
      </div>

      {/* Tabs Selector de Cadenas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginBottom: '2.5rem' }}>
        {DECISION_CHAINS.map(c => {
          const isSelected = selectedChainId === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedChainId(c.id)}
              style={{
                backgroundColor: isSelected ? '#FFF7ED' : '#FFFFFF',
                border: isSelected ? '2px solid #F6911E' : '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1.25rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
              className="card-hover-fx"
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? '#C25E00' : '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                🏷️ Marca: {c.marca} · {c.fuente}
              </div>
              <div style={{ fontWeight: 800, color: '#191919', fontSize: '1rem' }}>
                {c.titulo}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chain Container */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
          padding: '2rem'
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#191919', margin: '0 0 6px 0' }}>
              {activeChain.titulo}
            </h2>
            {isAdmin && (
              <button
                onClick={() => openEditor('decision', activeChain)}
                style={{
                  backgroundColor: '#FFF7ED',
                  border: '1.5px solid #F6911E',
                  color: '#C25E00',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Editar esta cadena de decisión"
              >
                ✏️ Editar Cadena
              </button>
            )}
          </div>
          <p style={{ color: '#64748B', fontSize: '0.92rem', margin: 0 }}>
            {activeChain.descripcion} ({activeChain.fuente})
          </p>
        </div>

        {/* Step-by-Step Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
          {activeChain.etapas.map((etapa, idx) => {
            const ev = EVIDENCES.find(e => e.id === etapa.evidenciaId);
            const stepColors = ['#0284c7', '#775AFF', '#F6911E', '#F23F3B', '#00B487'];
            const stepColor = stepColors[idx % stepColors.length];

            return (
              <div
                key={etapa.paso}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr',
                  gap: '1.5rem',
                  position: 'relative'
                }}
              >
                {/* Step Marker */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: `2.5px solid ${stepColor}`,
                      color: stepColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      zIndex: 2
                    }}
                  >
                    0{etapa.paso}
                  </div>
                  {idx < activeChain.etapas.length - 1 && (
                    <div
                      style={{
                        width: '2px',
                        flex: 1,
                        backgroundColor: '#E2E8F0',
                        margin: '6px 0'
                      }}
                    />
                  )}
                </div>

                {/* Step Card Content */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: idx < activeChain.etapas.length - 1 ? '0.5rem' : 0
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: stepColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Etapa {etapa.paso}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '2px 0 0 0' }}>
                        {etapa.nombre}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#EEF2FF', padding: '3px 10px', borderRadius: '20px', border: '1px solid #E0E7FF' }}>
                      <span style={{ fontSize: '0.75rem', color: '#4338CA', fontWeight: 700 }}>
                        👤 {etapa.actorPrincipal}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                    {etapa.accion}
                  </p>

                  {ev && ev.imagenUrl && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <FieldPhoto
                        photo={{
                          url: ev.imagenUrl,
                          alt: ev.imagenAlt || ev.titulo,
                          caption: ev.pieEtnografico,
                          page: ev.fuente,
                          artifact: ev.artefactoClave,
                          home: ev.hogar
                        }}
                        size="medium"
                        aspectRatio="16/9"
                        showCaption={true}
                      />
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '0.85rem', borderRadius: '8px', borderLeft: `3.5px solid ${stepColor}`, border: '1px solid #E2E8F0', borderLeftWidth: '3.5px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Rol del Actor</div>
                      <div style={{ fontSize: '0.86rem', color: '#191919', marginTop: '2px', fontWeight: 600 }}>
                        {etapa.rolActor}
                      </div>
                    </div>

                    {etapa.cita && (
                      <div
                        className="pvks-verbatim"
                        style={{
                          backgroundColor: '#FFF9F2',
                          borderLeft: '3px solid #F6911E',
                          padding: '0.85rem',
                          borderRadius: '8px',
                          color: '#191919',
                          fontSize: '0.88rem'
                        }}
                      >
                        “{etapa.cita}”
                      </div>
                    )}
                  </div>

                  {ev && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => onInspectEntity(ev)}
                        className="secondary-button"
                        style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                      >
                        Ver Evidencia [{ev.codigo}] 📄
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
