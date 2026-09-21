// src/playbook/components/views/AIAssistantView.jsx
import React, { useState } from 'react';
import EpistemicBadge from '../EpistemicBadge.jsx';
import { Icon } from '../shared/Icons.jsx';
import EditableText from '../shared/EditableText.jsx';
import { AI_ACTIONS, executeAIOperation } from '../../engine/groundedAIEngine.js';
import { INSIGHTS, ACTORS, CONTEXTS, TRANSITIONS } from '../../data/playbookDataset.js';
import { usePlaybookData } from '../../context/usePlaybookData.js';

export default function AIAssistantView({ incomingEntity, onClearIncomingEntity }) {
  const { data } = usePlaybookData();
  const currentInsights = data.insights || INSIGHTS;
  const currentTransitions = data.transitions || TRANSITIONS;

  const [selectedActionId, setSelectedActionId] = useState('derivar-implicaciones');
  const [params, setParams] = useState({
    insightId: currentInsights[0]?.id || INSIGHTS[0].id,
    secondaryInsightId: currentInsights[1]?.id || INSIGHTS[1].id,
    actorId: ACTORS[0].id,
    contextId: CONTEXTS[0].id,
    secondaryContextId: CONTEXTS[2].id,
    transitionId: currentTransitions[0]?.id || TRANSITIONS[0].id,
    variableKey: 'tiempoPreparacion',
    marcaKey: 'Nido',
    temaBusqueda: 'azúcar',
    tesisComun: 'Las madres compran marcas infantiles por lealtad ciega o tradición'
  });
  const [sourceBanner, setSourceBanner] = useState(null);

  const [lastResult, setLastResult] = useState(() => {
    return executeAIOperation('derivar-implicaciones', { insightId: currentInsights[0]?.id || INSIGHTS[0].id }, data);
  });

  // Efecto cuando llega una entidad desde el Drawer u otra vista
  React.useEffect(() => {
    if (incomingEntity) {
      const { actionId, params: newParams, entityTitle, entityType } = incomingEntity;
      setSelectedActionId(actionId);
      const mergedParams = { ...params, ...newParams };
      setParams(mergedParams);
      setSourceBanner({
        title: entityTitle,
        type: entityType
      });
      // Ejecutar inmediatamente el análisis grounded
      const res = executeAIOperation(actionId, mergedParams, data);
      setLastResult(res);
    }
  }, [incomingEntity]);

  const handleRunAction = () => {
    const res = executeAIOperation(selectedActionId, params, data);
    setLastResult(res);
  };

  const currentAction = AI_ACTIONS.find(a => a.id === selectedActionId) || AI_ACTIONS[0];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 10px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
            <EditableText dictKey="playbook.ai.header.tag" defaultText="ASISTENTE ANALÍTICO CONTEXTUAL" />
          </span>
          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
            <EditableText dictKey="playbook.ai.header.subtag" defaultText="100% Grounded en el Reporte Etnográfico" />
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#191919', margin: 0, letterSpacing: '-0.02em' }}>
          <EditableText dictKey="playbook.ai.header.title" defaultText="Asistente de Inteligencia Estratégica (12 Acciones)" />
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.94rem', margin: '8px 0 0 0', maxWidth: '850px', lineHeight: 1.55 }}>
          <EditableText dictKey="playbook.ai.header.desc" defaultText="No es un chat genérico. Es un conjunto de operaciones cognitivas estructuradas que interrogan las 29 páginas del estudio etnográfico, separando estrictamente la evidencia empírica de las deducciones e hipótesis." multiline={true} />
        </p>
      </div>

      {/* Banner de Entidad Precargada desde el Drawer o Vistas */}
      {sourceBanner && (
        <div
          style={{
            backgroundColor: '#FFF7ED',
            border: '1.5px solid #FDBA74',
            borderRadius: '12px',
            padding: '0.9rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#C25E00', fontWeight: 800, textTransform: 'uppercase' }}>
                Entidad Precargada: {sourceBanner.type}
              </div>
              <div style={{ fontSize: '0.94rem', color: '#9A3412', fontWeight: 700 }}>
                {sourceBanner.title}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setSourceBanner(null);
              if (onClearIncomingEntity) onClearIncomingEntity();
            }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#64748B',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ✕ Limpiar Filtro
          </button>
        </div>
      )}

      {/* Grid de 12 Acciones Estratégicas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px', marginBottom: '2rem' }}>
        {AI_ACTIONS.map(action => {
          const isSelected = selectedActionId === action.id;
          return (
            <div
              key={action.id}
              onClick={() => {
                setSelectedActionId(action.id);
                // Ejecutar automáticamente al seleccionar para fluidez
                const res = executeAIOperation(action.id, params, data);
                setLastResult(res);
              }}
              style={{
                backgroundColor: isSelected ? '#FFF7ED' : '#FFFFFF',
                border: isSelected ? '2px solid #F6911E' : '1px solid #E2E8F0',
                boxShadow: isSelected ? '0 4px 12px rgba(246, 145, 30, 0.15)' : '0 1px 3px rgba(0,0,0,0.03)',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              className="card-hover-fx"
            >
              <div style={{ fontWeight: 700, color: isSelected ? '#C25E00' : '#191919', fontSize: '0.88rem', marginBottom: '4px' }}>
                {action.titulo}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35 }}>
                {action.descripcion}
              </div>
            </div>
          );
        })}
      </div>

      {/* Arena de Configuración de Parámetros y Ejecución */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          padding: '1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#C25E00', textTransform: 'uppercase', fontWeight: 700 }}>
              Operación Seleccionada
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#191919', margin: '2px 0 0 0' }}>
              {currentAction.titulo}
            </h3>
          </div>

          <button
            onClick={handleRunAction}
            className="primary-button"
            style={{ backgroundColor: '#F6911E', color: '#ffffff', padding: '8px 18px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Icon name="ai" size={16} /> <EditableText dictKey="playbook.ai.btn.reRun" defaultText="Re-ejecutar Análisis" />
          </button>
        </div>

        {/* Inputs dinámicos según lo que requiere la acción */}
        {currentAction.requiere.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
            {currentAction.requiere.includes('insightId') && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Insight Principal a Analizar:
                </label>
                <select
                  value={params.insightId}
                  onChange={(e) => setParams({ ...params, insightId: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#191919', fontSize: '0.84rem' }}
                >
                  {currentInsights.map(i => (
                    <option key={i.id} value={i.id}>{i.titulo}</option>
                  ))}
                </select>
              </div>
            )}

            {currentAction.requiere.includes('secondaryInsightId') && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Segundo Insight a Cruzar:
                </label>
                <select
                  value={params.secondaryInsightId}
                  onChange={(e) => setParams({ ...params, secondaryInsightId: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#191919', fontSize: '0.84rem' }}
                >
                  {currentInsights.map(i => (
                    <option key={i.id} value={i.id}>{i.titulo}</option>
                  ))}
                </select>
              </div>
            )}

            {currentAction.requiere.includes('actorId') && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Actor del Sistema:
                </label>
                <select
                  value={params.actorId}
                  onChange={(e) => setParams({ ...params, actorId: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#191919', fontSize: '0.84rem' }}
                >
                  {ACTORS.map(a => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {currentAction.requiere.includes('contextId') && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Contexto Principal:
                </label>
                <select
                  value={params.contextId}
                  onChange={(e) => setParams({ ...params, contextId: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#191919', fontSize: '0.84rem' }}
                >
                  {CONTEXTS.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {currentAction.requiere.includes('secondaryContextId') && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Contexto Secundario a Comparar:
                </label>
                <select
                  value={params.secondaryContextId}
                  onChange={(e) => setParams({ ...params, secondaryContextId: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#191919', fontSize: '0.84rem' }}
                >
                  {CONTEXTS.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {currentAction.requiere.includes('transitionId') && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Punto de Transición:
                </label>
                <select
                  value={params.transitionId}
                  onChange={(e) => setParams({ ...params, transitionId: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#191919', fontSize: '0.84rem' }}
                >
                  {currentTransitions.map(t => (
                    <option key={t.id} value={t.id}>{t.titulo}</option>
                  ))}
                </select>
              </div>
            )}

            {currentAction.requiere.includes('variableKey') && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Variable Crítica a Testear:
                </label>
                <select
                  value={params.variableKey}
                  onChange={(e) => setParams({ ...params, variableKey: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#191919', fontSize: '0.84rem' }}
                >
                  <option value="tiempoPreparacion">Tiempo de Preparación</option>
                  <option value="autonomiaBebe">Autonomía del Bebé</option>
                  <option value="movilidadFuera">Movilidad / Fuera de Casa</option>
                  <option value="apoyoFamiliar">Apoyo Familiar Extenso</option>
                  <option value="influenciaPediatra">Influencia del Pediatra</option>
                  <option value="preocupacionAzucar">Preocupación por Azúcar</option>
                  <option value="alternativasCasa">Alternativas de Casa</option>
                </select>
              </div>
            )}

            {currentAction.requiere.includes('marcaKey') && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Marca para Formulación de Hipótesis:
                </label>
                <select
                  value={params.marcaKey}
                  onChange={(e) => setParams({ ...params, marcaKey: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#191919', fontSize: '0.84rem' }}
                >
                  <option value="Nido">Nido Kinder</option>
                  <option value="Nestum">Nestum</option>
                  <option value="Gerber">Gerber</option>
                </select>
              </div>
            )}

            {currentAction.requiere.includes('temaBusqueda') && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Término o Tema a Respaldar con Evidencia:
                </label>
                <input
                  type="text"
                  value={params.temaBusqueda}
                  onChange={(e) => setParams({ ...params, temaBusqueda: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#191919', fontSize: '0.84rem' }}
                />
              </div>
            )}

            {currentAction.requiere.includes('tesisComun') && (
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Tesis o Suposición a Desafiar:
                </label>
                <input
                  type="text"
                  value={params.tesisComun}
                  onChange={(e) => setParams({ ...params, tesisComun: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#191919', fontSize: '0.84rem' }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tarjeta de Respuesta Grounded Estructurada */}
      {lastResult && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}
        >
          {/* Header del Resultado */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C25E00', textTransform: 'uppercase' }}>
                Respuesta Analítica Grounded
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#191919', margin: '4px 0 0 0', letterSpacing: '-0.01em' }}>
                {lastResult.foco}
              </h2>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#059669', backgroundColor: '#ECFDF5', padding: '4px 10px', borderRadius: '12px', border: '1px solid #A7F3D0', fontWeight: 700 }}>
              ✓ VERIFICADO CONTRA REPORTE
            </span>
          </div>

          {/* Bloques de Respuesta Diferenciados Epistemológicamente */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {lastResult.respuestaEstrategica.map((bloque, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: bloque.nivel === 'OBSERVADO' ? '#F0F9FF' : bloque.nivel === 'DERIVADO' ? '#FFFBEB' : '#F0FDF4',
                  borderLeft: `4px solid ${bloque.nivel === 'OBSERVADO' ? '#0284c7' : bloque.nivel === 'DERIVADO' ? '#d97706' : '#16a34a'}`,
                  border: `1px solid ${bloque.nivel === 'OBSERVADO' ? '#BAE6FD' : bloque.nivel === 'DERIVADO' ? '#FDE68A' : '#BBF7D0'}`,
                  borderLeftWidth: '4px',
                  padding: '1.1rem 1.35rem',
                  borderRadius: '0 8px 8px 0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <EpistemicBadge level={bloque.nivel} size="small" />
                </div>
                <p style={{ color: '#0F172A', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                  {bloque.texto}
                </p>
              </div>
            ))}
          </div>

          {/* Elementos Utilizados (Trazabilidad) */}
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
              📌 Evidencias y Elementos del Reporte Empleados:
            </div>
            <pre style={{ margin: 0, fontSize: '0.8rem', color: '#334155', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.55 }}>
              {JSON.stringify(lastResult.elementosUtilizados, null, 2)}
            </pre>
          </div>

          {/* Brechas de Investigación Abiertas */}
          {lastResult.brechasAbiertas && (
            <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', marginBottom: '4px' }}>
                ❓ Brechas de Información / Lo que Todavía no Conocemos:
              </div>
              <p style={{ color: '#92400E', fontSize: '0.88rem', lineHeight: 1.55, margin: 0 }}>
                {lastResult.brechasAbiertas}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
