import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { NeedForm } from "@/components/needs/NeedForm";

export const dynamic = "force-dynamic";

export default async function NewNeedPage({
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

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!company) redirect(`/${lang}/dashboard/needs`);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-navy-950">
        {dict.needs.manage.newTitle}
      </h1>
      <NeedForm lang={lang} dict={dict} />
    </div>
  );
}
