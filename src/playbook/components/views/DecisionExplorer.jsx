// src/playbook/components/views/DecisionExplorer.jsx
import React, { useState } from 'react';
import FieldPhoto from '../shared/FieldPhoto.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';

export default function DecisionExplorer({ onInspectEntity }) {
  const { decisionChains: DECISION_CHAINS = [], evidences: EVIDENCES = [], activeProject, isAdmin, openEditor } = usePlaybookData();
  const [selectedChainId, setSelectedChainId] = useState(DECISION_CHAINS[0]?.id || 'chain-nido');

  const activeChain = DECISION_CHAINS.find(c => c.id === selectedChainId) || DECISION_CHAINS[0] || null;
  const isLullaby = activeProject?.id === 'lullaby-cdmx-2026';
  const pTitle = activeProject?.titulo || 'Playbook';

  const etapas = (activeChain?.etapas || activeChain?.pasos || []).map((step, idx) => {
    if (typeof step === 'object') {
      return {
        paso: step.paso || idx + 1,
        nombre: step.nombre || (typeof step.paso === 'string' ? step.paso : `Etapa ${idx + 1}`),
        actorPrincipal: step.actorPrincipal || step.canal || 'Usuario / Consumidor',
        accion: step.accion || step.descripcion || '',
        rolActor: step.rolActor || step.canal || 'Decisor',
        cita: step.cita || '',
        evidenciaId: step.evidenciaId
      };
    }
    return {
      paso: idx + 1,
      nombre: String(step),
      actorPrincipal: 'Consumidor',
      accion: String(step),
      rolActor: 'Decisión'
    };
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Compacto con Tooltip */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '12px' }}>
            <EditableText dictKey="playbook.decisions.tag" defaultText={activeProject?.badge || "CADENAS DE DECISIÓN"} />
          </span>
          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
            <EditableText dictKey="playbook.decisions.desc" defaultText="Mapeo de pasos, puntos de contacto y actores decisores" />
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
            <EditableText
              dictKey={`playbook.decisions.title.${activeProject?.id || 'default'}`}
              defaultText={isLullaby ? "Decision Explorer (El Viaje de Validación)" : `Decision Explorer: ${pTitle}`}
            />
          </h1>
          <InfoTooltip
            title="Secuencia del Viaje de Decisión"
            content="Ninguna fuente resuelve la decisión por sí sola. Mapea la secuencia de pasos, puntos de contacto y validaciones del usuario desde la necesidad inicial hasta el consumo."
            position="right"
            maxWidth={360}
          />
        </div>
      </div>

      {/* Si no hay cadenas configuradas */}
      {DECISION_CHAINS.length === 0 || !activeChain ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗺️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
            No hay cadenas de decisión configuradas para este Playbook
          </h3>
          <p style={{ color: '#64748B', maxWidth: '520px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Las cadenas de decisión mapean la secuencia de pasos, fricciones y validaciones del usuario desde la detonación de la necesidad hasta la experiencia post-uso.
          </p>
          {isAdmin && (
            <button
              onClick={() => openEditor('decision', {})}
              style={{
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              + Agregar Primera Cadena
            </button>
          )}
        </div>
      ) : (
        <>
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
                🏷️ {c.marca ? `Marca: ${c.marca} · ` : ''}{c.fuente || 'Estudio'}
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
              {activeChain.titulo || 'Cadena de Decisión'}
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
            {activeChain.descripcion || 'Secuencia estructurada de interacción y decisión.'} {activeChain.fuente ? `(${activeChain.fuente})` : ''}
          </p>
        </div>

        {/* Step-by-Step Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
          {etapas.map((etapa, idx) => {
            const ev = EVIDENCES.find(e => e.id === etapa.evidenciaId);
            const stepColors = ['#0284c7', '#775AFF', '#F6911E', '#F23F3B', '#00B487'];
            const stepColor = stepColors[idx % stepColors.length];

            return (
              <div
                key={etapa.paso || idx}
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
                    0{idx + 1}
                  </div>
                  {idx < etapas.length - 1 && (
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
                    marginBottom: idx < etapas.length - 1 ? '0.5rem' : 0
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
      </>
      )}
    </div>
  );
}
