// Spanish (es) content for the demo seed — keyed by slug and applied to the
// `translations` column of each entity ({"es": {…}}). English remains the
// base language in the main columns; every field here overrides it when the
// active locale is Spanish. Project titles are proper names and stay in
// English by design.

export type SpecEs = { label: string; value: string };

export type ProjectEs = {
  summary?: string;
  description?: string;
  highlights?: string[];
  specs?: SpecEs[];
  capacity?: string;
  production?: string;
  permits?: string;
};

export type MandateEs = {
  title?: string;
  description?: string;
};

export type CommodityEs = {
  title?: string;
  description?: string;
  specs?: SpecEs[];
  volume?: string;
  deliveryLocation?: string;
  priceDetails?: string;
};

const PROJECT_ES_A: Record<string, ProjectEs> = {
  "atacama-blue-desalination-plant": {
    summary: "Planta desaladora de osmosis inversa de 1.050 l/s en operación, con contratos take-or-pay de largo plazo que abastecen operaciones mineras en el norte de Chile.",
    description: "Atacama Blue es uno de los mayores activos de desalación de propiedad privada en la Región de Antofagasta. Puesta en servicio en 2019, la planta produce hasta 1.050 litros por segundo de agua de calidad industrial, entregada a través de una red de tuberías de 62 km a tres clientes mineros de primer nivel bajo contratos take-or-pay con una vida remanente ponderada de 14 años.\n\nEl activo cuenta con permisos ambientales completos (RCA), una concesión marítima a 30 años y un permiso de ampliación que permite duplicar la capacidad sobre la huella existente. Los ingresos están 100% denominados en USD e indexados a inflación, con márgenes EBITDA contratados superiores al 40%.\n\nLos actuales propietarios — un fondo de infraestructura que llega al término de su período de inversión — buscan una venta parcial de hasta el 60% del capital accionario. Los equipos de gestión, operación y mantenimiento permanecen en sus funciones, lo que ofrece una entrada verdaderamente llave en mano al mercado de infraestructura hídrica más atractivo de América Latina.",
    highlights: [
      "Contratos take-or-pay con 3 mineras de primer nivel (vida ponderada de 14 años)",
      "Ingresos 100% denominados en USD e indexados a inflación",
      "El permiso de ampliación permite duplicar la capacidad sobre la huella existente",
      "Margen EBITDA superior al 40% con trayectoria operativa comprobada",
    ],
    specs: [
      { label: "Tecnología", value: "SWRO con recuperación de energía (ERI)" },
      { label: "Red de tuberías", value: "62 km, 3 puntos de entrega" },
      { label: "Suministro eléctrico", value: "PPA con proveedor solar hasta 2035" },
      { label: "Disponibilidad (2025)", value: "97,8%" },
    ],
    capacity: "1.050 l/s de osmosis inversa",
    production: "31,5 Mm³/año entregados",
    permits: "RCA aprobada · Concesión marítima a 30 años · Permiso de ampliación otorgado",
  },
  "vizcachas-copper-project": {
    summary: "Proyecto de cobre en exploración avanzada con recurso inferido de 480 Mt a 0,52% Cu, a 40 km de infraestructura ferroviaria y eléctrica existente.",
    description: "El Proyecto de Cobre Vizcachas abarca 8.200 hectáreas de terreno altamente prospectivo para pórfidos cupríferos en la Región de Coquimbo, Chile. Desde 2018 se han perforado más de 68.000 metros que han definido un recurso inferido de 480 Mt a 0,52% Cu con una ley de corte de 0,2%, incluido un núcleo de mayor ley de 120 Mt a 0,71% Cu.\n\nUna Evaluación Económica Preliminar (PEA) de 2025 contempla una operación convencional de flotación de 60 ktpd, con una producción de 95 kt de cobre en concentrado al año durante una vida de mina inicial de 18 años y costos C1 en el segundo cuartil de la curva de costos global. El proyecto se ubica a 40 km de la red eléctrica nacional y de una línea férrea operativa hacia el puerto de Coquimbo.\n\nLos propietarios buscan un socio estratégico que financie la factibilidad y la construcción mediante un earn-in por etapas o una adquisición total. La estrategia hídrica se basa en suministro desalado contratado, y existen acuerdos comunitarios vigentes con las tres comunidades vecinas.",
    highlights: [
      "Recurso inferido de 480 Mt a 0,52% Cu, abierto en profundidad y a lo largo del rumbo",
      "PEA (2025): NPV8 de USD 1.100M, IRR de 24% a USD 4,20/lb de cobre",
      "A 40 km de la red eléctrica y de un ferrocarril operativo a puerto",
      "Acuerdos comunitarios firmados con todas las comunidades vecinas",
    ],
    specs: [
      { label: "Recurso", value: "480 Mt @ 0,52% Cu (inferido)" },
      { label: "Núcleo de alta ley", value: "120 Mt @ 0,71% Cu" },
      { label: "Perforación completada", value: "68.400 m (diamantina + aire reverso)" },
      { label: "Vida de mina (PEA)", value: "18 años iniciales" },
    ],
    capacity: "Planta de proceso de 60 ktpd (diseño PEA)",
    production: "95 kt/año de cobre en concentrado (planificado)",
    permits: "Permisos de exploración vigentes · Estudios de línea base del EIA con 80% de avance",
  },
  "magallanes-green-hydrogen-ammonia": {
    summary: "Proyecto de hidrógeno verde a amoníaco a escala industrial en el sur de Chile, con recurso eólico de 1,4 GW, acceso portuario y prefactibilidad concluida.",
    description: "Este proyecto convertirá el recurso eólico de clase mundial de Magallanes — con factores de planta superiores al 55% — en amoníaco verde para exportación a Europa y Asia. El desarrollo comprende 1,4 GW de energía eólica terrestre, 850 MW de electrólisis, un circuito de síntesis de amoníaco de 720 ktpa y un terminal de exportación dedicado en el Estrecho de Magallanes.\n\nLa prefactibilidad se completó en 2025 con un costo nivelado de amoníaco proyectado en el decil más bajo a nivel global. Los terrenos están asegurados mediante opciones de largo plazo sobre 41.000 hectáreas, las campañas de torres de medición acumulan 4 años de datos eólicos bancables y la solicitud de concesión marítima se encuentra en su etapa final.\n\nLos patrocinadores buscan un socio estratégico para un joint venture que financie la etapa de factibilidad y el FEED, con FID objetivo en 2028. Las conversaciones de offtake están avanzadas con dos utilities europeas y una casa comercial japonesa.",
    highlights: [
      "Factores de planta eólicos superiores al 55% — entre los mejores del planeta",
      "Costo nivelado de amoníaco proyectado en el decil más bajo a nivel global",
      "4 años de datos eólicos bancables de torres de medición",
      "Conversaciones de offtake avanzadas con compradores europeos y asiáticos",
    ],
    specs: [
      { label: "Recurso eólico", value: "9,2 m/s promedio a 120 m de altura de buje" },
      { label: "Tecnología de electrólisis", value: "PEM, módulos de 20 MW" },
      { label: "Terminal de exportación", value: "Muelle dedicado, buques de 25.000 DWT" },
      { label: "Respaldo de red", value: "Sistema aislado con BESS de 120 MWh" },
    ],
    capacity: "1,4 GW eólicos · 850 MW de electrólisis · 720 ktpa de NH₃",
    production: "FID objetivo en 2028 · primer amoníaco en 2031",
    permits: "Opciones sobre terrenos aseguradas · concesión marítima en revisión final",
  },
  "huayra-zinc-copper-mine": {
    summary: "Mina subterránea de zinc y cobre en producción en el centro de Perú — 1,8 Mtpa de procesamiento, EBITDA de USD 74M y 11 años de vida de reservas.",
    description: "Huayra es una operación polimetálica subterránea consolidada en el prolífico cinturón central de Perú, en producción continua desde 2009. La mina procesa 1,8 Mtpa a través de un circuito convencional de chancado, molienda y flotación que produce concentrados separados de zinc y cobre, con créditos de plata.\n\nLas reservas actuales sustentan una vida de 11 años al ritmo de procesamiento vigente, con 9 Mt adicionales de recursos medidos e indicados que ofrecen un claro potencial de conversión. Un desembotellamiento de planta ejecutado en 2024 elevó la recuperación en 3,2 puntos porcentuales, y un programa de exploración en curso ha interceptado mineralización 400 m por debajo de las labores actuales.\n\nEl grupo familiar que controla el activo busca una venta parcial del 30–49% para financiar la expansión Deep Huayra, con una ruta opcional hacia el control. La operación cuenta con la totalidad de sus permisos, se abastece de la red eléctrica nacional y mantiene convenios colectivos vigentes con sus dos sindicatos hasta 2027.",
    highlights: [
      "16 años consecutivos de producción rentable",
      "11 años de vida de reservas, más potencial de conversión de 9 Mt de recursos M&I",
      "Intersecciones de Deep Huayra 400 m por debajo de las labores actuales",
      "Los créditos de plata cubren ~35% de los costos operativos del sitio",
    ],
    specs: [
      { label: "Método de explotación", value: "Sublevel stoping con relleno en pasta" },
      { label: "Producción 2025", value: "82 kt Zn, 14 kt Cu, 2,1 Moz Ag" },
      { label: "AISC", value: "USD 0,61/lb Zn neto de créditos" },
      { label: "Offtake de concentrados", value: "Contratado hasta 2027" },
    ],
    capacity: "1,8 Mtpa subterránea",
    production: "82 kt Zn + 14 kt Cu en concentrado (2025)",
    permits: "Totalmente permisada · modificación del EIA para la expansión en trámite",
  },
  "ica-valley-agro-export-platform": {
    summary: "Productor-exportador verticalmente integrado de arándanos y paltas con 1.850 hectáreas plantadas, planta de empaque y programas con retailers de EE.UU. y Europa.",
    description: "Esta plataforma consolida tres predios agrícolas contiguos del valle de Ica, en Perú, en uno de los exportadores de fruta fresca más eficientes del país. La operación gestiona 1.850 hectáreas plantadas — 1.050 de arándanos y 800 de palta Hass — respaldadas por una planta de empaque de 28.000 m² con 14 líneas de proceso, almacenamiento en frío para 6.200 pallets y derechos de agua preferentes complementados por 42 pozos con licencia.\n\nLa fruta se embarca bajo programas de temporada completa con retailers de Estados Unidos y Europa, con el 78% del volumen precomprometido para la campaña 2026. Los campos de arándano están en transición hacia genética de mayor rendimiento, con 320 hectáreas ya replantadas que superan en un 40% a las variedades tradicionales.\n\nLos accionistas buscan capital de crecimiento para completar la transición genética e incorporar 600 hectáreas de tierra lista para plantar que ya se encuentran bajo su control, con el objetivo de duplicar el EBITDA hacia 2029. Se ofrece una participación minoritaria con derechos de gobernanza; con compradores estratégicos puede discutirse una transacción de mayor tamaño.",
    highlights: [
      "78% del volumen de la campaña 2026 precomprometido con retailers de EE.UU. y Europa",
      "La nueva genética supera en 40% el rendimiento de las variedades tradicionales de arándano",
      "Derechos de agua preferentes más 42 pozos con licencia",
      "600 hectáreas adicionales bajo control, listas para plantar",
    ],
    specs: [
      { label: "Superficie plantada", value: "1.050 ha de arándano · 800 ha de palta" },
      { label: "Certificaciones", value: "GlobalG.A.P., SMETA, GRASP, HACCP" },
      { label: "Logística", value: "3,5 h al puerto del Callao, cadena de frío propia" },
      { label: "Dotación máxima", value: "4.800 personas en temporada de cosecha" },
    ],
    capacity: "28.000 m² de empaque · almacenamiento en frío para 6.200 pallets",
    production: "19.400 t de arándanos · 11.200 t de palta (2025)",
    permits: "Certificación SENASA · GlobalG.A.P. · auditoría SMETA",
  },
  "bajio-automotive-components-plant": {
    summary: "Planta Tier-1 de fundición a presión y mecanizado de aluminio en el corredor del Bajío, México — posicionada bajo el T-MEC, 92% de utilización de capacidad y contratos con OEMs de primer nivel.",
    description: "Estratégicamente ubicado en el corredor automotriz de Querétaro, este proveedor Tier-1 produce componentes estructurales de aluminio fundido a alta presión y ensambles mecanizados de precisión para plataformas OEM de Norteamérica. La instalación de 42.000 m² opera 11 celdas de fundición a presión (400–2.700 t) y 38 centros de mecanizado CNC, y cuenta con las certificaciones IATF 16949 e ISO 14001.\n\nLa planta opera al 92% de utilización con contratos de plataforma vigentes hasta 2031, incluidos dos programas estructurales para vehículos eléctricos recientemente adjudicados que inician su ramp-up en 2027. La demanda derivada del nearshoring ha llevado el pipeline comercial a un récord de USD 140M en nuevos negocios cotizados.\n\nEl grupo internacional propietario de la planta desinvierte para concentrarse en su núcleo europeo. La transacción se estructura como venta total de la entidad mexicana, incluyendo terreno, equipamiento, capital de trabajo y plantilla laboral, con una gerencia dispuesta a permanecer tras el cierre.",
    highlights: [
      "92% de utilización de capacidad con contratos hasta 2031",
      "Dos programas estructurales para vehículos eléctricos adjudicados, con ramp-up en 2027",
      "Pipeline de nuevos negocios cotizados por USD 140M impulsado por el nearshoring",
      "Cumplimiento de contenido regional bajo el T-MEC (USMCA)",
    ],
    specs: [
      { label: "Rango de fundición a presión", value: "400 t – 2.700 t de fuerza de cierre" },
      { label: "Clientes clave", value: "3 OEMs globales, 2 sistemistas Tier-1" },
      { label: "Calidad", value: "12 PPM móviles a 12 meses" },
      { label: "Energía", value: "4,2 MW de solar en techo (30% de la carga)" },
    ],
    capacity: "11 celdas HPDC (400–2.700 t) · 38 centros CNC",
    production: "9,4 M de componentes/año",
    permits: "IATF 16949 · ISO 14001 · programa IMMEX",
  },
  "sonora-solar-park-210mw": {
    summary: "Planta solar fotovoltaica de 210 MWac en operación en Sonora, con estructura híbrida de PPA, generación P50 de 585 GWh/año y potencial de repotenciación.",
    description: "Puesto en operación en 2021, Sonora Solar Park se extiende sobre 640 hectáreas de desierto de alta irradiancia, con un rendimiento P50 de 585 GWh anuales. La planta opera bajo una estructura híbrida de ingresos: el 70% de la producción está contratada bajo un PPA a 15 años denominado en USD con un offtaker industrial de grado de inversión, y el remanente se vende a precios nodales que han promediado por encima de los niveles del PPA durante los últimos tres años.\n\nEl activo utiliza seguidores de un eje y módulos bifaciales de 1500 V, con una disponibilidad del 99,1% desde la COD. Una ampliación de interconexión ya aprobada permite añadir 80 MW de capacidad más un sistema de baterías de 100 MWh en un terreno adyacente bajo opción.\n\nEl fondo vendedor sale al término de su ciclo de vida. Se trata de un activo operativo limpio y totalmente contratado, con potencial de desarrollo, idóneo para inversionistas de infraestructura enfocados en yield que busquen exposición al norte industrial de México.",
    highlights: [
      "70% contratado bajo PPA a 15 años en USD con offtaker de grado de inversión",
      "99,1% de disponibilidad desde el inicio de la operación comercial",
      "Interconexión aprobada para +80 MW y BESS de 100 MWh",
      "Margen EBITDA superior al 80%",
    ],
    specs: [
      { label: "Tecnología", value: "Bifacial 1500 V, seguidores de un eje" },
      { label: "COD", value: "Marzo de 2021" },
      { label: "Degradación observada", value: "0,42%/año" },
      { label: "O&M", value: "Contratado hasta 2029, full-wrap" },
    ],
    capacity: "210 MWac / 268 MWdc",
    production: "585 GWh/año (P50)",
    permits: "Permiso de generación pleno · ampliación de interconexión aprobada",
  },
  "desert-gateway-data-center-campus": {
    summary: "Campus de centros de datos de 300 MW apto para hyperscalers, en construcción en Arizona — terreno con energía asegurada, refrigeración con neutralidad hídrica y primeros 60 MW prearrendados.",
    description: "Desert Gateway es un campus de centros de datos de 120 acres en el área metropolitana de Phoenix, uno de los mercados de infraestructura digital de mayor crecimiento en Norteamérica. El proyecto cuenta con un acuerdo firmado de capacidad eléctrica de 300 MW con la utility local — con 90 MW entregables en 2027 — y un sitio con todos los permisos de uso de suelo, nivelación completada y corredores de servicios ejecutados.\n\nEl Edificio A (60 MW de carga IT) está en construcción con entrega programada para el tercer trimestre de 2027 y se encuentra íntegramente prearrendado a un hyperscaler de grado de inversión bajo una estructura triple-net a 15 años. Los Edificios B y C (240 MW combinados) están en etapa de diseño de obra gruesa, con dos hyperscalers en negociaciones avanzadas de arrendamiento.\n\nEl desarrollador busca socios de capital para los USD 1.100M restantes de construcción, ya sea a nivel de proyecto o mediante un joint venture programático. El campus emplea refrigeración líquida de circuito cerrado que logra neutralidad hídrica — una ventaja decisiva en materia de permisos en el suroeste de Estados Unidos.",
    highlights: [
      "300 MW de energía asegurada en un mercado con restricciones de suministro",
      "Edificio A 100% prearrendado, NNN a 15 años, inquilino de grado de inversión",
      "Diseño de refrigeración de circuito cerrado con neutralidad hídrica",
      "Phoenix: pipeline de demanda hyperscale superior a 5 GW",
    ],
    specs: [
      { label: "Sitio", value: "120 acres, con permisos de uso de suelo completos" },
      { label: "Entrega de energía", value: "90 MW en 2027, 300 MW hacia 2030" },
      { label: "PUE de diseño", value: "1,18 anualizado" },
      { label: "Fibra", value: "3 rutas de larga distancia adyacentes" },
    ],
    capacity: "300 MW de carga IT total (60 MW en construcción)",
    production: "Entrega del Edificio A: T3 2027",
    permits: "Permisos de uso de suelo completos · acuerdo de capacidad de 300 MW firmado con la utility",
  },
  "andalucia-solar-portfolio-240mw": {
    summary: "Cuatro plantas solares fotovoltaicas en operación en el sur de España que suman 240 MW, con una mezcla de ingresos regulados y merchant con piso de PPA.",
    description: "Este portafolio agrupa cuatro plantas fotovoltaicas a escala industrial en las provincias de Sevilla, Córdoba y Jaén, todas conectadas a red entre 2020 y 2023. La producción combinada P50 es de 468 GWh anuales, con una irradiancia entre las más altas de Europa continental.\n\nLos ingresos combinan el marco regulado español (38% de la producción), un PPA pay-as-produced a 10 años con una utility europea (41%) y exposición merchant con piso contratado (21%). Todas las plantas comparten un mismo proveedor de O&M con una garantía de disponibilidad del 98,5% a nivel de portafolio.\n\nEl sponsor desinvierte el 100% de la sociedad holding en una transacción limpia de compraventa de acciones. La capacidad de red disponible en dos subestaciones permite 60 MW de hibridación incremental (almacenamiento o eólica), y la tramitación de permisos para una batería de 50 MWh en el sitio de Córdoba está en curso.",
    highlights: [
      "Ingresos diversificados: regulados + PPA + merchant con piso",
      "Irradiancia entre las más altas de Europa continental",
      "Margen de hibridación de 60 MW en las conexiones de red existentes",
      "Transacción limpia de acciones sobre una única sociedad holding",
    ],
    specs: [
      { label: "Plantas", value: "4 (52–71 MW cada una)" },
      { label: "CODs", value: "2020–2023" },
      { label: "Disponibilidad del portafolio", value: "98,5% garantizada" },
      { label: "Pipeline de almacenamiento", value: "BESS de 50 MWh en tramitación" },
    ],
    capacity: "240 MW en 4 plantas",
    production: "468 GWh/año (P50)",
    permits: "Todas las plantas totalmente permisadas y en operación",
  },
  "valencia-cold-chain-terminal": {
    summary: "Terminal logístico refrigerado adyacente al puerto que atiende exportaciones agroalimentarias del Mediterráneo — 38.000 posiciones de pallet, 96% de ocupación y ramal ferroviario.",
    description: "Ubicada a 1,8 km de los terminales de contenedores del Puerto de Valencia, esta plataforma logística de cadena de frío es un nodo crítico para los productos frescos españoles y norteafricanos con destino a los mercados europeos. La instalación ofrece 38.000 posiciones de pallet en cinco regímenes de temperatura, 42 andenes de carga, aduana y puestos de inspección fronteriza en sitio, y un ramal ferroviario privado con servicios reefer diarios.\n\nLa ocupación ha promediado un 96% durante los últimos cuatro años, con una base de clientes contratados de exportadores, importadores y 3PLs bajo acuerdos plurianuales. Una conversión del sistema de refrigeración de amoníaco a CO₂ realizada en 2024 redujo los costos de energía en un 18%, complementada por una instalación solar en techo de 2,8 MW.\n\nLos propietarios familiares considerarán una venta parcial de hasta el 49%, junto con un acuerdo de continuidad de la gerencia, para financiar una ampliación ya permisada de 12.000 pallets en terreno propio adyacente.",
    highlights: [
      "A 1,8 km de los terminales de contenedores del Puerto de Valencia",
      "96% de ocupación con clientes contratados bajo acuerdos plurianuales",
      "Ampliación permisada de 12.000 pallets en terreno propio",
      "Reducción del 18% en costos de energía tras la conversión del sistema de refrigeración",
    ],
    specs: [
      { label: "Regímenes de temperatura", value: "5 (−25 °C a +14 °C)" },
      { label: "Ferrocarril", value: "Ramal privado, servicio reefer diario" },
      { label: "Servicios en sitio", value: "Aduana, SOIVRE, inspección fronteriza" },
      { label: "Solar", value: "2,8 MW en techo" },
    ],
    capacity: "38.000 posiciones de pallet · 42 andenes",
    production: "96% de ocupación promedio (2022–2025)",
    permits: "Licencias de operación vigentes · permiso de ampliación otorgado",
  },
  "fujairah-bulk-liquids-terminal": {
    summary: "Terminal de almacenamiento de graneles líquidos en operación en el Puerto de Fujairah — 480.000 m³ de capacidad, acceso a muelle de aguas profundas y contratos de almacenamiento take-or-pay.",
    description: "Situado en el segundo mayor hub de bunkering del mundo, fuera del Estrecho de Ormuz, este terminal ofrece 480.000 m³ de almacenamiento en 34 tanques para productos limpios del petróleo, biocombustibles y químicos. El activo goza de acceso a muelle de aguas profundas para buques de hasta clase Suezmax, conectividad directa por ductos a la infraestructura de uso común del puerto y terreno reservado para una ampliación de 120.000 m³.\n\nLa capacidad está contratada en un 94% bajo acuerdos take-or-pay con traders internacionales y una compañía petrolera nacional, con un plazo remanente promedio ponderado de 4,2 años. El terminal registra cero incidentes con tiempo perdido durante seis años consecutivos y mantiene la totalidad de sus certificaciones HSE.\n\nEl propietario, una plataforma regional de infraestructura, ofrece una participación accionaria del 40–60% para financiar la diversificación hacia el almacenamiento de combustibles renovables, incluida la conversión — en etapa de factibilidad — de seis tanques para SAF y metanol.",
    highlights: [
      "Hub de bunkering #2 del mundo, fuera del Estrecho de Ormuz",
      "94% de la capacidad contratada bajo esquemas take-or-pay",
      "Muelle de aguas profundas para buques Suezmax",
      "Terreno reservado para una ampliación de +120.000 m³",
    ],
    specs: [
      { label: "Rango de tanques", value: "2.000 – 40.000 m³" },
      { label: "Productos", value: "CPP, biocombustibles, químicos" },
      { label: "Calado del muelle", value: "16,5 m" },
      { label: "Historial de seguridad", value: "6 años sin incidentes con tiempo perdido (LTI)" },
    ],
    capacity: "480.000 m³ · 34 tanques",
    production: "94% contratado (take-or-pay)",
    permits: "Concesión plena de la autoridad portuaria hasta 2043",
  },
  "pilbara-west-lithium-project": {
    summary: "Proyecto de litio en roca dura en Australia Occidental que entra en construcción — 41 Mt a 1,32% de Li₂O y offtake vinculante por el 60% de la producción.",
    description: "Pilbara West es un proyecto de espodumeno listo para construcción en el principal distrito de litio de Australia Occidental. El Estudio de Factibilidad Definitivo (DFS) de 2025 define reservas de mineral de 41 Mt a 1,32% de Li₂O que sustentan una concentradora de 2,4 Mtpa, con una producción aproximada de 340 ktpa de concentrado SC5.5 durante una vida de mina inicial de 14 años.\n\nLas obras tempranas comenzaron en el primer trimestre de 2026: la instalación del campamento, los caminos de acceso y el movimiento masivo de tierras presentan un 30% de avance. Los acuerdos de offtake vinculantes cubren el 60% de la producción nominal con dos fabricantes asiáticos de cátodos, ambos con facilidades de prepago. Todas las aprobaciones principales — concesiones mineras, acuerdos de título nativo y licenciamiento ambiental — están obtenidas.\n\nLa compañía busca entre USD 300M y USD 450M de financiamiento a nivel de proyecto para completar la construcción, estructurado como equity, streaming o una combinación de ambos. El primer concentrado está previsto para el segundo semestre de 2028, con una posición proyectada en el primer cuartil de costos.",
    highlights: [
      "DFS completo: reserva de 41 Mt @ 1,32% Li₂O",
      "Offtake vinculante por el 60% de la producción, con prepagos",
      "Obras tempranas con 30% de avance",
      "Posición de costos proyectada en el primer cuartil",
    ],
    specs: [
      { label: "Reserva", value: "41 Mt @ 1,32% Li₂O" },
      { label: "Vida de mina", value: "14 años iniciales" },
      { label: "Puerto", value: "Port Hedland, 145 km de camino pavimentado" },
      { label: "Energía", value: "Contrato IPP híbrido gas-solar-BESS" },
    ],
    capacity: "Concentradora de 2,4 Mtpa (diseño DFS)",
    production: "Objetivo de 340 ktpa de SC5.5 · primera producción en S2 2028",
    permits: "Concesiones mineras otorgadas · acuerdos de título nativo suscritos",
  },
  "riverina-almond-estate": {
    summary: "Portafolio de huertos de almendros de 3.400 hectáreas en Nueva Gales del Sur con descascarado y procesamiento en sitio; incluye 19 GL de derechos de agua de alta seguridad.",
    description: "Una de las mayores plataformas de almendras de propiedad privada de Australia, Riverina Estate comprende 3.400 hectáreas plantadas en tres propiedades de la región de Murrumbidgee, en Nueva Gales del Sur, con una edad promedio de huerto de nueve años — entrando en su rendimiento máximo. La venta incluye 19 GL de derechos de agua de alta seguridad, un complejo de descascarado y pelado en sitio con capacidad de 28.000 t/año y generación de energía a partir de biomasa de residuos de cáscara.\n\nLa producción de 2025 alcanzó 11.800 toneladas equivalentes de kernel, comercializadas mediante programas establecidos hacia India, Europa y fabricantes del mercado interno. El modelo integrado captura el margen de procesamiento que habitualmente pierden los productores.\n\nEl propietario institucional desinvierte como parte de un rebalanceo de portafolio. El activo es idóneo para fondos de pensiones, plataformas agrícolas o procesadores estratégicos que busquen exposición de escala, con seguridad hídrica, a cultivos permanentes en un distrito comprobado.",
    highlights: [
      "Huertos entrando en sus años de rendimiento máximo (edad promedio: 9 años)",
      "19 GL de derechos de agua de alta seguridad incluidos en la venta",
      "El procesamiento integrado captura el margen de toda la cadena de valor",
      "La energía de biomasa de cáscara cubre el 60% de la carga de procesamiento",
    ],
    specs: [
      { label: "Superficie plantada", value: "3.400 ha en 3 propiedades" },
      { label: "Variedades", value: "Nonpareil 55%, Carmel, Monterey" },
      { label: "Riego", value: "Goteo total, automatizado por humedad de suelo" },
      { label: "Mercados", value: "India, UE, mercado interno" },
    ],
    capacity: "28.000 t/año de descascarado y pelado",
    production: "11.800 t equivalentes de kernel (2025)",
    permits: "Derechos de agua: 19 GL de alta seguridad incluidos",
  },
  "casablanca-atlantic-industrial-park": {
    summary: "Parque industrial y logístico de 220 hectáreas en expansión cerca de Casablanca — 74% arrendado, estatus de zona franca y arrendatarios ancla de los sectores automotriz y textil.",
    description: "Casablanca Atlantic es un parque industrial consolidado a 28 km del Puerto de Casablanca y a 19 km del Aeropuerto Internacional Mohammed V, en el corazón del corredor manufacturero de Marruecos. Las Fases 1 y 2 (140 ha) están arrendadas en un 74% a 38 arrendatarios, incluidos fabricantes europeos de componentes automotrices, exportadores textiles y 3PLs regionales, con los beneficios del régimen fiscal de zona franca y aduana en sitio.\n\nLa Fase 3 (80 ha) está urbanizada y lista para su desarrollo, con un pipeline build-to-suit de 190.000 m² en negociación — anclado por un fabricante de arneses para vehículos eléctricos en expansión desde Europa. El parque ofrece doble alimentación eléctrica, planta propia de tratamiento de aguas residuales y fibra dedicada.\n\nEl desarrollador busca un socio de capital para la construcción de la Fase 3 y la expansión del banco de tierras, mediante equity preferente en la matriz o una participación en la sociedad propietaria del parque. La plataforma exportadora de Marruecos hacia Europa continúa atrayendo niveles récord de inversión extranjera directa, y la vacancia industrial en el Gran Casablanca se sitúa por debajo del 3%.",
    highlights: [
      "Estatus de zona franca con aduana en sitio",
      "74% arrendado a 38 arrendatarios, con ancla del sector automotriz",
      "Pipeline build-to-suit de 190.000 m² en negociación",
      "Vacancia industrial en el Gran Casablanca inferior al 3%",
    ],
    specs: [
      { label: "Ubicación", value: "28 km al puerto, 19 km al aeropuerto" },
      { label: "Servicios", value: "Doble alimentación eléctrica, planta de tratamiento de aguas propia, fibra" },
      { label: "Mix de arrendatarios", value: "Automotriz, textil, logística" },
      { label: "WALT", value: "6,8 años" },
    ],
    capacity: "220 ha totales · 80 ha listas para la Fase 3",
    production: "74% arrendado (Fases 1–2)",
    permits: "Estatus de zona franca · Fase 3 totalmente urbanizada y permisada",
  },
};

