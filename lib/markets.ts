// Market intelligence data layer — server-side only.
//
// Design rules (deliberate):
//  · Free keyless sources fetched server-side with Next fetch caching
//    (revalidate windows below); an optional metals.dev key upgrades the
//    remaining base metals from static reference to daily live values.
//  · Every failure degrades gracefully: last good value from this instance,
//    then the static REFERENCE table — never an error, never an empty dash.
//  · Nothing here is official LME/LBMA data and the UI must never label it
//    as such; quotes are delayed public reference values.

const STOOQ_REVALIDATE = 900; // 15 min
const CRYPTO_REVALIDATE = 900;
const METALS_DEV_REVALIDATE = 86400; // free tier is ~100 req/month

const FETCH_TIMEOUT_MS = 6000;

export type MarketQuote = {
  id: string;
  label: string; // proper name / ticker — not localized
  sub?: { en: string; es: string }; // optional descriptor line
  unit: string; // "USD/t", "USD/oz", "USD", "pts"
  decimals: number;
  price: number | null;
  changePct: number | null; // day-over-day
  spark: number[]; // recent closes, oldest → newest
  sparkDays: 30 | 7 | 0;
  asOf: string | null; // ISO date
  source: "live" | "reference";
};

export type MarketGroupKey = "base" | "precious" | "indices" | "crypto";
export type MarketGroup = { key: MarketGroupKey; quotes: MarketQuote[] };

/* ------------------------------------------------------------------ catalog */

type BaseSpec = {
  id: string;
  label: string;
  sub?: { en: string; es: string };
  unit: string;
  decimals: number;
  group: MarketGroupKey;
  stooq?: string; // stooq history symbol
  stooqFactor?: number; // unit conversion on stooq closes
  metalsDev?: string; // metals.dev metal key (USD/mt)
  coingecko?: string; // coingecko coin id
  reference: number; // static fallback value
};

const CATALOG: BaseSpec[] = [
  // a) Base metals — LME-style reference
  { id: "copper", label: "Copper", sub: { en: "Grade A cathodes", es: "Cátodos Grado A" }, unit: "USD/t", decimals: 0, group: "base", stooq: "hg.f", stooqFactor: 2204.62, metalsDev: "copper", reference: 9480 },
  { id: "aluminum", label: "Aluminium", sub: { en: "Primary", es: "Primario" }, unit: "USD/t", decimals: 0, group: "base", metalsDev: "aluminum", reference: 2380 },
  { id: "zinc", label: "Zinc", sub: { en: "Special high grade", es: "Grado especial" }, unit: "USD/t", decimals: 0, group: "base", metalsDev: "zinc", reference: 2720 },
  { id: "nickel", label: "Nickel", sub: { en: "Primary", es: "Primario" }, unit: "USD/t", decimals: 0, group: "base", metalsDev: "nickel", reference: 17900 },
  { id: "lithium", label: "Li₂CO₃", sub: { en: "Battery grade", es: "Grado batería" }, unit: "USD/t", decimals: 0, group: "base", metalsDev: "lithium", reference: 12850 },
  { id: "iron", label: "Iron Ore", sub: { en: "62% Fe fines", es: "Finos 62% Fe" }, unit: "USD/t", decimals: 0, group: "base", metalsDev: "iron_ore", reference: 106 },
  // b) Precious — LBMA-style reference
  { id: "gold", label: "Gold", unit: "USD/oz", decimals: 0, group: "precious", stooq: "xauusd", reference: 2640 },
  { id: "silver", label: "Silver", unit: "USD/oz", decimals: 1, group: "precious", stooq: "xagusd", reference: 31.2 },
  { id: "platinum", label: "Platinum", unit: "USD/oz", decimals: 0, group: "precious", stooq: "xptusd", reference: 1020 },
  { id: "palladium", label: "Palladium", unit: "USD/oz", decimals: 0, group: "precious", stooq: "xpdusd", reference: 1080 },
  // c) Indices + sector equities
  { id: "spx", label: "S&P 500", unit: "pts", decimals: 0, group: "indices", stooq: "^spx", reference: 5920 },
  { id: "dji", label: "Dow Jones", unit: "pts", decimals: 0, group: "indices", stooq: "^dji", reference: 43600 },
  { id: "ndq", label: "Nasdaq", unit: "pts", decimals: 0, group: "indices", stooq: "^ndq", reference: 20850 },
  { id: "bhp", label: "BHP", sub: { en: "Diversified mining", es: "Minería diversificada" }, unit: "USD", decimals: 2, group: "indices", stooq: "bhp.us", reference: 58.4 },
  { id: "fcx", label: "Freeport", sub: { en: "Copper", es: "Cobre" }, unit: "USD", decimals: 2, group: "indices", stooq: "fcx.us", reference: 46.2 },
  { id: "alb", label: "Albemarle", sub: { en: "Lithium", es: "Litio" }, unit: "USD", decimals: 2, group: "indices", stooq: "alb.us", reference: 92.5 },
  // d) Crypto — same sober treatment
  { id: "btc", label: "Bitcoin", unit: "USD", decimals: 0, group: "crypto", coingecko: "bitcoin", reference: 68400 },
  { id: "eth", label: "Ethereum", unit: "USD", decimals: 0, group: "crypto", coingecko: "ethereum", reference: 3420 },
  { id: "sol", label: "Solana", unit: "USD", decimals: 1, group: "crypto", coingecko: "solana", reference: 158 },
  { id: "xrp", label: "XRP", unit: "USD", decimals: 3, group: "crypto", coingecko: "ripple", reference: 0.62 },
  { id: "bnb", label: "BNB", unit: "USD", decimals: 0, group: "crypto", coingecko: "binancecoin", reference: 585 },
];

