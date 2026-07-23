import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { Card, Badge } from "@/components/ui";
import { GenerateContractButton } from "@/components/contracts/ContractClientBits";
import { IconDoc } from "@/components/icons";

export default async function ContractsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  const userId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  const [contracts, eligibleOffers, eligibleCommodityMatches] = await Promise.all([
    prisma.contract.findMany({
      where: isAdmin ? {} : { OR: [{ sellerId: userId }, { buyerId: userId }] },
      include: {
        project: { select: { title: true } },
        commodityListing: { select: { title: true } },
        seller: { select: { name: true, company: true } },
        buyer: { select: { name: true, company: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.offer.findMany({
      where: {
        status: { in: ["IN_DISCUSSION", "ACCEPTED"] },
        ...(isAdmin
          ? {}
          : { OR: [{ investorId: userId }, { project: { ownerId: userId } }] }),
      },
      include: {
        project: { select: { title: true } },
        contracts: { select: { kind: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.commodityMatch.findMany({
      where: {
        status: "CONTACTED",
        ...(isAdmin
          ? {}
          : { OR: [{ sell: { ownerId: userId } }, { buy: { ownerId: userId } }] }),
      },
      include: { sell: { select: { title: true, id: true } } },
    }),
  ]);

  const t = dict.contracts;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950">{t.title}</h1>
        <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-xs leading-relaxed text-amber-900">
        {t.disclaimer}
      </div>

      {/* Existing documents */}
      {contracts.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-navy-500">{t.empty}</p>
          <p className="mt-1 text-xs text-navy-400">{t.emptyHint}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => {
            const ready = c.sellerReviewedAt && c.buyerReviewedAt;
            return (
              <Link key={c.id} href={`/${lang}/dashboard/contracts/${c.id}`}>
                <Card className="mb-3 flex items-center gap-4 p-5 transition hover:border-gold-300 hover:shadow-card-hover">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                    <IconDoc className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-navy-950">
                        {t.kinds[c.kind as keyof typeof t.kinds]}
                      </p>
                      {ready ? (
                        <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                          {t.bothReviewed}
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                          {t.draftBadge.split("/")[0].trim()}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-navy-400">
                      {c.project?.title ?? c.commodityListing?.title} ·{" "}
                      {c.seller.company ?? c.seller.name} ×{" "}
                      {c.buyer.company ?? c.buyer.name} · {t.generatedOn}{" "}
                      {formatDate(c.createdAt, lang)}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Generate new drafts */}
      {(eligibleOffers.length > 0 || eligibleCommodityMatches.length > 0) && (
        <div>
          <h2 className="mb-3 font-bold text-navy-950">{t.generate}</h2>
          <div className="space-y-3">
            {eligibleOffers.map((o) => {
              const existing = new Set(o.contracts.map((c) => c.kind));
              const kinds = (["LOI", "MOU", "SPA"] as const).filter(
                (k) => !existing.has(k)
              );
              if (kinds.length === 0) return null;
              return (
                <Card key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-navy-950">{o.project.title}</p>
                    <p className="text-xs text-navy-400">
                      {t.forOffer} ·{" "}
                      {dict.offerStatuses[o.status as keyof typeof dict.offerStatuses]}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {kinds.map((k) => (
                      <GenerateContractButton
                        key={k}
                        payload={{ kind: k, offerId: o.id }}
                        label={k}
                        generatingLabel={t.generating}
                      />
                    ))}
                  </div>
                </Card>
              );
            })}
            {eligibleCommodityMatches.map((m) => (
              <Card key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-navy-950">{m.sell.title}</p>
                  <p className="text-xs text-navy-400">{dict.commodities.navLabel}</p>
                </div>
                <GenerateContractButton
                  payload={{ kind: "COMMODITY_SPA", matchId: m.id }}
                  label={t.kinds.COMMODITY_SPA}
                  generatingLabel={t.generating}
                />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
