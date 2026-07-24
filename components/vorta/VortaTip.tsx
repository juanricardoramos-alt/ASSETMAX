"use client";

import { useEffect, useState } from "react";
import { VortaMascot } from "@/components/vorta/VortaMascot";
import { IconClose } from "@/components/icons";

/**
 * Contextual VORTA tip shown inside key flows (wizard steps, listing forms,
 * template generator). Dismissal is remembered per tip id.
 */
export function VortaTip({
  id,
  text,
  dismissLabel,
}: {
  id: string;
  text: string;
  dismissLabel: string;
}) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(!!localStorage.getItem(`vmx-tip-${id}`));
  }, [id]);

  if (hidden) return null;

  const dismiss = () => {
    localStorage.setItem(`vmx-tip-${id}`, "1");
    setHidden(true);
  };

  return (
    <div className="flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50/60 px-4 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-950">
        <VortaMascot mood="idle" className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-gold-700">VORTA</p>
        <p className="mt-0.5 text-sm leading-relaxed text-navy-700">{text}</p>
        <button
          onClick={dismiss}
          className="mt-1.5 text-xs font-semibold text-navy-500 underline decoration-gold-400 transition hover:text-navy-800"
        >
          {dismissLabel}
        </button>
      </div>
      <button
        onClick={dismiss}
        aria-label={dismissLabel}
        className="rounded-md p-1 text-navy-400 transition hover:bg-white hover:text-navy-800"
      >
        <IconClose className="h-4 w-4" />
      </button>
    </div>
  );
}
