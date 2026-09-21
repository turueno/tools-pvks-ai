// src/components/shared/RestrictedAccessScreen.jsx
import React from 'react';

export default function RestrictedAccessScreen({ reason }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          backgroundColor: '#1E293B',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>🔒</div>
        
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: '12px', padding: '4px 12px', color: '#F87171', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
          Acceso Restringido o No Autorizado
        </div>

        <h2 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0 0 1rem 0', color: '#F8FAFC' }}>
          Enlace Inválido o Vencido
        </h2>

        <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
          {reason || 'El token de seguridad asociado a este Playbook no es válido, ha caducado por fecha de vigencia o ha sido revocado por la dirección de Provokers.'}
        </p>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Si eres cliente o stakeholder de este proyecto, por favor solicita un nuevo enlace seguro a tu consultor líder de cuenta.
          </span>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F6911E', marginTop: '6px' }}>
            PROVOKERS · Challenging Knowledge
          </div>
        </div>
      </div>
    </div>
  );
}
