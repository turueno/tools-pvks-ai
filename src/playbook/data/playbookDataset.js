// src/playbook/data/playbookDataset.js
// Base de conocimiento estructurada a partir del reporte etnográfico:
// "Inmersiones en Hogares: Categorías Nido y Baby Food" (CDMX, NSE C Típico, 29 Páginas)

export { HOMES, EPISTEMIC_LEVELS, BRANDS, LAYERS, VISUAL_PHASES } from './schema.js';

export const EVIDENCES = [
  {
    id: 'ev-01',
    codigo: 'EV-NIDO-01',
    titulo: 'Vaso entrenador y platos adaptados para la niña',
    tipo: 'Objeto / Comportamiento',
    nivel: 'OBSERVADO',
    hogar: 'hogar-1',
    fuente: 'Pág. 3 (Inmersión Nido)',
    marca: 'Nido',
    cita: 'Los utensilios acompañan una autonomía creciente. Vasos, platos y formas de comer empiezan a parecerse más a los del resto de la familia.',
    descripcion: 'La niña de un año utiliza vasos entrenadores de plástico con boquilla y platos infantiles propios, pero su uso empieza a mimetizar los hábitos de la mesa de los adultos.',
    contexto: 'Comedor / Cocina',
    actores: ['Bebé', 'Mamá Belén'],
    imagenUrl: '/images/lullaby/img-01-vaso-entrenador.jpg',
    imagenAlt: 'Vaso entrenador y platos adaptados para niña de 1 año',
    pieEtnografico: 'Pág. 3: La niña utiliza vasos con boquilla y platos propios, pero mimetiza los gestos de los adultos en la mesa.',
    artefactoClave: 'Vaso entrenador infantil con boquilla'
  },
  {
    id: 'ev-02',
    codigo: 'EV-NIDO-02',
    titulo: 'Separación de porción antes de condimentar',
    tipo: 'Comportamiento en Cocina',
    nivel: 'OBSERVADO',
    hogar: 'hogar-1',
    fuente: 'Pág. 4 (Etapa de Vida)',
    marca: 'Nido',
    cita: 'Belén cocina para la familia y aparta la porción de su hija antes de condimentar. Arroz, verduras, pollo, tortilla, quesadillas.',
    descripcion: 'La madre ya no elabora platillos exclusivos de bebé; cocina el menú del hogar y simplemente retira la porción infantil antes de poner sal, picante o condimentos fuertes.',
    contexto: 'Cocina familiar',
    actores: ['Mamá Belén', 'Bebé'],
    imagenUrl: '/images/lullaby/img-02-cazuela-familiar.jpg',
    imagenAlt: 'Separación de porción de guisado en la cazuela antes de condimentar',
    pieEtnografico: 'Pág. 4: Belén cocina para toda la familia y aparta la comida de su hija antes de poner sal, picante o condimentos.',
    artefactoClave: 'Cazuela de cocina familiar'
  },
  {
    id: 'ev-03',
    codigo: 'EV-NIDO-03',
    titulo: 'Flexibilización dominical con abuelos',
    tipo: 'Interacción Social',
    nivel: 'OBSERVADO',
    hogar: 'hogar-1',
    fuente: 'Pág. 4 (Etapa de Vida)',
    marca: 'Nido',
    cita: 'Entre semana mamá regula ingredientes y preparaciones; los domingos, los abuelos flexibilizan las reglas y el bebé participa más de lo que come la familia.',
    descripcion: 'La red de parentesco introduce permisividad y normaliza que la niña comparta guisados y comidas completas del grupo familiar.',
    contexto: 'Reunión familiar de fin de semana',
    actores: ['Abuelos', 'Familia Extensa', 'Mamá Belén', 'Bebé'],
    imagenUrl: '/images/lullaby/img-03-comida-abuelos.jpg',
    imagenAlt: 'Comida dominical con abuelos y familia extensa',
    pieEtnografico: 'Pág. 4: Los domingos, la red de apoyo flexibiliza las reglas y la niña come lo que comparte la mesa extensa.',
    artefactoClave: 'Mesa dominical familiar'
  },
  {
    id: 'ev-04',
    codigo: 'EV-NIDO-04',
    titulo: 'Presencia de Nido en la alacena junto a condimentos',
    tipo: 'Espacio / Despensa',
    nivel: 'OBSERVADO',
    hogar: 'hogar-1',
    fuente: 'Pág. 5 (Fotografía de Alacena)',
    marca: 'Nido',
    cita: 'Mamá decide, pero lo hace dentro de una red que define qué se siente adecuado para cada etapa.',
    descripcion: 'Lata de Nido Kinder (tapa roja) almacenada en la repisa de la cocina junto a Media Crema, café, galletas y abarrotes generales del hogar.',
    contexto: 'Alacena de cocina',
    actores: ['Mamá Belén', 'Pareja'],
    imagenUrl: '/images/lullaby/img-04-nido-alacena.jpg',
    imagenAlt: 'Lata de Nido Kinder conviviendo con Media Crema y café en la alacena',
    pieEtnografico: 'Pág. 5: En la alacena real, la fórmula especializada convive directamente con los abarrotes adultos del hogar.',
    artefactoClave: 'Lata Nido Kinder (Tapa Roja)'
  },
  {
    id: 'ev-05',
    codigo: 'EV-NIDO-05',
    titulo: 'Ruta mental declarada de transición láctea',
    tipo: 'Cita Textual',
    nivel: 'OBSERVADO',
    hogar: 'hogar-1',
    fuente: 'Pág. 6 (Transición de Categoría)',
    marca: 'Nido',
    cita: '“Mi idea era terminarle de dar fórmula y seguir con Nido y ya después pues leche de aquí de la casa.”',
    descripcion: 'Belén tenía internalizado un trayecto secuencial: Lactancia → NAN/Fórmula → Nido → Leche entera de vaca.',
    contexto: 'Entrevista en sala',
    actores: ['Mamá Belén'],
    imagenUrl: '/images/lullaby/img-05-transicion-lactea.jpg',
    imagenAlt: 'Biberón y secuencia mental de transición de leche',
    pieEtnografico: 'Pág. 6: Belén narra la secuencia ideal que tenía en mente: Fórmula → Nido → Leche entera.',
    artefactoClave: 'Secuencia de transición láctea'
  },
  {
    id: 'ev-06',
    codigo: 'EV-NIDO-06',
    titulo: 'Comprobación de tolerancia a la leche entera (Bypass)',
    tipo: 'Cita Textual / Prueba',
    nivel: 'OBSERVADO',
    hogar: 'hogar-1',
    fuente: 'Pág. 7 (Entrada a Nido)',
    marca: 'Nido',
    cita: 'Mamá cuenta que le preocupaba que la leche entera volviera a soltarle el estómago, pero después de un mes “todo bien”.',
    descripcion: 'Tras probar directamente la leche entera pasteurizada que toma la familia y constatar que no causó diarrea ni malestar, Nido dejó de percibirse como un paso forzoso.',
    contexto: 'Consumo cotidiano',
    actores: ['Mamá Belén', 'Bebé', 'Pediatra'],
    imagenUrl: '/images/lullaby/img-06-leche-entera-bypass.jpg',
    imagenAlt: 'Cartón de leche entera pasteurizada del hogar',
    pieEtnografico: 'Pág. 7: Tras un mes sin que le soltara el estómago, la leche familiar demostró que Nido ya no era forzosa.',
    artefactoClave: 'Envase de leche entera pasteurizada'
  },
  {
    id: 'ev-07',
    codigo: 'EV-NIDO-07',
    titulo: 'Permanencia del Cereal Infantil Gerber en hogar Nido',
    tipo: 'Objeto / Foto',
    nivel: 'OBSERVADO',
    hogar: 'hogar-1',
    fuente: 'Pág. 8 (Permanencia de la Categoría)',
    marca: 'Gerber',
    cita: 'El cereal infantil por ejemplo, conserva perspectivas de permanencia porque su utilidad no depende únicamente de que la niña “sea bebé”: todavía hace más fácil alimentarla.',
    descripcion: 'Lata de Gerber Cereal Trigo Integral y Miel (12m+) sostenida por mamá en cocina, conviviendo con la lata de Nido.',
    contexto: 'Cocina',
    actores: ['Mamá Belén'],
    imagenUrl: '/images/lullaby/img-07-gerber-cereal-nido.jpg',
    imagenAlt: 'Lata de Gerber Cereal Trigo Integral (12m+) en cocina de Belén',
    pieEtnografico: 'Pág. 8: El cereal infantil sobrevive al año de edad porque resuelve la fatiga de alimentar rápidamente.',
    artefactoClave: 'Lata Gerber Cereal Trigo Integral 12m+'
  },
  {
    id: 'ev-08',
    codigo: 'EV-NESTUM-01',
    titulo: 'Búsqueda activa y triangulación con pediatra',
    tipo: 'Cita Textual / Proceso',
    nivel: 'OBSERVADO',
    hogar: 'hogar-2',
    fuente: 'Pág. 11 (Cadena de Decisión)',
    marca: 'Nestum',
    cita: '“Nunca he tomado como una decisión a base de lo que veo; más bien esas decisiones las llevo como a mi pediatra.”',
    descripcion: 'La mamá de Liam utiliza el contenido de redes sociales únicamente para alimentar su batería de preguntas, no para tomar decisiones autónomas directas.',
    contexto: 'Consulta médica y hogar',
    actores: ['Mamá de Liam', 'Pediatra', 'Redes'],
    imagenUrl: '/images/lullaby/img-08-pediatra-consulta.jpg',
    imagenAlt: 'Mamá de Liam consultando dudas con el pediatra',
    pieEtnografico: 'Pág. 11: Las decisiones no se toman por lo visto en redes; se llevan en lista a la consulta del pediatra.',
    artefactoClave: 'Agenda de consulta pediátrica'
  },
  {
    id: 'ev-09',
    codigo: 'EV-NESTUM-02',
    titulo: 'Uso de TikTok como agenda de preguntas (@lactancia.serena)',
    tipo: 'Evidencia Digital / Captura',
    nivel: 'OBSERVADO',
    hogar: 'hogar-2',
    fuente: 'Pág. 12 (Autoridad Digital)',
    marca: 'Nestum',
    cita: 'El algoritmo funciona como una agenda de temas: lactancia, fórmulas, leches de crecimiento, alimentación y desarrollo.',
    descripcion: 'Mamá muestra su feed de TikTok con perfiles de consultoras de lactancia y pediatras sobre destete, posturas de acople y alimentación complementaria.',
    contexto: 'Pantalla de smartphone',
    actores: ['Mamá de Liam', 'Creadores de contenido'],
    imagenUrl: '/images/lullaby/img-09-tiktok-smartphone.jpg',
    imagenAlt: 'Smartphone mostrando feed de TikTok sobre destete y alimentación',
    pieEtnografico: 'Pág. 12: El algoritmo de TikTok funciona como un disparador continuo de temas, inquietudes y recetas.',
    artefactoClave: 'Pantalla de smartphone con TikTok'
  },
  {
    id: 'ev-10',
    codigo: 'EV-NESTUM-03',
    titulo: 'Sello Danone Natural "Sin Azúcar Añadida" como filtro',
    tipo: 'Objeto / Fotografía',
    nivel: 'OBSERVADO',
    hogar: 'hogar-2',
    fuente: 'Pág. 13 (Señales de Confianza)',
    marca: 'Danone / Nestum',
    cita: 'Su historia con productos infantiles muy dulces hace que el azúcar tenga un peso especial: si esa primera condición falla, el resto de los beneficios pierde relevancia.',
    descripcion: 'Envase de Danone Natural sin azúcar añadida en mano de mamá en el automóvil. Funciona como filtro heurístico primordial.',
    contexto: 'Vehículo / Compra',
    actores: ['Mamá de Liam'],
    imagenUrl: '/images/lullaby/img-10-danone-auto.jpg',
    imagenAlt: 'Envase Danone Natural sin azúcar añadida en mano de mamá en el auto',
    pieEtnografico: 'Pág. 13: El sello \'Sin azúcar añadida\' opera como el filtro heurístico primario de tranquilidad maternal.',
    artefactoClave: 'Sello \'Sin Azúcar Añadida\''
  },
  {
    id: 'ev-11',
    codigo: 'EV-NESTUM-04',
    titulo: 'Tensión por regreso al trabajo y avena procesada',
    tipo: 'Cita Textual / Rutina',
    nivel: 'OBSERVADO',
    hogar: 'hogar-2',
    fuente: 'Pág. 14 y 16 (Camino a Nestum)',
    marca: 'Nestum',
    cita: '“Algo que me ayude, pero que también lo nutra... Buscaba un alimento que, si bien no supliera al 100% una avena natural, tuviera algunos nutrientes parecidos a algo natural.”',
    descripcion: 'Al retomar trabajo remoto, la madre ya no puede usar la licuadora/procesador para moler y cocinar avena desde cero en cada toma; recurre a Nestum Avena.',
    contexto: 'Cocina / Estación de trabajo en casa',
    actores: ['Mamá de Liam', 'Bebé Liam'],
    imagenUrl: '/images/lullaby/img-11-avena-vs-nestum.jpg',
    imagenAlt: 'Estación de trabajo en casa vs. preparación de avena',
    pieEtnografico: 'Pág. 14 y 16: La falta de tiempo al volver al empleo remoto quiebra el ritual de moler avena natural en licuadora.',
    artefactoClave: 'Licuadora vs. Cereal procesado'
  },
  {
    id: 'ev-12',
    codigo: 'EV-NESTUM-05',
    titulo: 'Prueba sensorial previa de mamá en cuchara',
    tipo: 'Comportamiento en Cocina',
    nivel: 'OBSERVADO',
    hogar: 'hogar-2',
    fuente: 'Pág. 15 (Comprobación Doméstica)',
    marca: 'Nestum',
    cita: 'La explicación del pediatra despierta confianza, pero mamá lleva esa comprobación un paso más allá: prueba personalmente algunos productos y compara el sabor actual con el que recuerda.',
    descripcion: 'Mamá prueba la papilla o cereal antes de dárselo a Liam para corroborar que no sea empalagosa como los productos infantiles de generaciones previas.',
    contexto: 'Cocina',
    actores: ['Mamá de Liam', 'Bebé Liam'],
    imagenUrl: '/images/lullaby/img-12-prueba-cuchara.jpg',
    imagenAlt: 'Mamá probando con su propia cuchara el cereal antes de dárselo a Liam',
    pieEtnografico: 'Pág. 15: Comprobación doméstica directa: la mamá prueba la papilla para asegurar que no sea empalagosa.',
    artefactoClave: 'Cuchara de prueba maternal'
  },
  {
    id: 'ev-13',
    codigo: 'EV-NESTUM-06',
    titulo: 'Dosificación de 2 a 3 cucharadas de Nestum con agua',
    tipo: 'Comportamiento / Foto',
    nivel: 'OBSERVADO',
    hogar: 'hogar-2',
    fuente: 'Pág. 17 (Producto en Uso)',
    marca: 'Nestum',
    cita: 'Mamá evita servir una porción que visualmente parezca difícil de terminar. Prepara con agua para buscar consistencia ligera que deje espacio para fruta.',
    descripcion: 'Lata de Nestum Avena y Nestum Arroz en barra de cocina; prepara 2-3 cucharadas con agua tibia y mezcla en plato de silicona rosa.',
    contexto: 'Barra de cocina',
    actores: ['Mamá de Liam', 'Papá de Liam', 'Bebé Liam'],
    imagenUrl: '/images/lullaby/img-13-nestum-barra-silicona.jpg',
    imagenAlt: 'Lata de Nestum Avena y plato de silicona rosa en barra de cocina',
    pieEtnografico: 'Pág. 17: Preparación ligera con agua tibia: una porción controlada que no abrume al bebé y deje espacio para fruta.',
    artefactoClave: 'Lata Nestum Avena y plato de silicona'
  },
  {
    id: 'ev-14',
    codigo: 'EV-GERBER-01',
    titulo: 'Doble jornada: casa rigurosa vs. salidas de feria',
    tipo: 'Circunstancia Familiar',
    nivel: 'OBSERVADO',
    hogar: 'hogar-3',
    fuente: 'Pág. 19 (Inmersión Gerber)',
    marca: 'Gerber',
    cita: 'Hay días en los que sale desde temprano y permanece fuera hasta la noche, en lugares donde no necesariamente puede cocinar, calentar o comprar algo adecuado para el bebé.',
    descripcion: 'La familia comercializa en ferias ambulantes/itinerantes en CDMX. La madre pasa de un entorno doméstico hiperhigiénico a un contexto precario de calle sin tomas de agua ni estufa.',
    contexto: 'Traslado y puesto de feria',
    actores: ['Mamá de Ferias', 'Familia', 'Bebé'],
    imagenUrl: '/images/lullaby/img-14-puesto-feria.jpg',
    imagenAlt: 'Puesto de feria ambulante y jornada de 14 horas en la calle',
    pieEtnografico: 'Pág. 19: Días enteros fuera del hogar en puestos de venta sin estufa, sin refrigerador y sin agua purificada.',
    artefactoClave: 'Entorno de feria ambulante CDMX'
  },
  {
    id: 'ev-15',
    codigo: 'EV-GERBER-02',
    titulo: 'Dilema de improvisación forzada',
    tipo: 'Cita Textual',
    nivel: 'OBSERVADO',
    hogar: 'hogar-3',
    fuente: 'Pág. 20 (Tensión del Hogar)',
    marca: 'Gerber',
    cita: '“A veces me toca improvisar… me tuve que salir muy temprano y no logré preparar nada.”',
    descripcion: 'La madre sufre el choque entre su estándar ideal de pureza casera y la urgencia operativa de alimentar a su hijo en el puesto de venta.',
    contexto: 'Hogar / Salida intempestiva',
    actores: ['Mamá de Ferias'],
    imagenUrl: '/images/lullaby/img-15-improvisacion-calle.jpg',
    imagenAlt: 'Bolsa con provisiones rápidas para salir intempestivamente',
    pieEtnografico: 'Pág. 20: El choque entre el estándar ideal de pureza casera y la urgencia operativa de alimentar en el puesto.',
    artefactoClave: 'Bolsa de salida imprevista'
  },
  {
    id: 'ev-16',
    codigo: 'EV-GERBER-03',
    titulo: 'Maletín portátil "Kit Gerber"',
    tipo: 'Objeto / Fotografía',
    nivel: 'OBSERVADO',
    hogar: 'hogar-3',
    fuente: 'Pág. 21 (Kit Gerber)',
    marca: 'Gerber',
    cita: '“Aquí tengo mi kit de Gerber.” La alacena muestra que mamá no depende de un solo producto: mantiene distintas opciones porque cada una responde a un momento diferente.',
    descripcion: 'Caja organizadora plástica transparente con manija donde transporta frascos de papillas, cereales en bote, galletas para dentición, puffs y cubiertos limpios.',
    contexto: 'Alacena / Bolso de traslado',
    actores: ['Mamá de Ferias'],
    imagenUrl: '/images/lullaby/img-16-kit-gerber-maletin.jpg',
    imagenAlt: 'Caja organizadora plástica transparente \'Kit Gerber\' con papillas y puffs',
    pieEtnografico: 'Pág. 21: El maletín de supervivencia: frascos de vidrio, galletas dentición, cereales y cucharas limpias.',
    artefactoClave: 'Maletín plástico organizador Kit Gerber'
  },
  {
    id: 'ev-17',
    codigo: 'EV-GERBER-04',
    titulo: 'Negociación psicológica contra la culpa materna',
    tipo: 'Cita Textual',
    nivel: 'OBSERVADO',
    hogar: 'hogar-3',
    fuente: 'Pág. 22 (Aceptar Ayuda)',
    marca: 'Gerber',
    cita: '“Llegó un punto en el que dije: a ver, ya también me estoy torturando demasiado. Necesito yo tener un descanso, un alivio… y sé que no lo estoy haciendo mal.”',
    descripcion: 'La madre legitima el uso de alimentos procesados infantiles como una herramienta de autocuidado mental que no degrada su amor maternal.',
    contexto: 'Reflexión en cocina',
    actores: ['Mamá de Ferias'],
    imagenUrl: '/images/lullaby/img-17-alivio-emocional.jpg',
    imagenAlt: 'Reflexión de mamá en cocina sobre no torturarse por usar papillas',
    pieEtnografico: 'Pág. 22: \'Necesito un descanso, un alivio... y sé que no lo estoy haciendo mal\'. Autocuidado maternal legítimo.',
    artefactoClave: 'Frascos de papilla como salvavidas de culpa'
  },
  {
    id: 'ev-18',
    codigo: 'EV-GERBER-05',
    titulo: 'El bebé como árbitro de compra y recompra',
    tipo: 'Cita Textual',
    nivel: 'OBSERVADO',
    hogar: 'hogar-3',
    fuente: 'Pág. 23 (Construcción de Confianza)',
    marca: 'Gerber',
    cita: '“Si él lo quiere, adelante. Pero si a él no le gusta, si él lo rechaza, ya no se lo vuelvo a dar.”',
    descripcion: 'A pesar de contar con visto bueno del pediatra y etiqueta limpia, el veto o aceptación del bebé es inapelable.',
    contexto: 'Momento de comida',
    actores: ['Bebé', 'Mamá de Ferias'],
    imagenUrl: '/images/lullaby/img-18-arbitro-bebe.jpg',
    imagenAlt: 'Bebé comiendo y expresando aceptación o rechazo inmediato',
    pieEtnografico: 'Pág. 23: Veto infantil inapelable: si al bebé no le gusta o lo escupe, la marca no vuelve a comprarse.',
    artefactoClave: 'Rechazo / Aceptación del bebé en la cuchara'
  },
  {
    id: 'ev-19',
    codigo: 'EV-GERBER-06',
    titulo: 'Inversión en esterilizador y electrodomésticos de higiene',
    tipo: 'Objeto / Fotografía',
    nivel: 'OBSERVADO',
    hogar: 'hogar-3',
    fuente: 'Pág. 26 (Oportunidad Preparación)',
    marca: 'Gerber / Artefactos',
    cita: 'La presencia del esterilizador y otros aparatos muestra que la búsqueda de practicidad va más allá de los alimentos: compra soluciones que reducen tareas repetitivas.',
    descripcion: 'Mamá sostiene un esterilizador y calentador eléctrico de biberones de última generación en su cocina, demostrando disposición a pagar por ahorro de tiempo higiénico.',
    contexto: 'Cocina',
    actores: ['Mamá de Ferias'],
    imagenUrl: '/images/lullaby/img-19-esterilizador-electrico.jpg',
    imagenAlt: 'Esterilizador y calentador eléctrico de biberones en cocina',
    pieEtnografico: 'Pág. 26: Disposición a pagar por artefactos tecnológicos que reduzcan tareas repetitivas de higiene.',
    artefactoClave: 'Esterilizador eléctrico digital'
  },
  {
    id: 'ev-20',
    codigo: 'EV-TRANS-01',
    titulo: 'Despensa multimarca y convivencia de soluciones',
    tipo: 'Espacio / Fotografía',
    nivel: 'OBSERVADO',
    hogar: 'hogar-3',
    fuente: 'Pág. 25 (Repertorio, no Exclusividad)',
    marca: 'Gerber / Nestum / Enfamil',
    cita: 'En la alacena, Gerber convive con otras marcas que mamá también considera adecuadas. La elección no parte de una despensa monomarca.',
    descripcion: 'Estante donde conviven fórmula Enfamil etapa 1, latas de Nestum, frascos y paquetes de Gerber Puffs, Choco Milk y Nescafé para adultos.',
    contexto: 'Alacena familiar',
    actores: ['Mamá de Ferias', 'Familia'],
    imagenUrl: '/images/lullaby/img-20-despensa-multimarca.jpg',
    imagenAlt: 'Alacena con Gerber conviviendo con Enfamil, Nestum y café de adultos',
    pieEtnografico: 'Pág. 25: Repertorio, no exclusividad: ninguna marca tiene el monopolio del día; cada una atiende un momento.',
    artefactoClave: 'Alacena multimarca compartida'
  }
];

