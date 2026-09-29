// src/playbook/sntd/data/sntdDataset.js
// DATASET INTEGRAL Y EXHAUSTIVO PARA EL PLAYBOOK S.N.T.D. (SALSAS NEGRAS MÉXICO)
// Incorpora la totalidad del TOOLKIT (54 págs), Reporte PF v2 (43 págs) y Transcripciones de Focus Groups (CDMX, GDL, MTY).

export const SNTD_PROJECT_META = {
  id: 'sntd-diagnostic',
  titulo: 'Insight Playbook: Salsas Negras México (S.N.T.D.)',
  cliente: 'Sabritas / PepsiCo México',
  vertical: 'Botanas Saladas & Salsas Tradicionales',
  badge: 'ESTUDIO TERRITORIAL COMPLETO',
  icono: '🌮',
  color: '#C25E00',
  fecha: '2026-03',
  confidencialidad: 'Estrictamente Confidencial · Sabritas',
  descripcion: 'Decodificación integral del universo de las Salsas Negras en México. Cobertura completa de los 7 Gateways, rituales in-home y out-of-home, ocasiones de consumo (mariscos, carne asada, chela), semiótica de envases (botella de alquimista, vidrio, cuello largo, tapa amarilla), léxico habilitado vs prohibido, plazas (CDMX, GDL, MTY) y matriz de portafolio Sabritas.',
  isDefault: true
};

export const SNTD_GATEWAYS_DEF = [
  {
    id: 'G1',
    numero: 1,
    name: 'Identidad del Territorio',
    preguntaClave: '¿Se reconoce inmediata y culturalmente como Salsa Negra?',
    tipo: 'Territorial / Semiótico',
    reglaDura: 'Si el territorio no se entiende en segundos sin mediación → REPROBADO.',
    siEs: 'Declaración explícita ("Salsa Negra"), conexión automática con Maggi / Inglesa / Soya / Limón, activación del imaginario culinario cotidiano.',
    noEs: 'Conceptos abstractos, nombres de fantasía ("Dark", "Misterio", "Noche", Halloween) que exigen adivinar o explicar el sabor.',
    atributosObligatorios: [
      'Declaración explícita del territorio ["Salsa Negra"]',
      'Asociación automática con Maggi / Inglesa / Soya / Limón',
      'Activación de imaginario culinario cotidiano [no experimental]',
      'Coherencia entre nombre, sabor y visual [no contradicción]',
      'Ausencia de ambigüedad conceptual: no requiere explicación'
    ]
  },
  {
    id: 'G2',
    numero: 2,
    name: 'Arquitectura del Sabor [En Capas]',
    preguntaClave: '¿El sabor se construye, evoluciona y permanece en boca?',
    tipo: 'Sensorial / Culinario',
    reglaDura: 'Un sabor que "se va armando" y se queda sin invadir ni adormecer la boca.',
    siEs: 'Evolución gradual: 1° entrada salada/sabrosa, 2° corte ácido que refresca, 3° corazón umami de soya/especias, 4° picor tardío suave.',
    noEs: 'Golpe único y plano, sabor monótono de salmuera o caldo concentrado, desvanecimiento instantáneo o invasión de chile que anestesia.',
    atributosObligatorios: [
      'Base salina–sabrosa clara desde el primer bocado',
      'Progresión perceptible [no plano], claridad de capas',
      'Corte ácido que evita saturación',
      'Picor tardío, bajo y no dominante',
      'Notas "oscuras" / especiadas / ahumadas identificables'
    ]
  },
  {
    id: 'G3',
    numero: 3,
    name: 'Naturalidad & Manejo del Ácido [Limón]',
    preguntaClave: '¿El ácido refresca o estropea la experiencia?',
    tipo: 'Sensorial Crítico',
    isCritical: true,
    reglaDura: 'Frescura perceptible y natural, no química, que limpia el paladar e invita a seguir comiendo.',
    siEs: 'Limón creíble en gotas, ácido que corta la grasa y limpia la boca, compatible con la salivación natural sin raspar.',
    noEs: 'El "Síndrome del Limón Falso": ácido cítrico industrial astringente que huele a pastilla química de baño y raspa la garganta.',
    atributosObligatorios: [
      'Ácido creíble [limón natural o extracto bien integrado]',
      'Acidez subordinada al conjunto, no protagonista chillona',
      'Compatibilidad con saliva [no corta, no raspa]',
      'Tolerancia al consumo repetido [sin fatiga gustativa]',
      'Frescura que levanta las notas oscuras del umami'
    ]
  },
  {
    id: 'G4',
    numero: 4,
    name: 'Integración con la Botana [Vehículo]',
    preguntaClave: '¿La salsa "ES" la botana o solo la cubre superficialmente?',
    tipo: 'Funcional / Reológico',
    reglaDura: 'La botana está visiblemente impregnada y hay uniformidad absoluta entre piezas.',
    siEs: 'Sazón integrado que penetra la masa o lámina, sensación de textura líquida impregnada que no se desprende al tacto.',
    noEs: 'Polvo seco suelto que se cae al sacudir, piezas blancas sin sazón junto a piezas sobrecargadas, dedos teñidos de polvo anaranjado.',
    atributosObligatorios: [
      'Sazón integrado, no superficial ni volátil',
      'Textura en boca que simula salsa líquida o remojo',
      'Resistencia al manejo [no se desmorona en polvo]',
      'Continuidad sensorial: cada pieza sabe exactamente igual',
      'Capacidad del soporte (papa/maíz) de aguantar el sazón sin ablandarse'
    ]
  },
  {
    id: 'G5',
    numero: 5,
    name: 'Intensidad Amable & Balance',
    preguntaClave: '¿Invita a seguir comiendo o satura y expulsa?',
    tipo: 'Sensorial / Retención',
    reglaDura: 'Permite consumo prolongado sin generar ardor, fatiga salina ni necesidad urgente de agua.',
    siEs: 'Engancha por sabrosura, control y placer culinario. Pungencia dosificada que permite terminar la bolsa completa.',
    noEs: 'Desafío de aguante corporal tipo reto viral, ardor residual punitivo, boca escaldada o sed excesiva por sal saturada.',
    atributosObligatorios: [
      'Intensidad sabrosa, no agresiva ni retadora',
      'No genera ardor residual en labios ni lengua',
      'No provoca sed excesiva ni resequedad',
      'No obliga a pausas forzadas entre bocados',
      'Activa antojo continuo [craving amable]'
    ]
  },
  {
    id: 'G6',
    numero: 6,
    name: 'Rol Funcional [Sustitución del Ritual]',
    preguntaClave: '¿Cumple el rol del preparado cuando no hay botellas ni limones?',
    tipo: 'Ritual / Conveniencia',
    reglaDura: 'Tiene un sabor completo y cerrado que evoca la preparación casera o de cantina lista para comer.',
    siEs: 'Democratiza el ritual: resuelve el antojo de botana preparada en la calle, el transporte o la oficina sin logística.',
    noEs: 'Sensación de "preparado incompleto" donde el usuario siente que forzosamente tiene que llegar a casa a agregarle limón y salsa.',
    atributosObligatorios: [
      'No requiere mezcla adicional de salsas caseras',
      'Genera la ilusión perfecta del preparado artesanal',
      'Portabilidad real sin derrames ni desastre',
      'Confianza y gratificación total en cada bocado',
      'Consistencia de sabor en cualquier ocasión de consumo'
    ]
  },
  {
    id: 'G7',
    numero: 7,
    name: 'Código Visual & Semiótico',
    preguntaClave: '¿Habla el lenguaje legítimo y apetitoso de la Salsa Negra?',
    tipo: 'Semiótico / Branding',
    reglaDura: 'Códigos de calidez, oscuridad ámbar/parda, fuego de asador/brasas y cocina tradicional.',
    siEs: 'Oscuridad cálida y apetitosa (marrones profundos, brillos especiados), tapas amarillas/doradas, gotas y chorreado denso.',
    noEs: 'Negro mate funerario, estridencia infantil, fuego llameante rojo de alerta de peligro, iconografía de monstruos o noche.',
    atributosObligatorios: [
      'Oscuridad cálida [negros, marrones profundos, ámbar]',
      'Brillo especiado apetitoso [no mate seco]',
      'Lenguaje adulto, culinario y botanero',
      'Ausencia de códigos de peligro / fuego reactivo',
      'Iconografía de sazón: gotas densas, tatemado, cazuelas'
    ]
  }
];

