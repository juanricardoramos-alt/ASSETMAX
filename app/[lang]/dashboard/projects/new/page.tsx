import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { aiEnabled } from "@/lib/ai";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { ProjectWizard } from "@/components/dashboard/ProjectWizard";

export default async function NewProjectPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (!["SELLER", "PARTNER", "ADMIN"].includes(session.user.role)) {
    redirect(`/${lang}/dashboard`);
  }

  return <ProjectWizard lang={lang} dict={dict} aiIngestEnabled={aiEnabled()} />;
}
