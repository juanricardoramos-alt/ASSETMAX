/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PROJECT_ES, MANDATE_ES, COMMODITY_ES } from "./seed-i18n-es";

const prisma = new PrismaClient();

const PASSWORD = "assetmax123";

// Serialize a per-locale Spanish override for the `translations` column.
const esTranslations = (es: unknown) => JSON.stringify(es ? { es } : {});

type SeedProject = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  stage: string;
  dealType: string;
  verified: boolean;
  featured: boolean;
  investmentMin?: number;
  investmentMax?: number;
  revenue?: number;
  ebitda?: number;
  capacity?: string;
  production?: string;
  permits?: string;
  workforce?: number;
  areaHectares?: number;
  highlights: string[];
  specs: { label: string; value: string }[];
  images: string[];
  documents: { name: string; url: string; isConfidential: boolean }[];
  owner: "seller1" | "seller2" | "partner";
  views: number;
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

const DOC = "https://example.com/docs/sample.pdf";

const projects: SeedProject[] = [
  {
    slug: "atacama-blue-desalination-plant",
    title: "Atacama Blue Desalination Plant",
    summary:
      "Operating 1,050 l/s reverse-osmosis desalination plant with long-term take-or-pay contracts supplying mining operations in northern Chile.",
    description:
      "Atacama Blue is one of the largest privately held desalination assets in the Antofagasta region. Commissioned in 2019, the plant produces up to 1,050 litres per second of industrial-quality water, delivered through a 62 km pipeline network to three tier-one mining customers under take-or-pay contracts with a weighted remaining life of 14 years.\n\nThe asset benefits from full environmental permitting (RCA), a 30-year maritime concession, and an expansion permit that allows capacity to be doubled on the existing footprint. Revenue is 100% USD-denominated and indexed to inflation, with contracted EBITDA margins above 40%.\n\nThe current owners — an infrastructure fund reaching the end of its investment period — are seeking a partial sale of up to 60% of equity. Management, operations and maintenance teams remain in place, offering a truly turnkey entry into Latin America's most attractive water infrastructure market.",
    category: "water",
    country: "Chile",
    countryCode: "CL",
    city: "Antofagasta",
    region: "Antofagasta Region",
    lat: -23.65,
    lng: -70.4,
    stage: "operating",
    dealType: "partial_sale",
    verified: true,
    featured: true,
    investmentMin: 120_000_000,
    investmentMax: 180_000_000,
    revenue: 48_000_000,
    ebitda: 21_500_000,
    capacity: "1,050 l/s reverse osmosis",
    production: "31.5 Mm³/year delivered",
    permits: "RCA approved · 30-year maritime concession · Expansion permit granted",
    workforce: 86,
    areaHectares: 24,
    highlights: [
      "Take-or-pay contracts with 3 tier-one mining companies (14-year weighted life)",
      "100% USD-denominated, inflation-indexed revenue",
      "Expansion permit allows doubling capacity on existing footprint",
      "EBITDA margin above 40% with proven operating track record",
    ],
    specs: [
      { label: "Technology", value: "SWRO with energy recovery (ERI)" },
      { label: "Pipeline network", value: "62 km, 3 delivery points" },
      { label: "Energy supply", value: "PPA with solar provider through 2035" },
      { label: "Availability (2025)", value: "97.8%" },
    ],
    images: [
      u("photo-1559827260-dc66d52bef19"),
      u("photo-1613517495376-a56d59ac6dea"),
      u("photo-1581093458791-9f3c3900df4b"),
    ],
    documents: [
      { name: "Investment Teaser (EN)", url: DOC, isConfidential: false },
      { name: "Environmental Permit Summary", url: DOC, isConfidential: false },
      { name: "Audited Financial Statements 2023–2025", url: DOC, isConfidential: true },
      { name: "Offtake Contracts Summary", url: DOC, isConfidential: true },
      { name: "Technical Due Diligence Report", url: DOC, isConfidential: true },
    ],
    owner: "seller1",
    views: 1843,
  },
  {
    slug: "vizcachas-copper-project",
    title: "Vizcachas Copper Project",
    summary:
      "Advanced-exploration copper project with 480 Mt inferred resource at 0.52% Cu, 40 km from existing rail and power infrastructure.",
    description:
      "The Vizcachas Copper Project covers 8,200 hectares of highly prospective porphyry copper ground in Chile's Coquimbo region. Since 2018, over 68,000 metres of drilling have defined an inferred resource of 480 Mt at 0.52% Cu with a 0.2% cut-off, including a higher-grade core of 120 Mt at 0.71% Cu.\n\nA 2025 Preliminary Economic Assessment outlines a 60 ktpd conventional flotation operation producing 95 kt of copper in concentrate per year over an initial 18-year mine life, with C1 costs in the second quartile of the global cost curve. The project sits 40 km from the national power grid and an operating rail line to the port of Coquimbo.\n\nThe owners are seeking a strategic partner to fund feasibility and construction through a staged earn-in or outright acquisition. Water strategy is based on contracted desalinated supply, and community agreements are in place with all three neighbouring communities.",
    category: "mining",
    country: "Chile",
    countryCode: "CL",
    city: "Ovalle",
    region: "Coquimbo Region",
    lat: -30.6,
    lng: -71.2,
    stage: "greenfield",
    dealType: "capital_raise",
    verified: true,
    featured: true,
    investmentMin: 250_000_000,
    investmentMax: 400_000_000,
    capacity: "60 ktpd process plant (PEA design)",
    production: "95 kt/y copper in concentrate (planned)",
    permits: "Exploration permits current · EIA baseline studies 80% complete",
    workforce: 42,
    areaHectares: 8200,
    highlights: [
      "480 Mt inferred resource at 0.52% Cu, open at depth and along strike",
      "PEA (2025): NPV8 US$1.1B, IRR 24% at $4.20/lb copper",
      "40 km from grid power and operating rail to port",
      "Community agreements signed with all neighbouring communities",
    ],
    specs: [
      { label: "Resource", value: "480 Mt @ 0.52% Cu (inferred)" },
      { label: "High-grade core", value: "120 Mt @ 0.71% Cu" },
      { label: "Drilling completed", value: "68,400 m (diamond + RC)" },
      { label: "Mine life (PEA)", value: "18 years initial" },
    ],
    images: [
      u("photo-1578319439584-104c94d37305"),
      u("photo-1518709268805-4e9042af9f23"),
      u("photo-1465447142348-e9952c393450"),
    ],
    documents: [
      { name: "Corporate Presentation", url: DOC, isConfidential: false },
      { name: "PEA Executive Summary", url: DOC, isConfidential: false },
      { name: "Full PEA Report (2025)", url: DOC, isConfidential: true },
      { name: "Drill Database & Resource Model", url: DOC, isConfidential: true },
    ],
    owner: "partner",
    views: 2211,
  },
  {
    slug: "magallanes-green-hydrogen-ammonia",
    title: "Magallanes Green Hydrogen & Ammonia Complex",
    summary:
      "Utility-scale green hydrogen-to-ammonia project in southern Chile with 1.4 GW wind resource, port access and completed pre-feasibility.",
    description:
      "This project will convert Magallanes' world-class wind resource — capacity factors above 55% — into green ammonia for export to Europe and Asia. The development comprises 1.4 GW of onshore wind, 850 MW of electrolysis, an ammonia synthesis loop of 720 ktpa, and a dedicated export terminal on the Strait of Magellan.\n\nPre-feasibility was completed in 2025 with a projected levelized cost of ammonia in the lowest global decile. Land is secured under long-term options covering 41,000 hectares, met-mast campaigns have 4 years of bankable wind data, and the maritime concession application is in its final stage.\n\nThe sponsors are seeking a strategic partner for a joint venture to fund the feasibility stage and FEED, with a target FID in 2028. Offtake discussions are advanced with two European utilities and a Japanese trading house.",
    category: "energy",
    country: "Chile",
    countryCode: "CL",
    city: "Punta Arenas",
    region: "Magallanes Region",
    lat: -53.16,
    lng: -70.9,
    stage: "greenfield",
    dealType: "joint_venture",
    verified: true,
    featured: true,
    investmentMin: 800_000_000,
    investmentMax: 1_200_000_000,
    capacity: "1.4 GW wind · 850 MW electrolysis · 720 ktpa NH₃",
    production: "Target FID 2028 · first ammonia 2031",
    permits: "Land options secured · maritime concession in final review",
    workforce: 28,
    areaHectares: 41000,
    highlights: [
      "Wind capacity factors above 55% — among the best on the planet",
      "Levelized cost of ammonia projected in the lowest global decile",
      "4 years of bankable met-mast wind data",
      "Advanced offtake discussions with European and Asian buyers",
    ],
    specs: [
      { label: "Wind resource", value: "9.2 m/s average at 120 m hub height" },
      { label: "Electrolyzer technology", value: "PEM, modular 20 MW units" },
      { label: "Export terminal", value: "Dedicated berth, 25,000 DWT vessels" },
      { label: "Grid backup", value: "Islanded system with 120 MWh BESS" },
    ],
    images: [
      u("photo-1466611653911-95081537e5b7"),
      u("photo-1548337138-e87d889cc369"),
      u("photo-1513828583688-c52646db42da"),
    ],
    documents: [
      { name: "Project Teaser (EN/ES)", url: DOC, isConfidential: false },
      { name: "Pre-Feasibility Summary", url: DOC, isConfidential: true },
      { name: "Wind Resource Assessment", url: DOC, isConfidential: true },
    ],
    owner: "partner",
    views: 3105,
  },
  {
    slug: "huayra-zinc-copper-mine",
    title: "Huayra Zinc-Copper Mine",
    summary:
      "Producing underground zinc-copper mine in central Peru — 1.8 Mtpa throughput, US$74M EBITDA, 11-year reserve life.",
    description:
      "Huayra is an established underground polymetallic operation in Peru's prolific central belt, in continuous production since 2009. The mine processes 1.8 Mtpa through a conventional crush-grind-flotation circuit producing separate zinc and copper concentrates, with silver credits.\n\nCurrent reserves support an 11-year life at present throughput, with an additional 9 Mt of measured & indicated resources offering clear conversion upside. A 2024 plant debottlenecking raised recovery by 3.2 percentage points, and an ongoing exploration program has intercepted mineralization 400 m below current workings.\n\nThe family group that controls the asset is seeking a partial sale of 30–49% to fund the Deep Huayra expansion, with an option path to control. The operation is fully permitted, powered from the national grid, and holds current collective agreements with its two unions through 2027.",
    category: "mining",
    country: "Peru",
    countryCode: "PE",
    city: "Cerro de Pasco",
    region: "Pasco Region",
    lat: -10.68,
    lng: -76.26,
    stage: "operating",
    dealType: "partial_sale",
    verified: true,
    featured: false,
    investmentMin: 90_000_000,
    investmentMax: 160_000_000,
    revenue: 218_000_000,
    ebitda: 74_000_000,
    capacity: "1.8 Mtpa underground",
    production: "82 kt Zn + 14 kt Cu in concentrate (2025)",
    permits: "Fully permitted · EIA amendment for expansion in progress",
    workforce: 1240,
    areaHectares: 3600,
    highlights: [
      "16 consecutive years of profitable production",
      "11-year reserve life plus 9 Mt M&I resource conversion upside",
      "Deep Huayra intercepts 400 m below current workings",
      "Silver credits cover ~35% of site operating costs",
    ],
    specs: [
      { label: "Mining method", value: "Sublevel stoping with paste backfill" },
      { label: "2025 production", value: "82 kt Zn, 14 kt Cu, 2.1 Moz Ag" },
      { label: "AISC", value: "$0.61/lb Zn net of credits" },
      { label: "Concentrate offtake", value: "Contracted through 2027" },
    ],
    images: [
      u("photo-1504917595217-d4dc5ebe6122"),
      u("photo-1587919228979-4e77e5d8a41f"),
      u("photo-1516216628859-9bccecab13ca"),
    ],
    documents: [
      { name: "Asset Overview", url: DOC, isConfidential: false },
      { name: "Reserve & Resource Statement 2025", url: DOC, isConfidential: true },
      { name: "3-Year Financial Model", url: DOC, isConfidential: true },
    ],
    owner: "seller2",
    views: 1567,
  },
  {
    slug: "ica-valley-agro-export-platform",
    title: "Ica Valley Agro-Export Platform",
    summary:
      "Vertically integrated blueberry and avocado producer-exporter with 1,850 planted hectares, packing plant and US/EU retail programs.",
    description:
      "This platform consolidates three contiguous agricultural estates in Peru's Ica valley into one of the country's most efficient fresh-produce exporters. The operation manages 1,850 planted hectares — 1,050 of blueberries and 800 of Hass avocado — supported by a 28,000 m² packing facility with 14 processing lines, cold storage for 6,200 pallets, and senior water rights supplemented by 42 licensed wells.\n\nFruit is shipped under season-long programs to US and European retailers, with 78% of volume pre-committed for the 2026 campaign. The blueberry orchards are transitioning to higher-yield genetics, with 320 hectares already replanted and out-performing legacy varieties by 40%.\n\nShareholders seek growth capital to complete the genetic transition and add 600 hectares of ready-to-plant land already under control, targeting a doubling of EBITDA by 2029. A minority stake with governance rights is on offer; a larger transaction can be discussed with strategic buyers.",
    category: "agro",
    country: "Peru",
    countryCode: "PE",
    city: "Ica",
    region: "Ica Region",
    lat: -14.07,
    lng: -75.73,
    stage: "expansion",
    dealType: "capital_raise",
    verified: true,
    featured: false,
    investmentMin: 45_000_000,
    investmentMax: 70_000_000,
    revenue: 96_000_000,
    ebitda: 27_000_000,
    capacity: "28,000 m² packing · 6,200 pallet cold storage",
    production: "19,400 t blueberries · 11,200 t avocado (2025)",
    permits: "SENASA certified · GlobalG.A.P. · SMETA audited",
    workforce: 4800,
    areaHectares: 2450,
    highlights: [
      "78% of 2026 campaign volume pre-committed to US/EU retailers",
      "New genetics out-yielding legacy blueberry varieties by 40%",
      "Senior water rights plus 42 licensed wells",
      "600 additional hectares under control, ready to plant",
    ],
    specs: [
      { label: "Planted area", value: "1,050 ha blueberry · 800 ha avocado" },
      { label: "Certifications", value: "GlobalG.A.P., SMETA, GRASP, HACCP" },
      { label: "Logistics", value: "3.5 h to Callao port, own cold chain" },
      { label: "Peak workforce", value: "4,800 in harvest season" },
    ],
    images: [
      u("photo-1500382017468-9049fed747ef"),
      u("photo-1574943320219-553eb213f72d"),
      u("photo-1595855759920-86582396756a"),
    ],
    documents: [
      { name: "Investor Presentation", url: DOC, isConfidential: false },
      { name: "Agronomic Report 2025", url: DOC, isConfidential: true },
      { name: "Financial Statements & Projections", url: DOC, isConfidential: true },
    ],
    owner: "seller2",
    views: 987,
  },
  {
    slug: "bajio-automotive-components-plant",
    title: "Bajío Automotive Components Plant",
    summary:
      "Tier-1 aluminum die-casting and machining plant in Mexico's Bajío corridor — USMCA-positioned, 92% capacity utilization, blue-chip OEM contracts.",
    description:
      "Strategically located in Querétaro's automotive corridor, this Tier-1 supplier produces high-pressure aluminum die-cast structural components and precision-machined assemblies for North American OEM platforms. The 42,000 m² facility operates 11 die-casting cells (400–2,700 t) and 38 CNC machining centers, holding IATF 16949 and ISO 14001 certifications.\n\nThe plant runs at 92% utilization with platform contracts extending through 2031, including two recently awarded EV structural programs that begin ramping in 2027. Nearshoring demand has the commercial pipeline at a record US$140M in quoted new business.\n\nThe international group that owns the plant is divesting to focus on its European core. The transaction is structured as a full sale of the Mexican entity, including land, equipment, working capital and workforce, with management willing to remain post-transaction.",
    category: "manufacturing",
    country: "Mexico",
    countryCode: "MX",
    city: "Querétaro",
    region: "Querétaro",
    lat: 20.59,
    lng: -100.39,
    stage: "operating",
    dealType: "full_sale",
    verified: true,
    featured: false,
    investmentMin: 85_000_000,
    investmentMax: 110_000_000,
    revenue: 128_000_000,
    ebitda: 19_500_000,
    capacity: "11 HPDC cells (400–2,700 t) · 38 CNC centers",
    production: "9.4M components/year",
    permits: "IATF 16949 · ISO 14001 · IMMEX program",
    workforce: 940,
    areaHectares: 11,
    highlights: [
      "92% capacity utilization with contracts through 2031",
      "Two EV structural programs awarded, ramping 2027",
      "US$140M quoted new-business pipeline from nearshoring",
      "USMCA regional-content compliant",
    ],
    specs: [
      { label: "Die-casting range", value: "400 t – 2,700 t locking force" },
      { label: "Key customers", value: "3 global OEMs, 2 Tier-1 systems" },
      { label: "Quality", value: "12 PPM rolling 12-month" },
      { label: "Energy", value: "4.2 MW rooftop solar (30% of load)" },
    ],
    images: [
      u("photo-1565043666747-69f6646db940"),
      u("photo-1504328345606-18bbc8c9d7d1"),
      u("photo-1581091226825-a6a2a5aee158"),
    ],
    documents: [
      { name: "Confidential Information Memorandum (Teaser)", url: DOC, isConfidential: false },
      { name: "Equipment Register", url: DOC, isConfidential: true },
      { name: "Customer Contract Summaries", url: DOC, isConfidential: true },
    ],
    owner: "seller1",
    views: 1290,
  },
  {
    slug: "sonora-solar-park-210mw",
    title: "Sonora Solar Park — 210 MW",
    summary:
      "Operating 210 MWac solar PV plant in Sonora with hybrid PPA structure, P50 generation of 585 GWh/year and repowering upside.",
    description:
      "Commissioned in 2021, Sonora Solar Park spans 640 hectares of high-irradiance desert with a P50 yield of 585 GWh per year. The plant operates under a hybrid revenue structure: 70% of output is contracted under a 15-year USD-denominated PPA with an investment-grade industrial offtaker, and the remainder is sold at node prices that have averaged above PPA levels for the past three years.\n\nThe asset uses single-axis trackers and 1500V bifacial modules, with availability of 99.1% since COD. An interconnection expansion already approved allows adding 80 MW of capacity plus a 100 MWh battery system on adjacent optioned land.\n\nThe selling fund is exiting at the end of its lifecycle. This is a clean, fully contracted operating asset with development upside, suitable for yield-focused infrastructure investors seeking exposure to Mexico's industrial north.",
    category: "energy",
    country: "Mexico",
    countryCode: "MX",
    city: "Hermosillo",
    region: "Sonora",
    lat: 29.07,
    lng: -110.96,
    stage: "operating",
    dealType: "full_sale",
    verified: true,
    featured: true,
    investmentMin: 160_000_000,
    investmentMax: 195_000_000,
    revenue: 32_000_000,
    ebitda: 26_000_000,
    capacity: "210 MWac / 268 MWdc",
    production: "585 GWh/year (P50)",
    permits: "Full generation permit · interconnection expansion approved",
    workforce: 34,
    areaHectares: 640,
    highlights: [
      "70% contracted under 15-year USD PPA, investment-grade offtaker",
      "99.1% availability since commercial operation",
      "Approved interconnection for +80 MW and 100 MWh BESS",
      "EBITDA margin above 80%",
    ],
    specs: [
      { label: "Technology", value: "Bifacial 1500V, single-axis trackers" },
      { label: "COD", value: "March 2021" },
      { label: "Degradation observed", value: "0.42%/year" },
      { label: "O&M", value: "Contracted through 2029, full-wrap" },
    ],
    images: [
      u("photo-1509391366360-2e959784a276"),
      u("photo-1497435334941-8c899ee9e8e9"),
      u("photo-1473341304170-971dccb5ac1e"),
    ],
    documents: [
      { name: "Asset Teaser", url: DOC, isConfidential: false },
      { name: "Independent Generation Report", url: DOC, isConfidential: true },
      { name: "PPA Summary & Financial Model", url: DOC, isConfidential: true },
    ],
    owner: "seller1",
    views: 2478,
  },
  {
    slug: "desert-gateway-data-center-campus",
    title: "Desert Gateway Data Center Campus",
    summary:
      "300 MW hyperscale-ready data center campus under construction in Arizona — powered land, water-neutral cooling, first 60 MW pre-leased.",
    description:
      "Desert Gateway is a 120-acre data center campus in the Phoenix metro area, one of North America's fastest-growing digital infrastructure markets. The project holds a signed 300 MW power capacity agreement with the local utility — with 90 MW deliverable in 2027 — and a fully entitled site with completed grading and utility corridors.\n\nBuilding A (60 MW IT load) is under construction with delivery scheduled for Q3 2027 and is fully pre-leased to an investment-grade hyperscaler under a 15-year triple-net structure. Buildings B and C (240 MW combined) are at shell-design stage with two hyperscalers in advanced leasing negotiations.\n\nThe developer seeks capital partners for the remaining US$1.1B build-out, either at the project level or through a programmatic joint venture. The campus employs closed-loop liquid cooling achieving water neutrality — a decisive permitting advantage in the Southwest.",
    category: "infrastructure",
    country: "United States",
    countryCode: "US",
    city: "Phoenix",
    region: "Arizona",
    lat: 33.45,
    lng: -112.07,
    stage: "construction",
    dealType: "capital_raise",
    verified: true,
    featured: true,
    investmentMin: 300_000_000,
    investmentMax: 1_100_000_000,
    capacity: "300 MW total IT load (60 MW under construction)",
    production: "Building A delivery Q3 2027",
    permits: "Fully entitled · 300 MW utility capacity agreement signed",
    workforce: 65,
    areaHectares: 49,
    highlights: [
      "300 MW secured power in a power-constrained market",
      "Building A 100% pre-leased, 15-year NNN, investment-grade tenant",
      "Water-neutral closed-loop cooling design",
      "Phoenix: 5 GW+ of hyperscale demand pipeline",
    ],
    specs: [
      { label: "Site", value: "120 acres, fully entitled" },
      { label: "Power delivery", value: "90 MW in 2027, 300 MW by 2030" },
      { label: "Design PUE", value: "1.18 annualized" },
      { label: "Fiber", value: "3 long-haul routes adjacent" },
    ],
    images: [
      u("photo-1558494949-ef010cbdcc31"),
      u("photo-1586772002130-b0f3daa6288b"),
      u("photo-1544197150-b99a580bb7a8"),
    ],
    documents: [
      { name: "Campus Overview", url: DOC, isConfidential: false },
      { name: "Power Agreement Summary", url: DOC, isConfidential: true },
      { name: "Construction Budget & Schedule", url: DOC, isConfidential: true },
    ],
    owner: "seller1",
    views: 3560,
  },
  {
    slug: "andalucia-solar-portfolio-240mw",
    title: "Andalucía Solar Portfolio — 240 MW",
    summary:
      "Four operating solar PV plants across southern Spain totalling 240 MW, blend of regulated revenues and merchant with PPA floor.",
    description:
      "This portfolio aggregates four utility-scale photovoltaic plants across Seville, Córdoba and Jaén provinces, all grid-connected between 2020 and 2023. Combined P50 output is 468 GWh per year, with irradiance among the highest in continental Europe.\n\nRevenues blend Spain's regulated framework (38% of output), a 10-year pay-as-produced PPA with a European utility (41%), and merchant exposure with a contracted floor (21%). All plants share an O&M provider with a portfolio-wide availability guarantee of 98.5%.\n\nThe sponsor is divesting 100% of the holding company in a clean share deal. Grid capacity at two substations allows 60 MW of incremental hybridization (storage or wind), and permitting for a 50 MWh battery at the Córdoba site is underway.",
    category: "energy",
    country: "Spain",
    countryCode: "ES",
    city: "Seville",
    region: "Andalusia",
    lat: 37.39,
    lng: -5.98,
    stage: "operating",
    dealType: "full_sale",
    verified: true,
    featured: false,
    investmentMin: 210_000_000,
    investmentMax: 250_000_000,
    revenue: 38_000_000,
    ebitda: 30_500_000,
    capacity: "240 MW across 4 plants",
    production: "468 GWh/year (P50)",
    permits: "All plants fully permitted and operational",
    workforce: 22,
    areaHectares: 520,
    highlights: [
      "Diversified revenue: regulated + PPA + floored merchant",
      "Among the highest irradiance in continental Europe",
      "60 MW hybridization headroom at existing grid connections",
      "Clean single-holdco share transaction",
    ],
    specs: [
      { label: "Plants", value: "4 (52–71 MW each)" },
      { label: "CODs", value: "2020–2023" },
      { label: "Portfolio availability", value: "98.5% guaranteed" },
      { label: "Storage pipeline", value: "50 MWh BESS in permitting" },
    ],
    images: [
      u("photo-1508514177221-188b1cf16e9d"),
      u("photo-1466629437334-b4f6603563c5"),
      u("photo-1477959858617-67f85cf4f1df"),
    ],
    documents: [
      { name: "Portfolio Teaser", url: DOC, isConfidential: false },
      { name: "Technical Advisor Report", url: DOC, isConfidential: true },
      { name: "Revenue Contracts & Model", url: DOC, isConfidential: true },
    ],
    owner: "seller2",
    views: 1755,
  },
  {
    slug: "valencia-cold-chain-terminal",
    title: "Valencia Agrifood Cold-Chain Terminal",
    summary:
      "Port-adjacent refrigerated logistics terminal serving Mediterranean agrifood exports — 38,000 pallet positions, 96% occupancy, rail siding.",
    description:
      "Located 1.8 km from the Port of Valencia's container terminals, this cold-chain logistics platform is a critical node for Spanish and North African fresh produce flowing to European markets. The facility offers 38,000 pallet positions across five temperature regimes, 42 loading docks, on-site customs and border inspection posts, and a private rail siding with daily reefer services.\n\nOccupancy has averaged 96% over the past four years with a contracted customer base of exporters, importers and 3PLs on multi-year agreements. A 2024 ammonia-to-CO₂ refrigeration conversion cut energy costs by 18%, complemented by a 2.8 MW rooftop solar installation.\n\nThe family owners will consider a partial sale of up to 49% alongside a management continuity agreement, to fund a permitted 12,000-pallet expansion on adjacent owned land.",
    category: "ports",
    country: "Spain",
    countryCode: "ES",
    city: "Valencia",
    region: "Valencian Community",
    lat: 39.44,
    lng: -0.32,
    stage: "operating",
    dealType: "partial_sale",
    verified: false,
    featured: false,
    investmentMin: 55_000_000,
    investmentMax: 80_000_000,
    revenue: 41_000_000,
    ebitda: 13_800_000,
    capacity: "38,000 pallet positions · 42 docks",
    production: "96% average occupancy (2022–2025)",
    permits: "Operating licenses current · expansion permit granted",
    workforce: 310,
    areaHectares: 14,
    highlights: [
      "1.8 km from Port of Valencia container terminals",
      "96% occupancy with multi-year contracted customers",
      "Permitted 12,000-pallet expansion on owned land",
      "18% energy cost reduction from refrigeration conversion",
    ],
    specs: [
      { label: "Temperature regimes", value: "5 (−25°C to +14°C)" },
      { label: "Rail", value: "Private siding, daily reefer service" },
      { label: "On-site services", value: "Customs, SOIVRE, border inspection" },
      { label: "Solar", value: "2.8 MW rooftop" },
    ],
    images: [
      u("photo-1586528116311-ad8dd3c8310d"),
      u("photo-1494412574643-ff11b0a5c1c3"),
      u("photo-1578575437130-527eed3abbec"),
    ],
    documents: [
      { name: "Facility Overview", url: DOC, isConfidential: false },
      { name: "Customer & Occupancy Analysis", url: DOC, isConfidential: true },
    ],
    owner: "seller2",
    views: 640,
  },
  {
    slug: "fujairah-bulk-liquids-terminal",
    title: "Fujairah Bulk Liquids Terminal",
    summary:
      "Operating bulk liquids storage terminal at the Port of Fujairah — 480,000 m³ capacity, deep-water jetty access, take-or-pay storage contracts.",
    description:
      "Positioned at the world's second-largest bunkering hub outside the Strait of Hormuz, this terminal provides 480,000 m³ of storage across 34 tanks for clean petroleum products, biofuels and chemicals. The asset enjoys deep-water jetty access for vessels up to Suezmax, direct pipeline connectivity to the port's common-user infrastructure, and land reserved for a 120,000 m³ expansion.\n\nCapacity is 94% contracted under take-or-pay agreements with international traders and one national oil company, with a weighted average remaining term of 4.2 years. The terminal has recorded zero lost-time incidents for six consecutive years and holds full HSE certifications.\n\nThe owner, a regional infrastructure platform, is offering a 40–60% equity stake to fund diversification into renewable fuels storage, including a feasibility-stage SAF and methanol conversion of six tanks.",
    category: "ports",
    country: "United Arab Emirates",
    countryCode: "AE",
    city: "Fujairah",
    region: "Emirate of Fujairah",
    lat: 25.13,
    lng: 56.34,
    stage: "operating",
    dealType: "partial_sale",
    verified: true,
    featured: true,
    investmentMin: 140_000_000,
    investmentMax: 220_000_000,
    revenue: 52_000_000,
    ebitda: 34_000_000,
    capacity: "480,000 m³ · 34 tanks",
    production: "94% contracted (take-or-pay)",
    permits: "Full port authority concession through 2043",
    workforce: 155,
    areaHectares: 18,
    highlights: [
      "World's #2 bunkering hub, outside the Strait of Hormuz",
      "94% take-or-pay contracted capacity",
      "Deep-water jetty for Suezmax vessels",
      "Expansion land reserved for +120,000 m³",
    ],
    specs: [
      { label: "Tank range", value: "2,000 – 40,000 m³" },
      { label: "Products", value: "CPP, biofuels, chemicals" },
      { label: "Jetty draft", value: "16.5 m" },
      { label: "Safety record", value: "6 years LTI-free" },
    ],
    images: [
      u("photo-1518623489648-a173ef7824f3"),
      u("photo-1605745341112-85968b19335b"),
      u("photo-1494412574643-ff11b0a5c1c3"),
    ],
    documents: [
      { name: "Terminal Fact Sheet", url: DOC, isConfidential: false },
      { name: "Storage Contract Profile", url: DOC, isConfidential: true },
      { name: "HSE & Inspection Records", url: DOC, isConfidential: true },
    ],
    owner: "partner",
    views: 2890,
  },
  {
    slug: "pilbara-west-lithium-project",
    title: "Pilbara West Lithium Project",
    summary:
      "Hard-rock lithium project in Western Australia entering construction — 41 Mt at 1.32% Li₂O, binding offtake for 60% of production.",
    description:
      "Pilbara West is a construction-ready spodumene project in Western Australia's premier lithium district. The 2025 Definitive Feasibility Study defines ore reserves of 41 Mt at 1.32% Li₂O supporting a 2.4 Mtpa concentrator producing approximately 340 ktpa of SC5.5 concentrate over a 14-year initial mine life.\n\nEarly works commenced in Q1 2026: camp installation, access roads and bulk earthworks are 30% complete. Binding offtake agreements cover 60% of nameplate production with two Asian cathode manufacturers, both including prepayment facilities. All primary approvals — mining leases, native title agreements and environmental licensing — are in hand.\n\nThe company seeks US$300–450M in project-level funding to complete construction, structured as equity, streaming or a combination. First concentrate is targeted for H2 2028, positioned in the first cost quartile.",
    category: "mining",
    country: "Australia",
    countryCode: "AU",
    city: "Port Hedland",
    region: "Western Australia",
    lat: -20.31,
    lng: 118.58,
    stage: "construction",
    dealType: "capital_raise",
    verified: true,
    featured: false,
    investmentMin: 300_000_000,
    investmentMax: 450_000_000,
    capacity: "2.4 Mtpa concentrator (DFS design)",
    production: "340 ktpa SC5.5 target · first output H2 2028",
    permits: "Mining leases granted · native title agreements executed",
    workforce: 120,
    areaHectares: 5200,
    highlights: [
      "DFS complete: 41 Mt @ 1.32% Li₂O reserve",
      "Binding offtake for 60% of production with prepayments",
      "Early works 30% complete",
      "First-quartile cost position forecast",
    ],
    specs: [
      { label: "Reserve", value: "41 Mt @ 1.32% Li₂O" },
      { label: "Mine life", value: "14 years initial" },
      { label: "Port", value: "Port Hedland, 145 km sealed road" },
      { label: "Power", value: "Hybrid gas-solar-BESS IPP contract" },
    ],
    images: [
      u("photo-1516216628859-9bccecab13ca"),
      u("photo-1578319439584-104c94d37305"),
      u("photo-1465447142348-e9952c393450"),
    ],
    documents: [
      { name: "DFS Executive Summary", url: DOC, isConfidential: false },
      { name: "Offtake Term Sheets", url: DOC, isConfidential: true },
      { name: "Construction Schedule & Budget", url: DOC, isConfidential: true },
    ],
    owner: "seller1",
    views: 2034,
  },
  {
    slug: "riverina-almond-estate",
    title: "Riverina Almond Estate & Processing",
    summary:
      "3,400-hectare almond orchard portfolio in NSW with on-site hulling and processing, 19 GL secure water entitlements included.",
    description:
      "One of Australia's largest privately held almond platforms, the Riverina Estate comprises 3,400 planted hectares across three properties in New South Wales' Murrumbidgee region, with an average orchard age of nine years — entering peak yield. The sale includes 19 GL of high-security water entitlements, an on-site hulling and shelling complex rated at 28,000 t/year, and biomass energy generation from shell waste.\n\nProduction in 2025 reached 11,800 tonnes of kernel-equivalent, marketed through established programs to India, Europe and domestic manufacturers. The integrated model captures processing margin typically lost by growers.\n\nThe institutional owner is divesting as part of a portfolio rebalancing. The asset suits pension funds, agri-platforms or strategic processors seeking scaled, water-secure permanent-crop exposure in a proven district.",
    category: "agro",
    country: "Australia",
    countryCode: "AU",
    city: "Griffith",
    region: "New South Wales",
    lat: -34.29,
    lng: 146.04,
    stage: "operating",
    dealType: "full_sale",
    verified: false,
    featured: false,
    investmentMin: 190_000_000,
    investmentMax: 240_000_000,
    revenue: 68_000_000,
    ebitda: 24_500_000,
    capacity: "28,000 t/year hulling & shelling",
    production: "11,800 t kernel-equivalent (2025)",
    permits: "Water entitlements: 19 GL high-security included",
    workforce: 210,
    areaHectares: 3400,
    highlights: [
      "Orchards entering peak-yield years (average age 9)",
      "19 GL high-security water entitlements included in sale",
      "Integrated processing captures full value chain margin",
      "Biomass energy from shell waste covers 60% of processing load",
    ],
    specs: [
      { label: "Planted area", value: "3,400 ha across 3 properties" },
      { label: "Varieties", value: "Nonpareil 55%, Carmel, Monterey" },
      { label: "Irrigation", value: "Full drip, soil-moisture automated" },
      { label: "Markets", value: "India, EU, domestic" },
    ],
    images: [
      u("photo-1625246333195-78d9c38ad449"),
      u("photo-1464226184884-fa280b87c399"),
      u("photo-1500382017468-9049fed747ef"),
    ],
    documents: [
      { name: "Estate Overview", url: DOC, isConfidential: false },
      { name: "Water Entitlement Register", url: DOC, isConfidential: true },
      { name: "Yield History & Projections", url: DOC, isConfidential: true },
    ],
    owner: "seller2",
    views: 812,
  },
  {
    slug: "casablanca-atlantic-industrial-park",
    title: "Casablanca Atlantic Industrial Park",
    summary:
      "220-hectare industrial and logistics park in expansion near Casablanca — 74% leased, free-zone status, anchor tenants in automotive and textiles.",
    description:
      "Casablanca Atlantic is an established industrial park 28 km from the Port of Casablanca and 19 km from Mohammed V International Airport, at the heart of Morocco's manufacturing corridor. Phase 1 and 2 (140 ha) are 74% leased to 38 tenants including European automotive component makers, textile exporters and regional 3PLs, benefiting from free-zone tax status and on-site customs.\n\nPhase 3 (80 ha) is serviced and ready for development, with a build-to-suit pipeline of 190,000 m² in negotiation — anchored by an EV-harness manufacturer expanding from Europe. The park offers dual power feeds, a private wastewater plant and dedicated fiber.\n\nThe developer seeks a capital partner for Phase 3 build-out and land bank expansion, via preferred equity at the parent or a stake in the park-owning entity. Morocco's export platform to Europe continues to attract record FDI, and industrial vacancy in greater Casablanca stands below 3%.",
    category: "realestate",
    country: "Morocco",
    countryCode: "MA",
    city: "Casablanca",
    region: "Casablanca-Settat",
    lat: 33.53,
    lng: -7.65,
    stage: "expansion",
    dealType: "capital_raise",
    verified: true,
    featured: false,
    investmentMin: 60_000_000,
    investmentMax: 95_000_000,
    revenue: 22_000_000,
    ebitda: 14_200_000,
    capacity: "220 ha total · 80 ha ready for Phase 3",
    production: "74% leased (Phases 1–2)",
    permits: "Free-zone status · Phase 3 fully serviced & permitted",
    workforce: 60,
    areaHectares: 220,
    highlights: [
      "Free-zone status with on-site customs",
      "74% leased to 38 tenants, automotive-anchored",
      "190,000 m² build-to-suit pipeline in negotiation",
      "Industrial vacancy in greater Casablanca below 3%",
    ],
    specs: [
      { label: "Location", value: "28 km to port, 19 km to airport" },
      { label: "Utilities", value: "Dual power feeds, private WWTP, fiber" },
      { label: "Tenant mix", value: "Automotive, textiles, logistics" },
      { label: "WALT", value: "6.8 years" },
    ],
    images: [
      u("photo-1586528116311-ad8dd3c8310d"),
      u("photo-1565043666747-69f6646db940"),
      u("photo-1486406146926-c627a92ad1ab"),
    ],
    documents: [
      { name: "Park Brochure", url: DOC, isConfidential: false },
      { name: "Rent Roll & Lease Abstracts", url: DOC, isConfidential: true },
    ],
    owner: "seller1",
    views: 745,
  },
];

