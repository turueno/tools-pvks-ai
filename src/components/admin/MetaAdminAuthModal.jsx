// src/components/admin/MetaAdminAuthModal.jsx
import React, { useState } from 'react';
import { useSuiteDictionary } from '../../context/useSuiteDictionary.js';

export default function MetaAdminAuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginMetaAdmin } = useSuiteDictionary();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = loginMetaAdmin(password);
    if (!res.success) {
      setError(res.error || 'Clave incorrecta');
    } else {
      setPassword('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={closeAuthModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '440px',
          width: '100%',
          padding: '2rem',
          border: '1px solid #E2E8F0',
          position: 'relative'
        }}
        className="ritual-enter"
      >
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: '#94A3B8'
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              backgroundColor: '#FFF7ED',
              border: '2px solid #F6911E',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              fontSize: '1.75rem'
            }}
          >
            🛡️
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Acceso Protegido
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#191919', margin: '4px 0 6px 0' }}>
            Rol de Meta-Administrador
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
            Este rol permite modificar textos estructurales de la Suite (títulos, botones, descripciones y microcopys). Introduce la clave de seguridad maestra.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Contraseña Maestra:
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: error ? '2px solid #EF4444' : '1px solid #CBD5E1',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {error ? (
              <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '6px', fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            ) : (
              <div style={{ color: '#94A3B8', fontSize: '0.74rem', marginTop: '6px' }}>
                💡 Clave por defecto inicial: <code style={{ backgroundColor: '#F1F5F9', padding: '1px 5px', borderRadius: '4px', color: '#0F172A', fontWeight: 700 }}>pvks2026</code>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={closeAuthModal}
              style={{
                backgroundColor: '#F1F5F9',
                color: '#475569',
                border: '1px solid #CBD5E1',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#F6911E',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(246, 145, 30, 0.35)'
              }}
            >
              Desbloquear Meta-Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
