import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { aiEnabled } from "@/lib/ai";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { parseJsonArray } from "@/lib/utils";
import { MandateForm, type MandateFormData } from "@/components/mandates/MandateForm";

export default async function EditMandatePage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const mandate = await prisma.mandate.findUnique({ where: { id: params.id } });
  if (!mandate) notFound();
  if (mandate.investorId !== session.user.id && session.user.role !== "ADMIN") {
    redirect(`/${lang}/dashboard`);
  }

  const initialData: MandateFormData = {
    title: mandate.title,
    description: mandate.description,
    categories: parseJsonArray(mandate.categories),
    countries: parseJsonArray(mandate.countries),
    stages: parseJsonArray(mandate.stages),
    dealTypes: parseJsonArray(mandate.dealTypes),
    ticketMin: mandate.ticketMin != null ? String(mandate.ticketMin) : "",
    ticketMax: mandate.ticketMax != null ? String(mandate.ticketMax) : "",
    equityMin: mandate.equityMin != null ? String(mandate.equityMin) : "",
    equityMax: mandate.equityMax != null ? String(mandate.equityMax) : "",
    conditions: mandate.conditions ?? "",
    isPublic: mandate.isPublic,
  };

  return (
    <MandateForm
      lang={lang}
      dict={dict}
      mandateId={mandate.id}
      initialData={initialData}
      aiStructureEnabled={aiEnabled()}
    />
  );
}
