// src/playbook/engine/genericScenarioEngine.js
// Motor de simulación y cálculo de tracción universal para cualquier Playbook de la Suite
// Se adapta dinámicamente a la vertical, marcas y dimensiones del estudio activo.

export const GENERIC_SCENARIO_DIMENSIONS = [
  {
    id: 'momento_demanda',
    title: '1. Ocasión de Demanda & Contexto',
    description: 'Momento de necesidad y nivel de exigencia en el que se encuentra el usuario.',
    color: '#0284C7',
    icon: 'contexto',
    factors: [
      {
        id: 'momento',
        label: 'Tipo de Ocasión',
        options: [
          {
            value: 'rutina_habitual',
            label: 'Consumo / Uso Habitual de Rutina',
            desc: 'Búsqueda de conveniencia, rapidez y mínima fricción cognitiva.'
          },
          {
            value: 'urgencia_critica',
            label: 'Situación de Urgencia o Alta Exigencia',
            desc: 'Baja tolerancia a esperas o errores; necesidad de resolución inmediata.'
          },
          {
            value: 'exploracion_novedad',
            label: 'Exploración o Prueba de Nueva Alternativa',
            desc: 'Búsqueda de información, recomendaciones y validación antes de decidir.'
          }
        ]
      }
    ]
  },
  {
    id: 'canal_acceso',
    title: '2. Modalidad de Interacción & Canal',
    description: 'Vía a través de la cual el usuario interactúa con la propuesta de valor.',
    color: '#7C3AED',
    icon: 'solucion',
    factors: [
      {
        id: 'canal',
        label: 'Canal Primario de Acceso',
        options: [
          {
            value: 'digital_autoservicio',
            label: 'Digital / App / Autoservicio',
            desc: 'Autonomía y control directo desde el dispositivo móvil o plataforma web.'
          },
          {
            value: 'presencial_asistido',
            label: 'Presencial Asistido / Servicio Humano',
            desc: 'Atención personalizada, asesoría directa y resolución en persona.'
          },
          {
            value: 'omnicanal_hibrido',
            label: 'Híbrido / Pick-up / Omnicanal',
            desc: 'Combinación de preparación digital y consumo o recolección física.'
          }
        ]
      }
    ]
  },
  {
    id: 'perfil_actitudinal',
    title: '3. Perfil Actitudinal del Usuario',
    description: 'Mentalidad de compra y criterio de valor prioritario para el usuario.',
    color: '#D97706',
    icon: 'tension',
    factors: [
      {
        id: 'perfil',
        label: 'Criterio de Valor Dominante',
        options: [
          {
            value: 'orientado_eficiencia',
            label: 'Pragmático: Eficiencia, Tiempo & Precio',
            desc: 'Prioriza agilidad, certidumbre de costo y cero pasos innecesarios.'
          },
          {
            value: 'orientado_experiencia',
            label: 'Experiencial: Calidad, Confort & Trato Personal',
            desc: 'Dispuesto a invertir más por atención superior, cuidado y personalización.'
          }
        ]
      }
    ]
  },
  {
    id: 'friccion_operativa',
    title: '4. Nivel de Fricción & Confianza Operativa',
    description: 'Estado de cumplimiento de la promesa y grado de fricción en la entrega.',
    color: '#059669',
    icon: 'decision',
    factors: [
      {
        id: 'friccion',
        label: 'Experiencia Operativa del Servicio',
        options: [
          {
            value: 'sin_friccion',
            label: 'Experiencia Fluida & Confiable',
            desc: 'Confirmación clara, trazabilidad y cumplimiento exacto de la promesa.'
          },
          {
            value: 'friccion_intermedia',
            label: 'Fricción Operativa o Falta de Información',
            desc: 'Incertidumbre en tiempos, dudas en pasarela o soporte poco claro.'
          },
          {
            value: 'falla_quiebre',
            label: 'Quiebre de Servicio o Falla Técnica',
            desc: 'Interrupción del flujo, retraso grave o incompatibilidad operativa.'
          }
        ]
      }
    ]
  }
];

export const DEFAULT_GENERIC_SCENARIO_STATE = {
  momento: 'rutina_habitual',
  canal: 'digital_autoservicio',
  perfil: 'orientado_eficiencia',
  friccion: 'sin_friccion'
};

