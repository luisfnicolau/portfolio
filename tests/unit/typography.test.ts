import { describe, expect, it } from "vitest";
import { tidy } from "@/lib/typography";

describe("tidy", () => {
  it("keeps numbers with their units", () => {
    expect(tidy("from ~1.49 s to ~0.55 s.")).toBe("from ~1.49 s to ~0.55 s.");
    expect(tidy("1.3 GB, 69 MB and 8 ms")).toBe("1.3 GB, 69 MB and 8 ms");
  });

  it("never lets a line start with an arrow", () => {
    expect(tidy("1.3 GB → 69 MB")).toBe("1.3 GB → 69 MB");
  });

  it("leaves ordinary words alone", () => {
    expect(tidy("2 services and 3 sites")).toBe("2 services and 3 sites");
  });
});
