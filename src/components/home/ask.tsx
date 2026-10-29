"use client";

import { CornerDownLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { matchIntent } from "@/lib/ask";
import type { AskEvent } from "@/lib/chat/protocol";
import type { Locale } from "@/lib/i18n";

export interface AskEntry {
  id: string;
  keywords: string[];
  answer: string;
  links: { label: string; href: string }[];
}

export interface AskCopy {
  title: string;
  inputLabel: string;
  placeholder: string;
  submit: string;
  clear: string;
  you: string;
  disclaimer: string;
  howItWorks: string;
  pipeline: string[];
  thinking: string;
  sources: string;
  quickAnswer: string;
  tooFast: string;
  cut: string;
  limit: string;
  suggestions: string[];
}

interface AskProps {
  locale: Locale;
  entries: AskEntry[];
  fallback: Omit<AskEntry, "id" | "keywords">;
  copy: AskCopy;
}

type LinkData = { label: string; href: string };

interface Message {
  key: number;
  question: string;
  answer: string;
  /** "ai": streamed from /api/ask. "keyword": the instant answer from this page's content. */
  source: "ai" | "keyword";
  status: "waiting" | "streaming" | "done";
  /** Shown above a keyword answer, to say why the AI didn't answer. */
  note?: string;
  links: LinkData[];
  /** Retrieved passages, numbered as the model cites them. */
  passages: { n: number; title: string; href: string }[];
  meta?: string;
}

/** Questions per page view. The server has its own limits; this one keeps the chat a chat. */
const MAX_QUESTIONS = 12;

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const query = matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/** Types the answer out, unless the visitor prefers reduced motion. */
function Typed({ id, text, onDone }: { id: number; text: string; onDone: (id: number) => void }) {
  const reduced = useSyncExternalStore(subscribeMotion, () => matchMedia(motionQuery).matches, () => true);
  const [count, setCount] = useState(0);
  const shown = reduced ? text.length : count;

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setCount((value) => Math.min(text.length, value + 3)), 14);
    return () => clearInterval(id);
  }, [reduced, text]);

  const done = shown >= text.length;
  useEffect(() => {
    if (done) onDone(id);
  }, [done, id, onDone]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.slice(0, shown)}
        {done ? null : <Caret />}
      </span>
    </>
  );
}

const Caret = () => (
  <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-[blink_1s_steps(1)_infinite] bg-accent" />
);

const chip =
  "inline-flex items-center rounded-full border border-line-strong px-3 py-1 text-xs font-medium text-fg transition-colors hover:border-accent hover:text-accent-ink";

function AnswerLink({ label, href }: LinkData) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={chip} {...(href.endsWith(".pdf") ? { target: "_blank" } : {})}>
        {label}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a href={href} className={chip} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {label}
    </a>
  );
}

const CITATION = /\[(\d{1,2}(?:\s*,\s*\d{1,2})*)\]/g;

/** The model's plain text, with [n] citations turned into links to the cited passage. */
function AiText({ text, passages }: { text: string; passages: Message["passages"] }) {
  const byNumber = new Map(passages.map((passage) => [passage.n, passage]));
  return text.split(/\n{2,}/).map((paragraph, p) => (
    <p key={p} className="whitespace-pre-line">
      {paragraph.split(CITATION).map((part, index) => {
        if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;
        return part.split(",").map((value) => {
          const passage = byNumber.get(Number(value.trim()));
          return passage ? (
            <Link
              key={`${index}-${value}`}
              href={passage.href}
              title={passage.title}
              className="ml-0.5 align-super font-mono text-[0.65rem] text-accent-ink hover:underline"
            >
              {passage.n}
            </Link>
          ) : null;
        });
      })}
    </p>
  ));
}

