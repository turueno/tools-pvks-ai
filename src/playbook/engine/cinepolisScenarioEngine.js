// src/playbook/engine/cinepolisScenarioEngine.js
// Motor de derivación contextual para el Scenario Lab de Cinépolis VIP (Compra de Alimentos por App)
// Fundamentado en el estudio etnográfico y sesiones cualitativas con usuarios VIP frecuentes.

export const CINEPOLIS_SCENARIO_DIMENSIONS = [
  {
    id: 'momento_journey',
    title: '1. Momento Operativo del Journey',
    description: 'Etapa temporal y espacial en la que el usuario se encuentra respecto a la función.',
    color: '#0284C7',
    icon: 'sliders',
    factors: [
      {
        id: 'momento',
        label: 'Momento de Interacción',
        options: [
          {
            value: 'anticipado',
            label: 'En Camino / Previo (15–45 min)',
            desc: 'En transporte o casa. Tiempo para explorar menú y decidir con calma.'
          },
          {
            value: 'lobby',
            label: 'Llegando al Lobby (0–10 min)',
            desc: 'Prisa por inicio de función. Filas en dulcería vs. entrada a sala.'
          },
          {
            value: 'en_butaca',
            label: 'Ya en Butaca / Durante Cortos',
            desc: 'Comodidad física instalada. Deseo de ordenar sin ponerse de pie.'
          },
          {
            value: 'pelicula_iniciada',
            label: 'Función Iniciada / Oscuridad',
            desc: 'Película en curso. Rechazo a ruidos, luces y paseos de personal.'
          }
        ]
      }
    ]
  },
  {
    id: 'acompanamiento',
    title: '2. Tipo de Salida & Compañía',
    description: 'Contexto social que condiciona el ritual de compra y el nivel de privacidad deseado.',
    color: '#7C3AED',
    icon: 'network',
    factors: [
      {
        id: 'compania',
        label: 'Acompañamiento',
        options: [
          {
            value: 'pareja',
            label: 'En Pareja / Cita Romántica',
            desc: 'Ritual de elección compartida; aversión a interrupciones en sala.'
          },
          {
            value: 'solo',
            label: 'Solo / Desconexión Personal',
            desc: 'Búsqueda de consentirse ("mi lugar seguro") o rapidez pragmática.'
          },
          {
            value: 'familia_amigos',
            label: 'Con Familia o Amigos',
            desc: 'Múltiples preferencias, control de presupuesto y combos grandes.'
          }
        ]
      }
    ]
  },
  {
    id: 'perfil_actitudinal',
    title: '3. Perfil Actitudinal del Usuario',
    description: 'Mentalidad sobre lo que significa el valor VIP: servicio humano vs. autonomía.',
    color: '#D97706',
    icon: 'tension',
    factors: [
      {
        id: 'perfil',
        label: 'Significado de la Experiencia VIP',
        options: [
          {
            value: 'perfil1_cuidado',
            label: 'Perfil 1: Cuidado & Apapacho',
            desc: 'Valora la atención del mesero, recomendaciones y sentirse atendido.'
          },
          {
            value: 'perfil2_autonomia',
            label: 'Perfil 2: Autonomía & Control',
            desc: 'Valora rapidez digital, no interactuar y comida servida en butaca.'
          }
        ]
      }
    ]
  },
  {
    id: 'experiencia_ux',
    title: '4. Experiencia & UX de la App',
    description: 'Nivel de fricción técnica y diseño de funnel experimentado en la aplicación móvil.',
    color: '#059669',
    icon: 'decision',
    factors: [
      {
        id: 'ux_estado',
        label: 'Funnel de Compra en App',
        options: [
          {
            value: 'bundle_fluido',
            label: 'Bundle Integrado (Boletos + Comida)',
            desc: 'Un solo checkout fluido: boletos y comida comprados juntos.'
          },
          {
            value: 'flujo_separado',
            label: 'Flujo Desacoplado (Comida Aislada)',
            desc: 'Exige comprar boletos primero y luego volver a buscar alimentos.'
          },
          {
            value: 'falla_tecnica',
            label: 'Falla Técnica o Sin Confirmación',
            desc: 'Incertidumbre de si la comida llegará a tiempo a la butaca.'
          }
        ]
      }
    ]
  }
];

export const DEFAULT_CINEPOLIS_SCENARIO_STATE = {
  momento: 'anticipado',
  compania: 'pareja',
  perfil: 'perfil2_autonomia',
  ux_estado: 'bundle_fluido'
};

