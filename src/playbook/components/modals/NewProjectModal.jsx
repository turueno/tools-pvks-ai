// src/playbook/components/modals/NewProjectModal.jsx
import React, { useState } from 'react';
import { Icon } from '../shared/Icons.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';

export default function NewProjectModal({ isOpen, onClose }) {
  const { createProject } = usePlaybookData();
  const [formData, setFormData] = useState({
    nombre: '',
    cliente: '',
    vertical: 'Consumo Masivo',
    badge: 'ESTUDIO CUALITATIVO',
    confidencialidad: 'Estrictamente Confidencial',
    descripcion: '',
    templateType: 'blank' // 'blank' | 'template'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    // Generar ID limpio tipo slug
    const cleanSlug = formData.nombre
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const id = `${cleanSlug || 'playbook'}-${Date.now().toString().slice(-4)}`;

    createProject(
      {
        id,
        nombre: formData.nombre.trim(),
        cliente: formData.cliente.trim() || 'Cliente Confidencial',
        vertical: formData.vertical,
        badge: formData.badge.trim() || 'PROYECTO ACTIVO',
        confidencialidad: formData.confidencialidad,
        descripcion: formData.descripcion.trim() || 'Espacio de investigación etnográfica independiente.'
      },
      formData.templateType
    );

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAFAFA'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📁</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#191919' }}>
                Crear Nuevo Insight Playbook
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B' }}>
                Espacio de trabajo aislado con su propia base etnográfica y simulación
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
              padding: '4px'
            }}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '5px' }}>
                Nombre del Estudio / Proyecto *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Hábitos de Desayuno y Rutinas Familiares"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '5px' }}>
                  Cliente / Marca
                </label>
                <input
                  type="text"
                  placeholder="Ej. Nestlé México, Heineken, Retail..."
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '5px' }}>
                  Vertical de Industria
                </label>
                <select
                  value={formData.vertical}
                  onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
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
                  <option value="Tecnología & Plataformas">Tecnología & Plataformas</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '5px' }}>
                Descripción o Enfoque Etnográfico
              </label>
              <textarea
                rows={2}
                placeholder="Breve resumen del objetivo de investigación o muestra de campo..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.86rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            {/* Selector de Plantilla Inicial */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                Plantilla Inicial de Datos
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: formData.templateType === 'blank' ? '2px solid #F6911E' : '1px solid #CBD5E1',
                    backgroundColor: formData.templateType === 'blank' ? '#FFF7ED' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="templateType"
                    value="blank"
                    checked={formData.templateType === 'blank'}
                    onChange={() => setFormData({ ...formData, templateType: 'blank' })}
                    style={{ marginTop: '2px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#191919' }}>Lienzo en Blanco</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: 1.3 }}>
                      Sin evidencias preexistentes. Listo para vaciar tu propio estudio.
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: formData.templateType === 'template' ? '2px solid #F6911E' : '1px solid #CBD5E1',
                    backgroundColor: formData.templateType === 'template' ? '#FFF7ED' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="templateType"
                    value="template"
                    checked={formData.templateType === 'template'}
                    onChange={() => setFormData({ ...formData, templateType: 'template' })}
                    style={{ marginTop: '2px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#191919' }}>Clonar Lullaby</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: 1.3 }}>
                      Precarga las 20 evidencias y mapas como plantilla de partida.
                    </div>
                  </div>
                </label>
              </div>
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
                borderRadius: '8px',
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
                padding: '8px 20px',
                fontWeight: 800
              }}
            >
              🚀 Crear y Abrir Playbook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
