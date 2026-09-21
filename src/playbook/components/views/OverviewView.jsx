// src/playbook/components/views/OverviewView.jsx
import React from 'react';
import EpistemicBadge from '../EpistemicBadge.jsx';
import FieldPhoto from '../shared/FieldPhoto.jsx';
import { Icon } from '../shared/Icons.jsx';
import EditableText from '../shared/EditableText.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';

export default function OverviewView({ onNavigate, onInspectEntity }) {
  const {
    evidences: EVIDENCES,
    insights: INSIGHTS,
    tensions: TENSIONS,
    opportunities: OPPORTUNITIES,
    homes: HOMES = [],
    saveEntity,
    isAdmin,
    transversalBridge: TRANSVERSAL_BRIDGE
  } = usePlaybookData();

  const home0 = HOMES.find(h => h.id === 'hogar-1') || HOMES?.[0] || { id: 'hogar-1' };
  const home1 = HOMES.find(h => h.id === 'hogar-2') || HOMES?.[1] || { id: 'hogar-2' };
  const home2 = HOMES.find(h => h.id === 'hogar-3') || HOMES?.[2] || { id: 'hogar-3' };

  const stats = [
    { label: 'Evidencias Etnográficas', count: EVIDENCES.length, icon: 'evidence', color: '#6DD0F0', view: 'evidence' },
    { label: 'Fichas de Insight', count: INSIGHTS.length, icon: 'cards', color: '#F6911E', view: 'insights' },
    { label: 'Tensiones Críticas', count: TENSIONS.length, icon: 'tension', color: '#F23F3B', view: 'tensions' },
    { label: 'Territorios Oportunidad', count: OPPORTUNITIES.length, icon: 'opportunity', color: '#00B487', view: 'opportunities' }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Hero Header */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '2rem 2.25rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F6911E', backgroundColor: '#FFF7ED', padding: '4px 10px', borderRadius: '20px', border: '1px solid #FFEDD5', letterSpacing: '0.04em' }}>
              <EditableText dictKey="playbook.overview.tag" defaultText="SISTEMA DE NAVEGACIÓN ESTRATÉGICA" />
            </span>
            <span style={{ color: '#64748B', fontSize: '0.85rem' }}>· Inmersiones en Hogar CDMX · NSE C Típico · Madres 25 a 30 años</span>
          </div>

          {/* Epistemic Level Badges con Tooltips interactivos integrados */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginRight: '2px' }}>
              Niveles:
            </span>
            <InfoTooltip
              title="Nivel Observado (Empírico)"
              content="Hecho empírico registrado directamente: citas textuales, registros de despensa, rutinas presenciadas y fotos de hábitat."
              position="bottom"
              badgeText="Observado"
              color="#0284c7"
              hoverColor="#0369a1"
            />
            <InfoTooltip
              title="Nivel Derivado (Analítico)"
              content="Interpretación causal, tensiones latentes, mecanismos psicológicos o inferencias analíticas derivadas del campo."
              position="bottom"
              badgeText="Derivado"
              color="#d97706"
              hoverColor="#b45309"
            />
            <InfoTooltip
              title="Nivel Hipótesis (Estratégico)"
              content="Proyecciones estratégicas, escenarios futuros, territorios de oportunidad y postulados para validación."
              position="bottom"
              badgeText="Hipótesis"
              color="#10b981"
              hoverColor="#047857"
            />
          </div>
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          <EditableText dictKey="playbook.overview.title" defaultText="Playbook de Conocimiento Cualitativo CDMX" />
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.5, maxWidth: '850px', margin: 0 }}>
            <EditableText dictKey="playbook.overview.desc" defaultText="Estructurado a partir del reporte etnográfico de 29 páginas. Transforma observaciones en el hogar en mecanismos causales, tensiones, escenarios y oportunidades." multiline={true} />
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {stats.map(s => (
          <div
            key={s.label}
            onClick={() => onNavigate(s.view)}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
            className="card-hover-fx"
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', marginTop: '4px' }}>
                {s.count}
              </div>
            </div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: `${s.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon name={s.icon} size={24} color={s.color} />
            </div>
          </div>
        ))}
      </div>

      {/* The 3 Ethnographic Inmersions */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#191919', margin: 0 }}>
              Las 3 Inmersiones en Hogar (Págs. 2–27)
            </h2>
            <InfoTooltip
              title="Metodología de Inmersión"
              content="Casos de estudio cualitativo representativos en CDMX. Permite arrastrar fotografías directamente sobre cada hogar en modo Admin para actualizar los registros de campo."
              position="right"
            />
          </div>
          <button
            onClick={() => onNavigate('matrix')}
            className="secondary-button"
            style={{ fontSize: '0.82rem', padding: '6px 12px' }}
          >
            <Icon name="matrix" size={15} /> Ver Matriz Comparativa (Pág. 29)
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Caso 1: Nido */}
          <div
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
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#F6911E' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase', backgroundColor: '#FFF7ED', padding: '2px 8px', borderRadius: '4px' }}>
                  Inmersión 01 · Nido Kinder
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Págs. 3–9</span>
              </div>

              {/* Foto de Campo de Hábitat */}
              <div style={{ marginBottom: '1rem' }}>
                <FieldPhoto
                  photo={{
                    url: home0.imagenUrl,
                    alt: home0.imagenAlt,
                    caption: 'Belén aparta la porción de la niña antes de condimentar para el resto de la familia.',
                    page: 'Pág. 4',
                    artifact: home0.artefacto,
                    home: 'Hogar Belén (Nido)'
                  }}
                  aspectRatio="16/9"
                  size="small"
                  showCaption={false}
                  homeId="hogar-1"
                  onPhotoDrop={isAdmin ? (newUrl) => saveEntity('homes', { ...home0, imagenUrl: newUrl }) : null}
                />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '6px 0 8px 0' }}>
                Hogar Belén & Hija (1 año)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1rem' }}>
                <strong>Tensión clave:</strong> Crecer empieza a significar necesitar menos "cosas de bebé". Se desdibuja la frontera entre su comida y la comida familiar.
              </p>
              <div
                className="pvks-verbatim"
                style={{
                  backgroundColor: '#FFF9F2',
                  borderLeft: '3px solid #F6911E',
                  padding: '0.85rem 1rem',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '0.9rem',
                  color: '#191919',
                  marginBottom: '1rem'
                }}
              >
                “Mi idea era terminarle de dar fórmula y seguir con Nido y ya después pues leche de aquí de la casa.”
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                ⚠️ <strong>Riesgo crítico:</strong> Bypass directo de NAN a leche entera si el niño la tolera sin diarrea.
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => onInspectEntity(INSIGHTS.find(i => i.id === 'ins-02'))}
                className="secondary-button"
                style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              >
                Inspeccionar Bypass
              </button>
              <button
                onClick={() => onNavigate('transitions')}
                className="primary-button"
                style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              >
                Ver Transición 1 Año →
              </button>
            </div>
          </div>

          {/* Caso 2: Nestum */}
          <div
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
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#6DD0F0' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', backgroundColor: '#E0F2FE', padding: '2px 8px', borderRadius: '4px' }}>
                  Inmersión 02 · Nestum (+ NAN)
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Págs. 10–18</span>
              </div>

              {/* Foto de Campo de Hábitat */}
              <div style={{ marginBottom: '1rem' }}>
                <FieldPhoto
                  photo={{
                    url: home1.imagenUrl,
                    alt: home1.imagenAlt,
                    caption: 'Barra de cocina: preparación rápida con agua tibia antes de la jornada de home office.',
                    page: 'Pág. 17',
                    artifact: home1.artefacto,
                    home: 'Hogar Liam (Nestum)'
                  }}
                  aspectRatio="16/9"
                  size="small"
                  showCaption={false}
                  homeId="hogar-2"
                  onPhotoDrop={isAdmin ? (newUrl) => saveEntity('homes', { ...home1, imagenUrl: newUrl }) : null}
                />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '6px 0 8px 0' }}>
                Hogar Mamá Trabajadora & Liam
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1rem' }}>
                <strong>Tensión clave:</strong> El regreso al trabajo comprime el tiempo matutino. Buscar "algo que me ayude pero que también lo nutra" sin sacrificar el estándar casero.
              </p>
              <div
                className="pvks-verbatim"
                style={{
                  backgroundColor: '#FFF9F2',
                  borderLeft: '3px solid #F6911E',
                  padding: '0.85rem 1rem',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '0.9rem',
                  color: '#191919',
                  marginBottom: '1rem'
                }}
              >
                “Nunca he tomado como una decisión a base de lo que veo; más bien esas decisiones las llevo como a mi pediatra.”
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                🔍 <strong>Filtro Heurístico:</strong> Sello "Sin Azúcar Añadida" como condición de corte excluyente.
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => onInspectEntity(INSIGHTS.find(i => i.id === 'ins-04'))}
                className="secondary-button"
                style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              >
                Cadena de Certeza
              </button>
              <button
                onClick={() => onNavigate('decisions')}
                className="primary-button"
                style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              >
                Explorar Decisiones →
              </button>
            </div>
          </div>

          {/* Caso 3: Gerber */}
          <div
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
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#775AFF' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase', backgroundColor: '#EEF2FF', padding: '2px 8px', borderRadius: '4px' }}>
                  Inmersión 03 · Gerber
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Págs. 19–27</span>
              </div>

              {/* Foto de Campo de Hábitat */}
              <div style={{ marginBottom: '1rem' }}>
                <FieldPhoto
                  photo={{
                    url: home2.imagenUrl,
                    alt: home2.imagenAlt,
                    caption: 'El kit de contingencia: caja organizadora de supervivencia para 14 horas de feria.',
                    page: 'Pág. 21',
                    artifact: home2.artefacto,
                    home: 'Hogar Ferias (Gerber)'
                  }}
                  aspectRatio="16/9"
                  size="small"
                  showCaption={false}
                  homeId="hogar-3"
                  onPhotoDrop={isAdmin ? (newUrl) => saveEntity('homes', { ...home2, imagenUrl: newUrl }) : null}
                />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '6px 0 8px 0' }}>
                Hogar Mamá en Ferias & Bebé
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1rem' }}>
                <strong>Tensión clave:</strong> Su estándar de cuidado exige control higiénico; su vida cotidiana en ferias exige improvisar sin agua ni estufa.
              </p>
              <div
                className="pvks-verbatim"
                style={{
                  backgroundColor: '#FFF9F2',
                  borderLeft: '3px solid #F6911E',
                  padding: '0.85rem 1rem',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '0.9rem',
                  color: '#191919',
                  marginBottom: '1rem'
                }}
              >
                “Llegó un punto en el que dije: a ver, ya también me estoy torturando demasiado. Necesito yo tener un descanso...”
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                🧰 <strong>Solución:</strong> Maletín modular "Kit Gerber" para contingencia y movilidad de 12 horas.
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => onInspectEntity(INSIGHTS.find(i => i.id === 'ins-07'))}
                className="secondary-button"
                style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              >
                Ver Kit Gerber
              </button>
              <button
                onClick={() => onNavigate('tensions')}
                className="primary-button"
                style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              >
                Explorar Tensiones →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mural Etnográfico de Micro-Rituales de Campo */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '10px', border: '1px solid #FFEDD5' }}>
                DOCUMENTACIÓN FOTOGRÁFICA EN HOGARES · CDMX
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Inmersión etnográfica en hábitat real</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#191919', margin: 0 }}>
              Micro-Rituales y Artefactos de Alimentación Infantil
            </h3>
          </div>
          <button
            onClick={() => onNavigate('evidence')}
            className="secondary-button"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <Icon name="evidence" size={15} /> Ver Catálogo Completo (20 Evidencias) →
          </button>
        </div>

        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.55, margin: '0 0 1.5rem 0', maxWidth: '850px' }}>
          La evidencia fotográfica del Proyecto Lullaby no es ilustrativa: es probatoria. Revela la materialidad de los hogares del NSE C,
          las estaciones de trabajo improvisadas y los artefactos que las madres inventan para conciliar el amor con el cansancio.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {EVIDENCES.filter(e => e.imagenUrl).slice(0, 8).map(ev => (
            <div
              key={ev.id}
              onClick={() => onInspectEntity(ev)}
              className="card-hover-fx"
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}
            >
              <FieldPhoto
                photo={{
                  url: ev.imagenUrl,
                  alt: ev.imagenAlt || ev.titulo,
                  caption: ev.pieEtnografico,
                  page: ev.fuente,
                  artifact: ev.artefactoClave,
                  home: ev.hogar
                }}
                size="small"
                aspectRatio="16/9"
                showCaption={false}
                onPhotoDrop={isAdmin ? (newUrl) => saveEntity('evidences', { ...ev, imagenUrl: newUrl }) : null}
              />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#C25E00' }}>[{ev.codigo}]</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{ev.fuente}</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#191919', lineHeight: 1.3, marginBottom: '4px' }}>
                  {ev.titulo}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🧰</span> <strong>{ev.artefactoClave}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Puente Transversal: Los 4 Hallazgos Comunes (Pág. 28) */}
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
            SÍNTESIS TRANSVERSAL · PÁG. 28
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: 0 }}>
            Los 4 Ejes Comunes a las 3 Inmersiones
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {TRANSVERSAL_BRIDGE.map((tb, idx) => (
            <div
              key={tb.eje}
              style={{
                backgroundColor: '#F8F9FA',
                padding: '1.25rem',
                borderRadius: '10px',
                borderLeft: `3.5px solid ${idx === 0 ? '#6DD0F0' : idx === 1 ? '#775AFF' : idx === 2 ? '#F23F3B' : '#F6911E'}`
              }}
            >
              <div style={{ fontWeight: 800, color: '#191919', fontSize: '0.95rem', marginBottom: '6px' }}>
                0{idx + 1}. {tb.eje}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
                {tb.descripcion}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Hub Callouts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Scenario Lab Callout */}
        <div
          onClick={() => onNavigate('scenario')}
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
              <Icon name="scenario" size={18} color="#00B487" /> Módulo Central Interactivo
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#191919', margin: '0.5rem 0' }}>
              Scenario Lab: Simulador de Variables
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
              Ajusta sliders como tiempo disponible, autonomía del bebé, movilidad y apoyo familiar para ver en tiempo real cómo cambian las necesidades y la relevancia de las marcas.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00B487', fontWeight: 700, fontSize: '0.85rem', marginTop: '1rem' }}>
            Abrir Simulador <Icon name="arrow-right" size={15} color="#00B487" />
          </div>
        </div>

        {/* AI Assistant Callout */}
        <div
          onClick={() => onNavigate('ai')}
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
              <Icon name="ai" size={18} color="#F6911E" /> Asistente de Investigación
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#191919', margin: '0.5rem 0' }}>
              Asistente IA Grounded (12 Acciones)
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
              Cruza insights, detecta contradicciones, explica mecanismos causales y busca contraejemplos grounded únicamente en la evidencia del reporte etnográfico.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F6911E', fontWeight: 700, fontSize: '0.85rem', marginTop: '1rem' }}>
            Ejecutar Acciones IA <Icon name="arrow-right" size={15} color="#F6911E" />
          </div>
        </div>
      </div>
    </div>
  );
}
