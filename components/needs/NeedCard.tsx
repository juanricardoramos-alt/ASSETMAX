import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { formatDate, formatInvestmentRange } from "@/lib/utils";
import { AnchorBadge, Badge, ButtonLink, Card } from "@/components/ui";
import { CompanyMonogram } from "@/components/company/CompanyMonogram";
import { IconMapPin } from "@/components/icons";

export type NeedCardData = {
  slug: string;
  title: string;
  description: string;
  category: string;
  kind?: string;
  countryCode: string;
  city: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  deadline: Date | null;
  status: string;
  company: { slug: string; name: string; isAnchor: boolean; verified: boolean };
};

export function NeedCard({
  need,
  lang,
  dict,
}: {
  need: NeedCardData;
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <Card className="flex h-full min-w-0 flex-col p-6">
      {/* Requesting company */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/${lang}/companies/${need.company.slug}`}
          className="group flex min-w-0 items-center gap-3"
        >
          <CompanyMonogram name={need.company.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-navy-900 group-hover:text-gold-600">
              {need.company.name}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
              {dict.needs.postedBy}
            </p>
          </div>
        </Link>
        {need.company.isAnchor && (
          <AnchorBadge label={dict.companies.anchorBadge} />
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <Badge className="bg-navy-900 text-white">
          {dict.supplierCategories[
            need.category as keyof typeof dict.supplierCategories
          ] ?? need.category}
        </Badge>
        {need.kind === "EPC_TENDER" && (
          <Badge className="bg-gold-500 text-navy-950">
            {dict.tenders.badge}
          </Badge>
        )}
        {need.status === "CLOSED" && (
          <Badge className="bg-navy-100 text-navy-600">
            {dict.needStatuses.CLOSED}
          </Badge>
        )}
      </div>

      <h3 className="mt-3 text-lg font-bold leading-snug text-navy-950">
        <Link
          href={`/${lang}/needs/${need.slug}`}
          className="hover:text-gold-600"
        >
          {need.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-500">
        {need.description}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-navy-100 pt-4 text-sm">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
            {dict.needs.budgetRef}
          </dt>
          <dd className="font-semibold text-navy-900">
            {formatInvestmentRange(need.budgetMin, need.budgetMax)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
            {dict.needs.deadline}
          </dt>
          <dd className="font-semibold text-navy-900">
            {need.deadline ? formatDate(need.deadline, lang) : "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-navy-500">
          <IconMapPin className="h-4 w-4 shrink-0 text-gold-500" />
          <span className="truncate">
            {need.city ? `${need.city}, ` : ""}
            {countryName(need.countryCode, lang)}
          </span>
        </span>
        <ButtonLink
          href={`/${lang}/needs/${need.slug}`}
          variant="gold"
          size="sm"
        >
          {dict.needs.apply}
        </ButtonLink>
      </div>
    </Card>
  );
}
