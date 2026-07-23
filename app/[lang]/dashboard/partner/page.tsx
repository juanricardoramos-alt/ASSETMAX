import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { formatUsdCompact } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, PartnerBadge } from "@/components/ui";

export default async function PartnerPanelPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (!["PARTNER", "ADMIN"].includes(session.user.role)) {
    redirect(`/${lang}/dashboard`);
  }

  const t = dict.dashboard.partner;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);

  const [published, offers, offersAgg, newUsers, newProjects, projectsWithOffers, totalUsers] =
    await Promise.all([
      prisma.project.findMany({
        where: { status: "PUBLISHED" },
        select: {
          category: true,
          countryCode: true,
          investmentMin: true,
          investmentMax: true,
        },
      }),
      prisma.offer.count(),
      prisma.offer.aggregate({ _sum: { amount: true } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.project.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.project.count({ where: { offers: { some: {} } } }),
      prisma.user.count(),
    ]);

  const pipeline = published.reduce(
    (s, p) => s + (p.investmentMax ?? p.investmentMin ?? 0),
    0
  );

  const byKey = (key: "category" | "countryCode") => {
    const map = new Map<string, number>();
    for (const p of published) {
      const k = p[key];
      map.set(k, (map.get(k) ?? 0) + (p.investmentMax ?? p.investmentMin ?? 0));
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  };

  const byCategory = byKey("category");
  const byCountry = byKey("countryCode");
  const maxCat = byCategory[0]?.[1] ?? 1;
  const maxCty = byCountry[0]?.[1] ?? 1;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold text-navy-950">{t.title}</h1>
          <PartnerBadge label={dict.common.foundingPartner} />
        </div>
        <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>
      </div>

      <Card className="border-gold-200 bg-gold-50/50 p-5 text-sm leading-relaxed text-navy-700">
        {t.note}
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t.gmvLabel} value={formatUsdCompact(pipeline)} accent />
        <StatCard
          label={t.offersVolume}
          value={formatUsdCompact(offersAgg._sum.amount ?? 0)}
        />
        <StatCard label={dict.dashboard.stats.totalOffers} value={offers} />
        <StatCard label={t.conversionLabel} value={projectsWithOffers} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {[
          {
            title: t.topCategories,
            rows: byCategory.map(([k, v]) => ({
              label: dict.categories[k as keyof typeof dict.categories] ?? k,
              value: v,
              pct: (v / maxCat) * 100,
            })),
          },
          {
            title: t.topCountries,
            rows: byCountry.map(([k, v]) => ({
              label: countryName(k, lang),
              value: v,
              pct: (v / maxCty) * 100,
            })),
          },
        ].map((block) => (
          <Card key={block.title} className="p-6">
            <h2 className="mb-5 font-bold text-navy-950">{block.title}</h2>
            <div className="space-y-4">
              {block.rows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-navy-800">{row.label}</span>
                    <span className="font-bold text-navy-500">
                      {formatUsdCompact(row.value)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-navy-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-navy-700 to-gold-500"
                      style={{ width: `${Math.max(4, row.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t.newUsers} value={newUsers} />
        <StatCard label={t.newProjects} value={newProjects} />
        <StatCard label={dict.dashboard.stats.totalUsers} value={totalUsers} />
        <StatCard
          label={dict.dashboard.stats.publishedProjects}
          value={published.length}
        />
      </div>
    </div>
  );
}
