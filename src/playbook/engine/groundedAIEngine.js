// src/playbook/engine/groundedAIEngine.js
// Motor analítico para las 12 operaciones de pensamiento estratégico asistido por IA.
// Todas las respuestas están estrictamente fundamentadas en el reporte etnográfico (Págs. 1 a 29).

import { INSIGHTS, EVIDENCES, TENSIONS, ACTORS, CONTEXTS, BRAND_MATRIX, TRANSITIONS, OPPORTUNITIES } from '../data/playbookDataset.js';
import { evaluateScenario } from './scenarioEngine.js';

export const AI_ACTIONS = [
  {
    id: 'derivar-implicaciones',
    titulo: 'Derivar implicaciones',
    descripcion: 'Selecciona un insight para proyectar su impacto concreto sobre el negocio, la categoría y la comunicación.',
    requiere: ['insightId']
  },
  {
    id: 'cruzar-insights',
    titulo: 'Cruzar dos insights',
    descripcion: 'Descubre tensiones ocultas, sinergias o fricciones operativas al intersectar dos hallazgos distantes.',
    requiere: ['insightId', 'secondaryInsightId']
  },
  {
    id: 'encontrar-conexiones',
    titulo: 'Encontrar conexiones',
    descripcion: 'Rastrea la red de influencias que conectan a un actor específico con tensiones y decisiones de marca.',
    requiere: ['actorId']
  },
  {
    id: 'detectar-contradicciones',
    titulo: 'Detectar contradicciones',
    descripcion: 'Identifica discrepancias entre el discurso maternal idealizado y las prácticas pragmáticas del hogar.',
    requiere: []
  },
  {
    id: 'explicar-mecanismo',
    titulo: 'Explicar un mecanismo',
    descripcion: 'Desglosa la lógica causal profunda y los disparadores psicológicos de un comportamiento observado.',
    requiere: ['insightId']
  },
  {
    id: 'construir-escenario',
    titulo: 'Construir un escenario',
    descripcion: 'Proyecta una situación futura basada en la combinación de transiciones vitales y entornos específicos.',
    requiere: ['contextId', 'transitionId']
  },
  {
    id: 'comparar-contextos',
    titulo: 'Comparar contextos',
    descripcion: 'Analiza cómo la misma necesidad de alimentación se transforma al pasar de un entorno a otro.',
    requiere: ['contextId', 'secondaryContextId']
  },
  {
    id: 'modificar-variable',
    titulo: 'Identificar qué cambia si se modifica una variable',
    descripcion: 'Evalúa la sensibilidad del ecosistema ante el incremento o caída de un factor crítico de la madre.',
    requiere: ['variableKey']
  },
  {
    id: 'generar-hipotesis',
    titulo: 'Generar hipótesis',
    descripcion: 'Formula postulados estratégicos falsables a partir de observaciones y vacíos de mercado detectados.',
    requiere: ['marcaKey']
  },
  {
    id: 'evidencia-apoya',
    titulo: 'Mostrar evidencia que apoya una hipótesis',
    descripcion: 'Recupera las observaciones y citas textuales que respaldan una tesis sobre la categoría.',
    requiere: ['temaBusqueda']
  },
  {
    id: 'evidencia-contradice',
    titulo: 'Mostrar evidencia que contradice',
    descripcion: 'Busca contraejemplos y tensiones que desafían suposiciones comunes de marketing o ventas.',
    requiere: ['tesisComun']
  },
  {
    id: 'gaps-investigacion',
    titulo: 'Identificar qué información todavía no conocemos',
    descripcion: 'Detecta los ángulos ciegos de la inmersión y preguntas que requieren investigación posterior.',
    requiere: []
  }
];

