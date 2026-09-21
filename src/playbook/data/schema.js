export const EPISTEMIC_LEVELS = {
  OBSERVADO: {
    key: 'OBSERVADO',
    label: 'Observado',
    color: '#0284c7', // Sky blue
    bg: 'rgba(2, 132, 199, 0.12)',
    border: 'rgba(2, 132, 199, 0.4)',
    badgeClass: 'badge-observado',
    description: 'Hecho empírico registrado directamente: citas textuales, registros de despensa, rutinas presenciadas, utensilios.'
  },
  DERIVADO: {
    key: 'DERIVADO',
    label: 'Derivado',
    color: '#d97706', // Amber
    bg: 'rgba(217, 119, 6, 0.12)',
    border: 'rgba(217, 119, 6, 0.4)',
    badgeClass: 'badge-derivado',
    description: 'Interpretación causal, tensión latente, mecanismo psicológico o inferencia analítica de los investigadores.'
  },
  HIPOTESIS: {
    key: 'HIPOTESIS',
    label: 'Hipótesis',
    color: '#10b981', // Emerald green
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.4)',
    badgeClass: 'badge-hipotesis',
    description: 'Proyección estratégica, escenario futuro, territorio de oportunidad o postulado plausible pendiente de validación empírica.'
  }
};

export const LAYERS = [
  { id: 'evidencia', label: '1. Evidencia', short: 'Evidencia', desc: 'Registros concretos del campo etnográfico' },
  { id: 'hallazgo', label: '2. Hallazgo', short: 'Hallazgo', desc: 'Insight estructurado del comportamiento' },
  { id: 'mecanismo', label: '3. Mecanismo', short: 'Mecanismo', desc: 'Regla o lógica operativa subyacente' },
  { id: 'condiciones', label: '4. Condiciones', short: 'Condiciones', desc: 'Factores de entorno que lo sostienen' },
  { id: 'implicacion', label: '5. Implicación', short: 'Implicación', desc: 'Impacto directo para la marca/categoría' },
  { id: 'escenario', label: '6. Escenario', short: 'Escenario', desc: 'Derivación situacional o futura' }
];

export const VISUAL_PHASES = [
  { id: 'EVIDENCIA', label: 'EVIDENCIA', desc: 'Lo que se vio y escuchó en el hogar' },
  { id: 'INTERPRETACION', label: 'INTERPRETACIÓN', desc: 'Mecanismo, tensión y necesidades profundas' },
  { id: 'IMPLICACION', label: 'IMPLICACIÓN', desc: 'Riesgos, desafíos y efecto en la categoría' },
  { id: 'ESCENARIO', label: 'ESCENARIO', desc: 'Oportunidades y derivaciones plausibles' }
];

export const BRANDS = ['Nido', 'Nestum', 'Gerber', 'NAN', 'Leche Entera Familiar', 'Avena Natural'];

export const HOMES = [
  {
    id: 'hogar-1',
    name: 'Hogar Belén (Inmersión Nido)',
    target: 'Mamá Belén, hija de 1 año',
    focus: 'Transición a comida familiar y leche entera',
    slides: 'Págs. 3–9',
    imagenUrl: '/images/lullaby/F17.jpg',
    imagenAlt: 'Hogar de Belén: Cocina y mesa familiar',
    artefacto: 'Cazuela familiar y vaso entrenador',
    descripcionHabitat: 'Cocina familiar activa donde se elabora el menú de todos y se separan porciones infantiles antes de condimentar.'
  },
  {
    id: 'hogar-2',
    name: 'Hogar Liam (Inmersión Nestum)',
    target: 'Mamá trabajadora, hijo Liam',
    focus: 'Regreso al trabajo, validación y avena vs. Nestum',
    slides: 'Págs. 10–18',
    imagenUrl: '/images/lullaby/F17.jpg',
    imagenAlt: 'Hogar de Liam: Barra de cocina y rincón de trabajo remoto',
    artefacto: 'Lata de Nestum y plato de silicona',
    descripcionHabitat: 'Estación de home office y barra de cocina donde el tiempo matutino colapsa ante la jornada laboral.'
  },
  {
    id: 'hogar-3',
    name: 'Hogar Ferias (Inmersión Gerber)',
    target: 'Mamá dedicada, jornadas de feria',
    focus: 'Alimentación fuera de casa, estándar vs. kit Gerber',
    slides: 'Págs. 19–27',
    imagenUrl: '/images/lullaby/F21.jpg',
    imagenAlt: 'Hogar de Ferias: Maletín Kit Gerber y puesto ambulante',
    artefacto: 'Maletín organizador transparente Kit Gerber',
    descripcionHabitat: 'Contraste extremo entre el hogar pulcro con esterilizador eléctrico y la calle en puestos de feria de 14 horas.'
  }
];
