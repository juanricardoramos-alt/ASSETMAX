import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { AnchorBadge, Card, VerifiedBadge } from "@/components/ui";
import { CompanyMonogram } from "@/components/company/CompanyMonogram";
import { IconMapPin } from "@/components/icons";

export type CompanyCardData = {
  slug: string;
  name: string;
  description: string;
  sector: string;
  countryCode: string;
  city: string | null;
  verified: boolean;
  isAnchor: boolean;
};

export function CompanyCard({
  company,
  lang,
  dict,
}: {
  company: CompanyCardData;
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <Card className="flex h-full min-w-0 flex-col p-6 transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <CompanyMonogram name={company.name} />
        <div className="flex flex-wrap justify-end gap-1.5">
          {company.isAnchor && <AnchorBadge label={dict.companies.anchorBadge} />}
          {company.verified && <VerifiedBadge label={dict.common.verified} />}
        </div>
      </div>

      <h3 className="mt-4 text-lg font-bold leading-snug text-navy-950">
        {company.name}
      </h3>
      <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-gold-600">
        {dict.categories[company.sector as keyof typeof dict.categories] ??
          company.sector}
      </p>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-500">
        {company.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-navy-100 pt-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-navy-500">
          <IconMapPin className="h-4 w-4 text-gold-500" />
          {company.city ? `${company.city}, ` : ""}
          {countryName(company.countryCode, lang)}
        </span>
        <Link
          href={`/${lang}/companies/${company.slug}`}
          className="text-xs font-bold text-navy-900 hover:text-gold-600"
        >
          {dict.companies.viewProfile} →
        </Link>
      </div>
    </Card>
  );
}
