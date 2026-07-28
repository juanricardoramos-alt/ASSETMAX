import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatUsdCompact } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui";

export default async function AdminPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (session.user.role !== "ADMIN") redirect(`/${lang}/dashboard`);

  const t = dict.dashboard;
  const [totalProjects, published, pending, totalUsers, totalOffers, offerSum, countries] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.findMany({
        where: { status: "PUBLISHED" },
        select: { countryCode: true, investmentMin: true, investmentMax: true },
      }),
      prisma.project.count({ where: { status: "IN_REVIEW" } }),
      prisma.user.count(),
      prisma.offer.count(),
      prisma.offer.aggregate({ _sum: { amount: true } }),
      prisma.project.findMany({
        where: { status: "PUBLISHED" },
        select: { countryCode: true },
        distinct: ["countryCode"],
      }),
    ]);

  const pipeline = published.reduce(
    (s, p) => s + (p.investmentMax ?? p.investmentMin ?? 0),
    0
  );

  const sections = [
    { href: `/${lang}/dashboard/admin/queue`, title: t.verificationQueue, badge: pending },
    { href: `/${lang}/dashboard/admin/users`, title: t.users, badge: totalUsers },
    { href: `/${lang}/dashboard/admin/featured`, title: t.featuredManager, badge: null },
    {
      href: `/${lang}/dashboard/admin/companies`,
      title: dict.companies.admin.title,
      badge: await prisma.companyProfile.count(),
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold text-navy-950">{t.admin.title}</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t.stats.totalProjects} value={totalProjects} />
        <StatCard label={t.stats.pendingReview} value={pending} accent />
        <StatCard label={t.stats.totalUsers} value={totalUsers} />
        <StatCard label={t.stats.countries} value={countries.length} />
        <StatCard label={t.stats.publishedProjects} value={published.length} />
        <StatCard label={t.stats.totalOffers} value={totalOffers} />
        <StatCard
          label={t.partner.offersVolume}
          value={formatUsdCompact(offerSum._sum.amount ?? 0)}
        />
        <StatCard label={t.stats.pipelineValue} value={formatUsdCompact(pipeline)} accent />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="p-6 transition hover:border-gold-300 hover:shadow-card-hover">
              <p className="font-bold text-navy-950">{s.title}</p>
              {s.badge !== null && (
                <p className="mt-1 text-2xl font-extrabold text-gold-600">{s.badge}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
