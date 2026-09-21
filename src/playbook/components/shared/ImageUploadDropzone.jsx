// src/playbook/components/shared/ImageUploadDropzone.jsx
import React, { useState, useRef } from 'react';
import { Icon } from './Icons.jsx';

export default function ImageUploadDropzone({
  value = '',
  onChange,
  onAutoSave = null,
  targetFolder = 'lullaby',
  label = 'Fotografía de Campo',
  placeholder = '/images/lullaby/img-01.jpg',
  aspectRatio = '16/9'
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successBadge, setSuccessBadge] = useState(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    e.target.value = '';
  };

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('El archivo debe ser una imagen (JPG, PNG, WebP, SVG).');
      return;
    }

    setErrorMsg(null);
    setSuccessBadge(null);
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result;

        try {
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              filename: file.name,
              folder: targetFolder,
              base64Data
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.url) {
              onChange(result.url);
              if (onAutoSave) {
                onAutoSave(result.url);
              }
              setSuccessBadge(`✓ Guardada y aplicada: ${result.filename}`);
              setTimeout(() => setSuccessBadge(null), 4500);
            } else {
              throw new Error(result.error || 'No se recibió la URL del servidor.');
            }
          } else {
            // Fallback en memoria si el endpoint local no responde
            console.warn('API local no disponible, usando Data URL local.');
            onChange(base64Data);
            if (onAutoSave) {
              onAutoSave(base64Data);
            }
            setSuccessBadge('✓ Guardada como imagen local.');
            setTimeout(() => setSuccessBadge(null), 4500);
          }
        } catch (fetchErr) {
          console.warn('Fallo en subida local, aplicando fallback Base64:', fetchErr);
          onChange(base64Data);
          if (onAutoSave) {
            onAutoSave(base64Data);
          }
          setSuccessBadge('✓ Foto cargada en memoria.');
          setTimeout(() => setSuccessBadge(null), 4500);
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setErrorMsg('Error al leer el archivo en el navegador.');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMsg('Error procesando el archivo: ' + err.message);
      setIsUploading(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    if (onAutoSave) {
      onAutoSave('');
    }
    setSuccessBadge(null);
    setErrorMsg(null);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon name="camera" size={14} color="#F6911E" />
          {label}
        </label>

        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            fontSize: '0.74rem',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0
          }}
        >
          {showManualInput ? 'Ocultar entrada de texto' : 'Escribir ruta manual'}
        </button>
      </div>

      {/* Zona de Arrastre / Previsualización */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        style={{
          border: isDragging
            ? '2px dashed #F6911E'
            : value
              ? '1px solid #CBD5E1'
              : '2px dashed #CBD5E1',
          borderRadius: '12px',
          backgroundColor: isDragging
            ? '#FFF7ED'
            : value
              ? '#F8FAFC'
              : '#FFFFFF',
          padding: value ? '0.75rem' : '1.5rem 1rem',
          textAlign: 'center',
          cursor: isUploading ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isDragging ? '0 0 0 4px rgba(246, 145, 30, 0.15)' : 'none',
          position: 'relative'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {isUploading ? (
          <div style={{ padding: '1rem', color: '#C25E00', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                border: '3px solid #FFEDD5',
                borderTopColor: '#F6911E',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Guardando imagen en public/images/{targetFolder}...</span>
          </div>
        ) : value ? (
          /* Previsualización de Imagen con Opciones de Reemplazo */
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
            <div
              style={{
                width: '90px',
                aspectRatio: aspectRatio,
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#E2E8F0',
                flexShrink: 0,
                border: '1px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={value}
                alt="Vista previa"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#00B487', backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                  IMAGEN ASOCIADA
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Arrastra otra para reemplazar</span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {value}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAutoSave) {
                    onAutoSave(value);
                  }
                  setSuccessBadge('✓ Ruta guardada correctamente.');
                  setTimeout(() => setSuccessBadge(null), 3500);
                }}
                className="primary-button"
                style={{ fontSize: '0.74rem', padding: '5px 12px', gap: '4px' }}
                title="Guardar ruta inmediatamente"
              >
                💾 Guardar
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="secondary-button"
                style={{ fontSize: '0.74rem', padding: '5px 10px' }}
              >
                Reemplazar
              </button>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Quitar foto"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          /* Estado Vacío: Prompt para Arrastrar */
          <div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: isDragging ? '#FED7AA' : '#FFF7ED',
                color: '#F6911E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto',
                transition: 'transform 0.2s ease'
              }}
            >
              <Icon name="upload" size={22} color="#F6911E" />
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#191919' }}>
              Arrastra y suelta tu foto aquí, o <span style={{ color: '#F6911E', textDecoration: 'underline' }}>haz clic para examinar</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
              JPG, PNG, WebP · Se guardará automáticamente en <code>/public/images/{targetFolder}/</code>
            </div>
          </div>
        )}
      </div>

      {/* Notificaciones de éxito o error */}
      {successBadge && (
        <div style={{ marginTop: '6px', fontSize: '0.74rem', color: '#047857', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ✓ {successBadge}
        </div>
      )}

      {errorMsg && (
        <div style={{ marginTop: '6px', fontSize: '0.74rem', color: '#B91C1C', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '4px 10px', borderRadius: '6px' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Input de texto manual opcional */}
      {showManualInput && (
        <div style={{ marginTop: '8px' }}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              fontSize: '0.82rem',
              padding: '0.5rem 0.75rem',
              width: '100%',
              marginBottom: 0
            }}
          />
        </div>
      )}
    </div>
  );
}
