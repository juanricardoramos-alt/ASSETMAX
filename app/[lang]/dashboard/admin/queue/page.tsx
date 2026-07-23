import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { countryName } from "@/lib/constants";
import { formatInvestmentRange, formatDate } from "@/lib/utils";
import { Card, Badge } from "@/components/ui";
import { ReviewActions } from "@/components/dashboard/ReviewActions";

export default async function AdminQueuePage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (session.user.role !== "ADMIN") redirect(`/${lang}/dashboard`);

  const queue = await prisma.project.findMany({
    where: { status: "IN_REVIEW" },
    include: { owner: { select: { name: true, company: true, email: true } } },
    orderBy: { updatedAt: "asc" },
  });

  const t = dict.dashboard.admin;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">{t.queueTitle}</h1>

      {queue.length === 0 ? (
        <Card className="p-12 text-center text-navy-500">{t.queueEmpty}</Card>
      ) : (
        <div className="space-y-4">
          {queue.map((p) => (
            <Card key={p.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-navy-950">{p.title}</h2>
                    <Badge className="bg-navy-100 text-navy-600">
                      {dict.categories[p.category as keyof typeof dict.categories]}
                    </Badge>
                    <Badge className="bg-navy-100 text-navy-600">
                      {countryName(p.countryCode, lang)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-navy-400">
                    {p.owner.company ?? p.owner.name} · {p.owner.email} ·{" "}
                    {formatDate(p.updatedAt, lang)} ·{" "}
                    {formatInvestmentRange(p.investmentMin, p.investmentMax)}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-600">
                    {p.summary}
                  </p>
                </div>
                <ReviewActions
                  projectId={p.id}
                  labels={{
                    approve: t.approve,
                    reject: t.reject,
                    reason: t.rejectReason,
                    confirm: t.rejectConfirm,
                    cancel: dict.common.cancel,
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