// Static fallback vintage — shown as "static reference" when nothing fresher exists.
const REFERENCE_AS_OF = "2026-07-01";

/* -------------------------------------------------------------- last good */

// Per-instance memory of the last successful value per asset (survives
// between requests on a warm serverless instance; complements fetch cache).
const lastGood = new Map<string, MarketQuote>();

const referenceQuote = (spec: BaseSpec): MarketQuote => ({
  id: spec.id,
  label: spec.label,
  sub: spec.sub,
  unit: spec.unit,
  decimals: spec.decimals,
  price: spec.reference,
  changePct: null,
  spark: [],
  sparkDays: 0,
  asOf: REFERENCE_AS_OF,
  source: "reference",
});

function resolve(spec: BaseSpec, fresh: MarketQuote | null): MarketQuote {
  if (fresh) {
    lastGood.set(spec.id, fresh);
    return fresh;
  }
  return lastGood.get(spec.id) ?? referenceQuote(spec);
}

// After a host fails, skip it for a cool-down window so degraded environments
// pay the connection timeout at most once per minute per instance, not on
// every request.
const FAILURE_COOLDOWN_MS = 60_000;
const hostFailedAt = new Map<string, number>();

async function fetchWithTimeout(url: string, revalidate: number): Promise<Response | null> {
  const host = new URL(url).host;
  const failedAt = hostFailedAt.get(host);
  if (failedAt && Date.now() - failedAt < FAILURE_COOLDOWN_MS) return null;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate },
      headers: { "User-Agent": "VORTAMAX-Global/1.0 (markets reference page)" },
    });
    if (!res.ok) hostFailedAt.set(host, Date.now());
    else hostFailedAt.delete(host);
    return res;
  } catch {
    hostFailedAt.set(host, Date.now());
    return null;
  }
}

/* ------------------------------------------------------------------- stooq */

// Parses stooq daily-history CSV (Date,Open,High,Low,Close,Volume) into a
// quote: last close, day-over-day change and a 30-session sparkline.
export function parseStooqHistory(csv: string, spec: BaseSpec): MarketQuote | null {
  const lines = csv.trim().split("\n").slice(1);
  const closes: { date: string; close: number }[] = [];
  for (const line of lines) {
    const cols = line.split(",");
    const close = Number(cols[4]);
    if (cols[0] && Number.isFinite(close) && close > 0) {
      closes.push({ date: cols[0], close });
    }
  }
  if (closes.length < 2) return null;
  const factor = spec.stooqFactor ?? 1;
  const recent = closes.slice(-31);
  const last = recent[recent.length - 1];
  const prev = recent[recent.length - 2];
  return {
    id: spec.id,
    label: spec.label,
    sub: spec.sub,
    unit: spec.unit,
    decimals: spec.decimals,
    price: last.close * factor,
    changePct: (last.close / prev.close - 1) * 100,
    spark: recent.slice(-30).map((c) => c.close * factor),
    sparkDays: 30,
    asOf: last.date,
    source: "live",
  };
}

async function fetchStooq(spec: BaseSpec): Promise<MarketQuote | null> {
  try {
    const res = await fetchWithTimeout(
      `https://stooq.com/q/d/l/?s=${encodeURIComponent(spec.stooq!)}&i=d`,
      STOOQ_REVALIDATE
    );
    if (!res?.ok) return null;
    return parseStooqHistory(await res.text(), spec);
  } catch {
    return null;
  }
}

/* --------------------------------------------------------------- coingecko */

type GeckoRow = {
  id: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  sparkline_in_7d?: { price: number[] };
  last_updated: string;
};

