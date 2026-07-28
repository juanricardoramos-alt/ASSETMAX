"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { Button, Card } from "@/components/ui";
import { IconCheck } from "@/components/icons";

const STORAGE_KEY = "vortamax-cert-checklist";

export function CertificationChecklist({ dict }: { dict: Dictionary }) {
  const t = dict.services.checklist;
  const [checked, setChecked] = useState<boolean[]>(() =>
    t.items.map(() => false)
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as boolean[];
        setChecked(t.items.map((_, i) => Boolean(parsed[i])));
      }
    } catch {
      /* ignore corrupted local state */
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(index: number) {
    setChecked((prev) => {
      const next = prev.map((v, i) => (i === index ? !v : v));
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }

  const done = checked.filter(Boolean).length;
  const pct = Math.round((done / t.items.length) * 100);

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-extrabold text-navy-950">{t.title}</h2>
        <p className="text-sm font-bold text-gold-600">
          {done}/{t.items.length} · {pct}% {t.progress}
        </p>
      </div>
      <p className="mt-1 text-sm text-navy-500">{t.subtitle}</p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-navy-100">
        <div
          className="h-full rounded-full bg-gold-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-5 space-y-2">
        {t.items.map((item, i) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => toggle(i)}
              disabled={!loaded}
              className="flex w-full items-center gap-3 rounded-lg border border-navy-100 bg-white px-4 py-2.5 text-left transition hover:border-navy-300"
            >
              <span
                aria-hidden
                className={
                  checked[i]
                    ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
                    : "h-5 w-5 shrink-0 rounded-full border-2 border-navy-300"
                }
              >
                {checked[i] && <IconCheck className="h-3.5 w-3.5" />}
              </span>
              <span
                className={
                  checked[i]
                    ? "text-sm font-medium text-navy-400 line-through"
                    : "text-sm font-medium text-navy-800"
                }
              >
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function ProposalTemplates({ dict }: { dict: Dictionary }) {
  const t = dict.services.templates;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function copy(index: number, body: string) {
    try {
      await navigator.clipboard.writeText(body);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div>
      <h2 className="text-lg font-extrabold text-navy-950">{t.title}</h2>
      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        {t.bodies.map((template, i) => (
          <Card key={template.name} className="flex flex-col p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-navy-950">
                {template.name}
              </h3>
              <Button
                variant={copiedIndex === i ? "outline" : "primary"}
                size="sm"
                onClick={() => copy(i, template.body)}
              >
                {copiedIndex === i ? t.copied : t.copy}
              </Button>
            </div>
            <pre className="mt-3 flex-1 whitespace-pre-wrap rounded-lg bg-navy-50/70 p-4 font-sans text-xs leading-relaxed text-navy-700">
              {template.body}
            </pre>
          </Card>
        ))}
      </div>
    </div>
  );
}
