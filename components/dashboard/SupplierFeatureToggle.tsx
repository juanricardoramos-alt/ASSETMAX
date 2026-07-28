"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function SupplierFeatureToggle({
  supplierId,
  featured,
  label,
}: {
  supplierId: string;
  featured: boolean;
  label: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const res = await fetch(`/api/admin/suppliers/${supplierId}/feature`, {
      method: "POST",
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <button
      disabled={busy}
      onClick={toggle}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50",
        featured
          ? "border-gold-400 bg-gold-50 text-gold-700"
          : "border-navy-200 bg-white text-navy-500 hover:border-navy-400"
      )}
    >
      ★ {label}
    </button>
  );
}
