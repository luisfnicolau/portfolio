import { agentTools, agentWorkflow, principles } from "@/content/principles";
import { earlierRoles, education, employment } from "@/content/experience";
import { contact, cv, profile, stats } from "@/content/profile";
import { projects } from "@/content/projects";
import { coreStack, skillGroups } from "@/content/skills";
import type { Localized } from "@/content/types";
import { formatPeriod, sectionPath, workPath, type Locale } from "@/lib/i18n";

/** One passage the chat can retrieve and cite: a project section, a role, a skill group… */
export interface Passage {
  id: string;
  title: Localized;
  /** Where the visitor can read it on the site. */
  href: Localized;
  text: Localized;
}

const both = (make: (locale: Locale) => string): Localized => ({ en: make("en"), pt: make("pt") });
const lines = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join("\n");
const bullets = (items: string[]) => items.map((item) => `- ${item}`).join("\n");
const label = (item: string | Localized, locale: Locale) => (typeof item === "string" ? item : item[locale]);

const statusWords: Record<string, Localized> = {
  live: { en: "live", pt: "no ar" },
  "invite-only": { en: "invite-only", pt: "só por convite" },
  beta: { en: "in beta", pt: "em beta" },
  demo: { en: "demo", pt: "demo" },
  personal: { en: "personal use", pt: "uso pessoal" },
};

function projectPassages(): Passage[] {
  return projects.flatMap((project) => {
    const href = both((locale) => workPath(locale, project.slug));
    const title = (suffix?: Localized) => both((locale) => (suffix ? `${project.name}: ${suffix[locale]}` : project.name));
    const overview: Passage = {
      id: `${project.slug}`,
      title: title(),
      href,
      text: both((locale) =>
        lines(
          `${project.name} (${formatPeriod(project.period, locale)}${project.status ? `, ${statusWords[project.status][locale]}` : ""})`,
          `${locale === "en" ? "Luis's role" : "Papel do Luis"}: ${project.role[locale]}`,
          project.location?.[locale],
          project.tagline[locale],
          ...project.summary[locale],
          project.note?.[locale],
          project.links?.length ? `Links: ${project.links.map((link) => link.href).join(", ")}` : undefined,
        ),
      ),
    };
    const details: Passage = {
      id: `${project.slug}-highlights`,
      title: title({ en: "highlights and stack", pt: "destaques e stack" }),
      href,
      text: both((locale) =>
        lines(
          bullets(project.highlights[locale]),
          project.metrics?.length
            ? bullets(project.metrics.map((metric) => `${metric.value[locale]} ${metric.label[locale]}`))
            : undefined,
          project.benchmarks?.length
            ? bullets(
                project.benchmarks.map(
                  (benchmark) =>
                    `${benchmark.label[locale]}: ${benchmark.before.text[locale]} → ${benchmark.after.text[locale]}`,
                ),
              )
            : undefined,
          `Stack: ${project.stack.join(", ")}`,
        ),
      ),
    };
    const cases: Passage[] = (project.caseStudies ?? []).map((study) => ({
      id: `${project.slug}-${study.id}`,
      title: title(study.title),
      href,
      text: both((locale) => {
        const words =
          locale === "en"
            ? { problem: "Problem", approach: "What Luis did", result: "Result", lesson: "Lesson" }
            : { problem: "Problema", approach: "O que o Luis fez", result: "Resultado", lesson: "Lição" };
        return lines(
          `${words.problem}: ${study.problem[locale]}`,
          `${words.approach}:\n${bullets(study.approach[locale])}`,
          study.result && `${words.result}: ${study.result[locale]}`,
          study.lesson && `${words.lesson}: ${study.lesson[locale]}`,
        );
      }),
    }));
    const decisions: Passage[] = project.decisions
      ? [
          {
            id: `${project.slug}-decisions`,
            title: title({ en: "technical decisions", pt: "decisões técnicas" }),
            href,
            text: both((locale) => bullets(project.decisions![locale])),
          },
        ]
      : [];
    return [overview, details, ...cases, ...decisions];
  });
}

function experiencePassages(): Passage[] {
  const href = both((locale) => sectionPath(locale, "experience"));
  const roles: Passage[] = employment.map((role) => ({
    id: `role-${role.id}`,
    title: both((locale) => `${role.company}: ${role.title[locale]}`),
    href,
    text: both((locale) =>
      lines(
        `${role.title[locale]}, ${role.company} (${formatPeriod(role.period, locale)})`,
        role.context[locale],
        bullets(role.bullets[locale]),
      ),
    ),
  }));
  const earlier: Passage = {
    id: "roles-earlier",
    title: { en: "Earlier roles (2014–2018)", pt: "Experiências anteriores (2014–2018)" },
    href,
    text: both((locale) =>
      bullets(
        earlierRoles.map(
          (role) => `${role.title[locale]}, ${role.company} (${formatPeriod(role.period, locale)}): ${role.summary[locale]}`,
        ),
      ),
    ),
  };
  return [...roles, earlier];
}