export function parseGeckoRows(rows: GeckoRow[], specs: BaseSpec[]): Map<string, MarketQuote> {
  const out = new Map<string, MarketQuote>();
  for (const spec of specs) {
    const row = rows.find((r) => r.id === spec.coingecko);
    if (!row || !Number.isFinite(row.current_price)) continue;
    const rawSpark = row.sparkline_in_7d?.price ?? [];
    // hourly 7d series → thin to ~28 points
    const step = Math.max(1, Math.floor(rawSpark.length / 28));
    out.set(spec.id, {
      id: spec.id,
      label: spec.label,
      sub: spec.sub,
      unit: spec.unit,
      decimals: spec.decimals,
      price: row.current_price,
      changePct: row.price_change_percentage_24h ?? null,
      spark: rawSpark.filter((_, i) => i % step === 0),
      sparkDays: rawSpark.length > 0 ? 7 : 0,
      asOf: row.last_updated?.slice(0, 10) ?? null,
      source: "live",
    });
  }
  return out;
}

async function fetchCrypto(specs: BaseSpec[]): Promise<Map<string, MarketQuote>> {
  try {
    const ids = specs.map((s) => s.coingecko).join(",");
    const res = await fetchWithTimeout(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&sparkline=true&price_change_percentage=24h`,
      CRYPTO_REVALIDATE
    );
    if (!res?.ok) return new Map();
    return parseGeckoRows((await res.json()) as GeckoRow[], specs);
  } catch {
    return new Map();
  }
}

/* -------------------------------------------------------------- metals.dev */

// Optional upgrade for base metals without a keyless source. Free tier only —
// refreshed daily. https://metals.dev (create a free API key and set
// METALS_DEV_API_KEY in the environment).
export function parseMetalsDev(
  data: { metals?: Record<string, number> },
  specs: BaseSpec[]
): Map<string, MarketQuote> {
  const out = new Map<string, MarketQuote>();
  const metals = data.metals ?? {};
  for (const spec of specs) {
    const price = metals[spec.metalsDev!];
    if (!Number.isFinite(price)) continue;
    out.set(spec.id, {
      id: spec.id,
      label: spec.label,
      sub: spec.sub,
      unit: spec.unit,
      decimals: spec.decimals,
      price: price as number,
      changePct: null, // latest-only endpoint
      spark: [],
      sparkDays: 0,
      asOf: new Date().toISOString().slice(0, 10),
      source: "live",
    });
  }
  return out;
}

async function fetchMetalsDev(specs: BaseSpec[]): Promise<Map<string, MarketQuote>> {
  const key = process.env.METALS_DEV_API_KEY;
  if (!key) return new Map();
  try {
    const res = await fetchWithTimeout(
      `https://api.metals.dev/v1/latest?api_key=${key}&currency=USD&unit=mt`,
      METALS_DEV_REVALIDATE
    );
    if (!res?.ok) return new Map();
    return parseMetalsDev(await res.json(), specs);
  } catch {
    return new Map();
  }
}

/* ---------------------------------------------------------------- assembly */

export async function getMarkets(): Promise<MarketGroup[]> {
  const stooqSpecs = CATALOG.filter((s) => s.stooq);
  const cryptoSpecs = CATALOG.filter((s) => s.coingecko);
  const metalsDevSpecs = CATALOG.filter((s) => s.metalsDev && !s.stooq);

  const [stooqResults, cryptoMap, metalsMap] = await Promise.all([
    Promise.all(stooqSpecs.map((s) => fetchStooq(s).then((q) => [s.id, q] as const))),
    fetchCrypto(cryptoSpecs),
    fetchMetalsDev(metalsDevSpecs),
  ]);
  const stooqMap = new Map(stooqResults);

  const groups: MarketGroup[] = (["base", "precious", "indices", "crypto"] as const).map(
    (key) => ({
      key,
      quotes: CATALOG.filter((s) => s.group === key).map((spec) =>
        resolve(
          spec,
          stooqMap.get(spec.id) ?? cryptoMap.get(spec.id) ?? metalsMap.get(spec.id) ?? null
        )
      ),
    })
  );
  return groups;
}

/** Compact subset for the home ticker bar. */
export async function getTickerQuotes(): Promise<MarketQuote[]> {
  const groups = await getMarkets();
  const all = new Map(groups.flatMap((g) => g.quotes.map((q) => [q.id, q])));
  const ids = ["copper", "gold", "lithium", "silver", "iron", "spx", "btc"];
  return ids.map((id) => all.get(id)).filter((q): q is MarketQuote => !!q);
}

/** Localized numeric value ("9,480" / "9.480"); unit is rendered separately. */
export function formatQuoteValue(q: MarketQuote, lang: string): string {
  if (q.price == null) return "";
  return q.price.toLocaleString(lang === "es" ? "es-CL" : "en-US", {
    minimumFractionDigits: q.decimals,
    maximumFractionDigits: q.decimals,
  });
}

/** Full display string for compact contexts (ticker): "USD 9,480/t" · "5,920 pts". */
export function formatQuoteFull(q: MarketQuote, lang: string): string {
  const value = formatQuoteValue(q, lang);
  if (!value) return "—";
  if (q.unit === "pts") return `${value} pts`;
  const suffix = q.unit.includes("/") ? q.unit.slice(q.unit.indexOf("/")) : "";
  return `USD ${value}${suffix}`;
}
