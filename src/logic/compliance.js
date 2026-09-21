export const COMPLIANCE_RESTRICTIONS = {
  prohibited: ["cura", "para todos", "permanente", "mejor que la normal"],
  powder_mandatory: ["temporalidad", "seguimiento"],
};

export const UNIVERSAL_CRITERIA = [
  "Especialización (Polvo como herramienta)",
  "Control/Dosificación explícitos",
  "Respaldo clínico (indicaciones/temporalidad/seguimiento)",
  "Ritual de preparación",
  "Sensibilidad/Etapas (específico Mamá/Etapa)",
  "Educación sin diluir",
];

export function checkCompliance(blocks) {
  const allText = Object.values(blocks).join(" ").toLowerCase();
  const issues = [];

  // Hard filters
  COMPLIANCE_RESTRICTIONS.prohibited.forEach((term) => {
    if (allText.includes(term.toLowerCase())) {
      issues.push(`Contenido prohibido: "${term}"`);
    }
  });

  // Powder specific hard balance
  if (blocks.inputs?.formato === "Polvo") {
    const messageText = (blocks.mensaje || "").toLowerCase();
    COMPLIANCE_RESTRICTIONS.powder_mandatory.forEach((term) => {
      if (!messageText.includes(term)) {
        issues.push(`Falta "${term}" en mensaje base (Obligatorio para Polvo)`);
      }
    });
  }

  return {
    pass: issues.length === 0,
    issues,
  };
}

export function checkUniversalCriteria(blocks, inputs) {
  const allText = Object.values(blocks).join(" ").toLowerCase();
  const { formato, target, etapa } = inputs;
  const faltantes = [];

  // Criteria logic
  // 1: Especialización
  if (formato === "Polvo" && !allText.includes("especializa") && !allText.includes("profesional")) faltantes.push(UNIVERSAL_CRITERIA[0]);

  // 2: Control/Dosificación
  if (formato === "Polvo" && (!allText.includes("dosificación") && !allText.includes("control") && !allText.includes("exacta"))) faltantes.push(UNIVERSAL_CRITERIA[1]);

  // 3: Respaldo clínico
  if (!allText.includes("clínico") && !allText.includes("indicación") && !allText.includes("seguimiento") && !allText.includes("profesional")) faltantes.push(UNIVERSAL_CRITERIA[2]);

  // 4: Ritual
  if (formato === "Polvo" && !allText.includes("prepara") && !allText.includes("ritual")) faltantes.push(UNIVERSAL_CRITERIA[3]);

  // 5: Sensibilidad/Etapas
  if (target === "Mama" && etapa && !allText.includes(etapa)) faltantes.push(UNIVERSAL_CRITERIA[4]);

  // 6: Educación
  if (!allText.includes("claro") && !allText.includes("educación") && !allText.includes("informada")) faltantes.push(UNIVERSAL_CRITERIA[5]);

  // Special Liquid rule
  if (formato === "Líquido") {
    const hasBase = allText.includes("rutina") || allText.includes("continuidad");
    if (!hasBase) faltantes.push("Mención clara de rutina/continuidad (Obligatorio para Líquido)");
  }

  return {
    ok: faltantes.length === 0,
    faltantes,
  };
}
