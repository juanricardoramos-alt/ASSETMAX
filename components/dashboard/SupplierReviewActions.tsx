"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Textarea } from "@/components/ui";

export function SupplierReviewActions({
  supplierId,
  labels,
}: {
  supplierId: string;
  labels: { approve: string; reject: string; rejectReason: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  async function review(action: "approve" | "reject") {
    setBusy(true);
    const res = await fetch(`/api/admin/suppliers/${supplierId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });
    setBusy(false);
    if (res.ok) {
      setRejecting(false);
      router.refresh();
    }
  }

  return (
    <div className="w-full sm:w-auto">
      <div className="flex gap-2">
        <Button
          variant="gold"
          size="sm"
          disabled={busy}
          onClick={() => review("approve")}
        >
          {labels.approve}
        </Button>
        <Button
          variant="danger"
          size="sm"
          disabled={busy}
          onClick={() => setRejecting((v) => !v)}
        >
          {labels.reject}
        </Button>
      </div>
      {rejecting && (
        <div className="mt-3">
          <Textarea
            rows={2}
            placeholder={labels.rejectReason}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button
            variant="danger"
            size="sm"
            className="mt-2"
            disabled={busy}
            onClick={() => review("reject")}
          >
            {labels.reject}
          </Button>
        </div>
      )}
    </div>
  );
}
