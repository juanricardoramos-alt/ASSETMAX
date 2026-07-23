"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

export function MarkAllReadButton({ label }: { label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/notifications/read-all", { method: "POST" });
        setBusy(false);
        router.refresh();
      }}
    >
      {label}
    </Button>
  );
}
