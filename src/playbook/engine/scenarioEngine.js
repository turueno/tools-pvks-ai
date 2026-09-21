// src/playbook/engine/scenarioEngine.js
// Motor de derivación lógica contextual para el Scenario Lab.
// Realiza inferencias rigurosas a partir de las 4 dimensiones estructuradas del estudio etnográfico.

export function evaluateScenario(state) {
  const {
    tiempo = 'normal',
    espacio = 'cocina',
    sustitutos = 'leche_familiar_refri',
    maduracion = 'bypass_ano',
    tolerancia = 'tolerancia_probada',
    pediatra = 'luz_verde_familiar',
    familia_extensa = 'cuidado_aislado',
    filtro_azucar = 'filtro_excluyente',
    culpa_alivio = 'alivio_legitimado'
  } = state || {};

  const necesidadesAumentan = [];
  const necesidadesDisminuyen = [];
  const tensionesEmergentes = [];
  const relevanciaSoluciones = {};
  const implicacionesMarca = [];
  const oportunidadesPlausibles = [];
  const hipotesisValidar = [];

  // --- 1. EVALUACIÓN DE NECESIDADES SEGÚN LAS 4 DIMENSIONES ---
  // A. Dimensión Material: Tiempo y Espacio
  if (tiempo === 'colapso') {
    necesidadesAumentan.push({
      texto: 'Preparación instantánea (<60 seg) sin requerir electrodomésticos ni cocción',
      peso: 'Crítico',
      razon: 'El regreso al trabajo o las prisas matutinas impiden procesar cereales naturales desde cero (Pág. 14).'
    });
    necesidadesDisminuyen.push({
      texto: 'Elaboración artesanal de papillas y hervido prolongado de avena',
      peso: 'Alto',
      razon: 'La rutina laboral y el cuidado simultáneo vuelven inviable la cocina desde cero.'
    });
  } else if (tiempo === 'holgado') {
    necesidadesAumentan.push({
      texto: 'Comida casera fresca cocinada por mamá como estándar moral de afecto',
      peso: 'Alto',
      razon: 'Disponer de tiempo activa el deseo de cocinar y supervisar cada ingrediente (Pág. 16).'
    });
  }

  if (espacio === 'calle_feria') {
    necesidadesAumentan.push({
      texto: 'Inocuidad bacteriológica sin refrigeración y empaques irrompibles on-the-go',
      peso: 'Crítico',
      razon: 'Jornadas en ferias o comercio ambulante exigen alimentos estériles listos para comer a temperatura ambiente (Pág. 19).'
    });
    necesidadesAumentan.push({
      texto: 'Snacks secos de auto-agarre (puffs/galletas) para entretener al bebé en carriola',
      peso: 'Alto',
      razon: 'Permiten que el bebé coma mientras los adultos atienden clientes o se trasladan (Pág. 21).'
    });
    necesidadesDisminuyen.push({
      texto: 'Uso de platos hondos de porcelana y alimentos calientes al momento',
      peso: 'Alto',
      razon: 'La calle y los puestos no cuentan con tomas de corriente ni microondas.'
    });
  }

  // B. Dimensión del Bebé: Maduración & Tolerancia
  if (maduracion === 'bypass_ano') {
    necesidadesAumentan.push({
      texto: 'Integración a la mesa familiar: guisados apartados antes de sazonar',
      peso: 'Alto',
      razon: 'Al cumplir el año y masticar, el bebé reclama comer lo que comen los adultos (Pág. 4).'
    });
    necesidadesDisminuyen.push({
      texto: 'Papillas puras monoingrediente de textura totalmente lisa',
      peso: 'Alto',
      razon: 'El niño demanda texturas sólidas masticables y vasos de autonomía (Pág. 3).'
    });
  } else if (maduracion === 'iniciacion') {
    necesidadesAumentan.push({
      texto: 'Texturas ultrasuaves y garantía de esterilidad para estómagos novatos',
      peso: 'Alto',
      razon: 'Etapa de adaptación gástrica de 6 a 8 meses.'
    });
  }

  // C. Dimensión Moral: Filtro de Sellos y Culpa
  if (filtro_azucar === 'filtro_excluyente') {
    necesidadesAumentan.push({
      texto: 'Filtro heurístico explícito: Sello o leyenda frontal "Sin Azúcar Añadida"',
      peso: 'Crítico',
      razon: 'Si la primera condición de cero azúcar falla, el resto de beneficios nutricionales pierde relevancia (Pág. 13).'
    });
  }

  if (culpa_alivio === 'alta_exigencia') {
    necesidadesAumentan.push({
      texto: 'Justificación moral del alimento: "Debe sentirse hecho como en casa"',
      peso: 'Alto',
      razon: 'Mamá sufre conflicto de culpa si recurre a soluciones procesadas de fábrica.'
    });
  }

  // --- 2. TENSIONES QUE APARECEN O SE INTENSIFICAN ---
  if (espacio === 'calle_feria' && tiempo === 'colapso') {
    tensionesEmergentes.push({
      titulo: 'Control Estricto vs. Capacidad de Improvisar',
      intensidad: 'Máxima',
      descripcion: 'El deseo de pureza higiénica de casa colisiona violentamente con la precariedad de la calle o las salidas intempestivas (Pág. 20).'
    });
  }

  if (maduracion === 'bypass_ano' && tolerancia === 'tolerancia_probada' && sustitutos === 'leche_familiar_refri') {
    tensionesEmergentes.push({
      titulo: 'Ruta Mental Ideal vs. Bypass a Leche Entera',
      intensidad: 'Máxima',
      descripcion: 'Nido pierde obligatoriedad: la madre y el pediatra ven que el niño tolera la leche de vaca de $25 pesos y se saltan la leche de crecimiento (Pág. 7).'
    });
  }

  if (familia_extensa === 'abuelos_activos') {
    tensionesEmergentes.push({
      titulo: 'Su Comida (Bebé) vs. Nuestra Comida (Familia Extensa)',
      intensidad: 'Alta',
      descripcion: 'Los abuelos flexibilizan reglas en fin de semana y convidan comida con condimentos, desafiando el control estricto de mamá (Pág. 4).'
    });
  }

  if (tiempo === 'colapso' && culpa_alivio === 'alta_exigencia') {
    tensionesEmergentes.push({
      titulo: 'Autoexigencia de Pureza vs. Legitimación del Alivio',
      intensidad: 'Alta',
      descripcion: 'La madre debe negociar con su propia culpa para permitirse usar cereales y papillas de fábrica ("no me estoy torturando", Pág. 22).'
    });
  }

  // --- 3. RELEVANCIA DE SOLUCIONES Y MARCAS (Escala 0-100) ---
  // A. NIDO KINDER
  let scoreNido = 50;
  if (maduracion === 'bypass_ano') scoreNido += 10;
  if (maduracion === 'iniciacion') scoreNido -= 30; // No aplica a lactantes
  if (tolerancia === 'tolerancia_probada' && sustitutos === 'leche_familiar_refri') scoreNido -= 35; // Bypass letal
  if (pediatra === 'luz_verde_familiar') scoreNido -= 15;
  if (pediatra === 'prescripcion_estricta') scoreNido += 25; // Si el doctor la manda
  if (filtro_azucar === 'filtro_excluyente') scoreNido -= 10;
  scoreNido = Math.max(10, Math.min(95, scoreNido));

  // B. LECHE ENTERA PASTEURIZADA (FAMILIAR)
  let scoreLecheEntera = 30;
  if (maduracion === 'bypass_ano') scoreLecheEntera += 35;
  if (tolerancia === 'tolerancia_probada') scoreLecheEntera += 25;
  if (sustitutos === 'leche_familiar_refri') scoreLecheEntera += 20;
  if (pediatra === 'prescripcion_estricta' && maduracion !== 'bypass_ano') scoreLecheEntera -= 30;
  scoreLecheEntera = Math.max(5, Math.min(98, scoreLecheEntera));

  // C. NESTUM CEREAL
  let scoreNestum = 50;
  if (tiempo === 'colapso') scoreNestum += 30;
  if (filtro_azucar === 'filtro_excluyente') scoreNestum += 15;
  if (maduracion === 'transicion' || maduracion === 'iniciacion') scoreNestum += 15;
  if (espacio === 'calle_feria') scoreNestum -= 20; // Requiere tazón y agua caliente
  if (culpa_alivio === 'alivio_legitimado') scoreNestum += 10;
  scoreNestum = Math.max(10, Math.min(95, scoreNestum));

  // D. AVENA NATURAL CASERA
  let scoreAvena = 60;
  if (tiempo === 'colapso') scoreAvena -= 45;
  if (tiempo === 'holgado') scoreAvena += 30;
  if (espacio === 'calle_feria') scoreAvena -= 40;
  if (filtro_azucar === 'filtro_excluyente') scoreAvena += 15;
  scoreAvena = Math.max(5, Math.min(95, scoreAvena));

  // E. GERBER (PAPILLAS / PUFFS / KIT)
  let scoreGerber = 40;
  if (espacio === 'calle_feria') scoreGerber += 45;
  if (espacio === 'transito') scoreGerber += 30;
  if (tiempo === 'colapso') scoreGerber += 20;
  if (maduracion === 'bypass_ano' && espacio === 'cocina') scoreGerber -= 25;
  scoreGerber = Math.max(10, Math.min(98, scoreGerber));

  relevanciaSoluciones.nido = {
    nombre: 'Nido Kinder',
    score: scoreNido,
    tendencia: scoreNido >= 55 ? 'estable' : 'en-riesgo',
    diagnostico: scoreNido < 50
      ? 'Alto riesgo de bypass hacia leche entera de vaca. El consumidor comprueba tolerancia gástrica y el pediatra autoriza la leche familiar (Pág. 7).'
      : 'Conserva tracción si la madre busca un puente nutritivo seguro o si el pediatra la prescribe explícitamente.'
  };

  relevanciaSoluciones.lecheEntera = {
    nombre: 'Leche Entera de Casa',
    score: scoreLecheEntera,
    tendencia: scoreLecheEntera > 60 ? 'creciendo' : 'latente',
    diagnostico: scoreLecheEntera > 60
      ? 'La tolerancia estomacal probada y el bajo costo ($25) unifican la leche de todo el hogar (Pág. 7).'
      : 'Aún contenida por temores a intolerancia digestiva o edad menor a 1 año.'
  };

  relevanciaSoluciones.nestum = {
    nombre: 'Nestum Cereal',
    score: scoreNestum,
    tendencia: scoreNestum >= 65 ? 'alta-relevancia' : 'moderada',
    diagnostico: scoreNestum >= 65
      ? 'Solución estrella: simplifica la avena en <1 min sin obligar a cambiar la lógica nutritiva ni añadir culpa (Pág. 18).'
      : 'Compite con avena natural cuando hay tiempo, o con comida sólida cuando el niño crece.'
  };

  relevanciaSoluciones.avenaNatural = {
    nombre: 'Avena Natural Casera',
    score: scoreAvena,
    tendencia: scoreAvena < 40 ? 'bloqueada-por-tiempo' : 'referente-dorado',
    diagnostico: scoreAvena < 40
      ? 'Permanece como el ideal moral en la mente de mamá, pero resulta físicamente inviable en el día a día (Pág. 16).'
      : 'Mamá dispone de tiempo para moler, cocer y servir el estándar de máxima confianza.'
  };

  relevanciaSoluciones.gerber = {
    nombre: 'Gerber (Kit Portátil / Puffs)',
    score: scoreGerber,
    tendencia: scoreGerber >= 65 ? 'indispensable' : 'selectiva',
    diagnostico: scoreGerber >= 65
      ? 'Herramienta vital de bioseguridad y contingencia en traslados y ferias (Pág. 21).'
      : 'Uso acotado a ocasiones de salida si la familia permanece en el hogar.'
  };

  // --- 4. IMPLICACIONES DERIVADAS PARA LAS MARCAS ---
  if (relevanciaSoluciones.nido.tendencia === 'en-riesgo') {
    implicacionesMarca.push({
      marca: 'Nido',
      alerta: 'Peligro inminente de comoditización láctea',
      detalle: 'Si el pediatra y la familia normalizan la leche entera común y el niño no presenta diarrea tras 30 días, Nido se vuelve prescindible. Nido debe comunicar su ventaja biológica en hierro/zinc de inmediato (Pág. 7).'
    });
  }

  if (relevanciaSoluciones.nestum.score >= 65) {
    implicacionesMarca.push({
      marca: 'Nestum',
      alerta: 'Ventana de expansión en desayuno y cena rápida',
      detalle: 'Posicionarse como "el cereal natural molido que mamá dosifica a su gusto con agua" para evitar que sea percibido como un ultraprocesado sintético (Págs. 16–18).'
    });
  }

  if (relevanciaSoluciones.gerber.score >= 65) {
    implicacionesMarca.push({
      marca: 'Gerber',
      alerta: 'Consolidación del ecosistema de movilidad (Kit Gerber)',
      detalle: 'Aprovechar la venta en paquete y expandir la oferta de galletas para dentición y puffs que permiten al bebé comer en carriola mientras los padres trabajan (Págs. 21 y 24).'
    });
  }

  // --- 5. OPORTUNIDADES PLAUSIBLES ---
  if (tiempo === 'colapso' && espacio === 'cocina') {
    oportunidadesPlausibles.push({
      id: 'opp-sim-01',
      titulo: 'Insumos infantiles limpios y porcionados para integrar a la olla familiar',
      impacto: 'Estratégico Alto',
      fundamento: 'Mamá quiere cocinar pero carece de tiempo para lavar, desinfectar y trocear minúsculo (Pág. 26).',
      hallazgo: 'La madre aspira a cocinar fresco pero el tiempo matutino colapsa en menos de 3 minutos.',
      problema: 'Preparar alimentos desde cero implica lavar, desinfectar, pelar y picar en porciones microscópicas.',
      friccion: 'La culpa de dar ultraprocesados frente al agotamiento de cocinar dos menús distintos.',
      condicionPreservar: 'Garantía de frescura natural sin conservadores artificiales ni sodio añadido.',
      oportunidad: 'Verduras y proteínas infantiles ultracongeladas al vacío listas para vaciar a la cazuela común.',
      hipotesisSolucion: 'Si Gerber o Nestlé ofrecen bases de cocina limpias en cubos dosificables, mamá las adoptará como aliadas del afecto.',
      marcas: ['Gerber', 'Nestum']
    });
  }

  if (maduracion === 'bypass_ano' && relevanciaSoluciones.nido.score < 55) {
    oportunidadesPlausibles.push({
      id: 'opp-sim-02',
      titulo: 'Suplemento enriquecedor para mezclar en la leche entera de casa',
      impacto: 'Defensa de Mercado',
      fundamento: 'Si la madre no va a pagar una lata completa de Nido, ofrecer una medida de micronutrientes para el galón familiar (Pág. 7).',
      hallazgo: 'El bebé cumplió 12 meses, tolera la leche de vaca y la familia adopta el cartón de $25 pesos.',
      problema: 'Nido pierde justificación de compra recurrente frente al bajo costo de la leche familiar.',
      friccion: 'Mamá teme que la leche entera común no aporte suficiente hierro y zinc pero no quiere gastar en latas caras.',
      condicionPreservar: 'Facilidad de disolución instantánea en leche fría sin alterar el sabor que el bebé ya aceptó.',
      oportunidad: 'Formato sachet o booster de micronutrientes para adicionar al vaso de leche entera de casa.',
      hipotesisSolucion: 'Si Nido ofrece "El escudo de hierro para tu leche familiar", retiene la categoría sin forzar la lata completa.',
      marcas: ['Nido']
    });
  }

  if (espacio === 'calle_feria') {
    oportunidadesPlausibles.push({
      id: 'opp-sim-03',
      titulo: 'Estuches térmicos modulares "Día de Feria" con cubierto estéril integrado',
      impacto: 'Fidelización Urbana',
      fundamento: 'Las madres de comercio informal necesitan transportar alimento sin riesgo de rotura de vidrio ni contaminación (Pág. 21).',
      hallazgo: 'Jornadas de 14 horas en comercio ambulante sin agua corriente ni refrigeración.',
      problema: 'Los frascos de vidrio pesan, se rompen y una vez abiertos corren riesgo bacteriológico inmediato.',
      friccion: 'Alimentar con manos sucias en la calle y la angustia constante de que la comida se eche a perder.',
      condicionPreservar: 'Hermeticidad 100% esterilizada y consumo directo sin requerir cubiertos externos.',
      oportunidad: 'Pouch ergonómico de doble barrera con cuchara dosificadora de silicón acoplable a rosca.',
      hipotesisSolucion: 'Si Gerber ofrece un kit modular irrompible para puestos ambulantes, dominará el gasto de contingencia callejera.',
      marcas: ['Gerber']
    });
  }

  // --- 6. HIPÓTESIS A VALIDAR ---
  hipotesisValidar.push({
    enunciado: '¿El sello "Sin Azúcar Añadida" compensa un sobreprecio de hasta el 30% en cereales infantiles para mamás que trabajan?',
    metodoValidacion: 'Test A/B de elasticidad de precio en anaquel y entrevista de comprobación sensorial en cocina.'
  });

  if (maduracion === 'bypass_ano') {
    hipotesisValidar.push({
      enunciado: '¿La introducción de la leche de vaca entera es postergada si el pediatra advierte activamente sobre deficiencia de hierro al año de edad?',
      metodoValidacion: 'Monitoreo de prescripción médica en consulta privada vs. centros de salud en CDMX.'
    });
  }

  return {
    state,
    necesidadesAumentan,
    necesidadesDisminuyen,
    tensionesEmergentes,
    relevanciaSoluciones,
    implicacionesMarca,
    oportunidadesPlausibles,
    hipotesisValidar,
    epistemicNote: 'Derivaciones inferidas a partir del modelo causal etnográfico (OBSERVADO/DERIVADO). No constituyen predicciones econométricas.'
  };
}
