"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MandateRowActions({
  mandateId,
  lang,
  labels,
}: {
  mandateId: string;
  lang: string;
  labels: { edit: string; del: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm(`${labels.del}?`)) return;
    setBusy(true);
    const res = await fetch(`/api/mandates/${mandateId}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex items-center gap-2 text-xs font-semibold">
      <Link
        href={`/${lang}/dashboard/mandates/${mandateId}/edit`}
        className="rounded-md border border-navy-200 px-3 py-1.5 text-navy-700 hover:bg-navy-50"
      >
        {labels.edit}
      </Link>
      <button
        onClick={remove}
        disabled={busy}
        className="rounded-md border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {labels.del}
      </button>
    </div>
  );
}
