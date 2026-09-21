// src/components/admin/MetaAdminCMSModal.jsx
import React, { useState, useMemo } from 'react';
import { useSuiteDictionary } from '../../context/useSuiteDictionary.js';
import { UI_DICTIONARY_DEFAULTS, DICTIONARY_SECTIONS } from '../../data/uiDictionaryDefaults.js';

export default function MetaAdminCMSModal() {
  const {
    dictionary,
    isMetaCMSOpen,
    closeMetaCMS,
    updateText,
    resetText,
    resetAll,
    exportDictionaryJSON,
    importDictionaryJSON,
    logoutMetaAdmin,
    updateMasterPass
  } = useSuiteDictionary();

  const [selectedSection, setSelectedSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dictionary'); // 'dictionary' | 'security'

  // Formulario de cambio de contraseña
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  // Input de edición en fila
  const [editingRows, setEditingRows] = useState({});

  // Lista normalizada de todas las claves
  const allKeys = useMemo(() => {
    return Object.keys(UI_DICTIONARY_DEFAULTS);
  }, []);

  // Claves modificadas
  const modifiedKeysCount = useMemo(() => {
    return allKeys.filter(k => dictionary[k] && dictionary[k] !== UI_DICTIONARY_DEFAULTS[k]).length;
  }, [allKeys, dictionary]);

  // Filtrado reactivo
  const filteredKeys = useMemo(() => {
    return allKeys.filter(key => {
      // Filtro de sección
      if (selectedSection !== 'all' && !key.startsWith(selectedSection)) {
        return false;
      }
      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const defaultVal = (UI_DICTIONARY_DEFAULTS[key] || '').toLowerCase();
        const currentVal = (dictionary[key] || '').toLowerCase();
        const keyMatches = key.toLowerCase().includes(q);
        const defaultMatches = defaultVal.includes(q);
        const currentMatches = currentVal.includes(q);
        return keyMatches || defaultMatches || currentMatches;
      }
      return true;
    });
  }, [allKeys, selectedSection, searchQuery, dictionary]);

  if (!isMetaCMSOpen) return null;

  const handleRowChange = (key, val) => {
    setEditingRows(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveRow = (key) => {
    const newVal = editingRows[key] !== undefined ? editingRows[key] : dictionary[key];
    updateText(key, newVal);
    setEditingRows(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleResetRow = (key) => {
    resetText(key);
    setEditingRows(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result;
      if (content) {
        importDictionaryJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePassSubmit = (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });
    if (newPass !== confirmPass) {
      setPassMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }
    const res = updateMasterPass(newPass);
    if (res.success) {
      setPassMsg({ type: 'success', text: '✅ Contraseña maestra actualizada correctamente.' });
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassMsg({ type: 'error', text: res.error || 'Error al actualizar.' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={closeMetaCMS}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          width: '95vw',
          maxWidth: '1280px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}
        className="ritual-enter"
      >
        {/* Header Modal */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '2px 8px', borderRadius: '6px', border: '1px solid #FFEDD5' }}>
                META-ADMINISTRADOR
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Total de copys: <strong>{allKeys.length}</strong> | Personalizados: <strong style={{ color: '#F6911E' }}>{modifiedKeysCount}</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#191919', margin: '4px 0 0 0', letterSpacing: '-0.02em' }}>
              Catálogo Maestro de Copys y Estructura de la Suite
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={exportDictionaryJSON}
              title="Descargar archivo JSON con todos los textos activos"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#1E293B',
                border: '1px solid #CBD5E1',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              📥 Exportar JSON
            </button>

            <label
              title="Subir archivo JSON para restaurar o aplicar textos"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#1E293B',
                border: '1px solid #CBD5E1',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              📤 Importar JSON
              <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
            </label>

            <button
              onClick={resetAll}
              title="Restablecer todos los textos de la suite a fábrica"
              style={{
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FCA5A5',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⚠️ Restablecer Todo
            </button>

            <button
              onClick={logoutMetaAdmin}
              title="Bloquear y salir del modo Meta-Admin"
              style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🔒 Cerrar Sesión
            </button>

            <button
              onClick={closeMetaCMS}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.4rem',
                color: '#64748B',
                cursor: 'pointer',
                marginLeft: '8px'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Selector: Diccionario vs Seguridad */}
        <div style={{ display: 'flex', padding: '0.5rem 1.75rem', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('dictionary')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'dictionary' ? '#FFF7ED' : 'transparent',
              color: activeTab === 'dictionary' ? '#C25E00' : '#64748B',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            📖 Diccionario de Textos ({filteredKeys.length})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'security' ? '#FFF7ED' : 'transparent',
              color: activeTab === 'security' ? '#C25E00' : '#64748B',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            🔐 Seguridad & Clave Maestra
          </button>
        </div>

        {activeTab === 'dictionary' ? (
          <>
            {/* Controles de búsqueda y filtros de sección */}
            <div style={{ padding: '1rem 1.75rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar por clave, texto original o texto editado..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '280px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>

              {/* Pills de Secciones */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                <button
                  onClick={() => setSelectedSection('all')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '16px',
                    border: selectedSection === 'all' ? '1px solid #F6911E' : '1px solid #E2E8F0',
                    backgroundColor: selectedSection === 'all' ? '#FFF7ED' : '#FFFFFF',
                    color: selectedSection === 'all' ? '#C25E00' : '#475569',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Todas las Secciones ({allKeys.length})
                </button>
                {DICTIONARY_SECTIONS.map(sec => {
                  const isSelected = selectedSection === sec.prefix;
                  const count = allKeys.filter(k => k.startsWith(sec.prefix)).length;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setSelectedSection(sec.prefix)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '16px',
                        border: isSelected ? '1px solid #F6911E' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#FFF7ED' : '#FFFFFF',
                        color: isSelected ? '#C25E00' : '#475569',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {sec.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tabla de Textos */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.75rem' }}>
              {filteredKeys.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                  No se encontraron textos que coincidan con los filtros.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredKeys.map(key => {
                    const defaultVal = UI_DICTIONARY_DEFAULTS[key] || '';
                    const currentVal = dictionary[key] !== undefined ? dictionary[key] : defaultVal;
                    const isRowEditing = editingRows[key] !== undefined;
                    const rowValue = isRowEditing ? editingRows[key] : currentVal;
                    const isModified = currentVal !== defaultVal;

                    return (
                      <div
                        key={key}
                        style={{
                          backgroundColor: isModified ? '#FFFDF8' : '#FFFFFF',
                          border: isModified ? '1px solid #F6911E' : '1px solid #E2E8F0',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          display: 'grid',
                          gridTemplateColumns: 'minmax(220px, 1.2fr) minmax(240px, 1.5fr) minmax(280px, 2fr) auto',
                          gap: '14px',
                          alignItems: 'center'
                        }}
                      >
                        {/* Clave semántica */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <code style={{ fontSize: '0.76rem', color: '#0F172A', fontWeight: 700, wordBreak: 'break-all' }}>
                              {key}
                            </code>
                            {isModified && (
                              <span style={{ fontSize: '0.65rem', backgroundColor: '#FFF7ED', color: '#C25E00', border: '1px solid #FFEDD5', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                                EDITADO
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Valor original de fábrica */}
                        <div style={{ fontSize: '0.8rem', color: '#64748B', backgroundColor: '#F8FAFC', padding: '6px 10px', borderRadius: '6px', border: '1px solid #F1F5F9', maxHeight: '70px', overflowY: 'auto' }}>
                          <span style={{ fontSize: '0.66rem', color: '#94A3B8', display: 'block', fontWeight: 700 }}>ORIGINAL FÁBRICA:</span>
                          {defaultVal}
                        </div>

                        {/* Editor de valor activo */}
                        <div>
                          <span style={{ fontSize: '0.66rem', color: '#C25E00', display: 'block', fontWeight: 700, marginBottom: '2px' }}>
                            VALOR ACTIVO EN PANTALLA:
                          </span>
                          {defaultVal.length > 80 ? (
                            <textarea
                              rows={2}
                              value={rowValue}
                              onChange={(e) => handleRowChange(key, e.target.value)}
                              style={{
                                width: '100%',
                                fontSize: '0.84rem',
                                padding: '6px 8px',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                outline: 'none',
                                boxSizing: 'border-box'
                              }}
                            />
                          ) : (
                            <input
                              type="text"
                              value={rowValue}
                              onChange={(e) => handleRowChange(key, e.target.value)}
                              style={{
                                width: '100%',
                                fontSize: '0.84rem',
                                padding: '6px 8px',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                outline: 'none',
                                boxSizing: 'border-box'
                              }}
                            />
                          )}
                        </div>

                        {/* Botones de acción */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {isRowEditing && (
                            <button
                              onClick={() => handleSaveRow(key)}
                              style={{
                                backgroundColor: '#F6911E',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '5px 12px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Guardar
                            </button>
                          )}
                          {isModified && (
                            <button
                              onClick={() => handleResetRow(key)}
                              title="Volver al texto de fábrica"
                              style={{
                                backgroundColor: '#F1F5F9',
                                color: '#64748B',
                                border: '1px solid #E2E8F0',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                cursor: 'pointer'
                              }}
                            >
                              ↺ Fábrica
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Tab de Seguridad y Contraseña */
          <div style={{ flex: 1, padding: '2.5rem', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#191919', marginTop: 0 }}>
                Cambiar Contraseña Maestra de Meta-Admin
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.45 }}>
                Esta contraseña protege las capacidades de edición estructural de la Suite contra modificaciones accidentales por parte de clientes o usuarios generales.
              </p>

              <form onSubmit={handlePassSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Nueva Contraseña:
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Mínimo 4 caracteres..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Confirmar Nueva Contraseña:
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repite la contraseña..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {passMsg.text && (
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: passMsg.type === 'error' ? '#EF4444' : '#10B981' }}>
                    {passMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#F6911E',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Actualizar Contraseña Maestra
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
