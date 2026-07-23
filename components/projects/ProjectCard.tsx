import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { formatInvestmentRange } from "@/lib/utils";
import { SmartImage } from "@/components/SmartImage";
import { Badge, VerifiedBadge, PartnerBadge } from "@/components/ui";
import { IconMapPin, IconEye } from "@/components/icons";

export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  countryCode: string;
  city: string | null;
  stage: string;
  dealType: string;
  verified: boolean;
  investmentMin: number | null;
  investmentMax: number | null;
  views: number;
  images: { url: string; alt: string }[];
  owner: { role: string };
};

export function ProjectCard({
  project,
  lang,
  dict,
  priority = false,
}: {
  project: ProjectCardData;
  lang: Locale;
  dict: Dictionary;
  priority?: boolean;
}) {
  const image = project.images[0];

  return (
    <Link
      href={`/${lang}/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-navy-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative h-52 w-full overflow-hidden bg-navy-100">
        {image ? (
          <SmartImage
            src={image.url}
            alt={image.alt || project.title}
            priority={priority}
            className="transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-900 text-3xl font-bold text-white/20">
            AMX
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge className="bg-navy-950/80 text-white backdrop-blur">
            {dict.categories[project.category as keyof typeof dict.categories]}
          </Badge>
          {project.verified && <VerifiedBadge label={dict.common.verified} />}
          {project.owner.role === "PARTNER" && (
            <PartnerBadge label={dict.common.foundingPartner} />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-navy-500">
          <IconMapPin className="h-3.5 w-3.5" />
          {project.city ? `${project.city}, ` : ""}
          {countryName(project.countryCode, lang)}
        </div>
        <h3 className="mt-1.5 text-lg font-bold leading-snug text-navy-950 group-hover:text-navy-700">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-navy-500">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge className="bg-navy-50 text-navy-600 ring-1 ring-navy-200">
            {dict.stages[project.stage as keyof typeof dict.stages]}
          </Badge>
          <Badge className="bg-navy-50 text-navy-600 ring-1 ring-navy-200">
            {dict.dealTypes[project.dealType as keyof typeof dict.dealTypes]}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
              {dict.common.investmentRange}
            </p>
            <p className="text-base font-bold text-navy-950">
              {formatInvestmentRange(project.investmentMin, project.investmentMax)}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-navy-400">
            <IconEye className="h-4 w-4" />
            {project.views.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
