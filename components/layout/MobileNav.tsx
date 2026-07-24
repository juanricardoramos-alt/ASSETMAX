"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { IconMenu, IconClose } from "@/components/icons";

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  solutions,
  aboutLink,
  authLinks,
}: {
  links: NavLink[];
  solutions: { label: string; items: (NavLink & { desc: string })[] };
  aboutLink: NavLink;
  authLinks: (NavLink & { highlight?: boolean })[];
}) {
  const [open, setOpen] = useState(false);

  // Lock page scroll while the menu is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const itemClass =
    "whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium text-navy-800 transition hover:bg-navy-50 active:bg-navy-100";

  return (
    <div className="xl:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="rounded-md p-2 text-navy-700 transition hover:bg-navy-50 active:bg-navy-100"
      >
        <span className="relative block h-6 w-6">
          <IconMenu
            className={cn(
              "absolute inset-0 h-6 w-6 transition-all duration-200",
              open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            )}
          />
          <IconClose
            className={cn(
              "absolute inset-0 h-6 w-6 transition-all duration-200",
              open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            )}
          />
        </span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-40 bg-navy-950/30 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Sliding panel */}
      <div
        className={cn(
          "absolute inset-x-0 top-full z-50 origin-top border-b border-navy-100 bg-white shadow-card-hover transition-all duration-300 ease-out",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        )}
      >
        <nav className="container-site flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto py-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={itemClass}>
              {l.label}
            </Link>
          ))}

          <p className="mt-2 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-navy-400">
            {solutions.label}
          </p>
          {solutions.items.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 transition hover:bg-navy-50 active:bg-navy-100"
            >
              <span className="block text-sm font-medium text-navy-800">{l.label}</span>
              <span className="mt-0.5 block text-xs text-navy-500">{l.desc}</span>
            </Link>
          ))}

          <div className="my-1 border-t border-navy-100" />
          <Link
            href={aboutLink.href}
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            {aboutLink.label}
          </Link>

          <div className="my-2 border-t border-navy-100" />
          {authLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={
                l.highlight
                  ? "whitespace-nowrap rounded-md bg-gold-500 px-3 py-2.5 text-center text-sm font-bold text-navy-950 transition hover:bg-gold-400"
                  : itemClass
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
