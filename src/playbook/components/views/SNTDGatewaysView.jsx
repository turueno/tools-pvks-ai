// src/playbook/components/views/SNTDGatewaysView.jsx
import React from 'react';
import SalsaNegraDiagnostic from '../../../components/SalsaNegraDiagnostic.jsx';

export default function SNTDGatewaysView() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '12px' }}>
            HERRAMIENTA TERRITORIAL
          </span>
          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Modelo Cultural de Compuertas (Gateways) y Plazas</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
          Diagnóstico Territorial 7 Gateways
        </h1>
        <p style={{ color: '#64748B', margin: '8px 0 0 0', maxWidth: '850px', lineHeight: 1.5 }}>
          Matriz de evaluación por compuertas culturales y sensoriales en las plazas clave de estudio (CDMX, Guadalajara, Monterrey).
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <SalsaNegraDiagnostic />
      </div>
    </div>
  );
}
