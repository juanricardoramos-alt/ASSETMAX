import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { Card, Badge } from "@/components/ui";
import { FeatureToggle } from "@/components/dashboard/FeatureToggle";

export default async function AdminFeaturedPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (session.user.role !== "ADMIN") redirect(`/${lang}/dashboard`);

  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { views: "desc" }],
    select: {
      id: true,
      title: true,
      category: true,
      countryCode: true,
      featured: true,
      views: true,
    },
  });

  const t = dict.dashboard.admin;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950">{t.featuredTitle}</h1>
        <p className="mt-1 text-sm text-navy-500">{t.featuredHint}</p>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <Card key={p.id} className="flex items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-navy-950">{p.title}</p>
                {p.featured && (
                  <Badge className="bg-gold-100 text-gold-800 ring-1 ring-gold-300">
                    {dict.common.featured}
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-xs text-navy-400">
                {dict.categories[p.category as keyof typeof dict.categories]} ·{" "}
                {countryName(p.countryCode, lang)} · {p.views.toLocaleString()}{" "}
                {dict.common.views}
              </p>
            </div>
            <FeatureToggle
              projectId={p.id}
              featured={p.featured}
              labels={{ feature: t.makeFeatured, unfeature: t.removeFeatured }}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
