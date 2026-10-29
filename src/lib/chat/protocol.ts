/**
 * What /api/ask streams back: one JSON object per line. `meta` comes first (the retrieved sources),
 * then `text` deltas, then `done`, or `error` if the answer could not be finished.
 */
export type AskEvent =
  | {
      type: "meta";
      /** null when the guard answered without calling a model. */
      model: string | null;
      mode: "hybrid" | "lexical" | "guard";
      sources: { n: number; title: string; href: string }[];
    }
  | { type: "text"; text: string }
  | { type: "done" }
  | { type: "error"; reason: "blocked" | "unavailable" };
