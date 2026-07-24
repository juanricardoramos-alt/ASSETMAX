"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { COMMODITIES, INCOTERMS, COUNTRIES, PERIODICITIES, PRICE_TYPES } from "@/lib/constants";
import type { IngestResult } from "@/app/api/ai/ingest/route";
import { Button, Card, Input, Label, Select, Textarea } from "@/components/ui";
import { IconCheck } from "@/components/icons";
import { VortaTip } from "@/components/vorta/VortaTip";

export type CommodityFormData = {
  side: string;
  commodity: string;
  title: string;
  description: string;
  descriptionEs: string;
  specs: { label: string; value: string }[];
  volume: string;
  periodicity: string;
  originCode: string;
  destinationCode: string;
  incoterm: string;
  deliveryLocation: string;
  priceType: string;
  priceDetails: string;
  validUntil: string;
  documents: { name: string; url: string; isConfidential: boolean }[];
};

export const emptyCommodity: CommodityFormData = {
  side: "SELL",
  commodity: "copper_cathodes",
  title: "",
  description: "",
  descriptionEs: "",
  specs: [],
  volume: "",
  periodicity: "spot",
  originCode: "CL",
  destinationCode: "",
  incoterm: "FOB",
  deliveryLocation: "",
  priceType: "indexed",
  priceDetails: "",
  validUntil: "",
  documents: [],
};

