"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function NeedRowActions({
  needId,
  status,
  labels,
}: {
  needId: string;
  status: string;
  labels: { close: string; reopen: string; delete: string; confirmDelete: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: "OPEN" | "CLOSED") {
    setBusy(true);
    const res = await fetch(`/api/needs/${needId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  async function remove() {
    if (!window.confirm(labels.confirmDelete)) return;
    setBusy(true);
    const res = await fetch(`/api/needs/${needId}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex gap-2">
      {status === "OPEN" ? (
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => setStatus("CLOSED")}
        >
          {labels.close}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => setStatus("OPEN")}
        >
          {labels.reopen}
        </Button>
      )}
      <Button variant="danger" size="sm" disabled={busy} onClick={remove}>
        {labels.delete}
      </Button>
    </div>
  );
}
