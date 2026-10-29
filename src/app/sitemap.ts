import type { MetadataRoute } from "next";
import { site } from "@/content/profile";
import { projects } from "@/content/projects";
import { homePath, locales, workPath, type Locale } from "@/lib/i18n";

const absolute = (path: string) => new URL(path, site.url).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: ((locale: Locale) => string)[] = [
    homePath,
    ...projects.map((project) => (locale: Locale) => workPath(locale, project.slug)),
  ];
  return pages.flatMap((path) =>
    locales.map((locale) => ({
      url: absolute(path(locale)),
      lastModified: site.updatedIso,
      alternates: { languages: { en: absolute(path("en")), "pt-BR": absolute(path("pt")) } },
    })),
  );
}
