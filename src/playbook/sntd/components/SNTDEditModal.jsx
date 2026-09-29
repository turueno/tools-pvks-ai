// src/playbook/sntd/components/SNTDEditModal.jsx
import React, { useState } from 'react';
import { useSNTDData } from '../context/SNTDDataContext.jsx';
import { Icon } from '../../components/shared/Icons.jsx';
import EpistemicBadge from '../../components/EpistemicBadge.jsx';
import ImageUploadDropzone from '../../components/shared/ImageUploadDropzone.jsx';

export default function SNTDEditModal() {
  const { editingEntity, closeEditor, saveEntity, evidences } = useSNTDData();

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
          maxWidth: '840px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {type === 'evidence' && <SNTDEvidenceForm initialData={initialData} onSave={(d) => saveEntity('evidences', d)} onClose={closeEditor} />}
        {type === 'insight' && <SNTDInsightForm initialData={initialData} allEvidences={evidences} onSave={(d) => saveEntity('insights', d)} onClose={closeEditor} />}
        {type === 'tension' && <SNTDTensionForm initialData={initialData} onSave={(d) => saveEntity('tensions', d)} onClose={closeEditor} />}
        {type === 'brand' && <SNTDBrandForm initialData={initialData} onSave={(d) => saveEntity('brands', d)} onClose={closeEditor} />}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #CBD5E1',
  fontSize: '0.86rem',
  color: '#191919',
  boxSizing: 'border-box'
};

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#475569',
  marginBottom: '4px',
  display: 'block'
};

const footerStyle = {
  padding: '1rem 1.75rem',
  borderTop: '1px solid #E2E8F0',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  backgroundColor: '#FAFAFA'
};

