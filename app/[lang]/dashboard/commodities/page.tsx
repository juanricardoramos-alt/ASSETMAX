import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { Card, StatusBadge, Badge, ButtonLink } from "@/components/ui";
import { CommodityRowActions } from "@/components/commodities/CommodityRowActions";

export default async function MyCommoditiesPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const listings = await prisma.commodityListing.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const c = dict.commodities;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-navy-950">{c.myListings}</h1>
        <ButtonLink href={`/${lang}/dashboard/commodities/new`} variant="gold" size="sm">
          + {c.newListing}
        </ButtonLink>
      </div>

      {listings.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-navy-500">{c.emptyMine}</p>
          <ButtonLink
            href={`/${lang}/dashboard/commodities/new`}
            variant="primary"
            className="mt-5"
          >
            {c.postCta}
          </ButtonLink>
        </Card>
      ) : (
        <div className="space-y-4">
          {listings.map((l) => (
            <Card key={l.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={
                        l.side === "SELL"
                          ? "bg-gold-500 text-navy-950"
                          : "bg-navy-900 text-white"
                      }
                    >
                      {l.side === "SELL" ? c.sell : c.buy}
                    </Badge>
                    <h2 className="font-bold text-navy-950">{l.title}</h2>
                    <StatusBadge
                      status={l.status}
                      label={dict.statuses[l.status as keyof typeof dict.statuses]}
                    />
                  </div>
                  <p className="mt-1 text-xs text-navy-400">
                    {c.names[l.commodity as keyof typeof c.names]} · {l.volume} ·{" "}
                    {l.incoterm} · {l.views.toLocaleString()} {dict.common.views}
                  </p>
                  {l.status === "REJECTED" && l.rejectionReason && (
                    <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                      {l.rejectionReason}
                    </p>
                  )}
                </div>
                <CommodityRowActions
                  listingId={l.id}
                  slug={l.slug}
                  status={l.status}
                  lang={lang}
                  labels={{
                    view: dict.common.view,
                    edit: dict.common.edit,
                    del: dict.common.delete,
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
