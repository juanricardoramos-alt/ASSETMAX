"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import { COUNTRIES, INCOTERMS, TEMPLATE_KINDS, type TemplateKind } from "@/lib/constants";
import { Button, Card, Input, Label, Select } from "@/components/ui";
import { VortaTip } from "@/components/vorta/VortaTip";
import { cn } from "@/lib/utils";

type ProjectOption = { id: string; title: string; location: string; countryCode: string };

const COMMODITY_KINDS: TemplateKind[] = ["COMMODITY_SPA", "COMMODITY_SUPPLY"];
const INTERMEDIATION_KINDS: TemplateKind[] = ["INTERMEDIATION", "INTERMEDIATION_EXCLUSIVE"];

const num = (v: string): number | null => {
  const n = Number(v);
  return v.trim() !== "" && Number.isFinite(n) ? n : null;
};

export function TemplateGenerator({
  dict,
  lang,
  projects,
}: {
  dict: Dictionary;
  lang: Locale;
  projects: ProjectOption[];
}) {
  const t = dict.templates;
  const router = useRouter();
  const search = useSearchParams();
  const preselected = search.get("kind");
  const validPreselect = (TEMPLATE_KINDS as readonly string[]).includes(preselected ?? "")
    ? (preselected as TemplateKind)
    : null;

  const [step, setStep] = useState(validPreselect ? 1 : 0);
  const [kind, setKind] = useState<TemplateKind>(validPreselect ?? "NDA");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [d, setD] = useState({
    language: lang as "en" | "es",
    partyAName: "",
    partyACompany: "",
    partyBName: "",
    partyBCompany: "",
    projectId: "",
    assetTitle: "",
    assetLocation: "",
    jurisdictionCode: "CL",
    amount: "",
    equityPct: "",
    termMonths: "",
    exclusivityMonths: "",
    commodity: "",
    volume: "",
    incoterm: "FOB",
    priceDetails: "",
  });
  const set = (patch: Partial<typeof d>) => setD((x) => ({ ...x, ...patch }));

  const isCommodity = COMMODITY_KINDS.includes(kind);
  const isIntermediation = INTERMEDIATION_KINDS.includes(kind);

  const selectProject = (id: string) => {
    const p = projects.find((x) => x.id === id);
    set({
      projectId: id,
      assetTitle: p ? p.title : d.assetTitle,
      assetLocation: p ? p.location : d.assetLocation,
      jurisdictionCode: p ? p.countryCode : d.jurisdictionCode,
    });
  };

  const valid =
    d.partyAName.trim().length >= 2 &&
    (isIntermediation || d.partyBName.trim().length >= 2 || d.partyBCompany.trim().length >= 2) &&
    (d.projectId || d.assetTitle.trim().length >= 3 || isCommodity);

  async function generate() {
    setBusy(true);
    setFailed(false);
    setStep(2);
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        language: d.language,
        partyAName: d.partyAName.trim(),
        partyACompany: d.partyACompany.trim(),
        partyBName: d.partyBName.trim(),
        partyBCompany: d.partyBCompany.trim(),
        projectId: d.projectId,
        assetTitle: d.assetTitle.trim(),
        assetLocation: d.assetLocation.trim(),
        jurisdictionCode: d.jurisdictionCode,
        amount: num(d.amount),
        equityPct: num(d.equityPct),
        termMonths: num(d.termMonths),
        exclusivityMonths: num(d.exclusivityMonths),
        commodity: d.commodity.trim(),
        volume: d.volume.trim(),
        incoterm: d.incoterm,
        priceDetails: d.priceDetails.trim(),
      }),
    }).catch(() => null);

    if (res?.ok) {
      const { id } = (await res.json()) as { id: string };
      window.dispatchEvent(new Event("vorta:celebrate"));
      router.push(`/${lang}/dashboard/templates/${id}`);
    } else {
      setBusy(false);
      setFailed(true);
      setStep(1);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">{t.title}</h1>

      {/* Step indicator */}
      <ol className="flex flex-wrap gap-2">
        {t.steps.map((label, i) => (
          <li key={label}>
            <button
              onClick={() => i < step && !busy && setStep(i)}
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
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ol>

      {t.kinds && step < 2 && (
        <VortaTip
          id={`templates-${step}`}
          text={dict.vorta.tips.templates[step]}
          dismissLabel={dict.vorta.tipDismiss}
        />
      )}

      {/* Step 1 — choose template */}
      {step === 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_KINDS.map((k) => (
            <button
              key={k}
              onClick={() => {
                setKind(k);
                setStep(1);
              }}
              className={cn(
                "rounded-xl border bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-card-hover",
                kind === k ? "border-gold-400" : "border-navy-100"
              )}
            >
              <p className="font-bold leading-snug text-navy-950">{t.kinds[k].name}</p>
              <p className="mt-1 text-xs leading-relaxed text-navy-500">{t.kinds[k].when}</p>
            </button>
          ))}
        </div>
      )}

      {/* Step 2 — details form */}
      {step === 1 && (
        <Card className="space-y-6 p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-navy-400">
                {t.steps[0]}
              </p>
              <p className="text-lg font-bold text-navy-950">{t.kinds[kind].name}</p>
            </div>
            <div>
              <Label htmlFor="tg-lang">{t.form.language}</Label>
              <Select
                id="tg-lang"
                value={d.language}
                onChange={(e) => set({ language: e.target.value as "en" | "es" })}
              >
                <option value="en">{t.form.languageEn}</option>
                <option value="es">{t.form.languageEs}</option>
              </Select>
            </div>
          </div>

          {/* Parties */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-4 rounded-lg border border-navy-100 p-4">
              <p className="text-sm font-bold text-navy-900">{t.form.partyA}</p>
              <div>
                <Label htmlFor="tg-a-name">{t.form.name} *</Label>
                <Input
                  id="tg-a-name"
                  value={d.partyAName}
                  onChange={(e) => set({ partyAName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tg-a-company">{t.form.company}</Label>
                <Input
                  id="tg-a-company"
                  value={d.partyACompany}
                  onChange={(e) => set({ partyACompany: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-4 rounded-lg border border-navy-100 p-4">
              <p className="text-sm font-bold text-navy-900">{t.form.partyB}</p>
              {isIntermediation ? (
                <p className="rounded-lg bg-navy-50 px-3 py-2.5 text-sm text-navy-600">
                  {t.form.intermediaryNote}
                </p>
              ) : (
                <>
                  <div>
                    <Label htmlFor="tg-b-name">{t.form.name} *</Label>
                    <Input
                      id="tg-b-name"
                      value={d.partyBName}
                      onChange={(e) => set({ partyBName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tg-b-company">{t.form.company}</Label>
                    <Input
                      id="tg-b-company"
                      value={d.partyBCompany}
                      onChange={(e) => set({ partyBCompany: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Asset */}
          <div className="grid gap-5 sm:grid-cols-2">
            {projects.length > 0 && !isCommodity && (
              <div className="sm:col-span-2">
                <Label htmlFor="tg-project">{t.form.project}</Label>
                <Select
                  id="tg-project"
                  value={d.projectId}
                  onChange={(e) => selectProject(e.target.value)}
                >
                  <option value="">{t.form.projectNone}</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            {!isCommodity && (
              <>
                <div>
                  <Label htmlFor="tg-asset">{t.form.assetTitle} *</Label>
                  <Input
                    id="tg-asset"
                    value={d.assetTitle}
                    onChange={(e) => set({ assetTitle: e.target.value, projectId: "" })}
                  />
                </div>
                <div>
                  <Label htmlFor="tg-location">{t.form.assetLocation}</Label>
                  <Input
                    id="tg-location"
                    value={d.assetLocation}
                    onChange={(e) => set({ assetLocation: e.target.value })}
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="tg-jurisdiction">{t.form.jurisdiction}</Label>
              <Select
                id="tg-jurisdiction"
                value={d.jurisdictionCode}
                onChange={(e) => set({ jurisdictionCode: e.target.value })}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {lang === "es" ? c.es : c.en}
                  </option>
                ))}
              </Select>
            </div>

            {/* Kind-specific numbers */}
            {["LOI", "SPA", "MOU", "JV"].includes(kind) && (
              <div>
                <Label htmlFor="tg-amount">{t.form.amount}</Label>
                <Input
                  id="tg-amount"
                  type="number"
                  value={d.amount}
                  onChange={(e) => set({ amount: e.target.value })}
                  placeholder="135000000"
                />
              </div>
            )}
            {kind === "JV" && (
              <div>
                <Label htmlFor="tg-equity">{t.form.equityPct}</Label>
                <Input
                  id="tg-equity"
                  type="number"
                  value={d.equityPct}
                  onChange={(e) => set({ equityPct: e.target.value })}
                  placeholder="50"
                />
              </div>
            )}
            {(isIntermediation || kind === "COMMODITY_SUPPLY") && (
              <div>
                <Label htmlFor="tg-term">{t.form.termMonths}</Label>
                <Input
                  id="tg-term"
                  type="number"
                  value={d.termMonths}
                  onChange={(e) => set({ termMonths: e.target.value })}
                  placeholder="12"
                />
              </div>
            )}
            {kind === "INTERMEDIATION_EXCLUSIVE" && (
              <div>
                <Label htmlFor="tg-excl">{t.form.exclusivityMonths}</Label>
                <Input
                  id="tg-excl"
                  type="number"
                  value={d.exclusivityMonths}
                  onChange={(e) => set({ exclusivityMonths: e.target.value })}
                  placeholder="6"
                />
              </div>
            )}
            {isCommodity && (
              <>
                <div>
                  <Label htmlFor="tg-commodity">{t.form.commodity} *</Label>
                  <Input
                    id="tg-commodity"
                    value={d.commodity}
                    onChange={(e) => set({ commodity: e.target.value, assetTitle: e.target.value })}
                    placeholder={t.form.commodityPlaceholder}
                  />
                </div>
                <div>
                  <Label htmlFor="tg-volume">{t.form.volume}</Label>
                  <Input
                    id="tg-volume"
                    value={d.volume}
                    onChange={(e) => set({ volume: e.target.value })}
                    placeholder="2,000 t/month"
                  />
                </div>
                <div>
                  <Label htmlFor="tg-incoterm">{t.form.incoterm}</Label>
                  <Select
                    id="tg-incoterm"
                    value={d.incoterm}
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
                  <Label htmlFor="tg-price">{t.form.priceDetails}</Label>
                  <Input
                    id="tg-price"
                    value={d.priceDetails}
                    onChange={(e) => set({ priceDetails: e.target.value })}
                    placeholder={t.form.priceDetailsPlaceholder}
                  />
                </div>
              </>
            )}
          </div>

          {failed && <p className="text-sm font-medium text-red-600">{dict.common.error}</p>}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 pt-5">
            <Button variant="outline" onClick={() => setStep(0)} disabled={busy}>
              ← {dict.common.back}
            </Button>
            <Button variant="gold" onClick={generate} disabled={!valid || busy}>
              {busy ? t.form.generating : t.form.generate}
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3 — generating */}
      {step === 2 && (
        <Card className="flex flex-col items-center gap-4 p-14 text-center">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="vorta-dot h-2 w-2 rounded-full bg-gold-500"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-navy-600">{t.form.generating}</p>
        </Card>
      )}
    </div>
  );
}
