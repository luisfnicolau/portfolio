// Captures the product screenshots used on project cards and case-study pages.
//
//   node scripts/capture-screenshots.mjs            # every shot
//   node scripts/capture-screenshots.mjs medha lore # only these
//
// Shots are taken at 1440×900 CSS px, 2× density, dark color scheme, then saved as
// WebP in src/assets/work/. Pick pages without third-party content in view (the
// OlhoNaLei home has a live political news sidebar, so a bill page is used instead).
//
// A site that has both languages gets `languages: true`: it is captured once with an English
// browser and once with a Brazilian one (`<name>-en.webp`, `<name>-pt.webp`), and each page of
// the portfolio shows its own language. Give `urls: { en, pt }` when the site switches by URL
// instead of by browser language. Every other site is captured once (`<name>.webp`).
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "src", "assets", "work");

const SHOTS = [
  { name: "olhonalei", url: "https://www.olhonalei.com/proposicoes/plp-68-2024-camara" },
  { name: "medha", url: "https://medha.app", languages: true },
  { name: "lore", url: "https://lorememory.ai" },
  { name: "outpost", url: "https://outpost.lunico.dev" },
  { name: "chamego", url: "https://www.chamego.app" },
  { name: "paneleiros", url: "https://www.paneleiros.com" },
  { name: "sensecomment", url: "https://www.sensecomment.com" },
  { name: "agendinha", url: "https://agendinha-cliente.vercel.app/salon/demo/atelie" },
];

const only = new Set(process.argv.slice(2));
const todo = only.size ? SHOTS.filter((s) => only.has(s.name)) : SHOTS;
if (todo.length === 0) {
  console.error(`No shot named ${[...only].join(", ")}. Known: ${SHOTS.map((s) => s.name).join(", ")}`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const browserLocale = { en: "en-US", pt: "pt-BR" };

for (const shot of todo) {
  const variants = shot.languages
    ? ["en", "pt"].map((language) => ({ language, file: `${shot.name}-${language}`, url: shot.urls?.[language] ?? shot.url }))
    : [{ language: "pt", file: shot.name, url: shot.url }];
  for (const variant of variants) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: "dark",
      locale: browserLocale[variant.language],
    });
    const page = await context.newPage();
    try {
      await page.goto(variant.url, { waitUntil: "networkidle", timeout: 45_000 });
    } catch (error) {
      console.warn(`${variant.file}: page did not go idle (${error.message.split("\n")[0]}), capturing anyway`);
    }
    await page.waitForTimeout(2_500);
    const png = await page.screenshot(shot.clip ? { clip: shot.clip } : {});
    const info = await sharp(png)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(join(OUT, `${variant.file}.webp`));
    console.log(`${variant.file}: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`);
    await context.close();
  }
}

await browser.close();
