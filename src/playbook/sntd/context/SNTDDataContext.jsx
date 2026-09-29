// src/playbook/sntd/context/SNTDDataContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SNTD_PROJECT_META,
  SNTD_GATEWAYS_DEF,
  SNTD_PLAZAS,
  SNTD_BRANDS,
  SNTD_EVIDENCES,
  SNTD_INSIGHTS,
  SNTD_TENSIONS,
  SNTD_TOOLKIT_RULES
} from '../data/sntdDataset.js';

const SNTD_STORAGE_KEY = 'pvks_sntd_data_v1';
const SNTD_ADMIN_STORAGE_KEY = 'pvks_sntd_admin_mode';

export const SNTDDataContext = createContext(null);

export function useSNTDData() {
  const context = useContext(SNTDDataContext);
  if (!context) {
    throw new Error('useSNTDData debe ser usado dentro de un SNTDDataProvider');
  }
  return context;
}

function buildDefaultSNTDData() {
  return {
    meta: SNTD_PROJECT_META,
    gateways: SNTD_GATEWAYS_DEF,
    plazas: SNTD_PLAZAS,
    brands: SNTD_BRANDS,
    evidences: SNTD_EVIDENCES,
    insights: SNTD_INSIGHTS,
    tensions: SNTD_TENSIONS,
    toolkitRules: SNTD_TOOLKIT_RULES,
    lastUpdated: new Date().toISOString()
  };
}

function loadStoredSNTDData() {
  try {
    const raw = localStorage.getItem(SNTD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        meta: parsed.meta || SNTD_PROJECT_META,
        gateways: parsed.gateways || SNTD_GATEWAYS_DEF,
        plazas: parsed.plazas || SNTD_PLAZAS,
        brands: parsed.brands || SNTD_BRANDS,
        evidences: parsed.evidences || SNTD_EVIDENCES,
        insights: parsed.insights || SNTD_INSIGHTS,
        tensions: parsed.tensions || SNTD_TENSIONS,
        toolkitRules: parsed.toolkitRules || SNTD_TOOLKIT_RULES,
        lastUpdated: parsed.lastUpdated || new Date().toISOString()
      };
    }
  } catch (err) {
    console.error('Error cargando SNTD dataset de localStorage:', err);
  }
  return buildDefaultSNTDData();
}

export function SNTDDataProvider({ children }) {
  const [data, setData] = useState(() => loadStoredSNTDData());
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(SNTD_ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [editingEntity, setEditingEntity] = useState(null); // { type, data }

  // Persistir data cada que cambie
  useEffect(() => {
    try {
      localStorage.setItem(SNTD_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error guardando SNTD dataset en localStorage:', err);
    }
  }, [data]);

  // Persistir modo admin
  useEffect(() => {
    try {
      localStorage.setItem(SNTD_ADMIN_STORAGE_KEY, String(isAdmin));
    } catch (err) {
      console.error('Error guardando estado admin SNTD:', err);
    }
  }, [isAdmin]);

  const toggleAdmin = useCallback(() => {
    setIsAdmin(prev => !prev);
  }, []);

  const openEditor = useCallback((type, entityData) => {
    setEditingEntity({ type, data: entityData });
  }, []);

  const closeEditor = useCallback(() => {
    setEditingEntity(null);
  }, []);

  // Guardar entidad en una colección
  const saveEntity = useCallback((collectionKey, entity) => {
    setData(prev => {
      const currentList = prev[collectionKey] || [];
      const existsIndex = currentList.findIndex(item => item.id === entity.id || (entity.name && item.name === entity.name));
      let updatedList;
      if (existsIndex >= 0) {
        updatedList = [...currentList];
        updatedList[existsIndex] = { ...updatedList[existsIndex], ...entity };
      } else {
        updatedList = [entity, ...currentList];
      }
      return {
        ...prev,
        [collectionKey]: updatedList,
        lastUpdated: new Date().toISOString()
      };
    });
    setEditingEntity(null);
  }, []);

  // Eliminar entidad de una colección
  const deleteEntity = useCallback((collectionKey, idOrKey) => {
    setData(prev => {
      const currentList = prev[collectionKey] || [];
      const updatedList = currentList.filter(item => item.id !== idOrKey && item.name !== idOrKey);
      return {
        ...prev,
        [collectionKey]: updatedList,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  // Restablecer a fábrica
  const resetToDefaults = useCallback(() => {
    const defaults = buildDefaultSNTDData();
    setData(defaults);
    try {
      localStorage.removeItem(SNTD_STORAGE_KEY);
    } catch (err) {
      console.error('Error al resetear storage SNTD:', err);
    }
  }, []);

  // Exportar a JSON
  const exportDataJSON = useCallback(() => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sntd-playbook-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  // Importar desde JSON
  const importDataJSON = useCallback((importedObj) => {
    if (!importedObj || typeof importedObj !== 'object') {
      throw new Error('Archivo inválido: se esperaba un objeto JSON.');
    }
    const cleanData = {
      meta: importedObj.meta || SNTD_PROJECT_META,
      gateways: importedObj.gateways || SNTD_GATEWAYS_DEF,
      plazas: importedObj.plazas || SNTD_PLAZAS,
      brands: importedObj.brands || SNTD_BRANDS,
      evidences: importedObj.evidences || SNTD_EVIDENCES,
      insights: importedObj.insights || SNTD_INSIGHTS,
      tensions: importedObj.tensions || SNTD_TENSIONS,
      toolkitRules: importedObj.toolkitRules || SNTD_TOOLKIT_RULES,
      lastUpdated: new Date().toISOString()
    };
    setData(cleanData);
  }, []);

  const value = {
    data,
    meta: data.meta,
    gateways: data.gateways,
    plazas: data.plazas,
    brands: data.brands,
    evidences: data.evidences,
    insights: data.insights,
    tensions: data.tensions,
    toolkitRules: data.toolkitRules,
    lastUpdated: data.lastUpdated,
    isAdmin,
    toggleAdmin,
    editingEntity,
    openEditor,
    closeEditor,
    saveEntity,
    deleteEntity,
    resetToDefaults,
    exportDataJSON,
    importDataJSON
  };

  return (
    <SNTDDataContext.Provider value={value}>
      {children}
    </SNTDDataContext.Provider>
  );
}
