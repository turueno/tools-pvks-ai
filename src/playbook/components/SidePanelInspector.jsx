// src/playbook/components/SidePanelInspector.jsx
import React from 'react';
import EpistemicBadge from './EpistemicBadge.jsx';
import { Icon } from './shared/Icons.jsx';
import FieldPhoto from './shared/FieldPhoto.jsx';
import { usePlaybookData } from '../context/usePlaybookData.js';
import { ACTORS, CONTEXTS, OPPORTUNITIES } from '../data/playbookDataset.js';

export default function SidePanelInspector({ item, onClose, onNavigateToView, onSimulateEntity, onAnalyzeWithAI }) {
  const { evidences: EVIDENCES, insights: INSIGHTS, isAdmin, openEditor, saveEntity } = usePlaybookData();
  if (!item) return null;

  // Determinar tipo de entidad y buscar datos enriquecidos si fuera necesario
  let title = item.titulo || item.nombre || item.label || 'Elemento';
  let subtitle = item.codigo || item.tipo || item.fuente || item.fuenteReporte || '';
  let level = item.nivel || item.nivelEpistemologico || 'DERIVADO';

  let detectedType = null;
  if (item.codigo?.startsWith('EV-') || item.observacionDirecta !== undefined) detectedType = 'evidence';
  else if (item.mecanismo !== undefined || item.id?.startsWith('ins-')) detectedType = 'insight';
  else if (item.poloA !== undefined || item.id?.startsWith('ten-')) detectedType = 'tension';
  else if (item.detonante !== undefined || item.id?.startsWith('trans-')) detectedType = 'transition';
  else if (item.sostieneUso !== undefined) detectedType = 'brand';
  else if (item.etapas !== undefined) detectedType = 'decision';

  // Obtener fotografía etnográfica si el ítem la tiene directamente o a través de evidencias vinculadas
  let photoObj = null;
  if (item.imagenUrl) {
    photoObj = {
      url: item.imagenUrl,
      alt: item.imagenAlt || item.titulo,
      caption: item.pieEtnografico || item.fotoHabitat || item.descripcion,
      page: item.fuente || item.fuenteReporte,
      artifact: item.artefactoClave || item.artefacto,
      home: item.hogar
    };
  } else if (item.evidenciaIds && item.evidenciaIds.length > 0) {
    const evWithPhoto = EVIDENCES.find(e => item.evidenciaIds.includes(e.id) && e.imagenUrl);
    if (evWithPhoto) {
      photoObj = {
        url: evWithPhoto.imagenUrl,
        alt: evWithPhoto.imagenAlt || evWithPhoto.titulo,
        caption: evWithPhoto.pieEtnografico,
        page: evWithPhoto.fuente,
        artifact: evWithPhoto.artefactoClave,
        home: evWithPhoto.hogar
      };
    }
  } else if (item.evidenciaId) {
    const evWithPhoto = EVIDENCES.find(e => e.id === item.evidenciaId && e.imagenUrl);
    if (evWithPhoto) {
      photoObj = {
        url: evWithPhoto.imagenUrl,
        alt: evWithPhoto.imagenAlt || evWithPhoto.titulo,
        caption: evWithPhoto.pieEtnografico,
        page: evWithPhoto.fuente,
        artifact: evWithPhoto.artefactoClave,
        home: evWithPhoto.hogar
      };
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(500px, 92vw)',
        backgroundColor: '#FFFFFF',
        borderLeft: '1px solid #E2E8F0',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.08)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.25s ease-out'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          backgroundColor: '#FAFAFA'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <EpistemicBadge level={level} size="small" />
            <span style={{ fontSize: '0.78rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              {subtitle}
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#191919', fontWeight: '800', lineHeight: 1.3 }}>
            {title}
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isAdmin && detectedType && (
            <button
              onClick={() => {
                openEditor(detectedType, item);
                onClose();
              }}
              style={{
                backgroundColor: '#FFF7ED',
                border: '1.5px solid #F6911E',
                color: '#C25E00',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Editar este elemento en el CMS"
            >
              ✏️ Editar
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Cerrar panel"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
      </div>

      {/* Body con Scroll */}
      <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Fotografía de Campo Etnográfica si aplica */}
        {photoObj && (
          <div style={{ marginBottom: '0.25rem' }}>
            <FieldPhoto
              photo={photoObj}
              size="medium"
              aspectRatio="16/9"
              showCaption={true}
              onPhotoDrop={isAdmin ? (newUrl) => {
                if (item.imagenUrl !== undefined) {
                  const collection = detectedType === 'evidence' ? 'evidences' : detectedType === 'insight' ? 'insights' : detectedType === 'brand' ? 'brandMatrix' : 'homes';
                  saveEntity(collection, { ...item, imagenUrl: newUrl });
                } else if (item.evidenciaIds && item.evidenciaIds.length > 0) {
                  const ev = EVIDENCES.find(e => item.evidenciaIds.includes(e.id));
                  if (ev) saveEntity('evidences', { ...ev, imagenUrl: newUrl });
                } else if (item.evidenciaId) {
                  const ev = EVIDENCES.find(e => e.id === item.evidenciaId);
                  if (ev) saveEntity('evidences', { ...ev, imagenUrl: newUrl });
                }
              } : null}
            />
          </div>
        )}
        {/* Cita Textual si existe */}
        {item.cita && (
          <div
            className="pvks-verbatim"
            style={{
              backgroundColor: '#FFF7ED',
              borderLeft: '4px solid #F6911E',
              border: '1px solid #FFEDD5',
              borderLeftWidth: '4px',
              padding: '1rem 1.25rem',
              borderRadius: '0 8px 8px 0',
              color: '#191919',
              fontSize: '0.96rem',
              lineHeight: 1.55
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontStyle: 'normal', color: '#C25E00', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              <Icon name="quote" size={14} color="#C25E00" /> CITA REGISTRADA EN EL ESTUDIO
            </div>
            “{item.cita}”
          </div>
        )}

        {/* Descripción Principal */}
        {item.descripcion && (
          <div>
            <h4 style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: 700 }}>
              Descripción / Observación
            </h4>
            <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              {item.descripcion}
            </p>
          </div>
        )}

        {/* Si es Ficha de Insight: Campos Estructurados */}
        {item.mecanismo && (
          <div style={{ backgroundColor: '#FFFBEB', padding: '1rem', borderRadius: '8px', border: '1px solid #FDE68A', borderLeft: '3px solid #D97706' }}>
            <h4 style={{ fontSize: '0.8rem', color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: 700 }}>
              ⚙️ Mecanismo Psicológico / Social
            </h4>
            <p style={{ color: '#92400E', fontSize: '0.88rem', lineHeight: 1.55, margin: 0 }}>
              {item.mecanismo}
            </p>
          </div>
        )}

        {item.tension && (
          <div style={{ backgroundColor: '#FEF2F2', padding: '1rem', borderRadius: '8px', border: '1px solid #FECACA', borderLeft: '3px solid #DC2626' }}>
            <h4 style={{ fontSize: '0.8rem', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: 700 }}>
              ⚡ Tensión Latente
            </h4>
            <p style={{ color: '#991B1B', fontSize: '0.88rem', lineHeight: 1.55, margin: 0 }}>
              {item.tension}
            </p>
          </div>
        )}

        {item.necesidad && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Necesidad Profunda</div>
              <div style={{ color: '#191919', fontSize: '0.86rem', marginTop: '4px', fontWeight: 600 }}>{item.necesidad}</div>
            </div>
            <div style={{ backgroundColor: '#F0FDF4', padding: '0.85rem', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
              <div style={{ fontSize: '0.72rem', color: '#15803D', textTransform: 'uppercase', fontWeight: 700 }}>Condición de Aceptación</div>
              <div style={{ color: '#166534', fontSize: '0.86rem', marginTop: '4px', fontWeight: 600 }}>{item.condicionAceptacion}</div>
            </div>
          </div>
        )}

        {item.implicaciones && (
          <div>
            <h4 style={{ fontSize: '0.8rem', color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: 700 }}>
              🎯 Implicación para la Marca
            </h4>
            <p style={{ color: '#1E293B', fontSize: '0.88rem', lineHeight: 1.55, margin: 0 }}>
              {item.implicaciones}
            </p>
          </div>
        )}

        {item.oportunidades && (
          <div style={{ backgroundColor: '#F0FDF4', padding: '1rem', borderRadius: '8px', border: '1px solid #DCFCE7', borderLeft: '3px solid #16A34A' }}>
            <h4 style={{ fontSize: '0.8rem', color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: 700 }}>
              ✨ Territorio de Oportunidad
            </h4>
            <p style={{ color: '#166534', fontSize: '0.88rem', lineHeight: 1.55, margin: 0 }}>
              {item.oportunidades}
            </p>
          </div>
        )}

        {/* Marcas y Actores Tags Clicables */}
        {(item.marcasRelacionadas || item.marcas || item.actores) && (
          <div>
            <h4 style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 700 }}>
              Entidades Vinculadas
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(item.marcasRelacionadas || item.marcas || []).map(m => (
                <span
                  key={m}
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    color: '#1E293B',
                    fontWeight: 600
                  }}
                >
                  🏷️ {m}
                </span>
              ))}
              {(item.actores || []).map(a => (
                <span
                  key={a}
                  style={{
                    backgroundColor: '#F5F3FF',
                    border: '1px solid #DDD6FE',
                    color: '#6D28D9',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600
                  }}
                >
                  👤 {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Trazabilidad al reporte */}
        {(item.fuente || item.fuenteReporte) && (
          <div
            style={{
              padding: '0.85rem',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '0.82rem',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>📄 Fuente Documental:</span>
            <span style={{ color: '#F6911E', fontWeight: 700 }}>{item.fuente || item.fuenteReporte}</span>
          </div>
        )}
      </div>

      {/* Footer con Acciones */}
      <div
        style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #E2E8F0',
          backgroundColor: '#FAFAFA',
          display: 'flex',
          gap: '8px'
        }}
      >
        <button
          onClick={() => {
            if (onAnalyzeWithAI) {
              onAnalyzeWithAI(item);
            } else if (onNavigateToView) {
              onNavigateToView('ai');
            }
            if (onClose) onClose();
          }}
          className="secondary-button"
          style={{ flex: 1, fontSize: '0.82rem', padding: '9px 12px' }}
        >
          <Icon name="ai" size={15} /> Analizar con Asistente
        </button>
        <button
          onClick={() => {
            if (onSimulateEntity) {
              onSimulateEntity(item);
            } else if (onNavigateToView) {
              onNavigateToView('scenario');
            }
            if (onClose) onClose();
          }}
          className="primary-button"
          style={{ flex: 1, fontSize: '0.82rem', padding: '9px 12px' }}
        >
          <Icon name="scenario" size={15} /> Simular Escenario
        </button>
      </div>
    </div>
  );
}
