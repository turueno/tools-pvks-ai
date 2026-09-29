// src/playbook/sntd/components/SNTDOpportunityBuilder.jsx
import React, { useState, useMemo } from 'react';
import EpistemicBadge from '../../components/EpistemicBadge.jsx';
import { SNTD_GATEWAYS_DEF, SNTD_TOOLKIT_RULES } from '../data/sntdDataset.js';
import { auditConceptText } from '../engine/toolkitComplianceEngine.js';

export const INITIAL_SNTD_OPPORTUNITIES = [
  {
    id: 'sntd-opp-01',
    titulo: 'Sabritas Salsas Negras "Cantina Edition" (Corte Grueso Bañado)',
    gatewayId: 'G4',
    hallazgo: 'La botana tradicional delgada colapsa con el remojo de salsa; el consumidor busca el crunch de cantina.',
    problema: 'Las papas convencionales pierden crocancia o se perciben como polvo seco que no simula la salsa líquida.',
    friccion: 'La contradicción entre querer la papa bañada y la fragilidad del soporte de papa delgada.',
    condicionPreservar: 'El calibre grueso de la papa que permita retener el sazón sin ablandarse.',
    oportunidad: 'Lanzar corte artesanal grueso con baño líquido 360° y notas de soya fermentada, tatemado y limón natural.',
    hipotesisSolucion: 'Tecnología de aspersión líquida con adición de limón deshidratado real en presentación familiar de 180g.',
    marcas: ['Sabritas Receta Crujiente'],
    nivel: 'HIPOTESIS'
  },
  {
    id: 'sntd-opp-02',
    titulo: 'Fritos Salsas Negras "Asador Botanero" (Maíz & Brasas)',
    gatewayId: 'G5',
    hallazgo: 'En Monterrey y Norte, la salsa negra es el acompañamiento predilecto de la carne asada para cortar grasa.',
    problema: 'Los snacks actuales se saturan de salmuera o emulan picor tipo Flamin Hot, cansando el paladar rápidamente.',
    friccion: 'Confundir el fuego de la cocina con el castigo físico de chile que anestesia la boca.',
    condicionPreservar: 'La base de maíz nixtamalizado que aporta dulzor natural frente a la salinidad umami.',
    oportunidad: 'Posicionar Fritos Salsas Negras como la botana oficial de la carne asada con notas ahumadas a leña.',
    hipotesisSolucion: 'Fórmula con notas de comal, ajo asado y acidez cítrica refrescante que prolongue el antojo.',
    marcas: ['Fritos'],
    nivel: 'HIPOTESIS'
  },
  {
    id: 'sntd-opp-03',
    titulo: 'Kit Botanero "Ready to Mix" con Gotas de Limón Real Deshidratado',
    gatewayId: 'G3',
    hallazgo: 'El "Síndrome del Limón Falso" destruye la recompra si se usa ácido cítrico químico.',
    problema: 'En la calle y oficina el consumidor no tiene un limón fresco para exprimir sobre su botana.',
    friccion: 'La desconfianza ante los limones industriales pre-envasados.',
    condicionPreservar: 'La frescura del limón natural recién exprimido.',
    oportunidad: 'Incorporar microencapsulación de jugo de limón mexicano con aceites de cáscara para liberar frescura al contacto con la saliva.',
    hipotesisSolucion: 'Garantizar el sello "Con Limón Natural Mexicano" en el front del empaque para derribar la barrera de adopción.',
    marcas: ['Sabritas', 'Rancheritos'],
    nivel: 'HIPOTESIS'
  }
];

