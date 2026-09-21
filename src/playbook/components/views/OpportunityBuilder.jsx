// src/playbook/components/views/OpportunityBuilder.jsx
import React, { useState } from 'react';
import EpistemicBadge from '../EpistemicBadge.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';

export default function OpportunityBuilder({ incomingOppDraft, onClearIncomingOppDraft, onSimulateContext }) {
  const { opportunities: opportunityList, saveEntity } = usePlaybookData();
  const [selectedOppId, setSelectedOppId] = useState(opportunityList[0]?.id || 'opp-01');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [newOpp, setNewOpp] = useState({
    titulo: '',
    hallazgo: '',
    problema: '',
    friccion: '',
    condicionPreservar: '',
    oportunidad: '',
    hipotesisSolucion: '',
    marcas: ['Gerber']
  });

  // Pre-cargar si viene una oportunidad derivada del simulador
  React.useEffect(() => {
    if (incomingOppDraft) {
      setNewOpp({
        titulo: incomingOppDraft.titulo || '',
        hallazgo: incomingOppDraft.hallazgo || incomingOppDraft.fundamento || '',
        problema: incomingOppDraft.problema || '',
        friccion: incomingOppDraft.friccion || '',
        condicionPreservar: incomingOppDraft.condicionPreservar || '',
        oportunidad: incomingOppDraft.oportunidad || incomingOppDraft.titulo || '',
        hipotesisSolucion: incomingOppDraft.hipotesisSolucion || '',
        marcas: incomingOppDraft.marcas || ['Gerber']
      });
      setIsCreatingNew(true);
    }
  }, [incomingOppDraft]);

  const activeOpp = opportunityList.find(o => o.id === selectedOppId) || opportunityList[0] || {};

  const handleSaveNewOpp = (e) => {
    e.preventDefault();
    if (!newOpp.titulo || !newOpp.oportunidad) return;

    const created = {
      ...newOpp,
      id: `opp-custom-${Date.now()}`,
      nivel: 'HIPOTESIS',
      fuente: 'Generado en Opportunity Builder'
    };

    saveEntity('opportunities', created);
    setSelectedOppId(created.id);
    setIsCreatingNew(false);
    setNewOpp({
      titulo: '',
      hallazgo: '',
      problema: '',
      friccion: '',
      condicionPreservar: '',
      oportunidad: '',
      hipotesisSolucion: '',
      marcas: ['Gerber']
    });
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Compacto con Tooltip */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', backgroundColor: '#D1FAE5', padding: '3px 8px', borderRadius: '12px' }}>
                <EditableText dictKey="playbook.opportunities.tag" defaultText="FRAMEWORK DE INNOVACIÓN ESTRATÉGICA" />
              </span>
              <EpistemicBadge level="HIPOTESIS" size="small" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
                <EditableText dictKey="playbook.opportunities.title" defaultText="Opportunity Builder (De Insight a Solución)" />
              </h1>
              <InfoTooltip
                title="Cadena de Innovación Rigurosa"
                content="Transforma observaciones etnográficas en proposiciones de valor concretas mediante la secuencia: Hallazgo → Problema → Trabajo/Fricción → Condición a Preservar → Oportunidad → Hipótesis de Solución."
                position="right"
                maxWidth={360}
              />
            </div>
          </div>

          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="primary-button"
            style={{ fontSize: '0.84rem', padding: '8px 16px' }}
          >
            {isCreatingNew ? 'Ver Oportunidades Existentes' : <EditableText dictKey="playbook.opportunities.btn.create" defaultText="+ Crear Nueva Oportunidad" />}
          </button>
        </div>
      </div>

      {isCreatingNew ? (
        /* WIZARD DE CREACIÓN GUIADA */
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00B487' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#191919', margin: 0 }}>
              Componer Nueva Oportunidad Estructurada
            </h2>
          </div>

          {incomingOppDraft && (
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                borderRadius: '10px',
                padding: '0.8rem 1.1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ fontSize: '0.82rem', color: '#065F46' }}>
                ✨ <strong>Campos precargados automáticamente</strong> a partir de la simulación en <em>Scenario Lab</em>. Puedes afinar cada paso antes de guardar.
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onClearIncomingOppDraft) onClearIncomingOppDraft();
                  setNewOpp({
                    titulo: '',
                    hallazgo: '',
                    problema: '',
                    friccion: '',
                    condicionPreservar: '',
                    oportunidad: '',
                    hipotesisSolucion: '',
                    marcas: ['Gerber']
                  });
                }}
                style={{ background: 'none', border: 'none', color: '#047857', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
              >
                Limpiar
              </button>
            </div>
          )}

          <form onSubmit={handleSaveNewOpp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label>Título del Territorio de Oportunidad</label>
              <input
                type="text"
                required
                placeholder="Ej. Formatos pouch térmicos para puestos de tianguis"
                value={newOpp.titulo}
                onChange={(e) => setNewOpp({ ...newOpp, titulo: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ color: '#0369A1' }}>1. Hallazgo (Observación de Campo)</label>
                <textarea
                  rows="3"
                  placeholder="Qué conducta o necesidad se presenció en el reporte..."
                  value={newOpp.hallazgo}
                  onChange={(e) => setNewOpp({ ...newOpp, hallazgo: e.target.value })}
                />
              </div>
              <div>
                <label style={{ color: '#DC2626' }}>2. Problema Concreto</label>
                <textarea
                  rows="3"
                  placeholder="Cuál es el conflicto real o cuello de botella..."
                  value={newOpp.problema}
                  onChange={(e) => setNewOpp({ ...newOpp, problema: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ color: '#B45309' }}>3. Trabajo / Fricción Incomoda</label>
                <textarea
                  rows="3"
                  placeholder="Qué esfuerzo repetitivo o doloroso recae en mamá..."
                  value={newOpp.friccion}
                  onChange={(e) => setNewOpp({ ...newOpp, friccion: e.target.value })}
                />
              </div>
              <div>
                <label style={{ color: '#047857' }}>4. Condición que DEBE Preservarse</label>
                <textarea
                  rows="3"
                  placeholder="Qué atributo innegociable no puede degradarse (cero azúcar, afecto)..."
                  value={newOpp.condicionPreservar}
                  onChange={(e) => setNewOpp({ ...newOpp, condicionPreservar: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ color: '#047857' }}>5. Oportunidad de Innovación</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Concepto de producto, formato o servicio..."
                  value={newOpp.oportunidad}
                  onChange={(e) => setNewOpp({ ...newOpp, oportunidad: e.target.value })}
                />
              </div>
              <div>
                <label style={{ color: '#4338CA' }}>6. Hipótesis de Solución Falsable</label>
                <textarea
                  rows="3"
                  placeholder="Si [marca] ofrece [X], entonces el consumidor [Y] porque [Z]..."
                  value={newOpp.hipotesisSolucion}
                  onChange={(e) => setNewOpp({ ...newOpp, hipotesisSolucion: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="secondary-button"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="primary-button"
              >
                Guardar e Incorporar al Playbook
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* VISTA DE OPORTUNIDADES EXISTENTES */
        <div>
          {/* Selector de Oportunidad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginBottom: '2rem' }}>
            {opportunityList.map(opp => {
              const isSelected = selectedOppId === opp.id;
              return (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOppId(opp.id)}
                  style={{
                    backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                    border: isSelected ? '2px solid #00B487' : '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                  className="card-hover-fx"
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: isSelected ? '#047857' : '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {opp.fuente || 'Oportunidad Estratégica'}
                  </div>
                  <div style={{ fontWeight: 800, color: '#191919', fontSize: '0.96rem' }}>
                    {opp.titulo}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed 6-Step Pipeline Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B487', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Pipeline de Construcción
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#191919', margin: '4px 0 0 0' }}>
                  {activeOpp.titulo}
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <EpistemicBadge level={activeOpp.nivel} />
                {onSimulateContext && (
                  <button
                    onClick={() => onSimulateContext(activeOpp)}
                    className="primary-button"
                    style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    ⚡ Simular Contexto en Scenario Lab
                  </button>
                )}
              </div>
            </div>

            {/* 6 Sequential Stages Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {/* 1. Hallazgo */}
              <div style={{ backgroundColor: '#F0F9FF', border: '1.5px solid #BAE6FD', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', marginBottom: '6px' }}>
                  01 · Hallazgo Etnográfico
                </div>
                <p style={{ color: '#0C4A6E', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                  {activeOpp.hallazgo}
                </p>
              </div>

              {/* 2. Problema */}
              <div style={{ backgroundColor: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', marginBottom: '6px' }}>
                  02 · Problema Concreto
                </div>
                <p style={{ color: '#7F1D1D', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                  {activeOpp.problema}
                </p>
              </div>

              {/* 3. Trabajo / Fricción */}
              <div style={{ backgroundColor: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', marginBottom: '6px' }}>
                  03 · Trabajo / Fricción en Mamá
                </div>
                <p style={{ color: '#78350F', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                  {activeOpp.friccion}
                </p>
              </div>

              {/* 4. Condición a Preservar */}
              <div style={{ backgroundColor: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: '6px' }}>
                  04 · Condición Innegociable
                </div>
                <p style={{ color: '#064E3B', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                  {activeOpp.condicionPreservar}
                </p>
              </div>
            </div>

            {/* 5. Oportunidad & 6. Hipótesis */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#ECFDF5', border: '2px solid #00B487', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 900, color: '#047857', textTransform: 'uppercase', marginBottom: '8px' }}>
                  05 · Territorio de Oportunidad
                </div>
                <p style={{ color: '#064E3B', fontSize: '1rem', fontWeight: 700, lineHeight: 1.5, margin: 0 }}>
                  {activeOpp.oportunidad}
                </p>
              </div>

              <div style={{ backgroundColor: '#EEF2FF', border: '2px solid #775AFF', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 900, color: '#4338CA', textTransform: 'uppercase', marginBottom: '8px' }}>
                  06 · Hipótesis de Solución Falsable
                </div>
                <p style={{ color: '#312E81', fontSize: '0.94rem', lineHeight: 1.55, margin: 0 }}>
                  {activeOpp.hipotesisSolucion}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