export const INSIGHTS = [
  {
    id: 'ins-01',
    titulo: 'Desdibujamiento de la frontera alimentaria al cumplir 1 año',
    descripcion: 'Al cumplir un año, el bebé abandona la categoría de consumidor exclusivo; la comida familiar se convierte en el referente de alimentación y lo especializado pierde obligatoriedad.',
    nivelEpistemologico: 'DERIVADO',
    evidenciaIds: ['ev-01', 'ev-02', 'ev-03'],
    tension: 'Su Comida vs. Nuestra Comida: El deseo de mantener pureza e higiene infantil choca con el rito integrador de compartir la mesa y los guisados de la familia.',
    mecanismo: 'La madre reorganiza su tiempo adaptando una sola cocción familiar (separando porciones antes de condimentar) en lugar de duplicar preparaciones. La socialización con abuelos los fines de semana acelera la permisividad.',
    disparadores: ['Cumpleaños de 1 año', 'Interés visual del bebé por la comida del adulto', 'Comidas familiares de fin de semana con abuelos'],
    condiciones: ['Que la comida familiar pueda ser desagregada o porcionada antes de picante/sal', 'Que el niño cuente con dentición incipiente o capacidad de masticación blanda'],
    actores: ['Mamá Belén', 'Bebé', 'Abuelos', 'Familia Extensa'],
    contexto: 'Cocina doméstica entre semana y sobremesa dominical en casa de abuelos',
    necesidad: 'Integrar al bebé a la vida familiar sin complicar los tiempos de cocina ni sobrecargar el presupuesto del hogar.',
    respuestaActual: 'Cocinar para todos, retirar la porción del bebé antes de sazonar (arroz, verduras, pollo, tortilla), y permitir que los abuelos conviden bocados suaves.',
    condicionAceptacion: 'Que los ingredientes sean reconocibles como "comida real" de la casa y que no causen malestar estomacal.',
    riesgo: 'Rechazo del bebé a alimentos blandos o diarreas por condimentos no tolerados.',
    implicaciones: 'Los productos que se posicionan únicamente como "para bebés" sufren una obsolescencia acelerada al llegar al año de edad si no justifican una función en la mesa compartida.',
    oportunidades: 'Presentaciones o complementos que se sumen a la comida de casa en vez de competir con ella; porciones adaptadas para mezclar con alimentos familiares.',
    marcasRelacionadas: ['Nido', 'Gerber Cereal'],
    fuenteReporte: 'Págs. 3 y 4 (Inmersión Nido)'
  },
  {
    id: 'ins-02',
    titulo: 'El riesgo de Bypass directo a Leche Entera (NAN → Leche de Casa)',
    descripcion: 'Nido posee un lugar mental claro en la transición ideal, pero la prueba exitosa de leche entera pasteurizada a bajo costo crea un atajo que vuelve prescindible la leche de crecimiento.',
    nivelEpistemologico: 'DERIVADO',
    evidenciaIds: ['ev-04', 'ev-05', 'ev-06'],
    tension: 'Ruta Mental Ideal vs. Atajo Económico/Práctico: La madre planeaba dar Nido como peldaño seguro post-fórmula, pero la normalización médica y la tolerancia del bebé validan el salto directo a leche familiar.',
    mecanismo: 'Validación por tolerancia digestiva: una vez que el pediatra abre la posibilidad y el bebé consume leche entera durante 30 días sin diarrea ("todo bien"), el beneficio de protección digestiva especializada de Nido deja de justificar su sobreprecio.',
    disparadores: ['Cumplir 1 año', 'Consejo permisivo del pediatra', 'Recomendación de abuelas/tías ("ya dale de la normal")', 'Agotamiento del tarro de fórmula costosa'],
    condiciones: ['Que la leche entera esté disponible en el refrigerador familiar', 'Que el estómago del bebé no presente intolerancia ni cólicos en el primer mes de prueba'],
    actores: ['Mamá Belén', 'Pediatra', 'Bebé', 'Red familiar'],
    contexto: 'Hogar, desayuno y cena, presupuesto mensual de despensa',
    necesidad: 'Unificar la compra de leche para todo el hogar y optimizar el gasto sin descuidar el crecimiento óseo y energético.',
    respuestaActual: 'Comprar leche de vaca pasteurizada que ya consumen los adultos del hogar.',
    condicionAceptacion: 'Ausencia total de diarrea, dolor abdominal y adecuado peso pediátrico.',
    riesgo: 'Pérdida definitiva de penetración de Nido en hogares que descubren que pueden prescindir de la categoría.',
    implicaciones: 'Nido no puede competir solo con "familiaridad y ternura"; debe evidenciar con contundencia qué nutrientes críticos (hierro, zinc, sin azúcar) aporta que la leche entera de vaca NO tiene.',
    oportunidades: 'Reformular el mensaje de Nido no como "otra leche", sino como un "escudo de micronutrientes" frente a las deficiencias de la leche entera común.',
    marcasRelacionadas: ['Nido', 'NAN', 'Leche Entera Familiar'],
    fuenteReporte: 'Págs. 6 y 7 (Transición de Categoría y Entrada a Nido)'
  },
  {
    id: 'ins-03',
    titulo: 'Persistencia de la utilidad funcional: el cereal como facilitador',
    descripcion: 'No toda la categoría infantil caduca al mismo tiempo: los productos que resuelven una fricción mecánica concreta (espesar, alimentar rápido, dosificar) sobreviven al bypass.',
    nivelEpistemologico: 'OBSERVADO',
    evidenciaIds: ['ev-07', 'ev-13'],
    tension: 'Deseo de autonomía vs. Eficiencia de la toma: El bebé quiere comer solo pero derrama o tarda demasiado; el cereal permite texturas densas que calman el hambre rápidamente.',
    mecanismo: 'El cereal infantil no se compra por ser "de bebé", sino porque simplifica una tarea física: se disuelve en segundos, tiene textura uniforme, no requiere licuadora y asegura saciedad antes de dormir.',
    disparadores: ['Prisas matutinas', 'Bebé irritable con hambre nocturna', 'Necesidad de espesar líquidos'],
    condiciones: ['Presentación en polvo de disolución instantánea', 'Aporte calórico/hierro perceptible'],
    actores: ['Mamá Belén', 'Mamá de Liam', 'Bebé'],
    contexto: 'Desayuno exprés y cena previa a dormir',
    necesidad: 'Preparar en menos de 2 minutos un plato que sacie al niño sin ensuciar múltiples sartenes.',
    respuestaActual: 'Mezclar cucharadas de cereal en agua o leche tibia en el plato hondo del bebé.',
    condicionAceptacion: 'Disolución sin grumos y textura que el bebé acepte sin escupir.',
    riesgo: 'Aburrimiento del sabor o que la familia sustituya por hojuelas de maíz/avena común cuando el niño mastique mejor.',
    implicaciones: 'Las marcas infantiles deben justificar su longevidad por valor de uso operativo (ergonomía de preparación) y no solo por discurso de puericultura.',
    oportunidades: 'Cereales para niños mayores de 1 año con combinaciones de granos enteros y trozos adaptados para incentivar masticación.',
    marcasRelacionadas: ['Gerber Cereal', 'Nestum'],
    fuenteReporte: 'Pág. 8 (Permanencia de la Categoría Infantil)'
  },
  {
    id: 'ins-04',
    titulo: 'La Cadena de Certeza: Triangulación de autoridad en 5 pasos',
    descripcion: 'La madre moderna no delega su decisión en una sola fuente: orquesta un sistema de pesos y contrapesos donde las redes abren el tema, el médico valida y el bebé confirma.',
    nivelEpistemologico: 'DERIVADO',
    evidenciaIds: ['ev-08', 'ev-09', 'ev-11', 'ev-12'],
    tension: 'Sobrecarga de información digital vs. Responsabilidad médica: Miles de consejos en redes abruman a la madre; necesita un filtro científico para neutralizar la incertidumbre.',
    mecanismo: 'Protocolo de reducción de ansiedad: 1. Algoritmo de TikTok plantea una duda/marca → 2. Mamá anota el tema → 3. Pregunta al pediatra en consulta presencial → 4. Revisa etiqueta buscando sellos de certeza → 5. Prueba personal sensorial → 6. Veredicto digestivo del niño.',
    disparadores: ['Aparición de videos virales sobre aditivos, destete o azúcar', 'Consulta mensual de control de niño sano'],
    condiciones: ['Acceso a smartphone/TikTok y consulta pediátrica periódica privada o de seguridad social'],
    actores: ['Mamá de Liam', 'Pediatra', 'Creadores de TikTok (@lactancia.serena)', 'Bebé Liam'],
    contexto: 'Consultorio médico y navegación nocturna en redes',
    necesidad: 'Sentir seguridad absoluta de que no está perjudicando la salud metabólica de su hijo por ignorancia o dejadez.',
    respuestaActual: 'Llevar anotaciones o capturas de pantalla de TikTok al pediatra y someter la decisión a su visto bueno.',
    condicionAceptacion: 'Aprobación explícita del médico de cabecera.',
    riesgo: 'Desestimación médica fulminante si el producto no cuenta con credenciales clínicas o si el pediatra prescribe marcas competidoras.',
    implicaciones: 'Las campañas dirigidas a mamás en TikTok solo son efectivas si proporcionan los argumentos técnicos exactos que la madre repetirá en la consulta pediátrica.',
    oportunidades: 'Kits de información co-diseñados para médicos y madres: "Lo que debes preguntarle a tu pediatra sobre nutrición infantil".',
    marcasRelacionadas: ['Nestum', 'NAN', 'Nido'],
    fuenteReporte: 'Págs. 10, 11 y 12 (Cadena de Decisión y Autoridad Digital)'
  },
  {
    id: 'ins-05',
    titulo: '"Sin Azúcar Añadida" como condición de corte excluyente',
    descripcion: 'Las madres han establecido heurísticas binarias de control: si un producto contiene azúcar añadida, queda descartado inmediatamente sin importar qué otros nutrientes ofrezca.',
    nivelEpistemologico: 'OBSERVADO',
    evidenciaIds: ['ev-10', 'ev-12'],
    tension: 'Herencia de productos dulces de la infancia vs. Conciencia nutricional actual: Las madres recuerdan los productos infantiles de su propia niñez como empalagosos y buscan romper ese patrón en sus hijos.',
    mecanismo: 'Heurística de atajo cognitivo: Al carecer de tiempo para decodificar gramos de carbohidratos o tablas complejas, buscan leyendas explícitas frontales. La leyenda "Sin Azúcar Añadida" funciona como un pase de seguridad automático.',
    disparadores: ['Lectura de etiqueta en anaquel', 'Experiencia previa al probar el alimento de niña'],
    condiciones: ['Visibilidad frontal nítida de la leyenda', 'Sabor no empalagoso al realizar la prueba doméstica'],
    actores: ['Mamá de Liam', 'Mamá de Ferias', 'Pediatra'],
    contexto: 'Anaquel de autoservicio y cocina',
    necesidad: 'Prevenir la adicción al dulce, la obesidad y la caries sin tener que ser nutricionista.',
    respuestaActual: 'Revisar sellos frontales y comprar marcas como Danone Natural o Nestum sin azúcar.',
    condicionAceptacion: 'Que el empaque prometa cero azúcar y que la cata de mamá confirme que sabe a cereal puro o leche suave.',
    riesgo: 'Boicot total si una reformulación secreta añade edulcorantes o azúcares ocultos con nombres técnicos.',
    implicaciones: 'Cualquier producto lácteo o papilla que mantenga azúcar añadida en México enfrenta un techo estructural de rechazo por mamás informadas NSE C/C+.',
    oportunidades: 'Certificaciones visuales de pureza de ingredientes y transparencia radical en formulaciones infantiles.',
    marcasRelacionadas: ['Nestum', 'Danone', 'Gerber'],
    fuenteReporte: 'Págs. 13 y 15 (Señales de Confianza y Comprobación Doméstica)'
  },
  {
    id: 'ins-06',
    titulo: 'El compromiso de la Avena: Simplificar sin sacrificar el estándar',
    descripcion: 'Al reincorporarse al trabajo, la madre no busca un ultraprocesado milagroso, sino un sucedáneo honorable de la avena natural que ella misma molía.',
    nivelEpistemologico: 'DERIVADO',
    evidenciaIds: ['ev-11', 'ev-13'],
    tension: 'Estándar Nutricional Casero vs. Escasez Crítica de Tiempo: Moler y cocer avena natural representa el ideal de amor, pero el teletrabajo hace inviable sostenerlo a diario.',
    mecanismo: 'Negociación de sustitución funcional: Nestum entra como una "avena precocida molida de confianza", no como una chuchería. La madre acepta la delegación porque el ingrediente base sigue siendo reconocible.',
    disparadores: ['Fin de la licencia de maternidad', 'Jornadas de trabajo en computadora con llanto de fondo'],
    condiciones: ['Que la lista de ingredientes conserve la avena integral al frente', 'Que el tiempo de preparación no supere 60 segundos'],
    actores: ['Mamá de Liam', 'Bebé Liam'],
    contexto: 'Mañanas de home office en departamento urbano',
    necesidad: 'Ahorrar 20 minutos de preparación matutina sin sentir remordimiento de estar dándole "comida chatarra" al bebé.',
    respuestaActual: 'Intercalar días: avena natural cocinada cuando hay tiempo, y 2-3 cucharadas de Nestum con agua en días de alta carga laboral.',
    condicionAceptacion: 'Que el cereal conserve textura de cereal real y no tenga saborizante artificial invasivo.',
    riesgo: 'Culpa si siente que abandonó por completo la comida hecha en casa.',
    implicaciones: 'Nestum debe posicionarse como un aliado del tiempo de mamá que respeta la cocina real, no como un sustituto que desplaza los alimentos nobles.',
    oportunidades: 'Formatos listos para añadir fruta fresca o recetas de "avena combinada en 1 minuto" avaladas por nutriólogos.',
    marcasRelacionadas: ['Nestum', 'Avena Natural'],
    fuenteReporte: 'Págs. 14, 16 y 18 (Camino a Nestum y Natural como Referente)'
  },
  {
    id: 'ins-07',
    titulo: 'El Kit de Movilidad: Alimentar fuera de casa bajo condiciones extremas',
    descripcion: 'En contextos de comercio informal y ferias, la alimentación infantil se convierte en un desafío de contingencia donde la portabilidad y la conservación higiénica sin refrigeración son vitales.',
    nivelEpistemologico: 'OBSERVADO',
    evidenciaIds: ['ev-14', 'ev-15', 'ev-16'],
    tension: 'Higiene Hospitalaria en Casa vs. Caos e Intemperie en Ferias: En casa esteriliza todo; en la feria no hay agua corriente ni estufa para calentar.',
    mecanismo: 'Estrategia de modularidad pre-empacada ("Kit Gerber"): La madre arma una caja hermética con distintos formatos (papillas cerradas al vacío, botes con rosca, puffs de agarre rápido) que garantizan inocuidad bacteriológica sin necesidad de cocinar.',
    disparadores: ['Madrugadas de montaje de puestos en ferias populares de CDMX', 'Jornadas de más de 10 horas fuera del hogar'],
    condiciones: ['Productos herméticos que resistan altas temperaturas de traslado', 'Formatos consumibles a temperatura ambiente'],
    actores: ['Mamá de Ferias', 'Bebé', 'Esposo / Compañeros de puesto'],
    contexto: 'Puestos de feria, transporte público, banquetas de la ciudad',
    necesidad: 'Garantizar que el niño coma a sus horas con higiene impecable sin depender de locales ambulantes no aptos.',
    respuestaActual: 'Cargar el maletín plástico con frascos Gerber, galletas y puffs para ir dosificando según la marcha del día.',
    condicionAceptacion: 'Que los productos vengan sellados al vacío, no requieran cocción previa y tengan caducidad prolongada.',
    riesgo: 'Que se rompa un frasco de vidrio en el trayecto o que no haya dónde calentar una papilla salada.',
    implicaciones: 'Para hogares en movilidad comercial, la comida de frasco no es pereza: es la única garantía de inocuidad microbiológica para su hijo.',
    oportunidades: 'Empaques flexibles irrompibles con boquilla dosificadora (pouches) térmicos y cucharas acoplables de un solo uso.',
    marcasRelacionadas: ['Gerber', 'Enfamil'],
    fuenteReporte: 'Págs. 19, 20 y 21 (Inmersión Gerber y Kit Gerber)'
  },
  {
    id: 'ins-08',
    titulo: 'Autocuidado maternal y legitimación emocional del alivio',
    descripcion: 'El uso de alimentos preparados para bebé requiere superar una barrera moral interna: la madre necesita permiso explícito para descansar sin sentirse negligente.',
    nivelEpistemologico: 'DERIVADO',
    evidenciaIds: ['ev-17', 'ev-18'],
    tension: 'Madre Abnegada Ideal vs. Salud Mental y Agotamiento: La autoexigencia de preparar todo desde cero lleva al colapso físico; aceptar un producto de fábrica requiere redefinir el estándar de buena madre.',
    mecanismo: 'Racionalización del alivio: "No me estoy torturando; necesito un descanso y sé que no lo estoy haciendo mal porque la marca es buena y el pediatra lo sabe". El producto actúa como un catalizador de salud mental familiar.',
    disparadores: ['Agotamiento extremo tras semanas sin dormir', 'Reconocimiento personal del límite de energía'],
    condiciones: ['Que la marca tenga reputación histórica intachable', 'Que el niño sonría y acepte la papilla/cereal'],
    actores: ['Mamá de Ferias', 'Bebé'],
    contexto: 'Intimidad del hogar tras jornadas extenuantes',
    necesidad: 'Alivio del esfuerzo físico y mental sin el gravamen de la culpa moral.',
    respuestaActual: 'Darse permiso de recurrir a la papilla comprada en momentos de fatiga o salida rápida.',
    condicionAceptacion: 'Saber que el producto es nutricionalmente adecuado y aceptado por el bebé.',
    riesgo: 'Crítica de suegras o madres de generaciones anteriores ("no le des de frasco, hazle caldo").',
    implicaciones: 'La comunicación publicitaria que romantiza la maternidad sacrificada y la cocina 100% artesanal reactiva la culpa y aleja a las madres de la categoría.',
    oportunidades: 'Campañas de empatía y validación del rol materno real: "Cuidarte a ti también es cuidar a tu bebé".',
    marcasRelacionadas: ['Gerber'],
    fuenteReporte: 'Pág. 22 (Aceptar Ayuda)'
  },
  {
    id: 'ins-09',
    titulo: 'Oportunidad latente: Insumos pre-procesados para preparación casera',
    descripcion: 'La búsqueda de practicidad no se agota en platillos terminados: existe una alta disposición a pagar por soluciones que automaticen el trabajo sucio previo (lavar, desinfectar, porcionar).',
    nivelEpistemologico: 'HIPOTESIS',
    evidenciaIds: ['ev-19', 'ev-20'],
    tension: 'Deseo de cocinar vs. Aversión al trabajo previo: La mamá ama cocinar y sentir que alimenta a su hijo con sus manos, pero detesta la merma de tiempo en picar minúsculo, desinfectar y hervir.',
    mecanismo: 'Transferencia de valor al pre-procesamiento: La madre ya invirtió en esterilizadores eléctricos caros para no hervir biberones en ollas. La misma lógica aplica a los alimentos: comprar verduras orgánicas infantiles ya lavadas y picadas en porción exacta.',
    disparadores: ['Ganas de hacer comida casera pero con solo 10 minutos de tiempo disponible'],
    condiciones: ['Cadena de frío o envasado aséptico al vacío', 'Garantía de cero conservadores químicos dañinos'],
    actores: ['Mamá de Ferias', 'Mamá Belén', 'Marcas de alimentos infantiles'],
    contexto: 'Preparación de comidas en cocina doméstica',
    necesidad: 'Sentir la satisfacción y el afecto de haber cocinado el platillo, pero saltándose 30 minutos de faena previa.',
    respuestaActual: 'Picar y desinfectar manualmente los fines de semana o comprar electrodomésticos especializados.',
    condicionAceptacion: 'Frescura visible e higiene de grado clínico.',
    riesgo: 'Precio elevado frente a verduras del tianguis si no se percibe la bioseguridad infantil.',
    implicaciones: 'Las marcas de Baby Food tienen una enorme avenida de crecimiento hacia "ingredientes e insumos infantiles listos para cocinar" (meal prep infantil), no solo frascos terminados.',
    oportunidades: 'Línea Gerber Fresh / Base Cocina: Purés base mono-ingrediente congelados o deshidratados en porciones individuales sin sal ni conservadores para integrar a guisados familiares.',
    marcasRelacionadas: ['Gerber', 'Nestum'],
    fuenteReporte: 'Págs. 26 y 27 (Oportunidad Preparación y Hallazgos Finales)'
  }
];

