"use client";

import { CornerDownLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { matchIntent } from "@/lib/ask";

export interface AskEntry {
  id: string;
  keywords: string[];
  answer: string;
  links: { label: string; href: string }[];
}

interface AskProps {
  entries: AskEntry[];
  fallback: Omit<AskEntry, "id" | "keywords">;
  copy: {
    title: string;
    inputLabel: string;
    placeholder: string;
    submit: string;
    clear: string;
    you: string;
    disclaimer: string;
    suggestions: string[];
  };
}

interface Message {
  key: number;
  question: string;
  answer: string;
  links: { label: string; href: string }[];
}

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
        {done ? null : <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-[blink_1s_steps(1)_infinite] bg-accent" />}
      </span>
    </>
  );
}

function AnswerLink({ label, href }: { label: string; href: string }) {
  const className =
    "inline-flex items-center rounded-full border border-line-strong px-3 py-1 text-xs font-medium text-fg transition-colors hover:border-accent hover:text-accent-ink";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} {...(href.endsWith(".pdf") ? { target: "_blank" } : {})}>
        {label}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {label}
    </a>
  );
}

/** A chat-style box that answers from the page's own content, by keyword. No LLM involved. */
export function Ask({ entries, fallback, copy }: AskProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedUpTo, setTypedUpTo] = useState(0);
  const [value, setValue] = useState("");
  const nextKey = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const markTyped = useCallback((key: number) => setTypedUpTo((up) => Math.max(up, key)), []);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [messages, typedUpTo]);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    const match = matchIntent(trimmed, entries);
    const reply = match ? match.intent : fallback;
    const key = nextKey.current++;
    setMessages((previous) => [...previous.slice(-2), { key, question: trimmed, answer: reply.answer, links: reply.links }]);
    setValue("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(value);
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
            onClick={() => setMessages([])}
            className="rounded-full px-2 py-1 text-xs text-subtle transition-colors hover:text-fg"
          >
            {copy.clear}
          </button>
        ) : null}
      </div>

      <div
        ref={logRef}
        aria-live="polite"
        className={`overflow-y-auto px-5 transition-[max-height] ${messages.length ? "max-h-80 py-4" : "max-h-0"}`}
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
                <div className="min-w-0 space-y-3">
                  <p className="text-sm/relaxed text-muted">
                    <Typed id={message.key} text={message.answer} onDone={markTyped} />
                  </p>
                  {typedUpTo >= message.key && message.links.length ? (
                    <div className="flex flex-wrap gap-2">
                      {message.links.map((link) => (
                        <AnswerLink key={link.href + link.label} {...link} />
                      ))}
                    </div>
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
          maxLength={200}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-fg placeholder:text-subtle focus:outline-none"
        />
        <button
          type="submit"
          aria-label={copy.submit}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent transition-[filter,background-color,color] hover:brightness-110 disabled:bg-surface-2 disabled:text-subtle disabled:hover:brightness-100"
          disabled={!value.trim()}
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
                onClick={() => ask(suggestion)}
                className="rounded-full border border-line bg-surface-2/70 px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.7rem]/relaxed text-subtle">{copy.disclaimer}</p>
      </div>
    </div>
  );
}
