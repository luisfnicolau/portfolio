import { profile } from "@/content/profile";
import { getDictionary } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { tidy } from "@/lib/typography";
import { Section } from "../ui/section";

export function About({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).sections.about;
  const [lead, ...paragraphs] = profile.about[locale];
  return (
    <Section id="about" index="01" kicker={t.kicker} title={t.title}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-16">
        <dl className="reveal grid content-start gap-px self-start overflow-hidden rounded-2xl border border-line bg-line">
          {profile.facts.map((fact) => (
            <div key={fact.label.en} className="flex flex-col gap-1 bg-bg px-5 py-4">
              <dt className="kicker text-[0.65rem] text-subtle">{fact.label[locale]}</dt>
              <dd className="text-sm font-medium">{fact.value[locale]}</dd>
            </div>
          ))}
        </dl>
        <div className="reveal space-y-6 text-[1.05rem]/relaxed text-pretty text-muted">
          <p className="text-xl/relaxed font-medium text-fg sm:text-2xl/relaxed">{lead}</p>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{tidy(paragraph)}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}
