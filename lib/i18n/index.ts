export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type { Dictionary } from "./dictionaries/en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export async function getDictionary(locale: string) {
  switch (locale) {
    case "es":
      return (await import("./dictionaries/es")).default;
    default:
      return (await import("./dictionaries/en")).default;
  }
}