function profilePassages(): Passage[] {
  const about = both((locale) => sectionPath(locale, "about"));
  return [
    {
      id: "profile",
      title: { en: "About Luis", pt: "Sobre o Luis" },
      href: about,
      text: both((locale) =>
        lines(
          `${profile.name} (${profile.shortName}), ${profile.title[locale]}.`,
          profile.oneLiner[locale],
          ...profile.about[locale],
        ),
      ),
    },
    {
      id: "facts",
      title: { en: "Quick facts, availability and contact", pt: "Dados rápidos, disponibilidade e contato" },
      href: both((locale) => sectionPath(locale, "contact")),
      text: both((locale) =>
        lines(
          bullets(profile.facts.map((fact) => `${fact.label[locale]}: ${fact.value[locale]}`)),
          `${profile.availability[locale]}. ${profile.remote[locale]}.`,
          `${locale === "en" ? "Location" : "Localização"}: ${profile.location[locale]}`,
          `E-mail: ${contact.email}`,
          `WhatsApp: ${contact.whatsapp}`,
          `LinkedIn: ${contact.linkedin}`,
          `GitHub: ${contact.github}`,
          `${locale === "en" ? "CV (PDF)" : "Currículo (PDF)"}: ${cv.en.href} (English), ${cv.pt.href} (Português)`,
          bullets(stats.map((stat) => `${stat.value[locale]} ${stat.label[locale]}`)),
        ),
      ),
    },
    {
      id: "education",
      title: { en: "Education, certifications and languages", pt: "Formação, certificações e idiomas" },
      href: both((locale) => sectionPath(locale, "background")),
      text: both((locale) =>
        lines(
          `${education.school}: ${education.course[locale]}. ${education.note[locale]}`,
          `${locale === "en" ? "Certifications" : "Certificações"}: ${education.certifications.join(", ")}`,
          `${locale === "en" ? "Languages" : "Idiomas"}: ${education.languages[locale].join(", ")}`,
          education.content[locale],
        ),
      ),
    },
  ];
}

function skillPassages(): Passage[] {
  const href = both((locale) => sectionPath(locale, "skills"));
  return [
    {
      id: "skills-core",
      title: { en: "Core stack and years of experience", pt: "Stack principal e anos de experiência" },
      href,
      text: both((locale) =>
        bullets(coreStack.map((skill) => `${skill.name}: ${skill.years[locale]} (${skill.note[locale]})`)),
      ),
    },
    ...skillGroups.map((group, index) => ({
      id: `skills-${index + 1}`,
      title: both((locale) => `${locale === "en" ? "Skills" : "Competências"}: ${group.title[locale]}`),
      href,
      text: both((locale) => `${group.title[locale]}: ${group.items.map((item) => label(item, locale)).join(", ")}`),
    })),
  ];
}

function workStylePassages(): Passage[] {
  const href = both((locale) => sectionPath(locale, "how-i-work"));
  return [
    {
      id: "principles",
      title: { en: "How Luis works", pt: "Como o Luis trabalha" },
      href,
      text: both((locale) => bullets(principles.map((item) => `${item.title[locale]}: ${item.body[locale]}`))),
    },
    {
      id: "ai-agents",
      title: { en: "Working with AI coding agents", pt: "Trabalho com agentes de IA" },
      href,
      text: both((locale) =>
        lines(bullets(agentWorkflow.map((item) => `${item.step[locale]}: ${item.body[locale]}`)), agentTools[locale]),
      ),
    },
  ];
}

const AI_WORK = /\b(AI|LLMs?|Claude|semantic|embeddings?|RAG|Whisper|AI\/ML|agents?|machine-learning|machine learning)\b/;

// Using AI to write code is a way of working, not AI work: it goes on its own line, after the timeline.
const CODING_TOOLS = /AI-assisted|coding agents?|Copilot|Cursor/;
const aiWork = (text: string) => AI_WORK.test(text) && !CODING_TOOLS.test(text);

/**
 * One passage with every AI-related role and project in chronological order, so a broad question
 * ("has he worked with AI?") retrieves the whole arc, from machine learning at Jovens Gênios to
 * LLMs at The Contract Network to his own products, instead of the single closest project.
 */
function aiOverviewPassage(): Passage {
  return {
    id: "ai-overview",
    title: {
      en: "Luis's AI work over time: machine learning, LLMs in a job, then his own AI products",
      pt: "Trabalho do Luis com IA ao longo do tempo: machine learning, LLMs em emprego e depois produtos próprios",
    },
    href: both((locale) => sectionPath(locale, "experience")),
    text: both((locale) => {
      const roles = employment
        .filter((role) => role.bullets.en.some(aiWork))
        .map((role) => ({
          from: role.period.from,
          line: `- ${formatPeriod(role.period, locale)}, ${role.company} (${role.title[locale]}, ${locale === "en" ? "job" : "emprego"}): ${role.bullets[locale].filter((_, index) => aiWork(role.bullets.en[index])).join(" ")}`,
        }));
      const products = projects
        .filter((project) => aiWork(project.tagline.en) || project.highlights.en.some(aiWork))
        .map((project) => ({
          from: project.period.from,
          line: `- ${formatPeriod(project.period, locale)}, ${project.name} (${project.role[locale]}): ${[
            project.tagline[locale],
            ...project.highlights[locale].filter((_, index) => aiWork(project.highlights.en[index])),
          ].join(" ")}`,
        }));
      const timeline = [...roles, ...products].sort((a, b) => a.from.localeCompare(b.from)).map((entry) => entry.line);
      return lines(...timeline, `${locale === "en" ? "Tools he codes with" : "Ferramentas com que programa"}: ${agentTools[locale]}`);
    }),
  };
}

/** Everything the chat may say, built from the same content as the pages, so the two never drift apart. */
export const passages: Passage[] = [
  ...profilePassages(),
  aiOverviewPassage(),
  ...projectPassages(),
  ...experiencePassages(),
  ...skillPassages(),
  ...workStylePassages(),
];

/** Always in the prompt: who Luis is and how to reach him, whatever the question. */
export const pinnedPassageIds = ["facts"];
