import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatInvestmentRange, parseJsonArray } from "@/lib/utils";
import { Card, StatusBadge, Badge, ButtonLink } from "@/components/ui";
import { MandateRowActions } from "@/components/mandates/MandateRowActions";

export default async function MyMandatesPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const mandates = await prisma.mandate.findMany({
    where: { investorId: session.user.id },
    include: { _count: { select: { matches: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-navy-950">
          {dict.mandates.myMandates}
        </h1>
        <ButtonLink href={`/${lang}/dashboard/mandates/new`} variant="gold" size="sm">
          + {dict.mandates.newTitle}
        </ButtonLink>
      </div>

      {mandates.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-navy-500">{dict.mandates.emptyMine}</p>
          <ButtonLink
            href={`/${lang}/dashboard/mandates/new`}
            variant="primary"
            className="mt-5"
          >
            {dict.mandates.emptyMineCta}
          </ButtonLink>
        </Card>
      ) : (
        <div className="space-y-4">
          {mandates.map((m) => (
            <Card key={m.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-navy-950">{m.title}</h2>
                    <StatusBadge
                      status={m.status}
                      label={dict.statuses[m.status as keyof typeof dict.statuses]}
                    />
                    <Badge
                      className={
                        m.isPublic
                          ? "bg-navy-50 text-navy-600 ring-1 ring-navy-200"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      }
                    >
                      {m.isPublic
                        ? dict.mandates.publicLabel
                        : dict.mandates.confidentialLabel}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-navy-400">
                    {dict.mandates.ticket}:{" "}
                    {formatInvestmentRange(m.ticketMin, m.ticketMax)} ·{" "}
                    {parseJsonArray(m.categories)
                      .map((c) => dict.categories[c as keyof typeof dict.categories])
                      .join(", ") || dict.explorer.anyCategory}{" "}
                    ·{" "}
                    <Link
                      href={`/${lang}/dashboard/matches`}
                      className="font-semibold text-gold-600"
                    >
                      {m._count.matches} {dict.matches.title.toLowerCase()}
                    </Link>
                  </p>
                  {m.status === "REJECTED" && m.rejectionReason && (
                    <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                      {m.rejectionReason}
                    </p>
                  )}
                </div>
                <MandateRowActions
                  mandateId={m.id}
                  lang={lang}
                  labels={{ edit: dict.common.edit, del: dict.common.delete }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
