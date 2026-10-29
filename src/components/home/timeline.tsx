import Link from "next/link";
import { timeline, timelineAxis, type TimelineRow } from "@/content/experience";
import type { MonthOrYear } from "@/content/types";
import { getDictionary } from "@/content/ui";
import { formatPeriod, workPath, type Locale } from "@/lib/i18n";

/** "2023-08" → 2023.58. A bare year starts in January and, as an end, counts until mid-year. */
function toYear(value: MonthOrYear | "present", edge: "start" | "end"): number {
  const [year, month] = (value === "present" ? timelineAxis.asOf : value).split("-").map(Number);
  if (month) return year + (month - (edge === "start" ? 1 : 0)) / 12;
  return edge === "start" ? year : year + 0.5;
}

const span = timelineAxis.end - timelineAxis.start;
const percent = (year: number) => `${(((year - timelineAxis.start) / span) * 100).toFixed(2)}%`;

const barTone: Record<TimelineRow["kind"], string> = {
  founded: "bg-accent",
  employment: "bg-fg",
  earlier: "bg-line-strong",
};

const ticks = Array.from({ length: Math.floor(span / 2) + 1 }, (_, i) => timelineAxis.start + i * 2);

export function Timeline({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).sections.experience;
  return (
    <figure className="reveal rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-subtle">
        <span className="sr-only">{t.timelineLabel}. </span>
        {(
          [
            ["founded", t.legendFounded],
            ["employment", t.legendEmployment],
            ["earlier", t.legendEarlier],
          ] as const
        ).map(([kind, label]) => (
          <span key={kind} className="flex items-center gap-2" aria-hidden>
            <span className={`h-2 w-5 rounded-full ${barTone[kind]}`} />
            {label}
          </span>
        ))}
      </figcaption>

      <div className="relative mt-6">
        {/* Year gridlines behind the bars, aligned with the track column. */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 left-0 sm:left-44">
          {ticks.map((year) => (
            <span key={year} className="absolute inset-y-0 w-px bg-line" style={{ left: percent(year) }} />
          ))}
        </div>

        <ol className="relative space-y-3 sm:space-y-2">
          {timeline.map((row) => {
            const start = toYear(row.period.from, "start");
            const end = toYear(row.period.to, "end");
            const ongoing = row.period.to === "present";
            const period = formatPeriod(row.period, locale);
            return (
              <li key={row.label} className="grid gap-1.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-4">
                <p className="truncate text-xs font-medium sm:text-right sm:text-[0.8rem]">
                  {row.slug ? (
                    <Link href={workPath(locale, row.slug)} className="hover:text-accent-ink">
                      {row.label}
                    </Link>
                  ) : (
                    row.label
                  )}
                  <span className="sr-only">
                    {" "}
                    · {row.title[locale]} · {period}
                  </span>
                </p>
                <div className="relative h-5" aria-hidden title={`${row.label} · ${row.title[locale]} · ${period}`}>
                  {/* No grow animation here: a chart must never show a wrong length, even mid-scroll. */}
                  <span
                    className={`absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full ${barTone[row.kind]} ${
                      ongoing ? "[mask-image:linear-gradient(90deg,#000_70%,transparent)]" : ""
                    }`}
                    style={{ left: percent(start), width: `calc(${percent(end)} - ${percent(start)})` }}
                  />
                </div>
              </li>
            );
          })}
        </ol>

        <div aria-hidden className="relative mt-3 h-4 sm:ml-44">
          {ticks.map((year) => (
            <span
              key={year}
              className="absolute -translate-x-1/2 font-mono text-[0.6rem] text-subtle tabular-nums max-sm:[&:nth-child(even)]:hidden"
              style={{ left: percent(year) }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}
