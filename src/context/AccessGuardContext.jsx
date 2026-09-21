// src/context/AccessGuardContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { validateClientToken } from '../logic/security/accessTokensEngine.js';

const AccessGuardContext = createContext(null);

export function AccessGuardProvider({ children }) {
  // Analizar la URL en la carga inicial
  const [urlParams] = useState(() => new URLSearchParams(window.location.search));
  const tokenParam = urlParams.get('token');
  const modeParam = urlParams.get('mode'); // 'viewer'

  const [guardState, setGuardState] = useState(() => {
    if (tokenParam) {
      const validation = validateClientToken(tokenParam);
      if (!validation.valid) {
        return {
          isClientMode: true,
          isBlocked: true,
          blockReason: validation.mensaje || 'Enlace no autorizado o expirado.',
          role: 'viewer',
          restrictedPlaybookId: null,
          watermarkText: null
        };
      }
      return {
        isClientMode: true,
        isBlocked: false,
        blockReason: null,
        role: validation.tokenRecord.rol || 'viewer',
        restrictedPlaybookId: validation.tokenRecord.playbookId,
        watermarkText: validation.tokenRecord.watermarkText,
        tokenData: validation.tokenRecord
      };
    }

    // Modo viewer simple por parámetro url
    if (modeParam === 'viewer') {
      const projParam = urlParams.get('project');
      return {
        isClientMode: true,
        isBlocked: false,
        blockReason: null,
        role: 'viewer',
        restrictedPlaybookId: projParam || null,
        watermarkText: 'DOCUMENTO DE CONSULTA CONFIDENCIAL · PROVOKERS',
        tokenData: null
      };
    }

    // Modo normal interno de Provokers (HQ)
    return {
      isClientMode: false,
      isBlocked: false,
      blockReason: null,
      role: 'admin',
      restrictedPlaybookId: null,
      watermarkText: null,
      tokenData: null
    };
  });

  const value = useMemo(() => ({
    ...guardState,
    canEdit: !guardState.isClientMode && guardState.role !== 'viewer',
    canExport: guardState.role === 'admin' || guardState.role === 'reviewer',
    isRestricted: guardState.isClientMode
  }), [guardState]);

  return (
    <AccessGuardContext.Provider value={value}>
      {children}
    </AccessGuardContext.Provider>
  );
}

export function useAccessGuard() {
  const context = useContext(AccessGuardContext);
  if (!context) {
    return {
      isClientMode: false,
      isBlocked: false,
      blockReason: null,
      role: 'admin',
      canEdit: true,
      canExport: true,
      isRestricted: false,
      watermarkText: null
    };
  }
  return context;
}
