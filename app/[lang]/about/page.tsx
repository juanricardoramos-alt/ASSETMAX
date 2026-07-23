import type { Metadata } from "next";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { Card, SectionHeading } from "@/components/ui";
import { IconShield, IconLock, IconGlobe } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.pages.about.title };
}

const PILLAR_ICONS = [IconShield, IconLock, IconGlobe];

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.pages.about;

  return (
    <div>
      <div className="bg-navy-950 py-16">
        <div className="container-site max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">{t.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-navy-200">{t.intro}</p>
        </div>
      </div>

      <div className="container-site py-16">
        <SectionHeading title={t.missionTitle} subtitle={t.missionText} />
        <div className="grid gap-6 md:grid-cols-3">
          {t.pillars.map((pillar, i) => {
            const Icon = PILLAR_ICONS[i] ?? IconShield;
            return (
              <Card key={pillar.title} className="p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy-950">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{pillar.text}</p>
              </Card>
            );
          })}
        </div>

        <Card className="mt-12 bg-navy-50/60 p-8">
          <h2 className="text-xl font-bold text-navy-950">{t.complianceTitle}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy-600">
            {t.complianceText}
          </p>
        </Card>
      </div>
    </div>
  );
}
