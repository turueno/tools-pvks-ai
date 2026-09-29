// src/playbook/ingest/synthesizerEngine.js
// Motor de estructuración FPO (For Position Only) y mapeo epistemológico de Provokers
// Analiza insumos documentales, extrae citas reales en Observado y levanta la estructura FPO para Antigravity

export function synthesizePlaybookFromInput({
  rawText = '',
  documentTitle = 'Nuevo Estudio Etnográfico',
  clientName = 'Cliente Provokers',
  vertical = 'Consumo Masivo',
  primaryBrand = 'Marca Central',
  sessionId = null
}) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  const evidences = [];
  const insights = [];
  const tensions = [];
  const homes = [];
  const brands = [primaryBrand || 'Marca Central'];

  // 1. Extraer Verbatims y Evidencias Observadas (NIVEL 1: OBSERVADO)
  // Busca patrones como comillas "...", viñetas o fragmentos testimoniales genuinos
  let quoteIndex = 1;
  const quoteRegex = /["“]([^"”]{15,400})["”]/g;
  let match;
  
  while ((match = quoteRegex.exec(rawText)) !== null) {
    const verbatim = match[1].trim();
    if (verbatim.length > 20 && evidences.length < 12) {
      evidences.push({
        id: `evi-${quoteIndex}`,
        codigo: `EVI-${String(quoteIndex).padStart(2, '0')}`,
        epistemicLevel: 'OBSERVADO',
        titulo: `Evidencia Empírica ${quoteIndex}: "${verbatim.slice(0, 45)}..."`,
        cita: verbatim,
        verbatim: `"${verbatim}"`,
        actor: `Informante ${quoteIndex}`,
        contexto: 'Registro empírico de campo',
        fuente: `Documento: ${documentTitle.slice(0, 30)}`,
        tags: [vertical, 'Observado', 'Verbatim Real'],
        marcaRelacionada: primaryBrand,
        insightId: `ins-${Math.min(quoteIndex, 3)}`
      });
      quoteIndex++;
    }
  }

  // Si no se encontraron suficientes comillas, extraer oraciones sustanciosas de los inputs
  if (evidences.length < 3) {
    const sentences = rawText.match(/[^.?!]+[.?!]+/g) || lines;
    const cleanSentences = sentences
      .map(s => s.trim())
      .filter(s => s.length > 40 && s.length < 250 && !s.startsWith('http'));

    const sampleSentences = cleanSentences.slice(0, 8);
    sampleSentences.forEach((sentence, idx) => {
      const idNum = evidences.length + 1;
      evidences.push({
        id: `evi-${idNum}`,
        codigo: `EVI-${String(idNum).padStart(2, '0')}`,
        epistemicLevel: 'OBSERVADO',
        titulo: `Fragmento Textual de Campo ${idNum}`,
        cita: sentence,
        verbatim: `"${sentence}"`,
        actor: `Registro de Campo ${idNum}`,
        contexto: 'Observación directa extraída del insumo',
        fuente: `Insumo: ${documentTitle.slice(0, 30)}`,
        tags: [vertical, 'Observado', 'Extracción Directa'],
        marcaRelacionada: primaryBrand,
        insightId: `ins-${Math.min(idNum, 3)}`
      });
    });
  }

  // Fallback si el documento fue mínimo o vacío
  if (evidences.length === 0) {
    evidences.push({
      id: 'evi-1',
      codigo: 'EVI-01',
      epistemicLevel: 'OBSERVADO',
      titulo: `Registro Inicial de Campo: ${documentTitle}`,
      cita: `Observación preliminar documentada para el estudio de ${vertical}.`,
      verbatim: `"Esperando síntesis profunda de testimonios y citas de campo."`,
      actor: 'Participante 1',
      contexto: 'Inmersión inicial',
      fuente: documentTitle,
      tags: [vertical, 'Observado', 'FPO'],
      marcaRelacionada: primaryBrand,
      insightId: 'ins-1'
    });
  }

  // 2. Detección de Temas y Encabezados para Fichas de Insight (NIVEL 2: DERIVADO - FPO)
  // Extrae líneas cortas en mayúsculas o con patrones de título para usarlas como anclas temáticas
  const candidateTopics = lines.filter(l => 
    (l.length > 5 && l.length < 60 && !l.includes('.') && (l === l.toUpperCase() || l.startsWith('#') || /^[0-9]+\./.test(l)))
  ).map(t => t.replace(/^[#0-9.\s]+/, '').trim()).filter(Boolean);

  const defaultTopics = [
    `Fricciones y Momentos Clave en ${vertical}`,
    `Rituales, Hábitos y Factores de Decisión`,
    `Tensiones y Barreras de Adopción`,
    `Oportunidades de Innovación y Activación`
  ];

  const topicsToUse = candidateTopics.length >= 2 
    ? candidateTopics.slice(0, 4) 
    : defaultTopics;

  topicsToUse.forEach((topic, idx) => {
    const insId = `ins-${idx + 1}`;
    const relatedEvs = evidences
      .filter((_, eIdx) => eIdx % topicsToUse.length === idx)
      .map(e => e.id);

    insights.push({
      id: insId,
      codigo: `INS-${String(idx + 1).padStart(2, '0')}`,
      titulo: `${topic} [FPO]`,
      descripcion: `Estructura base derivada para '${topic}'. Citas empíricas asignadas y slots epistemológicos listos para redacción con Antigravity.`,
      epistemicLevel: 'DERIVADO',
      nivel: 'DERIVADO',
      // Campos de la tríada epistemológica FPO
      mecanismo: `[FPO - Mecanismo Causal]: Factores psicológicos, sociales y operativos identificados en el tema '${topic}'. Pendiente de síntesis analítica con Antigravity.`,
      tension: `[FPO - Tensión Latente]: Fricción observada entre la expectativa del usuario y la realidad en '${topic}'.`,
      necesidad: `[FPO - Necesidad Fundamental]: Necesidad latente no satisfecha vinculada al contexto de ${vertical}.`,
      oportunidades: `[FPO - Oportunidad]: Territorio de propuesta de valor para ${clientName} a partir de '${topic}'.`,
      hipotesis: `[FPO - Hipótesis de Negocio]: Vía de activación estratégica sugerida para validación.`,
      marcasRelacionadas: [primaryBrand],
      evidenciasRelacionadas: relatedEvs.length > 0 ? relatedEvs : [evidences[0]?.id || 'evi-1'],
      categoria: vertical,
      fuente: documentTitle,
      status: 'fpo_draft'
    });
  });

  // 3. Estructuración de Tensiones Dialécticas FPO (Polo A vs Polo B)
  topicsToUse.slice(0, 2).forEach((topic, idx) => {
    tensions.push({
      id: `ten-${idx + 1}`,
      codigo: `TEN-${String(idx + 1).padStart(2, '0')}`,
      formulacion: `[FPO] Tensión Crítica ${idx + 1}: ${topic}`,
      poloA: {
        nombre: `Polo A (Expectativa / Hábito Tradicional)`,
        descripcion: `Fuerza impulsora identificada en las observaciones de ${vertical}.`
      },
      poloB: {
        nombre: `Polo B (Fricción / Realidad Actual)`,
        descripcion: `Barrera operativa o contradicción experimentada por los usuarios en '${topic}'.`
      },
      descripcion: `Contradicción dialéctica estructurada como FPO a partir del insumo documental. Lista para formulación ejecutiva con Antigravity.`,
      aprendizaje: `Espacio de resolución para ${primaryBrand}: transformar esta fricción en ventaja competitiva.`,
      status: 'fpo_draft'
    });
  });

  // 4. Territorios de Oportunidad FPO
  const opportunities = [
    {
      id: 'opp-1',
      codigo: 'OPP-01',
      titulo: `[FPO] Territorio de Innovación: Excelencia Operativa en ${topicsToUse[0] || vertical}`,
      descripcion: `Oportunidad para transformar las principales fricciones del usuario en diferenciadores competitivos para ${clientName}.`,
      impacto: 'Alto Potencial',
      viabilidad: 'En Evaluación',
      status: 'fpo_draft'
    },
    {
      id: 'opp-2',
      codigo: 'OPP-02',
      titulo: `[FPO] Territorio de Experiencia: Personalización & Acompañamiento`,
      descripcion: `Estrategias de vinculación y valor agregado para elevar la retención en el contexto de ${vertical}.`,
      impacto: 'Estratégico',
      viabilidad: 'Alta',
      status: 'fpo_draft'
    }
  ];

  // 5. Matriz Comparativa de Marcas y Canales FPO (3 soluciones para contrastar)
  const brandMatrix = [
    {
      id: 'brand-primary',
      marca: primaryBrand,
      rol: 'Marca Central de Estudio',
      percepcion: `[FPO - Percepción]: Propuesta de valor analizada en el estudio para ${vertical}.`,
      momentoObservado: `[FPO]: Ocasión de demanda y uso prioritario en la vida cotidiana del usuario.`,
      papelEnDiscusion: `Solución principal de estudio para ${clientName}.`,
      sostieneUso: `[FPO]: Atributos de conveniencia, confianza y afinidad identificados preliminarmente.`,
      poneAPruebaRelevancia: `[FPO]: Puntos de fricción, barreras de costo o fallas de experiencia observadas.`,
      estrategiaRecomendada: `[FPO]: Vía de optimización estratégica y diferenciación frente a sustitutos.`,
      color: '#F6911E',
      badge: 'MARCA PRINCIPAL'
    },
    {
      id: 'brand-channel-traditional',
      marca: 'Canal Tradicional / Alternativa Presencial',
      rol: 'Solución Convencional de Mercado',
      percepcion: `[FPO]: Alternativa física o habitual previa a la adopción de nuevas soluciones.`,
      momentoObservado: `Compras espontáneas, hábitos arraigados o momentos donde se prefiere trato presencial.`,
      papelEnDiscusion: 'Benchmark de referencia cotidiana frente a nuevas alternativas.',
      sostieneUso: 'Familiaridad, cercanía y costumbre arraigada en los usuarios.',
      poneAPruebaRelevancia: 'Tiempos de espera, fricción logística o falta de personalización.',
      estrategiaRecomendada: 'Integrar los rituales valorados de este canal en la experiencia central.',
      color: '#0284C7',
      badge: 'BENCHMARK TRADICIONAL'
    },
    {
      id: 'brand-channel-competitor',
      marca: 'Soluciones Competitivas / Sustitutos',
      rol: 'Alternativas Directas de Mercado',
      percepcion: `[FPO]: Otras marcas y plataformas consideradas por el usuario en su abanico de elección.`,
      momentoObservado: `Momentos de comparación de precio, disponibilidad o promociones.`,
      papelEnDiscusion: 'Alternativas de sustitución inmediata cuando la marca principal falla.',
      sostieneUso: 'Incentivos de precio, disponibilidad o cobertura en puntos críticos.',
      poneAPruebaRelevancia: 'Inconsistencias de calidad o menor vinculación emocional.',
      estrategiaRecomendada: 'Blindar los momentos de contacto clave donde el usuario compara opciones.',
      color: '#7C3AED',
      badge: 'COMPETENCIA DIRECTA'
    }
  ];

  // 6. Cadenas de Decisión FPO (2 cadenas con 4-5 etapas secuenciales)
  const decisionChains = [
    {
      id: 'chain-1',
      titulo: `Cadena de Decisión 1: Adopción y Primer Contacto (${primaryBrand})`,
      descripcion: `Secuencia de etapas cognitivas y operativas desde la detonación de la necesidad hasta la primera transacción en ${vertical}.`,
      fuente: documentTitle,
      marca: primaryBrand,
      etapas: [
        {
          paso: 1,
          nombre: 'Detonante de Necesidad',
          actorPrincipal: 'Usuario / Consumidor',
          rolActor: 'Decisor',
          accion: `Surge la necesidad en el contexto de ${vertical}. Se evalúan opciones en mente.`
        },
        {
          paso: 2,
          nombre: 'Exploración y Comparación',
          actorPrincipal: 'Usuario / Entorno',
          rolActor: 'Influenciador',
          accion: 'Consulta de recomendaciones, canales digitales o alternativas habituales.'
        },
        {
          paso: 3,
          nombre: 'Filtro de Fricción & Confianza',
          actorPrincipal: 'Usuario',
          rolActor: 'Filtro Crítico',
          accion: 'Validación de precio, tiempos de entrega y facilidad de uso.'
        },
        {
          paso: 4,
          nombre: 'Decisión y Transacción',
          actorPrincipal: 'Usuario',
          rolActor: 'Comprador',
          accion: `Confirmación de compra o solicitud a través del canal elegido (${primaryBrand}).`
        },
        {
          paso: 5,
          nombre: 'Post-Uso y Validación Emocional',
          actorPrincipal: 'Usuario y Acompañantes',
          rolActor: 'Evaluador',
          accion: 'Contraste entre la expectativa y la experiencia recibida.'
        }
      ]
    },
    {
      id: 'chain-2',
      titulo: `Cadena de Decisión 2: Recompra y Consolidación de Hábito`,
      descripcion: `Dinámica de recurrencia y factores que sostienen la fidelidad o provocan deserción hacia alternativas en ${vertical}.`,
      fuente: documentTitle,
      marca: primaryBrand,
      etapas: [
        {
          paso: 1,
          nombre: 'Reaparición del Momento de Demanda',
          actorPrincipal: 'Usuario Habitual',
          rolActor: 'Rutina',
          accion: 'El usuario experimenta nuevamente la ocasión de consumo o necesidad en su vida cotidiana.'
        },
        {
          paso: 2,
          nombre: 'Recuerdo de Marca vs Novedad',
          actorPrincipal: 'Usuario',
          rolActor: 'Memoria de Marca',
          accion: 'Se evalúa si la satisfacción previa amerita repetir o si se exploran promociones competidoras.'
        },
        {
          paso: 3,
          nombre: 'Confirmación de Facilidad / Re-orden',
          actorPrincipal: 'Canal / Plataforma',
          rolActor: 'Facilitador',
          accion: 'Interacción con el canal para una recompra fluida y sin fricciones.'
        },
        {
          paso: 4,
          nombre: 'Fidelización o Deserción',
          actorPrincipal: 'Usuario',
          rolActor: 'Embajador / Crítico',
          accion: 'Consolidación de lealtad a largo plazo o migración ante fallas operativas.'
        }
      ]
    }
  ];

  // 7. Transiciones FPO (Puntos de Inflexión de Demanda)
  const transitions = [
    {
      id: 'trans-1',
      titulo: `Transición de Solución Tradicional a Solución Clave (${primaryBrand})`,
      subtitulo: `Punto de inflexión donde el usuario abandona la alternativa anterior y adopta ${primaryBrand}`,
      fuente: documentTitle,
      descripcion: `Mapeo dialéctico de la migración de hábitos, detonantes de cambio y nuevas dinámicas adoptadas en ${vertical}.`,
      antes: {
        estado: 'Hábito Convencional / Canal Tradicional',
        comida: 'Solución histórica o rutina manual establecida',
        habito: 'Solución histórica o rutina manual establecida',
        utensilios: 'Procesos presenciales, efectivo o intermediarios',
        herramientas: 'Procesos presenciales, efectivo o intermediarios',
        reglas: 'Aceptación de tiempos de espera y falta de control directo',
        tiempo: 'Mayor inversión de tiempo y esfuerzo'
      },
      detonante: `Fricción insostenible en el modelo anterior, recomendación de confianza o necesidad de eficiencia inmediata.`,
      despues: {
        estado: `Adopción de ${primaryBrand} / Nueva Modalidad`,
        comida: 'Solución integrada, mayor control y conveniencia',
        habito: 'Solución integrada, mayor control y conveniencia',
        utensilios: 'Canales digitales, autoservicio o experiencia optimizada',
        herramientas: 'Canales digitales, autoservicio o experiencia optimizada',
        reglas: 'Exigencia de inmediatez, transparencia y cero tolerancia a errores',
        tiempo: 'Reducción de tiempos muertos y mayor autonomía'
      },
      impactoMarcas: {
        pierden: 'Soluciones rígidas, lentas o que no ofrecen trazabilidad al usuario.',
        ganan: `${primaryBrand} y propuestas que combinan conveniencia, transparencia y respaldo.`
      }
    }
  ];

  // 8. Actores Clave FPO
  const actors = [
    { id: 'actor-1', nombre: 'Usuario / Consumidor Clave', rol: 'Sujeto de estudio principal y decisor de uso' },
    { id: 'actor-2', nombre: 'Acompañante / Entorno Cercano', rol: 'Influenciador y validador de la experiencia' },
    { id: 'actor-3', nombre: 'Personal de Contacto / Servicio', rol: 'Punto de contacto y ejecutor de la promesa' }
  ];

  // 9. Contextos Clave FPO
  const contexts = [
    { id: 'ctx-1', nombre: `Ocasión Cotidiana en ${vertical}`, descripcion: 'Momento de interacción habitual bajo rutinas y restricciones cotidianas' },
    { id: 'ctx-2', nombre: `Situación de Alta Exigencia / Ocasión Especial`, descripcion: 'Momento donde las expectativas se elevan y la tolerancia al error disminuye' }
  ];

  return {
    meta: {
      titulo: documentTitle,
      cliente: clientName,
      vertical,
      primaryBrand,
      status: 'fpo_draft',
      sessionId: sessionId || `session-${Date.now().toString(36)}`,
      totalEvidences: evidences.length,
      totalInsights: insights.length,
      totalTensions: tensions.length
    },
    dataset: {
      evidences,
      insights,
      tensions,
      opportunities,
      brandMatrix,
      decisionChains,
      transitions,
      actors,
      contexts,
      homes: [],
      transversalBridge: [],
      status: 'fpo_draft',
      lastUpdated: new Date().toISOString()
    }
  };
}
