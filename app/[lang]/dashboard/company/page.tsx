import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import {
  CompanyProfileForm,
  type CompanyFormData,
} from "@/components/company/CompanyProfileForm";
import { AnchorBadge, ButtonLink, Card, VerifiedBadge } from "@/components/ui";
import { StatCard } from "@/components/dashboard/StatCard";
import { IconShield } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function CompanyPanelPage({
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

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.user.id },
  });

  const [published, inReview] = company
    ? await Promise.all([
        prisma.project.count({
          where: { ownerId: session.user.id, status: "PUBLISHED" },
        }),
        prisma.project.count({
          where: { ownerId: session.user.id, status: "IN_REVIEW" },
        }),
      ])
    : [0, 0];

  const initialData: CompanyFormData | undefined = company
    ? {
        name: company.name,
        legalName: company.legalName ?? "",
        description: company.description,
        sector: company.sector,
        countryCode: company.countryCode,
        city: company.city ?? "",
        website: company.website ?? "",
        founded: company.founded ? String(company.founded) : "",
        employees: company.employees ? String(company.employees) : "",
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-950">
            {dict.companies.panel.title}
          </h1>
          <p className="mt-1 text-sm text-navy-500">
            {dict.companies.panel.subtitle}
          </p>
        </div>
        {company && (
          <ButtonLink
            href={`/${lang}/companies/${company.slug}`}
            variant="outline"
            size="sm"
          >
            {dict.companies.panel.viewPublic}
          </ButtonLink>
        )}
      </div>

      {company ? (
        <>
          {/* Verification status */}
          <Card className="p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-navy-400">
              {dict.companies.panel.statusTitle}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {company.verified ? (
                <>
                  <VerifiedBadge label={dict.common.verified} />
                  <span className="text-sm font-semibold text-navy-800">
                    {dict.companies.panel.statusVerified}
                  </span>
                </>
              ) : (
                <span className="flex items-start gap-2 text-sm text-navy-600">
                  <IconShield className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  {dict.companies.panel.statusPending}
                </span>
              )}
            </div>
            {company.isAnchor && (
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-navy-100 pt-4">
                <AnchorBadge label={dict.companies.anchorBadge} />
                <span className="text-sm text-navy-600">
                  {dict.companies.panel.anchorNote}
                </span>
              </div>
            )}
          </Card>

          {/* Portfolio summary */}
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                {dict.companies.panel.portfolioTitle}
              </h2>
              <ButtonLink
                href={`/${lang}/dashboard/projects`}
                variant="ghost"
                size="sm"
              >
                {dict.companies.panel.manageProjects} →
              </ButtonLink>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                label={dict.companies.panel.projectsPublished}
                value={String(published)}
              />
              <StatCard
                label={dict.companies.panel.projectsInReview}
                value={String(inReview)}
              />
            </div>
            <p className="mt-2 text-xs text-navy-400">
              {dict.companies.panel.portfolioHint}
            </p>
          </div>

          {/* Edit form */}
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy-900">
              {dict.companies.panel.editTitle}
            </h2>
            <CompanyProfileForm
              lang={lang}
              dict={dict}
              exists
              initialData={initialData}
            />
          </div>
        </>
      ) : (
        <>
          <Card className="border-gold-300 bg-gold-50/50 p-6">
            <h2 className="text-lg font-bold text-navy-950">
              {dict.companies.panel.createTitle}
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-navy-600">
              {dict.companies.panel.createText}
            </p>
          </Card>
          <CompanyProfileForm lang={lang} dict={dict} exists={false} />
        </>
      )}
    </div>
  );
}
