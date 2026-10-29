import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { earlierRoles, employment } from "@/content/experience";
import { featuredProjects } from "@/content/projects";
import { getDictionary } from "@/content/ui";
import { formatPeriod, workPath, type Locale } from "@/lib/i18n";
import { Section } from "../ui/section";
import { Timeline } from "./timeline";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2.5 text-[0.95rem]/relaxed text-pretty text-muted">
      {items.map((item) => (
        <li key={item.slice(0, 40)} className="relative pl-5">
          <span aria-hidden className="absolute top-[0.62em] left-0.5 size-1.5 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Experience({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const s = t.sections.experience;
  // Running products first, then by start date, as on the CV.
  const founded = [...featuredProjects].sort(
    (a, b) => Number(b.period.to === "present") - Number(a.period.to === "present") || b.period.from.localeCompare(a.period.from),
  );

  return (
    <Section id="experience" index="04" kicker={s.kicker} title={s.title} lead={s.lead}>
      <Timeline locale={locale} />

      <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-14">
        <div>
          <h3 className="kicker text-subtle">{s.employment}</h3>
          <ol className="mt-8 space-y-12">
            {employment.map((role) => (
              <li key={role.id} className="reveal">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="text-lg font-semibold tracking-tight">{role.company}</h4>
                  <p className="font-mono text-xs text-subtle tabular-nums">{formatPeriod(role.period, locale)}</p>
                </div>
                <p className="mt-1 text-sm font-medium text-fg/90">{role.title[locale]}</p>
                <p className="text-sm text-subtle">{role.context[locale]}</p>
                <Bullets items={role.bullets[locale]} />
              </li>
            ))}
          </ol>

          <h3 className="kicker mt-14 text-subtle">{s.earlier} · 2014 – 2018</h3>
          <ul className="mt-6 divide-y divide-line rounded-2xl border border-line">
            {earlierRoles.map((role) => (
              <li key={role.company} className="px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-sm font-semibold">
                    {role.company} <span className="font-normal text-subtle">· {role.title[locale]}</span>
                  </p>
                  <p className="font-mono text-xs text-subtle tabular-nums">{formatPeriod(role.period, locale)}</p>
                </div>
                <p className="mt-1 text-sm text-muted">{role.summary[locale]}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="kicker text-subtle">{s.founded}</h3>
          <ol className="mt-8 space-y-4">
            {founded.map((project) => (
              <li key={project.slug} className="reveal">
                <Link
                  href={workPath(locale, project.slug)}
                  className="group block rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-line-strong"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h4 className="text-lg font-semibold tracking-tight">{project.name}</h4>
                    <p className="font-mono text-xs text-subtle tabular-nums">{formatPeriod(project.period, locale)}</p>
                  </div>
                  <p className="mt-1 text-sm font-medium text-fg/90">{project.role[locale]}</p>
                  <p className="mt-3 text-[0.95rem]/relaxed text-pretty text-muted">{project.tagline[locale]}</p>
                  <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold">
                    {project.caseStudies ? t.project.caseStudy : t.project.details}
                    <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