export const TENSIONS = [
  {
    id: 'ten-01',
    titulo: 'Control Estricto vs. Capacidad de Improvisar',
    descripcion: 'El estándar ideal exige higiene absoluta, cocción propia y horarios milimétricos; la vida real (trabajo, ferias, salidas) obliga a resolver con lo que haya a mano.',
    poloA: {
      nombre: 'Control Estricto (El Ideal)',
      conceptos: ['Comida fresca', 'Esterilización', 'Progresión por edad', 'Utensilios propios', 'Cero sal ni azúcar'],
      evidencias: ['ev-10', 'ev-19', 'ev-02'],
      marcas: ['Avena Natural', 'Comida casera separada']
    },
    poloB: {
      nombre: 'Capacidad de Improvisar (La Realidad)',
      conceptos: ['Jornadas en ferias', 'Salidas de madrugada', 'Sin estufa ni agua', 'Contingencia urbana', 'Prisas laborales'],
      evidencias: ['ev-14', 'ev-15', 'ev-16'],
      marcas: ['Kit Gerber', 'Nestum en agua']
    },
    mecanismoResolucion: 'Formatos modulares de alta practicidad que preservan credenciales de inocuidad clínica sin requerir cocina.',
    oportunidadVinculada: 'Kits portátiles de contingencia y empaques estériles de un solo uso.',
    hogarClave: 'hogar-3'
  },
  {
    id: 'ten-02',
    titulo: 'Su Comida (Bebé) vs. Nuestra Comida (Familia)',
    descripcion: 'La tensión entre mantener al niño en una burbuja de nutrición infantil protegida vs. la inevitable y deseada asimilación a la mesa familiar.',
    poloA: {
      nombre: 'Su Comida (Alimento Infantil Especializado)',
      conceptos: ['Fórmula láctea', 'Papillas monoingrediente', 'Biberón', 'Textura lisa', 'Costoso y exclusivo'],
      evidencias: ['ev-01', 'ev-05'],
      marcas: ['NAN', 'Nido Kinder']
    },
    poloB: {
      nombre: 'Nuestra Comida (Dieta Familiar Compartida)',
      conceptos: ['Guisados familiares', 'Tortilla, pollo, arroz', 'Leche entera de vaca', 'Platos normales', 'Económico y compartido'],
      evidencias: ['ev-02', 'ev-03', 'ev-06'],
      marcas: ['Leche Entera Familiar', 'Guisados caseros']
    },
    mecanismoResolucion: 'La separación de porciones antes de sazonar y el uso de cereales para dar textura a comidas familiares.',
    oportunidadVinculada: 'Posicionar leches y cereales como puentes adaptadores de la comida familiar en lugar de mundos aislados.',
    hogarClave: 'hogar-1'
  },
  {
    id: 'ten-03',
    titulo: 'Estándar Maternal Puro vs. Alivio Emocionalmente Aceptable',
    descripcion: 'La autoexigencia de entrega absoluta choca con el agotamiento físico, forzando una negociación ética consigo misma.',
    poloA: {
      nombre: 'Autoexigencia de Pureza Casera',
      conceptos: ['Moler avena a mano', 'Cocinar todo el día', 'Miedo a ser mala madre', 'Rechazo a lo industrial'],
      evidencias: ['ev-11', 'ev-17'],
      marcas: ['Avena hervida', 'Purés desde cero']
    },
    poloB: {
      nombre: 'Derecho al Alivio y Salud Mental',
      conceptos: ['"No me estoy torturando"', 'Necesidad de descanso', 'Practicidad legítima', 'Madre funcional'],
      evidencias: ['ev-17', 'ev-12'],
      marcas: ['Gerber', 'Nestum']
    },
    mecanismoResolucion: 'La comprobación sensorial personal de la madre y el aval del pediatra desarticulan el sentimiento de culpa.',
    oportunidadVinculada: 'Comunicación de marca desprovista de juicios morales que valide la fatiga real de la madre moderna.',
    hogarClave: 'hogar-3'
  },
  {
    id: 'ten-04',
    titulo: 'Ruta Mental Ideal vs. Bypass Directo de Categoría',
    descripcion: 'El plan de transición láctea preconcebido (NAN → Nido → Leche Entera) se enfrenta a la posibilidad empírica de saltarse Nido sin consecuencias negativas visibles.',
    poloA: {
      nombre: 'Ruta Mental Prevista',
      conceptos: ['Paso gradual', 'Leche de crecimiento', 'Protección estomacal', 'Familiaridad de marca'],
      evidencias: ['ev-04', 'ev-05'],
      marcas: ['Nido Kinder']
    },
    poloB: {
      nombre: 'Ruta Corta (Bypass)',
      conceptos: ['Ahorro económico', 'Un solo galón de leche en refri', 'Validación médica', 'Tolerancia digestiva probada'],
      evidencias: ['ev-06'],
      marcas: ['Leche Entera de Vaca']
    },
    mecanismoResolucion: 'Demostrar qué beneficio concreto e insustituible (zinc, defensas, desarrollo cognitivo) ofrece Nido que la leche de vaca de $25 pesos no tiene.',
    oportunidadVinculada: 'Campañas de contraste nutricional objetivo frente a la leche entera convencional.',
    hogarClave: 'hogar-1'
  }
];

