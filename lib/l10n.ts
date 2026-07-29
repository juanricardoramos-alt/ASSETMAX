// Content localization for database entities.
//
// Projects, mandates and commodity listings store their base content in
// English columns plus a `translations` JSON column keyed by locale, e.g.
// {"es": {"summary": "…", "highlights": ["…"]}}. `localized()` overlays the
// active locale's overrides onto the entity and falls back to the English
// base value for any field without a translation.
//
// Array/object overrides (highlights, specs) are re-serialized to JSON
// strings so call sites that JSON.parse the base columns work unchanged.

import type { Locale } from "@/lib/i18n";

type Translatable = { translations: string };

export function localized<T extends Translatable>(entity: T, lang: Locale): T {
  if (lang === "en") return entity;

  let overrides: Record<string, unknown>;
  try {
    overrides = (JSON.parse(entity.translations)?.[lang] ?? {}) as Record<string, unknown>;
  } catch {
    return entity; // malformed translations → English base
  }

  const out: Record<string, unknown> = { ...entity };
  for (const [key, value] of Object.entries(overrides)) {
    if (value == null) continue;
    if (typeof value === "string") {
      if (value.trim() !== "") out[key] = value;
    } else {
      out[key] = JSON.stringify(value);
    }
  }
  return out as T;
}

export function localizedAll<T extends Translatable>(entities: T[], lang: Locale): T[] {
  return entities.map((e) => localized(e, lang));
}

/** Read a single translated string field, or "" when absent/malformed. */
export function translationField(
  translations: string | null | undefined,
  locale: Locale,
  key: string
): string {
  try {
    const value = translations ? JSON.parse(translations)?.[locale]?.[key] : undefined;
    return typeof value === "string" ? value : "";
  } catch {
    return "";
  }
}

/**
 * Build a `translations` JSON string by merging a per-locale patch into an
 * existing value. A patch key with a null/empty value removes just that key;
 * keys not present in the patch are left untouched.
 */
export function withTranslation(
  existing: string | null | undefined,
  locale: Locale,
  patch: Record<string, unknown>
): string {
  let base: Record<string, Record<string, unknown>> = {};
  try {
    base = existing ? JSON.parse(existing) : {};
  } catch {
    base = {};
  }
  const merged: Record<string, unknown> = { ...(base[locale] ?? {}) };
  for (const [key, value] of Object.entries(patch)) {
    if (value == null || (typeof value === "string" && value.trim() === "")) {
      delete merged[key];
    } else {
      merged[key] = value;
    }
  }
  if (Object.keys(merged).length === 0) {
    delete base[locale];
  } else {
    base[locale] = merged;
  }
  return JSON.stringify(base);
}
