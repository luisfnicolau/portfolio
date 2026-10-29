/**
 * Every project page, by URL slug. Kept apart from projects.ts (which imports screenshots) so
 * next.config.ts can read it: any other /work/ slug is answered with a real 404 there.
 * The content tests fail if this list and the projects drift apart.
 */
export const projectSlugs = [
  "olhonalei",
  "sensecomment",
  "paneleiros",
  "ecodoctor",
  "lore",
  "medha",
  "outpost",
  "chamego",
  "agendinha",
] as const;

export type ProjectSlug = (typeof projectSlugs)[number];
