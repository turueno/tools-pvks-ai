// src/components/shared/EditableText.jsx
import React, { useState } from 'react';
import { useSuiteDictionary } from '../../context/useSuiteDictionary.js';
import { UI_DICTIONARY_DEFAULTS } from '../../data/uiDictionaryDefaults.js';

export default function EditableText({
  dictKey,
  defaultText = '',
  as = 'span',
  style = {},
  className = '',
  multiline = false,
  children
}) {
  const { t, isMetaAdmin, updateText, resetText } = useSuiteDictionary();
  const [isEditing, setIsEditing] = useState(false);
  
  const currentText = t(dictKey, defaultText || children || '');
  const [tempText, setTempText] = useState(currentText);

  // Si no está en modo Meta-Admin, renderizar limpio sin sobrecarga
  if (!isMetaAdmin) {
    return React.createElement(as, { style, className }, currentText);
  }

  const handleSave = () => {
    updateText(dictKey, tempText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempText(currentText);
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    const defaultVal = UI_DICTIONARY_DEFAULTS[dictKey] || defaultText || '';
    setTempText(defaultVal);
    resetText(dictKey);
    setIsEditing(false);
  };

  const isModified = currentText !== (UI_DICTIONARY_DEFAULTS[dictKey] || defaultText || '');

  if (isEditing) {
    return (
      <span
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'inline-block',
          backgroundColor: '#FFFFFF',
          border: '2px solid #F6911E',
          borderRadius: '8px',
          padding: '6px 8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          minWidth: '220px',
          maxWidth: '100%'
        }}
      >
        <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: '#C25E00', marginBottom: '4px' }}>
          EDITAR TEXTO ESTRUCTURAL: <code>{dictKey}</code>
        </span>
        {multiline ? (
          <textarea
            autoFocus
            rows={3}
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            style={{
              width: '100%',
              fontSize: '0.85rem',
              padding: '6px',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
        ) : (
          <input
            type="text"
            autoFocus
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            style={{
              width: '100%',
              fontSize: '0.85rem',
              padding: '6px',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
        )}
        <span style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleResetToDefault}
            title="Restablecer al texto original de fábrica"
            style={{
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FCA5A5',
              fontSize: '0.72rem',
              padding: '3px 8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ↺ Fábrica
          </button>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              backgroundColor: '#F1F5F9',
              color: '#475569',
              border: '1px solid #CBD5E1',
              fontSize: '0.72rem',
              padding: '3px 8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              backgroundColor: '#F6911E',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ✓ Guardar
          </button>
        </span>
      </span>
    );
  }

  return React.createElement(
    as,
    {
      style: {
        ...style,
        position: 'relative',
        outline: isModified ? '1.5px dashed #F6911E' : '1px dashed rgba(246, 145, 30, 0.45)',
        outlineOffset: '2px',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      },
      className: `${className} meta-editable-hover`,
      onClick: (e) => {
        e.stopPropagation();
        setTempText(currentText);
        setIsEditing(true);
      },
      title: `[Meta-Admin] Clic para editar texto: ${dictKey}`
    },
    currentText,
    React.createElement(
      'span',
      {
        style: {
          display: 'inline-block',
          marginLeft: '4px',
          fontSize: '0.72rem',
          verticalAlign: 'super',
          opacity: 0.75,
          pointerEvents: 'none'
        }
      },
      '✏️'
    )
  );
}
