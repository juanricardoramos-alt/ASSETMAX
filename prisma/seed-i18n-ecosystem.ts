// Spanish (es) content for the ecosystem demo seed — needs board, corporate
// profiles and supplier registry — keyed by slug and applied to the
// `translations` column of each entity ({"es": {…}}). English remains the
// base language in the main columns. Company and supplier names are proper
// names and stay unchanged by design.

export type NeedEs = {
  title?: string;
  description?: string;
  requirements?: string[];
};

export type CompanyEs = {
  description?: string;
};

export type SupplierEs = {
  description?: string;
  capacity?: string;
  portfolio?: string[];
};

export const NEED_ES: Record<string, NeedEs> = {
  "tlp-large-diameter-pipe-supply": {
    title: "Suministro de tubería de acero de gran diámetro — línea de transporte de agua de 180 km",
    description:
      "Suministro de tubería de acero soldada API 5L X70 (48–56 pulgadas) con revestimiento interior y recubrimiento exterior para un sistema de transporte de agua desalada de 180 km en el norte de Chile. Entregas escalonadas durante 22 meses a dos patios de acopio; se exigen certificados de acería e inspección de tercera parte para cada colada.",
    requirements: [
      "Certificación de acería API 5L PSL2",
      "Entregas comprobadas sobre 100 km de tubería en los últimos 10 años",
      "Aceptación de inspección de tercera parte (TPI) en acería",
      "Plan de entregas escalonadas con dos patios de acopio",
    ],
  },
  "tlp-epc-pumping-stations": {
    title: "Contratista EPC para tres estaciones de bombeo de 12 MW",
    description:
      "Ingeniería, procura y construcción de tres estaciones de bombeo de alta presión (12 MW instalados cada una), incluyendo salas eléctricas, protección antiariete e integración SCADA para un mineroducto de concentrado en Perú. Contrato bajo FIDIC Libro Amarillo con pagos por hitos.",
    requirements: [
      "Track record bajo FIDIC Libro Amarillo",
      "Al menos dos estaciones de bombeo o compresión entregadas como EPC",
      "Capacidad de obras civiles en el país (Perú)",
      "Certificación ISO 9001 / ISO 45001",
    ],
  },
  "tlp-oversize-logistics": {
    title: "Logística especializada para componentes sobredimensionados de tubería",
    description:
      "Contrato marco plurianual para manejo portuario, almacenamiento y transporte terrestre de componentes sobredimensionados de tubería (piezas únicas de hasta 90 t) desde puertos brasileños y chilenos hasta faenas andinas, incluyendo estudios de ruta, permisos y convoyes escoltados.",
    requirements: [
      "Flota de izaje pesado sobre 80 t de carga útil",
      "Experiencia en transporte transfronterizo andino",
      "Seguro de carga hasta USD 20M por embarque",
    ],
  },
  "ag-earthworks-subcontractor-iron-ore": {
    title: "Subcontratista de movimiento de tierras y acarreo — expansión de mina de hierro",
    description:
      "Subcontrato de movimiento masivo de tierras (34 Mm³ en 30 meses) para una expansión de mineral de hierro en Minas Gerais: apoyo a perforación, carguío y transporte, mantención de caminos mineros y control de polvo. Se requiere flota propia; el combustible lo suministra el contratista principal en faena.",
    requirements: [
      "Flota propia de al menos 30 unidades de acarreo",
      "Experiencia en movimiento de tierras minero sobre 20 Mm³",
      "Estadísticas de seguridad (TRIFR) bajo el benchmark de la industria",
    ],
  },
  "ag-mining-truck-fleet": {
    title: "Flota de 40 camiones fuera de carretera con contrato de mantenimiento integral",
    description:
      "Compra o arriendo de largo plazo de cuarenta camiones fuera de carretera clase 90–100 t con contrato MARC a 5 años (mantenimiento y reparación), capacitación de operadores y bodega de repuestos en faena para dos proyectos de infraestructura simultáneos en Brasil.",
    requirements: [
      "Fabricante (OEM) o distribuidor certificado",
      "Track record MARC de 4+ años con disponibilidad de flota sobre 88%",
      "Cobertura de repuestos y técnicos en faena",
    ],
  },
  "ag-environmental-licensing-port": {
    title: "Consultoría de licenciamiento ambiental para obras de expansión portuaria",
    description:
      "Estudios de impacto ambiental, gestión de licenciamiento y programa de relacionamiento comunitario para la expansión de un terminal de contenedores, incluyendo permisos de dragado y planes de monitoreo de biota marina coordinados con las agencias estatales y federales.",
    requirements: [
      "Experiencia en EIA portuarios o costeros en Brasil",
      "Registro vigente como consultor ante IBAMA",
      "Capacidad de monitoreo de biota marina",
    ],
  },
  "tbea-epc-substation-partner": {
    title: "Socio EPC local para paquetes de subestaciones de 500 kV en LatAm",
    description:
      "TBEA busca socios EPC locales en Chile y Argentina para el alcance de balance of plant y montaje de paquetes de subestaciones de 500 kV (obras civiles, montaje, apoyo a pruebas) asociados a proyectos de transmisión donde TBEA suministra los transformadores principales y el equipamiento de alta tensión.",
    requirements: [
      "Referencias de montaje de subestaciones de alta tensión (220 kV o superior)",
      "Licencias locales de contratista eléctrico",
      "Capacidad para dos faenas simultáneas",
    ],
  },
  "tbea-transformer-logistics": {
    title: "Logística puerto–faena para entregas de transformadores de poder",
    description:
      "Acuerdo marco para recepción, manejo portuario y transporte terrestre de grandes transformadores de poder (hasta 280 t) desde el puerto de Manzanillo hasta faenas en el centro de México, incluyendo plataformas hidráulicas modulares, obras de refuerzo de ruta y grúas.",
    requirements: [
      "Plataformas modulares hidráulicas (SPMT) sobre 250 t",
      "Referencias de transporte de transformadores",
      "Capacidad de estudio de ruta y refuerzo de puentes",
    ],
  },
  "tbea-om-solar-services": {
    title: "Servicios técnicos de O&M para dos plantas solares utility-scale",
    description:
      "Servicios de operación y mantenimiento plurianuales para dos plantas fotovoltaicas de 150 MW: mantenimiento preventivo y correctivo, limpieza de módulos, inspecciones termográficas, gestión de repuestos y traspaso a monitoreo 24/7.",
    requirements: [
      "Portafolio de O&M sobre 300 MW fotovoltaicos",
      "Personal certificado para maniobras de alta tensión",
      "Reportería de mantenimiento basada en CMMS",
    ],
  },
  "ag-epc-crushing-conveyor": {
    title: "EPC llave en mano — chancado primario y correa overland (2.800 t/h)",
    description:
      "Paquete EPC completo para una estación de chancado primario de 2.800 t/h y una correa transportadora overland de 7,4 km para una expansión de mineral de hierro en Minas Gerais: ingeniería, procura, obras civiles, montaje estructural y electromecánico, puesta en marcha y pruebas de desempeño. Suma alzada llave en mano con multas por plazo y throughput.",
    requirements: [
      "Referencias EPC llave en mano sobre USD 100M en minería",
      "Capacidad propia de montaje estructural y electromecánico",
      "Garantías de pruebas de desempeño (throughput y disponibilidad)",
      "Certificación ISO 9001 / ISO 45001",
    ],
  },
  "tlp-geotech-survey-closed": {
    title: "Campaña de sondajes geotécnicos — tramo costero",
    description:
      "Campaña finalizada de 240 sondajes y líneas geofísicas a lo largo del tramo costero del sistema de transporte de agua. Publicada como referencia; las postulaciones están cerradas.",
    requirements: ["Experiencia en perforación costera / offshore"],
  },
};

