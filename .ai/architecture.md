# Architecture

## Overview

A static, bilingual Next.js 16 site. Every page is prerendered at build time from typed content and served by Vercel's CDN; there is no database, no API and no runtime data fetching.

```
src/content/*.ts  ──►  React Server Components  ──►  prerendered HTML (both languages)
     │                                                   │
     └──► Ask entries (one language) ──► <Ask> client component (keyword matching in the browser)
```

## Routing

Two root layouts, so `<html lang>` is correct without a redirect at `/`:

| URL | File | Notes |
|---|---|---|
| `/` | `src/app/(en)/page.tsx` | English home |
| `/work/[slug]` | `src/app/(en)/work/[slug]/page.tsx` | English case study |
| `/pt` | `src/app/(pt)/pt/page.tsx` | Portuguese home |
| `/pt/work/[slug]` | `src/app/(pt)/pt/work/[slug]/page.tsx` | Portuguese case study |
| any unmatched URL | `src/app/global-not-found.tsx` | bilingual 404 (`experimental.globalNotFound`) |
| `/sitemap.xml`, `/robots.txt` | `src/app/sitemap.ts`, `src/app/robots.ts` | every page, with hreflang alternates |
| `…/opengraph-image-*` | `opengraph-image.tsx` next to each page | social cards via `next/og` |
| `/cv/*.pdf` | `public/cv/` | English CV (Luis's file) and Portuguese CV (built from `cv/full-stack-pt.html`) |

Switching language crosses root layouts, which is a full page load; that is fine for a language switch.

Unknown project slugs are rewritten to a non-existent path in `next.config.ts` (`beforeFiles`), so they get a real 404 status. The allowed list is `src/content/slugs.ts`, which must match `projects.ts` (a unit test checks it).

## Rendering

- Cache Components and Partial Prefetching are on (the Next 16 defaults). All routes are static; the `[slug]` routes also have a fallback shell that unknown slugs never reach because of the rewrite above.
- Some social cards are rendered on demand when the build skips them (a nondeterministic static-generation race observed in Next 16.4). They read fonts from `src/assets/fonts/`, which `outputFileTracingIncludes` ships with the functions.
- Theme: an inline script at the top of `<body>` sets `data-theme` before first paint from `localStorage` or `prefers-color-scheme`.
- Motion: CSS scroll-driven animations (`.reveal`, `.grow`) with no JavaScript; off for reduced motion and print.

## Hosting

- **Vercel** project `portfolio`, production branch `main`, deploys on push.
- **Domain:** `lunico.dev` (apex is primary; `www` redirects to it). DNS is at Cloudflare, records set to "DNS only".
- Preview deployments are not indexed (Vercel adds `X-Robots-Tag: noindex`).

## Data model (content)

See `src/content/types.ts`. The main types are `Project` (with case studies, metrics, benchmarks, decisions, links and a screenshot or poster), `Role`, `EarlierRole`, the timeline rows, skills, principles, the UI dictionary and the Ask intents. Every user-facing string is `Localized = { en, pt }`.
