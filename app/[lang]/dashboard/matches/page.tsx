import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/l10n";
import { formatDate } from "@/lib/utils";
import { Card, Badge, StatusBadge } from "@/components/ui";
import { MatchActions } from "@/components/matches/MatchActions";

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : score >= 65
        ? "bg-gold-50 text-gold-700 ring-gold-200"
        : "bg-navy-50 text-navy-600 ring-navy-200";
  return (
    <div className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full ring-2 ${color}`}>
      <span className="text-lg font-extrabold leading-none">{score}%</span>
      <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wide">{label}</span>
    </div>
  );
}

export default async function MatchesPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const userId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  const [projectMatchesRaw, commodityMatchesRaw] = await Promise.all([
    prisma.projectMatch.findMany({
      where: isAdmin
        ? {}
        : {
            OR: [
              { project: { ownerId: userId } },
              { mandate: { investorId: userId } },
            ],
          },
      include: {
        project: {
          select: { title: true, slug: true, ownerId: true, country: true },
        },
        mandate: {
          select: {
            title: true,
            translations: true,
            investorId: true,
            investor: { select: { company: true, name: true } },
          },
        },
      },
      orderBy: [{ status: "asc" }, { score: "desc" }],
    }),
    prisma.commodityMatch.findMany({
      where: isAdmin
        ? {}
        : {
            OR: [{ sell: { ownerId: userId } }, { buy: { ownerId: userId } }],
          },
      include: {
        sell: { select: { title: true, translations: true, slug: true, ownerId: true } },
        buy: { select: { title: true, translations: true, slug: true, ownerId: true } },
      },
      orderBy: [{ status: "asc" }, { score: "desc" }],
    }),
  ]);

  const projectMatches = projectMatchesRaw.map((m) => ({
    ...m,
    mandate: localized(m.mandate, lang),
  }));
  const commodityMatches = commodityMatchesRaw.map((m) => ({
    ...m,
    sell: localized(m.sell, lang),
    buy: localized(m.buy, lang),
  }));

  const t = dict.matches;
  const statusLabel = (s: string) =>
    s === "NEW" ? t.statusNew : s === "CONTACTED" ? t.contacted : t.dismissed;

  const empty = projectMatches.length === 0 && commodityMatches.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950">{t.title}</h1>
        <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>
      </div>

      {empty && (
        <Card className="p-12 text-center text-navy-500">{t.empty}</Card>
      )}

      {projectMatches.map((m) => (
        <Card key={m.id} className="p-6">
          <div className="flex flex-wrap items-start gap-5">
            <ScoreBadge score={m.score} label={t.score} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/${lang}/projects/${m.project.slug}`}
                  className="font-bold text-navy-950 hover:text-gold-600"
                >
                  {m.project.title}
                </Link>
                <span className="text-navy-300">×</span>
                <span className="font-semibold text-navy-700">{m.mandate.title}</span>
                <StatusBadge status={m.status === "NEW" ? "PENDING" : m.status === "CONTACTED" ? "IN_DISCUSSION" : "WITHDRAWN"} label={statusLabel(m.status)} />
              </div>
              <p className="mt-1 text-xs text-navy-400">
                {t.forMandate}:{" "}
                {m.mandate.investor.company ?? m.mandate.investor.name} ·{" "}
                {formatDate(m.createdAt, lang)}
              </p>
              <div className="mt-3 rounded-lg bg-navy-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                  {t.why}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-navy-700">{m.rationale}</p>
              </div>
              <div className="mt-4">
                <MatchActions
                  matchId={m.id}
                  type="project"
                  status={m.status}
                  lang={lang}
                  labels={{ contact: t.contact, dismiss: t.dismiss }}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}

      {commodityMatches.map((m) => (
        <Card key={m.id} className="p-6">
          <div className="flex flex-wrap items-start gap-5">
            <ScoreBadge score={m.score} label={t.score} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/${lang}/commodities/${m.sell.slug}`}
                  className="font-bold text-navy-950 hover:text-gold-600"
                >
                  {m.sell.title}
                </Link>
                <span className="text-navy-300">×</span>
                <span className="font-semibold text-navy-700">{m.buy.title}</span>
                <Badge className="bg-navy-900 text-white">
                  {dict.commodities.navLabel}
                </Badge>
                <StatusBadge status={m.status === "NEW" ? "PENDING" : m.status === "CONTACTED" ? "IN_DISCUSSION" : "WITHDRAWN"} label={statusLabel(m.status)} />
              </div>
              <div className="mt-3 rounded-lg bg-navy-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                  {t.why}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-navy-700">{m.rationale}</p>
              </div>
              <div className="mt-4">
                <MatchActions
                  matchId={m.id}
                  type="commodity"
                  status={m.status}
                  lang={lang}
                  labels={{ contact: t.contact, dismiss: t.dismiss }}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
