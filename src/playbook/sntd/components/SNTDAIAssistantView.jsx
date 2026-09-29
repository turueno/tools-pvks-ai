// src/playbook/sntd/components/SNTDAIAssistantView.jsx
import React, { useState } from 'react';
import EpistemicBadge from '../../components/EpistemicBadge.jsx';
import {
  SNTD_AI_OPERATIONS,
  executeSNTDAIOperation
} from '../engine/sntdGroundedAIEngine.js';
import {
  SNTD_GATEWAYS_DEF,
  SNTD_INSIGHTS,
  SNTD_TENSIONS,
  SNTD_PLAZAS,
  SNTD_TOOLKIT_RULES
} from '../data/sntdDataset.js';

export default function SNTDAIAssistantView() {
  const [selectedActionId, setSelectedActionId] = useState('diagnosticar-gateway');
  const [params, setParams] = useState({
    gatewayId: 'G3',
    insightId: SNTD_INSIGHTS[0]?.id || 'ins-ontologico-1',
    tensionId: SNTD_TENSIONS[0]?.id || 'ten-1',
    plazaAId: 'cdmx',
    plazaBId: 'gdl',
    textoClaim: 'Salsa Negra Fuego Extremo con chile de árbol que te va a arder hasta el final',
    ocasionIndex: 0
  });

  const [lastResult, setLastResult] = useState(() => {
    return executeSNTDAIOperation('diagnosticar-gateway', { gatewayId: 'G3' });
  });

  const handleRunOperation = () => {
    const res = executeSNTDAIOperation(selectedActionId, params);
    setLastResult(res);
  };

  const currentAction = SNTD_AI_OPERATIONS.find(a => a.id === selectedActionId) || SNTD_AI_OPERATIONS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 10px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
            ASISTENTE ANALÍTICO CONTEXTUAL · 6 MOTORES
          </span>
          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
            100% Grounded en los Reportes Rector y Toolkit S.N.T.D.
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0, letterSpacing: '-0.02em' }}>
          Asistente IA Territorial (6 Operaciones Grounded)
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.94rem', margin: '8px 0 0 0', maxWidth: '850px', lineHeight: 1.55 }}>
          No es un chat genérico. Es un motor de operaciones cognitivas estructuradas que interrogan las fuentes del estudio territorial, auditando claims, evaluando el limón falso y generando briefs técnicos para Sabritas.
        </p>
      </div>

      {/* Grid de Operaciones y Controles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Selector de Operaciones */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>
            SELECCIONA LA OPERACIÓN ESTRATÉGICA:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {SNTD_AI_OPERATIONS.map(op => {
              const isSelected = op.id === selectedActionId;
              return (
                <button
                  key={op.id}
                  onClick={() => {
                    setSelectedActionId(op.id);
                    const res = executeSNTDAIOperation(op.id, params);
                    setLastResult(res);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: isSelected ? '1.5px solid #C25E00' : '1px solid #F1F5F9',
                    backgroundColor: isSelected ? '#FFF7ED' : '#F8FAFC',
                    color: isSelected ? '#C25E00' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {op.titulo}
                </button>
              );
            })}
          </div>

          {/* Parámetros dinámicos según operación */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155' }}>
              PARÁMETROS DE LA CONSULTA:
            </div>

            {currentAction.requiere.includes('gatewayId') && (
              <div>
                <label style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Seleccionar Gateway</label>
                <select
                  value={params.gatewayId}
                  onChange={e => setParams({ ...params, gatewayId: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                >
                  {SNTD_GATEWAYS_DEF.map(g => (
                    <option key={g.id} value={g.id}>{g.id}: {g.name}</option>
                  ))}
                </select>
              </div>
            )}

            {currentAction.requiere.includes('insightId') && (
              <div>
                <label style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Seleccionar Insight</label>
                <select
                  value={params.insightId}
                  onChange={e => setParams({ ...params, insightId: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                >
                  {SNTD_INSIGHTS.map(i => (
                    <option key={i.id} value={i.id}>{i.titulo.slice(0, 45)}...</option>
                  ))}
                </select>
              </div>
            )}

            {currentAction.requiere.includes('tensionId') && (
              <div>
                <label style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Seleccionar Tensión</label>
                <select
                  value={params.tensionId}
                  onChange={e => setParams({ ...params, tensionId: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                >
                  {SNTD_TENSIONS.map(t => (
                    <option key={t.id} value={t.id}>{t.tension}</option>
                  ))}
                </select>
              </div>
            )}

            {currentAction.requiere.includes('plazaAId') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#64748B' }}>Plaza A</label>
                  <select
                    value={params.plazaAId}
                    onChange={e => setParams({ ...params, plazaAId: e.target.value })}
                    style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.76rem' }}
                  >
                    {SNTD_PLAZAS.map(p => <option key={p.id} value={p.id}>{p.name.split(' ')[1]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#64748B' }}>Plaza B</label>
                  <select
                    value={params.plazaBId}
                    onChange={e => setParams({ ...params, plazaBId: e.target.value })}
                    style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.76rem' }}
                  >
                    {SNTD_PLAZAS.map(p => <option key={p.id} value={p.id}>{p.name.split(' ')[1]}</option>)}
                  </select>
                </div>
              </div>
            )}

            {currentAction.requiere.includes('textoClaim') && (
              <div>
                <label style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Texto o Claim a Auditar</label>
                <textarea
                  rows="3"
                  value={params.textoClaim}
                  onChange={e => setParams({ ...params, textoClaim: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                />
              </div>
            )}

            {currentAction.requiere.includes('ocasionIndex') && (
              <div>
                <label style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Ocasión Etnográfica</label>
                <select
                  value={params.ocasionIndex}
                  onChange={e => setParams({ ...params, ocasionIndex: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                >
                  {SNTD_TOOLKIT_RULES.ocasionesConsumo.map((o, idx) => (
                    <option key={idx} value={idx}>{o.ocasion}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleRunOperation}
              style={{
                marginTop: '6px',
                backgroundColor: '#C25E00',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '9px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              ⚡ Ejecutar Análisis Grounded
            </button>
          </div>
        </div>

        {/* Panel de Respuestas Grounded */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '2rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '8px', border: '1px solid #FFEDD5' }}>
                DICTAMEN TERRITORIAL GROUNDED
              </span>
              {lastResult.epistemic && <EpistemicBadge level={lastResult.epistemic} />}
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#191919', margin: '0 0 6px 0' }}>
              {lastResult.titulo}
            </h3>
            <div style={{ fontSize: '0.86rem', color: '#64748B', fontWeight: 600 }}>
              {lastResult.subtitulo}
            </div>
          </div>

          {/* Alertas críticas si aplican */}
          {lastResult.alertaCritica && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 16px', borderRadius: '10px', color: '#991B1B', fontSize: '0.84rem', fontWeight: 700 }}>
              {lastResult.alertaCritica}
            </div>
          )}

          {/* Atributos Obligatorios */}
          {lastResult.atributosObligatorios && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', marginBottom: '8px' }}>
                ATRIBUTOS OBLIGATORIOS DEL TOOLKIT:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {lastResult.atributosObligatorios.map((a, idx) => (
                  <div key={idx} style={{ fontSize: '0.84rem', color: '#1E293B', backgroundColor: '#F0FDF4', padding: '8px 12px', borderRadius: '8px' }}>
                    ✔️ {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Impactos de Negocio */}
          {lastResult.impactoNegocio && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', borderLeft: '4px solid #C25E00' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9A3412', marginBottom: '4px' }}>
                IMPACTO CONCRETO EN NEGOCIO / PORTAFOLIO:
              </div>
              <div style={{ fontSize: '0.88rem', color: '#1E293B', lineHeight: 1.55 }}>
                {lastResult.impactoNegocio}
              </div>
            </div>
          )}

          {/* Rutas de Conciliación de Tensiones */}
          {lastResult.rutaConciliacion && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00' }}>
                RUTA DE CONCILIACIÓN ESTRATÉGICA:
              </div>
              {lastResult.rutaConciliacion.map((r, idx) => (
                <div key={idx} style={{ fontSize: '0.84rem', color: '#334155', backgroundColor: '#FFFBEB', padding: '10px 12px', borderRadius: '8px', lineHeight: 1.5 }}>
                  {r}
                </div>
              ))}
            </div>
          )}

          {/* Comparativa de Plazas */}
          {lastResult.plaza1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#191919' }}>{lastResult.plaza1.nombre}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', margin: '4px 0 8px 0' }}>{lastResult.plaza1.enfoque}</div>
                <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#334155' }}>{lastResult.plaza1.cita}</div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#191919' }}>{lastResult.plaza2.nombre}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', margin: '4px 0 8px 0' }}>{lastResult.plaza2.enfoque}</div>
                <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#334155' }}>{lastResult.plaza2.cita}</div>
              </div>
            </div>
          )}

          {/* Auditoría de Copywriting */}
          {lastResult.terminosProhibidos && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ backgroundColor: lastResult.estado === 'APROBADO' ? '#F0FDF4' : '#FEF2F2', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: lastResult.estado === 'APROBADO' ? '#166534' : '#991B1B' }}>
                  {lastResult.dictamen}
                </div>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#1E293B', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px' }}>
                <strong>Recomendación:</strong> {lastResult.recomendacionReescritura}
              </div>
            </div>
          )}

          {/* Recomendación de I+D */}
          {lastResult.atributosI_D && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', marginBottom: '6px' }}>
                ATRIBUTOS RECOMENDADOS PARA I+D & MARKETING:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                {lastResult.atributosI_D.map((at, idx) => <li key={idx}>{at}</li>)}
              </ul>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
