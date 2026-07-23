import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui";
import { MessageComposer } from "@/components/dashboard/MessageComposer";
import { cn } from "@/lib/utils";

export default async function ThreadPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const thread = await prisma.thread.findUnique({
    where: { id: params.id },
    include: {
      project: { select: { title: true, slug: true } },
      commodityListing: { select: { title: true, slug: true } },
      investor: { select: { id: true, name: true, company: true } },
      seller: { select: { id: true, name: true, company: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true } } },
      },
    },
  });
  if (!thread) notFound();

  const subjectHref = thread.project
    ? `/${lang}/projects/${thread.project.slug}`
    : thread.commodityListing
      ? `/${lang}/commodities/${thread.commodityListing.slug}`
      : null;

  const userId = session.user.id;
  const isParticipant =
    thread.investorId === userId || thread.sellerId === userId;
  if (!isParticipant && session.user.role !== "ADMIN") {
    redirect(`/${lang}/dashboard/messages`);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/${lang}/dashboard/messages`}
          className="text-sm font-semibold text-navy-500 hover:text-navy-900"
        >
          ← {dict.dashboard.messages}
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold text-navy-950">
          {thread.subject}
        </h1>
        {subjectHref && (
          <Link
            href={subjectHref}
            className="text-sm font-semibold text-gold-600 hover:text-gold-500"
          >
            {dict.common.viewProject} →
          </Link>
        )}
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {thread.messages.map((m) => {
            const mine = m.sender.id === userId;
            return (
              <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%]",
                    mine
                      ? "rounded-br-sm bg-navy-900 text-white"
                      : "rounded-bl-sm bg-navy-50 text-navy-900"
                  )}
                >
                  <p
                    className={cn(
                      "text-xs font-bold",
                      mine ? "text-gold-400" : "text-navy-500"
                    )}
                  >
                    {m.sender.name}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">
                    {m.body}
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-[10px]",
                      mine ? "text-navy-300" : "text-navy-400"
                    )}
                  >
                    {formatDate(m.createdAt, lang)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-navy-100 pt-5">
          <MessageComposer
            threadId={thread.id}
            placeholder={dict.project.infoForm.messagePlaceholder}
            sendLabel={dict.common.send}
          />
        </div>
      </Card>
    </div>
  );
}