// ==============================================================
// 1. Formulario de Evidencia SNTD
// ==============================================================
function SNTDEvidenceForm({ initialData, onSave, onClose }) {
  const isNew = !initialData?.id;
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    titulo: initialData?.titulo || '',
    contenido: initialData?.contenido || '',
    tipo: initialData?.tipo || 'Cita',
    plazaId: initialData?.plazaId || 'PLAZA-01',
    gatewayId: initialData?.gatewayId || 'GW-01',
    brandId: initialData?.brandId || 'General',
    epistemic: initialData?.epistemic || 'OBSERVADO',
    imagenUrl: initialData?.imagenUrl || '',
    pieFoto: initialData?.pieFoto || '',
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || '')
  });

  const handleChange = (f, val) => setFormData(p => ({ ...p, [f]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      alert('Por favor ingresa un título y la descripción o verbatim de la evidencia.');
      return;
    }
    const cleanData = {
      ...formData,
      id: formData.id || `EV-SNTD-${Date.now().toString().slice(-4)}`,
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(s => s.trim()).filter(Boolean) : formData.tags
    };
    onSave(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' }}>
            {isNew ? 'Nueva Evidencia Etnográfica SNTD' : `Editando [${formData.id}]`}
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '2px 0 0 0' }}>
            {isNew ? 'Registrar Evidencia de Campo' : formData.titulo}
          </h2>
        </div>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Código / ID</label>
            <input style={inputStyle} value={formData.id} onChange={e => handleChange('id', e.target.value)} placeholder="Ej. EV-GW1-01" />
          </div>
          <div>
            <label style={labelStyle}>Nivel Epistemológico</label>
            <select style={inputStyle} value={formData.epistemic} onChange={e => handleChange('epistemic', e.target.value)}>
              <option value="OBSERVADO">OBSERVADO (Directo de campo / cita)</option>
              <option value="DERIVADO">DERIVADO (Patrón interpretativo)</option>
              <option value="HIPOTESIS">HIPÓTESIS (Oportunidad / conjetura)</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Título de la Evidencia *</label>
          <input style={inputStyle} value={formData.titulo} onChange={e => handleChange('titulo', e.target.value)} required />
        </div>

        <div>
          <label style={labelStyle}>Contenido / Cita Textual de Campo *</label>
          <textarea
            style={{ ...inputStyle, minHeight: '80px', fontStyle: 'italic' }}
            value={formData.contenido}
            onChange={e => handleChange('contenido', e.target.value)}
            required
            placeholder="Cita del consumidor, taquero o tendero..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Gateway</label>
            <select style={inputStyle} value={formData.gatewayId} onChange={e => handleChange('gatewayId', e.target.value)}>
              <option value="GW-01">GW-01: Preparación</option>
              <option value="GW-02">GW-02: Aderezamiento</option>
              <option value="GW-03">GW-03: Botaneo</option>
              <option value="GW-04">GW-04: Bajativo</option>
              <option value="GW-05">GW-05: Antojo</option>
              <option value="GW-06">GW-06: Acompañamiento</option>
              <option value="GW-07">GW-07: Transformación</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Plaza Etnográfica</label>
            <select style={inputStyle} value={formData.plazaId} onChange={e => handleChange('plazaId', e.target.value)}>
              <option value="PLAZA-01">CDMX Norte / Poniente</option>
              <option value="PLAZA-02">GDL y Occidente</option>
              <option value="PLAZA-03">MTY y Noreste</option>
              <option value="PLAZA-04">Puebla / Centro</option>
              <option value="PLAZA-05">Bajío (León / Qro)</option>
              <option value="PLAZA-06">Noreste Fronterizo</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Marca Sabritas</label>
            <input style={inputStyle} value={formData.brandId} onChange={e => handleChange('brandId', e.target.value)} placeholder="Ej. Doritos, Ruffles..." />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Etiquetas (separadas por comas)</label>
          <input style={inputStyle} value={formData.tags} onChange={e => handleChange('tags', e.target.value)} placeholder="Ej. Limón, Comal, Salsa Botanera, Crujido" />
        </div>

        <ImageUploadDropzone
          label="Fotografía Etnográfica de Campo SNTD"
          value={formData.imagenUrl}
          onChange={url => handleChange('imagenUrl', url)}
          onAutoSave={url => {
            const updated = { ...formData, imagenUrl: url };
            setFormData(updated);
            onSave(updated);
          }}
          targetFolder="sntd"
        />

        <div>
          <label style={labelStyle}>Pie de Foto Etnográfico</label>
          <input style={inputStyle} value={formData.pieFoto} onChange={e => handleChange('pieFoto', e.target.value)} placeholder="Contexto de la toma de campo..." />
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

// ==============================================================
// 2. Formulario de Fichas de Insight SNTD (17 Campos Epistemológicos)
// ==============================================================
function SNTDInsightForm({ initialData, allEvidences, onSave, onClose }) {
  const isNew = !initialData?.id;
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    titulo: initialData?.titulo || '',
    nivelEpistemologico: initialData?.nivelEpistemologico || initialData?.epistemic || 'DERIVADO',
    gatewayId: initialData?.gatewayId || 'GW-01',
    fuenteReporte: initialData?.fuenteReporte || 'Anexos SNTD / Pág. XX',
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
      id: formData.id || `INS-SNTD-${Date.now().toString().slice(-4)}`,
      epistemic: formData.nivelEpistemologico,
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
            {isNew ? 'Nueva Ficha de Insight SNTD' : `Editando [${formData.id}]`}
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '2px 0 0 0' }}>
            {isNew ? 'Crear Insight Cualitativo' : formData.titulo}
          </h2>
        </div>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Código / ID</label>
            <input style={inputStyle} value={formData.id} onChange={e => handleChange('id', e.target.value)} placeholder="Ej. INS-GW-01" />
          </div>
          <div>
            <label style={labelStyle}>Nivel Epistemológico</label>
            <select style={inputStyle} value={formData.nivelEpistemologico} onChange={e => handleChange('nivelEpistemologico', e.target.value)}>
              <option value="DERIVADO">DERIVADO (Mecanismo Causal)</option>
              <option value="OBSERVADO">OBSERVADO (Hallazgo Directo)</option>
              <option value="HIPOTESIS">HIPÓTESIS (Oportunidad)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Gateway</label>
            <select style={inputStyle} value={formData.gatewayId} onChange={e => handleChange('gatewayId', e.target.value)}>
              <option value="GW-01">GW-01: Preparación</option>
              <option value="GW-02">GW-02: Aderezamiento</option>
              <option value="GW-03">GW-03: Botaneo</option>
              <option value="GW-04">GW-04: Bajativo</option>
              <option value="GW-05">GW-05: Antojo</option>
              <option value="GW-06">GW-06: Acompañamiento</option>
              <option value="GW-07">GW-07: Transformación</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Título del Insight *</label>
          <input style={inputStyle} value={formData.titulo} onChange={e => handleChange('titulo', e.target.value)} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Fuente Reporte / Anexo</label>
            <input style={inputStyle} value={formData.fuenteReporte} onChange={e => handleChange('fuenteReporte', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Marcas Sabritas Relacionadas (separadas por comas)</label>
            <input style={inputStyle} value={formData.marcasRelacionadas} onChange={e => handleChange('marcasRelacionadas', e.target.value)} placeholder="Doritos, Ruffles, Tostitos..." />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Descripción Fenomenológica</label>
          <textarea style={{ ...inputStyle, minHeight: '65px' }} value={formData.descripcion} onChange={e => handleChange('descripcion', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Tensión Cultural Subyacente</label>
            <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.tension} onChange={e => handleChange('tension', e.target.value)} placeholder="Fricción entre lo permitido y lo prohibido..." />
          </div>
          <div>
            <label style={labelStyle}>Mecanismo Causal Profundo</label>
            <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.mecanismo} onChange={e => handleChange('mecanismo', e.target.value)} placeholder="Por qué ocurre el fenómeno..." />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Disparadores (separados por coma)</label>
            <input style={inputStyle} value={formData.disparadores} onChange={e => handleChange('disparadores', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Condiciones de Ocurrencia</label>
            <input style={inputStyle} value={formData.condiciones} onChange={e => handleChange('condiciones', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Actores Involucrados</label>
            <input style={inputStyle} value={formData.actores} onChange={e => handleChange('actores', e.target.value)} placeholder="Taquero, Consumidor, Pareja..." />
          </div>
          <div>
            <label style={labelStyle}>Contexto Territorial</label>
            <input style={inputStyle} value={formData.contexto} onChange={e => handleChange('contexto', e.target.value)} placeholder="Tiendita, Puesto callejero, Sala de TV..." />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Necesidad Insatisfecha</label>
            <textarea style={{ ...inputStyle, minHeight: '55px' }} value={formData.necesidad} onChange={e => handleChange('necesidad', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Respuesta Actual del Consumidor</label>
            <textarea style={{ ...inputStyle, minHeight: '55px' }} value={formData.respuestaActual} onChange={e => handleChange('respuestaActual', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Condición de Aceptación</label>
            <textarea style={{ ...inputStyle, minHeight: '55px' }} value={formData.condicionAceptacion} onChange={e => handleChange('condicionAceptacion', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Riesgo de Fracaso / Rechazo</label>
            <textarea style={{ ...inputStyle, minHeight: '55px' }} value={formData.riesgo} onChange={e => handleChange('riesgo', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Implicaciones Estratégicas</label>
            <textarea style={{ ...inputStyle, minHeight: '55px' }} value={formData.implicaciones} onChange={e => handleChange('implicaciones', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Oportunidades de Innovación Sabritas</label>
            <textarea style={{ ...inputStyle, minHeight: '55px' }} value={formData.oportunidades} onChange={e => handleChange('oportunidades', e.target.value)} />
          </div>
        </div>

        {/* Evidencias vinculadas */}
        {allEvidences && allEvidences.length > 0 && (
          <div>
            <label style={labelStyle}>Vincular Evidencias de Campo ({formData.evidenciaIds?.length || 0} seleccionadas)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '140px', overflowY: 'auto', border: '1px solid #CBD5E1', padding: '8px', borderRadius: '8px' }}>
              {allEvidences.map(ev => {
                const isSelected = formData.evidenciaIds?.includes(ev.id);
                return (
                  <label key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', cursor: 'pointer', backgroundColor: isSelected ? '#EFF6FF' : '#F8FAFC', padding: '4px 6px', borderRadius: '4px' }}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleEvidence(ev.id)} />
                    <span style={{ fontWeight: 700, color: '#0369A1' }}>[{ev.id}]</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.titulo}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={footerStyle}>
        <button type="button" onClick={onClose} className="secondary-button" style={{ padding: '8px 16px' }}>
          Cancelar
        </button>
        <button type="submit" className="primary-button" style={{ padding: '8px 20px' }}>
          💾 Guardar Insight
        </button>
      </div>
    </form>
  );
}

// ==============================================================
// 3. Formulario de Tensiones SNTD
// ==============================================================
function SNTDTensionForm({ initialData, onSave, onClose }) {
  const isNew = !initialData?.id;
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    titulo: initialData?.titulo || '',
    tension: initialData?.tension || '',
    gatewayId: initialData?.gatewayId || 'GW-01',
    poloA: initialData?.poloA || '',
    poloB: initialData?.poloB || '',
    descripcion: initialData?.descripcion || '',
    aprendizaje: initialData?.aprendizaje || ''
  });

  const handleChange = (f, val) => setFormData(p => ({ ...p, [f]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.tension.trim()) {
      alert('Ingresa el título y la formulación de la tensión.');
      return;
    }
    const cleanData = {
      ...formData,
      id: formData.id || `TEN-SNTD-${Date.now().toString().slice(-4)}`
    };
    onSave(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
            {isNew ? 'Nueva Tensión Cultural' : `Editando [${formData.id}]`}
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '2px 0 0 0' }}>
            {isNew ? 'Crear Tensión Dialéctica' : formData.titulo}
          </h2>
        </div>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Código / ID</label>
            <input style={inputStyle} value={formData.id} onChange={e => handleChange('id', e.target.value)} placeholder="Ej. TEN-01" />
          </div>
          <div>
            <label style={labelStyle}>Gateway</label>
            <select style={inputStyle} value={formData.gatewayId} onChange={e => handleChange('gatewayId', e.target.value)}>
              <option value="GW-01">GW-01: Preparación</option>
              <option value="GW-02">GW-02: Aderezamiento</option>
              <option value="GW-03">GW-03: Botaneo</option>
              <option value="GW-04">GW-04: Bajativo</option>
              <option value="GW-05">GW-05: Antojo</option>
              <option value="GW-06">GW-06: Acompañamiento</option>
              <option value="GW-07">GW-07: Transformación</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Título de la Tensión *</label>
          <input style={inputStyle} value={formData.titulo} onChange={e => handleChange('titulo', e.target.value)} required />
        </div>

        <div>
          <label style={labelStyle}>Formulación Dialéctica (A vs B) *</label>
          <input style={inputStyle} value={formData.tension} onChange={e => handleChange('tension', e.target.value)} required placeholder="Ej. Practicidad Industrial vs. Autenticidad del Puesto Callejero" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Polo A (Tesis)</label>
            <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.poloA} onChange={e => handleChange('poloA', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Polo B (Antítesis)</label>
            <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.poloB} onChange={e => handleChange('poloB', e.target.value)} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Descripción Fenomenológica</label>
          <textarea style={{ ...inputStyle, minHeight: '70px' }} value={formData.descripcion} onChange={e => handleChange('descripcion', e.target.value)} />
        </div>

        <div>
          <label style={labelStyle}>Aprendizaje Estratégico para Sabritas</label>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={formData.aprendizaje} onChange={e => handleChange('aprendizaje', e.target.value)} />
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

// ==============================================================
// 4. Formulario de Marca Sabritas
// ==============================================================
function SNTDBrandForm({ initialData, onSave, onClose }) {
  const isNew = !initialData?.name;
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    pros: initialData?.pros || '',
    contras: initialData?.contras || '',
    veredicto: initialData?.veredicto || ''
  });

  const handleChange = (f, val) => setFormData(p => ({ ...p, [f]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Ingresa el nombre de la marca.');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase' }}>
            {isNew ? 'Nueva Marca Sabritas' : `Editando [${formData.name}]`}
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#191919', margin: '2px 0 0 0' }}>
            {formData.name || 'Registrar Marca Sabritas'}
          </h2>
        </div>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <Icon name="close" size={20} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div>
          <label style={labelStyle}>Nombre de la Marca *</label>
          <input style={inputStyle} value={formData.name} onChange={e => handleChange('name', e.target.value)} required placeholder="Ej. Doritos, Ruffles..." />
        </div>

        <div>
          <label style={labelStyle}>Fortalezas y Factores Clave (Pros)</label>
          <textarea style={{ ...inputStyle, minHeight: '70px' }} value={formData.pros} onChange={e => handleChange('pros', e.target.value)} />
        </div>

        <div>
          <label style={labelStyle}>Límites y Riesgos Culturales (Contras)</label>
          <textarea style={{ ...inputStyle, minHeight: '70px' }} value={formData.contras} onChange={e => handleChange('contras', e.target.value)} />
        </div>

        <div>
          <label style={labelStyle}>Veredicto Estratégico Provokers</label>
          <textarea style={{ ...inputStyle, minHeight: '70px' }} value={formData.veredicto} onChange={e => handleChange('veredicto', e.target.value)} />
        </div>
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
