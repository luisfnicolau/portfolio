import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { contact } from "@/content/profile";
import { projects, projectImage } from "@/content/projects";
import type { Project } from "@/content/types";
import { getDictionary } from "@/content/ui";
import { formatPeriod, otherLocale, sectionPath, workPath, type Locale } from "@/lib/i18n";
import { AvailabilityTab } from "../site/availability-tab";
import { Footer } from "../site/footer";
import { Header } from "../site/header";
import { LanguageHint } from "../site/language-hint";
import { BrowserFrame } from "../ui/browser-frame";
import { ButtonLink } from "../ui/button";
import { ChipList } from "../ui/chip";
import { Container } from "../ui/container";
import { tidy } from "@/lib/typography";
import { StatusBadge } from "../ui/status-badge";
import { Benchmarks } from "./benchmarks";
import { Pipeline } from "./pipeline";
import { Poster } from "./poster";

/** A titled block of the project page: label on the left on wide screens, content on the right. */
function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
      <h2 id={id} className="kicker pt-1 text-subtle lg:sticky lg:top-24 lg:self-start">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function ProjectPage({ project, locale }: { project: Project; locale: Locale }) {
  const t = getDictionary(locale);
  const p = t.project;
  const alternateHref = workPath(otherLocale(locale), project.slug);
  const index = projects.indexOf(project);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const site = project.links?.find((link) => link.kind === "site" || link.kind === "demo");

  return (
    <>
      <Header locale={locale} alternateHref={alternateHref} />
      <AvailabilityTab locale={locale} />
      <main id="main">
        <article>
          <header className="relative isolate overflow-hidden border-b border-line">
            <div
              aria-hidden
              className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_0%,#000_20%,transparent_75%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-56 -left-20 -z-10 h-[34rem] w-[50rem] max-w-[140vw] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]"
            />
            <Container className="pt-8 pb-14 sm:pt-12 sm:pb-20">
              <Link
                href={sectionPath(locale, project.kind === "lab" ? "labs" : "work")}
                className="inline-flex items-center gap-2 rounded-full py-2 text-sm text-muted transition-colors hover:text-fg"
              >
                <ArrowLeft size={15} aria-hidden />
                {p.back}
              </Link>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <span className="kicker text-accent-ink">{p.kind[project.kind]}</span>
                {project.status ? <StatusBadge status={project.status} label={p.status[project.status]} /> : null}
              </div>
              <h1 className="text-metal mt-4 pb-[0.14em] text-[clamp(3rem,10vw,7.5rem)] leading-[0.92] font-extrabold tracking-[-0.055em]">
                {project.name}
              </h1>
              <p className="mt-5 max-w-3xl text-xl/relaxed text-pretty text-muted sm:text-2xl/relaxed">
                {project.tagline[locale]}
              </p>

              <dl className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
                <div>
                  <dt className="kicker text-[0.65rem] text-subtle">{p.role}</dt>
                  <dd className="mt-1.5 font-medium">{project.role[locale]}</dd>
                </div>
                <div>
                  <dt className="kicker text-[0.65rem] text-subtle">{p.period}</dt>
                  <dd className="mt-1.5 font-medium">{formatPeriod(project.period, locale)}</dd>
                </div>
                {project.location ? (
                  <div>
                    <dt className="kicker text-[0.65rem] text-subtle">{p.location}</dt>
                    <dd className="mt-1.5 font-medium">{project.location[locale]}</dd>
                  </div>
                ) : null}
              </dl>

              {project.links?.length ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.links.map((link, i) => (
                    <ButtonLink
                      key={link.href}
                      href={link.href}
                      variant={i === 0 ? "primary" : "secondary"}
                      icon={<ArrowUpRight size={16} aria-hidden />}
                    >
                      {p.link[link.kind]}
                    </ButtonLink>
                  ))}
                </div>
              ) : null}
            </Container>
          </header>

          <Container className="space-y-20 py-16 sm:space-y-28 sm:py-24">
            {project.image ? (
              <BrowserFrame url={site?.href} className="reveal">
                <Image
                  src={projectImage(project.image, locale)}
                  alt={project.image.alt[locale]}
                  sizes="(min-width: 1152px) 1088px, 100vw"
                  placeholder="blur"
                  loading="eager"
                  fetchPriority="high"
                  className="h-auto w-full"
                />
              </BrowserFrame>
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line sm:aspect-[21/9]">
                <Poster project={project} locale={locale} />
              </div>
            )}

            {project.metrics ? (
              <Block id="numbers" title={p.numbers}>
                <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
                  {project.metrics.map((metric) => (
                    <div key={metric.label.en} className="flex flex-col gap-1.5 bg-bg p-5 sm:p-6">
                      <dt className="text-xs/snug text-subtle sm:text-sm/snug">{metric.label[locale]}</dt>
                      <dd className="order-first text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{metric.value[locale]}</dd>
                    </div>
                  ))}
                </dl>
              </Block>
            ) : null}

            <Block id="overview" title={p.overview}>
              <div className="max-w-3xl space-y-5 text-lg/relaxed text-pretty text-muted">
                {project.summary[locale].map((paragraph, i) => (
                  <p key={paragraph.slice(0, 32)} className={i === 0 ? "text-fg" : ""}>
                    {tidy(paragraph)}
                  </p>
                ))}
                {project.note ? (
                  <p className="rounded-2xl border border-line border-l-accent bg-surface px-5 py-4 text-base/relaxed">
                    {project.note[locale]}
                  </p>
                ) : null}
              </div>
            </Block>

            {project.visuals?.includes("olhonalei-pipeline") ? (
              <Block id="pipeline" title={p.pipeline}>
                <Pipeline locale={locale} />
              </Block>
            ) : null}

            <Block id="built" title={p.built}>
              <ol className="max-w-3xl space-y-4">
                {project.highlights[locale].map((highlight, i) => (
                  <li key={highlight.slice(0, 40)} className="reveal flex gap-4 text-[1.02rem]/relaxed text-pretty text-muted">
                    <span className="mt-0.5 font-mono text-xs text-accent-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span>{tidy(highlight)}</span>
                  </li>
                ))}
              </ol>
            </Block>

            {project.benchmarks ? (
              <Block id="benchmarks" title={p.performance}>
                <Benchmarks items={project.benchmarks} locale={locale} />
              </Block>
            ) : null}

            {project.caseStudies ? (
              <Block id="stories" title={p.stories}>
                <div className="space-y-6">
                  {project.caseStudies.map((story) => (
                    <section
                      key={story.id}
                      aria-labelledby={`story-${story.id}`}
                      className="reveal rounded-3xl border border-line bg-surface p-6 sm:p-9"
                    >
                      <h3 id={`story-${story.id}`} className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                        {story.title[locale]}
                      </h3>
                      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                        <div>
                          <h4 className="kicker text-[0.65rem] text-subtle">{p.problem}</h4>
                          <p className="mt-3 text-[0.98rem]/relaxed text-pretty text-muted">{tidy(story.problem[locale])}</p>
                        </div>
                        <div>
                          <h4 className="kicker text-[0.65rem] text-subtle">{p.approach}</h4>
                          <ul className="mt-3 space-y-2.5 text-[0.98rem]/relaxed text-pretty text-muted">
                            {story.approach[locale].map((step) => (
                              <li key={step.slice(0, 40)} className="relative pl-5">
                                <span aria-hidden className="absolute top-[0.62em] left-0.5 size-1.5 rounded-full bg-accent" />
                                {tidy(step)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {story.result || story.lesson ? (
                        <div className="mt-8 grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                          {story.result ? (
                            <div className="lg:col-start-2 lg:row-start-1">
                              <h4 className="kicker text-[0.65rem] text-subtle">{p.result}</h4>
                              <p className="mt-3 font-medium text-pretty">{tidy(story.result[locale])}</p>
                            </div>
                          ) : null}
                          {story.lesson ? (
                            <div className="lg:col-start-1 lg:row-start-1">
                              <h4 className="kicker text-[0.65rem] text-subtle">{p.lesson}</h4>
                              <p className="mt-2 font-serif text-2xl/snug text-accent-ink italic">{story.lesson[locale]}</p>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </section>
                  ))}
                </div>
              </Block>
            ) : null}

            {project.decisions ? (
              <Block id="decisions" title={p.decisions}>
                <ol className="grid gap-3 sm:grid-cols-2">
                  {project.decisions[locale].map((decision, i) => (
                    <li key={decision.slice(0, 40)} className="reveal rounded-2xl border border-line bg-surface p-5">
                      <p className="font-mono text-xs text-accent-ink">ADR {String(i + 1).padStart(2, "0")}</p>
                      <p className="mt-2 text-[0.95rem]/relaxed text-pretty text-muted">{tidy(decision)}</p>
                    </li>
                  ))}
                </ol>
              </Block>
            ) : null}

            <Block id="stack" title={p.stack}>
              <ChipList items={project.stack} />
            </Block>
          </Container>

          <nav aria-label={`${p.previous} / ${p.next}`} className="border-t border-line">
            <Container className="grid gap-px py-0 sm:grid-cols-2">
              <Link href={workPath(locale, previous.slug)} className="group flex flex-col gap-1 py-8 sm:pr-8">
                <span className="flex items-center gap-2 text-xs text-subtle">
                  <ArrowLeft size={14} aria-hidden className="transition-transform group-hover:-translate-x-0.5" />
                  {p.previous}
                </span>
                <span className="text-xl font-semibold tracking-tight">{previous.name}</span>
              </Link>
              <Link
                href={workPath(locale, next.slug)}
                className="group flex flex-col items-end gap-1 border-t border-line py-8 text-right sm:border-t-0 sm:border-l sm:pl-8"
              >
                <span className="flex items-center gap-2 text-xs text-subtle">
                  {p.next}
                  <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="text-xl font-semibold tracking-tight">{next.name}</span>
              </Link>
            </Container>
          </nav>

          <section className="border-t border-line bg-bg-elevated">
            <Container className="flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center">
              <p className="text-2xl font-semibold tracking-tight text-balance">{p.more}</p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={`mailto:${contact.email}`} variant="primary" icon={<Mail size={16} aria-hidden />}>
                  {t.sections.contact.email}
                </ButtonLink>
                <ButtonLink href={sectionPath(locale, "contact")}>{t.nav.contact}</ButtonLink>
              </div>
            </Container>
          </section>
        </article>
      </main>
      <Footer locale={locale} alternateHref={alternateHref} />
      <LanguageHint locale={locale} alternateHref={alternateHref} />
    </>
  );
}
