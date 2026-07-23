"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function FeatureToggle({
  projectId,
  featured,
  labels,
}: {
  projectId: string;
  featured: boolean;
  labels: { feature: string; unfeature: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const res = await fetch(`/api/admin/projects/${projectId}/feature`, {
      method: "POST",
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <Button variant={featured ? "outline" : "gold"} size="sm" disabled={busy} onClick={toggle}>
      {featured ? labels.unfeature : labels.feature}
    </Button>
  );
}
