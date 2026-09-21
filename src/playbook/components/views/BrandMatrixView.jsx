// src/playbook/components/views/BrandMatrixView.jsx
import React, { useState } from 'react';
import { Icon } from '../shared/Icons.jsx';
import FieldPhoto from '../shared/FieldPhoto.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';
import { usePlaybookData } from '../../context/usePlaybookData.js';
import { TRANSVERSAL_BRIDGE } from '../../data/playbookDataset.js';

export default function BrandMatrixView() {
  const { brandMatrix: BRAND_MATRIX, isAdmin, openEditor } = usePlaybookData();
  const [activeBrandTab, setActiveBrandTab] = useState('ALL');

  const displayedBrands = activeBrandTab === 'ALL'
    ? BRAND_MATRIX
    : BRAND_MATRIX.filter(b => b.marca.toLowerCase() === activeBrandTab.toLowerCase());

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Compacto con Tooltip */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 10px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
            <EditableText dictKey="playbook.matrix.tag" defaultText="SÍNTESIS ESTRATÉGICA · PÁG. 29" />
          </span>
          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
            <EditableText dictKey="playbook.matrix.desc" defaultText="Comparativa transversal del portafolio" />
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#191919', margin: 0, letterSpacing: '-0.02em' }}>
            <EditableText dictKey="playbook.matrix.title" defaultText="Tres Marcas, Tres Lecturas (Matriz Comparativa)" />
          </h1>
          <InfoTooltip
            title="Matriz Transversal de Marcas"
            content="La alimentación no se organiza únicamente por edad cronológica; intervienen horarios, retorno al trabajo, salidas a la calle y apoyo familiar. Nido, Nestum y Gerber operan en momentos psicológicos y funcionales distintos."
            position="right"
            maxWidth={360}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveBrandTab('ALL')}
          style={{
            backgroundColor: activeBrandTab === 'ALL' ? '#FFF7ED' : '#FFFFFF',
            border: activeBrandTab === 'ALL' ? '1.5px solid #F6911E' : '1px solid #E2E8F0',
            color: activeBrandTab === 'ALL' ? '#C25E00' : '#64748B',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: activeBrandTab === 'ALL' ? '0 2px 6px rgba(246, 145, 30, 0.15)' : 'none'
          }}
        >
          Ver las 3 Marcas Juntas
        </button>
        {BRAND_MATRIX.map(b => (
          <button
            key={b.marca}
            onClick={() => setActiveBrandTab(b.marca)}
            style={{
              backgroundColor: activeBrandTab === b.marca ? `${b.color}15` : '#FFFFFF',
              border: activeBrandTab === b.marca ? `1.5px solid ${b.color}` : '1px solid #E2E8F0',
              color: activeBrandTab === b.marca ? b.color : '#64748B',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeBrandTab === b.marca ? `0 2px 6px ${b.color}25` : 'none'
            }}
          >
            {b.marca}
          </button>
        ))}
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${displayedBrands.length}, 1fr)`, gap: '1.5rem', alignItems: 'stretch' }}>
        {displayedBrands.map(b => (
          <div
            key={b.marca}
            className="card-hover-fx"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', backgroundColor: b.color }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#191919', margin: 0, letterSpacing: '-0.02em' }}>
                    {b.marca}
                  </h2>
                  {isAdmin && (
                    <button
                      onClick={() => openEditor('brand', b)}
                      style={{
                        backgroundColor: '#FFF7ED',
                        border: '1.5px solid #F6911E',
                        color: '#C25E00',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Editar ficha de marca"
                    >
                      ✏️ Editar
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: b.color, backgroundColor: `${b.color}15`, border: `1px solid ${b.color}30`, padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  INMERSIÓN CDMX
                </span>
              </div>

              {b.imagenUrl && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <FieldPhoto
                    photo={{
                      url: b.imagenUrl,
                      alt: b.imagenAlt,
                      caption: b.fotoHabitat,
                      page: b.marca === 'Nido' ? 'Págs. 2–10' : b.marca === 'Nestum' ? 'Págs. 11–18' : 'Págs. 19–27',
                      artifact: b.artefacto,
                      home: `Hogar Inmersión ${b.marca}`
                    }}
                    size="medium"
                    aspectRatio="16/9"
                    showCaption={true}
                  />
                </div>
              )}

              {/* 1. Momento Observado */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', fontWeight: 700 }}>
                  Momento Observado en Hogar
                </div>
                <div style={{ color: '#191919', fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 500 }}>
                  {b.momentoObservado}
                </div>
              </div>

              {/* 2. Papel que se Discute */}
              <div style={{ marginBottom: '1.25rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.9rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', fontWeight: 700 }}>
                  Papel que se Discute
                </div>
                <div style={{ color: '#334155', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {b.papelEnDiscusion}
                </div>
              </div>

              {/* 3. Qué Sostiene su Uso */}
              <div style={{ marginBottom: '1.25rem', backgroundColor: '#F0FDF4', borderLeft: '3px solid #16A34A', border: '1px solid #DCFCE7', borderLeftWidth: '3px', padding: '0.9rem', borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontSize: '0.72rem', color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', fontWeight: 700 }}>
                  ✓ Qué Sostiene su Uso
                </div>
                <div style={{ color: '#166534', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {b.sostieneUso}
                </div>
              </div>

              {/* 4. Qué Pone a Prueba su Relevancia */}
              <div style={{ marginBottom: '1.25rem', backgroundColor: '#FEF2F2', borderLeft: '3px solid #DC2626', border: '1px solid #FEE2E2', borderLeftWidth: '3px', padding: '0.9rem', borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontSize: '0.72rem', color: '#B91C1C', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', fontWeight: 700 }}>
                  ⚠️ Qué Pone a Prueba su Relevancia
                </div>
                <div style={{ color: '#991B1B', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {b.poneAPruebaRelevancia}
                </div>
              </div>
            </div>

            {/* Estrategia Recomendada */}
            <div style={{ marginTop: '1rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: b.color, textTransform: 'uppercase', marginBottom: '4px' }}>
                🎯 Imperativo Estratégico
              </div>
              <p style={{ color: '#191919', fontSize: '0.88rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                {b.estrategiaRecomendada}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

