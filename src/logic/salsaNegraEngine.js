import { callAI } from './ai/aiService';

export const SNTD_GATEWAYS = {
    G1: {
        name: "Identidad Territorial",
        type: "Territorial",
        aos: ["Claridad territorial", "Naming", "Anclaje cultural"]
    },
    G2: {
        name: "Arquitectura de Sabor (Capas)",
        type: "Sensorial",
        aos: ["Profundidad", "Secuencia", "Persistencia"]
    },
    G3: {
        name: "Acidez (Naturalidad)",
        type: "Sensorial",
        isCritical: true,
        aos: ["Naturalidad del ácido", "Reformulación"]
    },
    G4: {
        name: "Integración (Vehículo)",
        type: "Funcional",
        aos: ["Integración en polvo", "Textura", "Vehículo"]
    },
    G5: {
        name: "Intensidad y Balance",
        type: "Sensorial",
        aos: ["Balance Sal/Picor", "Fatiga sensorial"]
    },
    G6: {
        name: "Rol Ritual",
        type: "Territorial",
        aos: ["Completitud", "Cierre sensorial"]
    },
    G7: {
        name: "Código Visual",
        type: "Visual",
        aos: ["Expresión visual", "Lenguaje gráfico"]
    }
};

/**
 * Main AI-First Diagnostic Function
 * Connects to OpenRouter to evaluate sensory and cultural alignment.
 */
export async function runSNTDDiagnostic(inputs, priorities, documentoRector, config = {}) {
    const { apiKey, model } = config;
    const weights = calculateAHPWeights(priorities);

    if (!apiKey) {
        throw new Error("Se requiere una API Key de OpenRouter para ejecutar el diagnóstico real.");
    }

    const systemPrompt = `Eres el "Agente Territorial SNTD", un experto en semiótica sensorial y cultural mexicana. 
    Tu única fuente de verdad es el Documento Rector de Salsas Negras. 
    Analizas prototipos de botanas y dictaminas si cumplen con los códigos del territorio.
    
    DOCUMENTO RECTOR:
    ${documentoRector}
    
    REGLAS DE EVALUACIÓN:
    - Responde SIEMPRE en formato JSON.
    - Analiza con rigor: el territorio de Salsa Negra es específico (no es picante extremo, no es limón falso).
    - Evalúa el Gateway solicitado basándote únicamente en los datos proporcionados.
    - El score de 0.0 a 1.0 refleja el nivel de cumplimiento territorial.`;

    const gatewayKeys = Object.keys(SNTD_GATEWAYS);
    const mapaOportunidades = [];
    const executionLogs = [];
    let totalScore = 0;

    for (let i = 0; i < gatewayKeys.length; i++) {
        const key = gatewayKeys[i];
        const gateway = SNTD_GATEWAYS[key];
        const weight = weights[i];

        const userMessage = `EVALUACIÓN GATEWAY ${key}: ${gateway.name}
        TIPO: ${gateway.type}
        ÁREAS DE OPORTUNIDAD (AO) POSIBLES PARA ESTE GATEWAY: ${gateway.aos.join(", ")}
        
        INPUTS DEL PROTOTIPO:
        - Nombre/Prototipo: ${inputs.prototipo}
        - Ficha Sensorial: ${inputs.fichaSensorial}
        - Visual: ${inputs.visual}
        
        Responde EXACTAMENTE con este esquema JSON:
        { 
          "passed": boolean, 
          "score": number (0.0 a 1.0), 
          "detectedAO": "Selecciona una de las AOs posibles o null si cumple", 
          "rationale": "Justificación breve citando el Documento Rector" 
        }`;

        try {
            console.log(`Analizando Gateway ${key}: ${gateway.name}...`);
            const rawAiResult = await callAI(apiKey, model, systemPrompt, userMessage);
            console.log(`Resultado AI para ${key}:`, rawAiResult);

            // Normalize keys (handle case differences from various models)
            const aiResult = {
                passed: rawAiResult.passed ?? rawAiResult.Passed ?? true,
                score: rawAiResult.score ?? rawAiResult.Score ?? 1.0,
                detectedAO: rawAiResult.detectedAO ?? rawAiResult.DetectedAO ?? null,
                rationale: rawAiResult.rationale ?? rawAiResult.Rationale ?? "Cumple con los códigos del Documento Rector."
            };

            if (!aiResult.passed || aiResult.score < 0.8) {
                mapaOportunidades.push({
                    gateway: gateway.name,
                    type: gateway.type,
                    critica: gateway.isCritical || aiResult.score < 0.4,
                    ao: aiResult.detectedAO || "Desviación Territorial",
                    rationale: aiResult.rationale,
                    score: aiResult.score
                });
            }
            totalScore += (aiResult.score * weight);
            executionLogs.push({ gateway: key, passed: aiResult.passed, weightedImpact: weight, score: aiResult.score });
        } catch (error) {
            console.error(`Error en Gateway ${key}:`, error);
            mapaOportunidades.push({
                gateway: gateway.name,
                type: gateway.type,
                critica: gateway.isCritical || false,
                ao: "Error Técnico de Evaluación",
                rationale: `El agente no pudo procesar esta compuerta: ${error.message}`,
                score: 0
            });
            executionLogs.push({ gateway: key, error: true, rationale: error.message });
            totalScore += (0 * weight);
        }
    }

    // Classification as requested in BPMN
    const aoClassification = {
        Criticas: mapaOportunidades.filter(ao => ao.critica),
        Mejoras: mapaOportunidades.filter(ao => !ao.critica)
    };

    const dictamen = totalScore >= 0.85
        ? "Territorialmente Sólido"
        : totalScore >= 0.65
            ? "Con Oportunidades de Anclaje"
            : "Fuera de Territorio";

    return {
        totalScore,
        dictamen,
        mapaOportunidades,
        aoClassification,
        weights: gatewayKeys.reduce((acc, k, idx) => ({ ...acc, [k]: weights[idx] }), {}),
        logs: executionLogs
    };
}

export function calculateAHPWeights(priorityLevels) {
    const sum = priorityLevels.reduce((a, b) => a + b, 0);
    return priorityLevels.map(p => p / sum);
}