async function main() {
  console.log("Seeding VORTAMAX Global…");

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  // --- Users -----------------------------------------------------------------
  const admin = await prisma.user.upsert({
    where: { email: "admin@vortamax.global" },
    update: {},
    create: {
      name: "Alexandra Reyes",
      email: "admin@vortamax.global",
      passwordHash,
      role: "ADMIN",
      company: "VORTAMAX Global",
      country: "CL",
    },
  });

  const partner = await prisma.user.upsert({
    where: { email: "partner@vortamax.global" },
    update: {},
    create: {
      name: "Marcus Aldridge",
      email: "partner@vortamax.global",
      passwordHash,
      role: "PARTNER",
      company: "Aldridge Industrial Holdings",
      country: "AE",
      verifiedSeller: true,
    },
  });

  const seller1 = await prisma.user.upsert({
    where: { email: "seller@vortamax.global" },
    update: {},
    create: {
      name: "Carolina Fuentes",
      email: "seller@vortamax.global",
      passwordHash,
      role: "SELLER",
      company: "Andes Capital Advisors",
      country: "CL",
      verifiedSeller: true,
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: "seller2@vortamax.global" },
    update: {},
    create: {
      name: "James Whitmore",
      email: "seller2@vortamax.global",
      passwordHash,
      role: "SELLER",
      company: "Meridian Asset Partners",
      country: "AU",
      verifiedSeller: false,
    },
  });

  const investor = await prisma.user.upsert({
    where: { email: "investor@vortamax.global" },
    update: {},
    create: {
      name: "Sofia Lindqvist",
      email: "investor@vortamax.global",
      passwordHash,
      role: "INVESTOR",
      company: "Northbridge Infrastructure Fund",
      country: "ES",
    },
  });

  const owners = { seller1, seller2, partner };

  // --- Projects --------------------------------------------------------------
  for (const p of projects) {
    const { images, documents, owner, highlights, specs, ...rest } = p;
    const created = await prisma.project.upsert({
      where: { slug: p.slug },
      update: { translations: esTranslations(PROJECT_ES[p.slug]) },
      create: {
        ...rest,
        highlights: JSON.stringify(highlights),
        specs: JSON.stringify(specs),
        translations: esTranslations(PROJECT_ES[p.slug]),
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 86_400_000),
        ownerId: owners[owner].id,
        images: {
          create: images.map((url, i) => ({ url, alt: p.title, order: i })),
        },
        documents: { create: documents },
      },
    });
    console.log(`  ✔ ${created.title}`);
  }

  // One project pending review (for the admin queue demo)
  await prisma.project.upsert({
    where: { slug: "patagonia-wind-farm-repowering" },
    update: {
      translations: esTranslations(PROJECT_ES["patagonia-wind-farm-repowering"]),
    },
    create: {
      slug: "patagonia-wind-farm-repowering",
      translations: esTranslations(PROJECT_ES["patagonia-wind-farm-repowering"]),
      title: "Patagonia Wind Farm Repowering",
      summary:
        "Repowering of an existing 48 MW wind farm in Argentine Patagonia to 120 MW with new-generation turbines.",
      description:
        "Repowering opportunity for a 2009-vintage wind farm in Chubut province. The project replaces 32 legacy turbines with 20 modern 6 MW units, using existing grid connection rights, roads and substations. Wind resource is measured at 10.4 m/s average. The sponsor seeks capital for the US$140M repowering program.",
      category: "energy",
      country: "Argentina",
      countryCode: "AR",
      city: "Comodoro Rivadavia",
      region: "Chubut",
      lat: -45.86,
      lng: -67.48,
      stage: "expansion",
      dealType: "capital_raise",
      status: "IN_REVIEW",
      verified: false,
      featured: false,
      investmentMin: 100_000_000,
      investmentMax: 140_000_000,
      capacity: "120 MW post-repowering",
      permits: "Existing generation license · grid rights retained",
      highlights: JSON.stringify([
        "Existing grid connection and land rights",
        "10.4 m/s measured wind resource",
        "Brownfield permitting advantage",
      ]),
      specs: JSON.stringify([
        { label: "Current capacity", value: "48 MW (2009 COD)" },
        { label: "Target capacity", value: "120 MW" },
      ]),
      ownerId: seller2.id,
      images: {
        create: [
          { url: u("photo-1466611653911-95081537e5b7"), alt: "Wind turbines", order: 0 },
        ],
      },
      documents: {
        create: [{ name: "Repowering Concept Note", url: DOC, isConfidential: false }],
      },
    },
  });
  console.log("  ✔ Patagonia Wind Farm Repowering (IN_REVIEW)");

  // --- Demo interactions -----------------------------------------------------
  const atacama = await prisma.project.findUnique({ where: { slug: "atacama-blue-desalination-plant" } });
  const sonora = await prisma.project.findUnique({ where: { slug: "sonora-solar-park-210mw" } });
  const fujairah = await prisma.project.findUnique({ where: { slug: "fujairah-bulk-liquids-terminal" } });

  if (atacama && sonora && fujairah) {
    for (const projectId of [atacama.id, sonora.id, fujairah.id]) {
      await prisma.favorite.upsert({
        where: { userId_projectId: { userId: investor.id, projectId } },
        update: {},
        create: { userId: investor.id, projectId },
      });
    }

    const existingOffer = await prisma.offer.findFirst({ where: { investorId: investor.id, projectId: atacama.id } });
    if (!existingOffer) {
      await prisma.offer.create({
        data: {
          projectId: atacama.id,
          investorId: investor.id,
          amount: 135_000_000,
          type: "equity_stake",
          equityPct: 55,
          message:
            "Northbridge Infrastructure Fund is pleased to submit this non-binding expression of interest for a 55% equity stake, subject to confirmatory due diligence. We have completed three water infrastructure transactions in LatAm since 2022 and can move to binding terms within 60 days of data room access.",
          status: "IN_DISCUSSION",
        },
      });
      await prisma.offer.create({
        data: {
          projectId: sonora.id,
          investorId: investor.id,
          amount: 178_000_000,
          type: "full_acquisition",
          message:
            "We propose a full acquisition at the indicated valuation midpoint, financed 60/40 debt-equity with committed financing letters available. Exclusivity of 45 days requested.",
          status: "PENDING",
        },
      });
    }

    await prisma.ndaAcceptance.upsert({
      where: { projectId_userId: { projectId: atacama.id, userId: investor.id } },
      update: {},
      create: {
        projectId: atacama.id,
        userId: investor.id,
        fullName: "Sofia Lindqvist",
        company: "Northbridge Infrastructure Fund",
      },
    });

    const thread = await prisma.thread.upsert({
      where: { projectId_investorId: { projectId: atacama.id, investorId: investor.id } },
      update: {},
      create: {
        projectId: atacama.id,
        investorId: investor.id,
        sellerId: atacama.ownerId,
        subject: "Atacama Blue Desalination Plant",
        messages: {
          create: [
            {
              senderId: investor.id,
              body: "Good afternoon — following our EOI, could you confirm whether the expansion permit allows phased construction, and share the O&M contract counterparty rating? Thank you.",
            },
            {
              senderId: atacama.ownerId,
              body: "Hello Sofia, thank you for the EOI. Yes, the expansion permit explicitly allows two 525 l/s phases. The O&M counterparty is rated BBB (stable). Both documents are now in the data room, folder 4.2.",
            },
          ],
        },
      },
    });
    await prisma.thread.update({ where: { id: thread.id }, data: { lastMessageAt: new Date() } });

    const existingAlert = await prisma.alert.findFirst({ where: { userId: investor.id } });
    if (!existingAlert) {
      await prisma.alert.create({
        data: {
          userId: investor.id,
          name: "LatAm water & energy over $100M",
          category: "energy",
          minInvestment: 100_000_000,
        },
      });
    }
  }

  // --- Expansion wave: 10 additional projects --------------------------------
  const moreProjects: SeedProject[] = [
    {
      slug: "parana-grain-terminal",
      title: "Paraná River Grain Terminal",
      summary:
        "Operating grain export terminal on the Paraná waterway — 3.2 Mt annual throughput, on-dock storage for 240,000 t, expansion permit granted.",
      description:
        "Strategically positioned river terminal serving Argentina's core soy and corn belt, with 3.2 Mt of annual throughput, two loading berths for Panamax vessels and rail plus truck reception. On-dock silos store 240,000 tonnes, and a granted expansion permit allows a third berth and 120,000 t of additional capacity.\n\nThroughput is contracted with three international trading houses under multi-year port-service agreements. The owners seek a partial sale of up to 45% to fund the expansion and working-capital lines for origination.",
      category: "ports",
      country: "Argentina",
      countryCode: "AR",
      city: "Rosario",
      region: "Santa Fe",
      lat: -32.95,
      lng: -60.66,
      stage: "expansion",
      dealType: "partial_sale",
      verified: true,
      featured: false,
      investmentMin: 60_000_000,
      investmentMax: 95_000_000,
      revenue: 46_000_000,
      ebitda: 17_500_000,
      capacity: "3.2 Mtpa · 240,000 t storage",
      production: "3.05 Mt handled (2025)",
      permits: "Third-berth expansion permit granted",
      workforce: 260,
      areaHectares: 38,
      highlights: [
        "Multi-year port-service agreements with 3 trading houses",
        "Expansion permit for third berth granted",
        "Rail and truck reception with 600 t/h intake",
      ],
      specs: [
        { label: "Berths", value: "2 (Panamax), 12.5 m draft" },
        { label: "Loading rate", value: "1,800 t/h combined" },
      ],
      images: [u("photo-1586528116311-ad8dd3c8310d")],
      documents: [{ name: "Terminal Overview", url: DOC, isConfidential: false }],
      owner: "seller2",
      views: 534,
    },
    {
      slug: "salar-norte-lithium-brine",
      title: "Salar Norte Lithium Brine Project",
      summary:
        "Advanced lithium brine project in the Argentine Puna — 2.1 Mt LCE resource, pilot DLE plant operating, seeking construction capital.",
      description:
        "Salar Norte hosts a measured and indicated resource of 2.1 Mt LCE at 512 mg/L average lithium concentration, with low impurity ratios suited to direct lithium extraction. A 500 tpa DLE pilot has operated for 18 months, producing battery-grade carbonate samples that have passed initial qualification with two cathode makers.\n\nThe feasibility study for a 20,000 tpa commercial plant completes in 2027. The sponsors seek USD 180–280M of staged construction capital, open to streaming, equity or a strategic JV with an offtaker.",
      category: "mining",
      country: "Argentina",
      countryCode: "AR",
      city: "Salta",
      region: "Salta Province",
      lat: -24.79,
      lng: -65.41,
      stage: "greenfield",
      dealType: "capital_raise",
      verified: true,
      featured: false,
      investmentMin: 180_000_000,
      investmentMax: 280_000_000,
      capacity: "20,000 tpa LCE (design)",
      production: "500 tpa DLE pilot operating",
      permits: "Environmental permit for pilot · EIA for commercial phase in progress",
      workforce: 85,
      areaHectares: 12500,
      highlights: [
        "2.1 Mt LCE M&I resource at 512 mg/L",
        "18 months of DLE pilot operation",
        "Battery-grade samples in qualification with 2 cathode makers",
      ],
      specs: [
        { label: "Resource", value: "2.1 Mt LCE (M&I)" },
        { label: "Li concentration", value: "512 mg/L average" },
        { label: "Mg/Li ratio", value: "3.1" },
      ],
      images: [u("photo-1509391366360-2e959784a276")],
      documents: [{ name: "Project Teaser", url: DOC, isConfidential: false }],
      owner: "seller1",
      views: 812,
    },
    {
      slug: "cascadia-hydro-portfolio",
      title: "Cascadia Run-of-River Hydro Portfolio",
      summary:
        "Three operating run-of-river hydro plants in British Columbia totalling 94 MW, fully contracted under long-term utility EPAs.",
      description:
        "The portfolio comprises three run-of-river facilities commissioned between 2014 and 2017, delivering a combined 385 GWh annually under electricity purchase agreements with the provincial utility extending to 2054 on average. All plants are remotely operated from a shared control center with availability above 96%.\n\nThe selling fund is at end of life. Clean share transaction; First Nations impact-benefit agreements are in place at all three sites.",
      category: "energy",
      country: "Canada",
      countryCode: "CA",
      city: "Vancouver",
      region: "British Columbia",
      lat: 49.28,
      lng: -123.12,
      stage: "operating",
      dealType: "full_sale",
      verified: true,
      featured: false,
      investmentMin: 220_000_000,
      investmentMax: 260_000_000,
      revenue: 29_000_000,
      ebitda: 23_500_000,
      capacity: "94 MW across 3 plants",
      production: "385 GWh/year average",
      permits: "Water licenses through 2054 · EPAs to 2050–2058",
      workforce: 18,
      areaHectares: 210,
      highlights: [
        "EPAs with provincial utility, 29-year average remaining term",
        "First Nations agreements at all sites",
        "96%+ availability, remote operations",
      ],
      specs: [
        { label: "Plants", value: "3 (22–41 MW each)" },
        { label: "COD range", value: "2014–2017" },
      ],
      images: [u("photo-1548337138-e87d889cc369")],
      documents: [{ name: "Portfolio Teaser", url: DOC, isConfidential: false }],
      owner: "seller1",
      views: 655,
    },
    {
      slug: "magdalena-agroindustrial-platform",
      title: "Magdalena Palm Oil & Biogas Platform",
      summary:
        "Integrated sustainable palm oil producer in Colombia — 9,800 planted hectares, RSPO-certified mill, biogas capture generating 4 MW.",
      description:
        "Vertically integrated palm platform in Colombia's Magdalena Medio: 9,800 planted hectares (own and associated growers), a 45 t/h RSPO-certified extraction mill, and a biogas capture system generating 4 MW that covers the operation's full power demand with surplus sold to the grid.\n\nThe controlling family seeks a strategic partner for a 30–50% stake to fund a kernel-crushing line and 1,500 additional hectares. Certified sustainable production commands consistent premiums with European buyers.",
      category: "agro",
      country: "Colombia",
      countryCode: "CO",
      city: "Barrancabermeja",
      region: "Santander",
      lat: 7.06,
      lng: -73.85,
      stage: "operating",
      dealType: "partial_sale",
      verified: false,
      featured: false,
      investmentMin: 40_000_000,
      investmentMax: 70_000_000,
      revenue: 88_000_000,
      ebitda: 21_000_000,
      capacity: "45 t/h mill · 4 MW biogas",
      production: "198,000 t FFB processed (2025)",
      permits: "RSPO certified · environmental licenses current",
      workforce: 1350,
      areaHectares: 9800,
      highlights: [
        "RSPO certification with European premium contracts",
        "Energy self-sufficient via biogas capture",
        "Expansion land under control",
      ],
      specs: [
        { label: "Mill capacity", value: "45 t FFB/hour" },
        { label: "Certification", value: "RSPO, ISCC" },
      ],
      images: [u("photo-1500382017468-9049fed747ef")],
      documents: [{ name: "Platform Overview", url: DOC, isConfidential: false }],
      owner: "seller2",
      views: 389,
    },
    {
      slug: "monterrey-industrial-park-nearshoring",
      title: "Monterrey Nearshoring Industrial Park",
      summary:
        "Class-A industrial park in Nuevo León — 92% leased, 310,000 m² GLA, land bank for 180,000 m² more in Mexico's hottest corridor.",
      description:
        "Class-A park in the Monterrey–Saltillo corridor with 310,000 m² of GLA across 14 buildings, 92% leased to multinational tenants in automotive, electronics and appliances under USD-denominated triple-net leases (WALT 7.2 years). The adjacent land bank supports 180,000 m² of build-to-suit expansion with utilities in place.\n\nThe sponsor seeks a programmatic equity partner for the expansion phase or an outright sale of the stabilized portfolio.",
      category: "realestate",
      country: "Mexico",
      countryCode: "MX",
      city: "Monterrey",
      region: "Nuevo León",
      lat: 25.69,
      lng: -100.32,
      stage: "expansion",
      dealType: "partial_sale",
      verified: true,
      featured: false,
      investmentMin: 150_000_000,
      investmentMax: 230_000_000,
      revenue: 24_000_000,
      ebitda: 19_800_000,
      capacity: "310,000 m² GLA + 180,000 m² expansion",
      production: "92% leased · WALT 7.2 years",
      permits: "Fully permitted · utilities secured for expansion",
      workforce: 45,
      areaHectares: 96,
      highlights: [
        "USD triple-net leases with multinational tenants",
        "92% occupancy, WALT 7.2 years",
        "Serviced land bank for 180,000 m² BTS",
      ],
      specs: [
        { label: "Buildings", value: "14 Class-A" },
        { label: "Clear height", value: "12 m typical" },
      ],
      images: [u("photo-1565043666747-69f6646db940")],
      documents: [{ name: "Park Overview", url: DOC, isConfidential: false }],
      owner: "seller1",
      views: 701,
    },
    {
      slug: "iberia-wind-repowering-portfolio",
      title: "Iberia Wind Repowering Portfolio — 180 MW",
      summary:
        "Operating Spanish wind portfolio with locked-in repowering rights: 180 MW today, 265 MW post-repowering on the same grid connections.",
      description:
        "Five wind farms across Aragón and Castilla y León commissioned 2004–2008, fully merchant since tariff expiry, with grid connection rights preserved for repowering to 265 MW using modern turbines. Repowering permits are at an advanced stage for three of the five sites.\n\nThe transaction offers operating cash flow today plus a fully-defined repowering pipeline — a hybrid yield-and-growth profile increasingly rare in Iberia.",
      category: "energy",
      country: "Spain",
      countryCode: "ES",
      city: "Zaragoza",
      region: "Aragón",
      lat: 41.65,
      lng: -0.89,
      stage: "operating",
      dealType: "full_sale",
      verified: true,
      featured: false,
      investmentMin: 190_000_000,
      investmentMax: 240_000_000,
      revenue: 31_000_000,
      ebitda: 21_000_000,
      capacity: "180 MW (265 MW post-repowering)",
      production: "430 GWh/year current",
      permits: "Repowering permits advanced at 3 of 5 sites",
      workforce: 26,
      areaHectares: 890,
      highlights: [
        "Grid rights preserved for 265 MW repowering",
        "Merchant upside with PPA optionality",
        "Advanced permits at 3 of 5 sites",
      ],
      specs: [
        { label: "Sites", value: "5 (Aragón, Castilla y León)" },
        { label: "Current turbines", value: "2004–2008 vintage" },
      ],
      images: [u("photo-1466611653911-95081537e5b7")],
      documents: [{ name: "Portfolio Teaser", url: DOC, isConfidential: false }],
      owner: "seller2",
      views: 577,
    },
    {
      slug: "red-sea-desalination-ppp",
      title: "Red Sea Coast Desalination PPP",
      summary:
        "Greenfield 450,000 m³/day SWRO desalination PPP with a 25-year government offtake, tendered and awarded — seeking equity co-investors.",
      description:
        "Awarded public-private partnership for a 450,000 m³/day sea-water reverse-osmosis plant serving urban and industrial demand on the Red Sea coast, under a 25-year water purchase agreement with a sovereign counterparty, availability-based with full indexation.\n\nFinancial close is targeted within 12 months; the consortium seeks equity co-investors for up to 40% of the SPV alongside an experienced regional developer-operator.",
      category: "water",
      country: "United Arab Emirates",
      countryCode: "AE",
      city: "Fujairah",
      region: "East Coast",
      lat: 25.29,
      lng: 56.36,
      stage: "construction",
      dealType: "capital_raise",
      verified: true,
      featured: false,
      investmentMin: 120_000_000,
      investmentMax: 200_000_000,
      capacity: "450,000 m³/day SWRO",
      production: "Financial close target: 12 months",
      permits: "PPP awarded · WPA executed",
      workforce: 40,
      areaHectares: 32,
      highlights: [
        "25-year availability-based WPA with sovereign counterparty",
        "Tender awarded — de-risked entry at financial close",
        "Co-investment alongside proven regional operator",
      ],
      specs: [
        { label: "Technology", value: "SWRO with ERD" },
        { label: "Offtake", value: "25-year WPA, indexed" },
      ],
      images: [u("photo-1559827260-dc66d52bef19")],
      documents: [{ name: "PPP Summary", url: DOC, isConfidential: false }],
      owner: "partner",
      views: 923,
    },
    {
      slug: "tangier-automotive-supplier-park",
      title: "Tangier Automotive Components Cluster",
      summary:
        "Manufacturing platform of three plants serving European OEMs from Morocco — wiring harnesses, injection molding and stamping, 3,400 employees.",
      description:
        "Integrated Tier-2 automotive platform in the Tangier free zone: wiring harnesses, technical injection molding and precision stamping across three plants, exporting 96% of output to European OEM programs with 48-hour logistics to Spain.\n\nThe founding shareholders seek a majority buyer to professionalize governance and fund a fourth plant dedicated to EV battery connection systems, for which two LOIs from existing customers are in hand.",
      category: "manufacturing",
      country: "Morocco",
      countryCode: "MA",
      city: "Tangier",
      region: "Tanger-Tétouan-Al Hoceïma",
      lat: 35.77,
      lng: -5.8,
      stage: "operating",
      dealType: "full_sale",
      verified: true,
      featured: false,
      investmentMin: 95_000_000,
      investmentMax: 140_000_000,
      revenue: 165_000_000,
      ebitda: 24_000_000,
      capacity: "3 plants · 41,000 m² covered",
      production: "96% export to EU OEM programs",
      permits: "Free-zone status · IATF 16949 all plants",
      workforce: 3400,
      areaHectares: 14,
      highlights: [
        "48-hour logistics to European OEM lines",
        "Two customer LOIs for EV connection-systems plant",
        "Free-zone tax framework",
      ],
      specs: [
        { label: "Quality", value: "IATF 16949, ISO 14001" },
        { label: "Customers", value: "5 OEM platforms via Tier-1s" },
      ],
      images: [u("photo-1504328345606-18bbc8c9d7d1")],
      documents: [{ name: "Platform Teaser", url: DOC, isConfidential: false }],
      owner: "seller2",
      views: 468,
    },
    {
      slug: "queensland-copper-gold-mine",
      title: "Queensland Copper-Gold Restart Project",
      summary:
        "Fully permitted brownfield copper-gold mine on care & maintenance — 480 kt of contained Cu equivalent remaining, restart study complete.",
      description:
        "Past-producing underground copper-gold mine in North Queensland placed on care and maintenance in 2020 at the pit-to-underground transition. The 2025 restart study defines a 9-year plan producing 28 kt CuEq annually with USD 95M of restart capital, using the existing 1.1 Mtpa plant, camp and grid connection.\n\nAll permits remain current. The owner seeks a sale or a funding partner for the restart, with management available to continue.",
      category: "mining",
      country: "Australia",
      countryCode: "AU",
      city: "Mount Isa",
      region: "Queensland",
      lat: -20.72,
      lng: 139.49,
      stage: "construction",
      dealType: "full_sale",
      verified: false,
      featured: false,
      investmentMin: 95_000_000,
      investmentMax: 150_000_000,
      capacity: "1.1 Mtpa plant (existing)",
      production: "28 kt CuEq/year (restart plan)",
      permits: "All mining and environmental permits current",
      workforce: 12,
      areaHectares: 2100,
      highlights: [
        "Existing plant, camp and grid connection",
        "Restart study complete: 9-year life",
        "Permits maintained through care & maintenance",
      ],
      specs: [
        { label: "Remaining resource", value: "480 kt contained CuEq" },
        { label: "Restart capital", value: "USD 95M" },
      ],
      images: [u("photo-1516216628859-9bccecab13ca")],
      documents: [{ name: "Restart Study Summary", url: DOC, isConfidential: false }],
      owner: "seller1",
      views: 344,
    },
    {
      slug: "sao-paulo-cold-storage-network",
      title: "São Paulo Cold Storage Network",
      summary:
        "Four-site temperature-controlled logistics network serving Brazil's largest consumption market — 96,000 pallet positions, blue-chip 3PL contracts.",
      description:
        "Cold-chain network across greater São Paulo and Campinas: 96,000 pallet positions in four facilities, all within 90 minutes of the city center, serving food producers, importers and quick-commerce platforms under take-or-pay and dedicated-space contracts.\n\nAn approved fifth site adds 30,000 positions. The sponsor seeks growth capital or full exit to a regional logistics platform.",
      category: "infrastructure",
      country: "Brazil",
      countryCode: "BR",
      city: "São Paulo",
      region: "São Paulo",
      lat: -23.55,
      lng: -46.63,
      stage: "expansion",
      dealType: "capital_raise",
      verified: true,
      featured: false,
      investmentMin: 70_000_000,
      investmentMax: 110_000_000,
      revenue: 52_000_000,
      ebitda: 16_500_000,
      capacity: "96,000 pallet positions · 4 sites",
      production: "93% average occupancy",
      permits: "Fifth site fully approved",
      workforce: 720,
      areaHectares: 27,
      highlights: [
        "Take-or-pay contracts with food majors",
        "Approved expansion site of 30,000 positions",
        "Quick-commerce demand tailwind",
      ],
      specs: [
        { label: "Temperature range", value: "−28°C to +15°C" },
        { label: "Sites", value: "4 operating + 1 approved" },
      ],
      images: [u("photo-1586528116311-ad8dd3c8310d")],
      documents: [{ name: "Network Overview", url: DOC, isConfidential: false }],
      owner: "seller1",
      views: 415,
    },
  ];

  for (const p of moreProjects) {
    const { images, documents, owner, highlights, specs, ...rest } = p;
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: { translations: esTranslations(PROJECT_ES[p.slug]) },
      create: {
        ...rest,
        highlights: JSON.stringify(highlights),
        specs: JSON.stringify(specs),
        translations: esTranslations(PROJECT_ES[p.slug]),
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 86_400_000),
        ownerId: owners[owner].id,
        images: {
          create: images.map((url, i) => ({ url, alt: p.title, order: i })),
        },
        documents: { create: documents },
      },
    });
    console.log(`  ✔ ${p.title}`);
  }

  // --- Buy-side mandates + matching ------------------------------------------
  const investor2 = await prisma.user.upsert({
    where: { email: "fund@vortamax.global" },
    update: {},
    create: {
      name: "Henrik Osterberg",
      email: "fund@vortamax.global",
      passwordHash,
      role: "INVESTOR",
      company: "Baltica Infrastructure Partners",
      country: "ES",
    },
  });
  const investor3 = await prisma.user.upsert({
    where: { email: "strategics@vortamax.global" },
    update: {},
    create: {
      name: "Mei-Ling Chen",
      email: "strategics@vortamax.global",
      passwordHash,
      role: "INVESTOR",
      company: "Pacific Rim Strategic Holdings",
      country: "AU",
    },
  });

  const mandates = [
    {
      slug: "latam-water-infrastructure-mandate",
      title: "LatAm Water & Desalination Platform Build-up",
      description:
        "Northbridge Infrastructure Fund is deploying its third fund into water infrastructure across Latin America. We target operating desalination plants, water transmission and industrial water-supply assets with contracted, USD-denominated revenues. Preference for majority stakes alongside proven local operators; single-asset tickets of USD 80–250M with capacity to fund expansions.",
      investorId: investor.id,
      categories: ["water"],
      countries: ["CL", "PE", "MX"],
      stages: ["operating", "expansion"],
      dealTypes: ["partial_sale", "full_sale"],
      ticketMin: 80_000_000,
      ticketMax: 250_000_000,
      isPublic: true,
    },
    {
      slug: "copper-battery-metals-mandate",
      title: "Copper & Battery Metals — Development Capital",
      description:
        "Pacific Rim Strategic Holdings seeks copper and lithium exposure across the Americas and Australia, from advanced exploration through construction. We provide staged development capital, streaming structures or outright acquisition, with technical teams able to move to binding terms within 90 days. Ticket range USD 100–500M.",
      investorId: investor3.id,
      categories: ["mining"],
      countries: ["CL", "PE", "AU", "US"],
      stages: ["greenfield", "construction", "operating"],
      dealTypes: ["capital_raise", "full_sale", "partial_sale"],
      ticketMin: 100_000_000,
      ticketMax: 500_000_000,
      isPublic: true,
    },
    {
      slug: "iberia-latam-renewables-yield-mandate",
      title: "Operating Renewables — Iberia & Mexico Yield Portfolio",
      description:
        "Baltica Infrastructure Partners is acquiring operating solar and wind assets in Spain and Mexico for a yield-focused permanent-capital vehicle. Contracted or partially contracted revenue profiles preferred; tickets of USD 100–300M per transaction, with appetite for portfolios up to USD 600M.",
      investorId: investor2.id,
      categories: ["energy"],
      countries: ["ES", "MX"],
      stages: ["operating"],
      dealTypes: ["full_sale", "partial_sale"],
      ticketMin: 100_000_000,
      ticketMax: 300_000_000,
      isPublic: true,
    },
    {
      slug: "green-hydrogen-jv-mandate",
      title: "Green Hydrogen & Ammonia — Strategic JV Partner",
      description:
        "Industrial group with committed offtake in Northern Europe seeks joint-venture positions in utility-scale green hydrogen and ammonia projects with world-class renewable resources. We contribute FEED funding, offtake and engineering capacity for projects targeting FID within 4 years. Investment capacity of USD 500M–1.5B per platform.",
      investorId: investor2.id,
      categories: ["energy"],
      countries: ["CL", "MA", "AU"],
      stages: ["greenfield", "construction"],
      dealTypes: ["joint_venture", "capital_raise"],
      ticketMin: 500_000_000,
      ticketMax: 1_500_000_000,
      isPublic: true,
    },
    {
      slug: "agro-export-platforms-mandate",
      title: "Export Agriculture Platforms — Growth Equity",
      description:
        "Pacific Rim Strategic Holdings allocates growth equity to vertically integrated agro-export platforms with secured water rights and retail programs in premium markets. Berries, avocado, nuts and permanent crops preferred; tickets USD 30–250M for minority or control positions.",
      investorId: investor3.id,
      categories: ["agro"],
      countries: ["PE", "CL", "MX", "AU"],
      stages: ["operating", "expansion"],
      dealTypes: ["capital_raise", "partial_sale", "full_sale"],
      ticketMin: 30_000_000,
      ticketMax: 250_000_000,
      isPublic: true,
    },
    {
      slug: "core-ports-logistics-confidential",
      title: "Core+ Ports & Terminals — Confidential Search",
      description:
        "On behalf of a sovereign-adjacent investor, Northbridge is conducting a confidential search for operating port terminals and cold-chain logistics assets in Southern Europe and the Gulf. Take-or-pay or contracted revenue required; tickets USD 50–250M. This mandate is not publicly listed.",
      investorId: investor.id,
      categories: ["ports"],
      countries: ["ES", "AE"],
      stages: ["operating"],
      dealTypes: ["partial_sale", "full_sale"],
      ticketMin: 50_000_000,
      ticketMax: 250_000_000,
      isPublic: false,
    },
  ];

  for (const m of mandates) {
    const { categories, countries, stages, dealTypes, ...rest } = m;
    await prisma.mandate.upsert({
      where: { slug: m.slug },
      update: { translations: esTranslations(MANDATE_ES[m.slug]) },
      create: {
        ...rest,
        categories: JSON.stringify(categories),
        countries: JSON.stringify(countries),
        stages: JSON.stringify(stages),
        dealTypes: JSON.stringify(dealTypes),
        translations: esTranslations(MANDATE_ES[m.slug]),
        status: "PUBLISHED",
      },
    });
    console.log(`  ✔ Mandate: ${m.title}`);
  }

  // --- Commodities marketplace ----------------------------------------------
  const trader = await prisma.user.upsert({
    where: { email: "trader@vortamax.global" },
    update: {},
    create: {
      name: "Rashid Al Maktoum",
      email: "trader@vortamax.global",
      passwordHash,
      role: "INVESTOR",
      company: "Gulf Metals Trading FZE",
      country: "AE",
      verifiedSeller: true,
    },
  });

  const commodityListings = [
    // ------------------------------------------------------------- SELL side
    {
      slug: "grade-a-copper-cathodes-antofagasta",
      side: "SELL",
      commodity: "copper_cathodes",
      title: "Grade A Copper Cathodes — 2,000 t/month, FOB Antofagasta",
      description:
        "LME-registered Grade A copper cathodes (99.9935% Cu) produced at an established electro-winning operation in northern Chile. Consistent monthly availability of 2,000 tonnes with capacity to scale to 3,000 tonnes under an annual frame contract. Full traceability, ISO 9001 production and certificates of analysis issued by an independent laboratory for every lot.",
      specs: [
        { label: "Purity", value: "99.9935% Cu (LME Grade A)" },
        { label: "Format", value: "Cathode sheets, ~125 kg, steel-strapped bundles" },
        { label: "Registration", value: "LME-registered brand" },
        { label: "Packing", value: "Bundles of ~2.2 t" },
      ],
      volume: "2,000 t/month",
      periodicity: "contract",
      originCode: "CL",
      incoterm: "FOB",
      deliveryLocation: "Port of Antofagasta, Chile",
      priceType: "indexed",
      priceDetails: "LME Cash Settlement minus 45 USD/t",
      ownerId: seller1.id,
      verified: true,
      views: 640,
      documents: [
        { name: "Certificate of Analysis (sample lot)", url: DOC, isConfidential: true },
        { name: "Product Specification Sheet", url: DOC, isConfidential: false },
      ],
    },
    {
      slug: "copper-concentrate-26-southern-peru",
      side: "SELL",
      commodity: "copper_concentrate",
      title: "Copper Concentrate 26% Cu — 10,000 t/quarter, CIF Main Asian Port",
      description:
        "Clean copper concentrate from a producing mine in southern Peru: 26% Cu with gold and silver credits, low arsenic (<0.15%). Quarterly parcels of 10,000 wmt under an annual offtake frame, shipped in bulk from Matarani. Standard TC/RC terms with quotational period negotiable.",
      specs: [
        { label: "Cu grade", value: "26% (typical)" },
        { label: "Au / Ag credits", value: "3.1 g/t Au · 68 g/t Ag" },
        { label: "Arsenic", value: "<0.15%" },
        { label: "Moisture", value: "8.5%" },
      ],
      volume: "10,000 wmt/quarter",
      periodicity: "contract",
      originCode: "PE",
      incoterm: "CIF",
      deliveryLocation: "Main Asian port (buyer's option)",
      priceType: "indexed",
      priceDetails: "LME basis, benchmark TC/RC, QP M+1",
      ownerId: partner.id,
      verified: true,
      views: 512,
      documents: [
        { name: "Typical Assay Certificate", url: DOC, isConfidential: true },
      ],
    },
    {
      slug: "battery-grade-lithium-carbonate-chile",
      side: "SELL",
      commodity: "lithium_carbonate",
      title: "Battery-Grade Lithium Carbonate — 300 t/month, FOB Chilean Port",
      description:
        "Battery-grade lithium carbonate (≥99.5% Li₂CO₃) from brine operations in the Atacama basin. Monthly availability of 300 tonnes in 500 kg big bags, containerized. Suitable for cathode manufacturing; magnetic impurities controlled below 300 ppb. Long-term supply contracts preferred; spot parcels considered.",
      specs: [
        { label: "Purity", value: "≥99.5% Li₂CO₃" },
        { label: "Magnetic impurities", value: "<300 ppb" },
        { label: "Packing", value: "500 kg big bags, 20 t per container" },
      ],
      volume: "300 t/month",
      periodicity: "contract",
      originCode: "CL",
      incoterm: "FOB",
      deliveryLocation: "Port of Angamos, Chile",
      priceType: "indexed",
      priceDetails: "Fastmarkets Li₂CO₃ CIF Asia index minus 3%",
      ownerId: seller1.id,
      verified: true,
      views: 738,
      documents: [
        { name: "Battery-Grade Specification", url: DOC, isConfidential: false },
        { name: "Full Impurity Panel (CoA)", url: DOC, isConfidential: true },
      ],
    },
    {
      slug: "iron-ore-fines-62-port-hedland",
      side: "SELL",
      commodity: "iron_ore",
      title: "Iron Ore Fines 62% Fe — 50,000 t Spot Parcels, FOB Port Hedland",
      description:
        "Standard 62% Fe iron ore fines available in spot parcels of 50,000 tonnes from Port Hedland. Low phosphorus and alumina; sized 0–10 mm. Immediate laycans available; larger contract volumes negotiable for H2.",
      specs: [
        { label: "Fe content", value: "62% (typical)" },
        { label: "Sizing", value: "0–10 mm fines" },
        { label: "Phosphorus", value: "0.07%" },
        { label: "Alumina", value: "2.1%" },
      ],
      volume: "50,000 t/parcel (spot)",
      periodicity: "spot",
      originCode: "AU",
      incoterm: "FOB",
      deliveryLocation: "Port Hedland, Australia",
      priceType: "indexed",
      priceDetails: "Platts IODEX 62% Fe minus 2.5 USD/t",
      ownerId: seller2.id,
      verified: true,
      views: 431,
      documents: [],
    },
    {
      slug: "molybdenum-oxide-chile",
      side: "SELL",
      commodity: "molybdenum_oxide",
      title: "Molybdenum Oxide (Tech Grade) — 200 t/month, CIF Rotterdam",
      description:
        "Technical-grade molybdenum oxide (57% Mo min) in drums, by-product of a Chilean copper operation. Monthly volume of 200 tonnes, shipped containerized to Rotterdam or main European port. Annual contract with quarterly price reviews preferred.",
      specs: [
        { label: "Mo content", value: "57% min" },
        { label: "Packing", value: "250 kg drums" },
      ],
      volume: "200 t/month",
      periodicity: "contract",
      originCode: "CL",
      incoterm: "CIF",
      deliveryLocation: "Rotterdam, Netherlands",
      priceType: "indexed",
      priceDetails: "Platts Mo oxide mean, quarterly review",
      ownerId: seller1.id,
      verified: false,
      views: 210,
      documents: [],
    },
    {
      slug: "zinc-concentrate-52-callao",
      side: "SELL",
      commodity: "zinc_concentrate",
      title: "Zinc Concentrate 52% Zn — 5,000 t/month, FOB Callao",
      description:
        "High-grade zinc concentrate (52% Zn, 380 g/t Ag credits) from a producing polymetallic mine in central Peru. Monthly liftings of 5,000 wmt from Callao under annual frames; standard smelter terms.",
      specs: [
        { label: "Zn grade", value: "52%" },
        { label: "Ag credits", value: "380 g/t" },
        { label: "Fe", value: "6.2%" },
      ],
      volume: "5,000 wmt/month",
      periodicity: "contract",
      originCode: "PE",
      incoterm: "FOB",
      deliveryLocation: "Port of Callao, Peru",
      priceType: "indexed",
      priceDetails: "LME Zn basis, benchmark TC",
      ownerId: seller2.id,
      verified: true,
      views: 356,
      documents: [{ name: "Typical Assay", url: DOC, isConfidential: true }],
    },
    {
      slug: "gold-dore-lima",
      side: "SELL",
      commodity: "gold_dore",
      title: "Gold Doré 92% Au — 50 kg/month, EXW Lima",
      description:
        "Gold doré bars (92% Au, 6% Ag typical) from a formalized medium-scale producer in Peru, with full chain-of-custody documentation and export permits. Monthly availability of 50 kg; refining and logistics support available for qualified buyers. Compliance dossier (LBMA-aligned responsible sourcing) shared under NDA.",
      specs: [
        { label: "Au content", value: "92% (typical)" },
        { label: "Ag content", value: "6% (typical)" },
        { label: "Bar size", value: "~12.5 kg" },
      ],
      volume: "50 kg/month",
      periodicity: "contract",
      originCode: "PE",
      incoterm: "EXW",
      deliveryLocation: "Lima, Peru (secure facility)",
      priceType: "indexed",
      priceDetails: "LBMA PM fix minus 1.2%, assay-adjusted",
      ownerId: seller2.id,
      verified: false,
      views: 489,
      documents: [
        { name: "Responsible Sourcing Dossier", url: DOC, isConfidential: true },
      ],
    },
    {
      slug: "premium-fishmeal-callao",
      side: "SELL",
      commodity: "fishmeal",
      title: "Premium Fishmeal 67% Protein — 3,000 t/quarter, FOB Callao",
      description:
        "Super-prime fishmeal (67% protein min, TVN <100) from certified Peruvian producers, IFFO RS chain of custody. Quarterly parcels of 3,000 tonnes in 50 kg bags or big bags. Annual supply programs available with fixed premium over the Peruvian export reference.",
      specs: [
        { label: "Protein", value: "67% min" },
        { label: "TVN", value: "<100 mg/100g" },
        { label: "Certification", value: "IFFO RS" },
      ],
      volume: "3,000 t/quarter",
      periodicity: "contract",
      originCode: "PE",
      incoterm: "FOB",
      deliveryLocation: "Port of Callao, Peru",
      priceType: "fixed",
      priceDetails: "USD 1,720/t FOB (current quarter)",
      ownerId: seller2.id,
      verified: true,
      views: 298,
      documents: [],
    },
    {
      slug: "bek-wood-pulp-brazil",
      side: "SELL",
      commodity: "wood_pulp",
      title: "Bleached Eucalyptus Kraft Pulp — 8,000 t/month, FOB Santos",
      description:
        "BEK market pulp from a certified Brazilian producer (FSC), 8,000 tonnes monthly in unitized bales. Suitable for tissue and printing grades. Annual contracts with quarterly volume flexibility of ±10%.",
      specs: [
        { label: "Grade", value: "BEKP (bleached eucalyptus kraft)" },
        { label: "Certification", value: "FSC" },
        { label: "Brightness", value: "≥89% ISO" },
      ],
      volume: "8,000 t/month",
      periodicity: "contract",
      originCode: "BR",
      incoterm: "FOB",
      deliveryLocation: "Port of Santos, Brazil",
      priceType: "indexed",
      priceDetails: "PIX BHKP index minus agreed discount",
      ownerId: seller1.id,
      verified: false,
      views: 187,
      documents: [],
    },
    // -------------------------------------------------------------- BUY side
    {
      slug: "buy-copper-cathodes-gulf",
      side: "BUY",
      commodity: "copper_cathodes",
      title: "Buying: Grade A Copper Cathodes — 1,500–3,000 t/month, Gulf Destination",
      description:
        "Gulf Metals Trading FZE seeks Grade A copper cathodes for long-term supply into Gulf and South Asian re-rolling customers. Monthly volumes of 1,500–3,000 tonnes under 12-month frames with LCs from first-class banks. LME-registered brands preferred; non-registered considered with full assay history.",
      specs: [
        { label: "Purity required", value: "99.99% Cu min" },
        { label: "Payment", value: "LC at sight, first-class bank" },
      ],
      volume: "1,500–3,000 t/month",
      periodicity: "contract",
      destinationCode: "AE",
      incoterm: "CIF",
      deliveryLocation: "Jebel Ali, UAE",
      priceType: "indexed",
      priceDetails: "LME basis plus negotiable premium",
      ownerId: trader.id,
      verified: true,
      views: 402,
      documents: [],
    },
    {
      slug: "buy-lithium-carbonate-us",
      side: "BUY",
      commodity: "lithium_carbonate",
      title: "Buying: Battery-Grade Lithium Carbonate — 200 t/month, US Cathode Plant",
      description:
        "US cathode-materials manufacturer seeks battery-grade lithium carbonate under multi-year contract, 200 t/month ramping to 500 t/month by 2028. Qualification samples required; IRA-compliant origins prioritized.",
      specs: [
        { label: "Purity required", value: "≥99.5% Li₂CO₃, battery grade" },
        { label: "Qualification", value: "2-lot sampling process" },
      ],
      volume: "200 t/month (ramping to 500 t)",
      periodicity: "contract",
      destinationCode: "US",
      incoterm: "FOB",
      deliveryLocation: "US Gulf port",
      priceType: "indexed",
      priceDetails: "Fastmarkets index basis, collar structure",
      ownerId: investor3.id,
      verified: true,
      views: 377,
      documents: [],
    },
    {
      slug: "buy-iron-ore-fines-gulf-steel",
      side: "BUY",
      commodity: "iron_ore",
      title: "Buying: Iron Ore Fines 62% — Spot Parcels 50,000 t, Gulf Steel Mill",
      description:
        "Integrated steel producer in the Gulf seeks spot parcels of 62% Fe fines, 50,000–80,000 t per shipment, 4–6 shipments per year. Prompt laycans; payment by confirmed LC.",
      specs: [{ label: "Fe required", value: "61.5% min" }],
      volume: "50,000–80,000 t/parcel",
      periodicity: "spot",
      destinationCode: "AE",
      incoterm: "FOB",
      deliveryLocation: "Loading port at seller's option",
      priceType: "indexed",
      priceDetails: "Platts IODEX basis",
      ownerId: trader.id,
      verified: true,
      views: 265,
      documents: [],
    },
    {
      slug: "buy-fishmeal-aquafeed-spain",
      side: "BUY",
      commodity: "fishmeal",
      title: "Buying: Super-Prime Fishmeal — 2,500 t/quarter, Spanish Aquafeed Group",
      description:
        "European aquafeed producer seeks super-prime fishmeal (66%+ protein) on annual programs, 2,500 tonnes quarterly, delivered FOB origin with IFFO RS certification mandatory.",
      specs: [
        { label: "Protein required", value: "66% min" },
        { label: "Certification", value: "IFFO RS mandatory" },
      ],
      volume: "2,500 t/quarter",
      periodicity: "contract",
      destinationCode: "ES",
      incoterm: "FOB",
      deliveryLocation: "Origin port",
      priceType: "fixed",
      priceDetails: "Fixed quarterly, negotiable",
      ownerId: investor2.id,
      verified: false,
      views: 143,
      documents: [],
    },
    {
      slug: "buy-copper-concentrate-smelter-spain",
      side: "BUY",
      commodity: "copper_concentrate",
      title: "Buying: Clean Copper Concentrates — 40,000 t/year, European Smelter",
      description:
        "European custom smelter seeks clean copper concentrates (24%+ Cu, low As) for annual frames totaling 40,000 tonnes, CIF Huelva. Benchmark TC/RC; QP flexible. Long-term relationships with producing mines preferred over trader material.",
      specs: [
        { label: "Cu required", value: "24% min" },
        { label: "As limit", value: "<0.2%" },
      ],
      volume: "40,000 t/year",
      periodicity: "contract",
      destinationCode: "ES",
      incoterm: "CIF",
      deliveryLocation: "Port of Huelva, Spain",
      priceType: "indexed",
      priceDetails: "LME basis, benchmark TC/RC",
      ownerId: investor2.id,
      verified: true,
      views: 231,
      documents: [],
    },
  ];

  for (const l of commodityListings) {
    const { specs, documents, ...rest } = l;
    await prisma.commodityListing.upsert({
      where: { slug: l.slug },
      update: { translations: esTranslations(COMMODITY_ES[l.slug]) },
      create: {
        ...rest,
        specs: JSON.stringify(specs),
        documents: JSON.stringify(documents),
        translations: esTranslations(COMMODITY_ES[l.slug]),
        status: "PUBLISHED",
      },
    });
    console.log(`  ✔ Commodity: ${l.title}`);
  }

  // Run the matching engine over mandates and commodity listings.
  const { runMatchingForMandate, runMatchingForCommodity } = await import(
    "../lib/matching"
  );
  const allMandates = await prisma.mandate.findMany({ where: { status: "PUBLISHED" } });
  let totalMatches = 0;
  for (const m of allMandates) {
    totalMatches += await runMatchingForMandate(m.id);
  }
  console.log(`  ✔ Matching engine: ${totalMatches} new project–mandate matches`);

  const buyListings = await prisma.commodityListing.findMany({
    where: { status: "PUBLISHED", side: "BUY" },
  });
  let commodityMatches = 0;
  for (const b of buyListings) {
    commodityMatches += await runMatchingForCommodity(b.id);
  }
  console.log(`  ✔ Matching engine: ${commodityMatches} new commodity matches`);

  console.log("Seed complete.");
  console.log(`Demo password for all accounts: ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
