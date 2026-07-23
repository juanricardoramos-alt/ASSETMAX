import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui";
import { IconMessage } from "@/components/icons";

export default async function MessagesPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const isAdmin = session.user.role === "ADMIN";
  const threads = await prisma.thread.findMany({
    where: isAdmin
      ? {}
      : {
          OR: [{ investorId: session.user.id }, { sellerId: session.user.id }],
        },
    include: {
      project: { select: { title: true, slug: true } },
      investor: { select: { name: true, company: true } },
      seller: { select: { name: true, company: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">
        {dict.dashboard.messages}
      </h1>

      {threads.length === 0 ? (
        <Card className="p-12 text-center text-navy-500">
          {dict.dashboard.emptyMessages}
        </Card>
      ) : (
        <div className="space-y-3">
          {threads.map((t) => {
            const counterpart =
              t.investorId === session.user.id ? t.seller : t.investor;
            const last = t.messages[0];
            return (
              <Link key={t.id} href={`/${lang}/dashboard/messages/${t.id}`}>
                <Card className="mb-3 flex items-center gap-4 p-5 transition hover:border-gold-300 hover:shadow-card-hover">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                    <IconMessage className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-bold text-navy-950">{t.subject}</p>
                      <p className="shrink-0 text-xs text-navy-400">
                        {formatDate(t.lastMessageAt, lang)}
                      </p>
                    </div>
                    <p className="truncate text-xs font-medium text-navy-500">
                      {counterpart.company ?? counterpart.name}
                    </p>
                    {last && (
                      <p className="mt-0.5 truncate text-sm text-navy-400">{last.body}</p>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
