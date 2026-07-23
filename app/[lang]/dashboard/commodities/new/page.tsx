import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { aiEnabled } from "@/lib/ai";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { CommodityForm } from "@/components/commodities/CommodityForm";

export default async function NewCommodityPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  return <CommodityForm lang={lang} dict={dict} aiIngestEnabled={aiEnabled()} />;
}
