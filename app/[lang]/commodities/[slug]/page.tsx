import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { localized, localizedAll } from "@/lib/l10n";
import { countryName } from "@/lib/constants";
import { formatDate, parseSpecs } from "@/lib/utils";
import { Badge, Card, VerifiedBadge } from "@/components/ui";
import { CommodityActions } from "@/components/commodities/CommodityActions";
import { CommodityCard } from "@/components/commodities/CommodityCard";
import { MarketRefsBar } from "@/components/commodities/MarketRefsBar";
import { IconBuilding, IconDoc, IconEye } from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const found = await prisma.commodityListing.findUnique({
    where: { slug: params.slug },
  });
  if (!found) return {};
  const listing = localized(found, isLocale(params.lang) ? params.lang : defaultLocale);
  return { title: listing.title, description: listing.description.slice(0, 160) };
}

type Doc = { name: string; url: string; isConfidential: boolean };

export default async function CommodityDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const c = dict.commodities;
  const session = await auth();

  const listingRaw = await prisma.commodityListing.findUnique({
    where: { slug: params.slug },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          company: true,
          verifiedSeller: true,
          createdAt: true,
        },
      },
    },
  });

  const isOwner = !!session && session.user.id === listingRaw?.ownerId;
  const isAdmin = session?.user.role === "ADMIN";
  if (!listingRaw || (listingRaw.status !== "PUBLISHED" && !isOwner && !isAdmin)) {
    notFound();
  }

  const listing = localized(listingRaw, lang);

  if (!isOwner) {
    prisma.commodityListing
      .update({ where: { id: listing.id }, data: { views: { increment: 1 } } })
      .catch(() => {});
  }

  const docs: Doc[] = (() => {
    try {
      return JSON.parse(listing.documents) as Doc[];
    } catch {
      return [];
    }
  })();
  const publicDocs = docs.filter((d) => !d.isConfidential);
  const confidentialDocs = docs.filter((d) => d.isConfidential);
  const specs = parseSpecs(listing.specs);

  const hasNda =
    isOwner || isAdmin
      ? true
      : session
        ? !!(await prisma.commodityNda.findUnique({
            where: {
              listingId_userId: { listingId: listing.id, userId: session.user.id },
            },
          }))
        : false;

  const similar = localizedAll(
    await prisma.commodityListing.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: listing.id },
        commodity: listing.commodity,
      },
      take: 3,
    }),
    lang
  );

  const isSell = listing.side === "SELL";
  const facts = [
    { label: c.volume, value: listing.volume },
    {
      label: c.periodicity,
      value: listing.periodicity === "spot" ? c.spot : c.contract,
    },
    { label: c.incoterm, value: listing.incoterm },
    {
      label: isSell ? c.origin : c.destination,
      value: (() => {
        const code = isSell ? listing.originCode : listing.destinationCode;
        return code ? countryName(code, lang) : null;
      })(),
    },
    { label: c.delivery, value: listing.deliveryLocation },
    {
      label: c.price,
      value: [
        listing.priceType === "fixed" ? c.priceFixed : c.priceIndexed,
        listing.priceDetails,
      ]
        .filter(Boolean)
        .join(" — "),
    },
    {
      label: c.validity,
      value: listing.validUntil ? formatDate(listing.validUntil, lang) : null,
    },
  ].filter((f) => f.value);

  return (
    <div className="bg-navy-50/40 pb-20">
      <MarketRefsBar title={c.marketRefs} note={c.marketRefsNote} lang={lang} />
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={isSell ? "bg-gold-500 text-navy-950" : "bg-white/15 text-white"}>
              {isSell ? c.sell : c.buy}
            </Badge>
            <Badge className="bg-white/10 text-white">
              {c.names[listing.commodity as keyof typeof c.names] ?? listing.commodity}
            </Badge>
            {listing.verified && <VerifiedBadge label={dict.common.verified} />}
          </div>
          <h1 className="mt-3 max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {listing.title}
          </h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-navy-200">
            <IconEye className="h-4 w-4 text-gold-400" />
            {listing.views.toLocaleString()} {dict.common.views}
          </p>
        </div>
      </div>

      <div className="container-site mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-8">
          <Card className="p-7">
            <h2 className="text-xl font-bold text-navy-950">{dict.project.overview}</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-navy-700">
              {listing.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Card>

          {specs.length > 0 && (
            <Card className="p-7">
              <h2 className="text-xl font-bold text-navy-950">{c.specsTitle}</h2>
              <dl className="mt-4 divide-y divide-navy-100">
                {specs.map((row) => (
                  <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-[220px_1fr]">
                    <dt className="text-sm font-semibold text-navy-500">{row.label}</dt>
                    <dd className="text-sm text-navy-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}

          {publicDocs.length > 0 && (
            <Card className="p-7">
              <h2 className="text-xl font-bold text-navy-950">
                {dict.project.publicDocuments}
              </h2>
              <ul className="mt-4 space-y-2">
                {publicDocs.map((d, i) => (
                  <li key={i}>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-navy-100 px-4 py-3 text-sm font-medium text-navy-800 transition hover:border-gold-300 hover:bg-gold-50/40"
                    >
                      <IconDoc className="h-5 w-5 shrink-0 text-navy-400" />
                      {d.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-navy-400">{dict.project.downloadNote}</p>
            </Card>
          )}

          <p className="rounded-xl border border-navy-100 bg-white px-5 py-4 text-xs leading-relaxed text-navy-500">
            {c.disclaimer}
          </p>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <Card className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
              {dict.project.keyFacts}
            </p>
            <dl className="mt-4 space-y-3">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start justify-between gap-3">
                  <dt className="shrink-0 text-sm text-navy-500">{f.label}</dt>
                  <dd className="min-w-0 break-words text-right text-sm font-bold text-navy-900">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <CommodityActions
                listingId={listing.id}
                lang={lang}
                dict={dict}
                isOwner={isOwner}
                hasNda={hasNda}
                confidentialDocs={confidentialDocs}
              />
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
              {isSell ? c.seller : c.buyer}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                <IconBuilding className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-navy-950">
                  {listing.owner.company ?? listing.owner.name}
                </p>
                <p className="text-xs text-navy-400">
                  {dict.project.memberSince} {formatDate(listing.owner.createdAt, lang)}
                </p>
              </div>
            </div>
            {listing.owner.verifiedSeller && (
              <div className="mt-3">
                <VerifiedBadge label={dict.common.verifiedSeller} />
              </div>
            )}
          </Card>
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="container-site mt-16">
          <h2 className="mb-6 text-2xl font-bold text-navy-950">{dict.project.similar}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((l) => (
              <CommodityCard key={l.id} listing={l} lang={lang} dict={dict} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
