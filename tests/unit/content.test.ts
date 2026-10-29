import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { intents } from "@/content/ask";
import { employment, timeline } from "@/content/experience";
import { cv, stats } from "@/content/profile";
import { projects } from "@/content/projects";
import { projectSlugs } from "@/content/slugs";
import { locales, type Localized } from "@/content/types";

const filled = (value: Localized<string | string[]>) =>
  locales.every((locale) => {
    const v = value[locale];
    return Array.isArray(v) ? v.length > 0 && v.every((s) => s.trim().length > 0) : v.trim().length > 0;
  });

/** Translations should mirror each other: same number of paragraphs or bullets. */
const mirrored = (value: Localized<string[]>) => value.en.length === value.pt.length;

describe("projects", () => {
  it("have unique slugs, all listed in slugs.ts (next.config.ts 404s any other)", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect([...slugs].sort()).toEqual([...projectSlugs].sort());
  });

  it.each(projects.map((p) => [p.slug, p] as const))("%s is complete in both languages", (_, project) => {
    expect(filled(project.role)).toBe(true);
    expect(filled(project.tagline)).toBe(true);
    expect(filled(project.summary) && mirrored(project.summary)).toBe(true);
    expect(filled(project.highlights) && mirrored(project.highlights)).toBe(true);
    expect(project.stack.length).toBeGreaterThan(0);
    if (project.note) expect(filled(project.note)).toBe(true);
    if (project.image) expect(filled(project.image.alt)).toBe(true);
    if (project.decisions) expect(filled(project.decisions) && mirrored(project.decisions)).toBe(true);
    for (const metric of project.metrics ?? []) expect(filled(metric.value) && filled(metric.label)).toBe(true);
    for (const story of project.caseStudies ?? []) {
      expect(filled(story.title) && filled(story.problem)).toBe(true);
      expect(filled(story.approach) && mirrored(story.approach)).toBe(true);
      if (story.result) expect(filled(story.result)).toBe(true);
      if (story.lesson) expect(filled(story.lesson)).toBe(true);
    }
    for (const link of project.links ?? []) expect(link.href).toMatch(/^https:\/\//);
  });

  it("each has a picture: a screenshot or a poster", () => {
    for (const project of projects) expect(Boolean(project.image || project.poster), project.slug).toBe(true);
  });

  it("timeline links point to real projects", () => {
    for (const row of timeline) if (row.slug) expect(projects.some((p) => p.slug === row.slug)).toBe(true);
  });
});

describe("experience", () => {
  it("is complete in both languages", () => {
    for (const role of employment) {
      expect(filled(role.title) && filled(role.context)).toBe(true);
      expect(filled(role.bullets) && mirrored(role.bullets)).toBe(true);
    }
  });
});

describe("profile", () => {
  it("has every stat in both languages", () => {
    for (const stat of stats) expect(filled(stat.value) && filled(stat.label)).toBe(true);
  });

  it("links to CV files that exist", () => {
    for (const locale of locales) expect(existsSync(join("public", cv[locale].href))).toBe(true);
  });
});

describe("ask intents", () => {
  it("have unique ids and answers in both languages", () => {
    const ids = intents.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const intent of intents) {
      expect(intent.keywords.length).toBeGreaterThan(0);
      expect(filled(intent.answer)).toBe(true);
      for (const link of intent.links ?? []) expect(filled(link.label)).toBe(true);
    }
  });

  it("only link to projects that exist", () => {
    const slugs = new Set<string>(projects.map((p) => p.slug));
    for (const intent of intents)
      for (const link of intent.links ?? []) {
        const href = typeof link.href === "string" ? link.href : link.href.en;
        const match = href.match(/^\/work\/(.+)$/);
        if (match) expect(slugs.has(match[1])).toBe(true);
      }
  });
});
