"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Textarea } from "@/components/ui";

export function ReviewActions({
  projectId,
  entity = "projects",
  labels,
}: {
  projectId: string;
  entity?: "projects" | "mandates" | "commodities";
  labels: { approve: string; reject: string; reason: string; confirm: string; cancel: string };
}) {
  const router = useRouter();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function decide(decision: "approve" | "reject") {
    setBusy(true);
    const res = await fetch(`/api/admin/${entity}/${projectId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, reason }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  if (rejecting) {
    return (
      <div className="w-full space-y-3">
        <Textarea
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={labels.reason}
        />
        <div className="flex gap-2">
          <Button variant="danger" size="sm" disabled={busy} onClick={() => decide("reject")}>
            {labels.confirm}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setRejecting(false)}>
            {labels.cancel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="primary" size="sm" disabled={busy} onClick={() => decide("approve")}>
        {labels.approve}
      </Button>
      <Button variant="outline" size="sm" disabled={busy} onClick={() => setRejecting(true)}>
        {labels.reject}
      </Button>
    </div>
  );
}
