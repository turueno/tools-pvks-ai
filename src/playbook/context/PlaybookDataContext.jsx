// src/playbook/context/PlaybookDataContext.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  EVIDENCES as INITIAL_EVIDENCES,
  INSIGHTS as INITIAL_INSIGHTS,
  TENSIONS as INITIAL_TENSIONS,
  DECISION_CHAINS as INITIAL_DECISION_CHAINS,
  TRANSITIONS as INITIAL_TRANSITIONS,
  BRAND_MATRIX as INITIAL_BRAND_MATRIX,
  OPPORTUNITIES as INITIAL_OPPORTUNITIES,
  ACTORS as INITIAL_ACTORS,
  CONTEXTS as INITIAL_CONTEXTS,
  TRANSVERSAL_BRIDGE as INITIAL_TRANSVERSAL_BRIDGE
} from '../data/playbookDataset.js';
import { HOMES as INITIAL_HOMES } from '../data/schema.js';
import {
  DEFAULT_PROJECTS,
  getStoredProjects,
  saveStoredProjects,
  getStoredActiveProjectId,
  saveStoredActiveProjectId
} from '../data/projectsRegistry.js';
import { PlaybookDataContext } from './usePlaybookData.js';
import { fetchCloudPlaybookData, saveCloudPlaybookData } from '../../logic/sync/pvksSyncClient.js';
import { getSuitePlaybooks } from '../../data/suitePlaybooksRegistry.js';

const LEGACY_STORAGE_KEY = 'pvks_playbook_data_v2';
const ADMIN_STORAGE_KEY = 'pvks_playbook_admin_mode';

const getProjectStorageKey = (projectId) => `pvks_playbook_${projectId}_data_v2`;

function buildDefaultDataset() {
  return {
    evidences: INITIAL_EVIDENCES,
    insights: INITIAL_INSIGHTS,
    tensions: INITIAL_TENSIONS,
    decisionChains: INITIAL_DECISION_CHAINS,
    transitions: INITIAL_TRANSITIONS,
    brandMatrix: INITIAL_BRAND_MATRIX,
    opportunities: INITIAL_OPPORTUNITIES,
    homes: INITIAL_HOMES,
    actors: INITIAL_ACTORS,
    contexts: INITIAL_CONTEXTS,
    transversalBridge: INITIAL_TRANSVERSAL_BRIDGE,
    lastUpdated: new Date().toISOString()
  };
}

function buildEmptyDataset() {
  return {
    evidences: [],
    insights: [],
    tensions: [],
    decisionChains: [],
    transitions: [],
    brandMatrix: [],
    opportunities: [],
    homes: [],
    actors: [],
    contexts: [],
    transversalBridge: [],
    lastUpdated: new Date().toISOString()
  };
}

