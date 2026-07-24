// VORTA degraded-mode knowledge base — bilingual quick answers used when the
// AI service is not configured (or unreachable). Matched by keyword scoring.

// VORTA — contenido del asistente FAQ de VORTAMAX Global.
// Los href usan el prefijo literal "/LANG/"; el componente lo sustituye por el idioma activo.

export type FaqEntry = {
  id: string;
  keywords: string[]; // minúsculas, sin tildes, EN y ES mezclados, 6-12 por entrada
  en: { answer: string; links?: { label: string; href: string }[] };
  es: { answer: string; links?: { label: string; href: string }[] };
};

export const VORTA_FAQ: FaqEntry[] = [
  {
    id: "publish-project",
    keywords: [
      "publicar",
      "proyecto",
      "vender",
      "publish",
      "list",
      "project",
      "wizard",
      "pdf",
      "ingesta",
      "subir",
      "upload",
    ],
    en: {
      answer:
        "Happy to help — there are two ways. You can list your project step by step with our guided wizard, or if you already have a PDF with the details, upload it and our AI reads it and fills in the form for you. Either way, your project goes through a review by our team before it's published.",
      links: [
        { label: "List your project", href: "/LANG/dashboard/projects/new" },
        { label: "How it works", href: "/LANG/how-it-works" },
      ],
    },
    es: {
      answer:
        "¡Con gusto te acompaño! Hay dos caminos: puedes publicar tu proyecto paso a paso con nuestro asistente guiado, o si ya tienes un PDF con la información, súbelo y nuestra IA lo lee y completa el formulario por ti. En ambos casos, tu proyecto pasa por la revisión de nuestro equipo antes de publicarse.",
      links: [
        { label: "Publicar proyecto", href: "/LANG/dashboard/projects/new" },
        { label: "Cómo funciona", href: "/LANG/how-it-works" },
      ],
    },
  },
  {
    id: "verification",
    keywords: [
      "verificacion",
      "verification",
      "revision",
      "review",
      "aprobacion",
      "approval",
      "verificado",
      "verified",
      "equipo",
      "team",
    ],
    en: {
      answer:
        "Verification is our human review: before a project goes live, our team checks that the information is complete and consistent. That way investors know that what they see has passed a real filter. If something is missing, we'll let you know so you can complete it — I'll walk you through it.",
      links: [{ label: "How it works", href: "/LANG/how-it-works" }],
    },
    es: {
      answer:
        "La verificación es nuestra revisión humana: antes de que un proyecto se publique, nuestro equipo confirma que la información esté completa y sea coherente. Así los inversionistas saben que lo que ven pasó por un filtro real. Si falta algo, te avisamos para que lo completes — te acompaño en el proceso.",
      links: [{ label: "Cómo funciona", href: "/LANG/how-it-works" }],
    },
  },
  {
    id: "invest-explore",
    keywords: [
      "invertir",
      "invest",
      "explorar",
      "explore",
      "oportunidades",
      "opportunities",
      "inversionista",
      "investor",
      "proyectos",
      "projects",
    ],
    en: {
      answer:
        "Exploring is free and comes with no strings attached: browse projects by sector, country or investment range. When something catches your eye, you sign a digital NDA to access the data room with the confidential details, and from there you can send an offer or talk directly with the seller. I'll walk you with every step.",
      links: [{ label: "Explore projects", href: "/LANG/projects" }],
    },
    es: {
      answer:
        "Explorar es gratis y sin compromiso: navega proyectos por sector, país o rango de inversión. Cuando algo te interese, firmas un NDA digital para acceder al data room con la información confidencial, y desde ahí puedes enviar una oferta o conversar directamente con el vendedor. Te acompaño en cada paso.",
      links: [{ label: "Explorar proyectos", href: "/LANG/projects" }],
    },
  },
  {
    id: "nda-dataroom",
    keywords: [
      "nda",
      "data room",
      "dataroom",
      "confidencialidad",
      "confidentiality",
      "acuerdo",
      "agreement",
      "documentos",
      "documents",
      "acceso",
      "access",
    ],
    en: {
      answer:
        "The NDA is a confidentiality agreement you sign digitally in a couple of clicks: you commit to keeping the project's sensitive information private. In return, the data room opens up — a protected space with documents, studies and figures the seller only shares with serious parties. It protects both sides so the conversation can be honest.",
      links: [{ label: "Explore projects", href: "/LANG/projects" }],
    },
    es: {
      answer:
        "El NDA es un acuerdo de confidencialidad que firmas digitalmente en un par de clics: te comprometes a no divulgar la información sensible del proyecto. A cambio se abre el data room, un espacio protegido con documentos, estudios y cifras que el vendedor solo comparte con interesados serios. Protege a ambas partes para que la conversación sea honesta.",
      links: [{ label: "Explorar proyectos", href: "/LANG/projects" }],
    },
  },
  {
    id: "investment-mandate",
    keywords: [
      "mandato",
      "mandate",
      "mandatos",
      "criterios",
      "que busco",
      "investment mandate",
      "perfil de inversion",
      "search criteria",
      "brief",
    ],
    en: {
      answer:
        "An investment mandate is your way of saying \"this is what I'm looking for\": you publish your criteria — sector, country, ticket size — and our matching engine crosses your mandate against the projects on the platform. When something fits, we notify you. That way opportunities find you, not the other way around.",
      links: [{ label: "Investment mandates", href: "/LANG/mandates" }],
    },
    es: {
      answer:
        "Un mandato de inversión es tu forma de decir \"esto es lo que busco\": publicas tus criterios — sector, país, tamaño de ticket — y nuestro motor de matching los cruza con los proyectos de la plataforma. Cuando aparece algo que calza, te avisamos. Así las oportunidades te encuentran a ti, y no al revés.",
      links: [{ label: "Mandatos de inversión", href: "/LANG/mandates" }],
    },
  },
  {
    id: "matching",
    keywords: [
      "matching",
      "match",
      "cruce",
      "coincidencias",
      "calce",
      "notificaciones",
      "notifications",
      "alertas",
      "alerts",
      "motor",
      "engine",
    ],
    en: {
      answer:
        "Our matching engine works quietly for you: it crosses investment mandates with published projects, and commodity sale offers with purchase requirements. When it finds a relevant match, it notifies both sides so they can start talking. You always decide whether to move forward — the engine suggests, never commits you.",
      links: [
        { label: "Mandates", href: "/LANG/mandates" },
        { label: "Commodities", href: "/LANG/commodities" },
      ],
    },
    es: {
      answer:
        "Nuestro motor de matching trabaja silenciosamente por ti: cruza los mandatos de inversión con los proyectos publicados, y las ofertas de commodities con los requerimientos de compra. Cuando encuentra un calce relevante, notifica a ambas partes para que conversen. Tú siempre decides si avanzas — el motor sugiere, nunca te compromete.",
      links: [
        { label: "Mandatos", href: "/LANG/mandates" },
        { label: "Commodities", href: "/LANG/commodities" },
      ],
    },
  },
  {
    id: "commodities-sell",
    keywords: [
      "vender commodities",
      "commodities",
      "cobre",
      "copper",
      "litio",
      "lithium",
      "oferta de venta",
      "sell",
      "fisico",
      "physical",
      "supply",
    ],
    en: {
      answer:
        "If you have physical commodities to sell — copper, lithium and more — publish your sale offer with volume, origin and terms. The platform crosses it against active purchase requirements and connects the parties. One important thing: VORTAMAX connects you, but the transaction itself is closed directly between buyer and seller.",
      links: [{ label: "Commodities", href: "/LANG/commodities" }],
    },
    es: {
      answer:
        "Si tienes commodities físicos para vender — cobre, litio y más — publica tu oferta de venta con volumen, origen y condiciones. La plataforma la cruza con los requerimientos de compra activos y conecta a las partes. Algo importante: VORTAMAX conecta, pero la transacción la cierran directamente comprador y vendedor.",
      links: [{ label: "Commodities", href: "/LANG/commodities" }],
    },
  },
  {
    id: "commodities-buy",
    keywords: [
      "comprar commodities",
      "requerimiento",
      "requirement",
      "compra",
      "buy",
      "buyer",
      "comprador",
      "sourcing",
      "abastecimiento",
      "materia prima",
    ],
    en: {
      answer:
        "Looking to buy physical commodities? Publish a purchase requirement with what you need — product, volume, destination — and the matching engine crosses it against available sale offers. We'll notify you when there's a fit; the negotiation and closing stay between the parties, with the platform as the meeting point.",
      links: [{ label: "Commodities", href: "/LANG/commodities" }],
    },
    es: {
      answer:
        "¿Buscas comprar commodities físicos? Publica un requerimiento de compra con lo que necesitas — producto, volumen, destino — y el motor de matching lo cruza con las ofertas de venta disponibles. Te avisamos cuando haya un calce; la negociación y el cierre quedan entre las partes, con la plataforma como punto de encuentro.",
      links: [{ label: "Commodities", href: "/LANG/commodities" }],
    },
  },
  {
    id: "contract-templates",
    keywords: [
      "contratos",
      "contracts",
      "modelo",
      "templates",
      "mou",
      "spa",
      "borrador",
      "draft",
      "generar contrato",
      "compraventa",
    ],
    en: {
      answer:
        "In Contract Templates you can generate draft NDAs, LOIs, MOUs, SPAs, commodity sale or supply agreements and intermediation mandates: pick the type, fill in the details, and you get a working base document. Every draft is clearly marked DRAFT and is not legal advice — always review it with your lawyer before signing.",
      links: [{ label: "Contract templates", href: "/LANG/contract-templates" }],
    },
    es: {
      answer:
        "En Contratos Modelo puedes generar borradores de NDA, LOI, MOU, SPA, compraventa o suministro de commodities y mandatos de intermediación: eliges el tipo, completas los datos y obtienes un documento base. Todos vienen marcados como BORRADOR y no son asesoría legal — revísalos siempre con tu abogado antes de firmar.",
      links: [{ label: "Contratos modelo", href: "/LANG/contract-templates" }],
    },
  },
  {
    id: "loi-offer",
    keywords: [
      "loi",
      "oferta",
      "offer",
      "carta de intencion",
      "letter of intent",
      "propuesta",
      "proposal",
      "enviar oferta",
      "bid",
    ],
    en: {
      answer:
        "An LOI (letter of intent) is a serious but non-binding expression of your interest: it states what you're proposing — full acquisition, an equity stake, financing — and on what general terms. From a project's page you can send your offer or LOI, and the seller receives it and responds right on the platform. I'll walk you with it whenever you're ready.",
      links: [{ label: "Explore projects", href: "/LANG/projects" }],
    },
    es: {
      answer:
        "Una LOI (carta de intención) es una manifestación seria pero no vinculante de tu interés: indica qué propones — adquisición total, participación, financiamiento — y en qué términos generales. Desde la página del proyecto puedes enviar tu oferta o LOI, y el vendedor la recibe y responde en la misma plataforma. Cuando estés listo, te acompaño en el envío.",
      links: [{ label: "Explorar proyectos", href: "/LANG/projects" }],
    },
  },
  {
    id: "messaging",
    keywords: [
      "mensajes",
      "messages",
      "chat",
      "conversar",
      "messaging",
      "hablar con vendedor",
      "contraparte",
      "counterpart",
      "inbox",
      "bandeja",
    ],
    en: {
      answer:
        "You can chat directly with your counterpart inside the platform: each project, offer or commodity match opens a private conversation. That keeps the whole history organized in one place instead of scattered emails. You'll find your conversations in the Messages section of your dashboard.",
      links: [{ label: "My messages", href: "/LANG/dashboard/messages" }],
    },
    es: {
      answer:
        "Puedes chatear directamente con tu contraparte dentro de la plataforma: cada proyecto, oferta o calce de commodities abre una conversación privada. Así todo el historial queda ordenado en un solo lugar, en vez de correos dispersos. Encuentras tus conversaciones en la sección Mensajes de tu panel.",
      links: [{ label: "Mis mensajes", href: "/LANG/dashboard/messages" }],
    },
  },
  {
    id: "contact-founder",
    keywords: [
      "contacto",
      "contact",
      "fundador",
      "founder",
      "email",
      "correo",
      "soporte",
      "support",
      "ayuda",
      "help",
      "equipo",
    ],
    en: {
      answer:
        "Gladly! You can write directly to the team and the founder from the contact page, or by email at contact@vortamax.global. We enjoy talking with every user — tell us about your case and you'll get a personal reply.",
      links: [{ label: "Contact us", href: "/LANG/contact" }],
    },
    es: {
      answer:
        "¡Con gusto! Puedes escribir directamente al equipo y al fundador desde la página de contacto, o al correo contact@vortamax.global. Nos gusta conversar con cada usuario: cuéntanos tu caso y recibirás una respuesta personal.",
      links: [{ label: "Contacto", href: "/LANG/contact" }],
    },
  },
  {
    id: "pricing",
    keywords: [
      "precio",
      "precios",
      "pricing",
      "comision",
      "comisiones",
      "fees",
      "costo",
      "cost",
      "tarifas",
      "cuanto cuesta",
      "gratis",
    ],
    en: {
      answer:
        "Good question — and I'd rather be honest than guess. The commercial model is discussed directly with our team, because it depends on the type of deal and your specific case, so I won't quote figures that may not apply to you. Write to us and we'll explain the options with no obligation.",
      links: [{ label: "Talk to the team", href: "/LANG/contact" }],
    },
    es: {
      answer:
        "Buena pregunta — y prefiero ser honesto antes que adivinar. El modelo comercial se conversa directamente con nuestro equipo, porque depende del tipo de operación y de tu caso particular, así que no te daré cifras que quizás no correspondan. Escríbenos y te explicamos las opciones sin compromiso.",
      links: [{ label: "Hablar con el equipo", href: "/LANG/contact" }],
    },
  },
  {
    id: "security",
    keywords: [
      "seguridad",
      "security",
      "confidencial",
      "confidential",
      "privacidad",
      "privacy",
      "datos",
      "data",
      "proteccion",
      "protection",
    ],
    en: {
      answer:
        "Your confidential information is protected in layers: the data room only opens after a digital NDA is signed, projects go through team verification before publishing, and you decide what to share and with whom. Sensitive details are never public — only what you choose to show appears in the open listing.",
      links: [{ label: "How it works", href: "/LANG/how-it-works" }],
    },
    es: {
      answer:
        "Tu información confidencial se protege por capas: el data room solo se abre tras firmar un NDA digital, los proyectos pasan por la verificación del equipo antes de publicarse, y tú decides qué compartir y con quién. Los detalles sensibles nunca son públicos — en la publicación abierta solo aparece lo que tú eliges mostrar.",
      links: [{ label: "Cómo funciona", href: "/LANG/how-it-works" }],
    },
  },
  {
    id: "install-pwa",
    keywords: [
      "instalar",
      "install",
      "app",
      "pwa",
      "aplicacion",
      "movil",
      "mobile",
      "pantalla de inicio",
      "home screen",
      "telefono",
      "phone",
    ],
    en: {
      answer:
        "VORTAMAX works as an installable app (PWA), no app store needed. On Android or desktop, your browser will offer \"Install\" from the prompt or its menu; on iPhone, open Safari, tap Share and choose \"Add to Home Screen\". You'll get quick, full-screen access from your home screen.",
    },
    es: {
      answer:
        "VORTAMAX funciona como una app instalable (PWA), sin pasar por una tienda de aplicaciones. En Android o escritorio, tu navegador te ofrecerá \"Instalar\" desde el aviso o su menú; en iPhone, abre Safari, toca Compartir y elige \"Agregar a pantalla de inicio\". Tendrás acceso rápido y a pantalla completa desde tu inicio.",
    },
  },
  {
    id: "vorta-scope",
    keywords: [
      "vorta",
      "asistente",
      "assistant",
      "que puedes hacer",
      "what can you do",
      "limites",
      "limits",
      "asesoria",
      "advice",
      "legal",
      "ia",
    ],
    en: {
      answer:
        "I'm VORTA, your guide inside the platform: I can point you through listing a project, exploring opportunities, mandates, commodities and generating contract drafts. What I don't do: I don't give legal or financial advice, and I never make up figures, prices or projects — if I don't know something, I'll say so and connect you with the team.",
      links: [
        { label: "How it works", href: "/LANG/how-it-works" },
        { label: "Contact us", href: "/LANG/contact" },
      ],
    },
    es: {
      answer:
        "Soy VORTA, tu guía dentro de la plataforma: te oriento para publicar un proyecto, explorar oportunidades, usar mandatos, commodities y generar borradores de contratos. Lo que no hago: no doy asesoría legal ni financiera, y nunca invento cifras, precios ni proyectos — si no sé algo, te lo digo y te conecto con el equipo.",
      links: [
        { label: "Cómo funciona", href: "/LANG/how-it-works" },
        { label: "Contacto", href: "/LANG/contact" },
      ],
    },
  },
  {
    "id": "markets-page",
    "keywords": [
      "mercados",
      "markets",
      "precios",
      "prices",
      "cobre",
      "copper",
      "oro",
      "gold",
      "metales",
      "metals",
      "indices",
      "cotizacion"
    ],
    "en": {
      "answer": "Yes — we have a Markets page where I bring together reference prices for base metals, precious metals, benchmark indices and digital assets, all in one place. The data comes from public sources with a delay, so think of it as sector context rather than trading prices. Take a look whenever you want a quick pulse of the market.",
      "links": [
        {
          "label": "View Markets",
          "href": "/LANG/markets"
        }
      ]
    },
    "es": {
      "answer": "¡Sí! Tenemos una página de Mercados donde reúno precios de referencia de metales base, metales preciosos, índices bursátiles y activos digitales, todo en un solo lugar. Los datos provienen de fuentes públicas con desfase, así que tómalos como contexto sectorial, no como precios para operar. Visítala cuando quieras un pulso rápido del mercado.",
      "links": [
        {
          "label": "Ver Mercados",
          "href": "/LANG/markets"
        }
      ]
    }
  },
  {
    "id": "rwa-tokenization",
    "keywords": [
      "tokenizacion",
      "tokenization",
      "rwa",
      "token",
      "tokens",
      "blockchain",
      "activos reales",
      "real world assets",
      "cripto",
      "crypto",
      "digital"
    ],
    "en": {
      "answer": "Great question. Tokenizing real-world assets (RWA) means representing ownership of a physical asset — like a mining stake or refined metal — as a digital token, making it easier to divide, trace and transfer. At VORTAMAX we follow this space closely, but to be clear: we do not offer token investments today. We are prepared to integrate asset tokenization when the regulatory framework allows it, and you can read our full perspective on the Markets page.",
      "links": [
        {
          "label": "Our RWA perspective",
          "href": "/LANG/markets"
        }
      ]
    },
    "es": {
      "answer": "¡Buena pregunta! Tokenizar activos reales (RWA) significa representar la propiedad de un activo físico — como una participación minera o metal refinado — mediante un token digital, lo que facilita dividirlo, trazarlo y transferirlo. En VORTAMAX seguimos este tema de cerca, pero te lo digo con claridad: hoy no ofrecemos inversión en tokens. Estamos preparados para integrar la tokenización de activos cuando el marco regulatorio lo permita, y puedes leer nuestra perspectiva completa en la página de Mercados.",
      "links": [
        {
          "label": "Nuestra perspectiva RWA",
          "href": "/LANG/markets"
        }
      ]
    }
  },
];

export const VORTA_FALLBACK = {
  en: {
    answer:
      "Hmm, that one I don't know — and I'd rather tell you than invent an answer. Could you try rephrasing your question with other words? Meanwhile, the How It Works page explains everything step by step, and the team is happy to help you personally.",
    links: [
      { label: "How it works", href: "/LANG/how-it-works" },
      { label: "Contact us", href: "/LANG/contact" },
    ],
  },
  es: {
    answer:
      "Mmm, esa no me la sé — y prefiero decírtelo antes que inventar una respuesta. ¿Puedes reformular tu pregunta con otras palabras? Mientras tanto, la página de Cómo Funciona explica todo paso a paso, y el equipo está feliz de ayudarte en persona.",
    links: [
      { label: "Cómo funciona", href: "/LANG/how-it-works" },
      { label: "Contacto", href: "/LANG/contact" },
    ],
  },
};
