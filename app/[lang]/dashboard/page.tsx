import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatUsdCompact, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, StatusBadge, ButtonLink } from "@/components/ui";

export default async function DashboardOverview({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const userId = session.user.id;
  const role = session.user.role;
  const base = `/${lang}/dashboard`;
  const t = dict.dashboard;

  if (role === "INVESTOR") {
    const [favorites, offers, alerts, threads] = await Promise.all([
      prisma.favorite.count({ where: { userId } }),
      prisma.offer.findMany({
        where: { investorId: userId },
        include: { project: { select: { title: true, slug: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.alert.count({ where: { userId } }),
      prisma.thread.count({ where: { investorId: userId } }),
    ]);

    return (
      <div className="space-y-8">
        <Heading name={session.user.name ?? ""} t={t} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label={t.stats.favorites} value={favorites} />
          <StatCard label={t.stats.offersSent} value={offers.length} accent />
          <StatCard label={t.stats.alerts} value={alerts} />
          <StatCard label={t.stats.unreadMessages} value={threads} />
        </div>
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-navy-950">{t.offersSent}</h2>
            <Link href={`${base}/offers`} className="text-sm font-semibold text-gold-600">
              {dict.common.viewAll}
            </Link>
          </div>
          {offers.length === 0 ? (
            <p className="text-sm text-navy-500">{t.emptyOffers}</p>
          ) : (
            <ul className="divide-y divide-navy-100">
              {offers.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/${lang}/projects/${o.project.slug}`}
                      className="truncate text-sm font-semibold text-navy-900 hover:text-gold-600"
                    >
                      {o.project.title}
                    </Link>
                    <p className="text-xs text-navy-400">
                      {formatUsdCompact(o.amount)} · {formatDate(o.createdAt, lang)}
                    </p>
                  </div>
                  <StatusBadge
                    status={o.status}
                    label={dict.offerStatuses[o.status as keyof typeof dict.offerStatuses]}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    );
  }

  if (role === "ADMIN") {
    const [projects, users, offers, pending, countries] = await Promise.all([
      prisma.project.count(),
      prisma.user.count(),
      prisma.offer.count(),
      prisma.project.count({ where: { status: "IN_REVIEW" } }),
      prisma.project.findMany({
        where: { status: "PUBLISHED" },
        select: { countryCode: true },
        distinct: ["countryCode"],
      }),
    ]);

    return (
      <div className="space-y-8">
        <Heading name={session.user.name ?? ""} t={t} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label={t.stats.totalProjects} value={projects} />
          <StatCard label={t.stats.totalUsers} value={users} />
          <StatCard label={t.stats.totalOffers} value={offers} />
          <StatCard label={t.stats.countries} value={countries.length} />
        </div>
        {pending > 0 && (
          <Card className="flex items-center justify-between gap-4 border-amber-200 bg-amber-50 p-6">
            <div>
              <p className="font-bold text-navy-950">{t.admin.queueTitle}</p>
              <p className="text-sm text-navy-600">
                {pending} {t.stats.pendingReview.toLowerCase()}
              </p>
            </div>
            <ButtonLink href={`${base}/admin/queue`} variant="primary" size="sm">
              {t.verificationQueue}
            </ButtonLink>
          </Card>
        )}
      </div>
    );
  }

  // SELLER / PARTNER
  const [myProjects, offersReceived, threads] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, slug: true, status: true, views: true },
    }),
    prisma.offer.count({ where: { project: { ownerId: userId } } }),
    prisma.thread.count({ where: { sellerId: userId } }),
  ]);
  const totalViews = myProjects.reduce((s, p) => s + p.views, 0);
  const active = myProjects.filter((p) => p.status === "PUBLISHED").length;

  return (
    <div className="space-y-8">
      <Heading name={session.user.name ?? ""} t={t} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t.stats.activeProjects} value={active} />
        <StatCard label={t.stats.totalViews} value={totalViews.toLocaleString()} />
        <StatCard label={t.stats.offersReceived} value={offersReceived} accent />
        <StatCard label={t.stats.unreadMessages} value={threads} />
      </div>
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-navy-950">{t.myProjects}</h2>
          <ButtonLink href={`${base}/projects/new`} variant="gold" size="sm">
            + {t.newProject}
          </ButtonLink>
        </div>
        {myProjects.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-navy-500">{t.emptyProjects}</p>
            <ButtonLink href={`${base}/projects/new`} variant="primary" size="sm" className="mt-4">
              {t.emptyProjectsCta}
            </ButtonLink>
          </div>
        ) : (
          <ul className="divide-y divide-navy-100">
            {myProjects.slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-900">{p.title}</p>
                  <p className="text-xs text-navy-400">
                    {p.views.toLocaleString()} {t.viewsLabel}
                  </p>
                </div>
                <StatusBadge
                  status={p.status}
                  label={dict.statuses[p.status as keyof typeof dict.statuses]}
                />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Heading({ name, t }: { name: string; t: { welcome: string } }) {
  return (
    <h1 className="text-2xl font-extrabold tracking-tight text-navy-950">
      {t.welcome}, {name.split(" ")[0]}
    </h1>
  );
}
