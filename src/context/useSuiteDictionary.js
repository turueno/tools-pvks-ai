// src/context/useSuiteDictionary.js
import { createContext, useContext } from 'react';

export const SuiteDictionaryContext = createContext(null);

export function useSuiteDictionary() {
  const context = useContext(SuiteDictionaryContext);
  if (!context) {
    throw new Error('useSuiteDictionary must be used within a SuiteDictionaryProvider');
  }
  return context;
}
