import type { Dictionary, Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { formatInvestmentRange, parseJsonArray } from "@/lib/utils";
import { Badge, Card } from "@/components/ui";
import { IconGlobe, IconBuilding } from "@/components/icons";

export type MandateCardData = {
  title: string;
  description: string;
  categories: string;
  countries: string;
  stages: string;
  dealTypes: string;
  ticketMin: number | null;
  ticketMax: number | null;
  investor: { company: string | null; name: string };
};

export function MandateCard({
  mandate,
  lang,
  dict,
}: {
  mandate: MandateCardData;
  lang: Locale;
  dict: Dictionary;
}) {
  const categories = parseJsonArray(mandate.categories);
  const countries = parseJsonArray(mandate.countries);
  const stages = parseJsonArray(mandate.stages);
  const dealTypes = parseJsonArray(mandate.dealTypes);

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
          <IconBuilding className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-navy-500">
            {mandate.investor.company ?? mandate.investor.name}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
            {dict.mandates.ticket}:{" "}
            {formatInvestmentRange(mandate.ticketMin, mandate.ticketMax)}
          </p>
        </div>
      </div>

      <h3 className="mt-4 text-lg font-bold leading-snug text-navy-950">
        {mandate.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-500">
        {mandate.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <Badge key={c} className="bg-navy-900 text-white">
            {dict.categories[c as keyof typeof dict.categories] ?? c}
          </Badge>
        ))}
        {stages.map((s) => (
          <Badge key={s} className="bg-navy-50 text-navy-600 ring-1 ring-navy-200">
            {dict.stages[s as keyof typeof dict.stages] ?? s}
          </Badge>
        ))}
        {dealTypes.map((d) => (
          <Badge key={d} className="bg-navy-50 text-navy-600 ring-1 ring-navy-200">
            {dict.dealTypes[d as keyof typeof dict.dealTypes] ?? d}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-navy-100 pt-4 text-xs font-medium text-navy-500">
        <IconGlobe className="h-4 w-4 text-gold-500" />
        {countries.length > 0
          ? countries.map((c) => countryName(c, lang)).join(" · ")
          : dict.explorer.anyCountry}
      </div>
    </Card>
  );
}
