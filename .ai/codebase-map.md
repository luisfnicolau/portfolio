# Codebase Map

Which files make up each feature, and their tests. Read the entry for your area before searching the code; update it in the same commit when files move or a gotcha is learned.

## Content (what the site says)

- `src/content/profile.ts`: name, headline, bios, availability, contact links, CV paths, hero stats, `site.updated`.
- `src/content/projects.ts`: every project and its case study; `src/content/slugs.ts` lists the slugs (must match).
- `src/content/experience.ts`: employment, earlier roles, timeline rows and axis, education.
- `src/content/skills.ts`, `principles.ts`: skills page and "How I work".
- `src/content/ui.ts`: every interface label, English typed first, Portuguese checked against it.
- `src/content/ask.ts`: Ask intents (keywords in both languages, answers, links). Order matters: ties go to the first.
- Tests: `tests/unit/content.test.ts` (both languages, mirrored lists, slugs, CV files), `tests/unit/ask.test.ts`.

## Pages

- Home: `src/components/home/home-page.tsx` composes `hero`, `marquee`, `about`, `selected-work`, `labs`, `experience` (+ `timeline`), `how-i-work`, `skills`, `background`, `contact`.
- Case study: `src/components/work/project-page.tsx` with `pipeline.tsx` (OlhoNaLei only), `benchmarks.tsx`, `poster.tsx`, `project-card.tsx`.
- Shell: `src/components/site/` (header, footer, theme toggle, local clock, mobile menu, language hint, availability tab, root document with the theme script).
- Routes: `src/app/(en)/…`, `src/app/(pt)/pt/…`, `src/app/global-not-found.tsx`.
- Tests: `tests/e2e/smoke.spec.ts` (every sitemap page on Chromium desktop, a Pixel 7 and WebKit/Safari; language detection and switch, theme, Ask, charts with motion on, 404s, CVs, social cards).

## Ask box (AI chat)

- UI: `src/components/home/ask.tsx` (streams `/api/ask`, renders [n] citations and source chips, falls back to keyword answers on any error, 429 or 503); `hero.tsx` passes it one language's keyword answers. Copy in `ui.ts` (`ask`).
- Route: `src/app/api/ask/route.ts`: kill switch (`ASK_LLM=off`), origin check, per-instance rate limits, BotID (`checkBotId`), body limits, injection guard, hybrid retrieval, `streamText` with a canary check. Streams NDJSON (`src/lib/chat/protocol.ts`). Logs metadata only (no question text, no IP).
- Pipeline: `src/lib/chat/corpus.ts` (passages from `src/content`), `retrieve.ts` (BM25 + embeddings + RRF), `prompt.ts` (instructions, tagged passages), `guard.ts` (parsing, injection patterns, `RateLimiter`).
- Models: with `ANTHROPIC_API_KEY` set (production), Claude is called directly (`ASK_ANTHROPIC_MODEL`, default `claude-haiku-5-5`), billed to Luis's Anthropic credits; AI Gateway BYOK needs paid gateway credits, which the team doesn't have. Without the key, `ASK_MODEL` goes through AI Gateway. Embeddings always go through AI Gateway's free tier (`ASK_EMBEDDING_MODEL`, default `voyage/voyage-4-lite`) with the project's OIDC token. Locally: `vercel env pull .env.local` and `next dev` (BotID always says "human" in dev).
- Outside the code: Vercel Firewall rules "Ask chat: burst limit" / "hourly limit", the project's AI Gateway budget, BotID (`instrumentation-client.ts`, `withBotId` in `next.config.ts`).
- Keyword engine (fallback): `src/lib/ask.ts`, content in `src/content/ask.ts`. Gotcha: a keyword that is also an everyday word (`monitor`, `time`, `next`) steals questions. Add a phrase instead, and a test in `tests/unit/ask.test.ts`.
- Tests: `tests/unit/chat.test.ts`, `tests/unit/ask.test.ts`; e2e mocks `/api/ask` (answer with citations, and the fallback).

## Language

- `src/proxy.ts`: on English URLs, sends visitors who prefer Portuguese to `/pt`; `?lang=` from the switch links sets the `lang` cookie, which then wins. `/pt` URLs are never redirected.
- `src/lib/language.ts` (`preferredLocale`: Accept-Language by q-value, then the IP country, then English), tested in `tests/unit/language.test.ts`; e2e "language detection".
- `switchHref()` in `src/lib/i18n.ts` builds the switch links (header, footer, language hint).

## Photo

- `scripts/prepare-photo.mjs <photo>` writes `src/assets/photo/portrait.jpg` (About), `src/assets/photo/avatar.jpg` (hero, home social cards) and `public/luis-nicolau.jpg` (JSON-LD), with metadata stripped. Alt text in `profile.photo`.

## SEO and sharing

- `src/lib/seo.ts` (page metadata, canonical and hreflang, JSON-LD `Person`), `src/lib/og.tsx` + `src/lib/og-cards.ts` (social cards), `src/app/sitemap.ts`, `robots.ts`, `icon.svg`, `apple-icon.tsx`.
- Gotcha: OG fonts are read from disk with literal paths; keep `outputFileTracingIncludes` in `next.config.ts` when moving them.

## Styling

- `src/app/globals.css`: tokens (light, dark, no-JS dark), utilities (`text-metal`, `kicker`, `bg-grid`), the scroll-driven `.reveal`.
- `src/app/fonts.ts`: Inter, Instrument Serif (italic), JetBrains Mono.
- Gotcha: `.reveal` animates `transform`, so a hover lift on the same element is overridden.
- Gotcha: a scroll-driven animation (`view()`) binds to the nearest scroll container, and `overflow: hidden` makes one. A `.reveal` inside an `overflow-hidden` box measures that box, not the page (the skill bars once stalled at ~3% this way). Round corners with `overflow-clip` instead. Charts and bars never animate; `tests/e2e/smoke.spec.ts` ("charts, with motion") checks they are drawn to scale with motion on.

## Scripts and assets

- `scripts/capture-screenshots.mjs` → `src/assets/work/*.webp`.
- `public/cv/*.pdf`: Luis's own CV files, English and Portuguese, copied in as they are.
- `src/lib/typography.ts`: `tidy()` keeps numbers with their units; tested in `tests/unit/typography.test.ts`.
