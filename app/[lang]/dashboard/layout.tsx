import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.nav.dashboard };
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const role = session.user.role;
  const base = `/${lang}/dashboard`;

  const items: { href: string; label: string }[] = [
    { href: base, label: dict.dashboard.overview },
  ];
  if (["SELLER", "PARTNER", "ADMIN"].includes(role)) {
    items.push({ href: `${base}/projects`, label: dict.dashboard.myProjects });
    items.push({ href: `${base}/offers`, label: dict.dashboard.offersReceived });
  }
  if (role === "INVESTOR") {
    items.push({ href: `${base}/favorites`, label: dict.dashboard.favorites });
    items.push({ href: `${base}/mandates`, label: dict.mandates.myMandates });
    items.push({ href: `${base}/offers`, label: dict.dashboard.offersSent });
    items.push({ href: `${base}/alerts`, label: dict.dashboard.alerts });
  }
  items.push({ href: `${base}/commodities`, label: dict.commodities.navLabel });
  items.push({ href: `${base}/matches`, label: dict.matches.title });
  items.push({ href: `${base}/contracts`, label: dict.contracts.title });
  items.push({ href: `${base}/templates`, label: dict.templates.navLabel });
  items.push({ href: `${base}/messages`, label: dict.dashboard.messages });
  if (role === "PARTNER" || role === "ADMIN") {
    items.push({ href: `${base}/partner`, label: dict.dashboard.partnerPanel });
  }
  if (role === "ADMIN") {
    items.push({ href: `${base}/admin`, label: dict.dashboard.adminPanel });
  }

  return (
    <div className="bg-navy-50/50">
      <div className="container-site grid grid-cols-1 gap-8 py-10 lg:grid-cols-[230px_1fr]">
        <aside className="min-w-0">
          <div className="rounded-xl border border-navy-100 bg-white p-3 shadow-card lg:sticky lg:top-24">
            <div className="border-b border-navy-100 px-3 pb-3 pt-1">
              <p className="truncate text-sm font-bold text-navy-950">
                {session.user.name}
              </p>
              <p className="text-xs font-medium text-gold-600">
                {dict.roles[role as keyof typeof dict.roles]}
              </p>
            </div>
            <nav className="mt-2 flex gap-1 overflow-x-auto lg:flex-col">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-50 hover:text-navy-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
