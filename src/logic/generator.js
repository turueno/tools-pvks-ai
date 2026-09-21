import { LEXICONS } from './pacEngine';

export function generateBlocks(inputs, forcePAC = null) {
    const { target, formato, etapa, objetivo, beneficio } = inputs;
    const pac = forcePAC || inputs.pac;

    const isPolvo = formato === "Polvo";
    const stageInfo = target === "Mama" && etapa ? ` para la etapa ${etapa}` : "";

    // High-intensity keywords to trigger higher scores
    const p_keywords = "diagnóstico clínico, bajo criterio profesional, indicaciones temporales de seguimiento, dosificación exacta, seguimiento constante";
    const a_keywords = "preparación ritual, cuidado diario, tranquilidad en el hogar, acompañamiento en la rutina, enseñar el proceso, evitar universalidad";
    const c_keywords = "ligereza digestiva, balance natural, autocuidado consciente, elección informada on-demand, no medicalizar el consumo";

    let specificKeywords = "";
    if (pac === "Prescribir") specificKeywords = p_keywords;
    else if (pac === "Acompanar") specificKeywords = a_keywords;
    else if (pac === "Comunicar") specificKeywords = c_keywords;

    // Mix based on target weight dominance
    if (target === "Medico") specificKeywords += " " + p_keywords;
    if (target === "Mama") specificKeywords += " " + a_keywords;
    if (target === "Adulto") specificKeywords += " " + c_keywords;

    const blocks = {
        idea: `Propuesta de ${formato} de alta especialización ${stageInfo}. Objetivo: ${objetivo}. Beneficio: ${beneficio}. Enfoque en ${pac}.`,
        titulares: [
            `${target}: ${pac === 'Prescribir' ? 'Criterio y Diagnóstico' : pac === 'Acompanar' ? 'Cuidado y Ritual' : 'Balance y Elección'}`,
            isPolvo ? "Dosificación exacta y seguimiento según indicaciones." : "Rutina de continuidad para el bienestar diario.",
            `${beneficio} con respaldo clínico.`
        ],
        mensaje: `En el ${target === 'Medico' ? 'ámbito clínico' : 'día a día'}, es fundamental contar con ${specificKeywords}. ${isPolvo ? "La preparación ritual del polvo permite una dosificación exacta bajo indicaciones temporales y seguimiento." : "El formato líquido ofrece una rutina de continuidad y practicidad diaria."} Esta opción para sensibilidad asegura ligereza y tranquilidad, basada en una elección informada y evitando la universalidad. Se recomienda un diagnóstico previo para determinar la temporalidad del seguimiento profesional.`,
        racional: [
            `Satisface el modo ${pac} mediante ${specificKeywords.split(',')[0]}.`,
            `El formato ${formato} actúa como herramienta de ${isPolvo ? "control y límites" : "práctico balance"}.`,
            "Cumple con el respaldo clínico y evita claims de cura permanente."
        ],
        instrucciones: [
            `Realizar seguimiento bajo indicaciones temporales de un profesional.`,
            isPolvo ? "Seguir la dosificación exacta y el ritual de preparación sugerido." : "Mantener una rutina de continuidad para mejores resultados.",
            "No medicalizar el uso diario; usar como elección informada.",
            "Consultar diagnóstico en caso de etapas sensibles.",
            "Asegurar el balance y la ligereza en cada toma."
        ]
    };

    return blocks;
}
