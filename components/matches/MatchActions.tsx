"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

export function MatchActions({
  matchId,
  type,
  status,
  lang,
  labels,
}: {
  matchId: string;
  type: "project" | "commodity";
  status: string;
  lang: string;
  labels: { contact: string; dismiss: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function contact() {
    setBusy(true);
    const res = await fetch(`/api/matches/${type}/${matchId}`, { method: "POST" });
    setBusy(false);
    if (res.ok) {
      const { threadId } = (await res.json()) as { threadId: string };
      router.push(`/${lang}/dashboard/messages/${threadId}`);
    }
  }

  async function dismiss() {
    setBusy(true);
    const res = await fetch(`/api/matches/${type}/${matchId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DISMISSED" }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  if (status === "DISMISSED") return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="gold" size="sm" disabled={busy} onClick={contact}>
        {labels.contact}
      </Button>
      {status === "NEW" && (
        <Button variant="outline" size="sm" disabled={busy} onClick={dismiss}>
          {labels.dismiss}
        </Button>
      )}
    </div>
  );
}
