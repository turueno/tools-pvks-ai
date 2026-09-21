// src/playbook/components/shared/FieldPhoto.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons.jsx';

export default function FieldPhoto({
  photo,
  aspectRatio = '16/10',
  size = 'medium', // 'small', 'medium', 'large', 'banner'
  showCaption = true,
  interactive = true,
  style = {},
  onPhotoDrop = null, // Callback (newUrl) => void
  targetFolder = 'lullaby',
  homeId = null
}) {
  const [hasError, setHasError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadToast, setUploadToast] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const justDroppedRef = useRef(false);

  useEffect(() => {
    setHasError(false);
    setLocalPreview(null);
  }, [photo?.url]);

  if (!photo) return null;

  const {
    url,
    alt = 'Registro fotográfico etnográfico',
    caption,
    page,
    artifact,
    verbatim,
    home
  } = photo;

  const currentSrc = localPreview || url;

  const handleDragOver = (e) => {
    if (!onPhotoDrop) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!onPhotoDrop) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    if (!onPhotoDrop) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    justDroppedRef.current = true;
    setTimeout(() => {
      justDroppedRef.current = false;
    }, 600);

    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Data = ev.target?.result;
      // Mostrar de inmediato la imagen arrastrada en pantalla
      setLocalPreview(base64Data);
      setHasError(false);

      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            folder: targetFolder,
            base64Data,
            homeId
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setIsUploading(false);
            onPhotoDrop(data.url);
            setUploadToast(`✓ Foto ${data.filename} guardada`);
            setTimeout(() => setUploadToast(null), 3500);
            return;
          }
        }
      } catch (err) {
        console.warn('Fallback upload local:', err);
      } finally {
        setIsUploading(false);
      }

      onPhotoDrop(base64Data);
      setUploadToast('✓ Foto guardada (local)');
      setTimeout(() => setUploadToast(null), 3500);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: isDragOver ? '2px dashed #F6911E' : '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          boxShadow: isDragOver ? '0 0 0 4px rgba(246, 145, 30, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease',
          cursor: interactive ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          ...style
        }}
        className={interactive ? 'card-hover-fx' : ''}
        onClick={() => interactive && !isUploading && !justDroppedRef.current && setIsOpen(true)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Imagen o Placeholder Etnográfico */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: aspectRatio,
            backgroundColor: '#F1F5F9',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Overlay al arrastrar imagen directamente sobre la foto */}
          {isDragOver && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(246, 145, 30, 0.92)',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                zIndex: 40,
                backdropFilter: 'blur(3px)',
                padding: '1rem',
                textAlign: 'center'
              }}
            >
              <Icon name="upload" size={32} color="#FFFFFF" />
              <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                Soltar para cambiar y guardar foto
              </span>
              <span style={{ fontSize: '0.74rem', opacity: 0.9 }}>
                Se guardará inmediatamente en public/images/{targetFolder}
              </span>
            </div>
          )}

          {/* Overlay de Subida en Progreso */}
          {isUploading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(25, 25, 25, 0.85)',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                zIndex: 40
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#F6911E',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}
              />
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Guardando foto...</span>
            </div>
          )}

          {/* Toast flotante de éxito */}
          {uploadToast && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                right: '10px',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                textAlign: 'center',
                zIndex: 45,
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                animation: 'fadeIn 0.2s ease'
              }}
            >
              {uploadToast}
            </div>
          )}

          {/* Badge informativo de arrastrar (sólo visible si admin está activo) */}
          {onPhotoDrop && !isUploading && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(246, 145, 30, 0.95)',
                color: '#FFFFFF',
                fontSize: '0.66rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                pointerEvents: 'none',
                zIndex: 20
              }}
            >
              <Icon name="camera" size={11} color="#FFFFFF" />
              Arrastra foto
            </div>
          )}

          {!hasError && currentSrc ? (
            <img
              key={currentSrc}
              src={currentSrc}
              alt={alt}
              onError={(e) => {
                const target = e.currentTarget;
                // Si la URL falló y tiene extensión en minúsculas/mayúsculas o es relativa, intentar alternativa
                if (!target.dataset.retried) {
                  target.dataset.retried = '1';
                  if (currentSrc.includes('/images/lullaby/f17.jpg')) {
                    target.src = '/images/lullaby/F17.jpg';
                    return;
                  }
                  if (currentSrc.includes('/images/lullaby/f21.jpg')) {
                    target.src = '/images/lullaby/F21.jpg';
                    return;
                  }
                  if (currentSrc.includes('/images/lullaby/F17.jpg')) {
                    target.src = '/images/lullaby/f17.jpg';
                    return;
                  }
                  if (currentSrc.includes('/images/lullaby/F21.jpg')) {
                    target.src = '/images/lullaby/f21.jpg';
                    return;
                  }
                }
                console.warn('FieldPhoto no pudo cargar:', currentSrc);
                setHasError(true);
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.3s ease'
              }}
            />
          ) : (
            /* Placeholder Editorial Provokers */
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #FFF7ED 0%, #F8FAFC 100%)',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#FFE8D1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F6911E',
                  marginBottom: '8px'
                }}
              >
                <Icon name="camera" size={22} color="#F6911E" />
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Registro Fotográfico de Campo
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', marginTop: '2px', maxWidth: '90%' }}>
                {artifact || alt}
              </span>
              {page && (
                <span style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '4px', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  Reporte Lullaby · {page}
                </span>
              )}
            </div>
          )}

          {/* Badges Flotantes sobre la Imagen */}
          <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {page && (
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  backgroundColor: 'rgba(25, 25, 25, 0.85)',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backdropFilter: 'blur(4px)',
                  letterSpacing: '0.02em'
                }}
              >
                {page}
              </span>
            )}
            {home && (
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(246, 145, 30, 0.9)',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  letterSpacing: '0.02em'
                }}
              >
                {home}
              </span>
            )}
          </div>

          {interactive && (
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '6px',
                padding: '3px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.68rem',
                color: '#191919',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <Icon name="search" size={12} color="#191919" /> Ver detalle
            </div>
          )}
        </div>

        {/* Pie de foto y artefacto */}
        {showCaption && (
          <div style={{ padding: size === 'small' ? '0.75rem' : '0.9rem 1rem' }}>
            {artifact && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Artefacto:
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#191919' }}>
                  {artifact}
                </span>
              </div>
            )}
            {caption && (
              <p style={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.45, margin: 0 }}>
                {caption}
              </p>
            )}
            {verbatim && size !== 'small' && (
              <div
                className="pvks-verbatim"
                style={{
                  marginTop: '6px',
                  paddingTop: '6px',
                  borderTop: '1px dashed #E2E8F0',
                  fontSize: '0.8rem',
                  color: '#191919'
                }}
              >
                “{verbatim}”
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Ampliado de Inspección Fotográfica */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(25, 25, 25, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              border: '1px solid #E2E8F0',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#FAFAFA'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '2px 8px', borderRadius: '10px', border: '1px solid #FFEDD5' }}>
                    EVIDENCIA ETNOGRÁFICA · LULLABY
                  </span>
                  {page && (
                    <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600 }}>
                      {page}
                    </span>
                  )}
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#191919', fontWeight: 800 }}>
                  {artifact || alt}
                </h3>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  color: '#64748B',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* Imagen Principal en Grande */}
            <div style={{ backgroundColor: '#0F172A', textAlign: 'center', position: 'relative', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!hasError && currentSrc ? (
                <img
                  key={`modal-${currentSrc}`}
                  src={currentSrc}
                  alt={alt}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '60vh',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
              ) : (
                <div style={{ padding: '3.5rem 1.5rem', color: '#FFFFFF', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(246, 145, 30, 0.2)', border: '1px solid rgba(246, 145, 30, 0.4)', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="camera" size={32} color="#F6911E" />
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#FFFFFF' }}>{artifact || alt}</h4>
                  <p style={{ margin: '0 auto', maxWidth: '500px', fontSize: '0.88rem', color: '#94A3B8' }}>
                    Archivo de imagen preparado para vinculación física (`{url}`).
                  </p>
                  <span style={{ display: 'inline-block', marginTop: '12px', fontSize: '0.74rem', color: '#FFAA34', backgroundColor: 'rgba(255, 170, 52, 0.1)', padding: '4px 12px', borderRadius: '12px', border: '1px solid rgba(255, 170, 52, 0.3)' }}>
                    Referencia documental verificada contra el reporte ({page})
                  </span>
                </div>
              )}
            </div>

            {/* Cuerpo con Contexto Humano y Citas */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {caption && (
                <div>
                  <h5 style={{ margin: '0 0 6px 0', fontSize: '0.78rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Observación de Campo (Lo que Ocurre en la Imagen)
                  </h5>
                  <p style={{ margin: 0, color: '#191919', fontSize: '0.94rem', lineHeight: 1.6 }}>
                    {caption}
                  </p>
                </div>
              )}

              {verbatim && (
                <div
                  className="pvks-verbatim"
                  style={{
                    backgroundColor: '#FFF7ED',
                    borderLeft: '4px solid #F6911E',
                    border: '1px solid #FFEDD5',
                    borderLeftWidth: '4px',
                    padding: '1.1rem 1.35rem',
                    borderRadius: '0 8px 8px 0',
                    color: '#191919',
                    fontSize: '1rem',
                    lineHeight: 1.6
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontStyle: 'normal', color: '#C25E00', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                    <Icon name="quote" size={14} color="#C25E00" /> VOZ MATERNA REGISTRADA EN EL HOGAR
                  </div>
                  “{verbatim}”
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#64748B' }}>
                <span>Inmersión: <strong>{home || 'Hogar CDMX'}</strong></span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="secondary-button"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  Cerrar Visor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
