import { expect, test, type Page } from "@playwright/test";

// Pages are discovered from the sitemap, which is generated from the content; the unit tests check
// that the sitemap lists every project in both languages.

/** Fails the test on any console error or uncaught exception. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
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

  test("Ask answers a suggestion and a typed question", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Are you available?" }).click();
    await expect(page.getByText("full-time or contract roles, remote from Campo Grande").first()).toBeVisible();
    await page.getByLabel("Your question").fill("how fast is the vector search?");
    await page.getByLabel("Your question").press("Enter");
    const log = page.locator('[aria-live="polite"]').first();
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