export const DECISION_CHAINS = [
  {
    id: 'dec-nestum',
    marca: 'Nestum',
    titulo: 'Cadena de Certeza de Mamá Informada (Inmersión Nestum)',
    descripcion: 'Cómo una mamá moderna de CDMX procesa y valida un cambio de alimentación para su hijo Liam.',
    fuente: 'Págs. 10–13 del Reporte',
    etapas: [
      {
        paso: 1,
        nombre: 'Descubrimiento (Redes)',
        actorPrincipal: 'TikTok / Redes Sociales (@lactancia.serena)',
        accion: 'El feed de TikTok pone en circulación temas de destete, fórmulas y leches de crecimiento. Le abre preguntas y posibles alternativas.',
        evidenciaId: 'ev-09',
        rolActor: 'Agenda de temas, no autoridad final.',
        cita: 'TikTok solo le dice qué preguntar.'
      },
      {
        paso: 2,
        nombre: 'Validación (Pediatra)',
        actorPrincipal: 'Pediatra de Cabecera',
        accion: 'La madre lleva las dudas y marcas descubiertas a la consulta médica. El pediatra aprueba o descarta la formulación.',
        evidenciaId: 'ev-08',
        rolActor: 'Filtro científico y legitimador institucional.',
        cita: '“Nunca he tomado como una decisión a base de lo que veo; más bien esas decisiones las llevo a mi pediatra.”'
      },
      {
        paso: 3,
        nombre: 'Búsqueda de Señales (Empaque)',
        actorPrincipal: 'Mamá frente al Anaquel',
        accion: 'Revisa etiquetas buscando heurísticas de certeza rápida: "Sin azúcar añadida", "Sin exceso de sal", "Calcio", "Proteína".',
        evidenciaId: 'ev-10',
        rolActor: 'Control heurístico de riesgos.',
        cita: '“Sin azúcar añadida” funciona como puerta de entrada.'
      },
      {
        paso: 4,
        nombre: 'Prueba Doméstica (Cata)',
        actorPrincipal: 'Mamá en Cocina',
        accion: 'Antes de dárselo a su hijo, mamá prueba personalmente con cuchara el cereal para verificar que no esté empalagoso.',
        evidenciaId: 'ev-12',
        rolActor: 'Testigo sensorial directo.',
        cita: '“Sí sabe diferente a lo que recordaba de niña.”'
      },
      {
        paso: 5,
        nombre: 'Observación y Confirmación (Bebé)',
        actorPrincipal: 'Bebé Liam',
        accion: 'Liam prueba la mezcla de 2-3 cucharadas con agua: tolera bien, no tiene diarrea, acepta el sabor y sigue creciendo con energía.',
        evidenciaId: 'ev-13',
        rolActor: 'Árbitro final de permanencia o veto.',
        cita: 'Liam tolera, acepta y se desarrolla.'
      }
    ]
  },
  {
    id: 'dec-gerber',
    marca: 'Gerber',
    titulo: 'Cadena de Confianza y Selección de Kit (Inmersión Gerber)',
    descripcion: 'Cómo se construye la lealtad y el repertorio de soluciones portátiles para ferias.',
    fuente: 'Págs. 21–24 del Reporte',
    etapas: [
      {
        paso: 1,
        nombre: 'Detección de Fricción',
        actorPrincipal: 'Mamá de Ferias',
        accion: 'Se percata de que salir de madrugada sin cocina exige alternativas listas que no se echen a perder.',
        evidenciaId: 'ev-14',
        rolActor: 'Operadora de la contingencia familiar.',
        cita: '“Me tuve que salir muy temprano y no logré preparar nada.”'
      },
      {
        paso: 2,
        nombre: 'Orientación Pediátrica',
        actorPrincipal: 'Pediatra',
        accion: 'Pediatra autoriza introducción de papillas y snacks de frutas y verduras según meses de edad.',
        evidenciaId: 'ev-18',
        rolActor: 'Guía de progresión por edad.',
        cita: 'Autoriza y orienta por etapas.'
      },
      {
        paso: 3,
        nombre: 'Filtro de Etiqueta',
        actorPrincipal: 'Mamá en Tienda',
        accion: 'Revisa que no contenga azúcar añadida y que sea formato seguro para transporte en bolsa.',
        evidenciaId: 'ev-16',
        rolActor: 'Evaluadora de practicidad e higiene.',
        cita: 'Compra paquetes para asegurar reserva.'
      },
      {
        paso: 4,
        nombre: 'Respuesta del Bebé',
        actorPrincipal: 'Bebé en la Feria',
        accion: 'El bebé come en su carriola mientras los adultos atienden el puesto. Si rechaza un sabor, se elimina definitivamente del kit.',
        evidenciaId: 'ev-18',
        rolActor: 'Veto inapelable de compra.',
        cita: '“Si él lo rechaza, ya no se lo vuelvo a dar.”'
      },
      {
        paso: 5,
        nombre: 'Recompra en Paquete',
        actorPrincipal: 'Mamá / Pareja',
        accion: 'Los productos exitosos (puffs, galletas, papillas) se compran en multipack para reabastecer el maletín de salidas.',
        evidenciaId: 'ev-16',
        rolActor: 'Consolidación del kit habitual.',
        cita: '“Aquí tengo mi kit de Gerber.”'
      }
    ]
  },
  {
    id: 'dec-nido',
    marca: 'Nido',
    titulo: 'Encrucijada de Transición Láctea (Inmersión Nido)',
    descripcion: 'El proceso mental y social que define si Nido se adopta o se sufre el bypass hacia la leche común.',
    fuente: 'Págs. 5–7 del Reporte',
    etapas: [
      {
        paso: 1,
        nombre: 'Expectativa Previa',
        actorPrincipal: 'Mamá Belén',
        accion: 'Cree que tras dejar la fórmula costosa (NAN), el paso natural y obligatorio es Nido Kinder.',
        evidenciaId: 'ev-05',
        rolActor: 'Consumidora guiada por herencia y tradición.',
        cita: '“Mi idea era terminarle de dar fórmula y seguir con Nido...”'
      },
      {
        paso: 2,
        nombre: 'Apertura de la Red',
        actorPrincipal: 'Pediatra y Familia Extensa',
        accion: 'El pediatra y las tías mencionan que al año ya puede tomar leche entera de vaca normal.',
        evidenciaId: 'ev-06',
        rolActor: 'Disruptores de la ruta preconcebida.',
        cita: 'Cumplir un año amplía lo que se considera permitido.'
      },
      {
        paso: 3,
        nombre: 'Prueba de Riesgo Digestivo',
        actorPrincipal: 'Mamá e Hija',
        accion: 'Prueba cautelosa de leche entera pasteurizada con miedo a diarrea o soltura estomacal.',
        evidenciaId: 'ev-06',
        rolActor: 'Comprobación empírica en el hogar.',
        cita: 'Temía que le soltara el estómago.'
      },
      {
        paso: 4,
        nombre: 'Constatación de Tolerancia',
        actorPrincipal: 'Hija de Belén',
        accion: 'Pasa un mes entero consumiendo leche de vaca común sin vómitos, cólicos ni diarreas.',
        evidenciaId: 'ev-06',
        rolActor: 'Confirmación biológica.',
        cita: 'Después de un mes “todo bien”.'
      },
      {
        paso: 5,
        nombre: 'Pérdida de Urgencia de Nido',
        actorPrincipal: 'Hogar Belén',
        accion: 'Al ver que la niña tolera la leche familiar de $25 pesos, Nido queda relegada o se pospone su compra.',
        evidenciaId: 'ev-06',
        rolActor: 'Bypass consumado.',
        cita: 'Nido puede llegar a perder necesidad cuando comprueba que puede avanzar sin ese paso.'
      }
    ]
  }
];

