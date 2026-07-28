import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { parseJsonArray } from "@/lib/utils";
import { NeedForm } from "@/components/needs/NeedForm";

export const dynamic = "force-dynamic";

export default async function EditNeedPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const need = await prisma.need.findUnique({
    where: { id: params.id },
    include: { company: { select: { userId: true } } },
  });
  if (!need || need.company.userId !== session.user.id) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-navy-950">
        {dict.needs.manage.editTitle}
      </h1>
      <NeedForm
        lang={lang}
        dict={dict}
        needId={need.id}
        initialData={{
          title: need.title,
          description: need.description,
          category: need.category,
          countryCode: need.countryCode,
          city: need.city ?? "",
          budgetMin: need.budgetMin ? String(need.budgetMin) : "",
          budgetMax: need.budgetMax ? String(need.budgetMax) : "",
          deadline: need.deadline
            ? need.deadline.toISOString().slice(0, 10)
            : "",
          requirements: parseJsonArray(need.requirements).join("\n"),
        }}
      />
    </div>
  );
}
