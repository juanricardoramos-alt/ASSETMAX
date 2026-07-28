"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n";
import { SUPPLIER_CATEGORIES, countryName } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button, Card, Input, Label, Textarea, VerifiedBadge } from "@/components/ui";
import { CompanyMonogram } from "@/components/company/CompanyMonogram";

export type CandidateSupplier = {
  id: string;
  name: string;
  category: string;
  countryCode: string;
  city: string | null;
  verified: boolean;
};

function num(v: string): number | null {
  const n = Number(v);
  return v.trim() !== "" && Number.isFinite(n) ? n : null;
}

export function ConsortiumBuilder({
  lang,
  dict,
  needId,
  candidates,
}: {
  lang: string;
  dict: Dictionary;
  needId: string;
  candidates: CandidateSupplier[];
}) {
  const router = useRouter();
  const t = dict.consortiums;
  const [name, setName] = useState("");
  const [leaderRole, setLeaderRole] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>({}); // supplierId -> role
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const filtered = useMemo(
    () =>
      candidates.filter(
        (c) =>
          (!categoryFilter || c.category === categoryFilter) &&
          (!search || c.name.toLowerCase().includes(search.toLowerCase()))
      ),
    [candidates, categoryFilter, search]
  );

  const selectedCount = Object.keys(selected).length;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = { ...prev };
      if (id in next) delete next[id];
      else if (Object.keys(next).length < 6) next[id] = "";
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selectedCount === 0) return;
    setBusy(true);
    setError(false);
    const res = await fetch("/api/consortiums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        needId,
        name,
        leaderRole,
        members: Object.entries(selected).map(([supplierId, role]) => ({
          supplierId,
          role,
        })),
        message,
        proposedBudget: num(budget),
        leadTime,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError(true);
      return;
    }
    router.push(`/${lang}/dashboard/applications`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="cb-name">{t.nameLabel}</Label>
            <Input
              id="cb-name"
              required
              minLength={3}
              maxLength={160}
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cb-role">
              {t.yourRole}{" "}
              <span className="text-navy-400">({dict.common.optional})</span>
            </Label>
            <Input
              id="cb-role"
              maxLength={120}
              placeholder={t.rolePlaceholder}
              value={leaderRole}
              onChange={(e) => setLeaderRole(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Supplier picker */}
      <Card className="p-6 sm:p-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
          {t.pickTitle}
        </h2>
        <p className="mt-1 text-sm text-navy-500">{t.pickHint}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryFilter("")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              !categoryFilter
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-navy-200 bg-white text-navy-600 hover:border-navy-400"
            )}
          >
            {dict.common.all}
          </button>
          {SUPPLIER_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryFilter(categoryFilter === c ? "" : c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                categoryFilter === c
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-200 bg-white text-navy-600 hover:border-navy-400"
              )}
            >
              {dict.supplierCategories[c]}
            </button>
          ))}
        </div>

        <Input
          className="mt-4"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filtered.length === 0 ? (
          <p className="mt-6 rounded-lg border border-dashed border-navy-200 p-6 text-center text-sm text-navy-500">
            {t.noCandidates}
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {filtered.map((c) => {
              const isSelected = c.id in selected;
              return (
                <div
                  key={c.id}
                  className={cn(
                    "rounded-xl border p-4 transition",
                    isSelected
                      ? "border-gold-400 bg-gold-50/50"
                      : "border-navy-100 bg-white hover:border-navy-300"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(c.id)}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <CompanyMonogram name={c.name} />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-bold text-navy-950">
                          {c.name}
                        </span>
                        {c.verified && (
                          <VerifiedBadge label={dict.suppliers.qualifiedBadge} />
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs text-navy-500">
                        {dict.supplierCategories[
                          c.category as keyof typeof dict.supplierCategories
                        ] ?? c.category}{" "}
                        · {c.city ? `${c.city}, ` : ""}
                        {countryName(c.countryCode, lang as "en" | "es")}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                        isSelected
                          ? "border-gold-500 bg-gold-500 text-navy-950"
                          : "border-navy-300 text-transparent"
                      )}
                    >
                      ✓
                    </span>
                  </button>
                  {isSelected && (
                    <Input
                      className="mt-3"
                      maxLength={120}
                      placeholder={t.memberRolePlaceholder}
                      value={selected[c.id]}
                      onChange={(e) =>
                        setSelected((prev) => ({
                          ...prev,
                          [c.id]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-4 text-sm font-semibold text-navy-700">
          {selectedCount} {t.membersSelected}
        </p>
      </Card>

      {/* Joint proposal */}
      <Card className="p-6 sm:p-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
          {t.proposalTitle}
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="cb-msg">{dict.needs.applyCard.message}</Label>
            <Textarea
              id="cb-msg"
              required
              minLength={20}
              maxLength={4000}
              rows={5}
              placeholder={dict.needs.applyCard.messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="cb-budget">
                {dict.needs.applyCard.proposedBudget}{" "}
                <span className="text-navy-400">({dict.common.optional})</span>
              </Label>
              <Input
                id="cb-budget"
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cb-lead">
                {dict.needs.applyCard.leadTime}{" "}
                <span className="text-navy-400">({dict.common.optional})</span>
              </Label>
              <Input
                id="cb-lead"
                maxLength={200}
                placeholder={dict.needs.applyCard.leadTimePlaceholder}
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <p className="text-sm font-medium text-red-600">{dict.common.error}</p>
      )}
      <Button
        type="submit"
        variant="gold"
        size="lg"
        disabled={busy || selectedCount === 0}
      >
        {busy ? dict.common.loading : t.submit}
      </Button>
    </form>
  );
}
