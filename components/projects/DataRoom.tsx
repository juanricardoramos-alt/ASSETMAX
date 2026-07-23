"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Dictionary } from "@/lib/i18n";
import { Modal } from "@/components/Modal";
import { Button, Input, Label } from "@/components/ui";
import { IconLock, IconDoc, IconShield } from "@/components/icons";

export function DataRoom({
  projectId,
  lang,
  dict,
  hasAccess,
  confidentialDocs,
}: {
  projectId: string;
  lang: string;
  dict: Dictionary;
  hasAccess: boolean;
  confidentialDocs: { id: string; name: string; url: string }[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [checked, setChecked] = useState(false);

  async function acceptNda(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/projects/${projectId}/nda`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: fd.get("fullName"), company: fd.get("company") }),
    });
    setBusy(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      setError(true);
    }
  }

  const requestAccess = () => {
    if (!session) {
      router.push(
        `/${lang}/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }
    setOpen(true);
  };

  if (hasAccess) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          <IconShield className="h-5 w-5 shrink-0" />
          {dict.project.dataRoomGranted}
        </div>
        <ul className="space-y-2">
          {confidentialDocs.map((d) => (
            <li key={d.id}>
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-navy-100 bg-white px-4 py-3 text-sm font-medium text-navy-800 transition hover:border-gold-300 hover:bg-gold-50/40"
              >
                <IconDoc className="h-5 w-5 shrink-0 text-navy-400" />
                {d.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-navy-400">{dict.project.downloadNote}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-xl border border-dashed border-navy-200 bg-navy-50/60 p-6 text-center">
        <IconLock className="mx-auto h-8 w-8 text-navy-400" />
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-600">
          {dict.project.dataRoomHint}
        </p>
        <p className="mt-2 text-xs font-semibold text-navy-500">
          {confidentialDocs.length} {dict.project.documents.toLowerCase()}
        </p>
        <Button variant="primary" className="mt-4" onClick={requestAccess}>
          <IconLock className="h-4 w-4" />
          {dict.project.requestAccess}
        </Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={dict.project.nda.title}>
        <form onSubmit={acceptNda} className="space-y-4">
          <p className="text-sm leading-relaxed text-navy-600">{dict.project.nda.intro}</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-navy-600">
            {dict.project.nda.clauses.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ol>
          <div>
            <Label htmlFor="nda-name">{dict.project.nda.fullNameLabel}</Label>
            <Input id="nda-name" name="fullName" required minLength={5} />
          </div>
          <div>
            <Label htmlFor="nda-company">
              {dict.project.nda.companyLabel}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input id="nda-company" name="company" />
          </div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-navy-700">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-navy-300 text-navy-900 focus:ring-navy-500"
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
