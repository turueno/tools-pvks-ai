// src/playbook/sntd/engine/toolkitComplianceEngine.js
// Motor de validación interactiva basado en los 7 pares de decisión del TOOLKIT oficial (54 págs)

export const TOOLKIT_CRITERIA = [
  {
    id: 'D1_IDENTIDAD',
    gatewayId: 'G1',
    nombre: 'Identidad Explícita vs. Nombres Abstractos',
    pregunta: '¿El producto declara frontalmente "Salsa Negra" y activa la memoria culinaria (Maggi/Inglesa/Limón)?',
    siEs: 'Declaración explícita "Salsa Negra", memoria cultural inmediata, sin ambigüedad.',
    noEs: 'Nombres abstractos ("Dark", "Misterio", "Halloween") que exigen adivinar o confunden con dulces.',
    penalizacion: 15,
    severidad: 'ALTA'
  },
  {
    id: 'D2_ARQUITECTURA',
    gatewayId: 'G2',
    nombre: 'Arquitectura en 4 Capas vs. Golpe Plano',
    pregunta: '¿El sabor evoluciona gradualmente en boca (1° Salada ➔ 2° Ácida ➔ 3° Umami/Tatemado ➔ 4° Picor suave tardío)?',
    siEs: 'Evolución gradual y discernimiento de ingredientes (soya, limón, ajo, especias).',
    noEs: 'Golpe plano monótono de salmuera o desvanecimiento instantáneo.',
    penalizacion: 15,
    severidad: 'MEDIA'
  },
  {
    id: 'D3_ACIDEZ',
    gatewayId: 'G3',
    isCritical: true,
    nombre: 'Limón Natural vs. Síndrome del Limón Falso',
    pregunta: '¿La acidez proviene de notas cítricas naturales frescas o aceites de cáscara sin astringencia química?',
    siEs: 'Limón creíble en gotas que corta la grasa, saliva y refresca el paladar.',
    noEs: 'Ácido cítrico sintético anhidro con aroma a limpiador o pastilla de baño (Rechazo inmediato).',
    penalizacion: 35,
    severidad: 'CRITICA'
  },
  {
    id: 'D4_VEHICULO',
    gatewayId: 'G4',
    nombre: 'Salsa Impregnada vs. Polvo Seco Volátil',
    pregunta: '¿La botana presenta aspecto bañado/impregnado uniforme 360° sin desprender polvillo seco en los dedos?',
    siEs: 'Sensación de textura líquida impregnada en la masa o lámina; dedos limpios.',
    noEs: 'Polvo naranja/rojo suelto que se sacude en la bolsa y rompe la ilusión de salsa real.',
    penalizacion: 15,
    severidad: 'ALTA'
  },
  {
    id: 'D5_INTENSIDAD',
    gatewayId: 'G5',
    nombre: 'Sazón de Permanencia vs. Pungencia de Dolor',
    pregunta: '¿La intensidad invita a terminarse la bolsa entera sin generar ardor de labios, reflujo ni boca escaldada?',
    siEs: 'Intensidad sabrosa, controlada y continua. Pungencia como remate aromático.',
    noEs: 'Reto físico de lumbre tipo Flamin Hot que anestesia la boca y obliga a pausar el consumo.',
    penalizacion: 20,
    severidad: 'ALTA'
  },
  {
    id: 'D6_RITUAL',
    gatewayId: 'G6',
    nombre: 'Solución "Ready to Eat" vs. Botana Incompleta',
    pregunta: '¿El producto resuelve el antojo de cantina/calle de forma autocontenida sin requerir limones o salsas extra?',
    siEs: 'Sabor completamente cerrado que evoca la preparación casera perfecta lista para comer.',
    noEs: 'Sensación de vacío donde el consumidor siente urgente necesidad de agregar limón o Maggi.',
    penalizacion: 10,
    severidad: 'MEDIA'
  },
  {
    id: 'D7_SEMIOTICA',
    gatewayId: 'G7',
    nombre: 'Oscuridad Cálida Culinaria vs. Negro Gótico / Peligro',
    pregunta: '¿El empaque y la estética utilizan negros cálidos/marrones, acentos amarillos/dorados y códigos de asador/comal?',
    siEs: 'Faro amarillo/dorado, botellas de vidrio dosificadoras, brillo apetitoso de salsa densa.',
    noEs: 'Negro mate funerario, estridencia infantil, calaveras, rayos o llamas agresivas de alerta.',
    penalizacion: 15,
    severidad: 'ALTA'
  }
];

