import { Download, Mail } from "lucide-react";
import Image from "next/image";
import { fallbackAnswer, fallbackLinks, intents } from "@/content/ask";
import { contact, cv, profile, stats } from "@/content/profile";
import { getDictionary } from "@/content/ui";
import type { AskLink } from "@/lib/ask";
import { sectionPath, type Locale } from "@/lib/i18n";
import { tidy } from "@/lib/typography";
import { GitHubIcon, LinkedInIcon } from "../ui/brand-icons";
import { ButtonLink, IconLink } from "../ui/button";
import { Container } from "../ui/container";
import { Ask, type AskEntry } from "./ask";

const resolveLinks = (links: AskLink[] | undefined, locale: Locale) =>
  (links ?? []).map((link) => ({
    label: link.label[locale],
    href: typeof link.href === "string" ? link.href : link.href[locale],
  }));

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [first, ...rest] = profile.headline[locale];
  const accent = rest.pop();
  // Only this language's answers go to the browser.
  const entries: AskEntry[] = intents.map((intent) => ({
    id: intent.id,
    keywords: intent.keywords,
    answer: tidy(intent.answer[locale]),
    links: resolveLinks(intent.links, locale),
  }));

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_20%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-56 left-[8%] -z-10 h-[38rem] w-[56rem] max-w-[140vw] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]"
      />

      <Container className="pt-14 pb-16 sm:pt-20 lg:pt-24 lg:pb-20">
        <p className="kicker flex items-center gap-3 text-muted">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full rounded-full bg-ok motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]" />
            <span className="relative inline-flex size-2 rounded-full bg-ok" />
          </span>
          {profile.availability[locale]}
        </p>

        <h1
          id="hero-title"
          className={`mt-7 leading-[0.98] font-extrabold tracking-[-0.05em] ${
            locale === "pt" ? "text-[clamp(2.3rem,6.6vw,4.9rem)]" : "text-[clamp(2.4rem,7.4vw,5.6rem)]"
          }`}
        >
          <span className="block">{first}</span>
          {rest.map((line) => (
            <span key={line} className="text-metal block pb-[0.04em]">
              {line}
            </span>
          ))}
          <span className="block font-serif font-normal tracking-[-0.02em] text-accent-ink italic">{accent}</span>
        </h1>

        <div className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end lg:gap-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-4">
              <Image
                src={profile.photo.avatar}
                alt=""
                sizes="56px"
                loading="eager"
                className="size-14 shrink-0 rounded-full border border-line-strong object-cover"
              />
              <p className="text-lg font-semibold tracking-tight">
                {profile.shortName} <span className="font-normal text-subtle">·</span>{" "}
                <span className="font-medium text-muted">{profile.title[locale]}</span>
              </p>
            </div>
            <p className="mt-3 text-base/relaxed text-pretty text-muted">{profile.intro[locale]}</p>
            <p className="kicker mt-5 text-subtle">{profile.remote[locale]}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={sectionPath(locale, "contact")} variant="primary">
                {t.hero.contact}
              </ButtonLink>
              <ButtonLink href={cv[locale].href} icon={<Download size={16} aria-hidden />}>
                {t.hero.cv}
              </ButtonLink>
              <div className="flex items-center gap-2">
                <IconLink href={contact.linkedin} label="LinkedIn">
                  <LinkedInIcon size={17} />
                </IconLink>
                <IconLink href={contact.github} label="GitHub">
                  <GitHubIcon size={17} />
                </IconLink>
                <IconLink href={`mailto:${contact.email}`} label={contact.email}>
                  <Mail size={17} aria-hidden />
                </IconLink>
              </div>
            </div>
          </div>
          <Ask
            entries={entries}
            fallback={{ answer: fallbackAnswer[locale], links: resolveLinks(fallbackLinks, locale) }}
            copy={t.ask}
          />
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:mt-20 lg:grid-cols-5">
          {stats.map((stat, index) => (
            <div
              key={stat.label.en}
              className={`flex flex-col gap-1.5 bg-bg p-5 sm:p-6 ${index === stats.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <dt className="text-xs/snug text-subtle sm:text-sm/snug">{stat.label[locale]}</dt>
              <dd className="order-first text-2xl font-semibold tracking-[-0.03em] whitespace-nowrap sm:text-[1.7rem]">
                {stat.value[locale]}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
