import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/types";
import { getDictionary } from "@/content/ui";
import { formatPeriod, workPath, type Locale } from "@/lib/i18n";
import { ChipList } from "../ui/chip";
import { StatusBadge } from "../ui/status-badge";
import { Poster } from "./poster";
import { projectImage } from "@/content/projects";

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  /** `sizes` for the screenshot, matching the grid the card sits in. */
  sizes: string;
  className?: string;
}

/**
 * The whole card links to the project page (stretched link on the title); the off-site link
 * sits above that layer so it stays clickable on its own.
 */
export function ProjectCard({ project, locale, sizes, className = "" }: ProjectCardProps) {
  const t = getDictionary(locale).project;
  const live = project.links?.find((link) => link.kind === "site" || link.kind === "demo");
  return (
    <article
      className={`group reveal relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-line-strong ${className}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-2">
        {project.image ? (
          <Image
            src={projectImage(project.image, locale)}
            alt={project.image.alt[locale]}
            sizes={sizes}
            placeholder="blur"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <Poster project={project} locale={locale} />
        )}
        {project.status ? (
          <StatusBadge status={project.status} label={t.status[project.status]} className="absolute top-3 left-3" />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="kicker text-[0.65rem] text-subtle">
          {t.kind[project.kind]} · {formatPeriod(project.period, locale)}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight">
          <Link href={workPath(locale, project.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-subtle">{project.role[locale]}</p>
        <p className="mt-4 text-[0.95rem]/relaxed text-pretty text-muted">{project.tagline[locale]}</p>
        <div className="mt-5">
          <ChipList items={project.stack.slice(0, 4)} label={t.stack} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            {project.caseStudies ? t.caseStudy : t.details}
            <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </span>
          {live ? (
            <a
              href={live.href}
              target="_blank"
              rel="noreferrer"
              className="relative z-10 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-subtle transition-colors hover:text-accent-ink"
            >
              {t.link[live.kind]}
              <ArrowUpRight size={13} aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