export const CINEPOLIS_SCENARIO_PRESETS = [
  {
    id: 'preset-cine-1',
    nombre: 'Pre-orden en Camino para Cita en Pareja',
    contextoReporte: 'Pág. 11 del Reporte: Compran con calma en trayecto; llegan directo a cortos con comida en butaca.',
    dimensiones: {
      momento: 'anticipado',
      compania: 'pareja',
      perfil: 'perfil2_autonomia',
      ux_estado: 'bundle_fluido'
    }
  },
  {
    id: 'preset-cine-2',
    nombre: 'Llegada con Prisa y Película por Empezar',
    contextoReporte: 'Pág. 18 del Reporte: Fila en dulcería del lobby y app sin bundle; riesgo de entrar con las manos vacías.',
    dimensiones: {
      momento: 'lobby',
      compania: 'pareja',
      perfil: 'perfil2_autonomia',
      ux_estado: 'flujo_separado'
    }
  },
  {
    id: 'preset-cine-3',
    nombre: 'Búsqueda del Apapacho VIP Tradicional',
    contextoReporte: 'Págs. 7 y 8 del Reporte: El usuario busca que el mesero lo reciba, le recomiende y lo consienta en sala.',
    dimensiones: {
      momento: 'en_butaca',
      compania: 'solo',
      perfil: 'perfil1_cuidado',
      ux_estado: 'flujo_separado'
    }
  },
  {
    id: 'preset-cine-4',
    nombre: 'Función Iniciada: Cero Interrupciones en Butaca',
    contextoReporte: 'Pág. 10 del Reporte: En plena proyección, la interrupción del staff rompe la magia; la pre-orden es crítica.',
    dimensiones: {
      momento: 'pelicula_iniciada',
      compania: 'pareja',
      perfil: 'perfil2_autonomia',
      ux_estado: 'bundle_fluido'
    }
  }
];

