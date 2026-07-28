import Link from "next/link";
import { auth } from "@/lib/auth";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Logo } from "@/components/layout/Logo";
import { LangSwitcher } from "@/components/LangSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { NotificationBell } from "@/components/NotificationBell";
import { ButtonLink } from "@/components/ui";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { IconChevronDown, IconSearch } from "@/components/icons";

export async function SiteHeader({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const session = await auth();

  const links = [
    { href: `/${lang}/projects`, label: dict.nav.explore },
    { href: `/${lang}/commodities`, label: dict.commodities.navLabel },
    { href: `/${lang}/mandates`, label: dict.mandates.navLabel },
  ];

  // Grouped under an "Ecosystem" dropdown on desktop; flat on mobile.
  const ecosystemLinks = [
    { href: `/${lang}/needs`, label: dict.needs.navLabel },
    { href: `/${lang}/companies`, label: dict.companies.navLabel },
    { href: `/${lang}/suppliers`, label: dict.suppliers.navLabel },
  ];

  const secondaryLinks = [
    { href: `/${lang}/insights`, label: dict.insights.navLabel },
    { href: `/${lang}/for-sellers`, label: dict.nav.forSellers },
    { href: `/${lang}/for-investors`, label: dict.nav.forInvestors },
    { href: `/${lang}/about`, label: dict.nav.about },
  ];

  const authLinks = session
    ? [{ href: `/${lang}/dashboard`, label: dict.nav.dashboard, highlight: true }]
    : [
        { href: `/${lang}/auth/signin`, label: dict.nav.signIn },
        { href: `/${lang}/auth/register`, label: dict.nav.register, highlight: true },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur print:hidden">
      <div className="container-site relative flex h-16 items-center justify-between gap-2 sm:gap-4">
        <Logo lang={lang} />

        <nav className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-2.5 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-50 hover:text-navy-950"
            >
              {l.label}
            </Link>
          ))}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-50 hover:text-navy-950"
            >
              {dict.companies.ecosystemLabel}
              <IconChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute left-0 top-full z-50 pt-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="w-60 rounded-xl border border-navy-100 bg-white p-1.5 shadow-card">
                {ecosystemLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-navy-700 transition hover:bg-navy-50 hover:text-navy-950"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {secondaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-2.5 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-50 hover:text-navy-950"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <Link
            href={`/${lang}/search`}
            aria-label={dict.search.title}
            className="rounded-md p-1.5 text-navy-600 transition hover:bg-navy-50 hover:text-navy-950 sm:p-2"
          >
            <IconSearch className="h-5 w-5" />
          </Link>
          <LangSwitcher current={lang} />
          {session && <NotificationBell userId={session.user.id} lang={lang} />}
          <div className="hidden items-center gap-2 lg:flex">
            {session ? (
              <>
                <ButtonLink href={`/${lang}/dashboard`} variant="gold" size="sm">
                  {dict.nav.dashboard}
                </ButtonLink>
                <SignOutButton label={dict.nav.signOut} lang={lang} />
              </>
            ) : (
              <>
                <ButtonLink href={`/${lang}/auth/signin`} variant="ghost" size="sm">
                  {dict.nav.signIn}
                </ButtonLink>
                <ButtonLink href={`/${lang}/auth/register`} variant="gold" size="sm">
                  {dict.nav.register}
                </ButtonLink>
              </>
            )}
          </div>
          <MobileNav
            links={[...links, ...ecosystemLinks, ...secondaryLinks]}
            authLinks={authLinks}
          />
        </div>
      </div>
    </header>
  );
}
