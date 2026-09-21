// src/data/suitePlaybooksRegistry.js
// Catálogo maestro de Playbooks que componen la Suite Provokers AI Tools

export const INITIAL_SUITE_PLAYBOOKS = [
  {
    id: 'lullaby-cdmx-2026',
    tipo: 'etnografico', // 'etnografico' | 'pac' | 'sntd'
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
    isCore: true
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
    isCore: true
  },
  {
    id: 'sntd-diagnostic',
    tipo: 'sntd',
    titulo: 'S.N.T.D. Territorial Adoption Diagnostic',
    cliente: 'Alimentos & Salsas Tradicionales',
    vertical: 'Diagnóstico Territorial',
    badge: 'DIAGNÓSTICO REGIONAL',
    icono: '🌮',
    color: '#FFAA34',
    fecha: '2026-03',
    confidencialidad: 'Uso Interno & Clientes PVKS',
    descripcion: 'Evaluación territorial de adopción en salsa negra tradicional. Detección de barreras culturales, protocolo BPMN-X7 y formatos en retail.',
    destacado: true,
    isCore: true
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
        // Asegurar que los Playbooks core sigan estando presentes
        const existingIds = new Set(parsed.map(p => p.id));
        const merged = [...parsed];
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
