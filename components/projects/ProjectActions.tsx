"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Dictionary } from "@/lib/i18n";
import { OFFER_TYPES } from "@/lib/constants";
import { Modal } from "@/components/Modal";
import { Button, Input, Label, Select, Textarea } from "@/components/ui";
import { IconHeart, IconMessage, IconHandshake } from "@/components/icons";
import { cn } from "@/lib/utils";

export function ProjectActions({
  projectId,
  lang,
  dict,
  initialFavorite,
  isOwner,
}: {
  projectId: string;
  lang: string;
  dict: Dictionary;
  initialFavorite: boolean;
  isOwner: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [modal, setModal] = useState<"offer" | "info" | null>(null);
  const [favorite, setFavorite] = useState(initialFavorite);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const requireAuth = (action: () => void) => {
    if (!session) {
      router.push(`/${lang}/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    action();
  };

  const toggleFavorite = () =>
    requireAuth(async () => {
      setFavorite((f) => !f);
      const res = await fetch(`/api/projects/${projectId}/favorite`, { method: "POST" });
      if (!res.ok) setFavorite((f) => !f);
    });

  async function submitOffer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/projects/${projectId}/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(fd.get("amount")),
        type: fd.get("type"),
        equityPct: fd.get("equityPct") ? Number(fd.get("equityPct")) : undefined,
        message: fd.get("message"),
      }),
    });
    setBusy(false);
    if (res.ok) setDone(dict.project.offerForm.success);
    else setError(true);
  }

  async function submitInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/projects/${projectId}/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: fd.get("message") }),
    });
    setBusy(false);
    if (res.ok) setDone(dict.project.infoForm.success);
    else setError(true);
  }

  const close = () => {
    setModal(null);
    setDone(null);
    setError(false);
  };

  if (isOwner) return null;

  return (
    <>
      <div className="flex flex-col gap-3">
        <Button variant="gold" size="lg" onClick={() => requireAuth(() => setModal("offer"))}>
          <IconHandshake className="h-5 w-5" />
          {dict.project.submitOffer}
        </Button>
        <Button variant="primary" size="lg" onClick={() => requireAuth(() => setModal("info"))}>
          <IconMessage className="h-5 w-5" />
          {dict.project.requestInfo}
        </Button>
        <Button variant="outline" size="lg" onClick={toggleFavorite}>
          <IconHeart
            className={cn("h-5 w-5", favorite && "fill-red-500 text-red-500")}
          />
          {dict.dashboard.favorites}
        </Button>
        {!session && (
          <p className="text-center text-xs text-navy-400">{dict.project.signInToAct}</p>
        )}
      </div>

      {/* Offer modal */}
      <Modal open={modal === "offer"} onClose={close} title={dict.project.offerForm.title}>
        {done ? (
          <SuccessBlock text={done} closeLabel={dict.common.close} onClose={close} />
        ) : (
          <form onSubmit={submitOffer} className="space-y-4">
            <div>
              <Label htmlFor="offer-amount">{dict.project.offerForm.amount}</Label>
              <Input
                id="offer-amount"
                name="amount"
                type="number"
                min={1}
                required
                placeholder="150000000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="offer-type">{dict.project.offerForm.type}</Label>
                <Select id="offer-type" name="type" required defaultValue="equity_stake">
                  {OFFER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {dict.offerTypes[t]}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="offer-equity">
                  {dict.project.offerForm.equityPct}{" "}
                  <span className="text-navy-400">({dict.common.optional})</span>
                </Label>
                <Input id="offer-equity" name="equityPct" type="number" min={1} max={100} />
              </div>
            </div>
            <div>
              <Label htmlFor="offer-message">{dict.project.offerForm.message}</Label>
              <Textarea
                id="offer-message"
                name="message"
                rows={5}
                required
                placeholder={dict.project.offerForm.messagePlaceholder}
              />
            </div>
            {error && <p className="text-sm text-red-600">{dict.common.error}</p>}
            <Button type="submit" variant="gold" className="w-full" disabled={busy}>
              {busy ? dict.common.loading : dict.project.offerForm.submit}
            </Button>
          </form>
        )}
      </Modal>

      {/* Request info modal */}
      <Modal open={modal === "info"} onClose={close} title={dict.project.infoForm.title}>
        {done ? (
          <SuccessBlock text={done} closeLabel={dict.common.close} onClose={close} />
        ) : (
          <form onSubmit={submitInfo} className="space-y-4">
            <div>
              <Label htmlFor="info-message">{dict.project.infoForm.message}</Label>
              <Textarea
                id="info-message"
                name="message"
                rows={6}
                required
                placeholder={dict.project.infoForm.messagePlaceholder}
              />
            </div>
            {error && <p className="text-sm text-red-600">{dict.common.error}</p>}
            <Button type="submit" variant="primary" className="w-full" disabled={busy}>
              {busy ? dict.common.loading : dict.project.infoForm.submit}
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}

function SuccessBlock({
  text,
  closeLabel,
  onClose,
}: {
  text: string;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
        ✓
      </div>
      <p className="mt-4 text-sm leading-relaxed text-navy-700">{text}</p>
      <Button variant="outline" className="mt-6" onClick={onClose}>
        {closeLabel}
      </Button>
    </div>
  );
}
