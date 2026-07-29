import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { localizedAll } from "@/lib/l10n";
import { INSIGHTS } from "@/lib/insights";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CommodityCard } from "@/components/commodities/CommodityCard";
import { MandateCard } from "@/components/mandates/MandateCard";
import { IconSearch } from "@/components/icons";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.search.title };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { q?: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const q = (searchParams.q ?? "").trim();
  const l = lang === "es" ? "es" : "en";

  const [projectsRaw, commoditiesRaw, mandatesRaw] = q
    ? await Promise.all([
        prisma.project.findMany({
          where: {
            status: "PUBLISHED",
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { summary: { contains: q, mode: "insensitive" } },
              { country: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } },
              { translations: { contains: q, mode: "insensitive" } },
            ],
          },
          include: {
            images: { orderBy: { order: "asc" } },
            owner: { select: { role: true } },
          },
          take: 6,
        }),
        prisma.commodityListing.findMany({
          where: {
            status: "PUBLISHED",
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              {
                commodity: {
                  contains: q.toLowerCase().replace(/ /g, "_"),
                  mode: "insensitive",
                },
              },
              { translations: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 6,
        }),
        prisma.mandate.findMany({
          where: {
            status: "PUBLISHED",
            isPublic: true,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { translations: { contains: q, mode: "insensitive" } },
            ],
          },
          include: { investor: { select: { name: true, company: true } } },
          take: 6,
        }),
      ])
    : [[], [], []];

  const projects = localizedAll(projectsRaw, lang);
  const commodities = localizedAll(commoditiesRaw, lang);
  const mandates = localizedAll(mandatesRaw, lang);

  const insights = q
    ? INSIGHTS.filter(
        (a) =>
          a[l].title.toLowerCase().includes(q.toLowerCase()) ||
          a[l].excerpt.toLowerCase().includes(q.toLowerCase()) ||
          a.category.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 3)
    : [];

  const total = projects.length + commodities.length + mandates.length + insights.length;

  return (
    <div className="bg-navy-50/40 pb-20">
      <div className="border-b border-navy-100 bg-navy-950 py-12">
        <div className="container-site max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {dict.search.title}
          </h1>
          <form action={`/${lang}/search`} className="mt-5 flex overflow-hidden rounded-lg bg-white shadow-card-hover transition focus-within:ring-2 focus-within:ring-gold-400">
            <div className="flex flex-1 items-center gap-2 pl-4">
              <IconSearch className="h-5 w-5 shrink-0 text-navy-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder={dict.search.placeholder}
                className="w-full border-0 py-3.5 text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-0"
              />
            </div>
            <button
              type="submit"
              className="bg-gold-500 px-6 text-sm font-semibold text-navy-950 transition hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy-800"
            >
              {dict.common.search}
            </button>
          </form>
        </div>
      </div>

      <div className="container-site space-y-12 py-10">
        {q && total === 0 && (
          <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center text-navy-500">
            {dict.search.noResults}
          </div>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="mb-5 text-xl font-bold text-navy-950">
              {dict.search.projects}{" "}
              <span className="text-sm font-medium text-navy-400">({projects.length})</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} lang={lang} dict={dict} />
              ))}
            </div>
          </section>
        )}

        {commodities.length > 0 && (
          <section>
            <h2 className="mb-5 text-xl font-bold text-navy-950">
              {dict.search.commodities}{" "}
              <span className="text-sm font-medium text-navy-400">
                ({commodities.length})
              </span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {commodities.map((c) => (
                <CommodityCard key={c.id} listing={c} lang={lang} dict={dict} />
              ))}
            </div>
          </section>
        )}

        {mandates.length > 0 && (
          <section>
            <h2 className="mb-5 text-xl font-bold text-navy-950">
              {dict.search.mandates}{" "}
              <span className="text-sm font-medium text-navy-400">({mandates.length})</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {mandates.map((m) => (
                <MandateCard key={m.id} mandate={m} lang={lang} dict={dict} />
              ))}
            </div>
          </section>
        )}

        {insights.length > 0 && (
          <section>
            <h2 className="mb-5 text-xl font-bold text-navy-950">
              {dict.search.insights}{" "}
              <span className="text-sm font-medium text-navy-400">({insights.length})</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {insights.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${lang}/insights/${a.slug}`}
                  className="group rounded-xl border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <Badge className="bg-navy-50 text-navy-600 ring-1 ring-navy-200">
                    {a.category}
                  </Badge>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy-950 group-hover:text-navy-700">
                    {a[l].title}
                  </h3>
                  <p className="mt-2 text-xs text-navy-400">
                    {a.author} · {formatDate(a.date, lang)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
