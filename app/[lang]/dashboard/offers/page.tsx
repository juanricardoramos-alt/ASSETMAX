import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatUsdFull, formatDate } from "@/lib/utils";
import { Card, StatusBadge } from "@/components/ui";
import { OfferActions } from "@/components/dashboard/OfferActions";

export default async function OffersPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const t = dict.dashboard;
  const isInvestor = session.user.role === "INVESTOR";

  const offers = await prisma.offer.findMany({
    where: isInvestor
      ? { investorId: session.user.id }
      : { project: { ownerId: session.user.id } },
    include: {
      project: { select: { title: true, slug: true } },
      investor: { select: { name: true, company: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">
        {isInvestor ? t.offersSent : t.offersReceived}
      </h1>

      {offers.length === 0 ? (
        <Card className="p-12 text-center text-navy-500">{t.emptyOffers}</Card>
      ) : (
        <div className="space-y-4">
          {offers.map((o) => (
            <Card key={o.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/${lang}/projects/${o.project.slug}`}
                      className="font-bold text-navy-950 hover:text-gold-600"
                    >
                      {o.project.title}
                    </Link>
                    <StatusBadge
                      status={o.status}
                      label={
                        dict.offerStatuses[o.status as keyof typeof dict.offerStatuses]
                      }
                    />
                  </div>
                  <p className="mt-1 text-xs text-navy-400">
                    {!isInvestor && (
                      <>
                        {t.from}{" "}
                        <span className="font-semibold text-navy-600">
                          {o.investor.company ?? o.investor.name}
                        </span>{" "}
                        ·{" "}
                      </>
                    )}
                    {isInvestor ? t.submittedOn : t.receivedOn}{" "}
                    {formatDate(o.createdAt, lang)}
                  </p>
                  <p className="mt-3 text-2xl font-extrabold text-navy-950">
                    {formatUsdFull(o.amount)}
                    <span className="ml-2 text-sm font-semibold text-navy-500">
                      {dict.offerTypes[o.type as keyof typeof dict.offerTypes]}
                      {o.equityPct ? ` · ${o.equityPct}%` : ""}
                    </span>
                  </p>
                  <p className="mt-3 whitespace-pre-line rounded-lg bg-navy-50 px-4 py-3 text-sm leading-relaxed text-navy-700">
                    {o.message}
                  </p>
                </div>
                <OfferActions
                  offerId={o.id}
                  role={isInvestor ? "investor" : "seller"}
                  status={o.status}
                  labels={{
                    accept: t.accept,
                    decline: t.decline,
                    discuss: t.markInDiscussion,
                    withdraw: t.withdraw,
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
