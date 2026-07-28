import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { formatDate, formatUsdCompact, parseJsonArray } from "@/lib/utils";
import { ApplicationDecisionActions } from "@/components/suppliers/ApplicationActions";
import { CompanyMonogram } from "@/components/company/CompanyMonogram";
import { Badge, Card, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NeedApplicationsPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const need = await prisma.need.findUnique({
    where: { id: params.id },
    include: {
      company: { select: { userId: true } },
      applications: {
        include: {
          supplier: true,
          consortium: {
            include: {
              members: {
                include: {
                  supplier: {
                    select: { id: true, slug: true, name: true, category: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!need || need.company.userId !== session.user.id) notFound();

  const t = dict.suppliers.received;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gold-600">
          {t.title}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-950">
          <Link
            href={`/${lang}/needs/${need.slug}`}
            className="hover:text-gold-600"
          >
            {need.title}
          </Link>
        </h1>
        <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>
      </div>

      {need.applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center text-navy-500">
          {t.empty}
        </div>
      ) : (
        <div className="space-y-4">
          {need.applications.map((a) => {
            const certifications = parseJsonArray(a.supplier.certifications);
            return (
              <Card key={a.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <CompanyMonogram
                      name={a.consortium ? a.consortium.name : a.supplier.name}
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {a.consortium ? (
                          <>
                            <span className="font-bold text-navy-950">
                              {a.consortium.name}
                            </span>
                            <Badge className="bg-navy-950 text-gold-400 ring-1 ring-gold-500/40">
                              {dict.consortiums.badge} ·{" "}
                              {a.consortium.members.length}
                            </Badge>
                          </>
                        ) : (
                          <Link
                            href={`/${lang}/suppliers/${a.supplier.slug}`}
                            className="font-bold text-navy-950 hover:text-gold-600"
                          >
                            {a.supplier.name}
                          </Link>
                        )}
                        <StatusBadge
                          status={a.status}
                          label={
                            dict.offerStatuses[
                              a.status as keyof typeof dict.offerStatuses
                            ] ?? a.status
                          }
                        />
                      </div>
                      <p className="mt-0.5 text-xs text-navy-500">
                        {a.consortium ? (
                          <>
                            {dict.consortiums.ledBy}:{" "}
                            <Link
                              href={`/${lang}/suppliers/${a.supplier.slug}`}
                              className="font-semibold hover:text-gold-600"
                            >
                              {a.supplier.name}
                            </Link>{" "}
                            · {formatDate(a.createdAt, lang)}
                          </>
                        ) : (
                          <>
                            {dict.supplierCategories[
                              a.supplier.category as keyof typeof dict.supplierCategories
                            ] ?? a.supplier.category}{" "}
                            · {countryName(a.supplier.countryCode, lang)} ·{" "}
                            {formatDate(a.createdAt, lang)}
                          </>
                        )}
                      </p>
                      {a.consortium && (
                        <div className="mt-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
                            {dict.consortiums.membersTitle}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {a.consortium.members.map((m) => (
                              <Badge
                                key={m.id}
                                className="bg-navy-50 text-navy-700 ring-1 ring-navy-200"
                              >
                                <Link
                                  href={`/${lang}/suppliers/${m.supplier.slug}`}
                                  className="hover:text-gold-600"
                                >
                                  {m.supplier.name}
                                </Link>
                                {m.supplier.id === a.consortium!.leaderId && (
                                  <span className="text-gold-600">
                                    · {dict.consortiums.leaderTag}
                                  </span>
                                )}
                                {m.role && (
                                  <span className="text-navy-400">
                                    — {m.role}
                                  </span>
                                )}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {!a.consortium && certifications.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {certifications.slice(0, 4).map((c) => (
                            <Badge
                              key={c}
                              className="bg-navy-50 text-navy-600 ring-1 ring-navy-200"
                            >
                              {c}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <ApplicationDecisionActions
                    applicationId={a.id}
                    status={a.status}
                    labels={{
                      discuss: t.discuss,
                      accept: t.accept,
                      decline: t.decline,
                    }}
                  />
                </div>

                <div className="mt-4 rounded-lg bg-navy-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy-400">
                    {t.proposal}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-navy-700">
                    {a.message}
                  </p>
                  <p className="mt-2 text-xs font-medium text-navy-500">
                    {a.proposedBudget && (
                      <>
                        {dict.suppliers.applications.proposedBudget}:{" "}
                        {formatUsdCompact(a.proposedBudget)}
                        {" · "}
                      </>
                    )}
                    {a.leadTime && (
                      <>
                        {dict.suppliers.applications.leadTime}: {a.leadTime}
                      </>
                    )}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