export function executeAIOperation(actionId, params = {}, customData = {}) {
  const currentInsights = customData.insights || INSIGHTS;
  const currentEvidences = customData.evidences || EVIDENCES;
  const currentTransitions = customData.transitions || TRANSITIONS;
  const currentBrandMatrix = customData.brandMatrix || BRAND_MATRIX;
  const currentActors = customData.actors || ACTORS;
  const currentContexts = customData.contexts || CONTEXTS;

  switch (actionId) {
    case 'derivar-implicaciones': {
      const ins = currentInsights.find(i => i.id === params.insightId) || currentInsights[0];
      const evs = currentEvidences.filter(e => ins.evidenciaIds && ins.evidenciaIds.includes(e.id));
      return {
        accion: 'Derivar implicaciones',
        foco: ins.titulo,
        respuestaEstrategica: [
          {
            nivel: 'OBSERVADO',
            texto: `En el reporte (fuente: ${ins.fuenteReporte || 'Etnografía'}), se registró que: "${evs.length > 0 ? evs.map(e => e.cita).join(' ') : (ins.descripcion || 'Sin evidencia vinculada.')}"`
          },
          {
            nivel: 'DERIVADO',
            texto: `Implicación de Categoría: ${ins.implicaciones} El riesgo directo para las marcas involucradas (${ins.marcasRelacionadas.join(', ')}) radica en que: ${ins.riesgo}`
          },
          {
            nivel: 'HIPOTESIS',
            texto: `Territorio de Acción: ${ins.oportunidades} Si la marca adapta su propuesta a la condición de aceptación ("${ins.condicionAceptacion}"), puede neutralizar el abandono y capturar valor en la transición.`
          }
        ],
        elementosUtilizados: {
          insight: ins.titulo,
          fuente: ins.fuenteReporte,
          evidencias: evs.map(e => ({ codigo: e.codigo, cita: e.cita, fuente: e.fuente })),
          marcasAfectadas: ins.marcasRelacionadas
        },
        brechasAbiertas: 'El reporte no cuantifica el volumen exacto de abandono por nivel socioeconómico en tiendas tradicionales frente a autoservicio.'
      };
    }

    case 'cruzar-insights': {
      const insA = currentInsights.find(i => i.id === params.insightId) || currentInsights[1] || currentInsights[0];
      const insB = currentInsights.find(i => i.id === params.secondaryInsightId) || currentInsights[4] || currentInsights[0];
      return {
        accion: 'Cruzar dos insights',
        foco: `"${insA?.titulo || ''}" ✕ "${insB?.titulo || ''}"`,
        respuestaEstrategica: [
          {
            nivel: 'OBSERVADO',
            texto: `Cruce empírico: Mientras que en ${(insA?.marcasRelacionadas || []).join('/')} se observa la tensión de "${insA?.tension || ''}", en ${(insB?.marcasRelacionadas || []).join('/')} la madre aplica el criterio de "${insB?.tension || ''}".`
          },
          {
            nivel: 'DERIVADO',
            texto: `Intersección causal: La vulnerabilidad del producto en el primer insight se intensifica drásticamente cuando entra en juego el filtro heurístico del segundo insight. Si la marca no ofrece señales inmediatas ("Sin Azúcar Añadida"), la madre no solo considera el bypass hacia alimentos cotidianos, sino que lo legitima moralmente con rapidez.`
          },
          {
            nivel: 'HIPOTESIS',
            texto: `Oportunidad combinada: Diseñar una propuesta que resuelva la fricción de "${insA?.necesidad || ''}" cumpliendo estrictamente con la barrera de entrada de "${insB?.condicionAceptacion || ''}".`
          }
        ],
        elementosUtilizados: {
          insightPrincipal: insA?.titulo || '',
          insightSecundario: insB?.titulo || '',
          fuentes: [insA?.fuenteReporte, insB?.fuenteReporte].filter(Boolean)
        },
        brechasAbiertas: '¿Cómo reacciona el pediatra si una leche de crecimiento reformulada sin azúcar tiene un sabor menos dulce que el niño inicialmente rechaza?'
      };
    }

    case 'encontrar-conexiones': {
      const actor = currentActors.find(a => a.id === params.actorId) || currentActors[2] || currentActors[0]; // Pediatra
      return {
        accion: 'Encontrar conexiones',
        foco: `Red de influencia de: ${actor?.nombre || 'Actor'}`,
        respuestaEstrategica: [
          {
            nivel: 'OBSERVADO',
            texto: `En los 3 hogares del estudio, ${actor?.nombre || 'el actor'} tiene un rol de: ${actor?.rol || ''}. Cita representativa: "${actor?.citas?.[0] || ''}" (Págs. 5, 11 y 23).`
          },
          {
            nivel: 'DERIVADO',
            texto: `Conexión sistémica: El actor no actúa en el vacío; está conectado en bucle con las Redes Sociales (TikTok genera las dudas que la mamá lleva a consulta, Pág. 12) y con la respuesta biológica del Bebé (el pediatra autoriza, pero si el bebé tiene diarrea o rechazo, la decisión se revierte). Además, en el caso de Nido, el pediatra es el detonante involuntario del bypass al autorizar leche entera de vaca al año (Pág. 7).`
          },
          {
            nivel: 'HIPOTESIS',
            texto: `Estrategia de conexión: Las marcas deben entregar materiales pedagógicos a la madre con el fraseo exacto que los médicos valoran positivamente, convirtiendo la prescripción médica en un trámite fluido.`
          }
        ],
        elementosUtilizados: {
          actor: actor?.nombre || '',
          criteriosClave: actor?.criterios || [],
          evidenciasVinculadas: ['EV-NESTUM-01 (Pág. 11)', 'EV-NIDO-06 (Pág. 7)', 'EV-GERBER-05 (Pág. 23)']
        },
        brechasAbiertas: 'No se exploró la diferencia de prescripción entre pediatras de instituciones públicas (IMSS/ISSSTE) y médicos de consultorios privados.'
      };
    }

    case 'detectar-contradicciones': {
      return {
        accion: 'Detectar contradicciones en el reporte',
        foco: 'Discurso Idealizado vs. Prácticas Reales en Hogares',
        respuestaEstrategica: [
          {
            nivel: 'OBSERVADO',
            texto: `Contradicción 1 (Cocina Casera vs. Papillas de Fábrica): En el discurso, la madre de ferias declara que el ideal sagrado es la "comida fresca preparada por ella con utensilios propios e higiene estricta" (Pág. 20). Sin embargo, en la práctica cotidiana mantiene un "Kit Gerber" con frascos industriales y multipacks listos para abrir (Pág. 21).`
          },
          {
            nivel: 'OBSERVADO',
            texto: `Contradicción 2 (Reglas estrictas entre semana vs. Permisividad dominical): Belén declara un celo absoluto para no dar comida condimentada a su hija, pero el domingo los abuelos convidan de la cazuela común y ella lo tolera con resignación afectiva (Pág. 4).`
          },
          {
            nivel: 'DERIVADO',
            texto: `Resolución del Mecanismo: Las madres resuelven esta contradicción mediante la narrativa del alivio legítimo ("no me estoy torturando", Pág. 22) y delegando la responsabilidad moral en el aval del pediatra y los sellos de la etiqueta.`
          },
          {
            nivel: 'HIPOTESIS',
            texto: `La publicidad nunca debe confrontar a la madre con su contradicción, sino proporcionarle argumentos de pureza técnica que hagan invisible el compromiso.`
          }
        ],
        elementosUtilizados: {
          fuentes: ['Pág. 4 (Etapa de Vida)', 'Pág. 20 (Tensión del Hogar)', 'Pág. 22 (Aceptar Ayuda)'],
          citasClave: ['“A veces me toca improvisar...”', '“Llegó un punto en el que dije: ya también me estoy torturando demasiado.”']
        },
        brechasAbiertas: '¿Existe conflicto explícito de pareja cuando la madre compra electrodomésticos caros como esterilizadores mientras se trabaja en comercio informal?'
      };
    }

    case 'explicar-mecanismo': {
      const ins = currentInsights.find(i => i.id === params.insightId) || currentInsights[1] || currentInsights[0];
      return {
        accion: 'Explicar un mecanismo causal',
        foco: ins?.titulo || 'Mecanismo',
        respuestaEstrategica: [
          {
            nivel: 'DERIVADO',
            texto: `Mecanismo causal detallado: ${ins?.mecanismo || 'No especificado'}`
          },
          {
            nivel: 'OBSERVADO',
            texto: `Disparadores empíricos que lo encienden: ${(ins?.disparadores || []).join(' | ')}. Condiciones necesarias para su mantenimiento: ${(ins?.condiciones || []).join(' | ')}.`
          },
          {
            nivel: 'HIPOTESIS',
            texto: `Punto de ruptura del mecanismo: El mecanismo colapsa si cambia una de las condiciones clave; por ejemplo, si el bebé presenta alergia alimentaria o diarrea persistente, forzando un retorno inmediato a la categoría hiperespecializada.`
          }
        ],
        elementosUtilizados: {
          insight: ins?.titulo || '',
          fuente: ins?.fuenteReporte || '',
          actoresIntervinientes: ins?.actores || []
        },
        brechasAbiertas: 'Falta comprobar si este mecanismo opera con la misma rapidez en primigestas vs. madres con dos o más hijos.'
      };
    }

    case 'construir-escenario': {
      const ctx = currentContexts.find(c => c.id === params.contextId) || currentContexts[2] || currentContexts[0]; // Ferias
      const trans = currentTransitions.find(t => t.id === params.transitionId) || currentTransitions[0]; // 1 año
      return {
        accion: 'Construir un escenario plausible',
        foco: `${trans?.titulo || 'Transición'} en el contexto de ${ctx?.nombre || 'Contexto'}`,
        respuestaEstrategica: [
          {
            nivel: 'OBSERVADO',
            texto: `Línea de base del reporte: En ${ctx?.nombre || 'el contexto'}, la fricción dominante es "${ctx?.friccion || ''}" (Pág. 19). Al mismo tiempo, la transición de ${trans?.subtitulo || ''} implica que "${trans?.despues?.comida || ''}" (Pág. 4).`
          },
          {
            nivel: 'DERIVADO',
            texto: `Dinámica resultante en este escenario: Cuando el bebé de 1 año viaja a las ferias, se genera una crisis de formato. Ya no acepta las papillas lisas coladas de etapa temprana, pero en el puesto no hay guisados caseros seguros sin chile ni grasa. La madre se ve forzada a buscar alimentos sólidos limpios (puffs, trozos de tortilla, galletas con cereal) que el niño pueda sostener solo mientras permanece en la carriola.`
          },
          {
            nivel: 'HIPOTESIS',
            texto: `Solución ganadora proyectada: Pouches de purés rústicos con tropezones de fruta o verdura que no requieren cuchara y garantizan que el niño de 1 año mastique sin ensuciarse en el puesto de feria.`
          }
        ],
        elementosUtilizados: {
          contexto: ctx?.nombre || '',
          transicion: trans?.titulo || '',
          fuentes: ['Págs. 3–4', 'Págs. 19–21']
        },
        brechasAbiertas: '¿Cuánto gasta semanalmente una familia de comerciantes en alimentos portátiles durante temporadas altas de feria?'
      };
    }

    case 'comparar-contextos': {
      const c1 = currentContexts.find(c => c.id === params.contextId) || currentContexts[0]; // Cocina
      const c2 = currentContexts.find(c => c.id === params.secondaryContextId) || currentContexts[2] || currentContexts[0]; // Ferias
      return {
        accion: 'Comparar contextos de alimentación',
        foco: `${c1?.nombre || ''} vs. ${c2?.nombre || ''}`,
        respuestaEstrategica: [
          {
            nivel: 'OBSERVADO',
            texto: `Contexto A (${c1?.nombre || ''}): Hay agua, estufa, electrodomésticos (licuadora, esterilizador) y platos propios. La tensión es el tiempo matutino antes de trabajar (Págs. 14, 26). Solución: Nestum en agua o avena casera.`
          },
          {
            nivel: 'OBSERVADO',
            texto: `Contexto B (${c2?.nombre || ''}): No hay agua corriente, estufa ni refrigeración; hay polvo, traslados y atención continua a clientes (Págs. 19–20). Solución: Frascos sellados al vacío, puffs y cubiertos desechables del Kit Gerber.`
          },
          {
            nivel: 'DERIVADO',
            texto: `Diferencia de rol de marca: En la cocina, la marca (Nestum) compite con los ingredientes nobles (avena cruda). En la feria, la marca (Gerber) no compite con la cocina: compite con el riesgo de intoxicación callejera y el hambre del bebé.`
          },
          {
            nivel: 'HIPOTESIS',
            texto: `La disposición a pagar un sobreprecio es hasta 2.5 veces mayor en el contexto fuera de casa debido al costo de contingencia y la ansiedad sanitaria.`
          }
        ],
        elementosUtilizados: {
          contextoA: c1?.nombre || '',
          contextoB: c2?.nombre || '',
          fuentes: ['Págs. 14–17', 'Págs. 19–21']
        },
        brechasAbiertas: 'No se analizaron contextos de guardería / estancias infantiles públicas o familiares de cuidado pagado.'
      };
    }

    case 'modificar-variable': {
      const key = params.variableKey || 'tiempoPreparacion';
      const simBajo = evaluateScenario({ [key]: 10 });
      const simAlto = evaluateScenario({ [key]: 90 });
      return {
        accion: 'Análisis de sensibilidad cualitativa',
        foco: `Modificación de la variable: ${key}`,
        respuestaEstrategica: [
          {
            nivel: 'DERIVADO',
            texto: `Si la variable cae al mínimo (10%): Las necesidades críticas emergentes son: "${simBajo.necesidadesAumentan[0]?.texto || 'Urgencia de practicidad'}". Se activan tensiones como: "${simBajo.tensionesEmergentes[0]?.titulo || 'Control vs Improvisar'}". Las soluciones que ganan relevancia son: ${Object.entries(simBajo.relevanciaSoluciones).filter(([, v]) => v.score > 60).map(([k]) => k).join(', ')}.`
          },
          {
            nivel: 'DERIVADO',
            texto: `Si la variable sube al máximo (90%): El comportamiento se reconfigura: ganan relevancia: ${Object.entries(simAlto.relevanciaSoluciones).filter(([, v]) => v.score > 60).map(([k]) => k).join(', ')}. Cae la urgencia de empaques de contingencia y aumentan exigencias de ingredientes nobles y cocción casera.`
          },
          {
            nivel: 'HIPOTESIS',
            texto: `Conclusión estratégica: Las marcas procesadas solo crecen de forma sostenida si son capaces de sobrevivir en ambos extremos: convenientes cuando la variable colapsa, y respetuosas de la nutrición cuando la variable abunda.`
          }
        ],
        elementosUtilizados: {
          variableAnalizada: key,
          motorUtilizado: 'Scenario Lab Logic Engine'
        },
        brechasAbiertas: '¿Con qué frecuencia semanal oscila esta variable dentro de un mismo hogar entre lunes y domingo?'
      };
    }

    case 'generar-hipotesis': {
      const marca = params.marcaKey || 'Nido';
      const matriz = currentBrandMatrix.find(b => b.marca.toLowerCase().includes(marca.toLowerCase())) || currentBrandMatrix[0];
      return {
        accion: 'Generar hipótesis estratégicas falsables',
        foco: `Marca: ${matriz?.marca || marca}`,
        respuestaEstrategica: [
          {
            nivel: 'OBSERVADO',
            texto: `Punto de partida del estudio: Para ${matriz?.marca || marca}, el momento observado es "${matriz?.momentoObservado || ''}" y lo que pone a prueba su relevancia es "${matriz?.poneAPruebaRelevancia || ''}" (Pág. 29).`
          },
          {
            nivel: 'HIPOTESIS',
            texto: `Hipótesis Estratégica H1 (Posicionamiento): Si ${matriz?.marca || marca} reformula su discurso alrededor de la prevención de la anemia y micronutrientes no presentes en la leche entera de vaca, la deserción al cumplir 12 meses disminuirá en al menos 20%.`
          },
          {
            nivel: 'HIPOTESIS',
            texto: `Hipótesis H2 (Formato): Si ${matriz?.marca || marca} lanza sobres monodosis de $15 pesos para diluir en leche familiar o atoles, capturará a los hogares que migraron a leche pasteurizada por presupuesto.`
          }
        ],
        elementosUtilizados: {
          marca: matriz?.marca || marca,
          fuente: 'Pág. 29 (Tres marcas, tres lecturas)',
          estrategiaSugerida: matriz?.estrategiaRecomendada || ''
        },
        brechasAbiertas: 'Falta validar la disposición a pagar por gramo en presentación lata metálica de 800g vs. bolsa flexible en tienditas de la esquina.'
      };
    }

    case 'evidencia-apoya': {
      const tema = params.temaBusqueda || 'azúcar';
      const evs = currentEvidences.filter(e => (e.descripcion || '').toLowerCase().includes(tema.toLowerCase()) || (e.cita || '').toLowerCase().includes(tema.toLowerCase()) || (e.titulo || '').toLowerCase().includes(tema.toLowerCase()));
      return {
        accion: 'Mostrar evidencia empírica que apoya',
        foco: `Búsqueda de respaldo para: "${tema}"`,
        respuestaEstrategica: [
          {
            nivel: 'OBSERVADO',
            texto: `Se localizaron ${evs.length} evidencias directas en las 29 páginas del reporte que respaldan este postulado:`
          },
          ...evs.map(e => ({
            nivel: 'OBSERVADO',
            texto: `[${e.codigo} - ${e.fuente}]: "${e.cita}" — ${e.descripcion}`
          }))
        ],
        elementosUtilizados: {
          evidenciasCoincidentes: evs.map(e => e.codigo),
          hogaresInvolucrados: [...new Set(evs.map(e => e.hogar))]
        },
        brechasAbiertas: 'Verificar si existen evidencias no registradas en audio durante la visita a los mercados locales.'
      };
    }

    case 'evidencia-contradice': {
      const tesis = params.tesisComun || 'Las madres compran marcas infantiles por lealtad ciega o tradición';
      return {
        accion: 'Mostrar evidencia que contradice una creencia',
        foco: `Desafío a la tesis: "${tesis}"`,
        respuestaEstrategica: [
          {
            nivel: 'OBSERVADO',
            texto: `Evidencia de desmentido 1 (Pág. 23, Gerber): Mamá afirma: “Si él lo quiere, adelante. Pero si a él no le gusta, si él lo rechaza, ya no se lo vuelvo a dar.” La lealtad no es ciega: el bebé tiene poder de veto inmediato sobre cualquier marca tradicional.`
          },
          {
            nivel: 'OBSERVADO',
            texto: `Evidencia de desmentido 2 (Pág. 7, Nido): A pesar de que Nido es una marca de tradición reconocida y estaba en la ruta imaginada, la madre no dudó en hacer el bypass a leche entera barata tan pronto vio que el niño no tuvo diarrea en un mes.`
          },
          {
            nivel: 'OBSERVADO',
            texto: `Evidencia de desmentido 3 (Pág. 25, Despensa): La alacena es multimarca: conviven Gerber, Nestum, Enfamil y marcas de adultos sin exclusividad monopólica.`
          },
          {
            nivel: 'DERIVADO',
            texto: `Conclusión: No existe lealtad inercial a la marca; la compra es un ejercicio pragmático continuo de validación (Pág. 10).`
          }
        ],
        elementosUtilizados: {
          fuentes: ['Pág. 7 (Entrada a Nido)', 'Pág. 10 (Inmersión Nestum)', 'Pág. 23 (Construcción de Confianza)', 'Pág. 25 (Repertorio)']
        },
        brechasAbiertas: '¿Qué papel juegan las promociones de 2x1 o cupones de farmacia para provocar cambios de marca de último minuto?'
      };
    }

    case 'gaps-investigacion': {
      return {
        accion: 'Identificar qué información todavía no conocemos',
        foco: 'Brechas y Preguntas Abiertas del Estudio Etnográfico',
        respuestaEstrategica: [
          {
            nivel: 'DERIVADO',
            texto: `Brecha 1: Dinámicas en Guarderías y Cuidado Tercerizado. El reporte se centró en madres en casa o que llevan a sus hijos a ferias. No conocemos los protocolos de alimentación cuando el bebé asiste a estancias del IMSS/DIF, donde las instituciones suelen dictar menús estrictos.`
          },
          {
            nivel: 'DERIVADO',
            texto: `Brecha 2: El rol económico exacto de la pareja masculina. Aunque se señala que la pareja "participa y pone límites" (Pág. 5), no se profundizó en cómo negocian el presupuesto lácteo ni en si el padre realiza compras no planificadas de impulso.`
          },
          {
            nivel: 'DERIVADO',
            texto: `Brecha 3: Variación geográfica fuera de CDMX. Las 3 inmersiones fueron en la Ciudad de México (NSE C Típico). En ciudades del norte o sureste mexicano, las temperaturas extremas y la cultura culinaria regional pueden alterar la viabilidad del kit y las leches de crecimiento.`
          },
          {
            nivel: 'HIPOTESIS',
            texto: `Recomendación: Diseñar una fase 2 cuantitativa y etnográfica con muestra en Guadalajara, Monterrey y Mérida, e incluir entrevistas en profundidad con pediatras de hospitales públicos.`
          }
        ],
        elementosUtilizados: {
          metodologiaOriginal: '3 inmersiones en hogar, mujeres 25-30 años, CDMX, NSE C (Pág. 2)'
        },
        brechasAbiertas: 'Todas las señaladas en el bloque anterior deben ser consideradas como próximos sprints de investigación.'
      };
    }

    default:
      return {
        accion: 'Operación no reconocida',
        foco: 'General',
        respuestaEstrategica: [{ nivel: 'DERIVADO', texto: 'Por favor selecciona una de las 12 acciones cognitivas estructuradas.' }]
      };
  }
}
