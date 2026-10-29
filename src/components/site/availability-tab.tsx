import Link from "next/link";
import { getDictionary } from "@/content/ui";
import { sectionPath, type Locale } from "@/lib/i18n";

/** The vertical "available" tab on the left edge, on wide screens only. */
export function AvailabilityTab({ locale }: { locale: Locale }) {
  return (
    <Link
      href={sectionPath(locale, "contact")}
      className="kicker fixed top-1/2 left-0 z-30 hidden -translate-y-1/2 rotate-180 items-center gap-2.5 rounded-l-xl border border-r-0 border-line bg-surface/90 px-2 py-5 text-[0.62rem] text-muted backdrop-blur transition-colors [writing-mode:vertical-rl] hover:text-fg xl:flex"
    >
      <span aria-hidden className="size-1.5 rounded-full bg-ok" />
      {getDictionary(locale).header.available}
    </Link>
  );
}
