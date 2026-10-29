import { expect, test, type Page } from "@playwright/test";

// Pages are discovered from the sitemap, which is generated from the content; the unit tests check
// that the sitemap lists every project in both languages.

/** Fails the test on any console error or uncaught exception. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  // WebKit reports a link prefetch cut off by the next navigation as an "access control" error.
  const cancelledPrefetch = /_rsc=.* due to access control checks/;
  page.on("console", (message) => {
    if (message.type() === "error" && !cancelledPrefetch.test(message.text())) errors.push(message.text());
  });
  page.on("pageerror", (error) => {
    if (!cancelledPrefetch.test(error.message)) errors.push(error.message);
  });
  return errors;
}

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, `horizontal overflow on ${page.url()}`).toBeLessThanOrEqual(0);
}

test.describe("home", () => {
  test("English home renders every section and project", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("I build whole products");
    for (const id of ["about", "work", "labs", "experience", "how-i-work", "skills", "background", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    expect(await page.locator('main a[href^="/work/"]').count()).toBeGreaterThanOrEqual(9);
    await expectNoHorizontalScroll(page);
    expect(errors).toEqual([]);
  });

  test("Portuguese home is in Portuguese", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/pt");
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Construo produtos inteiros");
    await expect(page.locator(`a[href="/pt/work/olhonalei"]`).first()).toBeAttached();
    await expectNoHorizontalScroll(page);
    expect(errors).toEqual([]);
  });

  test("language switch keeps the page", async ({ page }) => {
    await page.goto("/work/medha");
    await page.locator('header a[hreflang="pt-BR"]').click();
    await expect(page).toHaveURL(/\/pt\/work\/medha$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  });

  test("theme toggle switches and remembers", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");
  });

  test("Ask streams an AI answer with cited sources", async ({ page }) => {
    // The model is mocked: this checks the page's side of the /api/ask protocol, for free.
    let sent: Record<string, unknown> = {};
    await page.route("**/api/ask", async (route) => {
      sent = route.request().postDataJSON();
      const events = [
        {
          type: "meta",
          model: "anthropic/claude-haiku-5.5",
          mode: "hybrid",
          sources: [
            { n: 1, title: "Quick facts, availability and contact", href: "/#contact" },
            { n: 2, title: "OlhoNaLei: highlights and stack", href: "/work/olhonalei" },
          ],
        },
        { type: "text", text: "Luis took the search path from ~1.85 s to ~8 ms " },
        { type: "text", text: "on PostgreSQL + pgvector [2]." },
        { type: "done" },
      ];
      await route.fulfill({
        contentType: "application/x-ndjson",
        body: events.map((event) => JSON.stringify(event)).join("\n") + "\n",
      });
    });
    await page.goto("/");
    await page.getByLabel("Your question").fill("how fast is the vector search?");
    await page.getByLabel("Your question").press("Enter");
    const log = page.locator('[aria-live="polite"]').first();
    await expect(log.getByText("~1.85 s to ~8 ms")).toBeVisible();
    await expect(log.getByRole("link", { name: "2", exact: true })).toHaveAttribute("href", "/work/olhonalei");
    await expect(log.getByRole("link", { name: "OlhoNaLei" })).toHaveAttribute("href", "/work/olhonalei");
    await expect(log.getByText("Claude Haiku 5.5 · hybrid RAG · 2 passages")).toBeVisible();
    expect(sent).toMatchObject({ question: "how fast is the vector search?", history: [], locale: "en" });
  });

  test("Ask falls back to instant answers when the AI is unavailable", async ({ page }) => {
    await page.route("**/api/ask", (route) => route.fulfill({ status: 503, json: { error: "disabled" } }));
    await page.goto("/");
    await page.getByRole("button", { name: "Are you available?" }).click();
    const log = page.locator('[aria-live="polite"]').first();
    await expect(log.getByText("The AI chat is unavailable right now")).toBeVisible();
    await expect(log.getByText("full-time or contract roles, remote from Campo Grande").first()).toBeVisible();
    await expect(log.getByText("hybrid RAG")).toHaveCount(0);
    await page.getByLabel("Your question").fill("how fast is the vector search?");
    await page.getByLabel("Your question").press("Enter");
    await expect(log.getByText("~1,850").first()).toBeVisible();
    await expect(log.getByRole("link", { name: "OlhoNaLei" })).toHaveAttribute("href", "/work/olhonalei");
  });
});

