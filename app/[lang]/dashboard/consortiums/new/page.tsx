import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatInvestmentRange } from "@/lib/utils";
import { ConsortiumBuilder } from "@/components/consortiums/ConsortiumBuilder";
import { Badge, Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NewConsortiumPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { need?: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  const t = dict.consortiums;

  const leader = await prisma.supplierProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!leader || leader.status !== "PUBLISHED") {
    return (
      <Card className="border-gold-300 bg-gold-50/50 p-8 text-center">
        <p className="font-semibold text-navy-800">{t.needProfileFirst}</p>
        <Link
          href={`/${lang}/dashboard/supplier`}
          className="mt-3 inline-block text-sm font-bold text-navy-900 hover:text-gold-600"
        >
          {dict.suppliers.registerCta} →
        </Link>
      </Card>
    );
  }

  const need = searchParams.need
    ? await prisma.need.findUnique({
        where: { id: searchParams.need },
        include: { company: { select: { name: true, userId: true } } },
      })
    : null;
  if (!need || need.status !== "OPEN" || need.company.userId === session.user.id) {
    notFound();
  }

  const candidates = await prisma.supplierProfile.findMany({
    where: { status: "PUBLISHED", id: { not: leader.id } },
    select: {
      id: true,
      name: true,
      category: true,
      countryCode: true,
      city: true,
      verified: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950">
          {t.newTitle}
        </h1>
        <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>
      </div>

      {/* Need summary */}
      <Card className="flex flex-wrap items-center justify-between gap-4 border-navy-200 bg-navy-950 p-5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold-500">
            {t.forNeed} · {need.company.name}
          </p>
          <Link
            href={`/${lang}/needs/${need.slug}`}
            className="mt-0.5 block font-bold text-white hover:text-gold-400"
          >
            {need.title}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gold-500 text-navy-950">
            {dict.supplierCategories[
              need.category as keyof typeof dict.supplierCategories
            ] ?? need.category}
          </Badge>
          <span className="text-sm font-semibold text-navy-200">
            {formatInvestmentRange(need.budgetMin, need.budgetMax)}
          </span>
        </div>
      </Card>

      <ConsortiumBuilder
        lang={lang}
        dict={dict}
        needId={need.id}
        candidates={candidates}
      />
    </div>
  );
}
