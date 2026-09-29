// src/playbook/components/views/SNTDToolkitView.jsx
import React from 'react';
import ToolkitPreCheckTester from '../../sntd/components/ToolkitPreCheckTester.jsx';
import { SNTD_TOOLKIT_RULES } from '../../sntd/data/sntdDataset.js';

export default function SNTDToolkitView() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '12px' }}>
            REGLAS DE PLATAFORMA
          </span>
          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Validador de Portafolio y Directrices de Empaque</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
          Toolkit Pre-Check Tester
        </h1>
        <p style={{ color: '#64748B', margin: '8px 0 0 0', maxWidth: '850px', lineHeight: 1.5 }}>
          Simulador interactivo de reglas de portafolio para verificar que las innovaciones cumplan con los principios de diseño, ingredientes y comunicación.
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <ToolkitPreCheckTester rules={SNTD_TOOLKIT_RULES} />
      </div>
    </div>
  );
}
