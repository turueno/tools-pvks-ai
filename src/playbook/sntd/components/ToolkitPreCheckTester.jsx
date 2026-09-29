// src/playbook/sntd/components/ToolkitPreCheckTester.jsx
import React, { useState, useMemo } from 'react';
import {
  TOOLKIT_CRITERIA,
  evaluateToolkitCompliance
} from '../engine/toolkitComplianceEngine.js';

export default function ToolkitPreCheckTester({ onSendToOpportunityBuilder, onInjectToSensoryForm }) {
  // Estado inicial: todos los criterios en "QUÉ SÍ ES" (true)
  const [switchesState, setSwitchesState] = useState(() => {
    const initial = {};
    TOOLKIT_CRITERIA.forEach(c => {
      initial[c.id] = true;
    });
    return initial;
  });

  const [prototipoNombre, setPrototipoNombre] = useState('Prototipo de Laboratorio Sabritas');

  // Evaluación en tiempo real
  const evaluation = useMemo(() => {
    return evaluateToolkitCompliance(switchesState);
  }, [switchesState]);

  const handleToggle = (id) => {
    setSwitchesState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePresetPrototipo = (tipo) => {
    if (tipo === 'ideal') {
      const state = {};
      TOOLKIT_CRITERIA.forEach(c => { state[c.id] = true; });
      setSwitchesState(state);
      setPrototipoNombre('Prototipo Ideal: Sabritas Receta Crujiente Salsas Negras');
    } else if (tipo === 'limon_falso') {
      const state = {};
      TOOLKIT_CRITERIA.forEach(c => { state[c.id] = true; });
      state['D3_ACIDEZ'] = false; // Falla limon
      setSwitchesState(state);
      setPrototipoNombre('Prototipo Alerta: Snack con Ácido Cítrico Sintético');
    } else if (tipo === 'flamin_hot') {
      const state = {};
      TOOLKIT_CRITERIA.forEach(c => { state[c.id] = true; });
      state['D1_IDENTIDAD'] = false; // Dark
      state['D2_ARQUITECTURA'] = false; // Golpe plano
      state['D5_INTENSIDAD'] = false; // Dolor punitivo
      state['D7_SEMIOTICA'] = false; // Empaque calaveras/fuego
      setSwitchesState(state);
      setPrototipoNombre('Prototipo Desviado: Snack Oscuro Estilo Flamin Hot');
    }
  };

  const handleExportToOpp = () => {
    if (onSendToOpportunityBuilder) {
      onSendToOpportunityBuilder({
        titulo: `Reformulación: ${prototipoNombre}`,
        gatewayId: evaluation.infracciones[0]?.gatewayId || 'G3',
        hallazgo: `El prototipo obtuvo ${evaluation.score}% de apego al Toolkit con ${evaluation.infracciones.length} infracciones a la plataforma.`,
        problema: evaluation.infracciones.map(i => i.nombre + ': ' + i.noEs).join(' | '),
        oportunidad: `Corregir formulación para cumplir con las reglas canónicas del Toolkit (Score Meta: 100%).`,
        hipotesisSolucion: `Sustituir ingredientes penalizados por: ${evaluation.infracciones.map(i => i.siEs).join('; ')}.`
      });
    }
  };

  let semaforoBg = '#DCFCE7';
  let semaforoColor = '#166534';
  let semaforoBorder = '#86EFAC';
  if (evaluation.semaforo === 'AMARILLO') {
    semaforoBg = '#FEF3C7';
    semaforoColor = '#92400E';
    semaforoBorder = '#FCD34D';
  } else if (evaluation.semaforo === 'ROJO' || evaluation.semaforo === 'ROJO_CRITICO') {
    semaforoBg = '#FEE2E2';
    semaforoColor = '#991B1B';
    semaforoBorder = '#FCA5A5';
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header del Pre-Check */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#C25E00', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px' }}>
              HERRAMIENTA INTERACTIVA DEL TOOLKIT
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
              Pre-Check "Qué SÍ / Qué NO" · Filtro Rápido de Viabilidad
            </span>
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#191919', margin: '0 0 6px 0' }}>
            Auditor de Viabilidad de Prototipo
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.86rem', margin: 0 }}>
            Activa o desactiva las 7 dimensiones del Toolkit. Evalúa en tiempo real si tu prototipo califica como Salsa Negra legítima o si viola atributos innegociables.
          </p>
        </div>

        {/* Presets Rápidos de Testeo */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handlePresetPrototipo('ideal')}
            style={{ padding: '6px 10px', fontSize: '0.74rem', fontWeight: 700, borderRadius: '8px', border: '1px solid #A7F3D0', backgroundColor: '#ECFDF5', color: '#065F46', cursor: 'pointer' }}
          >
            ✔️ Prototipo Ideal
          </button>
          <button
            onClick={() => handlePresetPrototipo('limon_falso')}
            style={{ padding: '6px 10px', fontSize: '0.74rem', fontWeight: 700, borderRadius: '8px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', color: '#991B1B', cursor: 'pointer' }}
          >
            ⚠️ Caso Limón Falso
          </button>
          <button
            onClick={() => handlePresetPrototipo('flamin_hot')}
            style={{ padding: '6px 10px', fontSize: '0.74rem', fontWeight: 700, borderRadius: '8px', border: '1px solid #FED7AA', backgroundColor: '#FFF7ED', color: '#9A3412', cursor: 'pointer' }}
          >
            ❌ Caso Flamin Hot
          </button>
        </div>
      </div>

      {/* DASHBOARD DE RESULTADOS INSTANTÁNEO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        
        {/* Score Card */}
        <div style={{ backgroundColor: semaforoBg, border: `1.5px solid ${semaforoBorder}`, borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: semaforoColor }}>ÍNDICE DE APEGO AL TOOLKIT</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: semaforoColor, margin: '2px 0' }}>
            {evaluation.score}%
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: semaforoColor }}>
            ESTADO: {evaluation.estado}
          </div>
        </div>

        {/* Dictamen Resumen */}
        <div style={{ gridColumn: 'span 2', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>
              DICTAMEN DE PLATAFORMA EN TIEMPO REAL:
            </div>
            <div style={{ fontSize: '0.92rem', color: '#1E293B', lineHeight: 1.5, fontWeight: 600 }}>
              {evaluation.dictamenResumen}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
              Dimensiones Aprobadas: <strong>{evaluation.aprobadosCount} de {evaluation.totalCriterios}</strong>
            </span>
            {evaluation.infracciones.length > 0 && onSendToOpportunityBuilder && (
              <button
                onClick={handleExportToOpp}
                style={{
                  backgroundColor: '#C25E00',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Derivar Oportunidad de Reformulación →
              </button>
            )}
          </div>
        </div>

      </div>

      {/* LISTADO INTERACTIVO DE LAS 7 DIMENSIONES CON TOGGLES */}
      <div>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', marginBottom: '10px' }}>
          VERIFICADOR DE ATRIBUTOS (HAZ CLIC EN CADA DIMENSIÓN PARA AUDITAR):
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {TOOLKIT_CRITERIA.map(crit => {
            const cumple = switchesState[crit.id];
            return (
              <div
                key={crit.id}
                onClick={() => handleToggle(crit.id)}
                style={{
                  backgroundColor: cumple ? '#F0FDF4' : '#FEF2F2',
                  border: cumple ? '1px solid #BBF7D0' : '1px solid #FECACA',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                  <span style={{ fontSize: '1.4rem', marginTop: '2px' }}>
                    {cumple ? '✅' : '❌'}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: cumple ? '#166534' : '#991B1B', backgroundColor: cumple ? '#DCFCE7' : '#FEE2E2', padding: '1px 6px', borderRadius: '6px' }}>
                        {crit.gatewayId}
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: cumple ? '#166534' : '#991B1B' }}>
                        {crit.nombre}
                      </strong>
                      {crit.isCritical && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#EF4444', color: '#FFFFFF', padding: '1px 6px', borderRadius: '6px' }}>
                          INNEGOCIABLE
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.4 }}>
                      {cumple ? `✔️ ${crit.siEs}` : `❌ INFRACCIÓN: ${crit.noEs}`}
                    </p>
                  </div>
                </div>

                {/* Switch visual */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: cumple ? '#166534' : '#991B1B' }}>
                    {cumple ? 'QUÉ SÍ' : 'QUÉ NO'}
                  </span>
                  <div style={{ width: '38px', height: '20px', backgroundColor: cumple ? '#10B981' : '#EF4444', borderRadius: '10px', position: 'relative', transition: 'all 0.2s' }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#FFFFFF', borderRadius: '50%', position: 'absolute', top: '2px', left: cumple ? '20px' : '2px', transition: 'all 0.2s' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
