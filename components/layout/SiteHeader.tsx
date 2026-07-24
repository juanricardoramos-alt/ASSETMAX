import Link from "next/link";
import { auth } from "@/lib/auth";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Logo } from "@/components/layout/Logo";
import { LangSwitcher } from "@/components/LangSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { NotificationBell } from "@/components/NotificationBell";
import { ButtonLink } from "@/components/ui";
import { SignOutButton } from "@/components/auth/SignOutButton";
import {
  IconSearch,
  IconChevronDown,
  IconBuilding,
  IconChart,
  IconHandshake,
  IconDoc,
} from "@/components/icons";

const solutionsIcons = {
  sellers: IconBuilding,
  investors: IconChart,
  how: IconHandshake,
  templates: IconDoc,
};

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
    { href: `/${lang}/insights`, label: dict.insights.navLabel },
  ];

  const solutionsItems = [
    {
      key: "sellers" as const,
      href: `/${lang}/for-sellers`,
      label: dict.nav.forSellers,
      desc: dict.nav.solutionsMenu.sellersDesc,
    },
    {
      key: "investors" as const,
      href: `/${lang}/for-investors`,
      label: dict.nav.forInvestors,
      desc: dict.nav.solutionsMenu.investorsDesc,
    },
    {
      key: "how" as const,
      href: `/${lang}/how-it-works`,
      label: dict.nav.howItWorks,
      desc: dict.nav.solutionsMenu.howDesc,
    },
    {
      key: "templates" as const,
      href: `/${lang}/contract-templates`,
      label: dict.templates.navLabel,
      desc: dict.templates.navDesc,
    },
  ];

  const aboutLink = { href: `/${lang}/about`, label: dict.nav.about };

  const authLinks = session
    ? [{ href: `/${lang}/dashboard`, label: dict.nav.dashboard, highlight: true }]
    : [
        { href: `/${lang}/auth/signin`, label: dict.nav.signIn },
        { href: `/${lang}/auth/register`, label: dict.nav.register, highlight: true },
      ];

  const navLinkClass =
    "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-50 hover:text-navy-950";

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur print:hidden">
      <div className="container-site relative flex h-16 items-center gap-2 sm:gap-4">
        <Logo lang={lang} className="shrink-0" />

        {/* Desktop nav — collapses to the hamburger below xl so items never squeeze */}
        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={navLinkClass}>
              {l.label}
            </Link>
          ))}

          {/* Solutions dropdown — CSS-driven, keyboard accessible via focus-within */}
          <div className="group relative">
            <button
              type="button"
              aria-haspopup="true"
              className="flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-navy-700 transition group-hover:bg-navy-50 group-hover:text-navy-950 group-focus-within:bg-navy-50 group-focus-within:text-navy-950"
            >
              {dict.nav.solutions}
              <IconChevronDown className="h-3.5 w-3.5 text-navy-400 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-xl border border-navy-100 bg-white p-2 shadow-card-hover">
                {solutionsItems.map((item) => {
                  const Icon = solutionsIcons[item.key];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition hover:bg-navy-50"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-navy-950">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-navy-500">
                          {item.desc}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Link href={aboutLink.href} className={navLinkClass}>
            {aboutLink.label}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5 xl:ml-0">
          <Link
            href={`/${lang}/search`}
            aria-label={dict.search.title}
            className="rounded-md p-1.5 text-navy-600 transition hover:bg-navy-50 hover:text-navy-950 sm:p-2"
          >
            <IconSearch className="h-5 w-5" />
          </Link>
          <LangSwitcher current={lang} />
          {session && <NotificationBell userId={session.user.id} lang={lang} />}
          <div className="hidden items-center gap-3 xl:flex">
            {session ? (
              <>
                <ButtonLink
                  href={`/${lang}/dashboard`}
                  variant="gold"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {dict.nav.dashboard}
                </ButtonLink>
                <SignOutButton label={dict.nav.signOut} lang={lang} />
              </>
            ) : (
              <>
                <Link
                  href={`/${lang}/auth/signin`}
                  className="whitespace-nowrap text-sm font-semibold text-navy-700 transition hover:text-navy-950"
                >
                  {dict.nav.signIn}
                </Link>
                <ButtonLink
                  href={`/${lang}/auth/register`}
                  variant="gold"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {dict.nav.register}
                </ButtonLink>
              </>
            )}
          </div>
          <MobileNav
            links={links}
            solutions={{ label: dict.nav.solutions, items: solutionsItems }}
            aboutLink={aboutLink}
            authLinks={authLinks}
          />
        </div>
      </div>
    </header>
  );
}
