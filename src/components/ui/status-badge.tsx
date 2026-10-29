import type { ProjectStatus } from "@/content/types";

const tone: Record<ProjectStatus, string> = {
  live: "bg-ok",
  "invite-only": "bg-ok",
  beta: "bg-accent",
  demo: "bg-accent",
  personal: "bg-subtle",
};

/** Status shown as color + dot + words, never color alone. */
export function StatusBadge({ status, label, className = "" }: { status: ProjectStatus; label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-bg/80 px-2.5 py-1 text-[0.7rem] font-medium tracking-wide text-muted backdrop-blur ${className}`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${tone[status]}`} />
      {label}
    </span>
  );
}
