// src/data/suitePlaybooksRegistry.js
// Catálogo maestro de Playbooks que componen la Suite Provokers AI Tools

export const INITIAL_SUITE_PLAYBOOKS = [
  {
    id: 'lullaby-cdmx-2026',
    tipo: 'etnografico',
    titulo: 'Insight Playbook: Nutrición Infantil CDMX',
    cliente: 'Nestlé Infant Nutrition',
    vertical: 'Alimentos Infantiles',
    badge: 'ESTUDIO ETNOGRÁFICO',
    icono: '🧭',
    color: '#F6911E',
    fecha: '2026-03',
    confidencialidad: 'Estrictamente Confidencial',
    descripcion: 'Sistema de conocimiento cualitativo estructurado a partir del reporte etnográfico (29 págs). Explorador de evidencias, mapas sistémicos, Scenario Lab y 12 operaciones de IA grounded.',
    destacado: true,
    isCore: true,
    enabledModules: [
      'overview',
      'evidence',
      'insights',
      'system-map',
      'tensions',
      'decisions',
      'transitions',
      'scenario',
      'opportunities',
      'matrix',
      'ai'
    ],
    status: 'published'
  },
  {
    id: 'pac-model-generator',
    tipo: 'pac',
    titulo: 'P.A.C. Model Generator & Multi-Criteria Validator',
    cliente: 'Farma & Nutrición Especializada',
    vertical: 'Posicionamiento Semiológico',
    badge: 'MODELO METODOLÓGICO',
    icono: '📈',
    color: '#4F46E5',
    fecha: '2026-03',
    confidencialidad: 'Uso Interno & Clientes PVKS',
    descripcion: 'Generador y validador de bloques discursivos y claims bajo la tríada Prescribir, Acompañar y Comunicar con matrices de ponderación AHP.',
    destacado: true,
    isCore: true,
    enabledModules: [
      'overview',
      'pac_generator',
      'pac_ahp',
      'pac_compliance'
    ],
    status: 'published'
  },
  {
    id: 'sntd-diagnostic',
    tipo: 'sntd',
    titulo: 'Insight Playbook: Salsas Negras México (S.N.T.D.)',
    cliente: 'Sabritas / PepsiCo México',
    vertical: 'Botanas Saladas & Salsas Tradicionales',
    badge: 'ESTUDIO TERRITORIAL',
    icono: '🌮',
    color: '#C25E00',
    fecha: '2026-03',
    confidencialidad: 'Estrictamente Confidencial · Sabritas',
    descripcion: 'Sistema de conocimiento etnográfico, semiótico y sensorial sobre el universo de las Salsas Negras en México (CDMX, GDL, MTY). Diagnóstico de portafolio, reglas de plataforma del Toolkit y Validador Territorial SNTD 7 Gateways.',
    destacado: true,
    isCore: true,
    enabledModules: [
      'overview',
      'evidence',
      'insights',
      'tensions',
      'sntd_gateways',
      'sntd_toolkit',
      'opportunities',
      'ai'
    ],
    status: 'published'
  },
  {
    id: 'exploratorio-compra-de-alimentos-por-la-ap-2683',
    tipo: 'etnografico',
    titulo: 'Insight Playbook: Cinépolis VIP - Compra de Alimentos en App',
    cliente: 'Cinépolis / Goodfellas',
    vertical: 'Entretenimiento & Alimentos VIP',
    badge: 'ESTUDIO CUALITATIVO',
    icono: '🎬',
    color: '#0A2540',
    fecha: '2026-03',
    confidencialidad: 'Estrictamente Confidencial · Cinépolis',
    descripcion: 'Investigación cualitativa profunda sobre la experiencia de pre-orden de alimentos en app vs servicio tradicional en sala Cinépolis VIP (32 láminas). Tensiones dialécticas entre apapacho y autonomía, sincronía cocina-butaca y oportunidades estratégicas.',
    destacado: true,
    isCore: true,
    enabledModules: [
      'overview',
      'evidence',
      'insights',
      'system-map',
      'tensions',
      'decisions',
      'transitions',
      'scenario',
      'opportunities',
      'matrix',
      'ai'
    ],
    status: 'published'
  }
];

const SUITE_PLAYBOOKS_STORAGE_KEY = 'pvks_suite_playbooks_registry_v2';
const ACTIVE_SUITE_PLAYBOOK_KEY = 'pvks_suite_active_playbook_id_v2';

export function getSuitePlaybooks() {
  try {
    const raw = localStorage.getItem(SUITE_PLAYBOOKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Asegurar que los Playbooks core sigan estando presentes y enriquecer con defaults si falta enabledModules
        const existingIds = new Set(parsed.map(p => p.id));
        const merged = parsed.map(item => {
          const coreMatch = INITIAL_SUITE_PLAYBOOKS.find(c => c.id === item.id);
          const rawModules = item.enabledModules || coreMatch?.enabledModules || [
            'overview', 'evidence', 'insights', 'system-map', 'tensions', 'decisions', 'transitions', 'scenario', 'opportunities', 'matrix', 'ai'
          ];
          const isPAC = item.tipo === 'pac' || item.id === 'pac-model-generator';
          const isSNTD = item.tipo === 'sntd' || item.id === 'sntd-diagnostic';
          const modules = [...rawModules];
          if (!isPAC && !isSNTD && !modules.includes('matrix')) {
            const aiIdx = modules.indexOf('ai');
            if (aiIdx >= 0) modules.splice(aiIdx, 0, 'matrix');
            else modules.push('matrix');
          }
          return {
            ...item,
            ...(coreMatch ? {
              titulo: coreMatch.titulo,
              cliente: coreMatch.cliente,
              vertical: coreMatch.vertical,
              badge: coreMatch.badge,
              icono: coreMatch.icono,
              color: coreMatch.color,
              descripcion: coreMatch.descripcion,
              status: coreMatch.status || 'published',
              isCore: true
            } : {}),
            enabledModules: modules,
            status: (coreMatch && coreMatch.status) || item.status || 'published'
          };
        });

        INITIAL_SUITE_PLAYBOOKS.forEach(core => {
          if (!existingIds.has(core.id)) {
            merged.push(core);
          }
        });
        return merged;
      }
    }
  } catch (e) {
    console.warn('Error al leer suitePlaybooksRegistry de localStorage:', e);
  }
  return INITIAL_SUITE_PLAYBOOKS;
}

export function saveSuitePlaybooks(playbooks) {
  try {
    localStorage.setItem(SUITE_PLAYBOOKS_STORAGE_KEY, JSON.stringify(playbooks));
  } catch (e) {
    console.error('Error al guardar suitePlaybooksRegistry:', e);
  }
}

export function getActiveSuitePlaybookId() {
  try {
    const saved = localStorage.getItem(ACTIVE_SUITE_PLAYBOOK_KEY);
    if (saved) return saved;
  } catch (e) {
    console.warn('Error al leer activeSuitePlaybookId:', e);
  }
  return INITIAL_SUITE_PLAYBOOKS[0].id;
}

export function saveActiveSuitePlaybookId(id) {
  try {
    localStorage.setItem(ACTIVE_SUITE_PLAYBOOK_KEY, id);
  } catch (e) {
    console.error('Error al guardar activeSuitePlaybookId:', e);
  }
}
