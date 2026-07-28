"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n";
import { CATEGORIES, COUNTRIES } from "@/lib/constants";
import { Button, Card, Input, Label, Select, Textarea } from "@/components/ui";
import { IconCheck } from "@/components/icons";

export type CompanyFormData = {
  name: string;
  legalName: string;
  description: string;
  sector: string;
  countryCode: string;
  city: string;
  website: string;
  founded: string;
  employees: string;
};

function num(v: string): number | null {
  const n = Number(v);
  return v.trim() !== "" && Number.isFinite(n) ? n : null;
}

export function CompanyProfileForm({
  lang,
  dict,
  exists,
  initialData,
}: {
  lang: string;
  dict: Dictionary;
  exists: boolean;
  initialData?: CompanyFormData;
}) {
  const router = useRouter();
  const t = dict.companies.panel.form;
  const [data, setData] = useState<CompanyFormData>(
    initialData ?? {
      name: "",
      legalName: "",
      description: "",
      sector: CATEGORIES[0],
      countryCode: COUNTRIES[0].code,
      city: "",
      website: "",
      founded: "",
      employees: "",
    }
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof CompanyFormData) => (value: string) =>
    setData((d) => ({ ...d, [key]: value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    setSaved(false);
    const res = await fetch("/api/company", {
      method: exists ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        legalName: data.legalName,
        description: data.description,
        sector: data.sector,
        countryCode: data.countryCode,
        city: data.city,
        website: data.website,
        founded: num(data.founded),
        employees: num(data.employees),
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
            <Label htmlFor="cp-name">{t.name}</Label>
            <Input
              id="cp-name"
              required
              minLength={2}
              maxLength={160}
              value={data.name}
              onChange={(e) => set("name")(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cp-legal">
              {t.legalName}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="cp-legal"
              maxLength={200}
              value={data.legalName}
              onChange={(e) => set("legalName")(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cp-desc">{t.description}</Label>
          <Textarea
            id="cp-desc"
            required
            minLength={20}
            maxLength={6000}
            rows={6}
            placeholder={t.descriptionPlaceholder}
            value={data.description}
            onChange={(e) => set("description")(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="cp-sector">{t.sector}</Label>
            <Select
              id="cp-sector"
              value={data.sector}
              onChange={(e) => set("sector")(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {dict.categories[c]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="cp-country">{t.country}</Label>
            <Select
              id="cp-country"
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
            <Label htmlFor="cp-city">
              {t.city}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="cp-city"
              maxLength={120}
              value={data.city}
              onChange={(e) => set("city")(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cp-web">
              {t.website}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="cp-web"
              type="url"
              maxLength={300}
              placeholder={t.websitePlaceholder}
              value={data.website}
              onChange={(e) => set("website")(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cp-founded">
              {t.founded}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="cp-founded"
              type="number"
              min={1800}
              max={2100}
              value={data.founded}
              onChange={(e) => set("founded")(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cp-employees">
              {t.employees}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="cp-employees"
              type="number"
              min={1}
              value={data.employees}
              onChange={(e) => set("employees")(e.target.value)}
            />
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
