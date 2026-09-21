// src/playbook/components/views/AdminView.jsx
import React, { useState, useRef } from 'react';
import { usePlaybookData } from '../../context/usePlaybookData.js';
import { Icon } from '../shared/Icons.jsx';
import EpistemicBadge from '../EpistemicBadge.jsx';
import FieldPhoto from '../shared/FieldPhoto.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';

export default function AdminView() {
  const {
    data,
    openEditor,
    saveEntity,
    deleteEntity,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
    lastUpdated
  } = usePlaybookData();

  const [activeTab, setActiveTab] = useState('insights');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importDataJSON(json);
        alert('¡Contenido importado exitosamente!');
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetConfirm = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer todo el contenido a los datos de fábrica de Lullaby? Se sobrescribirán los cambios no exportados.')) {
      resetToDefaults();
      alert('Contenido restablecido a la versión de fábrica.');
    }
  };

  const handleDeleteConfirm = (collectionKey, id, label) => {
    if (window.confirm(`¿Eliminar "${label}"? Esta acción no se puede deshacer.`)) {
      deleteEntity(collectionKey, id);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header CMS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
              <EditableText dictKey="playbook.admin.tag" defaultText="PANEL DE CONTROL ADMINISTRATIVO" />
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Última actualización: {new Date(lastUpdated).toLocaleString('es-MX')}
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
            <EditableText dictKey="playbook.admin.title" defaultText="Administrador de Contenidos (CMS)" />
          </h1>
          <p style={{ color: '#475569', fontSize: '0.94rem', margin: '6px 0 0 0', maxWidth: '850px' }}>
            <EditableText dictKey="playbook.admin.desc" defaultText="Edita textos, verbatims, mecanismos causales, rutas fotográficas y tensiones de todo el Insight Playbook. Los cambios se guardan localmente en tu navegador y pueden respaldarse en formato JSON." multiline={true} />
          </p>
        </div>

        {/* Action Bar (Exportar, Importar, Reset) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={exportDataJSON}
            className="secondary-button"
            style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            📥 Exportar JSON
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="secondary-button"
            style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            📤 Importar JSON
          </button>

          <button
            onClick={handleResetConfirm}
            style={{
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FCA5A5',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🔄 Restablecer Fábrica
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Inmersiones Hogar</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#C25E00' }}>{(data.homes || []).length}</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Evidencias</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284c7' }}>{data.evidences.length}</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Fichas Insight</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#F6911E' }}>{data.insights.length}</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Tensiones</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#F23F3B' }}>{data.tensions.length}</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Transiciones</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#00B487' }}>{data.transitions.length}</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Cadenas Decisión</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#775AFF' }}>{data.decisionChains.length}</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Marcas en Matriz</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#191919' }}>{data.brandMatrix.length}</div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', paddingBottom: '2px', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {[
          { id: 'insights', label: `Fichas de Insight (${data.insights.length})`, icon: 'insight' },
          { id: 'homes', label: `Inmersiones Hogar (${(data.homes || []).length})`, icon: 'home' },
          { id: 'evidences', label: `Evidencias (${data.evidences.length})`, icon: 'evidence' },
          { id: 'tensions', label: `Tensiones (${data.tensions.length})`, icon: 'tension' },
          { id: 'transitions', label: `Transiciones (${data.transitions.length})`, icon: 'transition' },
          { id: 'decisions', label: `Cadenas Decisión (${data.decisionChains.length})`, icon: 'decision' },
          { id: 'brandMatrix', label: `Matriz Marcas (${data.brandMatrix.length})`, icon: 'matrix' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                border: 'none',
                borderBottom: isActive ? '3px solid #F6911E' : '3px solid transparent',
                backgroundColor: 'transparent',
                color: isActive ? '#F6911E' : '#64748B',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon name={tab.icon} size={16} color={isActive ? '#F6911E' : '#64748B'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Barra de Filtro y Botón de Creación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
        <input
          type="text"
          placeholder="Buscar en esta colección..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            fontSize: '0.88rem',
            width: 'min(360px, 100%)',
            outline: 'none'
          }}
        />

        {activeTab === 'evidences' && (
          <button
            onClick={() => openEditor('evidence', null)}
            className="primary-button"
            style={{ fontSize: '0.84rem', padding: '8px 16px' }}
          >
            + Nueva Evidencia
          </button>
        )}
        {activeTab === 'insights' && (
          <button
            onClick={() => openEditor('insight', null)}
            className="primary-button"
            style={{ fontSize: '0.84rem', padding: '8px 16px' }}
          >
            + Nueva Ficha de Insight
          </button>
        )}
      </div>

      {/* TAB CONTENT */}

      {/* 1. INSIGHTS */}
      {activeTab === 'insights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.insights
            .filter(ins => {
              if (!searchTerm) return true;
              const q = searchTerm.toLowerCase();
              return ins.titulo.toLowerCase().includes(q) || ins.mecanismo.toLowerCase().includes(q) || ins.id.toLowerCase().includes(q);
            })
            .map(ins => (
              <div
                key={ins.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <EpistemicBadge level={ins.nivelEpistemologico} size="small" />
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>ID: {ins.id}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>· {ins.fuenteReporte}</span>
                    {ins.marcasRelacionadas?.map(m => (
                      <span key={m} style={{ fontSize: '0.7rem', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{m}</span>
                    ))}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#191919', margin: '0 0 6px 0' }}>
                    {ins.titulo}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.86rem', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                    {ins.descripcion}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#0369A1' }}>
                    <strong>⚙️ Mecanismo:</strong> {ins.mecanismo}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignSelf: 'center' }}>
                  <button
                    onClick={() => openEditor('insight', ins)}
                    className="secondary-button"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm('insights', ins.id, ins.titulo)}
                    style={{
                      background: 'none',
                      border: '1px solid #FECACA',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 2. EVIDENCIAS */}
      {activeTab === 'evidences' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {data.evidences
            .filter(ev => {
              if (!searchTerm) return true;
              const q = searchTerm.toLowerCase();
              return ev.titulo.toLowerCase().includes(q) || ev.cita.toLowerCase().includes(q) || ev.codigo.toLowerCase().includes(q);
            })
            .map(ev => (
              <div
                key={ev.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0284c7' }}>[{ev.codigo}] {ev.fuente}</span>
                    <EpistemicBadge level={ev.nivelEpistemologico || 'OBSERVADO'} size="small" />
                  </div>

                  {ev.imagenUrl && (
                    <div style={{ marginBottom: '8px' }}>
                      <FieldPhoto
                        photo={{
                          url: ev.imagenUrl,
                          alt: ev.imagenAlt || ev.titulo,
                          caption: ev.pieEtnografico,
                          page: ev.fuente,
                          artifact: ev.artefactoClave,
                          home: ev.hogar
                        }}
                        size="small"
                        aspectRatio="16/9"
                        showCaption={false}
                        onPhotoDrop={(newUrl) => saveEntity('evidences', { ...ev, imagenUrl: newUrl })}
                      />
                    </div>
                  )}

                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#191919', margin: '0 0 6px 0' }}>
                    {ev.titulo}
                  </h4>
                  <div
                    className="pvks-verbatim"
                    style={{
                      backgroundColor: '#FFF9F2',
                      borderLeft: '3px solid #F6911E',
                      padding: '8px 10px',
                      borderRadius: '0 6px 6px 0',
                      fontSize: '0.84rem',
                      color: '#191919',
                      marginBottom: '6px'
                    }}
                  >
                    “{ev.cita}”
                  </div>
                  {ev.artefactoClave && (
                    <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                      🧰 <strong>Artefacto:</strong> {ev.artefactoClave}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
                  <button
                    onClick={() => openEditor('evidence', ev)}
                    className="secondary-button"
                    style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm('evidences', ev.id, ev.titulo)}
                    style={{
                      background: 'none',
                      border: '1px solid #FECACA',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 3. TENSIONES */}
      {activeTab === 'tensions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.tensions.map(t => (
            <div
              key={t.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 800 }}>Tensión {t.id}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#191919', margin: '2px 0 4px 0' }}>{t.titulo}</h3>
                <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>{t.descripcion}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: '#0284c7' }}>Polo A: <strong>{t.poloA.nombre}</strong></span>
                  <span style={{ color: '#F6911E' }}>Polo B: <strong>{t.poloB.nombre}</strong></span>
                </div>
              </div>
              <button
                onClick={() => openEditor('tension', t)}
                className="secondary-button"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                ✏️ Editar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. TRANSICIONES */}
      {activeTab === 'transitions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.transitions.map(tr => (
            <div
              key={tr.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: '#00B487', fontWeight: 800 }}>{tr.fuente}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#191919', margin: '2px 0 4px 0' }}>{tr.titulo}</h3>
                <p style={{ fontSize: '0.86rem', color: '#64748B', margin: '0 0 6px 0' }}>{tr.descripcion}</p>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <strong>Detonante:</strong> {tr.detonante}
                </div>
              </div>
              <button
                onClick={() => openEditor('transition', tr)}
                className="secondary-button"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                ✏️ Editar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5. CADENAS DE DECISIÓN */}
      {activeTab === 'decisions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.decisionChains.map(dc => (
            <div
              key={dc.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: '#775AFF', fontWeight: 800 }}>{dc.marca} · {dc.fuente}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#191919', margin: '2px 0 4px 0' }}>{dc.titulo}</h3>
                <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>{dc.descripcion}</p>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '6px' }}>
                  {dc.etapas?.length || 0} Etapas de validación configuradas
                </div>
              </div>
              <button
                onClick={() => openEditor('decision', dc)}
                className="secondary-button"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                ✏️ Editar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 6. MATRIZ DE MARCAS */}
      {activeTab === 'brandMatrix' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {data.brandMatrix.map(bm => (
            <div
              key={bm.marca}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: bm.color, margin: '0 0 8px 0' }}>{bm.marca}</h3>
                <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5, margin: '0 0 8px 0' }}>
                  <strong>Momento:</strong> {bm.momentoObservado}
                </p>
                <p style={{ fontSize: '0.84rem', color: '#166534', margin: '0 0 8px 0' }}>
                  <strong>✓ Sostiene:</strong> {bm.sostieneUso}
                </p>
                <p style={{ fontSize: '0.84rem', color: '#991B1B', margin: 0 }}>
                  <strong>⚠️ Pone a prueba:</strong> {bm.poneAPruebaRelevancia}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
                <button
                  onClick={() => openEditor('brand', bm)}
                  className="secondary-button"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  ✏️ Editar Ficha
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. HOGARES / INMERSIONES */}
      {activeTab === 'homes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {(data.homes || []).map(home => (
            <div
              key={home.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '2px 8px', borderRadius: '4px' }}>
                    {home.slides || home.id}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{home.target}</span>
                </div>

                {home.imagenUrl && (
                  <div style={{ marginBottom: '1rem' }}>
                    <FieldPhoto
                      photo={{
                        url: home.imagenUrl,
                        alt: home.imagenAlt || home.name,
                        caption: home.descripcionHabitat,
                        artifact: home.artefacto,
                        home: home.name
                      }}
                      aspectRatio="16/9"
                      size="small"
                      showCaption={false}
                      homeId={home.id}
                      onPhotoDrop={(newUrl) => saveEntity('homes', { ...home, imagenUrl: newUrl })}
                    />
                  </div>
                )}

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#191919', margin: '0 0 6px 0' }}>
                  {home.name}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, margin: '0 0 8px 0' }}>
                  <strong>Foco:</strong> {home.focus}
                </p>
                <div style={{ fontSize: '0.8rem', color: '#64748B', backgroundColor: '#F8FAFC', padding: '8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <strong>Artefacto:</strong> {home.artefacto || 'No especificado'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', marginTop: '1rem' }}>
                <button
                  onClick={() => openEditor('home', home)}
                  className="secondary-button"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  ✏️ Editar Hogar & Foto
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const kpiCardStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: '10px',
  padding: '1rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
};
