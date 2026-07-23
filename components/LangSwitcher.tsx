"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { IconGlobe } from "@/components/icons";

export function LangSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() ?? `/${current}`;

  const pathFor = (locale: Locale) => {
    const parts = pathname.split("/");
    parts[1] = locale;
    return parts.join("/") || `/${locale}`;
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-navy-200 p-0.5">
      <IconGlobe className="ml-1.5 hidden h-4 w-4 text-navy-400 sm:block" />
      {locales.map((locale) => (
        <Link
          key={locale}
          href={pathFor(locale)}
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-bold uppercase transition",
            locale === current
              ? "bg-navy-900 text-white"
              : "text-navy-500 hover:text-navy-900"
          )}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
