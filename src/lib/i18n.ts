import { locales, type Locale, type Localized, type Period } from "@/content/types";

export { locales, type Locale };

export const htmlLang: Localized = { en: "en", pt: "pt-BR" };
export const ogLocale: Localized = { en: "en_US", pt: "pt_BR" };

export const otherLocale = (locale: Locale): Locale => (locale === "en" ? "pt" : "en");

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const homePath = (locale: Locale) => (locale === "en" ? "/" : "/pt");

/** A home-page section, reachable from any page: "/#work", "/pt#work". */
export const sectionPath = (locale: Locale, id: string) => (locale === "en" ? `/#${id}` : `/pt#${id}`);

export const workPath = (locale: Locale, slug: string) =>
  locale === "en" ? `/work/${slug}` : `/pt/work/${slug}`;

/** A language-switch link: src/proxy.ts remembers the `lang` choice in a cookie. */
export const switchHref = (path: string, locale: Locale) => `${path}?lang=${locale}`;

/** hreflang map for `metadata.alternates.languages` and the sitemap. */
export function languageAlternates(path: (locale: Locale) => string) {
  return { en: path("en"), "pt-BR": path("pt"), "x-default": path("en") };
}

const present: Localized = { en: "Present", pt: "Atual" };

/** Years only, as on the CV: "2023 – 2025", "2026 – Present". */
export function formatPeriod(period: Period, locale: Locale) {
  const from = period.from.slice(0, 4);
  const to = period.to === "present" ? present[locale] : period.to.slice(0, 4);
  return from === to ? from : `${from} – ${to}`;
}
