// src/components/admin/NewSuitePlaybookModal.jsx
import React, { useState } from 'react';
import { MODULES_CATALOG, DEFAULT_MANDATORY_MODULE_IDS } from '../../data/modulesCatalog.js';
import { synthesizePlaybookFromInput } from '../../playbook/ingest/synthesizerEngine.js';
import { Icon } from '../../playbook/components/shared/Icons.jsx';

export default function NewSuitePlaybookModal({ isOpen, onClose, onCreatePlaybook }) {
  // Estado del formulario unificado
  const [formData, setFormData] = useState({
    titulo: '',
    cliente: '',
    vertical: 'Consumo Masivo (CPG)',
    primaryBrand: '',
    confidencialidad: 'Estrictamente Confidencial',
    badge: 'ESTUDIO ESTRATÉGICO',
    descripcion: ''
  });

  // Módulos seleccionados del catálogo (por defecto la base obligatoria + módulos etnográficos clave)
  const [selectedModules, setSelectedModules] = useState([
    ...DEFAULT_MANDATORY_MODULE_IDS,
    'scenario',
    'system-map',
    'tensions',
    'decisions',
    'transitions',
    'matrix',
    'opportunities',
    'ai'
  ]);

  // Estado del archivo e ingesta persistente
  const [uploadedFileMeta, setUploadedFileMeta] = useState(null); // { name, size, chars, sessionId }
  const [rawExtractedText, setRawExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [extractError, setExtractError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Toggle de módulos opcionales
  const handleToggleModule = (moduleId, isMandatory) => {
    if (isMandatory) return; // La base epistemológica no se puede desmarcar
    setSelectedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Procesar archivo subido (PDF, Word, PPTX, etc.)
  const handleProcessFile = async (file) => {
    if (!file) return;
    setIsExtracting(true);
    setExtractError(null);

    // Auto-completar título si está vacío
    if (!formData.titulo.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setFormData(prev => ({ ...prev, titulo: cleanName }));
    }

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/ingest/extract', {
        method: 'POST',
        body: data
      });
      const result = await res.json();

      if (result.success && result.text) {
        setRawExtractedText(result.text);
        setUploadedFileMeta({
          name: result.originalName || file.name,
          size: file.size,
          chars: result.charCount || result.text.length,
          sessionId: result.sessionId
        });
      } else {
        setExtractError(result.error || 'No se pudo extraer texto del archivo.');
      }
    } catch (err) {
      console.error('Error al subir archivo:', err);
      setExtractError('Error de red al intentar extraer el documento.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Envío y Publicación del Playbook FPO
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) {
      alert('Por favor especifica un título para el Playbook.');
      return;
    }

    setIsSubmitting(true);

    const slug = formData.titulo
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const id = `${slug || 'playbook'}-${Date.now().toString().slice(-4)}`;
    const sessionId = uploadedFileMeta?.sessionId || `session-${Date.now().toString(36)}`;

    // 1. Sintetizar la Estructura Base FPO con citas reales del documento
    const synthesized = synthesizePlaybookFromInput({
      rawText: rawExtractedText,
      documentTitle: formData.titulo.trim(),
      clientName: formData.cliente.trim() || 'Cliente Provokers',
      vertical: formData.vertical,
      primaryBrand: formData.primaryBrand.trim() || formData.cliente.trim() || 'Marca Central',
      sessionId
    });

    // 2. Construir objeto de registro de Playbook
    const newPlaybookProject = {
      id,
      tipo: 'etnografico', // Mantiene compatibilidad con routing general
      titulo: formData.titulo.trim(),
      cliente: formData.cliente.trim() || 'Cliente Provokers',
      vertical: formData.vertical,
      primaryBrand: formData.primaryBrand.trim() || 'Marca Central',
      badge: formData.badge.trim() || 'ESTUDIO ESTRATÉGICO',
      icono: '🧭',
      color: '#F6911E',
      fecha: new Date().toISOString().slice(0, 7),
      confidencialidad: formData.confidencialidad,
      descripcion: formData.descripcion.trim() || `Playbook estructurado con base epistemológica y ${selectedModules.length} módulos habilitados.`,
      enabledModules: selectedModules,
      status: 'fpo_draft',
      sessionId,
      isCore: false
    };

    // 3. Persistir en localStorage
    try {
      localStorage.setItem(`pvks_playbook_${id}_data_v2`, JSON.stringify(synthesized.dataset));
    } catch (err) {
      console.warn('Error al guardar en localStorage:', err);
    }

    // 4. Notificar al backend para guardar en disco y cloud_store.json
    try {
      await fetch('/api/ingest/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          playbookProject: newPlaybookProject,
          dataset: synthesized.dataset
        })
      });
    } catch (err) {
      console.warn('Advertencia al guardar borrador en backend:', err);
    }

    setIsSubmitting(false);
    onCreatePlaybook(newPlaybookProject);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '1060px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}
      >
        {/* Header Unificado */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAFAFA'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '12px' }}>
                CREACIÓN UNIFICADA DE PLAYBOOK
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Estructura Base + Catálogo de Herramientas
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Configurar y Crear Nuevo Playbook
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Formulario Continuo con Scroll */}
        <form onSubmit={handleCreateSubmit} style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem' }}>
          
          {/* SECCIÓN 1: Identidad del Estudio */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', borderBottom: '2px solid #F1F5F9', paddingBottom: '0.5rem' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#0284C7', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800 }}>1</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Identidad y Parámetros del Playbook
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '5px' }}>
                  Título del Playbook / Estudio <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cinépolis: Hábitos y Experiencia en Sala 2026"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '5px' }}>
                  Cliente / Organización
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cinépolis México"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '5px' }}>
                  Vertical / Industria
                </label>
                <select
                  value={formData.vertical}
                  onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    backgroundColor: '#FFFFFF',
                    outline: 'none'
                  }}
                >
                  <option value="Consumo Masivo (CPG)">Consumo Masivo (CPG)</option>
                  <option value="Entretenimiento & Cine">Entretenimiento & Cine</option>
                  <option value="Alimentación & Bebidas">Alimentación & Bebidas</option>
                  <option value="Retail & Canal Moderno">Retail & Canal Moderno</option>
                  <option value="Salud & Farma">Salud & Farma</option>
                  <option value="Finanzas & Fintech">Finanzas & Fintech</option>
                  <option value="Servicios & Experiencia">Servicios & Experiencia</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '5px' }}>
                  Marca Principal de Análisis
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cinépolis VIP"
                  value={formData.primaryBrand}
                  onChange={(e) => setFormData({ ...formData, primaryBrand: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '5px' }}>
                  Nivel de Confidencialidad
                </label>
                <select
                  value={formData.confidencialidad}
                  onChange={(e) => setFormData({ ...formData, confidencialidad: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    backgroundColor: '#FFFFFF',
                    outline: 'none'
                  }}
                >
                  <option value="Estrictamente Confidencial">Estrictamente Confidencial</option>
                  <option value="Uso Interno & Clientes">Uso Interno & Clientes</option>
                  <option value="Público / Demostración">Público / Demostración</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Ingesta Documental Opcional */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '2px solid #F1F5F9', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#D97706', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800 }}>2</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  Insumos Documentales (Extracción y Respaldo)
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                Opcional · El texto y el archivo se guardan en el workspace
              </span>
            </div>

            {/* Dropzone */}
            {!uploadedFileMeta ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                style={{
                  border: isDragging ? '2px dashed #0284C7' : '2px dashed #CBD5E1',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  textAlign: 'center',
                  backgroundColor: isDragging ? '#F0F9FF' : '#F8FAFC',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('unified-file-input').click()}
              >
                <input
                  id="unified-file-input"
                  type="file"
                  accept=".pdf,.docx,.pptx,.xlsx,.txt,.md"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleProcessFile(e.target.files?.[0]);
                    e.target.value = null;
                  }}
                />
                <div style={{ fontSize: '2rem', marginBottom: '6px' }}>
                  {isExtracting ? '⏳' : '📂'}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                  {isExtracting ? 'Extrayendo texto y respaldando documento...' : 'Arrastra aquí tu reporte (PDF, Word, PPTX o TXT)'}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  El motor extraerá el contenido y lo guardará de forma persistente en <code style={{ backgroundColor: '#E2E8F0', padding: '1px 6px', borderRadius: '4px' }}>data/ingest_sessions/</code> para procesarlo con Antigravity.
                </div>
                {extractError && (
                  <div style={{ color: '#EF4444', fontSize: '0.82rem', fontWeight: 700, marginTop: '8px' }}>
                    ⚠️ {extractError}
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  borderRadius: '14px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '1.8rem' }}>📄</div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.92rem' }}>
                      {uploadedFileMeta.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#15803D' }}>
                      {uploadedFileMeta.chars.toLocaleString()} caracteres extraídos con éxito · Sesión: <code style={{ fontWeight: 700 }}>{uploadedFileMeta.sessionId}</code>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFileMeta(null);
                    setRawExtractedText('');
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '5px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  Cambiar archivo
                </button>
              </div>
            )}
          </div>

          {/* SECCIÓN 3: Catálogo de Secciones y Herramientas */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '2px solid #F1F5F9', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#10B981', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800 }}>3</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  Catálogo de Secciones y Herramientas a Habilitar
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                {selectedModules.length} módulos seleccionados
              </span>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Todo Playbook arranca con la <strong>Estructura Base Mandatoria</strong>. Selecciona del catálogo qué herramientas adicionales estarán disponibles en la barra de navegación de este Playbook.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {MODULES_CATALOG.map(cat => (
                <div
                  key={cat.id}
                  style={{
                    backgroundColor: cat.isMandatory ? '#F8FAFC' : '#FFFFFF',
                    border: cat.isMandatory ? '1.5px solid #BAE6FD' : '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: cat.isMandatory ? '#0369A1' : '#1E293B' }}>
                      {cat.categoria}
                    </div>
                    {cat.isMandatory && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0369A1', backgroundColor: '#E0F2FE', padding: '2px 8px', borderRadius: '8px' }}>
                        🔒 SIEMPRE ACTIVA (MANDATORIA)
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                    {cat.modules.map(mod => {
                      const isChecked = selectedModules.includes(mod.id);

                      return (
                        <div
                          key={mod.id}
                          onClick={() => handleToggleModule(mod.id, cat.isMandatory)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: isChecked ? '1.5px solid #0284C7' : '1px solid #E2E8F0',
                            backgroundColor: isChecked ? '#F0F9FF' : '#FFFFFF',
                            cursor: cat.isMandatory ? 'default' : 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={cat.isMandatory}
                            onChange={() => {}} // Manejado por el onClick del contenedor
                            style={{ marginTop: '3px', cursor: cat.isMandatory ? 'default' : 'pointer' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.84rem', color: isChecked ? '#0369A1' : '#334155' }}>
                                {mod.nombre}
                              </span>
                              {mod.badge && (
                                <span style={{ fontSize: '0.62rem', fontWeight: 700, backgroundColor: '#E2E8F0', color: '#475569', padding: '1px 5px', borderRadius: '6px' }}>
                                  {mod.badge}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35 }}>
                              {mod.descripcion}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1.25rem',
              borderTop: '1px solid #F1F5F9',
              marginTop: '1.5rem'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              El Playbook se creará en modo <strong>Borrador FPO</strong> y estará listo para enriquecerse con Antigravity.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: '#64748B',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-button"
                style={{
                  fontSize: '0.88rem',
                  padding: '9px 24px',
                  fontWeight: 800,
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                }}
              >
                {isSubmitting ? 'Generando Playbook FPO...' : '🚀 Crear Playbook FPO en la Suite'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
