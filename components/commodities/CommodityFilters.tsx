"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Dictionary } from "@/lib/i18n";
import { COMMODITIES, INCOTERMS, COUNTRIES, PERIODICITIES } from "@/lib/constants";
import { Select, Label } from "@/components/ui";

export function CommodityFilters({
  dict,
  lang,
}: {
  dict: Dictionary;
  lang: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const c = dict.commodities;

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params?.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  const hasFilters =
    params && ["side", "commodity", "incoterm", "origin", "periodicity"].some((k) => params.get(k));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
          {dict.explorer.filters}
        </h2>
        {hasFilters && (
          <button
            onClick={() => router.push(pathname ?? "/", { scroll: false })}
            className="text-xs font-semibold text-gold-600 hover:text-gold-500"
          >
            {dict.explorer.clearFilters}
          </button>
        )}
      </div>

      <div>
        <Label htmlFor="cf-side">{c.side}</Label>
        <Select
          id="cf-side"
          value={params?.get("side") ?? ""}
          onChange={(e) => setParam("side", e.target.value)}
        >
          <option value="">{c.anySide}</option>
          <option value="SELL">{c.sell}</option>
          <option value="BUY">{c.buy}</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="cf-commodity">{c.form.commodity}</Label>
        <Select
          id="cf-commodity"
          value={params?.get("commodity") ?? ""}
          onChange={(e) => setParam("commodity", e.target.value)}
        >
          <option value="">{c.anyCommodity}</option>
          {COMMODITIES.map((k) => (
            <option key={k} value={k}>
              {c.names[k]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="cf-incoterm">{c.incoterm}</Label>
        <Select
          id="cf-incoterm"
          value={params?.get("incoterm") ?? ""}
          onChange={(e) => setParam("incoterm", e.target.value)}
        >
          <option value="">{c.anyIncoterm}</option>
          {INCOTERMS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="cf-origin">{c.origin}</Label>
        <Select
          id="cf-origin"
          value={params?.get("origin") ?? ""}
          onChange={(e) => setParam("origin", e.target.value)}
        >
          <option value="">{c.anyOrigin}</option>
          {COUNTRIES.map((co) => (
            <option key={co.code} value={co.code}>
              {co[lang === "es" ? "es" : "en"]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="cf-periodicity">{c.periodicity}</Label>
        <Select
          id="cf-periodicity"
          value={params?.get("periodicity") ?? ""}
          onChange={(e) => setParam("periodicity", e.target.value)}
        >
          <option value="">{dict.common.all}</option>
          {PERIODICITIES.map((p) => (
            <option key={p} value={p}>
              {p === "spot" ? c.spot : c.contract}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