export function evaluateCinepolisScenario(state) {
  const {
    momento = 'anticipado',
    compania = 'pareja',
    perfil = 'perfil2_autonomia',
    ux_estado = 'bundle_fluido'
  } = state || {};

  // Cálculo dinámico de scores de tracción por canal (0 - 100)
  let appScore = 55;
  let meseroScore = 50;
  let dulceriaScore = 40;

  // Modificadores según Momento
  if (momento === 'anticipado') {
    appScore += 25;
    meseroScore -= 20;
    dulceriaScore -= 20;
  } else if (momento === 'lobby') {
    appScore -= 10;
    meseroScore -= 10;
    dulceriaScore += 35;
  } else if (momento === 'en_butaca') {
    appScore += 10;
    meseroScore += 25;
    dulceriaScore -= 30;
  } else if (momento === 'pelicula_iniciada') {
    appScore += 15;
    meseroScore -= 35;
    dulceriaScore -= 45;
  }

  // Modificadores según Compañía
  if (compania === 'pareja') {
    appScore += 10; // Evita interrupciones en cita
    if (momento === 'pelicula_iniciada') meseroScore -= 15;
  } else if (compania === 'solo') {
    if (perfil === 'perfil1_cuidado') meseroScore += 15;
  } else if (compania === 'familia_amigos') {
    dulceriaScore += 15;
  }

  // Modificadores según Perfil
  if (perfil === 'perfil2_autonomia') {
    appScore += 20;
    meseroScore -= 15;
  } else if (perfil === 'perfil1_cuidado') {
    appScore -= 15;
    meseroScore += 25;
  }

  // Modificadores según Estado del UX
  if (ux_estado === 'bundle_fluido') {
    appScore += 20;
  } else if (ux_estado === 'flujo_separado') {
    appScore -= 25;
    if (momento === 'lobby') dulceriaScore += 15;
    if (momento === 'en_butaca') meseroScore += 20;
  } else if (ux_estado === 'falla_tecnica') {
    appScore -= 45;
    meseroScore += 30; // El staff actúa como rescate
    dulceriaScore += 15;
  }

  const clamp = (val) => Math.max(10, Math.min(95, val));
  appScore = clamp(appScore);
  meseroScore = clamp(meseroScore);
  dulceriaScore = clamp(dulceriaScore);

  const getTrend = (s) => (s >= 65 ? 'alta-tracción' : s >= 45 ? 'estable' : 'bajo-riesgo');

  const necesidadesAumentan = [];
  const necesidadesDisminuyen = [];

  if (momento === 'anticipado' && ux_estado === 'bundle_fluido') {
    necesidadesAumentan.push({
      texto: 'Comida servida en butaca exactamente al ingresar a la sala',
      peso: 'Crítico',
      razon: 'Pág. 11: Decidir con calma en el trayecto para llegar directo a los cortos con la mesita lista.'
    });
    necesidadesAumentan.push({
      texto: 'Confirmación en tiempo real del estatus del pedido',
      peso: 'Alto',
      razon: 'Certeza visual en la app de que la cocina recibió la orden vinculada al número de butaca.'
    });
    necesidadesDisminuyen.push({
      texto: 'Dependencia del mesero para tomar la orden en sala',
      peso: 'Alto',
      razon: 'La transacción digital previa hace obsoleto el protocolo de ordenar en sala.'
    });
  }

  if (momento === 'pelicula_iniciada') {
    necesidadesAumentan.push({
      texto: 'Cero interrupciones visuales y sonoras en la butaca',
      peso: 'Crítico',
      razon: 'Pág. 10: "No me gusta ser interrumpido a cada rato, cuando empieza la película quiero inmersión total".'
    });
    necesidadesDisminuyen.push({
      texto: 'Cobro físico con terminal luminosa en la oscuridad',
      peso: 'Crítico',
      razon: 'La luz de las terminales de cobro molesta a toda la fila y rompe la magia del cine.'
    });
  }

  if (perfil === 'perfil1_cuidado') {
    necesidadesAumentan.push({
      texto: 'Atención cálida, bienvenida y recomendaciones personalizadas del staff',
      peso: 'Alto',
      razon: 'Pág. 7: El usuario asocia el estatus VIP al trato humano, sentirse consentido y bien recibido.'
    });
  }

  if (ux_estado === 'flujo_separado') {
    necesidadesAumentan.push({
      texto: 'Recordatorio oportuno de compra de alimentos antes de llegar al cine',
      peso: 'Alto',
      razon: 'Pág. 18: Cuando la app separa los boletos de los alimentos, el usuario olvida hacer el segundo pedido.'
    });
  }

  if (ux_estado === 'falla_tecnica') {
    necesidadesAumentan.push({
      texto: 'Protocolo de rescate humano inmediato en sala ante incidencias digitales',
      peso: 'Crítico',
      razon: 'Pág. 21: "Todo lo hago por la app pero si algo falla lo veo directo con los chicos en sala".'
    });
  }

  const tensionesEmergentes = [];
  if (perfil === 'perfil2_autonomia' && momento === 'en_butaca') {
    tensionesEmergentes.push({
      titulo: 'Autonomía Digital vs. Fricción del Servicio Tradicional',
      razon: 'El usuario prefiere controlar todo desde su teléfono, pero si la comida tarda o el botón de butaca no responde, se genera frustración.'
    });
  }
  if (ux_estado === 'flujo_separado') {
    tensionesEmergentes.push({
      titulo: 'Deseo de Planificar vs. Desconexión en el Funnel de Compra',
      razon: 'El usuario compra boletos con anticipación pero la app no facilita la venta cruzada de alimentos en el mismo paso.'
    });
  }
  if (momento === 'pelicula_iniciada') {
    tensionesEmergentes.push({
      titulo: 'Consumo Continuo vs. Preservación de la Atmósfera de la Sala',
      razon: 'El apetito por más snacks choca con la incomodidad de encender pantallas o llamar al staff a mitad de la trama.'
    });
  }

  const implicacionesMarca = [
    'Unificación obligatoria del checkout: la compra de alimentos debe ofrecerse como un paso natural integrado a la selección de butacas.',
    'Reconceptualización del personal de sala: transitar de "tomadores de pedidos" a "concierges de bienvenida y entrega silenciosa".',
    'Pantalla de estatus del pedido en vivo: indicar "En preparación" y "Entregado en butaca" para erradicar la incertidumbre.'
  ];

  const oportunidadesPlausibles = [
    'Notificación Geofencing de Trayecto: "Vas en camino a Cinépolis VIP: ¿preparamos tus palomitas para que estén calientes al llegar?"',
    'VIP Express Pick-up Lane: barra rápida en dulcería para quienes prefieren recoger su combo sin fila antes de entrar.',
    'Combo Butaca Inteligente: sugerencia de combo personalizado según el horario y tipo de película.'
  ];

  const hipotesisValidar = [
    'Habilitar el bundle unificado de boletos + alimentos en la App incrementará la tasa de conversión de alimentos del 15% al 45% en 60 días.',
    'La entrega de pedidos pre-ordenados antes de que inicien los cortos reduce las quejas de servicio en un 70% en salas VIP.'
  ];

  return {
    relevanciaSoluciones: {
      app: {
        nombre: 'Cinépolis VIP App (Pre-orden Digital)',
        score: appScore,
        tendencia: getTrend(appScore),
        diagnostico:
          appScore >= 65
            ? 'Canal dominante: maximiza la autonomía, elimina filas y asegura que la butaca esté servida a tiempo.'
            : 'Fricción en canal: fallas de UX o flujo desacoplado empujan al usuario a resolver de manera presencial.'
      },
      mesero: {
        nombre: 'Servicio en Sala (Mesero Concierge)',
        score: meseroScore,
        tendencia: getTrend(meseroScore),
        diagnostico:
          meseroScore >= 65
            ? 'Canal preferente: aporta la sensación de cuidado, recomendación y ritual VIP tradicional en sala.'
            : 'Riesgo de fricción: interrupciones durante la función o cobro en la oscuridad degradan la experiencia.'
      },
      dulceria: {
        nombre: 'Dulcería Tradicional (Lobby Presencial)',
        score: dulceriaScore,
        tendencia: getTrend(dulceriaScore),
        diagnostico:
          dulceriaScore >= 55
            ? 'Canal de impulso: el aroma y la inmediatez visual capturan compras espontáneas a la entrada.'
            : 'Canal secundario: las filas y la prisa por entrar a sala inhiben la compra presencial en lobby.'
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
