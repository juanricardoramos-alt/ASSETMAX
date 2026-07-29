import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getTickerQuotes, formatQuoteFull } from "@/lib/markets";
import { IconArrowRight } from "@/components/icons";

// Compact market ticker fed by the same server-cached data as /markets.
// Every value is delayed reference data — the bar links to the full page.
export async function MarketRefsBar({
  title,
  note,
  lang,
}: {
  title: string;
  note: string;
  lang: Locale;
}) {
  const quotes = await getTickerQuotes();

  return (
    <div className="border-b border-white/10 bg-navy-900">
      <div className="container-site flex items-center gap-6 overflow-x-auto py-2.5">
        <Link
          href={`/${lang}/markets`}
          prefetch={false}
          className="flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400 transition hover:text-gold-400"
        >
          {title}
          <IconArrowRight className="h-3 w-3" />
        </Link>
        {quotes.map((q) => (
          <Link
            key={q.id}
            href={`/${lang}/markets`}
            prefetch={false}
            className="tabular flex shrink-0 items-baseline gap-2"
          >
            <span className="text-xs font-semibold text-navy-300">{q.label}</span>
            <span className="text-xs font-bold text-white">
              {formatQuoteFull(q, lang)}
            </span>
            {q.changePct != null && (
              <span
                className={`text-[10px] font-bold ${q.changePct >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {q.changePct >= 0 ? "▲" : "▼"} {Math.abs(q.changePct).toFixed(1)}%
              </span>
            )}
          </Link>
        ))}
        <span className="shrink-0 text-[10px] italic text-navy-500">{note}</span>
      </div>
    </div>
  );
}