export const SNTD_PLAZAS = [
  {
    id: 'cdmx',
    name: 'Plaza CDMX (Metropolitana)',
    target: 'Hombres y mujeres 18-45 años · NSE C/C+ y C-/D+',
    focus: 'Barroquismo botanero, mezclas callejeras y ritual de personalización extrema',
    imagenUrl: '/images/sntd/cdmx_street.jpg',
    icono: '🏙️',
    descripcionHabitat: 'Cultura de botana preparada en calle y tienditas de esquina. Gusto por la saturación armónica: Maggi + Inglesa + Valentina + limón fresco + gomitas o cacahuates.',
    citasClave: [
      '"El limón artificial sabe horrible. Nosotros somos superdelicados con los sabores de los limones."',
      '"Salsa negra para mí es Maggi, Inglesa y limón. Es lo que le echas a las papas para que sepan a preparado."'
    ]
  },
  {
    id: 'gdl',
    name: 'Plaza Guadalajara (Occidente)',
    target: 'Hombres y mujeres 18-45 años · NSE C/C+ y C-/D+',
    focus: 'Cultura botanera de mesa, balance entre marisco, asado y botana familiar',
    imagenUrl: '/images/sntd/gdl_botanero.jpg',
    icono: '🥑',
    descripcionHabitat: 'La salsa negra se concibe como sazonador profundo. Fuerte arraigo a botellas de vidrio artesanales y salsas negras locales con base de soya y especias tatemadas.',
    citasClave: [
      '"No enchila sin previo aviso. En una salsa negra buscas que penetre en la botana, no que te duela la lengua."',
      '"En las marisquerías y botaneros ves las botellas oscuras con su tapa amarilla; sabes que ahí hay sazón concentrado."'
    ]
  },
  {
    id: 'mty',
    name: 'Plaza Monterrey (Noreste)',
    target: 'Hombres y mujeres 18-45 años · NSE C/C+ y C-/D+',
    focus: 'Ritual de carne asada, botana contundente y preferencia por sabores directos',
    imagenUrl: '/images/sntd/mty_asado.jpg',
    icono: '🥩',
    descripcionHabitat: 'La salsa negra acompaña el ritual social de reunión. Se busca una intensidad limpia, ácida y umami que corte la grasa y realce el crunch de la botana.',
    citasClave: [
      '"En la carne asada o viendo el fútbol la botana tiene que aguantar el limón y la salsa sin hacerse aguada."',
      '"El fuego de la salsa negra no es lumbre de chile que quema, es el tatemado del comal o la leña."'
    ]
  }
];

export const SNTD_BRANDS = [
  {
    id: 'receta-crujiente',
    name: 'Sabritas Receta Crujiente Salsas Negras',
    rol: 'Referente de Autenticidad',
    cumplimiento: 88,
    status: 'OPTIMO',
    pros: 'Sabor logrado, oscuridad visible, sensación de salsa líquida impregnada en la papa.',
    contras: 'Distribución intermitente en canal tradicional.',
    veredicto: 'El estándar de oro actual del portafolio en trasladar la salsa líquida al snack.'
  },
  {
    id: 'fritos-salsas-negras',
    name: 'Fritos Salsas Negras',
    rol: 'Híbrido de Volumen',
    cumplimiento: 72,
    status: 'MODERADO',
    pros: 'Base de maíz densa que soporta la potencia umami; buena adopción en jóvenes.',
    contras: 'Percepción de sazón en polvo en algunas partidas; acidez ligeramente química.',
    veredicto: 'Funciona como botana de impulso pero requiere cuidar la naturalidad del limón.'
  },
  {
    id: 'rancheritos-salsas-negras',
    name: 'Rancheritos Salsas Negras',
    rol: 'Transgresor de Categoría',
    cumplimiento: 64,
    status: 'ALERTA',
    pros: 'Textura emblemática y lealtad de base de consumidores.',
    contras: 'El sazón compite con la base condimentada original de Rancheritos; confunde la identidad.',
    veredicto: 'Riesgo de canibalización y pérdida de la promesa de sazón puro y limpio.'
  },
  {
    id: 'ruffles-mega-crunch-negras',
    name: 'Ruffles Mega Crunch Salsas Negras',
    rol: 'Pungencia Juvenil',
    cumplimiento: 58,
    status: 'DESVIADO',
    pros: 'Gran crunch y atractivo visual en anaquel.',
    contras: 'Se recarga hacia el picor tipo Flamin Hot; traiciona la regla de "Profundidad antes que dolor".',
    veredicto: 'Trata a la salsa negra como un picante agresivo en lugar de una arquitectura en capas.'
  },
  {
    id: 'paketaxo-dark',
    name: 'Paketaxo Dark / Negritas',
    rol: 'Periférico Lúdico',
    cumplimiento: 49,
    status: 'CRITICO',
    pros: 'Volumen para fiestas y reuniones compartidas.',
    contras: 'Código de "noche/misterio" infantil en lugar de salsa negra auténtica y culinaria.',
    veredicto: 'El consumidor no lo asocia a una verdadera salsa negra botanera.'
  }
];

