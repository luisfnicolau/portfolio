import { labProjects } from "@/content/projects";
import { getDictionary } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { Section } from "../ui/section";
import { ProjectCard } from "../work/project-card";

// Bento layout on large screens: two wide cards, then three narrow ones. On two columns the fifth fills its row.
const spans = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "sm:col-span-2 lg:col-span-2"];

export function Labs({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).sections.labs;
  return (
    <Section id="labs" index="03" kicker={t.kicker} title={t.title} lead={t.lead}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
        {labProjects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            locale={locale}
            className={spans[index] ?? "lg:col-span-2"}
            sizes={
              (spans[index] ?? "").includes("lg:col-span-3")
                ? "(min-width: 1152px) 560px, (min-width: 640px) 50vw, 100vw"
                : "(min-width: 1152px) 368px, (min-width: 640px) 50vw, 100vw"
            }
          />
        ))}
      </div>
    </Section>
  );
}
