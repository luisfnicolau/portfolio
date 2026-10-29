import { coreStack, skillGroups } from "@/content/skills";
import { getDictionary } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { Chip } from "../ui/chip";
import { Section } from "../ui/section";

export function Skills({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).sections.skills;
  return (
    <Section id="skills" index="06" kicker={t.kicker} title={t.title}>
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
        <div className="reveal self-start rounded-2xl border border-line bg-surface p-6 sm:p-7">
          <h3 className="kicker text-subtle">{t.core}</h3>
          <ul className="mt-6 space-y-5">
            {coreStack.map((skill) => (
              <li key={skill.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold">{skill.name}</span>
                  <span className="font-mono text-xs text-subtle">{skill.years[locale]}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden>
                  <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, skill.value * 10)}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-subtle">{skill.note[locale]}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid content-start gap-x-8 gap-y-10 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.title.en} className="reveal">
              <h3 className="text-sm font-semibold">{group.title[locale]}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const label = typeof item === "string" ? item : item[locale];
                  return (
                    <li key={label}>
                      <Chip>{label}</Chip>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
