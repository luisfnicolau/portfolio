import type { StaticImageData } from "next/image";
import type { ProjectSlug } from "./slugs";

export const locales = ["en", "pt"] as const;
export type Locale = (typeof locales)[number];

/** A value written once per language. */
export type Localized<T = string> = Record<Locale, T>;

/** "YYYY" or "YYYY-MM". */
export type MonthOrYear = `${number}` | `${number}-${number}`;

export interface Period {
  from: MonthOrYear;
  to: MonthOrYear | "present";
}

export type ProjectKind = "flagship" | "product" | "lab";

export type ProjectStatus = "live" | "invite-only" | "beta" | "demo" | "personal";

export type LinkKind = "site" | "demo" | "app-store" | "google-play" | "repo";

export interface ProjectLink {
  kind: LinkKind;
  href: string;
}

export interface Metric {
  value: Localized;
  label: Localized;
}

/** A problem → what I did → result story, told on the project page. */
export interface CaseStudy {
  id: string;
  title: Localized;
  problem: Localized;
  approach: Localized<string[]>;
  /** Only when the outcome is a confirmed fact. */
  result?: Localized;
  lesson?: Localized;
}

/** Bespoke diagrams, drawn by components in src/components/work/. */
export type ProjectVisual = "olhonalei-pipeline";

/** A before/after measurement, drawn to scale. Lower is better. */
export interface Benchmark {
  label: Localized;
  before: { value: number; text: Localized };
  after: { value: number; text: Localized };
}

export interface Project {
  /** Also listed in slugs.ts. */
  slug: ProjectSlug;
  name: string;
  kind: ProjectKind;
  role: Localized;
  period: Period;
  /** Omitted when the product is no longer running or its state is unconfirmed. */
  status?: ProjectStatus;
  location?: Localized;
  /** One line, shown on cards. */
  tagline: Localized;
  /** Paragraphs for the project page. */
  summary: Localized<string[]>;
  /** Honest framing that must travel with the project (e.g. what was built on open source). */
  note?: Localized;
  highlights: Localized<string[]>;
  metrics?: Metric[];
  stack: string[];
  links?: ProjectLink[];
  /** One screenshot, or one per language when the product's own site has both. */
  image?: { src: StaticImageData | Localized<StaticImageData>; alt: Localized };
  /** Card art when there is no screenshot: one big figure and its caption. */
  poster?: { figure: Localized; caption: Localized };
  caseStudies?: CaseStudy[];
  decisions?: Localized<string[]>;
  visuals?: ProjectVisual[];
  benchmarks?: Benchmark[];
}

export interface Role {
  id: string;
  company: string;
  title: Localized;
  period: Period;
  context: Localized;
  bullets: Localized<string[]>;
}

export interface EarlierRole {
  company: string;
  title: Localized;
  period: Period;
  summary: Localized;
}
