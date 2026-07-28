"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Dictionary } from "@/lib/i18n";
import { SUPPLIER_CATEGORIES } from "@/lib/constants";
import { Select, Input, Label } from "@/components/ui";
import { IconSearch } from "@/components/icons";

export function NeedsFilters({
  dict,
  countries,
  companies,
}: {
  dict: Dictionary;
  countries: { code: string; name: string }[];
  companies: { slug: string; name: string }[];
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
    params && ["q", "category", "country", "company"].some((k) => params.get(k));

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
        <Label htmlFor="nf-q">{dict.common.search}</Label>
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <Input
            id="nf-q"
            className="pl-9"
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
        <Label htmlFor="nf-category">{dict.common.category}</Label>
        <Select
          id="nf-category"
          value={params?.get("category") ?? ""}
          onChange={(e) => setParam("category", e.target.value)}
        >
          <option value="">{dict.explorer.anyCategory}</option>
          {SUPPLIER_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {dict.supplierCategories[c]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="nf-country">{dict.common.country}</Label>
        <Select
          id="nf-country"
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
        <Label htmlFor="nf-company">{dict.companies.navLabel}</Label>
        <Select
          id="nf-company"
          value={params?.get("company") ?? ""}
          onChange={(e) => setParam("company", e.target.value)}
        >
          <option value="">{dict.needs.anyCompany}</option>
          {companies.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