export const TRANSITIONS = [
  {
    id: 'trans-01',
    titulo: 'Transición Vital: Cumplir 1 Año de Edad',
    subtitulo: 'De "Ser Bebé" a "Comer lo que hay en casa"',
    fuente: 'Págs. 3, 4, 7 y 9',
    descripcion: 'El cumpleaños de un año detona un cambio ontológico: el bebé deja de requerir un menú segregado y la familia empieza a compartir su dieta cotidiana.',
    fotoAntes: {
      url: '/images/lullaby/img-05-transicion-lactea.jpg',
      alt: 'Secuencia mental de transición láctea',
      caption: 'La secuencia mental: de fórmula especializada a leche entera pasando por Nido como puente.',
      page: 'Pág. 6',
      artifact: 'Diagrama mental de lactancia'
    },
    fotoDespues: {
      url: '/images/lullaby/img-06-leche-entera-bypass.jpg',
      alt: 'Cartón de leche entera y prueba de tolerancia',
      caption: 'Cartón de leche entera en mesa familiar: la prueba de fuego digestiva tras cumplir 1 año.',
      page: 'Pág. 7',
      artifact: 'Cartón de leche entera'
    },
    antes: {
      estado: 'Etapa de Bebé Estricto (0 a 11 meses)',
      comida: 'Lactancia exclusiva, fórmula médica NAN/Enfamil, papillas coladas monoingrediente.',
      utensilios: 'Biberón con mamilas esterilizadas, cucharas de silicón especiales.',
      reglas: 'Horarios milimétricos, cero sal, cero azúcar, aislamiento estricto de la comida familiar.'
    },
    detonante: 'Cumplir 1 año + permiso del pediatra + dentición incipiente.',
    despues: {
      estado: 'Etapa de Integración Familiar (12 a 24 meses)',
      comida: 'Comparte guisados familiares (arroz, pollo, tortillas) apartados antes de condimentar; prueba leche entera.',
      utensilios: 'Vaso entrenador antiderrames, platos compartidos, cubiertos que imitan a los adultos.',
      reglas: 'Flexibilización dominical con abuelos; la frontera entre "su comida" y "nuestra comida" se borra.'
    },
    impactoMarcas: {
      pierden: 'Fórmulas de inicio (NAN etapa 1 y 2), papillas básicas monoingrediente lisas, Nido si no demuestra valor extra.',
      ganan: 'Leche entera pasteurizada común, cereales de trigo/avena para mezclar en casa, comidas familiares porcionadas.'
    }
  },
  {
    id: 'trans-02',
    titulo: 'Transición Laboral: Retorno al Trabajo de Mamá',
    subtitulo: 'Del Cuidado Exclusivo al Colapso del Tiempo Disponible',
    fuente: 'Págs. 14, 16 y 18',
    descripcion: 'El fin del permiso de maternidad y el regreso al teletrabajo/oficina reducen drásticamente la capacidad de preparar recetas artesanales desde cero.',
    fotoAntes: {
      url: '/images/lullaby/img-11-avena-vs-nestum.jpg',
      alt: 'Cocción de avena casera en estufa',
      caption: 'Olla de avena casera: 40 minutos de cocción y tamizado que colapsan ante el regreso al trabajo.',
      page: 'Pág. 14',
      artifact: 'Olla de avena natural'
    },
    fotoDespues: {
      url: '/images/lullaby/img-13-nestum-barra-silicona.jpg',
      alt: 'Lata Nestum y plato de silicona en barra',
      caption: 'Lata Nestum lista en barra de cocina: disolución en 60 segundos entre reuniones de trabajo.',
      page: 'Pág. 17',
      artifact: 'Lata Nestum en barra desayunadora'
    },
    antes: {
      estado: 'Tiempo Completo en Cuidado Doméstico',
      comida: 'Avena natural cocinada en olla, licuada y tamizada a mano para cada desayuno.',
      tiempo: '30 a 45 minutos dedicados por toma.',
      emocional: 'Satisfacción del ideal de entrega maternal absoluta.'
    },
    detonante: 'Reanudación de responsabilidades de empleo con bebé en casa.',
    despues: {
      estado: 'Rutina Dual: Trabajo + Cuidados Simultáneos',
      comida: 'Soluciones instantáneas de cereal molido (Nestum) disueltas en 60 segundos con agua tibia.',
      tiempo: '2 a 3 minutos por preparación.',
      emocional: 'Búsqueda de "algo que me ayude pero que también lo nutra" sin sentimiento de culpa.'
    },
    impactoMarcas: {
      pierden: 'Recetas de avena natural que requieren procesador y cocción prolongada.',
      ganan: 'Nestum y cereales infantiles molidos sin azúcar con base de grano reconocible.'
    }
  },
  {
    id: 'trans-03',
    titulo: 'Transición Espacial: Desplazamiento Fuera de Casa (Ferias)',
    subtitulo: 'De la Cocina Hiperhigiénica a la Contingencia Callejera',
    fuente: 'Págs. 19, 20, 21 y 27',
    descripcion: 'Días familiares de comercio en puestos y tianguis obligan a operar sin agua corriente, sin refrigerador y sin estufas disponibles.',
    fotoAntes: {
      url: '/images/lullaby/img-19-esterilizador-electrico.jpg',
      alt: 'Esterilizador eléctrico en cocina doméstica',
      caption: 'Esterilizador y cocina impecable: el estándar doméstico inalcanzable en la calle.',
      page: 'Pág. 26',
      artifact: 'Esterilizador eléctrico doméstico'
    },
    fotoDespues: {
      url: '/images/lullaby/img-16-kit-gerber-maletin.jpg',
      alt: 'Kit Gerber en maletín transparente de supervivencia',
      caption: 'El kit de supervivencia: maletín hermético con papillas y puffs para 14 horas de feria.',
      page: 'Pág. 21',
      artifact: 'Maletín Kit Gerber'
    },
    antes: {
      estado: 'Entorno Controlado en Cocina',
      comida: 'Alimentos frescos preparados al momento, servidos calientes en platos de silicón lavados.',
      recursos: 'Esterilizador eléctrico, licuadora, refrigerador, agua de garrafón abundante.'
    },
    detonante: 'Salida de madrugada para instalación de puesto de feria de 12 a 14 horas de duración.',
    despues: {
      estado: 'Movilidad en Espacio Público Precario',
      comida: 'Alimentos estériles cerrados al vacío, consumibles a temperatura ambiente y snacks antiderrames.',
      recursos: 'Maletín "Kit Gerber", carriola, toallitas húmedas, producto de autoservicio.'
    },
    impactoMarcas: {
      pierden: 'Cualquier preparación casera que requiera refrigeración o calentar en estufa/microondas.',
      ganan: 'Frascos de papilla Gerber al vacío, Puffs de agarre autónomo, galletas de dentición y pouches portátiles.'
    }
  }
];

