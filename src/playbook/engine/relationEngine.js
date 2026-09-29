// src/playbook/engine/relationEngine.js
// Motor de grafos y relaciones sistémicas dinámicas entre entidades del Playbook

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
  const isLullaby = !customData?.id || customData?.id === 'lullaby-cdmx-2026';

  const ACTORS = (customData.actors && customData.actors.length > 0)
    ? customData.actors
    : (isLullaby ? DEFAULT_ACTORS : [
        { id: 'actor-1', nombre: 'Usuario Clave', rol: 'Decisor y sujeto de estudio' },
        { id: 'actor-2', nombre: 'Punto de Contacto / Servicio', rol: 'Facilitador del canal' }
      ]);

  const TENSIONS = (customData.tensions && customData.tensions.length > 0)
    ? customData.tensions
    : (isLullaby ? DEFAULT_TENSIONS : []);

  const BRAND_MATRIX = (customData.brandMatrix && customData.brandMatrix.length > 0)
    ? customData.brandMatrix
    : (isLullaby ? DEFAULT_BRAND_MATRIX : (
        customData.primaryBrand
          ? [{ marca: customData.primaryBrand, rol: 'Marca Principal', color: '#F6911E' }]
          : [{ marca: 'Marca / Solución', rol: 'Solución Central', color: '#F6911E' }]
      ));

  const CONTEXTS = (customData.contexts && customData.contexts.length > 0)
    ? customData.contexts
    : (isLullaby ? DEFAULT_CONTEXTS : [
        { id: 'ctx-1', nombre: 'Contexto Habitual', descripcion: 'Entorno cotidiano de interacción' }
      ]);

  const OPPORTUNITIES = (customData.opportunities && customData.opportunities.length > 0)
    ? customData.opportunities
    : (isLullaby ? DEFAULT_OPPORTUNITIES : []);

  const nodes = [];
  const edges = [];

  // 1. Nodos de Actores (Columna 0)
  ACTORS.forEach(act => {
    const actName = act.nombre || act.name || 'Actor';
    nodes.push({
      id: act.id,
      label: actName.split(' (')[0].slice(0, 25),
      sublabel: act.rol ? act.rol.slice(0, 26) : (actName.includes('(') ? actName.split('(')[1].replace(')', '') : 'Actor Clave'),
      fullTitle: actName,
      type: 'actor',
      column: 0,
      icon: 'actor',
      color: '#7C3AED',
      size: 28,
      data: act
    });
  });

  // 2. Nodos de Contextos de Uso (Columna 1)
  CONTEXTS.forEach(ctx => {
    const ctxName = ctx.nombre || ctx.name || 'Contexto';
    nodes.push({
      id: ctx.id,
      label: ctxName.slice(0, 24),
      sublabel: ctx.descripcion ? ctx.descripcion.slice(0, 26) : 'Momento de Estudio',
      fullTitle: ctxName,
      type: 'contexto',
      column: 1,
      icon: 'contexto',
      color: '#0284C7',
      size: 26,
      data: ctx
    });
  });

  // 3. Nodos de Tensiones (Columna 2)
  TENSIONS.forEach(ten => {
    const rawTitle = ten.titulo || ten.formulacion || 'Tensión';
    const parts = rawTitle.includes(' vs. ') ? rawTitle.split(' vs. ') : (rawTitle.includes(' vs ') ? rawTitle.split(' vs ') : [rawTitle, '']);
    nodes.push({
      id: ten.id,
      label: (parts[0] || 'Tensión').slice(0, 25),
      sublabel: parts[1] ? `vs. ${parts[1].slice(0, 20)}` : 'Dilema Dialéctico',
      fullTitle: rawTitle,
      type: 'tension',
      column: 2,
      icon: 'tension',
      color: '#DC2626',
      size: 28,
      data: ten
    });
  });

  // 4. Nodos de Marcas y Soluciones (Columna 3)
  BRAND_MATRIX.forEach(b => {
    const bMarca = b.marca || b.nombre || 'Marca';
    nodes.push({
      id: `brand-${String(bMarca).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      label: bMarca.slice(0, 24),
      sublabel: b.territorio || b.rol || 'Marca / Solución',
      fullTitle: `Marca: ${bMarca}`,
      type: 'solucion',
      column: 3,
      icon: 'solucion',
      color: b.color || '#F6911E',
      size: 28,
      data: b
    });
  });

  // 5. Nodos de Oportunidades Clave (Columna 4)
  OPPORTUNITIES.forEach(opp => {
    const oppTitulo = opp.titulo || opp.nombre || 'Oportunidad';
    nodes.push({
      id: opp.id,
      label: oppTitulo.length > 26 ? oppTitulo.substring(0, 24) + '...' : oppTitulo,
      sublabel: opp.impacto ? `Impacto: ${opp.impacto}` : 'Oportunidad de Innovación',
      fullTitle: oppTitulo,
      type: 'oportunidad',
      column: 4,
      icon: 'oportunidad',
      color: '#00B487',
      size: 26,
      data: opp
    });
  });

  // --- ARISTAS DINÁMICAS (RELACIONES) ---
  // Si existen nodos en columnas adyacentes, conectarlos de forma segura
  const actorNodes = nodes.filter(n => n.type === 'actor');
  const contextNodes = nodes.filter(n => n.type === 'contexto');
  const tensionNodes = nodes.filter(n => n.type === 'tension');
  const brandNodes = nodes.filter(n => n.type === 'solucion');
  const oppNodes = nodes.filter(n => n.type === 'oportunidad');

  // Actores -> Contextos
  if (actorNodes.length > 0 && contextNodes.length > 0) {
    actorNodes.forEach((act, idx) => {
      const ctx = contextNodes[idx % contextNodes.length];
      edges.push({ source: act.id, target: ctx.id, relation: 'Interactúa en', label: 'Presencia' });
    });
  }

  // Contextos -> Tensiones
  if (contextNodes.length > 0 && tensionNodes.length > 0) {
    contextNodes.forEach((ctx, idx) => {
      const ten = tensionNodes[idx % tensionNodes.length];
      edges.push({ source: ctx.id, target: ten.id, relation: 'Detona fricción', label: 'Escenario de tensión' });
    });
  }

  // Tensiones -> Marcas / Soluciones
  if (tensionNodes.length > 0 && brandNodes.length > 0) {
    tensionNodes.forEach((ten, idx) => {
      const br = brandNodes[idx % brandNodes.length];
      edges.push({ source: ten.id, target: br.id, relation: 'Se atiende con', label: 'Respuesta' });
    });
  }

  // Marcas -> Oportunidades
  if (brandNodes.length > 0 && oppNodes.length > 0) {
    brandNodes.forEach((br, idx) => {
      const opp = oppNodes[idx % oppNodes.length];
      edges.push({ source: br.id, target: opp.id, relation: 'Vía de innovación', label: 'Territorio estratégico' });
    });
  }

  return { nodes, edges };
}

export function getEntityConnections(entityId, customData) {
  const { nodes, edges } = buildSystemGraph(customData);
  const directEdges = edges.filter(e => e.source === entityId || e.target === entityId);
  const connectedNodeIds = new Set();

  directEdges.forEach(e => {
    if (e.source === entityId) connectedNodeIds.add(e.target);
    if (e.target === entityId) connectedNodeIds.add(e.source);
  });

  const connectedNodes = nodes.filter(n => connectedNodeIds.has(n.id));
  return { directEdges, connectedNodes };
}
