// Market intelligence articles — static editorial content rendered on
// /insights. Written as demo research-desk material for the platform.

export type InsightArticle = {
  slug: string;
  image: string;
  author: string;
  role: string;
  date: string; // ISO
  category: string;
  en: { title: string; excerpt: string; body: string[] };
  es: { title: string; excerpt: string; body: string[] };
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const INSIGHTS: InsightArticle[] = [
  {
    slug: "copper-supply-gap-2030",
    image: u("photo-1518709268805-4e9042af9f23"),
    author: "Carolina Fuentes",
    role: "Head of Mining & Energy Assets",
    date: "2026-07-08",
    category: "Mining",
    en: {
      title: "The Copper Supply Gap Is Now a Boardroom Problem",
      excerpt:
        "Grid build-out, EVs and data centers are pulling copper demand forward while the project pipeline thins. What that means for asset valuations in Chile and Peru.",
      body: [
        "Every serious demand model now converges on the same conclusion: the world will need between four and six million additional tonnes of refined copper per year by 2035, and the committed project pipeline covers barely half of that. Permitting timelines have stretched beyond a decade in most of the OECD, and the average head grade of operating mines keeps declining. The result is a structural gap that cannot be closed by scrap alone.",
        "For asset owners in Chile and Peru this is translating into a repricing of development-stage projects. Transactions we have observed over the past four quarters show acquirers paying meaningful premiums for advanced-exploration assets with completed economic studies, secured water strategies and community agreements in place — precisely the de-risking milestones that used to be undervalued in bull markets, when buyers preferred optionality over certainty.",
        "The buyer universe is also broadening. Beyond the traditional majors and mid-tiers, we now see industrial conglomerates, sovereign-linked vehicles and battery-supply-chain strategics running desks dedicated to copper. Their mandates prioritize jurisdictions with established rule of law and logistics, which keeps Latin America's copper belt firmly at the center of global M&A activity.",
        "Our view: sellers holding quality copper assets with clean documentation should prepare for institutional processes now. The scarcity premium is real, but it accrues to projects that can withstand due diligence — not to drill holes with a deck.",
      ],
    },
    es: {
      title: "El Déficit de Cobre Ya Es un Problema de Directorio",
      excerpt:
        "La expansión de redes, los EVs y los data centers adelantan la demanda de cobre mientras el pipeline de proyectos se adelgaza. Qué significa para las valorizaciones en Chile y Perú.",
      body: [
        "Todos los modelos serios de demanda convergen en la misma conclusión: el mundo necesitará entre cuatro y seis millones de toneladas adicionales de cobre refinado al año hacia 2035, y el pipeline comprometido cubre apenas la mitad. Los plazos de permisos superan la década en gran parte de la OCDE y la ley promedio de las minas en operación sigue cayendo. El resultado es un déficit estructural que la chatarra no puede cerrar por sí sola.",
        "Para los dueños de activos en Chile y Perú esto se traduce en una repreciación de los proyectos en etapa de desarrollo. Las transacciones que hemos observado en los últimos cuatro trimestres muestran compradores pagando premios significativos por activos de exploración avanzada con estudios económicos terminados, estrategia hídrica asegurada y acuerdos comunitarios firmados — precisamente los hitos de de-risking que solían subvalorarse en mercados alcistas, cuando los compradores preferían opcionalidad por sobre certeza.",
        "El universo comprador también se amplía. Además de las majors y mid-tiers tradicionales, vemos conglomerados industriales, vehículos ligados a fondos soberanos y estratégicos de la cadena de baterías con mesas dedicadas al cobre. Sus mandatos priorizan jurisdicciones con estado de derecho y logística consolidada, lo que mantiene al cinturón cuprífero latinoamericano al centro del M&A global.",
        "Nuestra visión: los vendedores con activos de cobre de calidad y documentación limpia deben prepararse hoy para procesos institucionales. El premio por escasez es real, pero se lo llevan los proyectos que resisten un due diligence — no los sondajes con presentación.",
      ],
    },
  },
  {
    slug: "green-hydrogen-fid-window",
    image: u("photo-1466611653911-95081537e5b7"),
    author: "Alexandra Reyes",
    role: "Managing Partner",
    date: "2026-06-19",
    category: "Energy Transition",
    en: {
      title: "Green Hydrogen: The FID Window Is Narrower Than It Looks",
      excerpt:
        "Hundreds of announced projects, a handful of final investment decisions. What separates the platforms reaching FID from the rest.",
      body: [
        "The global green hydrogen pipeline exceeds a thousand announced projects, yet final investment decisions remain scarce. The bottleneck is not resource quality — Magallanes, the Atacama, Western Australia and Morocco offer world-class renewable factors — but bankable offtake. Projects advancing to FID share one trait: a creditworthy buyer signed before FEED, usually an ammonia importer, fertilizer producer or shipping-fuel consortium.",
        "This is reshaping how capital enters the sector. Rather than funding single projects, strategic investors are buying into platforms: development teams with land control, measured resource data, grid or port access and a replicable project model. The joint-venture structure — industrial partner brings offtake and engineering, developer brings the asset — has become the dominant entry route.",
        "Chile's south, with capacity factors above 55%, keeps attracting disproportionate attention, but the projects that will matter are those completing environmental baselines and maritime concessions now, while competitors are still optimizing renderings. In hydrogen, the moat is permits and offtake, not electrolysis technology.",
        "For investors evaluating entries at pre-feasibility, the diligence question is simple: does this team have a credible path to a signed offtake within 24 months? If the answer is no, the discount rate should say so.",
      ],
    },
    es: {
      title: "Hidrógeno Verde: La Ventana de FID Es Más Estrecha de lo que Parece",
      excerpt:
        "Cientos de proyectos anunciados, un puñado de decisiones finales de inversión. Qué separa a las plataformas que llegan a FID del resto.",
      body: [
        "El pipeline global de hidrógeno verde supera los mil proyectos anunciados, pero las decisiones finales de inversión siguen siendo escasas. El cuello de botella no es la calidad del recurso — Magallanes, Atacama, Australia Occidental y Marruecos ofrecen factores renovables de clase mundial — sino el offtake financiable. Los proyectos que avanzan a FID comparten un rasgo: un comprador solvente firmado antes del FEED — normalmente un importador de amoníaco, un productor de fertilizantes o un consorcio de combustibles marítimos.",
        "Esto está redefiniendo cómo entra el capital al sector. En vez de financiar proyectos individuales, los inversionistas estratégicos compran plataformas: equipos con control de tierras, datos de recurso medidos, acceso a red o puerto y un modelo replicable. El joint venture — el socio industrial aporta offtake e ingeniería, el desarrollador aporta el activo — se volvió la ruta de entrada dominante.",
        "El sur de Chile, con factores de planta sobre 55%, sigue atrayendo atención desproporcionada, pero los proyectos que importarán son los que hoy completan líneas base ambientales y concesiones marítimas mientras la competencia optimiza renders. En hidrógeno, el foso competitivo son los permisos y el offtake, no la tecnología de electrólisis.",
        "Para inversionistas evaluando entradas en prefactibilidad, la pregunta de diligencia es simple: ¿tiene este equipo una ruta creíble a un offtake firmado en 24 meses? Si la respuesta es no, la tasa de descuento debería decirlo.",
      ],
    },
  },
  {
    slug: "latam-mining-ma-cycle",
    image: u("photo-1516216628859-9bccecab13ca"),
    author: "James Whitmore",
    role: "Head of Investor Relations",
    date: "2026-05-27",
    category: "M&A",
    en: {
      title: "LatAm Mining M&A: From Opportunistic to Programmatic",
      excerpt:
        "Acquirers are replacing one-off deals with structured regional programs. Sellers who understand the new playbook get better terms.",
      body: [
        "The character of mining M&A in Latin America has changed. Five years ago, most processes were opportunistic: a distressed seller, an expiring fund, a windfall commodity rally. Today the largest acquirers run programmatic strategies — defined jurisdictions, defined commodities, annual deployment targets — executed by permanent regional teams.",
        "For sellers, programmatic buyers are better counterparties: they close faster, retain management more often and price technical quality rather than timing the cycle. But they are also more demanding on data. A process without a structured data room, current resource statements and traceable permits will simply not make their screening list.",
        "Chile and Peru continue to dominate volume, but we note growing programmatic interest in Argentine lithium and Brazilian base-metal logistics, where infrastructure gaps create both risk and margin. The capital is there; the constraint is investable, well-documented assets.",
        "The practical takeaway for owners: institutional presentation is no longer cosmetic. It determines whether your asset enters the funnel at all.",
      ],
    },
    es: {
      title: "M&A Minero en LatAm: De Oportunista a Programático",
      excerpt:
        "Los compradores reemplazan deals puntuales por programas regionales estructurados. Los vendedores que entienden el nuevo manual obtienen mejores términos.",
      body: [
        "El carácter del M&A minero en Latinoamérica cambió. Hace cinco años la mayoría de los procesos era oportunista: un vendedor estresado, un fondo por vencer, un rally de commodities. Hoy los mayores compradores ejecutan estrategias programáticas — jurisdicciones definidas, commodities definidos, metas anuales de despliegue — con equipos regionales permanentes.",
        "Para los vendedores, los compradores programáticos son mejores contrapartes: cierran más rápido, retienen management con más frecuencia y precian calidad técnica en vez de intentar acertarle al ciclo. Pero también son más exigentes con los datos. Un proceso sin data room estructurado, declaraciones de recursos vigentes y permisos trazables simplemente no entra a su screening.",
        "Chile y Perú siguen dominando el volumen, pero notamos creciente interés programático en el litio argentino y la logística de metales base brasileña, donde las brechas de infraestructura crean riesgo y margen a la vez. El capital está; la restricción son activos invertibles y bien documentados.",
        "La conclusión práctica para los dueños: la presentación institucional ya no es cosmética. Determina si tu activo entra siquiera al embudo.",
      ],
    },
  },
  {
    slug: "desalination-industrial-water",
    image: u("photo-1559827260-dc66d52bef19"),
    author: "Carolina Fuentes",
    role: "Head of Mining & Energy Assets",
    date: "2026-05-06",
    category: "Water Infrastructure",
    en: {
      title: "Industrial Water: The Quiet Compounder of the Atacama",
      excerpt:
        "Desalination assets with take-or-pay contracts are trading like core infrastructure. The pipeline of new capacity says the run is far from over.",
      body: [
        "Water has become the binding constraint of northern Chile's mining economy, and the market response — privately financed desalination with long-term take-or-pay contracts — has quietly created one of Latin America's most attractive infrastructure asset classes. Contracted plants with tier-one mining offtakers now change hands at valuations comparable to European regulated utilities.",
        "The economics explain why. Revenue is dollar-denominated, indexed and contracted for 10–20 years with investment-grade counterparties whose alternative to paying for water is halting production. Operating costs are increasingly hedged through renewable PPAs. And expansion optionality is embedded: most permits allow capacity doubling on existing footprints, marine concessions included.",
        "Supply cannot keep up with demand. Every new mine approval in the Antofagasta and Atacama regions effectively mandates desalinated or sea-water supply, and municipal systems are joining the queue. We count a multi-billion-dollar pipeline of plants that will need to be built — and eventually recycled to yield investors — within the decade.",
        "For funds seeking contracted USD cash flows with real-asset protection, few sectors offer this combination of visibility and growth. The scarce resource is not capital; it is operating assets willing to sell.",
      ],
    },
    es: {
      title: "Agua Industrial: El Compounder Silencioso del Atacama",
      excerpt:
        "Los activos de desalación con contratos take-or-pay transan como infraestructura core. El pipeline de nueva capacidad indica que la corrida está lejos de terminar.",
      body: [
        "El agua se convirtió en la restricción determinante de la economía minera del norte de Chile, y la respuesta del mercado — desalación financiada privadamente con contratos take-or-pay de largo plazo — creó silenciosamente una de las clases de activos de infraestructura más atractivas de Latinoamérica. Las plantas contratadas con offtakers mineros tier-one transan a valorizaciones comparables a utilities reguladas europeas.",
        "La economía lo explica. Los ingresos están en dólares, indexados y contratados por 10–20 años con contrapartes investment-grade cuya alternativa a pagar por el agua es detener producción. Los costos operacionales se cubren crecientemente con PPAs renovables. Y la opcionalidad de expansión viene incorporada: la mayoría de los permisos permite duplicar capacidad en el mismo terreno, concesiones marítimas incluidas.",
        "La oferta no alcanza a la demanda. Cada nueva aprobación minera en Antofagasta y Atacama exige en la práctica suministro desalinizado o de agua de mar, y los sistemas municipales se suman a la fila. Contamos un pipeline multimillonario de plantas por construir — y eventualmente reciclar hacia inversionistas de yield — dentro de la década.",
        "Para fondos que buscan flujos contratados en USD con protección de activo real, pocos sectores ofrecen esta combinación de visibilidad y crecimiento. El recurso escaso no es el capital; son los activos en operación dispuestos a vender.",
      ],
    },
  },
  {
    slug: "lithium-price-reset-quality",
    image: u("photo-1509391366360-2e959784a276"),
    author: "Sofia Lindqvist",
    role: "Head of Commodities Desk",
    date: "2026-04-15",
    category: "Battery Metals",
    en: {
      title: "After the Lithium Reset: Quality Is the Only Trade",
      excerpt:
        "The price correction cleared the speculative fringe. What remains is a market that pays for grade, cost position and qualification status.",
      body: [
        "The lithium price correction of 2024–2025 did what corrections do: it separated projects from PowerPoints. With battery-grade carbonate stabilizing well below the 2022 frenzy, the marginal converter is unprofitable, expansion announcements have slowed, and the cost curve has reasserted itself as the only map that matters.",
        "For physical traders and cathode makers, the market has bifurcated. Qualified, battery-grade material from established producers commands consistent premiums and multi-year commitments; unqualified material trades at discounts that can exceed logistics costs. Qualification — the 12-to-18-month process of lot testing with each customer — has become the real barrier to entry, more than resource size.",
        "On the asset side, this favors brine incumbents with proven product and hard-rock projects in the first cost quartile with binding offtake. It punishes mid-curve developments financed on price-deck optimism. We expect consolidation to accelerate as strategics acquire distressed-but-real projects at rational valuations.",
        "Buyers on our commodities desk consistently prioritize the same three attributes: documented impurity panels, delivery reliability and IRA/CBAM-compatible origin. Sellers able to certify all three are not price takers.",
      ],
    },
    es: {
      title: "Tras el Reset del Litio: La Calidad Es el Único Trade",
      excerpt:
        "La corrección de precios limpió el margen especulativo. Queda un mercado que paga por ley, posición de costos y estado de calificación.",
      body: [
        "La corrección del litio de 2024–2025 hizo lo que hacen las correcciones: separó los proyectos de los PowerPoints. Con el carbonato grado batería estabilizado muy por debajo del frenesí de 2022, el convertidor marginal no es rentable, los anuncios de expansión se frenaron y la curva de costos volvió a ser el único mapa relevante.",
        "Para traders físicos y fabricantes de cátodos, el mercado se bifurcó. El material calificado grado batería de productores establecidos obtiene premios consistentes y compromisos multianuales; el material no calificado transa con descuentos que pueden superar el costo logístico. La calificación — el proceso de 12 a 18 meses de pruebas de lotes con cada cliente — se volvió la verdadera barrera de entrada, más que el tamaño del recurso.",
        "En activos, esto favorece a los incumbentes de salmuera con producto probado y a los proyectos de roca dura del primer cuartil de costos con offtake vinculante. Castiga a los desarrollos de mitad de curva financiados con optimismo de price-deck. Esperamos que la consolidación se acelere a medida que los estratégicos adquieran proyectos golpeados-pero-reales a valorizaciones racionales.",
        "Los compradores de nuestra mesa de commodities priorizan consistentemente tres atributos: paneles de impurezas documentados, confiabilidad de entrega y origen compatible con IRA/CBAM. Los vendedores capaces de certificar los tres no son tomadores de precio.",
      ],
    },
  },
  {
    slug: "data-centers-industrial-land",
    image: u("photo-1558494949-ef010cbdcc31"),
    author: "Alexandra Reyes",
    role: "Managing Partner",
    date: "2026-03-20",
    category: "Digital Infrastructure",
    en: {
      title: "Powered Land: How Data Centers Rewrote Industrial Real Estate",
      excerpt:
        "Secured megawatts, not square meters, now set the value of industrial land. The implications reach far beyond Virginia and Phoenix.",
      body: [
        "The defining trade in industrial real estate this decade is “powered land”: entitled sites with contracted grid capacity, sold to hyperscalers or their developers at multiples that traditional logistics parks cannot approach. In constrained markets, secured interconnection has become the asset; the land is almost incidental.",
        "The phenomenon is spreading beyond the classic North American corridors. Iberia, the Gulf and parts of Latin America combine renewable generation growth with fiber routes and sovereign digitalization agendas, creating credible secondary markets. Sites with dual-feed power, water-neutral cooling designs and 100+ MW headroom are drawing the same institutional bidders seen in Phoenix or Madrid.",
        "For industrial landowners, the lesson is to inventory power before marketing property. A logistics park with a substation expansion path may be worth multiples of its rent roll to the right counterparty — but only if the capacity story is documented, dated and bankable.",
        "We expect energy-and-land packages to become a standing category of cross-border deal flow, sitting between infrastructure and real estate mandates and priced closer to the former.",
      ],
    },
    es: {
      title: "Powered Land: Cómo los Data Centers Reescribieron el Real Estate Industrial",
      excerpt:
        "Los megawatts asegurados, no los metros cuadrados, fijan hoy el valor del suelo industrial. Las implicancias van mucho más allá de Virginia y Phoenix.",
      body: [
        "El trade definitorio del real estate industrial en esta década es el “powered land”: sitios habilitados con capacidad de red contratada, vendidos a hyperscalers o sus desarrolladores a múltiplos que los parques logísticos tradicionales no pueden alcanzar. En mercados restringidos, la interconexión asegurada se volvió el activo; el suelo es casi incidental.",
        "El fenómeno se expande más allá de los corredores norteamericanos clásicos. Iberia, el Golfo y partes de Latinoamérica combinan crecimiento de generación renovable con rutas de fibra y agendas soberanas de digitalización, creando mercados secundarios creíbles. Los sitios con doble alimentación, refrigeración neutra en agua y holgura de 100+ MW atraen a los mismos postores institucionales de Phoenix o Madrid.",
        "Para dueños de suelo industrial, la lección es inventariar la energía antes de comercializar la propiedad. Un parque logístico con ruta de expansión de subestación puede valer múltiplos de su renta para la contraparte correcta — pero solo si la historia de capacidad está documentada, fechada y es financiable.",
        "Esperamos que los paquetes de energía-y-suelo se conviertan en una categoría permanente de deal flow transfronterizo, entre los mandatos de infraestructura y real estate, y preciados más cerca de los primeros.",
      ],
    },
  },
  {
    slug: "agro-export-water-rights",
    image: u("photo-1500382017468-9049fed747ef"),
    author: "James Whitmore",
    role: "Head of Investor Relations",
    date: "2026-02-11",
    category: "Agroindustry",
    en: {
      title: "In Agro-Export Deals, Water Rights Are the Balance Sheet",
      excerpt:
        "Institutional capital keeps flowing into permanent crops — but valuation now starts with the water ledger, not the orchard.",
      body: [
        "Permanent-crop platforms in Peru, Chile and Australia continue to attract pension funds and agri-strategics seeking inflation-linked, dollar-based cash flows. Yet the diligence hierarchy has inverted: before yield curves and retail programs, sophisticated buyers now open the water file. Secure, senior, transferable water rights — with metered usage histories — have become the true balance sheet of an agro-export asset.",
        "The premium for water security is measurable. Assets combining senior rights with licensed wells and on-farm storage trade at cap-rate spreads of several hundred basis points inside comparable properties dependent on junior or seasonal allocations. In Australia, entitlement portfolios are increasingly negotiated as a separable asset class within the same transaction.",
        "Climate volatility is reinforcing the trend, but so is regulation: basin closures and stricter extraction auditing across producing regions mean that grandfathered, documented rights cannot be replicated at any capex. What can be replicated — packing capacity, genetics, certifications — is priced accordingly.",
        "Sellers preparing agro platforms for market should treat the water dossier with the same rigor as audited financials. It is the first thing serious money reads, and increasingly the reason deals clear or die.",
      ],
    },
    es: {
      title: "En los Deals Agroexportadores, los Derechos de Agua Son el Balance",
      excerpt:
        "El capital institucional sigue fluyendo a cultivos permanentes — pero la valorización ahora parte por el libro de aguas, no por el huerto.",
      body: [
        "Las plataformas de cultivos permanentes en Perú, Chile y Australia siguen atrayendo fondos de pensiones y estratégicos agro que buscan flujos en dólares indexados a inflación. Pero la jerarquía del due diligence se invirtió: antes de las curvas de rendimiento y los programas retail, los compradores sofisticados abren primero el expediente de aguas. Derechos seguros, senior y transferibles — con historiales de uso medidos — se volvieron el verdadero balance de un activo agroexportador.",
        "El premio por seguridad hídrica es medible. Los activos que combinan derechos senior con pozos licenciados y acumulación predial transan con spreads de cap rate de varios cientos de puntos base respecto de propiedades comparables dependientes de asignaciones junior o estacionales. En Australia, los portafolios de entitlements se negocian crecientemente como clase de activo separable dentro de la misma transacción.",
        "La volatilidad climática refuerza la tendencia, pero también la regulación: cierres de cuencas y auditorías de extracción más estrictas en las regiones productoras implican que los derechos históricos documentados no pueden replicarse con ningún capex. Lo que sí puede replicarse — capacidad de packing, genética, certificaciones — se precia en consecuencia.",
        "Los vendedores que preparan plataformas agro para el mercado deben tratar el dossier de aguas con el mismo rigor que los estados financieros auditados. Es lo primero que lee el dinero serio, y cada vez más la razón por la que los deals se cierran o mueren.",
      ],
    },
  },
];

export function getInsight(slug: string): InsightArticle | undefined {
  return INSIGHTS.find((a) => a.slug === slug);
}
