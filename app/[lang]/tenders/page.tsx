import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { formatDate, formatInvestmentRange, parseJsonArray } from "@/lib/utils";
import { CompanyMonogram } from "@/components/company/CompanyMonogram";
import { AnchorBadge, Badge, ButtonLink, Card, StatusBadge } from "@/components/ui";
import { IconMapPin } from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.tenders.title, description: dict.tenders.subtitle };
}

export default async function TendersPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.tenders;

  const tenders = await prisma.need.findMany({
    where: { kind: "EPC_TENDER" },
    include: {
      company: {
        select: { slug: true, name: true, isAnchor: true, verified: true },
      },
      applications: {
        where: { status: { not: "WITHDRAWN" } },
        select: {
          id: true,
          proposedBudget: true,
          supplier: { select: { name: true } },
          consortium: { select: { name: true } },
        },
      },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const open = tenders.filter((n) => n.status === "OPEN");
  const closed = tenders.filter((n) => n.status !== "OPEN");

  function TenderRow({ tender }: { tender: (typeof tenders)[number] }) {
    const requirements = parseJsonArray(tender.requirements);
    return (
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <CompanyMonogram name={tender.company.name} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/${lang}/companies/${tender.company.slug}`}
                  className="text-sm font-bold text-navy-600 hover:text-gold-600"
                >
                  {tender.company.name}
                </Link>
                {tender.company.isAnchor && (
                  <AnchorBadge label={dict.companies.anchorBadge} />
                )}
                <StatusBadge
                  status={tender.status}
                  label={
                    dict.needStatuses[
                      tender.status as keyof typeof dict.needStatuses
                    ] ?? tender.status
                  }
                />
              </div>
              <h3 className="mt-1.5 text-lg font-bold leading-snug text-navy-950">
                <Link
                  href={`/${lang}/needs/${tender.slug}`}
                  className="hover:text-gold-600"
                >
                  {tender.title}
                </Link>
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-navy-500">
                {tender.description}
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-navy-500">
                <span className="inline-flex items-center gap-1">
                  <IconMapPin className="h-3.5 w-3.5 text-gold-500" />
                  {tender.city ? `${tender.city}, ` : ""}
                  {countryName(tender.countryCode, lang)}
                </span>
                <span>
                  {t.budget}:{" "}
                  <span className="font-bold text-navy-800">
                    {formatInvestmentRange(tender.budgetMin, tender.budgetMax)}
                  </span>
                </span>
                <span>
                  {t.deadline}:{" "}
                  <span className="font-bold text-navy-800">
                    {tender.deadline ? formatDate(tender.deadline, lang) : "—"}
                  </span>
                </span>
                <span>
                  {requirements.length} {t.requirementsCount}
                </span>
              </p>
              {tender.applications.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
                    {t.biddersTitle}:
                  </span>
                  {tender.applications.map((a) => (
                    <Badge
                      key={a.id}
                      className="bg-navy-50 text-navy-700 ring-1 ring-navy-200"
                    >
                      {a.consortium?.name ?? a.supplier.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-3">
            <p className="text-right">
              <span className="font-display text-3xl font-bold text-gold-600">
                {tender.applications.length}
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-navy-400">
                {tender.applications.length === 1 ? t.bidder : t.bidders}
              </span>
            </p>
            <ButtonLink
              href={`/${lang}/needs/${tender.slug}`}
              variant="primary"
              size="sm"
            >
              {t.viewTender}
            </ButtonLink>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="bg-navy-50/40">
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-2 max-w-3xl text-navy-200">{t.subtitle}</p>
          <p className="mt-4 text-sm font-semibold text-gold-400">
            {open.length} {t.openTenders}
          </p>
        </div>
      </div>

      <div className="container-site space-y-10 py-10">
        {open.length === 0 ? (
          <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center text-navy-500">
            {t.empty}
          </div>
        ) : (
          <div className="space-y-4">
            {open.map((n) => (
              <TenderRow key={n.id} tender={n} />
            ))}
          </div>
        )}

        {closed.length > 0 && (
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-navy-900">
              {t.closedTenders}
            </h2>
            <div className="space-y-4 opacity-70">
              {closed.map((n) => (
                <TenderRow key={n.id} tender={n} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
