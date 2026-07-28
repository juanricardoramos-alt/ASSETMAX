"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n";
import { COUNTRIES, SUPPLIER_CATEGORIES } from "@/lib/constants";
import { Button, Card, Input, Label, Select, Textarea } from "@/components/ui";

export type NeedFormData = {
  title: string;
  description: string;
  category: string;
  kind: string;
  countryCode: string;
  city: string;
  budgetMin: string;
  budgetMax: string;
  deadline: string;
  requirements: string;
};

function num(v: string): number | null {
  const n = Number(v);
  return v.trim() !== "" && Number.isFinite(n) ? n : null;
}

export function NeedForm({
  lang,
  dict,
  needId,
  initialData,
}: {
  lang: string;
  dict: Dictionary;
  needId?: string;
  initialData?: NeedFormData;
}) {
  const router = useRouter();
  const t = dict.needs.form;
  const [data, setData] = useState<NeedFormData>(
    initialData ?? {
      title: "",
      description: "",
      category: SUPPLIER_CATEGORIES[0],
      kind: "STANDARD",
      countryCode: COUNTRIES[0].code,
      city: "",
      budgetMin: "",
      budgetMax: "",
      deadline: "",
      requirements: "",
    }
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const set = (key: keyof NeedFormData) => (value: string) =>
    setData((d) => ({ ...d, [key]: value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const res = await fetch(needId ? `/api/needs/${needId}` : "/api/needs", {
      method: needId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        category: data.kind === "EPC_TENDER" ? "epc" : data.category,
        kind: data.kind,
        countryCode: data.countryCode,
        city: data.city,
        budgetMin: num(data.budgetMin),
        budgetMax: num(data.budgetMax),
        deadline: data.deadline,
        requirements: data.requirements
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean)
          .slice(0, 20),
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError(true);
      return;
    }
    router.push(`/${lang}/dashboard/needs`);
    router.refresh();
  }

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <Label htmlFor="nd-title">{t.title}</Label>
          <Input
            id="nd-title"
            required
            minLength={5}
            maxLength={200}
            placeholder={t.titlePlaceholder}
            value={data.title}
            onChange={(e) => set("title")(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="nd-desc">{t.description}</Label>
          <Textarea
            id="nd-desc"
            required
            minLength={20}
            maxLength={8000}
            rows={6}
            placeholder={t.descriptionPlaceholder}
            value={data.description}
            onChange={(e) => set("description")(e.target.value)}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy-200 bg-navy-50/50 p-4">
          <input
            type="checkbox"
            checked={data.kind === "EPC_TENDER"}
            onChange={(e) =>
              set("kind")(e.target.checked ? "EPC_TENDER" : "STANDARD")
            }
            className="mt-0.5 h-4 w-4 rounded border-navy-300 text-navy-900 focus:ring-navy-500"
          />
          <span>
            <span className="block text-sm font-semibold text-navy-900">
              {dict.tenders.formToggle}
            </span>
            <span className="mt-0.5 block text-xs text-navy-500">
              {dict.tenders.formToggleHint}
            </span>
          </span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="nd-category">{t.category}</Label>
            <Select
              id="nd-category"
              value={data.kind === "EPC_TENDER" ? "epc" : data.category}
              disabled={data.kind === "EPC_TENDER"}
              onChange={(e) => set("category")(e.target.value)}
            >
              {SUPPLIER_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {dict.supplierCategories[c]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="nd-country">{t.country}</Label>
            <Select
              id="nd-country"
              value={data.countryCode}
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
            <Label htmlFor="nd-city">
              {t.city}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="nd-city"
              maxLength={120}
              value={data.city}
              onChange={(e) => set("city")(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="nd-deadline">
              {t.deadline}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="nd-deadline"
              type="date"
              value={data.deadline}
              onChange={(e) => set("deadline")(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="nd-bmin">
              {t.budgetMin}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="nd-bmin"
              type="number"
              min={0}
              value={data.budgetMin}
              onChange={(e) => set("budgetMin")(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="nd-bmax">
              {t.budgetMax}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="nd-bmax"
              type="number"
              min={0}
              value={data.budgetMax}
              onChange={(e) => set("budgetMax")(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="nd-reqs">
            {t.requirements}{" "}
            <span className="text-navy-400">({dict.common.optional})</span>
          </Label>
          <Textarea
            id="nd-reqs"
            rows={4}
            value={data.requirements}
            onChange={(e) => set("requirements")(e.target.value)}
          />
          <p className="mt-1 text-xs text-navy-400">{t.requirementsHint}</p>
        </div>

        {error && (
          <p className="text-sm font-medium text-red-600">{dict.common.error}</p>
        )}

        <Button type="submit" variant="gold" disabled={busy}>
          {busy ? dict.common.loading : needId ? t.save : t.publish}
        </Button>
      </form>
    </Card>
  );
}
