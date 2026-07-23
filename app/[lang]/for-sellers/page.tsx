import type { Metadata } from "next";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { AudiencePage } from "@/components/AudiencePage";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.pages.forSellers.title };
}

export default async function ForSellersPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.pages.forSellers;

  return (
    <AudiencePage
      title={t.title}
      intro={t.intro}
      benefits={t.benefits}
      ctaLabel={t.cta}
      ctaHref={`/${lang}/auth/register`}
    />
  );
}
