"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { CATEGORIES, STAGES, DEAL_TYPES, COUNTRIES } from "@/lib/constants";
import type { IngestResult } from "@/app/api/ai/ingest/route";
import { Button, Input, Label, Select, Textarea, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { IconCheck, IconDoc, IconClose } from "@/components/icons";

export type WizardData = {
  title: string;
  summary: string;
  description: string;
  descriptionEs: string;
  category: string;
  countryCode: string;
  region: string;
  city: string;
  lat: string;
  lng: string;
  stage: string;
  dealType: string;
  investmentMin: string;
  investmentMax: string;
  revenue: string;
  ebitda: string;
  capacity: string;
  production: string;
  permits: string;
  workforce: string;
  areaHectares: string;
  highlights: string;
  specs: { label: string; value: string }[];
  images: string;
  documents: { name: string; url: string; isConfidential: boolean }[];
};

export const emptyWizardData: WizardData = {
  title: "",
  summary: "",
  description: "",
  descriptionEs: "",
  category: "mining",
  countryCode: "CL",
  region: "",
  city: "",
  lat: "",
  lng: "",
  stage: "operating",
  dealType: "full_sale",
  investmentMin: "",
  investmentMax: "",
  revenue: "",
  ebitda: "",
  capacity: "",
  production: "",
  permits: "",
  workforce: "",
  areaHectares: "",
  highlights: "",
  specs: [],
  images: "",
  documents: [],
};

function num(v: string): number | null {
  const n = Number(v);
  return v.trim() !== "" && Number.isFinite(n) ? n : null;
}

function toPayload(d: WizardData, action: "draft" | "submit") {
  return {
    action,
    title: d.title.trim(),
    summary: d.summary.trim(),
    description: d.description.trim(),
    descriptionEs: d.descriptionEs.trim(),
    category: d.category,
    countryCode: d.countryCode,
    region: d.region.trim(),
    city: d.city.trim(),
    lat: num(d.lat),
    lng: num(d.lng),
    stage: d.stage,
    dealType: d.dealType,
    investmentMin: num(d.investmentMin),
    investmentMax: num(d.investmentMax),
    revenue: num(d.revenue),
    ebitda: num(d.ebitda),
    capacity: d.capacity.trim(),
    production: d.production.trim(),
    permits: d.permits.trim(),
    workforce: num(d.workforce),
    areaHectares: num(d.areaHectares),
    highlights: d.highlights
      .split("\n")
      .map((h) => h.trim())
      .filter((h) => h.length >= 3)
      .slice(0, 12),
    specs: d.specs.filter((s) => s.label.trim() && s.value.trim()),
    images: d.images
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => /^https?:\/\//.test(u))
      .slice(0, 8),
    documents: d.documents.filter((doc) => doc.name.trim() && /^https?:\/\//.test(doc.url)),
  };
}

type AiNotes = {
  missing: string[];
  publicDocs: string[];
  confidentialDocs: string[];
};

function pick<T extends string>(value: string | null | undefined, allowed: readonly T[], fallback: T): T {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function fromIngest(r: IngestResult): WizardData {
  return {
    ...emptyWizardData,
    title: r.title ?? "",
    summary: r.summary ?? "",
    description: r.description_en ?? "",
    descriptionEs: r.description_es ?? "",
    category: pick(r.category, CATEGORIES, emptyWizardData.category as (typeof CATEGORIES)[number]),
    countryCode: pick(
      r.countryCode,
      COUNTRIES.map((c) => c.code),
      emptyWizardData.countryCode
    ),
    region: r.region ?? "",
    city: r.city ?? "",
    lat: r.lat != null ? String(r.lat) : "",
    lng: r.lng != null ? String(r.lng) : "",
    stage: pick(r.stage, STAGES, emptyWizardData.stage as (typeof STAGES)[number]),
    dealType: pick(r.dealType, DEAL_TYPES, emptyWizardData.dealType as (typeof DEAL_TYPES)[number]),
    investmentMin: r.investmentMin != null ? String(r.investmentMin) : "",
    investmentMax: r.investmentMax != null ? String(r.investmentMax) : "",
    revenue: r.revenue != null ? String(r.revenue) : "",
    ebitda: r.ebitda != null ? String(r.ebitda) : "",
    capacity: r.capacity ?? "",
    production: r.production ?? "",
    permits: r.permits ?? "",
    workforce: r.workforce != null ? String(r.workforce) : "",
    areaHectares: r.areaHectares != null ? String(r.areaHectares) : "",
    highlights: (r.highlights ?? []).join("\n"),
    specs: r.specs ?? [],
  };
}

export function ProjectWizard({
  lang,
  dict,
  projectId,
  initialData,
  aiIngestEnabled = false,
}: {
  lang: string;
  dict: Dictionary;
  projectId?: string;
  initialData?: WizardData;
  aiIngestEnabled?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData ?? emptyWizardData);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<"choose" | "form">(
    projectId || initialData ? "form" : "choose"
  );
  const [aiNotes, setAiNotes] = useState<AiNotes | null>(null);
  const [ingesting, setIngesting] = useState(false);
  const [ingestError, setIngestError] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [translating, setTranslating] = useState<"en" | "es" | null>(null);
  const [autoTranslated, setAutoTranslated] = useState<{ en: boolean; es: boolean }>({
    en: false,
    es: false,
  });
  const [translateFailed, setTranslateFailed] = useState(false);

  const w = dict.wizard;
  const steps = w.steps;

  // Fill one description language from the other via AI, marked as editable.
  async function translateDescription(target: "en" | "es") {
    const source = target === "es" ? data.description : data.descriptionEs;
    if (!source.trim() || translating) return;
    setTranslating(target);
    setTranslateFailed(false);
    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: source, target }),
      });
      if (!res.ok) throw new Error("translate failed");
      const { translation } = (await res.json()) as { translation: string };
      setData((d) =>
        target === "es" ? { ...d, descriptionEs: translation } : { ...d, description: translation }
      );
      setAutoTranslated((f) => ({ ...f, [target]: true }));
    } catch {
      setTranslateFailed(true);
    } finally {
      setTranslating(null);
    }
  }

  async function runIngest() {
    if (!file) return;
    setIngesting(true);
    setIngestError(false);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("mode", "project");
    try {
      const res = await fetch("/api/ai/ingest", { method: "POST", body: fd });
      if (!res.ok) throw new Error("ingest failed");
      const { result } = (await res.json()) as { result: IngestResult };
      setData(fromIngest(result));
      setAiNotes({
        missing: result.missingFields ?? [],
        publicDocs: result.publicDocumentSuggestions ?? [],
        confidentialDocs: result.confidentialDocumentSuggestions ?? [],
      });
      setMode("form");
      setStep(0);
    } catch {
      setIngestError(true);
    } finally {
      setIngesting(false);
    }
  }

  const set = (patch: Partial<WizardData>) => setData((d) => ({ ...d, ...patch }));

  const stepValid = (): boolean => {
    if (step === 0)
      return (
        data.title.trim().length >= 5 &&
        data.summary.trim().length >= 20 &&
        data.description.trim().length >= 50
      );
    return true;
  };

  async function save(action: "draft" | "submit") {
    setBusy(true);
    setError(null);
    const payload = toPayload(data, action);
    const res = await fetch(projectId ? `/api/projects/${projectId}` : "/api/projects", {
      method: projectId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError(`${w.review.missing}: ${dict.common.error}`);
    }
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-xl p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <IconCheck className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-navy-950">
          {w.review.submittedTitle}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-navy-500">
          {w.review.submittedText}
        </p>
        <Link
          href={`/${lang}/dashboard/projects`}
          className="mt-7 inline-flex rounded-md bg-navy-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-800"
        >
          {w.review.backToProjects}
        </Link>
      </Card>
    );
  }

  // Mode selection — manual vs AI document ingestion (new listings only)
  if (mode === "choose") {
    const a = dict.ai.wizard;
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-navy-950">{w.title}</h1>
        <p className="text-sm text-navy-500">{a.chooseTitle}</p>
        <div className="grid gap-5 lg:grid-cols-2">
          <button
            onClick={() => setMode("form")}
            className="rounded-xl border border-navy-100 bg-white p-7 text-left shadow-card transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-card-hover"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
              <IconCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-navy-950">{a.manualTitle}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{a.manualText}</p>
          </button>

          <div className="rounded-xl border border-navy-100 bg-white p-7 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                <IconDoc className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold text-gold-800 ring-1 ring-gold-300">
                {dict.ai.poweredBy}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-bold text-navy-950">{a.uploadTitle}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{a.uploadText}</p>

            {aiIngestEnabled ? (
              <div className="mt-5 space-y-3">
                <div>
                  <Label htmlFor="wz-ai-file">{a.fileLabel}</Label>
                  <Input
                    id="wz-ai-file"
                    type="file"
                    accept=".pdf,.docx,.xlsx,.xls,.csv,.txt,.md"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="file:mr-3 file:rounded-md file:border-0 file:bg-navy-900 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                  />
                </div>
                {ingestError && (
                  <p className="text-sm font-medium text-red-600">{a.error}</p>
                )}
                <Button
                  variant="gold"
                  className="w-full"
                  disabled={!file || ingesting}
                  onClick={runIngest}
                >
                  {ingesting ? a.processing : a.uploadCta}
                </Button>
              </div>
            ) : (
              <p className="mt-5 rounded-lg bg-navy-50 px-4 py-3 text-xs leading-relaxed text-navy-500">
                {dict.ai.disabledNote}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">
        {projectId ? w.editTitle : w.title}
      </h1>

      {/* AI ingestion review notes */}
      {aiNotes && (
        <div className="rounded-xl border border-gold-200 bg-gold-50/60 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-navy-950">{dict.ai.wizard.extractedTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-navy-600">
                {dict.ai.wizard.extractedText}
              </p>
            </div>
            <button
              onClick={() => setAiNotes(null)}
              aria-label={dict.common.close}
              className="rounded-md p-1 text-navy-400 hover:bg-white hover:text-navy-900"
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { title: dict.ai.wizard.missingTitle, items: aiNotes.missing, warn: true },
              { title: dict.ai.wizard.publicSuggestTitle, items: aiNotes.publicDocs, warn: false },
              { title: dict.ai.wizard.confidentialSuggestTitle, items: aiNotes.confidentialDocs, warn: false },
            ]
              .filter((b) => b.items.length > 0)
              .map((block) => (
                <div key={block.title}>
                  <p
                    className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      block.warn ? "text-amber-700" : "text-navy-500"
                    )}
                  >
                    {block.title}
                  </p>
                  <ul className="mt-1.5 space-y-1 text-xs text-navy-700">
                    {block.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className={block.warn ? "text-amber-500" : "text-gold-500"}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Stepper */}
      <ol className="flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <li key={label}>
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition",
                i === step
                  ? "bg-navy-900 text-white"
                  : i < step
                    ? "bg-gold-100 text-gold-800 hover:bg-gold-200"
                    : "bg-navy-100 text-navy-400"
              )}
            >
              <span>{i + 1}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          </li>
        ))}
      </ol>

      <Card className="p-7">
        {/* Step 1 — Basics */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <Label htmlFor="wz-title">{w.basics.title} *</Label>
              <Input
                id="wz-title"
                value={data.title}
                onChange={(e) => set({ title: e.target.value })}
                placeholder={w.basics.titlePlaceholder}
              />
            </div>
            <div>
              <Label htmlFor="wz-summary">{w.basics.summary} *</Label>
              <Textarea
                id="wz-summary"
                rows={2}
                value={data.summary}
                onChange={(e) => set({ summary: e.target.value })}
                placeholder={w.basics.summaryPlaceholder}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="wz-description" className="mb-0">
                  {w.basics.description} *
                </Label>
                {aiIngestEnabled && data.descriptionEs.trim().length >= 20 && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!!translating}
                    onClick={() => translateDescription("en")}
                  >
                    ✦ {translating === "en" ? w.basics.translating : w.basics.translateCta}
                  </Button>
                )}
              </div>
              <Textarea
                id="wz-description"
                rows={10}
                className="mt-1.5"
                value={data.description}
                onChange={(e) => {
                  set({ description: e.target.value });
                  setAutoTranslated((f) => ({ ...f, en: false }));
                }}
                placeholder={w.basics.descriptionPlaceholder}
              />
              {autoTranslated.en && (
                <p className="mt-1 text-xs font-medium text-gold-700">
                  {w.basics.translateNote}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="wz-description-es" className="mb-0">
                  {w.basics.descriptionEs}{" "}
                  <span className="font-normal text-navy-400">({w.basics.optionalTag})</span>
                </Label>
                {aiIngestEnabled && data.description.trim().length >= 20 && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!!translating}
                    onClick={() => translateDescription("es")}
                  >
                    ✦ {translating === "es" ? w.basics.translating : w.basics.translateCta}
                  </Button>
                )}
              </div>
              <Textarea
                id="wz-description-es"
                rows={10}
                className="mt-1.5"
                value={data.descriptionEs}
                onChange={(e) => {
                  set({ descriptionEs: e.target.value });
                  setAutoTranslated((f) => ({ ...f, es: false }));
                }}
                placeholder={w.basics.descriptionEsPlaceholder}
              />
              {autoTranslated.es && (
                <p className="mt-1 text-xs font-medium text-gold-700">
                  {w.basics.translateNote}
                </p>
              )}
              {translateFailed && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {w.basics.translateError}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2 — Category & Location */}
        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="wz-category">{w.catLoc.category}</Label>
              <Select
                id="wz-category"
                value={data.category}
                onChange={(e) => set({ category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {dict.categories[c]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="wz-country">{w.catLoc.country}</Label>
              <Select
                id="wz-country"
                value={data.countryCode}
                onChange={(e) => set({ countryCode: e.target.value })}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c[lang === "es" ? "es" : "en"]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="wz-region">{w.catLoc.region}</Label>
              <Input
                id="wz-region"
                value={data.region}
                onChange={(e) => set({ region: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="wz-city">{w.catLoc.city}</Label>
              <Input
                id="wz-city"
                value={data.city}
                onChange={(e) => set({ city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="wz-lat">{w.catLoc.lat}</Label>
              <Input
                id="wz-lat"
                type="number"
                step="any"
                value={data.lat}
                onChange={(e) => set({ lat: e.target.value })}
                placeholder="-23.65"
              />
            </div>
            <div>
              <Label htmlFor="wz-lng">{w.catLoc.lng}</Label>
              <Input
                id="wz-lng"
                type="number"
                step="any"
                value={data.lng}
                onChange={(e) => set({ lng: e.target.value })}
                placeholder="-70.40"
              />
              <p className="mt-1 text-xs text-navy-400">{w.catLoc.coordsHint}</p>
            </div>
            <div>
              <Label htmlFor="wz-stage">{w.catLoc.stage}</Label>
              <Select
                id="wz-stage"
                value={data.stage}
                onChange={(e) => set({ stage: e.target.value })}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {dict.stages[s]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="wz-deal">{w.catLoc.dealType}</Label>
              <Select
                id="wz-deal"
                value={data.dealType}
                onChange={(e) => set({ dealType: e.target.value })}
              >
                {DEAL_TYPES.map((d) => (
                  <option key={d} value={d}>
                    {dict.dealTypes[d]}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {/* Step 3 — Technical */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="wz-capacity">{w.technical.capacity}</Label>
                <Input
                  id="wz-capacity"
                  value={data.capacity}
                  onChange={(e) => set({ capacity: e.target.value })}
                  placeholder={w.technical.capacityPlaceholder}
                />
              </div>
              <div>
                <Label htmlFor="wz-production">{w.technical.production}</Label>
                <Input
                  id="wz-production"
                  value={data.production}
                  onChange={(e) => set({ production: e.target.value })}
                  placeholder={w.technical.productionPlaceholder}
                />
              </div>
              <div>
                <Label htmlFor="wz-workforce">{w.technical.workforce}</Label>
                <Input
                  id="wz-workforce"
                  type="number"
                  value={data.workforce}
                  onChange={(e) => set({ workforce: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="wz-area">{w.technical.area}</Label>
                <Input
                  id="wz-area"
                  type="number"
                  value={data.areaHectares}
                  onChange={(e) => set({ areaHectares: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="wz-permits">{w.technical.permits}</Label>
              <Input
                id="wz-permits"
                value={data.permits}
                onChange={(e) => set({ permits: e.target.value })}
                placeholder={w.technical.permitsPlaceholder}
              />
            </div>
            <div>
              <Label htmlFor="wz-highlights">{w.technical.highlights}</Label>
              <Textarea
                id="wz-highlights"
                rows={4}
                value={data.highlights}
                onChange={(e) => set({ highlights: e.target.value })}
              />
              <p className="mt-1 text-xs text-navy-400">{w.technical.highlightsHint}</p>
            </div>
            <div>
              <Label>{w.technical.specs}</Label>
              <p className="mb-2 text-xs text-navy-400">{w.technical.specsHint}</p>
              {data.specs.map((spec, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <Input
                    value={spec.label}
                    placeholder={w.technical.specLabel}
                    onChange={(e) => {
                      const specs = [...data.specs];
                      specs[i] = { ...specs[i], label: e.target.value };
                      set({ specs });
                    }}
                  />
                  <Input
                    value={spec.value}
                    placeholder={w.technical.specValue}
                    onChange={(e) => {
                      const specs = [...data.specs];
                      specs[i] = { ...specs[i], value: e.target.value };
                      set({ specs });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => set({ specs: data.specs.filter((_, j) => j !== i) })}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => set({ specs: [...data.specs, { label: "", value: "" }] })}
              >
                + {w.technical.addSpec}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4 — Financial */}
        {step === 3 && (
          <div className="space-y-5">
            <p className="rounded-lg bg-navy-50 px-4 py-3 text-sm text-navy-600">
              {w.financial.finHint}
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="wz-invmin">{w.financial.investmentMin}</Label>
                <Input
                  id="wz-invmin"
                  type="number"
                  value={data.investmentMin}
                  onChange={(e) => set({ investmentMin: e.target.value })}
                  placeholder="50000000"
                />
              </div>
              <div>
                <Label htmlFor="wz-invmax">{w.financial.investmentMax}</Label>
                <Input
                  id="wz-invmax"
                  type="number"
                  value={data.investmentMax}
                  onChange={(e) => set({ investmentMax: e.target.value })}
                  placeholder="80000000"
                />
              </div>
              <div>
                <Label htmlFor="wz-revenue">{w.financial.revenue}</Label>
                <Input
                  id="wz-revenue"
                  type="number"
                  value={data.revenue}
                  onChange={(e) => set({ revenue: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="wz-ebitda">{w.financial.ebitda}</Label>
                <Input
                  id="wz-ebitda"
                  type="number"
                  value={data.ebitda}
                  onChange={(e) => set({ ebitda: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5 — Media & Documents */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <Label htmlFor="wz-images">{w.media.images}</Label>
              <Textarea
                id="wz-images"
                rows={4}
                value={data.images}
                onChange={(e) => set({ images: e.target.value })}
                placeholder="https://images.unsplash.com/photo-…"
              />
              <p className="mt-1 text-xs text-navy-400">{w.media.imagesHint}</p>
            </div>
            <div>
              <Label>{w.media.documents}</Label>
              <p className="mb-2 text-xs text-navy-400">{w.media.docsHint}</p>
              {data.documents.map((doc, i) => (
                <div key={i} className="mb-2 grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
                  <Input
                    value={doc.name}
                    placeholder={w.media.docName}
                    onChange={(e) => {
                      const documents = [...data.documents];
                      documents[i] = { ...documents[i], name: e.target.value };
                      set({ documents });
                    }}
                  />
                  <Input
                    value={doc.url}
                    placeholder={w.media.docUrl}
                    onChange={(e) => {
                      const documents = [...data.documents];
                      documents[i] = { ...documents[i], url: e.target.value };
                      set({ documents });
                    }}
                  />
                  <label className="flex items-center gap-2 whitespace-nowrap text-xs font-medium text-navy-700">
                    <input
                      type="checkbox"
                      checked={doc.isConfidential}
                      onChange={(e) => {
                        const documents = [...data.documents];
                        documents[i] = { ...documents[i], isConfidential: e.target.checked };
                        set({ documents });
                      }}
                      className="h-4 w-4 rounded border-navy-300"
                    />
                    {w.media.docConfidential}
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      set({ documents: data.documents.filter((_, j) => j !== i) })
                    }
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  set({
                    documents: [
                      ...data.documents,
                      { name: "", url: "", isConfidential: false },
                    ],
                  })
                }
              >
                + {w.media.addDoc}
              </Button>
            </div>
          </div>
        )}

        {/* Step 6 — Review */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-navy-950">{w.review.title}</h2>
            <p className="text-sm text-navy-500">{w.review.hint}</p>
            <dl className="divide-y divide-navy-100 rounded-lg border border-navy-100">
              {[
                [w.basics.title, data.title],
                [
                  w.catLoc.category,
                  dict.categories[data.category as keyof typeof dict.categories],
                ],
                [
                  w.catLoc.country,
                  COUNTRIES.find((c) => c.code === data.countryCode)?.[
                    lang === "es" ? "es" : "en"
                  ] ?? data.countryCode,
                ],
                [w.catLoc.stage, dict.stages[data.stage as keyof typeof dict.stages]],
                [
                  w.catLoc.dealType,
                  dict.dealTypes[data.dealType as keyof typeof dict.dealTypes],
                ],
                [
                  dict.common.investmentRange,
                  [data.investmentMin, data.investmentMax].filter(Boolean).join(" – ") ||
                    dict.common.undisclosed,
                ],
                [w.media.images, String(toPayload(data, "draft").images.length)],
                [w.media.documents, String(toPayload(data, "draft").documents.length)],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[200px_1fr]">
                  <dt className="text-sm font-semibold text-navy-500">{label}</dt>
                  <dd className="text-sm text-navy-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 pt-6">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || busy}
          >
            ← {dict.common.back}
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => save("draft")} disabled={busy || !stepValid()}>
              {w.review.saveDraft}
            </Button>
            {step < steps.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={!stepValid() || busy}
              >
                {dict.common.next} →
              </Button>
            ) : (
              <Button variant="gold" onClick={() => save("submit")} disabled={busy || !stepValid()}>
                {busy ? dict.common.loading : w.review.submit}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
