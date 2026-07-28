"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function CompanyFlagControls({
  companyId,
  verified,
  isAnchor,
  labels,
}: {
  companyId: string;
  verified: boolean;
  isAnchor: boolean;
  labels: { verified: string; anchor: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setFlag(patch: { verified?: boolean; isAnchor?: boolean }) {
    setBusy(true);
    const res = await fetch(`/api/admin/companies/${companyId}/flags`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  const chip =
    "rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50";

  return (
    <div className="flex gap-2">
      <button
        disabled={busy}
        onClick={() => setFlag({ verified: !verified })}
        className={cn(
          chip,
          verified
            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
            : "border-navy-200 bg-white text-navy-500 hover:border-navy-400"
        )}
      >
        {labels.verified}
      </button>
      <button
        disabled={busy}
        onClick={() => setFlag({ isAnchor: !isAnchor })}
        className={cn(
          chip,
          isAnchor
            ? "border-gold-400 bg-gold-50 text-gold-700"
            : "border-navy-200 bg-white text-navy-500 hover:border-navy-400"
        )}
      >
        {labels.anchor}
      </button>
    </div>
  );
}
