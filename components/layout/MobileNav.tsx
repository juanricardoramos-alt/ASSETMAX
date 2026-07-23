"use client";

import Link from "next/link";
import { useState } from "react";
import { IconMenu, IconClose } from "@/components/icons";

export function MobileNav({
  links,
  authLinks,
}: {
  links: { href: string; label: string }[];
  authLinks: { href: string; label: string; highlight?: boolean }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="rounded-md p-2 text-navy-700 hover:bg-navy-50"
      >
        {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-b border-navy-100 bg-white shadow-card">
          <nav className="container-site flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-navy-800 hover:bg-navy-50"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 border-t border-navy-100" />
            {authLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={
                  l.highlight
                    ? "rounded-md bg-gold-500 px-3 py-2.5 text-center text-sm font-bold text-navy-950"
                    : "rounded-md px-3 py-2.5 text-sm font-medium text-navy-800 hover:bg-navy-50"
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
