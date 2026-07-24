import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { Card, Badge } from "@/components/ui";
import { ContractDocument } from "@/components/contracts/ContractDocument";
import { PrintButton } from "@/components/templates/TemplateViewerBits";

export default async function GeneratedDocumentPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.templates;
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const doc = await prisma.generatedDocument.findUnique({
    where: { id: params.id },
    include: { createdBy: { select: { name: true } } },
  });
  if (!doc) notFound();
  if (doc.createdById !== session.user.id && session.user.role !== "ADMIN") {
    redirect(`/${lang}/dashboard`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <Link
            href={`/${lang}/contract-templates`}
            className="text-sm font-semibold text-navy-500 hover:text-navy-800"
          >
            ← {t.viewer.back}
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold text-navy-950">{doc.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-navy-500">
            <Badge className="bg-navy-100 text-navy-700">
              {t.kinds[doc.kind as keyof typeof t.kinds]?.name ?? doc.kind}
            </Badge>
            <Badge className="bg-navy-100 text-navy-700">
              {doc.language.toUpperCase()}
            </Badge>
            <span>
              {doc.partyA} · {doc.partyB}
            </span>
            <span>{formatDate(doc.createdAt, lang)}</span>
          </div>
        </div>
        <PrintButton label={t.viewer.download} />
      </div>

      <Card className="relative overflow-hidden print:border-0 print:shadow-none">
        {/* DRAFT watermark — kept on the printed/PDF output */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        >
          <span className="rotate-[-28deg] select-none text-[110px] font-extrabold tracking-[0.2em] text-navy-950/[0.05] print:text-navy-950/10">
            {doc.language === "es" ? "BORRADOR" : "DRAFT"}
          </span>
        </div>
        <ContractDocument content={doc.content} />
        <p className="border-t border-navy-100 px-6 py-4 text-center text-[11px] text-navy-400">
          {t.viewer.generatedNote} · {formatDate(doc.createdAt, lang)}
        </p>
      </Card>
    </div>
  );
}
