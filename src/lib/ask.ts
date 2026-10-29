import type { Localized } from "@/content/types";

export interface AskLink {
  label: Localized;
  /** A path, an anchor ("#work") or an external URL; per language when they differ. */
  href: string | Localized;
}

export interface Intent {
  id: string;
  /** Words or phrases in either language, matched without accents or case. */
  keywords: string[];
  answer: Localized;
  links?: AskLink[];
}

export interface Match<T extends Pick<Intent, "keywords"> = Intent> {
  intent: T;
  score: number;
}

// Words that carry no topic. They are skipped for fuzzy matching so "what" never
// half-matches anything.
const STOP_WORDS = new Set(
  (
    "a an and are as at be can could did do does for from had has have how i in is it me my of on or so tell " +
    "that the this to was we what when which who why will with you your yours " +
    "a ao aos as com como da das de do dos e ela ele em eu foi isso ja mais me meu minha na nas no nos o os " +
    "ou para pelo por pra qual quais quando que se sua suas seu seus tem um uma voce voces"
  ).split(" "),
);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[-_/]/g, " ")
    .replace(/[^a-z0-9#+.\s]/g, " ")
    .split(/\s+/)
    // Trailing dots end sentences; leading ones belong to names like ".net".
    .map((token) => token.replace(/\.+$/g, ""))
    .filter(Boolean)
    .join(" ");
}

/** Levenshtein distance, stopping early once it exceeds `max`. */
function withinDistance(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
      rowMin = Math.min(rowMin, current[j]);
    }
    if (rowMin > max) return false;
    previous = current;
  }
  return previous[b.length] <= max;
}

/** A plural, a truncation or a single typo of the keyword. */
function isNear(token: string, keyword: string): boolean {
  if (token.length < 5 || keyword.length < 4) return false;
  return (
    token.startsWith(keyword) ||
    keyword.startsWith(token) ||
    (keyword.length >= 5 && withinDistance(token, keyword, 1))
  );
}

type Matchable = Pick<Intent, "keywords">;

const compiled = new WeakMap<Matchable, { words: Set<string>; phrases: string[] }>();

function compile(intent: Matchable) {
  let entry = compiled.get(intent);
  if (!entry) {
    const keywords = intent.keywords.map(normalize).filter(Boolean);
    entry = {
      words: new Set(keywords.filter((k) => !k.includes(" "))),
      phrases: keywords.filter((k) => k.includes(" ")),
    };
    compiled.set(intent, entry);
  }
  return entry;
}

/**
 * Scores every intent against the question. Each phrase found verbatim is worth 3; each word of the
 * question is worth 2 if it is a keyword, or 1 if it is near one, counted once at its best match so
 * intents with many variants of a word ("build", "built") don't win by repetition.
 * Ties go to the intent listed first, so order intents from specific to general.
 */
export function matchIntent<T extends Matchable>(question: string, intents: T[]): Match<T> | null {
  const text = normalize(question);
  if (!text) return null;
  const padded = ` ${text} `;
  const tokens = text.split(" ");

  let best: Match<T> | null = null;
  for (const intent of intents) {
    const { words, phrases } = compile(intent);
    let score = 0;
    for (const phrase of phrases) if (padded.includes(` ${phrase} `)) score += 3;
    for (const token of tokens) {
      if (words.has(token)) score += 2;
      else if (!STOP_WORDS.has(token) && [...words].some((word) => isNear(token, word))) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  return best;
}
