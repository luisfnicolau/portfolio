"use client";

import { X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { getDictionary } from "@/content/ui";
import { htmlLang, otherLocale, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "language-hint";
const noSubscription = () => () => {};

/** Offers the other language when the browser's first language suggests it. Dismissal is remembered. */
export function LanguageHint({ locale, alternateHref }: { locale: Locale; alternateHref: string }) {
  const wanted = useSyncExternalStore(
    noSubscription,
    () => {
      try {
        if (localStorage.getItem(STORAGE_KEY) === "dismissed") return false;
      } catch {
        // Storage blocked: fall through and decide from the browser language.
      }
      const prefersPortuguese = (navigator.languages?.[0] ?? navigator.language ?? "").toLowerCase().startsWith("pt");
      return locale === "en" ? prefersPortuguese : !prefersPortuguese;
    },
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);
  if (!wanted || dismissed) return null;

  const t = getDictionary(locale).languageHint;
  const other = otherLocale(locale);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // Not remembered; it simply shows again next visit.
    }
  }

  return (
    <aside
      lang={htmlLang[other]}
      aria-label={t.text}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-full border border-line-strong bg-surface/95 py-2 pr-2 pl-5 text-sm shadow-card backdrop-blur-xl sm:right-6 sm:bottom-6 sm:left-auto sm:mx-0 sm:w-auto"
    >
      <p className="min-w-0 flex-1 truncate text-muted">{t.text}</p>
      <a
        href={alternateHref}
        hrefLang={htmlLang[other]}
        className="rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap text-on-accent"
      >
        {t.action}
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.dismiss}
        className="inline-flex size-8 items-center justify-center rounded-full text-subtle hover:bg-surface-2 hover:text-fg"
      >
        <X size={15} />
      </button>
    </aside>
  );
}
