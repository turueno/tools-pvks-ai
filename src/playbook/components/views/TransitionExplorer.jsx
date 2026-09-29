// src/playbook/components/views/TransitionExplorer.jsx
import React, { useState } from 'react';
import { Icon } from '../shared/Icons.jsx';
import FieldPhoto from '../shared/FieldPhoto.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';

export default function TransitionExplorer() {
  const { transitions: TRANSITIONS = [], activeProject, isAdmin, openEditor } = usePlaybookData();
  const [selectedTransitionId, setSelectedTransitionId] = useState(TRANSITIONS[0]?.id || 'trans-01');

  const activeTrans = TRANSITIONS.find(t => t.id === selectedTransitionId) || TRANSITIONS[0] || null;

  const isLullaby = activeProject?.id === 'lullaby-cdmx-2026';
  const pTitle = activeProject?.titulo || 'Playbook';

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Compacto con Tooltip */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', backgroundColor: '#D1FAE5', padding: '3px 8px', borderRadius: '12px' }}>
            <EditableText dictKey="playbook.transitions.tag" defaultText={activeProject?.badge || "PUNTOS DE INFLEXIÓN & TRANSICIONES"} />
          </span>
          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
            <EditableText dictKey="playbook.transitions.desc" defaultText="Dinámicas de cambio de hábito, contexto y mutación de demanda" />
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
            <EditableText
              dictKey={`playbook.transitions.title.${activeProject?.id || 'default'}`}
              defaultText={isLullaby ? "Transition Explorer (Mutaciones de la Demanda)" : `Transition Explorer: ${pTitle}`}
            />
          </h1>
          <InfoTooltip
            title="Umbrales y Mutaciones de Demanda"
            content={isLullaby
              ? "Las necesidades de alimentación infantil no son estáticas. Cuando un hogar cruza un umbral de edad (p. ej. 1 año), regresa al empleo formal o sale a la calle por largas jornadas, las soluciones previas caducan o se resignifican."
              : "Mapea los puntos de inflexión donde las condiciones de vida, los hábitos o las fricciones empujan al usuario a abandonar una solución tradicional y adoptar una nueva propuesta de valor."
            }
            position="right"
            maxWidth={360}
          />
        </div>
      </div>

      {/* Si no hay transiciones configuradas */}
      {TRANSITIONS.length === 0 || !activeTrans ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔄</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
            No hay transiciones registradas aún para este Playbook
          </h3>
          <p style={{ color: '#64748B', maxWidth: '520px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Las transiciones capturan los momentos donde una solución previa caduca y el usuario muta hacia una nueva alternativa o canal.
          </p>
          {isAdmin && (
            <button
              onClick={() => openEditor('transition', {})}
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
              + Agregar Primera Transición
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Selector de Transiciones */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
            {TRANSITIONS.map(t => {
              const isSelected = (activeTrans?.id === t.id);
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTransitionId(t.id)}
                  style={{
                    backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                    border: isSelected ? '2px solid #00B487' : '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                  className="card-hover-fx"
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? '#047857' : '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                    🔄 {t.fuente || 'Punto de Inflexión'}
                  </div>
                  <div style={{ fontWeight: 800, color: '#191919', fontSize: '1.05rem', marginBottom: '4px' }}>
                    {t.titulo || 'Transición de Hábito'}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#475569' }}>
                    {t.subtitulo || t.descripcion?.slice(0, 75) || 'Cambio en el contexto de consumo'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Transition Detailed Breakdown */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#191919', margin: '0 0 6px 0' }}>
                  {activeTrans.titulo || 'Transición Etnográfica'}
                </h2>
                {isAdmin && (
                  <button
                    onClick={() => openEditor('transition', activeTrans)}
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
                    title="Editar esta transición"
                  >
                    ✏️ Editar Transición
                  </button>
                )}
              </div>
              <p style={{ color: '#64748B', fontSize: '0.94rem', margin: 0 }}>
                {activeTrans.descripcion || 'Estructura dialéctica del cambio de demanda.'}
              </p>
            </div>

            {/* Triple Column: ANTES -> DETONANTE -> DESPUÉS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
              {/* ANTES */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#64748B' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                    Estado Inicial (Antes)
                  </span>
                </div>

                {activeTrans.fotoAntes && (
                  <div style={{ marginBottom: '1rem' }}>
                    <FieldPhoto
                      photo={activeTrans.fotoAntes}
                      size="small"
                      aspectRatio="16/9"
                      showCaption={true}
                    />
                  </div>
                )}

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#191919', margin: '0 0 1rem 0' }}>
                  {activeTrans.antes?.estado || 'Situación Previa'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
                  <div>
                    <strong style={{ color: '#191919' }}>{isLullaby ? 'Dieta:' : 'Hábito / Solución:'}</strong>{' '}
                    <span style={{ color: '#475569' }}>
                      {activeTrans.antes?.comida || activeTrans.antes?.habito || activeTrans.antes?.descripcion || 'Solución o comportamiento habitual previo.'}
                    </span>
                  </div>
                  {(activeTrans.antes?.utensilios || activeTrans.antes?.herramientas || activeTrans.antes?.canales) && (
                    <div>
                      <strong style={{ color: '#191919' }}>{isLullaby ? 'Utensilios:' : 'Canales / Herramientas:'}</strong>{' '}
                      <span style={{ color: '#475569' }}>
                        {activeTrans.antes.utensilios || activeTrans.antes.herramientas || activeTrans.antes.canales}
                      </span>
                    </div>
                  )}
                  {activeTrans.antes?.reglas && (
                    <div>
                      <strong style={{ color: '#191919' }}>Reglas / Dinámicas:</strong>{' '}
                      <span style={{ color: '#475569' }}>{activeTrans.antes.reglas}</span>
                    </div>
                  )}
                  {activeTrans.antes?.tiempo && (
                    <div>
                      <strong style={{ color: '#191919' }}>Inversión de Tiempo:</strong>{' '}
                      <span style={{ color: '#475569' }}>{activeTrans.antes.tiempo}</span>
                    </div>
                  )}
                  {activeTrans.antes?.recursos && (
                    <div>
                      <strong style={{ color: '#191919' }}>Recursos Requeridos:</strong>{' '}
                      <span style={{ color: '#475569' }}>{activeTrans.antes.recursos}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* DETONANTE */}
              <div
                style={{
                  backgroundColor: '#FFF7ED',
                  borderRadius: '12px',
                  border: '2px dashed #F6911E',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(246,145,30,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <Icon name="transition" size={24} color="#F6911E" />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Detonante de Cambio
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#191919', lineHeight: 1.4 }}>
                  {activeTrans.detonante || 'Fricción o evento vital que impulsa el cambio.'}
                </div>
              </div>

              {/* DESPUÉS */}
              <div
                style={{
                  backgroundColor: '#F0F9FF',
                  borderRadius: '12px',
                  border: '1.5px solid #BAE6FD',
                  padding: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' }}>
                    Estado Resultante (Después)
                  </span>
                </div>

                {activeTrans.fotoDespues && (
                  <div style={{ marginBottom: '1rem' }}>
                    <FieldPhoto
                      photo={activeTrans.fotoDespues}
                      size="small"
                      aspectRatio="16/9"
                      showCaption={true}
                    />
                  </div>
                )}

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0C4A6E', margin: '0 0 1rem 0' }}>
                  {activeTrans.despues?.estado || 'Nueva Solución Adoptada'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
                  <div>
                    <strong style={{ color: '#0C4A6E' }}>{isLullaby ? 'Nueva Dieta:' : 'Nuevo Hábito / Solución:'}</strong>{' '}
                    <span style={{ color: '#191919' }}>
                      {activeTrans.despues?.comida || activeTrans.despues?.habito || activeTrans.despues?.descripcion || 'Nueva solución integrada al día a día.'}
                    </span>
                  </div>
                  {(activeTrans.despues?.utensilios || activeTrans.despues?.herramientas || activeTrans.despues?.canales) && (
                    <div>
                      <strong style={{ color: '#0C4A6E' }}>{isLullaby ? 'Utensilios:' : 'Canales / Herramientas:'}</strong>{' '}
                      <span style={{ color: '#191919' }}>
                        {activeTrans.despues.utensilios || activeTrans.despues.herramientas || activeTrans.despues.canales}
                      </span>
                    </div>
                  )}
                  {activeTrans.despues?.reglas && (
                    <div>
                      <strong style={{ color: '#0C4A6E' }}>Nuevas Dinámicas:</strong>{' '}
                      <span style={{ color: '#191919' }}>{activeTrans.despues.reglas}</span>
                    </div>
                  )}
                  {activeTrans.despues?.tiempo && (
                    <div>
                      <strong style={{ color: '#0C4A6E' }}>Tiempo:</strong>{' '}
                      <span style={{ color: '#191919' }}>{activeTrans.despues.tiempo}</span>
                    </div>
                  )}
                  {activeTrans.despues?.recursos && (
                    <div>
                      <strong style={{ color: '#0C4A6E' }}>Recursos:</strong>{' '}
                      <span style={{ color: '#191919' }}>{activeTrans.despues.recursos}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Impacto en Marcas / Soluciones */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', marginBottom: '6px' }}>
                  🔻 Soluciones que pierden relevancia
                </div>
                <p style={{ color: '#7F1D1D', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                  {activeTrans.impactoMarcas?.pierden || 'Alternativas que dejan de responder al nuevo contexto o generan demasiada fricción.'}
                </p>
              </div>

              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: '6px' }}>
                  🔺 Soluciones que ganan tracción
                </div>
                <p style={{ color: '#064E3B', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                  {activeTrans.impactoMarcas?.ganan || 'Marcas y canales que capitalizan la nueva necesidad y ofrecen alivio inmediato.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
