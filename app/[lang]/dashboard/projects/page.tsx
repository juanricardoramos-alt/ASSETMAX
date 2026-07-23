import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { Card, StatusBadge, ButtonLink } from "@/components/ui";
import { ProjectRowActions } from "@/components/dashboard/ProjectRowActions";

export default async function MyProjectsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (!["SELLER", "PARTNER", "ADMIN"].includes(session.user.role)) {
    redirect(`/${lang}/dashboard`);
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { offers: true, favorites: true } } },
  });

  const t = dict.dashboard;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-navy-950">{t.myProjects}</h1>
        <ButtonLink href={`/${lang}/dashboard/projects/new`} variant="gold" size="sm">
          + {t.newProject}
        </ButtonLink>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-navy-500">{t.emptyProjects}</p>
          <ButtonLink
            href={`/${lang}/dashboard/projects/new`}
            variant="primary"
            className="mt-5"
          >
            {t.emptyProjectsCta}
          </ButtonLink>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-navy-950">{p.title}</h2>
                    <StatusBadge
                      status={p.status}
                      label={dict.statuses[p.status as keyof typeof dict.statuses]}
                    />
                  </div>
                  <p className="mt-1 text-xs text-navy-400">
                    {p.views.toLocaleString()} {t.viewsLabel} · {p._count.offers}{" "}
                    {t.offersLabel} · {p._count.favorites} ♥
                  </p>
                  {p.status === "REJECTED" && p.rejectionReason && (
                    <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                      {p.rejectionReason}
                    </p>
                  )}
                </div>
                <ProjectRowActions
                  projectId={p.id}
                  slug={p.slug}
                  status={p.status}
                  lang={lang}
                  labels={{
                    view: dict.common.view,
                    edit: dict.common.edit,
                    del: dict.common.delete,
                  }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
