import type { Metadata } from "next";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { getMarkets, type MarketGroup } from "@/lib/markets";
import { QuoteCard } from "@/components/markets/QuoteCard";
import { VortaMascot } from "@/components/vorta/VortaMascot";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.markets.title, description: dict.markets.subtitle };
}

const GROUP_META = {
  base: { title: "baseMetalsTitle", note: "baseMetalsNote" },
  precious: { title: "preciousTitle", note: "preciousNote" },
  indices: { title: "indicesTitle", note: "indicesNote" },
  crypto: { title: "cryptoTitle", note: "cryptoNote" },
} as const;

export default async function MarketsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const m = dict.markets;
  const groups: MarketGroup[] = await getMarkets();

  return (
    <div className="bg-navy-50/40 pb-20">
      {/* Header band */}
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            {m.kicker}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {m.title}
          </h1>
          <p className="mt-3 max-w-2xl text-navy-200">{m.subtitle}</p>
        </div>
      </div>

      <div className="container-site space-y-14 py-10">
        {groups.map((group) => (
          <section key={group.key}>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-navy-950">
                {m[GROUP_META[group.key].title]}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-navy-500">
                {m[GROUP_META[group.key].note]}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.quotes.map((q) => (
                <QuoteCard key={q.id} quote={q} lang={lang} dict={dict} />
              ))}
            </div>
          </section>
        ))}

        {/* RWA — editorial perspective */}
        <section className="overflow-hidden rounded-2xl bg-navy-950">
          <div className="relative px-6 py-12 sm:px-12">
            <div className="absolute inset-0 bg-grid-dots opacity-40" />
            <div className="relative max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
                {m.rwa.kicker}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {m.rwa.title}
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-navy-200">
                {m.rwa.paragraphs.map((p, i) => (
                  <p key={i} className={i === 3 ? "font-medium text-white" : undefined}>
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex items-start gap-3 rounded-xl border border-navy-700 bg-navy-900/60 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-950 ring-1 ring-navy-700">
                  <VortaMascot mood="idle" className="h-6 w-6" />
                </div>
                <p className="text-xs leading-relaxed text-navy-300">{m.rwa.note}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="rounded-xl border border-navy-100 bg-white px-5 py-4 text-xs leading-relaxed text-navy-500">
          <p>{m.disclaimer}</p>
          <p className="mt-1.5 text-navy-400">{m.sourcesNote}</p>
        </div>
      </div>
    </div>
  );
}