export const COMPANY_ES: Record<string, CompanyEs> = {
  "tlp-pipeline": {
    description:
      "TLP Pipeline desarrolla, construye y opera sistemas de tuberías de gran diámetro e infraestructura asociada de bombeo y terminales para agua, concentrados mineros e hidrocarburos en América Latina. El grupo gestiona un pipeline de proyectos multinacional y contrata equipos, capacidad EPC y servicios especializados a gran escala para su portafolio de concesiones.",
  },
  "andrade-gutierrez": {
    description:
      "Andrade Gutiérrez es uno de los mayores grupos de ingeniería y construcción pesada de América Latina, con siete décadas de experiencia entregando infraestructura minera, energética, sanitaria y de transporte en más de 40 países. Sus equipos de proyecto contratan flotas de equipos, subcontratistas y servicios técnicos para grandes obras simultáneas.",
  },
  tbea: {
    description:
      "TBEA es un fabricante global de equipos de transmisión y transformación de energía y desarrollador de infraestructura energética, con plantas de transformadores, cables y polisilicio que abastecen proyectos utility-scale en todo el mundo. Su división internacional de proyectos contrata logística, obras civiles y socios técnicos locales para desarrollos energéticos llave en mano.",
  },
  "aldridge-industrial-holdings": {
    description:
      "Holding industrial diversificado con sede en EAU, con participaciones controladoras en terminales portuarios, almacenamiento de graneles líquidos y activos de manufactura en Medio Oriente y América Latina. El grupo rota activamente su portafolio y desarrolla plataformas industriales greenfield junto a socios estratégicos.",
  },
};

