export const PAC_WEIGHTS = {
    Medico: { wP: 0.62, wA: 0.23, wC: 0.15 },
    Mama: { wP: 0.25, wA: 0.50, wC: 0.25 },
    Adulto: { wP: 0.18, wA: 0.27, wC: 0.55 },
};

export const LEXICONS = {
    global_usar: ["opción para sensibilidad", "bajo recomendación", "ayuda a la digestión", "bienestar", "ligereza", "continuidad"],
    global_evitar: ["cura", "para todos", "permanente", "mejor que la normal"],
    polvo: ["preparación", "dosificación", "etapas sensibles", "control", "temporalidad", "seguimiento"],
    liquido: ["rutina", "practicidad", "continuidad"]
};

export const SCORING_KEYWORDS = {
    sP: ["diagnóstico", "criterio", "indicaciones", "temporalidad", "seguimiento", "dosificación"],
    sA: ["preparar", "ritual", "cuidado", "tranquilidad", "rutina", "enseñar", "evitar universalidad"],
    sC: ["ligereza", "balance", "autocuidado", "no medicalizar", "on-demand", "elección informada"]
};

export function scorePAC(generatedBlocks, inputs) {
    const allText = Object.values(generatedBlocks).join(" ").toLowerCase();
    const headlines = (generatedBlocks.titulares || []).join(" ").toLowerCase();
    const message = (generatedBlocks.mensaje || "").toLowerCase();

    let sP = 0, sA = 0, sC = 0;

    const calculateScore = (keywords, text, currentScore) => {
        let score = currentScore;
        keywords.forEach(word => {
            const inHeadlinesAndMessage = headlines.includes(word) && message.includes(word);
            const inAny = text.includes(word);

            if (inHeadlinesAndMessage) score += 0.20;
            else if (inAny) score += 0.10;
        });
        return Math.min(score, 1.0);
    };

    sP = calculateScore(SCORING_KEYWORDS.sP, allText, sP);
    sA = calculateScore(SCORING_KEYWORDS.sA, allText, sA);
    sC = calculateScore(SCORING_KEYWORDS.sC, allText, sC);

    // Synergies
    if (inputs.formato === "Polvo") {
        sP = Math.min(sP + 0.08, 1.0);
        sA = Math.min(sA + 0.07, 1.0);
    } else if (inputs.formato === "Líquido") {
        sC = Math.min(sC + 0.06, 1.0);
        sA = Math.min(sA + 0.04, 1.0);
    }

    return { sP, sA, sC };
}

export function balancePAC(scores, target) {
    const weights = PAC_WEIGHTS[target];
    const { sP, sA, sC } = scores;
    const { wP, wA, wC } = weights;

    const G_PAC = wP * sP + wA * sA + wC * sC;

    const sumWS = (wP * sP) + (wA * sA) + (wC * sC);
    const cP = sumWS > 0 ? (wP * sP) / sumWS : 0;
    const cA = sumWS > 0 ? (wA * sA) / sumWS : 0;
    const cC = sumWS > 0 ? (wC * sC) / sumWS : 0;

    const D = 0.5 * (Math.abs(cP - wP) + Math.abs(cA - wA) + Math.abs(cC - wC));

    const decision = (G_PAC >= 0.70 && D <= 0.18) ? "Publicar" : "Iterar";

    return {
        weights,
        scores,
        G_PAC,
        contribs: { cP, cA, cC },
        D,
        decision
    };
}

export function generateRecommendations(decision, scores, weights, faltantes) {
    const recs = [];
    if (decision === "Publicar" && faltantes.length === 0) return ["Contenido equilibrado y cumple normativas."];

    if (scores.sP < weights.wP) {
        recs.push("Para subir P: añadir 'bajo criterio', 'indicaciones temporales', 'seguimiento', 'dosificación exacta'.");
    }
    if (scores.sA < weights.wA) {
        recs.push("Para subir A: añadir 'preparar/ritual', 'tranquilidad', 'rutina', 'enseñar' y 'evitar universalidad'.");
    }
    if (scores.sC < weights.wC) {
        recs.push("Para subir C: añadir 'ligereza/balance', 'elección informada', 'autocuidado', 'on-demand', 'no medicalizar'.");
    }

    faltantes.forEach(f => recs.push(`Criterio faltante: ${f}`));

    return recs;
}
