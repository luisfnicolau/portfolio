import type { Benchmark } from "@/content/types";
import { getDictionary } from "@/content/ui";
import type { Locale } from "@/lib/i18n";

/** Before/after bars on a linear scale: a bar that almost vanishes is the point. */
export function Benchmarks({ items, locale }: { items: Benchmark[]; locale: Locale }) {
  const t = getDictionary(locale).perf;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const ratio = Math.max(0.6, (item.after.value / item.before.value) * 100);
        return (
          <figure key={item.label.en} className="reveal rounded-2xl border border-line bg-surface p-6">
            <figcaption className="text-sm font-semibold">{item.label[locale]}</figcaption>
            <dl className="mt-6 space-y-5">
              <div>
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <dt className="text-subtle">{t.before}</dt>
                  <dd className="font-mono text-muted tabular-nums">{item.before.text[locale]}</dd>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-surface-2" aria-hidden>
                  <div className="h-full w-full rounded-full bg-line-strong" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <dt className="text-subtle">{t.after}</dt>
                  <dd className="font-mono font-semibold text-accent-ink tabular-nums">{item.after.text[locale]}</dd>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-surface-2" aria-hidden>
                  <div className="h-full rounded-full bg-accent" style={{ width: `${ratio}%` }} />
                </div>
              </div>
            </dl>
          </figure>
        );
      })}
    </div>
  );
}
