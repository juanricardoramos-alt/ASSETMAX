import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { AlertsManager } from "@/components/dashboard/AlertsManager";

export default async function AlertsPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">{dict.dashboard.alerts}</h1>
      <AlertsManager lang={lang} dict={dict} alerts={alerts} />
    </div>
  );
}