const PROJECT_ES_B: Record<string, ProjectEs> = {
  "patagonia-wind-farm-repowering": {
    summary:
      "Repotenciación de un parque eólico existente de 48 MW en la Patagonia argentina hasta 120 MW con aerogeneradores de nueva generación.",
    description:
      "Oportunidad de repotenciación de un parque eólico puesto en marcha en 2009 en la provincia de Chubut. El proyecto reemplaza 32 aerogeneradores originales por 20 unidades modernas de 6 MW, aprovechando los derechos de conexión a la red, los caminos y las subestaciones existentes. El recurso eólico medido promedia 10,4 m/s. El sponsor busca capital para el programa de repotenciación de US$140M.",
    highlights: [
      "Conexión a la red y derechos sobre el terreno ya existentes",
      "Recurso eólico medido de 10,4 m/s",
      "Ventaja de permisos por condición brownfield",
    ],
    specs: [
      { label: "Capacidad actual", value: "48 MW (COD 2009)" },
      { label: "Capacidad objetivo", value: "120 MW" },
    ],
    capacity: "120 MW post-repotenciación",
    permits: "Licencia de generación vigente · derechos de red conservados",
  },
  "parana-grain-terminal": {
    summary:
      "Terminal de exportación de granos en operación sobre la hidrovía del Paraná — 3,2 Mt de movimiento anual, almacenaje en muelle para 240.000 t y permiso de ampliación otorgado.",
    description:
      "Terminal fluvial estratégicamente ubicada al servicio del núcleo sojero y maicero de Argentina, con un movimiento anual de 3,2 Mt, dos sitios de atraque para buques Panamax y recepción por ferrocarril y camión. Los silos en muelle almacenan 240.000 toneladas, y un permiso de ampliación ya otorgado habilita un tercer sitio de atraque y 120.000 t de capacidad adicional.\n\nEl movimiento está contratado con tres casas comercializadoras internacionales bajo acuerdos plurianuales de servicios portuarios. Los propietarios buscan una venta parcial de hasta el 45% para financiar la ampliación y líneas de capital de trabajo para originación.",
    highlights: [
      "Acuerdos plurianuales de servicios portuarios con 3 casas comercializadoras",
      "Permiso otorgado para la ampliación del tercer sitio de atraque",
      "Recepción ferroviaria y por camión con ingreso de 600 t/h",
    ],
    specs: [
      { label: "Sitios de atraque", value: "2 (Panamax), 12,5 m de calado" },
      { label: "Ritmo de carga", value: "1.800 t/h combinado" },
    ],
    capacity: "3,2 Mtpa · 240.000 t de almacenaje",
    production: "3,05 Mt operadas (2025)",
    permits: "Permiso de ampliación del tercer sitio de atraque otorgado",
  },
  "salar-norte-lithium-brine": {
    summary:
      "Proyecto avanzado de salmuera de litio en la Puna argentina — recurso de 2,1 Mt LCE y planta piloto DLE en operación; se busca capital de construcción.",
    description:
      "Salar Norte alberga un recurso medido e indicado de 2,1 Mt LCE con una concentración promedio de litio de 512 mg/L y bajas relaciones de impurezas, aptas para la extracción directa de litio (DLE). Una planta piloto DLE de 500 tpa ha operado durante 18 meses, produciendo muestras de carbonato grado batería que han superado la calificación inicial con dos fabricantes de cátodos.\n\nEl estudio de factibilidad para una planta comercial de 20.000 tpa concluye en 2027. Los sponsors buscan entre USD 180 y 280M de capital de construcción por etapas, abiertos a estructuras de streaming, equity o un JV estratégico con un offtaker.",
    highlights: [
      "Recurso M&I de 2,1 Mt LCE a 512 mg/L",
      "18 meses de operación de la planta piloto DLE",
      "Muestras grado batería en calificación con 2 fabricantes de cátodos",
    ],
    specs: [
      { label: "Recurso", value: "2,1 Mt LCE (M&I)" },
      { label: "Concentración de Li", value: "512 mg/L promedio" },
      { label: "Relación Mg/Li", value: "3,1" },
    ],
    capacity: "20.000 tpa LCE (diseño)",
    production: "Planta piloto DLE de 500 tpa en operación",
    permits: "Permiso ambiental del piloto vigente · EIA de la fase comercial en curso",
  },
  "cascadia-hydro-portfolio": {
    summary:
      "Tres centrales hidroeléctricas de pasada en operación en Columbia Británica que totalizan 94 MW, íntegramente contratadas bajo EPAs de largo plazo con la utility provincial.",
    description:
      "El portafolio comprende tres centrales de pasada puestas en servicio entre 2014 y 2017, que entregan en conjunto 385 GWh anuales bajo contratos de compraventa de energía (EPA) con la utility provincial, con vencimiento promedio en 2054. Todas las plantas se operan de forma remota desde un centro de control compartido, con disponibilidad superior al 96%.\n\nEl fondo vendedor se encuentra al final de su vida. Transacción limpia de acciones; existen acuerdos de impacto y beneficio con las Primeras Naciones en los tres emplazamientos.",
    highlights: [
      "EPAs con la utility provincial, 29 años de plazo remanente promedio",
      "Acuerdos con Primeras Naciones en todos los emplazamientos",
      "Disponibilidad superior al 96% y operación remota",
    ],
    specs: [
      { label: "Centrales", value: "3 (22–41 MW cada una)" },
      { label: "Rango de COD", value: "2014–2017" },
    ],
    capacity: "94 MW en 3 centrales",
    production: "385 GWh/año promedio",
    permits: "Licencias de agua hasta 2054 · EPAs hasta 2050–2058",
  },
  "magdalena-agroindustrial-platform": {
    summary:
      "Productor integrado de aceite de palma sostenible en Colombia — 9.800 hectáreas sembradas, planta extractora certificada RSPO y captura de biogás que genera 4 MW.",
    description:
      "Plataforma palmera verticalmente integrada en el Magdalena Medio colombiano: 9.800 hectáreas sembradas (propias y de productores asociados), una planta extractora de 45 t/h certificada RSPO y un sistema de captura de biogás que genera 4 MW, cubriendo la totalidad de la demanda eléctrica de la operación con excedentes vendidos a la red.\n\nLa familia controladora busca un socio estratégico para una participación del 30–50% destinada a financiar una línea de trituración de almendra (kernel) y 1.500 hectáreas adicionales. La producción certificada sostenible obtiene primas consistentes con compradores europeos.",
    highlights: [
      "Certificación RSPO con contratos a prima con compradores europeos",
      "Autosuficiencia energética mediante captura de biogás",
      "Tierras de expansión bajo control",
    ],
    specs: [
      { label: "Capacidad de la extractora", value: "45 t RFF/hora" },
      { label: "Certificaciones", value: "RSPO, ISCC" },
    ],
    capacity: "Extractora de 45 t/h · 4 MW de biogás",
    production: "198.000 t de RFF procesadas (2025)",
    permits: "Certificación RSPO · licencias ambientales vigentes",
  },
  "monterrey-industrial-park-nearshoring": {
    summary:
      "Parque industrial Clase A en Nuevo León — 92% arrendado, 310.000 m² de GLA y banco de tierra para 180.000 m² adicionales en el corredor más dinámico de México.",
    description:
      "Parque Clase A en el corredor Monterrey–Saltillo con 310.000 m² de GLA distribuidos en 14 edificios, arrendado al 92% a inquilinos multinacionales de los sectores automotriz, electrónico y de electrodomésticos bajo contratos triple neto denominados en USD (WALT de 7,2 años). El banco de tierra adyacente permite 180.000 m² de expansión build-to-suit con servicios ya instalados.\n\nEl sponsor busca un socio de capital programático para la fase de expansión o la venta total del portafolio estabilizado.",
    highlights: [
      "Contratos triple neto en USD con inquilinos multinacionales",
      "Ocupación del 92% y WALT de 7,2 años",
      "Banco de tierra urbanizado para 180.000 m² BTS",
    ],
    specs: [
      { label: "Edificios", value: "14 Clase A" },
      { label: "Altura libre", value: "12 m típica" },
    ],
    capacity: "310.000 m² de GLA + 180.000 m² de expansión",
    production: "92% arrendado · WALT de 7,2 años",
    permits: "Totalmente permisado · servicios asegurados para la expansión",
  },
  "iberia-wind-repowering-portfolio": {
    summary:
      "Portafolio eólico español en operación con derechos de repotenciación asegurados: 180 MW hoy, 265 MW post-repotenciación sobre las mismas conexiones a red.",
    description:
      "Cinco parques eólicos en Aragón y Castilla y León puestos en servicio entre 2004 y 2008, plenamente merchant desde la expiración de la tarifa, con derechos de conexión a red preservados para su repotenciación hasta 265 MW con aerogeneradores modernos. Los permisos de repotenciación se encuentran en etapa avanzada en tres de los cinco emplazamientos.\n\nLa transacción ofrece flujo de caja operativo hoy más un pipeline de repotenciación plenamente definido — un perfil híbrido de renta y crecimiento cada vez más escaso en Iberia.",
    highlights: [
      "Derechos de red preservados para repotenciar hasta 265 MW",
      "Potencial de alza merchant con opcionalidad de PPA",
      "Permisos avanzados en 3 de los 5 emplazamientos",
    ],
    specs: [
      { label: "Emplazamientos", value: "5 (Aragón, Castilla y León)" },
      { label: "Aerogeneradores actuales", value: "de generación 2004–2008" },
    ],
    capacity: "180 MW (265 MW post-repotenciación)",
    production: "430 GWh/año actuales",
    permits: "Permisos de repotenciación avanzados en 3 de 5 emplazamientos",
  },
  "red-sea-desalination-ppp": {
    summary:
      "PPP greenfield de desalinización SWRO de 450.000 m³/día con offtake gubernamental a 25 años, licitado y adjudicado — se buscan coinversionistas de equity.",
    description:
      "Asociación público-privada adjudicada para una planta de ósmosis inversa de agua de mar (SWRO) de 450.000 m³/día que abastecerá la demanda urbana e industrial de la costa del Mar Rojo, bajo un contrato de compra de agua (WPA) a 25 años con una contraparte soberana, basado en disponibilidad y con indexación plena.\n\nEl cierre financiero está previsto dentro de 12 meses; el consorcio busca coinversionistas de equity para hasta el 40% del SPV, junto a un desarrollador-operador regional experimentado.",
    highlights: [
      "WPA a 25 años basado en disponibilidad con contraparte soberana",
      "Licitación adjudicada — entrada desriesgada al cierre financiero",
      "Coinversión junto a un operador regional probado",
    ],
    specs: [
      { label: "Tecnología", value: "SWRO con ERD" },
      { label: "Offtake", value: "WPA a 25 años, indexado" },
    ],
    capacity: "450.000 m³/día SWRO",
    production: "Cierre financiero previsto: 12 meses",
    permits: "PPP adjudicado · WPA suscrito",
  },
  "tangier-automotive-supplier-park": {
    summary:
      "Plataforma manufacturera de tres plantas que abastece a OEMs europeos desde Marruecos — arneses de cableado, inyección de plásticos y estampado, 3.400 empleados.",
    description:
      "Plataforma automotriz Tier-2 integrada en la zona franca de Tánger: arneses de cableado, inyección técnica de plásticos y estampado de precisión en tres plantas, con el 96% de la producción exportada a programas de OEMs europeos y logística de 48 horas a España.\n\nLos accionistas fundadores buscan un comprador mayoritario que profesionalice el gobierno corporativo y financie una cuarta planta dedicada a sistemas de conexión para baterías de vehículos eléctricos, para la cual ya se cuenta con dos LOIs de clientes existentes.",
    highlights: [
      "Logística de 48 horas hasta las líneas de OEMs europeos",
      "Dos LOIs de clientes para la planta de sistemas de conexión EV",
      "Régimen fiscal de zona franca",
    ],
    specs: [
      { label: "Calidad", value: "IATF 16949, ISO 14001" },
      { label: "Clientes", value: "5 plataformas OEM vía Tier-1s" },
    ],
    capacity: "3 plantas · 41.000 m² cubiertos",
    production: "96% de exportación a programas OEM de la UE",
    permits: "Estatus de zona franca · IATF 16949 en todas las plantas",
  },
  "queensland-copper-gold-mine": {
    summary:
      "Mina brownfield de cobre y oro totalmente permisada en care & maintenance — 480 kt de Cu equivalente contenido remanente y estudio de reinicio concluido.",
    description:
      "Mina subterránea de cobre y oro con historial productivo en el norte de Queensland, puesta en care & maintenance en 2020 en la transición de rajo abierto a minería subterránea. El estudio de reinicio de 2025 define un plan de 9 años con una producción anual de 28 kt CuEq y USD 95M de capital de reinicio, aprovechando la planta existente de 1,1 Mtpa, el campamento y la conexión a la red.\n\nTodos los permisos permanecen vigentes. El propietario busca la venta o un socio financiador para el reinicio, con el equipo directivo disponible para continuar.",
    highlights: [
      "Planta, campamento y conexión a red existentes",
      "Estudio de reinicio concluido: 9 años de vida útil",
      "Permisos mantenidos durante el care & maintenance",
    ],
    specs: [
      { label: "Recurso remanente", value: "480 kt de CuEq contenido" },
      { label: "Capital de reinicio", value: "USD 95M" },
    ],
    capacity: "Planta de 1,1 Mtpa (existente)",
    production: "28 kt CuEq/año (plan de reinicio)",
    permits: "Todos los permisos mineros y ambientales vigentes",
  },
  "sao-paulo-cold-storage-network": {
    summary:
      "Red logística de temperatura controlada de cuatro sitios que atiende el mayor mercado de consumo de Brasil — 96.000 posiciones de pallets y contratos 3PL con clientes de primer nivel.",
    description:
      "Red de cadena de frío en el Gran São Paulo y Campinas: 96.000 posiciones de pallets en cuatro instalaciones, todas a menos de 90 minutos del centro de la ciudad, al servicio de productores de alimentos, importadores y plataformas de quick-commerce bajo contratos take-or-pay y de espacio dedicado.\n\nUn quinto sitio ya aprobado suma 30.000 posiciones. El sponsor busca capital de crecimiento o la salida total hacia una plataforma logística regional.",
    highlights: [
      "Contratos take-or-pay con grandes empresas de alimentos",
      "Sitio de expansión aprobado de 30.000 posiciones",
      "Viento de cola de demanda por el quick-commerce",
    ],
    specs: [
      { label: "Rango de temperatura", value: "−28°C a +15°C" },
      { label: "Sitios", value: "4 en operación + 1 aprobado" },
    ],
    capacity: "96.000 posiciones de pallets · 4 sitios",
    production: "93% de ocupación promedio",
    permits: "Quinto sitio totalmente aprobado",
  },
};