export const GENERIC_SCENARIO_PRESETS = [
  {
    id: 'preset-optimo',
    nombre: 'Escenario Ideal: Experiencia Digital Fluida',
    contextoReporte: 'Arquetipo de alta adopción digital y fidelidad',
    descripcion: 'Usuario pragmático que utiliza el canal digital en su rutina sin fricciones operativas.',
    dimensiones: {
      momento: 'rutina_habitual',
      canal: 'digital_autoservicio',
      perfil: 'orientado_eficiencia',
      friccion: 'sin_friccion'
    }
  },
  {
    id: 'preset-friccion',
    nombre: 'Escenario de Fricción: Falla Operativa y Quiebre de Confianza',
    contextoReporte: 'Punto de dolor crítico ante incidencias en canal digital',
    descripcion: 'Situación urgente donde el canal digital falla, obligando a un rescate humano asistido.',
    dimensiones: {
      momento: 'urgencia_critica',
      canal: 'digital_autoservicio',
      perfil: 'orientado_eficiencia',
      friccion: 'falla_quiebre'
    }
  },
  {
    id: 'preset-asistido',
    nombre: 'Escenario de Hospitalidad: Servicio Asistido de Alto Valor',
    contextoReporte: 'Momento de valor añadido y personalización humana',
    descripcion: 'Usuario experiencial que busca asesoría directa, apapacho y confort asistido en persona.',
    dimensiones: {
      momento: 'exploracion_novedad',
      canal: 'presencial_asistido',
      perfil: 'orientado_experiencia',
      friccion: 'sin_friccion'
    }
  },
  {
    id: 'preset-urgencia',
    nombre: 'Escenario de Tensión: Demanda Bajo Presión de Tiempo',
    contextoReporte: 'Transacción rápida con incertidumbre en cumplimiento',
    descripcion: 'Demanda de alta urgencia con fricción informativa que pone a prueba la lealtad de marca.',
    dimensiones: {
      momento: 'urgencia_critica',
      canal: 'omnicanal_hibrido',
      perfil: 'orientado_eficiencia',
      friccion: 'friccion_intermedia'
    }
  }
];

function getTrend(score) {
  if (score >= 68) return 'alta';
  if (score >= 48) return 'estable';
  return 'baja';
}

