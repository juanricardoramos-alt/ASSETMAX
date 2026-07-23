"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { CATEGORIES, STAGES, DEAL_TYPES, COUNTRIES } from "@/lib/constants";
import type { StructuredMandate } from "@/app/api/ai/structure-mandate/route";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";
import { IconCheck } from "@/components/icons";
import { cn } from "@/lib/utils";

export type MandateFormData = {
  title: string;
  description: string;
  categories: string[];
  countries: string[];
  stages: string[];
  dealTypes: string[];
  ticketMin: string;
  ticketMax: string;
  equityMin: string;
  equityMax: string;
  conditions: string;
  isPublic: boolean;
};

export const emptyMandate: MandateFormData = {
  title: "",
  description: "",
  categories: [],
  countries: [],
  stages: [],
  dealTypes: [],
  ticketMin: "",
  ticketMax: "",
  equityMin: "",
  equityMax: "",
  conditions: "",
  isPublic: true,
};

function num(v: string): number | null {
  const n = Number(v);
  return v.trim() !== "" && Number.isFinite(n) ? n : null;
}

function ChipToggle({
  options,
  selected,
  onToggle,
  labelFor,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
  labelFor: (value: string) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-navy-200 bg-white text-navy-600 hover:border-navy-400"
            )}
          >
            {labelFor(opt)}
          </button>
        );
      })}
    </div>
  );
}

