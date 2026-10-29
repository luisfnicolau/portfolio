import { normalize } from "@/lib/ask";
import { isLocale, type Locale } from "@/lib/i18n";

export const LIMITS = {
  /** Characters per question, and per earlier question sent for context. */
  question: 300,
  /** Earlier questions the client may send. Only questions: answers never come back from the browser. */
  history: 3,
  /** Request body, in bytes. */
  body: 4_000,
};

export interface AskRequest {
  question: string;
  history: string[];
  locale: Locale;
}

/** Drops control and invisible characters (zero-width, bidi overrides) that hide instructions. */
const clean = (text: string) =>
  text
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F​-‏‪-‮⁠-⁯﻿]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Parses and bounds the request body. Returns null for anything malformed. */
export function parseAskRequest(body: unknown): AskRequest | null {
  if (!body || typeof body !== "object") return null;
  const { question, history, locale } = body as Record<string, unknown>;
  if (typeof question !== "string" || typeof locale !== "string" || !isLocale(locale)) return null;
  const cleanQuestion = clean(question);
  if (!cleanQuestion || cleanQuestion.length > LIMITS.question) return null;
  const earlier = Array.isArray(history) ? history : [];
  if (earlier.length > LIMITS.history) return null;
  const cleanHistory: string[] = [];
  for (const item of earlier) {
    if (typeof item !== "string") return null;
    const text = clean(item);
    if (text.length > LIMITS.question) return null;
    if (text) cleanHistory.push(text);
  }
  return { question: cleanQuestion, history: cleanHistory, locale };
}

// Blatant attempts to steer the model. They get a polite refusal without spending a model call;
// subtler ones are left to the instructions, which treat the question as data.
const INJECTION = [
  /\b(ignore|disregard|forget|override|bypass)\b.{0,40}\b(instructions?|rules?|prompt|guidelines?|above|previous|system)\b/,
  /\b(system|developer|hidden|initial|original)\s+(prompt|message|instructions?)\b/,
  /\b(you are now|act as|pretend (to be|you are)|roleplay|role play|jailbreak|dan mode|developer mode)\b/,
  /\b(reveal|show|print|repeat|output|leak)\b.{0,30}\b(prompt|instructions?|rules|context)\b/,
  /\b(ignore|esqueca|desconsidere|ignora)\b.{0,40}\b(instrucoes|instrucao|regras|prompt|anteriores?)\b/,
  /\b(prompt|mensagem|instrucoes) (do sistema|de sistema|inicia(l|is)|ocultas?)\b/,
  /\b(finja|fingir|aja como|voce agora e|a partir de agora voce)\b/,
  /<\/?(system|instructions|context|passages?|facts?|question)>/,
];

export function looksLikeInjection(text: string): boolean {
  const flat = normalize(text.replace(/<\/?\w+>/g, (tag) => ` ${tag} `));
  return INJECTION.some((pattern) => pattern.test(flat) || pattern.test(text.toLowerCase()));
}

// ---------- Rate limiting (per server instance) ----------
// The Vercel Firewall rule on /api/ask is the real limit, counted at the edge before any code runs.
// This in-memory window is the fallback if that rule is ever off, and it caps one instance's spend.

interface Window {
  hits: number[];
}

export class RateLimiter {
  private windows = new Map<string, Window>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  /** Records a hit and says whether it's allowed; `retryAfter` is in seconds. */
  take(key: string, now = Date.now()): { ok: true } | { ok: false; retryAfter: number } {
    const window = this.windows.get(key) ?? { hits: [] };
    window.hits = window.hits.filter((time) => now - time < this.windowMs);
    if (window.hits.length >= this.limit) {
      this.windows.set(key, window);
      return { ok: false, retryAfter: Math.ceil((window.hits[0] + this.windowMs - now) / 1000) };
    }
    window.hits.push(now);
    this.windows.set(key, window);
    if (this.windows.size > 5_000) this.sweep(now);
    return { ok: true };
  }

  private sweep(now: number) {
    for (const [key, window] of this.windows) {
      if (!window.hits.some((time) => now - time < this.windowMs)) this.windows.delete(key);
    }
  }
}