export const SNTD_EVIDENCES = [
  // Gateway 1: Identidad
  {
    id: 'ev-g1-1',
    gatewayId: 'G1',
    plazaId: 'cdmx',
    brandId: 'receta-crujiente',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'Asociación unánime: Maggi, Inglesa y Limón sin rodeos',
    contenido: '"Cuando te dicen salsas negras nadie se queda pensando. La asociación inmediata es Maggi, salsa inglesa, un toque de soya y limón. Es un sabor que no necesita que nadie te lo explique."',
    autor: 'Participante S2 CDMX (45 años, C/C+)',
    fuente: 'Sesión 2 CDMX Transcripción [Audio 26112025] / Toolkit pág. 15',
    tags: ['G1 Identidad', 'Maggi', 'Inglesa', 'Reconocimiento']
  },
  {
    id: 'ev-g1-2',
    gatewayId: 'G1',
    plazaId: 'mty',
    brandId: 'paketaxo-dark',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'Rechazo a nombres abstractos o conceptuales ("Dark / Misterio")',
    contenido: '"El Paketaxo Dark o las cosas moradas te hablan de noche o de misterio, pero salsa negra es una salsa de comida, de mariscos o carne. Si le ponen nombres raros, piensas que te van a dar dulce o colorante."',
    autor: 'Participante S6 MTY (24 años, C+)',
    fuente: 'Sesión 6 MTY Transcripción [Audio 01122025] / Toolkit pág. 16',
    tags: ['G1 Identidad', 'Semiótica', 'Desvío Conceptual']
  },
  {
    id: 'ev-g1-3',
    gatewayId: 'G1',
    plazaId: 'gdl',
    brandId: 'receta-crujiente',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'La trilogía canónica inquebrantable',
    contenido: '"La base de todo son tres cosas: Maggi para el fondo salado oscuro, salsa inglesa para las especias y el vinagre, y limón recién exprimido para levantar. Si falta una de esas tres, ya no es salsa negra."',
    autor: 'Participante S4 GDL (36 años, C+)',
    fuente: 'Reporte PF v2 pág. 16 / Sesión 4 GDL',
    tags: ['G1 Identidad', 'Trilogía Canónica', 'ADN Culinario']
  },

  // Gateway 2: Arquitectura en Capas
  {
    id: 'ev-g2-1',
    gatewayId: 'G2',
    plazaId: 'gdl',
    brandId: 'receta-crujiente',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'El viaje del sabor: De lo ácido-salado al remate aromático',
    contenido: '"En la salsa negra empiezas sintiendo lo acidito del limón y lo saladito de la soya. Luego cuando masticas sale el sazón tatemado y al final te queda un picor muy leve que no te duerme la boca. Es un sabor que se va abriendo."',
    autor: 'Participante S4 GDL (31 años, C+)',
    fuente: 'Sesión 4 GDL Transcripción [Audio 27112025] / Toolkit pág. 19',
    tags: ['G2 Arquitectura', 'Capas', 'Sabor en Boca', 'Progresión']
  },
  {
    id: 'ev-g2-2',
    gatewayId: 'G2',
    plazaId: 'cdmx',
    brandId: 'ruffles-mega-crunch-negras',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'Falla en capas: El golpe plano que satura de inmediato',
    contenido: '"Hay botanas que dicen salsa negra pero te metes una y es un golpe de sal y chile seco que te cansa a la tercera papa. No sientes capas ni sutileza, solo salmuera plana."',
    autor: 'Participante S2 CDMX (38 años, C-)',
    fuente: 'Sesión 2 CDMX Transcripción / Reporte PF v2 pág. 37',
    tags: ['G2 Arquitectura', 'Golpe Plano', 'Saturación']
  },
  {
    id: 'ev-g2-3',
    gatewayId: 'G2',
    plazaId: 'mty',
    brandId: 'receta-crujiente',
    tipo: 'Observación Sensorial',
    epistemic: 'OBSERVADO',
    titulo: 'Persistencia del retrogusto sin resequedad',
    contenido: 'La prueba organoléptica demostró que la combinación de glutamatos naturales de la soya fermentada junto con vinagre madurado prolonga el sabor en boca hasta 45 segundos después de deglutir, provocando salivación continua en lugar de astringencia.',
    autor: 'Panel Sensorial Provokers MTY',
    fuente: 'Reporte PF v2 pág. 8 / Toolkit pág. 20',
    tags: ['G2 Arquitectura', 'Permanencia', 'Salivación']
  },

  // Gateway 3: Naturalidad del Ácido (Crítico)
  {
    id: 'ev-g3-1',
    gatewayId: 'G3',
    plazaId: 'cdmx',
    brandId: 'receta-crujiente',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'El Síndrome del Limón Falso: La sentencia de muerte industrial',
    contenido: '"Nosotros somos superdelicados con los sabores de los limones. He comprado salsas embotelladas listas para micheladas, pero hasta ahorita no le han dado a la receta: saben a puro aromatizante o a pastilla de limón."',
    autor: 'Consumidora S2 CDMX (42 años, C+)',
    fuente: 'Sesión 2 CDMX Transcripción / Toolkit pág. 27',
    tags: ['G3 Acidez', 'Limón Falso', 'Rechazo Químico', 'Innegociable']
  },
  {
    id: 'ev-g3-2',
    gatewayId: 'G3',
    plazaId: 'gdl',
    brandId: 'fritos-salsas-negras',
    tipo: 'Observación Sensorial',
    epistemic: 'OBSERVADO',
    titulo: 'El rol del limón: Corte de grasa y apertura de papilas',
    contenido: 'En las pruebas organolépticas de Jalisco, el limón natural actúa como desengrasante que balancea la salinidad espesa de la salsa inglesa. Cuando la acidez raspa o tiene retrogusto a ácido cítrico anhidro, el consumidor suspende la ingesta.',
    autor: 'Panel Sensorial Provokers GDL',
    fuente: 'Reporte PF v2 pág. 19 / Toolkit pág. 28',
    tags: ['G3 Acidez', 'Corte Graso', 'Fisiología']
  },
  {
    id: 'ev-g3-3',
    gatewayId: 'G3',
    plazaId: 'mty',
    brandId: 'receta-crujiente',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'El limón debe sentirse en gotas frescas, no en polvo químico',
    contenido: '"El ácido tiene que sentirse como cuando exprimes la mitad de un limón con semilla sobre las papas. Si te sabe a ácido de dulce Skwinkles o a polvito de chile barato, arruina por completo la seriedad de la botana."',
    autor: 'Participante S6 MTY (39 años, C+)',
    fuente: 'Sesión 6 MTY Transcripción [Audio 01122025]',
    tags: ['G3 Acidez', 'Frescura Cítrica', 'Rechazo Artificial']
  },

  // Gateway 4: Integración / Vehículo
  {
    id: 'ev-g4-1',
    gatewayId: 'G4',
    plazaId: 'mty',
    brandId: 'rancheritos-salsas-negras',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'El fraude del polvo suelto vs. la salsa que penetra',
    contenido: '"Si compro una botana de salsa negra y me deja los dedos llenos de polvo rojo o naranja, siento que me engañaron. La salsa negra tiene que verse bañada, oscura, como si se hubiera metido dentro de la papa."',
    autor: 'Participante S6 MTY (34 años, C/D+)',
    fuente: 'Sesión 6 MTY Transcripción / Toolkit pág. 32',
    tags: ['G4 Vehículo', 'Polvo vs Líquido', 'Impregnación']
  },
  {
    id: 'ev-g4-2',
    gatewayId: 'G4',
    plazaId: 'cdmx',
    brandId: 'receta-crujiente',
    tipo: 'Observación de Campo Etnográfico',
    epistemic: 'OBSERVADO',
    titulo: 'Capacidad de soporte de la botana al remojo de salsa',
    contenido: 'En puestos callejeros y micheladas, el consumidor elige botanas de calibre grueso (papa artesanal, fritos gruesos) que resistan el baño líquido sin colapsar en masa blanda antes del consumo.',
    autor: 'Etnografía de Calle CDMX',
    fuente: 'Reporte PF v2 pág. 27 / Toolkit pág. 31',
    tags: ['G4 Vehículo', 'Resistencia', 'Calibre de Botana']
  },
  {
    id: 'ev-g4-3',
    gatewayId: 'G4',
    plazaId: 'gdl',
    brandId: 'receta-crujiente',
    tipo: 'Observación Etnográfica',
    epistemic: 'OBSERVADO',
    titulo: 'Continuidad pieza por pieza: Cero piezas pálidas',
    contenido: 'Una queja recurrente de los consumidores al abrir bolsas de botana es encontrar papas que solo recibieron el sazonador en una orilla. La promesa de la salsa negra exige un baño homogéneo 360° en cada unidad.',
    autor: 'Auditoría de Calidad Provokers GDL',
    fuente: 'Toolkit pág. 31 / Reporte PF v2 pág. 14',
    tags: ['G4 Vehículo', 'Uniformidad', 'Baño 360']
  },

  // Gateway 5: Intensidad Amable & Balance
  {
    id: 'ev-g5-1',
    gatewayId: 'G5',
    plazaId: 'gdl',
    brandId: 'receta-crujiente',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'Sazón de permanencia: Comerse la bolsa entera sin sufrir',
    contenido: '"No enchila sin previo aviso. En una salsa negra buscas sabrosura, no que te arda la lengua ni te dé reflujo. Con esta te puedes terminar la bolsa grande platicando con amigos."',
    autor: 'Participante S4 GDL (28 años, C+)',
    fuente: 'Sesión 4 GDL Transcripción / Toolkit pág. 24',
    tags: ['G5 Intensidad', 'No Dolor', 'Consumo Continuo']
  },
  {
    id: 'ev-g5-2',
    gatewayId: 'G5',
    plazaId: 'mty',
    brandId: 'ruffles-mega-crunch-negras',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'Fatiga gustativa por exceso de capsicina y sal',
    contenido: '"Cuando las papas tienen demasiado chile o sal concentrada te escaldan el paladar. Tienes que parar a tomar refresco o cerveza cada dos bocados. Eso no es salsa negra, eso es botana brava."',
    autor: 'Participante S6 MTY (40 años, C)',
    fuente: 'Sesión 6 MTY Transcripción / Toolkit pág. 23',
    tags: ['G5 Intensidad', 'Fatiga Gustativa', 'Boca Escaldada']
  },
  {
    id: 'ev-g5-3',
    gatewayId: 'G5',
    plazaId: 'cdmx',
    brandId: 'receta-crujiente',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'Placer despreocupado sin culpa ni arrepentimiento estomacal',
    contenido: '"Con las botanas rojas ultra picantes sabes que al rato te va a doler la panza o vas a tener acidez. Con la salsa negra no tienes esa culpa; es botanear con gusto porque es puro sazón sabroso."',
    autor: 'Participante S2 CDMX (27 años, C/C+)',
    fuente: 'Reporte PF v2 pág. 20 / Sesión 2 CDMX',
    tags: ['G5 Intensidad', 'Placer Despreocupado', 'Sin Culpa']
  },

  // Gateway 6: Rol Funcional (Sustitución del Ritual)
  {
    id: 'ev-g6-1',
    gatewayId: 'G6',
    plazaId: 'cdmx',
    brandId: 'receta-crujiente',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'Llevar la alquimia de cantina a la calle y la oficina',
    contenido: '"En mi casa yo tengo mis botellas de Maggi, Salsa Inglesa Crosse & Blackwell y limones en el refri. Pero en la oficina o en el carro no puedo hacer todo ese relajo; ahí es donde la botana ya preparada me salva la vida."',
    autor: 'Participante S2 CDMX (33 años, C+)',
    fuente: 'Sesión 2 CDMX Transcripción / Toolkit pág. 39',
    tags: ['G6 Ritual', 'Conveniencia', 'Democratización']
  },
  {
    id: 'ev-g6-2',
    gatewayId: 'G6',
    plazaId: 'mty',
    brandId: 'fritos-salsas-negras',
    tipo: 'Observación Etnográfica',
    epistemic: 'OBSERVADO',
    titulo: 'La sensación de "producto terminado" sin necesidad de mezclas',
    contenido: 'La prueba de fuego del rol funcional ocurre cuando el consumidor no siente la urgencia psicológica de buscar un limón para exprimirle a la bolsa abierta. Si la botana logra ese cierre, se convierte en compra recurrente de impulso.',
    autor: 'Observación de Campo Tiendita Tradicional',
    fuente: 'Reporte PF v2 pág. 42 / Toolkit pág. 40',
    tags: ['G6 Ritual', 'Sabor Cerrado', 'Impulso']
  },
  {
    id: 'ev-g6-3',
    gatewayId: 'G6',
    plazaId: 'cdmx',
    brandId: 'receta-crujiente',
    tipo: 'Cita Textual Focus Group',
    epistemic: 'OBSERVADO',
    titulo: 'El ritual del preparado eleva la botana simple a botana de verdad',
    contenido: '"Una papa sola es aburrida, pero le echas salsa negra y ya es botana de verdad, ya se siente como cuando estás en el bar o viendo el partido. Transforma por completo el momento."',
    autor: 'Participante S2 CDMX (31 años, C)',
    fuente: 'Reporte PF v2 pág. 17 / Toolkit pág. 12',
    tags: ['G6 Ritual', 'Elevación de Estatus', 'Antojo']
  },

  // Gateway 7: Código Visual & Semiótico
  {
    id: 'ev-g7-1',
    gatewayId: 'G7',
    plazaId: 'gdl',
    brandId: 'receta-crujiente',
    tipo: 'Semiótica Visual',
    epistemic: 'OBSERVADO',
    titulo: 'El faro cromático: Tapa amarilla / dorada y vidrio oscuro',
    contenido: 'En anaquel y restaurantes botaneros, las tapas amarillas o doradas sobre botellas pardas de vidrio son el código universal de la salsa concentrada legítima. Descartar este código cromático genera confusión inmediata.',
    autor: 'Auditoría Semiótica de Retail Provokers',
    fuente: 'Toolkit pág. 46 / Reporte PF v2 pág. 24',
    tags: ['G7 Visual', 'Tapa Amarilla', 'Vidrio Oscuro', 'Faro']
  },
  {
    id: 'ev-g7-2',
    gatewayId: 'G7',
    plazaId: 'cdmx',
    brandId: 'paketaxo-dark',
    tipo: 'Semiótica Visual',
    epistemic: 'OBSERVADO',
    titulo: 'Oscuridad apetitosa vs. Oscuridad funeraria o gótica',
    contenido: 'Los empaques negros mates con flamas moradas o tipografías puntiagudas remiten a veneno, químicos o golosinas ácidas de niños. La salsa negra exige códigos culinarios: maderas, brasas, ollas de barro y salsa líquida brillosa en la foto.',
    autor: 'Análisis Semiótico de Empaque',
    fuente: 'Toolkit pág. 36 / Reporte PF v2 pág. 21',
    tags: ['G7 Visual', 'Oscuridad Amable', 'Apetito', 'Semiótica']
  },
  {
    id: 'ev-g7-3',
    gatewayId: 'G7',
    plazaId: 'mty',
    brandId: 'receta-crujiente',
    tipo: 'Semiótica de Envase',
    epistemic: 'OBSERVADO',
    titulo: 'Frasco de cuello largo y tipografías densas: Potencia dosificada',
    contenido: 'El consumidor asocia la botella de cuello largo con la maestría de un bartender o alquimista. No es una salsa para bañar en cubeta, es una salsa para dosificar gota a gota. Las tipografías con serifas comunican receta antigua y madura.',
    autor: 'Análisis Semiótico Provokers MTY',
    fuente: 'Reporte PF v2 pág. 22 y 25 / Toolkit pág. 45',
    tags: ['G7 Visual', 'Cuello Largo', 'Tipografía Culinaria', 'Alquimia']
  }
];

