import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { localizedAll } from "@/lib/l10n";
import { CommodityCard } from "@/components/commodities/CommodityCard";
import { CommodityFilters } from "@/components/commodities/CommodityFilters";
import { MarketRefsBar } from "@/components/commodities/MarketRefsBar";
import { ButtonLink } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.commodities.title, description: dict.commodities.subtitle };
}

type SearchParams = {
  side?: string;
  commodity?: string;
  incoterm?: string;
  origin?: string;
  periodicity?: string;
};

export default async function CommoditiesPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: SearchParams;
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const c = dict.commodities;

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (searchParams.side) where.side = searchParams.side;
  if (searchParams.commodity) where.commodity = searchParams.commodity;
  if (searchParams.incoterm) where.incoterm = searchParams.incoterm;
  if (searchParams.periodicity) where.periodicity = searchParams.periodicity;
  if (searchParams.origin) {
    where.OR = [
      { originCode: searchParams.origin },
      { destinationCode: searchParams.origin },
    ];
  }

  const listings = localizedAll(
    await prisma.commodityListing.findMany({
      where,
      orderBy: [{ verified: "desc" }, { createdAt: "desc" }],
    }),
    lang
  );

  return (
    <div className="bg-navy-50/40">
      <MarketRefsBar title={c.marketRefs} note={c.marketRefsNote} />
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site flex flex-wrap items-end justify-between gap-6 py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {c.title}
            </h1>
            <p className="mt-2 text-navy-200">{c.subtitle}</p>
          </div>
          <ButtonLink href={`/${lang}/dashboard/commodities/new`} variant="gold" size="lg">
            {c.postCta}
          </ButtonLink>
        </div>
      </div>

      <div className="container-site grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit min-w-0 rounded-xl border border-navy-100 bg-white p-5 shadow-card lg:sticky lg:top-24">
          <Suspense>
            <CommodityFilters dict={dict} lang={lang} />
          </Suspense>
        </aside>

        <div>
          <p className="mb-5 text-sm font-medium text-navy-500">
            {listings.length}{" "}
            {listings.length === 1 ? dict.explorer.result : dict.explorer.results}
          </p>

          {listings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center text-navy-500">
              {c.emptyExplorer}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((l) => (
                <CommodityCard key={l.id} listing={l} lang={lang} dict={dict} />
              ))}
            </div>
          )}

          <p className="mt-8 rounded-xl border border-navy-200 bg-white px-5 py-4 text-xs leading-relaxed text-navy-500">
            {c.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
