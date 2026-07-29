import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { Card, Badge } from "@/components/ui";

export default async function AdminGeneratedDocumentsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.templates;
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (session.user.role !== "ADMIN") redirect(`/${lang}/dashboard`);

  const docs = await prisma.generatedDocument.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true, email: true } } },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">{t.adminTitle}</h1>

      {docs.length === 0 ? (
        <Card className="p-12 text-center text-navy-500">{t.adminEmpty}</Card>
      ) : (
        <Card className="divide-y divide-navy-100">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/${lang}/dashboard/templates/${doc.id}`}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-navy-50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-navy-950">{doc.title}</p>
                <p className="mt-0.5 text-xs text-navy-500">
                  {doc.partyA} · {doc.partyB} — {doc.createdBy.name} ({doc.createdBy.email})
                </p>
              </div>
              <Badge className="bg-navy-100 text-navy-700">{doc.language.toUpperCase()}</Badge>
              <span className="whitespace-nowrap text-xs text-navy-400">
                {formatDate(doc.createdAt, lang)}
              </span>
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
