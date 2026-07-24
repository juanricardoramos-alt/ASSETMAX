"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { Button, Input, Label, Card } from "@/components/ui";

export function SignInForm({
  lang,
  dict,
  googleEnabled,
}: {
  lang: string;
  dict: Dictionary;
  googleEnabled: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params?.get("callbackUrl") || `/${lang}/dashboard`;
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });
    setBusy(false);
    if (res?.ok) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setError(true);
    }
  }

  return (
    <Card className="w-full max-w-md p-8">
      <h1 className="text-2xl font-extrabold text-navy-950">{dict.auth.signInTitle}</h1>
      <p className="mt-1 text-sm text-navy-500">{dict.auth.signInSubtitle}</p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div>
          <Label htmlFor="si-email">{dict.auth.email}</Label>
          <Input id="si-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="si-password">{dict.auth.password}</Label>
          <Input
            id="si-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm font-medium text-red-600">{dict.auth.errorInvalid}</p>}
        <Button type="submit" variant="primary" className="w-full" disabled={busy}>
          {busy ? dict.common.loading : dict.auth.signInCta}
        </Button>
      </form>

      {googleEnabled && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-navy-400">
            <span className="h-px flex-1 bg-navy-100" />
            {dict.auth.orContinueWith}
            <span className="h-px flex-1 bg-navy-100" />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl })}
          >
            {dict.auth.google}
          </Button>
        </>
      )}

      <p className="mt-6 text-center text-sm text-navy-500">
        {dict.auth.noAccount}{" "}
        <Link
          href={`/${lang}/auth/register`}
          className="font-bold text-navy-900 hover:text-gold-600"
        >
          {dict.nav.register}
        </Link>
      </p>

      <div className="mt-7 rounded-lg bg-navy-50 p-4 text-xs text-navy-600">
        <p className="font-bold uppercase tracking-wider text-navy-500">
          {dict.auth.demoAccounts}
        </p>
        <p className="mt-1.5">{dict.auth.demoHint}</p>
        <ul className="mt-2 space-y-1 font-mono text-[11px]">
          <li>admin@vortamax.global</li>
          <li>partner@vortamax.global</li>
          <li>seller@vortamax.global</li>
          <li>investor@vortamax.global</li>
        </ul>
      </div>
    </Card>
  );
}
