import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Logo } from "@/components/layout/Logo";

function SocialIcon({ path, label }: { path: string; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-navy-300 transition hover:border-gold-400 hover:text-gold-400"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d={path} />
      </svg>
    </a>
  );
}

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const platform = [
    { href: `/${lang}/projects`, label: dict.nav.explore },
    { href: `/${lang}/commodities`, label: dict.commodities.navLabel },
    { href: `/${lang}/mandates`, label: dict.mandates.navLabel },
    { href: `/${lang}/markets`, label: dict.markets.navLabel },
    { href: `/${lang}/how-it-works`, label: dict.nav.howItWorks },
  ];
  const resources = [
    { href: `/${lang}/insights`, label: dict.insights.navLabel },
    { href: `/${lang}/for-sellers`, label: dict.nav.forSellers },
    { href: `/${lang}/for-investors`, label: dict.nav.forInvestors },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];
  const legal = [
    { href: `/${lang}/terms`, label: dict.footer.terms },
    { href: `/${lang}/privacy`, label: dict.footer.privacy },
  ];

  return (
    <footer className="bg-navy-950 text-navy-200 print:hidden">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <Logo lang={lang} dark />
          <p className="mt-4 text-sm leading-relaxed text-navy-300">
            {dict.footer.tagline}
          </p>
          <div className="mt-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
              {dict.footerExtra.followUs}
            </p>
            <div className="flex gap-2">
              <SocialIcon
                label="LinkedIn"
                path="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 013.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.55V9h3.57v11.45z"
              />
              <SocialIcon
                label="X"
                path="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z"
              />
            </div>
          </div>
        </div>

        {[
          { title: dict.footer.platform, items: platform },
          { title: dict.footerExtra.resources, items: resources },
          { title: dict.footer.legal, items: legal },
        ].map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-navy-400">
              {col.title}
            </h3>
            <ul className="space-y-2.5">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-navy-200 transition hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-navy-400">
            {dict.footerExtra.offices}
          </h3>
          <ul className="space-y-3.5">
            {dict.aboutExtra.offices.map((office) => (
              <li key={office.city}>
                <p className="text-sm font-bold text-white">{office.city}</p>
                <p className="text-xs leading-relaxed text-navy-400">
                  {office.address}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site space-y-3 py-6">
          <div className="flex flex-col gap-2 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} VORTAMAX Global. {dict.footer.rights}
            </p>
            <p>{dict.footer.disclaimer}</p>
          </div>
          <p className="text-[10px] leading-relaxed text-navy-500">
            {dict.footerExtra.regulatory}
          </p>
        </div>
      </div>
    </footer>
  );
}
