// src/playbook/data/scenarioRegistry.js
// Registro y despachador de configuraciones de Scenario Lab según el Playbook activo.
// Despacha:
// 1. Cinépolis VIP: motor de simulación de journey gastronómico y canales de compra.
// 2. Lullaby CDMX: motor de nutrición infantil en hogares (Gerber, Nido, Nestum).
// 3. Playbooks genéricos o nuevos: motor universal con dimensiones contextuales adaptativas y evaluación de la matriz de marcas.

import { SCENARIO_DIMENSIONS, DEFAULT_SCENARIO_STATE } from './scenarioDimensions.js';
import { SCENARIO_PRESETS } from './presets.js';
import { evaluateScenario } from '../engine/scenarioEngine.js';

import {
  CINEPOLIS_SCENARIO_DIMENSIONS,
  DEFAULT_CINEPOLIS_SCENARIO_STATE,
  CINEPOLIS_SCENARIO_PRESETS,
  evaluateCinepolisScenario
} from '../engine/cinepolisScenarioEngine.js';

import {
  GENERIC_SCENARIO_DIMENSIONS,
  DEFAULT_GENERIC_SCENARIO_STATE,
  GENERIC_SCENARIO_PRESETS,
  evaluateGenericScenario
} from '../engine/genericScenarioEngine.js';

export function getScenarioConfig(playbookId, playbookMeta = {}, dataset = null) {
  const pId = (playbookId || '').toLowerCase();
  const pTitle = (playbookMeta?.titulo || '').toLowerCase();
  const pClient = (playbookMeta?.cliente || '').toLowerCase();
  const pVertical = (playbookMeta?.vertical || '').toLowerCase();

  // 1. Detectar si corresponde al estudio de Cinépolis VIP / Compra de Alimentos por App
  const isCinepolis =
    pId.includes('exploratorio') ||
    pId.includes('alimento') ||
    pId.includes('cine') ||
    pTitle.includes('cine') ||
    pTitle.includes('alimento') ||
    pTitle.includes('vip') ||
    pClient.includes('cine');

  if (isCinepolis) {
    return {
      dimensions: CINEPOLIS_SCENARIO_DIMENSIONS,
      defaultState: DEFAULT_CINEPOLIS_SCENARIO_STATE,
      presets: CINEPOLIS_SCENARIO_PRESETS,
      evaluator: evaluateCinepolisScenario,
      tag: 'SIMULADOR DE DEMANDA & JOURNEY VIP',
      title: 'Scenario Lab: Compra de Alimentos por App (Cinépolis VIP)',
      tooltipTitle: 'Simulación del Journey y Canales VIP',
      tooltipContent: 'Evalúa cómo cambia la tracción de la App, el Servicio en Sala y la Dulcería Tradicional según el Momento del Journey, el Acompañamiento, el Perfil del Usuario y el Estado de UX de la App.'
    };
  }

  // 2. Detectar si corresponde al estudio de Nutrición Infantil (Lullaby CDMX)
  const isLullaby =
    pId === 'lullaby-cdmx-2026' ||
    pId.includes('lullaby') ||
    pId.includes('nutricion') ||
    pId.includes('infantil') ||
    pTitle.includes('lullaby') ||
    pTitle.includes('nutricion') ||
    pVertical.includes('infantil') ||
    pClient.includes('nestle') ||
    pClient.includes('lullaby');

  if (isLullaby) {
    return {
      dimensions: SCENARIO_DIMENSIONS,
      defaultState: DEFAULT_SCENARIO_STATE,
      presets: SCENARIO_PRESETS,
      evaluator: evaluateScenario,
      tag: 'SIMULADOR CUALITATIVO DE DEMANDA',
      title: 'Scenario Lab: Laboratorio de Escenarios',
      tooltipTitle: 'Simulación Contextual Basada en 4 Dimensiones',
      tooltipContent: 'Modifica las condiciones reales del hogar (Situación Material, Etapa del Bebé, Autoridad Externa y Marco Moral) para observar cómo se reconfigura la tracción de marcas y qué tensiones latentes se activan.'
    };
  }

  // 3. Para cualquier otro Playbook creado o sintetizado en la Suite (Motor Universal)
  return {
    dimensions: GENERIC_SCENARIO_DIMENSIONS,
    defaultState: DEFAULT_GENERIC_SCENARIO_STATE,
    presets: GENERIC_SCENARIO_PRESETS,
    evaluator: (state) => evaluateGenericScenario(state, playbookMeta, dataset),
    tag: 'SIMULADOR UNIVERSAL DE DEMANDA & ADOPCIÓN',
    title: `Scenario Lab: ${playbookMeta?.titulo || 'Simulación Estratégica'}`,
    tooltipTitle: 'Simulación Contextual de Tracción y Demanda',
    tooltipContent: 'Modifica el contexto de demanda, canal de acceso, perfil del usuario y nivel de fricción operativa para simular la tracción de las alternativas del estudio.'
  };
}
