# Coding Conventions

## TypeScript / React / Next.js

- **Versions:** Node 22+ (Vercel builds on 24), TypeScript 5 strict, Next.js 16, React 19. Pin new dependencies exactly.
- **Read the bundled docs first:** `node_modules/next/dist/docs/` matches the installed version; Next 16 differs from older habits (async `params`, `proxy.ts` instead of `middleware.ts`, Cache Components rules).
- **Server Components by default.** Add `"use client"` only for interaction or browser APIs, and pass client components only the data they need (the Ask box gets one language).
- **Browser state** through `useSyncExternalStore` (theme, clock, motion preference), never `setState` inside an effect body: it hydrates without mismatches and passes the React hooks lint rules.
- **No copy in components.** Strings come from `src/content/`; add a key to `ui.ts` (English first, Portuguese typed against it).
- **Cache Components:** no `new Date()`, `Date.now()` or `Math.random()` in server code (dates the site needs live in content, like `site.updatedIso`).
- **Imports:** `@/` for `src/`. Components are named exports; route files default-export.
- **Lint and types:** `npm run lint`, `npm run typecheck` (runs `next typegen` first so `PageProps<…>` exists).

## Content

- Every string is `{ en, pt }`. Lists in both languages have the same length.
- Wrap measurement-heavy text in `tidy()` when rendering so units stay with their numbers.
- A project needs either a screenshot (`image`) or a `poster` figure.

## Testing

- **Unit (Vitest):** logic and content integrity, `tests/unit/`. `npm test`.
- **End to end (Playwright):** against the production build, desktop and Pixel 7, `tests/e2e/`. `npm run build && npm run test:e2e`.
- **Every feature ships with its tests; a bug fix starts with a failing test**, kept as the regression test.
- **Tests must not depend on the machine** (time, time zone, locale, order). The e2e suite runs with reduced motion.

## Git

- Branches: `feat/`, `fix/`, `content/`, `chore/`. Conventional commits: `feat(scope): summary`, `content(projects): add X`.
- No secrets in the repo; there are none to need.
- Parallel agents use `.worktrees/` (ignored), one branch each.

## Security

- Static site: no user input reaches a server. Headers (`nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) are set in `next.config.ts`.
- External links open with `rel="noreferrer"`.