export const SUPPLIER_ES: Record<string, SupplierEs> = {
  "andina-drilling-geotech": {
    description:
      "Contratista chileno de perforación y servicios geotécnicos especializado en entornos mineros remotos y de altura. Oferta integral desde perforación de exploración hasta instrumentación geotécnica, con flota propia de 14 equipos y equipos permanentes de QA/QC y seguridad.",
    capacity: "14 equipos de perforación · 3 campamentos remotos simultáneos",
    portfolio: [
      "68.000 m de perforación diamantina y aire reverso — Proyecto de Cobre Vizcachas (2019–2024)",
      "Campaña geotécnica, 240 sondajes — tubería de agua costera (2023)",
      "Programa de pozos de drenaje — Salar de Atacama (2021)",
    ],
  },
  "skanor-epc": {
    description:
      "Contratista EPC europeo de infraestructura hídrica, energética e industrial con tres décadas de ejecución internacional. Sólido track record en estaciones de bombeo y compresión, subestaciones de alta tensión y paquetes balance of plant bajo marcos FIDIC.",
    capacity: "3 obras EPC simultáneas · 120 ingenieros propios",
    portfolio: [
      "4 estaciones de bombeo entregadas EPC — Iberia y Norte de África",
      "Subestaciones 220/500 kV, 11 proyectos en LatAm",
      "Balance of plant de desalación, 2 plantas en Marruecos",
    ],
  },
  "transandes-heavy-logistics": {
    description:
      "Especialista en izaje pesado y carga de proyecto que cubre la costa del Pacífico y los corredores andinos. Estudios de ruta integrados, refuerzo de puentes, convoyes escoltados y manejo portuario para carga industrial sobredimensionada.",
    capacity: "SPMT hasta 320 t · flota pesada de 60 camiones · equipo de ingeniería de rutas",
    portfolio: [
      "Transporte de 12 transformadores de hasta 260 t — línea de transmisión andina",
      "Contrato marco puerto–mina de carga sobredimensionada — 3 operaciones mineras",
      "Operaciones SPMT para relocalización de planta modular (2022)",
    ],
  },
  "maquisur-equipment": {
    description:
      "Distribuidor andino de equipos pesados y contratista de mantenimiento. Venta, arriendo y contratos integrales de mantenimiento y reparación (MARC) para flotas fuera de carretera, con talleres certificados de fábrica y logística de repuestos en faena.",
    capacity: "Programas MARC a 5 años · cobertura de técnicos en faena a nivel nacional",
    portfolio: [
      "Contratos MARC en 4 flotas mineras (disponibilidad > 89%)",
      "Suministro de 55 camiones fuera de carretera a operaciones de cobre andinas",
      "Bodegas de repuestos en faena en 6 operaciones remotas",
    ],
  },
  "verdant-environmental": {
    description:
      "Consultora ambiental brasileña enfocada en puertos, obras costeras e infraestructura pesada: estudios de impacto, gestión de licenciamiento ante agencias estatales y federales, monitoreo marino y relacionamiento comunitario.",
    capacity: "40 especialistas habilitados · embarcaciones de monitoreo marino con contrato marco",
    portfolio: [
      "EIA y licenciamiento — 2 expansiones de terminales de contenedores (Santos, Itajaí)",
      "Monitoreo de biota marina, programa de 5 años — dragado portuario",
      "Programas de relacionamiento comunitario para 8 proyectos de infraestructura",
    ],
  },
  "omnigrid-om": {
    description:
      "Proveedor independiente de operación y mantenimiento para plantas solares utility-scale e infraestructura de alta tensión. Programas preventivos y correctivos, personal certificado para maniobras y reportería de desempeño basada en CMMS.",
    capacity: "520 MW bajo gestión · NOC 24/7 · drones de termografía",
    portfolio: [
      "O&M de portafolio fotovoltaico de 520 MW en México y Argentina",
      "Contrato marco de mantenimiento de subestaciones AT — 14 subestaciones",
      "Centro de monitoreo 24/7 con reportería CMMS",
    ],
  },
  "baustahl-civil-works": {
    description:
      "Contratista de obras civiles pesadas y movimiento de tierras minero con flota propia y equipos experimentados de carguío y transporte de alto volumen. Actualmente completando su calificación en el catastro.",
    capacity: "Flota de 45 unidades de acarreo · 2 faenas mineras simultáneas",
    portfolio: [
      "38 Mm³ de movimiento masivo de tierras — expansión de mineral de hierro (2018–2021)",
      "Red de caminos mineros, 60 km — corredor de Carajás",
    ],
  },
};
