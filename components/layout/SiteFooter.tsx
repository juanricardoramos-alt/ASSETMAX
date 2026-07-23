import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Logo } from "@/components/layout/Logo";

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const platform = [
    { href: `/${lang}/projects`, label: dict.nav.explore },
    { href: `/${lang}/for-sellers`, label: dict.nav.forSellers },
    { href: `/${lang}/for-investors`, label: dict.nav.forInvestors },
    { href: `/${lang}/how-it-works`, label: dict.nav.howItWorks },
  ];
  const company = [
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];
  const legal = [
    { href: `/${lang}/terms`, label: dict.footer.terms },
    { href: `/${lang}/privacy`, label: dict.footer.privacy },
  ];

  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="container-site grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo lang={lang} dark />
          <p className="mt-4 text-sm leading-relaxed text-navy-300">
            {dict.footer.tagline}
          </p>
        </div>
        {[
          { title: dict.footer.platform, items: platform },
          { title: dict.footer.company, items: company },
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
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} ASSETMAX Global. {dict.footer.rights}
          </p>
          <p className="max-w-xl">{dict.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
