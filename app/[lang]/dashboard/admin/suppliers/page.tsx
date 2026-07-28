import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { parseJsonArray } from "@/lib/utils";
import { SupplierReviewActions } from "@/components/dashboard/SupplierReviewActions";
import { SupplierFeatureToggle } from "@/components/dashboard/SupplierFeatureToggle";
import { CompanyMonogram } from "@/components/company/CompanyMonogram";
import { Badge, Card, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminSuppliersPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (session.user.role !== "ADMIN") redirect(`/${lang}/dashboard`);

  const suppliers = await prisma.supplierProfile.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });

  const pending = suppliers.filter((s) => s.status === "IN_REVIEW");
  const others = suppliers.filter((s) => s.status !== "IN_REVIEW");

  const t = dict.suppliers.admin;

  function SupplierRow({
    s,
    showActions,
  }: {
    s: (typeof suppliers)[number];
    showActions: boolean;
  }) {
    const certifications = parseJsonArray(s.certifications);
    return (
      <Card className="flex flex-wrap items-start justify-between gap-4 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <CompanyMonogram name={s.name} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {s.status === "PUBLISHED" ? (
                <Link
                  href={`/${lang}/suppliers/${s.slug}`}
                  className="font-bold text-navy-950 hover:text-gold-600"
                >
                  {s.name}
                </Link>
              ) : (
                <span className="font-bold text-navy-950">{s.name}</span>
              )}
              <StatusBadge
                status={s.status}
                label={
                  dict.statuses[s.status as keyof typeof dict.statuses] ??
                  s.status
                }
              />
            </div>
            <p className="mt-0.5 text-xs text-navy-500">
              {dict.supplierCategories[
                s.category as keyof typeof dict.supplierCategories
              ] ?? s.category}{" "}
              · {countryName(s.countryCode, lang)}
            </p>
            <p className="mt-0.5 text-xs text-navy-400">
              {s.user.name} ({s.user.email})
            </p>
            <p className="mt-2 line-clamp-2 max-w-xl text-sm text-navy-600">
              {s.description}
            </p>
            {certifications.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {certifications.slice(0, 5).map((c) => (
                  <Badge
                    key={c}
                    className="bg-navy-50 text-navy-600 ring-1 ring-navy-200"
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {s.status === "PUBLISHED" && (
            <SupplierFeatureToggle
              supplierId={s.id}
              featured={s.featured}
              label={dict.suppliers.featuredBadge}
            />
          )}
          {showActions && (
            <SupplierReviewActions
              supplierId={s.id}
              labels={{
                approve: t.approve,
                reject: t.reject,
                rejectReason: t.rejectReason,
              }}
            />
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950">
          {t.title}
        </h1>
        <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy-900">
          {t.pendingTitle} ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="rounded-xl border border-dashed border-navy-200 bg-white p-10 text-center text-navy-500">
            {t.queueEmpty}
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((s) => (
              <SupplierRow key={s.id} s={s} showActions />
            ))}
          </div>
        )}
      </section>

      {others.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy-900">
            {t.othersTitle} ({others.length})
          </h2>
          <div className="space-y-4">
            {others.map((s) => (
              <SupplierRow key={s.id} s={s} showActions={s.status === "REJECTED"} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