function normalizePlaybookDataset(rawDataset, projectId = '') {
  if (!rawDataset || typeof rawDataset !== 'object') {
    return buildEmptyDataset();
  }

  const evidences = Array.isArray(rawDataset.evidences) ? rawDataset.evidences.map(ev => {
    if (!ev || typeof ev !== 'object') return null;
    const actorArr = Array.isArray(ev.actores)
      ? ev.actores
      : (ev.actor ? [ev.actor] : (Array.isArray(ev.actors) ? ev.actors : []));
    const actorStr = ev.actor || (actorArr.length > 0 ? actorArr[0] : '');
    const marcaStr = ev.marca || ev.marcaRelacionada || '';
    const levelStr = ev.nivel || ev.epistemicLevel || ev.nivelEpistemologico || 'OBSERVADO';
    const citaStr = ev.cita || ev.verbatim || '';
    const descStr = ev.descripcion || ev.contexto || '';

    return {
      ...ev,
      titulo: ev.titulo || (citaStr ? `Evidencia: "${citaStr.slice(0, 45)}..."` : 'Registro de Evidencia'),
      codigo: ev.codigo || ev.id || 'EV-00',
      tipo: ev.tipo || 'Evidencia de Campo',
      nivel: levelStr,
      epistemicLevel: levelStr,
      nivelEpistemologico: levelStr,
      marca: marcaStr,
      marcaRelacionada: marcaStr,
      actores: actorArr,
      actor: actorStr,
      cita: citaStr,
      verbatim: citaStr,
      descripcion: descStr,
      tags: Array.isArray(ev.tags) ? ev.tags : [],
      fuente: ev.fuente || ev.fuenteReporte || 'Insumo de Campo'
    };
  }).filter(Boolean) : [];

  const insights = Array.isArray(rawDataset.insights) ? rawDataset.insights.map(ins => {
    if (!ins || typeof ins !== 'object') return null;
    const marcasArr = Array.isArray(ins.marcasRelacionadas)
      ? ins.marcasRelacionadas
      : (ins.marcaRelacionada ? [ins.marcaRelacionada] : (Array.isArray(ins.marcas) ? ins.marcas : (ins.marca ? [ins.marca] : [])));
    const evIds = Array.isArray(ins.evidenciasRelacionadas)
      ? ins.evidenciasRelacionadas
      : (Array.isArray(ins.evidenciaIds) ? ins.evidenciaIds : []);
    const levelStr = ins.nivel || ins.epistemicLevel || ins.nivelEpistemologico || 'DERIVADO';

    return {
      ...ins,
      titulo: ins.titulo || 'Insight Sin Título',
      descripcion: ins.descripcion || '',
      mecanismo: ins.mecanismo || '',
      tension: ins.tension || '',
      necesidad: ins.necesidad || '',
      oportunidades: ins.oportunidades || '',
      hipotesis: ins.hipotesis || '',
      nivel: levelStr,
      epistemicLevel: levelStr,
      nivelEpistemologico: levelStr,
      marcasRelacionadas: marcasArr,
      evidenciasRelacionadas: evIds,
      evidenciaIds: evIds
    };
  }).filter(Boolean) : [];

  const tensions = Array.isArray(rawDataset.tensions) ? rawDataset.tensions.map(ten => {
    if (!ten || typeof ten !== 'object') return null;
    const poloA = ten.poloA || {};
    const poloB = ten.poloB || {};
    const labelA = poloA.nombre || poloA.etiqueta || poloA.concepto || 'Polo A';
    const labelB = poloB.nombre || poloB.etiqueta || poloB.concepto || 'Polo B';
    const titulo = ten.titulo || (labelA && labelB ? `${labelA} vs ${labelB}` : (ten.formulacion || 'Tensión'));

    return {
      ...ten,
      titulo,
      formulacion: ten.formulacion || titulo,
      poloA: {
        ...poloA,
        nombre: labelA,
        etiqueta: labelA,
        conceptos: Array.isArray(poloA.conceptos) ? poloA.conceptos : [],
        marcas: Array.isArray(poloA.marcas) ? poloA.marcas : (poloA.marca ? [poloA.marca] : []),
        evidencias: Array.isArray(poloA.evidencias) ? poloA.evidencias : []
      },
      poloB: {
        ...poloB,
        nombre: labelB,
        etiqueta: labelB,
        conceptos: Array.isArray(poloB.conceptos) ? poloB.conceptos : [],
        marcas: Array.isArray(poloB.marcas) ? poloB.marcas : (poloB.marca ? [poloB.marca] : []),
        evidencias: Array.isArray(poloB.evidencias) ? poloB.evidencias : []
      }
    };
  }).filter(Boolean) : [];

  const decisionChains = Array.isArray(rawDataset.decisionChains) ? rawDataset.decisionChains.map(ch => {
    if (!ch || typeof ch !== 'object') return null;
    const etapas = Array.isArray(ch.etapas) ? ch.etapas : (Array.isArray(ch.pasos) ? ch.pasos : []);
    return {
      ...ch,
      titulo: ch.titulo || ch.nombre || 'Cadena de Decisión',
      etapas,
      pasos: etapas
    };
  }).filter(Boolean) : [];

  const homes = (Array.isArray(rawDataset.homes) && rawDataset.homes.length > 0)
    ? rawDataset.homes.map(h => {
        const init = INITIAL_HOMES.find(ih => ih.id === h.id);
        if (
          !h.imagenUrl ||
          h.imagenUrl.includes('hogar1-belen-cocina') ||
          h.imagenUrl.includes('hogar2-liam-barra') ||
          h.imagenUrl.includes('hogar3-ferias-maletin')
        ) {
          return { ...h, imagenUrl: init?.imagenUrl || h.imagenUrl };
        }
        return h;
      })
    : (projectId === 'lullaby-cdmx-2026' ? INITIAL_HOMES : []);

  return {
    evidences,
    insights,
    tensions,
    decisionChains,
    transitions: Array.isArray(rawDataset.transitions) ? rawDataset.transitions : [],
    brandMatrix: Array.isArray(rawDataset.brandMatrix) ? rawDataset.brandMatrix : [],
    opportunities: Array.isArray(rawDataset.opportunities) ? rawDataset.opportunities : [],
    homes,
    actors: Array.isArray(rawDataset.actors) ? rawDataset.actors : [],
    contexts: Array.isArray(rawDataset.contexts) ? rawDataset.contexts : [],
    transversalBridge: Array.isArray(rawDataset.transversalBridge) ? rawDataset.transversalBridge : [],
    lastUpdated: rawDataset.lastUpdated || new Date().toISOString()
  };
}

