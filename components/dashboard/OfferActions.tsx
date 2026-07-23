"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

export function OfferActions({
  offerId,
  role,
  status,
  labels,
}: {
  offerId: string;
  role: "seller" | "investor";
  status: string;
  labels: { accept: string; decline: string; discuss: string; withdraw: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    const res = await fetch(`/api/offers/${offerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  if (["ACCEPTED", "DECLINED", "WITHDRAWN"].includes(status)) return null;

  if (role === "investor") {
    return (
      <Button variant="outline" size="sm" disabled={busy} onClick={() => setStatus("WITHDRAWN")}>
        {labels.withdraw}
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "PENDING" && (
        <Button variant="outline" size="sm" disabled={busy} onClick={() => setStatus("IN_DISCUSSION")}>
          {labels.discuss}
        </Button>
      )}
      <Button variant="primary" size="sm" disabled={busy} onClick={() => setStatus("ACCEPTED")}>
        {labels.accept}
      </Button>
      <Button variant="danger" size="sm" disabled={busy} onClick={() => setStatus("DECLINED")}>
        {labels.decline}
      </Button>
    </div>
  );
}
