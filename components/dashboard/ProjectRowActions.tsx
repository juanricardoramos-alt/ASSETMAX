"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export function ProjectRowActions({
  projectId,
  slug,
  status,
  lang,
  labels,
}: {
  projectId: string;
  slug: string;
  status: string;
  lang: string;
  labels: { view: string; edit: string; del: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm(`${labels.del}?`)) return;
    setBusy(true);
    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex items-center gap-2 text-xs font-semibold">
      {status === "PUBLISHED" && (
        <Link
          href={`/${lang}/projects/${slug}`}
          className="rounded-md border border-navy-200 px-2.5 py-1.5 text-navy-700 hover:bg-navy-50"
        >
          {labels.view}
        </Link>
      )}
      <Link
        href={`/${lang}/dashboard/projects/${projectId}/edit`}
        className="rounded-md border border-navy-200 px-2.5 py-1.5 text-navy-700 hover:bg-navy-50"
      >
        {labels.edit}
      </Link>
      {status !== "PUBLISHED" && (
        <button
          onClick={remove}
          disabled={busy}
          className="rounded-md border border-red-200 px-2.5 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {labels.del}
        </button>
      )}
    </div>
  );
}
