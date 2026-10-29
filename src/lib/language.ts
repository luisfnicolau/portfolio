import type { Locale } from "@/content/types";

/** Remembers an explicit choice made with the language switch (`?lang=en|pt`). */
export const LANGUAGE_COOKIE = "lang";

// Where Portuguese is the main language, for visitors whose browser states no preference.
const PORTUGUESE_COUNTRIES = new Set(["BR", "PT", "AO", "MZ", "CV", "GW", "ST", "TL"]);

/**
 * English or Portuguese for a visitor: the first of the two in their browser's Accept-Language
 * (by q-value), else the country of their IP, else English.
 */
export function preferredLocale(acceptLanguage: string | null, country: string | null): Locale {
  const ranked = (acceptLanguage ?? "")
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = Number(params.find((p) => p.trim().startsWith("q="))?.trim().slice(2) ?? 1);
      return { tag, q: Number.isFinite(q) ? q : 0, index };
    })
    .filter(({ tag, q }) => tag && q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const { tag } of ranked) {
    if (tag === "pt" || tag.startsWith("pt-")) return "pt";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }
  return country && PORTUGUESE_COUNTRIES.has(country.toUpperCase()) ? "pt" : "en";
}
