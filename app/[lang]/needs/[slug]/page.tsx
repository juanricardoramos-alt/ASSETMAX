import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/l10n";
import { countryName } from "@/lib/constants";
import {
  formatDate,
  formatInvestmentRange,
  formatUsdCompact,
  parseJsonArray,
} from "@/lib/utils";
import { CompanyMonogram } from "@/components/company/CompanyMonogram";
import {
  NeedApplyCard,
  type ApplyState,
} from "@/components/needs/NeedApplyCard";
import { AnchorBadge, Badge, StatusBadge, VerifiedBadge } from "@/components/ui";
import { IconCheck, IconMapPin } from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const need = await prisma.need.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true },
  });
  if (!need) return {};
  return { title: need.title, description: need.description.slice(0, 160) };
}

export default async function NeedDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();

  const needRaw = await prisma.need.findUnique({
    where: { slug: params.slug },
    include: { company: true },
  });
  if (!needRaw) notFound();

  // Overlay the active locale's content (title, description, requirements…).
  const need = {
    ...localized(needRaw, lang),
    company: localized(needRaw.company, lang),
  };

  await prisma.need
    .update({ where: { id: need.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  // Resolve what the apply card should offer the current visitor.
  let applyState: ApplyState;
  if (!session) {
    applyState = "signedOut";
  } else if (need.company.userId === session.user.id) {
    applyState = "ownNeed";
  } else if (need.status !== "OPEN") {
    applyState = "closed";
  } else {
    const supplier = await prisma.supplierProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        applications: { where: { needId: need.id }, select: { id: true } },
      },
    });
    if (!supplier) applyState = "noProfile";
    else if (supplier.applications.length > 0) applyState = "applied";
    else if (supplier.status === "PUBLISHED") applyState = "canApply";
    else applyState = "pending";
  }
  if (need.status !== "OPEN" && applyState !== "ownNeed") {
    applyState = applyState === "applied" ? "applied" : "closed";
  }

  const requirements = parseJsonArray(need.requirements);

  // On EPC tenders the competing bids are public.
  const bids =
    need.kind === "EPC_TENDER"
      ? await prisma.supplierApplication.findMany({
          where: { needId: need.id, status: { not: "WITHDRAWN" } },
          include: {
            supplier: { select: { slug: true, name: true, category: true } },
            consortium: {
              include: {
                members: {
                  include: { supplier: { select: { name: true } } },
                },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        })
      : [];

  return (
    <div className="bg-navy-50/40">
      {/* Header */}
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-12">
          <Link
            href={`/${lang}/companies/${need.company.slug}`}
            className="group inline-flex items-center gap-3"
          >
            <CompanyMonogram name={need.company.name} />
            <div>
              <p className="text-sm font-bold text-white group-hover:text-gold-400">
                {need.company.name}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-navy-300">
                {dict.needs.postedBy}
              </p>
            </div>
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {need.title}
            </h1>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge className="bg-gold-500 text-navy-950">
              {dict.supplierCategories[
                need.category as keyof typeof dict.supplierCategories
              ] ?? need.category}
            </Badge>
            {need.kind === "EPC_TENDER" && (
              <Badge className="bg-white text-navy-950">
                {dict.tenders.badge}
              </Badge>
            )}
            <StatusBadge
              status={need.status}
              label={
                dict.needStatuses[
                  need.status as keyof typeof dict.needStatuses
                ] ?? need.status
              }
            />
            {need.company.isAnchor && (
              <AnchorBadge label={dict.companies.anchorBadge} />
            )}
            {need.company.verified && (
              <VerifiedBadge label={dict.common.verified} />
            )}
            <span className="ml-1 inline-flex items-center gap-1.5 text-sm text-navy-200">
              <IconMapPin className="h-4 w-4 text-gold-500" />
              {need.city ? `${need.city}, ` : ""}
              {countryName(need.countryCode, lang)}
            </span>
          </div>
        </div>
      </div>

      <div className="container-site grid gap-8 py-10 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-8">
          {/* Description */}
          <section className="rounded-xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-navy-700">
              {need.description}
            </p>
          </section>

          {/* Requirements */}
          {requirements.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold tracking-tight text-navy-950">
                {dict.needs.requirementsTitle}
              </h2>
              <ul className="space-y-2.5 rounded-xl border border-navy-100 bg-white p-6 shadow-card">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-navy-700">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Public bidders (EPC tenders only) */}
          {need.kind === "EPC_TENDER" && (
            <section>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-extrabold tracking-tight text-navy-950">
                  {dict.tenders.biddersTitle} ({bids.length})
                </h2>
                <p className="text-xs text-navy-400">
                  {dict.tenders.publicBidsNote}
                </p>
              </div>
              {bids.length === 0 ? (
                <div className="rounded-xl border border-dashed border-navy-200 bg-white p-10 text-center text-sm text-navy-500">
                  {dict.tenders.noBidders}
                </div>
              ) : (
                <div className="space-y-3">
                  {bids.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-navy-100 bg-white p-5 shadow-card"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <CompanyMonogram
                            name={b.consortium ? b.consortium.name : b.supplier.name}
                          />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {b.consortium ? (
                                <>
                                  <span className="text-sm font-bold text-navy-950">
                                    {b.consortium.name}
                                  </span>
                                  <Badge className="bg-navy-950 text-gold-400 ring-1 ring-gold-500/40">
                                    {dict.consortiums.badge} ·{" "}
                                    {b.consortium.members.length}
                                  </Badge>
                                </>
                              ) : (
                                <Link
                                  href={`/${lang}/suppliers/${b.supplier.slug}`}
                                  className="text-sm font-bold text-navy-950 hover:text-gold-600"
                                >
                                  {b.supplier.name}
                                </Link>
                              )}
                              <StatusBadge
                                status={b.status}
                                label={
                                  dict.offerStatuses[
                                    b.status as keyof typeof dict.offerStatuses
                                  ] ?? b.status
                                }
                              />
                            </div>
                            <p className="mt-0.5 text-xs text-navy-500">
                              {b.consortium
                                ? b.consortium.members
                                    .map((m) => m.supplier.name)
                                    .join(" · ")
                                : (dict.supplierCategories[
                                    b.supplier.category as keyof typeof dict.supplierCategories
                                  ] ?? b.supplier.category)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-bold text-navy-900">
                            {b.proposedBudget
                              ? formatUsdCompact(b.proposedBudget)
                              : "—"}
                          </p>
                          {b.leadTime && (
                            <p className="text-xs text-navy-500">{b.leadTime}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Requesting company */}
          <section>
            <h2 className="mb-4 text-xl font-extrabold tracking-tight text-navy-950">
              {dict.needs.aboutCompany}
            </h2>
            <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-card">
              <p className="line-clamp-4 text-sm leading-relaxed text-navy-600">
                {need.company.description}
              </p>
              <Link
                href={`/${lang}/companies/${need.company.slug}`}
                className="mt-3 inline-block text-sm font-bold text-navy-900 hover:text-gold-600"
              >
                {dict.companies.viewProfile} →
              </Link>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <NeedApplyCard
            lang={lang}
            dict={dict}
            needId={need.id}
            state={applyState}
          />
          <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-card">
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-navy-400">
                  {dict.needs.budgetRef}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-navy-900">
                  {formatInvestmentRange(need.budgetMin, need.budgetMax)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-navy-400">
                  {dict.needs.deadline}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-navy-900">
                  {need.deadline ? formatDate(need.deadline, lang) : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-navy-400">
                  {dict.needs.location}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-navy-900">
                  {need.city ? `${need.city}, ` : ""}
                  {countryName(need.countryCode, lang)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-navy-400">
                  {dict.needs.postedOn}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-navy-900">
                  {formatDate(need.createdAt, lang)}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