export const SNTD_INSIGHTS = [
  // 1. Manifiesto Ontológico y Fuego Alquimia
  {
    id: 'ins-ontologico-1',
    codigo: 'INS-SNTD-01',
    gatewayId: 'G5',
    nivelEpistemologico: 'DERIVADO',
    epistemic: 'DERIVADO',
    badge: 'MANIFIESTO ONTOLÓGICO',
    titulo: 'Profundidad antes que Dolor: La salsa negra sazona, no castiga',
    subtitulo: 'Diferenciación cultural frente a la plataforma Flaming Hot',
    descripcion: 'A diferencia de la plataforma Flaming Hot donde el fuego es un desafío físico para adolescentes, en Salsas Negras el fuego representa la cocina tradicional: comales, asado a la leña y reposo. Es un código adulto de permanencia gustativa.',
    extracto: 'Mientras que en Flaming Hot el fuego es una advertencia física de desafío corporal para adolescentes ("a ver cuánto aguantas"), en Salsas Negras el fuego es una invitación a la cocina y al comal: tatemado de chiles, ahumado a la leña y reposo de barrica. Es un código adulto, de permanencia y sazón.',
    evidenciaIds: ['ev-g5-1', 'ev-g5-2', 'ev-g5-3'],
    tension: 'Pungencia Punitiva (Reto de Resistencia) vs. Sazón de Permanencia: El consumidor busca sabrosura prolongada para botanear platicando, no anestesia de lengua que obligue a suspender el consumo.',
    mecanismo: 'Despliegue térmico y umami por capas: el tatemado y la salsa de soya activan receptores gustativos profundos sin disparar la nocicepción dolorosa de la capsaicina extrema, permitiendo una ingesta continua.',
    disparadores: ['Reunión social informal', 'Acompañamiento de cerveza o carne asada', 'Búsqueda de botana con sabor adulto y no infantil'],
    condiciones: ['Pungencia moderada que no supere el umbral del ardor residual', 'Presencia de notas tatemadas o ahumadas perceptibles'],
    actores: ['Adulto Botanero (18-45)', 'Comensal de Cantina / Marisquería', 'Anfitrión de Carne Asada'],
    contexto: 'Tardeada de amigos, marisquería, partidos de fútbol y botana de sobremesa',
    necesidad: 'Sentir gratificación gastronómica intensa y placentera sin sufrir dolor estomacal ni fatiga en el paladar.',
    respuestaActual: 'Buscar botanas sazonadas con jugo Maggi y limón en cantina o preparar mezclas caseras suaves en un plato hondo.',
    condicionAceptacion: 'Poder comerse la bolsa completa manteniendo la conversación sin requerir pausas forzadas ni agua urgente.',
    riesgo: 'Si Sabritas convierte la salsa negra en otra variante de picante extremo, ahuyenta al target adulto y canibaliza la plataforma roja.',
    implicaciones: 'Prohibido usar códigos de calaveras, fuego llameante rojo o desafíos corporales; el storytelling debe enfocarse en brasas, comal, tatemado y sazón.',
    oportunidades: 'Posicionar la plataforma como "El Sabor Adulto de Sabritas" para ocasiones de maridaje con cerveza y reuniones sociales.',
    marcasRelacionadas: ['Sabritas Receta Crujiente', 'Ruffles Mega Crunch'],
    fuenteReporte: 'Toolkit pág. 12 / Reporte PF v2 pág. 18',
    capas: {
      observado: 'Los consumidores en las 3 plazas coinciden: "La salsa negra sazona, la roja pica. Buscamos sabrosura que te permita platicar y seguir comiendo la bolsa entera".',
      derivado: 'La plataforma no gradúa pungencia reactiva, gradúa intención y complejidad culinaria. No se busca dolor, se busca discernir capas de sabor.',
      implicacion: 'Prohibido usar códigos de "fuego extremo", calaveras o advertencias en los empaques de Salsa Negra de Sabritas; el branding debe hablar de sazón profundo y brasas.'
    },
    gatewaysAfectados: ['G5 Intensidad Amable', 'G2 Arquitectura de Sabor', 'G1 Identidad']
  },

  // 2. Gateway 1: Identidad
  {
    id: 'ins-g1',
    codigo: 'INS-SNTD-02',
    gatewayId: 'G1',
    nivelEpistemologico: 'DERIVADO',
    epistemic: 'DERIVADO',
    badge: 'GATEWAY 1 · IDENTIDAD',
    titulo: 'Nombrar el territorio sin rodeos: El consumidor no compra misterio',
    subtitulo: 'La trampa de los nombres conceptuales ("Dark / Incógnita")',
    descripcion: 'El territorio de las Salsas Negras es un código cultural hiperconsolidado que se decodifica en milisegundos. Cuando una marca recurre a nombres de fantasía o misterio, diluye la expectativa culinaria.',
    extracto: 'El territorio de las Salsas Negras es un código cultural hiper-consolidado en el paladar mexicano que se reconoce en milisegundos. Cuando una marca intenta disfrazarlo bajo conceptos de fantasía, noche o misterio, el consumidor se desorienta y lo percibe como una golosina artificial.',
    evidenciaIds: ['ev-g1-1', 'ev-g1-2', 'ev-g1-3'],
    tension: 'Ancla Culinaria Explícita vs. Fantasía Conceptual: El consumidor exige saber qué sazón esperar; la ambigüedad conceptual despierta sospechas de ingredientes sintéticos o dulces.',
    mecanismo: 'Activación de heurísticas de despensa: la denominación "Salsas Negras" evoca automáticamente la tríada canónica (Maggi + Inglesa + Limón) predisponiendo positivamente las papilas gustativas.',
    disparadores: ['Lectura rápida del empaque en anaquel o tiendita', 'Decisión de compra en 3 segundos'],
    condiciones: ['Texto "Salsas Negras" visible en el front del empaque', 'Ausencia de palabras de fantasía abstracta como Dark o Night'],
    actores: ['Comprador de Tiendita', 'Consumidor de Impulso', 'Shopper de Supermercado'],
    contexto: 'Anaquel saturado de botanas saladas y tienditas tradicionales de esquina',
    necesidad: 'Certeza inmediata del perfil organoléptico antes de gastar en la compra de impulso.',
    respuestaActual: 'Comprar marcas que declaren explícitamente el ingrediente o comprar papas clásicas y prepararlas uno mismo.',
    condicionAceptacion: 'Que el nombre coincida 1:1 con la experiencia real al abrir el empaque.',
    riesgo: 'Rechazo de compra por sospecha de producto dulce o golosina artificial si se usa estética tipo Halloween.',
    implicaciones: 'Sabritas debe estandarizar la denominación explícita "Salsas Negras" en el front y descartar submarcas crípticas.',
    oportunidades: 'Registrar la denominación de origen culinario y adueñarse del territorio formal frente a la competencia de botana a granel.',
    marcasRelacionadas: ['Sabritas Receta Crujiente', 'Paketaxo Dark'],
    fuenteReporte: 'Toolkit págs. 14–16 / Sesión 2 CDMX',
    capas: {
      observado: 'En las 3 plazas, al mencionar "Salsas Negras" la respuesta automática es Maggi, Inglesa y Limón. En cambio, frente a Paketaxo Dark los consumidores no supieron qué sabor esperar.',
      derivado: 'La memoria culinaria mexicana opera por anclas de sazón reconocible. Si el nombre no declara "Salsa Negra", el cerebro no activa las expectativas de acidez umami y tatemado.',
      implicacion: 'Sabritas debe estandarizar la denominación explícita "Salsas Negras" en el front de empaque y erradicar términos periféricos que diluyan la propuesta.'
    },
    gatewaysAfectados: ['G1 Identidad del Territorio', 'G7 Código Visual']
  },

  // 3. Gateway 2: Arquitectura en Capas
  {
    id: 'ins-g2',
    codigo: 'INS-SNTD-03',
    gatewayId: 'G2',
    nivelEpistemologico: 'DERIVADO',
    epistemic: 'DERIVADO',
    badge: 'GATEWAY 2 · ARQUITECTURA',
    titulo: 'La Alquimia del Sabor en Capas: Entrada, Corte, Umami y Cierre',
    subtitulo: 'La anatomía de una experiencia sensorial que evoluciona',
    descripcion: 'Una salsa negra auténtica no es un impacto salino plano; es una secuencia dinámica en 4 tiempos: salitre de entrada, corte cítrico, corazón umami y eco picante tardío.',
    extracto: 'Una verdadera salsa negra no es un condimento estático. Su excelencia radica en una coreografía en boca de cuatro tiempos: 1) entrada salina familiar, 2) corte cítrico que refresca y saliva, 3) cuerpo umami de salsa de soya y especias tatemadas, y 4) un remate picante aromático muy sutil.',
    evidenciaIds: ['ev-g2-1', 'ev-g2-2'],
    tension: 'Impacto Monolítico de Salmuera vs. Coreografía Secuencial: El condimento plano agota las papilas al tercer bocado; la arquitectura en capas renueva el apetito en cada pieza.',
    mecanismo: 'Disolución salivar escalonada: la acidez estimula la salivación inmediata, la grasa transporta los compuestos umami y el chile estimula el retrogusto en la fase de deglución.',
    disparadores: ['Primer contacto con la lengua', 'Masticación y rotura crujiente del snack', 'Retrogusto posterior a la deglución'],
    condiciones: ['Tecnología de liberación controlada de saborizantes', 'Balance calibrado entre sodio, ácido cítrico y glutamato natural'],
    actores: ['Consumidor Gourmet de Snacks', 'Panel Sensorial de I+D Sabritas', 'Chef Botanero'],
    contexto: 'Consumo pausado y degustación pieza por pieza',
    necesidad: 'Experimentar una vivencia gastronómica compleja dentro de un formato accesible de botana de bolsa.',
    respuestaActual: 'Añadir salsas artesanales por separado controlando la proporción con cuchara o gotero.',
    condicionAceptacion: 'Poder distinguir con claridad el toque de limón fresco, el cuerpo de soya y el retrogusto ahumado.',
    riesgo: 'Percepción de botana barata o genérica si solo sabe a caldo de pollo concentrado o salmuera.',
    implicaciones: 'I+D debe calibrar la formulación para evitar que el sodio cubra las notas aromáticas de la salsa inglesa y los chiles tatemados.',
    oportunidades: 'Desarrollar la línea "Reserva Salsas Negras" con perfiles de tatemado artesanal en barrica.',
    marcasRelacionadas: ['Sabritas Receta Crujiente', 'Rancheritos Salsas Negras'],
    fuenteReporte: 'Toolkit págs. 18–21 / Reporte PF v2 pág. 19',
    capas: {
      observado: 'Los consumidores en Guadalajara y CDMX describen que la salsa negra "se va abriendo" al masticar y permite distinguir los ingredientes.',
      derivado: 'El placer de la salsa negra es intelectual y sensorial a la vez: permite el discernimiento de notas profundas en contraste con la botana plana.',
      implicacion: 'En formulación de I+D, se debe calibrar la liberación controlada de sazonadores: la sal y el limón al contacto inmediato, la soya y el ahumado en la masticación, el chile en el retrogusto.'
    },
    gatewaysAfectados: ['G2 Arquitectura de Sabor', 'G5 Intensidad y Balance']
  },

  // 4. Gateway 3: Limón Falso (Crítico)
  {
    id: 'ins-g3',
    codigo: 'INS-SNTD-04',
    gatewayId: 'G3',
    nivelEpistemologico: 'DERIVADO',
    epistemic: 'DERIVADO',
    badge: 'GATEWAY 3 · ACIDEZ (CRÍTICO)',
    titulo: 'El Síndrome del Limón Falso: La barrera letal de adopción',
    subtitulo: 'Hipersensibilidad cultural ante los ácidos cítricos de síntesis química',
    descripcion: 'El consumidor mexicano posee una tolerancia cero ante el limón artificial en salsas oscuras. El ácido sintético astringente que raspa la garganta destruye la recompra inmediatamente.',
    extracto: 'El paladar mexicano tolera la industrialización en muchos componentes, pero el limón es innegociable. Cualquier nota que remita a ácido cítrico artificial, limpiador o pastilla efervescente activa un rechazo visceral inmediato que destruye la recompra.',
    evidenciaIds: ['ev-g3-1', 'ev-g3-2'],
    tension: 'Eficiencia de Vida de Anaquel vs. Credibilidad Cítrica: El ácido cítrico anhidro abarata costos pero genera rechazo inmediato; el extracto de limón real asegura recompra.',
    mecanismo: 'Alerta biológica ante solventes: los aromas terpénicos artificiales activan asociaciones con productos de limpieza doméstica o pastillas de tocador, bloqueando la deglución.',
    disparadores: ['Olor al abrir la bolsa', 'Sensación de resequedad o raspado en campanilla y paladar'],
    condiciones: ['Uso de jugo deshidratado o aceites esenciales de limón mexicano (Citrus aurantifolia)'],
    actores: ['Consumidor Mexicano Hipersensible al Limón', 'Ingeniero de Saborizantes', 'Panel de Control de Calidad'],
    contexto: 'Prueba de producto y primera mordida al abrir la bolsa recién comprada',
    necesidad: 'Sentir el frescor estimulante y jugoso de un limón con semilla recién exprimido sobre la botana.',
    respuestaActual: 'Llevar limones frescos en la bolsa o mochila para exprimirle a las papas industriales.',
    condicionAceptacion: 'Acidez que produzca salivación suave sin picar la garganta ni dejar regusto a caramelo químico.',
    riesgo: 'Colapso fulminante de ventas y cancelación del lanzamiento tras la primera oleada de prueba.',
    implicaciones: 'Gateway 3 es condición de corte binaria: si la muestra sensorial sabe a limón químico, el prototipo es vetado.',
    oportunidades: 'Certificar en empaque "Con extracto de Limón Mexicano Real" como garantía de calidad frente a genéricos.',
    marcasRelacionadas: ['Sabritas Receta Crujiente', 'Fritos Salsas Negras'],
    fuenteReporte: 'Toolkit págs. 26–28 / Sesión 6 MTY',
    capas: {
      observado: 'Cita transversal: "Sabe a pastilla de baño. Somos superdelicados con el limón". Las salsas embotelladas fallan históricamente por esta causa.',
      derivado: 'El limón en la salsa negra tiene una misión fisiológica: provocar salivación y cortar la densidad salina de la soya. Cuando el ácido es sintético, no saliva: raspa y anestesia.',
      implicacion: 'Gateway 3 es el filtro crítico del protocolo BPMN. Si la muestra no supera la prueba de acidez natural creíble, la formulación no avanza a producción.'
    },
    gatewaysAfectados: ['G3 Naturalidad del Ácido', 'G5 Intensidad']
  },

  // 5. Gateway 4: Integración Vehículo
  {
    id: 'ins-g4',
    codigo: 'INS-SNTD-05',
    gatewayId: 'G4',
    nivelEpistemologico: 'DERIVADO',
    epistemic: 'DERIVADO',
    badge: 'GATEWAY 4 · VEHÍCULO',
    titulo: 'La Textura Líquida Impregnada vs. La Fricción del Polvo Seco',
    subtitulo: 'La botana como soporte reológico de la salsa real',
    descripcion: 'El consumidor exige que la salsa negra parezca vertida en remojo y fijada en la papa. El polvo suelto que se desprende y mancha los dedos delata un proceso cosmético falso.',
    extracto: 'El mayor desafío de trasladar una salsa líquida a una botana embolsada es la reología. Si el sazonador queda como un polvo suelto volátil que se sacude en la bolsa y ensucia los dedos de naranja, la ilusión del preparado se rompe.',
    evidenciaIds: ['ev-g4-1', 'ev-g4-2', 'ev-g4-3'],
    tension: 'Sazón Volátil en Polvo vs. Película Líquida Impregnada: El polvo ensucia y se cae al fondo de la bolsa; la impregnación 360° emula el baño de salsa de cantina.',
    mecanismo: 'Efecto de adherencia lipídica y cocción: el sazón aplicado en slurry líquido penetra los poros de la lámina de papa generando brillo y homogeneidad visual.',
    disparadores: ['Inspección visual de la papa al sacarla de la bolsa', 'Tacto en los dedos tras comer varias piezas'],
    condiciones: ['Calibre grueso de botana (papa corte rústico o maíz denso) que no se ablande con el sazón'],
    actores: ['Botaneador de Fiesta', 'Operador de Línea de Producción Sabritas'],
    contexto: 'Consumo frente a la televisión, computadora o mientras se maneja',
    necesidad: 'Tener la gratificación de una botana preparada sin ensuciarse los dedos de polvo naranja volátil.',
    respuestaActual: 'Comer con palillos o servilletas en mano para no mancharse al consumir botanas tradicionales.',
    condicionAceptacion: 'Piezas uniformemente oscuras donde cada bocado conserve el mismo nivel de sazón.',
    riesgo: 'Quejas por inconsistencia si el fondo de la bolsa concentra todo el sabor y las papas superiores vienen desabridas.',
    implicaciones: 'Implementar aplicación mediante slurry o aspersión continua de sazón líquido fijado térmicamente.',
    oportunidades: 'Lanzar empaques con el claim "Sazón Bañado 360°: Cada papa con salsa real".',
    marcasRelacionadas: ['Sabritas Receta Crujiente', 'Fritos Salsas Negras'],
    fuenteReporte: 'Toolkit págs. 30–33 / Reporte PF v2 pág. 27',
    capas: {
      observado: 'Los consumidores alaban la Sabritas Receta Crujiente porque "se ve bañada y oscura", mientras que rechazan botanas con polvo suelto.',
      derivado: 'En el imaginario colectivo, la salsa negra se vierte en chorro denso. El consumidor busca ver gotas, oscurecimiento de la papa y uniformidad pieza por pieza.',
      implicacion: 'Tecnología de aplicación: slurry o aspersión líquida que se fije a la botana creando una película brillante en lugar de tumbleo en seco.'
    },
    gatewaysAfectados: ['G4 Integración con la Botana', 'G7 Código Visual']
  },

  // 6. Gateway 5: Intensidad Amable
  {
    id: 'ins-g5',
    codigo: 'INS-SNTD-06',
    gatewayId: 'G5',
    nivelEpistemologico: 'DERIVADO',
    epistemic: 'DERIVADO',
    badge: 'GATEWAY 5 · INTENSIDAD',
    titulo: 'Craving Continuo vs. Boca Escaldada',
    subtitulo: 'La ciencia del balance entre sal, acidez y astringencia',
    descripcion: 'El exceso de sodio y sales ácidas genera fatiga gustativa y sed extrema. El valor de la salsa negra radica en su capacidad de retención placentera bocado tras bocado.',
    extracto: 'El error más común en botanas saborizadas es recargar la dosis de sodio para compensar la falta de complejidad aromática. En salsas negras, la sal excesiva satura las papilas rápidamente y obliga a parar el consumo tras unos cuantos bocados.',
    evidenciaIds: ['ev-g5-1', 'ev-g5-2'],
    tension: 'Impacto Rápido de Sal vs. Consumo Prolongado Convivial: La sal alta satura y expulsa; el umami equilibrado engancha e invita a compartir.',
    mecanismo: 'Desensibilización de papilas salinas: niveles de sodio superiores a la curva óptima desencadenan reflejos de sed y sensación de aspereza en encías y lengua.',
    disparadores: ['Llegar a la mitad de la bolsa', 'Acompañamiento con bebidas carbonatadas o alcohólicas'],
    condiciones: ['Calibración precisa del umami mediante fermentados naturales de soya en vez de sal refinada pura'],
    actores: ['Consumidor Habitual de Botana Salada', 'Desarrollador Sensorial'],
    contexto: 'Sobremesa de fin de semana, reunión con amigos y maratón de series',
    necesidad: 'Satisfacer el antojo botaneando durante horas sin terminar con reflujo ni boca adolorida.',
    respuestaActual: 'Tomar pausas obligadas y beber agua o refresco para neutralizar la salinidad de las papas.',
    condicionAceptacion: 'Terminarse la porción individual y conservar una sensación fresca y agradable en boca.',
    riesgo: 'Abandono de la bolsa a medio consumir y baja frecuencia de recompra semanal.',
    implicaciones: 'Sustituir sal libre por bases umami ricas en aminoácidos que eleven la percepción de sazón sin disparar el sodio.',
    oportunidades: 'Desarrollar certificaciones de "Sazón Balanceado: Cero boca escaldada".',
    marcasRelacionadas: ['Sabritas Receta Crujiente', 'Ruffles Mega Crunch'],
    fuenteReporte: 'Toolkit págs. 23–25 / Sesión 4 GDL',
    capas: {
      observado: 'En Monterrey y GDL: "Lo único malo de algunas papas preparadas es cuando te queda la boca escaldada de sal. Quieres tomar agua y ya no las disfrutas".',
      derivado: 'El enganche de la salsa negra proviene del balance umami de la soya y las notas tatemadas, no del golpe salino puro.',
      implicacion: 'Monitorear curvas de sodio en pruebas de producto: el umami debe potenciar el sabor percibido manteniendo el sodio en rangos moderados.'
    },
    gatewaysAfectados: ['G5 Intensidad Amable', 'G2 Arquitectura de Sabor']
  },

  // 7. Gateway 6: Ritual y Espacio Vacante
  {
    id: 'ins-g6',
    codigo: 'INS-SNTD-07',
    gatewayId: 'G6',
    nivelEpistemologico: 'HIPOTESIS',
    epistemic: 'HIPOTESIS',
    badge: 'GATEWAY 6 · RITUAL (OPORTUNIDAD)',
    titulo: 'Democratización del Botanero: El antojo de cantina listo para llevar',
    subtitulo: 'Captura del momento de consumo fuera del hogar (Out of Home)',
    descripcion: 'En casa el consumidor controla sus botellas y limones; en la calle o la oficina no tiene acceso a sus insumos. El snack listo para comer resuelve el antojo de cantina de forma inmediata.',
    extracto: 'En el hogar, el consumidor disfruta el ritual de preparar sus papas con botellas y limones. Pero fuera de casa (calle, oficina, cine, coche), no tiene acceso a sus insumos. El snack de Salsa Negra debe operar como la solución autocontenida que resuelve el antojo sin complicaciones logísticas.',
    evidenciaIds: ['ev-g6-1', 'ev-g6-2', 'ev-g6-3'],
    tension: 'Orgullo de Mezclar en Casa vs. Gratificación Inmediata en Tránsito: En el hogar se disfruta la personalización; en la calle se busca un producto terminado al 100%.',
    mecanismo: 'Transferencia de valor por conveniencia: el consumidor ahorra el costo y tiempo de tener 3 botellas distintas y limones a cambio de una bolsa perfectamente calibrada.',
    disparadores: ['Antojo en jornada laboral de oficina', 'Viaje en carretera o transporte urbano', 'Pausa botanera de media tarde'],
    condiciones: ['Fórmula sensorial cerrada que no incite al consumidor a agregar salsa casera adicional'],
    actores: ['Oficinista', 'Estudiante Universitario', 'Conductor'],
    contexto: 'Escritorio de oficina, automóvil, transporte público y parques',
    necesidad: 'Comer botana preparada de nivel cantina en cualquier lugar sin ensuciar trastes ni transportar envases.',
    respuestaActual: 'Comprar botana preparada en puestos callejeros en bolsas de plástico improvisadas con derrames.',
    condicionAceptacion: 'Que al primer bocado se sienta la presencia del limón y la salsa sin extrañar el ritual manual.',
    riesgo: 'Si el sabor se percibe incompleto, el consumidor solo comprará papas naturales para prepararlas en casa.',
    implicaciones: 'Toda comunicación debe enfatizar la perfección del sazón listo para comer: "Destapa y disfruta la botana de cantina".',
    oportunidades: 'Crear formatos On-the-Go con empaques tipo vaso o bowl vertical para consumo en coche u oficina.',
    marcasRelacionadas: ['Sabritas Receta Crujiente', 'Paketaxo Dark'],
    fuenteReporte: 'Toolkit págs. 39–41 / Reporte PF v2 pág. 42',
    capas: {
      observado: 'En grupos focales: "En mi casa compro Sabritas naturales porque yo las preparo; en la calle compro las de Salsa Negra porque ya vienen listas".',
      derivado: 'La propuesta de valor no compite contra la alacena, sino contra la incomodidad de no poder preparar en la calle.',
      implicacion: 'Comunicar activamente el concepto "Sabor Preparado Listo para Llevar", reforzando que no le hace falta absolutamente nada para disfrutarse.'
    },
    gatewaysAfectados: ['G6 Rol Funcional', 'G4 Integración']
  },

  // 8. Gateway 7: Semiótica Visual del Faro
  {
    id: 'ins-g7',
    codigo: 'INS-SNTD-08',
    gatewayId: 'G7',
    nivelEpistemologico: 'DERIVADO',
    epistemic: 'DERIVADO',
    badge: 'GATEWAY 7 · CÓDIGO VISUAL',
    titulo: 'El Faro Amarillo y la Botella de Alquimista',
    subtitulo: 'La semiótica del contraste cromático y el cristal artesanal',
    descripcion: 'El código visual legítimo de las salsas negras se basa en el contraste amarillo-dorado sobre fondo oscuro y la silueta del frasco dosificador de cuello largo que comunica maestría.',
    extracto: 'El código visual legítimo de las salsas negras en México se compone de dos anclas inamovibles: el contraste amarillo + negro (heredado de Maggi) y la iconografía del cristal oscuro dosificador con cuello largo. Empaques que se desvían hacia estridencias pierden legitimidad.',
    evidenciaIds: ['ev-g7-1', 'ev-g7-2', 'ev-g7-3'],
    tension: 'Oscuridad Apetitosa Gastronómica vs. Oscuridad Fúnebre / Gótica: El cristal pardo y la tapa dorada comunican cocina; el negro mate con morado comunica veneno o golosina infantil.',
    mecanismo: 'Reconocimiento semiótico de autoridad: el color amarillo activa señales de acidez y vitalidad, equilibrando la seriedad y densidad del negro gastronómico.',
    disparadores: ['Visualización del empaque en exhibidor de tiendita', 'Búsqueda visual de botellas en mesas botaneras'],
    condiciones: ['Presencia de elementos amarillos luminosos en contraste con tonos café oscuro y negro carbón'],
    actores: ['Shopper Visual', 'Diseñador de Empaque Sabritas', 'Cantinero'],
    contexto: 'Mesa de cantina, marisquería tradicional y anaquel de botanas',
    necesidad: 'Identificar al instante que la botana proviene del mundo culinario tradicional y no de una golosina artificial.',
    respuestaActual: 'Buscar la botella con tapa amarilla en la mesa para verificar que sea salsa de calidad.',
    condicionAceptacion: 'Empaque con fotografías de botana bañada, gotas densas y códigos dorados/amarillos legibles.',
    riesgo: 'Asociación con productos góticos o de Halloween si el empaque carece del contraste amarillo luminoso.',
    implicaciones: 'Incorporar la iconografía del frasco de alquimista y la tapa amarilla como activos distintivos de marca.',
    oportunidades: 'Diseñar ediciones especiales en bolsas con acabados mate y barniz a registro que simulen el brillo de la salsa líquida.',
    marcasRelacionadas: ['Sabritas Receta Crujiente', 'Paketaxo Dark'],
    fuenteReporte: 'Toolkit págs. 44–47 / Reporte PF v2 pág. 24',
    capas: {
      observado: 'Los consumidores identifican las tapas amarillas y doradas como sinónimo de salsa concentrada y receta tradicional.',
      derivado: 'El amarillo opera como el "faro" que ilumina la oscuridad del producto, prometiendo acidez y vitalidad.',
      implicacion: 'Todo empaque de la plataforma debe incorporar franjas, sellos o detalles amarillo-dorados y fotografía macro de botana bañada.'
    },
    gatewaysAfectados: ['G7 Código Visual', 'G1 Identidad']
  },

  // 9. Arquetipos de Marca (El Mago Popular)
  {
    id: 'ins-arquetipos',
    codigo: 'INS-SNTD-09',
    gatewayId: 'G1',
    nivelEpistemologico: 'HIPOTESIS',
    epistemic: 'HIPOTESIS',
    badge: 'ARQUETIPOS DE MARCA',
    titulo: 'El Mago Popular: La personalidad de la plataforma Salsa Negra',
    subtitulo: 'Alquimia compartida que transforma lo cotidiano en algo especial',
    descripcion: 'A diferencia de las botanas rebeldes o infantiles, Salsa Negra encarna al "Mago Popular": el alquimista cercano que conoce los secretos del sazón y democratiza el placer de cantina para todos.',
    extracto: 'A diferencia de las marcas rebeldes o bufonescas de botanas, el arquetipo rector de Salsa Negra es "El Mago Popular" (Alquimista cercano): un personaje o tono de voz que domina los secretos del sazón, convierte una simple papa en un manjar botanero, pero no intimida; comparte el secreto y democratiza el placer.',
    evidenciaIds: ['ev-g1-1', 'ev-g6-1'],
    tension: 'Misticismo Inaccesible vs. Maestría Compartida: La marca no presume recetas inalcanzables; empodera al consumidor como cómplice conocedor del buen sazón.',
    mecanismo: 'Elevación de estatus cotidiano: saber preparar y disfrutar una botana con salsas negras otorga autoridad social entre amigos y familiares.',
    disparadores: ['Reunión donde alguien prepara la botana al centro de la mesa', 'Conversación sobre lugares botaneros favoritos'],
    condiciones: ['Tono de comunicación cercano, maduro, ingenioso y respetuoso de la tradición gastronómica'],
    actores: ['El Maestro Botanero del Grupo', 'Voz de Marca Sabritas', 'Consumidor Aficionado'],
    contexto: 'Campañas de comunicación, redes sociales y activaciones en puntos de consumo',
    necesidad: 'Sentir validación en su gusto por el sazón bien hecho y sentirse parte de una comunidad conocedora.',
    respuestaActual: 'Presumir recetas familiares de mezclas de salsas ante amigos en carnes asadas.',
    condicionAceptacion: 'Un tono publicitario que hable de tú a tú sin recurrir a clichés juveniles estridentes.',
    riesgo: 'Parecer una botana pretenciosa o elitista si se aleja del arraigo popular de la tiendita y la cantina.',
    implicaciones: 'Construir el territorio de comunicación alrededor de "Los Secretos del Sazón Botanero" con un guiño de complicidad.',
    oportunidades: 'Crear contenidos digitales tipo "El Manual del Alquimista Botanero" enseñando maridajes con comida real.',
    marcasRelacionadas: ['Sabritas Receta Crujiente'],
    fuenteReporte: 'Reporte PF v2 págs. 38–41 / Toolkit pág. 50',
    capas: {
      observado: 'En el reporte se destaca: "El placer no es solo comer, es preparar, ajustar y sentirse dueño del sabor".',
      derivado: 'El consumidor se siente un pequeño alquimista cuando mezcla salsas; la marca debe validar esa maestría cotidiana.',
      implicacion: 'Tono de comunicación: cómplice experto, adulto, conocedor de botaneros y cantinas, con respeto por la receta auténtica.'
    },
    gatewaysAfectados: ['G1 Identidad', 'G6 Rol Funcional']
  }
];

