import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { parseJsonArray } from "@/lib/utils";
import { Badge, Card, VerifiedBadge } from "@/components/ui";
import { CompanyMonogram } from "@/components/company/CompanyMonogram";
import { IconMapPin } from "@/components/icons";

export type SupplierCardData = {
  slug: string;
  name: string;
  description: string;
  category: string;
  countryCode: string;
  city: string | null;
  certifications: string;
  capacity: string | null;
  verified: boolean;
};

export function SupplierCard({
  supplier,
  lang,
  dict,
}: {
  supplier: SupplierCardData;
  lang: Locale;
  dict: Dictionary;
}) {
  const certifications = parseJsonArray(supplier.certifications);

  return (
    <Card className="flex h-full min-w-0 flex-col p-6 transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <CompanyMonogram name={supplier.name} />
        {supplier.verified && (
          <VerifiedBadge label={dict.suppliers.qualifiedBadge} />
        )}
      </div>

      <h3 className="mt-4 text-lg font-bold leading-snug text-navy-950">
        {supplier.name}
      </h3>
      <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-gold-600">
        {dict.supplierCategories[
          supplier.category as keyof typeof dict.supplierCategories
        ] ?? supplier.category}
      </p>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-500">
        {supplier.description}
      </p>

      {certifications.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {certifications.slice(0, 4).map((c) => (
            <Badge
              key={c}
              className="bg-navy-50 text-navy-600 ring-1 ring-navy-200"
            >
              {c}
            </Badge>
          ))}
        </div>
      )}

      {supplier.capacity && (
        <p className="mt-3 text-xs text-navy-500">
          <span className="font-bold uppercase tracking-wider text-navy-400">
            {dict.suppliers.capacity}:
          </span>{" "}
          {supplier.capacity}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-navy-100 pt-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-navy-500">
          <IconMapPin className="h-4 w-4 text-gold-500" />
          {supplier.city ? `${supplier.city}, ` : ""}
          {countryName(supplier.countryCode, lang)}
        </span>
        <Link
          href={`/${lang}/suppliers/${supplier.slug}`}
          className="text-xs font-bold text-navy-900 hover:text-gold-600"
        >
          {dict.suppliers.viewProfile} →
        </Link>
      </div>
    </Card>
  );
}
