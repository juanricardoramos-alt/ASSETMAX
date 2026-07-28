import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { SupplierCard } from "@/components/suppliers/SupplierCard";
import { SuppliersFilters } from "@/components/suppliers/SuppliersFilters";
import { ButtonLink } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.suppliers.title, description: dict.suppliers.subtitle };
}

type SearchParams = { q?: string; category?: string; country?: string };

export default async function SuppliersPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: SearchParams;
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);

  // Only suppliers qualified by the platform team are listed publicly.
  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (searchParams.category) where.category = searchParams.category;
  if (searchParams.country) where.countryCode = searchParams.country;
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q } },
      { description: { contains: searchParams.q } },
      { country: { contains: searchParams.q } },
      { city: { contains: searchParams.q } },
    ];
  }

  const [suppliers, allPublished] = await Promise.all([
    prisma.supplierProfile.findMany({
      where,
      orderBy: [{ verified: "desc" }, { createdAt: "asc" }],
    }),
    prisma.supplierProfile.findMany({
      where: { status: "PUBLISHED" },
      select: { countryCode: true },
      distinct: ["countryCode"],
    }),
  ]);

  const countries = allPublished
    .map((s) => ({ code: s.countryCode, name: countryName(s.countryCode, lang) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-navy-50/40">
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site flex flex-wrap items-end justify-between gap-6 py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {dict.suppliers.title}
            </h1>
            <p className="mt-2 text-navy-200">{dict.suppliers.subtitle}</p>
          </div>
          <ButtonLink
            href={`/${lang}/dashboard/supplier`}
            variant="gold"
            size="lg"
          >
            {dict.suppliers.registerCta}
            <IconArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>

      <div className="container-site grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit min-w-0 rounded-xl border border-navy-100 bg-white p-5 shadow-card lg:sticky lg:top-24">
          <Suspense>
            <SuppliersFilters dict={dict} countries={countries} />
          </Suspense>
        </aside>

        <div>
          <p className="mb-5 text-sm font-medium text-navy-500">
            {suppliers.length}{" "}
            {suppliers.length === 1
              ? dict.suppliers.result
              : dict.suppliers.results}
          </p>

          {suppliers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center text-navy-500">
              {dict.suppliers.empty}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {suppliers.map((s) => (
                <SupplierCard key={s.id} supplier={s} lang={lang} dict={dict} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
