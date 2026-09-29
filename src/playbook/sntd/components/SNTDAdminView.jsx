// src/playbook/sntd/components/SNTDAdminView.jsx
import React, { useState, useRef } from 'react';
import { useSNTDData } from '../context/SNTDDataContext.jsx';
import { Icon } from '../../components/shared/Icons.jsx';
import EpistemicBadge from '../../components/EpistemicBadge.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';

export default function SNTDAdminView() {
  const {
    data,
    evidences,
    insights,
    tensions,
    brands,
    openEditor,
    deleteEntity,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
    lastUpdated
  } = useSNTDData();

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
        alert('¡Contenido S.N.T.D. importado exitosamente!');
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetConfirm = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer todo el contenido a los datos de fábrica de S.N.T.D.? Se sobrescribirán los cambios locales no exportados.')) {
      resetToDefaults();
      alert('Contenido restablecido a la versión de fábrica.');
    }
  };

  const handleDeleteConfirm = (collectionKey, idOrKey, label) => {
    if (window.confirm(`¿Eliminar "${label}"? Esta acción no se puede deshacer.`)) {
      deleteEntity(collectionKey, idOrKey);
    }
  };

  // Filtrado según búsqueda local de la tabla
  const filterList = (list, fields) => {
    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(item => {
      return fields.some(f => {
        const val = item[f];
        if (!val) return false;
        if (Array.isArray(val)) return val.some(v => String(v).toLowerCase().includes(q));
        return String(val).toLowerCase().includes(q);
      });
    });
  };

  const filteredInsights = filterList(insights, ['id', 'titulo', 'mecanismo', 'tension', 'gatewayId']);
  const filteredEvidences = filterList(evidences, ['id', 'titulo', 'contenido', 'plazaId', 'gatewayId', 'brandId']);
  const filteredTensions = filterList(tensions, ['id', 'titulo', 'tension', 'poloA', 'poloB', 'gatewayId']);
  const filteredBrands = filterList(brands, ['name', 'pros', 'contras', 'veredicto']);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header CMS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C25E00', backgroundColor: '#FFF7ED', padding: '3px 8px', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
              <EditableText dictKey="sntd.admin.tag" defaultText="PANEL DE CONTROL ADMINISTRATIVO · S.N.T.D." />
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Última actualización: {new Date(lastUpdated).toLocaleString('es-MX')}
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
            <EditableText dictKey="sntd.admin.title" defaultText="Administrador de Contenidos (CMS)" />
          </h1>
          <p style={{ color: '#475569', fontSize: '0.94rem', margin: '6px 0 0 0', maxWidth: '850px' }}>
            <EditableText dictKey="sntd.admin.desc" defaultText="Edita textos, verbatims etnográficos, mecanismos causales de 17 campos, fotografías de campo y tensiones dialécticas de S.N.T.D. Los cambios se persisten en tiempo real en tu navegador y pueden respaldarse en JSON." multiline={true} />
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
              border: '1px solid #FECACA',
              color: '#DC2626',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ⚠️ Restablecer a Fábrica
          </button>
        </div>
      </div>

      {/* KPI Cards de Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div
          onClick={() => setActiveTab('insights')}
          style={{
            backgroundColor: activeTab === 'insights' ? '#FFF7ED' : '#FFFFFF',
            border: activeTab === 'insights' ? '2px solid #F6911E' : '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#C25E00', textTransform: 'uppercase' }}>Fichas de Insight</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#191919', marginTop: '4px' }}>{insights.length}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>17 Campos epistemológicos</div>
        </div>

        <div
          onClick={() => setActiveTab('evidences')}
          style={{
            backgroundColor: activeTab === 'evidences' ? '#F0F9FF' : '#FFFFFF',
            border: activeTab === 'evidences' ? '2px solid #0284C7' : '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' }}>Evidencias Etnográficas</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#191919', marginTop: '4px' }}>{evidences.length}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>Citas, fotos y retail</div>
        </div>

        <div
          onClick={() => setActiveTab('tensions')}
          style={{
            backgroundColor: activeTab === 'tensions' ? '#FEF2F2' : '#FFFFFF',
            border: activeTab === 'tensions' ? '2px solid #DC2626' : '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>Tensiones Dialécticas</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#191919', marginTop: '4px' }}>{tensions.length}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>Polos A vs Polo B</div>
        </div>

        <div
          onClick={() => setActiveTab('brands')}
          style={{
            backgroundColor: activeTab === 'brands' ? '#F5F3FF' : '#FFFFFF',
            border: activeTab === 'brands' ? '2px solid #7C3AED' : '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase' }}>Marcas Sabritas</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#191919', marginTop: '4px' }}>{brands.length}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>Pros, contras y veredictos</div>
        </div>
      </div>

      {/* Navegación por Pestañas del CMS y Buscador Interno */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'insights', label: `Fichas de Insight (${insights.length})` },
            { id: 'evidences', label: `Evidencias (${evidences.length})` },
            { id: 'tensions', label: `Tensiones (${tensions.length})` },
            { id: 'brands', label: `Marcas Sabritas (${brands.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #F6911E' : '2px solid transparent',
                color: activeTab === tab.id ? '#F6911E' : '#64748B',
                fontWeight: activeTab === tab.id ? 800 : 500,
                padding: '10px 14px',
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder={`Buscar en ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.82rem',
              width: '220px'
            }}
          />

          <button
            onClick={() => {
              if (activeTab === 'insights') openEditor('insight', {});
              if (activeTab === 'evidences') openEditor('evidence', {});
              if (activeTab === 'tensions') openEditor('tension', {});
              if (activeTab === 'brands') openEditor('brand', {});
            }}
            className="primary-button"
            style={{ fontSize: '0.82rem', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            + Añadir Registro
          </button>
        </div>
      </div>

      {/* TABLA: INSIGHTS */}
      {activeTab === 'insights' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Código</th>
                <th style={{ padding: '12px 16px' }}>Nivel</th>
                <th style={{ padding: '12px 16px' }}>Gateway</th>
                <th style={{ padding: '12px 16px' }}>Título</th>
                <th style={{ padding: '12px 16px' }}>Mecanismo Causal</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInsights.map(ins => (
                <tr key={ins.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: '#C25E00' }}>{ins.id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <EpistemicBadge level={ins.nivelEpistemologico || ins.epistemic} size="small" />
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>{ins.gatewayId}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#191919', maxWidth: '240px' }}>{ins.titulo}</td>
                  <td style={{ padding: '12px 16px', color: '#475569', maxWidth: '300px', fontSize: '0.8rem' }}>
                    {ins.mecanismo ? ins.mecanismo.substring(0, 90) + '...' : '-'}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => openEditor('insight', ins)}
                      className="secondary-button"
                      style={{ fontSize: '0.74rem', padding: '4px 8px', marginRight: '6px' }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm('insights', ins.id, ins.titulo)}
                      style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: '6px', fontSize: '0.74rem', padding: '4px 8px', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLA: EVIDENCIAS */}
      {activeTab === 'evidences' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Código</th>
                <th style={{ padding: '12px 16px' }}>Plaza</th>
                <th style={{ padding: '12px 16px' }}>Gateway</th>
                <th style={{ padding: '12px 16px' }}>Título</th>
                <th style={{ padding: '12px 16px' }}>Cita Verbatim</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvidences.map(ev => (
                <tr key={ev.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0369A1' }}>{ev.id}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>{ev.plazaId}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>{ev.gatewayId}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#191919', maxWidth: '200px' }}>{ev.titulo}</td>
                  <td style={{ padding: '12px 16px', color: '#475569', maxWidth: '340px', fontStyle: 'italic', fontSize: '0.8rem' }}>
                    "{ev.contenido.substring(0, 95)}..."
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => openEditor('evidence', ev)}
                      className="secondary-button"
                      style={{ fontSize: '0.74rem', padding: '4px 8px', marginRight: '6px' }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm('evidences', ev.id, ev.titulo)}
                      style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: '6px', fontSize: '0.74rem', padding: '4px 8px', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLA: TENSIONES */}
      {activeTab === 'tensions' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Código</th>
                <th style={{ padding: '12px 16px' }}>Gateway</th>
                <th style={{ padding: '12px 16px' }}>Título</th>
                <th style={{ padding: '12px 16px' }}>Formulación Dialéctica</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTensions.map(ten => (
                <tr key={ten.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: '#DC2626' }}>{ten.id}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>{ten.gatewayId}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#191919', maxWidth: '200px' }}>{ten.titulo}</td>
                  <td style={{ padding: '12px 16px', color: '#475569', maxWidth: '340px', fontSize: '0.8rem' }}>{ten.tension}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => openEditor('tension', ten)}
                      className="secondary-button"
                      style={{ fontSize: '0.74rem', padding: '4px 8px', marginRight: '6px' }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm('tensions', ten.id, ten.titulo)}
                      style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: '6px', fontSize: '0.74rem', padding: '4px 8px', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLA: MARCAS */}
      {activeTab === 'brands' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Marca</th>
                <th style={{ padding: '12px 16px' }}>Factores Clave (Pros)</th>
                <th style={{ padding: '12px 16px' }}>Límites Culturales (Contras)</th>
                <th style={{ padding: '12px 16px' }}>Veredicto Provokers</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map(br => (
                <tr key={br.name} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: '#F6911E' }}>{br.name}</td>
                  <td style={{ padding: '12px 16px', color: '#16A34A', maxWidth: '240px', fontSize: '0.8rem' }}>{br.pros}</td>
                  <td style={{ padding: '12px 16px', color: '#DC2626', maxWidth: '240px', fontSize: '0.8rem' }}>{br.contras}</td>
                  <td style={{ padding: '12px 16px', color: '#475569', maxWidth: '260px', fontSize: '0.8rem' }}>{br.veredicto}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => openEditor('brand', br)}
                      className="secondary-button"
                      style={{ fontSize: '0.74rem', padding: '4px 8px', marginRight: '6px' }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm('brands', br.name, br.name)}
                      style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: '6px', fontSize: '0.74rem', padding: '4px 8px', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