export function evaluateGenericScenario(scenarioState = {}, playbookMeta = {}, dataset = null) {
  const {
    momento = 'rutina_habitual',
    canal = 'digital_autoservicio',
    perfil = 'orientado_eficiencia',
    friccion = 'sin_friccion'
  } = scenarioState;

  const vertical = playbookMeta?.vertical || 'Consumo Masivo';
  const primaryBrand = playbookMeta?.primaryBrand || 'Marca Principal';

  // Obtener nombres de las soluciones a contrastar
  const rawBrandMatrix = dataset?.brandMatrix || [];
  const brand1Name = rawBrandMatrix[0]?.marca || primaryBrand;
  const brand2Name = rawBrandMatrix[1]?.marca || 'Canal / Servicio Asistido Presencial';
  const brand3Name = rawBrandMatrix[2]?.marca || 'Alternativas Tradicionales / Competidores';

  // Base scores
  let brand1Score = 65; // Digital / Marca Principal
  let brand2Score = 55; // Asistido / Servicio Humano
  let brand3Score = 50; // Tradicional / Competencia

  // Modificadores por Momento
  if (momento === 'rutina_habitual') {
    brand1Score += 10;
    brand3Score += 5;
  } else if (momento === 'urgencia_critica') {
    brand1Score += 5;
    brand2Score += 10;
    brand3Score -= 5;
  } else if (momento === 'exploracion_novedad') {
    brand2Score += 15;
    brand3Score += 5;
  }

  // Modificadores por Canal
  if (canal === 'digital_autoservicio') {
    brand1Score += 15;
    brand2Score -= 10;
  } else if (canal === 'presencial_asistido') {
    brand1Score -= 15;
    brand2Score += 20;
    brand3Score += 10;
  } else if (canal === 'omnicanal_hibrido') {
    brand1Score += 8;
    brand2Score += 5;
  }

  // Modificadores por Perfil
  if (perfil === 'orientado_eficiencia') {
    brand1Score += 10;
    brand2Score -= 5;
  } else if (perfil === 'orientado_experiencia') {
    brand1Score -= 5;
    brand2Score += 15;
  }

  // Modificadores por Fricción
  if (friccion === 'sin_friccion') {
    brand1Score += 10;
  } else if (friccion === 'friccion_intermedia') {
    brand1Score -= 12;
    brand2Score += 8;
    brand3Score += 5;
  } else if (friccion === 'falla_quiebre') {
    brand1Score -= 30;
    brand2Score += 20;
    brand3Score += 15;
  }

  // Normalizar límites (15 - 95)
  brand1Score = Math.max(15, Math.min(95, brand1Score));
  brand2Score = Math.max(15, Math.min(95, brand2Score));
  brand3Score = Math.max(15, Math.min(95, brand3Score));

  const necesidadesAumentan = [];
  const necesidadesDisminuyen = [];

  if (momento === 'urgencia_critica') {
    necesidadesAumentan.push({
      texto: 'Certidumbre inmediata de disponibilidad y tiempos exactos de entrega',
      peso: 'Crítico',
      razon: 'En situaciones de urgencia, la falta de información inmediata detona abandono hacia alternativas presenciales.'
    });
  }

  if (friccion === 'falla_quiebre') {
    necesidadesAumentan.push({
      texto: 'Protocolo de rescate humano y resolución en 1 clic ante incidencias',
      peso: 'Crítico',
      razon: 'Ante una falla técnica o demora, el usuario exige un punto de contacto humano inmediato para resolver.'
    });
  } else {
    necesidadesAumentan.push({
      texto: 'Fluidez y autonomía total en el flujo transaccional',
      peso: 'Alto',
      razon: 'La experiencia sin fricción consolida el hábito de uso y elimina la necesidad de asistencia externa.'
    });
  }

  if (perfil === 'orientado_eficiencia') {
    necesidadesDisminuyen.push({
      texto: 'Necesidad de interacción humana prolongada o conversación en el punto de contacto',
      razon: 'El usuario pragmático valora el tiempo y prefiere resolver con autonomía sin interrupciones.'
    });
  } else {
    necesidadesDisminuyen.push({
      texto: 'Tolerancia a flujos automatizados impersonales o desprovistos de empatía',
      razon: 'El usuario experiencial resiente los procesos fríos y busca sentirse acompañado y valorado.'
    });
  }

  const tensionesEmergentes = [];
  if (canal === 'digital_autoservicio' && friccion === 'falla_quiebre') {
    tensionesEmergentes.push({
      titulo: 'Autonomía Digital vs. Fricción por Ausencia de Respaldo Humano',
      razon: 'El usuario prefiere resolver por sí mismo, pero la falta de un canal de soporte ágil ante fallas genera desconfianza.'
    });
  }
  if (momento === 'urgencia_critica' && friccion === 'friccion_intermedia') {
    tensionesEmergentes.push({
      titulo: 'Presión de Tiempo vs. Opacidad en el Estatus de Cumplimiento',
      razon: 'La incertidumbre sobre el avance del pedido o servicio eleva el estrés y empuja a buscar canales tradicionales.'
    });
  }
  if (perfil === 'orientado_experiencia' && canal === 'digital_autoservicio') {
    tensionesEmergentes.push({
      titulo: 'Eficiencia Transaccional vs. Expectativa de Calidez y Apapacho',
      razon: 'La frialdad del canal digital contrasta con el deseo de recibir un trato exclusivo y personalizado.'
    });
  }

  const implicacionesMarca = [
    `Garantizar consistencia en ${vertical}: la promesa digital debe cumplirse con la misma calidad que el canal tradicional.`,
    'Habilitar canales de rescate inmediato: resolver incidencias en tiempo real transforma fricciones en fidelidad.',
    'Personalización basada en hábitos: adaptar las recomendaciones al perfil pragmático vs. experiencial del usuario.'
  ];

  const oportunidadesPlausibles = [
    `Tracking en Vivo y Trazabilidad 360° para pedidos y servicios en ${vertical}.`,
    'Modo Express 1-Tap: atajo ultrarrápido para compras y solicitudes frecuentes.',
    'Garantía de Satisfacción Inmediata: compensación o resolución automática si ocurre un quiebre de servicio.'
  ];

  const hipotesisValidar = [
    `Reducir la fricción operativa en el canal digital incrementará la recurrencia mensual en un 35% para ${primaryBrand}.`,
    'La integración de un canal de asistencia rápida reduce en 60% la tasa de deserción tras una primera incidencia.'
  ];

  return {
    relevanciaSoluciones: {
      solucion_1: {
        nombre: brand1Name,
        score: brand1Score,
        tendencia: getTrend(brand1Score),
        diagnostico:
          brand1Score >= 65
            ? 'Canal preferente: lidera en conveniencia, autonomía y agilidad para el usuario.'
            : 'Fricción en canal: factores de fricción o expectativa humana desvían la demanda hacia otros canales.'
      },
      solucion_2: {
        nombre: brand2Name,
        score: brand2Score,
        tendencia: getTrend(brand2Score),
        diagnostico:
          brand2Score >= 60
            ? 'Canal de alto valor: aporta certidumbre, empatía y resolución ante momentos críticos o de alta exigencia.'
            : 'Canal secundario: su mayor costo de tiempo o complejidad limita su adopción en momentos de rutina.'
      },
      solucion_3: {
        nombre: brand3Name,
        score: brand3Score,
        tendencia: getTrend(brand3Score),
        diagnostico:
          brand3Score >= 55
            ? 'Opción de respaldo: retiene cuota por hábito arraigado o cuando el canal principal presenta fallas.'
            : 'Canal en retroceso: superado por soluciones que ofrecen mayor velocidad y conveniencia.'
      }
    },
    necesidadesAumentan,
    necesidadesDisminuyen,
    tensionesEmergentes,
    implicacionesMarca,
    oportunidadesPlausibles,
    hipotesisValidar
  };
}
