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

// Investment range buckets used by the explorer filter (USD).
export const INVESTMENT_RANGES = [
  { key: "u10", min: 0, max: 10_000_000 },
  { key: "10-50", min: 10_000_000, max: 50_000_000 },
  { key: "50-100", min: 50_000_000, max: 100_000_000 },
  { key: "100-500", min: 100_000_000, max: 500_000_000 },
  { key: "500p", min: 500_000_000, max: Infinity },
] as const;
