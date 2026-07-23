import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { Badge, Card, VerifiedBadge } from "@/components/ui";
import { IconGlobe, IconEye } from "@/components/icons";

export type CommodityCardData = {
  slug: string;
  side: string;
  commodity: string;
  title: string;
  description: string;
  volume: string;
  periodicity: string;
  incoterm: string;
  originCode: string | null;
  destinationCode: string | null;
  priceDetails: string | null;
  verified: boolean;
  views: number;
};

export function CommodityCard({
  listing,
  lang,
  dict,
}: {
  listing: CommodityCardData;
  lang: Locale;
  dict: Dictionary;
}) {
  const c = dict.commodities;
  const isSell = listing.side === "SELL";
  const geo = isSell ? listing.originCode : listing.destinationCode;

  return (
    <Link href={`/${lang}/commodities/${listing.slug}`}>
      <Card className="flex h-full flex-col p-6 transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-card-hover">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            className={
              isSell
                ? "bg-gold-500 text-navy-950"
                : "bg-navy-900 text-white"
            }
          >
            {isSell ? c.sell : c.buy}
          </Badge>
          <Badge className="bg-navy-50 text-navy-600 ring-1 ring-navy-200">
            {c.names[listing.commodity as keyof typeof c.names] ?? listing.commodity}
          </Badge>
          {listing.verified && <VerifiedBadge label={dict.common.verified} />}
        </div>

        <h3 className="mt-3 text-lg font-bold leading-snug text-navy-950">
          {listing.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-navy-500">
          {listing.description}
        </p>

        <dl className="mt-4 space-y-1.5 border-t border-navy-100 pt-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-navy-400">{c.volume}</dt>
            <dd className="text-right font-semibold text-navy-900">{listing.volume}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-navy-400">{c.incoterm}</dt>
            <dd className="font-semibold text-navy-900">
              {listing.incoterm} ·{" "}
              {listing.periodicity === "spot" ? c.spot : c.contract}
            </dd>
          </div>
          {listing.priceDetails && (
            <div className="flex justify-between gap-3">
              <dt className="text-navy-400">{c.price}</dt>
              <dd className="truncate text-right font-semibold text-navy-900">
                {listing.priceDetails}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-3 flex items-center justify-between text-xs font-medium text-navy-500">
          <span className="flex items-center gap-1.5">
            <IconGlobe className="h-4 w-4 text-gold-500" />
            {isSell ? c.origin : c.destination}:{" "}
            {geo ? countryName(geo, lang) : "—"}
          </span>
          <span className="flex items-center gap-1 text-navy-400">
            <IconEye className="h-4 w-4" />
            {listing.views.toLocaleString()}
          </span>
        </div>
      </Card>
    </Link>
  );
}
