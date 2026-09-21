// src/playbook/data/presets.js
// Presets estructurados para el Scenario Lab basados en las inmersiones del reporte

export const SCENARIO_PRESETS = [
  {
    id: 'preset-bypass',
    nombre: 'El Bypass del Primer Año',
    descripcion: 'El bebé cumple 12 meses. El pediatra flexibiliza lácteos y la familia ya toma leche pasteurizada entera de vaca.',
    dimensiones: {
      tiempo: 'normal',
      espacio: 'cocina',
      sustitutos: 'leche_familiar_refri',
      maduracion: 'bypass_ano',
      tolerancia: 'tolerancia_probada',
      pediatra: 'luz_verde_familiar',
      familia_extensa: 'abuelos_activos',
      filtro_azucar: 'filtro_excluyente',
      culpa_alivio: 'alivio_legitimado'
    },
    origenEntidadId: 'ins-02',
    contextoReporte: 'Inmersión Nido (Belén, Pág. 6 y 7)'
  },
  {
    id: 'preset-home-office',
    nombre: 'Retorno al Trabajo Remoto / Colapso Matutino',
    descripcion: 'Mamá retoma sus labores de oficina desde casa mientras atiende al bebé de forma simultánea. El tiempo matutino colapsa.',
    dimensiones: {
      tiempo: 'colapso',
      espacio: 'cocina',
      sustitutos: 'insumos_naturales',
      maduracion: 'transicion',
      tolerancia: 'tolerancia_probada',
      pediatra: 'prescripcion_estricta',
      familia_extensa: 'cuidado_aislado',
      filtro_azucar: 'filtro_excluyente',
      culpa_alivio: 'alivio_legitimado'
    },
    origenEntidadId: 'ins-04',
    contextoReporte: 'Inmersión Nestum (Mamá de Liam, Págs. 10–14)'
  },
  {
    id: 'preset-ferias',
    nombre: 'Jornada de Feria de 14 Horas (Calle)',
    descripcion: 'Día completo de comercio ambulante/feria. Salida antes del amanecer, sin agua corriente, sin cocina ni refrigeración.',
    dimensiones: {
      tiempo: 'colapso',
      espacio: 'calle_feria',
      sustitutos: 'sin_alternativas',
      maduracion: 'transicion',
      tolerancia: 'estomago_delicado',
      pediatra: 'consulta_distante',
      familia_extensa: 'cuidado_aislado',
      filtro_azucar: 'prueba_sensorial',
      culpa_alivio: 'alivio_legitimado'
    },
    origenEntidadId: 'ctx-ferias',
    contextoReporte: 'Inmersión Gerber (Mamá de Ferias, Págs. 19–21)'
  },
  {
    id: 'preset-abuelos',
    nombre: 'Sobremesa Dominical con Abuelos',
    descripcion: 'Almuerzo extendido en casa de la familia extensa. Las reglas dietéticas se flexibilizan y la comida familiar domina.',
    dimensiones: {
      tiempo: 'holgado',
      espacio: 'cocina',
      sustitutos: 'leche_familiar_refri',
      maduracion: 'bypass_ano',
      tolerancia: 'tolerancia_probada',
      pediatra: 'consulta_distante',
      familia_extensa: 'abuelos_activos',
      filtro_azucar: 'permisivo_situacional',
      culpa_alivio: 'alivio_legitimado'
    },
    origenEntidadId: 'ctx-mesa-familiar',
    contextoReporte: 'Inmersión Etnográfica (Hogar 1 y 3, Págs. 4–8)'
  }
];
