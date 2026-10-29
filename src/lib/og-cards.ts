import { profile, stats } from "@/content/profile";
import { getProject } from "@/content/projects";
import { getDictionary } from "@/content/ui";
import type { Locale } from "./i18n";
import { renderOg } from "./og";

export function homeOg(locale: Locale) {
  return renderOg({
    kicker: profile.title[locale],
    title: profile.shortName,
    accent: profile.cardLine[locale],
    subtitle: stats
      .slice(0, 3)
      .map((stat) => `${stat.value[locale]} ${stat.label[locale]}`)
      .join(" · "),
    footer: profile.remote[locale],
  });
}

export function projectOg(locale: Locale, slug: string) {
  const project = getProject(slug);
  const t = getDictionary(locale);
  return renderOg({
    kicker: project ? `${t.meta.caseStudy} · ${t.project.kind[project.kind]}` : t.meta.caseStudy,
    title: project?.name ?? profile.shortName,
    subtitle: project?.tagline[locale] ?? profile.oneLiner[locale],
    footer: `${profile.shortName} · ${profile.title[locale]}`,
  });
}

export const homeOgAlt = (locale: Locale) => `${profile.shortName} · ${profile.title[locale]}`;
