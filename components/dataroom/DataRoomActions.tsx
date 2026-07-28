"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

/** Counterparty side: ask the owner for data-room access. */
export function RequestAccessButton({
  projectId,
  labels,
}: {
  projectId: string;
  labels: { request: string; requesting: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function request() {
    setBusy(true);
    const res = await fetch("/api/dataroom/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <Button variant="outline" size="sm" disabled={busy} onClick={request}>
      {busy ? labels.requesting : labels.request}
    </Button>
  );
}

/** Owner side: grant or deny a pending request. */
export function RequestDecisionButtons({
  requestId,
  labels,
}: {
  requestId: string;
  labels: { grant: string; deny: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function decide(action: "grant" | "deny") {
    setBusy(true);
    const res = await fetch(`/api/dataroom/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button variant="gold" size="sm" disabled={busy} onClick={() => decide("grant")}>
        {labels.grant}
      </Button>
      <Button variant="danger" size="sm" disabled={busy} onClick={() => decide("deny")}>
        {labels.deny}
      </Button>
    </div>
  );
}

/** Granted side: opening a document records the access, then opens the file. */
export function LoggedDocButton({
  projectId,
  documentName,
  url,
  label,
}: {
  projectId: string;
  documentName: string;
  url: string;
  label: string;
}) {
  const [busy, setBusy] = useState(false);

  async function open() {
    setBusy(true);
    await fetch("/api/dataroom/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, documentName }),
    }).catch(() => {});
    setBusy(false);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <Button variant="ghost" size="sm" disabled={busy} onClick={open}>
      {label} ↗
    </Button>
  );
}
