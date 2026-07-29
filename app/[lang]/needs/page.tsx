import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { localizedAll } from "@/lib/l10n";
import { countryName } from "@/lib/constants";
import { NeedCard } from "@/components/needs/NeedCard";
import { NeedsFilters } from "@/components/needs/NeedsFilters";
import { ButtonLink } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.needs.title, description: dict.needs.subtitle };
}

type SearchParams = {
  q?: string;
  category?: string;
  country?: string;
  company?: string;
};

export default async function NeedsPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: SearchParams;
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);

  const where: Record<string, unknown> = { status: "OPEN" };
  if (searchParams.category) where.category = searchParams.category;
  if (searchParams.country) where.countryCode = searchParams.country;
  if (searchParams.company) where.company = { slug: searchParams.company };
  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
      { country: { contains: searchParams.q, mode: "insensitive" } },
      { city: { contains: searchParams.q, mode: "insensitive" } },
      { company: { name: { contains: searchParams.q, mode: "insensitive" } } },
    ];
  }

  const [needsRaw, openNeeds] = await Promise.all([
    prisma.need.findMany({
      where,
      include: {
        company: {
          select: { slug: true, name: true, isAnchor: true, verified: true },
        },
      },
      orderBy: [{ company: { isAnchor: "desc" } }, { createdAt: "desc" }],
    }),
    prisma.need.findMany({
      where: { status: "OPEN" },
      select: {
        countryCode: true,
        company: { select: { slug: true, name: true } },
      },
    }),
  ]);

  const needs = localizedAll(needsRaw, lang);

  const countries = Array.from(
    new Set(openNeeds.map((n) => n.countryCode))
  )
    .map((code) => ({ code, name: countryName(code, lang) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const companies = Array.from(
    new Map(openNeeds.map((n) => [n.company.slug, n.company])).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-navy-50/40">
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site flex flex-wrap items-end justify-between gap-6 py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {dict.needs.title}
            </h1>
            <p className="mt-2 text-navy-200">{dict.needs.subtitle}</p>
          </div>
          <ButtonLink
            href={`/${lang}/dashboard/needs/new`}
            variant="gold"
            size="lg"
            data-vorta-tour="publish"
          >
            {dict.needs.postCta}
            <IconArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>

      <div className="container-site grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        <aside
          data-vorta-tour="filters"
          className="h-fit min-w-0 rounded-xl border border-navy-100 bg-white p-5 shadow-card lg:sticky lg:top-24"
        >
          <Suspense>
            <NeedsFilters dict={dict} countries={countries} companies={companies} />
          </Suspense>
        </aside>

        <div>
          <p className="mb-5 text-sm font-medium text-navy-500">
            {needs.length}{" "}
            {needs.length === 1 ? dict.needs.result : dict.needs.results}
          </p>

          {needs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center text-navy-500">
              {dict.needs.empty}
            </div>
          ) : (
            <div
              data-vorta-tour="results"
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              {needs.map((n) => (
                <NeedCard key={n.id} need={n} lang={lang} dict={dict} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
