"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n";
import { Button, ButtonLink, Card, Input, Label, Textarea } from "@/components/ui";
import { IconCheck, IconLock } from "@/components/icons";

export type ApplyState =
  | "closed"
  | "signedOut"
  | "noProfile"
  | "pending"
  | "canApply"
  | "applied"
  | "ownNeed";

function num(v: string): number | null {
  const n = Number(v);
  return v.trim() !== "" && Number.isFinite(n) ? n : null;
}

export function NeedApplyCard({
  lang,
  dict,
  needId,
  state,
}: {
  lang: string;
  dict: Dictionary;
  needId: string;
  state: ApplyState;
}) {
  const router = useRouter();
  const t = dict.needs.applyCard;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  if (state === "ownNeed") return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const res = await fetch(`/api/needs/${needId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        proposedBudget: num(budget),
        leadTime,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError(true);
      return;
    }
    setDone(true);
    router.refresh();
  }

  const applied = state === "applied" || done;

  return (
    <Card className="p-6">
      <h2 className="text-base font-extrabold text-navy-950">{t.title}</h2>

      {applied ? (
        <div className="mt-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <IconCheck className="h-4 w-4" />
            {t.applied}
          </p>
          <p className="mt-1 text-sm text-navy-500">{t.appliedText}</p>
        </div>
      ) : state === "closed" ? (
        <p className="mt-3 flex items-start gap-2 text-sm text-navy-500">
          <IconLock className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
          {t.closed}
        </p>
      ) : state === "pending" ? (
        <p className="mt-3 text-sm leading-relaxed text-navy-600">
          {t.pendingProfile}
        </p>
      ) : state === "canApply" ? (
        open ? (
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="ap-msg">{t.message}</Label>
              <Textarea
                id="ap-msg"
                required
                minLength={20}
                maxLength={4000}
                rows={5}
                placeholder={t.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ap-budget">
                {t.proposedBudget}{" "}
                <span className="text-navy-400">({dict.common.optional})</span>
              </Label>
              <Input
                id="ap-budget"
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ap-lead">
                {t.leadTime}{" "}
                <span className="text-navy-400">({dict.common.optional})</span>
              </Label>
              <Input
                id="ap-lead"
                maxLength={200}
                placeholder={t.leadTimePlaceholder}
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-red-600">
                {dict.common.error}
              </p>
            )}
            <Button type="submit" variant="gold" className="w-full" disabled={busy}>
              {busy ? dict.common.loading : t.submit}
            </Button>
          </form>
        ) : (
          <>
            <p className="mt-2 text-sm leading-relaxed text-navy-500">{t.text}</p>
            <Button
              variant="gold"
              className="mt-4 w-full"
              onClick={() => setOpen(true)}
            >
              {t.cta}
            </Button>
            <ButtonLink
              href={`/${lang}/dashboard/consortiums/new?need=${needId}`}
              variant="outline"
              className="mt-2 w-full"
            >
              {dict.consortiums.applyCta}
            </ButtonLink>
          </>
        )
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-navy-500">{t.text}</p>
          {state === "signedOut" ? (
            <ButtonLink
              href={`/${lang}/auth/signin`}
              variant="gold"
              className="mt-4 w-full"
            >
              {t.signIn}
            </ButtonLink>
          ) : (
            <ButtonLink
              href={`/${lang}/dashboard/supplier`}
              variant="gold"
              className="mt-4 w-full"
            >
              {t.registerCta}
            </ButtonLink>
          )}
        </>
      )}
    </Card>
  );
}
