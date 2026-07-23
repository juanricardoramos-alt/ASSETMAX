import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatDate, cn } from "@/lib/utils";
import { Card } from "@/components/ui";
import { MarkAllReadButton } from "@/components/MarkAllReadButton";
import {
  IconHandshake,
  IconMessage,
  IconShield,
  IconDoc,
  IconBell,
} from "@/components/icons";

const TYPE_ICONS: Record<string, typeof IconBell> = {
  MATCH: IconHandshake,
  OFFER: IconHandshake,
  MESSAGE: IconMessage,
  CONTRACT: IconDoc,
  REVIEW: IconShield,
};

export default async function NotificationsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  const localizeHref = (href: string | null) =>
    href ? href.replace(/^\/en\//, `/${lang}/`) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-navy-950">
          {dict.notifications.title}
        </h1>
        {notifications.some((n) => !n.readAt) && (
          <MarkAllReadButton label={dict.notifications.markAll} />
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center text-navy-500">
          {dict.notifications.empty}
        </Card>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type] ?? IconBell;
            const href = localizeHref(n.href);
            const inner = (
              <Card
                className={cn(
                  "flex items-start gap-4 p-4 transition",
                  !n.readAt && "border-gold-300 bg-gold-50/40",
                  href && "hover:border-gold-400 hover:shadow-card-hover"
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-navy-950">{n.title}</p>
                    <p className="shrink-0 text-xs text-navy-400">
                      {formatDate(n.createdAt, lang)}
                    </p>
                  </div>
                  {n.body && (
                    <p className="mt-0.5 text-sm leading-relaxed text-navy-600">
                      {n.body}
                    </p>
                  )}
                </div>
              </Card>
            );
            return href ? (
              <Link key={n.id} href={href} className="block">
                {inner}
              </Link>
            ) : (
              <div key={n.id}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
