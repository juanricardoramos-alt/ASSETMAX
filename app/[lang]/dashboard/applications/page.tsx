import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatDate, formatUsdCompact } from "@/lib/utils";
import { ApplicationWithdrawButton } from "@/components/suppliers/ApplicationActions";
import { ButtonLink, Card, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function MyApplicationsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (!["SUPPLIER", "ADMIN"].includes(session.user.role)) {
    redirect(`/${lang}/dashboard`);
  }

  const t = dict.suppliers.applications;

  const supplier = await prisma.supplierProfile.findUnique({
    where: { userId: session.user.id },
  });

  const applications = supplier
    ? await prisma.supplierApplication.findMany({
        where: { supplierId: supplier.id },
        include: {
          need: {
            select: {
              slug: true,
              title: true,
              status: true,
              company: { select: { slug: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950">
          {t.title}
        </h1>
        <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center">
          <p className="text-navy-500">{t.empty}</p>
          <ButtonLink href={`/${lang}/needs`} variant="gold" className="mt-4">
            {t.emptyCta}
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((a) => (
            <Card
              key={a.id}
              className="flex flex-wrap items-start justify-between gap-4 p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/${lang}/needs/${a.need.slug}`}
                    className="font-bold text-navy-950 hover:text-gold-600"
                  >
                    {a.need.title}
                  </Link>
                  <StatusBadge
                    status={a.status}
                    label={
                      dict.offerStatuses[
                        a.status as keyof typeof dict.offerStatuses
                      ] ?? a.status
                    }
                  />
                </div>
                <p className="mt-1 text-xs text-navy-500">
                  {dict.needs.postedBy}:{" "}
                  <Link
                    href={`/${lang}/companies/${a.need.company.slug}`}
                    className="font-semibold hover:text-gold-600"
                  >
                    {a.need.company.name}
                  </Link>{" "}
                  · {t.appliedOn} {formatDate(a.createdAt, lang)}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-navy-600">
                  {a.message}
                </p>
                <p className="mt-2 text-xs font-medium text-navy-500">
                  {a.proposedBudget && (
                    <>
                      {t.proposedBudget}: {formatUsdCompact(a.proposedBudget)}
                      {" · "}
                    </>
                  )}
                  {a.leadTime && (
                    <>
                      {t.leadTime}: {a.leadTime}
                    </>
                  )}
                </p>
              </div>
              {["PENDING", "IN_DISCUSSION"].includes(a.status) && (
                <ApplicationWithdrawButton
                  applicationId={a.id}
                  labels={{ withdraw: t.withdraw, confirm: t.confirmWithdraw }}
                />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
