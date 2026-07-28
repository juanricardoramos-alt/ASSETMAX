// Live matching engine — deterministic, explainable scoring.
//
// Investors (published mandates):  sector 35 · geography 25 · ticket 30 · stage 10
// Suppliers (qualified registry):  category 50 · geography 30 · track record 12 · certifications 8
//
// Every result carries its per-component breakdown so the UI can show exactly
// why a counterparty ranks where it does.

import { parseJsonArray } from "@/lib/utils";

export type LiveMatchInput = {
  title: string;
  category: string; // asset class (CATEGORIES key)
  countryCode: string;
  amount: number | null; // USD
  stage: string;
  supplierCategory: string; // SUPPLIER_CATEGORIES key
};

export type ScoreComponent = {
  key: "sector" | "geography" | "ticket" | "stage" | "category" | "trackRecord" | "certifications";
  points: number;
  max: number;
};

// Broad regions used for partial geographic credit.
const REGIONS: Record<string, string[]> = {
  latam: ["AR", "BR", "CL", "CO", "MX", "PE"],
  europe: ["ES"],
  mea: ["AE", "MA"],
  northamerica: ["US", "CA"],
  apac: ["AU", "CN"],
};

function regionOf(code: string): string | null {
  for (const [region, codes] of Object.entries(REGIONS)) {
    if (codes.includes(code)) return region;
  }
  return null;
}

export function sameRegion(a: string, b: string): boolean {
  const ra = regionOf(a);
  return ra !== null && ra === regionOf(b);
}

/* ------------------------------------------------------------- Investors */

export type MandateLike = {
  id: string;
  title: string;
  categories: string; // JSON arrays as stored
  countries: string;
  stages: string;
  ticketMin: number | null;
  ticketMax: number | null;
  isPublic: boolean;
  investor: { name: string; company: string | null };
};

export type InvestorMatch = {
  id: string;
  mandateTitle: string;
  investorLabel: string | null; // null when confidential
  ticketMin: number | null;
  ticketMax: number | null;
  categories: string[];
  countries: string[];
  score: number;
  components: ScoreComponent[];
};

export function scoreMandate(
  input: LiveMatchInput,
  mandate: MandateLike
): InvestorMatch {
  const categories = parseJsonArray(mandate.categories);
  const countries = parseJsonArray(mandate.countries);
  const stages = parseJsonArray(mandate.stages);

  // Sector (35): explicit match beats an unrestricted mandate.
  const sector =
    categories.length === 0 ? 20 : categories.includes(input.category) ? 35 : 0;

  // Geography (25): country match > region match > unrestricted.
  const geography =
    countries.length === 0
      ? 15
      : countries.includes(input.countryCode)
        ? 25
        : countries.some((c) => sameRegion(c, input.countryCode))
          ? 12
          : 0;

  // Ticket (30): inside the range scores full; within ±50% of a bound scores half.
  let ticket = 15; // undisclosed on either side
  const { amount } = input;
  const { ticketMin, ticketMax } = mandate;
  if (amount && (ticketMin || ticketMax)) {
    const aboveMin = ticketMin ? amount >= ticketMin : true;
    const belowMax = ticketMax ? amount <= ticketMax : true;
    if (aboveMin && belowMax) ticket = 30;
    else if (
      (ticketMin && amount >= ticketMin * 0.5 && amount < ticketMin) ||
      (ticketMax && amount > ticketMax && amount <= ticketMax * 1.5)
    )
      ticket = 15;
    else ticket = 0;
  }

  // Stage (10).
  const stage = stages.length === 0 ? 6 : stages.includes(input.stage) ? 10 : 0;

  const components: ScoreComponent[] = [
    { key: "sector", points: sector, max: 35 },
    { key: "geography", points: geography, max: 25 },
    { key: "ticket", points: ticket, max: 30 },
    { key: "stage", points: stage, max: 10 },
  ];

  return {
    id: mandate.id,
    mandateTitle: mandate.title,
    investorLabel: mandate.isPublic
      ? (mandate.investor.company ?? mandate.investor.name)
      : null,
    ticketMin: mandate.ticketMin,
    ticketMax: mandate.ticketMax,
    categories,
    countries,
    score: components.reduce((s, c) => s + c.points, 0),
    components,
  };
}

/* ------------------------------------------------------------- Suppliers */

export type SupplierLike = {
  id: string;
  slug: string;
  name: string;
  category: string;
  countryCode: string;
  city: string | null;
  yearsActive: number | null;
  certifications: string;
  capacity: string | null;
  verified: boolean;
  featured?: boolean;
};

export type SupplierMatch = {
  id: string;
  slug: string;
  name: string;
  category: string;
  countryCode: string;
  city: string | null;
  capacity: string | null;
  verified: boolean;
  certifications: string[];
  score: number;
  components: ScoreComponent[];
};

export function scoreSupplier(
  input: LiveMatchInput,
  supplier: SupplierLike
): SupplierMatch {
  // Category (50): the registry is matched on the service actually required.
  const category = supplier.category === input.supplierCategory ? 50 : 0;

  // Geography (30): in-country mobilization > regional > global reach.
  const geography =
    supplier.countryCode === input.countryCode
      ? 30
      : sameRegion(supplier.countryCode, input.countryCode)
        ? 20
        : 8;

  // Track record (12) by years of operation.
  const years = supplier.yearsActive ?? 0;
  const trackRecord = years >= 15 ? 12 : years >= 8 ? 8 : years > 0 ? 4 : 0;

  // Certifications (8) by count.
  const certifications = parseJsonArray(supplier.certifications);
  const certPoints =
    certifications.length >= 3 ? 8 : certifications.length >= 1 ? 5 : 0;

  const components: ScoreComponent[] = [
    { key: "category", points: category, max: 50 },
    { key: "geography", points: geography, max: 30 },
    { key: "trackRecord", points: trackRecord, max: 12 },
    { key: "certifications", points: certPoints, max: 8 },
  ];

  return {
    id: supplier.id,
    slug: supplier.slug,
    name: supplier.name,
    category: supplier.category,
    countryCode: supplier.countryCode,
    city: supplier.city,
    capacity: supplier.capacity,
    verified: supplier.verified,
    certifications,
    score: components.reduce((s, c) => s + c.points, 0),
    components,
  };
}
