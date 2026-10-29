import { FileText, Mail, MapPin } from "lucide-react";
import { contact, cv, profile } from "@/content/profile";
import { getDictionary } from "@/content/ui";
import { otherLocale, type Locale } from "@/lib/i18n";
import { LocalClock } from "../site/local-clock";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "../ui/brand-icons";
import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";
import { CopyEmail } from "./copy-email";

export function Contact({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const s = t.sections.contact;
  const other = otherLocale(locale);
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-line py-24 sm:py-32">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_100%,#000_20%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-64 left-1/2 -z-10 h-[36rem] w-[60rem] max-w-[160vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]"
      />
      <Container>
        <p className="kicker flex items-center gap-3 text-subtle">
          <span className="text-accent-ink">08</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          {s.kicker}
        </p>
        <h2
          id="contact-title"
          className="text-metal mt-6 pb-[0.12em] text-[clamp(2.75rem,8.5vw,6.5rem)] leading-[0.95] font-extrabold tracking-[-0.05em]"
        >
          {s.title}
        </h2>
        <p className="mt-6 max-w-2xl text-lg/relaxed text-pretty text-muted">{s.lead}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={`mailto:${contact.email}`} variant="primary" icon={<Mail size={16} aria-hidden />}>
            {s.email}
          </ButtonLink>
          <CopyEmail email={contact.email} label={s.copy} copiedLabel={s.copied} />
          <ButtonLink href={contact.whatsapp} icon={<WhatsAppIcon size={16} />}>
            WhatsApp
          </ButtonLink>
          <ButtonLink href={contact.linkedin} icon={<LinkedInIcon size={16} />}>
            LinkedIn
          </ButtonLink>
          <ButtonLink href={contact.github} icon={<GitHubIcon size={16} />}>
            GitHub
          </ButtonLink>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-8 text-sm text-muted">
          <p className="flex items-center gap-2">
            <MapPin size={15} aria-hidden className="text-subtle" />
            {profile.location[locale]}
          </p>
          <p className="flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full bg-ok" />
            <LocalClock label={t.header.localTime} className="inline-flex" />
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <FileText size={15} aria-hidden className="text-subtle" />
            <a href={cv[locale].href} target="_blank" className="font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent">
              {cv[locale].label}
            </a>
            <a
              href={cv[other].href}
              target="_blank"
              hrefLang={other === "pt" ? "pt-BR" : "en"}
              className="underline decoration-line-strong underline-offset-4 hover:text-fg hover:decoration-accent"
            >
              {cv[other].label}
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
