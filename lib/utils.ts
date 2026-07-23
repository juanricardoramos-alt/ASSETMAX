export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Compact USD formatting in house style: USD 85M, USD 1.2B, USD 450K. */
export function formatUsdCompact(value: number): string {
  if (value >= 1_000_000_000) {
    const v = value / 1_000_000_000;
    return `USD ${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    const v = value / 1_000_000;
    return `USD ${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (value >= 1_000) return `USD ${Math.round(value / 1_000)}K`;
  return `USD ${value}`;
}

/** Short numeric part only (for ranges): 85M, 1.2B. */
function compactNumber(value: number): string {
  if (value >= 1_000_000_000) {
    const v = value / 1_000_000_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    const v = value / 1_000_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return `${value}`;
}

export function formatInvestmentRange(
  min?: number | null,
  max?: number | null
): string {
  if (min && max) return `USD ${compactNumber(min)} – ${compactNumber(max)}`;
  if (min) return `USD ${compactNumber(min)}+`;
  if (max) return `Up to USD ${compactNumber(max)}`;
  return "Undisclosed";
}

export function formatUsdFull(value: number): string {
  return `USD ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;
}

export function formatDate(date: Date | string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseSpecs(
  value: string | null | undefined
): { label: string; value: string }[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
