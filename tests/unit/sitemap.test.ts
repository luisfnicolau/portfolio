import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { projects } from "@/content/projects";

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("lists both home pages", () => {
    expect(urls).toContain("https://lunico.dev/");
    expect(urls).toContain("https://lunico.dev/pt");
  });

  it("lists every project in both languages, with hreflang alternates", () => {
    for (const project of projects) {
      expect(urls).toContain(`https://lunico.dev/work/${project.slug}`);
      expect(urls).toContain(`https://lunico.dev/pt/work/${project.slug}`);
    }
    for (const entry of sitemap()) expect(Object.keys(entry.alternates?.languages ?? {})).toEqual(["en", "pt-BR"]);
  });
});
