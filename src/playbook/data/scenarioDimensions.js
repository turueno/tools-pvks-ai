// src/playbook/data/scenarioDimensions.js
// Dimensiones epistemológicas y estados discretos para el Scenario Lab
// Basado en el estudio etnográfico en hogares (Lullaby CDMX)

export const SCENARIO_DIMENSIONS = [
  {
    id: 'material',
    title: '1. Situación Material & Entorno Operativo',
    description: 'Restricciones físicas tangibles de tiempo, espacio y despensa en el momento de la alimentación.',
    color: '#0284C7',
    icon: 'sliders',
    factors: [
      {
        id: 'tiempo',
        label: 'Ventana de Tiempo Disponible',
        options: [
          {
            value: 'colapso',
            label: 'Colapso Matutino (<3 min)',
            desc: 'Salida de casa, prisas, trabajo simultáneo. Imposible cocinar.'
          },
          {
            value: 'normal',
            label: 'Rutina Ordinaria (15-20 min)',
            desc: 'Tiempo estándar para calentar o usar licuadora.'
          },
          {
            value: 'holgado',
            label: 'Cocina Artesanal (>45 min)',
            desc: 'Fin de semana o tiempo dedicado para hervir, colar y procesar.'
          }
        ]
      },
      {
        id: 'espacio',
        label: 'Infraestructura del Espacio',
        options: [
          {
            value: 'cocina',
            label: 'Cocina Propia Equipada',
            desc: 'Estufa, refri, agua purificada, vajilla limpia.'
          },
          {
            value: 'transito',
            label: 'En Tránsito / Oficina / Carro',
            desc: 'Sin calor directo, requiere alimentos listos a temperatura ambiente.'
          },
          {
            value: 'calle_feria',
            label: 'Calle / Feria Ambulante',
            desc: 'Cero agua corriente, riesgo de contaminación, comida estéril sellada.'
          }
        ]
      },
      {
        id: 'sustitutos',
        label: 'Despensa y Sustitutos Inmediatos',
        options: [
          {
            value: 'leche_familiar_refri',
            label: 'Leche de vaca / Opciones familiares listas',
            desc: 'La familia consume leche pasteurizada de $25 que ya está en el refri.'
          },
          {
            value: 'insumos_naturales',
            label: 'Avena en hojuelas / Granos crudos',
            desc: 'Requieren preparación y cocción previa.'
          },
          {
            value: 'sin_alternativas',
            label: 'Sin alternativas preparadas',
            desc: 'Dependencia absoluta de productos comprados o comida de calle.'
          }
        ]
      }
    ]
  },
  {
    id: 'bebe',
    title: '2. El Bebé: Maduración & Permiso Biológico',
    description: 'Etapa de desarrollo psicomotriz, textura tolerable y respuesta del organismo del infante.',
    color: '#00B487',
    icon: 'actor',
    factors: [
      {
        id: 'maduracion',
        label: 'Hito de Desarrollo & Alimentación',
        options: [
          {
            value: 'iniciacion',
            label: 'Iniciación (6-8 meses)',
            desc: 'Papillas puras monoingrediente lisas, dependiente de cuchara asistida.'
          },
          {
            value: 'transicion',
            label: 'Transición y Texturas (9-11 meses)',
            desc: 'Puffs de autoagarre, papillas grumosas, vaso de entrenamiento.'
          },
          {
            value: 'bypass_ano',
            label: 'Bypass del 1er Año (12-24 meses)',
            desc: 'Masticación sólida, rechaza "ser tratado como bebé", come familiar.'
          }
        ]
      },
      {
        id: 'tolerancia',
        label: 'Comprobación de Tolerancia Gastrointestinal',
        options: [
          {
            value: 'tolerancia_probada',
            label: 'Tolerancia Probada ("No le soltó el estómago")',
            desc: 'Ya probó comida o leche común y no hubo diarrea. La especialización pierde urgencia.'
          },
          {
            value: 'estomago_delicado',
            label: 'Estómago Delicado / Sospecha',
            desc: 'Episodios recientes de diarrea o miedo a intolerancia a la lactosa.'
          }
        ]
      }
    ]
  },
  {
    id: 'autoridad',
    title: '3. Ecosistema de Autoridad & Validación Externa',
    description: 'Actores que legitiman, autorizan o contradicen las decisiones de nutrición de la madre.',
    color: '#7C3AED',
    icon: 'network',
    factors: [
      {
        id: 'pediatra',
        label: 'Vínculo y Autorización del Pediatra',
        options: [
          {
            value: 'luz_verde_familiar',
            label: 'Luz Verde: "Ya puede comer de todo / leche entera"',
            desc: 'El pediatra autoriza la comida de la mesa y la leche pasteurizada (Pág. 7).'
          },
          {
            value: 'prescripcion_estricta',
            label: 'Prescripción Médica Estricta',
            desc: 'Mamá triangula cada ingrediente con el doctor antes de comprar (Pág. 11).'
          },
          {
            value: 'consulta_distante',
            label: 'Consulta Distante / Tradición',
            desc: 'La voz médica queda en pausa frente a la inmediatez familiar.'
          }
        ]
      },
      {
        id: 'familia_extensa',
        label: 'Presencia de Abuelos & Familia',
        options: [
          {
            value: 'abuelos_activos',
            label: 'Co-crianza / Abuelos Activos ("Un poquito no le hace daño")',
            desc: 'Convidan guisados con condimentos de la mesa adulta los fines de semana.'
          },
          {
            value: 'cuidado_aislado',
            label: 'Cuidado Nuclear Aislado',
            desc: 'Mamá o pareja deciden con control total sin interferencias tradicionales.'
          }
        ]
      }
    ]
  },
  {
    id: 'moral',
    title: '4. Marco Moral & Filtros Perceptivos de Mamá',
    description: 'El lente emocional y los sesgos éticos con los que mamá juzga el alimento infantil.',
    color: '#DC2626',
    icon: 'tension',
    factors: [
      {
        id: 'filtro_azucar',
        label: 'Filtro de Sellos & Cero Azúcar Añadida',
        options: [
          {
            value: 'filtro_excluyente',
            label: 'Vigilancia Quirúrgica (Filtro Excluyente)',
            desc: 'Si tiene sello o azúcar añadida, queda descartado al instante (Pág. 13).'
          },
          {
            value: 'prueba_sensorial',
            label: 'Prueba Sensorial Casera',
            desc: 'Mamá cata el producto para contrastarlo con el dulzor excesivo de su infancia.'
          },
          {
            value: 'permisivo_situacional',
            label: 'Permisividad Situacional',
            desc: 'En salidas, premios o convivencias se suspende la exigencia de sellos.'
          }
        ]
      },
      {
        id: 'culpa_alivio',
        label: 'Gestión de Culpa vs. Alivio Práctico',
        options: [
          {
            value: 'alivio_legitimado',
            label: 'Alivio Legitimado ("No me voy a torturar")',
            desc: 'Acepta productos industriales limpios como salvaguarda necesaria (Pág. 22).'
          },
          {
            value: 'alta_exigencia',
            label: 'Alta Autoexigencia Moral',
            desc: 'Siente culpa si no prepara todo desde cero con sus propias manos.'
          }
        ]
      }
    ]
  }
];

export const DEFAULT_SCENARIO_STATE = {
  tiempo: 'normal',
  espacio: 'cocina',
  sustitutos: 'leche_familiar_refri',
  maduracion: 'bypass_ano',
  tolerancia: 'tolerancia_probada',
  pediatra: 'luz_verde_familiar',
  familia_extensa: 'cuidado_aislado',
  filtro_azucar: 'filtro_excluyente',
  culpa_alivio: 'alivio_legitimado'
};
