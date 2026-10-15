export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];

export const SITE_URL = "https://impevos.com";

export function isLocale(value: string): value is Locale {
  return value === "tr" || value === "en";
}

export function localePath(locale: Locale, path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "tr") return normalized;
  return normalized === "/" ? "/en" : `/en${normalized}`;
}

export function absoluteUrl(locale: Locale, path = "/") {
  return `${SITE_URL}${localePath(locale, path)}`;
}
