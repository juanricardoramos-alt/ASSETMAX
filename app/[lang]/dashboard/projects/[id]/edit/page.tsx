import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { translationField } from "@/lib/l10n";
import { aiEnabled } from "@/lib/ai";
import { parseJsonArray, parseSpecs } from "@/lib/utils";
import {
  ProjectWizard,
  type WizardData,
} from "@/components/dashboard/ProjectWizard";

export default async function EditProjectPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } }, documents: true },
  });
  if (!project) notFound();
  if (project.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    redirect(`/${lang}/dashboard`);
  }

  const initialData: WizardData = {
    title: project.title,
    summary: project.summary,
    description: project.description,
    descriptionEs: translationField(project.translations, "es", "description"),
    category: project.category,
    countryCode: project.countryCode,
    region: project.region ?? "",
    city: project.city ?? "",
    lat: project.lat != null ? String(project.lat) : "",
    lng: project.lng != null ? String(project.lng) : "",
    stage: project.stage,
    dealType: project.dealType,
    investmentMin: project.investmentMin != null ? String(project.investmentMin) : "",
    investmentMax: project.investmentMax != null ? String(project.investmentMax) : "",
    revenue: project.revenue != null ? String(project.revenue) : "",
    ebitda: project.ebitda != null ? String(project.ebitda) : "",
    capacity: project.capacity ?? "",
    production: project.production ?? "",
    permits: project.permits ?? "",
    workforce: project.workforce != null ? String(project.workforce) : "",
    areaHectares: project.areaHectares != null ? String(project.areaHectares) : "",
    highlights: parseJsonArray(project.highlights).join("\n"),
    specs: parseSpecs(project.specs),
    images: project.images.map((i) => i.url).join("\n"),
    documents: project.documents.map((d) => ({
      name: d.name,
      url: d.url,
      isConfidential: d.isConfidential,
    })),
  };

  return (
    <ProjectWizard
      lang={lang}
      dict={dict}
      projectId={project.id}
      initialData={initialData}
      aiIngestEnabled={aiEnabled()}
    />
  );
}
