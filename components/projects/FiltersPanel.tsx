"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Dictionary } from "@/lib/i18n";
import { CATEGORIES, STAGES, DEAL_TYPES, INVESTMENT_RANGES } from "@/lib/constants";
import { Select, Input, Label } from "@/components/ui";
import { IconSearch } from "@/components/icons";

export function FiltersPanel({
  dict,
  countries,
}: {
  dict: Dictionary;
  countries: { code: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params?.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  const clear = () => router.push(pathname ?? "/", { scroll: false });

  const hasFilters =
    params &&
    ["q", "category", "country", "stage", "deal", "range", "verified"].some((k) =>
      params.get(k)
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
          {dict.explorer.filters}
        </h2>
        {hasFilters && (
          <button
            onClick={clear}
            className="text-xs font-semibold text-gold-600 hover:text-gold-500"
          >
            {dict.explorer.clearFilters}
          </button>
        )}
      </div>

      <div>
        <Label htmlFor="f-q">{dict.common.search}</Label>
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <Input
            id="f-q"
            className="pl-9"
            placeholder={dict.explorer.searchPlaceholder}
            defaultValue={params?.get("q") ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setParam("q", (e.target as HTMLInputElement).value);
            }}
            onBlur={(e) => setParam("q", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="f-category">{dict.common.category}</Label>
        <Select
          id="f-category"
          value={params?.get("category") ?? ""}
          onChange={(e) => setParam("category", e.target.value)}
        >
          <option value="">{dict.explorer.anyCategory}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {dict.categories[c]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="f-country">{dict.common.country}</Label>
        <Select
          id="f-country"
          value={params?.get("country") ?? ""}
          onChange={(e) => setParam("country", e.target.value)}
        >
          <option value="">{dict.explorer.anyCountry}</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="f-range">{dict.common.investmentRange}</Label>
        <Select
          id="f-range"
          value={params?.get("range") ?? ""}
          onChange={(e) => setParam("range", e.target.value)}
        >
          <option value="">{dict.explorer.anyRange}</option>
          {INVESTMENT_RANGES.map((r) => (
            <option key={r.key} value={r.key}>
              {dict.explorer.investmentRanges[r.key]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="f-stage">{dict.common.stage}</Label>
        <Select
          id="f-stage"
          value={params?.get("stage") ?? ""}
          onChange={(e) => setParam("stage", e.target.value)}
        >
          <option value="">{dict.explorer.anyStage}</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {dict.stages[s]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="f-deal">{dict.common.dealType}</Label>
        <Select
          id="f-deal"
          value={params?.get("deal") ?? ""}
          onChange={(e) => setParam("deal", e.target.value)}
        >
          <option value="">{dict.explorer.anyDeal}</option>
          {DEAL_TYPES.map((d) => (
            <option key={d} value={d}>
              {dict.dealTypes[d]}
            </option>
          ))}
        </Select>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-navy-200 px-3.5 py-2.5">
        <input
          type="checkbox"
          checked={params?.get("verified") === "1"}
          onChange={(e) => setParam("verified", e.target.checked ? "1" : "")}
          className="h-4 w-4 rounded border-navy-300 text-navy-900 focus:ring-navy-500"
        />
        <span className="text-sm font-medium text-navy-800">
          {dict.explorer.verifiedOnly}
        </span>
      </label>
    </div>
  );
}