/** The cited passages, one chip per page they live on. */
function citedLinks(text: string, passages: Message["passages"]): LinkData[] {
  const cited = new Set([...text.matchAll(CITATION)].flatMap((match) => match[1].split(",").map((n) => Number(n.trim()))));
  const links = new Map<string, LinkData>();
  for (const passage of passages) {
    if (cited.has(passage.n) && !links.has(passage.href)) {
      links.set(passage.href, { label: passage.title.split(":")[0], href: passage.href });
    }
  }
  return [...links.values()];
}

const modelLabel = (model: string) =>
  model
    .split("/")
    .pop()!
    .replace(/-(\d+)[.-](\d+)$/, " $1.$2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

/**
 * A chat box answered by an LLM over this site's content (retrieval-augmented, with citations).
 * When the AI is off, busy or rate-limited, it answers from the page by keyword instead.
 */
export function Ask({ locale, entries, fallback, copy }: AskProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedUpTo, setTypedUpTo] = useState(0);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const asked = useRef<string[]>([]);
  const nextKey = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef<AbortController | null>(null);
  const markTyped = useCallback((key: number) => setTypedUpTo((up) => Math.max(up, key)), []);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [messages, typedUpTo]);

  useEffect(() => () => inFlight.current?.abort(), []);

  const update = (key: number, change: (message: Message) => Partial<Message>) =>
    setMessages((previous) => previous.map((message) => (message.key === key ? { ...message, ...change(message) } : message)));

  function keywordAnswer(question: string, note?: string): Partial<Message> {
    const match = matchIntent(question, entries);
    const reply = match ? match.intent : fallback;
    return { source: "keyword", status: "done", answer: reply.answer, links: reply.links, note, passages: [], meta: undefined };
  }

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    const key = nextKey.current++;
    const history = asked.current.slice(-3);
    asked.current.push(trimmed);
    setValue("");
    const message: Message = { key, question: trimmed, answer: "", source: "ai", status: "waiting", links: [], passages: [] };

    if (asked.current.length > MAX_QUESTIONS) {
      setMessages((previous) => [...previous.slice(-3), { ...message, ...keywordAnswer(trimmed, copy.limit) }]);
      return;
    }
    setMessages((previous) => [...previous.slice(-3), message]);
    setBusy(true);
    const controller = new AbortController();
    inFlight.current = controller;

    let answer = "";
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed.slice(0, 300), history, locale }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        update(key, () => keywordAnswer(trimmed, response.status === 429 ? copy.tooFast : copy.quickAnswer));
        return;
      }
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      let finished = false;
      while (!finished) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as AskEvent;
          if (event.type === "meta") {
            const meta = event.model
              ? `${modelLabel(event.model)} · ${event.mode === "hybrid" ? "hybrid RAG" : "lexical RAG"} · ${event.sources.length} ${copy.sources.toLowerCase()}`
              : undefined;
            update(key, () => ({ passages: event.sources, meta, status: "streaming" }));
          } else if (event.type === "text") {
            answer += event.text;
            const text = answer;
            update(key, () => ({ answer: text }));
          } else if (event.type === "done") {
            const text = answer;
            update(key, (current) => ({ status: "done", links: citedLinks(text, current.passages) }));
            finished = true;
          } else if (event.type === "error") {
            if (event.reason === "blocked" || !answer) update(key, () => keywordAnswer(trimmed, copy.quickAnswer));
            else update(key, () => ({ status: "done", note: copy.cut }));
            finished = true;
          }
        }
      }
      if (!finished) {
        if (answer) update(key, () => ({ status: "done", note: copy.cut }));
        else update(key, () => keywordAnswer(trimmed, copy.quickAnswer));
      }
    } catch {
      if (!controller.signal.aborted) update(key, () => keywordAnswer(trimmed, copy.quickAnswer));
    } finally {
      if (inFlight.current === controller) inFlight.current = null;
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(value);
  }

  function clear() {
    inFlight.current?.abort();
    setMessages([]);
  }

  return (
    <div className="relative rounded-2xl border border-line-strong bg-surface/80 shadow-card backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <p className="kicker flex items-center gap-2 text-muted">
          <Sparkles size={14} className="text-accent-ink" aria-hidden />
          {copy.title}
        </p>
        {messages.length ? (
          <button
            type="button"
            onClick={clear}
            className="rounded-full px-2 py-1 text-xs text-subtle transition-colors hover:text-fg"
          >
            {copy.clear}
          </button>
        ) : null}
      </div>

      <div
        ref={logRef}
        aria-live="polite"
        aria-busy={busy}
        className={`overflow-y-auto px-5 transition-[max-height] ${messages.length ? "max-h-96 py-4" : "max-h-0"}`}
      >
        <ol className="space-y-4">
          {messages.map((message) => (
            <li key={message.key} className="space-y-3">
              <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm text-fg">
                <span className="sr-only">{copy.you}: </span>
                {message.question}
              </p>
              <div className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-fg font-mono text-[0.6rem] font-bold text-bg"
                >
                  LN
                </span>
                <div className="min-w-0 flex-1 space-y-3">
                  {message.note ? <p className="text-xs text-subtle">{message.note}</p> : null}
                  {message.source === "keyword" ? (
                    <p className="text-sm/relaxed text-muted">
                      <Typed id={message.key} text={message.answer} onDone={markTyped} />
                    </p>
                  ) : message.status === "waiting" || (message.status === "streaming" && !message.answer) ? (
                    <p className="flex items-center gap-2 text-sm text-subtle">
                      <span className="flex gap-1" aria-hidden>
                        {[0, 1, 2].map((dot) => (
                          <span
                            key={dot}
                            className="size-1.5 rounded-full bg-accent motion-safe:animate-[blink_1s_steps(1)_infinite]"
                            style={{ animationDelay: `${dot * 0.2}s` }}
                          />
                        ))}
                      </span>
                      {copy.thinking}
                    </p>
                  ) : (
                    <div className="space-y-2 text-sm/relaxed text-muted">
                      <AiText text={message.answer} passages={message.passages} />
                      {message.status === "streaming" ? <Caret /> : null}
                    </div>
                  )}
                  {(message.source === "ai" ? message.status === "done" : typedUpTo >= message.key) &&
                  message.links.length ? (
                    <div className="flex flex-wrap gap-2">
                      {message.links.map((link) => (
                        <AnswerLink key={link.href + link.label} {...link} />
                      ))}
                    </div>
                  ) : null}
                  {message.meta && message.status === "done" ? (
                    <p className="font-mono text-[0.65rem] tracking-wide text-subtle">{message.meta}</p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line p-2.5 pl-4">
        <label htmlFor="ask-input" className="sr-only">
          {copy.inputLabel}
        </label>
        <input
          id="ask-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={copy.placeholder}
          autoComplete="off"
          enterKeyHint="send"
          maxLength={300}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-fg placeholder:text-subtle focus:outline-none"
        />
        <button
          type="submit"
          aria-label={copy.submit}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent transition-[filter,background-color,color] hover:brightness-110 disabled:bg-surface-2 disabled:text-subtle disabled:hover:brightness-100"
          disabled={!value.trim() || busy}
        >
          <CornerDownLeft size={16} />
        </button>
      </form>

      <div className="px-4 pb-4">
        <ul className="flex flex-wrap gap-2">
          {copy.suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => void ask(suggestion)}
                disabled={busy}
                className="rounded-full border border-line bg-surface-2/70 px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg disabled:opacity-60"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.7rem]/relaxed text-subtle">{copy.disclaimer}</p>
        <details className="group mt-2 text-[0.7rem]/relaxed text-subtle">
          <summary className="cursor-pointer list-none text-accent-ink hover:underline [&::-webkit-details-marker]:hidden">
            {copy.howItWorks}
          </summary>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            {copy.pipeline.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </details>
      </div>
    </div>
  );
}
