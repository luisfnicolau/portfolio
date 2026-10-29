import { describe, expect, it } from "vitest";
import { preferredLocale } from "@/lib/language";

describe("preferredLocale", () => {
  it("follows the browser's first choice between Portuguese and English", () => {
    expect(preferredLocale("pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7", "US")).toBe("pt");
    expect(preferredLocale("en-US,en;q=0.9,pt-BR;q=0.8", "BR")).toBe("en");
  });

  it("ranks by q-value, not by position", () => {
    expect(preferredLocale("en;q=0.5,pt;q=0.8", null)).toBe("pt");
  });

  it("skips other languages before deciding", () => {
    expect(preferredLocale("es-ES,es;q=0.9,pt;q=0.5", "US")).toBe("pt");
    expect(preferredLocale("fr-FR,en;q=0.5", "BR")).toBe("en");
  });

  it("falls back to the IP country, then English", () => {
    expect(preferredLocale("es-ES,es;q=0.9", "BR")).toBe("pt");
    expect(preferredLocale("*", "pt")).toBe("pt");
    expect(preferredLocale("es-ES", "US")).toBe("en");
    expect(preferredLocale(null, null)).toBe("en");
  });

  it("ignores languages refused with q=0", () => {
    expect(preferredLocale("pt;q=0,en;q=0.5", "BR")).toBe("en");
  });
});
