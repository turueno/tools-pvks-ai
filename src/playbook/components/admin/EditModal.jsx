// src/playbook/components/admin/EditModal.jsx
import React, { useState } from 'react';
import { usePlaybookData } from '../../context/usePlaybookData.js';
import { Icon } from '../shared/Icons.jsx';
import EpistemicBadge from '../EpistemicBadge.jsx';
import ImageUploadDropzone from '../shared/ImageUploadDropzone.jsx';

export default function EditModal() {
  const { editingEntity, closeEditor, saveEntity, evidences } = usePlaybookData();

  if (!editingEntity) return null;

  const { type, data: initialData } = editingEntity;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(25, 25, 25, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={closeEditor}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {type === 'evidence' && <EvidenceForm initialData={initialData} onSave={(d) => saveEntity('evidences', d)} onClose={closeEditor} />}
        {type === 'insight' && <InsightForm initialData={initialData} allEvidences={evidences} onSave={(d) => saveEntity('insights', d)} onClose={closeEditor} />}
        {type === 'tension' && <TensionForm initialData={initialData} allEvidences={evidences} onSave={(d) => saveEntity('tensions', d)} onClose={closeEditor} />}
        {type === 'transition' && <TransitionForm initialData={initialData} onSave={(d) => saveEntity('transitions', d)} onClose={closeEditor} />}
        {type === 'brand' && <BrandForm initialData={initialData} onSave={(d) => saveEntity('brandMatrix', d)} onClose={closeEditor} />}
        {type === 'decision' && <DecisionForm initialData={initialData} allEvidences={evidences} onSave={(d) => saveEntity('decisionChains', d)} onClose={closeEditor} />}
        {type === 'home' && <HomeForm initialData={initialData} onSave={(d) => saveEntity('homes', d)} onClose={closeEditor} />}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. Formulario de Evidencias
// -------------------------------------------------------------
function EvidenceForm({ initialData, onSave, onClose }) {
  const isNew = !initialData?.id;
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    codigo: initialData?.codigo || 'EV-XX',
    titulo: initialData?.titulo || '',
    cita: initialData?.cita || '',
    fuente: initialData?.fuente || 'Pág. XX',
    hogar: initialData?.hogar || 'Hogar Belén (Nido)',
    observacionDirecta: initialData?.observacionDirecta || '',
    artefactoClave: initialData?.artefactoClave || '',
    imagenUrl: initialData?.imagenUrl || '',
    pieEtnografico: initialData?.pieEtnografico || '',
    nivelEpistemologico: initialData?.nivelEpistemologico || 'OBSERVADO'
  });

  const handleChange = (f, val) => setFormData(p => ({ ...p, [f]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.cita.trim()) {
      alert('Por favor ingresa al menos un título y la cita verbatim.');
      return;
    }
    const cleanData = {
      ...formData,
      id: formData.id || `ev-${Math.floor(Math.random() * 9000 + 1000)}`
    };
    onSave(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' }}>
            {isNew ? 'Nueva Evidencia Etnográfica' : `Editando [${formData.codigo}]`}
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '2px 0 0 0' }}>
            {isNew ? 'Registrar Evidencia de Campo' : formData.titulo}
          </h2>
        </div>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Código Único *</label>
            <input style={inputStyle} value={formData.codigo} onChange={e => handleChange('codigo', e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Título Descriptivo *</label>
            <input style={inputStyle} value={formData.titulo} onChange={e => handleChange('titulo', e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Nivel Epistemológico</label>
            <select style={inputStyle} value={formData.nivelEpistemologico} onChange={e => handleChange('nivelEpistemologico', e.target.value)}>
              <option value="OBSERVADO">OBSERVADO</option>
              <option value="DERIVADO">DERIVADO</option>
              <option value="HIPÓTESIS">HIPÓTESIS</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Cita Textual de la Madre / Cuidadora (Verbatim) *</label>
          <textarea
            style={{ ...inputStyle, minHeight: '80px', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            value={formData.cita}
            onChange={e => handleChange('cita', e.target.value)}
            placeholder="“Cita textual capturada en la inmersión...”"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Hogar de Inmersión</label>
            <input style={inputStyle} value={formData.hogar} onChange={e => handleChange('hogar', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Fuente en Reporte Lullaby</label>
            <input style={inputStyle} value={formData.fuente} onChange={e => handleChange('fuente', e.target.value)} placeholder="Ej. Pág. 4" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Observación Etnográfica Directa (Contexto / Materialidad)</label>
          <textarea
            style={{ ...inputStyle, minHeight: '70px' }}
            value={formData.observacionDirecta}
            onChange={e => handleChange('observacionDirecta', e.target.value)}
            placeholder="Descripción precisa del entorno, utensilios o ritual de alimentación..."
          />
        </div>

        <div>
          <label style={labelStyle}>Artefacto Clave</label>
          <input style={inputStyle} value={formData.artefactoClave} onChange={e => handleChange('artefactoClave', e.target.value)} placeholder="Ej. Vaso entrenador antiderrames" />
        </div>

        <ImageUploadDropzone
          label="Fotografía Etnográfica de Campo"
          value={formData.imagenUrl}
          onChange={url => handleChange('imagenUrl', url)}
          onAutoSave={url => {
            const updated = { ...formData, imagenUrl: url };
            setFormData(updated);
            onSave(updated);
          }}
          targetFolder="lullaby"
        />

        <div>
          <label style={labelStyle}>Pie de Foto Etnográfico</label>
          <input style={inputStyle} value={formData.pieEtnografico} onChange={e => handleChange('pieEtnografico', e.target.value)} placeholder="Descripción para el modal y visor de foto..." />
        </div>
      </div>

      <div style={footerStyle}>
        <button type="button" onClick={onClose} className="secondary-button" style={{ padding: '8px 16px' }}>
          Cancelar
        </button>
        <button type="submit" className="primary-button" style={{ padding: '8px 20px' }}>
          💾 Guardar Evidencia
        </button>
      </div>
    </form>
  );
}

// -------------------------------------------------------------
// 2. Formulario de Fichas de Insight (17 Campos)
// -------------------------------------------------------------
function InsightForm({ initialData, allEvidences, onSave, onClose }) {
  const isNew = !initialData?.id;
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    titulo: initialData?.titulo || '',
    nivelEpistemologico: initialData?.nivelEpistemologico || 'DERIVADO',
    fuenteReporte: initialData?.fuenteReporte || 'Págs. XX',
    descripcion: initialData?.descripcion || '',
    tension: initialData?.tension || '',
    mecanismo: initialData?.mecanismo || '',
    disparadores: Array.isArray(initialData?.disparadores) ? initialData.disparadores.join(', ') : (initialData?.disparadores || ''),
    condiciones: Array.isArray(initialData?.condiciones) ? initialData.condiciones.join(', ') : (initialData?.condiciones || ''),
    actores: Array.isArray(initialData?.actores) ? initialData.actores.join(', ') : (initialData?.actores || ''),
    contexto: initialData?.contexto || '',
    necesidad: initialData?.necesidad || '',
    respuestaActual: initialData?.respuestaActual || '',
    condicionAceptacion: initialData?.condicionAceptacion || '',
    riesgo: initialData?.riesgo || '',
    implicaciones: initialData?.implicaciones || '',
    oportunidades: initialData?.oportunidades || '',
    marcasRelacionadas: Array.isArray(initialData?.marcasRelacionadas) ? initialData.marcasRelacionadas.join(', ') : (initialData?.marcasRelacionadas || ''),
    evidenciaIds: initialData?.evidenciaIds || []
  });

  const handleChange = (f, val) => setFormData(p => ({ ...p, [f]: val }));

  const toggleEvidence = (evId) => {
    setFormData(p => {
      const current = p.evidenciaIds || [];
      const next = current.includes(evId) ? current.filter(id => id !== evId) : [...current, evId];
      return { ...p, evidenciaIds: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) {
      alert('Ingresa el título del insight.');
      return;
    }
    const cleanData = {
      ...formData,
      id: formData.id || `ins-${Math.floor(Math.random() * 9000 + 1000)}`,
      disparadores: typeof formData.disparadores === 'string' ? formData.disparadores.split(',').map(s => s.trim()).filter(Boolean) : formData.disparadores,
      condiciones: typeof formData.condiciones === 'string' ? formData.condiciones.split(',').map(s => s.trim()).filter(Boolean) : formData.condiciones,
      actores: typeof formData.actores === 'string' ? formData.actores.split(',').map(s => s.trim()).filter(Boolean) : formData.actores,
      marcasRelacionadas: typeof formData.marcasRelacionadas === 'string' ? formData.marcasRelacionadas.split(',').map(s => s.trim()).filter(Boolean) : formData.marcasRelacionadas
    };
    onSave(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase' }}>
            {isNew ? 'Nuevo Insight Estructurado' : `Ficha Insight · ID: ${formData.id}`}
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '2px 0 0 0' }}>
            {isNew ? 'Crear Ficha de Conocimiento' : formData.titulo}
          </h2>
        </div>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Título del Insight *</label>
            <input style={inputStyle} value={formData.titulo} onChange={e => handleChange('titulo', e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Nivel Epistemológico</label>
            <select style={inputStyle} value={formData.nivelEpistemologico} onChange={e => handleChange('nivelEpistemologico', e.target.value)}>
              <option value="OBSERVADO">OBSERVADO</option>
              <option value="DERIVADO">DERIVADO</option>
              <option value="HIPÓTESIS">HIPÓTESIS</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Fuente en Reporte</label>
            <input style={inputStyle} value={formData.fuenteReporte} onChange={e => handleChange('fuenteReporte', e.target.value)} placeholder="Ej. Págs. 3–5" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Descripción Principal</label>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.descripcion} onChange={e => handleChange('descripcion', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>⚡ Tensión Latente</label>
            <textarea style={{ ...inputStyle, minHeight: '65px' }} value={formData.tension} onChange={e => handleChange('tension', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>⚙️ Mecanismo Causal</label>
            <textarea style={{ ...inputStyle, minHeight: '65px' }} value={formData.mecanismo} onChange={e => handleChange('mecanismo', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>🎯 Necesidad Profunda</label>
            <textarea style={{ ...inputStyle, minHeight: '55px' }} value={formData.necesidad} onChange={e => handleChange('necesidad', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>✅ Condición de Aceptación</label>
            <textarea style={{ ...inputStyle, minHeight: '55px' }} value={formData.condicionAceptacion} onChange={e => handleChange('condicionAceptacion', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>💡 Implicaciones Estratégicas</label>
            <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.implicaciones} onChange={e => handleChange('implicaciones', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>🚀 Oportunidades de Negocio</label>
            <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.oportunidades} onChange={e => handleChange('oportunidades', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Disparadores (separados por coma)</label>
            <input style={inputStyle} value={formData.disparadores} onChange={e => handleChange('disparadores', e.target.value)} placeholder="Ej. Cumplir 1 año, diarrea" />
          </div>
          <div>
            <label style={labelStyle}>Actores (separados por coma)</label>
            <input style={inputStyle} value={formData.actores} onChange={e => handleChange('actores', e.target.value)} placeholder="Mamá, Abuela, Pediatra" />
          </div>
          <div>
            <label style={labelStyle}>Marcas Relacionadas (por coma)</label>
            <input style={inputStyle} value={formData.marcasRelacionadas} onChange={e => handleChange('marcasRelacionadas', e.target.value)} placeholder="Nido, NAN, Nestum" />
          </div>
        </div>

        {/* Selector de Evidencias Vinculadas */}
        <div>
          <label style={labelStyle}>Evidencias Vinculadas (Sustento Empírico de Campo)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px', maxHeight: '140px', overflowY: 'auto', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
            {allEvidences.map(ev => {
              const checked = formData.evidenciaIds.includes(ev.id);
              return (
                <label key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer', color: checked ? '#C25E00' : '#475569', fontWeight: checked ? 700 : 400 }}>
                  <input type="checkbox" checked={checked} onChange={() => toggleEvidence(ev.id)} />
                  <span>[{ev.codigo}] {ev.titulo.slice(0, 25)}...</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <button type="button" onClick={onClose} className="secondary-button" style={{ padding: '8px 16px' }}>
          Cancelar
        </button>
        <button type="submit" className="primary-button" style={{ padding: '8px 20px' }}>
          💾 Guardar Ficha de Insight
        </button>
      </div>
    </form>
  );
}

// -------------------------------------------------------------
// 3. Formulario de Tensiones Bipolares
// -------------------------------------------------------------
function TensionForm({ initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    titulo: initialData?.titulo || '',
    descripcion: initialData?.descripcion || '',
    poloA: {
      nombre: initialData?.poloA?.nombre || '',
      conceptos: Array.isArray(initialData?.poloA?.conceptos) ? initialData.poloA.conceptos.join(', ') : '',
      marcas: Array.isArray(initialData?.poloA?.marcas) ? initialData.poloA.marcas.join(', ') : '',
      evidencias: initialData?.poloA?.evidencias || []
    },
    poloB: {
      nombre: initialData?.poloB?.nombre || '',
      conceptos: Array.isArray(initialData?.poloB?.conceptos) ? initialData.poloB.conceptos.join(', ') : '',
      marcas: Array.isArray(initialData?.poloB?.marcas) ? initialData.poloB.marcas.join(', ') : '',
      evidencias: initialData?.poloB?.evidencias || []
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = {
      ...formData,
      id: formData.id || `ten-${Math.floor(Math.random() * 9000 + 1000)}`,
      poloA: {
        ...formData.poloA,
        conceptos: formData.poloA.conceptos.split(',').map(s => s.trim()).filter(Boolean),
        marcas: formData.poloA.marcas.split(',').map(s => s.trim()).filter(Boolean)
      },
      poloB: {
        ...formData.poloB,
        conceptos: formData.poloB.conceptos.split(',').map(s => s.trim()).filter(Boolean),
        marcas: formData.poloB.marcas.split(',').map(s => s.trim()).filter(Boolean)
      }
    };
    onSave(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
            Eje Dialéctico · Tensión {formData.id}
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '2px 0 0 0' }}>
            {formData.titulo || 'Editar Tensión Bipolar'}
          </h2>
        </div>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={labelStyle}>Título de la Tensión *</label>
          <input style={inputStyle} value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} required />
        </div>
        <div>
          <label style={labelStyle}>Descripción del Dilema Materno</label>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
          {/* POLO A */}
          <div style={{ backgroundColor: '#F0F9FF', padding: '1rem', borderRadius: '10px', border: '1.5px solid #BAE6FD' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#0369A1', fontSize: '0.9rem', fontWeight: 800 }}>Polo A (Aspiración / Control)</h4>
            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Nombre del Polo</label>
              <input style={inputStyle} value={formData.poloA.nombre} onChange={e => setFormData({ ...formData, poloA: { ...formData.poloA, nombre: e.target.value } })} />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Conceptos (por coma)</label>
              <input style={inputStyle} value={formData.poloA.conceptos} onChange={e => setFormData({ ...formData, poloA: { ...formData.poloA, conceptos: e.target.value } })} />
            </div>
            <div>
              <label style={labelStyle}>Marcas Asociadas (por coma)</label>
              <input style={inputStyle} value={formData.poloA.marcas} onChange={e => setFormData({ ...formData, poloA: { ...formData.poloA, marcas: e.target.value } })} />
            </div>
          </div>

          {/* POLO B */}
          <div style={{ backgroundColor: '#FFFBEB', padding: '1rem', borderRadius: '10px', border: '1.5px solid #FDE68A' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#B45309', fontSize: '0.9rem', fontWeight: 800 }}>Polo B (Realidad / Alivio)</h4>
            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Nombre del Polo</label>
              <input style={inputStyle} value={formData.poloB.nombre} onChange={e => setFormData({ ...formData, poloB: { ...formData.poloB, nombre: e.target.value } })} />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Conceptos (por coma)</label>
              <input style={inputStyle} value={formData.poloB.conceptos} onChange={e => setFormData({ ...formData, poloB: { ...formData.poloB, conceptos: e.target.value } })} />
            </div>
            <div>
              <label style={labelStyle}>Marcas Asociadas (por coma)</label>
              <input style={inputStyle} value={formData.poloB.marcas} onChange={e => setFormData({ ...formData, poloB: { ...formData.poloB, marcas: e.target.value } })} />
            </div>
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <button type="button" onClick={onClose} className="secondary-button" style={{ padding: '8px 16px' }}>
          Cancelar
        </button>
        <button type="submit" className="primary-button" style={{ padding: '8px 20px' }}>
          💾 Guardar Tensión
        </button>
      </div>
    </form>
  );
}

// -------------------------------------------------------------
// 4. Formulario de Transición Vital
// -------------------------------------------------------------
function TransitionForm({ initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    titulo: initialData?.titulo || '',
    subtitulo: initialData?.subtitulo || '',
    fuente: initialData?.fuente || '',
    descripcion: initialData?.descripcion || '',
    detonante: initialData?.detonante || '',
    antes: {
      estado: initialData?.antes?.estado || '',
      comida: initialData?.antes?.comida || ''
    },
    despues: {
      estado: initialData?.despues?.estado || '',
      comida: initialData?.despues?.comida || ''
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = {
      ...formData,
      id: formData.id || `trans-${Math.floor(Math.random() * 9000 + 1000)}`
    };
    onSave(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: 0 }}>
          Editar Transición Vital ({formData.titulo || 'Transición'})
        </h2>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={labelStyle}>Título de la Transición *</label>
          <input style={inputStyle} value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} required />
        </div>
        <div>
          <label style={labelStyle}>Subtítulo / Efecto Clave</label>
          <input style={inputStyle} value={formData.subtitulo} onChange={e => setFormData({ ...formData, subtitulo: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Descripción</label>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Detonante de Cambio</label>
          <input style={inputStyle} value={formData.detonante} onChange={e => setFormData({ ...formData, detonante: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem' }}>Estado Inicial (Antes)</h4>
            <input style={{ ...inputStyle, marginBottom: '6px' }} placeholder="Nombre de estado" value={formData.antes.estado} onChange={e => setFormData({ ...formData, antes: { ...formData.antes, estado: e.target.value } })} />
            <textarea style={inputStyle} placeholder="Dieta / Hábitos" value={formData.antes.comida} onChange={e => setFormData({ ...formData, antes: { ...formData.antes, comida: e.target.value } })} />
          </div>
          <div style={{ backgroundColor: '#F0F9FF', padding: '1rem', borderRadius: '8px', border: '1px solid #BAE6FD' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem' }}>Estado Resultante (Después)</h4>
            <input style={{ ...inputStyle, marginBottom: '6px' }} placeholder="Nombre de estado" value={formData.despues.estado} onChange={e => setFormData({ ...formData, despues: { ...formData.despues, estado: e.target.value } })} />
            <textarea style={inputStyle} placeholder="Nueva dieta / Hábitos" value={formData.despues.comida} onChange={e => setFormData({ ...formData, despues: { ...formData.despues, comida: e.target.value } })} />
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <button type="button" onClick={onClose} className="secondary-button" style={{ padding: '8px 16px' }}>
          Cancelar
        </button>
        <button type="submit" className="primary-button" style={{ padding: '8px 20px' }}>
          💾 Guardar Transición
        </button>
      </div>
    </form>
  );
}

// -------------------------------------------------------------
// 5. Formulario de Matriz de Marca
// -------------------------------------------------------------
function BrandForm({ initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    marca: initialData?.marca || 'Nido',
    color: initialData?.color || '#F6911E',
    momentoObservado: initialData?.momentoObservado || '',
    papelEnDiscusion: initialData?.papelEnDiscusion || '',
    sostieneUso: initialData?.sostieneUso || '',
    poneAPruebaRelevancia: initialData?.poneAPruebaRelevancia || '',
    artefacto: initialData?.artefacto || '',
    fotoHabitat: initialData?.fotoHabitat || '',
    imagenUrl: initialData?.imagenUrl || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: 0 }}>
          Editar Ficha de Marca: {formData.marca}
        </h2>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={labelStyle}>Momento Observado en Hogar</label>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.momentoObservado} onChange={e => setFormData({ ...formData, momentoObservado: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Papel que se Discute</label>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.papelEnDiscusion} onChange={e => setFormData({ ...formData, papelEnDiscusion: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>✓ Qué Sostiene su Uso</label>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.sostieneUso} onChange={e => setFormData({ ...formData, sostieneUso: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>⚠️ Qué Pone a Prueba su Relevancia</label>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.poneAPruebaRelevancia} onChange={e => setFormData({ ...formData, poneAPruebaRelevancia: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Artefacto Etnográfico</label>
          <input style={inputStyle} value={formData.artefacto} onChange={e => setFormData({ ...formData, artefacto: e.target.value })} />
        </div>

        <ImageUploadDropzone
          label="Fotografía / Identidad de Marca"
          value={formData.imagenUrl}
          onChange={url => setFormData({ ...formData, imagenUrl: url })}
          onAutoSave={url => {
            const updated = { ...formData, imagenUrl: url };
            setFormData(updated);
            onSave(updated);
          }}
          targetFolder="lullaby"
        />
      </div>

      <div style={footerStyle}>
        <button type="button" onClick={onClose} className="secondary-button" style={{ padding: '8px 16px' }}>
          Cancelar
        </button>
        <button type="submit" className="primary-button" style={{ padding: '8px 20px' }}>
          💾 Guardar Marca
        </button>
      </div>
    </form>
  );
}

// -------------------------------------------------------------
// 6. Formulario de Cadena de Decisión
// -------------------------------------------------------------
function DecisionForm({ initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    marca: initialData?.marca || '',
    titulo: initialData?.titulo || '',
    fuente: initialData?.fuente || '',
    descripcion: initialData?.descripcion || '',
    etapas: initialData?.etapas || []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = {
      ...formData,
      id: formData.id || `dec-${Math.floor(Math.random() * 9000 + 1000)}`
    };
    onSave(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: 0 }}>
          Editar Cadena de Decisión ({formData.marca})
        </h2>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Marca *</label>
            <input style={inputStyle} value={formData.marca} onChange={e => setFormData({ ...formData, marca: e.target.value })} required />
          </div>
          <div>
            <label style={labelStyle}>Título de la Cadena *</label>
            <input style={inputStyle} value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} required />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Descripción del Recorrido de Certidumbre</label>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
        </div>
      </div>

      <div style={footerStyle}>
        <button type="button" onClick={onClose} className="secondary-button" style={{ padding: '8px 16px' }}>
          Cancelar
        </button>
        <button type="submit" className="primary-button" style={{ padding: '8px 20px' }}>
          💾 Guardar Cadena
        </button>
      </div>
    </form>
  );
}

// -------------------------------------------------------------
// 7. Formulario de Hogar / Inmersión
// -------------------------------------------------------------
function HomeForm({ initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    target: initialData?.target || '',
    focus: initialData?.focus || '',
    slides: initialData?.slides || '',
    imagenUrl: initialData?.imagenUrl || '',
    imagenAlt: initialData?.imagenAlt || '',
    artefacto: initialData?.artefacto || '',
    descripcionHabitat: initialData?.descripcionHabitat || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '2px 8px', borderRadius: '4px' }}>
            HOGAR / INMERSIÓN ETNOGRÁFICA
          </span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#191919' }}>
            {formData.name || 'Editar Hogar'}
          </h2>
        </div>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Nombre del Caso / Hogar *</label>
            <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <label style={labelStyle}>Páginas / Slides</label>
            <input style={inputStyle} value={formData.slides} onChange={e => setFormData({ ...formData, slides: e.target.value })} placeholder="Ej. Págs. 3–9" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Target / Actores</label>
            <input style={inputStyle} value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} placeholder="Ej. Mamá Belén, hija de 1 año" />
          </div>
          <div>
            <label style={labelStyle}>Artefacto Clave</label>
            <input style={inputStyle} value={formData.artefacto} onChange={e => setFormData({ ...formData, artefacto: e.target.value })} placeholder="Ej. Cazuela familiar y vaso" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Foco Etnográfico / Tensión Central</label>
          <input style={inputStyle} value={formData.focus} onChange={e => setFormData({ ...formData, focus: e.target.value })} />
        </div>

        <div>
          <label style={labelStyle}>Descripción del Hábitat y Entorno</label>
          <textarea style={{ ...inputStyle, minHeight: '65px' }} value={formData.descripcionHabitat} onChange={e => setFormData({ ...formData, descripcionHabitat: e.target.value })} />
        </div>

        <ImageUploadDropzone
          label="Fotografía del Hábitat de la Inmersión"
          value={formData.imagenUrl}
          onChange={url => setFormData({ ...formData, imagenUrl: url })}
          onAutoSave={url => {
            const updated = { ...formData, imagenUrl: url };
            setFormData(updated);
            onSave(updated);
          }}
          targetFolder="lullaby"
        />

        <div>
          <label style={labelStyle}>Texto Alternativo de Imagen</label>
          <input style={inputStyle} value={formData.imagenAlt} onChange={e => setFormData({ ...formData, imagenAlt: e.target.value })} placeholder="Descripción breve para accesibilidad" />
        </div>
      </div>

      <div style={footerStyle}>
        <button type="button" onClick={onClose} className="secondary-button" style={{ padding: '8px 16px' }}>
          Cancelar
        </button>
        <button type="submit" className="primary-button" style={{ padding: '8px 20px' }}>
          💾 Guardar Hogar
        </button>
      </div>
    </form>
  );
}

// Estilos comunes
const labelStyle = {
  display: 'block',
  fontSize: '0.74rem',
  fontWeight: 700,
  color: '#475569',
  marginBottom: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #CBD5E1',
  fontSize: '0.88rem',
  color: '#191919',
  backgroundColor: '#FFFFFF',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s ease'
};

const footerStyle = {
  padding: '1rem 1.75rem',
  borderTop: '2px solid #E2E8F0',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  backgroundColor: '#FFFFFF',
  position: 'sticky',
  bottom: 0,
  zIndex: 30,
  boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
};
