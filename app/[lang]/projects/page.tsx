import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName, INVESTMENT_RANGES } from "@/lib/constants";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { FiltersPanel } from "@/components/projects/FiltersPanel";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.explorer.title, description: dict.explorer.subtitle };
}

type SearchParams = {
  q?: string;
  category?: string;
  country?: string;
  stage?: string;
  deal?: string;
  range?: string;
  verified?: string;
};

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: SearchParams;
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (searchParams.category) where.category = searchParams.category;
  if (searchParams.country) where.countryCode = searchParams.country;
  if (searchParams.stage) where.stage = searchParams.stage;
  if (searchParams.deal) where.dealType = searchParams.deal;
  if (searchParams.verified === "1") where.verified = true;
  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { summary: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
      { country: { contains: searchParams.q, mode: "insensitive" } },
      { city: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }
  const range = INVESTMENT_RANGES.find((r) => r.key === searchParams.range);
  if (range) {
    // A project matches when its investment range overlaps the bucket.
    const overlaps: Record<string, unknown>[] = [
      { investmentMin: { lte: range.max === Infinity ? 1e15 : range.max } },
    ];
    if (range.min > 0) {
      overlaps.push({
        OR: [
          { investmentMax: { gte: range.min } },
          { investmentMax: null, investmentMin: { gte: range.min } },
        ],
      });
    }
    where.AND = overlaps;
  }

  const [projects, availableCountries] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        images: { orderBy: { order: "asc" } },
        owner: { select: { role: true } },
      },
      orderBy: [{ verified: "desc" }, { views: "desc" }],
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: { countryCode: true },
      distinct: ["countryCode"],
    }),
  ]);

  const countries = availableCountries
    .map((c) => ({ code: c.countryCode, name: countryName(c.countryCode, lang) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-navy-50/40">
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {dict.explorer.title}
          </h1>
          <p className="mt-2 max-w-2xl text-navy-200">{dict.explorer.subtitle}</p>
        </div>
      </div>

      <div className="container-site grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit min-w-0 rounded-xl border border-navy-100 bg-white p-5 shadow-card lg:sticky lg:top-24">
          <Suspense>
            <FiltersPanel dict={dict} countries={countries} />
          </Suspense>
        </aside>

        <div>
          <p className="mb-5 text-sm font-medium text-navy-500">
            {projects.length}{" "}
            {projects.length === 1 ? dict.explorer.result : dict.explorer.results}
          </p>

          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center">
              <p className="text-lg font-bold text-navy-800">
                {dict.explorer.noResults}
              </p>
              <p className="mt-1 text-sm text-navy-500">{dict.explorer.noResultsHint}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} lang={lang} dict={dict} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
