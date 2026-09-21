// src/playbook/components/views/SystemMapsView.jsx
import React, { useState, useMemo } from 'react';
import { Icon } from '../shared/Icons.jsx';
import InfoTooltip from '../shared/InfoTooltip.jsx';
import EditableText from '../../../components/shared/EditableText.jsx';
import { buildSystemGraph, getEntityConnections } from '../../engine/relationEngine.js';
import { usePlaybookData } from '../../context/usePlaybookData.js';

export default function SystemMapsView({ onInspectEntity, onSimulateEntity }) {
  const { data } = usePlaybookData();
  const { nodes: rawNodes, edges: rawEdges } = useMemo(() => buildSystemGraph(data), [data]);
  const [selectedNodeType, setSelectedNodeType] = useState('ALL');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [zoom, setZoom] = useState(1);

  const CANVAS_WIDTH = 1180;
  const CANVAS_HEIGHT = 620;
  const NODE_WIDTH = 172;
  const NODE_HEIGHT = 44;

  const COLUMNS_CONFIG = [
    { id: 'actor', title: '1. ACTORES', subtitle: 'Quiénes influyen', x: 40, color: '#7C3AED' },
    { id: 'contexto', title: '2. CONTEXTOS', subtitle: 'Dónde ocurre', x: 275, color: '#0284C7' },
    { id: 'tension', title: '3. TENSIONES', subtitle: 'Puntos de fricción', x: 510, color: '#DC2626' },
    { id: 'solucion', title: '4. MARCAS / SOLUCIONES', subtitle: 'Respuestas de mercado', x: 745, color: '#F6911E' },
    { id: 'oportunidad', title: '5. OPORTUNIDADES', subtitle: 'Áreas de innovación', x: 975, color: '#00B487' }
  ];

  const positionedNodes = useMemo(() => {
    // Agrupar nodos por columna
    const cols = [[], [], [], [], []];
    rawNodes.forEach(n => {
      const colIdx = (typeof n.column === 'number' && n.column >= 0 && n.column <= 4) ? n.column : 0;
      cols[colIdx].push(n);
    });

    const result = [];
    const topMargin = 78;
    const availableHeight = CANVAS_HEIGHT - topMargin - 20;

    cols.forEach((nodesInCol, colIdx) => {
      const count = nodesInCol.length;
      if (count === 0) return;
      const x = COLUMNS_CONFIG[colIdx].x;
      const totalNodesHeight = count * NODE_HEIGHT;
      const gap = count > 1 ? Math.min(32, Math.max(10, (availableHeight - totalNodesHeight) / (count - 1))) : 0;
      const columnContentHeight = totalNodesHeight + gap * (count - 1);
      const startY = topMargin + Math.max(10, (availableHeight - columnContentHeight) / 2);

      nodesInCol.forEach((node, nodeIdx) => {
        const y = Math.round(startY + nodeIdx * (NODE_HEIGHT + gap));
        result.push({
          ...node,
          x,
          y,
          width: NODE_WIDTH,
          height: NODE_HEIGHT
        });
      });
    });

    return result;
  }, [rawNodes]);

  const nodeMap = useMemo(() => {
    const map = {};
    positionedNodes.forEach(n => {
      map[n.id] = n;
    });
    return map;
  }, [positionedNodes]);

  const filteredNodeIds = useMemo(() => {
    return new Set(
      positionedNodes
        .filter(n => selectedNodeType === 'ALL' || n.type === selectedNodeType)
        .map(n => n.id)
    );
  }, [positionedNodes, selectedNodeType]);

  const activeEdges = useMemo(() => {
    return rawEdges.filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target));
  }, [rawEdges, filteredNodeIds]);

  const selectedConnections = useMemo(() => {
    if (!selectedNodeId) return null;
    return getEntityConnections(selectedNodeId);
  }, [selectedNodeId]);

  const selectedNode = positionedNodes.find(n => n.id === selectedNodeId);

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header Compacto con Tooltip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4338CA', backgroundColor: '#EEF2FF', padding: '3px 8px', borderRadius: '12px' }}>
              <EditableText dictKey="playbook.maps.tag" defaultText="PIPELINE RELACIONAL (L-to-R)" />
            </span>
            <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
              <EditableText dictKey="playbook.maps.desc" defaultText="Flujo de causalidad: Actores → Contextos → Tensiones → Marcas → Oportunidades" />
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#191919', margin: 0 }}>
              <EditableText dictKey="playbook.maps.title" defaultText="System Maps: Red Sistémica" />
            </h1>
            <InfoTooltip
              title="Pipeline Causal y Relacional"
              content="Visualiza de izquierda a derecha cómo los actores y contextos detonan tensiones reales en el hogar, cómo responden las marcas y qué oportunidades de innovación surgen. Haz clic en cualquier tarjeta para aislar sus vínculos."
              position="right"
              maxWidth={360}
            />
          </div>
        </div>

        {/* Controles de Filtro y Zoom */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={selectedNodeType}
            onChange={(e) => setSelectedNodeType(e.target.value)}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '7px 12px',
              color: '#191919',
              fontSize: '0.84rem',
              marginBottom: 0
            }}
          >
            <option value="ALL">Mostrar todas las columnas</option>
            <option value="actor">👤 Columna 1: Actores</option>
            <option value="contexto">📍 Columna 2: Contextos</option>
            <option value="tension">⚡ Columna 3: Tensiones</option>
            <option value="solucion">🏷️ Columna 4: Marcas / Soluciones</option>
            <option value="oportunidad">✨ Columna 5: Oportunidades</option>
          </select>

          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#FFFFFF', padding: '3px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
              style={{ background: 'none', border: 'none', color: '#191919', padding: '4px 8px', cursor: 'pointer', fontWeight: 700 }}
              title="Alejar"
            >
              -
            </button>
            <span style={{ fontSize: '0.78rem', color: '#64748B', padding: '4px 2px', fontWeight: 600 }}>{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
              style={{ background: 'none', border: 'none', color: '#191919', padding: '4px 8px', cursor: 'pointer', fontWeight: 700 }}
              title="Acercar"
            >
              +
            </button>
            <button
              onClick={() => { setZoom(1); setSelectedNodeId(null); }}
              style={{ background: 'none', border: 'none', color: '#F6911E', padding: '4px 6px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700 }}
              title="Resetear vista"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Canvas & Inspector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedNodeId ? '1fr 340px' : '1fr', gap: '1.5rem', transition: 'all 0.3s ease' }}>
        {/* SVG Container */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '620px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
            style={{
              transform: `scale(${zoom})`,
              transition: 'transform 0.2s ease',
              userSelect: 'none'
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="9"
                markerHeight="7"
                refX="8"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 9 3.5, 0 7" fill="#F6911E" />
              </marker>

              {/* Filtro de sombra suave para tarjetas seleccionadas */}
              <filter id="card-shadow" x="-10%" y="-10%" width="125%" height="125%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.08" />
              </filter>
              <filter id="active-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#F6911E" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Cabeceras y Columnas Visuales */}
            <g className="columns-header-layer">
              {COLUMNS_CONFIG.map((col, idx) => (
                <g key={col.id} transform={`translate(${col.x}, 20)`}>
                  {/* Fondo sutil de columna */}
                  <rect
                    x={-8}
                    y={0}
                    width={NODE_WIDTH + 16}
                    height={CANVAS_HEIGHT - 35}
                    rx={8}
                    fill="#F1F5F9"
                    fillOpacity={0.45}
                  />
                  {/* Píldora de cabecera */}
                  <rect
                    x={0}
                    y={0}
                    width={NODE_WIDTH}
                    height={34}
                    rx={6}
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth={1}
                  />
                  <line x1={0} y1={33} x2={NODE_WIDTH} y2={33} stroke={col.color} strokeWidth={2} />
                  <text
                    x={10}
                    y={16}
                    fill={col.color}
                    fontSize="10"
                    fontWeight="800"
                    letterSpacing="0.5"
                  >
                    {col.title}
                  </text>
                  <text
                    x={10}
                    y={28}
                    fill="#64748B"
                    fontSize="8.5"
                    fontWeight="500"
                  >
                    {col.subtitle}
                  </text>
                </g>
              ))}
            </g>

            {/* Capa de Aristas / Conectores Bézier */}
            <g className="edges-layer">
              {activeEdges.map((e, idx) => {
                const sNode = nodeMap[e.source];
                const tNode = nodeMap[e.target];
                if (!sNode || !tNode) return null;

                const isConnected = selectedNodeId === e.source || selectedNodeId === e.target;
                const isDimmed = selectedNodeId && !isConnected;

                // Conexión L-to-R: del borde derecho del nodo origen al borde izquierdo del nodo destino
                const isForward = tNode.x > sNode.x;
                const x1 = isForward ? sNode.x + sNode.width : sNode.x;
                const y1 = sNode.y + sNode.height / 2;
                const x2 = isForward ? tNode.x : tNode.x + tNode.width;
                const y2 = tNode.y + tNode.height / 2;

                let d = '';
                if (isForward) {
                  const dx = Math.abs(x2 - x1) * 0.5;
                  d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
                } else if (sNode.column === tNode.column) {
                  // Mismo carril (intra-columna)
                  const curveOffset = 30;
                  d = `M ${sNode.x} ${y1} C ${sNode.x - curveOffset} ${y1}, ${tNode.x - curveOffset} ${y2}, ${tNode.x} ${y2}`;
                } else {
                  // Hacia atrás
                  const midY = Math.min(y1, y2) - 40;
                  d = `M ${x1} ${y1} C ${x1 - 40} ${midY}, ${x2 + 40} ${midY}, ${x2} ${y2}`;
                }

                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;

                return (
                  <g key={idx} opacity={isDimmed ? 0.08 : isConnected ? 1 : 0.4}>
                    <path
                      d={d}
                      fill="none"
                      stroke={isConnected ? '#F6911E' : '#CBD5E1'}
                      strokeWidth={isConnected ? 2.5 : 1.3}
                      strokeDasharray={isConnected ? 'none' : '4 3'}
                      markerEnd={isConnected ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                      style={{ transition: 'opacity 0.2s, stroke-width 0.2s' }}
                    />
                    {isConnected && e.label && (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x={-e.label.length * 3.2 - 6}
                          y={-10}
                          width={e.label.length * 6.4 + 12}
                          height={16}
                          rx={4}
                          fill="#1E293B"
                          fillOpacity={0.9}
                        />
                        <text
                          x={0}
                          y={2}
                          fill="#FFFFFF"
                          fontSize="8.5"
                          textAnchor="middle"
                          fontWeight="700"
                        >
                          {e.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Capa de Nodos (Tarjetas / Pills Horizontales) */}
            <g className="nodes-layer">
              {positionedNodes.map(n => {
                if (!filteredNodeIds.has(n.id)) return null;
                const isSelected = selectedNodeId === n.id;
                const isNeighbor = selectedConnections?.connectedNodes.some(cn => cn.id === n.id);
                const isDimmed = selectedNodeId && !isSelected && !isNeighbor;

                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x}, ${n.y})`}
                    onClick={() => setSelectedNodeId(prev => prev === n.id ? null : n.id)}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                    opacity={isDimmed ? 0.25 : 1}
                  >
                    {/* Glow exterior si está seleccionado */}
                    {isSelected && (
                      <rect
                        x={-3}
                        y={-3}
                        width={n.width + 6}
                        height={n.height + 6}
                        rx={10}
                        fill="none"
                        stroke="#F6911E"
                        strokeWidth={2}
                        strokeDasharray="4 2"
                        className="pulse-glow"
                      />
                    )}

                    {/* Tarjeta de fondo */}
                    <rect
                      x={0}
                      y={0}
                      width={n.width}
                      height={n.height}
                      rx={8}
                      fill="#FFFFFF"
                      stroke={isSelected ? '#F6911E' : isNeighbor ? '#CBD5E1' : '#E2E8F0'}
                      strokeWidth={isSelected ? 2 : 1}
                      filter={isSelected ? 'url(#active-shadow)' : 'url(#card-shadow)'}
                    />

                    {/* Indicador de acento lateral izquierdo */}
                    <path
                      d={`M 0 8 Q 0 0 8 0 L 10 0 L 10 ${n.height} L 8 ${n.height} Q 0 ${n.height} 0 ${n.height - 8} Z`}
                      fill={n.color}
                    />

                    {/* Icono / Avatar lateral */}
                    <circle
                      cx={24}
                      cy={n.height / 2}
                      r={11}
                      fill={`${n.color}18`}
                      stroke={n.color}
                      strokeWidth={1}
                    />
                    <text
                      x={24}
                      y={n.height / 2 + 3.5}
                      textAnchor="middle"
                      fill={n.color}
                      fontSize="9.5"
                      fontWeight="800"
                      pointerEvents="none"
                    >
                      {n.type === 'actor' ? '👤' : n.type === 'contexto' ? '📍' : n.type === 'tension' ? '⚡' : n.type === 'solucion' ? '🏷️' : '✨'}
                    </text>

                    {/* Línea 1: Título principal (100% legible, sin cortar con ...) */}
                    <text
                      x={41}
                      y={18}
                      fill={isSelected ? '#191919' : '#1E293B'}
                      fontSize="10.5"
                      fontWeight={isSelected ? '800' : '700'}
                      pointerEvents="none"
                    >
                      {n.label}
                    </text>

                    {/* Línea 2: Subtítulo / Rol / Contexto descriptivo */}
                    <text
                      x={41}
                      y={32}
                      fill={isSelected ? n.color : '#64748B'}
                      fontSize="8.5"
                      fontWeight="500"
                      pointerEvents="none"
                    >
                      {n.sublabel || n.type}
                    </text>

                    {/* Puntos de anclaje visual de conector */}
                    <circle cx={0} cy={n.height / 2} r={2.5} fill={isSelected ? '#F6911E' : '#94A3B8'} opacity={0.6} />
                    <circle cx={n.width} cy={n.height / 2} r={2.5} fill={isSelected ? '#F6911E' : '#94A3B8'} opacity={0.6} />
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Leyenda */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              backgroundColor: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              gap: '12px',
              fontSize: '0.78rem',
              color: '#475569',
              fontWeight: 600
            }}
          >
            <span><span style={{ color: '#7C3AED' }}>●</span> 1. Actores</span>
            <span><span style={{ color: '#0284C7' }}>●</span> 2. Contextos</span>
            <span><span style={{ color: '#DC2626' }}>●</span> 3. Tensiones</span>
            <span><span style={{ color: '#F6911E' }}>●</span> 4. Marcas</span>
            <span><span style={{ color: '#00B487' }}>●</span> 5. Oportunidades</span>
          </div>
        </div>

        {/* Panel Lateral de Detalle */}
        {selectedNode && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              maxHeight: '600px',
              overflowY: 'auto'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: selectedNode.color,
                    backgroundColor: `${selectedNode.color}15`,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                >
                  {selectedNode.type}
                </span>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                >
                  <Icon name="close" size={16} />
                </button>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#191919', margin: '0 0 10px 0' }}>
                {selectedNode.fullTitle}
              </h3>

              {selectedNode.data?.descripcion && (
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {selectedNode.data.descripcion}
                </p>
              )}

              {selectedNode.data?.citas && (
                <div
                  className="pvks-verbatim"
                  style={{
                    backgroundColor: '#FFF9F2',
                    borderLeft: '3px solid #F6911E',
                    padding: '0.75rem',
                    borderRadius: '0 6px 6px 0',
                    fontSize: '0.84rem',
                    color: '#191919',
                    marginBottom: '1rem'
                  }}
                >
                  “{selectedNode.data.citas[0]}”
                </div>
              )}

              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ fontSize: '0.78rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                  Relaciones Conectadas ({selectedConnections?.connectedNodes.length || 0}):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedConnections?.connectedNodes.map(cn => (
                    <div
                      key={cn.id}
                      onClick={() => setSelectedNodeId(cn.id)}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.84rem',
                        color: '#191919',
                        fontWeight: 600
                      }}
                      className="card-hover-fx"
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: cn.color }}>●</span> {cn.label}
                      </span>
                      <Icon name="chevron-right" size={14} color="#94A3B8" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => onSimulateEntity && onSimulateEntity(selectedNode.data || selectedNode)}
                className="primary-button"
                style={{ width: '100%', fontSize: '0.82rem', padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Icon name="scenario" size={15} /> Simular en Scenario Lab
              </button>
              <button
                onClick={() => onInspectEntity(selectedNode.data || selectedNode)}
                className="secondary-button"
                style={{ width: '100%', fontSize: '0.82rem', padding: '8px' }}
              >
                Inspeccionar en Drawer Completo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
