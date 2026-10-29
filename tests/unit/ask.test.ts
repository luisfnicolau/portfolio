import { describe, expect, it } from "vitest";
import { intents } from "@/content/ask";
import { getDictionary } from "@/content/ui";
import { matchIntent, normalize } from "@/lib/ask";

const ask = (question: string) => matchIntent(question, intents)?.intent.id ?? null;

describe("normalize", () => {
  it("drops accents, case and punctuation", () => {
    expect(normalize("Otimização mais RÁPIDA?")).toBe("otimizacao mais rapida");
  });
  it("keeps tech names like next.js, .net and c#", () => {
    expect(normalize("Next.js, .NET e C#!")).toBe("next.js .net e c#");
  });
});

describe("suggestion chips", () => {
  const expected = ["projects", "performance", "ai", "agents", "availability"];
  it.each(["en", "pt"] as const)("every %s chip lands on its intent", (locale) => {
    expect(getDictionary(locale).ask.suggestions.map(ask)).toEqual(expected);
  });
});

describe("matchIntent", () => {
  it.each([
    ["Are you open to contract work?", "availability"],
    ["What's your email?", "contact"],
    ["Can I download your resume?", "cv"],
    ["How did you build Medha?", "medha"],
    ["Tell me about OlhoNaLei", "olhonalei"],
    ["the baby monitor app", "chamego"],
    ["The Contract Network", "tcn"],
    ["How do you work?", "principles"],
    ["monitoring in production", "reliability"],
    ["Do you speak English?", "spoken-languages"],
    ["What programming languages do you use?", "stack"],
    ["What time zone are you in?", "location"],
    ["push notifications at scale", "paneleiros"],
    ["Who are you?", "who"],
    ["hello", "greeting"],
    ["Qual sua experiência?", "experience"],
    ["Você fala inglês?", "spoken-languages"],
    ["Onde você mora?", "location"],
  ])("%s → %s", (question, id) => {
    expect(ask(question)).toBe(id);
  });

  it("tolerates a typo", () => {
    expect(ask("experiance")).toBe("experience");
    expect(ask("are you availible")).toBe("availability");
  });

  it("returns nothing for empty or unrelated input", () => {
    expect(ask("")).toBeNull();
    expect(ask("   ?! ")).toBeNull();
    expect(ask("zxcvb qwerty")).toBeNull();
  });
});