export const ACTORS = [
  {
    id: 'act-mama',
    nombre: 'Mamá (Decisora Central)',
    rol: 'Administradora de la alimentación y protectora de la salud infantil.',
    influencia: 'Máxima (decisión final de compra y preparación)',
    criterios: ['Salud del bebé', 'Cero azúcar añadida', 'Facilidad de preparación', 'Economía del hogar', 'Alivio mental'],
    citas: [
      '“Algo que me ayude, pero que también lo nutra.”',
      '“Necesito yo tener un descanso, un alivio… y sé que no lo estoy haciendo mal.”',
      '“Si a él no le gusta, si él lo rechaza, ya no se lo vuelvo a dar.”'
    ]
  },
  {
    id: 'act-bebe',
    nombre: 'Bebé (Árbitro Biológico y Sensorial)',
    rol: 'Consumidor final; posee poder de veto mediante aceptación, rechazo o respuesta digestiva.',
    influencia: 'Crítica / Inapelable (tolerancia intestinal y apetito)',
    criterios: ['Textura agradable (ni muy espesa ni grumosa)', 'Sabor suave', 'Digestión sin dolor ni diarrea'],
    citas: ['Respuesta observada: acepta, tolera, crece o escupe y llora.']
  },
  {
    id: 'act-pediatra',
    nombre: 'Pediatra (Autoridad Científica de Validación)',
    rol: 'Define lo permitido por etapa, calma ansiedades y autoriza la introducción de alimentos y leches.',
    influencia: 'Muy Alta (filtro previo a la decisión)',
    criterios: ['Desarrollo de curva pondoestatural', 'Prevención de alergias y disbiosis', 'Formulaciones actualizadas sin azúcar'],
    citas: ['“Nunca he tomado como una decisión a base de lo que veo; más bien esas decisiones las llevo como a mi pediatra.”']
  },
  {
    id: 'act-redes',
    nombre: 'Redes Sociales / TikTok (@lactancia.serena, etc.)',
    rol: 'Agenda de descubrimiento continuo; despierta dudas, expone nuevas tendencias y formula preguntas.',
    influencia: 'Media-Alta en Descubrimiento (nula en decisión autónoma)',
    criterios: ['Tendencias de crianza respetuosa', 'Baby-Led Weaning (BLW)', 'Crítica a azúcares y ultraprocesados'],
    citas: ['TikTok solo le dice qué preguntar. El algoritmo funciona como una agenda de temas.']
  },
  {
    id: 'act-abuelos',
    nombre: 'Familia Extensa / Abuelos',
    rol: 'Normalizan prácticas tradicionales, aportan experiencia histórica y flexibilizan las reglas en fines de semana.',
    influencia: 'Media en el hogar; Alta en reuniones dominicales',
    criterios: ['Tradición familiar', 'Comer lo que come la casa', '“Ya está grande para comer de todo”'],
    citas: ['Los domingos, los abuelos flexibilizan las reglas y el bebé participa más de lo que come la familia.']
  },
  {
    id: 'act-pareja',
    nombre: 'Pareja / Papá',
    rol: 'Participa en la compra y financiamiento; puede introducir productos prácticos o cuestionar gastos innecesarios.',
    influencia: 'Media (co-decisor en despensa y logística de traslados)',
    criterios: ['Presupuesto familiar', 'Practicidad en salidas compartidas', 'Bienestar del bebé'],
    citas: ['Participa y también pone límites. Puede introducir productos o cuestionar otros.']
  }
];

