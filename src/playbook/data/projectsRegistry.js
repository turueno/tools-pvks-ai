// src/playbook/data/projectsRegistry.js

export const DEFAULT_PROJECTS = [
  {
    id: 'lullaby-cdmx-2026',
    nombre: 'Inmersiones Hogar CDMX (Nutrición Infantil)',
    cliente: 'Nestlé Infant Nutrition',
    vertical: 'Alimentación Infantil',
    badge: 'ESTUDIO ETNOGRÁFICO CDMX',
    fecha: '2026-03',
    confidencialidad: 'Estrictamente Confidencial',
    totalPaginas: 29,
    descripcion: 'Estudio de inmersión en 3 hogares de CDMX (NSE C Típico) analizando tensiones y decisiones en torno a Nido, Nestum y Gerber.',
    isDefault: true
  },
  {
    id: 'snacking-retail-2026',
    nombre: 'Ocasiones de Consumo & Snacking Urbano',
    cliente: 'Retail & Consumer Goods',
    vertical: 'Snacks & Bebidas',
    badge: 'DEMO / BENCHMARK',
    fecha: '2026-04',
    confidencialidad: 'Uso Interno Provokers',
    totalPaginas: 15,
    descripcion: 'Exploración etnográfica de fricciones en el punto de venta de conveniencia y momentos de recompensa cotidiana.',
    isDefault: false
  }
];

const REGISTRY_STORAGE_KEY = 'pvks_projects_registry_v1';
const ACTIVE_PROJECT_STORAGE_KEY = 'pvks_active_project_id';

export function getStoredProjects() {
  try {
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error al leer el registro de proyectos de localStorage:', e);
  }
  return DEFAULT_PROJECTS;
}

export function saveStoredProjects(projects) {
  try {
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Error al guardar el registro de proyectos:', e);
  }
}

export function getStoredActiveProjectId() {
  try {
    const saved = localStorage.getItem(ACTIVE_PROJECT_STORAGE_KEY);
    if (saved) return saved;
  } catch (e) {
    console.warn('Error al leer activeProjectId:', e);
  }
  return DEFAULT_PROJECTS[0].id;
}

export function saveStoredActiveProjectId(id) {
  try {
    localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, id);
  } catch (e) {
    console.error('Error al guardar activeProjectId:', e);
  }
}
