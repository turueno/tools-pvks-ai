// src/playbook/components/views/OverviewView.jsx
import React from 'react';
import EpistemicBadge from '../EpistemicBadge.jsx';
import FieldPhoto from '../shared/FieldPhoto.jsx';
import { Icon } from '../shared/Icons.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';

export default function OverviewView({ onNavigate, onInspectEntity }) {
  const {
    activeProjectId,
    activeProject,
    evidences: EVIDENCES = [],
    insights: INSIGHTS = [],
    tensions: TENSIONS = [],
    opportunities: OPPORTUNITIES = [],
    homes: HOMES = [],
    saveEntity,
    isAdmin,
    transversalBridge: TRANSVERSAL_BRIDGE = []
  } = usePlaybookData();

  const isLullaby = activeProjectId === 'lullaby-cdmx-2026' || (!activeProjectId && true);
  const isCinepolis = activeProjectId === 'exploratorio-compra-de-alimentos-por-la-ap-2683' ||
    (activeProject?.titulo || '').toLowerCase().includes('cine') ||
    (activeProject?.cliente || '').toLowerCase().includes('cine');

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
              <EditableText
                dictKey={`playbook.overview.tag.${activeProjectId || 'default'}`}
                defaultText={isCinepolis ? "ESTUDIO CUALITATIVO VIP · APPS & GASTRONOMÍA" : "SISTEMA DE NAVEGACIÓN ESTRATÉGICA"}
              />
            </span>
            <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
              {isCinepolis
                ? "· Inmersión en Salas Cinépolis VIP · 32 Láminas de Hallazgos · Hábitos de Pre-orden vs. Sala"
                : "· Inmersiones en Hogar CDMX · NSE C Típico · Madres 25 a 30 años"}
            </span>
          </div>

          {/* Epistemic Level Badges con Tooltips interactivos integrados */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginRight: '2px' }}>
              Niveles:
            </span>
            <InfoTooltip
              title="Nivel Observado (Empírico)"
              content="Hecho empírico registrado directamente: citas textuales, registros de despensa/sala, rutinas presenciadas y capturas de hábitat."
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
              content="Proyecciones estratégicas, escenarios futuros, territorios de oportunidad y postulados para validación de negocio."
              position="bottom"
              badgeText="Hipótesis"
              color="#10b981"
              hoverColor="#047857"
            />
          </div>
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          <EditableText
            dictKey={`playbook.overview.title.${activeProjectId || 'default'}`}
            defaultText={isCinepolis
              ? "Insight Playbook: Cinépolis VIP - Compra de Alimentos en App"
              : "Playbook de Conocimiento Cualitativo CDMX"}
          />
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.5, maxWidth: '850px', margin: 0 }}>
            <EditableText
              dictKey={`playbook.overview.desc.${activeProjectId || 'default'}`}
              defaultText={isCinepolis
                ? "Estructurado a partir del reporte cualitativo de 32 láminas. Transforma observaciones empíricas de compra en sala y pre-orden en app en mecanismos causales, tensiones dialécticas, simulador de journey y oportunidades de innovación."
                : "Estructurado a partir del reporte etnográfico de 29 páginas. Transforma observaciones en el hogar en mecanismos causales, tensiones, escenarios y oportunidades."}
              multiline={true}
            />
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

      {/* SECCIÓN 1: INMERSIONES / PERFILES CUALITATIVOS */}
      {isLullaby && (
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
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#775AFF' }} />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase', backgroundColor: '#EEF2FF', padding: '2px 8px', borderRadius: '4px' }}>
                    Inmersión 02 · Nestum
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Págs. 10–18</span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <FieldPhoto
                    photo={{
                      url: home1.imagenUrl,
                      alt: home1.imagenAlt,
                      caption: 'Liam de 8 meses desayuna en la barra mientras la mamá prepara papillas para el día.',
                      page: 'Pág. 11',
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
                  Hogar Liam & Madre Trabajadora (8 meses)
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1rem' }}>
                  <strong>Tensión clave:</strong> El cereal infantil resuelve en 1 minuto, pero compite con la avena natural que representa el ideal de "comida de verdad".
                </p>
                <div
                  className="pvks-verbatim"
                  style={{
                    backgroundColor: '#F5F3FF',
                    borderLeft: '3px solid #775AFF',
                    padding: '0.85rem 1rem',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '0.9rem',
                    color: '#191919',
                    marginBottom: '1rem'
                  }}
                >
                  “El cereal en polvo me saca de apuros cuando tengo que salir a trabajar, pero siento que la avena natural nutre más.”
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  ⚠️ <strong>Riesgo crítico:</strong> Sustitución por avena en hojuela tradicional ($18 el kilo) al cruzar los 9 meses.
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => onInspectEntity(INSIGHTS.find(i => i.id === 'ins-03'))}
                  className="secondary-button"
                  style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  Inspeccionar Utilidad
                </button>
                <button
                  onClick={() => onNavigate('tensions')}
                  className="primary-button"
                  style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  Ver Tensión Avena →
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
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#6DD0F0' }} />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', backgroundColor: '#F0F9FF', padding: '2px 8px', borderRadius: '4px' }}>
                    Inmersión 03 · Gerber Pouch
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Págs. 19–27</span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <FieldPhoto
                    photo={{
                      url: home2.imagenUrl,
                      alt: home2.imagenAlt,
                      caption: 'La mamá lleva maletín térmico con pouches Gerber para la jornada completa de trabajo en ferias.',
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
                  Hogar Ferias & Comercio Ambulante (14 meses)
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1rem' }}>
                  <strong>Tensión clave:</strong> En la calle, la inocuidad y la practicidad del pouch salvan la jornada sin requerir cuchara ni microondas.
                </p>
                <div
                  className="pvks-verbatim"
                  style={{
                    backgroundColor: '#F0FDF4',
                    borderLeft: '3px solid #00B487',
                    padding: '0.85rem 1rem',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '0.9rem',
                    color: '#191919',
                    marginBottom: '1rem'
                  }}
                >
                  “En el tianguis no hay dónde lavar una cuchara; el pouch me da la tranquilidad de que come limpio.”
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  ⚠️ <strong>Riesgo crítico:</strong> Resistencia al precio unitario ($22 vs colado tradicional de vidrio $15).
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => onInspectEntity(INSIGHTS.find(i => i.id === 'ins-04'))}
                  className="secondary-button"
                  style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  Inspeccionar Portabilidad
                </button>
                <button
                  onClick={() => onNavigate('scenario')}
                  className="primary-button"
                  style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  Simular en Calle →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 1 (CINÉPOLIS VIP): LOS 3 PERFILES CUALITATIVOS */}
      {isCinepolis && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#191919', margin: 0 }}>
                Perfiles Cualitativos de Consumidor & Hábitats VIP
              </h2>
              <InfoTooltip
                title="Segmentación de Hábitos y Canales"
                content="3 perfiles empíricos identificados en el reporte cualitativo: Buscador de Apapacho (servicio en sala asistido), Consumidor Autónomo (pre-orden digital en app) y Resignado / Friccionado (regresión al mesero por fallas de app)."
                position="right"
              />
            </div>
            <button
              onClick={() => onNavigate('matrix')}
              className="secondary-button"
              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            >
              <Icon name="matrix" size={15} /> Ver Matriz de Canales VIP →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {/* Perfil 1 */}
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
                    Perfil 01 · Servicio Asistido
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Láminas 6–9</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '6px 0 8px 0' }}>
                  Buscador de Apapacho y Hospitalidad
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1rem' }}>
                  <strong>Tensión clave:</strong> Compra boletos en la app, pero se niega a comprar alimentos ahí: busca el confort de ser consentido por el mesero en su butaca tras un día complicado.
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
                  “En el VIP es como ese apapacho que de repente buscas después de un día difícil... ¡Es mi lugar seguro!”
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  ⚠️ <strong>Riesgo crítico:</strong> Si la app impone un autoservicio frío o retira meseros, destruye la propuesta de valor emocional del VIP.
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => onInspectEntity(INSIGHTS.find(i => i.id === 'ins-01'))}
                  className="secondary-button"
                  style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  Inspeccionar Insight 1
                </button>
                <button
                  onClick={() => onNavigate('tensions')}
                  className="primary-button"
                  style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  Ver Tensión de Apapacho →
                </button>
              </div>
            </div>

            {/* Perfil 2 */}
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
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#0284C7' }} />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', backgroundColor: '#E0F2FE', padding: '2px 8px', borderRadius: '4px' }}>
                    Perfil 02 · Pre-orden Digital
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Láminas 10–16</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '6px 0 8px 0' }}>
                  Autónomo Pragmático (Zero Friction)
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1rem' }}>
                  <strong>Tensión clave:</strong> Ordena en el trayecto en auto para que todo esté servido al sentarse y evitar que el personal se cruce durante la película.
                </p>
                <div
                  className="pvks-verbatim"
                  style={{
                    backgroundColor: '#F0F9FF',
                    borderLeft: '3px solid #0284C7',
                    padding: '0.85rem 1rem',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '0.9rem',
                    color: '#191919',
                    marginBottom: '1rem'
                  }}
                >
                  “El valor del VIP es no hacer filas, llegar directo y que la comida esté lista antes de que apaguen las luces.”
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  ⚠️ <strong>Riesgo crítico:</strong> Si el sistema arroja Error 1050 en cobro o la comida llega fría, se pierde toda la promesa de eficiencia.
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => onInspectEntity(INSIGHTS.find(i => i.id === 'ins-02'))}
                  className="secondary-button"
                  style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  Inspeccionar Fricción
                </button>
                <button
                  onClick={() => onNavigate('scenario')}
                  className="primary-button"
                  style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  Simular Journey VIP →
                </button>
              </div>
            </div>

            {/* Perfil 3 */}
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
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#DC2626' }} />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B91C1C', textTransform: 'uppercase', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '4px' }}>
                    Perfil 03 · Regresión por Falla
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Láminas 17–24</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '6px 0 8px 0' }}>
                  Desconfianza Tecnológica & Resignación
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1rem' }}>
                  <strong>Tensión clave:</strong> Usuarios que intentaron pre-ordenar en app, pero sufrieron retrasos, cancelaciones o cobros dobles, forzándolos a regresar al mesero.
                </p>
                <div
                  className="pvks-verbatim"
                  style={{
                    backgroundColor: '#FEF2F2',
                    borderLeft: '3px solid #DC2626',
                    padding: '0.85rem 1rem',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '0.9rem',
                    color: '#191919',
                    marginBottom: '1rem'
                  }}
                >
                  “Si la app me falló una vez con el cobro en el estacionamiento, no me vuelvo a arriesgar: prefiero pagarle al mesero.”
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  ⚠️ <strong>Riesgo crítico:</strong> Sobrecarga operativa del staff en sala al saturar los primeros 15 minutos de la función.
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => onInspectEntity(INSIGHTS.find(i => i.id === 'ins-03'))}
                  className="secondary-button"
                  style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  Inspeccionar Cocina
                </button>
                <button
                  onClick={() => onNavigate('transitions')}
                  className="primary-button"
                  style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  Ver Transición de Canal →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 2: EVIDENCIA DE CAMPO (FOTOS O CITAS) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '10px' }}>
              EVIDENCIA EMPÍRICA OBSERVADA
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#191919', margin: '4px 0 0 0' }}>
              {isCinepolis
                ? "Puntos de Contacto y Fricciones de Canal en Salas VIP"
                : "Micro-Rituales y Artefactos de Alimentación Infantil"}
            </h3>
          </div>
          <button
            onClick={() => onNavigate('evidence')}
            className="secondary-button"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <Icon name="evidence" size={15} /> Ver Catálogo Completo ({EVIDENCES.length} Evidencias) →
          </button>
        </div>

        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.55, margin: '0 0 1.5rem 0', maxWidth: '850px' }}>
          {isCinepolis
            ? "El análisis de evidencias de Cinépolis VIP documenta la experiencia real del usuario: las barreras técnicas en el checkout móvil, la interacción en penumbra con el mesero, la descoordinación entre comanda digital y cocina, y la vivencia en butaca."
            : "La evidencia fotográfica del Proyecto Lullaby no es ilustrativa: es probatoria. Revela la materialidad de los hogares del NSE C, las estaciones de trabajo improvisadas y los artefactos que las madres inventan para conciliar el amor con el cansancio."}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {EVIDENCES.slice(0, 8).map(ev => (
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
              {ev.imagenUrl && (
                <FieldPhoto
                  photo={{
                    url: ev.imagenUrl,
                    alt: ev.imagenAlt || ev.titulo,
                    caption: ev.pieEtnografico || ev.descripcion,
                    page: ev.fuente,
                    artifact: ev.artefactoClave || ev.artefacto,
                    home: ev.hogar
                  }}
                  size="small"
                  aspectRatio="16/9"
                  showCaption={false}
                  onPhotoDrop={isAdmin ? (newUrl) => saveEntity('evidences', { ...ev, imagenUrl: newUrl }) : null}
                />
              )}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#C25E00' }}>[{ev.codigo || ev.id}]</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{ev.fuente}</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#191919', lineHeight: 1.3, marginBottom: '4px' }}>
                  {ev.titulo}
                </div>
                {ev.cita && (
                  <div style={{ fontSize: '0.78rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.4, margin: '4px 0' }}>
                    “{ev.cita.length > 90 ? ev.cita.slice(0, 90) + '...' : ev.cita}”
                  </div>
                )}
                {ev.artefactoClave && (
                  <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <span>🧰</span> <strong>{ev.artefactoClave}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 3: PUENTE TRANSVERSAL / EJES COMUNES */}
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
            SÍNTESIS TRANSVERSAL · EJES METODOLÓGICOS
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: 0 }}>
            {isCinepolis
              ? "Los 4 Ejes Sistémicos del Estudio Cinépolis VIP"
              : "Los 4 Ejes Comunes a las 3 Inmersiones (Pág. 28)"}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {TRANSVERSAL_BRIDGE.map((tb, idx) => (
            <div
              key={tb.eje || idx}
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

      {/* SECCIÓN 4: INTERACTIVE HUB CALLOUTS */}
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
              {isCinepolis ? "Scenario Lab: Simulador de Journey VIP" : "Scenario Lab: Simulador de Variables"}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
              {isCinepolis
                ? "Simula la tracción de compra en App vs. Servicio en Sala ajustando el momento de llegada, perfil del cliente, acompañamiento y estado de la pasarela de pago."
                : "Ajusta sliders como tiempo disponible, autonomía del bebé, movilidad y apoyo familiar para ver en tiempo real cómo cambian las necesidades y la relevancia de las marcas."}
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
              {isCinepolis
                ? "Cruza insights de compra móvil, detecta contradicciones entre apapacho y pre-orden, y evalúa territorios de oportunidad fundamentados en el reporte cualitativo."
                : "Cruza insights, detecta contradicciones, explica mecanismos causales y busca contraejemplos grounded únicamente en la evidencia del reporte etnográfico."}
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
