"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { IconDoc, IconCheck } from "@/components/icons";

export function GenerateContractButton({
  payload,
  label,
  generatingLabel,
}: {
  payload: Record<string, string>;
  label: string;
  generatingLabel: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const res = await fetch("/api/contracts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setBusy(false);
        if (res.ok) {
          const { id } = (await res.json()) as { id: string };
          router.push(`${window.location.pathname}/${id}`);
          router.refresh();
        }
      }}
    >
      <IconDoc className="h-4 w-4" />
      {busy ? generatingLabel : label}
    </Button>
  );
}

export function MarkReviewedButton({
  contractId,
  label,
}: {
  contractId: string;
  label: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="primary"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const res = await fetch(`/api/contracts/${contractId}/review`, {
          method: "POST",
        });
        setBusy(false);
        if (res.ok) router.refresh();
      }}
    >
      <IconCheck className="h-4 w-4" />
      {label}
    </Button>
  );
}

export function ExportPdfButton({
  label,
  disabled,
  hint,
}: {
  label: string;
  disabled: boolean;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="gold" disabled={disabled} onClick={() => window.print()}>
        {label}
      </Button>
      {disabled && <p className="text-xs text-navy-400">{hint}</p>}
    </div>
  );
}
