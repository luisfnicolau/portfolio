import { cosineSimilarity, embed, embedMany } from "ai";
import { normalize } from "@/lib/ask";
import { passages, pinnedPassageIds, type Passage } from "./corpus";

export const EMBEDDING_MODEL = process.env.ASK_EMBEDDING_MODEL ?? "voyage/voyage-4-lite";
const DIMENSIONS = 512;

// ---------- Lexical: BM25 over both languages of every passage ----------

const STOP = new Set(
  (
    "a an and are as at be by can could did do does for from had has have how i in is it its me my of on or so " +
    "tell that the this to was we what when where which who why will with you your he his him luis " +
    "ao aos as com como da das de do dos e ela ele em eu foi isso ja mais me meu minha na nas no nos o os ou " +
    "para pelo por pra qual quais quando que se sua suas seu seus tem um uma voce voces dele"
  ).split(" "),
);

const tokenize = (text: string) => normalize(text).split(" ").filter((token) => token.length > 1 && !STOP.has(token));

interface LexicalDoc {
  passage: Passage;
  terms: Map<string, number>;
  length: number;
}

const lexicalDocs: LexicalDoc[] = passages.map((passage) => {
  const tokens = tokenize(`${passage.title.en} ${passage.title.pt} ${passage.text.en} ${passage.text.pt}`);
  const terms = new Map<string, number>();
  for (const token of tokens) terms.set(token, (terms.get(token) ?? 0) + 1);
  return { passage, terms, length: tokens.length };
});
const averageLength = lexicalDocs.reduce((sum, doc) => sum + doc.length, 0) / lexicalDocs.length;
const documentFrequency = new Map<string, number>();
for (const doc of lexicalDocs) for (const term of doc.terms.keys()) documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);

/** Okapi BM25 (k1 1.2, b 0.75). Query words also match by prefix, so "deploys" finds "deploy". */
export function lexicalRank(query: string): { id: string; score: number }[] {
  const queryTerms = [...new Set(tokenize(query))];
  const total = lexicalDocs.length;
  return lexicalDocs
    .map((doc) => {
      let score = 0;
      for (const term of queryTerms) {
        let frequency = doc.terms.get(term) ?? 0;
        let df = documentFrequency.get(term) ?? 0;
        if (!frequency && term.length >= 4) {
          for (const [candidate, count] of doc.terms) {
            if (candidate.startsWith(term) || (candidate.length >= 4 && term.startsWith(candidate))) {
              frequency += count;
              df = Math.max(df, documentFrequency.get(candidate) ?? 0);
            }
          }
        }
        if (!frequency) continue;
        const idf = Math.log(1 + (total - df + 0.5) / (df + 0.5));
        score += (idf * frequency * 2.2) / (frequency + 1.2 * (1 - 0.75 + (0.75 * doc.length) / averageLength));
      }
      return { id: doc.passage.id, score };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ---------- Semantic: embeddings, computed once per server instance ----------

let passageVectors: Promise<{ id: string; vector: number[] }[]> | null = null;

function embedPassages() {
  passageVectors ??= embedMany({
    model: EMBEDDING_MODEL,
    // Both languages, so a question in either one lands near its passage.
    values: passages.flatMap((passage) => [
      `${passage.title.en}\n${passage.text.en}`,
      `${passage.title.pt}\n${passage.text.pt}`,
    ]),
    dimensions: DIMENSIONS,
    maxRetries: 1,
  })
    .then(({ embeddings }) => embeddings.map((vector, index) => ({ id: passages[index >> 1].id, vector })))
    .catch((error: unknown) => {
      passageVectors = null; // try again on the next question
      throw error;
    });
  return passageVectors;
}

export async function semanticRank(query: string, signal?: AbortSignal): Promise<{ id: string; score: number }[]> {
  const [vectors, { embedding }] = await Promise.all([
    embedPassages(),
    embed({ model: EMBEDDING_MODEL, value: query, dimensions: DIMENSIONS, maxRetries: 1, abortSignal: signal }),
  ]);
  const best = new Map<string, number>();
  for (const { id, vector } of vectors) {
    const score = cosineSimilarity(embedding, vector);
    if (score > (best.get(id) ?? -1)) best.set(id, score);
  }
  return [...best].map(([id, score]) => ({ id, score })).sort((a, b) => b.score - a.score);
}

// ---------- Hybrid: reciprocal rank fusion ----------

/** Reciprocal rank fusion: rewards passages that rank well in either list, without comparing raw scores. */
export function fuse(lists: { id: string }[][], k = 60): string[] {
  const scores = new Map<string, number>();
  for (const list of lists) {
    list.forEach(({ id }, rank) => scores.set(id, (scores.get(id) ?? 0) + 1 / (k + rank + 1)));
  }
  return [...scores].sort((a, b) => b[1] - a[1]).map(([id]) => id);
}

export interface Retrieval {
  passages: Passage[];
  /** "hybrid" normally; "lexical" when the embedding call failed or timed out. */
  mode: "hybrid" | "lexical";
}

const byId = new Map(passages.map((passage) => [passage.id, passage]));

/**
 * Finds the passages for a question. `context` (the visitor's previous questions) helps follow-ups
 * like "and which stack?" find the project they refer to.
 */
export async function retrieve(question: string, context: string[] = [], limit = 6): Promise<Retrieval> {
  const query = [...context.slice(-1), question].join("\n");
  const lexical = lexicalRank(query).slice(0, 20);
  let mode: Retrieval["mode"] = "hybrid";
  let semantic: { id: string }[] = [];
  try {
    semantic = (await semanticRank(query, AbortSignal.timeout(4000))).slice(0, 20);
  } catch (error) {
    mode = "lexical";
    console.warn("ask: semantic retrieval unavailable, using lexical only", error instanceof Error ? error.message : error);
  }
  const ranked = fuse(mode === "hybrid" ? [semantic, lexical] : [lexical]);
  const ids = [...new Set([...pinnedPassageIds, ...ranked.slice(0, limit)])];
  return { passages: ids.map((id) => byId.get(id)!).filter(Boolean), mode };
}
