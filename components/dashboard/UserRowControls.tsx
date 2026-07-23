"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "@/lib/constants";

export function UserRowControls({
  userId,
  currentRole,
  verifiedSeller,
  isSelf,
  roleLabels,
  verifiedLabel,
}: {
  userId: string;
  currentRole: string;
  verifiedSeller: boolean;
  isSelf: boolean;
  roleLabels: Record<string, string>;
  verifiedLabel: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function patch(data: Record<string, unknown>) {
    setBusy(true);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={currentRole}
        disabled={busy || isSelf}
        onChange={(e) => patch({ role: e.target.value })}
        className="rounded-md border border-navy-200 px-2 py-1.5 text-xs font-semibold text-navy-800 disabled:opacity-50"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {roleLabels[r] ?? r}
          </option>
        ))}
      </select>
      <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-navy-600">
        <input
          type="checkbox"
          checked={verifiedSeller}
          disabled={busy}
          onChange={(e) => patch({ verifiedSeller: e.target.checked })}
          className="h-4 w-4 rounded border-navy-300"
        />
        {verifiedLabel}
      </label>
    </div>
  );
}
