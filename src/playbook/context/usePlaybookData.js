// src/playbook/context/usePlaybookData.js
import { createContext, useContext } from 'react';

export const PlaybookDataContext = createContext(null);

export function usePlaybookData() {
  const context = useContext(PlaybookDataContext);
  if (!context) {
    throw new Error('usePlaybookData debe usarse dentro de PlaybookDataProvider');
  }
  return context;
}