export const CONTEXTS = [
  {
    id: 'ctx-cocina',
    nombre: 'Cocina Doméstica Matutina',
    descripcion: 'Espacio de preparación cotidiana bajo presión horaria antes de iniciar labores o tareas del día.',
    friccion: 'Uso de licuadoras, tiempo de cocción de avena natural, lavado de ollas.',
    solucionesPredilectas: ['Nestum con agua', 'Porción familiar apartada antes de sal']
  },
  {
    id: 'ctx-mesa-familiar',
    nombre: 'Mesa Familiar Dominical',
    descripcion: 'Comida con abuelos y tíos donde se borra la frontera de alimentación especializada.',
    friccion: 'Presión social para convidar guisados familiares con condimento.',
    solucionesPredilectas: ['Comida compartida (arroz, tortilla, pollo)', 'Vaso entrenador en mesa']
  },
  {
    id: 'ctx-ferias',
    nombre: 'Puestos de Ferias y Comercio Ambulante',
    descripcion: 'Jornadas de más de 12 horas en la calle sin acceso a refrigeración, estufas ni agua corriente.',
    friccion: 'Riesgo microbiológico severo, falta de espacio para calentar, calor urbano.',
    solucionesPredilectas: ['Kit Gerber: papillas al vacío, galletas, puffs secos']
  },
  {
    id: 'ctx-despensa',
    nombre: 'Alacena Familiar Híbrida',
    descripcion: 'Espacio físico donde conviven marcas infantiles y abarrotes generales del hogar.',
    friccion: 'Competencia visual entre el sobreprecio del tarro especializado y el galón de leche familiar.',
    solucionesPredilectas: ['Repertorio multimarca (Gerber + Nestum + Leche familiar)']
  }
];

