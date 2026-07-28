import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { parseJsonArray } from "@/lib/utils";
import { CompanyMonogram } from "@/components/company/CompanyMonogram";
import { Badge, ButtonLink, VerifiedBadge } from "@/components/ui";
import { IconCheck, IconGlobe, IconMapPin, IconUsers } from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const supplier = await prisma.supplierProfile.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true, status: true },
  });
  if (!supplier || supplier.status !== "PUBLISHED") return {};
  return {
    title: supplier.name,
    description: supplier.description.slice(0, 160),
  };
}

export default async function SupplierProfilePage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);

  const supplier = await prisma.supplierProfile.findUnique({
    where: { slug: params.slug },
  });
  if (!supplier || supplier.status !== "PUBLISHED") notFound();

  const certifications = parseJsonArray(supplier.certifications);
  const portfolio = parseJsonArray(supplier.portfolio);

  const facts: { label: string; value: string }[] = [
    {
      label: dict.common.category,
      value:
        dict.supplierCategories[
          supplier.category as keyof typeof dict.supplierCategories
        ] ?? supplier.category,
    },
    {
      label: dict.suppliers.country,
      value: `${supplier.city ? `${supplier.city}, ` : ""}${countryName(supplier.countryCode, lang)}`,
    },
  ];
  if (supplier.yearsActive) {
    facts.push({
      label: dict.suppliers.yearsActive,
      value: String(supplier.yearsActive),
    });
  }
  if (supplier.employees) {
    facts.push({
      label: dict.suppliers.employees,
      value: new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-US").format(
        supplier.employees
      ),
    });
  }
  if (supplier.capacity) {
    facts.push({ label: dict.suppliers.capacity, value: supplier.capacity });
  }

  return (
    <div className="bg-navy-50/40">
      {/* Header */}
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-12">
          <div className="flex flex-wrap items-center gap-6">
            <CompanyMonogram name={supplier.name} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {supplier.name}
                </h1>
                {supplier.verified && (
                  <VerifiedBadge label={dict.suppliers.qualifiedBadge} />
                )}
              </div>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gold-500">
                {dict.supplierCategories[
                  supplier.category as keyof typeof dict.supplierCategories
                ] ?? supplier.category}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-navy-200">
                <span className="inline-flex items-center gap-1.5">
                  <IconMapPin className="h-4 w-4 text-gold-500" />
                  {supplier.city ? `${supplier.city}, ` : ""}
                  {countryName(supplier.countryCode, lang)}
                </span>
                {supplier.employees && (
                  <span className="inline-flex items-center gap-1.5">
                    <IconUsers className="h-4 w-4 text-gold-500" />
                    {new Intl.NumberFormat(
                      lang === "es" ? "es-ES" : "en-US"
                    ).format(supplier.employees)}{" "}
                    {dict.suppliers.employees.toLowerCase()}
                  </span>
                )}
                {supplier.website && (
                  <a
                    href={supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-gold-400 hover:text-gold-300"
                  >
                    <IconGlobe className="h-4 w-4" />
                    {dict.suppliers.website}
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
              {dict.suppliers.aboutTitle}
            </h2>
            <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-navy-700">
                {supplier.description}
              </p>
            </div>
          </section>

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold tracking-tight text-navy-950">
                {dict.suppliers.certifications}
              </h2>
              <div className="flex flex-wrap gap-2">
                {certifications.map((c) => (
                  <Badge
                    key={c}
                    className="bg-white text-navy-700 ring-1 ring-navy-200"
                  >
                    <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
                    {c}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Portfolio */}
          {portfolio.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold tracking-tight text-navy-950">
                {dict.suppliers.portfolioTitle}
              </h2>
              <ul className="space-y-2.5 rounded-xl border border-navy-100 bg-white p-6 shadow-card">
                {portfolio.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2.5 text-sm text-navy-700"
                  >
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Fact sheet */}
        <aside className="h-fit space-y-6 lg:sticky lg:top-24">
          <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-card">
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
            </dl>
          </div>
          <ButtonLink
            href={`/${lang}/needs`}
            variant="primary"
            className="w-full"
          >
            {dict.suppliers.openNeedsCta}
          </ButtonLink>
        </aside>
      </div>
    </div>
  );
}