export default function SNTDOpportunityBuilder() {
  const [opportunities, setOpportunities] = useState(() => {
    try {
      const stored = localStorage.getItem('pvks_sntd_opportunities_v1');
      return stored ? JSON.parse(stored) : INITIAL_SNTD_OPPORTUNITIES;
    } catch {
      return INITIAL_SNTD_OPPORTUNITIES;
    }
  });

  const [selectedOppId, setSelectedOppId] = useState(opportunities[0]?.id || 'sntd-opp-01');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [newOpp, setNewOpp] = useState({
    titulo: '',
    gatewayId: 'G1',
    hallazgo: '',
    problema: '',
    friccion: '',
    condicionPreservar: '',
    oportunidad: '',
    hipotesisSolucion: '',
    marcas: ['Sabritas Receta Crujiente']
  });

  const activeOpp = opportunities.find(o => o.id === selectedOppId) || opportunities[0] || {};

  // Auditoría en vivo de la oportunidad seleccionada o en edición
  const conceptAudit = useMemo(() => {
    const textToAudit = isCreatingNew
      ? `${newOpp.titulo} ${newOpp.oportunidad} ${newOpp.hipotesisSolucion}`
      : `${activeOpp.titulo} ${activeOpp.oportunidad} ${activeOpp.hipotesisSolucion}`;
    return auditConceptText(textToAudit);
  }, [isCreatingNew, newOpp, activeOpp]);

  const handleSaveNewOpp = (e) => {
    e.preventDefault();
    if (!newOpp.titulo || !newOpp.oportunidad) return;

    const created = {
      ...newOpp,
      id: `sntd-opp-${Date.now()}`,
      nivel: 'HIPOTESIS'
    };

    const updated = [created, ...opportunities];
    setOpportunities(updated);
    try {
      localStorage.setItem('pvks_sntd_opportunities_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSelectedOppId(created.id);
    setIsCreatingNew(false);
    setNewOpp({
      titulo: '',
      gatewayId: 'G1',
      hallazgo: '',
      problema: '',
      friccion: '',
      condicionPreservar: '',
      oportunidad: '',
      hipotesisSolucion: '',
      marcas: ['Sabritas Receta Crujiente']
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', backgroundColor: '#D1FAE5', padding: '3px 8px', borderRadius: '12px' }}>
              FRAMEWORK DE INNOVACIÓN ESTRATÉGICA · 7 GATEWAYS
            </span>
            <EpistemicBadge level="HIPOTESIS" size="small" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
              Opportunity Builder (De Insight a Solución)
            </h1>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '6px 0 0 0' }}>
            Transforma observaciones etnográficas y directrices del Toolkit en arquetipos de botanas y briefs para I+D Sabritas.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew(!isCreatingNew)}
          style={{
            backgroundColor: isCreatingNew ? '#F1F5F9' : '#C25E00',
            color: isCreatingNew ? '#475569' : '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          {isCreatingNew ? '✕ Cancelar Creación' : '+ Nueva Oportunidad'}
        </button>
      </div>

      {/* FORMULARIO DE CREACIÓN */}
      {isCreatingNew && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.75rem', border: '2px solid #C25E00', boxShadow: '0 8px 30px rgba(194,94,0,0.08)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#C25E00', margin: '0 0 1rem 0' }}>
            Estructurar Nuevo Territorio de Oportunidad
          </h3>

          <form onSubmit={handleSaveNewOpp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>Título del Concepto / Oportunidad</label>
                <input
                  type="text"
                  placeholder="ej. Sabritas Corte Grueso Botanero con Ajo Asado"
                  value={newOpp.titulo}
                  onChange={e => setNewOpp({ ...newOpp, titulo: e.target.value })}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>Gateway Principal</label>
                <select
                  value={newOpp.gatewayId}
                  onChange={e => setNewOpp({ ...newOpp, gatewayId: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                >
                  {SNTD_GATEWAYS_DEF.map(gw => (
                    <option key={gw.id} value={gw.id}>{gw.id}: {gw.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>Hallazgo Etnográfico de Base</label>
                <textarea
                  rows="2"
                  placeholder="¿Qué vimos en campo en las 3 plazas?"
                  value={newOpp.hallazgo}
                  onChange={e => setNewOpp({ ...newOpp, hallazgo: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>Fricción o Problema Actual</label>
                <textarea
                  rows="2"
                  placeholder="¿Por qué falla el producto actual en anaquel?"
                  value={newOpp.problema}
                  onChange={e => setNewOpp({ ...newOpp, problema: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>Oportunidad de Innovación</label>
                <textarea
                  rows="2"
                  placeholder="¿Qué solución concreta proponemos?"
                  value={newOpp.oportunidad}
                  onChange={e => setNewOpp({ ...newOpp, oportunidad: e.target.value })}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>Hipótesis de Solución Culinaria / I+D</label>
                <textarea
                  rows="2"
                  placeholder="Atributos obligatorios del Toolkit a implementar"
                  value={newOpp.hipotesisSolucion}
                  onChange={e => setNewOpp({ ...newOpp, hipotesisSolucion: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#047857',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Guardar Oportunidad en Playbook
            </button>
          </form>
        </div>
      )}

      {/* EXPLORADOR DE OPORTUNIDADES EXISTENTES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Lista Lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {opportunities.map(opp => {
            const isSelected = opp.id === selectedOppId;
            const gwObj = SNTD_GATEWAYS_DEF.find(g => g.id === opp.gatewayId);
            return (
              <div
                key={opp.id}
                onClick={() => setSelectedOppId(opp.id)}
                style={{
                  backgroundColor: isSelected ? '#FFF7ED' : '#FFFFFF',
                  border: isSelected ? '2px solid #C25E00' : '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  {gwObj && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFEDD5', padding: '2px 6px', borderRadius: '6px' }}>
                      {gwObj.id} {gwObj.name.split(' ')[0]}
                    </span>
                  )}
                  <EpistemicBadge level={opp.nivel || 'HIPOTESIS'} />
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#191919', lineHeight: 1.3 }}>
                  {opp.titulo}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detalle Central de la Oportunidad */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '2rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '4px 10px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
                GATEWAY ASOCIADO: {activeOpp.gatewayId}
              </span>
              <EpistemicBadge level="HIPOTESIS" />
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#191919', margin: '0 0 8px 0' }}>
              {activeOpp.titulo}
            </h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              {activeOpp.marcas?.map(m => (
                <span key={m} style={{ fontSize: '0.72rem', backgroundColor: '#F1F5F9', color: '#334155', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  🏢 {m}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #64748B' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>HALLAZGO ETNOGRÁFICO DE BASE:</div>
              <div style={{ fontSize: '0.88rem', color: '#1E293B', lineHeight: 1.5 }}>{activeOpp.hallazgo}</div>
            </div>

            <div style={{ backgroundColor: '#FEF2F2', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #EF4444' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#991B1B', marginBottom: '4px' }}>FRICCIÓN O PROBLEMA EN MERCADO:</div>
              <div style={{ fontSize: '0.88rem', color: '#7F1D1D', lineHeight: 1.5 }}>{activeOpp.problema}</div>
            </div>

            <div style={{ backgroundColor: '#ECFDF5', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #10B981' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#065F46', marginBottom: '4px' }}>TERRITORIO DE OPORTUNIDAD:</div>
              <div style={{ fontSize: '0.92rem', color: '#064E3B', fontWeight: 700, lineHeight: 1.5 }}>{activeOpp.oportunidad}</div>
            </div>

            <div style={{ backgroundColor: '#FFFBEB', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #F59E0B' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#92400E', marginBottom: '4px' }}>HIPÓTESIS DE SOLUCIÓN & I+D:</div>
              <div style={{ fontSize: '0.88rem', color: '#78350F', lineHeight: 1.5 }}>{activeOpp.hipotesisSolucion}</div>
            </div>

            {/* WIDGET INTERACTIVO DE VALIDACIÓN DEL TOOLKIT */}
            <div style={{ backgroundColor: conceptAudit.isCompliant ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${conceptAudit.isCompliant ? '#BBF7D0' : '#FDE68A'}`, borderRadius: '12px', padding: '1.25rem', marginTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: conceptAudit.isCompliant ? '#166534' : '#B45309' }}>
                  {conceptAudit.isCompliant ? '✔️ CONCEPTO CONFORME AL TOOLKIT' : '⚠️ ALERTAS DE VIABILIDAD DEL TOOLKIT'}
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: conceptAudit.isCompliant ? '#DCFCE7' : '#FEF3C7', color: conceptAudit.isCompliant ? '#14532D' : '#92400E', padding: '2px 8px', borderRadius: '10px' }}>
                  AUDITORÍA EN VIVO
                </span>
              </div>

              {conceptAudit.warnings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {conceptAudit.warnings.map((w, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', color: '#991B1B', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <span>⚠️</span>
                      <div><strong>{w.criterio}:</strong> {w.mensaje}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.82rem', color: '#166534' }}>
                  Esta oportunidad respeta los atributos obligatorios: no presenta léxico agresivo de dolor ni ingredientes prohibidos por la plataforma.
                </div>
              )}

              {conceptAudit.suggestions.length > 0 && (
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: '0.78rem', color: '#047857' }}>
                  💡 {conceptAudit.suggestions[0]}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
