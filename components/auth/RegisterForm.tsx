"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { COUNTRIES } from "@/lib/constants";
import { Button, Input, Label, Card, Select } from "@/components/ui";

export function RegisterForm({
  lang,
  dict,
  googleEnabled,
}: {
  lang: string;
  dict: Dictionary;
  googleEnabled: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      password: fd.get("password"),
      role: fd.get("role"),
      company: fd.get("company"),
      country: fd.get("country"),
    };
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 409) {
      setBusy(false);
      setError(dict.auth.errorExists);
      return;
    }
    if (!res.ok) {
      setBusy(false);
      setError(dict.auth.errorGeneric);
      return;
    }

    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });
    router.push(`/${lang}/dashboard`);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md p-8">
      <h1 className="text-2xl font-extrabold text-navy-950">{dict.auth.registerTitle}</h1>
      <p className="mt-1 text-sm text-navy-500">{dict.auth.registerSubtitle}</p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div>
          <Label htmlFor="rg-role">{dict.auth.iAmLabel}</Label>
          <Select id="rg-role" name="role" required defaultValue="INVESTOR">
            <option value="INVESTOR">{dict.auth.roleInvestor}</option>
            <option value="SELLER">{dict.auth.roleSeller}</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="rg-name">{dict.auth.fullName}</Label>
          <Input id="rg-name" name="name" required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="rg-email">{dict.auth.email}</Label>
          <Input id="rg-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="rg-password">{dict.auth.password}</Label>
          <Input
            id="rg-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-navy-400">{dict.auth.passwordHint}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="rg-company">
              {dict.auth.company}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input id="rg-company" name="company" autoComplete="organization" />
          </div>
          <div>
            <Label htmlFor="rg-country">{dict.auth.countryLabel}</Label>
            <Select id="rg-country" name="country" defaultValue="">
              <option value="">—</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c[lang === "es" ? "es" : "en"]}
                </option>
              ))}
            </Select>
          </div>
        </div>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <Button type="submit" variant="gold" className="w-full" disabled={busy}>
          {busy ? dict.common.loading : dict.auth.registerCta}
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
            onClick={() => signIn("google", { callbackUrl: `/${lang}/dashboard` })}
          >
            {dict.auth.google}
          </Button>
        </>
      )}

      <p className="mt-6 text-center text-sm text-navy-500">
        {dict.auth.haveAccount}{" "}
        <Link
          href={`/${lang}/auth/signin`}
          className="font-bold text-navy-900 hover:text-gold-600"
        >
          {dict.nav.signIn}
        </Link>
      </p>
    </Card>
  );
}
