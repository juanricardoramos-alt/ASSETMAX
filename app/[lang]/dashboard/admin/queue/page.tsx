import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { formatInvestmentRange, formatDate } from "@/lib/utils";
import { Card, Badge } from "@/components/ui";
import { ReviewActions } from "@/components/dashboard/ReviewActions";

export default async function AdminQueuePage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (session.user.role !== "ADMIN") redirect(`/${lang}/dashboard`);

  const [queue, mandateQueue, commodityQueue] = await Promise.all([
    prisma.project.findMany({
      where: { status: "IN_REVIEW" },
      include: { owner: { select: { name: true, company: true, email: true } } },
      orderBy: { updatedAt: "asc" },
    }),
    prisma.mandate.findMany({
      where: { status: "IN_REVIEW" },
      include: { investor: { select: { name: true, company: true, email: true } } },
      orderBy: { updatedAt: "asc" },
    }),
    prisma.commodityListing.findMany({
      where: { status: "IN_REVIEW" },
      include: { owner: { select: { name: true, company: true, email: true } } },
      orderBy: { updatedAt: "asc" },
    }),
  ]);

  const t = dict.dashboard.admin;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">{t.queueTitle}</h1>

      {queue.length === 0 && mandateQueue.length === 0 && commodityQueue.length === 0 ? (
        <Card className="p-12 text-center text-navy-500">{t.queueEmpty}</Card>
      ) : (
        <div className="space-y-4">
          {queue.map((p) => (
            <Card key={p.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-navy-950">{p.title}</h2>
                    <Badge className="bg-navy-100 text-navy-600">
                      {dict.categories[p.category as keyof typeof dict.categories]}
                    </Badge>
                    <Badge className="bg-navy-100 text-navy-600">
                      {countryName(p.countryCode, lang)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-navy-400">
                    {p.owner.company ?? p.owner.name} · {p.owner.email} ·{" "}
                    {formatDate(p.updatedAt, lang)} ·{" "}
                    {formatInvestmentRange(p.investmentMin, p.investmentMax)}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-600">
                    {p.summary}
                  </p>
                </div>
                <ReviewActions
                  projectId={p.id}
                  labels={{
                    approve: t.approve,
                    reject: t.reject,
                    reason: t.rejectReason,
                    confirm: t.rejectConfirm,
                    cancel: dict.common.cancel,
                  }}
                />
              </div>
            </Card>
          ))}
          {mandateQueue.map((m) => (
            <Card key={m.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-navy-950">{m.title}</h2>
                    <Badge className="bg-gold-100 text-gold-800 ring-1 ring-gold-300">
                      {dict.mandates.navLabel}
                    </Badge>
                    <Badge className="bg-navy-100 text-navy-600">
                      {m.isPublic
                        ? dict.mandates.publicLabel
                        : dict.mandates.confidentialLabel}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-navy-400">
                    {m.investor.company ?? m.investor.name} · {m.investor.email} ·{" "}
                    {formatDate(m.updatedAt, lang)} ·{" "}
                    {formatInvestmentRange(m.ticketMin, m.ticketMax)}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-600">
                    {m.description}
                  </p>
                </div>
                <ReviewActions
                  projectId={m.id}
                  entity="mandates"
                  labels={{
                    approve: t.approve,
                    reject: t.reject,
                    reason: t.rejectReason,
                    confirm: t.rejectConfirm,
                    cancel: dict.common.cancel,
                  }}
                />
              </div>
            </Card>
          ))}
          {commodityQueue.map((l) => (
            <Card key={l.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-navy-950">{l.title}</h2>
                    <Badge
                      className={
                        l.side === "SELL"
                          ? "bg-gold-500 text-navy-950"
                          : "bg-navy-900 text-white"
                      }
                    >
                      {l.side === "SELL"
                        ? dict.commodities.sell
                        : dict.commodities.buy}
                    </Badge>
                    <Badge className="bg-navy-100 text-navy-600">
                      {dict.commodities.names[
                        l.commodity as keyof typeof dict.commodities.names
                      ] ?? l.commodity}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-navy-400">
                    {l.owner.company ?? l.owner.name} · {l.owner.email} ·{" "}
                    {formatDate(l.updatedAt, lang)} · {l.volume} · {l.incoterm}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-600">
                    {l.description}
                  </p>
                </div>
                <ReviewActions
                  projectId={l.id}
                  entity="commodities"
                  labels={{
                    approve: t.approve,
                    reject: t.reject,
                    reason: t.rejectReason,
                    confirm: t.rejectConfirm,
                    cancel: dict.common.cancel,
                  }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
