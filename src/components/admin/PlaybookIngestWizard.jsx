// src/components/admin/PlaybookIngestWizard.jsx
import React, { useState } from 'react';
import { synthesizePlaybookFromInput } from '../../playbook/ingest/synthesizerEngine.js';

export default function PlaybookIngestWizard({ isOpen, onClose, onPlaybookSynthesized, isInline = false }) {
  const [step, setStep] = useState(1); // 1: Carga y Parámetros, 2: Síntesis & Curator Studio, 3: Confirmación

  const [formData, setFormData] = useState({
    documentTitle: '',
    clientName: '',
    vertical: 'Consumo Masivo',
    primaryBrand: '',
    badge: 'ESTUDIO ESTRATÉGICO',
    confidencialidad: 'Estrictamente Confidencial',
    rawText: ''
  });

  const [synthesizedResult, setSynthesizedResult] = useState(null);
  const [activeTabPreview, setActiveTabPreview] = useState('insights'); // 'insights' | 'evidences' | 'tensions' | 'homes'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const processFile = async (file) => {
    if (!file) return;

    if (!formData.documentTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setFormData(prev => ({ ...prev, documentTitle: cleanName }));
    }

    // 1. JSON puro local
    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result || '';
        try {
          const parsed = JSON.parse(content);
          if (parsed.dataset || parsed.evidences || parsed.insights) {
            const title = parsed.project?.nombre || formData.documentTitle || file.name;
            const client = parsed.project?.cliente || formData.clientName || 'Cliente';
            setSynthesizedResult({
              meta: {
                titulo: title,
                cliente: client,
                vertical: formData.vertical,
                primaryBrand: formData.primaryBrand || 'Marca'
              },
              dataset: parsed.dataset || parsed
            });
            setStep(2);
            return;
          }
        } catch {}
        setFormData(prev => ({ ...prev, rawText: content }));
      };
      reader.readAsText(file);
      return;
    }

    // 2. Texto plano (txt, md, csv local)
    const textExtensions = ['.txt', '.md', '.csv'];
    if (textExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, rawText: event.target?.result || '' }));
      };
      reader.readAsText(file);
      return;
    }

    // 3. Documentos de Office y PDF (docx, pptx, xlsx, pdf, etc.)
    setIsProcessing(true);
    const data = new FormData();
    data.append('file', file);
    
    try {
      const response = await fetch('/api/ingest/extract', {
        method: 'POST',
        body: data
      });
      const result = await response.json();
      
      if (result.success && result.text) {
        setFormData(prev => ({ ...prev, rawText: result.text }));
      } else {
        alert(result.error || 'No se pudo extraer texto de este archivo.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de red al intentar subir el archivo para extracción.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e) => {
    processFile(e.target.files?.[0]);
    // Clear the input so the same file can be uploaded again if needed
    e.target.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Cargar caso de prueba de ejemplo
  const handleLoadSample = () => {
    setFormData({
      documentTitle: 'Estudio Cualitativo: Snacks Salados y Ocasiones Botaneras',
      clientName: 'Pepsico / Sabritas México',
      vertical: 'Snacks & Botaneros',
      primaryBrand: 'Sabritas / Doritos',
      badge: 'ESTUDIO ETNOGRÁFICO',
      confidencialidad: 'Estrictamente Confidencial',
      rawText: `# ESTUDIO DE INMERSIÓN EN HOGARES: BOTANAS Y SALSAS DE CONSUMO URBANO
Participantes: 18 hogares en CDMX, Guadalajara y Monterrey (NSE C y C+).

HALLAZGOS CLAVE:
1. Ritual de Preparación Botanera:
"A una bolsa de papas nunca se le come directo si hay invitados. Siempre se abre a la mitad sobre la mesa, se le exprime limón recién cortado y se le añaden gotas de salsa negra hasta que el fondo queda sazonado."
- Informante 1, CDMX (Madre de familia, 34 años).

2. La Tensión entre el Picor Agresivo y la Sazón con Capas:
"Las papas moradas te queman la lengua a los tres segundos y ya no te saben a nada. La salsa negra es diferente: primero te llega el olor ahumado, luego la acidez del limón y al final el picante suave en la garganta que te hace querer otra papa."
- Informante 4, Monterrey (Estudiante universitario, 22 años).

3. El Artefacto de Madurez:
"Tener tu propio botellín de salsa oscura artesanal en la mesa de centro es como decir que sabes comer bien. Ya no eres un niño comprando chucherías en la tiendita."
- Informante 7, Guadalajara (Profesionista, 29 años).

4. Barreras y Oportunidades:
"Si la botana viene de fábrica con saborizante artificial que dice 'sabor salsa negra' pero sabe dulce o sabe a soya barata, la gente la rechaza. La salsa negra mexicana tiene que sentirse cocida, con comal y jugo de cítricos de verdad."
- Informante 11, CDMX.`
    });
  };

  // Procesar y Sintetizar
  const handleProcessSynthesis = () => {
    if (!formData.rawText.trim() && !formData.documentTitle.trim()) {
      alert('Por favor escribe o sube algún contenido, o carga el texto de ejemplo.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = synthesizePlaybookFromInput({
        rawText: formData.rawText,
        documentTitle: formData.documentTitle || 'Nuevo Playbook Etnográfico',
        clientName: formData.clientName || 'Cliente Provokers',
        vertical: formData.vertical || 'Consumo Masivo',
        primaryBrand: formData.primaryBrand || 'Marca de Estudio'
      });
      setSynthesizedResult(res);
      setIsProcessing(false);
      setStep(2);
    }, 400);
  };

  // Publicar Playbook final en la Suite
  const handlePublishPlaybook = () => {
    if (!synthesizedResult) return;

    const slug = (formData.documentTitle || 'playbook')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const id = `${slug}-${Date.now().toString().slice(-4)}`;

    const newPlaybookProject = {
      id,
      tipo: 'etnografico',
      titulo: formData.documentTitle || 'Nuevo Playbook Etnográfico',
      cliente: formData.clientName || 'Cliente Provokers',
      vertical: formData.vertical,
      badge: formData.badge,
      icono: '🧭',
      color: '#F6911E',
      fecha: new Date().toISOString().slice(0, 7),
      confidencialidad: formData.confidencialidad,
      descripcion: `Estudio estructurado epistemológicamente a partir de documentos de inmersión (${synthesizedResult.dataset.evidences.length} evidencias, ${synthesizedResult.dataset.insights.length} fichas de insight, ${synthesizedResult.dataset.tensions.length} tensiones).`,
      isCore: false
    };

    // Guardar el dataset en localStorage bajo su scoped key
    try {
      localStorage.setItem(`pvks_playbook_${id}_data_v2`, JSON.stringify(synthesizedResult.dataset));
    } catch (e) {
      console.error('Error guardando nuevo dataset en localStorage:', e);
    }

    // Notificar al componente superior para añadirlo al registro de la suite y abrirlo
    onPlaybookSynthesized(newPlaybookProject);
    onClose();
  };


  const modalContent = (
      <div
        onClick={(e) => isInline ? null : e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: isInline ? '0' : '24px',
          width: '100%',
          maxWidth: isInline ? 'none' : (step === 2 ? '1140px' : '720px'),
          height: isInline ? '100%' : 'auto',
          maxHeight: isInline ? 'none' : '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isInline ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: isInline ? 'none' : '1px solid #E2E8F0',
          overflow: 'hidden',
          transition: 'max-width 0.25s ease'
        }}
      >
        {/* Header */}
        {!isInline && (
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>⚡</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '2px 8px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
                  OPCIÓN A · PLAYBOOK SYNTHESIZER
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                  Paso {step} de 2: {step === 1 ? 'Carga y Normalización' : 'Curator Studio & Validación Epistemológica'}
                </span>
              </div>
              <h3 style={{ margin: '3px 0 0 0', fontSize: '1.2rem', fontWeight: 900, color: '#191919' }}>
                {step === 1 ? 'Importar & Sintetizar Estudio en Insight Playbook' : 'Curator Studio: Revisión Pre-Publicación'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              fontSize: '1.25rem',
              fontWeight: 700,
              padding: '6px'
            }}
          >
            ✕
          </button>
        </div>
        )}

        {/* PASO 1: Formulario de Carga y Configuración */}
        {step === 1 && (
          <div style={{ padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Banner explicativo */}
            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '1.4rem' }}>💡</span>
              <div style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.45 }}>
                <strong>Ingestión Cognitiva Grounded:</strong> Sube o pega transcripciones, minutas de campo, notas de inmersión o reportes en texto/JSON. El motor extraerá citas textuales (<code>OBSERVADO</code>), formulará mecanismos causales de 17 campos (<code>DERIVADO</code>) y proyectará tensiones dialécticas listas para usar.
              </div>
            </div>

            {/* Metadatos Básicos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Título del Estudio / Proyecto *
                </label>
                <input
                  type="text"
                  placeholder="ej. Inmersión Etnográfica Botanera 2026"
                  value={formData.documentTitle}
                  onChange={(e) => setFormData({ ...formData, documentTitle: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Cliente / Solicitante *
                </label>
                <input
                  type="text"
                  placeholder="ej. Pepsico / Sabritas México"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Vertical de Mercado
                </label>
                <input
                  type="text"
                  placeholder="ej. Alimentos & Snacking"
                  value={formData.vertical}
                  onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Marca Clave Analizada
                </label>
                <input
                  type="text"
                  placeholder="ej. Sabritas / Doritos"
                  value={formData.primaryBrand}
                  onChange={(e) => setFormData({ ...formData, primaryBrand: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Dropzone & Carga de Archivos */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                  Documento Fuente (PDF de texto, TXT, CSV, JSON, Markdown)
                </label>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#C25E00',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  ⚡ Cargar Texto de Demostración
                </button>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                  border: isDragging ? '2px dashed #F6911E' : '2px dashed #CBD5E1',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  backgroundColor: isDragging ? '#FFF7ED' : '#F8FAFC',
                  textAlign: 'center',
                  marginBottom: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="file"
                  id="ingest-file-input"
                  accept=".txt,.csv,.json,.md,.pdf,.docx,.pptx,.xlsx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="ingest-file-input"
                  style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ fontSize: '1.75rem' }}>📂</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isDragging ? '#C25E00' : '#1E293B' }}>
                    {isDragging ? '¡Suelta el archivo aquí!' : 'Haz clic para examinar o arrastra tu archivo aquí'}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                    Soporta DOCX, PPTX, XLSX, PDF, TXT, CSV, MD o JSON de respaldo.
                  </span>
                </label>
              </div>

              <textarea
                rows={7}
                placeholder="O pega directamente aquí el texto del reporte, citas textuales con comillas, transcripciones de entrevistas o resúmenes ejecutivos..."
                value={formData.rawText}
                onChange={(e) => setFormData({ ...formData, rawText: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  lineHeight: 1.45,
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Footer de Acciones */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleProcessSynthesis}
                disabled={isProcessing}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#F6911E',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: isProcessing ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(246, 145, 30, 0.25)'
                }}
              >
                {isProcessing ? '⏳ Procesando Extracción...' : '⚡ Sintetizar Playbook Epistemológico →'}
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: Curator Studio (Revisión y Edición Previa) */}
        {step === 2 && synthesizedResult && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            {/* KPI Bar de Extracción */}
            <div
              style={{
                padding: '10px 1.75rem',
                backgroundColor: '#FFF7ED',
                borderBottom: '1px solid #FFEDD5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: '#9A3412', fontWeight: 800 }}>
                  Entidades Derivadas:
                </span>
                <span style={{ fontSize: '0.8rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '3px 8px', borderRadius: '12px', border: '1px solid #DBEAFE', fontWeight: 700 }}>
                  🔍 {synthesizedResult.dataset.evidences.length} Evidencias
                </span>
                <span style={{ fontSize: '0.8rem', backgroundColor: '#FFFBEB', color: '#D97706', padding: '3px 8px', borderRadius: '12px', border: '1px solid #FEF3C7', fontWeight: 700 }}>
                  💡 {synthesizedResult.dataset.insights.length} Fichas de Insight (17 campos)
                </span>
                <span style={{ fontSize: '0.8rem', backgroundColor: '#FEF2F2', color: '#DC2626', padding: '3px 8px', borderRadius: '12px', border: '1px solid #FEE2E2', fontWeight: 700 }}>
                  ⚖️ {synthesizedResult.dataset.tensions.length} Tensiones Dialécticas
                </span>
                <span style={{ fontSize: '0.8rem', backgroundColor: '#F0FDF4', color: '#166534', padding: '3px 8px', borderRadius: '12px', border: '1px solid #DCFCE7', fontWeight: 700 }}>
                  🏠 {synthesizedResult.dataset.homes.length} Arquetipos / Hogares
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  ← Modificar Texto Fuente
                </button>
              </div>
            </div>

            {/* Selector de Pestaña del Curator */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', padding: '0 1.75rem', backgroundColor: '#FAFAFA' }}>
              {[
                { id: 'insights', label: 'Fichas de Insight (17 campos)', count: synthesizedResult.dataset.insights.length },
                { id: 'evidences', label: 'Evidence Library (Citas & Observado)', count: synthesizedResult.dataset.evidences.length },
                { id: 'tensions', label: 'Tensiones (Polos A vs B)', count: synthesizedResult.dataset.tensions.length },
                { id: 'homes', label: 'Arquetipos & Marcas', count: synthesizedResult.dataset.homes.length }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTabPreview(t.id)}
                  style={{
                    padding: '12px 18px',
                    border: 'none',
                    borderBottom: activeTabPreview === t.id ? '3px solid #F6911E' : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: activeTabPreview === t.id ? '#F6911E' : '#64748B',
                    fontWeight: activeTabPreview === t.id ? 800 : 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  {t.label} ({t.count})
                </button>
              ))}
            </div>

            {/* Contenedor del Preview */}
            <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, maxHeight: '55vh' }}>
              {activeTabPreview === 'insights' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {synthesizedResult.dataset.insights.map((ins, idx) => (
                    <div key={ins.id} style={{ border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.25rem', backgroundColor: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFFFFF', backgroundColor: ins.epistemicLevel === 'HIPOTESIS' ? '#10B981' : '#D97706', padding: '2px 8px', borderRadius: '6px' }}>
                            {ins.epistemicLevel}
                          </span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>{ins.codigo}</span>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#191919' }}>{ins.titulo}</h4>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px', fontSize: '0.82rem', marginTop: '10px' }}>
                        <div style={{ backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px' }}>
                          <strong style={{ color: '#C25E00' }}>Tensión Latente:</strong> {ins.tensionLatente}
                        </div>
                        <div style={{ backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px' }}>
                          <strong style={{ color: '#1E293B' }}>Mecanismo Causal:</strong> {ins.mecanismoCausal}
                        </div>
                        <div style={{ backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px' }}>
                          <strong style={{ color: '#1E293B' }}>Disparadores & Condiciones:</strong> {ins.disparadores} ({ins.condiciones})
                        </div>
                        <div style={{ backgroundColor: '#F0FDF4', padding: '8px 12px', borderRadius: '8px' }}>
                          <strong style={{ color: '#166534' }}>Implicaciones / Oportunidades:</strong> {ins.implicaciones}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTabPreview === 'evidences' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                  {synthesizedResult.dataset.evidences.map(evi => (
                    <div key={evi.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem', backgroundColor: '#FFFFFF' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0284C7', backgroundColor: '#E0F2FE', padding: '2px 6px', borderRadius: '6px' }}>
                          {evi.epistemicLevel}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{evi.plaza} · {evi.slides}</span>
                      </div>
                      <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#1E293B', marginBottom: '8px', lineHeight: 1.45 }}>
                        {evi.verbatim}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                        Sujeto: {evi.sujeto} | Marca: {evi.marcaRelacionada}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTabPreview === 'tensions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {synthesizedResult.dataset.tensions.map(ten => (
                    <div key={ten.id} style={{ border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.25rem', backgroundColor: '#FFFFFF' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', fontWeight: 800, color: '#191919' }}>
                        {ten.codigo}: {ten.formulacion}
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                        <div style={{ backgroundColor: '#EFF6FF', padding: '10px 12px', borderRadius: '10px', borderLeft: '4px solid #3B82F6' }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1D4ED8' }}>POLO A: {ten.poloA.nombre}</div>
                          <div style={{ fontSize: '0.8rem', color: '#1E293B', marginTop: '4px' }}>{ten.poloA.descripcion}</div>
                        </div>
                        <div style={{ backgroundColor: '#FFF7ED', padding: '10px 12px', borderRadius: '10px', borderLeft: '4px solid #F97316' }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#C2410C' }}>POLO B: {ten.poloB.nombre}</div>
                          <div style={{ fontSize: '0.8rem', color: '#1E293B', marginTop: '4px' }}>{ten.poloB.descripcion}</div>
                        </div>
                      </div>
                      <div style={{ backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#475569' }}>
                        <strong>Aprendizaje Provokers:</strong> {ten.aprendizaje}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTabPreview === 'homes' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                  {synthesizedResult.dataset.homes.map(h => (
                    <div key={h.id} style={{ border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.25rem', backgroundColor: '#FFFFFF' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', backgroundColor: '#F0FDF4', padding: '2px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '6px' }}>
                        {h.target}
                      </div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800, color: '#191919' }}>
                        {h.name}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 8px 0' }}>
                        {h.descripcionHabitat}
                      </p>
                      <div style={{ fontSize: '0.78rem', color: '#C25E00', fontWeight: 700 }}>
                        Artefacto Fetiche: {h.artefacto}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer de Publicación */}
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderTop: '1px solid #F1F5F9',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                💡 Al publicar, este Playbook se integrará inmediatamente a la Suite con todas las vistas activas (Overview, Cards, Explorer, CMS).
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  onClick={handlePublishPlaybook}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                  }}
                >
                  🚀 Publicar Playbook en la Suite →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );

  if (isInline) {
    return modalContent;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={onClose}
    >
      {modalContent}
    </div>
  );
}
