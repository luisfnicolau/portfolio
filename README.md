# lunico.dev

The portfolio of **Luis Felipe Moraes Nicolau**, senior full-stack engineer (AI products, TypeScript, Python). It shows the products I built and how I work, in English at [lunico.dev](https://lunico.dev) and in Portuguese at [lunico.dev/pt](https://lunico.dev/pt).

It is also my record of work: when I ship something, it gets added here.

## How it's built

- **Next.js 16** (App Router, Cache Components) with **React 19**, **TypeScript** and **Tailwind CSS 4**, on **Vercel**.
- **Fully static.** Every page, social card and the sitemap is prerendered; there is no database or API.
- **Content as typed data.** Everything the site says lives in [`src/content/`](src/content) as `{ en, pt }` pairs. Tests fail if a translation is missing or the lists drift apart.
- **Two root layouts**, so English is at `/` and Portuguese at `/pt`, each with the right `<html lang>`.
- **"Ask about my work"** is keyword matching over the page's own content, in the browser. No LLM, so it can't make anything up.
- **Motion in CSS** (scroll-driven animations), off for reduced motion. Light and dark themes follow the system, with a toggle.

The reasoning behind each choice is in [`.ai/docs/ARD.md`](.ai/docs/ARD.md).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Node 22 or newer.

| Command | What it does |
|---|---|
| `npm run check` | lint, typecheck and unit tests |
| `npm run build` | production build |
| `npm run test:e2e` | Playwright smoke tests against the build (desktop and mobile); `BASE_URL=https://lunico.dev npm run test:e2e` tests the live site |
| `npm run screenshots -- <name>` | recapture product screenshots into `src/assets/work/` |
| `npm run cv:pdf` | print the Portuguese CV from `cv/full-stack-pt.html` to `public/cv/` |

Every push to `main` deploys to Vercel, and the Vercel build runs `npm run check` first: a failing check stops the deploy and the live site keeps the last good version.

## Adding a project

Add its slug to `src/content/slugs.ts`, its entry to `src/content/projects.ts`, a screenshot or a poster figure, and an Ask intent. The step-by-step is in [`.ai/workflows/adding-content.md`](.ai/workflows/adding-content.md).

## Working on it with AI agents

The repository follows my [ai-template](https://github.com/luisfnicolau/ai-template): agents start at [`.ai/ai.md`](.ai/ai.md) (`AGENTS.md` and `CLAUDE.md` point there), read the [codebase map](.ai/codebase-map.md) before searching, and share long-term memory through lore.

## Rights

The content (text, screenshots, CVs) is © Luis Felipe Moraes Nicolau. Fonts in `src/assets/fonts/` are under the SIL Open Font License (license files alongside).
