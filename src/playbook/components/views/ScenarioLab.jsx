// src/playbook/components/views/ScenarioLab.jsx
import React, { useState, useMemo, useEffect } from 'react';
import EpistemicBadge from '../EpistemicBadge.jsx';
import { Icon } from '../shared/Icons.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';
import { SCENARIO_DIMENSIONS, DEFAULT_SCENARIO_STATE } from '../../data/scenarioDimensions.js';
import { SCENARIO_PRESETS } from '../../data/presets.js';
import { evaluateScenario } from '../../engine/scenarioEngine.js';

export default function ScenarioLab({ incomingScenario, onClearIncomingScenario, onBuildOpportunity }) {
  const [scenarioState, setScenarioState] = useState(DEFAULT_SCENARIO_STATE);
  const [activePresetId, setActivePresetId] = useState(null);
  const [sourceBanner, setSourceBanner] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState(() => {
    try {
      const stored = localStorage.getItem('pvks_saved_scenarios');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');

  // Sincronizar si entra un escenario puente desde System Maps, Insights o Tensiones
  useEffect(() => {
    if (incomingScenario && incomingScenario.state) {
      setScenarioState(incomingScenario.state);
      setActivePresetId(null);
      const incomingLabel = incomingScenario.label || 'Escenario Derivado';
      setSourceBanner({
        label: incomingLabel,
        origin: incomingScenario.origin || 'Entidad Etnográfica'
      });
      // Pre-cargar el nombre en la caja de guardar
      setSaveTitle(incomingLabel);
      setIsSaving(true);
    }
  }, [incomingScenario]);

  const handleOptionChange = (factorId, value) => {
    setActivePresetId(null);
    setScenarioState(prev => ({ ...prev, [factorId]: value }));
  };

  const applyPreset = (preset) => {
    setActivePresetId(preset.id);
    setScenarioState(preset.dimensiones);
    setSourceBanner({
      label: preset.nombre,
      origin: preset.contextoReporte
    });
  };

  const resetDefaults = () => {
    setActivePresetId(null);
    setScenarioState(DEFAULT_SCENARIO_STATE);
    setSourceBanner(null);
    if (onClearIncomingScenario) onClearIncomingScenario();
  };

  const results = useMemo(() => {
    return evaluateScenario(scenarioState);
  }, [scenarioState]);

  const handleSaveScenario = () => {
    if (!saveTitle.trim()) return;
    const newEntry = {
      id: `saved-${Date.now()}`,
      title: saveTitle.trim(),
      date: new Date().toLocaleDateString('es-MX'),
      state: scenarioState,
      topSolucion: Object.values(results.relevanciaSoluciones).sort((a, b) => b.score - a.score)[0]?.nombre
    };
    const updated = [newEntry, ...savedScenarios];
    setSavedScenarios(updated);
    try {
      localStorage.setItem('pvks_saved_scenarios', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSaveTitle('');
    setIsSaving(false);
  };

  const handleDeleteSaved = (id) => {
    const updated = savedScenarios.filter(s => s.id !== id);
    setSavedScenarios(updated);
    try {
      localStorage.setItem('pvks_saved_scenarios', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Compacto con Tooltip */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', backgroundColor: '#D1FAE5', padding: '3px 8px', borderRadius: '12px' }}>
            <EditableText dictKey="playbook.scenario.tag" defaultText="SIMULADOR CUALITATIVO DE DEMANDA" />
          </span>
          <EpistemicBadge level="HIPOTESIS" size="small" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
            <EditableText dictKey="playbook.scenario.title" defaultText="Scenario Lab: Laboratorio de Escenarios" />
          </h1>
          <InfoTooltip
            title="Simulación Contextual Basada en 4 Dimensiones"
            content="Modifica las condiciones reales del hogar (Situación Material, Etapa del Bebé, Autoridad Externa y Marco Moral) para observar cómo se reconfigura la tracción de marcas y qué tensiones latentes se activan."
            position="right"
            maxWidth={380}
          />
        </div>
      </div>

      {/* Banner de Puente Activo (Si se abrió desde System Maps, Insights o Tensiones) */}
      {sourceBanner && (
        <div
          style={{
            backgroundColor: '#EFF6FF',
            border: '1.5px solid #BFDBFE',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.1rem' }}>🔗</span>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#1D4ED8', fontWeight: 800, textTransform: 'uppercase' }}>
                Escenario Precargado desde: {sourceBanner.origin}
              </div>
              <div style={{ fontSize: '0.92rem', color: '#1E3A8A', fontWeight: 700 }}>
                {sourceBanner.label}
              </div>
            </div>
          </div>
          <button
            onClick={resetDefaults}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#64748B',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ✕ Limpiar Puente
          </button>
        </div>
      )}

      {/* Presets Bar */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          Casos Etnográficos Típicos del Reporte:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {SCENARIO_PRESETS.map(p => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                style={{
                  backgroundColor: isSelected ? '#FFF7ED' : '#FFFFFF',
                  border: isSelected ? '2px solid #F6911E' : '1px solid #CBD5E1',
                  color: isSelected ? '#C25E00' : '#191919',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <span>⚡</span> {p.nombre}
              </button>
            );
          })}
          <button
            onClick={resetDefaults}
            className="secondary-button"
            style={{ padding: '7px 12px', fontSize: '0.82rem' }}
          >
            ↺ Restablecer Estados
          </button>
        </div>
      </div>

      {/* Main Simulation Layout: 4 Dimensiones a la Izquierda, Diagnóstico a la Derecha */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(380px, 1.1fr) minmax(360px, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* PANEL DE LAS 4 DIMENSIONES CUALITATIVAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {SCENARIO_DIMENSIONS.map(dim => (
            <div
              key={dim.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '1.25rem 1.4rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              {/* Cabecera de Dimensión */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: dim.color, display: 'flex', alignItems: 'center' }}>
                  <Icon name={dim.icon} size={17} color={dim.color} />
                </span>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#191919', margin: 0 }}>
                  {dim.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1rem 0' }}>
                {dim.description}
              </p>

              {/* Factores de la Dimensión */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {dim.factors.map(factor => (
                  <div key={factor.id}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      {factor.label}:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${factor.options.length}, 1fr)`, gap: '6px' }}>
                      {factor.options.map(opt => {
                        const isChosen = scenarioState[factor.id] === opt.value;
                        return (
                          <div
                            key={opt.value}
                            onClick={() => handleOptionChange(factor.id, opt.value)}
                            style={{
                              backgroundColor: isChosen ? `${dim.color}12` : '#F8FAFC',
                              border: isChosen ? `2px solid ${dim.color}` : '1px solid #E2E8F0',
                              borderRadius: '8px',
                              padding: '8px 10px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ fontSize: '0.8rem', fontWeight: isChosen ? 800 : 600, color: isChosen ? dim.color : '#1E293B', marginBottom: '4px' }}>
                              {isChosen && '✓ '} {opt.label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748B', lineHeight: 1.3 }}>
                              {opt.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Guardar Simulación en el Playbook */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '1.25rem 1.4rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#191919' }}>
                💾 Guardar Configuración en el Playbook
              </div>
              {!isSaving && (
                <button
                  onClick={() => setIsSaving(true)}
                  className="secondary-button"
                  style={{ fontSize: '0.76rem', padding: '5px 10px' }}
                >
                  + Nuevo Caso
                </button>
              )}
            </div>

            {isSaving && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input
                  type="text"
                  placeholder="Nombre del caso (ej. Madre primeriza en quincena)..."
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  style={{ flex: 1, padding: '7px 10px', fontSize: '0.82rem', borderRadius: '6px', border: '1px solid #CBD5E1', marginBottom: 0 }}
                />
                <button
                  onClick={handleSaveScenario}
                  className="primary-button"
                  style={{ fontSize: '0.8rem', padding: '7px 12px' }}
                >
                  Guardar
                </button>
                <button
                  onClick={() => setIsSaving(false)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Cancelar
                </button>
              </div>
            )}

            {savedScenarios.length > 0 && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Casos Guardados del Proyecto ({savedScenarios.length}):
                </div>
                {savedScenarios.map(s => (
                  <div
                    key={s.id}
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#191919' }}>{s.title}</strong>
                      <span style={{ color: '#64748B', fontSize: '0.72rem', marginLeft: '6px' }}>({s.date})</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setScenarioState(s.state);
                          setSourceBanner({ label: s.title, origin: 'Caso Guardado del Proyecto' });
                        }}
                        style={{ backgroundColor: '#EEF2FF', color: '#4338CA', border: 'none', borderRadius: '4px', padding: '3px 7px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Cargar
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(s.id)}
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PANEL DE DERIVACIONES DINÁMICAS (DIAGNÓSTICO) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* 1. RELEVANCIA DE SOLUCIONES Y MARCAS */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#191919', margin: 0 }}>
                  Relevancia Relativa de Marcas y Soluciones
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Tracción cualitativa deducida de la matriz de 4 dimensiones</span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#047857', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '10px' }}>
                ACTIVO
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(results.relevanciaSoluciones).map(([key, sol]) => {
                const isHigh = sol.score >= 60;
                const isWarning = sol.score < 45;
                const barColor = isHigh ? '#00B487' : isWarning ? '#F23F3B' : '#F6911E';

                return (
                  <div key={key} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 14px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#191919', fontSize: '0.92rem' }}>
                        {sol.nombre}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: barColor, fontWeight: 800, textTransform: 'uppercase' }}>
                          {sol.tendencia.replace('-', ' ')}
                        </span>
                        <span style={{ fontWeight: 900, color: barColor, fontSize: '1.05rem' }}>
                          {sol.score}
                        </span>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                      <div style={{ width: `${sol.score}%`, height: '100%', backgroundColor: barColor, transition: 'width 0.3s ease' }} />
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                      {sol.diagnostico}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. NECESIDADES QUE AUMENTAN O DISMINUYEN */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Aumentan */}
            <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: '8px' }}>
                ▲ Necesidades que Aumentan
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.necesidadesAumentan.map((n, i) => (
                  <div key={i} style={{ fontSize: '0.82rem', color: '#064E3B', lineHeight: 1.4 }}>
                    • <strong>{n.texto}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#047857', marginTop: '2px' }}>{n.razon}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disminuyen */}
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', marginBottom: '8px' }}>
                ▼ Necesidades que Disminuyen
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.necesidadesDisminuyen.map((n, i) => (
                  <div key={i} style={{ fontSize: '0.82rem', color: '#7F1D1D', lineHeight: 1.4 }}>
                    • <strong>{n.texto}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#991B1B', marginTop: '2px' }}>{n.razon}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. TENSIONES QUE APARECEN O SE INTENSIFICAN */}
          {results.tensionesEmergentes.length > 0 && (
            <div style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E53E3E', textTransform: 'uppercase', marginBottom: '8px' }}>
                ⚡ Tensiones Latentes Activadas
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.tensionesEmergentes.map((t, i) => (
                  <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1px solid #FEB2B2', padding: '10px 14px', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, color: '#C53030', fontSize: '0.88rem' }}>{t.titulo}</span>
                      <span style={{ fontSize: '0.7rem', backgroundColor: '#E53E3E', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>{t.intensidad}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#4A5568', lineHeight: 1.4 }}>{t.descripcion}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. IMPLICACIONES Y OPORTUNIDADES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', marginBottom: '8px' }}>
                🎯 Implicaciones para la Marca
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.implicacionesMarca.map((imp, i) => (
                  <div key={i} style={{ fontSize: '0.82rem', color: '#0C4A6E' }}>
                    <strong style={{ color: '#0284c7' }}>[{imp.marca}] {imp.alerta}:</strong> {imp.detalle}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: '8px' }}>
                ✨ Oportunidades Plausibles Deducidas
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {results.oportunidadesPlausibles.map((opp, i) => (
                  <div
                    key={opp.id || i}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #A7F3D0',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ fontSize: '0.86rem', color: '#064E3B', fontWeight: 800 }}>
                      • {opp.titulo}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#047857', lineHeight: 1.4 }}>
                      {opp.fundamento}
                    </div>
                    {onBuildOpportunity && (
                      <button
                        onClick={() => onBuildOpportunity(opp, scenarioState)}
                        style={{
                          backgroundColor: '#047857',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          alignSelf: 'flex-start',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          marginTop: '2px'
                        }}
                      >
                        🛠️ Desarrollar en Opportunity Builder →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
