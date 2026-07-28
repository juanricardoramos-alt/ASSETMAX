import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CompanyMonogram } from "@/components/company/CompanyMonogram";
import { AnchorBadge, VerifiedBadge } from "@/components/ui";
import { IconGlobe, IconMapPin, IconUsers } from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const company = await prisma.companyProfile.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  });
  if (!company) return {};
  return { title: company.name, description: company.description.slice(0, 160) };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);

  const company = await prisma.companyProfile.findUnique({
    where: { slug: params.slug },
    include: { user: { select: { id: true, role: true } } },
  });
  if (!company) notFound();

  const projects = await prisma.project.findMany({
    where: { ownerId: company.user.id, status: "PUBLISHED" },
    include: {
      images: { orderBy: { order: "asc" } },
      owner: { select: { role: true } },
    },
    orderBy: [{ verified: "desc" }, { views: "desc" }],
  });

  const facts: { label: string; value: string }[] = [
    {
      label: dict.companies.sector,
      value:
        dict.categories[company.sector as keyof typeof dict.categories] ??
        company.sector,
    },
    {
      label: dict.companies.headquarters,
      value: `${company.city ? `${company.city}, ` : ""}${countryName(company.countryCode, lang)}`,
    },
  ];
  if (company.founded) {
    facts.push({ label: dict.companies.founded, value: String(company.founded) });
  }
  if (company.employees) {
    facts.push({
      label: dict.companies.employees,
      value: new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-US").format(
        company.employees
      ),
    });
  }

  return (
    <div className="bg-navy-50/40">
      {/* Header */}
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-12">
          <div className="flex flex-wrap items-center gap-6">
            <CompanyMonogram name={company.name} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {company.name}
                </h1>
                {company.isAnchor && (
                  <AnchorBadge label={dict.companies.anchorBadge} />
                )}
                {company.verified && (
                  <VerifiedBadge label={dict.common.verified} />
                )}
              </div>
              {company.legalName && (
                <p className="mt-1 text-sm text-navy-300">{company.legalName}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-navy-200">
                <span className="inline-flex items-center gap-1.5">
                  <IconMapPin className="h-4 w-4 text-gold-500" />
                  {company.city ? `${company.city}, ` : ""}
                  {countryName(company.countryCode, lang)}
                </span>
                {company.employees && (
                  <span className="inline-flex items-center gap-1.5">
                    <IconUsers className="h-4 w-4 text-gold-500" />
                    {new Intl.NumberFormat(
                      lang === "es" ? "es-ES" : "en-US"
                    ).format(company.employees)}{" "}
                    {dict.companies.employees.toLowerCase()}
                  </span>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-gold-400 hover:text-gold-300"
                  >
                    <IconGlobe className="h-4 w-4" />
                    {dict.companies.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site grid gap-8 py-10 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-10">
          {/* About */}
          <section>
            <h2 className="mb-4 text-xl font-extrabold tracking-tight text-navy-950">
              {dict.companies.aboutTitle}
            </h2>
            <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-navy-700">
                {company.description}
              </p>
            </div>
          </section>

          {/* Portfolio */}
          <section>
            <h2 className="mb-4 text-xl font-extrabold tracking-tight text-navy-950">
              {dict.companies.portfolioTitle}
            </h2>
            {projects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-navy-200 bg-white p-12 text-center text-navy-500">
                {dict.companies.portfolioEmpty}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} lang={lang} dict={dict} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Fact sheet */}
        <aside className="h-fit rounded-xl border border-navy-100 bg-white p-6 shadow-card lg:sticky lg:top-24">
          <dl className="space-y-4">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs font-bold uppercase tracking-wider text-navy-400">
                  {f.label}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-navy-900">
                  {f.value}
                </dd>
              </div>
            ))}
            {company.website && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-navy-400">
                  {dict.companies.website}
                </dt>
                <dd className="mt-0.5 truncate text-sm font-semibold">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-600 hover:text-gold-500"
                  >
                    {company.website.replace(/^https?:\/\//, "")}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </div>
    </div>
  );
}
