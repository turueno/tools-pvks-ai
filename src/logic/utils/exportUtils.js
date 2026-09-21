/**
 * Export Utilities for SNTD
 */

export const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const generateTextReport = (result, inputs, priorities, gateways) => {
    let report = `====================================================\n`;
    report += `   SALSA NEGRA TERRITORY DIAGNOSTIC (SNTD)          \n`;
    report += `====================================================\n\n`;

    report += `PROTOTIPO: ${inputs.prototipo}\n`;
    report += `FECHA: ${new Date().toLocaleDateString()}\n`;
    report += `DICTAMEN: ${result.dictamen}\n`;
    report += `ALINEACIÓN: ${(result.totalScore * 100).toFixed(1)}%\n\n`;

    report += `--- INPUTS DEL PROTOTIPO ---\n`;
    report += `[Contexto Visual]: ${inputs.visual}\n`;
    report += `[Ficha Sensorial]: ${inputs.fichaSensorial}\n\n`;

    report += `--- MAPA DE OPORTUNIDADES ---\n`;

    if (result.aoClassification.Criticas.length > 0) {
        report += `[ÁREAS CRÍTICAS (DEAL-BREAKERS)]\n`;
        result.aoClassification.Criticas.forEach(ao => {
            report += `- ${ao.gateway} (${ao.type})\n`;
            report += `  Op: ${ao.ao}\n`;
            report += `  Rationale: ${ao.rationale}\n\n`;
        });
    }

    if (result.aoClassification.Mejoras.length > 0) {
        report += `[OPORTUNIDADES DE ANCLAJE]\n`;
        result.aoClassification.Mejoras.forEach(ao => {
            report += `- ${ao.gateway} (${ao.type})\n`;
            report += `  Op: ${ao.ao}\n`;
            report += `  Rationale: ${ao.rationale}\n\n`;
        });
    }

    if (result.aoClassification.Criticas.length === 0 && result.aoClassification.Mejoras.length === 0) {
        report += `PRODUCTO TERRITORIALMENTE SÓLIDO. No se detectaron desviaciones.\n\n`;
    }

    report += `--- PERFIL DEL RESULTADO ---\n`;
    result.logs.forEach((log, i) => {
        report += `G${i + 1}: ${gateways[log.gateway].name} -> ${(log.score * 100).toFixed(0)}% (Imp: ${(log.weightedImpact * 100).toFixed(1)}%)\n`;
    });

    report += `\n====================================================\n`;
    report += `Generado por SNTD AI-Agent v1.5\n`;

    return report;
};

export const downloadText = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
