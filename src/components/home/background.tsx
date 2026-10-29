import { education } from "@/content/experience";
import { getDictionary } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { Section } from "../ui/section";

export function Background({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).sections.background;
  const card = "reveal rounded-2xl border border-line bg-surface p-6 sm:p-7";
  return (
    <Section id="background" index="07" kicker={t.kicker} title={t.title}>
      <div className="grid gap-6 md:grid-cols-3">
        <div className={card}>
          <h3 className="kicker text-subtle">{t.education}</h3>
          <p className="mt-5 font-semibold">{education.school}</p>
          <p className="mt-1 text-sm text-muted">{education.course[locale]}</p>
          <p className="mt-3 text-sm text-subtle">{education.note[locale]}</p>
        </div>
        <div className={card}>
          <h3 className="kicker text-subtle">{t.certifications}</h3>
          <ul className="mt-5 space-y-2.5">
            {education.certifications.map((certification) => (
              <li key={certification} className="font-medium">
                {certification}
              </li>
            ))}
          </ul>
        </div>
        <div className={card}>
          <h3 className="kicker text-subtle">{t.languages}</h3>
          <ul className="mt-5 space-y-2.5">
            {education.languages[locale].map((language) => (
              <li key={language} className="font-medium">
                {language}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-subtle">{education.content[locale]}</p>
        </div>
      </div>
    </Section>
  );
}