export const OPPORTUNITIES = [
  {
    id: 'opp-01',
    titulo: 'Línea de Insumos Infantiles Pre-procesados ("Base Cocina")',
    hallazgo: 'Mamá ya compra esterilizadores caros para ahorrarse tiempo y quiere seguir cocinando para su hijo, pero le agota el lavado, desinfección y picado minúsculo.',
    problema: 'La comida casera exige 40 minutos de trabajo previo de higiene y corte.',
    friccion: 'La preparación previa recae 100% en el tiempo libre de mamá.',
    condicionPreservar: 'La madre debe sentir que ella preparó y cocinó el platillo con amor, sin darle un ultraprocesado sintético.',
    oportunidad: 'Crear ingredientes infantiles limpios, desinfectados, porcionados en cubos al vacío o congelados para agregar directo a la olla familiar.',
    hipotesisSolucion: 'Si Gerber o Nestlé lanzan paquetes de verduras y proteínas con corte pediátrico grado biológico listas para hervir en 5 minutos, las madres pagarán un sobreprecio del 40% sobre el vegetal fresco por el ahorro de tiempo higiénico.',
    marcas: ['Gerber', 'Nestum'],
    nivel: 'HIPOTESIS',
    fuente: 'Pág. 26 del Reporte'
  },
  {
    id: 'opp-02',
    titulo: 'Nido como "Seguro Nutricional" vs. Bypass de Leche Entera',
    hallazgo: 'Nido sufre un bypass masivo al cumplir 1 año porque la leche entera es más barata y el niño la tolera sin diarrea.',
    problema: 'Nido se percibe como "otra leche cara" innecesaria cuando ya se puede tomar leche común.',
    friccion: 'Falta de un beneficio diferencial que justifique el gasto duplicado de lácteos en la alacena.',
    condicionPreservar: 'Cero azúcar añadida, sabor natural compatible con cereal y precio por toma competitivo.',
    oportunidad: 'Reposicionar Nido Kinder no como leche de reemplazo, sino como un escudo de micronutrientes (hierro quelado, zinc, vitamina D) que la leche pasteurizada estándar carece por naturaleza.',
    hipotesisSolucion: 'Si la comunicación de Nido explicita: "La leche entera llena, pero Nido nutre el cerebro en la etapa de 1 a 3 años", se reduce la tasa de bypass en un 35% en madres NSE C.',
    marcas: ['Nido'],
    nivel: 'HIPOTESIS',
    fuente: 'Págs. 7 y 9 del Reporte'
  },
  {
    id: 'opp-03',
    titulo: 'Kit Modular On-The-Go para Familias en Movimiento',
    hallazgo: 'Madres que trabajan en comercio o viajan arman manualmente cajas plásticas improvisadas con frascos y snacks para todo el día.',
    problema: 'Los frascos de vidrio pesan, pueden romperse en la bolsa y las latas no son ergonómicas para la calle.',
    friccion: 'Riesgo de contaminación de cubiertos y derrames en traslados de transporte público.',
    condicionPreservar: 'Inocuidad bacteriológica sin refrigerador y formatos manipulables con una sola mano.',
    oportunidad: 'Lanzar el "Kit Diario de Salida Gerber" con empaques pouch ligeros, resellables, cucharas esterilizadas desechables y compartimentos para puffs.',
    hipotesisSolucion: 'Un bundle de contingencia para jornadas largas aumentará la frecuencia de consumo fuera de casa y la lealtad de madres de comercio informal.',
    marcas: ['Gerber'],
    nivel: 'HIPOTESIS',
    fuente: 'Págs. 21 y 24 del Reporte'
  },
  {
    id: 'opp-04',
    titulo: 'Nestum como Enriquecedor de Recetas Familiares (No Papilla Aislada)',
    hallazgo: 'La avena natural sigue siendo el estándar supremo; Nestum gana cuando se usa para texturizar y complementar en el desayuno de la casa.',
    problema: 'Si Nestum solo se vende como "papilla de bebé", caduca cuando el niño quiere masticar sólidos familiares.',
    friccion: 'Riesgo de abandono del producto cuando el niño cumple 15-18 meses y pide hot cakes o fruta picada.',
    condicionPreservar: 'Base de avena integral pura y facilidad de disolución instantánea en agua o leche.',
    oportunidad: 'Transformar Nestum en un multiplicador nutricional para espesar licuados infantiles, rebozar fruta fresca o hacer panqueques nutritivos en 2 minutos.',
    hipotesisSolucion: 'Al promover usos mixtos de cocina familiar, se prolonga el ciclo de vida del consumidor de cereales infantiles de los 12 meses hasta los 36 meses.',
    marcas: ['Nestum'],
    nivel: 'HIPOTESIS',
    fuente: 'Págs. 16, 17 y 18 del Reporte'
  }
];

export const BRAND_MATRIX = [
  {
    marca: 'Nido',
    color: '#eab308',
    momentoObservado: 'Incorporación progresiva a la alimentación familiar (Págs. 3–9)',
    papelEnDiscusion: 'Qué aporta un paso especializado después de la fórmula cuando la leche entera ya es tolerada.',
    sostieneUso: 'Una función reconocible dentro de la nueva etapa (seguro nutricional, defensas, costumbre familiar).',
    poneAPruebaRelevancia: 'La leche entera común y la comida familiar amplían las alternativas cotidianas más económicas.',
    estrategiaRecomendada: 'Demostrar superioridad de micronutrientes frente a leche pasteurizada genérica y eliminar cualquier sospecha de azúcar añadida.',
    imagenUrl: '/images/lullaby/img-04-nido-alacena.jpg',
    imagenAlt: 'Lata de Nido Kinder conviviendo con abarrotes en alacena familiar',
    artefacto: 'Lata Nido Kinder (Tapa Roja)',
    fotoHabitat: 'Alacena doméstica compartida con café y condimentos de adultos'
  },
  {
    marca: 'Nestum',
    color: '#0ea5e9',
    momentoObservado: 'Menos tiempo para preparar + ampliación del repertorio (Págs. 10–18)',
    papelEnDiscusion: 'Simplificar la preparación de un cereal ya valorado (avena) sin obligar a cambiar la lógica de alimentación.',
    sostieneUso: 'Facilidad de preparación instantánea en agua + posibilidad de que mamá adapte porción, consistencia y combinación con fruta.',
    poneAPruebaRelevancia: 'El crecimiento del bebé incorpora más opciones de desayuno y cena sólida en la mesa familiar.',
    estrategiaRecomendada: 'Evolucionar hacia facilitador de preparaciones familiares (smoothies, hot cakes de avena en 1 minuto) conservando el sello "Sin Azúcar Añadida".',
    imagenUrl: '/images/lullaby/img-13-nestum-barra-silicona.jpg',
    imagenAlt: 'Lata de Nestum Avena y plato de silicona rosa en barra de cocina',
    artefacto: 'Lata Nestum Avena y plato de silicona',
    fotoHabitat: 'Barra de cocina matutina con preparación rápida de 2 cucharadas'
  },
  {
    marca: 'Gerber',
    color: '#3b82f6',
    momentoObservado: 'Jornadas largas fuera de casa / Contingencia en ferias (Págs. 19–27)',
    papelEnDiscusion: 'Tener distintas soluciones disponibles y seguras para resolver la comida fuera del hogar sin cocina.',
    sostieneUso: 'Confianza acumulada producto a producto + variedad de formatos (papillas, cereales, galletas, puffs) + alta disponibilidad en paquete.',
    poneAPruebaRelevancia: 'Resolver más situaciones sin aumentar el trabajo previo de mamá.',
    estrategiaRecomendada: 'Desarrollar formatos on-the-go irrompibles para movilidad urbana y abrir la categoría hacia insumos limpios pre-cortados para cocinar en casa.',
    imagenUrl: '/images/lullaby/img-16-kit-gerber-maletin.jpg',
    imagenAlt: 'Caja organizadora plástica Kit Gerber con papillas y cubiertos',
    artefacto: 'Maletín organizador Kit Gerber',
    fotoHabitat: 'Maletín plástico portátil listo para jornadas de 14 horas en ferias'
  }
];

export const TRANSVERSAL_BRIDGE = [
  {
    eje: 'La alimentación cambia rápido',
    descripcion: 'En pocos meses se amplían alimentos, texturas, utensilios y posibilidades de compartir la comida familiar. Lo especializado caduca velozmente si no se adapta.'
  },
  {
    eje: 'Las decisiones incorporan varias fuentes',
    descripcion: 'Pediatra, familia extensa, redes (TikTok), etiqueta frontal y experiencia directa participan con pesos distintos según la mamá y el producto.'
  },
  {
    eje: 'El bebé participa en la decisión',
    descripcion: 'Aceptación inmediata, rechazo, tolerancia digestiva y apetito modifican qué se vuelve a ofrecer y cómo se prepara.'
  },
  {
    eje: 'El tiempo modifica la forma de resolver',
    descripcion: 'Trabajo remoto, salidas de feria y jornadas familiares hacen que algunas preparaciones caseras necesiten alternativas más sencillas sin degradar el estándar moral.'
  }
];
