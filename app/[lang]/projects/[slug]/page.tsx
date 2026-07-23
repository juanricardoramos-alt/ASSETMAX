import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import {
  formatInvestmentRange,
  formatUsdCompact,
  formatDate,
  parseJsonArray,
  parseSpecs,
} from "@/lib/utils";
import { aiEnabled } from "@/lib/ai";
import { Gallery } from "@/components/projects/Gallery";
import { ProjectActions } from "@/components/projects/ProjectActions";
import { ProjectAssistant } from "@/components/projects/ProjectAssistant";
import { DataRoom } from "@/components/projects/DataRoom";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Badge, VerifiedBadge, PartnerBadge, Card } from "@/components/ui";
import {
  IconMapPin,
  IconEye,
  IconCheck,
  IconDoc,
  IconBuilding,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.images[0] ? [{ url: project.images[0].url }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();

  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { order: "asc" } },
      documents: true,
      owner: {
        select: {
          id: true,
          name: true,
          company: true,
          role: true,
          verifiedSeller: true,
          createdAt: true,
        },
      },
    },
  });

  const isOwner = !!session && session.user.id === project?.ownerId;
  const isAdmin = session?.user.role === "ADMIN";

  if (!project || (project.status !== "PUBLISHED" && !isOwner && !isAdmin)) {
    notFound();
  }

  // Fire-and-forget view counter (skip the owner's own visits).
  if (!isOwner) {
    prisma.project
      .update({ where: { id: project.id }, data: { views: { increment: 1 } } })
      .catch(() => {});
  }

  const highlights = parseJsonArray(project.highlights);
  const specs = parseSpecs(project.specs);
  const publicDocs = project.documents.filter((d) => !d.isConfidential);
  const confidentialDocs = project.documents.filter((d) => d.isConfidential);

  const ndaAccess =
    isOwner || isAdmin
      ? true
      : session
        ? !!(await prisma.ndaAcceptance.findUnique({
            where: {
              projectId_userId: { projectId: project.id, userId: session.user.id },
            },
          }))
        : false;

  const favorite = session
    ? !!(await prisma.favorite.findUnique({
        where: {
          userId_projectId: { userId: session.user.id, projectId: project.id },
        },
      }))
    : false;

  const similar = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: project.id },
      OR: [{ category: project.category }, { countryCode: project.countryCode }],
    },
    include: {
      images: { orderBy: { order: "asc" } },
      owner: { select: { role: true } },
    },
    orderBy: { views: "desc" },
    take: 3,
  });

  const techRows = [
    { label: dict.project.capacity, value: project.capacity },
    { label: dict.project.production, value: project.production },
    { label: dict.project.permits, value: project.permits },
    {
      label: dict.project.workforce,
      value: project.workforce ? project.workforce.toLocaleString() : null,
    },
    {
      label: dict.project.area,
      value: project.areaHectares ? `${project.areaHectares.toLocaleString()} ha` : null,
    },
    ...specs.map((s) => ({ label: s.label, value: s.value })),
  ].filter((r) => r.value);

  const finRows = [
    {
      label: dict.project.investmentRange,
      value: formatInvestmentRange(project.investmentMin, project.investmentMax),
    },
    {
      label: dict.project.revenue,
      value: project.revenue ? formatUsdCompact(project.revenue) : null,
    },
    {
      label: dict.project.ebitda,
      value: project.ebitda ? formatUsdCompact(project.ebitda) : null,
    },
  ].filter((r) => r.value);

  return (
    <div className="bg-navy-50/40 pb-20">
      {/* Header band */}
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-white/10 text-white">
              {dict.categories[project.category as keyof typeof dict.categories]}
            </Badge>
            {project.verified && <VerifiedBadge label={dict.common.verified} />}
            {project.owner.role === "PARTNER" && (
              <PartnerBadge label={dict.common.foundingPartner} />
            )}
            {project.status !== "PUBLISHED" && (
              <Badge className="bg-amber-400/20 text-amber-200">
                {dict.statuses[project.status as keyof typeof dict.statuses]}
              </Badge>
            )}
          </div>
          <h1 className="mt-3 max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {project.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-navy-200">
            <span className="flex items-center gap-1.5">
              <IconMapPin className="h-4 w-4 text-gold-400" />
              {[project.city, project.region, countryName(project.countryCode, lang)]
                .filter(Boolean)
                .join(", ")}
            </span>
            <span className="flex items-center gap-1.5">
              <IconEye className="h-4 w-4 text-gold-400" />
              {project.views.toLocaleString()} {dict.project.views}
            </span>
          </div>
        </div>
      </div>

      <div className="container-site mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div className="min-w-0 space-y-8">
          <Gallery
            images={project.images.map((i) => ({ url: i.url, alt: i.alt }))}
            title={project.title}
          />

          <Card className="p-7">
            <h2 className="text-xl font-bold text-navy-950">{dict.project.overview}</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-navy-700">
              {project.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Card>

          {highlights.length > 0 && (
            <Card className="p-7">
              <h2 className="text-xl font-bold text-navy-950">{dict.project.highlights}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-navy-700">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {techRows.length > 0 && (
            <Card className="p-7">
              <h2 className="text-xl font-bold text-navy-950">
                {dict.project.technicalSheet}
              </h2>
              <dl className="mt-4 divide-y divide-navy-100">
                {techRows.map((row) => (
                  <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-[220px_1fr]">
                    <dt className="text-sm font-semibold text-navy-500">{row.label}</dt>
                    <dd className="text-sm text-navy-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}

          {publicDocs.length > 0 && (
            <Card className="p-7">
              <h2 className="text-xl font-bold text-navy-950">
                {dict.project.publicDocuments}
              </h2>
              <ul className="mt-4 space-y-2">
                {publicDocs.map((d) => (
                  <li key={d.id}>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-navy-100 px-4 py-3 text-sm font-medium text-navy-800 transition hover:border-gold-300 hover:bg-gold-50/40"
                    >
                      <IconDoc className="h-5 w-5 shrink-0 text-navy-400" />
                      {d.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-navy-400">{dict.project.downloadNote}</p>
            </Card>
          )}

          {confidentialDocs.length > 0 && (
            <Card className="p-7">
              <h2 className="text-xl font-bold text-navy-950">{dict.project.dataRoom}</h2>
              <div className="mt-4">
                <DataRoom
                  projectId={project.id}
                  lang={lang}
                  dict={dict}
                  hasAccess={ndaAccess}
                  confidentialDocs={confidentialDocs.map((d) => ({
                    id: d.id,
                    name: d.name,
                    url: d.url,
                  }))}
                />
              </div>
            </Card>
          )}

          {project.status === "PUBLISHED" && (
            <ProjectAssistant
              projectId={project.id}
              dict={dict}
              enabled={aiEnabled()}
            />
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <Card className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
              {dict.common.investmentRange}
            </p>
            <p className="mt-1 text-3xl font-extrabold text-navy-950">
              {formatInvestmentRange(project.investmentMin, project.investmentMax)}
            </p>
            <dl className="mt-5 space-y-3 border-t border-navy-100 pt-5">
              {[
                {
                  label: dict.project.dealType,
                  value: dict.dealTypes[project.dealType as keyof typeof dict.dealTypes],
                },
                {
                  label: dict.project.stage,
                  value: dict.stages[project.stage as keyof typeof dict.stages],
                },
                ...finRows.slice(1),
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <dt className="text-sm text-navy-500">{row.label}</dt>
                  <dd className="text-sm font-bold text-navy-900">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <ProjectActions
                projectId={project.id}
                lang={lang}
                dict={dict}
                initialFavorite={favorite}
                isOwner={isOwner}
              />
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
              {dict.project.listedBy}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                <IconBuilding className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-navy-950">
                  {project.owner.company ?? project.owner.name}
                </p>
                <p className="text-xs text-navy-400">
                  {dict.project.memberSince}{" "}
                  {formatDate(project.owner.createdAt, lang)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.owner.verifiedSeller && (
                <VerifiedBadge label={dict.common.verifiedSeller} />
              )}
              {project.owner.role === "PARTNER" && (
                <PartnerBadge label={dict.common.foundingPartner} />
              )}
            </div>
          </Card>

          {project.lat != null && project.lng != null && (
            <Card className="p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
                {dict.project.location}
              </p>
              <div className="mt-3 overflow-hidden rounded-lg bg-navy-950 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <IconMapPin className="h-4 w-4 text-gold-400" />
                  {[project.city, countryName(project.countryCode, lang)]
                    .filter(Boolean)
                    .join(", ")}
                </div>
                <p className="mt-1 text-xs text-navy-300">
                  {project.lat.toFixed(3)}°, {project.lng.toFixed(3)}°
                </p>
              </div>
            </Card>
          )}
        </aside>
      </div>

      {/* Similar projects */}
      {similar.length > 0 && (
        <div className="container-site mt-16">
          <h2 className="mb-6 text-2xl font-bold text-navy-950">{dict.project.similar}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <ProjectCard key={p.id} project={p} lang={lang} dict={dict} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
