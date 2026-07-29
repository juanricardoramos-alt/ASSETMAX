import type { Metadata } from "next";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { VortaStudio } from "@/components/vorta/VortaStudio";

// Internal review screen — intentionally unlinked from the navigation.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.vorta.studio.title, robots: { index: false } };
}

export default async function VortaStudioPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);

  return (
    <div className="bg-navy-50/40">
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {dict.vorta.studio.title}
          </h1>
          <p className="mt-2 max-w-3xl text-navy-200">
            {dict.vorta.studio.subtitle}
          </p>
        </div>
      </div>
      <div className="container-site py-10">
        <VortaStudio dict={dict} />
      </div>
    </div>
  );
}
