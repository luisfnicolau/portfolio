import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { checkBotId } from "botid/server";
import { looksLikeInjection, LIMITS, parseAskRequest, RateLimiter } from "@/lib/chat/guard";
import { instructions, userPrompt } from "@/lib/chat/prompt";
import { retrieve } from "@/lib/chat/retrieve";
import type { AskEvent } from "@/lib/chat/protocol";
import type { Locale } from "@/lib/i18n";

// With ANTHROPIC_API_KEY set, Claude is called directly and billed to that Anthropic account.
// Without it, the model goes through AI Gateway (OIDC on Vercel), where ASK_MODEL can name any model.
const ANTHROPIC_MODEL = process.env.ASK_ANTHROPIC_MODEL ?? "claude-haiku-5-5";
const ASK_MODEL = process.env.ANTHROPIC_API_KEY
  ? `anthropic/${ANTHROPIC_MODEL}`
  : (process.env.ASK_MODEL ?? "anthropic/claude-haiku-5.5");
const model = () => (process.env.ANTHROPIC_API_KEY ? anthropic(ANTHROPIC_MODEL) : ASK_MODEL);
export const maxDuration = 30;

// Per server instance; the Vercel Firewall rule on this path is the limit shared by all of them.
const perMinute = new RateLimiter(6, 60_000);
const perHour = new RateLimiter(30, 3_600_000);
const instanceHourly = new RateLimiter(400, 3_600_000);

const allowedOrigins = new Set(["https://lunico.dev", "https://www.lunico.dev", "http://localhost:3000", "http://localhost:3200"]);

const refusal: Record<Locale, string> = {
  en: "I can only answer questions about Luis's work, projects and experience. Try “What has he built with AI?” or “Is he available?”",
  pt: "Só respondo perguntas sobre o trabalho, os projetos e a experiência do Luis. Tente “O que ele construiu com IA?” ou “Ele está disponível?”",
};

const json = (status: number, error: string, headers?: Record<string, string>) =>
  Response.json({ error }, { status, headers: { "Cache-Control": "no-store", ...headers } });

function sameSite(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  if (allowedOrigins.has(origin)) return true;
  // Preview deployments call themselves.
  const host = request.headers.get("host");
  return host !== null && origin === `https://${host}` && process.env.VERCEL_ENV === "preview";
}

const clientIp = (request: Request) =>
  request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

/** Answers a visitor's question from the site's content: retrieve, then generate with citations. */
export async function POST(request: Request) {
  const started = Date.now();
  if (process.env.ASK_LLM === "off") return json(503, "disabled");
  if (!sameSite(request)) return json(403, "origin");
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json(415, "content-type");

  const ip = clientIp(request);
  for (const limiter of [perMinute, perHour]) {
    const verdict = limiter.take(ip);
    if (!verdict.ok) return json(429, "rate-limited", { "Retry-After": String(verdict.retryAfter) });
  }
  if (!instanceHourly.take("all").ok) return json(503, "busy");

  const verification = await checkBotId();
  if (verification.isBot) return json(403, "bot");

  const raw = await request.text();
  if (raw.length > LIMITS.body) return json(413, "too-large");
  let parsed;
  try {
    parsed = parseAskRequest(JSON.parse(raw));
  } catch {
    parsed = null;
  }
  if (!parsed) return json(400, "invalid");
  const { question, history, locale } = parsed;

  const encoder = new TextEncoder();
  const send = (controller: ReadableStreamDefaultController<Uint8Array>, event: AskEvent) =>
    controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
  const headers = { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" };

  if (looksLikeInjection(question) || history.some(looksLikeInjection)) {
    log({ outcome: "refused", ms: Date.now() - started });
    return new Response(
      new ReadableStream({
        start(controller) {
          send(controller, { type: "meta", model: null, mode: "guard", sources: [] });
          send(controller, { type: "text", text: refusal[locale] });
          send(controller, { type: "done" });
          controller.close();
        },
      }),
      { headers },
    );
  }

  const retrieval = await retrieve(question, history);
  const canary = crypto.randomUUID();
  const abort = AbortSignal.any([request.signal, AbortSignal.timeout(25_000)]);
  let failed = false;
  const result = streamText({
    model: model(),
    instructions: instructions(locale, canary),
    prompt: userPrompt(question, history, retrieval.passages, locale),
    maxOutputTokens: 450,
    temperature: 0.2,
    maxRetries: 1,
    abortSignal: abort,
    onError({ error }) {
      failed = true;
      console.error("ask: generation failed", error instanceof Error ? error.message : error);
    },
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        send(controller, {
          type: "meta",
          model: ASK_MODEL,
          mode: retrieval.mode,
          sources: retrieval.passages.map((passage, index) => ({
            n: index + 1,
            title: passage.title[locale],
            href: passage.href[locale],
          })),
        });
        let text = "";
        let outcome = "answered";
        try {
          for await (const delta of result.textStream) {
            text += delta;
            // A leak of the instructions: stop and say nothing more.
            if (text.includes(canary) || text.includes("Rules, in order of priority")) {
              outcome = "leak-blocked";
              send(controller, { type: "error", reason: "blocked" });
              break;
            }
            send(controller, { type: "text", text: delta });
          }
          if (outcome === "answered") {
            if (failed || !text.trim()) {
              outcome = "failed";
              send(controller, { type: "error", reason: "unavailable" });
            } else send(controller, { type: "done" });
          }
        } catch {
          outcome = "failed";
          send(controller, { type: "error", reason: "unavailable" });
        }
        controller.close();
        const usage = outcome === "answered" ? await Promise.resolve(result.usage).catch(() => undefined) : undefined;
        log({
          outcome,
          mode: retrieval.mode,
          sources: retrieval.passages.map((passage) => passage.id),
          inputTokens: usage?.inputTokens,
          outputTokens: usage?.outputTokens,
          ms: Date.now() - started,
        });
      },
    }),
    { headers },
  );
}

// Metadata only: no question text and no IP address.
function log(entry: Record<string, unknown>) {
  console.info(JSON.stringify({ event: "ask", ...entry }));
}
