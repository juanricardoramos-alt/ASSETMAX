import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { parseJsonArray } from "@/lib/utils";
import {
  SupplierProfileForm,
  type SupplierFormData,
} from "@/components/suppliers/SupplierProfileForm";
import { ButtonLink, Card, StatusBadge, VerifiedBadge } from "@/components/ui";
import { IconShield } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function SupplierPanelPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (!["SUPPLIER", "ADMIN"].includes(session.user.role)) {
    redirect(`/${lang}/dashboard`);
  }

  const supplier = await prisma.supplierProfile.findUnique({
    where: { userId: session.user.id },
  });

  const t = dict.suppliers.panel;

  const initialData: SupplierFormData | undefined = supplier
    ? {
        name: supplier.name,
        description: supplier.description,
        category: supplier.category,
        countryCode: supplier.countryCode,
        city: supplier.city ?? "",
        website: supplier.website ?? "",
        employees: supplier.employees ? String(supplier.employees) : "",
        yearsActive: supplier.yearsActive ? String(supplier.yearsActive) : "",
        certifications: parseJsonArray(supplier.certifications).join("\n"),
        portfolio: parseJsonArray(supplier.portfolio).join("\n"),
        capacity: supplier.capacity ?? "",
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-950">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>
        </div>
        {supplier && supplier.status === "PUBLISHED" && (
          <ButtonLink
            href={`/${lang}/suppliers/${supplier.slug}`}
            variant="outline"
            size="sm"
          >
            {t.viewPublic}
          </ButtonLink>
        )}
      </div>

      {supplier ? (
        <>
          {/* Qualification status */}
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-navy-400">
                {t.statusTitle}
              </p>
              <StatusBadge
                status={supplier.status}
                label={
                  dict.statuses[
                    supplier.status as keyof typeof dict.statuses
                  ] ?? supplier.status
                }
              />
            </div>
            <div className="mt-3">
              {supplier.status === "PUBLISHED" ? (
                <div className="flex flex-wrap items-center gap-3">
                  <VerifiedBadge label={dict.suppliers.qualifiedBadge} />
                  <span className="text-sm font-semibold text-navy-800">
                    {t.statusApproved}
                  </span>
                </div>
              ) : supplier.status === "REJECTED" ? (
                <div className="text-sm text-navy-600">
                  <p className="font-semibold text-red-700">
                    {t.statusRejected}
                    {supplier.rejectionReason
                      ? ` — ${supplier.rejectionReason}`
                      : ""}
                  </p>
                  <p className="mt-1">{t.resubmitHint}</p>
                </div>
              ) : (
                <span className="flex items-start gap-2 text-sm text-navy-600">
                  <IconShield className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  {t.statusPending}
                </span>
              )}
            </div>
          </Card>

          {supplier.status === "PUBLISHED" && (
            <ButtonLink href={`/${lang}/needs`} variant="gold">
              {dict.suppliers.openNeedsCta}
            </ButtonLink>
          )}

          {/* Edit form */}
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy-900">
              {t.editTitle}
            </h2>
            <SupplierProfileForm
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
            <h2 className="text-lg font-bold text-navy-950">{t.createTitle}</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-navy-600">
              {t.createText}
            </p>
          </Card>
          <SupplierProfileForm lang={lang} dict={dict} exists={false} />
        </>
      )}
    </div>
  );
}
