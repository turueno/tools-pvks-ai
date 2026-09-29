// src/data/modulesCatalog.js
// Catálogo maestro de Módulos y Herramientas de la Suite Provokers AI Tools

export const MODULES_CATALOG = [
  {
    id: 'core_base',
    categoria: 'Estructura Base (Mandatoria)',
    descripcion: 'Pilar epistemológico obligatorio en todo Playbook de la Suite.',
    isMandatory: true,
    modules: [
      {
        id: 'overview',
        nombre: 'Overview Estratégico',
        icono: 'overview',
        badge: 'MANDATORIO',
        descripcion: 'Resumen ejecutivo, indicadores clave y encuadre metodológico (Observado, Derivado, Hipótesis).'
      },
      {
        id: 'evidence',
        nombre: 'Evidence Library',
        icono: 'evidence',
        badge: 'MANDATORIO',
        descripcion: 'Repositorio empírico de citas textuales de campo, fotografías de hábitat y notas de inmersión.'
      },
      {
        id: 'insights',
        nombre: 'Fichas de Insight (3 Fases)',
        icono: 'cards',
        badge: 'MANDATORIO',
        descripcion: 'Fichas con pestañas interactivas: 1. Observado (Hechos), 2. Derivado (Tensión/Mecanismo), 3. Hipótesis (Oportunidades).'
      }
    ]
  },
  {
    id: 'cat_etnografico',
    categoria: 'Herramientas Etnográficas & Dinámicas',
    descripcion: 'Simuladores y herramientas para explorar relaciones sistémicas y decisiones en el consumidor.',
    isMandatory: false,
    modules: [
      {
        id: 'scenario',
        nombre: 'Scenario Lab (Simulador de Variables)',
        icono: 'scenario',
        badge: 'SIMULADOR',
        descripcion: 'Simulador dinámico con sliders interactivos para evaluar cómo cambian las necesidades y la relevancia de marcas.'
      },
      {
        id: 'system-map',
        nombre: 'System Maps (Mapeo de Actores)',
        icono: 'network',
        badge: 'SISTÉMICO',
        descripcion: 'Red de relaciones e interacciones entre actores clave, artefactos y el ecosistema de consumo.'
      },
      {
        id: 'tensions',
        nombre: 'Tension Explorer',
        icono: 'tension',
        badge: 'DIALÉCTICO',
        descripcion: 'Explorador profundo de tensiones críticas polares (Polo A vs. Polo B) y sus vías de resolución.'
      },
      {
        id: 'decisions',
        nombre: 'Decision Explorer',
        icono: 'decision',
        badge: 'COMPORTAMIENTO',
        descripcion: 'Árboles y cadenas secuenciales de decisión del consumidor durante sus momentos de elección.'
      },
      {
        id: 'transitions',
        nombre: 'Transition Explorer',
        icono: 'transition',
        badge: 'CICLO DE VIDA',
        descripcion: 'Mapeo de etapas, rituales de pasaje y momentos de transición crítica en la vida del usuario.'
      },
      {
        id: 'matrix',
        nombre: 'Matriz Comparativa de Marcas',
        icono: 'matrix',
        badge: 'BENCHMARK',
        descripcion: 'Análisis comparativo de posicionamiento, roles de marca y atributos diferenciales.'
      },
      {
        id: 'opportunities',
        nombre: 'Opportunity Builder',
        icono: 'opportunity',
        badge: 'INNOVACIÓN',
        descripcion: 'Generador y ponderador de territorios de oportunidad estratégica orientados a producto y negocio.'
      },
      {
        id: 'ai',
        nombre: 'Asistente IA Grounded',
        icono: 'ai',
        badge: '12 ACCIONES',
        descripcion: 'Asistente de consulta cruzada con 12 operaciones analíticas fundamentadas estrictamente en la evidencia.'
      }
    ]
  },
  {
    id: 'cat_pac',
    categoria: 'Herramientas P.A.C. (Discursivas & Semiológicas)',
    descripcion: 'Metodología de diseño y validación de bloques de comunicación bajo el modelo Prescribir, Acompañar y Comunicar.',
    isMandatory: false,
    modules: [
      {
        id: 'pac_generator',
        nombre: 'P.A.C. Model Generator',
        icono: 'pac',
        badge: 'DISCURSIVO',
        descripcion: 'Generador de bloques discursivos clasificados en Prescribir, Acompañar y Comunicar.'
      },
      {
        id: 'pac_ahp',
        nombre: 'Matriz Multicriterio AHP',
        icono: 'decision',
        badge: 'PONDERACIÓN',
        descripcion: 'Evaluación cuantitativa y balance de consistencia, relevancia y diferenciación mediante el método AHP.'
      },
      {
        id: 'pac_compliance',
        nombre: 'Compliance & Criterios Universales',
        icono: 'settings',
        badge: 'REGULATORIO',
        descripcion: 'Validador de reglas semióticas, no contradicción y criterios de cumplimiento regulatorio.'
      }
    ]
  },
  {
    id: 'cat_sntd',
    categoria: 'Herramientas Territoriales & Portafolio (S.N.T.D.)',
    descripcion: 'Instrumentos de diagnóstico territorial y reglas de portafolio para categorías de consumo arraigadas.',
    isMandatory: false,
    modules: [
      {
        id: 'sntd_gateways',
        nombre: 'Diagnóstico Territorial 7 Gateways',
        icono: 'network',
        badge: 'TERRITORIAL',
        descripcion: 'Evaluador territorial de 7 compuertas culturales y sensoriales por plaza (CDMX, GDL, MTY).'
      },
      {
        id: 'sntd_toolkit',
        nombre: 'Toolkit Pre-Check Tester',
        icono: 'settings',
        badge: 'REGLAS DE PORTAFOLIO',
        descripcion: 'Validador de reglas de plataforma de producto, empaque y lineamientos de marca.'
      }
    ]
  }
];

// Lista de módulos base por defecto
export const DEFAULT_MANDATORY_MODULE_IDS = ['overview', 'evidence', 'insights'];

// Mapa de ayuda rápida id -> módulo
export const ALL_MODULES_MAP = MODULES_CATALOG.reduce((acc, cat) => {
  cat.modules.forEach(m => {
    acc[m.id] = { ...m, categoria: cat.categoria, isMandatory: cat.isMandatory };
  });
  return acc;
}, {});
