// src/playbook/components/views/PACView.jsx
import React, { useState } from 'react';
import { generateBlocks } from '../../../logic/generator.js';
import { checkCompliance, checkUniversalCriteria } from '../../../logic/compliance.js';
import { scorePAC, balancePAC, generateRecommendations } from '../../../logic/pacEngine.js';
import EditableText from '../../../components/shared/EditableText.jsx';

export default function PACView({ activeSubmodule = 'pac_generator' }) {
  const [inputs, setInputs] = useState({
    target: 'Mama',
    pac: 'Acompanar',
    formato: 'Digital',
    claims: 'Sin azúcar añadida, con DHA para desarrollo cognitivo',
    territorio: 'Cercanía y Validación Materna',
    rtb: 'Estudios pediátricos clínicos avalados'
  });

  const [blocks, setBlocks] = useState(() => generateBlocks(inputs));
  const [compliance, setCompliance] = useState(() => checkCompliance(blocks));
  const [universalStatus, setUniversalStatus] = useState(() => checkUniversalCriteria(blocks));
  const [scores, setScores] = useState(() => scorePAC(blocks));
  const [balance, setBalance] = useState(() => balancePAC(scores));
  const [recommendations, setRecommendations] = useState(() => generateRecommendations(scores, compliance, universalStatus));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = () => {
    const newBlocks = generateBlocks(inputs);
    const newCompliance = checkCompliance(newBlocks);
    const newUniv = checkUniversalCriteria(newBlocks);
    const newScores = scorePAC(newBlocks);
    const newBal = balancePAC(newScores);
    const newRecs = generateRecommendations(newScores, newCompliance, newUniv);

    setBlocks(newBlocks);
    setCompliance(newCompliance);
    setUniversalStatus(newUniv);
    setScores(newScores);
    setBalance(newBal);
    setRecommendations(newRecs);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4F46E5', backgroundColor: '#EEF2FF', padding: '3px 8px', borderRadius: '12px' }}>
              HERRAMIENTA P.A.C.
            </span>
            <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Modelo Semiológico de Comunicación & Validación AHP</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
            P.A.C. Model Generator & Multi-Criteria Validator
          </h1>
          <p style={{ color: '#64748B', margin: '8px 0 0 0', maxWidth: '850px', lineHeight: 1.5 }}>
            Configura y evalúa bloques discursivos bajo la tríada <strong>Prescribir</strong> (autoridad técnica), <strong>Acompañar</strong> (empatía vincular) y <strong>Comunicar</strong> (claridad de beneficios) con matrices de ponderación multicriterio AHP.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Panel 1: Brief Config */}
        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
            1. Brief & Enfoque Discursivo
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Audiencia / Target</label>
              <select name="target" value={inputs.target} onChange={handleInputChange} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}>
                <option value="Mama">Mamá / Cuidador Principal</option>
                <option value="Medico">Profesional de la Salud / Pediatra</option>
                <option value="Adulto">Adulto / Consumidor Directo</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Eje PAC Primario</label>
              <select name="pac" value={inputs.pac} onChange={handleInputChange} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}>
                <option value="Prescribir">Prescribir (Autoridad Técnica y Aval)</option>
                <option value="Acompanar">Acompañar (Empatía, Validación y Hábitos)</option>
                <option value="Comunicar">Comunicar (Beneficios y Relevancia)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Claims Principales</label>
              <textarea
                name="claims"
                rows={2}
                value={inputs.claims}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', resize: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Territorio Emocional</label>
              <input
                type="text"
                name="territorio"
                value={inputs.territorio}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>

            <button
              onClick={handleGenerate}
              className="primary-button"
              style={{
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.88rem',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '0.5rem',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
              }}
            >
              ⚡ Generar & Ponderar Bloques PAC
            </button>
          </div>
        </div>

        {/* Panel 2: Bloques PAC Generados */}
        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
            2. Bloques Discursivos Generados
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Prescribir */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', borderLeft: '4px solid #0284C7', padding: '10px 14px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', marginBottom: '2px' }}>Prescribir (Autoridad)</div>
              <div style={{ fontSize: '0.86rem', color: '#1E293B', lineHeight: 1.4 }}>{blocks.prescribir}</div>
            </div>

            {/* Acompañar */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', borderLeft: '4px solid #10B981', padding: '10px 14px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: '2px' }}>Acompañar (Empatía)</div>
              <div style={{ fontSize: '0.86rem', color: '#1E293B', lineHeight: 1.4 }}>{blocks.acompanar}</div>
            </div>

            {/* Comunicar */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', borderLeft: '4px solid #F59E0B', padding: '10px 14px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', marginBottom: '2px' }}>Comunicar (Claridad)</div>
              <div style={{ fontSize: '0.86rem', color: '#1E293B', lineHeight: 1.4 }}>{blocks.comunicar}</div>
            </div>
          </div>
        </div>

        {/* Panel 3: Matriz AHP & Compliance */}
        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
            3. Ponderación Multicriterio AHP & Compliance
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.25rem' }}>
            <div style={{ textAlign: 'center', backgroundColor: '#EEF2FF', padding: '10px 6px', borderRadius: '10px', border: '1px solid #C7D2FE' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4338CA' }}>Consistencia</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#312E81' }}>{scores.consistencia}%</div>
            </div>
            <div style={{ textAlign: 'center', backgroundColor: '#ECFDF5', padding: '10px 6px', borderRadius: '10px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#047857' }}>Relevancia</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#064E3B' }}>{scores.relevancia}%</div>
            </div>
            <div style={{ textAlign: 'center', backgroundColor: '#FFFBEB', padding: '10px 6px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#B45309' }}>Diferenciación</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#78350F' }}>{scores.diferenciacion}%</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '10px 12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
              Diagnóstico de Balance: <span style={{ color: '#4F46E5' }}>{balance.status}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4 }}>
              {balance.feedback}
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: compliance.compliant ? '#16A34A' : '#DC2626' }}>
              <span>{compliance.compliant ? '🛡️ Compliance Regulatorio: APROBADO' : '⚠️ Alerta de Claims'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
