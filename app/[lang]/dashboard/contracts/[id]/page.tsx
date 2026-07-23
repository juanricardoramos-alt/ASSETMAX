import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { Card, Badge } from "@/components/ui";
import { ContractDocument } from "@/components/contracts/ContractDocument";
import {
  MarkReviewedButton,
  ExportPdfButton,
} from "@/components/contracts/ContractClientBits";

export default async function ContractDetailPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const contract = await prisma.contract.findUnique({
    where: { id: params.id },
    include: {
      project: { select: { title: true, slug: true } },
      commodityListing: { select: { title: true, slug: true } },
      seller: { select: { id: true, name: true, company: true } },
      buyer: { select: { id: true, name: true, company: true } },
    },
  });
  if (!contract) notFound();

  const userId = session.user.id;
  const isSeller = contract.sellerId === userId;
  const isBuyer = contract.buyerId === userId;
  if (!isSeller && !isBuyer && session.user.role !== "ADMIN") {
    redirect(`/${lang}/dashboard/contracts`);
  }

  const t = dict.contracts;
  const myReviewDone = isSeller
    ? Boolean(contract.sellerReviewedAt)
    : isBuyer
      ? Boolean(contract.buyerReviewedAt)
      : true;
  const bothReviewed = Boolean(contract.sellerReviewedAt && contract.buyerReviewedAt);

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <Link
          href={`/${lang}/dashboard/contracts`}
          className="text-sm font-semibold text-navy-500 hover:text-navy-900"
        >
          ← {t.title}
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-950">
              {t.kinds[contract.kind as keyof typeof t.kinds]}
            </h1>
            <p className="mt-1 text-sm text-navy-500">
              {contract.project?.title ?? contract.commodityListing?.title} ·{" "}
              {t.generatedOn} {formatDate(contract.createdAt, lang)}
            </p>
          </div>
          <ExportPdfButton
            label={t.download}
            disabled={!bothReviewed}
            hint={t.downloadHint}
          />
        </div>

        {/* Review state */}
        <Card className="mt-5 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-navy-400">
            {t.parties}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              {
                role: t.seller,
                user: contract.seller,
                reviewed: contract.sellerReviewedAt,
              },
              {
                role: t.buyer,
                user: contract.buyer,
                reviewed: contract.buyerReviewedAt,
              },
            ].map((party) => (
              <div
                key={party.role}
                className="flex items-center justify-between gap-3 rounded-lg border border-navy-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-navy-950">
                    {party.user.company ?? party.user.name}
                  </p>
                  <p className="text-xs text-navy-400">{party.role}</p>
                </div>
                {party.reviewed ? (
                  <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                    ✓ {t.reviewedTag}
                  </Badge>
                ) : (
                  <Badge className="bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                    {t.waitingOther}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          {!myReviewDone && (
            <div className="mt-4">
              <MarkReviewedButton contractId={contract.id} label={t.markReviewed} />
            </div>
          )}
          {bothReviewed && (
            <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {t.bothReviewed}
            </p>
          )}
        </Card>
      </div>

      {/* The document */}
      <Card className="overflow-hidden print:border-0 print:shadow-none">
        <ContractDocument content={contract.content} />
      </Card>

      <p className="text-center text-xs text-navy-400 print:hidden">{t.disclaimer}</p>
    </div>
  );
}
