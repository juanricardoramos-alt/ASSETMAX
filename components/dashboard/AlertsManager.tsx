"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n";
import { CATEGORIES, COUNTRIES, STAGES } from "@/lib/constants";
import { Button, Card, Input, Label, Select } from "@/components/ui";

export function AlertsManager({
  lang,
  dict,
  alerts,
}: {
  lang: string;
  dict: Dictionary;
  alerts: {
    id: string;
    name: string;
    category: string | null;
    country: string | null;
    stage: string | null;
    minInvestment: number | null;
  }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const t = dict.dashboard;

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        category: fd.get("category") || "",
        country: fd.get("country") || "",
        stage: fd.get("stage") || "",
        minInvestment: fd.get("minInvestment")
          ? Number(fd.get("minInvestment"))
          : null,
      }),
    });
    setBusy(false);
    if (res.ok) {
      (e.target as HTMLFormElement).reset?.();
      router.refresh();
    }
  }

  async function remove(id: string) {
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-4 font-bold text-navy-950">{t.newAlert.title}</h2>
        <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="al-name">{t.newAlert.name}</Label>
            <Input
              id="al-name"
              name="name"
              required
              minLength={3}
              placeholder={t.newAlert.namePlaceholder}
            />
          </div>
          <div>
            <Label htmlFor="al-category">{dict.common.category}</Label>
            <Select id="al-category" name="category" defaultValue="">
              <option value="">{dict.explorer.anyCategory}</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {dict.categories[c]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="al-country">{dict.common.country}</Label>
            <Select id="al-country" name="country" defaultValue="">
              <option value="">{dict.explorer.anyCountry}</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c[lang === "es" ? "es" : "en"]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="al-stage">{dict.common.stage}</Label>
            <Select id="al-stage" name="stage" defaultValue="">
              <option value="">{dict.explorer.anyStage}</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {dict.stages[s]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="al-min">{dict.common.investmentRange} (min USD)</Label>
            <Input id="al-min" name="minInvestment" type="number" placeholder="100000000" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="gold" disabled={busy}>
              {busy ? dict.common.loading : t.newAlert.create}
            </Button>
          </div>
        </form>
      </Card>

      {alerts.length === 0 ? (
        <Card className="p-10 text-center text-sm text-navy-500">{t.emptyAlerts}</Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <Card key={a.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="font-bold text-navy-950">{a.name}</p>
                <p className="mt-0.5 text-xs text-navy-400">
                  {[
                    a.category
                      ? dict.categories[a.category as keyof typeof dict.categories]
                      : null,
                    a.country,
                    a.stage ? dict.stages[a.stage as keyof typeof dict.stages] : null,
                    a.minInvestment ? `≥ $${(a.minInvestment / 1e6).toFixed(0)}M` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || dict.common.all}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => remove(a.id)}>
                {dict.common.delete}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
