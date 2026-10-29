import { marquee } from "@/content/skills";

/** The scrolling tech ribbon. Decorative: the same names are listed in Skills. */
export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-line bg-bg-elevated py-4 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"
    >
      <ul className="flex w-max motion-safe:animate-[marquee_70s_linear_infinite] hover:[animation-play-state:paused]">
        {items.map((item, index) => (
          <li key={index} className="kicker flex items-center text-subtle">
            <span className="px-6">{item}</span>
            <span className="text-accent-ink">✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
