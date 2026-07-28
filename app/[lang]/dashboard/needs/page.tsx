import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { NeedRowActions } from "@/components/needs/NeedRowActions";
import { Badge, ButtonLink, Card, StatusBadge } from "@/components/ui";
import { IconPlus } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function MyNeedsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (!["SELLER", "PARTNER", "ADMIN"].includes(session.user.role)) {
    redirect(`/${lang}/dashboard`);
  }

  const t = dict.needs.manage;

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.user.id },
  });

  const needs = company
    ? await prisma.need.findMany({
        where: { companyId: company.id },
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-950">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>
        </div>
        {company && (
          <ButtonLink href={`/${lang}/dashboard/needs/new`} variant="gold">
            <IconPlus className="h-4 w-4" />
            {dict.needs.postCta}
          </ButtonLink>
        )}
      </div>

      {!company ? (
        <Card className="border-gold-300 bg-gold-50/50 p-8 text-center">
          <p className="font-semibold text-navy-800">{t.needCompanyFirst}</p>
          <ButtonLink
            href={`/${lang}/dashboard/company`}
            variant="gold"
            className="mt-4"
          >
            {t.createCompanyCta}
          </ButtonLink>
        </Card>
      ) : needs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center">
          <p className="text-navy-500">{t.empty}</p>
          <ButtonLink
            href={`/${lang}/dashboard/needs/new`}
            variant="gold"
            className="mt-4"
          >
            {t.emptyCta}
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-4">
          {needs.map((n) => (
            <Card
              key={n.id}
              className="flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/${lang}/needs/${n.slug}`}
                    className="font-bold text-navy-950 hover:text-gold-600"
                  >
                    {n.title}
                  </Link>
                  <StatusBadge
                    status={n.status}
                    label={
                      dict.needStatuses[
                        n.status as keyof typeof dict.needStatuses
                      ] ?? n.status
                    }
                  />
                </div>
                <p className="mt-1 text-xs text-navy-500">
                  {dict.supplierCategories[
                    n.category as keyof typeof dict.supplierCategories
                  ] ?? n.category}{" "}
                  · {countryName(n.countryCode, lang)} ·{" "}
                  {formatDate(n.createdAt, lang)} · {n.views}{" "}
                  {dict.common.views}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Badge className="bg-navy-50 text-navy-700 ring-1 ring-navy-200">
                    {n._count.applications}{" "}
                    {n._count.applications === 1
                      ? t.applicationSingular
                      : t.applications}
                  </Badge>
                  <Link
                    href={`/${lang}/dashboard/needs/${n.id}`}
                    className="text-xs font-bold text-navy-900 hover:text-gold-600"
                  >
                    {t.viewApplications} →
                  </Link>
                  <Link
                    href={`/${lang}/dashboard/needs/${n.id}/edit`}
                    className="text-xs font-bold text-navy-900 hover:text-gold-600"
                  >
                    {dict.common.edit}
                  </Link>
                </div>
              </div>
              <NeedRowActions
                needId={n.id}
                status={n.status}
                labels={{
                  close: t.close,
                  reopen: t.reopen,
                  delete: dict.common.delete,
                  confirmDelete: t.confirmDelete,
                }}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
