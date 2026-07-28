import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { CompanyFlagControls } from "@/components/dashboard/CompanyFlagControls";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (session.user.role !== "ADMIN") redirect(`/${lang}/dashboard`);

  const companies = await prisma.companyProfile.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: [{ isAnchor: "desc" }, { createdAt: "asc" }],
  });

  const t = dict.companies.admin;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950">
          {t.title}
        </h1>
        <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>
      </div>

      {companies.length === 0 ? (
        <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center text-navy-500">
          {t.empty}
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((c) => (
            <Card
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div className="min-w-0">
                <Link
                  href={`/${lang}/companies/${c.slug}`}
                  className="font-bold text-navy-950 hover:text-gold-600"
                >
                  {c.name}
                </Link>
                <p className="mt-0.5 text-xs text-navy-500">
                  {dict.categories[c.sector as keyof typeof dict.categories] ??
                    c.sector}{" "}
                  · {countryName(c.countryCode, lang)}
                </p>
                <p className="mt-0.5 text-xs text-navy-400">
                  {t.owner}: {c.user.name} ({c.user.email})
                </p>
              </div>
              <CompanyFlagControls
                companyId={c.id}
                verified={c.verified}
                isAnchor={c.isAnchor}
                labels={{ verified: t.verifiedFlag, anchor: t.anchorFlag }}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