export const MANDATE_ES: Record<string, MandateEs> = {
  "latam-water-infrastructure-mandate": {
    title: "Construcción de Plataforma de Agua y Desalinización en LatAm",
    description:
      "Northbridge Infrastructure Fund está desplegando su tercer fondo en infraestructura hídrica en América Latina. Buscamos plantas desalinizadoras en operación, activos de conducción de agua y de suministro de agua industrial con ingresos contratados y denominados en USD. Preferencia por participaciones mayoritarias junto a operadores locales de trayectoria comprobada; tickets por activo individual de USD 80–250M con capacidad para financiar expansiones.",
  },
  "copper-battery-metals-mandate": {
    title: "Cobre y Metales para Baterías — Capital de Desarrollo",
    description:
      "Pacific Rim Strategic Holdings busca exposición a cobre y litio en las Américas y Australia, desde exploración avanzada hasta construcción. Ofrecemos capital de desarrollo por etapas, estructuras de streaming o adquisición total, con equipos técnicos capaces de llegar a términos vinculantes en un plazo de 90 días. Rango de ticket: USD 100–500M.",
  },
  "iberia-latam-renewables-yield-mandate": {
    title: "Renovables en Operación — Portafolio de Yield en Iberia y México",
    description:
      "Baltica Infrastructure Partners está adquiriendo activos solares y eólicos en operación en España y México para un vehículo de capital permanente enfocado en yield. Se prefieren perfiles de ingresos contratados o parcialmente contratados; tickets de USD 100–300M por transacción, con apetito por portafolios de hasta USD 600M.",
  },
  "green-hydrogen-jv-mandate": {
    title: "Hidrógeno Verde y Amoníaco — Socio Estratégico para Joint Venture",
    description:
      "Grupo industrial con offtake comprometido en el norte de Europa busca posiciones de joint venture en proyectos de hidrógeno verde y amoníaco a escala industrial con recursos renovables de clase mundial. Aportamos financiamiento de FEED, offtake y capacidad de ingeniería para proyectos con FID previsto dentro de 4 años. Capacidad de inversión de USD 500–1.500 millones por plataforma.",
  },
  "agro-export-platforms-mandate": {
    title: "Plataformas Agroexportadoras — Capital de Crecimiento",
    description:
      "Pacific Rim Strategic Holdings asigna capital de crecimiento (growth equity) a plataformas agroexportadoras verticalmente integradas con derechos de agua asegurados y programas de retail en mercados premium. Se prefieren berries, palta/aguacate, frutos secos y cultivos permanentes; tickets de USD 30–250M para posiciones minoritarias o de control.",
  },
  "core-ports-logistics-confidential": {
    title: "Puertos y Terminales Core+ — Búsqueda Confidencial",
    description:
      "Por encargo de un inversionista de perfil cuasi soberano, Northbridge conduce una búsqueda confidencial de terminales portuarios en operación y activos de logística de cadena de frío en el sur de Europa y el Golfo. Se requieren ingresos take-or-pay o contratados; tickets de USD 50–250M. Este mandato no está listado públicamente.",
  },
};

