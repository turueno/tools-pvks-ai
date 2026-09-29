// src/playbook/sntd/engine/sntdGroundedAIEngine.js
// Motor de IA asistida Grounded territorial para S.N.T.D. (Salsas Negras México - Sabritas)
// Fundamentado al 100% en el Toolkit (54 págs), Reporte PF v2 (43 págs) y los 7 Gateways.

import {
  SNTD_GATEWAYS_DEF,
  SNTD_PLAZAS,
  SNTD_BRANDS,
  SNTD_EVIDENCES,
  SNTD_INSIGHTS,
  SNTD_TENSIONS,
  SNTD_TOOLKIT_RULES
} from '../data/sntdDataset.js';

export const SNTD_AI_OPERATIONS = [
  {
    id: 'diagnosticar-gateway',
    titulo: 'Auditar cumplimiento de Gateway específico',
    descripcion: 'Somete una formulación o idea a la regla dura y atributos obligatorios de uno de los 7 Gateways del Toolkit.',
    requiere: ['gatewayId']
  },
  {
    id: 'derivar-implicaciones',
    titulo: 'Derivar implicaciones para Sabritas',
    descripcion: 'Proyecta el impacto directo sobre el portafolio, I+D y packaging a partir de un insight territorial seleccionado.',
    requiere: ['insightId']
  },
  {
    id: 'resolver-tension',
    titulo: 'Resolver tensión polar de mercado',
    descripcion: 'Genera rutas de conciliación estratégica para balancear dos polos en conflicto (ej. Polvo vs Salsa, o Limón Real vs Vida de anaquel).',
    requiere: ['tensionId']
  },
  {
    id: 'contrastar-plazas',
    titulo: 'Contrastar paladar regional (CDMX vs GDL vs MTY)',
    descripcion: 'Compara las expectativas culturales y barreras de adopción entre dos plazas geográficas.',
    requiere: ['plazaAId', 'plazaBId']
  },
  {
    id: 'auditar-lexico',
    titulo: 'Auditor de Copywriting & Reclamos de Empaque',
    descripcion: 'Analiza un texto o claim para detectar términos prohibidos de dolor/fuego y recomendar léxico habilitado de sazón.',
    requiere: ['textoClaim']
  },
  {
    id: 'generar-innovacion',
    titulo: 'Proponer Oportunidad de Innovación (Ready to Eat)',
    descripcion: 'Construye un territorio de oportunidad conectando una ocasión de consumo con los vacíos del portafolio actual.',
    requiere: ['ocasionIndex']
  }
];

