// src/context/SuiteDictionaryContext.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SuiteDictionaryContext } from './useSuiteDictionary.js';
import { UI_DICTIONARY_DEFAULTS } from '../data/uiDictionaryDefaults.js';
import { fetchCloudDictionary, saveCloudDictionary, fetchCloudMasterPass, saveCloudMasterPass } from '../logic/sync/pvksSyncClient.js';

const STORAGE_KEY = 'pvks_suite_ui_dictionary_v2';
const AUTH_SESSION_KEY = 'pvks_is_meta_admin_session';
const MASTER_PASS_KEY = 'pvks_meta_master_pass';
const DEFAULT_PASS = 'pvks2026';

export function SuiteDictionaryProvider({ children }) {
  // Cargar textos guardados o valores por defecto
  const [dictionary, setDictionary] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...UI_DICTIONARY_DEFAULTS, ...parsed };
      }
    } catch (e) {
      console.error('Error al cargar pvks_suite_ui_dictionary_v2:', e);
    }
    return { ...UI_DICTIONARY_DEFAULTS };
  });

  const isInitialCloudSyncRef = useRef(false);

  // Sincronizar desde la nube al cargar
  useEffect(() => {
    fetchCloudDictionary().then(cloudDict => {
      if (cloudDict && Object.keys(cloudDict).length > 0) {
        setDictionary(prev => {
          const merged = { ...UI_DICTIONARY_DEFAULTS, ...prev, ...cloudDict };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
      isInitialCloudSyncRef.current = true;
    }).catch(() => {
      isInitialCloudSyncRef.current = true;
    });

    fetchCloudMasterPass().then(cloudPass => {
      if (cloudPass) {
        setMasterPass(cloudPass);
        try {
          localStorage.setItem(MASTER_PASS_KEY, cloudPass);
        } catch {}
      } else {
        const localPass = localStorage.getItem(MASTER_PASS_KEY) || DEFAULT_PASS;
        saveCloudMasterPass(localPass);
      }
    }).catch(e => console.error("Error al obtener master pass de la nube:", e));
  }, []);

  // Estado de autenticación del Meta-Admin
  const [isMetaAdmin, setIsMetaAdmin] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Contraseña maestra configurable
  const [masterPass, setMasterPass] = useState(() => {
    try {
      return localStorage.getItem(MASTER_PASS_KEY) || DEFAULT_PASS;
    } catch {
      return DEFAULT_PASS;
    }
  });

  // Modales de control
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMetaCMSOpen, setIsMetaCMSOpen] = useState(false);
  const [quickEditKey, setQuickEditKey] = useState(null);

  // Sincronizar diccionario a localStorage y a la nube
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dictionary));
    } catch (e) {
      console.error('Error al persistir diccionario de copys:', e);
    }

    // Si ya completó la carga inicial, enviar cambios a la nube con debounce
    if (isInitialCloudSyncRef.current) {
      const timer = setTimeout(() => {
        saveCloudDictionary(dictionary);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dictionary]);

  // Manejo de autenticación
  const loginMetaAdmin = useCallback((passInput) => {
    if (passInput === masterPass) {
      setIsMetaAdmin(true);
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, error: 'Contraseña de Meta-Administrador incorrecta.' };
  }, [masterPass]);

  const logoutMetaAdmin = useCallback(() => {
    setIsMetaAdmin(false);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsMetaCMSOpen(false);
    setQuickEditKey(null);
  }, []);

  const updateMasterPass = useCallback((newPass) => {
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, error: 'La nueva clave debe tener al menos 4 caracteres.' };
    }
    setMasterPass(newPass);
    try {
      localStorage.setItem(MASTER_PASS_KEY, newPass);
    } catch {}
    saveCloudMasterPass(newPass);
    return { success: true };
  }, []);

  // Función de traducción/búsqueda de texto (t)
  const t = useCallback((key, fallback) => {
    if (dictionary && dictionary[key] !== undefined && dictionary[key] !== '') {
      return dictionary[key];
    }
    if (UI_DICTIONARY_DEFAULTS[key] !== undefined) {
      return UI_DICTIONARY_DEFAULTS[key];
    }
    return fallback !== undefined ? fallback : key;
  }, [dictionary]);

  // Actualizar un texto individual
  const updateText = useCallback((key, newText) => {
    setDictionary(prev => ({
      ...prev,
      [key]: newText
    }));
  }, []);

  // Restablecer un texto individual a su valor original de fábrica
  const resetText = useCallback((key) => {
    const defaultValue = UI_DICTIONARY_DEFAULTS[key] || '';
    setDictionary(prev => ({
      ...prev,
      [key]: defaultValue
    }));
  }, []);

  // Restablecer una sección completa a fábrica
  const resetSection = useCallback((prefix) => {
    setDictionary(prev => {
      const updated = { ...prev };
      Object.keys(UI_DICTIONARY_DEFAULTS).forEach(key => {
        if (key.startsWith(prefix)) {
          updated[key] = UI_DICTIONARY_DEFAULTS[key];
        }
      });
      return updated;
    });
  }, []);

  // Restablecer todo el diccionario a valores de fábrica
  const resetAll = useCallback(() => {
    if (window.confirm('¿Seguro que deseas restablecer TODOS los textos estructurales de la Suite a sus valores de fábrica?')) {
      setDictionary({ ...UI_DICTIONARY_DEFAULTS });
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Exportar respaldo en archivo JSON descargable
  const exportDictionaryJSON = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dictionary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pvks_suite_ui_dictionary_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [dictionary]);

  // Importar respaldo desde archivo JSON
  const importDictionaryJSON = useCallback((jsonContent) => {
    try {
      const parsed = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Formato JSON inválido');
      }
      setDictionary({ ...UI_DICTIONARY_DEFAULTS, ...parsed });
      alert('✅ Diccionario de textos de la Suite importado exitosamente.');
      return true;
    } catch (err) {
      alert('❌ Error al importar JSON de textos: ' + err.message);
      return false;
    }
  }, []);

  const value = {
    dictionary,
    isMetaAdmin,
    masterPass,
    isAuthModalOpen,
    isMetaCMSOpen,
    quickEditKey,
    loginMetaAdmin,
    logoutMetaAdmin,
    updateMasterPass,
    t,
    updateText,
    resetText,
    resetSection,
    resetAll,
    exportDictionaryJSON,
    importDictionaryJSON,
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),
    openMetaCMS: () => setIsMetaCMSOpen(true),
    closeMetaCMS: () => setIsMetaCMSOpen(false),
    setQuickEditKey
  };

  return (
    <SuiteDictionaryContext.Provider value={value}>
      {children}
    </SuiteDictionaryContext.Provider>
  );
}