export function MandateForm({
  lang,
  dict,
  mandateId,
  initialData,
  aiStructureEnabled,
}: {
  lang: string;
  dict: Dictionary;
  mandateId?: string;
  initialData?: MandateFormData;
  aiStructureEnabled: boolean;
}) {
  const [data, setData] = useState<MandateFormData>(initialData ?? emptyMandate);
  const [freeText, setFreeText] = useState("");
  const [structuring, setStructuring] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const m = dict.mandates.form;
  const set = (patch: Partial<MandateFormData>) => setData((d) => ({ ...d, ...patch }));
  const toggle = (key: "categories" | "countries" | "stages" | "dealTypes", value: string) =>
    set({
      [key]: data[key].includes(value)
        ? data[key].filter((v) => v !== value)
        : [...data[key], value],
    } as Partial<MandateFormData>);

  async function structure() {
    if (freeText.trim().length < 20) return;
    setStructuring(true);
    setError(false);
    try {
      const res = await fetch("/api/ai/structure-mandate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: freeText }),
      });
      if (!res.ok) throw new Error();
      const { result } = (await res.json()) as { result: StructuredMandate };
      setData({
        title: result.title ?? "",
        description: result.description ?? "",
        categories: (result.categories ?? []).filter((c) =>
          (CATEGORIES as readonly string[]).includes(c)
        ),
        countries: (result.countries ?? []).filter((c) =>
          COUNTRIES.some((x) => x.code === c)
        ),
        stages: (result.stages ?? []).filter((s) =>
          (STAGES as readonly string[]).includes(s)
        ),
        dealTypes: (result.dealTypes ?? []).filter((d) =>
          (DEAL_TYPES as readonly string[]).includes(d)
        ),
        ticketMin: result.ticketMin != null ? String(result.ticketMin) : "",
        ticketMax: result.ticketMax != null ? String(result.ticketMax) : "",
        equityMin: result.equityMin != null ? String(result.equityMin) : "",
        equityMax: result.equityMax != null ? String(result.equityMax) : "",
        conditions: result.conditions ?? "",
        isPublic: true,
      });
    } catch {
      setError(true);
    } finally {
      setStructuring(false);
    }
  }

  async function save(action: "draft" | "submit") {
    setBusy(true);
    setError(false);
    const payload = {
      action,
      title: data.title.trim(),
      description: data.description.trim(),
      categories: data.categories,
      countries: data.countries,
      stages: data.stages,
      dealTypes: data.dealTypes,
      ticketMin: num(data.ticketMin),
      ticketMax: num(data.ticketMax),
      equityMin: num(data.equityMin),
      equityMax: num(data.equityMax),
      conditions: data.conditions.trim(),
      isPublic: data.isPublic,
    };
    const res = await fetch(mandateId ? `/api/mandates/${mandateId}` : "/api/mandates", {
      method: mandateId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (res.ok) setSubmitted(true);
    else setError(true);
  }

  const valid = data.title.trim().length >= 5 && data.description.trim().length >= 20;

  if (submitted) {
    return (
      <Card className="mx-auto max-w-xl p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <IconCheck className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-navy-950">{m.submittedTitle}</h1>
        <p className="mt-3 text-sm leading-relaxed text-navy-500">{m.submittedText}</p>
        <Link
          href={`/${lang}/dashboard/mandates`}
          className="mt-7 inline-flex rounded-md bg-navy-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-800"
        >
          {dict.mandates.myMandates}
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">
        {mandateId ? dict.mandates.editTitle : dict.mandates.newTitle}
      </h1>

      {/* Free-text AI structuring */}
      {!mandateId && (
        <Card className="border-gold-200 bg-gold-50/40 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-navy-950">{m.freeTextTitle}</h2>
            <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold text-gold-800 ring-1 ring-gold-300">
              {dict.ai.poweredBy}
            </span>
          </div>
          {aiStructureEnabled ? (
            <>
              <p className="mt-1 text-sm text-navy-600">{m.freeTextHint}</p>
              <Textarea
                rows={4}
                className="mt-3"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder={m.freeTextPlaceholder}
              />
              <Button
                variant="primary"
                size="sm"
                className="mt-3"
                disabled={structuring || freeText.trim().length < 20}
                onClick={structure}
              >
                {structuring ? m.structuring : m.structureCta}
              </Button>
            </>
          ) : (
            <p className="mt-2 rounded-lg bg-white px-4 py-3 text-xs leading-relaxed text-navy-500">
              {dict.ai.disabledNote}
            </p>
          )}
        </Card>
      )}

      <Card className="space-y-6 p-7">
        <div>
          <Label htmlFor="md-title">{m.title} *</Label>
          <Input
            id="md-title"
            value={data.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder={m.titlePlaceholder}
          />
        </div>
        <div>
          <Label htmlFor="md-desc">{m.description} *</Label>
          <Textarea
            id="md-desc"
            rows={5}
            value={data.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder={m.descriptionPlaceholder}
          />
        </div>

        <div>
          <Label>{m.categories}</Label>
          <ChipToggle
            options={CATEGORIES}
            selected={data.categories}
            onToggle={(v) => toggle("categories", v)}
            labelFor={(v) => dict.categories[v as keyof typeof dict.categories]}
          />
        </div>
        <div>
          <Label>{m.countries}</Label>
          <ChipToggle
            options={COUNTRIES.map((c) => c.code)}
            selected={data.countries}
            onToggle={(v) => toggle("countries", v)}
            labelFor={(v) =>
              COUNTRIES.find((c) => c.code === v)?.[lang === "es" ? "es" : "en"] ?? v
            }
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label>{m.stages}</Label>
            <ChipToggle
              options={STAGES}
              selected={data.stages}
              onToggle={(v) => toggle("stages", v)}
              labelFor={(v) => dict.stages[v as keyof typeof dict.stages]}
            />
          </div>
          <div>
            <Label>{m.dealTypes}</Label>
            <ChipToggle
              options={DEAL_TYPES}
              selected={data.dealTypes}
              onToggle={(v) => toggle("dealTypes", v)}
              labelFor={(v) => dict.dealTypes[v as keyof typeof dict.dealTypes]}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="md-tmin">{m.ticketMin}</Label>
            <Input
              id="md-tmin"
              type="number"
              value={data.ticketMin}
              onChange={(e) => set({ ticketMin: e.target.value })}
              placeholder="100000000"
            />
          </div>
          <div>
            <Label htmlFor="md-tmax">{m.ticketMax}</Label>
            <Input
              id="md-tmax"
              type="number"
              value={data.ticketMax}
              onChange={(e) => set({ ticketMax: e.target.value })}
              placeholder="400000000"
            />
          </div>
          <div>
            <Label htmlFor="md-emin">{m.equityMin}</Label>
            <Input
              id="md-emin"
              type="number"
              value={data.equityMin}
              onChange={(e) => set({ equityMin: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="md-emax">{m.equityMax}</Label>
            <Input
              id="md-emax"
              type="number"
              value={data.equityMax}
              onChange={(e) => set({ equityMax: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="md-cond">
            {m.conditions} <span className="text-navy-400">({dict.common.optional})</span>
          </Label>
          <Textarea
            id="md-cond"
            rows={2}
            value={data.conditions}
            onChange={(e) => set({ conditions: e.target.value })}
            placeholder={m.conditionsPlaceholder}
          />
        </div>

        <div>
          <Label>{m.visibility}</Label>
          <div className="space-y-2">
            {[
              { value: true, label: m.visPublic },
              { value: false, label: m.visPrivate },
            ].map((opt) => (
              <label
                key={String(opt.value)}
                className="flex cursor-pointer items-center gap-2.5 rounded-md border border-navy-200 px-3.5 py-2.5 text-sm text-navy-800"
              >
                <input
                  type="radio"
                  name="visibility"
                  checked={data.isPublic === opt.value}
                  onChange={() => set({ isPublic: opt.value })}
                  className="h-4 w-4 border-navy-300 text-navy-900"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{dict.common.error}</p>}

        <div className="flex flex-wrap justify-end gap-3 border-t border-navy-100 pt-5">
          <Button variant="ghost" onClick={() => save("draft")} disabled={busy || !valid}>
            {m.saveDraft}
          </Button>
          <Button variant="gold" onClick={() => save("submit")} disabled={busy || !valid}>
            {busy ? dict.common.loading : m.submit}
          </Button>
        </div>
      </Card>
    </div>
  );
}
