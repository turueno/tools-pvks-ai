// src/playbook/components/views/TensionExplorer.jsx
import React, { useState } from 'react';
import FieldPhoto from '../shared/FieldPhoto.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';

export default function TensionExplorer({ onInspectEntity, onSimulateEntity }) {
  const { tensions: TENSIONS, evidences: EVIDENCES, isAdmin, openEditor } = usePlaybookData();
  const [selectedTensionId, setSelectedTensionId] = useState(TENSIONS[0]?.id || 'ten-01');

  const activeTension = TENSIONS.find(t => t.id === selectedTensionId) || TENSIONS[0] || {};

  const poloAEvs = (activeTension.poloA.evidencias || [])
    .map(id => EVIDENCES.find(e => e.id === id))
    .filter(Boolean);
  const poloAPhotoEv = poloAEvs.find(e => e.imagenUrl);

  const poloBEvs = (activeTension.poloB.evidencias || [])
    .map(id => EVIDENCES.find(e => e.id === id))
    .filter(Boolean);
  const poloBPhotoEv = poloBEvs.find(e => e.imagenUrl);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Compacto con Tooltip */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '3px 8px', borderRadius: '12px' }}>
            <EditableText dictKey="playbook.tensions.tag" defaultText="DIAGNÓSTICO DIALÉCTICO" />
          </span>
          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
            <EditableText dictKey="playbook.tensions.desc" defaultText="Dilemas estructurales del consumidor" />
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
            <EditableText dictKey="playbook.tensions.title" defaultText="Tension Explorer (Ejes Bipolares)" />
          </h1>
          <InfoTooltip
            title="Dilemas Dialécticos en Conflicto"
            content="Las tensiones revelan los choques entre las aspiraciones morales de la madre y los límites físicos o económicos de su vida cotidiana. Explora los dos polos en conflicto (Polo A vs Polo B) y las oportunidades derivadas."
            position="right"
            maxWidth={360}
          />
        </div>
      </div>

      {/* Tabs Selector de Tensiones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginBottom: '2rem' }}>
        {TENSIONS.map(t => {
          const isSelected = selectedTensionId === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setSelectedTensionId(t.id)}
              style={{
                backgroundColor: isSelected ? '#FFF5F5' : '#FFFFFF',
                border: isSelected ? '2px solid #F23F3B' : '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
              className="card-hover-fx"
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? '#DC2626' : '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                ⚡ Tensión {t.id.replace('ten-', '')}
              </div>
              <div style={{ fontWeight: 800, color: '#191919', fontSize: '0.95rem' }}>
                {t.titulo}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Tension Bipolar Interactive Display */}
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
        {/* Tension Title & Description */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Eje de Fricción Psicosocial
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '6px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#191919', margin: 0 }}>
              {activeTension.titulo}
            </h2>
            {isAdmin && (
              <button
                onClick={() => openEditor('tension', activeTension)}
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
                title="Editar esta tensión"
              >
                ✏️ Editar Tensión
              </button>
            )}
          </div>
          <p style={{ color: '#475569', fontSize: '0.96rem', lineHeight: 1.6, margin: '10px 0 0 0' }}>
            {activeTension.descripcion}
          </p>
        </div>

        {/* Bipolar Side-by-Side Arena */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', position: 'relative' }}>
          {/* POLO A */}
          <div
            style={{
              backgroundColor: '#F0F9FF',
              borderRadius: '14px',
              border: '1.5px solid #BAE6FD',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' }}>
                  Polo A · La Aspiración / El Control
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0C4A6E', margin: '0 0 1rem 0' }}>
                {activeTension.poloA.nombre}
              </h3>

              {poloAPhotoEv && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <FieldPhoto
                    photo={{
                      url: poloAPhotoEv.imagenUrl,
                      alt: poloAPhotoEv.imagenAlt || poloAPhotoEv.titulo,
                      caption: poloAPhotoEv.pieEtnografico,
                      page: poloAPhotoEv.fuente,
                      artifact: poloAPhotoEv.artefactoClave,
                      home: poloAPhotoEv.hogar
                    }}
                    size="medium"
                    aspectRatio="16/9"
                    showCaption={true}
                  />
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Conceptos y Comportamientos Nucleares:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeTension.poloA.conceptos.map(c => (
                    <span
                      key={c}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #BAE6FD',
                        color: '#0369A1',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Marcas / Soluciones en este Polo:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeTension.poloA.marcas.map(m => (
                    <span
                      key={m}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        color: '#191919',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      🏷️ {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Evidencias Asociadas:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeTension.poloA.evidencias.map(evId => {
                    const ev = EVIDENCES.find(e => e.id === evId);
                    if (!ev) return null;
                    return (
                      <div
                        key={ev.id}
                        onClick={() => onInspectEntity(ev)}
                        className="pvks-verbatim"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderLeft: '3px solid #0284c7',
                          padding: '7px 10px',
                          borderRadius: '0 6px 6px 0',
                          fontSize: '0.84rem',
                          color: '#0369A1',
                          cursor: 'pointer'
                        }}
                      >
                        [{ev.codigo}] “{ev.cita.length > 50 ? ev.cita.substring(0, 48) + '...' : ev.cita}”
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* POLO B */}
          <div
            style={{
              backgroundColor: '#FFFBEB',
              borderRadius: '14px',
              border: '1.5px solid #FDE68A',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F6911E' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>
                  Polo B · La Realidad / El Alivio
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#78350F', margin: '0 0 1rem 0' }}>
                {activeTension.poloB.nombre}
              </h3>

              {poloBPhotoEv && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <FieldPhoto
                    photo={{
                      url: poloBPhotoEv.imagenUrl,
                      alt: poloBPhotoEv.imagenAlt || poloBPhotoEv.titulo,
                      caption: poloBPhotoEv.pieEtnografico,
                      page: poloBPhotoEv.fuente,
                      artifact: poloBPhotoEv.artefactoClave,
                      home: poloBPhotoEv.hogar
                    }}
                    size="medium"
                    aspectRatio="16/9"
                    showCaption={true}
                  />
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Conceptos y Comportamientos Nucleares:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeTension.poloB.conceptos.map(c => (
                    <span
                      key={c}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #FDE68A',
                        color: '#92400E',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Marcas / Soluciones en este Polo:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeTension.poloB.marcas.map(m => (
                    <span
                      key={m}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        color: '#191919',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      🏷️ {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Evidencias Asociadas:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeTension.poloB.evidencias.map(evId => {
                    const ev = EVIDENCES.find(e => e.id === evId);
                    if (!ev) return null;
                    return (
                      <div
                        key={ev.id}
                        onClick={() => onInspectEntity(ev)}
                        className="pvks-verbatim"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderLeft: '3px solid #F6911E',
                          padding: '7px 10px',
                          borderRadius: '0 6px 6px 0',
                          fontSize: '0.84rem',
                          color: '#B45309',
                          cursor: 'pointer'
                        }}
                      >
                        [{ev.codigo}] “{ev.cita.length > 50 ? ev.cita.substring(0, 48) + '...' : ev.cita}”
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dialéctica de Resolución & Oportunidad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '1.5rem' }}>
          <div style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase', marginBottom: '6px' }}>
              ⚙️ Mecanismo de Conciliación
            </div>
            <p style={{ color: '#7C2D12', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              {activeTension.mecanismoResolucion}
            </p>
          </div>

          <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: '6px' }}>
                ✨ Territorio de Oportunidad para la Marca
              </div>
              <p style={{ color: '#064E3B', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                {activeTension.oportunidadVinculada}
              </p>
            </div>
            {onSimulateEntity && (
              <button
                onClick={() => onSimulateEntity(activeTension)}
                className="primary-button"
                style={{ fontSize: '0.8rem', padding: '7px 14px', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Simular esta Tensión en Scenario Lab →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
