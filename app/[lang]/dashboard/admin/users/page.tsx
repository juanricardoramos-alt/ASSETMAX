import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui";
import { UserRowControls } from "@/components/dashboard/UserRowControls";

export default async function AdminUsersPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  if (session.user.role !== "ADMIN") redirect(`/${lang}/dashboard`);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { projects: true, offers: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">
        {dict.dashboard.admin.usersTitle}
      </h1>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-navy-100 bg-navy-50/60 text-xs font-bold uppercase tracking-wider text-navy-500">
            <tr>
              <th className="px-5 py-3">{dict.common.name}</th>
              <th className="px-5 py-3">{dict.common.email}</th>
              <th className="px-5 py-3">{dict.dashboard.stats.totalProjects}</th>
              <th className="px-5 py-3">{dict.common.date}</th>
              <th className="px-5 py-3">{dict.common.role}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3">
                  <p className="font-semibold text-navy-950">{u.name}</p>
                  {u.company && <p className="text-xs text-navy-400">{u.company}</p>}
                </td>
                <td className="px-5 py-3 text-navy-600">{u.email}</td>
                <td className="px-5 py-3 text-navy-600">
                  {u._count.projects} / {u._count.offers}
                </td>
                <td className="px-5 py-3 text-navy-500">
                  {formatDate(u.createdAt, lang)}
                </td>
                <td className="px-5 py-3">
                  <UserRowControls
                    userId={u.id}
                    currentRole={u.role}
                    verifiedSeller={u.verifiedSeller}
                    isSelf={u.id === session.user.id}
                    roleLabels={dict.roles as unknown as Record<string, string>}
                    verifiedLabel={dict.dashboard.admin.verifiedSellerToggle}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
