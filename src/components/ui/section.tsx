import type { ReactNode } from "react";
import { Container } from "./container";

interface SectionProps {
  id: string;
  index: string;
  kicker: string;
  title: ReactNode;
  lead?: string;
  children: ReactNode;
  className?: string;
}

/** A home-page section: numbered mono label, large title, optional lead, then content. */
export function Section({ id, index, kicker, title, lead, children, className = "" }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={`border-t border-line py-20 sm:py-28 ${className}`}>
      <Container>
        <header className="reveal max-w-3xl">
          <p className="kicker flex items-center gap-3 text-subtle">
            <span className="text-accent-ink">{index}</span>
            <span aria-hidden className="h-px w-8 bg-line-strong" />
            {kicker}
          </p>
          <h2 id={headingId} className="mt-5 text-3xl font-bold tracking-[-0.03em] text-balance sm:text-5xl">
            {title}
          </h2>
          {lead ? <p className="mt-5 max-w-2xl text-lg/relaxed text-pretty text-muted">{lead}</p> : null}
        </header>
        <div className="mt-12 sm:mt-16">{children}</div>
      </Container>
    </section>
  );
}
