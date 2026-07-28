import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import {
  LoggedDocButton,
  RequestAccessButton,
  RequestDecisionButtons,
} from "@/components/dataroom/DataRoomActions";
import { Card, StatusBadge } from "@/components/ui";
import { IconDoc, IconLock } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function DataRoomPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  const t = dict.dataroom;
  const userId = session.user.id;

  const [ownRequests, ownerRequests, ownerLogs, browseProjects] =
    await Promise.all([
      // My requests as a counterparty (with docs for granted rooms).
      prisma.dataRoomRequest.findMany({
        where: { userId },
        include: {
          project: {
            select: {
              id: true,
              slug: true,
              title: true,
              documents: { where: { isConfidential: true } },
              owner: { select: { name: true, company: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      // Requests on my projects, as the owner.
      prisma.dataRoomRequest.findMany({
        where: { project: { ownerId: userId } },
        include: {
          user: { select: { name: true, company: true, role: true } },
          project: { select: { title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      // Audit trail on my projects.
      prisma.dataRoomLog.findMany({
        where: { project: { ownerId: userId } },
        include: {
          user: { select: { name: true, company: true } },
          project: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      // Rooms available to request.
      prisma.project.findMany({
        where: {
          status: "PUBLISHED",
          ownerId: { not: userId },
          documents: { some: { isConfidential: true } },
          dataRoomRequests: { none: { userId } },
        },
        select: {
          id: true,
          slug: true,
          title: true,
          country: true,
          owner: { select: { company: true, name: true } },
          _count: { select: { documents: { where: { isConfidential: true } } } },
        },
        orderBy: { views: "desc" },
        take: 12,
      }),
    ]);

  const pending = ownerRequests.filter((r) => r.status === "REQUESTED");
  const decided = ownerRequests.filter((r) => r.status !== "REQUESTED");
  const isOwnerSide = ownerRequests.length > 0 || ownerLogs.length > 0;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950">
          {t.title}
        </h1>
        <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>
      </div>

      {/* ---------------------------------------------------- Owner side */}
      {isOwnerSide && (
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
            {t.ownerTitle}
          </h2>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-400">
              {t.pendingTitle} ({pending.length})
            </h3>
            {pending.length === 0 ? (
              <p className="rounded-lg border border-dashed border-navy-200 bg-white p-6 text-center text-sm text-navy-500">
                {t.noPending}
              </p>
            ) : (
              <div className="space-y-3">
                {pending.map((r) => (
                  <Card
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-navy-950">
                        {r.user.name}
                        {r.user.company && (
                          <span className="font-medium text-navy-500">
                            {" "}
                            · {r.user.company}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-navy-500">
                        {dict.roles[r.user.role as keyof typeof dict.roles] ??
                          r.user.role}{" "}
                        · {r.project.title} · {t.requestedOn}{" "}
                        {formatDate(r.createdAt, lang)}
                      </p>
                      {r.message && (
                        <p className="mt-1 text-xs italic text-navy-500">
                          “{r.message}”
                        </p>
                      )}
                    </div>
                    <RequestDecisionButtons
                      requestId={r.id}
                      labels={{ grant: t.grant, deny: t.deny }}
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-400">
              {t.grantedTitle}
            </h3>
            {decided.length === 0 ? (
              <p className="rounded-lg border border-dashed border-navy-200 bg-white p-6 text-center text-sm text-navy-500">
                {t.noGranted}
              </p>
            ) : (
              <div className="space-y-2">
                {decided.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-navy-100 bg-white px-4 py-2.5"
                  >
                    <p className="min-w-0 truncate text-sm text-navy-700">
                      <span className="font-semibold text-navy-950">
                        {r.user.name}
                      </span>
                      {r.user.company && ` · ${r.user.company}`} —{" "}
                      {r.project.title}
                    </p>
                    <div className="flex items-center gap-3">
                      {r.decidedAt && (
                        <span className="text-xs text-navy-400">
                          {t.decidedOn} {formatDate(r.decidedAt, lang)}
                        </span>
                      )}
                      <StatusBadge
                        status={r.status}
                        label={
                          t.statuses[r.status as keyof typeof t.statuses] ??
                          r.status
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-400">
              {t.logTitle}
            </h3>
            {ownerLogs.length === 0 ? (
              <p className="rounded-lg border border-dashed border-navy-200 bg-white p-6 text-center text-sm text-navy-500">
                {t.logEmpty}
              </p>
            ) : (
              <Card className="divide-y divide-navy-100">
                {ownerLogs.map((l) => (
                  <div
                    key={l.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm"
                  >
                    <p className="min-w-0 truncate text-navy-700">
                      <span className="font-semibold text-navy-950">
                        {l.user.name}
                      </span>
                      {l.user.company && ` (${l.user.company})`} {t.openedDoc}{" "}
                      <span className="font-medium">“{l.documentName}”</span> —{" "}
                      {l.project.title}
                    </p>
                    <span className="shrink-0 text-xs tabular-nums text-navy-400">
                      {formatDate(l.createdAt, lang)}
                    </span>
                  </div>
                ))}
              </Card>
            )}
          </div>
        </section>
      )}

      {/* ---------------------------------------------- Counterparty side */}
      <section className="space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
          {t.myRequestsTitle}
        </h2>
        {ownRequests.length === 0 ? (
          <p className="rounded-lg border border-dashed border-navy-200 bg-white p-6 text-center text-sm text-navy-500">
            {t.noRequests}
          </p>
        ) : (
          <div className="space-y-3">
            {ownRequests.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/${lang}/projects/${r.project.slug}`}
                      className="font-bold text-navy-950 hover:text-gold-600"
                    >
                      {r.project.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-navy-500">
                      {r.project.owner.company ?? r.project.owner.name} ·{" "}
                      {t.requestedOn} {formatDate(r.createdAt, lang)}
                    </p>
                  </div>
                  <StatusBadge
                    status={r.status}
                    label={
                      t.statuses[r.status as keyof typeof t.statuses] ??
                      r.status
                    }
                  />
                </div>

                {r.status === "GRANTED" && (
                  <div className="mt-3 rounded-lg bg-navy-50/60 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
                      {t.documentsTitle} · {t.mockNote}
                    </p>
                    <ul className="mt-1.5 divide-y divide-navy-100">
                      {r.project.documents.map((d) => (
                        <li
                          key={d.id}
                          className="flex items-center justify-between gap-3 py-1.5"
                        >
                          <span className="flex min-w-0 items-center gap-2 text-sm text-navy-700">
                            <IconDoc className="h-4 w-4 shrink-0 text-gold-500" />
                            <span className="truncate">{d.name}</span>
                          </span>
                          <LoggedDocButton
                            projectId={r.project.id}
                            documentName={d.name}
                            url={d.url}
                            label={t.viewDoc}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Browse rooms to request */}
        {browseProjects.length > 0 && (
          <div>
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-navy-400">
              {t.browseTitle}
            </h3>
            <p className="mb-3 text-xs text-navy-500">{t.browseHint}</p>
            <Card className="divide-y divide-navy-100">
              {browseProjects.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/${lang}/projects/${p.slug}`}
                      className="text-sm font-bold text-navy-950 hover:text-gold-600"
                    >
                      {p.title}
                    </Link>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-navy-500">
                      <IconLock className="h-3.5 w-3.5 text-navy-400" />
                      {p.owner.company ?? p.owner.name} · {p.country} ·{" "}
                      {p._count.documents} {t.docsCount}
                    </p>
                  </div>
                  <RequestAccessButton
                    projectId={p.id}
                    labels={{ request: t.requestCta, requesting: t.requesting }}
                  />
                </div>
              ))}
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}
