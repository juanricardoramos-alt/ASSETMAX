"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Dictionary } from "@/lib/i18n";
import { Modal } from "@/components/Modal";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { IconMessage, IconLock, IconDoc, IconShield } from "@/components/icons";

export function CommodityActions({
  listingId,
  lang,
  dict,
  isOwner,
  hasNda,
  confidentialDocs,
}: {
  listingId: string;
  lang: string;
  dict: Dictionary;
  isOwner: boolean;
  hasNda: boolean;
  confidentialDocs: { name: string; url: string }[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [modal, setModal] = useState<"interest" | "nda" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [checked, setChecked] = useState(false);

  const requireAuth = (action: () => void) => {
    if (!session) {
      router.push(
        `/${lang}/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }
    action();
  };

  async function sendInterest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/commodities/${listingId}/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: fd.get("message") }),
    });
    setBusy(false);
    if (res.ok) {
      const { threadId } = (await res.json()) as { threadId: string };
      router.push(`/${lang}/dashboard/messages/${threadId}`);
    } else {
      setError(true);
    }
  }

  async function acceptNda(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/commodities/${listingId}/nda`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: fd.get("fullName"), company: fd.get("company") }),
    });
    setBusy(false);
    if (res.ok) {
      setModal(null);
      router.refresh();
    } else {
      setError(true);
    }
  }

  return (
    <div className="space-y-6">
      {!isOwner && (
        <Button
          variant="gold"
          size="lg"
          className="w-full"
          onClick={() => requireAuth(() => setModal("interest"))}
        >
          <IconMessage className="h-5 w-5" />
          {dict.commodities.interested}
        </Button>
      )}

      {confidentialDocs.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-400">
            {dict.project.dataRoom}
          </p>
          {hasNda || isOwner ? (
            <>
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                <IconShield className="h-4 w-4 shrink-0" />
                {dict.project.dataRoomGranted}
              </div>
              <ul className="space-y-2">
                {confidentialDocs.map((d, i) => (
                  <li key={i}>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-lg border border-navy-100 px-3.5 py-2.5 text-sm font-medium text-navy-800 transition hover:border-gold-300 hover:bg-gold-50/40"
                    >
                      <IconDoc className="h-5 w-5 shrink-0 text-navy-400" />
                      {d.name}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-navy-200 bg-navy-50/60 p-4 text-center">
              <IconLock className="mx-auto h-6 w-6 text-navy-400" />
              <p className="mt-2 text-xs leading-relaxed text-navy-600">
                {dict.commodities.docsNote}
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-3"
                onClick={() => requireAuth(() => setModal("nda"))}
              >
                {dict.project.requestAccess}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Interest modal */}
      <Modal
        open={modal === "interest"}
        onClose={() => setModal(null)}
        title={dict.commodities.interested}
      >
        <form onSubmit={sendInterest} className="space-y-4">
          <div>
            <Label htmlFor="ci-message">{dict.project.infoForm.message}</Label>
            <Textarea
              id="ci-message"
              name="message"
              rows={5}
              required
              placeholder={dict.project.infoForm.messagePlaceholder}
            />
          </div>
          {error && <p className="text-sm text-red-600">{dict.common.error}</p>}
          <Button type="submit" variant="gold" className="w-full" disabled={busy}>
            {busy ? dict.common.loading : dict.common.send}
          </Button>
        </form>
      </Modal>

      {/* NDA modal */}
      <Modal
        open={modal === "nda"}
        onClose={() => setModal(null)}
        title={dict.project.nda.title}
      >
        <form onSubmit={acceptNda} className="space-y-4">
          <p className="text-sm leading-relaxed text-navy-600">{dict.project.nda.intro}</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-navy-600">
            {dict.project.nda.clauses.map((cl, i) => (
              <li key={i}>{cl}</li>
            ))}
          </ol>
          <div>
            <Label htmlFor="ci-nda-name">{dict.project.nda.fullNameLabel}</Label>
            <Input id="ci-nda-name" name="fullName" required minLength={5} />
          </div>
          <div>
            <Label htmlFor="ci-nda-company">
              {dict.project.nda.companyLabel}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input id="ci-nda-company" name="company" />
          </div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-navy-700">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-navy-300 text-navy-900"
              required
            />
            {dict.project.nda.checkbox}
          </label>
          {error && <p className="text-sm text-red-600">{dict.common.error}</p>}
          <Button type="submit" variant="gold" className="w-full" disabled={busy || !checked}>
            {busy ? dict.common.loading : dict.project.nda.accept}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
