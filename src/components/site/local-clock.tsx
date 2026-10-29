"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/content/profile";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: profile.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

// Whole seconds, so the snapshot only changes once per tick.
const getSeconds = () => Math.floor(Date.now() / 1000);

/** Luis's local time, ticking. Not announced by screen readers on every tick. */
export function LocalClock({ label, className = "" }: { label: string; className?: string }) {
  const seconds = useSyncExternalStore(subscribe, getSeconds, () => null);
  return (
    <span className={`items-center gap-2 font-mono text-xs text-subtle tabular-nums ${className}`} title={label}>
      <span className="sr-only">{label}</span>
      <span aria-hidden>{seconds === null ? "--:--:--" : format.format(seconds * 1000)}</span>
      <span aria-hidden className="text-subtle/70">{profile.utcOffset}</span>
    </span>
  );
}
