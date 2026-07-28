"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n";
import { COUNTRIES, SUPPLIER_CATEGORIES } from "@/lib/constants";
import { Button, Card, Input, Label, Select, Textarea } from "@/components/ui";
import { IconCheck } from "@/components/icons";

export type SupplierFormData = {
  name: string;
  description: string;
  category: string;
  countryCode: string;
  city: string;
  website: string;
  employees: string;
  yearsActive: string;
  certifications: string;
  portfolio: string;
  capacity: string;
};

function num(v: string): number | null {
  const n = Number(v);
  return v.trim() !== "" && Number.isFinite(n) ? n : null;
}

function lines(v: string, max: number): string[] {
  return v
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, max);
}

export function SupplierProfileForm({
  lang,
  dict,
  exists,
  initialData,
}: {
  lang: string;
  dict: Dictionary;
  exists: boolean;
  initialData?: SupplierFormData;
}) {
  const router = useRouter();
  const t = dict.suppliers.panel.form;
  const [data, setData] = useState<SupplierFormData>(
    initialData ?? {
      name: "",
      description: "",
      category: SUPPLIER_CATEGORIES[0],
      countryCode: COUNTRIES[0].code,
      city: "",
      website: "",
      employees: "",
      yearsActive: "",
      certifications: "",
      portfolio: "",
      capacity: "",
    }
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof SupplierFormData) => (value: string) =>
    setData((d) => ({ ...d, [key]: value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    setSaved(false);
    const res = await fetch("/api/supplier", {
      method: exists ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        category: data.category,
        countryCode: data.countryCode,
        city: data.city,
        website: data.website,
        employees: num(data.employees),
        yearsActive: num(data.yearsActive),
        certifications: lines(data.certifications, 20),
        portfolio: lines(data.portfolio, 20),
        capacity: data.capacity,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError(true);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="sp-name">{t.name}</Label>
            <Input
              id="sp-name"
              required
              minLength={2}
              maxLength={160}
              value={data.name}
              onChange={(e) => set("name")(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sp-category">{t.category}</Label>
            <Select
              id="sp-category"
              value={data.category}
              onChange={(e) => set("category")(e.target.value)}
            >
              {SUPPLIER_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {dict.supplierCategories[c]}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="sp-desc">{t.description}</Label>
          <Textarea
            id="sp-desc"
            required
            minLength={20}
            maxLength={6000}
            rows={5}
            placeholder={t.descriptionPlaceholder}
            value={data.description}
            onChange={(e) => set("description")(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="sp-country">{t.country}</Label>
            <Select
              id="sp-country"
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
            <Label htmlFor="sp-city">
              {t.city}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="sp-city"
              maxLength={120}
              value={data.city}
              onChange={(e) => set("city")(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sp-web">
              {t.website}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="sp-web"
              type="url"
              maxLength={300}
              placeholder="https://…"
              value={data.website}
              onChange={(e) => set("website")(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sp-years">
              {t.yearsActive}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="sp-years"
              type="number"
              min={0}
              max={300}
              value={data.yearsActive}
              onChange={(e) => set("yearsActive")(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sp-employees">
              {t.employees}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="sp-employees"
              type="number"
              min={1}
              value={data.employees}
              onChange={(e) => set("employees")(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="sp-capacity">
            {t.capacity}{" "}
            <span className="text-navy-400">({dict.common.optional})</span>
          </Label>
          <Input
            id="sp-capacity"
            maxLength={2000}
            placeholder={t.capacityPlaceholder}
            value={data.capacity}
            onChange={(e) => set("capacity")(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="sp-certs">
              {t.certifications}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Textarea
              id="sp-certs"
              rows={4}
              value={data.certifications}
              onChange={(e) => set("certifications")(e.target.value)}
            />
            <p className="mt-1 text-xs text-navy-400">{t.certificationsHint}</p>
          </div>
          <div>
            <Label htmlFor="sp-portfolio">
              {t.portfolio}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Textarea
              id="sp-portfolio"
              rows={4}
              value={data.portfolio}
              onChange={(e) => set("portfolio")(e.target.value)}
            />
            <p className="mt-1 text-xs text-navy-400">{t.portfolioHint}</p>
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-red-600">{dict.common.error}</p>
        )}
        {saved && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <IconCheck className="h-4 w-4" />
            {t.saved}
          </p>
        )}

        <Button type="submit" variant="gold" disabled={busy}>
          {busy ? dict.common.loading : exists ? t.save : t.create}
        </Button>
      </form>
    </Card>
  );
}
