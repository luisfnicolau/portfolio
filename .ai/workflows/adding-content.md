# Adding content

How to keep the portfolio current. Every change ends with `npm run check`, and with `npm run build && npm run test:e2e` when pages or layout changed. Then push to `main`: Vercel deploys it.

## Add a project

1. **Facts first.** Collect them from Luis or the project's own repo, docs and live site. Write down nothing that isn't confirmed (Hard Rule 1).
2. **Slug:** add it to `src/content/slugs.ts` (lowercase, no spaces).
3. **Entry:** add an object to `src/content/projects.ts`, in display order within its `kind`:
   - `kind`: `flagship` (one only), `product` (shown under Selected work) or `lab` (shown under Labs).
   - `status` only if verified live today; omit it otherwise.
   - `tagline` (one line, shown on cards), `summary` (paragraphs), `highlights` (bullets), `stack`, `links`.
   - Optional: `metrics`, `benchmarks` (before/after, drawn to scale), `caseStudies` (problem → what I did → result/lesson), `decisions`, `note` (framing that must travel with it, e.g. what was built on open source).
   - Every string `{ en, pt }`, same number of items in both.
4. **Picture:** either a screenshot or a `poster` (a headline figure and caption).
   - Screenshot: add `{ name, url }` to `SHOTS` in `scripts/capture-screenshots.mjs`, run `npm run screenshots -- <name>`, then import `src/assets/work/<name>.webp` in `projects.ts`. Pick a page with no third-party content (news, other people's data) in view.
5. **Ask box:** add an intent to `src/content/ask.ts` with the project's name (and aliases) as keywords, in the project-name block near the top. Add a line to `tests/unit/ask.test.ts`.
6. **Experience:** if it's a product Luis founded, add a row to `timeline` in `src/content/experience.ts`.
7. Bump `site.updated` and `site.updatedIso` in `src/content/profile.ts`.

## Update a role or the profile

- Roles: `src/content/experience.ts` (`employment`, `earlierRoles`, `timeline`). Move `timelineAxis.asOf` to the current month.
- Hero stats, bios, availability, links: `src/content/profile.ts`.
- Skills: `src/content/skills.ts`; keep `coreStack` years in Luis's own numbers.

## Update the CVs

Luis makes both files. Copy his new PDFs over `public/cv/luis-nicolau-full-stack-cv-en.pdf` and `public/cv/luis-nicolau-full-stack-cv-pt.pdf` (same names), then check the site's facts still match them.

## Change the photo

`node scripts/prepare-photo.mjs ~/path/to/photo.jpg`, adjusting `--face x,y` (centre of the face, as fractions) and `--portrait left,top,width` if the framing differs. Check the crops, then commit the three files it writes.

## Refresh screenshots

`npm run screenshots` (all) or `npm run screenshots -- medha lore` (some). Review the images before committing.
