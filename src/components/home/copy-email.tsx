"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyEmail({ email, label, copiedLabel }: { email: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked: the mailto button next to this one still works.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-5 text-sm font-semibold transition-colors hover:border-fg/40 hover:bg-surface"
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
      {copied ? <Check size={16} aria-hidden className="text-ok" /> : <Copy size={16} aria-hidden />}
    </button>
  );
}