export function CommodityForm({
  lang,
  dict,
  listingId,
  initialData,
  aiIngestEnabled,
}: {
  lang: string;
  dict: Dictionary;
  listingId?: string;
  initialData?: CommodityFormData;
  aiIngestEnabled: boolean;
}) {
  const [data, setData] = useState<CommodityFormData>(initialData ?? emptyCommodity);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [ingesting, setIngesting] = useState(false);
  const [translating, setTranslating] = useState<"en" | "es" | null>(null);
  const [autoTranslated, setAutoTranslated] = useState<{ en: boolean; es: boolean }>({
    en: false,
    es: false,
  });
  const [translateFailed, setTranslateFailed] = useState(false);

  const c = dict.commodities;
  const f = c.form;
  const set = (patch: Partial<CommodityFormData>) => setData((d) => ({ ...d, ...patch }));

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
      if (!res.ok) throw new Error();
      const { translation } = (await res.json()) as { translation: string };
      setData((d) =>
        target === "es" ? { ...d, descriptionEs: translation } : { ...d, description: translation }
      );
      setAutoTranslated((t) => ({ ...t, [target]: true }));
    } catch {
      setTranslateFailed(true);
    } finally {
      setTranslating(null);
    }
  }

  async function runIngest() {
    if (!file) return;
    setIngesting(true);
    setError(false);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("mode", "commodity");
    try {
      const res = await fetch("/api/ai/ingest", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { result } = (await res.json()) as { result: IngestResult };
      set({
        title: result.title ?? data.title,
        description: result.description_en ?? data.description,
        descriptionEs: result.description_es ?? data.descriptionEs,
        commodity:
          result.commodity && (COMMODITIES as readonly string[]).includes(result.commodity)
            ? result.commodity
            : data.commodity,
        originCode:
          result.countryCode && COUNTRIES.some((x) => x.code === result.countryCode)
            ? result.countryCode
            : data.originCode,
        volume: result.volume ?? data.volume,
        incoterm:
          result.incoterm && (INCOTERMS as readonly string[]).includes(result.incoterm)
            ? result.incoterm
            : data.incoterm,
        priceDetails: result.priceDetails ?? data.priceDetails,
        specs: result.specs?.length ? result.specs : data.specs,
      });
    } catch {
      setError(true);
    } finally {
      setIngesting(false);
    }
  }

  async function save(action: "draft" | "submit") {
    setBusy(true);
    setError(false);
    const payload = {
      action,
      side: data.side,
      commodity: data.commodity,
      title: data.title.trim(),
      description: data.description.trim(),
      descriptionEs: data.descriptionEs.trim(),
      specs: data.specs.filter((s) => s.label.trim() && s.value.trim()),
      volume: data.volume.trim(),
      periodicity: data.periodicity,
      originCode: data.side === "SELL" ? data.originCode : "",
      destinationCode: data.side === "BUY" ? data.destinationCode : "",
      incoterm: data.incoterm,
      deliveryLocation: data.deliveryLocation.trim(),
      priceType: data.priceType,
      priceDetails: data.priceDetails.trim(),
      validUntil: data.validUntil ? new Date(data.validUntil).toISOString() : null,
      documents: data.documents.filter((d) => d.name.trim() && /^https?:\/\//.test(d.url)),
    };
    const res = await fetch(listingId ? `/api/commodities/${listingId}` : "/api/commodities", {
      method: listingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (res.ok) {
      setSubmitted(true);
      window.dispatchEvent(new Event("vorta:celebrate"));
    }
    else setError(true);
  }

  const valid =
    data.title.trim().length >= 5 &&
    data.description.trim().length >= 20 &&
    data.volume.trim().length >= 2;

  if (submitted) {
    return (
      <Card className="mx-auto max-w-xl p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <IconCheck className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-navy-950">{f.submittedTitle}</h1>
        <p className="mt-3 text-sm leading-relaxed text-navy-500">{f.submittedText}</p>
        <Link
          href={`/${lang}/dashboard/commodities`}
          className="mt-7 inline-flex rounded-md bg-navy-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-800"
        >
          {c.myListings}
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">
        {listingId ? c.editListing : c.newListing}
      </h1>

      <VortaTip
        id="commodity-form"
        text={dict.vorta.tips.commodity}
        dismissLabel={dict.vorta.tipDismiss}
      />

      {/* AI ingestion */}
      {!listingId && (
        <Card className="border-gold-200 bg-gold-50/40 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-navy-950">{dict.ai.wizard.uploadTitle}</h2>
            <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold text-gold-800 ring-1 ring-gold-300">
              {dict.ai.poweredBy}
            </span>
          </div>
          {aiIngestEnabled ? (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label htmlFor="cf-ai-file">{dict.ai.wizard.fileLabel}</Label>
                <Input
                  id="cf-ai-file"
                  type="file"
                  accept=".pdf,.docx,.xlsx,.xls,.csv,.txt,.md"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <Button variant="primary" size="sm" disabled={!file || ingesting} onClick={runIngest}>
                {ingesting ? dict.ai.wizard.processing : dict.ai.wizard.uploadCta}
              </Button>
            </div>
          ) : (
            <p className="mt-2 rounded-lg bg-white px-4 py-3 text-xs leading-relaxed text-navy-500">
              {dict.ai.disabledNote}
            </p>
          )}
        </Card>
      )}

      <Card className="space-y-6 p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="cf-side">{f.side}</Label>
            <Select id="cf-side" value={data.side} onChange={(e) => set({ side: e.target.value })}>
              <option value="SELL">{f.sideSell}</option>
              <option value="BUY">{f.sideBuy}</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="cf-commodity">{f.commodity}</Label>
            <Select
              id="cf-commodity"
              value={data.commodity}
              onChange={(e) => set({ commodity: e.target.value })}
            >
              {COMMODITIES.map((k) => (
                <option key={k} value={k}>
                  {c.names[k]}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="cf-title">{f.title} *</Label>
          <Input
            id="cf-title"
            value={data.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder={f.titlePlaceholder}
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="cf-desc" className="mb-0">
              {f.description} *
            </Label>
            {aiIngestEnabled && data.descriptionEs.trim().length >= 20 && (
              <Button
                variant="outline"
                size="sm"
                disabled={!!translating}
                onClick={() => translateDescription("en")}
              >
                ✦ {translating === "en" ? dict.wizard.basics.translating : dict.wizard.basics.translateCta}
              </Button>
            )}
          </div>
          <Textarea
            id="cf-desc"
            rows={6}
            className="mt-1.5"
            value={data.description}
            onChange={(e) => {
              set({ description: e.target.value });
              setAutoTranslated((t) => ({ ...t, en: false }));
            }}
          />
          {autoTranslated.en && (
            <p className="mt-1 text-xs font-medium text-gold-700">
              {dict.wizard.basics.translateNote}
            </p>
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="cf-desc-es" className="mb-0">
              {f.descriptionEs}{" "}
              <span className="font-normal text-navy-400">
                ({dict.wizard.basics.optionalTag})
              </span>
            </Label>
            {aiIngestEnabled && data.description.trim().length >= 20 && (
              <Button
                variant="outline"
                size="sm"
                disabled={!!translating}
                onClick={() => translateDescription("es")}
              >
                ✦ {translating === "es" ? dict.wizard.basics.translating : dict.wizard.basics.translateCta}
              </Button>
            )}
          </div>
          <Textarea
            id="cf-desc-es"
            rows={6}
            className="mt-1.5"
            value={data.descriptionEs}
            onChange={(e) => {
              set({ descriptionEs: e.target.value });
              setAutoTranslated((t) => ({ ...t, es: false }));
            }}
            placeholder={dict.wizard.basics.descriptionEsPlaceholder}
          />
          {autoTranslated.es && (
            <p className="mt-1 text-xs font-medium text-gold-700">
              {dict.wizard.basics.translateNote}
            </p>
          )}
          {translateFailed && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {dict.wizard.basics.translateError}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="cf-volume">{f.volume} *</Label>
            <Input
              id="cf-volume"
              value={data.volume}
              onChange={(e) => set({ volume: e.target.value })}
              placeholder={f.volumePlaceholder}
            />
          </div>
          <div>
            <Label htmlFor="cf-periodicity">{f.periodicity}</Label>
            <Select
              id="cf-periodicity"
              value={data.periodicity}
              onChange={(e) => set({ periodicity: e.target.value })}
            >
              {PERIODICITIES.map((p) => (
                <option key={p} value={p}>
                  {p === "spot" ? c.spot : c.contract}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="cf-incoterm">{f.incoterm}</Label>
            <Select
              id="cf-incoterm"
              value={data.incoterm}
              onChange={(e) => set({ incoterm: e.target.value })}
            >
              {INCOTERMS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="cf-geo">
              {data.side === "SELL" ? f.origin : f.destination}
            </Label>
            <Select
              id="cf-geo"
              value={data.side === "SELL" ? data.originCode : data.destinationCode}
              onChange={(e) =>
                set(
                  data.side === "SELL"
                    ? { originCode: e.target.value }
                    : { destinationCode: e.target.value }
                )
              }
            >
              {COUNTRIES.map((co) => (
                <option key={co.code} value={co.code}>
                  {co[lang === "es" ? "es" : "en"]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="cf-delivery">{f.delivery}</Label>
            <Input
              id="cf-delivery"
              value={data.deliveryLocation}
              onChange={(e) => set({ deliveryLocation: e.target.value })}
              placeholder={f.deliveryPlaceholder}
            />
          </div>
          <div>
            <Label htmlFor="cf-valid">{f.validUntil}</Label>
            <Input
              id="cf-valid"
              type="date"
              value={data.validUntil}
              onChange={(e) => set({ validUntil: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
          <div>
            <Label htmlFor="cf-pricetype">{f.priceType}</Label>
            <Select
              id="cf-pricetype"
              value={data.priceType}
              onChange={(e) => set({ priceType: e.target.value })}
            >
              {PRICE_TYPES.map((p) => (
                <option key={p} value={p}>
                  {p === "fixed" ? c.priceFixed : c.priceIndexed}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="cf-pricedetails">{f.priceDetails}</Label>
            <Input
              id="cf-pricedetails"
              value={data.priceDetails}
              onChange={(e) => set({ priceDetails: e.target.value })}
              placeholder={f.priceDetailsPlaceholder}
            />
          </div>
        </div>

        {/* Specs */}
        <div>
          <Label>{f.specs}</Label>
          <p className="mb-2 text-xs text-navy-400">{f.specsHint}</p>
          {data.specs.map((spec, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <Input
                value={spec.label}
                placeholder={dict.wizard.technical.specLabel}
                onChange={(e) => {
                  const specs = [...data.specs];
                  specs[i] = { ...specs[i], label: e.target.value };
                  set({ specs });
                }}
              />
              <Input
                value={spec.value}
                placeholder={dict.wizard.technical.specValue}
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
            + {dict.wizard.technical.addSpec}
          </Button>
        </div>

        {/* Documents */}
        <div>
          <Label>{f.docs}</Label>
          <p className="mb-2 text-xs text-navy-400">{c.docsNote}</p>
          {data.documents.map((doc, i) => (
            <div key={i} className="mb-2 grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
              <Input
                value={doc.name}
                placeholder={dict.wizard.media.docName}
                onChange={(e) => {
                  const documents = [...data.documents];
                  documents[i] = { ...documents[i], name: e.target.value };
                  set({ documents });
                }}
              />
              <Input
                value={doc.url}
                placeholder={dict.wizard.media.docUrl}
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
                {dict.wizard.media.docConfidential}
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => set({ documents: data.documents.filter((_, j) => j !== i) })}
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
                documents: [...data.documents, { name: "", url: "", isConfidential: false }],
              })
            }
          >
            + {dict.wizard.media.addDoc}
          </Button>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{dict.common.error}</p>}

        <div className="flex flex-wrap justify-end gap-3 border-t border-navy-100 pt-5">
          <Button variant="ghost" onClick={() => save("draft")} disabled={busy || !valid}>
            {dict.wizard.review.saveDraft}
          </Button>
          <Button variant="gold" onClick={() => save("submit")} disabled={busy || !valid}>
            {busy ? dict.common.loading : dict.wizard.review.submit}
          </Button>
        </div>
      </Card>
    </div>
  );
}
