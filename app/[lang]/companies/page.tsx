import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { FOUNDING_ANCHORS } from "@/lib/constants";
import { CompanyCard } from "@/components/company/CompanyCard";
import { CompanyMonogram } from "@/components/company/CompanyMonogram";
import { SectionHeading } from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.companies.title, description: dict.companies.subtitle };
}

export default async function CompaniesPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);

  const companies = await prisma.companyProfile.findMany({
    orderBy: [{ isAnchor: "desc" }, { verified: "desc" }, { createdAt: "asc" }],
  });

  // Link founding-partner tiles to their live profiles when they exist.
  const bySlugName = new Map(companies.map((c) => [c.name.toLowerCase(), c.slug]));

  return (
    <div className="bg-navy-50/40">
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {dict.companies.title}
          </h1>
          <p className="mt-2 max-w-3xl text-navy-200">{dict.companies.subtitle}</p>
        </div>
      </div>

      {/* Founding partners — anchor companies with placeholder logos */}
      <section className="border-b border-navy-100 bg-white">
        <div className="container-site py-14">
          <SectionHeading
            kicker={dict.companies.foundingKicker}
            title={dict.companies.foundingTitle}
            subtitle={dict.companies.foundingSubtitle}
          />
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            {FOUNDING_ANCHORS.map((anchor) => {
              const slug = bySlugName.get(anchor.name.toLowerCase());
              const tile = (
                <div className="flex h-full flex-col items-center gap-4 rounded-xl border border-navy-100 bg-navy-50/50 p-8 text-center transition hover:border-gold-400 hover:shadow-card">
                  <CompanyMonogram
                    name={anchor.name}
                    monogram={anchor.monogram}
                    size="lg"
                  />
                  <div>
                    <p className="font-display text-lg font-bold text-navy-950">
                      {anchor.name}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gold-600">
                      {dict.companies.anchorBadge}
                    </p>
                  </div>
                </div>
              );
              return slug ? (
                <Link key={anchor.key} href={`/${lang}/companies/${slug}`}>
                  {tile}
                </Link>
              ) : (
                <div key={anchor.key}>{tile}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Directory */}
      <div className="container-site py-12">
        <h2 className="mb-6 text-xl font-extrabold tracking-tight text-navy-950">
          {dict.companies.directoryTitle}
        </h2>
        {companies.length === 0 ? (
          <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center text-navy-500">
            {dict.companies.empty}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {companies.map((c) => (
              <CompanyCard key={c.id} company={c} lang={lang} dict={dict} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
