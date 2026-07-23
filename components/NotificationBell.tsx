import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { IconBell } from "@/components/icons";

export async function NotificationBell({
  userId,
  lang,
}: {
  userId: string;
  lang: string;
}) {
  const unread = await prisma.notification.count({
    where: { userId, readAt: null },
  });

  return (
    <Link
      href={`/${lang}/dashboard/notifications`}
      className="relative rounded-md p-2 text-navy-600 transition hover:bg-navy-50 hover:text-navy-950"
      aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
    >
      <IconBell className="h-5 w-5" />
      {unread > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-navy-950">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
