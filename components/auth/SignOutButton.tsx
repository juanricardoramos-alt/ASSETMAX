"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({ label, lang }: { label: string; lang: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: `/${lang}` })}
      className="rounded-md px-3 py-1.5 text-xs font-semibold text-navy-500 transition hover:bg-navy-50 hover:text-navy-900"
    >
      {label}
    </button>
  );
}
