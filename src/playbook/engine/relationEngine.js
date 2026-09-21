// src/playbook/engine/relationEngine.js
// Motor de grafos y relaciones sistémicas entre entidades del estudio etnográfico

import {
  INSIGHTS as DEFAULT_INSIGHTS,
  EVIDENCES as DEFAULT_EVIDENCES,
  TENSIONS as DEFAULT_TENSIONS,
  ACTORS as DEFAULT_ACTORS,
  CONTEXTS as DEFAULT_CONTEXTS,
  BRAND_MATRIX as DEFAULT_BRAND_MATRIX,
  OPPORTUNITIES as DEFAULT_OPPORTUNITIES
} from '../data/playbookDataset.js';

export function buildSystemGraph(customData = {}) {
  const ACTORS = customData.actors || DEFAULT_ACTORS;
  const TENSIONS = customData.tensions || DEFAULT_TENSIONS;
  const BRAND_MATRIX = customData.brandMatrix || DEFAULT_BRAND_MATRIX;
  const CONTEXTS = customData.contexts || DEFAULT_CONTEXTS;
  const OPPORTUNITIES = customData.opportunities || DEFAULT_OPPORTUNITIES;

  const nodes = [];
  const edges = [];

  // 1. Nodos de Actores
  ACTORS.forEach(act => {
    nodes.push({
      id: act.id,
      label: act.nombre.split(' (')[0],
      sublabel: act.nombre.includes('(') ? act.nombre.split('(')[1].replace(')', '') : 'Actor',
      fullTitle: act.nombre,
      type: 'actor',
      column: 0,
      icon: 'actor',
      color: '#7C3AED', // Violeta Provokers
      size: 28,
      data: act
    });
  });

  // 2. Nodos de Contextos de Uso
  CONTEXTS.forEach(ctx => {
    nodes.push({
      id: ctx.id,
      label: ctx.nombre,
      sublabel: 'Contexto de Hábitat',
      fullTitle: ctx.nombre,
      type: 'contexto',
      column: 1,
      icon: 'contexto',
      color: '#0284C7', // Sky Blue
      size: 26,
      data: ctx
    });
  });

  // 3. Nodos de Tensiones
  TENSIONS.forEach(ten => {
    const parts = ten.titulo.split(' vs. ');
    nodes.push({
      id: ten.id,
      label: parts[0],
      sublabel: parts[1] ? `vs. ${parts[1]}` : 'Tensión',
      fullTitle: ten.titulo,
      type: 'tension',
      column: 2,
      icon: 'tension',
      color: '#DC2626', // Crimson Red
      size: 28,
      data: ten
    });
  });

  // 4. Nodos de Marcas y Soluciones
  BRAND_MATRIX.forEach(b => {
    nodes.push({
      id: `brand-${b.marca.toLowerCase()}`,
      label: b.marca,
      sublabel: b.territorio || 'Marca / Categoría',
      fullTitle: `Marca: ${b.marca}`,
      type: 'solucion',
      column: 3,
      icon: 'solucion',
      color: b.color || '#F6911E',
      size: 28,
      data: b
    });
  });

  // Soluciones adicionales
  nodes.push({
    id: 'brand-leche-entera',
    label: 'Leche Entera',
    sublabel: 'Sustituto Familiar ($25)',
    fullTitle: 'Leche Entera de Vaca (Hogar)',
    type: 'solucion',
    column: 3,
    icon: 'solucion',
    color: '#64748B',
    size: 26,
    data: { marca: 'Leche Entera', tipo: 'Alternativa cotidiana' }
  });

  nodes.push({
    id: 'brand-avena-natural',
    label: 'Avena Natural',
    sublabel: 'Estándar Casero',
    fullTitle: 'Avena Natural en Hojuela',
    type: 'solucion',
    column: 3,
    icon: 'solucion',
    color: '#059669',
    size: 26,
    data: { marca: 'Avena Natural', tipo: 'Estándar artesanal' }
  });

  // 5. Nodos de Oportunidades Clave
  OPPORTUNITIES.forEach(opp => {
    nodes.push({
      id: opp.id,
      label: opp.titulo.length > 26 ? opp.titulo.substring(0, 24) + '...' : opp.titulo,
      sublabel: 'Oportunidad de Innovación',
      fullTitle: opp.titulo,
      type: 'oportunidad',
      column: 4,
      icon: 'oportunidad',
      color: '#00B487', // Verde Provokers
      size: 26,
      data: opp
    });
  });

  // --- ARISTAS (RELACIONES) ---
  // Relaciones Mamá -> Actores
  edges.push({ source: 'act-redes', target: 'act-mama', relation: 'Descubrimiento de temas', label: 'Informa duda' });
  edges.push({ source: 'act-mama', target: 'act-pediatra', relation: 'Validación médica', label: 'Pregunta y contrasta' });
  edges.push({ source: 'act-bebe', target: 'act-mama', relation: 'Árbitro de tolerancia', label: 'Acepta o rechaza' });
  edges.push({ source: 'act-abuelos', target: 'act-mama', relation: 'Flexibilización dominical', label: 'Modifica menú' });

  // Relaciones Actores -> Tensiones
  edges.push({ source: 'act-mama', target: 'ten-01', relation: 'Vive tensión', label: 'Exige control vs. calle' });
  edges.push({ source: 'act-bebe', target: 'ten-02', relation: 'Detona integración', label: 'Reclama comer familiar' });
  edges.push({ source: 'act-pediatra', target: 'ten-04', relation: 'Autoriza alternativa', label: 'Permite leche entera' });
  edges.push({ source: 'act-mama', target: 'ten-03', relation: 'Negocia culpa', label: 'Busca descanso y alivio' });

  // Relaciones Tensiones -> Marcas
  edges.push({ source: 'ten-01', target: 'brand-gerber', relation: 'Resuelve con portabilidad', label: 'Kit de contingencia' });
  edges.push({ source: 'ten-02', target: 'brand-nido', relation: 'Cuestiona rol lácteo', label: 'Paso especializado' });
  edges.push({ source: 'ten-02', target: 'brand-leche-entera', relation: 'Sustituto cotidiano', label: 'Bypass al año' });
  edges.push({ source: 'ten-03', target: 'brand-nestum', relation: 'Sustituye avena en 1 min', label: 'Alivio sin culpa' });
  edges.push({ source: 'ten-03', target: 'brand-avena-natural', relation: 'Estándar moral exigente', label: 'Ideal casero' });

  // Relaciones Contextos -> Tensiones y Soluciones
  edges.push({ source: 'ctx-ferias', target: 'ten-01', relation: 'Escenario de fricción', label: 'Sin higiene ni estufa' });
  edges.push({ source: 'ctx-mesa-familiar', target: 'ten-02', relation: 'Detonante de imitación', label: 'El bebé quiere comer igual' });
  edges.push({ source: 'ctx-cocina', target: 'ten-03', relation: 'Gestión del tiempo', label: 'Carrera matutina' });
  edges.push({ source: 'ctx-ferias', target: 'brand-gerber', relation: 'Escenario crítico', label: 'Consumo en puesto' });
  edges.push({ source: 'ctx-cocina', target: 'brand-nestum', relation: 'Optimización de tiempo', label: 'Desayuno exprés' });
  edges.push({ source: 'ctx-mesa-familiar', target: 'brand-leche-entera', relation: 'Integración cultural', label: 'Comida compartida' });

  // Relaciones Marcas -> Oportunidades
  edges.push({ source: 'brand-gerber', target: 'opp-01', relation: 'Extensión a insumos', label: 'Insumos base cocina' });
  edges.push({ source: 'brand-gerber', target: 'opp-03', relation: 'Evolución de empaque', label: 'Kit modular pouch' });
  edges.push({ source: 'brand-nido', target: 'opp-02', relation: 'Defensa de valor', label: 'Seguro de micronutrientes' });
  edges.push({ source: 'brand-nestum', target: 'opp-04', relation: 'Ampliación culinaria', label: 'Mezcla en recetas de casa' });

  return { nodes, edges };
}

export function getEntityConnections(entityId) {
  const { nodes, edges } = buildSystemGraph();
  const directEdges = edges.filter(e => e.source === entityId || e.target === entityId);
  const connectedNodeIds = new Set();

  directEdges.forEach(e => {
    if (e.source === entityId) connectedNodeIds.add(e.target);
    if (e.target === entityId) connectedNodeIds.add(e.source);
  });

  const connectedNodes = nodes.filter(n => connectedNodeIds.has(n.id));
  return { directEdges, connectedNodes };
}
