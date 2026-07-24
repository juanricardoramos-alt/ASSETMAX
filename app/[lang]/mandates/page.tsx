import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { localizedAll } from "@/lib/l10n";
import { MandateCard } from "@/components/mandates/MandateCard";
import { ButtonLink } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.mandates.title, description: dict.mandates.subtitle };
}

export default async function MandatesPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);

  const mandates = localizedAll(
    await prisma.mandate.findMany({
      where: { status: "PUBLISHED", isPublic: true },
      include: { investor: { select: { name: true, company: true } } },
      orderBy: { createdAt: "desc" },
    }),
    lang
  );

  return (
    <div className="bg-navy-50/40">
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site flex flex-wrap items-end justify-between gap-6 py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {dict.mandates.title}
            </h1>
            <p className="mt-2 text-navy-200">{dict.mandates.subtitle}</p>
          </div>
          <ButtonLink
            href={`/${lang}/dashboard/mandates/new`}
            variant="gold"
            size="lg"
          >
            {dict.mandates.postCta}
            <IconArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>

      <div className="container-site py-10">
        {mandates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-navy-200 bg-white p-16 text-center text-navy-500">
            {dict.mandates.emptyExplorer}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {mandates.map((m) => (
              <MandateCard key={m.id} mandate={m} lang={lang} dict={dict} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
