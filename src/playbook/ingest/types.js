// src/playbook/ingest/types.js
// Esquema canónico para el proceso de ingestión y síntesis epistemológica de Provokers

export const INGEST_FORMATS = {
  TEXT: 'text',       // Texto libre, notas, transcripciones
  CSV: 'csv',         // Tablas delimitadas por comas o tabs
  JSON: 'json',       // Estructura directa o backups
  PDF_DOC: 'pdf_doc'  // Documentos de estudio / decks exportados
};

export const EPISTEMIC_TAGS = {
  OBSERVADO: 'OBSERVADO',
  DERIVADO: 'DERIVADO',
  HIPOTESIS: 'HIPOTESIS'
};

export const DEFAULT_HOMES_TEMPLATE = [
  {
    id: 'arquetipo-1',
    name: 'Sujeto / Hogar Principal',
    target: 'Target Clave',
    focus: 'Comportamiento central del estudio',
    slides: 'Págs. 1-10',
    imagenUrl: '/images/lullaby/F17.jpg',
    imagenAlt: 'Contexto de consumo',
    artefacto: 'Artefacto / Utensilio fetiche',
    descripcionHabitat: 'Descripción del contexto o hábitat cotidiano analizado.'
  }
];

export const BLANK_PLAYBOOK_DATASET = {
  evidences: [],
  insights: [],
  tensions: [],
  decisionChains: [],
  transitions: [],
  brandMatrix: [],
  opportunities: [],
  homes: DEFAULT_HOMES_TEMPLATE,
  actors: [],
  contexts: [],
  transversalBridge: [],
  lastUpdated: new Date().toISOString()
};