export const SNTD_TENSIONS = [
  {
    id: 'ten-1',
    gatewayId: 'G5',
    poloA: 'SALSA ROJA (Flaming Hot / Desafío)',
    poloB: 'SALSA NEGRA (Maggi / Sazón Adulto)',
    tension: 'Pungencia de Castigo vs. Sazón de Permanencia',
    descripcion: 'La salsa roja busca la resistencia física individual mediante una pungencia que anestesia; la salsa negra busca el disfrute culinario continuo que acompaña y prolonga el momento social.',
    aprendizaje: 'En Salsas Negras el picor jamás debe liderar el perfil; debe ser el remate que corona el sazón umami.'
  },
  {
    id: 'ten-2',
    gatewayId: 'G3',
    poloA: 'LIMÓN QUÍMICO (Ácido Cítrico Anhidro)',
    poloB: 'LIMÓN NATURAL (Jugo Fresco & Aceites de Cáscara)',
    tension: 'Eficiencia Industrial vs. Intolerancia Cultural',
    descripcion: 'La industria tiende a usar sales ácidas sintéticas por costo y vida de anaquel; el paladar mexicano detecta el limón falso al instante y lo rechaza con vehemencia.',
    aprendizaje: 'Invertir en tecnologías de deshidratación de limón real; el costo de un limón químico es el fracaso de la recompra.'
  },
  {
    id: 'ten-3',
    gatewayId: 'G4',
    poloA: 'POLVO SUELTO (Condimentación Volátil en Seco)',
    poloB: 'SALSA IMPREGNADA (Sensación de Baño Líquido)',
    tension: 'Manejo en Línea vs. Verosimilitud del Ritual',
    descripcion: 'Espolvorear saborizante seco abarata el proceso pero ensucia los dedos y se desprende; bañar la botana emula el ritual callejero pero exige ingeniería de fijación.',
    aprendizaje: 'La botana debe presentar aspecto oscuro, brillante y uniforme que prometa salsa metida en el bocado.'
  },
  {
    id: 'ten-4',
    gatewayId: 'G6',
    poloA: 'RITUAL CASERO (Control Personalizado In-Home)',
    poloB: 'SNACK INDUSTRIAL (Conveniencia Out-of-Home)',
    tension: 'Orgullo de Alquimista vs. Gratificación Inmediata',
    descripcion: 'En casa el consumidor disfruta mancharse los dedos y dosificar con su tacita medidora; en la calle, el snack debe estar tan perfecto que no requiera corrección alguna.',
    aprendizaje: 'El snack debe tener un balance perfectamente cerrado: sal, ácido, umami y picor resueltos al 100% en cada bocado.'
  },
  {
    id: 'ten-5',
    gatewayId: 'G7',
    poloA: 'CÓDIGO GÓTICO / NOCTURNO ("Dark / Halloween")',
    poloB: 'CÓDIGO GASTRONÓMICO ("Comal / Tatemado / Brasas")',
    tension: 'Fantasía Sintética Juvenil vs. Arraigo Culinario Adulto',
    descripcion: 'Los códigos oscuros tipo videojuego o Halloween comunican golosina barata; los códigos de asador y cazuela comunican sazón serio y botanero.',
    aprendizaje: 'El storytelling visual debe hablar de fuego culinario, barrica, comal y salsa espesa, jamás de monstruos o noche.'
  },
  {
    id: 'ten-6',
    gatewayId: 'G1',
    poloA: 'SABOR AUTÉNTICO DE RECETA CANÓNICA',
    poloB: 'SABOR CERCANO PERIFÉRICO / HÍBRIDOS',
    tension: 'Identidad Pura vs. Híbridos Confusos',
    descripcion: 'Propuestas que intentan mezclar salsa negra con otros condimentos preexistentes de la botana (ej. chile de árbol o queso) generan disonancia cognitiva.',
    aprendizaje: 'La salsa negra requiere un soporte limpio (papa o maíz neutro) para que su arquitectura de capas brille sin interferencias.'
  },
  {
    id: 'ten-7',
    gatewayId: 'G2',
    poloA: 'GOLPE MONOLÍTICO DE SALMUERA',
    poloB: 'DESPLIEGUE SECUENCIAL EN CAPAS',
    tension: 'Monotonía Gustativa vs. Complejidad Dinámica',
    descripcion: 'Un sabor plano cansa al tercer bocado y provoca saturación salina; un sabor en capas invita a seguir explorando la bolsa pieza por pieza.',
    aprendizaje: 'La formulación debe garantizar que el ácido limpie el umami entre mordidas para evitar el agotamiento de las papilas.'
  },
  {
    id: 'ten-8',
    gatewayId: 'G6',
    poloA: 'BOTANA INDIVIDUAL DE IMPULSO',
    poloB: 'RITUAL SOCIAL DE REUNIÓN (Carne Asada / Marisco / Chela)',
    tension: 'Consumo Solitario vs. Centro de Mesa Convivial',
    descripcion: 'La salsa negra tiene una vocación comunitaria intrínseca: es el catalizador de la carnita asada, los mariscos del fin de semana y la tarde de micheladas con amigos.',
    aprendizaje: 'Desarrollar empaques familiares y formatos botaneros de mayor gramaje diseñados para compartir al centro de la mesa.'
  }
];