export const COMMODITY_ES: Record<string, CommodityEs> = {
  "grade-a-copper-cathodes-antofagasta": {
    title: "Cátodos de Cobre Grado A — 2.000 t/mes, FOB Antofagasta",
    description:
      "Cátodos de cobre Grado A registrados en la LME (99,9935% Cu) producidos en una operación de electroobtención consolidada en el norte de Chile. Disponibilidad mensual constante de 2.000 toneladas con capacidad de escalar a 3.000 toneladas bajo un contrato marco anual. Trazabilidad completa, producción bajo ISO 9001 y certificados de análisis emitidos por un laboratorio independiente para cada lote.",
    specs: [
      { label: "Pureza", value: "99,9935% Cu (LME Grado A)" },
      { label: "Formato", value: "Láminas de cátodo, ~125 kg, atados zunchados con fleje de acero" },
      { label: "Registro", value: "Marca registrada en la LME" },
      { label: "Embalaje", value: "Atados de ~2,2 t" },
    ],
    volume: "2.000 t/mes",
    deliveryLocation: "Puerto de Antofagasta, Chile",
    priceDetails: "LME Cash Settlement menos 45 USD/t",
  },
  "copper-concentrate-26-southern-peru": {
    title: "Concentrado de Cobre 26% Cu — 10.000 t/trimestre, CIF Puerto Principal de Asia",
    description:
      "Concentrado de cobre limpio de una mina en producción en el sur de Perú: 26% Cu con créditos de oro y plata, bajo arsénico (<0,15%). Lotes trimestrales de 10.000 wmt bajo un contrato marco anual de offtake, embarcados a granel desde Matarani. Términos TC/RC estándar con período de cotización (QP) negociable.",
    specs: [
      { label: "Ley de Cu", value: "26% (típico)" },
      { label: "Créditos de Au / Ag", value: "3,1 g/t Au · 68 g/t Ag" },
      { label: "Arsénico", value: "<0,15%" },
      { label: "Humedad", value: "8,5%" },
    ],
    volume: "10.000 wmt/trimestre",
    deliveryLocation: "Puerto principal de Asia (a opción del comprador)",
    priceDetails: "Base LME, TC/RC benchmark, QP M+1",
  },
  "battery-grade-lithium-carbonate-chile": {
    title: "Carbonato de Litio Grado Batería — 300 t/mes, FOB Puerto Chileno",
    description:
      "Carbonato de litio grado batería (≥99,5% Li₂CO₃) proveniente de operaciones de salmuera en la cuenca de Atacama. Disponibilidad mensual de 300 toneladas en big bags de 500 kg, containerizado. Apto para fabricación de cátodos; impurezas magnéticas controladas por debajo de 300 ppb. Se prefieren contratos de suministro de largo plazo; se consideran lotes spot.",
    specs: [
      { label: "Pureza", value: "≥99,5% Li₂CO₃" },
      { label: "Impurezas magnéticas", value: "<300 ppb" },
      { label: "Embalaje", value: "Big bags de 500 kg, 20 t por contenedor" },
    ],
    volume: "300 t/mes",
    deliveryLocation: "Puerto de Angamos, Chile",
    priceDetails: "Índice Fastmarkets Li₂CO₃ CIF Asia menos 3%",
  },
  "iron-ore-fines-62-port-hedland": {
    title: "Finos de Mineral de Hierro 62% Fe — Lotes Spot de 50.000 t, FOB Port Hedland",
    description:
      "Finos de mineral de hierro estándar de 62% Fe disponibles en lotes spot de 50.000 toneladas desde Port Hedland. Bajo fósforo y baja alúmina; granulometría 0–10 mm. Laycans inmediatos disponibles; volúmenes contractuales mayores negociables para el segundo semestre.",
    specs: [
      { label: "Contenido de Fe", value: "62% (típico)" },
      { label: "Granulometría", value: "Finos de 0–10 mm" },
      { label: "Fósforo", value: "0,07%" },
      { label: "Alúmina", value: "2,1%" },
    ],
    volume: "50.000 t/lote (spot)",
    deliveryLocation: "Port Hedland, Australia",
    priceDetails: "Platts IODEX 62% Fe menos 2,5 USD/t",
  },
  "molybdenum-oxide-chile": {
    title: "Óxido de Molibdeno (Grado Técnico) — 200 t/mes, CIF Rotterdam",
    description:
      "Óxido de molibdeno grado técnico (57% Mo mín.) en tambores, subproducto de una operación cuprífera chilena. Volumen mensual de 200 toneladas, embarcado containerizado a Rotterdam o puerto principal europeo. Se prefiere contrato anual con revisiones trimestrales de precio.",
    specs: [
      { label: "Contenido de Mo", value: "57% mín." },
      { label: "Embalaje", value: "Tambores de 250 kg" },
    ],
    volume: "200 t/mes",
    deliveryLocation: "Rotterdam, Países Bajos",
    priceDetails: "Media Platts de óxido de Mo, revisión trimestral",
  },
  "zinc-concentrate-52-callao": {
    title: "Concentrado de Zinc 52% Zn — 5.000 t/mes, FOB Callao",
    description:
      "Concentrado de zinc de alta ley (52% Zn, créditos de 380 g/t Ag) de una mina polimetálica en producción en el centro de Perú. Embarques mensuales de 5.000 wmt desde el Callao bajo contratos marco anuales; términos estándar de fundición.",
    specs: [
      { label: "Ley de Zn", value: "52%" },
      { label: "Créditos de Ag", value: "380 g/t" },
      { label: "Fe", value: "6,2%" },
    ],
    volume: "5.000 wmt/mes",
    deliveryLocation: "Puerto del Callao, Perú",
    priceDetails: "Base LME Zn, TC benchmark",
  },
  "gold-dore-lima": {
    title: "Doré de Oro 92% Au — 50 kg/mes, EXW Lima",
    description:
      "Barras de doré de oro (92% Au, 6% Ag típico) de un productor formalizado de mediana escala en Perú, con documentación completa de cadena de custodia y permisos de exportación. Disponibilidad mensual de 50 kg; apoyo en refinación y logística disponible para compradores calificados. Dossier de cumplimiento (abastecimiento responsable alineado con LBMA) compartido bajo NDA.",
    specs: [
      { label: "Contenido de Au", value: "92% (típico)" },
      { label: "Contenido de Ag", value: "6% (típico)" },
      { label: "Tamaño de barra", value: "~12,5 kg" },
    ],
    volume: "50 kg/mes",
    deliveryLocation: "Lima, Perú (instalación de seguridad)",
    priceDetails: "LBMA PM fix menos 1,2%, ajustado por ensaye",
  },
  "premium-fishmeal-callao": {
    title: "Harina de Pescado Premium 67% Proteína — 3.000 t/trimestre, FOB Callao",
    description:
      "Harina de pescado super prime (67% proteína mín., TVN <100) de productores peruanos certificados, con cadena de custodia IFFO RS. Lotes trimestrales de 3.000 toneladas en sacos de 50 kg o big bags. Programas de suministro anuales disponibles con prima fija sobre la referencia de exportación peruana.",
    specs: [
      { label: "Proteína", value: "67% mín." },
      { label: "TVN", value: "<100 mg/100g" },
      { label: "Certificación", value: "IFFO RS" },
    ],
    volume: "3.000 t/trimestre",
    deliveryLocation: "Puerto del Callao, Perú",
    priceDetails: "USD 1.720/t FOB (trimestre en curso)",
  },
  "bek-wood-pulp-brazil": {
    title: "Celulosa Kraft Blanqueada de Eucalipto — 8.000 t/mes, FOB Santos",
    description:
      "Celulosa de mercado BEK de un productor brasileño certificado (FSC), 8.000 toneladas mensuales en fardos unitizados. Apta para grados tissue y de impresión. Contratos anuales con flexibilidad trimestral de volumen de ±10%.",
    specs: [
      { label: "Grado", value: "BEKP (kraft blanqueada de eucalipto)" },
      { label: "Certificación", value: "FSC" },
      { label: "Blancura", value: "≥89% ISO" },
    ],
    volume: "8.000 t/mes",
    deliveryLocation: "Puerto de Santos, Brasil",
    priceDetails: "Índice PIX BHKP menos descuento acordado",
  },
  "buy-copper-cathodes-gulf": {
    title: "Se Compra: Cátodos de Cobre Grado A — 1.500–3.000 t/mes, Destino Golfo",
    description:
      "Gulf Metals Trading FZE busca cátodos de cobre Grado A para suministro de largo plazo a clientes de relaminación en el Golfo y el sur de Asia. Volúmenes mensuales de 1.500–3.000 toneladas bajo contratos marco de 12 meses con LCs de bancos de primera línea. Se prefieren marcas registradas en la LME; se consideran marcas no registradas con historial completo de ensayes.",
    specs: [
      { label: "Pureza requerida", value: "99,99% Cu mín." },
      { label: "Pago", value: "LC a la vista, banco de primera línea" },
    ],
    volume: "1.500–3.000 t/mes",
    deliveryLocation: "Jebel Ali, EAU",
    priceDetails: "Base LME más prima negociable",
  },
  "buy-lithium-carbonate-us": {
    title: "Se Compra: Carbonato de Litio Grado Batería — 200 t/mes, Planta de Cátodos en EE. UU.",
    description:
      "Fabricante estadounidense de materiales para cátodos busca carbonato de litio grado batería bajo contrato multianual, 200 t/mes escalando a 500 t/mes hacia 2028. Se requieren muestras de calificación; se priorizan orígenes que cumplan con la IRA.",
    specs: [
      { label: "Pureza requerida", value: "≥99,5% Li₂CO₃, grado batería" },
      { label: "Calificación", value: "Proceso de muestreo de 2 lotes" },
    ],
    volume: "200 t/mes (escalando a 500 t)",
    deliveryLocation: "Puerto del Golfo de EE. UU.",
    priceDetails: "Base índice Fastmarkets, estructura de collar",
  },
  "buy-iron-ore-fines-gulf-steel": {
    title: "Se Compra: Finos de Mineral de Hierro 62% — Lotes Spot de 50.000 t, Acería del Golfo",
    description:
      "Productor siderúrgico integrado en el Golfo busca lotes spot de finos de 62% Fe, 50.000–80.000 t por embarque, 4–6 embarques al año. Laycans prontos; pago mediante LC confirmada.",
    specs: [{ label: "Fe requerido", value: "61,5% mín." }],
    volume: "50.000–80.000 t/lote",
    deliveryLocation: "Puerto de carga a opción del vendedor",
    priceDetails: "Base Platts IODEX",
  },
  "buy-fishmeal-aquafeed-spain": {
    title: "Se Compra: Harina de Pescado Super Prime — 2.500 t/trimestre, Grupo Español de Alimento Acuícola",
    description:
      "Productor europeo de alimento acuícola busca harina de pescado super prime (66%+ de proteína) en programas anuales, 2.500 toneladas trimestrales, entregada FOB origen con certificación IFFO RS obligatoria.",
    specs: [
      { label: "Proteína requerida", value: "66% mín." },
      { label: "Certificación", value: "IFFO RS obligatoria" },
    ],
    volume: "2.500 t/trimestre",
    deliveryLocation: "Puerto de origen",
    priceDetails: "Fijo trimestral, negociable",
  },
  "buy-copper-concentrate-smelter-spain": {
    title: "Se Compra: Concentrados de Cobre Limpios — 40.000 t/año, Fundición Europea",
    description:
      "Fundición europea de maquila busca concentrados de cobre limpios (24%+ Cu, bajo As) para contratos marco anuales por un total de 40.000 toneladas, CIF Huelva. TC/RC benchmark; QP flexible. Se prefieren relaciones de largo plazo con minas productoras por sobre material de traders.",
    specs: [
      { label: "Cu requerido", value: "24% mín." },
      { label: "Límite de As", value: "<0,2%" },
    ],
    volume: "40.000 t/año",
    deliveryLocation: "Puerto de Huelva, España",
    priceDetails: "Base LME, TC/RC benchmark",
  },
};

export const PROJECT_ES: Record<string, ProjectEs> = {
  ...PROJECT_ES_A,
  ...PROJECT_ES_B,
};