export function evaluateToolkitCompliance(switchesState) {
  // switchesState: objeto con { D1_IDENTIDAD: true/false, ... } donde true = CUMPLE QUÉ SÍ, false = CAE EN QUÉ NO
  let score = 100;
  const infracciones = [];
  let tieneAlertaCritica = false;

  TOOLKIT_CRITERIA.forEach(crit => {
    const cumple = switchesState[crit.id] !== undefined ? switchesState[crit.id] : true;
    if (!cumple) {
      score -= crit.penalizacion;
      infracciones.push({
        ...crit,
        motivo: crit.noEs
      });
      if (crit.isCritical) {
        tieneAlertaCritica = true;
      }
    }
  });

  const finalScore = Math.max(0, score);
  let semaforo = 'VERDE';
  let estado = 'ALINEADO';
  let dictamenResumen = 'El prototipo respeta los códigos canónicos y sensoriales de la plataforma Salsa Negra.';

  if (tieneAlertaCritica) {
    semaforo = 'ROJO_CRITICO';
    estado = 'VETO CRÍTICO DE ADOPCIÓN';
    dictamenResumen = 'REPROBADO: Presenta el "Síndrome del Limón Falso". Esta infracción detiene la adopción y genera rechazo visceral en el consumidor mexicano.';
  } else if (finalScore < 60) {
    semaforo = 'ROJO';
    estado = 'FUERA DE PLATAFORMA';
    dictamenResumen = 'El prototipo incurre en múltiples desvíos. Se percibe como un snack picante genérico o golosina artificial, no como una verdadera Salsa Negra botanera.';
  } else if (finalScore < 85) {
    semaforo = 'AMARILLO';
    estado = 'RIESGO MODERADO';
    dictamenResumen = 'Alineación parcial. Presenta fricciones en integración o códigos que pueden limitar la recompra sostenida.';
  }

  return {
    score: finalScore,
    semaforo,
    estado,
    dictamenResumen,
    tieneAlertaCritica,
    infracciones,
    totalCriterios: TOOLKIT_CRITERIA.length,
    aprobadosCount: TOOLKIT_CRITERIA.length - infracciones.length
  };
}

export function auditConceptText(text) {
  if (!text || typeof text !== 'string') return { score: 100, warnings: [], suggestions: [] };

  const lower = text.toLowerCase();
  const warnings = [];
  const suggestions = [];

  // Chequeos heurísticos basados en el Toolkit
  if (lower.includes('ácido cítrico') || lower.includes('químico') || lower.includes('artificial')) {
    warnings.push({
      criterio: 'D3 Acidez',
      mensaje: 'Mención de acidulantes sintéticos. El Toolkit exige extractos naturales o limón real deshidratado.'
    });
  }

  if (lower.includes('polvo') && !lower.includes('líquido') && !lower.includes('baño') && !lower.includes('impregnad')) {
    warnings.push({
      criterio: 'D4 Vehículo',
      mensaje: 'Riesgo de percepción de polvo suelto. Sugerir tecnología de slurry o aspersión líquida 360°.'
    });
  }

  if (lower.includes('flamin') || lower.includes('fuego') || lower.includes('infierno') || lower.includes('extremo') || lower.includes('arder')) {
    warnings.push({
      criterio: 'D5 Intensidad',
      mensaje: 'Uso de léxico prohibido de dolor/castigo. La Salsa Negra debe comunicar sazón de permanencia y notas de comal/tatemado.'
    });
  }

  if (lower.includes('dark') || lower.includes('halloween') || lower.includes('misterio')) {
    warnings.push({
      criterio: 'D1 Identidad',
      mensaje: 'Desvío conceptual abstracto. Sustituir por declaración explícita de "Salsa Negra" y referencias culinarias.'
    });
  }

  if (lower.includes('limón natural') || lower.includes('soya') || lower.includes('tatemad') || lower.includes('bañad')) {
    suggestions.push('Gran alineación con los atributos obligatorios del Toolkit (+Sazón, +Limón Real).');
  }

  return {
    warnings,
    suggestions,
    isCompliant: warnings.length === 0
  };
}
