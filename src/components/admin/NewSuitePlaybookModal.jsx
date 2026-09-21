// src/components/admin/NewSuitePlaybookModal.jsx
import React, { useState } from 'react';

export default function NewSuitePlaybookModal({ isOpen, onClose, onCreatePlaybook }) {
  const [formData, setFormData] = useState({
    titulo: '',
    cliente: '',
    vertical: 'Consumo Masivo',
    tipo: 'etnografico', // 'etnografico' | 'pac' | 'sntd'
    badge: 'ESTUDIO ESTRATÉGICO',
    confidencialidad: 'Estrictamente Confidencial',
    descripcion: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) return;

    const slug = formData.titulo
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const id = `${slug || 'playbook'}-${Date.now().toString().slice(-4)}`;

    const typeIcons = {
      etnografico: '🧭',
      pac: '📈',
      sntd: '🌮'
    };

    const typeColors = {
      etnografico: '#F6911E',
      pac: '#4F46E5',
      sntd: '#FFAA34'
    };

    const newPlaybook = {
      id,
      tipo: formData.tipo,
      titulo: formData.titulo.trim(),
      cliente: formData.cliente.trim() || 'Cliente Provokers',
      vertical: formData.vertical,
      badge: formData.badge.trim() || 'NUEVO PLAYBOOK',
      icono: typeIcons[formData.tipo] || '📁',
      color: typeColors[formData.tipo] || '#F6911E',
      fecha: new Date().toISOString().slice(0, 7),
      confidencialidad: formData.confidencialidad,
      descripcion: formData.descripcion.trim() || 'Espacio metodológico independiente de la Suite Provokers.',
      isCore: false
    };

    onCreatePlaybook(newPlaybook);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '580px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>🚀</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#191919' }}>
                Crear Nuevo Playbook en la Suite
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                Añade una nueva investigación o módulo metodológico a Provokers AI Tools
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              fontSize: '1.2rem',
              fontWeight: 700,
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Selector de Tipo de Metodología */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
                Tipo de Playbook / Metodología *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <label
                  style={{
                    padding: '10px 8px',
                    borderRadius: '12px',
                    border: formData.tipo === 'etnografico' ? '2px solid #F6911E' : '1px solid #E2E8F0',
                    backgroundColor: formData.tipo === 'etnografico' ? '#FFF7ED' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '4px'
                  }}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value="etnografico"
                    checked={formData.tipo === 'etnografico'}
                    onChange={() => setFormData({ ...formData, tipo: 'etnografico' })}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.4rem' }}>🧭</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#191919' }}>Etnográfico</span>
                  <span style={{ fontSize: '0.66rem', color: '#64748B' }}>12 Vistas & Simulación</span>
                </label>

                <label
                  style={{
                    padding: '10px 8px',
                    borderRadius: '12px',
                    border: formData.tipo === 'pac' ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                    backgroundColor: formData.tipo === 'pac' ? '#EEF2FF' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '4px'
                  }}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value="pac"
                    checked={formData.tipo === 'pac'}
                    onChange={() => setFormData({ ...formData, tipo: 'pac' })}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.4rem' }}>📈</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#191919' }}>P.A.C. Model</span>
                  <span style={{ fontSize: '0.66rem', color: '#64748B' }}>Narrativa & AHP</span>
                </label>

                <label
                  style={{
                    padding: '10px 8px',
                    borderRadius: '12px',
                    border: formData.tipo === 'sntd' ? '2px solid #FFAA34' : '1px solid #E2E8F0',
                    backgroundColor: formData.tipo === 'sntd' ? '#FEF3C7' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '4px'
                  }}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value="sntd"
                    checked={formData.tipo === 'sntd'}
                    onChange={() => setFormData({ ...formData, tipo: 'sntd' })}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.4rem' }}>🌮</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#191919' }}>S.N.T.D.</span>
                  <span style={{ fontSize: '0.66rem', color: '#64748B' }}>Diagnóstico Territorial</span>
                </label>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '5px' }}>
                Título del Playbook / Estudio *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Ocasiones de Consumo y Snacking Urbano"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '5px' }}>
                  Cliente / Marca
                </label>
                <input
                  type="text"
                  placeholder="Ej. Nestlé, Heineken, Unilever..."
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '5px' }}>
                  Vertical de Industria
                </label>
                <select
                  value={formData.vertical}
                  onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    backgroundColor: '#FFFFFF',
                    outline: 'none'
                  }}
                >
                  <option value="Alimentación Infantil">Alimentación Infantil</option>
                  <option value="Snacks & Bebidas">Snacks & Bebidas</option>
                  <option value="Consumo Masivo (CPG)">Consumo Masivo (CPG)</option>
                  <option value="Retail & Canal Moderno">Retail & Canal Moderno</option>
                  <option value="Salud & Farma">Salud & Farma</option>
                  <option value="Finanzas & Fintech">Finanzas & Fintech</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '5px' }}>
                Descripción del Estudio
              </label>
              <textarea
                rows={2}
                placeholder="Objetivo principal, muestra observada o enfoque analítico..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.86rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#64748B',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="primary-button"
              style={{
                fontSize: '0.84rem',
                padding: '8px 22px',
                fontWeight: 800
              }}
            >
              ✨ Guardar Playbook en la Suite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
