import type { Metadata } from "next";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { LegalPage } from "@/components/LegalPage";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.pages.terms.title };
}

export default async function TermsPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  return (
    <LegalPage
      title={dict.pages.terms.title}
      updatedLabel={dict.pages.terms.updated}
      sections={dict.pages.terms.sections}
    />
  );
}
