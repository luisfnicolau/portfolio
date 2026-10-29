import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { featuredProjects } from "@/content/projects";
import type { Project } from "@/content/types";
import { getDictionary } from "@/content/ui";
import { formatPeriod, workPath, type Locale } from "@/lib/i18n";
import { BrowserFrame } from "../ui/browser-frame";
import { ButtonLink } from "../ui/button";
import { StatusBadge } from "../ui/status-badge";
import { ProjectCard } from "../work/project-card";
import { Section } from "../ui/section";

function FlagshipCard({ project, locale }: { project: Project; locale: Locale }) {
  const t = getDictionary(locale).project;
  const site = project.links?.find((link) => link.kind === "site");
  return (
    <article className="reveal overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col p-7 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="kicker text-accent-ink">{t.kind.flagship}</span>
            {project.status ? <StatusBadge status={project.status} label={t.status[project.status]} /> : null}
          </div>
          <h3 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{project.name}</h3>
          <p className="mt-2 text-sm text-subtle">
            {project.role[locale]} · {formatPeriod(project.period, locale)}
          </p>
          <p className="mt-6 text-lg/relaxed text-pretty text-muted">{project.tagline[locale]}</p>
          {project.metrics ? (
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
              {project.metrics.map((metric) => (
                <div key={metric.label.en} className="flex flex-col gap-1">
                  <dt className="text-xs/snug text-subtle">{metric.label[locale]}</dt>
                  <dd className="order-first text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{metric.value[locale]}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <div className="mt-auto flex flex-wrap gap-3 pt-10">
            <ButtonLink href={workPath(locale, project.slug)} variant="primary" icon={<ArrowRight size={16} aria-hidden />}>
              {t.caseStudy}
            </ButtonLink>
            {site ? (
              <ButtonLink href={site.href} icon={<ArrowUpRight size={16} aria-hidden />}>
                {t.link.site}
              </ButtonLink>
            ) : null}
          </div>
        </div>
        {project.image ? (
          <div className="relative overflow-hidden border-t border-line bg-bg-elevated p-5 sm:p-8 lg:border-t-0 lg:border-l">
            <div
              aria-hidden
              className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_70%_40%,#000_20%,transparent_80%)]"
            />
            <BrowserFrame url={site?.href} className="relative lg:translate-x-6 lg:translate-y-6">
              <Image
                src={project.image.src}
                alt={project.image.alt[locale]}
                sizes="(min-width: 1024px) 640px, 100vw"
                placeholder="blur"
                className="h-auto w-full"
              />
            </BrowserFrame>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function SelectedWork({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).sections.work;
  const [flagship, ...products] = featuredProjects;
  return (
    <Section id="work" index="02" kicker={t.kicker} title={t.title} lead={t.lead}>
      <FlagshipCard project={flagship} locale={locale} />
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {products.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            locale={locale}
            sizes="(min-width: 1152px) 368px, (min-width: 768px) 33vw, 100vw"
          />
        ))}
      </div>
    </Section>
  );
}
