# Portfolio (lunico.dev) · AI Context Index

This file is the **single entry point** for any AI assistant working in this repository. Read it first, then open the file listed for the topic at hand.

---

## Project at a Glance

**System:** Luis Nicolau's personal portfolio at https://lunico.dev: who he is, the products he built, how he works, and how to reach him. It doubles as his record of work: when he ships something new, it gets added here.

**Primary users:** hiring managers and recruiters at US/international companies (English, the default), talent marketplaces, founders/CTOs, and Brazilian companies (Portuguese, at `/pt`).

**Tech stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · Vercel.

**Stack details:**
```
next 16.4           App Router, two root layouts (English at /, Portuguese at /pt), every page prerendered
react 19.3          Server Components by default; client components only for interaction (Ask, theme, clock, menu)
tailwindcss 4       design tokens as CSS variables in src/app/globals.css (@theme inline)
next/og             social cards and the iOS icon, rendered with fonts in src/assets/fonts/
lucide-react        UI icons; brand marks are inline SVG in src/components/ui/brand-icons.tsx
vitest 5            unit tests: Ask matching, content completeness, sitemap, typography
@playwright/test    end-to-end smoke tests on the production build; also drives the screenshot and CV scripts
```

**Source of truth for the content:** `src/content/` (typed data, English and Portuguese side by side). The facts come from Luis's CVs and his private portfolio brief, which is kept outside this public repo.

**Project memory:** lore, workspace `luisfnicolau`, project `portfolio` (see [workflows/project-memory.md](workflows/project-memory.md)).

---

## Navigation Map

| Topic | File |
|---|---|
| **Add a project, update a role, refresh screenshots, rebuild the CV** | [workflows/adding-content.md](workflows/adding-content.md) |
| **Which files belong to each feature** (read before searching the code) | [codebase-map.md](codebase-map.md) |
| **Architecture**, routing, rendering, hosting | [architecture.md](architecture.md) |
| **Architecture decisions** (and why) | [docs/ARD.md](docs/ARD.md) |
| **Design tokens**, typography, components, motion | [ui_guidelines.md](ui_guidelines.md) |
| **Coding standards**, testing, git | [coding_conventions.md](coding_conventions.md) |
| **AI role and hard rules** | [config/system.md](config/system.md) |
| **Running agents in parallel** (git worktrees) | [workflows/parallel-agents.md](workflows/parallel-agents.md) |
| **Project memory** (lore) | [workflows/project-memory.md](workflows/project-memory.md) |

---

## Key Decisions (ultra-short)

- **Content is data.** Every word on the site lives in `src/content/*.ts` as `{ en, pt }`. Components never hold copy.
- **English at `/`, Portuguese at `/pt`**, through two root layouts (`src/app/(en)`, `src/app/(pt)`) so `<html lang>` is right on every page.
- **Everything is static.** Pages, social cards, sitemap and robots are prerendered; unknown project slugs get a real 404 from a rewrite in `next.config.ts`.
- **The Ask box is keyword matching over this content, not an LLM.** It cannot make anything up, and the page says so.
- **One accent color** (orange `#ff6b2c`), dark and light themes from the system setting, with a manual toggle.
- **No contact form, no analytics, no tracking.** Email, WhatsApp, LinkedIn and GitHub links are enough.

---

## Hard Rules

1. **Only confirmed facts.** Every number, client, date and claim must come from Luis (his CVs or his brief) or be checkable in the live product. Never invent metrics, testimonials or links, and keep the `~` on approximations. When unsure, leave it out and ask.
2. **Never claim:** Kubernetes in production, Angular, BigQuery, embedded/hardware work, training or fine-tuning ML models (he builds with and operates LLMs), or writing Lore's engine (Lore is built on the open-source ai-memory project). No Claude Code or MCP on roles before 2025.
3. **Both languages, always.** Every content string is `{ en, pt }` with the same number of paragraphs and bullets; `npm test` fails otherwise. Write natural Brazilian Portuguese, not a word-for-word translation.
4. **A status badge means verified.** Mark a product "Live" only after loading it. Don't link to a site that is down.
5. **Nothing private.** No job-search history, salary, server addresses, internal hostnames, keys, or other people's data. Don't name clients or partners behind products.
6. **Measure before asserting; correct yourself out loud when a measurement disproves you.**
7. **Prefer loud failure to silent degradation.**
8. **Every change is proven by tests; a bug fix starts with a failing test.** `npm run check` (lint, typecheck, unit) and, for anything visual or routing, `npm run build && npm run test:e2e`.
9. **Read [codebase-map.md](codebase-map.md) first; keep it current** in the same commit as the change.
10. **Parallel agents work in separate git worktrees** ([workflows/parallel-agents.md](workflows/parallel-agents.md)), and a worktree is removed once merged.
11. **Declare your work in project memory before you start, and close it when you stop** ([workflows/project-memory.md](workflows/project-memory.md)).
12. **A new GitHub Actions workflow must run once and pass, or be disabled** (watch it with `gh run watch`).
13. `architecture.md` and `docs/ARD.md` are the source of truth for structure decisions; update them when a decision changes.
