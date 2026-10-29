import type { ReactNode } from "react";

/** A minimal window chrome around a screenshot, with the site's address. */
export function BrowserFrame({ url, children, className = "" }: { url?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line-strong bg-surface shadow-card ${className}`}>
      <div className="flex h-8 items-center gap-1.5 border-b border-line bg-surface-2 px-3" aria-hidden>
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        {url ? (
          <span className="ml-3 truncate font-mono text-[0.65rem] text-subtle">{url.replace(/^https?:\/\/(www\.)?/, "")}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}