test.describe("project pages", () => {
  test("every page in the sitemap renders cleanly", async ({ page, request }) => {
    test.slow();
    const errors = watchErrors(page);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const paths = [...sitemap.matchAll(/<loc>https:\/\/lunico\.dev([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
    expect(paths.length).toBeGreaterThanOrEqual(20);
    for (const path of paths) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }), path).not.toBeEmpty();
      await expect(page, path).toHaveTitle(/Luis Nicolau/);
      await expectNoHorizontalScroll(page);
    }
    expect(errors).toEqual([]);
  });

  test("a product with both languages shows its screenshot in the page's language", async ({ page }) => {
    await page.goto("/work/medha");
    const english = page.getByRole("img", { name: /A second brain that stays yours/ }).first();
    await expect(english).toBeVisible();
    const englishSrc = await english.getAttribute("src");
    await page.goto("/pt/work/medha");
    const portuguese = page.getByRole("img", { name: /Um segundo cérebro que continua seu/ }).first();
    await expect(portuguese).toBeVisible();
    expect(await portuguese.getAttribute("src")).not.toBe(englishSrc);
  });

  test("unknown project is a real 404 in both languages", async ({ page }) => {
    for (const path of ["/work/does-not-exist", "/pt/work/does-not-exist"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.getByText("Esta página não existe.")).toBeVisible();
    }
  });
});

test.describe("files and metadata", () => {
  test("unmatched URL shows the bilingual 404", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("Esta página não existe.")).toBeVisible();
  });

  test("CV PDFs are served", async ({ request }) => {
    for (const lang of ["en", "pt"]) {
      const response = await request.get(`/cv/luis-nicolau-full-stack-cv-${lang}.pdf`);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/pdf");
    }
  });

  test("social card and canonical metadata point to real images", async ({ page, request }) => {
    await page.goto("/work/olhonalei");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://lunico.dev/work/olhonalei");
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute(
      "href",
      "https://lunico.dev/pt/work/olhonalei",
    );
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image).toBeTruthy();
    const response = await request.get(new URL(image!).pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
  });

  test("robots.txt points at the sitemap", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toContain("Sitemap: https://lunico.dev/sitemap.xml");
  });
});

// Data bars must show their true length with animations on: a scroll-linked animation once left
// them at ~3% (their rounded track has overflow: hidden, which counts as a scroll container).
test.describe("charts, with motion", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("skill and benchmark bars are drawn to scale", async ({ page }) => {
    await page.goto("/");
    const skills = page.locator("#skills li:has(> div[aria-hidden]) > div[aria-hidden] > div");
    await skills.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const ratios = await skills.evaluateAll((bars) =>
      bars.map((bar) => bar.getBoundingClientRect().width / bar.parentElement!.getBoundingClientRect().width),
    );
    // Node.js and SQL are ~10 years, C#/.NET since 2025 (1.5 on the 10-year scale).
    expect(ratios[0]).toBeGreaterThan(0.97);
    expect(ratios.at(-1)).toBeGreaterThan(0.12);

    await page.goto("/work/olhonalei");
    const after = page.locator('section[aria-labelledby="benchmarks"] dl > div:last-child div[aria-hidden] > div');
    await after.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const latency = await after.evaluateAll((bars) =>
      bars.map((bar) => bar.getBoundingClientRect().width / bar.parentElement!.getBoundingClientRect().width),
    );
    // ~0.55 s of ~1.49 s end to end: about 37% of the "before" bar.
    expect(latency[2]).toBeGreaterThan(0.33);
    expect(latency[2]).toBeLessThan(0.41);
  });
});

test.describe("language detection", () => {
  test.describe("in a Portuguese browser", () => {
    test.use({ locale: "pt-BR" });

    test("lands on Portuguese, and a switch to English sticks", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/pt$/);
      await page.goto("/work/medha");
      await expect(page).toHaveURL(/\/pt\/work\/medha$/);

      await page.locator('header a[hreflang="en"]').click();
      await expect(page).toHaveURL(/\/work\/medha$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });
  });

  test("an English browser keeps the URL it opened, /pt included", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.goto("/pt/work/medha");
    await expect(page).toHaveURL(/\/pt\/work\/medha$/);
  });
});