function loadProjectData(projectId) {
  const scopedKey = getProjectStorageKey(projectId);
  try {
    // 1. Intentar cargar desde la clave específica del proyecto
    let raw = localStorage.getItem(scopedKey);

    // 2. Si es el proyecto Lullaby por defecto y aún no existe en scopedKey, migrar desde legacy
    if (!raw && projectId === 'lullaby-cdmx-2026') {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        raw = legacy;
        localStorage.setItem(scopedKey, legacy);
      }
    }

    if (raw) {
      if (raw.includes('[FPO]')) {
        console.info();
        localStorage.removeItem(scopedKey);
      } else {
        const parsed = JSON.parse(raw);
        return normalizePlaybookDataset(parsed, projectId);
      }
    }
  } catch (e) {
    console.warn(`No se pudo leer datos locales para el proyecto ${projectId}:`, e);
  }

  // Si es Lullaby o demo y no tiene datos locales, devolver el dataset de fábrica
  if (projectId === 'lullaby-cdmx-2026' || projectId === 'snacking-retail-2026') {
    return buildDefaultDataset();
  }

  return buildEmptyDataset();
}

export function PlaybookDataProvider({ activePlaybookId: propActiveId, children }) {
  // Lista de proyectos registrados combinando suitePlaybooks y proyectos locales
  const [projects, setProjects] = useState(() => {
    const suitePbs = getSuitePlaybooks().map(p => ({
      id: p.id,
      nombre: p.titulo,
      titulo: p.titulo,
      cliente: p.cliente,
      vertical: p.vertical,
      badge: p.badge,
      descripcion: p.descripcion,
      status: p.status,
      enabledModules: p.enabledModules,
      sessionId: p.sessionId
    }));
    const stored = getStoredProjects();
    const suiteIds = new Set(suitePbs.map(s => s.id));
    const merged = [...suitePbs];
    stored.forEach(st => {
      if (!suiteIds.has(st.id)) merged.push(st);
    });
    return merged;
  });

  // Proyecto activo
  const [activeProjectId, setActiveProjectId] = useState(() => {
    if (propActiveId) return propActiveId;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramProj = urlParams.get('project');
      if (paramProj) return paramProj;
    } catch (e) {
      console.warn(e);
    }
    return getStoredActiveProjectId();
  });

  useEffect(() => {
    if (propActiveId && propActiveId !== activeProjectId) {
      setActiveProjectId(propActiveId);
    }
  }, [propActiveId]);

  // Modo Administrador
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Estado de edición activa (para modal global)
  const [editingEntity, setEditingEntity] = useState(null);

  // Colecciones reactivas para el proyecto activo
  const [data, setData] = useState(() => loadProjectData(activeProjectId));
  const isCloudSyncedRef = useRef(false);

  // Al cambiar de activeProjectId, recargar data del proyecto y consultar la nube
  useEffect(() => {
    saveStoredActiveProjectId(activeProjectId);
    setData(loadProjectData(activeProjectId));
    isCloudSyncedRef.current = false;

    // Consultar la nube para obtener la versión más reciente
    fetchCloudPlaybookData(activeProjectId).then(cloudData => {
      if (cloudData && typeof cloudData === 'object' && Object.keys(cloudData).length > 0) {
        setData(prev => {
          const merged = normalizePlaybookDataset({ ...prev, ...cloudData }, activeProjectId);
          try {
            const scopedKey = getProjectStorageKey(activeProjectId);
            localStorage.setItem(scopedKey, JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
      isCloudSyncedRef.current = true;
    }).catch(() => {
      isCloudSyncedRef.current = true;
    });
  }, [activeProjectId]);

  // Guardar en localStorage cuando data cambie (específico del proyecto) y enviar a la nube
  useEffect(() => {
    try {
      const scopedKey = getProjectStorageKey(activeProjectId);
      localStorage.setItem(scopedKey, JSON.stringify(data));
    } catch (e) {
      console.error(`Error guardando datos para proyecto ${activeProjectId}:`, e);
    }

    if (isCloudSyncedRef.current) {
      const timer = setTimeout(() => {
        saveCloudPlaybookData(activeProjectId, data);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [data, activeProjectId]);

  // Guardar proyectos en localStorage cuando la lista cambie
  useEffect(() => {
    saveStoredProjects(projects);
  }, [projects]);

  // Cambiar proyecto activo
  const switchProject = useCallback((projectId) => {
    setActiveProjectId(projectId);
    setEditingEntity(null);
  }, []);

  // Crear nuevo proyecto
  const createProject = useCallback((projectMeta, templateType = 'blank') => {
    const id = projectMeta.id || `proj-${Date.now()}`;
    const newProject = {
      id,
      nombre: projectMeta.nombre || 'Nuevo Playbook Etnográfico',
      cliente: projectMeta.cliente || 'Cliente Confidencial',
      vertical: projectMeta.vertical || 'Consumo Masivo',
      badge: projectMeta.badge || 'PROYECTO ACTIVO',
      fecha: new Date().toISOString().slice(0, 7),
      confidencialidad: projectMeta.confidencialidad || 'Estrictamente Confidencial',
      totalPaginas: projectMeta.totalPaginas || 1,
      descripcion: projectMeta.descripcion || 'Espacio de trabajo etnográfico independiente.',
      isDefault: false
    };

    // Inicializar dataset del proyecto
    const initialDataset = templateType === 'template' ? buildDefaultDataset() : buildEmptyDataset();
    try {
      localStorage.setItem(getProjectStorageKey(id), JSON.stringify(initialDataset));
    } catch (e) {
      console.error(e);
    }

    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(id);
    return newProject;
  }, []);

  // Eliminar proyecto (excepto el predeterminado)
  const deleteProject = useCallback((projectId) => {
    if (projectId === 'lullaby-cdmx-2026') {
      alert('No es posible eliminar el proyecto de fábrica Lullaby.');
      return false;
    }
    if (!window.confirm('¿Estás seguro de eliminar este Playbook y todos sus datos asociados?')) {
      return false;
    }

    try {
      localStorage.removeItem(getProjectStorageKey(projectId));
    } catch (e) {
      console.error(e);
    }

    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId('lullaby-cdmx-2026');
    }
    return true;
  }, [activeProjectId]);

  // Guardar estado de admin
  const toggleAdmin = () => {
    setIsAdmin(prev => {
      const next = !prev;
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, String(next));
      } catch (e) {
        console.error('Error guardando admin mode:', e);
      }
      return next;
    });
  };

  // Abrir modal de edición
  const openEditor = (type, entityData) => {
    setEditingEntity({ type, data: entityData });
  };

  const closeEditor = () => {
    setEditingEntity(null);
  };

  // Guardar cualquier entidad (Crear o Actualizar)
  const saveEntity = (collectionKey, entity) => {
    setData(prev => {
      const currentList = prev[collectionKey] || [];
      const idKey = entity.id !== undefined ? 'id' : 'marca';
      const existsIndex = currentList.findIndex(item => item[idKey] === entity[idKey]);

      let updatedList;
      if (existsIndex >= 0) {
        updatedList = [...currentList];
        updatedList[existsIndex] = { ...updatedList[existsIndex], ...entity };
      } else {
        updatedList = [entity, ...currentList];
      }

      const nextData = {
        ...prev,
        [collectionKey]: updatedList,
        lastUpdated: new Date().toISOString()
      };

      try {
        localStorage.setItem(getProjectStorageKey(activeProjectId), JSON.stringify(nextData));
      } catch (err) {
        console.error('Error guardando en localStorage:', err);
      }

      return nextData;
    });
    closeEditor();
  };

  // Eliminar entidad
  const deleteEntity = (collectionKey, idOrMarca) => {
    setData(prev => {
      const currentList = prev[collectionKey] || [];
      const updatedList = currentList.filter(item => {
        const itemVal = item.id !== undefined ? item.id : item.marca;
        return itemVal !== idOrMarca;
      });

      return {
        ...prev,
        [collectionKey]: updatedList,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  // Restablecer a fábrica (solo del proyecto activo)
  const resetToDefaults = () => {
    const defaultData = activeProjectId === 'lullaby-cdmx-2026' || activeProjectId === 'snacking-retail-2026'
      ? buildDefaultDataset()
      : buildEmptyDataset();

    setData(defaultData);
    try {
      localStorage.setItem(getProjectStorageKey(activeProjectId), JSON.stringify(defaultData));
    } catch (e) {
      console.error('Error restableciendo datos:', e);
    }
  };

  // Exportar backup en JSON
  const exportDataJSON = () => {
    const currentProject = projects.find(p => p.id === activeProjectId) || DEFAULT_PROJECTS[0];
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({
        project: currentProject,
        dataset: data
      }, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('download', `pvks_playbook_${activeProjectId}_backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar backup desde JSON
  const importDataJSON = (importedObj) => {
    if (!importedObj || typeof importedObj !== 'object') {
      throw new Error('Archivo JSON inválido.');
    }
    const incomingData = importedObj.dataset || importedObj;
    const validatedData = {
      evidences: incomingData.evidences || data.evidences,
      insights: incomingData.insights || data.insights,
      tensions: incomingData.tensions || data.tensions,
      decisionChains: incomingData.decisionChains || data.decisionChains,
      transitions: incomingData.transitions || data.transitions,
      brandMatrix: incomingData.brandMatrix || data.brandMatrix,
      opportunities: incomingData.opportunities || data.opportunities,
      homes: incomingData.homes || data.homes,
      actors: incomingData.actors || data.actors,
      contexts: incomingData.contexts || data.contexts,
      transversalBridge: incomingData.transversalBridge || data.transversalBridge,
      lastUpdated: new Date().toISOString()
    };
    setData(validatedData);
    try {
      localStorage.setItem(getProjectStorageKey(activeProjectId), JSON.stringify(validatedData));
    } catch (e) {
      console.error('Error guardando importación:', e);
    }
  };

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || DEFAULT_PROJECTS[0];

  const value = {
    // Proyectos Multi-Playbook
    projects,
    activeProjectId,
    activeProject,
    switchProject,
    createProject,
    deleteProject,

    // Modo de administración y edición
    isAdmin,
    toggleAdmin,
    data,
    editingEntity,
    openEditor,
    closeEditor,
    saveEntity,
    deleteEntity,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,

    // Atajos directos a colecciones del proyecto activo
    evidences: data.evidences || [],
    insights: data.insights || [],
    tensions: data.tensions || [],
    decisionChains: data.decisionChains || [],
    transitions: data.transitions || [],
    brandMatrix: data.brandMatrix || [],
    opportunities: data.opportunities || [],
    homes: data.homes || [],
    actors: data.actors || [],
    contexts: data.contexts || [],
    transversalBridge: data.transversalBridge || [],
    lastUpdated: data.lastUpdated
  };

  return (
    <PlaybookDataContext.Provider value={value}>
      {children}
    </PlaybookDataContext.Provider>
  );
}
