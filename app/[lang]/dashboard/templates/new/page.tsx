import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { TemplateGenerator } from "@/components/templates/TemplateGenerator";

export default async function NewTemplateDocumentPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const projects = await prisma.project.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, city: true, country: true, countryCode: true },
  });

  return (
    <Suspense>
      <TemplateGenerator
        dict={dict}
        lang={lang}
        projects={projects.map((p) => ({
          id: p.id,
          title: p.title,
          location: [p.city, p.country].filter(Boolean).join(", "),
          countryCode: p.countryCode,
        }))}
      />
    </Suspense>
  );
}
