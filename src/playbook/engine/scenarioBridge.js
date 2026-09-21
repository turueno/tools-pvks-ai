// src/playbook/engine/scenarioBridge.js
// Puente de mapeo contextual entre entidades (System Maps, Insights, Tensiones, Contextos)
// y las 4 dimensiones estructuradas del Scenario Lab.

import { DEFAULT_SCENARIO_STATE } from '../data/scenarioDimensions.js';

export function mapEntityToScenario(entity) {
  if (!entity) return { state: { ...DEFAULT_SCENARIO_STATE }, label: null, origin: null };

  const id = entity.id || entity.codigo || '';
  const state = { ...DEFAULT_SCENARIO_STATE };
  let label = entity.titulo || entity.nombre || entity.label || 'Escenario Personalizado';
  let origin = 'general';

  // 1. Mapeo desde Contextos
  if (id === 'ctx-ferias' || id.includes('feria') || id.includes('calle')) {
    origin = 'Contexto de Hábitat';
    label = 'Ferias y Comercio Ambulante (Calle)';
    state.espacio = 'calle_feria';
    state.tiempo = 'colapso';
    state.sustitutos = 'sin_alternativas';
    state.maduracion = 'transicion';
    state.tolerancia = 'estomago_delicado';
  } else if (id === 'ctx-mesa-familiar' || id.includes('mesa') || id.includes('abuelos')) {
    origin = 'Contexto Social';
    label = 'Mesa Familiar y Comida Compartida';
    state.espacio = 'cocina';
    state.tiempo = 'holgado';
    state.familia_extensa = 'abuelos_activos';
    state.maduracion = 'bypass_ano';
    state.filtro_azucar = 'permisivo_situacional';
    state.pediatra = 'consulta_distante';
  } else if (id === 'ctx-cocina' || id.includes('cocina')) {
    origin = 'Contexto Doméstico';
    label = 'Cocina y Rutina Matutina';
    state.espacio = 'cocina';
    state.tiempo = 'colapso';
    state.sustitutos = 'insumos_naturales';
    state.filtro_azucar = 'filtro_excluyente';
  }

  // 2. Mapeo desde Tensiones
  else if (id === 'ten-01' || id.includes('ten-01') || (entity.titulo && entity.titulo.includes('Control vs. Calle'))) {
    origin = 'Tensión Crítica 1';
    label = 'Control Estricto de Casa vs. Precariedad de la Calle';
    state.espacio = 'calle_feria';
    state.tiempo = 'colapso';
    state.sustitutos = 'sin_alternativas';
    state.filtro_azucar = 'filtro_excluyente';
    state.tolerancia = 'estomago_delicado';
  } else if (id === 'ten-02' || id.includes('ten-02') || (entity.titulo && entity.titulo.includes('Bypass'))) {
    origin = 'Tensión Crítica 2';
    label = 'Ruta Mental Ideal vs. Bypass a Leche Entera';
    state.maduracion = 'bypass_ano';
    state.tolerancia = 'tolerancia_probada';
    state.sustitutos = 'leche_familiar_refri';
    state.pediatra = 'luz_verde_familiar';
    state.espacio = 'cocina';
  } else if (id === 'ten-03' || id.includes('ten-03') || (entity.titulo && entity.titulo.includes('Culpa'))) {
    origin = 'Tensión Crítica 3';
    label = 'Autoexigencia Moral vs. Legitimación del Alivio';
    state.tiempo = 'colapso';
    state.filtro_azucar = 'filtro_excluyente';
    state.culpa_alivio = 'alta_exigencia';
    state.sustitutos = 'insumos_naturales';
    state.espacio = 'cocina';
  } else if (id === 'ten-04' || id.includes('ten-04') || (entity.titulo && entity.titulo.includes('Costo'))) {
    origin = 'Tensión Crítica 4';
    label = 'Inversión en Especialización vs. Economía del Hogar';
    state.sustitutos = 'leche_familiar_refri';
    state.maduracion = 'bypass_ano';
    state.tolerancia = 'tolerancia_probada';
  }

  // 3. Mapeo desde Insights
  else if (id === 'ins-02' || id.includes('bypass') || id.includes('nido')) {
    origin = 'Ficha de Insight';
    label = 'El Bypass del Primer Año (Leche Entera)';
    state.maduracion = 'bypass_ano';
    state.tolerancia = 'tolerancia_probada';
    state.sustitutos = 'leche_familiar_refri';
    state.pediatra = 'luz_verde_familiar';
  } else if (id === 'ins-04' || id.includes('nestum') || id.includes('azucar')) {
    origin = 'Ficha de Insight';
    label = 'Nestum: Desayuno Exprés y Filtro Cero Azúcar';
    state.tiempo = 'colapso';
    state.filtro_azucar = 'filtro_excluyente';
    state.culpa_alivio = 'alivio_legitimado';
    state.espacio = 'cocina';
  } else if (id === 'ins-06' || id.includes('gerber') || id.includes('calle')) {
    origin = 'Ficha de Insight';
    label = 'Gerber: Bioseguridad y Portabilidad On-The-Go';
    state.espacio = 'calle_feria';
    state.tiempo = 'colapso';
    state.sustitutos = 'sin_alternativas';
  }

  // 4. Mapeo desde Actores
  else if (id === 'act-pediatra') {
    origin = 'Actor del Sistema';
    label = 'Intervención de la Consulta Pediátrica';
    state.pediatra = 'prescripcion_estricta';
    state.filtro_azucar = 'filtro_excluyente';
  } else if (id === 'act-abuelos') {
    origin = 'Actor del Sistema';
    label = 'Presencia de Abuelos en la Mesa Familiar';
    state.familia_extensa = 'abuelos_activos';
    state.filtro_azucar = 'permisivo_situacional';
    state.pediatra = 'consulta_distante';
  } else if (id === 'act-mama') {
    origin = 'Actor Central';
    label = 'Mamá: Rutina de Cuidado y Decisión';
    state.tiempo = 'colapso';
    state.filtro_azucar = 'filtro_excluyente';
  }

  // 5. Mapeo desde Oportunidades (Opportunity Builder)
  else if (id.startsWith('opp-')) {
    origin = 'Oportunidad Estratégica';
    label = entity.titulo || 'Oportunidad de Innovación';
    if (id === 'opp-01' || id.includes('insumos')) {
      state.tiempo = 'colapso';
      state.espacio = 'cocina';
      state.sustitutos = 'insumos_naturales';
      state.filtro_azucar = 'filtro_excluyente';
    } else if (id === 'opp-02' || id.includes('suplemento') || id.includes('seguro')) {
      state.maduracion = 'bypass_ano';
      state.sustitutos = 'leche_familiar_refri';
      state.tolerancia = 'tolerancia_probada';
      state.pediatra = 'luz_verde_familiar';
    } else if (id === 'opp-03' || id.includes('pouch') || id.includes('termico')) {
      state.espacio = 'calle_feria';
      state.tiempo = 'colapso';
      state.sustitutos = 'sin_alternativas';
      state.tolerancia = 'estomago_delicado';
    } else if (id === 'opp-04' || id.includes('recetas') || id.includes('cereal')) {
      state.tiempo = 'colapso';
      state.espacio = 'cocina';
      state.culpa_alivio = 'alivio_legitimado';
      state.maduracion = 'transicion';
    }
  }

  return { state, label, origin };
}
