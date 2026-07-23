import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { aiEnabled } from "@/lib/ai";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { MandateForm } from "@/components/mandates/MandateForm";

export default async function NewMandatePage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  return <MandateForm lang={lang} dict={dict} aiStructureEnabled={aiEnabled()} />;
}
