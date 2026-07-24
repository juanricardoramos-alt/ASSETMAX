// Typed domain constants. These mirror the String columns in prisma/schema.prisma
// so the same schema runs on SQLite (dev) and PostgreSQL (prod).

export const CATEGORIES = [
  "mining",
  "energy",
  "water",
  "agro",
  "manufacturing",
  "infrastructure",
  "ports",
  "realestate",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const STAGES = [
  "greenfield",
  "construction",
  "operating",
  "expansion",
] as const;
export type Stage = (typeof STAGES)[number];

export const DEAL_TYPES = [
  "full_sale",
  "partial_sale",
  "capital_raise",
  "joint_venture",
] as const;
export type DealType = (typeof DEAL_TYPES)[number];

export const OFFER_TYPES = [
  "full_acquisition",
  "equity_stake",
  "debt",
  "joint_venture",
] as const;
export type OfferType = (typeof OFFER_TYPES)[number];

export const PROJECT_STATUSES = [
  "DRAFT",
  "IN_REVIEW",
  "PUBLISHED",
  "REJECTED",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const OFFER_STATUSES = [
  "PENDING",
  "IN_DISCUSSION",
  "ACCEPTED",
  "DECLINED",
  "WITHDRAWN",
] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];

export const ROLES = ["SELLER", "INVESTOR", "PARTNER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

// Countries currently represented on the platform (ISO 3166-1 alpha-2).
export const COUNTRIES: { code: string; en: string; es: string }[] = [
  { code: "AE", en: "United Arab Emirates", es: "Emiratos Árabes Unidos" },
  { code: "AR", en: "Argentina", es: "Argentina" },
  { code: "AU", en: "Australia", es: "Australia" },
  { code: "BR", en: "Brazil", es: "Brasil" },
  { code: "CA", en: "Canada", es: "Canadá" },
  { code: "CL", en: "Chile", es: "Chile" },
  { code: "CO", en: "Colombia", es: "Colombia" },
  { code: "ES", en: "Spain", es: "España" },
  { code: "MA", en: "Morocco", es: "Marruecos" },
  { code: "MX", en: "Mexico", es: "México" },
  { code: "PE", en: "Peru", es: "Perú" },
  { code: "US", en: "United States", es: "Estados Unidos" },
];

export function countryName(code: string, lang: "en" | "es"): string {
  const c = COUNTRIES.find((c) => c.code === code);
  return c ? c[lang] : code;
}

// ---------------------------------------------------------------------------
// Commodities marketplace
// ---------------------------------------------------------------------------

export const COMMODITIES = [
  "copper_cathodes",
  "copper_concentrate",
  "lithium_carbonate",
  "spodumene",
  "iron_ore",
  "gold_dore",
  "silver",
  "molybdenum_oxide",
  "zinc_concentrate",
  "potash",
  "urea",
  "wheat",
  "corn",
  "soybeans",
  "fishmeal",
  "wood_pulp",
] as const;
export type CommodityKey = (typeof COMMODITIES)[number];

export const INCOTERMS = ["EXW", "FCA", "FOB", "CFR", "CIF", "DAP", "DDP"] as const;
export type Incoterm = (typeof INCOTERMS)[number];

export const PERIODICITIES = ["spot", "contract"] as const;
export const PRICE_TYPES = ["fixed", "indexed"] as const;
export const LISTING_SIDES = ["SELL", "BUY"] as const;
export type ListingSide = (typeof LISTING_SIDES)[number];

export const CONTRACT_KINDS = ["NDA", "LOI", "MOU", "SPA", "COMMODITY_SPA"] as const;
export type ContractKind = (typeof CONTRACT_KINDS)[number];

// Standalone template library (Contract Templates section). Superset of the
// deal-contract kinds above plus intermediation, JV and recurring supply.
export const TEMPLATE_KINDS = [
  "INTERMEDIATION",
  "INTERMEDIATION_EXCLUSIVE",
  "NDA",
  "LOI",
  "MOU",
  "SPA",
  "JV",
  "COMMODITY_SPA",
  "COMMODITY_SUPPLY",
] as const;
export type TemplateKind = (typeof TEMPLATE_KINDS)[number];

export const MATCH_STATUSES = ["NEW", "CONTACTED", "DISMISSED"] as const;

// Static market reference prices for the indicators widget (seed data,
// presented in the UI as "market reference", not live quotes).
export const MARKET_REFERENCES = [
  { key: "copper", label: "Copper (LME)", value: "USD 4.31/lb", trend: 1.2 },
  { key: "gold", label: "Gold", value: "USD 2,640/oz", trend: 0.4 },
  { key: "lithium", label: "Li₂CO₃ (battery grade)", value: "USD 12,850/t", trend: -0.8 },
  { key: "silver", label: "Silver", value: "USD 31.2/oz", trend: 0.6 },
  { key: "iron", label: "Iron Ore 62% Fe", value: "USD 104/t", trend: -0.3 },
  { key: "moly", label: "Molybdenum Oxide", value: "USD 21.4/lb", trend: 0.9 },
] as const;

// Investment range buckets used by the explorer filter (USD).
export const INVESTMENT_RANGES = [
  { key: "u10", min: 0, max: 10_000_000 },
  { key: "10-50", min: 10_000_000, max: 50_000_000 },
  { key: "50-100", min: 50_000_000, max: 100_000_000 },
  { key: "100-500", min: 100_000_000, max: 500_000_000 },
  { key: "500p", min: 500_000_000, max: Infinity },
] as const;
