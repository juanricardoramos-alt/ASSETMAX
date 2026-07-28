"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

async function patchStatus(applicationId: string, status: string) {
  return fetch(`/api/applications/${applicationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

/** Company-side decisions on a received application. */
export function ApplicationDecisionActions({
  applicationId,
  status,
  labels,
}: {
  applicationId: string;
  status: string;
  labels: { discuss: string; accept: string; decline: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function decide(next: string) {
    setBusy(true);
    const res = await patchStatus(applicationId, next);
    setBusy(false);
    if (res.ok) router.refresh();
  }

  if (["ACCEPTED", "DECLINED", "WITHDRAWN"].includes(status)) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {status === "PENDING" && (
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => decide("IN_DISCUSSION")}
        >
          {labels.discuss}
        </Button>
      )}
      <Button
        variant="gold"
        size="sm"
        disabled={busy}
        onClick={() => decide("ACCEPTED")}
      >
        {labels.accept}
      </Button>
      <Button
        variant="danger"
        size="sm"
        disabled={busy}
        onClick={() => decide("DECLINED")}
      >
        {labels.decline}
      </Button>
    </div>
  );
}

/** Supplier-side withdraw button on an own application. */
export function ApplicationWithdrawButton({
  applicationId,
  labels,
}: {
  applicationId: string;
  labels: { withdraw: string; confirm: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function withdraw() {
    if (!window.confirm(labels.confirm)) return;
    setBusy(true);
    const res = await patchStatus(applicationId, "WITHDRAWN");
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <Button variant="outline" size="sm" disabled={busy} onClick={withdraw}>
      {labels.withdraw}
    </Button>
  );
}
