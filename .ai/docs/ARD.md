# Architecture Decision Records

## ADR-01 · Next.js on Vercel, fully static

**Decision:** Next.js 16 (App Router) with every page prerendered, hosted on Vercel.
**Why:** it is Luis's daily stack, so he and his agents can maintain it; the CDN serves static pages fast; Vercel previews every branch. GitHub Pages was the alternative, but it can't run the on-demand social cards and would rule out server features later.

## ADR-02 · Two root layouts instead of a `[lang]` segment

**Decision:** `src/app/(en)` serves `/`, `src/app/(pt)` serves `/pt`.
**Why:** English at the bare domain (no redirect, the URL people type and share) and a correct `<html lang>` on every page. Cost: route files are thin duplicates, a language switch is a full page load, and a 404 needs `experimental.globalNotFound`.

## ADR-03 · Content as typed data

**Decision:** all copy in `src/content/*.ts`, every string `{ en, pt }`, checked by unit tests.
**Why:** Luis (or an agent) adds a project by editing one file; a missing translation fails CI instead of shipping a blank.

## ADR-04 · Ask box by keyword matching, not an LLM

**Decision:** intents with bilingual keywords and fixed answers, matched in the browser (`src/lib/ask.ts`).
**Why:** it can't make up a fact on a page whose whole value is accuracy, it costs nothing, and it works offline. A Claude-backed version with a budget cap is possible later, as a separate decision.

## ADR-05 · Real 404 for unknown project slugs via a rewrite

**Decision:** `next.config.ts` rewrites `/work/<unknown>` and `/pt/work/<unknown>` (`beforeFiles`) to a path no route matches.
**Why:** with Cache Components the `[slug]` route streams a 200 shell before `notFound()` runs, so a bad slug was a soft 404. `dynamicParams = false` is not allowed with Cache Components; middleware would cost an invocation per request. The rewrite needs the slug list without image imports, hence `src/content/slugs.ts`.

## ADR-06 · Scroll-driven CSS for motion

**Decision:** reveals and bar growth use `animation-timeline: view()`; no JavaScript animation library.
**Why:** nothing can stay hidden if a script fails, browsers without support show the content statically, and there is no JS cost. The range ends a fixed 120px after entry so tall blocks are not left faded while being read.

## ADR-07 · Social cards with `next/og` and bundled fonts

**Decision:** cards drawn by `src/lib/og.tsx` with WOFF files in `src/assets/fonts/` (OFL), traced into functions with `outputFileTracingIncludes`.
**Why:** consistent branded cards per page and language. Next 16.4's build sometimes leaves some cards for on-demand rendering, so the fonts must ship with the functions.

## ADR-08 · CVs: Luis's English file, a generated Portuguese one

**Decision:** `public/cv/luis-nicolau-full-stack-cv-en.pdf` is Luis's own final CV; the Portuguese one is printed from `cv/full-stack-pt.html` by Playwright, in the same look (Carlito, navy, A4).
**Why:** no final Portuguese full-stack PDF existed. Keeping its source in the repo lets it be updated with the site.

## ADR-09 · No analytics, no contact form

**Decision:** none at launch.
**Why:** mailto, WhatsApp and LinkedIn are enough, and a portfolio has no need to track visitors. Vercel Web Analytics (cookieless) can be turned on later if Luis wants numbers.
