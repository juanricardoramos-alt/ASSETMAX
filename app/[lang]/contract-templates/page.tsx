import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { TEMPLATE_KINDS, type TemplateKind } from "@/lib/constants";
import {
  IconHandshake,
  IconLock,
  IconDoc,
  IconChart,
  IconBuilding,
  IconShield,
  IconUsers,
  IconPorts,
  IconArrowRight,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.templates.title, description: dict.templates.subtitle };
}

const KIND_ICONS: Record<TemplateKind, (p: { className?: string }) => JSX.Element> = {
  INTERMEDIATION: IconHandshake,
  INTERMEDIATION_EXCLUSIVE: IconShield,
  NDA: IconLock,
  LOI: IconDoc,
  MOU: IconUsers,
  SPA: IconBuilding,
  JV: IconChart,
  COMMODITY_SPA: IconPorts,
  COMMODITY_SUPPLY: IconPorts,
};

export default async function ContractTemplatesPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.templates;

  return (
    <div className="bg-navy-50/40 pb-20">
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-2 max-w-2xl text-navy-200">{t.subtitle}</p>
        </div>
      </div>

      <div className="container-site mt-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900">
          {t.disclaimer}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_KINDS.map((kind) => {
            const Icon = KIND_ICONS[kind];
            const info = t.kinds[kind];
            return (
              <Link
                key={kind}
                href={`/${lang}/dashboard/templates/new?kind=${kind}`}
                className="group flex flex-col rounded-xl border border-navy-100 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-card-hover"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-lg font-bold leading-snug text-navy-950">
                  {info.name}
                </h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-navy-500">
                  {info.when}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy-900 group-hover:text-gold-700">
                  {t.useCta}
                  <IconArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
