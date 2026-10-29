import type { Project } from "@/content/types";
import type { Locale } from "@/lib/i18n";

/** Card art for products without a live screenshot: their headline number. */
export function Poster({ project, locale }: { project: Project; locale: Locale }) {
  if (!project.poster) return null;
  return (
    <div className="absolute inset-0 flex flex-col justify-end overflow-hidden bg-bg-elevated p-6 sm:p-7">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_90%_80%_at_100%_0%,#000_10%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]"
      />
      <span className="absolute top-5 right-6 font-mono text-[0.7rem] tracking-widest text-subtle uppercase">
        {project.name}
      </span>
      <p className="text-metal relative text-5xl font-extrabold tracking-[-0.05em] sm:text-6xl">
        {project.poster.figure[locale]}
      </p>
      <p className="kicker relative mt-2 text-subtle">{project.poster.caption[locale]}</p>
    </div>
  );
}