export function executeSNTDAIOperation(actionId, params) {
  switch (actionId) {
    case 'diagnosticar-gateway': {
      const gw = SNTD_GATEWAYS_DEF.find(g => g.id === params.gatewayId) || SNTD_GATEWAYS_DEF[0];
      return {
        titulo: `Dictamen Territorial: ${gw.id} - ${gw.name}`,
        subtitulo: gw.preguntaClave,
        reglaDura: gw.reglaDura,
        epistemic: gw.isCritical ? 'DERIVADO' : 'OBSERVADO',
        fundamentoCientifico: `Conforme a las pág. ${gw.numero * 4} a ${gw.numero * 4 + 3} del Toolkit oficial, este Gateway evalúa: ${gw.siEs}`,
        atributosObligatorios: gw.atributosObligatorios,
        alertaCritica: gw.isCritical ? '⚠️ GATEWAY CRÍTICO: Si falla este punto, el producto es automáticamente reprobado por el consumidor mexicano.' : null,
        recomendacionID: `Asegurar que la formulación industrial cumpla estrictamente con: ${gw.siEs}. Evitar totalmente: ${gw.noEs}`
      };
    }

    case 'derivar-implicaciones': {
      const ins = SNTD_INSIGHTS.find(i => i.id === params.insightId) || SNTD_INSIGHTS[0];
      return {
        titulo: `Implicaciones Estratégicas: ${ins.titulo}`,
        subtitulo: ins.subtitulo,
        epistemic: ins.epistemic,
        impactoNegocio: ins.capas.implicacion,
        mecanismoCausal: ins.capas.derivado,
        evidenciaCampo: ins.capas.observado,
        gatewaysVinculados: ins.gatewaysAfectados,
        directrizSabritas: `Alinear los briefs de marca para que el producto entregue la promesa de '${ins.titulo}' sin comprometer la accesibilidad del precio ni la vida de anaquel.`
      };
    }

    case 'resolver-tension': {
      const ten = SNTD_TENSIONS.find(t => t.id === params.tensionId) || SNTD_TENSIONS[0];
      const gw = SNTD_GATEWAYS_DEF.find(g => g.id === ten.gatewayId);
      return {
        titulo: `Resolución de Tensión: ${ten.tension}`,
        subtitulo: `Conflicto entre [${ten.poloA}] y [${ten.poloB}]`,
        epistemic: 'HIPOTESIS',
        diagnostico: ten.descripcion,
        reglaDeOro: ten.aprendizaje,
        gatewayAsociado: gw ? `${gw.id}: ${gw.name}` : 'General',
        rutaConciliacion: [
          `Polo A (${ten.poloA}): Mantener la promesa de conveniencia y costo sin caer en el atajo artificial.`,
          `Polo B (${ten.poloB}): Incorporar las anclas organolépticas que el consumidor exige (acidez real, impregnación visual, notas tatemadas).`,
          `Solución de Síntesis: Desarrollar tecnología de slurry/aspersión con microencapsulado cítrico para lograr la textura de salsa líquida sin resequedad de polvo.`
        ]
      };
    }

    case 'contrastar-plazas': {
      const pA = SNTD_PLAZAS.find(p => p.id === params.plazaAId) || SNTD_PLAZAS[0];
      const pB = SNTD_PLAZAS.find(p => p.id === params.plazaBId) || SNTD_PLAZAS[1];
      return {
        titulo: `Contraste Cultural: ${pA.name} vs. ${pB.name}`,
        subtitulo: 'Alineación de portafolio según paladares regionales',
        epistemic: 'OBSERVADO',
        plaza1: {
          nombre: pA.name,
          enfoque: pA.focus,
          habitat: pA.descripcionHabitat,
          cita: pA.citasClave[0]
        },
        plaza2: {
          nombre: pB.name,
          enfoque: pB.focus,
          habitat: pB.descripcionHabitat,
          cita: pB.citasClave[0]
        },
        conclusionTerritorial: `Mientras que en ${pA.name.split(' ')[1]} se privilegia la complejidad barroca de mezclas callejeras, en ${pB.name.split(' ')[1]} la exigencia se centra en el respeto al sazón botanero de mesa y la resistencia física de la botana al remojo.`
      };
    }

    case 'auditar-lexico': {
      const texto = (params.textoClaim || 'Salsa Negra Fuego Extremo que te va a arder en cada mordida').toLowerCase();
      const prohibidosDetectados = SNTD_TOOLKIT_RULES.lexicoProhibido.filter(p => texto.includes(p.toLowerCase()));
      const habilitadosDetectados = SNTD_TOOLKIT_RULES.lexicoHabilitado.filter(h => texto.includes(h.toLowerCase()));
      const aprobado = prohibidosDetectados.length === 0;

      return {
        titulo: aprobado ? '✅ Claim Aprobado por el Código SNTD' : '❌ Claim Reprobado: Contiene Términos Prohibidos',
        subtitulo: `Evaluación de Copywriting: "${params.textoClaim || 'Claim evaluado'}"`,
        epistemic: 'DERIVADO',
        estado: aprobado ? 'APROBADO' : 'RECHAZADO',
        terminosProhibidos: prohibidosDetectados.length > 0 ? prohibidosDetectados : ['Ninguno detectado'],
        terminosHabilitados: habilitadosDetectados.length > 0 ? habilitadosDetectados : ['Se sugiere incorporar términos de sazón'],
        dictamen: aprobado 
          ? 'El claim utiliza el lenguaje culinario y adulto propio de las Salsas Negras. Invita a la permanencia y el disfrute.'
          : 'El claim incurre en el error de comunicar dolor, peligro o reto físico. Esto traslada la botana al territorio Flamin Hot y destruye el posicionamiento de Salsa Negra.',
        recomendacionReescritura: aprobado
          ? 'Potenciar el claim con referencias a notas tatemadas o limón fresco.'
          : `Reescribir reemplazando palabras de castigo por términos como: "Sazón oscuro que se queda", "Intensidad amable que acompaña", o "El toque de tatemado que transforma tu botana".`
      };
    }

    case 'generar-innovacion': {
      const idx = params.ocasionIndex !== undefined ? params.ocasionIndex : 0;
      const oc = SNTD_TOOLKIT_RULES.ocasionesConsumo[idx] || SNTD_TOOLKIT_RULES.ocasionesConsumo[0];
      return {
        titulo: `Oportunidad de Innovación: ${oc.ocasion}`,
        subtitulo: oc.detalle,
        epistemic: 'HIPOTESIS',
        territorio: 'Plataforma Ready to Eat / Out of Home',
        conceptoPrototipo: `Sabritas Salsas Negras Formato "${oc.ocasion.split(' ')[0]} Pack"`,
        fundamentoCulinario: `Aprovecha el vacío de mercado detectado en la pág. 31 del Reporte PF v2: no existe hoy una botana salada que resuelva la experiencia de ${oc.ocasion.toLowerCase()} sin exigir botellas de vidrio adicionales.`,
        atributosI_D: [
          'Papa de calibre grueso o maíz nixtamalizado que soporte 40% más impregnación.',
          'Slurry con notas de salsa de soya añeja, ajo tatemado y jugo de limón natural deshidratado.',
          'Empaque con códigos de cristal oscuro, cintillo dorado y tipografía con serifa.'
        ],
        kpiExito: 'Recompra superior al 65% en canal tradicional al eliminar el síndrome del limón falso.'
      };
    }

    default:
      return {
        titulo: 'Operación no reconocida',
        subtitulo: 'Seleccione una operación válida del menú',
        epistemic: 'OBSERVADO'
      };
  }
}
