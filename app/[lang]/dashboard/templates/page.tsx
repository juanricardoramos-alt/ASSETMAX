import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { Card, Badge, ButtonLink } from "@/components/ui";
import { IconDoc } from "@/components/icons";

export default async function MyGeneratedDocumentsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.templates;
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const docs = await prisma.generatedDocument.findMany({
    where: { createdById: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-navy-950">{t.myTitle}</h1>
        <ButtonLink href={`/${lang}/contract-templates`} variant="gold" size="sm">
          + {t.newCta}
        </ButtonLink>
      </div>

      {docs.length === 0 ? (
        <Card className="p-12 text-center text-navy-500">{t.empty}</Card>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/${lang}/dashboard/templates/${doc.id}`}
              className="flex items-center gap-4 rounded-xl border border-navy-100 bg-white p-5 shadow-card transition hover:border-gold-300 hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                <IconDoc className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-navy-950">{doc.title}</p>
                <p className="mt-0.5 text-xs text-navy-500">
                  {doc.partyA} · {doc.partyB} · {formatDate(doc.createdAt, lang)}
                </p>
              </div>
              <Badge className="bg-navy-100 text-navy-700">{doc.language.toUpperCase()}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
