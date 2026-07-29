"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { CATEGORIES, COUNTRIES, STAGES, SUPPLIER_CATEGORIES, countryName } from "@/lib/constants";
import type { InvestorMatch, ScoreComponent, SupplierMatch } from "@/lib/live-matching";
import { formatInvestmentRange } from "@/lib/utils";
import { Badge, Button, Card, Input, Label, Select, VerifiedBadge } from "@/components/ui";
import { IconBuilding, IconMapPin } from "@/components/icons";

type Results = { investors: InvestorMatch[]; suppliers: SupplierMatch[] };

function ScoreDial({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center">
      <span className="font-display text-3xl font-bold text-gold-600">
        {score}
        <span className="text-base">%</span>
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
        {label}
      </span>
    </div>
  );
}

function Breakdown({
  components,
  dict,
}: {
  components: ScoreComponent[];
  dict: Dictionary;
}) {
  return (
    <div className="mt-4 space-y-1.5 border-t border-navy-100 pt-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
        {dict.liveMatching.breakdownTitle}
      </p>
      {components.map((c) => (
        <div key={c.key} className="flex items-center gap-2">
          <span className="w-36 shrink-0 text-xs font-medium text-navy-600">
            {dict.liveMatching.components[c.key]}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-100">
            <div
              className="h-full rounded-full bg-gold-500"
              style={{ width: `${(c.points / c.max) * 100}%` }}
            />
          </div>
          <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-navy-700">
            {c.points}/{c.max}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LiveMatchingTool({
  lang,
  dict,
}: {
  lang: string;
  dict: Dictionary;
}) {
  const t = dict.liveMatching;
  const [form, setForm] = useState({
    title: "",
    category: "mining",
    countryCode: "CL",
    amount: "",
    stage: STAGES[0] as string,
    supplierCategory: SUPPLIER_CATEGORIES[0] as string,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const amountNum = Number(form.amount);
    const res = await fetch("/api/matching/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        category: form.category,
        countryCode: form.countryCode,
        amount:
          form.amount.trim() !== "" && Number.isFinite(amountNum)
            ? amountNum
            : null,
        stage: form.stage,
        supplierCategory: form.supplierCategory,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError(true);
      return;
    }
    setResults(await res.json());
  }

  const topScore = results
    ? Math.max(
        0,
        ...results.investors.map((i) => i.score),
        ...results.suppliers.map((s) => s.score)
      )
    : 0;

  return (
    <div className="space-y-8">
      {/* Input form */}
      <Card data-vorta-tour="form" className="p-6 sm:p-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
          {t.formTitle}
        </h2>
        <form onSubmit={onSubmit} className="mt-5 space-y-5">
          <div>
            <Label htmlFor="lm-title">{t.fields.title}</Label>
            <Input
              id="lm-title"
              required
              minLength={3}
              maxLength={200}
              placeholder={t.fields.titlePlaceholder}
              value={form.title}
              onChange={(e) => set("title")(e.target.value)}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <Label htmlFor="lm-category">{t.fields.category}</Label>
              <Select
                id="lm-category"
                value={form.category}
                onChange={(e) => set("category")(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {dict.categories[c]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="lm-country">{t.fields.country}</Label>
              <Select
                id="lm-country"
                value={form.countryCode}
                onChange={(e) => set("countryCode")(e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c[lang === "es" ? "es" : "en"]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="lm-amount">{t.fields.amount}</Label>
              <Input
                id="lm-amount"
                type="number"
                min={0}
                placeholder="120000000"
                value={form.amount}
                onChange={(e) => set("amount")(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lm-stage">{t.fields.stage}</Label>
              <Select
                id="lm-stage"
                value={form.stage}
                onChange={(e) => set("stage")(e.target.value)}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {dict.stages[s]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="lm-supcat">{t.fields.supplierCategory}</Label>
              <Select
                id="lm-supcat"
                value={form.supplierCategory}
                onChange={(e) => set("supplierCategory")(e.target.value)}
              >
                {SUPPLIER_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {dict.supplierCategories[c]}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {error && (
            <p className="text-sm font-medium text-red-600">{dict.common.error}</p>
          )}
          <Button type="submit" variant="gold" size="lg" disabled={busy}>
            {busy ? t.searching : t.cta}
          </Button>
        </form>
      </Card>

      {/* Results */}
      {results && (
        <>
          {/* Metrics strip */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 rounded-xl border border-navy-100 bg-navy-950 px-6 py-4">
            <p className="text-sm text-navy-200">
              <span className="font-display text-2xl font-bold text-white">
                {results.investors.length}
              </span>{" "}
              {t.investorsFound}
            </p>
            <p className="text-sm text-navy-200">
              <span className="font-display text-2xl font-bold text-white">
                {results.suppliers.length}
              </span>{" "}
              {t.suppliersFound}
            </p>
            {topScore > 0 && (
              <p className="text-sm text-navy-200">
                <span className="font-display text-2xl font-bold text-gold-400">
                  {topScore}%
                </span>{" "}
                {t.topScore}
              </p>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Investors column */}
            <section data-vorta-tour="investors">
              <h2 className="mb-4 text-xl font-extrabold tracking-tight text-navy-950">
                {t.investorsTitle}
              </h2>
              {results.investors.length === 0 ? (
                <div className="rounded-xl border border-dashed border-navy-200 bg-white p-10 text-center text-sm text-navy-500">
                  {t.noInvestors}
                </div>
              ) : (
                <div className="space-y-4">
                  {results.investors.map((m) => (
                    <Card key={m.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                              <IconBuilding className="h-5 w-5" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-navy-950">
                                {m.investorLabel ?? t.confidentialMandate}
                              </p>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                                {t.viaMandate}
                              </p>
                            </div>
                          </div>
                          <p className="mt-2.5 text-sm font-semibold leading-snug text-navy-800">
                            {m.mandateTitle}
                          </p>
                          <p className="mt-1 text-xs font-medium text-navy-500">
                            {t.ticket}:{" "}
                            {formatInvestmentRange(m.ticketMin, m.ticketMax)}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {m.categories.map((c) => (
                              <Badge key={c} className="bg-navy-900 text-white">
                                {dict.categories[
                                  c as keyof typeof dict.categories
                                ] ?? c}
                              </Badge>
                            ))}
                            {m.countries.map((c) => (
                              <Badge
                                key={c}
                                className="bg-navy-50 text-navy-600 ring-1 ring-navy-200"
                              >
                                {countryName(c, lang as "en" | "es")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <ScoreDial score={m.score} label={t.compatibility} />
                      </div>
                      <Breakdown components={m.components} dict={dict} />
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Suppliers column */}
            <section data-vorta-tour="suppliers">
              <h2 className="mb-4 text-xl font-extrabold tracking-tight text-navy-950">
                {t.suppliersTitle}
              </h2>
              {results.suppliers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-navy-200 bg-white p-10 text-center text-sm text-navy-500">
                  {t.noSuppliers}
                </div>
              ) : (
                <div className="space-y-4">
                  {results.suppliers.map((s) => (
                    <Card key={s.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/${lang}/suppliers/${s.slug}`}
                              className="text-sm font-bold text-navy-950 hover:text-gold-600"
                            >
                              {s.name}
                            </Link>
                            {s.verified && (
                              <VerifiedBadge
                                label={dict.suppliers.qualifiedBadge}
                              />
                            )}
                          </div>
                          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-600">
                            {dict.supplierCategories[
                              s.category as keyof typeof dict.supplierCategories
                            ] ?? s.category}
                          </p>
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-navy-500">
                            <IconMapPin className="h-3.5 w-3.5 text-gold-500" />
                            {s.city ? `${s.city}, ` : ""}
                            {countryName(s.countryCode, lang as "en" | "es")}
                          </p>
                          {s.capacity && (
                            <p className="mt-1 text-xs text-navy-500">
                              {dict.suppliers.capacity}: {s.capacity}
                            </p>
                          )}
                          {s.certifications.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {s.certifications.slice(0, 3).map((c) => (
                                <Badge
                                  key={c}
                                  className="bg-navy-50 text-navy-600 ring-1 ring-navy-200"
                                >
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <ScoreDial score={s.score} label={t.compatibility} />
                      </div>
                      <Breakdown components={s.components} dict={dict} />
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          <p className="text-xs leading-relaxed text-navy-400">{t.methodology}</p>
        </>
      )}
    </div>
  );
}
