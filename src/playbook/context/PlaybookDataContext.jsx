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
      const parsed = JSON.parse(raw);
      return {
        evidences: parsed.evidences || [],
        insights: parsed.insights || [],
        tensions: parsed.tensions || [],
        decisionChains: parsed.decisionChains || [],
        transitions: parsed.transitions || [],
        brandMatrix: parsed.brandMatrix || [],
        opportunities: parsed.opportunities || [],
        homes: (parsed.homes && parsed.homes.length > 0)
          ? parsed.homes.map(h => {
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
          : (projectId === 'lullaby-cdmx-2026' ? INITIAL_HOMES : []),
        actors: parsed.actors || [],
        contexts: parsed.contexts || [],
        transversalBridge: parsed.transversalBridge || [],
        lastUpdated: parsed.lastUpdated || new Date().toISOString()
      };
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

export function PlaybookDataProvider({ children }) {
  // Lista de proyectos registrados
  const [projects, setProjects] = useState(() => getStoredProjects());

  // Proyecto activo
  const [activeProjectId, setActiveProjectId] = useState(() => {
    // Si viene en la URL (?project=...), tiene prioridad
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramProj = urlParams.get('project');
      if (paramProj) return paramProj;
    } catch (e) {
      console.warn(e);
    }
    return getStoredActiveProjectId();
  });

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
          const merged = { ...prev, ...cloudData };
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
    evidences: data.evidences,
    insights: data.insights,
    tensions: data.tensions,
    decisionChains: data.decisionChains,
    transitions: data.transitions,
    brandMatrix: data.brandMatrix,
    opportunities: data.opportunities,
    homes: data.homes,
    actors: data.actors,
    contexts: data.contexts,
    transversalBridge: data.transversalBridge,
    lastUpdated: data.lastUpdated
  };

  return (
    <PlaybookDataContext.Provider value={value}>
      {children}
    </PlaybookDataContext.Provider>
  );
}
