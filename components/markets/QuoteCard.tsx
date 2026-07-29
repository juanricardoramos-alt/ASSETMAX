import type { Dictionary, Locale } from "@/lib/i18n";
import { formatQuoteValue, type MarketQuote } from "@/lib/markets";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

/** Minimal 30-day trend line — server-rendered SVG, no chart library. */
function Sparkline({ points, up }: { points: number[]; up: boolean }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const W = 120;
  const H = 34;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * W;
    const y = H - 3 - ((p - min) / range) * (H - 6);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const [lastX, lastY] = coords[coords.length - 1].split(",");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-full" aria-hidden="true">
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={up ? "#059669" : "#DC2626"}
        strokeOpacity="0.75"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r="2.2" fill={up ? "#059669" : "#DC2626"} />
    </svg>
  );
}

export function QuoteCard({
  quote,
  lang,
  dict,
}: {
  quote: MarketQuote;
  lang: Locale;
  dict: Dictionary;
}) {
  const m = dict.markets;
  const up = (quote.changePct ?? 0) >= 0;
  const unitSuffix =
    quote.unit === "pts" ? " pts" : quote.unit.includes("/") ? quote.unit.slice(quote.unit.indexOf("/")) : "";

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-bold text-navy-950">{quote.label}</p>
          {quote.sub && (
            <p className="truncate text-xs text-navy-500">{quote.sub[lang]}</p>
          )}
        </div>
        {quote.changePct != null && (
          <span
            className={cn(
              "tabular shrink-0 rounded-full px-2 py-0.5 text-xs font-bold",
              up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            )}
          >
            {up ? "▲" : "▼"} {Math.abs(quote.changePct).toFixed(1)}%
          </span>
        )}
      </div>

      <p className="tabular mt-3 text-2xl font-extrabold text-navy-950">
        {quote.unit.startsWith("USD") && (
          <span className="mr-1 text-sm font-bold text-navy-400">USD</span>
        )}
        {formatQuoteValue(quote, lang)}
        <span className="ml-0.5 text-sm font-semibold text-navy-400">{unitSuffix}</span>
      </p>

      <div className="mt-3 flex-1">
        {quote.spark.length > 1 ? (
          <>
            <Sparkline points={quote.spark} up={up} />
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-navy-400">
              {quote.sparkDays === 7 ? "7D" : "30D"} · {m.delayedBadge}
            </p>
          </>
        ) : (
          <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-navy-400">
            {quote.source === "reference" ? m.referenceBadge : m.delayedBadge}
            {quote.asOf ? ` · ${quote.asOf}` : ""}
          </p>
        )}
      </div>
    </Card>
  );
}
