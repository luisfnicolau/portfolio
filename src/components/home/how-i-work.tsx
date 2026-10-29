import { agentTools, agentWorkflow, principles } from "@/content/principles";
import { getProject } from "@/content/projects";
import { getDictionary } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { Section } from "../ui/section";

export function HowIWork({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).sections.howIWork;
  const lesson = getProject("olhonalei")?.caseStudies?.[0]?.lesson?.[locale];
  return (
    <Section id="how-i-work" index="05" kicker={t.kicker} title={t.title}>
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((principle, index) => (
          <li key={principle.title.en} className="reveal bg-bg p-6 sm:p-7">
            <p className="font-mono text-xs text-accent-ink">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">{principle.title[locale]}</h3>
            <p className="mt-2 text-sm/relaxed text-pretty text-muted">{principle.body[locale]}</p>
          </li>
        ))}
        {lesson ? (
          <li aria-hidden className="hidden items-end bg-bg-elevated p-6 sm:flex sm:p-7">
            <p className="font-serif text-3xl/tight text-accent-ink italic">“{lesson}”</p>
          </li>
        ) : null}
      </ol>

      <div className="reveal mt-8 rounded-3xl border border-line bg-surface p-6 sm:p-10">
        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.agentsTitle}</h3>
        <p className="mt-2 text-muted">{t.agentsLead}</p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {agentWorkflow.map((step, index) => (
            <li key={step.step.en} className="relative rounded-2xl border border-line bg-bg p-5">
              <p className="kicker flex items-center gap-2 text-[0.65rem] text-subtle">
                <span className="grid size-5 place-items-center rounded-full bg-accent font-bold text-on-accent">{index + 1}</span>
                {step.step[locale]}
              </p>
              <p className="mt-3 text-sm/relaxed text-pretty text-muted">{step.body[locale]}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-sm/relaxed text-subtle">{agentTools[locale]}</p>
      </div>
    </Section>
  );
}
