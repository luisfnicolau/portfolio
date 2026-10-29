# UI Guidelines

The look: dark-first and engineer-friendly, after the references Luis picked (arfazrll's heavy metallic type, Alaia's mono status line and italic accent, ChatFolio's chat box). Strong type, generous space, one accent, subtle motion.

## Tokens (`src/app/globals.css`)

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#f7f6f3` | `#08080a` | page |
| `surface` / `surface-2` | `#ffffff` / `#f0eee9` | `#111114` / `#18181c` | cards, chips |
| `line` / `line-strong` | `#e3e0d9` / `#cfcac1` | `#222228` / `#33333b` | borders, grid |
| `fg` / `muted` / `subtle` | `#0d0c0b` / `#4b4743` / `#67625d` | `#f4f4f5` / `#a9a9b3` / `#8c8c97` | text (all ≥ 4.5:1 on `bg`) |
| `accent` | `#ff6b2c` | `#ff6b2c` | fills, with `on-accent` text (`#0d0c0b`) |
| `accent-ink` | `#b33e08` | `#ff7d43` | accent-colored text (≥ 4.5:1) |
| `ok` | `#15803d` | `#4ade80` | "available" and "live" dots |

Never use a raw hex in a component; add a token.

## Typography (`src/app/fonts.ts`)

- **Inter** for everything; headlines 700–800 with tight tracking (`-0.03em` to `-0.055em`).
- **Instrument Serif italic** only for one accent phrase per headline (hero's last line, lessons), in `accent-ink`.
- **JetBrains Mono** for small uppercase labels (`kicker` utility), dates, the clock.
- `text-metal`: white-to-gray (dark) or black-to-gray (light) sheen for display text. Give it `pb-[0.12em]` or more when the line height is tight, or descenders get clipped.

## Components

- Pill buttons (`ButtonLink`): `primary` (accent) once per area, `secondary` otherwise. Minimum 44px tall.
- Cards: `rounded-2xl` (`rounded-3xl` for feature panels), `border-line`, `bg-surface`; whole card clickable through a stretched link on the title.
- Status is a dot + words, never color alone (`StatusBadge`).
- Section headers: number in `accent-ink`, a rule, the kicker, then a large title (`Section`).

## Motion

- Scroll-driven CSS only: `.reveal` (fade/rise over each element's first 120px on screen). Off for `prefers-reduced-motion` and print.
- Nothing that encodes data animates: the timeline, skill bars and benchmark bars are always drawn at their true length.
- A `.reveal` element must not sit inside an `overflow-hidden` box (it would measure that box instead of the page): use `overflow-clip` to round corners.

## Layout

- Container `max-w-6xl`, gutters 16px (mobile) / 24px / 32px.
- Must work from 320px wide with no horizontal scroll; the e2e suite checks every page on a Pixel 7.
