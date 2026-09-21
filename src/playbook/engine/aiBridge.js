// src/playbook/engine/aiBridge.js
// Puente de mapeo contextual entre entidades inspeccionadas (Insights, Evidencias, Tensiones, Actores, Contextos)
// y el Asistente de Inteligencia Estratégica (12 operaciones cognitivas grounded).

export function mapEntityToAIOperation(entity, data = {}) {
  if (!entity) return null;

  const id = entity.id || entity.codigo || '';
  const title = entity.titulo || entity.nombre || entity.label || 'Elemento';

  let actionId = 'derivar-implicaciones';
  const initialParams = {};
  let originType = 'Entidad';

  // 1. Es un INSIGHT
  if (entity.mecanismo !== undefined || id.startsWith('ins-')) {
    actionId = 'explicar-mecanismo';
    initialParams.insightId = id;
    originType = 'Insight Estratégico';
  }

  // 2. Es una EVIDENCIA
  else if (entity.codigo?.startsWith('EV-') || entity.observacionDirecta !== undefined) {
    actionId = 'derivar-implicaciones';
    originType = 'Evidencia Etnográfica';
    // Buscar si la evidencia pertenece a un insight
    const insights = data.insights || [];
    const parentInsight = insights.find(ins => ins.evidenciaIds?.includes(id));
    if (parentInsight) {
      initialParams.insightId = parentInsight.id;
    }
  }

  // 3. Es un ACTOR
  else if (entity.tipo === 'actor' || entity.rol !== undefined || id.startsWith('act-')) {
    actionId = 'encontrar-conexiones';
    initialParams.actorId = id;
    originType = 'Actor del Sistema';
  }

  // 4. Es un CONTEXTO
  else if (entity.tipo === 'contexto' || id.startsWith('ctx-')) {
    actionId = 'construir-escenario';
    initialParams.contextId = id;
    originType = 'Contexto de Hábitat';
  }

  // 5. Es una TENSIÓN
  else if (entity.poloA !== undefined || id.startsWith('ten-')) {
    actionId = 'detectar-contradicciones';
    originType = 'Tensión Dialéctica';
    const insights = data.insights || [];
    if (insights.length > 0) {
      const related = insights.find(ins => ins.tension?.toLowerCase().includes(entity.titulo?.toLowerCase().split(' vs')[0] || ''));
      if (related) initialParams.insightId = related.id;
    }
  }

  // 6. Es una MARCA
  else if (entity.sostieneUso !== undefined || id.startsWith('brand-')) {
    actionId = 'derivar-implicaciones';
    originType = 'Marca / Solución';
    initialParams.marcaKey = entity.marca || entity.label || 'Gerber';
  }

  // 7. Es una TRANSICIÓN
  else if (entity.detonante !== undefined || id.startsWith('trans-')) {
    actionId = 'construir-escenario';
    initialParams.transitionId = id;
    originType = 'Transición Vital';
  }

  return {
    actionId,
    params: initialParams,
    entityTitle: title,
    entityType: originType,
    entityId: id
  };
}