export const SNTD_TOOLKIT_RULES = {
  siEs: [
    'Sabor en capas progresivas: entrada ácida/salada, corazón umami de soya/especias, retrogusto aromático picante.',
    'Sazón integrado en la botana, simulando textura de salsa líquida impregnada.',
    'Uso de limón con perfil fresco y natural indiscutible.',
    'Oscuridad parda, brillante y apetitosa (código gastronómico de asado/tatemado).',
    'Presencia de tapas amarillas/doradas y referencias a botellas dosificadoras de vidrio.',
    'Declaración explícita del nombre "Salsa Negra" sin metáforas abstractas.',
    'Consumo prolongado sin ardor ni boca escaldada.',
    'Vocación de maridaje con cerveza, carne asada, mariscos y tardes de amigos.'
  ],
  noEs: [
    'Picor punitivo o reto de lumbre tipo Flamin Hot que duerme la lengua.',
    'Polvo naranja o rojo seco que se desprende de la botana y ensucia sin aportar sabor.',
    'Ácido cítrico artificial astringente ("sabor pastilla química de limón").',
    'Conceptos oscuros basados en Halloween, noche o misterio gamer.',
    'Fórmulas planas que solo saben a salmuera o caldo de cubo concentrado.',
    'Empaques con colores estridentes infantiles o códigos de peligro llameante.',
    'Sensación de botana incompleta que obligue al usuario a buscar ingredientes para corregirla.'
  ],
  lexicoHabilitado: [
    'Sazón', 'Intenso', 'Oscuro Amable', 'Especiado', 'Sabroso', 'Potente',
    'Preparado', 'Se mete', 'Se queda', 'Antojo', 'Ritual', 'Brasas', 'Tatemado'
  ],
  lexicoProhibido: [
    'Infierno', 'Extremo', 'Mortal', 'Brutal', 'Solo para valientes', 'Aguanta',
    'Te va a arder', 'Explota', 'Fuego puro', 'Peligro', 'Veneno', 'Misterio'
  ],
  ocasionesConsumo: [
    { ocasion: 'Carne Asada & Carnes en General', detalle: 'Marinado, levantar chuletas y acompañamiento de cortes con hueso al carbón.' },
    { ocasion: 'Marisquería & Botanero', detalle: 'Aguachile con salsa negra, camarones preparados y cocteles de marisco.' },
    { ocasion: 'Bebidas Preparadas', detalle: 'Micheladas, cubanas y cerveza con salsas negras y escarchado de sal/chile.' },
    { ocasion: 'Tarde de Películas / Series', detalle: 'Snack de antojo personal donde la botana se convierte en un plato culinario.' },
    { ocasion: 'Reunión Botanera Casual', detalle: 'Papas, cacahuates y pepinos al centro de la mesa bañados con salsa.' }
  ]
};
